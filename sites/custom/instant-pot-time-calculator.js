(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var slowTime = parseFloat(document.getElementById('slowTime').value) || 0;
    var slowSetting = document.getElementById('slowSetting').value;
    var foodType = document.getElementById('foodType').value;

    // Calculation logic
    var slowMin = slowTime * 60; if (slowSetting === 'low') slowMin = slowMin * 0.67; var ratio = {stew:0.10,roast:0.12,chicken:0.08,beans:0.11,soup:0.08,grains:0.07}; var r = ratio[foodType] || 0.10; var pressMin = Math.max(5, Math.round(slowMin * r)); var releaseType = (foodType === 'chicken' || foodType === 'grains') ? 'Quick Release (QR)' : 'Natural Release 10-15 min (NPR)'; var pressurizeMin = 10; var releaseMin = releaseType.indexOf('Natural') >= 0 ? 12 : 2; var totalMin = pressMin + pressurizeMin + releaseMin; var savedHrs = (slowTime * 60 - totalMin) / 60; document.getElementById('pressureTime').textContent = pressMin + ' min'; document.getElementById('release').textContent = releaseType; document.getElementById('totalTime').textContent = totalMin + ' min'; document.getElementById('timeSaved').textContent = fmt(savedHrs, 1) + ' hrs';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['slowTime', 'slowSetting', 'foodType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
