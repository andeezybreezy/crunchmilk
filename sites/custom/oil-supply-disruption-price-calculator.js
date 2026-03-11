(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var disruptionType = document.getElementById('disruptionType').value;
    var supplyLoss = parseFloat(document.getElementById('supplyLoss').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;

    // Calculation logic
    var pctLoss = v.supplyLoss / 100; var panicMultiplier = v.duration > 90 ? 1.3 : v.duration > 30 ? 1.15 : 1.0; var typeMultiplier = {pipeline: 0.8, country: 1.0, multi: 1.3, embargo: 1.6}; var tm = typeMultiplier[v.disruptionType]; var priceSpike = pctLoss * 8 * panicMultiplier * tm; var peakOil = v.currentOil * (1 + priceSpike); var avgOil = v.currentOil * (1 + priceSpike * 0.7); var gasImpact = '+$' + (priceSpike * 0.6 * 3.5).toFixed(2) + '/gal'; var globalCostB = Math.round(v.supplyLoss * (peakOil - v.currentOil) * v.duration / 1e3); var recovery = v.duration < 30 ? '2-4 weeks after resolution' : v.duration < 90 ? '1-3 months' : '3-6 months'; return {peakOil: '$' + peakOil.toFixed(0) + '/barrel', avgOil: '$' + avgOil.toFixed(0) + '/barrel', gasImpact: gasImpact, globalCost: '$' + globalCostB + ' billion (est.)', recoveryTime: recovery};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['disruptionType', 'supplyLoss', 'duration', 'currentOil'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
