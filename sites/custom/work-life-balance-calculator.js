(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var workHours = parseFloat(document.getElementById('workHours').value) || 0;
    var exercise = parseFloat(document.getElementById('exercise').value) || 0;
    var socialHours = parseFloat(document.getElementById('socialHours').value) || 0;
    var sleepHours = parseFloat(document.getElementById('sleepHours').value) || 0;
    var vacation = parseFloat(document.getElementById('vacation').value) || 0;

    // Calculation logic
    var workScore = workHours <= 40 ? 25 : workHours <= 45 ? 20 : workHours <= 50 ? 15 : workHours <= 55 ? 10 : 5; var exScore = exercise >= 4 ? 25 : exercise >= 3 ? 20 : exercise >= 2 ? 15 : exercise >= 1 ? 10 : 5; var socScore = socialHours >= 10 ? 20 : socialHours >= 5 ? 15 : socialHours >= 2 ? 10 : 5; var slpScore = sleepHours >= 7.5 ? 20 : sleepHours >= 7 ? 15 : sleepHours >= 6 ? 10 : 5; var vacScore = vacation >= 15 ? 10 : vacation >= 10 ? 8 : vacation >= 5 ? 5 : 2; var total = workScore + exScore + socScore + slpScore + vacScore; var grade = total >= 80 ? 'A — Excellent Balance' : total >= 65 ? 'B — Good Balance' : total >= 50 ? 'C — Needs Attention' : total >= 35 ? 'D — At Risk' : 'F — Burnout Risk'; var issues = [{name:'Reduce work hours',score:workScore},{name:'Exercise more',score:exScore},{name:'More social/hobby time',score:socScore},{name:'Improve sleep',score:slpScore},{name:'Take more vacation',score:vacScore}]; issues.sort(function(a,b){return a.score - b.score}); document.getElementById('balanceScore').textContent = total + ' / 100'; document.getElementById('grade').textContent = grade; document.getElementById('topIssue').textContent = issues[0].name;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['workHours', 'exercise', 'socialHours', 'sleepHours', 'vacation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
