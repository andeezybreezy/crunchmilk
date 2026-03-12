(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var region = document.getElementById('region').value;
    var elecRate = parseFloat(document.getElementById('elecRate').value) || 0;
    var acAge = parseFloat(document.getElementById('acAge').value) || 0;
    var thermostat = parseFloat(document.getElementById('thermostat').value) || 0;

    // Calculation logic
    var btuNeeded = sqft * 20; var tonnage = btuNeeded / 12000; var regionHours = {north: 600, midwest: 900, south: 1400, southwest: 1200, west: 400}; var hours = regionHours[region] || 900; var seer = Math.max(8, 16 - acAge * 0.4); var kwhPerHour = (btuNeeded / 1000) / seer; var monthlyHours = hours / 4; var monthlyCost = kwhPerHour * monthlyHours * elecRate; var summerTotal = monthlyCost * 4; var dailyCost = monthlyCost / 30; var degreeDiff = Math.max(0, 78 - thermostat); var savings = summerTotal * (degreeDiff * 0.03); var yearlyCost = kwhPerHour * hours * elecRate; document.getElementById('monthlyCooling').textContent = dollar(monthlyCost) + '/month'; document.getElementById('summerTotal').textContent = dollar(summerTotal); document.getElementById('dailyCost').textContent = dollar(dailyCost) + '/day'; document.getElementById('savingsAt78').textContent = savings > 0 ? dollar(savings) + ' saved' : 'Already at/above 78F'; document.getElementById('yearlyAC').textContent = dollar(yearlyCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'region', 'elecRate', 'acAge', 'thermostat'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
