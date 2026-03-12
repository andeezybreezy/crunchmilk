(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var b=f('balance');var r=f('curAPR')/100/12;var fee=b*f('transferFee')/100;var pm=f('promoMonths');var pmt=(b+fee)/pm;var intSaved=0;var bal=b;for(var i=0;i<pm;i++){intSaved+=bal*r;bal-=(pmt-bal*r);}var _r = {fee:$(fee),monthlyPmt:$(pmt),savings:$(intSaved-fee)};

    document.getElementById('fee').textContent = _r.fee;
    document.getElementById('monthlyPmt').textContent = _r.monthlyPmt;
    document.getElementById('savings').textContent = _r.savings;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['balance', 'curAPR', 'transferFee', 'promoMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
