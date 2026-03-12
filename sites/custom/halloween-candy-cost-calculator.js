(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var expectedKids = parseFloat(document.getElementById('expectedKids').value) || 0;
    var piecesPerKid = parseFloat(document.getElementById('piecesPerKid').value) || 0;
    var candyQuality = document.getElementById('candyQuality').value;
    var decorBudget = parseFloat(document.getElementById('decorBudget').value) || 0;
    var bufferPct = parseFloat(document.getElementById('bufferPct').value) || 0;

    // Calculation logic
    var costPerPiece = {budget: 0.08, mid: 0.15, fullsize: 1.00, premium: 1.50}; var cpp = costPerPiece[candyQuality] || 0.15; var basePieces = expectedKids * piecesPerKid; var totalPieces = Math.ceil(basePieces * (1 + bufferPct / 100)); var candyCost = totalPieces * cpp; var total = candyCost + decorBudget; var costPer = expectedKids > 0 ? candyCost / expectedKids : 0; var piecesPerBag = candyQuality === 'fullsize' || candyQuality === 'premium' ? 18 : 90; var bags = Math.ceil(totalPieces / piecesPerBag); document.getElementById('totalPieces').textContent = fmt(totalPieces, 0) + ' pieces'; document.getElementById('candyCost').textContent = dollar(candyCost); document.getElementById('totalHalloween').textContent = dollar(total) + ' (candy + decor)'; document.getElementById('costPerKid').textContent = dollar(costPer) + '/child'; document.getElementById('bagsNeeded').textContent = bags + ' bags';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['expectedKids', 'piecesPerKid', 'candyQuality', 'decorBudget', 'bufferPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
