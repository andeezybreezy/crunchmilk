(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualSpend = parseFloat(document.getElementById('annualSpend').value) || 0;
    var currentTariff = parseFloat(document.getElementById('currentTariff').value) || 0;
    var altTariff = parseFloat(document.getElementById('altTariff').value) || 0;
    var altPricePremium = parseFloat(document.getElementById('altPricePremium').value) || 0;
    var transitionCost = parseFloat(document.getElementById('transitionCost').value) || 0;

    // Calculation logic
    var currentTotal = annualSpend * (1 + currentTariff / 100);
    var altGoods = annualSpend * (1 + altPricePremium / 100);
    var altTotal = altGoods * (1 + altTariff / 100);
    var savings = currentTotal - altTotal;
    var payback = savings > 0 ? transitionCost / savings * 12 : Infinity;
    document.getElementById('currentCost').textContent = dollar(currentTotal);
    document.getElementById('altCost').textContent = dollar(altTotal);
    document.getElementById('annualSavings').textContent = savings > 0 ? dollar(savings) + '/year' : 'No savings (current is cheaper)';
    document.getElementById('paybackPeriod').textContent = payback === Infinity ? 'N/A' : fmt(payback, 1) + ' months';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualSpend', 'currentTariff', 'altTariff', 'altPricePremium', 'transitionCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
