(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var income = parseFloat(document.getElementById('income').value) || 0;
    var mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
    var devaluation = document.getElementById('devaluation').value;

    // Calculation logic
    var deval=parseFloat(devaluation)/100; var multiplier=1/(1-deval); var savingsReal=savings*(1-deval); var savingsLoss=savings-savingsReal; var groceryImpact=200*multiplier; var gasImpact=3.50*multiplier; var mortgageReal=mortgage*(1-deval); var goldOz=savings/2350; var goldHedge=goldOz*2350*multiplier;     document.getElementById('savingsReal').textContent = dollar(savingsReal);
    document.getElementById('savingsLoss').textContent = dollar(savingsLoss)+' lost';
    document.getElementById('groceryImpact').textContent = dollar(groceryImpact)+'/week';
    document.getElementById('gasImpact').textContent = dollar(gasImpact)+'/gallon';
    document.getElementById('mortgageReal').textContent = dollar(mortgageReal)+' (debt shrinks!)';
    document.getElementById('goldHedge').textContent = dollar(goldHedge)+' (if you held gold)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['savings', 'income', 'mortgage', 'devaluation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
