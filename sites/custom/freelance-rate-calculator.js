(function() {
  'use strict';

  var desiredSalary = document.getElementById('desiredSalary');
  var annualExpenses = document.getElementById('annualExpenses');
  var vacationDays = document.getElementById('vacationDays');
  var sickDays = document.getElementById('sickDays');
  var nonBillable = document.getElementById('nonBillable');
  var profitMargin = document.getElementById('profitMargin');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var hourlyRate = document.getElementById('hourlyRate');
  var dailyRate = document.getElementById('dailyRate');
  var weeklyRate = document.getElementById('weeklyRate');
  var monthlyRate = document.getElementById('monthlyRate');
  var billableHours = document.getElementById('billableHours');
  var annualRevenue = document.getElementById('annualRevenue');
  var projectRatesWrap = document.getElementById('projectRatesWrap');
  var projectBody = document.getElementById('projectBody');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtRound(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var salary = parseFloat(desiredSalary.value) || 0;
    var expenses = parseFloat(annualExpenses.value) || 0;
    var vacation = parseInt(vacationDays.value, 10) || 0;
    var sick = parseInt(sickDays.value, 10) || 0;
    var nonBillPct = (parseFloat(nonBillable.value) || 0) / 100;
    var profitPct = (parseFloat(profitMargin.value) || 0) / 100;

    var workDays = 260; // 52 weeks × 5 days
    var availableDays = workDays - vacation - sick;
    if (availableDays <= 0) return;

    var billablePct = 1 - nonBillPct;
    var totalBillableHours = availableDays * 8 * billablePct;
    if (totalBillableHours <= 0) return;

    var totalNeeded = (salary + expenses) * (1 + profitPct);
    var hourly = totalNeeded / totalBillableHours;
    var daily = hourly * 8;
    var weekly = daily * 5;
    var monthly = totalNeeded / 12;

    hourlyRate.textContent = fmt(hourly);
    dailyRate.textContent = fmtRound(daily);
    weeklyRate.textContent = fmtRound(weekly);
    monthlyRate.textContent = fmtRound(monthly);
    billableHours.textContent = Math.round(totalBillableHours).toLocaleString('en-US');
    annualRevenue.textContent = fmtRound(totalNeeded);

    resultDiv.classList.add('visible');

    // Project rate estimates
    var projects = [
      ['Small project (logo, single page)', '5–10', 7.5],
      ['Medium project (website, brochure set)', '20–40', 30],
      ['Large project (web app, brand identity)', '60–120', 90],
      ['Retainer (10 hrs/month)', '10/mo', 10],
      ['Retainer (20 hrs/month)', '20/mo', 20],
      ['Full-time engagement (month)', '~' + Math.round(availableDays / 12 * 8 * billablePct) + ' hrs', availableDays / 12 * 8 * billablePct]
    ];

    var rows = '';
    projects.forEach(function(p) {
      var price = hourly * p[2];
      rows += '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td><td>' + fmtRound(price) + '</td></tr>';
    });
    projectBody.innerHTML = rows;
    projectRatesWrap.style.display = 'block';
  }

  calcBtn.addEventListener('click', calculate);

  [desiredSalary, annualExpenses, vacationDays, sickDays, nonBillable, profitMargin].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  calculate();
})();
