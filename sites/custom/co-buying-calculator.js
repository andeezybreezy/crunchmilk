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

  var homePrice = document.getElementById('homePrice');
  var numBuyers = document.getElementById('numBuyers');
  var interestRate = document.getElementById('interestRate');
  var loanTerm = document.getElementById('loanTerm');
  var avgRent = document.getElementById('avgRent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var buyerInputsDiv = document.getElementById('buyerInputs');

  var chartData = [
    ['Down Payment', '$100,000', '$50,000 each', '$33,333 each', '$25,000 each'],
    ['Monthly Payment', '$3,792', '$1,896 each', '$1,264 each', '$948 each'],
    ['Income Needed', '$130,000', '$65,000 each', '$43,333 each', '$32,500 each'],
    ['5-Year Equity', '$55,000', '$27,500 each', '$18,333 each', '$13,750 each'],
    ['Total Monthly*', '$4,500', '$2,250 each', '$1,500 each', '$1,125 each']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function buildBuyerInputs() {
    var n = parseInt(numBuyers.value) || 2;
    var html = '';
    for (var i = 1; i <= n; i++) {
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:' + (i < n ? '12px' : '0') + '">';
      html += '<div><label style="font-size:0.8rem;display:block;margin-bottom:4px">Buyer ' + i + ' Income ($/yr)</label>';
      html += '<input type="number" id="income' + i + '" placeholder="75000" value="75000" inputmode="decimal" step="any" style="width:100%;padding:8px 10px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem"></div>';
      html += '<div><label style="font-size:0.8rem;display:block;margin-bottom:4px">Buyer ' + i + ' Down Payment ($)</label>';
      html += '<input type="number" id="down' + i + '" placeholder="25000" value="25000" inputmode="decimal" step="any" style="width:100%;padding:8px 10px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem"></div>';
      html += '</div>';
    }
    buyerInputsDiv.innerHTML = html;
  }

  buildBuyerInputs();
  numBuyers.addEventListener('change', buildBuyerInputs);

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var price = getVal(homePrice);
    var n = parseInt(numBuyers.value) || 2;
    var rate = getVal(interestRate) / 100;
    var term = parseInt(loanTerm.value) || 30;
    var rent = getVal(avgRent);

    if (price <= 0) return;

    var totalDown = 0;
    var totalIncome = 0;
    var buyers = [];
    for (var i = 1; i <= n; i++) {
      var incEl = document.getElementById('income' + i);
      var downEl = document.getElementById('down' + i);
      var inc = incEl ? getVal(incEl) : 0;
      var dwn = downEl ? getVal(downEl) : 0;
      buyers.push({ income: inc, down: dwn });
      totalDown += dwn;
      totalIncome += inc;
    }

    var loanAmount = price - totalDown;
    if (loanAmount < 0) loanAmount = 0;

    var monthlyRate = rate / 12;
    var numPayments = term * 12;
    var monthlyMortgage = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else if (loanAmount > 0) {
      monthlyMortgage = loanAmount / numPayments;
    }

    // Add taxes (~1.2%) + insurance (~0.5%) + maintenance (~0.3%) = ~2%/yr
    var monthlyExtras = (price * 0.02) / 12;
    var totalMonthly = monthlyMortgage + monthlyExtras;

    var monthlyGrossIncome = totalIncome / 12;
    var dti = monthlyGrossIncome > 0 ? (monthlyMortgage / monthlyGrossIncome) * 100 : 0;
    var downPct = (totalDown / price) * 100;

    document.getElementById('rDownTotal').textContent = fmtDollars(totalDown) + ' (' + fmt(downPct, 0) + '%)';
    document.getElementById('rMortgage').textContent = fmtDollars(monthlyMortgage) + '/mo';
    document.getElementById('rCombinedIncome').textContent = fmtDollars(totalIncome) + '/yr';
    document.getElementById('rDTI').textContent = fmt(dti, 1) + '%';
    document.getElementById('rDTI').style.color = dti <= 36 ? '#059669' : dti <= 43 ? '#d97706' : '#dc2626';

    var d = '';

    // Per-buyer breakdown
    d += '<div style="font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Per-Buyer Breakdown</strong>';
    d += '<div style="display:grid;grid-template-columns:repeat(' + Math.min(n, 2) + ',1fr);gap:10px;margin-top:8px">';
    for (i = 0; i < n; i++) {
      var b = buyers[i];
      var ownershipPct = totalDown > 0 ? (b.down / totalDown) * 100 : 100 / n;
      var shareMonthly = totalMonthly * (ownershipPct / 100);
      d += '<div style="padding:10px;background:#f5f3ff;border-radius:8px;text-align:center">';
      d += '<strong>Buyer ' + (i + 1) + '</strong><br>';
      d += 'Down: ' + fmtDollars(b.down) + '<br>';
      d += 'Monthly: ' + fmtDollars(shareMonthly) + '<br>';
      d += 'Equity: ' + fmt(ownershipPct, 1) + '%';
      d += '</div>';
    }
    d += '</div></div>';

    // Qualification
    d += '<div style="padding:12px;background:' + (dti <= 43 ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Mortgage Qualification</strong><br>';
    d += 'Loan amount: ' + fmtDollars(loanAmount) + ' (LTV: ' + fmt((loanAmount / price) * 100, 0) + '%)<br>';
    d += 'DTI ratio: ' + fmt(dti, 1) + '% — ';
    if (dti <= 36) d += '<span style="color:#059669">Excellent (under 36%)</span>';
    else if (dti <= 43) d += '<span style="color:#d97706">Acceptable (under 43%)</span>';
    else d += '<span style="color:#dc2626">Too high (over 43%) — may not qualify</span>';
    if (downPct < 20) d += '<br><span style="color:#d97706">PMI likely required (down payment under 20%)</span>';
    d += '</div>';

    // Rent comparison
    if (rent > 0) {
      var totalRentAll = rent * n;
      var monthlySavings = totalRentAll - totalMonthly;
      d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem">';
      d += '<strong>vs. Renting Individually</strong><br>';
      d += 'Combined rent: ' + fmtDollars(totalRentAll) + '/mo (' + n + ' x ' + fmtDollars(rent) + ')<br>';
      d += 'Co-buy total: ' + fmtDollars(totalMonthly) + '/mo (mortgage + taxes/insurance/maint.)<br>';
      if (monthlySavings > 0) {
        d += '<strong style="color:#059669">Saves ' + fmtDollars(monthlySavings) + '/mo vs renting</strong> + equity building';
      } else {
        d += '<strong style="color:#d97706">Costs ' + fmtDollars(Math.abs(monthlySavings)) + '/mo more than renting</strong>, but you build equity';
      }
      d += '</div>';
    }

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var baseInputs = [homePrice, numBuyers, interestRate, loanTerm, avgRent];
  baseInputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

  // Delegate events for dynamic buyer inputs
  buyerInputsDiv.addEventListener('input', calculate);

})();
