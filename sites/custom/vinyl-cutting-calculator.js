(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var designs = parseFloat(document.getElementById('designs').value) || 0;
    var designW = parseFloat(document.getElementById('designW').value) || 0;
    var designH = parseFloat(document.getElementById('designH').value) || 0;
    var spacing = parseFloat(document.getElementById('spacing').value) || 0;
    var rollWidth = parseFloat(document.getElementById('rollWidth').value) || 0;

    // Calculation logic
    var perRow = Math.floor(rollWidth / (designW + spacing)); if (perRow < 1) perRow = 1; var rows = Math.ceil(designs / perRow); var length = rows * (designH + spacing); var totalArea = length * rollWidth; var usedArea = designs * designW * designH; var waste = ((totalArea - usedArea) / totalArea) * 100; document.getElementById('totalLength').textContent = fmt(length, 1) + ' inches (' + fmt(length / 12, 1) + ' feet)'; document.getElementById('totalArea').textContent = fmt(totalArea, 0) + ' sq inches'; document.getElementById('wasteEst').textContent = pct(waste) + ' waste';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['designs', 'designW', 'designH', 'spacing', 'rollWidth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
