(function() {
  'use strict';

  var mode = 'time';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtR(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  // Mode toggle
  var modeBtns = document.querySelectorAll('#modeToggle button');
  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.getAttribute('data-mode');

      document.getElementById('paymentGroup').style.display = (mode === 'time') ? '' : 'none';
      document.getElementById('timeGroup').style.display = (mode === 'payment') ? '' : 'none';
      document.getElementById('mainLabel').textContent = (mode === 'time') ? 'Months to Payoff' : 'Monthly Payment Needed';
    });
  });

  function calcPayoff(debt, annualRate, monthlyPayment) {
    var r = annualRate / 100 / 12;
    var balance = debt;
    var totalInterest = 0;
    var months = 0;
    var maxMonths = 1200;

    if (monthlyPayment <= balance * r) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity };
    }

    while (balance > 0.01 && months < maxMonths) {
      var interest = balance * r;
      var principal = monthlyPayment - interest;
      if (principal > balance) {
        totalInterest += balance * r;
        balance = 0;
      } else {
        balance -= principal;
        totalInterest += interest;
      }
      months++;
    }

    return {
      months: months,
      totalInterest: totalInterest,
      totalPaid: debt + totalInterest
    };
  }

  function calcPaymentNeeded(debt, annualRate, months) {
    var r = annualRate / 100 / 12;
    if (r === 0) return debt / months;
    return debt * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }

  function calculate() {
    var debt = parseFloat(document.getElementById('totalDebt').value) || 0;
    var rate = parseFloat(document.getElementById('interestRate').value) || 0;

    if (debt <= 0 || rate <= 0) return;

    var months, payment, result;

    if (mode === 'time') {
      payment = parseFloat(document.getElementById('monthlyPayment').value) || 0;
      if (payment <= 0) return;
      result = calcPayoff(debt, rate, payment);
      months = result.months;

      if (months === Infinity) {
        document.getElementById('mainResult').textContent = 'Never';
        document.getElementById('debtFreeDate').textContent = 'Payment too low';
        document.getElementById('totalInterest').textContent = '—';
        document.getElementById('totalPaid').textContent = '—';
        return;
      }

      var yrs = Math.floor(months / 12);
      var mos = months % 12;
      var timeStr = '';
      if (yrs > 0) timeStr += yrs + (yrs === 1 ? ' year' : ' years');
      if (mos > 0) timeStr += (timeStr ? ' ' : '') + mos + (mos === 1 ? ' month' : ' months');
      document.getElementById('mainResult').textContent = timeStr || months + ' months';
    } else {
      months = parseInt(document.getElementById('desiredMonths').value) || 0;
      if (months <= 0) return;
      payment = calcPaymentNeeded(debt, rate, months);
      result = calcPayoff(debt, rate, payment);
      document.getElementById('mainResult').textContent = fmt(payment);
    }

    // Debt-free date
    var now = new Date();
    var freeDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    document.getElementById('debtFreeDate').textContent = freeDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    document.getElementById('totalInterest').textContent = fmtR(result.totalInterest);
    document.getElementById('totalPaid').textContent = fmtR(result.totalPaid);

    // Comparison table: minimum payment and several accelerated levels
    var minPayment = Math.max(debt * 0.02, 25); // typical CC minimum
    var tbody = document.getElementById('compareBody');
    tbody.innerHTML = '';

    var scenarios = [
      ['Minimum (' + fmt(minPayment) + ')', minPayment],
      ['1.5× Minimum', minPayment * 1.5],
      ['2× Minimum', minPayment * 2]
    ];

    if (mode === 'time' && payment > 0) {
      scenarios.push(['Your Payment', payment]);
    }
    if (mode === 'payment') {
      scenarios.push(['Calculated Payment', payment]);
    }

    // Add a faster option
    var fastPayment = calcPaymentNeeded(debt, rate, 24);
    scenarios.push(['Pay in 24 months', fastPayment]);

    scenarios.forEach(function(s) {
      var r2 = calcPayoff(debt, rate, s[1]);
      var tr = document.createElement('tr');
      var monthsText = r2.months === Infinity ? 'Never' : r2.months + ' mo';
      var intText = r2.totalInterest === Infinity ? '—' : fmtR(r2.totalInterest);
      var paidText = r2.totalPaid === Infinity ? '—' : fmtR(r2.totalPaid);
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee;font-size:0.9rem">' + s[0] + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(s[1]) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + monthsText + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + intText + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + paidText + '</td>';
      tbody.appendChild(tr);
    });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
