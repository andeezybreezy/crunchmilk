(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var cycle=f('cycleDay1');var since=f('lastPeriod');var ovDay=cycle-14;var daysToOv=ovDay-since;var fertileStart=ovDay-5;var fertileEnd=ovDay+1;var nextPeriod=cycle-since;var _r = {ovulationDay:'Day '+fmt(ovDay,0)+' of cycle (in '+fmt(Math.max(0,daysToOv),0)+' days)',fertileWindow:'Day '+fmt(fertileStart,0)+' to Day '+fmt(fertileEnd,0),nextPeriod:'In '+fmt(Math.max(0,nextPeriod),0)+' days'};

    document.getElementById('ovulationDay').textContent = _r.ovulationDay;
    document.getElementById('fertileWindow').textContent = _r.fertileWindow;
    document.getElementById('nextPeriod').textContent = _r.nextPeriod;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['cycleDay1', 'lastPeriod'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
