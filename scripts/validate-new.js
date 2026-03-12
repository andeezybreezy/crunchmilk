const fs = require('fs');
const path = require('path');
const customDir = 'sites/custom';
const batchDir = 'scripts/batches';
const batchFiles = ['comparison-tools','trucking-tools','wedding-tools','pet-tools','creator-tools','aviation-tools','seasonal-tools','debate-tools','translator-tools','prediction-tools','uk-tools','canada-tools','australia-tools','legal-document-tools'];

let total = 0, ok = 0, problems = [];

batchFiles.forEach(bf => {
  const defs = JSON.parse(fs.readFileSync(path.join(batchDir, bf + '.json'), 'utf8'));
  defs.forEach(tool => {
    total++;
    const slug = tool.slug;
    const jsPath = path.join(customDir, slug + '.js');
    const outPath = path.join('output', slug, 'index.html');

    if (fs.existsSync(jsPath) === false) { problems.push(slug + ': no JS'); return; }
    if (fs.existsSync(outPath) === false) { problems.push(slug + ': no output'); return; }

    const js = fs.readFileSync(jsPath, 'utf8');
    try { new Function(js); } catch(e) { problems.push(slug + ': SYNTAX ' + e.message); return; }

    if (js.includes('visible') === false) { problems.push(slug + ': no result visible'); return; }

    ok++;
  });
});

console.log('New tools: ' + total + ', OK: ' + ok + ', Problems: ' + problems.length);
if (problems.length > 0) problems.forEach(p => console.log('  ' + p));
else console.log('ALL NEW TOOLS PASS');
