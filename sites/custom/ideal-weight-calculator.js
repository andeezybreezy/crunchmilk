(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var h=(f('heightFt')*12+f('heightIn'));var male=f('sex')===1;var hamwi=male?106+(h-60)*6:100+(h-60)*5;var devine=male?110.23+(h-60)*5.07:100.31+(h-60)*5.07;var robinson=male?115.13+(h-60)*4.18:108.03+(h-60)*3.64;var hm=h*0.0254;var lo=Math.round(18.5*hm*hm*2.205);var hi=Math.round(24.9*hm*hm*2.205);var _r = {hamwi:fmt(hamwi,0)+' lbs',devine:fmt(devine,0)+' lbs',robinson:fmt(robinson,0)+' lbs',range:lo+' - '+hi+' lbs'};

    document.getElementById('hamwi').textContent = _r.hamwi;
    document.getElementById('devine').textContent = _r.devine;
    document.getElementById('robinson').textContent = _r.robinson;
    document.getElementById('range').textContent = _r.range;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['heightFt', 'heightIn', 'sex'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
