(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var waterOz = parseFloat(document.getElementById('waterOz').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var ratios={concentrate:5,readytodrink:8,strong:4}; var ratio=ratios[type]; var coffeeOz=waterOz/ratio; var coffeeG=coffeeOz*28.35; var coffeeCups=coffeeOz/8;     document.getElementById('coffeeOz').textContent = fmt(coffeeOz,1)+' oz';
    document.getElementById('coffeeG').textContent = fmt(coffeeG,0)+' g';
    document.getElementById('coffeeCups').textContent = fmt(coffeeCups,2)+' cups';
    document.getElementById('steepTime').textContent = '12-24 hours (refrigerated)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['waterOz', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
