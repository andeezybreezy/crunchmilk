(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var volume = parseFloat(document.getElementById('volume').value) || 0;
    var infillPct = parseFloat(document.getElementById('infillPct').value) || 0;
    var wallThickness = parseFloat(document.getElementById('wallThickness').value) || 0;
    var density = parseFloat(document.getElementById('density').value) || 0;

    // Calculation logic
    var shellFraction = Math.min(0.95, wallThickness * 0.1);
    var infillFraction = (1 - shellFraction) * (infillPct / 100);
    var totalFillFraction = shellFraction + infillFraction;
    var weight = volume * density * totalFillFraction;
    var solidWeight = volume * density;
    var saved = ((1 - totalFillFraction) * 100);
    var strength = Math.round(totalFillFraction * 100);
    if (infillPct >= 80) strength = Math.min(98, strength);
    document.getElementById('totalWeight').textContent = fmt(weight, 1) + ' g';
    document.getElementById('materialSaved').textContent = fmt(saved, 1) + '%';
    document.getElementById('strengthRating').textContent = strength + '% of solid';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['volume', 'infillPct', 'wallThickness', 'density'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
