(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sheetW = parseFloat(document.getElementById('sheetW').value) || 0;
    var sheetH = parseFloat(document.getElementById('sheetH').value) || 0;
    var sheetCost = parseFloat(document.getElementById('sheetCost').value) || 0;
    var cutW = parseFloat(document.getElementById('cutW').value) || 0;
    var cutH = parseFloat(document.getElementById('cutH').value) || 0;
    var numParts = parseFloat(document.getElementById('numParts').value) || 0;
    var kerf = parseFloat(document.getElementById('kerf').value) || 0;

    // Calculation logic
    var effW = cutW + kerf; var effH = cutH + kerf; var opt1 = Math.floor(sheetW / effW) * Math.floor(sheetH / effH); var opt2 = Math.floor(sheetW / effH) * Math.floor(sheetH / effW); var pps = Math.max(opt1, opt2); var sheets = Math.ceil(numParts / pps); var totalArea = sheets * sheetW * sheetH; var usedArea = numParts * cutW * cutH; var wastePct = ((totalArea - usedArea) / totalArea) * 100; var cost = sheets * sheetCost; document.getElementById('partsPerSheet').textContent = pps; document.getElementById('sheetsNeeded').textContent = sheets + ' sheets'; document.getElementById('totalCost').textContent = dollar(cost); document.getElementById('waste').textContent = fmt(wastePct, 1) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sheetW', 'sheetH', 'sheetCost', 'cutW', 'cutH', 'numParts', 'kerf'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
