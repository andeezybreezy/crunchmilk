(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var electricityKwh = parseFloat(document.getElementById('electricityKwh').value) || 0;
    var gasKwh = parseFloat(document.getElementById('gasKwh').value) || 0;
    var tariffType = document.getElementById('tariffType').value;
    var elecRate = parseFloat(document.getElementById('elecRate').value) || 0;
    var gasRate = parseFloat(document.getElementById('gasRate').value) || 0;

    // Calculation logic
    var elecP, gasP, elecStanding, gasStanding;
    if (tariffType === 'cap') {
      elecP = 24.50; gasP = 6.76;
      elecStanding = 61.64; gasStanding = 31.65;
    } else {
      elecP = elecRate; gasP = gasRate;
      elecStanding = 61.64; gasStanding = 31.65;
    }
    var elecUsageCost = electricityKwh * elecP / 100;
    var gasUsageCost = gasKwh * gasP / 100;
    var elecStandingAnnual = elecStanding / 100 * 365;
    var gasStandingAnnual = gasStanding / 100 * 365;
    var annualElecVal = elecUsageCost + elecStandingAnnual;
    var annualGasVal = gasUsageCost + gasStandingAnnual;
    var annualTotalVal = annualElecVal + annualGasVal;
    var monthly = annualTotalVal / 12;
    var daily = annualTotalVal / 365;
    document.getElementById('annualElec').textContent = '\u00A3' + annualElecVal.toFixed(0);
    document.getElementById('annualGas').textContent = '\u00A3' + annualGasVal.toFixed(0);
    document.getElementById('annualTotal').textContent = '\u00A3' + annualTotalVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyTotal').textContent = '\u00A3' + monthly.toFixed(2);
    document.getElementById('dailyCost').textContent = '\u00A3' + daily.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['electricityKwh', 'gasKwh', 'tariffType', 'elecRate', 'gasRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
