(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalLabels = parseFloat(document.getElementById('totalLabels').value) || 0;
    var labelsPerSheet = document.getElementById('labelsPerSheet').value;
    var sheetPrice = parseFloat(document.getElementById('sheetPrice').value) || 0;
    var wastePct = parseFloat(document.getElementById('wastePct').value) || 0;

    // Calculation logic
    var lps = parseInt(labelsPerSheet);
    var adjustedLabels = Math.ceil(totalLabels * (1 + wastePct / 100));
    var sheets = Math.ceil(adjustedLabels / lps);
    var totalAvailable = sheets * lps;
    var leftover = totalAvailable - totalLabels;
    var cost = sheets * sheetPrice;
    document.getElementById('sheetsNeeded').textContent = fmt(sheets, 0) + ' sheets';
    document.getElementById('totalLabelsOnSheets').textContent = fmt(totalAvailable, 0);
    document.getElementById('leftoverLabels').textContent = fmt(leftover, 0);
    document.getElementById('totalCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalLabels', 'labelsPerSheet', 'sheetPrice', 'wastePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
