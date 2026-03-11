(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var majorLife = parseFloat(document.getElementById('majorLife').value) || 0;
    var workStress = parseFloat(document.getElementById('workStress').value) || 0;
    var finStress = parseFloat(document.getElementById('finStress').value) || 0;
    var healthStress = parseFloat(document.getElementById('healthStress').value) || 0;
    var relStress = parseFloat(document.getElementById('relStress').value) || 0;

    // Calculation logic
    var score = majorLife * 40 + workStress * 8 + finStress * 8 + healthStress * 6 + relStress * 6; var risk = score >= 300 ? 'High Risk — 80% chance of health impact' : score >= 200 ? 'Moderate Risk — 50% chance of health impact' : score >= 150 ? 'Mild Risk — 30% chance of health impact' : 'Low Risk'; var rec = score >= 200 ? 'Consider professional support. Prioritize stress management, sleep, and social connection.' : score >= 150 ? 'Practice daily stress management: exercise, meditation, adequate sleep.' : 'Your stress level is manageable. Maintain healthy habits.'; document.getElementById('totalScore').textContent = fmt(score, 0) + ' points'; document.getElementById('riskLevel').textContent = risk; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['majorLife', 'workStress', 'finStress', 'healthStress', 'relStress'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
