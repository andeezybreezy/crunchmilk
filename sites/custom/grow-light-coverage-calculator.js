(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var plantType = document.getElementById('plantType').value;
    var lightType = document.getElementById('lightType').value;

    // Calculation logic
    var wpf = {'Leafy Greens': 20, 'Herbs': 25, 'Vegetables': 30, 'Flowering/Fruiting': 40, 'Seedlings': 15}; var eff = {'LED': 1, 'HPS': 1.5, 'Fluorescent': 2, 'CMH': 1.3}; var base = wpf[plantType] || 30; var mult = eff[lightType] || 1; var watts = area * base * mult; var monthlyCost = (watts / 1000) * 18 * 30 * 0.12;     document.getElementById('watts').textContent = fmt(watts,0);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'plantType', 'lightType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
