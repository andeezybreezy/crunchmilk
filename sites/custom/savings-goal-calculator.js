(function() {
  'use strict';

  var mode = 'time';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Mode toggle
  var modeBtns = document.querySelectorAll('#modeToggle button');
  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.getAttribute('data-mode');

      document.getElementById('monthlyGroup').style.display = (mode === 'time') ? '' : 'none';
      document.getElementById('timelineGroup').style.display = (mode === 'payment') ? '' : 'none';

      if (mode === 'time') {
        document.getElementById('mainLabel').textContent = 'Months to Goal';
      } else {
        document.getElementById('mainLabel').textContent = 'Monthly Payment Needed';
      }
    });
  });

  function calculate() {
    var goal = parseFloat(document.getElementById('goalAmount').value) || 0;
    var current = parseFloat(document.getElementById('currentSavings').value) || 0;
    var annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var monthlyRate = annualRate / 100 / 12;

    if (goal <= 0 || goal <= current) return;

    var needed = goal - current;
    var months, monthlyContrib;

    if (mode === 'time') {
      monthlyContrib = parseFloat(document.getElementById('monthlyContrib').value) || 0;
      if (monthlyContrib <= 0) return;

      // Calculate months to reach goal
      if (monthlyRate === 0) {
        months = Math.ceil(needed / monthlyContrib);
      } else {
        // FV = PV(1+r)^n + PMT*((1+r)^n - 1)/r = goal
        // Solve for n
        var num = Math.log((goal * monthlyRate + monthlyContrib) / (current * monthlyRate + monthlyContrib));
        var den = Math.log(1 + monthlyRate);
        months = Math.ceil(num / den);
      }
    } else {
      months = parseInt(document.getElementById('timeline').value) || 0;
      if (months <= 0) return;

      // Calculate monthly contribution needed
      if (monthlyRate === 0) {
        monthlyContrib = needed / months;
      } else {
        var fvCurrent = current * Math.pow(1 + monthlyRate, months);
        var remaining = goal - fvCurrent;
        monthlyContrib = remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
      }
      monthlyContrib = Math.max(0, monthlyContrib);
    }

    // Build schedule
    var balance = current;
    var totalContribs = 0;
    var totalInterest = 0;
    var tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    var displayMonths = Math.min(months, 600); // cap display
    for (var m = 1; m <= displayMonths; m++) {
      var interest = balance * monthlyRate;
      balance += monthlyContrib + interest;
      totalContribs += monthlyContrib;
      totalInterest += interest;

      if (balance >= goal) {
        balance = goal;
      }

      // Show every month for short timelines, every 6 months for longer
      var showRow = (displayMonths <= 36) || (m % 6 === 0) || m === 1 || m === displayMonths;
      if (showRow) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + m + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(monthlyContrib) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(interest) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(balance) + '</td>';
        tbody.appendChild(tr);
      }

      if (balance >= goal) break;
    }

    // Target date
    var now = new Date();
    var targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    var dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (mode === 'time') {
      var yrs = Math.floor(months / 12);
      var mos = months % 12;
      var timeStr = '';
      if (yrs > 0) timeStr += yrs + (yrs === 1 ? ' year' : ' years');
      if (mos > 0) timeStr += (timeStr ? ' ' : '') + mos + (mos === 1 ? ' month' : ' months');
      document.getElementById('mainResult').textContent = timeStr || months + ' months';
    } else {
      document.getElementById('mainResult').textContent = fmt(monthlyContrib);
    }

    document.getElementById('targetDate').textContent = dateStr;
    document.getElementById('totalContrib').textContent = fmt(totalContribs + current);
    document.getElementById('interestEarned').textContent = fmt(totalInterest);
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
