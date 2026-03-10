const l = require("../data/master-tool-list.json");
const cats = {};
if (Array.isArray(l)) {
  l.forEach(t => { const c = t.category || "uncategorized"; if (!cats[c]) cats[c] = []; cats[c].push(t.slug); });
} else {
  Object.keys(l).forEach(k => { const c = l[k].category || "uncategorized"; if (!cats[c]) cats[c] = []; cats[c].push(k); });
}
Object.keys(cats).sort().forEach(c => console.log(`${c} (${cats[c].length}): ${cats[c].join(", ")}`));
