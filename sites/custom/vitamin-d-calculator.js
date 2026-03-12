(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var lvl=f('level');var w=f('weight');var target=f('target');var status=lvl<20?'Deficient':lvl<30?'Insufficient':lvl<50?'Adequate':'Optimal';var gap=target-lvl;var dose=gap>20?5000:gap>10?3000:gap>0?2000:1000;var months=Math.ceil(gap/8);var _r = {status:status+' ('+fmt(lvl,0)+' ng/mL)',dailyDose:fmt(dose,0)+' IU',timeToTarget:fmt(Math.max(1,months),0)+' months'};

    document.getElementById('status').textContent = _r.status;
    document.getElementById('dailyDose').textContent = _r.dailyDose;
    document.getElementById('timeToTarget').textContent = _r.timeToTarget;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['level', 'weight', 'target'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
