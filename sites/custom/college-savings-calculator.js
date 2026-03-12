(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var age=f('currentAge');var cost=f('collegeCost');var yrs=f('yearsCollege');var inf=f('inflation')/100;var ret=f('returnRate')/100;var saved=f('saved');var yearsUntil=18-age;var futureCost=0;for(var i=0;i<yrs;i++){futureCost+=cost*Math.pow(1+inf,yearsUntil+i);}var savedGrowth=saved*Math.pow(1+ret,yearsUntil);var gap=futureCost-savedGrowth;if(gap<0)gap=0;var r=ret/12;var n=yearsUntil*12;var monthly=gap>0?gap*r/(Math.pow(1+r,n)-1):0;var _r = {totalNeeded:$(futureCost),gap:$(gap),monthlySave:$(monthly)};

    document.getElementById('totalNeeded').textContent = _r.totalNeeded;
    document.getElementById('gap').textContent = _r.gap;
    document.getElementById('monthlySave').textContent = _r.monthlySave;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['currentAge', 'collegeCost', 'yearsCollege', 'inflation', 'returnRate', 'saved'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
