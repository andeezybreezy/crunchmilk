(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var finishedWidth = parseFloat(document.getElementById('finishedWidth').value) || 0;
    var finishedHeight = parseFloat(document.getElementById('finishedHeight').value) || 0;
    var seamAllowance = document.getElementById('seamAllowance').value;
    var numPieces = parseFloat(document.getElementById('numPieces').value) || 0;
    var hemAllowance = parseFloat(document.getElementById('hemAllowance').value) || 0;

    // Calculation logic
    var sa = parseFloat(seamAllowance);
    var cutW = finishedWidth + (sa * 2);
    var cutH = finishedHeight + (sa * 2) + hemAllowance;
    var sqInPerPiece = cutW * cutH;
    var sqInTotal = sqInPerPiece * numPieces;
    var fabricWidth = 45;
    var piecesAcross = Math.floor(fabricWidth / cutW);
    var rows = Math.ceil(numPieces / piecesAcross);
    var fabricLength = rows * cutH;
    document.getElementById('cutWidth').textContent = fmt(cutW, 2) + '" (finished ' + fmt(finishedWidth, 1) + '" + ' + fmt(sa * 2, 2) + '" seam)';
    document.getElementById('cutHeight').textContent = fmt(cutH, 2) + '" (finished ' + fmt(finishedHeight, 1) + '" + ' + fmt(sa * 2, 2) + '" seam + ' + fmt(hemAllowance, 1) + '" hem)';
    document.getElementById('fabricPerPiece').textContent = fmt(sqInPerPiece, 1) + ' sq in (' + fmt(sqInPerPiece / 144, 2) + ' sq ft)';
    document.getElementById('totalFabric').textContent = fmt(fabricLength, 1) + '" of 45"-wide fabric (' + fmt(fabricLength / 36, 2) + ' yards)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['finishedWidth', 'finishedHeight', 'seamAllowance', 'numPieces', 'hemAllowance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
