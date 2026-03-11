(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var roofArea = parseFloat(document.getElementById('roofArea').value) || 0;
    var rainfall = parseFloat(document.getElementById('rainfall').value) || 0;
    var efficiency = parseFloat(document.getElementById('efficiency').value) || 0;

    // Calculation logic
    var gallonsYear = roofArea * (rainfall / 12) * 7.48 * (efficiency/100); var gallonsMonth = gallonsYear / 12; var barrels = Math.ceil(gallonsMonth / 55);     document.getElementById('gallonsYear').textContent = fmt(gallonsYear,0);
    document.getElementById('gallonsMonth').textContent = fmt(gallonsMonth,0);
    document.getElementById('barrels').textContent = fmt(barrels,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['roofArea', 'rainfall', 'efficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
