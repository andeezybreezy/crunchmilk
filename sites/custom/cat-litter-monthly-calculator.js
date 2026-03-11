(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cats = parseFloat(document.getElementById('cats').value) || 0;
    var litterType = document.getElementById('litterType').value;
    var pricePerBag = parseFloat(document.getElementById('pricePerBag').value) || 0;
    var bagLbs = parseFloat(document.getElementById('bagLbs').value) || 0;

    // Calculation logic
    var basePerCat = {'Clumping Clay': 7, 'Non-Clumping Clay': 10, 'Crystal/Silica': 5, 'Pine/Natural': 8, 'Corn/Wheat': 7}; var lbsPerWeek = (basePerCat[litterType] || 7) * cats; var monthlyLbs = lbsPerWeek * 4.33; var bagsPerMonth = Math.ceil(monthlyLbs / bagLbs); var monthlyCost = bagsPerMonth * pricePerBag; return {monthlyLbs: fmt(monthlyLbs,0), bagsPerMonth: fmt(bagsPerMonth,0), monthlyCost: dollar(monthlyCost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cats', 'litterType', 'pricePerBag', 'bagLbs'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
