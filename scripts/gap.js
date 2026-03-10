const l = require("../data/master-tool-list.json");
const fs = require("fs");
const c = fs.readdirSync("sites/configs").filter(f => f.endsWith(".json")).map(f => f.replace(".json",""));
const missing = l.filter(t => !c.includes(t.slug));
const groups = {};
missing.forEach(t => {
  if (!groups[t.category]) groups[t.category] = [];
  groups[t.category].push(t.slug);
});
Object.keys(groups).forEach(cat => {
  console.log(`${cat} (${groups[cat].length}): ${groups[cat].join(", ")}`);
});
