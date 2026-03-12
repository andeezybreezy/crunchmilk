(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gallons = parseFloat(document.getElementById('gallons').value) || 0;
    var filtration = document.getElementById('filtration').value;
    var fishSize = document.getElementById('fishSize').value;

    // Calculation logic
    var inchesPerGal = {'Standard': 1, 'Over-filtered (2x)': 1.3, 'Under-filtered': 0.7}; var avgSize = {'Small (1-2 inches)': 1.5, 'Medium (2-4 inches)': 3, 'Large (4-6 inches)': 5, 'Extra Large (6+ inches)': 8}; var totalInches = gallons * (inchesPerGal[filtration] || 1); var fishInches = avgSize[fishSize] || 3; var maxFish = Math.floor(totalInches / fishInches); var recommendedFish = Math.floor(maxFish * 0.75);     document.getElementById('maxFish').textContent = fmt(maxFish,0);
    document.getElementById('recommendedFish').textContent = fmt(recommendedFish,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gallons', 'filtration', 'fishSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
