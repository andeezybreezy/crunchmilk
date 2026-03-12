(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ingredient1 = parseFloat(document.getElementById('ingredient1').value) || 0;
    var ingredient2 = parseFloat(document.getElementById('ingredient2').value) || 0;
    var ingredient3 = parseFloat(document.getElementById('ingredient3').value) || 0;
    var ingredient4 = parseFloat(document.getElementById('ingredient4').value) || 0;
    var ingredient5 = parseFloat(document.getElementById('ingredient5').value) || 0;
    var servings = parseFloat(document.getElementById('servings').value) || 0;
    var overheadPct = parseFloat(document.getElementById('overheadPct').value) || 0;

    // Calculation logic
    var ingredientCost = ingredient1 + ingredient2 + ingredient3 + ingredient4 + ingredient5; var overhead = ingredientCost * (overheadPct / 100); var totalCost = ingredientCost + overhead; var costPerServing = totalCost / servings; var vsRestaurant = costPerServing * 3.5; var savings = vsRestaurant - costPerServing;     document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('costPerServing').textContent = dollar(costPerServing);
    document.getElementById('vsRestaurant').textContent = dollar(vsRestaurant);
    document.getElementById('savings').textContent = dollar(savings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4', 'ingredient5', 'servings', 'overheadPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
