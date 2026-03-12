(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var b=f('bonus');var m=f('method');var sr=f('stateRate')/100;var fed=m===1?b*0.22:b*0.24;var st=b*sr;var fica=b*0.0765;var net=b-fed-st-fica;var _r = {fedTax:$(fed),stateTax:$(st),fica:$(fica),netBonus:$(net)};

    document.getElementById('fedTax').textContent = _r.fedTax;
    document.getElementById('stateTax').textContent = _r.stateTax;
    document.getElementById('fica').textContent = _r.fica;
    document.getElementById('netBonus').textContent = _r.netBonus;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['bonus', 'method', 'stateRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
