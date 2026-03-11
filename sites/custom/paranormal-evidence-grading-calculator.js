(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var emfSpike = document.getElementById('emfSpike').value;
    var evp = document.getElementById('evp').value;
    var visual = document.getElementById('visual').value;
    var temperature = document.getElementById('temperature').value;
    var witnesses = parseFloat(document.getElementById('witnesses').value) || 0;

    // Calculation logic
    var score = 0; score += emfSpike === 'Yes' ? 15 : 0; var evpScores = {'No': 0, 'Class C (barely audible)': 10, 'Class B (audible)': 20, 'Class A (clear)': 30}; score += evpScores[evp] || 0; var visScores = {'None': 0, 'Shadow/Mist': 10, 'Partial Apparition': 20, 'Full Apparition': 30}; score += visScores[visual] || 0; var tempScores = {'No': 0, 'Yes (5-10°F drop)': 10, 'Yes (10°F+ drop)': 15}; score += tempScores[temperature] || 0; score += Math.min(witnesses * 5, 10); var grade = score >= 70 ? 'A - Compelling' : score >= 50 ? 'B - Strong' : score >= 30 ? 'C - Moderate' : score >= 15 ? 'D - Weak' : 'F - Insufficient'; return {score: fmt(score,0), grade: grade};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['emfSpike', 'evp', 'visual', 'temperature', 'witnesses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
