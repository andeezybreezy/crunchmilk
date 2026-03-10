(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  // DOM refs
  var purchasePrice = document.getElementById('purchasePrice');
  var downPaymentPct = document.getElementById('downPaymentPct');
  var interestRate = document.getElementById('interestRate');
  var loanTerm = document.getElementById('loanTerm');
  var tenantRent = document.getElementById('tenantRent');
  var ownerRentEquiv = document.getElementById('ownerRentEquiv');
  var taxes = document.getElementById('taxes');
  var insurance = document.getElementById('insurance');
  var maintenance = document.getElementById('maintenance');
  var utilities = document.getElementById('utilities');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rMortgage = document.getElementById('rMortgage');
  var rNetCost = document.getElementById('rNetCost');
  var rEffective = document.getElementById('rEffective');
  var rCoC = document.getElementById('rCoC');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartData = [
    ['Duplex', '1', '$1,200/mo', '~55%', '$980/mo'],
    ['Triplex', '2', '$2,200/mo', '~100%', '$0/mo'],
    ['Fourplex', '3', '$3,000/mo', '~135%', '+$780/mo'],
    ['SFH + ADU', '1', '$1,000/mo', '~45%', '$1,200/mo'],
    ['Basement Rental', '1', '$800/mo', '~36%', '$1,400/mo'],
    ['Room Rental (3)', '3', '$1,800/mo', '~82%', '$400/mo']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calcMortgage(principal, annualRate, years) {
    var r = annualRate / 100 / 12;
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculate() {
    var price = getVal(purchasePrice);
    var dpPct = getVal(downPaymentPct);
    var rate = getVal(interestRate);
    var term = parseInt(loanTerm.value) || 30;
    var rent = getVal(tenantRent);
    var ownerRent = getVal(ownerRentEquiv);
    var monthlyTaxes = getVal(taxes);
    var monthlyIns = getVal(insurance);
    var monthlyMaint = getVal(maintenance);
    var monthlyUtil = getVal(utilities);

    if (price <= 0) { hideResult(); return; }

    var downPayment = price * dpPct / 100;
    var loanAmount = price - downPayment;
    var monthlyMortgage = calcMortgage(loanAmount, rate, term);
    var totalExpenses = monthlyTaxes + monthlyIns + monthlyMaint + monthlyUtil;
    var totalMonthlyOut = monthlyMortgage + totalExpenses;
    var netCost = totalMonthlyOut - rent;
    var effectiveCost = netCost; // what owner actually pays per month
    var annualCashFlow = (rent - totalMonthlyOut) * 12;
    var cashInvested = downPayment + (price * 0.03); // estimate 3% closing costs
    var coc = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;

    rMortgage.textContent = fmtDollars(monthlyMortgage) + '/mo';
    rNetCost.textContent = fmtDollars(netCost) + '/mo';
    rNetCost.style.color = netCost <= 0 ? '#059669' : '';
    rEffective.textContent = fmtDollars(Math.max(0, effectiveCost)) + '/mo';
    rCoC.textContent = fmt(coc, 1) + '%';
    rCoC.style.color = coc >= 0 ? '#059669' : '#dc2626';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Down Payment</strong><br>' + fmtDollars(downPayment) + ' (' + fmt(dpPct, 1) + '%)</div>';
    d += '<div><strong>Loan Amount</strong><br>' + fmtDollars(loanAmount) + '</div>';
    d += '<div><strong>Total Monthly Outflow</strong><br>' + fmtDollars(totalMonthlyOut) + '</div>';
    d += '<div><strong>Tenant Income</strong><br>' + fmtDollars(rent) + '/mo</div>';
    d += '<div><strong>Mortgage Coverage</strong><br>' + fmt(totalMonthlyOut > 0 ? (rent / totalMonthlyOut) * 100 : 0, 0) + '% of total costs</div>';
    d += '<div><strong>Cash Invested</strong><br>' + fmtDollars(cashInvested) + ' (inc. ~3% closing)</div>';
    d += '</div>';

    // Comparison vs renting
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">House Hacking vs. Renting</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div><strong>If You Rented Instead</strong><br>' + fmtDollars(ownerRent) + '/mo</div>';
    var monthlySavings = ownerRent - Math.max(0, netCost);
    d += '<div><strong>Monthly Savings</strong><br><span style="color:' + (monthlySavings >= 0 ? '#059669' : '#dc2626') + '">' + fmtDollars(monthlySavings) + '/mo</span></div>';
    d += '<div><strong>Annual Savings</strong><br><span style="color:' + (monthlySavings >= 0 ? '#059669' : '#dc2626') + '">' + fmtDollars(monthlySavings * 12) + '/yr</span></div>';
    d += '<div><strong>5-Year Savings</strong><br><span style="color:' + (monthlySavings >= 0 ? '#059669' : '#dc2626') + '">' + fmtDollars(monthlySavings * 60) + '</span></div>';
    d += '</div></div>';

    if (netCost <= 0) {
      d += '<div style="margin-top:16px;padding:12px;background:#ecfdf5;border-radius:8px;font-size:0.9rem;color:#065f46">';
      d += '<strong>You\'re living for free!</strong> Tenant rent covers all costs with ' + fmtDollars(Math.abs(netCost)) + '/mo positive cash flow.';
      d += '</div>';
    }

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var inputs = [purchasePrice, downPaymentPct, interestRate, tenantRent, ownerRentEquiv, taxes, insurance, maintenance, utilities];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });
  loanTerm.addEventListener('change', calculate);

})();
