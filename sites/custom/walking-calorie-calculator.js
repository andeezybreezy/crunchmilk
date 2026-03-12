(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var w=f('weight')*0.453592;var spd=f('speed');var min=f('minutes');var met=spd<3?2.5:spd<3.5?3.3:spd<4?3.8:spd<4.5?5:6.3;var cal=met*w*3.5/200*min;var dist=spd*min/60;var steps=Math.round(dist*2000);var _r = {burned:fmt(cal,0)+' cal',distance:fmt(dist,2)+' miles',steps:fmt(steps,0)};

    document.getElementById('burned').textContent = _r.burned;
    document.getElementById('distance').textContent = _r.distance;
    document.getElementById('steps').textContent = _r.steps;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'speed', 'minutes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
