(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var purpose = document.getElementById('purpose').value;

    // Calculation logic
    var wallArea = 2*(length+width)*height; var coverPct = {'Music Listening': 0.25, 'Home Studio': 0.40, 'Podcast Room': 0.50, 'Home Theater': 0.30}; var pct = coverPct[purpose] || 0.3; var panelCoverage = wallArea * pct; var panels = Math.ceil(panelCoverage / 8);     document.getElementById('wallArea').textContent = fmt(wallArea,0);
    document.getElementById('panelCoverage').textContent = fmt(panelCoverage,0);
    document.getElementById('panels').textContent = fmt(panels,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height', 'purpose'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
