(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var outsideTemp = parseFloat(document.getElementById('outsideTemp').value) || 0;
    var sunIntensity = document.getElementById('sunIntensity').value;
    var glazing = document.getElementById('glazing').value;
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var ventilation = document.getElementById('ventilation').value;

    // Calculation logic
    var sun = parseFloat(sunIntensity);
    var glaze = parseFloat(glazing);
    var ventFactor = {closed: 1.0, partial: 0.5, open: 0.2};
    var vf = ventFactor[ventilation];
    var solarGain = 30 * sun * glaze * vf;
    var insideT = outsideTemp + solarGain;
    var btuNeeded = 0;
    if (insideT < 65) {
      var heatLoss = sqft * 1.1 * (65 - insideT);
      btuNeeded = heatLoss;
    }
    var zone;
    var minTemp = outsideTemp + solarGain * 0.3;
    if (minTemp >= 60) zone = 'Zone 10+ (tropical plants OK)';
    else if (minTemp >= 50) zone = 'Zone 9-10 (warm season crops)';
    else if (minTemp >= 40) zone = 'Zone 8-9 (cool season crops)';
    else if (minTemp >= 32) zone = 'Zone 7-8 (frost protection only)';
    else zone = 'Below freezing — supplemental heat required';
    document.getElementById('insideTemp').textContent = fmt(insideT, 0) + '°F (' + fmt((insideT - 32) * 5/9, 1) + '°C)';
    document.getElementById('tempGain').textContent = '+' + fmt(solarGain, 0) + '°F above outside';
    document.getElementById('heatingNeeded').textContent = btuNeeded > 0 ? fmt(btuNeeded, 0) + ' BTU/hr to reach 65°F' : 'None needed — above 65°F';
    document.getElementById('plantZone').textContent = zone;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['outsideTemp', 'sunIntensity', 'glazing', 'sqft', 'ventilation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
