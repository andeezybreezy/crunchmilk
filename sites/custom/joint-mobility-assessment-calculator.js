(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var shoulderROM = parseFloat(document.getElementById('shoulderROM').value) || 0;
    var hamstring = parseFloat(document.getElementById('hamstring').value) || 0;
    var hipFlexion = parseFloat(document.getElementById('hipFlexion').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;

    // Calculation logic
    var shoulderScore = Math.min(shoulderROM * 4, 30); var hamScore = Math.min((hamstring + 10) * 1.5, 30); var hipScore = Math.min((hipFlexion - 45) * 0.44, 40); var ageBonus = age > 50 ? 5 : 0; var score = Math.min(shoulderScore + hamScore + hipScore + ageBonus, 100); var rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement'; return {score: fmt(score,0), rating: rating};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['shoulderROM', 'hamstring', 'hipFlexion', 'age'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
