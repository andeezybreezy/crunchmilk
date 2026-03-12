(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var iceThickness = document.getElementById('iceThickness').value;
    var temperature = parseFloat(document.getElementById('temperature').value) || 0;

    // Calculation logic
    var rates = {'Light frost': 1, 'Thin ice (< 1/4 inch)': 2, 'Moderate (1/4 - 1/2 inch)': 3, 'Heavy (> 1/2 inch)': 4}; var rate = rates[iceThickness] || 2; var tempMult = temperature < 10 ? 1.5 : temperature < 20 ? 1.2 : 1; var saltLbs = (area / 100) * rate * tempMult; var bags50 = Math.ceil(saltLbs / 50); var type = temperature < 0 ? 'Calcium chloride (works to -25°F)' : temperature < 15 ? 'Magnesium chloride (works to 0°F)' : 'Rock salt (works to 15°F)';     document.getElementById('saltLbs').textContent = fmt(saltLbs,0);
    document.getElementById('bags50').textContent = fmt(bags50,0);
    document.getElementById('type').textContent = type;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'iceThickness', 'temperature'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
