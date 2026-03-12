(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hits = parseFloat(document.getElementById('hits').value) || 0;
    var atBats = parseFloat(document.getElementById('atBats').value) || 0;

    // Calculation logic
    var ba = hits / atBats; var rating = ba >= 0.300 ? 'Excellent' : ba >= 0.270 ? 'Good' : ba >= 0.250 ? 'Average' : ba >= 0.220 ? 'Below Average' : 'Poor'; var needed300 = Math.ceil(0.300 * atBats) - hits; document.getElementById('avg').textContent = '.' + Math.round(ba * 1000).toString().padStart(3, '0'); document.getElementById('rating').textContent = rating; document.getElementById('hitsNeeded').textContent = needed300 > 0 ? needed300 + ' more hits' : 'Already above .300!';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hits', 'atBats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
