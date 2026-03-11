(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var designW = parseFloat(document.getElementById('designW').value) || 0;
    var designH = parseFloat(document.getElementById('designH').value) || 0;
    var coveragePct = parseFloat(document.getElementById('coveragePct').value) || 0;
    var numColors = parseFloat(document.getElementById('numColors').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var inkCostPerOz = parseFloat(document.getElementById('inkCostPerOz').value) || 0;

    // Calculation logic
    var area = designW * designH; var coveredArea = area * (coveragePct / 100); var ozPerShirt = coveredArea * numColors * 0.012; var totalOz = ozPerShirt * quantity * 1.15; var cost = totalOz * inkCostPerOz; document.getElementById('designArea').textContent = fmt(area, 1) + ' sq in'; document.getElementById('inkPerShirt').textContent = fmt(ozPerShirt, 2) + ' oz'; document.getElementById('totalInk').textContent = fmt(totalOz, 1) + ' oz'; document.getElementById('inkCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['designW', 'designH', 'coveragePct', 'numColors', 'quantity', 'inkCostPerOz'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
