(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var origShape = document.getElementById('origShape').value;
    var origSize = parseFloat(document.getElementById('origSize').value) || 0;
    var origSize2 = parseFloat(document.getElementById('origSize2').value) || 0;
    var newShape = document.getElementById('newShape').value;
    var newSize = parseFloat(document.getElementById('newSize').value) || 0;
    var newSize2 = parseFloat(document.getElementById('newSize2').value) || 0;

    // Calculation logic
    var oA = 0; if (origShape === 'round') oA = 3.14159 * Math.pow(origSize / 2, 2); else if (origShape === 'square') oA = origSize * origSize; else oA = origSize * origSize2; var nA = 0; if (newShape === 'round') nA = 3.14159 * Math.pow(newSize / 2, 2); else if (newShape === 'square') nA = newSize * newSize; else nA = newSize * newSize2; var scale = nA / oA; var tempNote = scale > 1.3 ? 'Reduce temp 25F and increase bake time 5-10 min' : scale < 0.7 ? 'Increase temp 25F and reduce bake time 5-10 min' : 'Keep same temperature — check 5 min early'; document.getElementById('origArea').textContent = fmt(oA, 1) + ' sq in'; document.getElementById('newArea').textContent = fmt(nA, 1) + ' sq in'; document.getElementById('scaleFactor').textContent = fmt(scale, 2) + 'x'; document.getElementById('tempAdj').textContent = tempNote;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['origShape', 'origSize', 'origSize2', 'newShape', 'newSize', 'newSize2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
