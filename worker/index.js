import { GoogleGenAI } from '@google/genai';

const INGREDIENT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Short, user-friendly singular ingredient name without preparation details.' },
    cooked: {
      type: 'object',
      properties: {
        kcal: { type: 'number' }, protein: { type: 'number' }, carbs: { type: 'number' }, fat: { type: 'number' }
      },
      required: ['kcal', 'protein', 'carbs', 'fat']
    },
    raw: {
      type: 'object',
      properties: {
        kcal: { type: 'number' }, protein: { type: 'number' }, carbs: { type: 'number' }, fat: { type: 'number' }
      },
      required: ['kcal', 'protein', 'carbs', 'fat']
    },
    sourceUrls: { type: 'array', items: { type: 'string' } }
  },
  required: ['name', 'cooked', 'raw', 'sourceUrls']
};

async function ensureSchema(env) {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, name_norm TEXT NOT NULL UNIQUE,
      kcal REAL NOT NULL, protein REAL NOT NULL, carbs REAL NOT NULL, fat REAL NOT NULL,
      raw_kcal REAL, raw_protein REAL, raw_carbs REAL, raw_fat REAL,
      sources_json TEXT NOT NULL, created_at TEXT NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS contribution_limits (
      visitor_hash TEXT NOT NULL, day TEXT NOT NULL, request_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (visitor_hash, day)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS ingredient_candidates (
      token TEXT PRIMARY KEY, candidate_json TEXT NOT NULL, expires_at TEXT NOT NULL
    )`)
  ]);
}

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function cleanText(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 1000 ? Math.round(number * 10) / 10 : null;
}

function normalizeCandidate(input) {
  const name = cleanText(input && input.name, 80);
  const cooked = input && input.cooked || {};
  const raw = input && input.raw || {};
  const result = {
    name,
    cooked: { kcal:cleanNumber(cooked.kcal), protein:cleanNumber(cooked.protein), carbs:cleanNumber(cooked.carbs), fat:cleanNumber(cooked.fat) },
    raw: { kcal:cleanNumber(raw.kcal), protein:cleanNumber(raw.protein), carbs:cleanNumber(raw.carbs), fat:cleanNumber(raw.fat) },
    sourceUrls: Array.isArray(input && input.sourceUrls) ? input.sourceUrls.filter(function(url){
      try { return new URL(url).protocol === 'https:'; } catch { return false; }
    }).slice(0, 5) : []
  };
  if (!result.name || Object.values(result.cooked).some(function(v){ return v === null; }) ||
      Object.values(result.raw).some(function(v){ return v === null; }) || !result.sourceUrls.length) return null;
  return result;
}

async function visitorHash(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(ip + ':' + day);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return { hash:Array.from(new Uint8Array(digest)).map(function(b){ return b.toString(16).padStart(2, '0'); }).join(''), day };
}

async function useSearchAllowance(request, env) {
  const visitor = await visitorHash(request);
  await env.DB.prepare(`INSERT INTO contribution_limits (visitor_hash, day, request_count) VALUES (?, ?, 1)
    ON CONFLICT(visitor_hash, day) DO UPDATE SET request_count = request_count + 1`)
    .bind(visitor.hash, visitor.day).run();
  const row = await env.DB.prepare('SELECT request_count FROM contribution_limits WHERE visitor_hash = ? AND day = ?')
    .bind(visitor.hash, visitor.day).first();
  return Number(row && row.request_count || 0) <= 10;
}

async function listIngredients(env) {
  await ensureSchema(env);
  const result = await env.DB.prepare('SELECT * FROM ingredients ORDER BY name COLLATE NOCASE').all();
  return json({ ingredients:(result.results || []).map(function(row){
    return { id:row.id, name:row.name, kcal:row.kcal, p:row.protein, c:row.carbs, f:row.fat,
      raw:{ kcal:row.raw_kcal, p:row.raw_protein, c:row.raw_carbs, f:row.raw_fat }, sources:JSON.parse(row.sources_json || '[]') };
  }) }, { headers:{ 'Cache-Control':'public, max-age=60' } });
}

async function searchIngredient(request, env) {
  await ensureSchema(env);
  if (!env.GEMINI_API_KEY) return json({ error:'Ingredient search is temporarily unavailable.' }, { status:503 });
  if (!await useSearchAllowance(request, env)) return json({ error:'Daily search limit reached. Please try again tomorrow.' }, { status:429 });
  const body = await request.json();
  const query = cleanText(body && body.query, 80);
  if (query.length < 2) return json({ error:'Enter at least two characters.' }, { status:400 });
  const existing = await env.DB.prepare('SELECT name FROM ingredients WHERE name_norm = ?').bind(query.toLowerCase()).first();
  if (existing) return json({ error:existing.name + ' is already in the shared list.' }, { status:409 });

  const ai = new GoogleGenAI({ apiKey:env.GEMINI_API_KEY });
  let interaction;
  try {
    interaction = await ai.interactions.create({
      model:'gemini-2.5-flash',
      input:`Find reliable nutritional information for the basic ingredient "${query}". Return cooked and raw or uncooked values per 100g, not per serving. Prefer government, recognised nutrition databases, or manufacturer sources. Do not return a recipe or complete meal. Use a short clean ingredient name. Include the exact source URLs used.`,
      tools:[{ type:'google_search' }],
      response_format:{ type:'text', mime_type:'application/json', schema:INGREDIENT_SCHEMA }
    });
  } catch (error) {
    const upstreamStatus = Number(error && error.status) || 502;
    const diagnostic = cleanText(error && error.message, 180).replace(/key=[^&\s]+/gi, 'key=[redacted]');
    console.error(JSON.stringify({ message:'Gemini ingredient search failed', upstreamStatus, diagnostic }));
    return json({ error:'Google ingredient search failed.', upstreamStatus, diagnostic }, { status:502 });
  }
  let parsed;
  try { parsed = JSON.parse(interaction.output_text); } catch { return json({ error:'Google search did not return usable nutrition data.' }, { status:502 }); }
  const candidate = normalizeCandidate(parsed);
  if (!candidate) return json({ error:'The result was incomplete. Try a more specific ingredient name.' }, { status:422 });
  const confirmationToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM ingredient_candidates WHERE expires_at < ?').bind(new Date().toISOString()),
    env.DB.prepare('INSERT INTO ingredient_candidates (token, candidate_json, expires_at) VALUES (?, ?, ?)')
      .bind(confirmationToken, JSON.stringify(candidate), expiresAt)
  ]);
  return json({ candidate, confirmationToken });
}

async function publishIngredient(request, env) {
  await ensureSchema(env);
  const body = await request.json();
  const confirmationToken = cleanText(body && body.confirmationToken, 80);
  if (!confirmationToken) return json({ error:'Run the ingredient search again before confirming.' }, { status:400 });
  const pending = await env.DB.prepare('SELECT candidate_json, expires_at FROM ingredient_candidates WHERE token = ?')
    .bind(confirmationToken).first();
  if (!pending || pending.expires_at < new Date().toISOString()) {
    return json({ error:'This result has expired. Run the search again.' }, { status:410 });
  }
  let candidate;
  try { candidate = normalizeCandidate(JSON.parse(pending.candidate_json)); } catch { candidate = null; }
  if (!candidate) return json({ error:'Ingredient details are incomplete.' }, { status:400 });
  const id = 'shared_' + crypto.randomUUID();
  try {
    await env.DB.prepare(`INSERT INTO ingredients
      (id,name,name_norm,kcal,protein,carbs,fat,raw_kcal,raw_protein,raw_carbs,raw_fat,sources_json,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(id,candidate.name,candidate.name.toLowerCase(),candidate.cooked.kcal,candidate.cooked.protein,candidate.cooked.carbs,candidate.cooked.fat,
        candidate.raw.kcal,candidate.raw.protein,candidate.raw.carbs,candidate.raw.fat,JSON.stringify(candidate.sourceUrls),new Date().toISOString()).run();
    await env.DB.prepare('DELETE FROM ingredient_candidates WHERE token = ?').bind(confirmationToken).run();
  } catch (error) {
    if (String(error).toLowerCase().includes('unique')) return json({ error:'This ingredient is already in the shared list.' }, { status:409 });
    throw error;
  }
  return json({ ingredient:{ id,name:candidate.name,kcal:candidate.cooked.kcal,p:candidate.cooked.protein,c:candidate.cooked.carbs,f:candidate.cooked.fat,
    raw:{kcal:candidate.raw.kcal,p:candidate.raw.protein,c:candidate.raw.carbs,f:candidate.raw.fat},sources:candidate.sourceUrls } }, { status:201 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/health') {
        return Response.json({
          ok: true,
          release: 'ingredients-v2',
          databaseConfigured: Boolean(env.DB),
          geminiConfigured: Boolean(env.GEMINI_API_KEY)
        });
      }

      if (url.pathname === '/api/ingredients' && request.method === 'GET') return await listIngredients(env);
      if (url.pathname === '/api/ingredients/search' && request.method === 'POST') return await searchIngredient(request, env);
      if (url.pathname === '/api/ingredients' && request.method === 'POST') return await publishIngredient(request, env);

      if (url.pathname.startsWith('/api/')) {
        return Response.json({ error: 'Not found' }, { status: 404 });
      }

      return await env.ASSETS.fetch(request);
    } catch (error) {
      console.error(JSON.stringify({
        message: 'request failed',
        path: url.pathname,
        error: error instanceof Error ? error.message : String(error)
      }));
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
};
