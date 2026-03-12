(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var disruptionType = document.getElementById('disruptionType').value;
    var supplyLoss = parseFloat(document.getElementById('supplyLoss').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;

    // Calculation logic
    var pctLoss = supplyLoss / 100; var panicMultiplier = duration > 90 ? 1.3 : duration > 30 ? 1.15 : 1.0; var typeMultiplier = {pipeline: 0.8, country: 1.0, multi: 1.3, embargo: 1.6}; var tm = typeMultiplier[disruptionType]; var priceSpike = pctLoss * 8 * panicMultiplier * tm; var peakOil = currentOil * (1 + priceSpike); var avgOil = currentOil * (1 + priceSpike * 0.7); var gasImpact = '+$' + (priceSpike * 0.6 * 3.5).toFixed(2) + '/gal'; var globalCostB = Math.round(supplyLoss * (peakOil - currentOil) * duration / 1e3); var recovery = duration < 30 ? '2-4 weeks after resolution' : duration < 90 ? '1-3 months' : '3-6 months';     document.getElementById('peakOil').textContent = '$' + peakOil.toFixed(0) + '/barrel';
    document.getElementById('avgOil').textContent = '$' + avgOil.toFixed(0) + '/barrel';
    document.getElementById('gasImpact').textContent = gasImpact;
    document.getElementById('globalCost').textContent = '$' + globalCostB + ' billion (est.)';
    document.getElementById('recoveryTime').textContent = recovery;

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
