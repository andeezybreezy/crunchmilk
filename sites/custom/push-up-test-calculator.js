(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var pu=f('pushups');var age=f('age');var male=f('sex')===1;var good,excel;if(male){good=age<30?27:age<40?21:age<50?16:age<60?12:10;excel=age<30?36:age<40?30:age<50?25:age<60?20:18;}else{good=age<30?14:age<40?13:age<50?11:age<60?6:6;excel=age<30?30:age<40?27:age<50?24:age<60?17:12;}var rating=pu>=excel?'Excellent':pu>=good?'Good':pu>=good*0.6?'Average':'Below Average';var pctile=pu>=excel?'Top 20%':pu>=good?'Top 40%':pu>=good*0.6?'Middle 40%':'Bottom 20%';var next=pu<good?good:pu<excel?excel:excel+10;var _r = {rating:rating,percentile:pctile,goal:fmt(next,0)+' push-ups'};

    document.getElementById('rating').textContent = _r.rating;
    document.getElementById('percentile').textContent = _r.percentile;
    document.getElementById('goal').textContent = _r.goal;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['pushups', 'age', 'sex'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
