(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hideSize = parseFloat(document.getElementById('hideSize').value) || 0;
    var waste = parseFloat(document.getElementById('waste').value) || 0;
    var pieceArea = parseFloat(document.getElementById('pieceArea').value) || 0;

    // Calculation logic
    var usable = hideSize * (1 - waste/100); var pieceSqFt = pieceArea / 144; var pieces = Math.floor(usable / pieceSqFt); return {usable: fmt(usable,1), pieces: fmt(pieces,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hideSize', 'waste', 'pieceArea'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
