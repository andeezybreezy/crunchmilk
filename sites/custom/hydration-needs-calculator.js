(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var exercise = parseFloat(document.getElementById('exercise').value) || 0;
    var climate = document.getElementById('climate').value;

    // Calculation logic
    var base = weight * 0.5; var exerciseOz = exercise / 30 * 12; var climateMod = {'Temperate': 1, 'Hot/Humid': 1.2, 'Cold/Dry': 1.1, 'High Altitude': 1.15}; var ounces = (base + exerciseOz) * (climateMod[climate] || 1); var liters = ounces * 0.0296; var glasses = Math.ceil(ounces / 8);     document.getElementById('ounces').textContent = fmt(ounces,0);
    document.getElementById('liters').textContent = fmt(liters,1);
    document.getElementById('glasses').textContent = fmt(glasses,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'exercise', 'climate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
