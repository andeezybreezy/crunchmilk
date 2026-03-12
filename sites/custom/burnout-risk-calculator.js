(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var wh=f('workHours');var vac=f('vacDays');var stress=f('stressLevel');var sleep=f('sleepHours');var exercise=f('exerciseDays');var score=0;score+=wh>50?30:wh>45?20:wh>40?10:0;score+=vac<5?20:vac<10?10:0;score+=stress*5;score+=sleep<6?20:sleep<7?10:0;score-=exercise*5;score=Math.min(100,Math.max(0,score));var level=score>=70?'High — Take immediate action':score>=40?'Moderate — Make changes soon':'Low — Keep up good habits';var top=wh>50?'Excessive work hours':stress>7?'High stress level':sleep<6?'Insufficient sleep':'Lack of vacation time';var _r = {score:fmt(score,0)+'/100',level:level,topFactor:top};

    document.getElementById('score').textContent = _r.score;
    document.getElementById('level').textContent = _r.level;
    document.getElementById('topFactor').textContent = _r.topFactor;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['workHours', 'vacDays', 'stressLevel', 'sleepHours', 'exerciseDays'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
