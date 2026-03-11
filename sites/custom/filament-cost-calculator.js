(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var spoolPrice = parseFloat(document.getElementById('spoolPrice').value) || 0;
    var spoolWeight = parseFloat(document.getElementById('spoolWeight').value) || 0;
    var printWeight = parseFloat(document.getElementById('printWeight').value) || 0;
    var failRate = parseFloat(document.getElementById('failRate').value) || 0;

    // Calculation logic
    var cpg = spoolPrice / spoolWeight;
    var baseCost = cpg * printWeight;
    var adjusted = baseCost * (1 + failRate / 100);
    var pps = Math.floor(spoolWeight / printWeight);
    document.getElementById('costPerGram').textContent = dollar(cpg).replace('$', '$') + '/g';
    document.getElementById('printCost').textContent = dollar(baseCost);
    document.getElementById('adjustedCost').textContent = dollar(adjusted);
    document.getElementById('printsPerSpool').textContent = fmt(pps, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['spoolPrice', 'spoolWeight', 'printWeight', 'failRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
