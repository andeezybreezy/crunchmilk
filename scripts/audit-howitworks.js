const fs = require("fs");
const path = require("path");
const configDir = path.join(__dirname, "..", "sites", "configs");
const configs = fs.readdirSync(configDir).filter(f => f.endsWith(".json"));
let hasContent = 0, empty = 0, noSection = 0;
let emptyList = [], contentList = [];
configs.forEach(f => {
  const c = JSON.parse(fs.readFileSync(path.join(configDir, f), "utf8"));
  const hw = c.howItWorks;
  if (hw === undefined || hw === null) {
    noSection++;
  } else if (
    (hw.intro === undefined || hw.intro === "") &&
    (hw.rules === undefined || hw.rules.length === 0) &&
    (hw.steps === undefined || hw.steps.length === 0)
  ) {
    empty++;
    emptyList.push(f.replace(".json", ""));
  } else {
    hasContent++;
    contentList.push(f.replace(".json", ""));
  }
});
console.log("Total configs:", configs.length);
console.log("Has howItWorks content:", hasContent);
console.log("Has howItWorks but BLANK:", empty);
console.log("No howItWorks section at all:", noSection);
console.log("---");
console.log("Sample with content:", contentList.slice(0, 5).join(", "));
console.log("---");
if (emptyList.length > 0) {
  console.log("All blank howItWorks (" + emptyList.length + "):");
  emptyList.forEach(s => console.log("  " + s));
}
