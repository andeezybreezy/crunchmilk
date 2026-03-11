(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var finishedLength = parseFloat(document.getElementById('finishedLength').value) || 0;
    var numCords = parseFloat(document.getElementById('numCords').value) || 0;
    var knotType = document.getElementById('knotType').value;
    var fringeLength = parseFloat(document.getElementById('fringeLength').value) || 0;
    var cordPrice = parseFloat(document.getElementById('cordPrice').value) || 0;

    // Calculation logic
    var multiplier = parseInt(knotType);
    var perStrand = (finishedLength * multiplier) + (fringeLength * 2);
    var foldedLength = perStrand * 2;
    var totalInches = foldedLength * (numCords / 2);
    var totalFt = totalInches / 12;
    var cost = (totalFt / 100) * cordPrice;
    document.getElementById('cordPerStrand').textContent = fmt(foldedLength, 0) + '" (' + fmt(foldedLength / 12, 1) + ' ft) — cut length before folding in half';
    document.getElementById('totalCord').textContent = fmt(totalInches, 0) + '" total';
    document.getElementById('totalFeet').textContent = fmt(totalFt, 0) + ' ft (' + fmt(totalFt / 3, 1) + ' yards)';
    document.getElementById('cordCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['finishedLength', 'numCords', 'knotType', 'fringeLength', 'cordPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
