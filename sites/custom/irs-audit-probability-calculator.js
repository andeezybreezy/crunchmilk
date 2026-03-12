(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var filing = document.getElementById('filing').value;
    var homeOffice = document.getElementById('homeOffice').value;
    var highDeductions = document.getElementById('highDeductions').value;
    var cashBusiness = document.getElementById('cashBusiness').value;
    var crypto = document.getElementById('crypto').value;

    // Calculation logic
    var base = 0.4; if(filing === 'self') { base = 1.6; } else if(income < 25000) { base = 0.4; } else if(income < 50000) { base = 0.4; } else if(income < 100000) { base = 0.3; } else if(income < 200000) { base = 0.4; } else if(income < 500000) { base = 0.7; } else if(income < 1000000) { base = 1.1; } else { base = 2.0; } if(income > 1000000 && filing === 'self') { base = 4.0; } var mult = 1.0; var topRedFlag = 'None identified — your profile looks typical'; if(cashBusiness === 'yes') { mult *= 2.0; topRedFlag = 'Cash-heavy business — IRS focuses on unreported cash income'; } if(homeOffice === 'yes') { mult *= 1.5; if(topRedFlag.indexOf('None') === 0) topRedFlag = 'Home office deduction — one of the most commonly flagged deductions'; } if(highDeductions === 'yes') { mult *= 1.7; topRedFlag = 'High deductions relative to income — triggers IRS DIF scoring'; } if(crypto === 'yes') { mult *= 1.4; if(topRedFlag.indexOf('None') === 0) topRedFlag = 'Crypto transactions — IRS is actively expanding enforcement here'; } if(filing === 'self' && income > 100000) { mult *= 1.2; } var adjusted = base * mult; adjusted = Math.min(adjusted, 50); var oddsNum = Math.round(100 / adjusted); var level = adjusted < 0.5 ? 'Low' : adjusted < 1.5 ? 'Moderate' : adjusted < 3.0 ? 'Elevated' : adjusted < 6.0 ? 'High' : 'Very High'; document.getElementById('baseRate').textContent = pct(base, 1) + ' (for your income bracket)'; document.getElementById('multiplier').textContent = fmt(mult, 1) + 'x'; document.getElementById('adjustedRate').textContent = pct(adjusted, 2); document.getElementById('riskLevel').textContent = level; document.getElementById('topFlag').textContent = topRedFlag; document.getElementById('odds').textContent = '1 in ' + oddsNum + ' chance';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'filing', 'homeOffice', 'highDeductions', 'cashBusiness', 'crypto'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
