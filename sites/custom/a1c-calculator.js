(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var a1c=f('a1c');var eag=28.7*a1c-46.7;var mmol=eag/18;var cat=a1c<5.7?'Normal':a1c<6.5?'Prediabetes':'Diabetes';var _r = {avgGlucose:fmt(eag,0)+' mg/dL',category:cat,mgPerL:fmt(mmol,1)+' mmol/L'};

    document.getElementById('avgGlucose').textContent = _r.avgGlucose;
    document.getElementById('category').textContent = _r.category;
    document.getElementById('mgPerL').textContent = _r.mgPerL;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['a1c'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
