(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var vocLevel = parseFloat(document.getElementById('vocLevel').value) || 0;
    var roomSize = parseFloat(document.getElementById('roomSize').value) || 0;
    var ventilation = document.getElementById('ventilation').value;

    // Calculation logic
    var rating = vocLevel <= 5 ? 'Excellent (zero/ultra-low VOC)' : vocLevel <= 50 ? 'Good (low VOC)' : vocLevel <= 150 ? 'Fair (medium VOC)' : 'Poor (high VOC)'; var baseWait = vocLevel <= 5 ? 1 : vocLevel <= 50 ? 3 : vocLevel <= 150 ? 7 : 14; var ventMult = {'Poor (no windows open)': 2, 'Moderate (1 window)': 1.5, 'Good (cross ventilation)': 1, 'Excellent (fans + windows)': 0.7}; var waitTime = Math.ceil(baseWait * (ventMult[ventilation] || 1)); var recommendation = vocLevel <= 50 ? 'Safe choice for nursery' : 'Consider a lower VOC option for baby safety';     document.getElementById('rating').textContent = rating;
    document.getElementById('waitTime').textContent = fmt(waitTime,0);
    document.getElementById('recommendation').textContent = recommendation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['vocLevel', 'roomSize', 'ventilation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
