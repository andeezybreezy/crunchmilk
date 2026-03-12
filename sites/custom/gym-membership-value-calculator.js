(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyFee = parseFloat(document.getElementById('monthlyFee').value) || 0;
    var annualFee = parseFloat(document.getElementById('annualFee').value) || 0;
    var plannedVisits = parseFloat(document.getElementById('plannedVisits').value) || 0;
    var actualVisits = parseFloat(document.getElementById('actualVisits').value) || 0;
    var driveTime = parseFloat(document.getElementById('driveTime').value) || 0;
    var hourlyWage = parseFloat(document.getElementById('hourlyWage').value) || 0;

    // Calculation logic
    var annualMembership = monthlyFee * 12 + annualFee; var actualVisitsYear = actualVisits * 52; var plannedVisitsYear = plannedVisits * 52; var costPerActual = actualVisitsYear > 0 ? annualMembership / actualVisitsYear : annualMembership; var costPerPlanned = plannedVisitsYear > 0 ? annualMembership / plannedVisitsYear : annualMembership; var driveHoursYear = (driveTime / 60) * actualVisitsYear; var timeCostYear = driveHoursYear * hourlyWage; var totalWithTime = annualMembership + timeCostYear; var homeGymValue = annualMembership * 3; document.getElementById('costPerVisit').textContent = dollar(costPerActual) + '/visit'; document.getElementById('plannedCostPerVisit').textContent = dollar(costPerPlanned) + '/visit (if you went ' + plannedVisits + 'x/week)'; document.getElementById('annualCost').textContent = dollar(annualMembership) + '/year'; document.getElementById('timeCost').textContent = fmt(driveHoursYear, 0) + ' hours driving (' + dollar(timeCostYear) + ' value)'; document.getElementById('totalCostIncTime').textContent = dollar(totalWithTime) + '/year (membership + time)'; document.getElementById('alternative').textContent = dollar(homeGymValue) + ' would buy a solid home gym (3-year payback)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyFee', 'annualFee', 'plannedVisits', 'actualVisits', 'driveTime', 'hourlyWage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
