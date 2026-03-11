(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var da=f('dogAge');var sz=f('size');var factors={1:[15,9,4.5],2:[15,9,5],3:[15,9,6],4:[15,9,7.5]};var ft=factors[sz]||factors[2];var ha=da<=1?da*ft[0]:da<=2?ft[0]+ft[1]:ft[0]+ft[1]+(da-2)*ft[2];var stage=da<0.5?'Puppy':da<2?'Junior':da<7?'Adult':'Senior';var life=sz===1?14:sz===2?12:sz===3?10:8;var _r = {humanAge:fmt(ha,0)+' human years',stage:stage,lifeExpect:life+' years'};

    document.getElementById('humanAge').textContent = _r.humanAge;
    document.getElementById('stage').textContent = _r.stage;
    document.getElementById('lifeExpect').textContent = _r.lifeExpect;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['dogAge', 'size'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
