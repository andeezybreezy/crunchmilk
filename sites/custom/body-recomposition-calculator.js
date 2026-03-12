(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var w=f('weight');var bf=f('bf')/100;var lbm=w*(1-bf);var factors=[12,14,16,18];var cal=w*factors[Math.min(f('activity')-1,3)];var protein=lbm*1.2;var fat=w*0.4;var carbs=(cal-protein*4-fat*9)/4;var _r = {calories:fmt(cal,0)+' cal',protein:fmt(protein,0)+'g',carbs:fmt(Math.max(carbs,50),0)+'g',fat:fmt(fat,0)+'g'};

    document.getElementById('calories').textContent = _r.calories;
    document.getElementById('protein').textContent = _r.protein;
    document.getElementById('carbs').textContent = _r.carbs;
    document.getElementById('fat').textContent = _r.fat;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'bf', 'activity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
