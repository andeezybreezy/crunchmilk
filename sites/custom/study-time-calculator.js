(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var credits = parseFloat(document.getElementById('credits').value) || 0;
    var difficulty = document.getElementById('difficulty').value;
    var targetGpa = parseFloat(document.getElementById('targetGpa').value) || 0;

    // Calculation logic
    var mult = {easy: 1.5, medium: 2, hard: 3}; var gpaMult = targetGpa >= 3.5 ? 1.2 : targetGpa >= 3.0 ? 1.0 : 0.8; var m = (mult[difficulty] || 2) * gpaMult; var studyHrs = credits * m; var classHrs = credits; var total = studyHrs + classHrs; document.getElementById('weeklyHrs').textContent = fmt(studyHrs, 0) + ' hrs/week'; document.getElementById('dailyHrs').textContent = fmt(studyHrs / 7, 1) + ' hrs/day'; document.getElementById('totalWeek').textContent = fmt(total, 0) + ' hrs/week (class + study)'; document.getElementById('perCredit').textContent = fmt(m, 1) + ' study hrs per credit';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['credits', 'difficulty', 'targetGpa'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
