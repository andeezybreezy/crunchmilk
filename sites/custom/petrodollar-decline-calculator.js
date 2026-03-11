(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nonDollarPct = parseFloat(document.getElementById('nonDollarPct').value) || 0;
    var timeline = document.getElementById('timeline').value;

    // Calculation logic
    var oilMarketT = 3; var totalReserves = 12; var reserveShift = v.nonDollarPct / 100 * 0.3; var dollarDecline = reserveShift * 15; var rateIncrease = dollarDecline * 0.05; var debtCost = 34e12 * rateIncrease / 100; var inflation = dollarDecline * 0.1; var importInc = dollarDecline * 0.8; var years = parseInt(v.timeline); return {dollarImpact: '-' + dollarDecline.toFixed(1) + '% over ' + years + ' years', interestRateImpact: '+' + rateIncrease.toFixed(2) + '% on Treasury yields', debtCostIncrease: '+$' + Math.round(debtCost / 1e9) + ' billion/year', inflationImpact: '+' + inflation.toFixed(1) + '% additional inflation', importCostIncrease: '+' + importInc.toFixed(1) + '% on imported goods'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nonDollarPct', 'timeline'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
