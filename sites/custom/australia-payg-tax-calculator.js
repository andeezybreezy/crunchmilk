(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossPay = parseFloat(document.getElementById('grossPay').value) || 0;
    var payFrequency = document.getElementById('payFrequency').value;
    var taxFreeThreshold = document.getElementById('taxFreeThreshold').value;
    var helpDebt = document.getElementById('helpDebt').value;
    var superIncluded = document.getElementById('superIncluded').value;

    // Calculation logic
    var periodsPerYear = {weekly: 52, fortnightly: 26, monthly: 12, annual: 1};
    var periods = periodsPerYear[payFrequency];
    var annualGross = grossPay * periods;
    if (superIncluded === 'yes') annualGross = annualGross / 1.115;
    var annualTax = 0;
    if (taxFreeThreshold === 'yes') {
      if (annualGross <= 18200) annualTax = 0;
      else if (annualGross <= 45000) annualTax = (annualGross - 18200) * 0.16;
      else if (annualGross <= 135000) annualTax = 4288 + (annualGross - 45000) * 0.30;
      else if (annualGross <= 190000) annualTax = 31288 + (annualGross - 135000) * 0.37;
      else annualTax = 51638 + (annualGross - 190000) * 0.45;
    } else {
      if (annualGross <= 135000) annualTax = annualGross * 0.30;
      else if (annualGross <= 190000) annualTax = 40500 + (annualGross - 135000) * 0.37;
      else annualTax = 60850 + (annualGross - 190000) * 0.45;
    }
    var paygPerPay = annualTax / periods;
    var medicarePeriod = annualGross > 26000 ? annualGross * 0.02 / periods : 0;
    var helpPeriod = 0;
    if (helpDebt === 'yes') {
      var helpRates = [{min: 54435, rate: 0.01}, {min: 62850, rate: 0.02}, {min: 66620, rate: 0.025}, {min: 70618, rate: 0.03}, {min: 74855, rate: 0.035}, {min: 79346, rate: 0.04}, {min: 84107, rate: 0.045}, {min: 89154, rate: 0.05}, {min: 94503, rate: 0.055}, {min: 100174, rate: 0.06}, {min: 106185, rate: 0.065}, {min: 112556, rate: 0.07}, {min: 119310, rate: 0.075}, {min: 126467, rate: 0.08}, {min: 134056, rate: 0.085}, {min: 142100, rate: 0.09}, {min: 150626, rate: 0.095}, {min: 159663, rate: 0.10}];
      for (var i = helpRates.length - 1; i >= 0; i--) {
        if (annualGross >= helpRates[i].min) { helpPeriod = annualGross * helpRates[i].rate / periods; break; }
      }
    }
    var netPayVal = grossPay - paygPerPay - medicarePeriod - helpPeriod;
    if (superIncluded === 'yes') netPayVal = netPayVal;
    var superPerPay = (superIncluded === 'yes') ? grossPay - annualGross / periods : annualGross * 0.115 / periods;
    document.getElementById('annualSalary').textContent = 'A$' + annualGross.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('paygWithheld').textContent = 'A$' + paygPerPay.toFixed(2);
    document.getElementById('medicareLevy').textContent = 'A$' + medicarePeriod.toFixed(2);
    document.getElementById('helpPayment').textContent = helpPeriod > 0 ? 'A$' + helpPeriod.toFixed(2) : 'A$0';
    document.getElementById('netPay').textContent = 'A$' + netPayVal.toFixed(2);
    document.getElementById('superContrib').textContent = 'A$' + superPerPay.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossPay', 'payFrequency', 'taxFreeThreshold', 'helpDebt', 'superIncluded'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
