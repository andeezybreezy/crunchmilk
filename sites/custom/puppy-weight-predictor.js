(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var cw=f('currentWeight');var age=f('currentAge');var sz=f('breed');var matureWeeks=[40,48,60,72,96];var mw=matureWeeks[sz-1]||60;var pctGrown=Math.min(age/mw,1);var adult=pctGrown>0?cw/pctGrown:cw*4;var doneMonths=Math.round(mw/4.33);var _r = {adultWeight:fmt(adult,0)+' lbs',growthPct:pct(pctGrown*100,0),doneGrowing:doneMonths+' months'};

    document.getElementById('adultWeight').textContent = _r.adultWeight;
    document.getElementById('growthPct').textContent = _r.growthPct;
    document.getElementById('doneGrowing').textContent = _r.doneGrowing;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['currentWeight', 'currentAge', 'breed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
