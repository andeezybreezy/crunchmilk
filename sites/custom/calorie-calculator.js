(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var w=f('weight')*0.453592;var h=(f('heightFt')*12+f('heightIn'))*2.54;var age=f('age');var male=f('sex')===1;var bmr=male?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161;var factors=[1.2,1.375,1.55,1.725,1.9];var mult=factors[Math.min(Math.max(f('activity')-1,0),4)];var maintain=bmr*mult;var _r = {bmr:fmt(bmr,0)+' cal',maintain:fmt(maintain,0)+' cal',lose:fmt(maintain-500,0)+' cal',gain:fmt(maintain+500,0)+' cal'};

    document.getElementById('bmr').textContent = _r.bmr;
    document.getElementById('maintain').textContent = _r.maintain;
    document.getElementById('lose').textContent = _r.lose;
    document.getElementById('gain').textContent = _r.gain;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['weight', 'heightFt', 'heightIn', 'age', 'sex', 'activity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
