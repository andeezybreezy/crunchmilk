(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var method = document.getElementById('method').value;
    var cups = parseFloat(document.getElementById('cups').value) || 0;
    var strength = document.getElementById('strength').value;

    // Calculation logic
    var ratios={pourover:16,frenchpress:15,aeropress:12,coldbrew:8,espresso:2,drip:17}; var ratio=ratios[method]; var strengthMod={light:1.1,medium:1,strong:0.9}; ratio=ratio*strengthMod[strength]; var waterMl=cups*177; var coffeeG=waterMl/ratio; var coffeeTbsp=coffeeG/5; var waterOz=waterMl/29.574;     document.getElementById('coffeeG').textContent = fmt(coffeeG,1)+' g';
    document.getElementById('coffeeTbsp').textContent = fmt(coffeeTbsp,1)+' tbsp';
    document.getElementById('waterMl').textContent = fmt(waterMl,0)+' ml';
    document.getElementById('waterOz').textContent = fmt(waterOz,1)+' oz';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['method', 'cups', 'strength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
