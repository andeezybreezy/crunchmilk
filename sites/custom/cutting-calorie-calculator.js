(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var w=f('weight')*0.453592;var h=f('height')*2.54;var age=f('age');var bmr=10*w+6.25*h-5*age+5;var factors=[1.2,1.375,1.55,1.725,1.9];var maintain=bmr*factors[Math.min(f('activity')-1, 2)];var deficit=500;var cut=maintain-deficit;var protein=f('weight')*1.2;var _r = {maintain:fmt(maintain,0)+' cal',cut:fmt(cut,0)+' cal',protein:fmt(protein,0)+'g',deficit:fmt(deficit,0)+' cal'};

    document.getElementById('maintain').textContent = _r.maintain;
    document.getElementById('cut').textContent = _r.cut;
    document.getElementById('protein').textContent = _r.protein;
    document.getElementById('deficit').textContent = _r.deficit;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'height', 'age', 'activity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
