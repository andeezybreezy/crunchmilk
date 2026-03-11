(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var yieldCurve = document.getElementById('yieldCurve').value;
    var unemployment = document.getElementById('unemployment').value;
    var inflation = document.getElementById('inflation').value;
    var fedAction = document.getElementById('fedAction').value;

    // Calculation logic
    var score=0; var yieldScores={normal:0,flat:15,inverted:35}; var unempScores={falling:0,stable:10,rising:25}; var inflScores={low:5,moderate:10,high:20}; var fedScores={cutting:10,holding:5,hiking:20}; score=yieldScores[yieldCurve]+unempScores[unemployment]+inflScores[inflation]+fedScores[fedAction]; score=Math.min(score,95); var timeframe=score>60?'6-12 months':score>40?'12-18 months':'18+ months'; var severity=score>70?'Moderate to Severe':score>50?'Mild to Moderate':'Mild if any'; var advice=score>60?'Consider defensive positioning: bonds, cash reserves, reduced leverage':score>40?'Maintain diversification, build emergency fund':'Stay the course with balanced allocation'; return {probability:score+'%', timeframe:timeframe, severity:severity, advice:advice};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['yieldCurve', 'unemployment', 'inflation', 'fedAction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
