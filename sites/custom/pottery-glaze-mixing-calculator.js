(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var batchSize = parseFloat(document.getElementById('batchSize').value) || 0;
    var waterRatio = parseFloat(document.getElementById('waterRatio').value) || 0;
    var pots = parseFloat(document.getElementById('pots').value) || 0;

    // Calculation logic
    var perPot = 150; var totalNeeded = pots * perPot; var dryWeight = Math.max(batchSize, totalNeeded * 0.5); var waterWeight = dryWeight * (waterRatio / 100); var totalVolume = dryWeight * 0.4 + waterWeight; return {dryWeight: fmt(dryWeight,0), waterWeight: fmt(waterWeight,0), totalVolume: fmt(totalVolume,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['batchSize', 'waterRatio', 'pots'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
