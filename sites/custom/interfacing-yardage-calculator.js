(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pieces = parseFloat(document.getElementById('pieces').value) || 0;
    var avgLength = parseFloat(document.getElementById('avgLength').value) || 0;
    var avgWidth = parseFloat(document.getElementById('avgWidth').value) || 0;
    var interfacingWidth = parseFloat(document.getElementById('interfacingWidth').value) || 0;

    // Calculation logic
    var totalArea = pieces * avgLength * avgWidth * 1.1; var rows = Math.ceil(pieces * avgWidth / interfacingWidth); var linearInches = rows * avgLength; var yardage = Math.ceil(linearInches / 36 * 10) / 10;     document.getElementById('totalArea').textContent = fmt(totalArea,0);
    document.getElementById('yardage').textContent = fmt(yardage,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pieces', 'avgLength', 'avgWidth', 'interfacingWidth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
