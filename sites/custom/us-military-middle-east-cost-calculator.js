(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var taxYears = parseFloat(document.getElementById('taxYears').value) || 0;

    // Calculation logic
    var totalCost = 8000000000000; var taxpayers = 150000000; var avgShare = totalCost / taxpayers; var brackets = [[11000,0.1],[44725,0.12],[95375,0.22],[182100,0.24],[231250,0.32],[578125,0.35],[Infinity,0.37]]; var effectiveRate = 0; var remaining = income; for (var i = 0; i < brackets.length && remaining > 0; i++) { var prev = i > 0 ? brackets[i-1][0] : 0; var taxable = Math.min(remaining, brackets[i][0] - prev); effectiveRate += taxable * brackets[i][1]; remaining -= taxable; } effectiveRate = effectiveRate / income; var avgRate = 0.18; var myMultiplier = effectiveRate / avgRate; var myAnnualShare = (totalCost / taxpayers / 23) * myMultiplier; var myLifetime = myAnnualShare * taxYears; var altUses = []; if (myLifetime > 30000) altUses.push('a year of college'); if (myLifetime > 50000) altUses.push('a down payment on a home'); if (myLifetime > 100000) altUses.push('starting a small business'); var alt = altUses.length > 0 ? altUses.join(', ') : 'months of groceries';     document.getElementById('lifetimeShare').textContent = '$' + Math.round(myLifetime).toLocaleString();
    document.getElementById('annualShare').textContent = '$' + Math.round(myAnnualShare).toLocaleString() + '/yr';
    document.getElementById('monthlyShare').textContent = '$' + Math.round(myAnnualShare / 12) + '/mo';
    document.getElementById('dailyShare').textContent = '$' + (myAnnualShare / 365).toFixed(2) + '/day';
    document.getElementById('altUse').textContent = alt;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'taxYears'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
