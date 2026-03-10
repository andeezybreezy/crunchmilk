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
  var salePrice = document.getElementById('salePrice');
  var downPayment = document.getElementById('downPayment');
  var interestRate = document.getElementById('interestRate');
  var loanTerm = document.getElementById('loanTerm');
  var balloonYears = document.getElementById('balloonYears');
  var dpPctLabel = document.getElementById('dpPctLabel');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rPayment = document.getElementById('rPayment');
  var rBalloon = document.getElementById('rBalloon');
  var rInterest = document.getElementById('rInterest');
  var rTotal = document.getElementById('rTotal');
  var resultDetails = document.getElementById('resultDetails');
  var amortTable = document.getElementById('amortTable');

  // Chart
  var chartData = [
    ['5%', '$1,074', '$186,512', '$186,108', '$250,524'],
    ['6%', '$1,199', '$231,677', '$188,292', '$260,242'],
    ['7%', '$1,331', '$279,018', '$190,128', '$269,980'],
    ['8%', '$1,468', '$328,310', '$191,655', '$279,713'],
    ['9%', '$1,609', '$379,328', '$192,903', '$289,413'],
    ['10%', '$1,755', '$431,867', '$193,899', '$299,055']
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

  // Update DP percentage label
  function updateDPLabel() {
    var price = getVal(salePrice);
    var dp = getVal(downPayment);
    if (price > 0 && dp > 0) {
      dpPctLabel.textContent = fmt((dp / price) * 100, 1) + '% of sale price';
    } else {
      dpPctLabel.textContent = '—';
    }
  }
  salePrice.addEventListener('input', updateDPLabel);
  downPayment.addEventListener('input', updateDPLabel);

  function calcPayment(principal, annualRate, years) {
    var r = annualRate / 100 / 12;
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculate() {
    var price = getVal(salePrice);
    var dp = getVal(downPayment);
    var rate = getVal(interestRate);
    var term = getVal(loanTerm);
    var balloon = getVal(balloonYears);

    if (price <= 0 || dp >= price) { hideResult(); return; }

    var loanAmount = price - dp;
    var monthlyRate = rate / 100 / 12;
    var totalMonths = term * 12;
    var payment = calcPayment(loanAmount, rate, term);

    var hasBalloon = balloon > 0 && balloon < term;
    var balloonMonth = hasBalloon ? balloon * 12 : totalMonths;

    // Build amortization schedule
    var balance = loanAmount;
    var totalInterestPaid = 0;
    var totalPrincipalPaid = 0;
    var yearlyData = [];
    var yearInterest = 0;
    var yearPrincipal = 0;

    for (var i = 1; i <= balloonMonth; i++) {
      var intPmt = balance * monthlyRate;
      var prinPmt = payment - intPmt;
      if (prinPmt > balance) prinPmt = balance;
      balance -= prinPmt;
      if (balance < 0) balance = 0;
      totalInterestPaid += intPmt;
      totalPrincipalPaid += prinPmt;
      yearInterest += intPmt;
      yearPrincipal += prinPmt;

      if (i % 12 === 0 || i === balloonMonth) {
        yearlyData.push({
          year: Math.ceil(i / 12),
          interest: yearInterest,
          principal: yearPrincipal,
          balance: balance
        });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }

    var balloonAmount = hasBalloon ? balance : 0;
    var totalPaid = dp + (payment * balloonMonth) + balloonAmount;
    var totalInterest = totalInterestPaid;

    rPayment.textContent = fmtDollars(payment) + '/mo';
    rBalloon.textContent = hasBalloon ? fmtDollars(balloonAmount) : 'None';
    rInterest.textContent = fmtDollars(totalInterest);
    rInterest.style.color = '#059669';
    rTotal.textContent = fmtDollars(totalPaid);

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Loan Amount</strong><br>' + fmtDollars(loanAmount) + '</div>';
    d += '<div><strong>Down Payment</strong><br>' + fmtDollars(dp) + ' (' + fmt((dp / price) * 100, 1) + '%)</div>';
    d += '<div><strong>Monthly Payment</strong><br>' + fmtDollars(payment) + '</div>';
    d += '<div><strong>Payment Period</strong><br>' + (hasBalloon ? balloon + ' years (then balloon)' : term + ' years (full amortization)') + '</div>';
    d += '</div>';

    // Seller vs Buyer perspective
    d += '<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:0.9rem">';
    d += '<div style="padding:12px;background:#ecfdf5;border-radius:8px">';
    d += '<strong style="color:#065f46">Seller Perspective</strong><br>';
    d += 'Down payment received: ' + fmtDollars(dp) + '<br>';
    d += 'Monthly income: ' + fmtDollars(payment) + '<br>';
    d += 'Interest earned: ' + fmtDollars(totalInterest) + '<br>';
    if (hasBalloon) d += 'Balloon received: ' + fmtDollars(balloonAmount) + '<br>';
    d += 'Total received: ' + fmtDollars(totalPaid) + '<br>';
    d += '<span style="font-size:0.8rem">(' + fmt(((totalPaid / price) - 1) * 100, 0) + '% above sale price)</span>';
    d += '</div>';
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px">';
    d += '<strong style="color:#1e40af">Buyer Perspective</strong><br>';
    d += 'Down payment: ' + fmtDollars(dp) + '<br>';
    d += 'Monthly payment: ' + fmtDollars(payment) + '<br>';
    d += 'Total interest paid: ' + fmtDollars(totalInterest) + '<br>';
    if (hasBalloon) d += 'Balloon due (year ' + balloon + '): ' + fmtDollars(balloonAmount) + '<br>';
    d += 'Total cost: ' + fmtDollars(totalPaid);
    d += '</div>';
    d += '</div>';

    // Amortization schedule (yearly)
    var t = '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    t += '<strong style="font-size:0.95rem">Amortization Schedule (Yearly)</strong>';
    t += '<div style="overflow-x:auto;margin-top:8px"><table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
    t += '<thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left;border-bottom:2px solid #cbd5e1">Year</th>';
    t += '<th style="padding:8px;text-align:right;border-bottom:2px solid #cbd5e1">Principal</th>';
    t += '<th style="padding:8px;text-align:right;border-bottom:2px solid #cbd5e1">Interest</th>';
    t += '<th style="padding:8px;text-align:right;border-bottom:2px solid #cbd5e1">Balance</th></tr></thead><tbody>';

    yearlyData.forEach(function(yr) {
      t += '<tr><td style="padding:6px 8px;border-bottom:1px solid #e2e8f0">Year ' + yr.year + '</td>';
      t += '<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0">' + fmtDollars(yr.principal) + '</td>';
      t += '<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0">' + fmtDollars(yr.interest) + '</td>';
      t += '<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0">' + fmtDollars(yr.balance) + '</td></tr>';
    });

    if (hasBalloon) {
      t += '<tr style="background:#fef3c7;font-weight:600"><td style="padding:6px 8px;border-bottom:1px solid #e2e8f0">Balloon</td>';
      t += '<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0" colspan="2">Due year ' + balloon + '</td>';
      t += '<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0">' + fmtDollars(balloonAmount) + '</td></tr>';
    }

    t += '</tbody></table></div></div>';

    resultDetails.innerHTML = d;
    amortTable.innerHTML = t;
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

  var inputs = [salePrice, downPayment, interestRate, loanTerm, balloonYears];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
