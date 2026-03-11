(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var enforcementLevel = document.getElementById('enforcementLevel').value;
    var iranBaseline = parseFloat(document.getElementById('iranBaseline').value) || 0;
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;

    // Calculation logic
    var levels = {loose: {exportPct: 0.70, desc: '70%'}, moderate: {exportPct: 0.45, desc: '45%'}, strict: {exportPct: 0.20, desc: '20%'}, maximum: {exportPct: 0.05, desc: '5%'}}; var l = levels[v.enforcementLevel]; var exportsRemaining = v.iranBaseline * l.exportPct; var supplyLoss = v.iranBaseline * (1 - l.exportPct); var pctLoss = supplyLoss / 100; var oilInc = pctLoss * 8; var newOil = v.currentOil * (1 + oilInc); var gasInc = oilInc * 0.6; var newGas = v.gasPrice * (1 + gasInc); var revLoss = supplyLoss * (1 - l.exportPct) * v.currentOil * 365; return {iranExports: exportsRemaining.toFixed(1) + ' million bpd (' + l.desc + ' of baseline)', supplyLoss: supplyLoss.toFixed(1) + ' million bpd removed', oilPriceImpact: '$' + newOil.toFixed(0) + '/barrel (+' + (oilInc * 100).toFixed(0) + '%)', gasPriceImpact: '$' + newGas.toFixed(2) + '/gal', iranRevenueLoss: '$' + Math.round(supplyLoss * v.currentOil * 365 / 1e9) + ' billion/year'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['enforcementLevel', 'iranBaseline', 'currentOil', 'gasPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
