(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgWinterTemp = parseFloat(document.getElementById('avgWinterTemp').value) || 0;
    var snowCover = document.getElementById('snowCover').value;
    var soilType = document.getElementById('soilType').value;

    // Calculation logic
    var baseDepth = (32 - avgWinterTemp) * 1.5; var snowMod = {'None': 1, 'Light (1-6 inches)': 0.75, 'Heavy (6+ inches)': 0.5}; var soilMod = {'Sandy': 1.2, 'Loam': 1, 'Clay': 0.8, 'Gravel': 1.3}; var frostDepth = baseDepth * (snowMod[snowCover]||1) * (soilMod[soilType]||1); var foundationMin = frostDepth + 6; return {frostDepth: fmt(Math.max(frostDepth,0),0), foundationMin: fmt(Math.max(foundationMin,12),0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgWinterTemp', 'snowCover', 'soilType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
