(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var people = parseFloat(document.getElementById('people').value) || 0;
    var bathrooms = parseFloat(document.getElementById('bathrooms').value) || 0;
    var usage = document.getElementById('usage').value;

    // Calculation logic
    var perPerson={low:8,medium:12,high:18}; var peakGPH=people*perPerson[usage]; var tankSize=peakGPH<=30?30:peakGPH<=40?40:peakGPH<=50?50:peakGPH<=65?65:80; var tanklessGPM=peakGPH/20; var monthlyGas=tankSize*0.7; return {peakGPH:peakGPH+' gallons/hour', tankSize:tankSize+' gallon tank', tankless:fmt(tanklessGPM,1)+' GPM tankless', monthlyGas:dollar(monthlyGas)+'/month'};

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
