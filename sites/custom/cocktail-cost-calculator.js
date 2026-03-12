(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bottleCost = parseFloat(document.getElementById('bottleCost').value) || 0;
    var bottleOz = parseFloat(document.getElementById('bottleOz').value) || 0;
    var ozPerDrink = parseFloat(document.getElementById('ozPerDrink').value) || 0;
    var mixerCost = parseFloat(document.getElementById('mixerCost').value) || 0;

    // Calculation logic
    var costPerOz=bottleCost/bottleOz; var spiritCost=costPerOz*ozPerDrink; var costPerDrink=spiritCost+mixerCost; var drinksPerBottle=Math.floor(bottleOz/ozPerDrink); var suggestedPrice=costPerDrink*4; var profitPerDrink=suggestedPrice-costPerDrink;     document.getElementById('costPerDrink').textContent = dollar(costPerDrink);
    document.getElementById('drinksPerBottle').textContent = drinksPerBottle+' drinks';
    document.getElementById('suggestedPrice').textContent = dollar(suggestedPrice);
    document.getElementById('profitPerDrink').textContent = dollar(profitPerDrink);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bottleCost', 'bottleOz', 'ozPerDrink', 'mixerCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
