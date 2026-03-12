(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var lwl = parseFloat(document.getElementById('lwl').value) || 0;

    // Calculation logic
    var hs = 1.34 * Math.sqrt(lwl); document.getElementById('hullSpeed').textContent = fmt(hs, 2) + ' knots'; document.getElementById('hullSpeedMph').textContent = fmt(hs * 1.15078, 2) + ' mph'; document.getElementById('hullSpeedKmh').textContent = fmt(hs * 1.852, 2) + ' km/h'; document.getElementById('resultTip').textContent = 'Displacement hulls cannot efficiently exceed this speed without planing.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['lwl'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
