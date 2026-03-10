(function() {
  'use strict';

  var viewMode = 'yearly';
  var scheduleData = [];

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtR(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  // View toggle
  var viewBtns = document.querySelectorAll('#viewToggle button');
  viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      viewBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      viewMode = btn.getAttribute('data-view');
      document.getElementById('periodHead').textContent = viewMode === 'yearly' ? 'Year' : 'Month';
      renderSchedule();
    });
  });

  // Set default start date
  var startInput = document.getElementById('startDate');
  var now = new Date();
  startInput.value = now.getFullYear() + '-' + String(now.getMonth() + 2).padStart(2, '0');

  function renderSchedule() {
    var tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    if (viewMode === 'yearly') {
      // Aggregate by year
      var years = {};
      scheduleData.forEach(function(m) {
        var y = m.year;
        if (!years[y]) years[y] = { principal: 0, interest: 0, balance: 0 };
        years[y].principal += m.principal;
        years[y].interest += m.interest;
        years[y].balance = m.balance;
      });
      Object.keys(years).forEach(function(y) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + y + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmtR(years[y].principal) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmtR(years[y].interest) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmtR(years[y].balance) + '</td>';
        tbody.appendChild(tr);
      });
    } else {
      scheduleData.forEach(function(m) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + m.month + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(m.principal) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(m.interest) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(m.balance) + '</td>';
        tbody.appendChild(tr);
      });
    }
  }

  function calculate() {
    var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    var annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var years = parseInt(document.getElementById('loanTerm').value) || 30;
    var extra = parseFloat(document.getElementById('extraPayment').value) || 0;
    var startVal = document.getElementById('startDate').value;

    if (loanAmount <= 0 || annualRate <= 0) return;

    var r = annualRate / 100 / 12;
    var n = years * 12;
    var payment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Standard schedule (no extra)
    var balStd = loanAmount;
    var totalIntStd = 0;
    var monthsStd = 0;
    for (var i = 0; i < n && balStd > 0; i++) {
      var intStd = balStd * r;
      totalIntStd += intStd;
      balStd -= (payment - intStd);
      monthsStd++;
    }

    // Schedule with extra payments
    var balance = loanAmount;
    var totalInterest = 0;
    var totalPrincipal = 0;
    scheduleData = [];

    var startDate = startVal ? new Date(startVal + '-01') : new Date();
    var month = startDate.getMonth();
    var year = startDate.getFullYear();
    var monthCount = 0;

    while (balance > 0.01 && monthCount < n + 120) {
      var interest = balance * r;
      var principalPmt = payment - interest + extra;
      if (principalPmt > balance) principalPmt = balance;
      var actualPayment = interest + principalPmt;

      balance -= principalPmt;
      if (balance < 0) balance = 0;
      totalInterest += interest;
      totalPrincipal += principalPmt;
      monthCount++;

      var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      scheduleData.push({
        month: monthNames[month] + ' ' + year,
        year: year,
        principal: principalPmt,
        interest: interest,
        balance: balance,
        payment: actualPayment
      });

      month++;
      if (month > 11) { month = 0; year++; }
    }

    var totalCost = loanAmount + totalInterest;
    var lastEntry = scheduleData[scheduleData.length - 1];
    var payoffDate = lastEntry ? lastEntry.month : '—';
    var interestSaved = totalIntStd - totalInterest;
    var timeSavedMonths = monthsStd - monthCount;

    document.getElementById('monthlyPayment').textContent = fmt(payment);
    document.getElementById('totalPayment').textContent = fmt(payment + extra);
    document.getElementById('totalInterest').textContent = fmtR(totalInterest);
    document.getElementById('totalCost').textContent = fmtR(totalCost);
    document.getElementById('payoffDate').textContent = payoffDate;

    if (extra > 0) {
      document.getElementById('interestSaved').textContent = fmtR(interestSaved);
      document.getElementById('extraRow').style.display = '';
      var yrs = Math.floor(timeSavedMonths / 12);
      var mos = timeSavedMonths % 12;
      var saved = '';
      if (yrs > 0) saved += yrs + 'y ';
      saved += mos + 'mo';
      document.getElementById('timeSaved').textContent = saved;
      document.getElementById('origPayoff').textContent = monthsStd + ' months';
    } else {
      document.getElementById('interestSaved').textContent = '—';
      document.getElementById('extraRow').style.display = 'none';
    }

    renderSchedule();
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
