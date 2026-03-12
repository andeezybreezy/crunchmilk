(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var w=f('weight')*0.453592;var rer=70*Math.pow(w,0.75);var factors=[[1.2,1.4,1.6],[2.5,1.4,1.6],[1,1.2,1.4]];var ageIdx=Math.min(f('age')-1,2);var actIdx=Math.min(f('activity')-1,2);var cal=rer*factors[ageIdx][actIdx];var wet=cal/30;var dry=cal/350;var _r = {calories:fmt(cal,0)+' cal/day',wet:fmt(wet,1)+' oz',dry:fmt(dry,2)+' cups'};

    document.getElementById('calories').textContent = _r.calories;
    document.getElementById('wet').textContent = _r.wet;
    document.getElementById('dry').textContent = _r.dry;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'activity', 'age'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
