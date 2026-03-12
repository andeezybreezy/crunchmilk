(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bedrooms = parseFloat(document.getElementById('bedrooms').value) || 0;
    var dailyFlow = parseFloat(document.getElementById('dailyFlow').value) || 0;
    var garbageDisposal = document.getElementById('garbageDisposal').value;
    var laundryLoad = parseFloat(document.getElementById('laundryLoad').value) || 0;

    // Calculation logic
    var baseSizes = {1:750,2:750,3:1000,4:1250,5:1500,6:1750,7:2000,8:2250};
    var baseSize = baseSizes[Math.min(bedrooms, 2)] || 1000;
    var disposalMult = garbageDisposal === 'yes' ? 1.15 : 1.0;
    var laundryAdd = laundryLoad > 8 ? 250 : 0;
    var minTank = Math.ceil((baseSize * disposalMult + laundryAdd) / 250) * 250;
    var recTank = Math.ceil(minTank * 1.2 / 250) * 250;
    var pumpYears = recTank >= 1500 ? '5-7 years' : (recTank >= 1000 ? '3-5 years' : '2-3 years');
    var drainSF = dailyFlow * 1.5;
    document.getElementById('minSize').textContent = fmt(minTank, 0) + ' gallons (code minimum)';
    document.getElementById('recommendedSize').textContent = fmt(recTank, 0) + ' gallons (with 20% buffer)';
    document.getElementById('pumpFrequency').textContent = 'Every ' + pumpYears + ' for a family';
    document.getElementById('drainfield').textContent = fmt(drainSF, 0) + ' sq ft (varies by soil type)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bedrooms', 'dailyFlow', 'garbageDisposal', 'laundryLoad'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
