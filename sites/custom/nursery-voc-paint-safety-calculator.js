(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var vocLevel = parseFloat(document.getElementById('vocLevel').value) || 0;
    var roomSize = parseFloat(document.getElementById('roomSize').value) || 0;
    var ventilation = document.getElementById('ventilation').value;

    // Calculation logic
    var rating = vocLevel <= 5 ? 'Excellent (zero/ultra-low VOC)' : vocLevel <= 50 ? 'Good (low VOC)' : vocLevel <= 150 ? 'Fair (medium VOC)' : 'Poor (high VOC)'; var baseWait = vocLevel <= 5 ? 1 : vocLevel <= 50 ? 3 : vocLevel <= 150 ? 7 : 14; var ventMult = {'Poor (no windows open)': 2, 'Moderate (1 window)': 1.5, 'Good (cross ventilation)': 1, 'Excellent (fans + windows)': 0.7}; var waitTime = Math.ceil(baseWait * (ventMult[ventilation] || 1)); var recommendation = vocLevel <= 50 ? 'Safe choice for nursery' : 'Consider a lower VOC option for baby safety'; return {rating: rating, waitTime: fmt(waitTime,0), recommendation: recommendation};

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
