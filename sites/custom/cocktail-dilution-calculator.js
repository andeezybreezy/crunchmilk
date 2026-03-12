(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var spiritOz = parseFloat(document.getElementById('spiritOz').value) || 0;
    var spiritABV = parseFloat(document.getElementById('spiritABV').value) || 0;
    var mixerOz = parseFloat(document.getElementById('mixerOz').value) || 0;
    var method = document.getElementById('method').value;

    // Calculation logic
    var dilutionRates = {'stirred':0.175,'shaken':0.275,'blended':0.45,'neat':0};
    var preDilutionVol = spiritOz + mixerOz;
    var waterAdded = preDilutionVol * dilutionRates[method];
    var totalVol = preDilutionVol + waterAdded;
    var alcoholOz = spiritOz * (spiritABV / 100);
    var finalABV = (alcoholOz / totalVol) * 100;
    document.getElementById('dilution').textContent = fmt(waterAdded, 2) + ' oz of water (' + fmt(dilutionRates[method] * 100, 0) + '% dilution)';
    document.getElementById('totalVolume').textContent = fmt(totalVol, 2) + ' oz total';
    document.getElementById('finalABV').textContent = fmt(finalABV, 1) + '%';
    document.getElementById('proof').textContent = fmt(finalABV * 2, 1) + ' proof';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['spiritOz', 'spiritABV', 'mixerOz', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
