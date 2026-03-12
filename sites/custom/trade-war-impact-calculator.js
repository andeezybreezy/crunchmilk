(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var productCost = parseFloat(document.getElementById('productCost').value) || 0;
    var importContent = parseFloat(document.getElementById('importContent').value) || 0;
    var tariffRate = parseFloat(document.getElementById('tariffRate').value) || 0;
    var sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
    var unitsPerYear = parseFloat(document.getElementById('unitsPerYear').value) || 0;
    var passThrough = parseFloat(document.getElementById('passThrough').value) || 0;

    // Calculation logic
    var importedCost = productCost * (importContent / 100);
    var tariffCost = importedCost * (tariffRate / 100);
    var newCost = productCost + tariffCost;
    var priceIncrease = tariffCost * (passThrough / 100);
    var absorbedCost = tariffCost - priceIncrease;
    var newPrice = sellingPrice + priceIncrease;
    var oldMargin = ((sellingPrice - productCost) / sellingPrice) * 100;
    var newMargin = ((newPrice - newCost) / newPrice) * 100;
    var annualImpact = absorbedCost * unitsPerYear;
    document.getElementById('costIncrease').textContent = '+' + dollar(tariffCost) + ' per unit';
    document.getElementById('newPrice').textContent = dollar(newPrice) + ' (was ' + dollar(sellingPrice) + ')';
    document.getElementById('marginImpact').textContent = fmt(newMargin, 1) + '% (was ' + fmt(oldMargin, 1) + '%)';
    document.getElementById('annualImpact').textContent = '-' + dollar(annualImpact) + ' annual profit loss';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['productCost', 'importContent', 'tariffRate', 'sellingPrice', 'unitsPerYear', 'passThrough'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
