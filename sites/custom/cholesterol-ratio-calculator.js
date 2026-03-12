(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var total=f('total');var hdl=f('hdl');var ldl=f('ldl');var trig=f('trig');var ratio=total/hdl;var ldlHdl=ldl/hdl;var trigHdl=trig/hdl;var risk=ratio<3.5?'Low':ratio<5?'Moderate':'High';var _r = {ratio:fmt(ratio,1),ldlHdl:fmt(ldlHdl,1),trigHdl:fmt(trigHdl,1),risk:risk};

    document.getElementById('ratio').textContent = _r.ratio;
    document.getElementById('ldlHdl').textContent = _r.ldlHdl;
    document.getElementById('trigHdl').textContent = _r.trigHdl;
    document.getElementById('risk').textContent = _r.risk;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['total', 'hdl', 'ldl', 'trig'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
