(function() {
  'use strict';

  var method = 'lmp';

  var chartData = [
    ['Week 4', '1st', 'Positive pregnancy test possible'],
    ['Week 6', '1st', 'Heartbeat detectable on ultrasound'],
    ['Week 8', '1st', 'First prenatal visit typically scheduled'],
    ['Week 12', '1st', 'End of first trimester; risk of miscarriage drops'],
    ['Week 16', '2nd', 'Gender may be visible on ultrasound'],
    ['Week 20', '2nd', 'Anatomy scan; halfway point'],
    ['Week 24', '2nd', 'Viability milestone'],
    ['Week 28', '3rd', 'Third trimester begins'],
    ['Week 36', '3rd', 'Baby is considered early term'],
    ['Week 37', '3rd', 'Full term begins'],
    ['Week 40', '3rd', 'Estimated due date']
  ];

  // Method toggle
  var methodBtns = document.querySelectorAll('#methodToggle button');
  methodBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      methodBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      method = btn.dataset.method;
      document.getElementById('lmpGroup').style.display = method === 'lmp' ? '' : 'none';
      document.getElementById('conceptionGroup').style.display = method === 'conception' ? '' : 'none';
    });
  });

  function formatDate(d) {
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function calculate() {
    var startDate;
    if (method === 'lmp') {
      var lmpVal = document.getElementById('lmpDate').value;
      if (!lmpVal) return;
      startDate = new Date(lmpVal + 'T00:00:00');
    } else {
      var conVal = document.getElementById('conceptionDate').value;
      if (!conVal) return;
      // Conception is ~14 days after LMP, so subtract 14 days to get equivalent LMP
      startDate = new Date(conVal + 'T00:00:00');
      startDate.setDate(startDate.getDate() - 14);
    }

    // Naegele's Rule: LMP + 280 days
    var dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 280);

    // Current progress
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var daysSinceLMP = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    var weeksPregnant = Math.floor(daysSinceLMP / 7);
    var daysExtra = daysSinceLMP % 7;
    var daysRemaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    // Trimester
    var trimester;
    if (weeksPregnant < 13) trimester = '1st Trimester';
    else if (weeksPregnant < 28) trimester = '2nd Trimester';
    else trimester = '3rd Trimester';

    // Conception window (LMP + 11 to LMP + 21 days)
    var conStart = new Date(startDate);
    conStart.setDate(conStart.getDate() + 11);
    var conEnd = new Date(startDate);
    conEnd.setDate(conEnd.getDate() + 21);

    document.getElementById('dueDate').textContent = formatDate(dueDate);

    if (daysSinceLMP >= 0 && daysSinceLMP <= 300) {
      document.getElementById('currentWeek').textContent = 'Week ' + weeksPregnant + ', Day ' + daysExtra;
    } else {
      document.getElementById('currentWeek').textContent = 'N/A';
    }

    document.getElementById('trimester').textContent = trimester;
    document.getElementById('daysLeft').textContent = daysRemaining > 0 ? daysRemaining + ' days' : 'Past due date';
    document.getElementById('conceptionWindow').textContent = formatDate(conStart) + ' \u2013 ' + formatDate(conEnd);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
