(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtD(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  function pmt(rate, nper, pv) {
    if (rate === 0) return pv / nper;
    var r = rate / 12;
    return pv * (r * Math.pow(1 + r, nper)) / (Math.pow(1 + r, nper) - 1);
  }

  function remainingBalance(origPV, rate, totalPayments, paymentsMade) {
    if (rate === 0) return origPV * (1 - paymentsMade / totalPayments);
    var r = rate / 12;
    var payment = pmt(rate, totalPayments, origPV);
    return origPV * Math.pow(1 + r, paymentsMade) - payment * (Math.pow(1 + r, paymentsMade) - 1) / r;
  }

  var origAmountEl = document.getElementById('origAmount');
  var origRateEl = document.getElementById('origRate');
  var origTermEl = document.getElementById('origTerm');
  var yearsRemainingEl = document.getElementById('yearsRemaining');
  var purchasePriceEl = document.getElementById('purchasePrice');
  var currentRateEl = document.getElementById('currentRate');
  var newTermEl = document.getElementById('newTerm');
  var newDownEl = document.getElementById('newDown');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['2.50%', '$1,422', '$2,499', '$1,077', '$361,908'],
    ['3.00%', '$1,510', '$2,499', '$989', '$332,308'],
    ['3.25%', '$1,555', '$2,499', '$944', '$317,508'],
    ['3.50%', '$1,601', '$2,499', '$898', '$302,108'],
    ['4.00%', '$1,695', '$2,499', '$804', '$270,108'],
    ['4.50%', '$1,793', '$2,499', '$706', '$237,408']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var origAmt = getVal(origAmountEl);
    var origRate = getVal(origRateEl) / 100;
    var origTermYrs = getVal(origTermEl);
    var yrsRemaining = getVal(yearsRemainingEl);
    var price = getVal(purchasePriceEl);
    var curRate = getVal(currentRateEl) / 100;
    var newTermYrs = getVal(newTermEl);
    var newDownPct = getVal(newDownEl) / 100;

    if (origAmt <= 0 || price <= 0 || yrsRemaining <= 0) return;

    var totalPayments = origTermYrs * 12;
    var paymentsMade = (origTermYrs - yrsRemaining) * 12;
    var remBalance = remainingBalance(origAmt, origRate, totalPayments, paymentsMade);
    if (remBalance < 0) remBalance = 0;

    var assumedPayment = pmt(origRate, yrsRemaining * 12, remBalance);
    var assumedDownPayment = price - remBalance;
    var assumedTotalInterest = (assumedPayment * yrsRemaining * 12) - remBalance;

    var newLoanAmt = price * (1 - newDownPct);
    var newPayment = pmt(curRate, newTermYrs * 12, newLoanAmt);
    var newTotalInterest = (newPayment * newTermYrs * 12) - newLoanAmt;
    var newDownAmt = price * newDownPct;

    var monthlySavings = newPayment - assumedPayment;
    var interestSaved = newTotalInterest - assumedTotalInterest;

    document.getElementById('rAssumed').textContent = fmtD(assumedPayment) + '/mo';
    document.getElementById('rNew').textContent = fmtD(newPayment) + '/mo';
    document.getElementById('rSavings').textContent = fmtD(monthlySavings) + '/mo';
    document.getElementById('rSavings').style.color = monthlySavings > 0 ? '#059669' : '#dc2626';
    document.getElementById('rInterest').textContent = fmtD(interestSaved);
    document.getElementById('rInterest').style.color = interestSaved > 0 ? '#059669' : '#dc2626';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;border-left:4px solid #059669">';
    d += '<strong style="color:#059669">Assume Existing Loan</strong><br>';
    d += 'Remaining balance: ' + fmtD(remBalance) + '<br>';
    d += 'Rate: ' + fmt(origRate * 100, 2) + '% (locked in)<br>';
    d += 'Monthly payment: ' + fmtD(assumedPayment) + '<br>';
    d += 'Years remaining: ' + fmt(yrsRemaining, 0) + '<br>';
    d += 'Total interest: ' + fmtD(assumedTotalInterest) + '<br>';
    d += '<strong>Down payment needed: ' + fmtD(assumedDownPayment) + '</strong>';
    d += '</div>';

    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;border-left:4px solid #6b7280">';
    d += '<strong>New Loan</strong><br>';
    d += 'Loan amount: ' + fmtD(newLoanAmt) + '<br>';
    d += 'Rate: ' + fmt(curRate * 100, 2) + '%<br>';
    d += 'Monthly payment: ' + fmtD(newPayment) + '<br>';
    d += 'Term: ' + fmt(newTermYrs, 0) + ' years<br>';
    d += 'Total interest: ' + fmtD(newTotalInterest) + '<br>';
    d += '<strong>Down payment: ' + fmtD(newDownAmt) + '</strong>';
    d += '</div>';

    d += '</div>';

    d += '<div style="padding:14px;background:' + (monthlySavings > 0 ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px;font-size:0.9rem">';
    if (monthlySavings > 0) {
      d += '<strong style="color:#059669">Assuming the mortgage saves you ' + fmtD(monthlySavings) + '/month</strong><br>';
      d += 'Lifetime savings: <strong>' + fmtD(interestSaved) + ' in interest</strong><br>';
    } else {
      d += '<strong>A new loan is cheaper by ' + fmtD(Math.abs(monthlySavings)) + '/month</strong><br>';
    }
    var downDiff = assumedDownPayment - newDownAmt;
    if (downDiff > 0) {
      d += '<span style="color:#b45309">Note: Assumption requires ' + fmtD(downDiff) + ' more upfront than a ' + fmt(newDownPct * 100, 0) + '% down new loan. Consider a second mortgage or bridge loan for the gap.</span>';
    } else {
      d += 'The assumption also requires less cash upfront than the new loan.';
    }
    d += '</div>';

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

  [origAmountEl, origRateEl, origTermEl, yearsRemainingEl, purchasePriceEl, currentRateEl, newTermEl, newDownEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
