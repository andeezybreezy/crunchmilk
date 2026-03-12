(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailySpend = parseFloat(document.getElementById('dailySpend').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;

    // Calculation logic
    var weekly = dailySpend * daysPerWeek;
    var monthly = weekly * 4.333;
    var yearly = weekly * 52;
    var totalSpent = yearly * years;
    var monthlyInvest = monthly;
    var monthlyRate = returnRate / 100 / 12;
    var months = years * 12;
    var fv = monthlyInvest * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    var diff = fv - totalSpent;
    document.getElementById('weekly').textContent = dollar(weekly) + '/week (' + dollar(monthly) + '/month)';
    document.getElementById('yearly').textContent = dollar(yearly) + '/year';
    document.getElementById('totalSpent').textContent = dollar(totalSpent);
    document.getElementById('ifInvested').textContent = dollar(fv) + ' (at ' + returnRate + '% annual return)';
    document.getElementById('difference').textContent = dollar(diff) + ' in growth from compound interest';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailySpend', 'daysPerWeek', 'years', 'returnRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
