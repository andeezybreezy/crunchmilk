(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var inc=f('income')-f('deduction');if(inc<0)inc=0;var b=[11600,47150,100525,191950,243725,609350];var r=[0.10,0.12,0.22,0.24,0.32,0.35,0.37];var tax=0;var prev=0;for(var i=0;i<b.length;i++){var t=Math.min(inc,b[i])-prev;if(t>0)tax+=t*r[i];if(inc<=b[i])break;prev=b[i];}tax-=f('credits');if(tax<0)tax=0;var withheld=f('withheld');var diff=withheld-tax;var label=diff>=0?'Refund: '+$(diff):'You Owe: '+$(Math.abs(diff));var _r = {taxable:$(inc),taxOwed:$(tax),refund:label};

    document.getElementById('taxable').textContent = _r.taxable;
    document.getElementById('taxOwed').textContent = _r.taxOwed;
    document.getElementById('refund').textContent = _r.refund;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['income', 'withheld', 'deduction', 'credits'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
