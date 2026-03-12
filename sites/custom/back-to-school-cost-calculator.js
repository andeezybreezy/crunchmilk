(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gradeLevel = document.getElementById('gradeLevel').value;
    var numKids = parseFloat(document.getElementById('numKids').value) || 0;
    var clothingBudget = parseFloat(document.getElementById('clothingBudget').value) || 0;
    var electronics = parseFloat(document.getElementById('electronics').value) || 0;
    var quality = document.getElementById('quality').value;

    // Calculation logic
    var baseCosts = {prek: 80, elementary: 120, middle: 180, high: 220, college: 400}; var qualMult = {budget: 0.7, mid: 1.0, premium: 1.5}; var base = baseCosts[gradeLevel] || 120; var qm = qualMult[quality] || 1.0; var supplyPerKid = base * qm; var clothingAll = clothingBudget * numKids; var techCost = electronics; var totalPerKid = supplyPerKid + clothingBudget + (electronics / numKids); var total = supplyPerKid * numKids + clothingAll + techCost; var avgPerKid = 890; var diff = totalPerKid - avgPerKid; document.getElementById('supplyCost').textContent = dollar(supplyPerKid); document.getElementById('clothingTotal').textContent = dollar(clothingAll) + ' (' + numKids + ' kids)'; document.getElementById('techCost').textContent = dollar(techCost); document.getElementById('totalCost').textContent = dollar(total); document.getElementById('vsAverage').textContent = (diff >= 0 ? '+' : '') + dollar(diff) + '/child vs $890 avg';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gradeLevel', 'numKids', 'clothingBudget', 'electronics', 'quality'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
