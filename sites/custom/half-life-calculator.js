(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var initial = parseFloat(document.getElementById('initial').value) || 0;
    var halfLife = parseFloat(document.getElementById('halfLife').value) || 0;
    var elapsed = parseFloat(document.getElementById('elapsed').value) || 0;

    // Calculation logic
    var hl = elapsed / halfLife; var rem = initial * Math.pow(0.5, hl); var dec = initial - rem; document.getElementById('remaining').textContent = fmt(rem, 2); document.getElementById('decayed').textContent = fmt(dec, 2); document.getElementById('halfLives').textContent = fmt(hl, 2); document.getElementById('pctRemaining').textContent = pct(rem / initial * 100, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['initial', 'halfLife', 'elapsed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
