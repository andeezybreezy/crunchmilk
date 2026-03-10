(function() {
  'use strict';

  var purchasePrice = document.getElementById('purchasePrice');
  var downPayment = document.getElementById('downPayment');
  var loanRate = document.getElementById('loanRate');
  var loanTerm = document.getElementById('loanTerm');
  var monthlyRent = document.getElementById('monthlyRent');
  var vacancyRate = document.getElementById('vacancyRate');
  var propertyTax = document.getElementById('propertyTax');
  var insurance = document.getElementById('insurance');
  var maintenance = document.getElementById('maintenance');
  var management = document.getElementById('management');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var monthlyCashFlowEl = document.getElementById('monthlyCashFlow');
  var annualCashFlowEl = document.getElementById('annualCashFlow');
  var cashOnCashEl = document.getElementById('cashOnCash');
  var mortgagePaymentEl = document.getElementById('mortgagePayment');
  var totalCashInvestedEl = document.getElementById('totalCashInvested');
  var capRateEl = document.getElementById('capRate');
  var breakdownWrap = document.getElementById('breakdownWrap');
  var breakdownList = document.getElementById('breakdownList');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtRound(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calcMortgage(principal, annualRate, years) {
    if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
    var r = annualRate / 100 / 12;
    var n = years * 12;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculate() {
    var price = parseFloat(purchasePrice.value) || 0;
    var dpPct = parseFloat(downPayment.value) || 0;
    var rate = parseFloat(loanRate.value) || 0;
    var term = parseInt(loanTerm.value, 10) || 30;
    var rent = parseFloat(monthlyRent.value) || 0;
    var vacancy = (parseFloat(vacancyRate.value) || 0) / 100;
    var tax = parseFloat(propertyTax.value) || 0;
    var ins = parseFloat(insurance.value) || 0;
    var maint = parseFloat(maintenance.value) || 0;
    var mgmt = parseFloat(management.value) || 0;

    if (price <= 0) return;

    var dpAmount = price * (dpPct / 100);
    var loanAmount = price - dpAmount;
    var monthlyMortgage = calcMortgage(loanAmount, rate, term);

    // Monthly figures
    var effectiveRent = rent * (1 - vacancy);
    var monthlyTax = tax / 12;
    var monthlyIns = ins / 12;
    var monthlyMaint = maint / 12;
    var monthlyMgmt = mgmt / 12;
    var totalMonthlyExpenses = monthlyMortgage + monthlyTax + monthlyIns + monthlyMaint + monthlyMgmt;
    var monthlyCF = effectiveRent - totalMonthlyExpenses;
    var annualCF = monthlyCF * 12;

    // Cash invested (down payment + estimated closing costs at 3%)
    var closingCosts = price * 0.03;
    var totalCashInvested = dpAmount + closingCosts;

    // Cash on cash
    var coc = totalCashInvested > 0 ? (annualCF / totalCashInvested) * 100 : 0;

    // Cap rate (NOI / price, NOI excludes mortgage)
    var annualOpEx = tax + ins + maint + mgmt;
    var effectiveAnnualRent = rent * 12 * (1 - vacancy);
    var noi = effectiveAnnualRent - annualOpEx;
    var capRate = price > 0 ? (noi / price) * 100 : 0;

    monthlyCashFlowEl.textContent = fmt(monthlyCF);
    monthlyCashFlowEl.style.color = monthlyCF >= 0 ? '#059669' : '#dc2626';
    annualCashFlowEl.textContent = fmt(annualCF);
    annualCashFlowEl.style.color = annualCF >= 0 ? '#059669' : '#dc2626';
    cashOnCashEl.textContent = coc.toFixed(2) + '%';
    cashOnCashEl.style.color = coc >= 8 ? '#059669' : coc >= 4 ? '#d97706' : '#dc2626';
    mortgagePaymentEl.textContent = fmt(monthlyMortgage);
    totalCashInvestedEl.textContent = fmtRound(totalCashInvested);
    capRateEl.textContent = capRate.toFixed(2) + '%';

    // Breakdown
    var items = [
      ['Effective Rent', '+' + fmt(effectiveRent), '#059669'],
      ['Mortgage (P&I)', '-' + fmt(monthlyMortgage), '#dc2626'],
      ['Property Tax', '-' + fmt(monthlyTax), '#dc2626'],
      ['Insurance', '-' + fmt(monthlyIns), '#dc2626'],
      ['Maintenance', '-' + fmt(monthlyMaint), '#dc2626'],
      ['Management', '-' + fmt(monthlyMgmt), '#dc2626']
    ];

    var html = '';
    items.forEach(function(item) {
      html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<span>' + item[0] + '</span>' +
        '<span style="font-weight:600;color:' + item[2] + '">' + item[1] + '</span></div>';
    });
    html += '<div style="display:flex;justify-content:space-between;padding:10px 0;font-weight:700;font-size:1.1rem">' +
      '<span>Net Cash Flow</span>' +
      '<span style="color:' + (monthlyCF >= 0 ? '#059669' : '#dc2626') + '">' + fmt(monthlyCF) + '/mo</span></div>';

    // 1% rule check
    var onePercent = price * 0.01;
    var meetsRule = rent >= onePercent;
    html += '<div style="margin-top:12px;padding:12px;background:' + (meetsRule ? '#ecfdf5' : '#fef2f2') + ';border-radius:8px;font-size:0.9rem">' +
      '<strong>1% Rule:</strong> ' + (meetsRule ? 'Passes' : 'Does not pass') +
      ' (need ' + fmtRound(onePercent) + '/mo, getting ' + fmtRound(rent) + '/mo)</div>';

    breakdownList.innerHTML = html;
    breakdownWrap.style.display = 'block';

    resultDiv.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);

  var allInputs = [purchasePrice, downPayment, loanRate, loanTerm, monthlyRent, vacancyRate, propertyTax, insurance, maintenance, management];
  allInputs.forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  calculate();
})();
