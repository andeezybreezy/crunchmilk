(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var containerOz = parseFloat(document.getElementById('containerOz').value) || 0;
    var containers = parseFloat(document.getElementById('containers').value) || 0;
    var fragPct = parseFloat(document.getElementById('fragPct').value) || 0;

    // Calculation logic
    var waxOzPer = containerOz * 0.86; var totalWaxOz = waxOzPer * containers; var waxLbs = totalWaxOz / 16; var fragOz = (totalWaxOz * fragPct / 100); var wicks = containers;     document.getElementById('waxLbs').textContent = fmt(waxLbs,1);
    document.getElementById('fragOz').textContent = fmt(fragOz,1);
    document.getElementById('wicks').textContent = fmt(wicks,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['containerOz', 'containers', 'fragPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
