(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalPages = parseFloat(document.getElementById('totalPages').value) || 0;
    var pagesPerSig = document.getElementById('pagesPerSig').value;
    var paperW = parseFloat(document.getElementById('paperW').value) || 0;
    var paperH = parseFloat(document.getElementById('paperH').value) || 0;

    // Calculation logic
    var pps = parseInt(pagesPerSig); var sigs = Math.ceil(totalPages / pps); var roundedPages = sigs * pps; var blanks = roundedPages - totalPages; var sheetsPerSig = pps / 4; var totalSheets = sigs * sheetsPerSig; var sheetW = paperW * 2 + 0.25; var sheetH = paperH + 0.25; document.getElementById('signatures').textContent = sigs; document.getElementById('sheets').textContent = totalSheets + ' sheets'; document.getElementById('sheetSize').textContent = fmt(sheetW, 2) + ' x ' + fmt(sheetH, 2) + ' in'; document.getElementById('blankPages').textContent = blanks;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalPages', 'pagesPerSig', 'paperW', 'paperH'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
