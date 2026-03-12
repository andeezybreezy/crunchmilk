(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var roofSqFt = parseFloat(document.getElementById('roofSqFt').value) || 0;
    var rainfall = parseFloat(document.getElementById('rainfall').value) || 0;
    var efficiency = parseFloat(document.getElementById('efficiency').value) || 0;

    // Calculation logic
    var gal = roofSqFt * (rainfall / 12) * 7.48 * (efficiency / 100); var annual = gal * 12; document.getElementById('gallonsMonth').textContent = fmt(gal, 0) + ' gallons'; document.getElementById('gallonsYear').textContent = fmt(annual, 0) + ' gallons'; document.getElementById('barrelsMonth').textContent = fmt(gal / 55, 1) + ' barrels';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['roofSqFt', 'rainfall', 'efficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
