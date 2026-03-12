(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var people = parseFloat(document.getElementById('people').value) || 0;
    var bathrooms = parseFloat(document.getElementById('bathrooms').value) || 0;
    var usage = document.getElementById('usage').value;

    // Calculation logic
    var perPerson={low:8,medium:12,high:18}; var peakGPH=people*perPerson[usage]; var tankSize=peakGPH<=30?30:peakGPH<=40?40:peakGPH<=50?50:peakGPH<=65?65:80; var tanklessGPM=peakGPH/20; var monthlyGas=tankSize*0.7;     document.getElementById('peakGPH').textContent = peakGPH+' gallons/hour';
    document.getElementById('tankSize').textContent = tankSize+' gallon tank';
    document.getElementById('tankless').textContent = fmt(tanklessGPM,1)+' GPM tankless';
    document.getElementById('monthlyGas').textContent = dollar(monthlyGas)+'/month';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['people', 'bathrooms', 'usage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
