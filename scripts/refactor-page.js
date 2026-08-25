const fs = require('fs');

const html = fs.readFileSync('portion.html', 'utf8');
const style = (html.match(/<style id="app-style">([\s\S]*?)<\/style>/) || [])[1];
const state = (html.match(/<script id="state-data" type="application\/json">([\s\S]*?)<\/script>/) || [])[1];
const script = (html.match(/<script>\n([\s\S]*?)\n<\/script>\s*$/) || [])[1];

if (!style || !state || !script) throw new Error('Could not parse portion.html');

const dataStart = script.indexOf('/* ================= bundled nutrition data');
const foodsStart = script.indexOf('var FOODS_DB = [');
if (dataStart < 0 || foodsStart < 0) throw new Error('Could not locate ingredient data');

const ingredients = script.slice(dataStart, foodsStart).trim() + '\n';
let app = script.slice(0, dataStart) + script.slice(foodsStart);

app = app.replace(
  "/* ---- capture own source for self-publish reconstruction ---- */\nvar SCRIPT_TEXT = document.currentScript.textContent;\nvar STYLE_TEXT = document.getElementById('app-style').textContent;\n\n",
  ''
);

app = app.replace(
  /var PERSIST_MODE = 'none';[\s\S]*?function persistLocal\(\)\{/,
  "var saveStatus = 'local';\nvar LOCAL_KEY = 'portion_state_v1';\nvar ACCOUNTS_KEY = 'portion_accounts_v1';\n" +
  "function accountStateKey(id){ return 'portion_state_account_' + id; }\n" +
  app.match(/function loadAccountRegistry\(\)[\s\S]*?function createAccount\(\)[\s\S]*?\n\}/)[0] +
  "\n\nvar scheduleSave = debounce(persistLocal, 1200);\nfunction persist(){ persistLocal(); }\nfunction persistLocal(){"
);

app = app.replace(
  /function initPersistence\(\)\{[\s\S]*?\n\}\nfunction loadFromLocalIfPresent\(\)\{/,
  "function initPersistence(){\n  loadFromLocalIfPresent();\n  saveStatus = 'local';\n  render();\n}\nfunction loadFromLocalIfPresent(){"
);

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('styles.css', style.trim() + '\n');
fs.writeFileSync('data/ingredients.js', ingredients);
fs.writeFileSync('app.js', app.trim() + '\n');

const shell = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portion</title>
  <meta name="description" content="A personal calorie, macro and meal planner.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script id="state-data" type="application/json">${state}</script>
  <script src="data/ingredients.js"></script>
  <script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync('portion.html', shell);
