(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var overallMood = parseFloat(document.getElementById('overallMood').value) || 0;
    var anxiety = parseFloat(document.getElementById('anxiety').value) || 0;
    var energy = parseFloat(document.getElementById('energy').value) || 0;
    var sleepQuality = parseFloat(document.getElementById('sleepQuality').value) || 0;
    var socialConnection = parseFloat(document.getElementById('socialConnection').value) || 0;

    // Calculation logic
    var anxietyInv = 11 - anxiety; var score = ((overallMood + anxietyInv + energy + sleepQuality + socialConnection) / 50) * 100; var assessment = score >= 80 ? 'Thriving - keep doing what works' : score >= 60 ? 'Good - stable mood' : score >= 40 ? 'Fair - consider self-care focus' : 'Low - reach out for support'; return {score: fmt(score,0), assessment: assessment};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['overallMood', 'anxiety', 'energy', 'sleepQuality', 'socialConnection'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
