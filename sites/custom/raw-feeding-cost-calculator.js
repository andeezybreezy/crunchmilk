(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dogWeight = parseFloat(document.getElementById('dogWeight').value) || 0;
    var activityLevel = document.getElementById('activityLevel').value;
    var proteinSource = document.getElementById('proteinSource').value;
    var sourceType = document.getElementById('sourceType').value;
    var supplements = document.getElementById('supplements').value;

    // Calculation logic
    var feedPct = {low:0.02,moderate:0.025,high:0.035,puppy:0.05}; var dailyLbs = dogWeight * (feedPct[activityLevel] || 0.025); var dailyOz = dailyLbs * 16; var pricePerLb = {chicken:{diy_bulk:1.50,coop:2.25,premade:5.00,delivery:7.50},mixed:{diy_bulk:2.25,coop:3.00,premade:6.50,delivery:9.00},beef:{diy_bulk:3.00,coop:3.75,premade:7.50,delivery:10.00},premium:{diy_bulk:4.50,coop:5.50,premade:10.00,delivery:14.00}}; var ppl = pricePerLb[proteinSource][sourceType] || 3.00; var dailyCost = dailyLbs * ppl; var monthly = dailyCost * 30; var annual = dailyCost * 365; var perMeal = dailyCost / 2; var suppCost = {none:0,basic:15,full:45}; var supp = suppCost[supplements] || 0; var totalMo = monthly + supp; document.getElementById('dailyAmount').textContent = fmt(dailyOz, 1) + ' oz (' + fmt(dailyLbs, 2) + ' lbs)'; document.getElementById('monthlyCost').textContent = dollar(monthly); document.getElementById('annualCost').textContent = dollar(annual); document.getElementById('costPerMeal').textContent = dollar(perMeal); document.getElementById('supplementCost').textContent = dollar(supp); document.getElementById('totalMonthly').textContent = dollar(totalMo);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dogWeight', 'activityLevel', 'proteinSource', 'sourceType', 'supplements'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
