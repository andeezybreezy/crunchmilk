(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dogWeight = parseFloat(document.getElementById('dogWeight').value) || 0;
    var dogAge = document.getElementById('dogAge').value;
    var currentFood = document.getElementById('currentFood').value;
    var activityLevel = document.getElementById('activityLevel').value;

    // Calculation logic
    var actMult = {low:0.85,moderate:1.0,high:1.25}; var ageMult = {puppy:1.2,adult:1.0,senior:0.85}; var am = actMult[activityLevel] || 1.0; var agm = ageMult[dogAge] || 1.0; var dailyCups = (dogWeight / 10) * 0.75 * am * agm; var costPerCup = {budget_kibble:0.25,mid_kibble:0.55,premium_kibble:1.10}; var bk = dailyCups * costPerCup.budget_kibble * 30; var mk = dailyCups * costPerCup.mid_kibble * 30; var pk = dailyCups * costPerCup.premium_kibble * 30; var dailyLbs = dogWeight * 0.025 * am * agm; var ff = dailyLbs * 8.00 * 30; var rp = dailyLbs * 6.50 * 30; var rd = dailyLbs * 2.50 * 30; document.getElementById('budgetKibble').textContent = dollar(bk); document.getElementById('midKibble').textContent = dollar(mk); document.getElementById('premiumKibble').textContent = dollar(pk); document.getElementById('freshFood').textContent = dollar(ff); document.getElementById('rawPremade').textContent = dollar(rp); document.getElementById('rawDIY').textContent = dollar(rd);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dogWeight', 'dogAge', 'currentFood', 'activityLevel'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
