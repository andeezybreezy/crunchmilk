(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var i=f('initial');var fv=f('final');var y=f('years');var tr=fv-i;var pct_r=tr/i*100;var cagr=(Math.pow(fv/i,1/y)-1)*100;var _r = {totalReturn:$(tr),totalPct:pct(pct_r,1),cagr:pct(cagr,2)};

    document.getElementById('totalReturn').textContent = _r.totalReturn;
    document.getElementById('totalPct').textContent = _r.totalPct;
    document.getElementById('cagr').textContent = _r.cagr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['initial', 'final', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
