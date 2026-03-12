(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    var propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var contractRate = parseFloat(document.getElementById('contractRate').value) || 0;
    var amortization = parseFloat(document.getElementById('amortization').value) || 0;
    var monthlyDebts = parseFloat(document.getElementById('monthlyDebts').value) || 0;

    // Calculation logic
    var loan = propertyPrice - downPayment;
    var dpPct = downPayment / propertyPrice * 100;
    var cmhcPremium = 0;
    if (dpPct < 20) {
      if (dpPct >= 15) cmhcPremium = loan * 0.028;
      else if (dpPct >= 10) cmhcPremium = loan * 0.031;
      else cmhcPremium = loan * 0.04;
      loan += cmhcPremium;
    }
    var stressRate = Math.max(contractRate + 2, 5.25);
    var contractMonthly = loan * (contractRate/100/12) * Math.pow(1 + contractRate/100/12, amortization*12) / (Math.pow(1 + contractRate/100/12, amortization*12) - 1);
    var stressMonthly = loan * (stressRate/100/12) * Math.pow(1 + stressRate/100/12, amortization*12) / (Math.pow(1 + stressRate/100/12, amortization*12) - 1);
    var monthlyIncome = grossIncome / 12;
    var monthlyPropertyTax = propertyPrice * 0.01 / 12;
    var monthlyHeat = 175;
    var gds = (stressMonthly + monthlyPropertyTax + monthlyHeat) / monthlyIncome * 100;
    var tds = (stressMonthly + monthlyPropertyTax + monthlyHeat + monthlyDebts) / monthlyIncome * 100;
    var pass = gds < 39 && tds < 44;
    document.getElementById('qualifyingRate').textContent = stressRate.toFixed(2) + '%';
    document.getElementById('monthlyAtContract').textContent = '$' + contractMonthly.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyAtStress').textContent = '$' + stressMonthly.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('gdsRatio').textContent = gds.toFixed(1) + '%' + (gds < 39 ? ' (PASS)' : ' (FAIL)');
    document.getElementById('tdsRatio').textContent = tds.toFixed(1) + '%' + (tds < 44 ? ' (PASS)' : ' (FAIL)');
    document.getElementById('result').textContent = pass ? 'PASS - You qualify' : 'FAIL - Consider lower price or higher down payment';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossIncome', 'propertyPrice', 'downPayment', 'contractRate', 'amortization', 'monthlyDebts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
