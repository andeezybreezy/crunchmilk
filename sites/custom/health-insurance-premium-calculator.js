(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var familySize = parseFloat(document.getElementById('familySize').value) || 0;
    var tier = document.getElementById('tier').value;

    // Calculation logic
    var basePremiums = {'Bronze': 350, 'Silver': 450, 'Gold': 550, 'Platinum': 700}; var base = basePremiums[tier] || 450; var ageFactor = 1 + ((age - 21) * 0.015); var famFactor = 1 + ((familySize - 1) * 0.6); var monthlyPremium = base * ageFactor * famFactor; var fpl = 15060 + (familySize - 1) * 5380; var fplPct = income / fpl * 100; var subsidy = fplPct < 400 ? monthlyPremium * 0.3 : 0; monthlyPremium = monthlyPremium - subsidy; var annualPremium = monthlyPremium * 12;     document.getElementById('monthlyPremium').textContent = dollar(monthlyPremium);
    document.getElementById('annualPremium').textContent = dollar(annualPremium);
    document.getElementById('subsidy').textContent = dollar(subsidy);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'age', 'familySize', 'tier'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
