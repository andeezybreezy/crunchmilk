(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tempF = parseFloat(document.getElementById('tempF').value) || 0;
    var humidity = parseFloat(document.getElementById('humidity').value) || 0;
    var sunExposure = document.getElementById('sunExposure').value;
    var workload = document.getElementById('workload').value;

    // Calculation logic
    var T = tempF; var sunAdd = {full: 7, partial: 3, shade: 0}; var sa = sunAdd[sunExposure] || 0; var wbgtEst = 0.567 * T + 0.393 * (humidity / 100 * 6.105 * Math.exp(17.27 * ((T-32)*5/9) / (237.7 + (T-32)*5/9))) + 3.94 + sa; var wbgtF = wbgtEst; var thresholds = {light: 86, moderate: 82, heavy: 77}; var thresh = thresholds[workload] || 82; var risk = wbgtF >= thresh + 10 ? 'Extreme — Stop work' : wbgtF >= thresh + 5 ? 'High — 15 min work, 45 min rest' : wbgtF >= thresh ? 'Moderate — 30 min work, 30 min rest' : 'Low — Normal work with hydration'; var wr = wbgtF >= thresh + 10 ? 'Stop outdoor work. Emergency risk.' : wbgtF >= thresh + 5 ? '15 min work / 45 min rest per hour' : wbgtF >= thresh ? '30 min work / 30 min rest per hour' : '50 min work / 10 min rest per hour'; document.getElementById('wbgt').textContent = fmt(wbgtF, 0) + '°F'; document.getElementById('riskLevel').textContent = risk; document.getElementById('workRest').textContent = wr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tempF', 'humidity', 'sunExposure', 'workload'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
