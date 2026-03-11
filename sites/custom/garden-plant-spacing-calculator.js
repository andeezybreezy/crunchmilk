(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bedLength = parseFloat(document.getElementById('bedLength').value) || 0;
    var bedWidth = parseFloat(document.getElementById('bedWidth').value) || 0;
    var spacing = parseFloat(document.getElementById('spacing').value) || 0;

    // Calculation logic
    var spacingFt = spacing / 12; var rows = Math.floor(bedWidth / spacingFt); var plantsPerRow = Math.floor(bedLength / spacingFt); var totalPlants = rows * plantsPerRow;     document.getElementById('rows').textContent = fmt(rows,0);
    document.getElementById('plantsPerRow').textContent = fmt(plantsPerRow,0);
    document.getElementById('totalPlants').textContent = fmt(totalPlants,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bedLength', 'bedWidth', 'spacing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
