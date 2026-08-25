/* ================= utilities ================= */
function uid(){ return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function pad2(n){ return String(n).padStart(2,'0'); }
function isoFromDate(d){ return d.getFullYear() + '-' + pad2(d.getMonth()+1) + '-' + pad2(d.getDate()); }
function todayISO(){ return isoFromDate(new Date()); }
function addDaysISO(iso, n){ var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return isoFromDate(d); }
function formatDateLong(iso){
  var d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
}
function formatDateShort(iso){
  var d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function isToday(iso){ return iso === todayISO(); }
function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }
function round(n){ return Math.round(n); }
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}
function debounce(fn, ms){
  var t = null;
  return function(){
    var args = arguments;
    clearTimeout(t);
    t = setTimeout(function(){ fn.apply(null, args); }, ms);
  };
}
function displayWeight(kg){
  if (kg == null) return '';
  return Math.round(kg*10)/10;
}

var FOODS_DB = [
  {id:'f_chicken_breast', name:'Grilled chicken breast', serving:'150g', kcal:248, p:47, c:0, f:5},
  {id:'f_scrambled_eggs', name:'Scrambled eggs (2 eggs)', serving:'2 eggs', kcal:182, p:13, c:2, f:13},
  {id:'f_oatmeal_banana', name:'Oatmeal with banana', serving:'1 bowl', kcal:260, p:7, c:50, f:4},
  {id:'f_greek_yogurt_honey', name:'Greek yogurt with honey', serving:'200g + honey', kcal:180, p:18, c:22, f:1},
  {id:'f_avocado_toast', name:'Avocado toast', serving:'1 slice + 1/2 avocado', kcal:260, p:7, c:26, f:15},
  {id:'f_pb_toast', name:'Peanut butter toast', serving:'1 slice + 1 tbsp', kcal:240, p:9, c:23, f:13},
  {id:'f_protein_shake', name:'Protein shake', serving:'1 scoop + water', kcal:120, p:24, c:3, f:1.5},
  {id:'f_protein_bar', name:'Protein bar', serving:'1 bar', kcal:220, p:20, c:22, f:7},
  {id:'f_banana', name:'Banana', serving:'1 medium', kcal:105, p:1.3, c:27, f:0.4},
  {id:'f_apple', name:'Apple', serving:'1 medium', kcal:95, p:0.5, c:25, f:0.3},
  {id:'f_almonds_handful', name:'Almonds', serving:'30g handful', kcal:174, p:6.4, c:6.5, f:15},
  {id:'f_mixed_nuts', name:'Mixed nuts', serving:'30g', kcal:180, p:5, c:7, f:16},
  {id:'f_caesar_chicken', name:'Caesar salad with chicken', serving:'1 bowl', kcal:350, p:32, c:12, f:20},
  {id:'f_turkey_sandwich', name:'Turkey sandwich', serving:'1 sandwich', kcal:320, p:24, c:35, f:9},
  {id:'f_chicken_wrap', name:'Chicken caesar wrap', serving:'1 wrap', kcal:450, p:30, c:38, f:20},
  {id:'f_tuna_sandwich', name:'Tuna salad sandwich', serving:'1 sandwich', kcal:380, p:22, c:34, f:17},
  {id:'f_cheeseburger', name:'Cheeseburger', serving:'1 burger', kcal:550, p:30, c:40, f:29},
  {id:'f_burger_fries', name:'Hamburger with fries', serving:'1 meal', kcal:850, p:28, c:90, f:42},
  {id:'f_pizza_margherita', name:'Margherita pizza', serving:'1 slice', kcal:250, p:10, c:30, f:10},
  {id:'f_pizza_pepperoni', name:'Pepperoni pizza', serving:'1 slice', kcal:300, p:13, c:28, f:15},
  {id:'f_spag_bol', name:'Spaghetti bolognese', serving:'1 plate', kcal:550, p:28, c:65, f:18},
  {id:'f_chicken_stirfry', name:'Chicken stir-fry with rice', serving:'1 bowl', kcal:480, p:35, c:55, f:12},
  {id:'f_beef_tacos', name:'Beef tacos', serving:'2 tacos', kcal:340, p:20, c:28, f:16},
  {id:'f_salmon_veg', name:'Salmon with steamed vegetables', serving:'1 plate', kcal:420, p:38, c:10, f:25},
  {id:'f_steak_meal', name:'Steak with sides', serving:'200g steak', kcal:520, p:48, c:5, f:34},
  {id:'f_veg_soup', name:'Vegetable soup', serving:'1 bowl', kcal:150, p:5, c:25, f:3},
  {id:'f_chicken_curry', name:'Chicken curry with rice', serving:'1 plate', kcal:620, p:35, c:70, f:20},
  {id:'f_sushi', name:'Sushi rolls', serving:'8 pieces', kcal:300, p:10, c:55, f:4},
  {id:'f_smoothie_bowl', name:'Smoothie bowl', serving:'1 bowl', kcal:320, p:10, c:55, f:8},
  {id:'f_protein_pancakes', name:'Protein pancakes', serving:'3 pancakes', kcal:350, p:28, c:35, f:10},
  {id:'f_hummus_veg', name:'Hummus with vegetable sticks', serving:'1 portion', kcal:220, p:7, c:20, f:13},
  {id:'f_cottage_fruit', name:'Cottage cheese with fruit', serving:'1 bowl', kcal:220, p:22, c:20, f:5},
  {id:'f_cookie', name:'Chocolate chip cookie', serving:'1 cookie', kcal:150, p:1.5, c:20, f:7},
  {id:'f_dark_choc', name:'Dark chocolate', serving:'30g', kcal:170, p:2, c:15, f:12},
  {id:'f_latte', name:'Latte, whole milk', serving:'1 medium', kcal:150, p:8, c:12, f:7},
  {id:'f_beer', name:'Beer', serving:'1 pint', kcal:208, p:2, c:18, f:0},
  {id:'f_wine', name:'Red wine', serving:'1 glass', kcal:125, p:0.1, c:4, f:0},
  {id:'f_crisps', name:'Crisps', serving:'30g bag', kcal:160, p:2, c:15, f:10}
];

var RECIPES_DB = [
  {id:'r_yogurt_berry', name:'Greek yogurt & berry bowl', meals:['breakfast'], kcal:320, p:28, c:34, f:9,
    ing:['Greek yogurt (250g)','Blueberries (80g)','Honey (15g)','Almonds (15g)'],
    steps:['Spoon the yogurt into a bowl.','Top with blueberries and a drizzle of honey.','Scatter over the almonds.']},
  {id:'r_veg_omelette', name:'Veggie & feta omelette', meals:['breakfast'], kcal:340, p:24, c:3, f:25,
    ing:['Eggs (3)','Spinach (40g)','Feta cheese (30g)','Olive oil (5g)'],
    steps:['Whisk the eggs.','Wilt the spinach in olive oil, add the eggs.','Crumble feta over the top as it sets, fold and serve.']},
  {id:'r_overnight_oats', name:'Overnight oats with banana', meals:['breakfast'], kcal:380, p:16, c:62, f:8,
    ing:['Oats (60g)','Milk, skimmed (150g)','Banana (1)','Chia seeds (10g)'],
    steps:['Stir oats, milk and chia together in a jar.','Refrigerate overnight.','Top with sliced banana before eating.']},
  {id:'r_avocado_egg_toast', name:'Avocado & egg toast', meals:['breakfast'], kcal:330, p:14, c:30, f:18,
    ing:['Bread, whole wheat (60g)','Avocado (75g)','Egg (1)'],
    steps:['Toast the bread.','Mash the avocado and spread over.','Top with a fried or poached egg.']},
  {id:'r_chicken_quinoa', name:'Grilled chicken & quinoa salad', meals:['lunch'], kcal:520, p:46, c:45, f:16,
    ing:['Chicken breast (150g)','Quinoa, cooked (150g)','Bell pepper','Cucumber','Olive oil (10g)'],
    steps:['Grill the chicken and slice.','Toss quinoa with chopped vegetables and olive oil.','Top with the chicken.']},
  {id:'r_tuna_bean', name:'Tuna & white bean salad', meals:['lunch'], kcal:420, p:35, c:35, f:14,
    ing:['Tuna (120g)','Chickpeas, cooked (150g)','Tomato','Onion','Olive oil (10g)'],
    steps:['Drain the tuna and flake it.','Combine with chickpeas, chopped tomato and onion.','Dress with olive oil.']},
  {id:'r_turkey_wrap', name:'Turkey & hummus wrap', meals:['lunch'], kcal:430, p:35, c:35, f:15,
    ing:['Tortilla (60g)','Turkey breast (100g)','Hummus (40g)','Spinach'],
    steps:['Spread hummus over the tortilla.','Layer turkey and spinach.','Roll tightly and slice in half.']},
  {id:'r_lentil_soup', name:'Lentil & vegetable soup', meals:['lunch'], kcal:320, p:20, c:50, f:4,
    ing:['Lentils, cooked (200g)','Carrot','Onion','Tomato'],
    steps:['Sauté the onion and carrot.','Add tomato and lentils with stock.','Simmer 15 minutes and season.']},
  {id:'r_chicken_broccoli', name:'Chicken & broccoli stir-fry', meals:['dinner'], kcal:520, p:42, c:55, f:10,
    ing:['Chicken breast (150g)','Broccoli (150g)','Brown rice, cooked (150g)','Soy sauce'],
    steps:['Stir-fry the chicken until cooked through.','Add broccoli and soy sauce, cook until tender.','Serve over brown rice.']},
  {id:'r_salmon_sweetpotato', name:'Baked salmon with sweet potato', meals:['dinner'], kcal:560, p:38, c:45, f:24,
    ing:['Salmon (150g)','Sweet potato (200g)','Broccoli (100g)'],
    steps:['Roast the sweet potato wedges until tender.','Bake the salmon 12-15 minutes.','Serve with steamed broccoli.']},
  {id:'r_beef_chili', name:'Beef & black bean chili', meals:['dinner'], kcal:520, p:38, c:35, f:24,
    ing:['Beef, ground (150g)','Black beans, cooked (150g)','Tomato','Onion'],
    steps:['Brown the beef with onion.','Add tomato and black beans.','Simmer 20 minutes.']},
  {id:'r_tofu_curry', name:'Tofu & vegetable curry', meals:['dinner'], kcal:540, p:24, c:55, f:24,
    ing:['Tofu (150g)','Coconut milk (100g)','Bell pepper','Onion','Brown rice, cooked (150g)'],
    steps:['Pan-fry the tofu until golden.','Simmer with coconut milk and vegetables.','Serve over brown rice.']},
  {id:'r_shrimp_quinoa', name:'Shrimp & quinoa bowl', meals:['dinner','lunch'], kcal:460, p:35, c:42, f:16,
    ing:['Shrimp (150g)','Quinoa, cooked (150g)','Avocado (50g)','Cucumber'],
    steps:['Cook the shrimp until pink.','Combine with quinoa and chopped vegetables.','Top with sliced avocado.']},
  {id:'r_steak_veg', name:'Steak & roasted vegetables', meals:['dinner'], kcal:560, p:52, c:30, f:24,
    ing:['Beef steak (200g)','Sweet potato (150g)','Broccoli (100g)'],
    steps:['Roast the vegetables until tender.','Sear the steak to preference.','Rest 5 minutes, then serve.']},
  {id:'r_apple_pb', name:'Apple & peanut butter', meals:['snack'], kcal:215, p:5, c:30, f:11,
    ing:['Apple (1)','Peanut butter (20g)'],
    steps:['Slice the apple.','Serve with peanut butter for dipping.']},
  {id:'r_cottage_pineapple', name:'Cottage cheese & pineapple', meals:['snack'], kcal:200, p:18, c:20, f:4,
    ing:['Cottage cheese (150g)','Pineapple (100g)'],
    steps:['Spoon cottage cheese into a bowl.','Top with pineapple chunks.']},
  {id:'r_shake_almonds', name:'Protein shake & almonds', meals:['snack'], kcal:235, p:27, c:9, f:12,
    ing:['Protein shake (1 scoop)','Almonds (20g)'],
    steps:['Blend the protein shake.','Serve with a small handful of almonds.']},
  {id:'r_hummus_carrot', name:'Hummus & carrot sticks', meals:['snack'], kcal:180, p:6, c:19, f:9,
    ing:['Hummus (60g)','Carrot (100g)'],
    steps:['Cut the carrot into sticks.','Serve with hummus for dipping.']},
  {id:'r_yogurt_walnut', name:'Greek yogurt & walnuts', meals:['snack'], kcal:220, p:17, c:17, f:11,
    ing:['Greek yogurt (150g)','Walnuts (15g)','Honey (10g)'],
    steps:['Spoon yogurt into a bowl.','Top with walnuts and a drizzle of honey.']},
  {id:'r_berries_choc', name:'Mixed berries & dark chocolate', meals:['snack'], kcal:140, p:2, c:22, f:6,
    ing:['Blueberries & strawberries (150g)','Dark chocolate (15g)'],
    steps:['Wash and combine the berries.','Shave the dark chocolate over the top.']}
];

/* ================= goal / calorie math ================= */
var ACTIVITY_MULT = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
var ACTIVITY_LABELS = {
  sedentary:'Sedentary (little to no exercise)',
  light:'Light (exercise 1-3 days/week)',
  moderate:'Moderate (exercise 3-5 days/week)',
  active:'Active (exercise 6-7 days/week)',
  very_active:'Very active (hard training or physical job)'
};
var KCAL_PER_KG = 7700; // approx. energy value of 1kg of body fat

function calcBMR(sex, weightKg, heightCm, age){
  var base = 10*weightKg + 6.25*heightCm - 5*age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calcTDEE(profile){
  var bmr = calcBMR(profile.sex, profile.currentWeightKg, profile.heightCm, profile.age);
  return bmr * (ACTIVITY_MULT[profile.activity] || 1.2);
}

/* Returns an array of pace options: {key,label,dailyKcal,weeklyRateKg,goalDays,goalDate,clamped} */
function calcPaceOptions(profile){
  var tdee = calcTDEE(profile);
  var diff = profile.targetWeightKg - profile.currentWeightKg;
  var minCal = profile.sex === 'male' ? 1500 : 1200;

  if (Math.abs(diff) < 0.4){
    return [{
      key:'maintain', label:'Maintain', dailyKcal: round(tdee),
      weeklyRateKg:0, goalDays:0, goalDate: todayISO(), clamped:false,
      blurb:'Your target is close to your current weight, so this keeps you steady.'
    }];
  }

  var losing = diff < 0;
  var weeklyPace = losing ? [0.25, 0.5, 1.0] : [0.25, 0.5, 0.75];
  var keys = ['slow','medium','fast'];
  var names = losing ? ['Slow & steady','Balanced','Fast'] : ['Slow & steady','Balanced','Fast'];

  return keys.map(function(key, i){
    var weeklyKg = weeklyPace[i];
    var dailyChange = (weeklyKg * KCAL_PER_KG) / 7;
    var dailyCal = losing ? (tdee - dailyChange) : (tdee + dailyChange);
    var clamped = false;
    if (losing && dailyCal < minCal){ dailyCal = minCal; clamped = true; }
    dailyCal = round(dailyCal);
    var actualDailyChange = Math.abs(tdee - dailyCal);
    var totalChangeKcal = Math.abs(diff) * KCAL_PER_KG;
    var days = actualDailyChange > 0 ? Math.ceil(totalChangeKcal / actualDailyChange) : 0;
    return {
      key:key, label:names[i], dailyKcal:dailyCal, weeklyRateKg:weeklyKg,
      goalDays:days, goalDate: addDaysISO(todayISO(), days), clamped:clamped,
      blurb: (losing ? 'Lose' : 'Gain') + ' about ' + weeklyKg + 'kg / week'
    };
  });
}

function computeMacroTargets(dailyKcal, currentWeightKg){
  var proteinG = round(1.8 * currentWeightKg);
  var proteinKcal = proteinG * 4;
  var fatKcal = dailyKcal * 0.25;
  var fatG = round(fatKcal / 9);
  var carbKcal = Math.max(0, dailyKcal - proteinKcal - fatKcal);
  var carbG = round(carbKcal / 4);
  return { proteinG:proteinG, carbG:carbG, fatG:fatG };
}

/* ================= state ================= */
var STATE = null;
var ACCOUNTS = [];
var ACTIVE_ACCOUNT_ID = null;
var ACCOUNT_SCREEN = 'select';
var CREATE_ACCOUNT = { name:'', avatar:0 };
var UI = { activeView:'today', selectedDate: todayISO(), modal:null, plannerTags:[], plannerMaxCal:'',
  plannerResults:null, plannerMeal:'day', editingGoal:false, wizardDraft:null, wizardStep:'form',
  wizardPaceOptions:null, wizardProfileDraft:null };

function loadInitialState(){
  var raw = document.getElementById('state-data').textContent;
  try { return JSON.parse(raw); }
  catch(e){ return defaultState(); }
}
function defaultState(){
  return {
    profile:{ setupComplete:false, sex:'female', age:null, heightCm:null,
      currentWeightKg:null, targetWeightKg:null, activity:'sedentary', pace:null,
      dailyCalorieTarget:0, macroTargets:{proteinG:0,carbG:0,fatG:0}, startDate:null, startWeightKg:null, goalDays:0 },
    weightLog:[], days:{}, library:[]
  };
}
function ensureDay(iso){
  if (!STATE.days[iso]) STATE.days[iso] = { breakfast:[], lunch:[], dinner:[], snacks:[] };
  return STATE.days[iso];
}
function dayTotals(iso){
  var day = STATE.days[iso];
  var t = { kcal:0, p:0, c:0, f:0 };
  if (!day) return t;
  ['breakfast','lunch','dinner','snacks'].forEach(function(meal){
    day[meal].forEach(function(entry){
      var s = scaleNutrition(entry.base, entry.portion);
      t.kcal += s.kcal; t.p += s.p; t.c += s.c; t.f += s.f;
    });
  });
  return t;
}
/* Older saved states stored entries with pre-scaled kcal/p/c/f and no base
   reference, which made editing impossible. Backfill a base (1x) value from
   the stored portion so those entries stay editable. */
function migrateState(){
  Object.keys(STATE.days || {}).forEach(function(iso){
    var day = STATE.days[iso];
    ['breakfast','lunch','dinner','snacks'].forEach(function(meal){
      (day[meal] || []).forEach(function(entry){
        if (!entry.base){
          var portion = entry.portion || 1;
          entry.base = {
            kcal: portion ? entry.kcal / portion : entry.kcal,
            p: portion ? entry.p / portion : entry.p,
            c: portion ? entry.c / portion : entry.c,
            f: portion ? entry.f / portion : entry.f
          };
        }
      });
    });
  });
}

/* ================= persistence ================= */
var saveStatus = 'local';
var LOCAL_KEY = 'portion_state_v1';
var ACCOUNTS_KEY = 'portion_accounts_v1';
function accountStateKey(id){ return 'portion_state_account_' + id; }
function loadAccountRegistry(){
  try { var raw = localStorage.getItem(ACCOUNTS_KEY); ACCOUNTS = raw ? JSON.parse(raw) : []; if (!Array.isArray(ACCOUNTS)) ACCOUNTS = []; }
  catch(e){ ACCOUNTS = []; }
  if (!ACCOUNTS.length){
    try {
      var legacyRaw = localStorage.getItem(LOCAL_KEY);
      if (legacyRaw){
        var legacy = JSON.parse(legacyRaw);
        if (legacy && legacy.profile){
          var legacyId = uid();
          ACCOUNTS.push({ id:legacyId, name:'My account', avatar:0 });
          localStorage.setItem(accountStateKey(legacyId), JSON.stringify(legacy));
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(ACCOUNTS));
        }
      }
    } catch(e){}
  }
}
function saveAccountRegistry(){ try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(ACCOUNTS)); } catch(e){} }
function activeAccount(){ return ACCOUNTS.find(function(a){ return a.id === ACTIVE_ACCOUNT_ID; }); }
function loadAccountState(id){
  try { var raw = localStorage.getItem(accountStateKey(id)); STATE = raw ? JSON.parse(raw) : defaultState(); }
  catch(e){ STATE = defaultState(); }
  if (!STATE || !STATE.profile) STATE = defaultState();
  migrateState();
}
function selectAccount(id){
  ACTIVE_ACCOUNT_ID = id; loadAccountState(id); ACCOUNT_SCREEN = 'app';
  UI.activeView = 'today'; UI.selectedDate = todayISO(); UI.modal = null; render();
}
function createAccount(){
  var name = String(CREATE_ACCOUNT.name || '').trim(); if (!name) return;
  var id = uid(); ACCOUNTS.push({ id:id, name:name, avatar:Number(CREATE_ACCOUNT.avatar)||0 }); saveAccountRegistry();
  try { localStorage.setItem(accountStateKey(id), JSON.stringify(defaultState())); } catch(e){}
  CREATE_ACCOUNT = { name:'', avatar:0 }; selectAccount(id);
}
var EDIT_ACCOUNT = { name:'', avatar:0 };
function openAccountDetails(){
  var account = activeAccount(); if (!account) return;
  EDIT_ACCOUNT = { name:account.name, avatar:Number(account.avatar)||0 };
  ACCOUNT_SCREEN = 'details'; UI.modal = null; PENDING_FOCUS = null; render();
}
function saveAccountDetails(){
  var account = activeAccount();
  var name = String(EDIT_ACCOUNT.name || '').trim();
  if (!account || !name) return;
  account.name = name; account.avatar = Number(EDIT_ACCOUNT.avatar)||0;
  saveAccountRegistry(); ACCOUNT_SCREEN = 'app'; render();
}
function signOut(){
  persistLocal(); ACTIVE_ACCOUNT_ID = null; ACCOUNT_SCREEN = 'select'; UI.modal = null; render();
}
function deleteActiveAccount(){
  if (!ACTIVE_ACCOUNT_ID) return;
  var id = ACTIVE_ACCOUNT_ID;
  try { localStorage.removeItem(accountStateKey(id)); } catch(e){}
  ACCOUNTS = ACCOUNTS.filter(function(a){ return a.id !== id; });
  saveAccountRegistry(); ACTIVE_ACCOUNT_ID = null; ACCOUNT_SCREEN = 'select'; UI.modal = null; render();
}

var scheduleSave = debounce(persistLocal, 1200);
function persist(){ persistLocal(); }
function persistLocal(){
  try {
    if (ACTIVE_ACCOUNT_ID) localStorage.setItem(accountStateKey(ACTIVE_ACCOUNT_ID), JSON.stringify(STATE));
    else localStorage.setItem(LOCAL_KEY, JSON.stringify(STATE));
    saveStatus = 'local';
  }
  catch(e){ saveStatus = 'local'; }
  renderSaveStatus();
}
function renderSaveStatus(){
  var el = document.getElementById('save-status');
  if (!el) return;
  el.className = 'save-status' + (saveStatus === 'saving' ? ' saving' : '') + (saveStatus === 'local' ? ' local' : '');
  el.innerHTML = '<span class="save-status__dot"></span>' + (
    saveStatus === 'saving' ? 'Saving…' :
    saveStatus === 'local' ? 'Saved in this browser' :
    'Saved'
  );
}

function initPersistence(){
  loadFromLocalIfPresent();
  saveStatus = 'local';
  render();
}
function loadFromLocalIfPresent(){
  if (ACTIVE_ACCOUNT_ID){ loadAccountState(ACTIVE_ACCOUNT_ID); return; }
  try {
    var raw = localStorage.getItem(LOCAL_KEY);
    if (raw){ var parsed = JSON.parse(raw); if (parsed && parsed.profile) STATE = parsed; }
  } catch(e){}
  migrateState();
}

/* ================= search & matching ================= */
function norm(s){ return String(s || '').toLowerCase().trim(); }
function matchScore(name, q, nCache){
  var n = nCache || norm(name);
  if (n === q) return 100;
  if (n.indexOf(q) === 0) return 90;
  if (n.indexOf(q) > -1) return 80;
  // Word-level fallback: many ingredient names are comma-separated USDA
  // descriptions ("Chicken, breast, boneless, skinless, raw"), so a query like
  // "chicken breast" has no contiguous substring match. Score by matching each
  // QUERY word against every word in the name (not just the name's first word),
  // so partial word overlaps still surface a result, ranked below full matches.
  var qWords = q.split(/\s+/).filter(Boolean);
  if (qWords.length > 1){
    var nWords = n.split(/[\s,]+/).filter(Boolean);
    var matched = 0;
    for (var i = 0; i < qWords.length; i++){
      var w = qWords[i];
      for (var j = 0; j < nWords.length; j++){
        if (nWords[j].indexOf(w) === 0){ matched++; break; }
      }
    }
    if (matched > 0) return Math.round((matched / qWords.length) * 65);
  }
  return 0;
}
function rankMatches(items, q, getName, getNameCache){
  return items
    .map(function(item){
      var nm = getName(item);
      return { item:item, name:nm, score:matchScore(nm, q, getNameCache ? getNameCache(item) : null) };
    })
    .filter(function(r){ return r.score > 0; })
    .sort(function(a,b){
      if (b.score !== a.score) return b.score - a.score;
      return a.name.length - b.name.length; // tie-break: shorter/plainer names first
    })
    .slice(0, 8)
    .map(function(r){ return r.item; });
}
function searchFoods(query){
  var q = norm(query);
  if (!q) return { yours:[], common:[] };
  var yours = rankMatches(STATE.library, q, function(i){ return i.name; });
  var common = rankMatches(FOODS_DB, q, function(i){ return i.name; });
  return { yours:yours, common:common };
}
function searchIngredients(query){
  var q = norm(query);
  if (!q) return [];
  return rankMatches(INGREDIENTS_DB, q, function(i){ return i.name; }, function(i){ return i.nameNorm; });
}
function findLibraryByName(name){
  var n = norm(name);
  return STATE.library.find(function(i){ return norm(i.name) === n; });
}

/* ================= portion & scaling ================= */
var PORTION_FRACTIONS = [
  { key:'0', label:'0', value:0 },
  { key:'1/4', label:'¼', value:0.25 },
  { key:'1/3', label:'⅓', value:1/3 },
  { key:'1/2', label:'½', value:0.5 },
  { key:'2/3', label:'⅔', value:2/3 },
  { key:'3/4', label:'¾', value:0.75 }
];
function fracValue(fracKey){
  var f = PORTION_FRACTIONS.find(function(f){ return f.key === fracKey; });
  return f ? f.value : 0;
}
function portionTotal(whole, fracKey){ return (whole||0) + fracValue(fracKey); }
function scaleNutrition(base, portion){
  return {
    kcal: round(base.kcal * portion),
    p: Math.round(base.p * portion * 10) / 10,
    c: Math.round(base.c * portion * 10) / 10,
    f: Math.round(base.f * portion * 10) / 10
  };
}
/* Splits a portion value back into whole + the closest fraction key for the two selectors. */
function decomposePortion(portion){
  var whole = Math.floor(portion + 1e-9);
  var remainder = portion - whole;
  if (remainder > 0.98){ whole += 1; remainder = 0; }
  var best = PORTION_FRACTIONS[0], bestDiff = Infinity;
  PORTION_FRACTIONS.forEach(function(f){
    var diff = Math.abs(f.value - remainder);
    if (diff < bestDiff){ bestDiff = diff; best = f; }
  });
  return { whole: whole, frac: best.key };
}
/* Formats a portion value using the nicest fraction glyph available ("1⅓", "¾", "2"). */
function formatPortionValue(portion){
  var whole = Math.floor(portion + 1e-9);
  var remainder = portion - whole;
  if (remainder > 0.98){ whole += 1; remainder = 0; }
  var best = null, bestDiff = Infinity;
  PORTION_FRACTIONS.forEach(function(f){
    if (f.value === 0) return;
    var diff = Math.abs(f.value - remainder);
    if (diff < bestDiff){ bestDiff = diff; best = f; }
  });
  var fracLabel = (best && bestDiff < 0.02) ? best.label : '';
  if (whole === 0) return fracLabel || '0';
  return whole + fracLabel;
}

/* ================= mutations: library & log ================= */
function upsertLibraryFromDbFood(dbFood){
  var existing = findLibraryByName(dbFood.name);
  if (existing) return existing;
  var item = { id: uid(), name: dbFood.name, serving: dbFood.serving || '1 serving',
    kcal: dbFood.kcal, p: dbFood.p, c: dbFood.c, f: dbFood.f, kind:'logged' };
  STATE.library.unshift(item);
  return item;
}
function addLogEntry(dateIso, meal, baseFood, portion, sourceLibraryItem){
  var day = ensureDay(dateIso);
  var entry = {
    id: uid(), name: baseFood.name, serving: baseFood.serving || '1 serving', portion: portion,
    base: { kcal: baseFood.kcal, p: baseFood.p, c: baseFood.c, f: baseFood.f }
  };
  if (baseFood.kind === 'built' && baseFood.ingredients && baseFood.ingredients.length){
    entry.kind = 'built';
    entry.ingredients = baseFood.ingredients;
  }
  day[meal].push(entry);
  if (sourceLibraryItem !== false){
    var lib = findLibraryByName(baseFood.name);
    if (!lib){
      STATE.library.unshift({ id: uid(), name: baseFood.name, serving: baseFood.serving || '1 serving',
        kcal: baseFood.kcal, p: baseFood.p, c: baseFood.c, f: baseFood.f, kind:'logged' });
    }
  }
  render(); scheduleSave();
}
function removeLogEntry(dateIso, meal, entryId){
  var day = STATE.days[dateIso];
  if (!day) return;
  day[meal] = day[meal].filter(function(e){ return e.id !== entryId; });
  render(); scheduleSave();
}
function saveBuiltFood(name, rows){
  var totals = { kcal:0, p:0, c:0, f:0 };
  rows.forEach(function(row){
    var ing = INGREDIENTS_DB.find(function(i){ return i.id === row.ingredientId; });
    if (!ing || !row.grams) return;
    var nutrition = row.raw && ing.raw ? ing.raw : ing;
    var factor = row.grams / 100;
    totals.kcal += nutrition.kcal * factor;
    totals.p += nutrition.p * factor;
    totals.c += nutrition.c * factor;
    totals.f += nutrition.f * factor;
  });
  var base = { kcal: round(totals.kcal), p: Math.round(totals.p*10)/10, c: Math.round(totals.c*10)/10, f: Math.round(totals.f*10)/10 };
  var item = { id: uid(), name: name, serving: '1 serving (as built)', kcal: base.kcal, p: base.p, c: base.c, f: base.f,
    kind:'built', ingredients: rows.map(function(row){
      var ing = INGREDIENTS_DB.find(function(i){ return i.id === row.ingredientId; });
      return { name: ing ? ing.name + (row.raw ? ' (raw)' : '') : '?', grams: row.grams, raw:!!row.raw };
    }) };
  STATE.library.unshift(item);
  return { item:item, base:base };
}

/* ================= mutations: profile & goal ================= */
function selectPaceAndSave(paceOption, profileDraft){
  var macros = computeMacroTargets(paceOption.dailyKcal, profileDraft.currentWeightKg);
  STATE.profile = Object.assign({}, profileDraft, {
    setupComplete: true,
    pace: paceOption.key,
    dailyCalorieTarget: paceOption.dailyKcal,
    macroTargets: macros,
    startDate: STATE.profile.startDate || todayISO(),
    startWeightKg: profileDraft.currentWeightKg,
    goalDays: paceOption.goalDays
  });
  if (!STATE.weightLog.some(function(w){ return w.date === todayISO(); })){
    STATE.weightLog.push({ date: todayISO(), weightKg: profileDraft.currentWeightKg });
    STATE.weightLog.sort(function(a,b){ return a.date < b.date ? -1 : 1; });
  }
  UI.activeView = 'today';
  render(); scheduleSave();
}
function logWeightToday(weightKg){
  var iso = todayISO();
  var existing = STATE.weightLog.find(function(w){ return w.date === iso; });
  if (existing){ existing.weightKg = weightKg; }
  else { STATE.weightLog.push({ date: iso, weightKg: weightKg }); }
  STATE.weightLog.sort(function(a,b){ return a.date < b.date ? -1 : 1; });
  STATE.profile.currentWeightKg = weightKg;
  render(); scheduleSave();
}

/* ================= rendering: root ================= */
var NAV_ITEMS = [
  { key:'today', label:'Today' },
  { key:'planner', label:'Meal planner' },
  { key:'progress', label:'Progress & goal' }
];

function render(){
  var app = document.getElementById('app');
  if (ACCOUNT_SCREEN === 'select'){
    app.innerHTML = renderAccountSelect();
  } else if (ACCOUNT_SCREEN === 'create'){
    app.innerHTML = renderAccountCreate();
  } else if (ACCOUNT_SCREEN === 'details'){
    app.innerHTML = renderAccountDetails();
  } else if (!STATE.profile.setupComplete){
    app.innerHTML = renderWizardScreen();
  } else {
    app.innerHTML = renderShell();
  }
  var modalHost = document.getElementById('modal-host');
  if (modalHost && UI.modal){ modalHost.innerHTML = renderModal(); }
  var statusHost = document.getElementById('save-status-host');
  if (statusHost){ statusHost.innerHTML = '<div class="save-status" id="save-status"><span class="save-status__dot"></span>Saved</div>'; renderSaveStatus(); }
  focusPendingField();
}
function avatarStyle(index){
  var col = index % 4, row = Math.floor(index / 4);
  var x = col === 0 ? 0 : (col === 3 ? 100 : col * 33.333);
  var y = row === 0 ? 0 : (row === 2 ? 100 : 50);
  return 'background-position:' + x + '% ' + y + '%';
}
function renderAvatar(index, small){ return '<span class="avatar' + (small?' avatar--sm':'') + '" style="' + avatarStyle(Number(index)||0) + '"></span>'; }
function renderAccountSelect(){
  return '<div class="account-gate"><section class="account-panel"><div class="account-head"><h1>Welcome to Portion</h1><p>Who is tracking today?</p></div>' +
    (!ACCOUNTS.length ? '<div class="account-empty">Create your first account to get started.</div>' : '') +
    '<div class="account-list">' + ACCOUNTS.map(function(a){ return '<button class="account-card" data-action="select-account" data-id="' + esc(a.id) + '">' + renderAvatar(a.avatar,false) + '<span>' + esc(a.name) + '</span></button>'; }).join('') +
    '<button class="account-card account-card--new" data-action="start-create-account"><span class="account-plus">+</span><span>Create new account</span></button></div></section></div>';
}
function renderAccountCreate(){
  return '<div class="account-gate"><section class="account-panel"><div class="account-head"><h1>Create an account</h1><p>Choose a name and an icon that feels like you.</p></div>' +
    '<div class="account-form"><div class="field"><label for="account-name-input">Account name</label><input class="input" id="account-name-input" maxlength="30" placeholder="For example, Fyodor" value="' + esc(CREATE_ACCOUNT.name) + '"></div>' +
    '<div class="field"><label>Choose your icon</label><div class="avatar-grid">' + Array.from({length:12},function(_,i){ return '<button class="avatar-choice ' + (CREATE_ACCOUNT.avatar===i?'selected':'') + '" data-action="choose-avatar" data-avatar="' + i + '" aria-label="Choose profile icon ' + (i+1) + '">' + renderAvatar(i,false) + '</button>'; }).join('') + '</div></div>' +
    '<div class="account-form__actions"><button class="btn btn--ghost" data-action="cancel-create-account">Back</button><button class="btn btn--primary" data-action="create-account" ' + (!CREATE_ACCOUNT.name.trim()?'disabled':'') + '>Create account</button></div></div></section></div>';
}
function renderAccountDetails(){
  var account = activeAccount();
  if (!account){ ACCOUNT_SCREEN = 'select'; return renderAccountSelect(); }
  return '<div class="account-gate"><section class="account-panel"><div class="account-details-head"><button class="btn btn--ghost" data-action="close-account-details">Back</button><div class="account-head"><h1>Account details</h1><p>Edit your account name and profile icon.</p></div><span class="account-head-spacer"></span></div>' +
    '<div class="account-form"><div class="field"><label for="edit-account-name-input">Account name</label><input class="input" id="edit-account-name-input" maxlength="30" value="' + esc(EDIT_ACCOUNT.name) + '"></div>' +
    '<div class="field"><label>Profile icon</label><div class="avatar-grid">' + Array.from({length:12},function(_,i){ return '<button class="avatar-choice ' + (EDIT_ACCOUNT.avatar===i?'selected':'') + '" data-action="choose-edit-avatar" data-avatar="' + i + '" aria-label="Choose profile icon ' + (i+1) + '">' + renderAvatar(i,false) + '</button>'; }).join('') + '</div></div>' +
    '<button class="btn btn--primary btn--block" data-action="save-account-details" ' + (!EDIT_ACCOUNT.name.trim()?'disabled':'') + '>Save changes</button>' +
    '<div class="account-actions"><button class="btn btn--block" data-action="sign-out">Sign out</button><button class="btn btn--danger btn--block" data-action="confirm-delete-account">Delete account</button></div>' +
    '<p class="account-delete-note">Deleting this account permanently removes its goals, meal plans and food history from this browser.</p></div></section></div>';
}
var PENDING_FOCUS = null;
function focusPendingField(){
  if (!PENDING_FOCUS) return;
  var el = document.getElementById(PENDING_FOCUS);
  if (el){ el.focus(); if (el.value){ try{ el.setSelectionRange(el.value.length, el.value.length); }catch(e){} } }
  PENDING_FOCUS = null;
}

function renderShell(){
  var account = activeAccount() || {name:'Account',avatar:0};
  var isMobile = window.innerWidth <= 860;
  return (
    '<div class="topbar">' +
      '<div class="topbar__brand">Portion</div>' +
      '<button class="account-switch" style="width:auto" data-action="open-account-details" aria-label="Open account details">' + renderAvatar(account.avatar,true) + '</button>' +
      '<div class="topnav">' + NAV_ITEMS.map(function(n){
        return '<button data-action="nav" data-view="' + n.key + '" class="' + (UI.activeView===n.key?'active':'') + '">' + n.label + '</button>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="shell">' +
      '<div class="sidebar">' +
        '<div class="brand"><span class="brand__mark">Portion</span></div>' +
        '<div class="nav">' + NAV_ITEMS.map(function(n){
          return '<button class="navlink ' + (UI.activeView===n.key?'active':'') + '" data-action="nav" data-view="' + n.key + '"><span class="dot"></span>' + n.label + '</button>';
        }).join('') + '</div>' +
        '<div class="sidebar__foot"><button class="account-switch" data-action="open-account-details">' + renderAvatar(account.avatar,true) + '<span><span class="account-switch__name">' + esc(account.name) + '</span><span class="account-switch__hint">Account</span></span></button><div class="hint" style="padding:6px 8px 0">' + esc(STATE.profile.dailyCalorieTarget) + ' kcal/day target</div></div>' +
      '</div>' +
      '<div class="main"><div class="container">' + renderActiveView() + '</div></div>' +
    '</div>' +
    '<div id="modal-host"></div>' +
    '<div id="save-status-host"></div>'
  );
}

function renderActiveView(){
  if (UI.activeView === 'planner') return renderPlanner();
  if (UI.activeView === 'progress') return renderProgress();
  return renderToday();
}

/* ================= rendering: Today ================= */
var MEAL_DEFS = [
  { key:'breakfast', label:'Breakfast' },
  { key:'lunch', label:'Lunch' },
  { key:'dinner', label:'Dinner' },
  { key:'snacks', label:'Snacks' }
];

function renderToday(){
  var iso = UI.selectedDate;
  var totals = dayTotals(iso);
  var target = STATE.profile.dailyCalorieTarget;
  var remaining = target - totals.kcal;
  var macros = STATE.profile.macroTargets;

  return (
    '<div class="view-head">' +
      '<div><h1>' + (isToday(iso) ? 'Today' : formatDateLong(iso)) + '</h1>' +
      '<p>' + (isToday(iso) ? formatDateLong(iso) : 'Log for this day') + '</p></div>' +
      '<div class="date-nav">' +
        '<button class="icon-btn" data-action="date-prev" aria-label="Previous day">&#8249;</button>' +
        '<div class="date-nav__label">' + (isToday(iso) ? 'Today' : formatDateShort(iso)) + '</div>' +
        '<button class="icon-btn" data-action="date-next" aria-label="Next day">&#8250;</button>' +
      '</div>' +
    '</div>' +
    '<div class="stack">' +
      '<div class="card">' + renderSummary(totals, target, remaining, macros) + '</div>' +
      MEAL_DEFS.map(function(m){ return '<div class="card">' + renderMealSection(m, iso) + '</div>'; }).join('') +
    '</div>'
  );
}

function renderRing(remaining, target){
  var consumed = target - remaining;
  var pct = target > 0 ? clamp(consumed / target, 0, 1) : 0;
  var over = remaining < 0;
  var deg = Math.round(pct * 360);
  var ringColor = over ? 'var(--danger)' : 'var(--accent)';
  var bg = 'conic-gradient(' + ringColor + ' ' + deg + 'deg, var(--surface-2) 0deg)';
  return (
    '<div class="ring" style="background:' + bg + '">' +
      '<div class="ring__hole">' +
        '<div class="ring__value num' + (over ? ' over' : '') + '">' + Math.abs(round(remaining)) + '</div>' +
        '<div class="ring__unit">kcal ' + (over ? 'over' : 'left') + '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderMacroBar(label, colorVar, consumed, target){
  var pct = target > 0 ? clamp((consumed/target)*100, 0, 100) : 0;
  return (
    '<div class="macro-bar">' +
      '<div class="macro-bar__top"><span>' + label + '</span><span class="num">' + Math.round(consumed) + 'g / ' + Math.round(target) + 'g</span></div>' +
      '<div class="macro-bar__track"><div class="macro-bar__fill" style="width:' + pct + '%;background:' + colorVar + '"></div></div>' +
    '</div>'
  );
}

function renderSummary(totals, target, remaining, macros){
  return (
    '<div class="summary">' +
      renderRing(remaining, target) +
      '<div class="summary__meta">' +
        '<div class="summary__row"><span>Consumed</span><span class="num">' + round(totals.kcal) + ' kcal</span></div>' +
        '<div class="summary__row"><span>Daily target</span><span class="num">' + round(target) + ' kcal</span></div>' +
        renderMacroBar('Protein', 'var(--protein)', totals.p, macros.proteinG) +
        renderMacroBar('Carbs', 'var(--carb)', totals.c, macros.carbG) +
        renderMacroBar('Fat', 'var(--fat)', totals.f, macros.fatG) +
      '</div>' +
    '</div>'
  );
}

function renderMealSection(mealDef, iso){
  var day = ensureDay(iso);
  var entries = day[mealDef.key];
  var subtotal = entries.reduce(function(s,e){ return s + scaleNutrition(e.base, e.portion).kcal; }, 0);
  return (
    '<div class="meal-card__head">' +
      '<div class="meal-card__title"><h3>' + mealDef.label + '</h3><span class="meal-card__kcal num">' + round(subtotal) + ' kcal</span></div>' +
      '<button class="btn btn--sm btn--ghost" data-action="open-add" data-meal="' + mealDef.key + '">+ Add food</button>' +
    '</div>' +
    (entries.length ? entries.map(function(e){
      var scaled = scaleNutrition(e.base, e.portion);
      return (
        '<div class="meal-entry">' +
          '<button class="meal-entry__main" data-action="edit-entry" data-meal="' + mealDef.key + '" data-id="' + e.id + '">' +
            '<div class="meal-entry__name">' + esc(e.name) + '</div>' +
            '<div class="meal-entry__meta">' + formatPortionLabel(e.portion) + ' &middot; ' + esc(e.serving) + '</div>' +
          '</button>' +
          '<div class="meal-entry__kcal">' + round(scaled.kcal) + ' kcal</div>' +
          '<button class="icon-btn" data-action="remove-entry" data-meal="' + mealDef.key + '" data-id="' + e.id + '" aria-label="Remove">&times;</button>' +
        '</div>'
      );
    }).join('') : '<div class="empty-row">Nothing logged yet.</div>')
  );
}
function formatPortionLabel(p){
  return (Math.abs(p - 1) < 0.001 ? '1 portion' : formatPortionValue(p) + ' portions');
}

/* ================= rendering: Add Food modal ================= */
function openAddModal(meal){
  UI.modal = {
    meal: meal, tab:'search', query:'', results:{yours:[],common:[]}, selected:null,
    portionWhole:1, portionFrac:'0',
    build:{ name:'', rows:[{ ingredientId:null, ingredientName:'', grams:100, query:'', raw:false }], portionWhole:1, portionFrac:'0' }
  };
  render();
}
function closeAddModal(){ UI.modal = null; render(); }

function openEditEntryModal(meal, entryId){
  var day = ensureDay(UI.selectedDate);
  var entry = (day[meal] || []).find(function(e){ return e.id === entryId; });
  if (!entry) return;
  var d = decomposePortion(entry.portion);
  UI.modal = {
    mode:'edit', meal: meal, entryId: entryId,
    food: { name: entry.name, serving: entry.serving, kcal: entry.base.kcal, p: entry.base.p, c: entry.base.c, f: entry.base.f },
    ingredients: (entry.kind === 'built' && entry.ingredients) ? entry.ingredients : null,
    portionWhole: d.whole, portionFrac: d.frac
  };
  render();
}
function handleSaveEditEntry(){
  var m = UI.modal;
  var portion = portionTotal(m.portionWhole, m.portionFrac);
  if (portion <= 0) return;
  var day = ensureDay(UI.selectedDate);
  var entry = (day[m.meal] || []).find(function(e){ return e.id === m.entryId; });
  if (entry) entry.portion = portion;
  UI.modal = null;
  render(); scheduleSave();
}

function renderModal(){
  if (!UI.modal) return '';
  var m = UI.modal;
  if (m.mode === 'edit') return renderEditModal(m);
  var mealLabel = (MEAL_DEFS.find(function(d){return d.key===m.meal;}) || {label:'meal'}).label;
  return (
    '<div class="modal-overlay">' +
      '<div class="modal">' +
        '<div class="modal__head"><h3>Add to ' + mealLabel + '</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>' +
        '<div class="modal__tabs">' +
          '<button class="tab ' + (m.tab==='search'?'active':'') + '" data-action="modal-tab" data-tab="search">Search</button>' +
          '<button class="tab ' + (m.tab==='build'?'active':'') + '" data-action="modal-tab" data-tab="build">Build from ingredients</button>' +
        '</div>' +
        '<div class="modal__body">' + (m.tab === 'search' ? renderSearchTab(m) : renderBuildTab(m)) + '</div>' +
      '</div>' +
    '</div>'
  );
}
function renderIngredientsView(ingredients){
  return (
    '<div class="ing-view-list">' +
      '<div class="ing-view-list__label">Ingredients used</div>' +
      ingredients.map(function(ing){
        return (
          '<div class="ing-view-row">' +
            '<span class="ing-view-row__name">' + esc(ing.name) + '</span>' +
            '<span class="ing-view-row__grams">' + esc(String(ing.grams)) + 'g</span>' +
          '</div>'
        );
      }).join('') +
    '</div>'
  );
}
function renderEditModal(m){
  var portion = portionTotal(m.portionWhole, m.portionFrac);
  var scaled = scaleNutrition(m.food, portion || 0);
  var mealLabel = (MEAL_DEFS.find(function(d){return d.key===m.meal;}) || {label:'meal'}).label;
  return (
    '<div class="modal-overlay">' +
      '<div class="modal">' +
        '<div class="modal__head"><h3>Edit ' + mealLabel + ' item</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>' +
        '<div class="modal__body">' +
          '<div class="selected-food">' +
            '<div class="selected-food__name">' + esc(m.food.name) + '</div>' +
            '<div class="hint">' + esc(m.food.serving || '1 serving') + '</div>' +
            '<div class="portion-row"><span class="hint">Portions:</span>' + renderPortionSelector('modal', m.portionWhole, m.portionFrac) + '</div>' +
            '<div class="preview-row">' +
              '<span class="badge badge--kcal">' + scaled.kcal + ' kcal</span>' +
              '<span class="badge badge--protein">' + scaled.p + 'g protein</span>' +
              '<span class="badge badge--carb">' + scaled.c + 'g carbs</span>' +
              '<span class="badge badge--fat">' + scaled.f + 'g fat</span>' +
            '</div>' +
            (m.ingredients ? renderIngredientsView(m.ingredients) : '') +
            '<div style="display:flex;gap:8px;margin-top:14px;">' +
              '<button class="btn btn--primary" style="flex:1;" data-action="save-edit-entry" ' + (portion<=0?'disabled':'') + '>Save changes</button>' +
              '<button class="btn btn--danger" data-action="remove-entry-modal">Remove from log</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderSearchTab(m){
  return (
    '<div class="field"><label for="modal-search-input">Search your foods and common foods</label>' +
      '<input class="input" id="modal-search-input" placeholder="e.g. grilled chicken breast" autocomplete="off" value="' + esc(m.query) + '">' +
    '</div>' +
    '<div id="modal-search-results">' + renderSearchResults(m.results) + '</div>' +
    '<div id="selected-food-panel">' + (m.selected ? renderSelectedFoodPanel(m) : '') + '</div>' +
    '<p class="hint" style="margin-top:12px;">Can\'t find it? Switch to <strong>Build from ingredients</strong> to create it — it\'ll be saved for next time.</p>'
  );
}
function renderSearchResults(results){
  if (!results.yours.length && !results.common.length) return '';
  var html = '<div class="search-results">';
  if (results.yours.length){
    html += '<div class="search-group">Your foods</div>';
    html += results.yours.map(function(item){ return renderResultRow(item, 'lib'); }).join('');
  }
  if (results.common.length){
    html += '<div class="search-group">Common foods</div>';
    html += results.common.map(function(item){ return renderResultRow(item, 'db'); }).join('');
  }
  html += '</div>';
  return html;
}
function renderResultRow(item, source){
  return (
    '<div class="search-result" data-action="select-food" data-source="' + source + '" data-id="' + item.id + '">' +
      '<div><div class="search-result__name">' + esc(item.name) + '</div><div class="search-result__meta">' + esc(item.serving || '1 serving') + '</div></div>' +
      '<div class="search-result__kcal num">' + round(item.kcal) + ' kcal</div>' +
    '</div>'
  );
}
function renderSelectedFoodPanel(m){
  var food = m.selected;
  var portion = portionTotal(m.portionWhole, m.portionFrac);
  var scaled = scaleNutrition(food, portion || 0);
  return (
    '<div class="selected-food">' +
      '<div class="selected-food__name">' + esc(food.name) + '</div>' +
      '<div class="hint">' + esc(food.serving || '1 serving') + ' = ' + round(food.kcal) + ' kcal</div>' +
      '<div class="portion-row">' +
        '<span class="hint">Portions:</span>' + renderPortionSelector('modal', m.portionWhole, m.portionFrac) +
      '</div>' +
      '<div class="preview-row">' +
        '<span class="badge badge--kcal">' + scaled.kcal + ' kcal</span>' +
        '<span class="badge badge--protein">' + scaled.p + 'g protein</span>' +
        '<span class="badge badge--carb">' + scaled.c + 'g carbs</span>' +
        '<span class="badge badge--fat">' + scaled.f + 'g fat</span>' +
      '</div>' +
      '<div style="margin-top:14px;"><button class="btn btn--primary btn--block" data-action="confirm-add" ' + (portion<=0?'disabled':'') + '>Add to ' + (MEAL_DEFS.find(function(d){return d.key===UI.modal.meal;})||{label:'meal'}).label + '</button></div>' +
    '</div>'
  );
}
function renderPortionSelector(prefix, whole, fracKey){
  var wholeOpts = [0,1,2,3,4,5,6,7,8].map(function(n){ return '<option value="' + n + '" ' + (n===whole?'selected':'') + '>' + n + '</option>'; }).join('');
  var fracOpts = PORTION_FRACTIONS.map(function(f){ return '<option value="' + f.key + '" ' + (f.key===fracKey?'selected':'') + '>' + f.label + '</option>'; }).join('');
  return (
    '<select class="select" id="' + prefix + '-portion-whole" style="width:auto;">' + wholeOpts + '</select> +' +
    '<select class="select" id="' + prefix + '-portion-frac" style="width:auto;">' + fracOpts + '</select>'
  );
}

function renderBuildTab(m){
  var b = m.build;
  var totals = computeBuildTotals(b.rows);
  var portion = portionTotal(b.portionWhole, b.portionFrac);
  var scaled = scaleNutrition(totals, portion || 0);
  return (
    '<div class="field"><label for="build-name-input">Food name</label>' +
      '<input class="input" id="build-name-input" placeholder="e.g. My chicken salad" value="' + esc(b.name) + '"></div>' +
    '<div style="margin-top:14px;"><label class="hint" style="display:block;margin-bottom:8px;">Ingredients (from our ingredient list, by weight)</label>' +
      '<div id="ingredient-rows">' + b.rows.map(function(row, i){ return renderIngredientRow(row, i); }).join('') + '</div>' +
      '<button class="btn btn--sm btn--ghost" data-action="add-ing-row">+ Add ingredient</button>' +
    '</div>' +
    '<div class="preview-row" style="margin-top:14px;" id="build-totals">' +
      '<span class="badge badge--kcal num">' + round(totals.kcal) + ' kcal total</span>' +
      '<span class="badge badge--protein">' + totals.p + 'g protein</span>' +
      '<span class="badge badge--carb">' + totals.c + 'g carbs</span>' +
      '<span class="badge badge--fat">' + totals.f + 'g fat</span>' +
    '</div>' +
    '<div class="portion-row" style="margin-top:14px;"><span class="hint">This makes:</span>' + renderPortionSelector('build', b.portionWhole, b.portionFrac) + '<span class="hint">portion(s) to log now</span></div>' +
    '<div class="preview-row" style="margin-top:8px;">' +
      '<span class="badge badge--kcal">= ' + scaled.kcal + ' kcal</span>' +
    '</div>' +
    '<div style="margin-top:16px;"><button class="btn btn--primary btn--block" data-action="save-build" ' + (!b.name.trim() || totals.kcal<=0 || portion<=0 ? 'disabled':'') + '>Save food &amp; add to log</button></div>'
  );
}
function renderIngredientRow(row, i){
  var suggestions = row.query && !row.ingredientId ? searchIngredients(row.query) : [];
  return (
    '<div class="ingredient-row" data-row="' + i + '">' +
      '<div style="position:relative;">' +
        '<input class="input" id="ing-search-' + i + '" placeholder="Search ingredient…" autocomplete="off" value="' + esc(row.ingredientName || row.query) + '">' +
        (suggestions.length ? '<div class="ingredient-row__result" id="ing-results-' + i + '">' + suggestions.map(function(ing){
          return '<div data-action="pick-ingredient" data-idx="' + i + '" data-ing="' + ing.id + '">' + esc(ing.name) + '</div>';
        }).join('') + '</div>' : '') +
      '</div>' +
      '<input class="input" type="number" min="0" step="1" id="ing-grams-' + i + '" placeholder="grams" value="' + (row.grams || '') + '">' +
      (row.ingredientId ? '<label class="ingredient-raw"><input type="checkbox" id="ing-raw-' + i + '" ' + (row.raw?'checked':'') + '> Raw</label>' : '<span></span>') +
      '<button class="icon-btn" data-action="remove-ing-row" data-idx="' + i + '" aria-label="Remove ingredient">&times;</button>' +
    '</div>'
  );
}
/* ================= rendering: Wizard (goal setup) ================= */
function defaultWizardDraft(){
  return { sex:'female', age:'', heightCm:'', weight:'', targetWeight:'', activity:'sedentary' };
}
function draftFromProfile(profile){
  return {
    sex: profile.sex, age: profile.age || '', activity: profile.activity,
    heightCm: profile.heightCm || '',
    weight: displayWeight(profile.currentWeightKg),
    targetWeight: displayWeight(profile.targetWeightKg)
  };
}
function renderWizardScreen(){
  var editing = !!UI.editingGoal;
  if (!UI.wizardDraft) UI.wizardDraft = editing ? draftFromProfile(STATE.profile) : defaultWizardDraft();
  var step = UI.wizardStep || 'form';
  return (
    '<div class="main"><div class="container wizard">' +
      '<div class="view-head"><div><h1>' + (editing ? 'Update your goal' : 'Set up your goal') + '</h1>' +
      '<p>' + (step==='form' ? 'A few details so we can work out the right calorie target for you.' : 'Choose the pace that fits you.') + '</p></div>' +
      (editing ? '<button class="btn btn--ghost" data-action="cancel-edit-goal">Cancel</button>' : '') +
      '</div>' +
      (step === 'form' ? renderWizardForm() : renderWizardPace()) +
      '<div id="save-status-host"></div>' +
    '</div></div>'
  );
}
function renderWizardForm(){
  var d = UI.wizardDraft;
  return (
    '<div class="card stack">' +
      '<div class="grid-2">' +
        '<div class="field"><label for="wiz-sex">Biological sex</label>' +
          '<select class="select" id="wiz-sex"><option value="female" ' + (d.sex==='female'?'selected':'') + '>Female</option><option value="male" ' + (d.sex==='male'?'selected':'') + '>Male</option></select>' +
          '<span class="hint">Used only for the calorie formula.</span></div>' +
        '<div class="field"><label for="wiz-age">Age</label><input class="input" type="number" min="14" max="100" id="wiz-age" value="' + esc(d.age) + '"></div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="field"><label for="wiz-height-cm">Height (cm)</label><input class="input" type="number" min="120" max="230" id="wiz-height-cm" value="' + esc(d.heightCm) + '"></div>' +
        '<div class="field"><label for="wiz-activity">Activity level</label><select class="select" id="wiz-activity">' +
          Object.keys(ACTIVITY_LABELS).map(function(k){ return '<option value="' + k + '" ' + (d.activity===k?'selected':'') + '>' + ACTIVITY_LABELS[k] + '</option>'; }).join('') +
        '</select></div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="field"><label for="wiz-weight">Current weight (kg)</label><input class="input" type="number" min="0" step="0.1" id="wiz-weight" value="' + esc(d.weight) + '"></div>' +
        '<div class="field"><label for="wiz-target-weight">Target weight (kg)</label><input class="input" type="number" min="0" step="0.1" id="wiz-target-weight" value="' + esc(d.targetWeight) + '"></div>' +
      '</div>' +
      '<div id="wizard-error" class="hint" style="color:var(--danger);"></div>' +
      '<button class="btn btn--primary" data-action="wizard-continue">See my options</button>' +
    '</div>'
  );
}
function renderWizardPace(){
  var options = UI.wizardPaceOptions || [];
  return (
    '<div class="card">' +
      '<button class="btn btn--ghost btn--sm" data-action="wizard-back">&#8249; Back</button>' +
      '<div class="pace-grid">' + options.map(function(opt){
        return (
          '<div class="pace-card" data-action="select-pace" data-key="' + opt.key + '">' +
            '<h4>' + opt.label + '</h4>' +
            '<div class="kcal num">' + opt.dailyKcal + '</div><div class="hint">kcal / day</div>' +
            '<div class="sub">' + esc(opt.blurb) + '</div>' +
            (opt.goalDays > 0 ? '<div class="sub" style="margin-top:6px;">Goal by <strong>' + formatDateShort(opt.goalDate) + '</strong> (' + Math.round(opt.goalDays/7) + ' weeks)</div>' : '') +
            (opt.clamped ? '<div class="warn">Capped at a safe minimum calorie level.</div>' : '') +
          '</div>'
        );
      }).join('') + '</div>' +
    '</div>'
  );
}

/* ================= rendering: Progress ================= */
function renderProgress(){
  var p = STATE.profile;
  var last = STATE.weightLog.length ? STATE.weightLog[STATE.weightLog.length-1] : null;
  var currentKg = last ? last.weightKg : p.currentWeightKg;
  var toGoKg = Math.abs((p.targetWeightKg||0) - currentKg);
  var goalDateLabel = p.goalDays > 0 ? formatDateShort(addDaysISO(p.startDate || todayISO(), p.goalDays)) : '—';
  return (
    '<div class="view-head"><div><h1>Progress &amp; goal</h1><p>Started ' + (p.startDate ? formatDateShort(p.startDate) : '—') + '</p></div>' +
      '<button class="btn btn--ghost" data-action="edit-goal">Edit goal</button>' +
    '</div>' +
    '<div class="stack">' +
      '<div class="stat-grid">' +
        '<div class="stat-tile"><div class="label">Current weight</div><div class="value num">' + displayWeight(currentKg) + ' kg</div></div>' +
        '<div class="stat-tile"><div class="label">Target weight</div><div class="value num">' + displayWeight(p.targetWeightKg) + ' kg</div></div>' +
        '<div class="stat-tile"><div class="label">Remaining</div><div class="value num">' + Math.round(displayWeight(toGoKg)*10)/10 + ' kg</div></div>' +
        '<div class="stat-tile"><div class="label">On track for</div><div class="value">' + goalDateLabel + '</div></div>' +
      '</div>' +
      '<div class="card">' +
        '<h3 style="margin-bottom:12px;">Weigh in</h3>' +
        '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;">' +
          '<div class="field" style="max-width:160px;"><label for="weight-today-input">Weight today (kg)</label><input class="input" type="number" step="0.1" id="weight-today-input" value="' + (last ? displayWeight(last.weightKg) : '') + '"></div>' +
          '<button class="btn btn--primary" data-action="log-weight">Save weigh-in</button>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<h3>Weight trend</h3>' +
        '<div class="chart-wrap">' + renderWeightChart() + '</div>' +
      '</div>' +
    '</div>'
  );
}
function renderWeightChart(){
  var log = STATE.weightLog;
  var p = STATE.profile;
  if (log.length < 1) return '<p class="hint">Log a few weigh-ins to see your trend.</p>';
  var w = 720, h = 220, padL = 40, padR = 16, padT = 16, padB = 28;
  var startDate = p.startDate || log[0].date;
  var endDate = p.goalDays > 0 ? addDaysISO(startDate, p.goalDays) : log[log.length-1].date;
  var allDatesMs = log.map(function(pt){ return new Date(pt.date).getTime(); }).concat([new Date(startDate).getTime(), new Date(endDate).getTime()]);
  var minX = Math.min.apply(null, allDatesMs), maxX = Math.max.apply(null, allDatesMs);
  if (minX === maxX) maxX = minX + 86400000;
  var values = log.map(function(pt){ return displayWeight(pt.weightKg); });
  var goalVal = displayWeight(p.targetWeightKg);
  var allY = values.concat([goalVal]);
  var minY = Math.min.apply(null, allY) - 1, maxY = Math.max.apply(null, allY) + 1;
  function xPos(dateStr){ var t = new Date(dateStr).getTime(); return padL + ((t-minX)/(maxX-minX)) * (w-padL-padR); }
  function yPos(v){ return padT + (1 - (v-minY)/(maxY-minY)) * (h-padT-padB); }
  var linePoints = log.map(function(pt){ return xPos(pt.date) + ',' + yPos(displayWeight(pt.weightKg)); }).join(' ');
  var goalLineY1 = yPos(displayWeight(p.startWeightKg || p.currentWeightKg));
  var goalLineY2 = yPos(goalVal);
  var goalX1 = xPos(startDate), goalX2 = xPos(endDate);
  var dots = log.map(function(pt){ return '<circle cx="' + xPos(pt.date) + '" cy="' + yPos(displayWeight(pt.weightKg)) + '" r="4" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"></circle>'; }).join('');
  var lastPt = log[log.length-1];
  var lastLabel = '<text x="' + xPos(lastPt.date) + '" y="' + (yPos(displayWeight(lastPt.weightKg)) - 12) + '" text-anchor="middle" class="num" style="font-size:12px;fill:var(--ink);font-weight:600;">' + displayWeight(lastPt.weightKg) + '</text>';
  return (
    '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="220" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Weight trend chart">' +
      '<line x1="' + padL + '" y1="' + (h-padB) + '" x2="' + (w-padR) + '" y2="' + (h-padB) + '" stroke="var(--border)" stroke-width="1"></line>' +
      '<line x1="' + goalX1 + '" y1="' + goalLineY1 + '" x2="' + goalX2 + '" y2="' + goalLineY2 + '" stroke="var(--ink-faint)" stroke-width="1.5" stroke-dasharray="4 4"></line>' +
      '<polyline points="' + linePoints + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
      dots + lastLabel +
    '</svg>' +
    '<div class="chart-legend"><span><span class="legend-swatch" style="background:var(--accent);"></span>Your weight</span><span><span class="legend-swatch" style="background:var(--ink-faint);border-top:2px dashed var(--ink-faint);"></span>Goal path</span></div>'
  );
}

/* ================= rendering: Meal planner ================= */
function renderPlanner(){
  var maxCal = UI.plannerMaxCal || '';
  return (
    '<div class="view-head"><div><h1>Meal planner</h1><p>Get recipe ideas that fit your remaining calories.</p></div></div>' +
    '<div class="stack">' +
      '<div class="card stack">' +
        '<div class="grid-2">' +
          '<div class="field"><label for="planner-mode">Plan for</label><select class="select" id="planner-mode">' +
            '<option value="day" ' + (UI.plannerMeal==='day'?'selected':'') + '>Whole day (remaining meals)</option>' +
            MEAL_DEFS.map(function(m){ return '<option value="' + m.key + '" ' + (UI.plannerMeal===m.key?'selected':'') + '>' + m.label + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="field"><label for="planner-maxcal">Max calories' + (UI.plannerMeal==='day' ? ' per meal (optional)' : ' for this meal (optional)') + '</label>' +
            '<input class="input" type="number" min="0" id="planner-maxcal" placeholder="No limit" value="' + esc(maxCal) + '"></div>' +
        '</div>' +
        '<div class="field"><label>Preferred ingredients (up to 5)</label>' +
          '<div class="tag-field">' +
            UI.plannerTags.map(function(t,i){ return '<span class="chip">' + esc(t) + '<button data-action="remove-tag" data-idx="' + i + '">&times;</button></span>'; }).join('') +
            (UI.plannerTags.length < 5 ? '<input id="planner-tag-input" placeholder="Type and press Enter…">' : '') +
          '</div>' +
        '</div>' +
        '<div><button class="btn btn--primary" data-action="planner-suggest">Suggest meals</button></div>' +
      '</div>' +
      '<div>' + renderPlannerResults() + '</div>' +
    '</div>'
  );
}
function renderPlannerResults(){
  var r = UI.plannerResults;
  if (!r) return '';
  if (r.mode === 'meal'){
    if (!r.suggestions.length) return '<div class="card empty-hero"><h2>No matches</h2><p>Try a higher calorie limit or fewer preferred ingredients.</p></div>';
    return '<div class="stack">' + r.suggestions.map(function(s){ return renderRecipeCard(s.recipe, s.matchCount, r.meal); }).join('') + '</div>';
  }
  return '<div class="stack">' + r.groups.map(function(g){
    return (
      '<div><h3 style="margin-bottom:10px;">' + g.mealLabel + (g.budget ? ' <span class="hint" style="font-weight:400;">— about ' + g.budget + ' kcal</span>' : '') + '</h3>' +
      '<div class="stack">' + (g.suggestions.length ? g.suggestions.map(function(s){ return renderRecipeCard(s.recipe, s.matchCount, g.meal); }).join('') : '<div class="card"><p class="hint">No matches for this meal — try loosening the calorie limit.</p></div>') + '</div></div>'
    );
  }).join('') + '</div>';
}
function renderRecipeCard(recipe, matchCount, logMealKey){
  return (
    '<div class="recipe-card">' +
      '<div class="recipe-card__head">' +
        '<div><div class="recipe-card__name">' + esc(recipe.name) + '</div>' +
        '<div class="recipe-card__badges">' +
          '<span class="badge badge--kcal">' + recipe.kcal + ' kcal</span>' +
          '<span class="badge badge--protein">' + recipe.p + 'g protein</span>' +
          '<span class="badge badge--carb">' + recipe.c + 'g carbs</span>' +
          '<span class="badge badge--fat">' + recipe.f + 'g fat</span>' +
        '</div></div>' +
        (matchCount > 0 ? '<span class="match-badge">' + matchCount + ' match' + (matchCount>1?'es':'') + '</span>' : '') +
      '</div>' +
      '<div class="recipe-card__ing"><strong>Ingredients:</strong> ' + recipe.ing.map(esc).join(', ') + '<br><strong>Method:</strong> ' + recipe.steps.map(esc).join(' ') + '</div>' +
      '<div class="recipe-card__foot"><span class="hint"></span><button class="btn btn--primary btn--sm" data-action="add-recipe" data-id="' + recipe.id + '" data-meal="' + logMealKey + '">Add to today’s log</button></div>' +
    '</div>'
  );
}
function suggestForMeal(mealKey, tags, maxCal){
  var candidates = RECIPES_DB.filter(function(r){ return r.meals.indexOf(mealKey) > -1; });
  if (maxCal) candidates = candidates.filter(function(r){ return r.kcal <= maxCal; });
  var scored = candidates.map(function(r){
    var score = 0;
    tags.forEach(function(tag){
      var t = norm(tag);
      if (!t) return;
      if (r.ing.some(function(ingStr){ return norm(ingStr).indexOf(t) > -1; })) score += 1;
    });
    return { recipe:r, score:score };
  });
  scored.sort(function(a,b){ return (b.score - a.score) || (a.recipe.kcal - b.recipe.kcal); });
  return scored.slice(0, 4).map(function(s){ return { recipe:s.recipe, matchCount:s.score }; });
}
function runPlannerSuggest(){
  var tags = UI.plannerTags;
  var maxCal = UI.plannerMaxCal ? Number(UI.plannerMaxCal) : null;
  if (UI.plannerMeal === 'day'){
    var iso = todayISO();
    var totals = dayTotals(iso);
    var remaining = Math.max(0, STATE.profile.dailyCalorieTarget - totals.kcal);
    var day = ensureDay(iso);
    var remainingMeals = MEAL_DEFS.filter(function(m){ return day[m.key].length === 0; });
    if (!remainingMeals.length) remainingMeals = MEAL_DEFS.slice();
    var weights = { breakfast:0.25, lunch:0.3, dinner:0.35, snacks:0.1 };
    var totalWeight = remainingMeals.reduce(function(s,m){ return s + weights[m.key]; }, 0) || 1;
    var groups = remainingMeals.map(function(m){
      var budget = Math.round(remaining * (weights[m.key]/totalWeight));
      var cap = maxCal ? Math.min(maxCal, budget || maxCal) : (budget || null);
      var mealKeyForRecipe = m.key === 'snacks' ? 'snack' : m.key;
      var suggestions = suggestForMeal(mealKeyForRecipe, tags, cap);
      if (!suggestions.length) suggestions = suggestForMeal(mealKeyForRecipe, tags, null).slice(0,2);
      return { meal:m.key, mealLabel:m.label, budget:budget, suggestions:suggestions };
    });
    UI.plannerResults = { mode:'day', groups:groups };
  } else {
    var mealKeyForRecipe = UI.plannerMeal === 'snacks' ? 'snack' : UI.plannerMeal;
    var suggestions = suggestForMeal(mealKeyForRecipe, tags, maxCal);
    UI.plannerResults = { mode:'meal', meal:UI.plannerMeal,
      mealLabel:(MEAL_DEFS.find(function(d){return d.key===UI.plannerMeal;})||{label:'Meal'}).label, suggestions:suggestions };
  }
  render();
}
function addRecipeToLog(recipeId, mealKey){
  var recipe = RECIPES_DB.find(function(r){ return r.id === recipeId; });
  if (!recipe) return;
  var baseFood = { name: recipe.name, serving:'1 serving (recipe)', kcal: recipe.kcal, p: recipe.p, c: recipe.c, f: recipe.f };
  addLogEntry(todayISO(), mealKey === 'snack' ? 'snacks' : mealKey, baseFood, 1);
}

/* ================= event handling ================= */
function handleSelectFood(source, id){
  var item = source === 'lib' ? STATE.library.find(function(i){ return i.id === id; }) : FOODS_DB.find(function(i){ return i.id === id; });
  if (!item) return;
  UI.modal.selected = item; UI.modal.portionWhole = 1; UI.modal.portionFrac = '0';
  render();
}
function handleConfirmAdd(){
  var m = UI.modal;
  if (!m.selected) return;
  var portion = portionTotal(m.portionWhole, m.portionFrac);
  if (portion <= 0) return;
  addLogEntry(UI.selectedDate, m.meal, m.selected, portion);
  closeAddModal();
}
function removeIngRow(idx){
  var rows = UI.modal.build.rows;
  if (rows.length <= 1) rows[idx] = { ingredientId:null, ingredientName:'', grams:100, query:'', raw:false };
  else rows.splice(idx, 1);
  render();
}
function pickIngredient(idx, ingId){
  var ing = INGREDIENTS_DB.find(function(i){ return i.id === ingId; });
  if (!ing) return;
  var row = UI.modal.build.rows[idx];
  row.ingredientId = ing.id; row.ingredientName = ing.name; row.query = ''; row.raw = false;
  render();
  PENDING_FOCUS = 'ing-grams-' + idx;
}
function handleSaveBuild(){
  var b = UI.modal.build;
  var nameInput = document.getElementById('build-name-input');
  var name = ((nameInput && nameInput.value) || b.name || '').trim();
  if (!name) return;
  var validRows = b.rows.filter(function(r){ return r.ingredientId && r.grams; });
  var totals = computeBuildTotals(validRows);
  if (totals.kcal <= 0) return;
  var portion = portionTotal(b.portionWhole, b.portionFrac);
  if (portion <= 0) return;
  var saved = saveBuiltFood(name, validRows);
  addLogEntry(UI.selectedDate, UI.modal.meal, saved.item, portion, false);
  closeAddModal();
}
function readWizardFormIntoDraft(){
  var d = UI.wizardDraft;
  d.sex = document.getElementById('wiz-sex').value;
  d.age = document.getElementById('wiz-age').value;
  d.activity = document.getElementById('wiz-activity').value;
  d.heightCm = document.getElementById('wiz-height-cm').value;
  d.weight = document.getElementById('wiz-weight').value;
  d.targetWeight = document.getElementById('wiz-target-weight').value;
}
function handleWizardContinue(){
  readWizardFormIntoDraft();
  var d = UI.wizardDraft;
  var errEl = document.getElementById('wizard-error');
  var heightCm = Number(d.heightCm);
  var weightKg = Number(d.weight);
  var targetKg = Number(d.targetWeight);
  var age = Number(d.age);
  if (!heightCm || heightCm < 100 || heightCm > 250 || !weightKg || weightKg <= 0 || !targetKg || targetKg <= 0 || !age || age < 14 || age > 100){
    if (errEl) errEl.textContent = 'Please fill in every field with a realistic value.';
    return;
  }
  if (errEl) errEl.textContent = '';
  var draftProfile = {
    sex: d.sex, age: age, heightCm: Math.round(heightCm),
    currentWeightKg: Math.round(weightKg*10)/10, targetWeightKg: Math.round(targetKg*10)/10, activity: d.activity
  };
  UI.wizardProfileDraft = draftProfile;
  UI.wizardPaceOptions = calcPaceOptions(draftProfile);
  UI.wizardStep = 'pace';
  render();
}
function handleSelectPace(key){
  var opt = (UI.wizardPaceOptions || []).find(function(o){ return o.key === key; });
  if (!opt) return;
  selectPaceAndSave(opt, UI.wizardProfileDraft);
  UI.editingGoal = false; UI.wizardDraft = null; UI.wizardStep = 'form'; UI.wizardPaceOptions = null;
}
function handleLogWeight(){
  var el = document.getElementById('weight-today-input');
  if (!el || !el.value) return;
  var val = Number(el.value);
  if (!val || val <= 0) return;
  logWeightToday(Math.round(val*10)/10);
}
function updateBuildTotalsDisplay(){
  var totals = computeBuildTotals(UI.modal.build.rows);
  var portion = portionTotal(UI.modal.build.portionWhole, UI.modal.build.portionFrac);
  var scaled = scaleNutrition(totals, portion || 0);
  var el = document.getElementById('build-totals');
  if (el) el.innerHTML =
    '<span class="badge badge--kcal num">' + round(totals.kcal) + ' kcal total</span>' +
    '<span class="badge badge--protein">' + totals.p + 'g protein</span>' +
    '<span class="badge badge--carb">' + totals.c + 'g carbs</span>' +
    '<span class="badge badge--fat">' + totals.f + 'g fat</span>';
  var saveBtn = document.querySelector('[data-action="save-build"]');
  var nameVal = (document.getElementById('build-name-input') || {}).value;
  if (saveBtn) saveBtn.disabled = !nameVal || totals.kcal <= 0 || portion <= 0;
}

function onAppClick(e){
  if (e.target.classList && e.target.classList.contains('modal-overlay')){ closeAddModal(); return; }
  var actionEl = e.target.closest && e.target.closest('[data-action]');
  if (!actionEl) return;
  var action = actionEl.getAttribute('data-action');
  switch(action){
    case 'select-account': selectAccount(actionEl.getAttribute('data-id')); break;
    case 'start-create-account': CREATE_ACCOUNT = {name:'',avatar:0}; ACCOUNT_SCREEN = 'create'; PENDING_FOCUS='account-name-input'; render(); break;
    case 'cancel-create-account': ACCOUNT_SCREEN = 'select'; render(); break;
    case 'choose-avatar': CREATE_ACCOUNT.avatar = Number(actionEl.getAttribute('data-avatar')); render(); break;
    case 'create-account': createAccount(); break;
    case 'open-account-details': openAccountDetails(); break;
    case 'close-account-details': ACCOUNT_SCREEN = 'app'; render(); break;
    case 'choose-edit-avatar': EDIT_ACCOUNT.avatar = Number(actionEl.getAttribute('data-avatar')); render(); break;
    case 'save-account-details': saveAccountDetails(); break;
    case 'sign-out': signOut(); break;
    case 'confirm-delete-account':
      if (window.confirm('Delete ' + ((activeAccount() || {}).name || 'this account') + '? This permanently removes its goals, meal plans and food history from this browser.')) deleteActiveAccount();
      break;
    case 'nav': UI.activeView = actionEl.getAttribute('data-view'); render(); break;
    case 'date-prev': UI.selectedDate = addDaysISO(UI.selectedDate, -1); render(); break;
    case 'date-next': UI.selectedDate = addDaysISO(UI.selectedDate, 1); render(); break;
    case 'open-add': openAddModal(actionEl.getAttribute('data-meal')); break;
    case 'close-modal': closeAddModal(); break;
    case 'modal-tab': UI.modal.tab = actionEl.getAttribute('data-tab'); render(); break;
    case 'select-food': handleSelectFood(actionEl.getAttribute('data-source'), actionEl.getAttribute('data-id')); break;
    case 'confirm-add': handleConfirmAdd(); break;
    case 'remove-entry': removeLogEntry(UI.selectedDate, actionEl.getAttribute('data-meal'), actionEl.getAttribute('data-id')); break;
    case 'edit-entry': openEditEntryModal(actionEl.getAttribute('data-meal'), actionEl.getAttribute('data-id')); break;
    case 'save-edit-entry': handleSaveEditEntry(); break;
    case 'remove-entry-modal': removeLogEntry(UI.selectedDate, UI.modal.meal, UI.modal.entryId); closeAddModal(); break;
    case 'add-ing-row': UI.modal.build.rows.push({ ingredientId:null, ingredientName:'', grams:100, query:'', raw:false }); PENDING_FOCUS = 'ing-search-' + (UI.modal.build.rows.length-1); render(); break;
    case 'remove-ing-row': removeIngRow(Number(actionEl.getAttribute('data-idx'))); break;
    case 'pick-ingredient': pickIngredient(Number(actionEl.getAttribute('data-idx')), actionEl.getAttribute('data-ing')); break;
    case 'save-build': handleSaveBuild(); break;
    case 'wizard-continue': handleWizardContinue(); break;
    case 'wizard-back': UI.wizardStep = 'form'; render(); break;
    case 'select-pace': handleSelectPace(actionEl.getAttribute('data-key')); break;
    case 'edit-goal': UI.editingGoal = true; UI.wizardDraft = null; UI.wizardStep = 'form'; render(); break;
    case 'cancel-edit-goal': UI.editingGoal = false; UI.wizardDraft = null; render(); break;
    case 'log-weight': handleLogWeight(); break;
    case 'remove-tag': UI.plannerTags.splice(Number(actionEl.getAttribute('data-idx')), 1); render(); break;
    case 'planner-suggest': runPlannerSuggest(); break;
    case 'add-recipe': addRecipeToLog(actionEl.getAttribute('data-id'), actionEl.getAttribute('data-meal')); break;
  }
}
function onAppInput(e){
  var id = e.target.id;
  if (!id) return;
  if (id === 'account-name-input'){
    CREATE_ACCOUNT.name = e.target.value;
    var createBtn = document.querySelector('[data-action="create-account"]');
    if (createBtn) createBtn.disabled = !CREATE_ACCOUNT.name.trim();
    return;
  }
  if (id === 'edit-account-name-input'){
    EDIT_ACCOUNT.name = e.target.value;
    var saveAccountBtn = document.querySelector('[data-action="save-account-details"]');
    if (saveAccountBtn) saveAccountBtn.disabled = !EDIT_ACCOUNT.name.trim();
    return;
  }
  if (id === 'modal-search-input'){
    UI.modal.query = e.target.value;
    UI.modal.results = searchFoods(UI.modal.query);
    UI.modal.selected = null;
    var resEl = document.getElementById('modal-search-results');
    if (resEl) resEl.innerHTML = renderSearchResults(UI.modal.results);
    var selEl = document.getElementById('selected-food-panel');
    if (selEl) selEl.innerHTML = '';
    return;
  }
  if (id === 'build-name-input'){ UI.modal.build.name = e.target.value; updateBuildTotalsDisplay(); return; }
  if (id.indexOf('ing-search-') === 0){
    var idx = Number(id.slice('ing-search-'.length));
    var row = UI.modal.build.rows[idx];
    row.query = e.target.value; row.ingredientId = null; row.ingredientName = ''; row.raw = false;
    var wrap = e.target.parentElement;
    var existing = document.getElementById('ing-results-' + idx);
    if (existing) existing.remove();
    var suggestions = row.query ? searchIngredients(row.query) : [];
    if (suggestions.length){
      var html = '<div class="ingredient-row__result" id="ing-results-' + idx + '">' + suggestions.map(function(ing){
        return '<div data-action="pick-ingredient" data-idx="' + idx + '" data-ing="' + ing.id + '">' + esc(ing.name) + '</div>';
      }).join('') + '</div>';
      wrap.insertAdjacentHTML('beforeend', html);
    }
    return;
  }
  if (id.indexOf('ing-grams-') === 0){
    var idx2 = Number(id.slice('ing-grams-'.length));
    UI.modal.build.rows[idx2].grams = Number(e.target.value) || 0;
    updateBuildTotalsDisplay();
    return;
  }
  if (id === 'planner-maxcal'){ UI.plannerMaxCal = e.target.value; return; }
}
function onAppChange(e){
  var id = e.target.id;
  if (!id) return;
  if (id.indexOf('ing-raw-') === 0){
    var rawIdx = Number(id.slice('ing-raw-'.length));
    UI.modal.build.rows[rawIdx].raw = !!e.target.checked;
    updateBuildTotalsDisplay();
    return;
  }
  if (id === 'modal-portion-whole'){ UI.modal.portionWhole = Number(e.target.value); render(); return; }
  if (id === 'modal-portion-frac'){ UI.modal.portionFrac = e.target.value; render(); return; }
  if (id === 'build-portion-whole'){ UI.modal.build.portionWhole = Number(e.target.value); render(); return; }
  if (id === 'build-portion-frac'){ UI.modal.build.portionFrac = e.target.value; render(); return; }
  if (id === 'planner-mode'){ UI.plannerMeal = e.target.value; render(); return; }
}
function onAppKeydown(e){
  if (e.target && e.target.id === 'planner-tag-input' && (e.key === 'Enter' || e.key === ',')){
    e.preventDefault();
    var val = e.target.value.trim().replace(/,$/, '');
    if (val && UI.plannerTags.length < 5 && UI.plannerTags.indexOf(val) === -1){
      UI.plannerTags.push(val);
      PENDING_FOCUS = 'planner-tag-input';
      render();
    }
    return;
  }
  if (e.key === 'Escape' && UI.modal){ closeAddModal(); }
}

/* ================= init ================= */
function init(){
  STATE = loadInitialState();
  migrateState();
  loadAccountRegistry();
  ACCOUNT_SCREEN = 'select';
  UI.selectedDate = todayISO();
  var appEl = document.getElementById('app');
  appEl.addEventListener('click', onAppClick);
  appEl.addEventListener('input', onAppInput);
  appEl.addEventListener('change', onAppChange);
  appEl.addEventListener('keydown', onAppKeydown);
  render();
  initPersistence();
}
function computeBuildTotals(rows){
  var t = { kcal:0, p:0, c:0, f:0 };
  rows.forEach(function(row){
    var ing = INGREDIENTS_DB.find(function(i){ return i.id === row.ingredientId; });
    if (!ing || !row.grams) return;
    var nutrition = row.raw && ing.raw ? ing.raw : ing;
    var factor = row.grams / 100;
    t.kcal += nutrition.kcal * factor; t.p += nutrition.p * factor; t.c += nutrition.c * factor; t.f += nutrition.f * factor;
  });
  return { kcal: round(t.kcal), p: Math.round(t.p*10)/10, c: Math.round(t.c*10)/10, f: Math.round(t.f*10)/10 };
}
init();
