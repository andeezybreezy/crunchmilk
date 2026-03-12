(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pipeDia = document.getElementById('pipeDia').value;
    var pressure = parseFloat(document.getElementById('pressure').value) || 0;
    var length = parseFloat(document.getElementById('length').value) || 0;

    // Calculation logic
    var dia=parseFloat(pipeDia); var area=Math.PI*Math.pow(dia/2/12,2); var frictionFactor=0.02; var headLoss=frictionFactor*length*8/(dia/12); var effectivePressure=Math.max(pressure-headLoss*0.433, 2); var velocity=Math.sqrt(2*effectivePressure*144/62.4)*0.6; var flowCFS=velocity*area; var flowGPM=flowCFS*448.83; var dailyGal=flowGPM*60*24;     document.getElementById('flowGPM').textContent = fmt(flowGPM,1)+' GPM';
    document.getElementById('velocity').textContent = fmt(velocity,1)+' ft/s';
    document.getElementById('dailyGal').textContent = fmt(dailyGal,0)+' gal/day';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pipeDia', 'pressure', 'length'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
