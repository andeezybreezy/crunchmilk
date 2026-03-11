(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var crudePrice = parseFloat(document.getElementById('crudePrice').value) || 0;
    var stateTax = parseFloat(document.getElementById('stateTax').value) || 0;
    var refiningCost = parseFloat(document.getElementById('refiningCost').value) || 0;

    // Calculation logic
    var crudePerGal = v.crudePrice / 42; var fedTax = 0.184; var totalTax = fedTax + v.stateTax; var margin = 0.15; var est = crudePerGal + v.refiningCost + totalTax + margin; var crudePct = (crudePerGal / est * 100); return {crudePerGallon: '$' + crudePerGal.toFixed(2), federalTax: '$' + fedTax.toFixed(3), totalTax: '$' + totalTax.toFixed(3), retailMargin: '$' + margin.toFixed(2), estimatedGas: '$' + est.toFixed(2) + '/gal', crudePct: crudePct.toFixed(0) + '%'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['crudePrice', 'stateTax', 'refiningCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
