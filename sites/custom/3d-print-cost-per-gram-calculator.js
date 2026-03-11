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
    var partWeight = parseFloat(document.getElementById('partWeight').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;
    var printHours = parseFloat(document.getElementById('printHours').value) || 0;

    // Calculation logic
    var costPerGram = spoolPrice / spoolWeight; var filamentCost = costPerGram * partWeight; var electricCost = 0.15 * printHours * electricRate; var totalCost = filamentCost + electricCost;     document.getElementById('filamentCost').textContent = dollar(filamentCost);
    document.getElementById('electricCost').textContent = dollar(electricCost);
    document.getElementById('totalCost').textContent = dollar(totalCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['spoolPrice', 'spoolWeight', 'partWeight', 'electricRate', 'printHours'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
