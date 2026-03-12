(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var closeRelationships = parseFloat(document.getElementById('closeRelationships').value) || 0;
    var weeklyInteractions = parseFloat(document.getElementById('weeklyInteractions').value) || 0;
    var belongingScore = parseFloat(document.getElementById('belongingScore').value) || 0;
    var loneliness = document.getElementById('loneliness').value;

    // Calculation logic
    var relScore = Math.min(closeRelationships * 5, 25); var interScore = Math.min(weeklyInteractions * 3, 25); var belongScore = belongingScore * 2.5; var loneScores = {'Rarely': 25, 'Sometimes': 15, 'Often': 5, 'Always': 0}; var loneScore = loneScores[loneliness] || 10; var score = relScore + interScore + belongScore + loneScore; var assessment = score >= 80 ? 'Strong social health' : score >= 60 ? 'Adequate - room for deeper connections' : score >= 40 ? 'At risk - prioritize social activities' : 'Concerning - consider reaching out for support';     document.getElementById('score').textContent = fmt(score,0);
    document.getElementById('assessment').textContent = assessment;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['closeRelationships', 'weeklyInteractions', 'belongingScore', 'loneliness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
