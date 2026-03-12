(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var score1 = parseFloat(document.getElementById('score1').value) || 0;
    var score2 = parseFloat(document.getElementById('score2').value) || 0;
    var score3 = parseFloat(document.getElementById('score3').value) || 0;
    var courseRating = parseFloat(document.getElementById('courseRating').value) || 0;
    var slopeRating = parseFloat(document.getElementById('slopeRating').value) || 0;

    // Calculation logic
    var diff1 = (score1 - courseRating) * 113 / slopeRating; var diff2 = (score2 - courseRating) * 113 / slopeRating; var diff3 = (score3 - courseRating) * 113 / slopeRating; var best = Math.min(diff1, diff2, diff3); var avgDiff = best; var handicap = avgDiff * 0.96;     document.getElementById('avgDiff').textContent = fmt(avgDiff,1);
    document.getElementById('handicap').textContent = fmt(handicap,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['score1', 'score2', 'score3', 'courseRating', 'slopeRating'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
