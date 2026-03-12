(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numPages = parseFloat(document.getElementById('numPages').value) || 0;
    var pagesPerSig = document.getElementById('pagesPerSig').value;
    var sheetCost = parseFloat(document.getElementById('sheetCost').value) || 0;

    // Calculation logic
    var pps = parseInt(pagesPerSig);
    var roundedPages = Math.ceil(numPages / pps) * pps;
    var blanks = roundedPages - numPages;
    var sigs = roundedPages / pps;
    var sheetsPerSig = pps / 4;
    var totalSheets = sigs * sheetsPerSig;
    var cost = totalSheets * sheetCost;
    document.getElementById('totalSheets').textContent = fmt(totalSheets, 0) + ' sheets';
    document.getElementById('signatures').textContent = fmt(sigs, 0);
    document.getElementById('blankPages').textContent = fmt(blanks, 0) + ' blank pages';
    document.getElementById('sheetsCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numPages', 'pagesPerSig', 'sheetCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
