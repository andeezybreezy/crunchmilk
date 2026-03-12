(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var workHours = parseFloat(document.getElementById('workHours').value) || 0;
    var exhaustion = parseFloat(document.getElementById('exhaustion').value) || 0;
    var detachment = parseFloat(document.getElementById('detachment').value) || 0;
    var accomplishment = parseFloat(document.getElementById('accomplishment').value) || 0;
    var vacation = parseFloat(document.getElementById('vacation').value) || 0;

    // Calculation logic
    var workScore = workHours > 55 ? 25 : workHours > 45 ? 15 : workHours > 40 ? 8 : 0; var exhaustScore = exhaustion * 2.5; var detachScore = detachment * 2; var accomScore = (10 - accomplishment) * 1.5; var vacScore = vacation < 2 ? 10 : vacation < 5 ? 5 : 0; var riskScore = Math.min(workScore + exhaustScore + detachScore + accomScore + vacScore, 100); var level = riskScore >= 70 ? 'High' : riskScore >= 45 ? 'Moderate' : riskScore >= 25 ? 'Low' : 'Minimal'; var action = riskScore >= 70 ? 'Urgent: take time off, set boundaries, consider therapy' : riskScore >= 45 ? 'Set work boundaries, schedule regular breaks' : 'Maintain current balance, monitor stress levels';     document.getElementById('riskScore').textContent = fmt(riskScore,0);
    document.getElementById('level').textContent = level;
    document.getElementById('action').textContent = action;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['workHours', 'exhaustion', 'detachment', 'accomplishment', 'vacation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
