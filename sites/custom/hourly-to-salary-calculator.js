(function() {
  'use strict';

  var dir = 'hourly';

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Direction toggle
  var dirBtns = document.querySelectorAll('#dirToggle button');
  dirBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      dirBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      dir = btn.getAttribute('data-dir');
      document.getElementById('hourlyGroup').style.display = dir === 'hourly' ? '' : 'none';
      document.getElementById('salaryGroup').style.display = dir === 'salary' ? '' : 'none';
    });
  });

  function calculate() {
    var hoursWeek = parseFloat(document.getElementById('hoursWeek').value) || 40;
    var weeksYear = parseFloat(document.getElementById('weeksYear').value) || 52;
    var taxRate = parseFloat(document.getElementById('taxRate').value) / 100;
    var totalHoursYear = hoursWeek * weeksYear;

    var hourly, annual;
    if (dir === 'hourly') {
      hourly = parseFloat(document.getElementById('hourlyRate').value) || 0;
      if (hourly <= 0) return;
      annual = hourly * totalHoursYear;
    } else {
      annual = parseFloat(document.getElementById('annualSalary').value) || 0;
      if (annual <= 0) return;
      hourly = annual / totalHoursYear;
    }

    var daily = hourly * (hoursWeek / 5);
    var weekly = hourly * hoursWeek;
    var biweekly = weekly * 2;
    var monthly = annual / 12;

    var rows = [
      ['Hourly', hourly],
      ['Daily', daily],
      ['Weekly', weekly],
      ['Biweekly', biweekly],
      ['Monthly', monthly],
      ['Annual', annual]
    ];

    var tbody = document.getElementById('resultBody');
    tbody.innerHTML = '';
    rows.forEach(function(row) {
      var tr = document.createElement('tr');
      var afterTax = row[1] * (1 - taxRate);
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + row[0] + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(row[1]) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(afterTax) + '</td>';
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
