(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var a=f('amount');var p=f('period');var h=f('hoursWeek');var annual;if(p===1)annual=a*h*52;else if(p===2)annual=a*52;else if(p===3)annual=a*12;else annual=a;var _r = {hourly:$(annual/h/52),weekly:$(annual/52),monthly:$(annual/12),annual:$(annual)};

    document.getElementById('hourly').textContent = _r.hourly;
    document.getElementById('weekly').textContent = _r.weekly;
    document.getElementById('monthly').textContent = _r.monthly;
    document.getElementById('annual').textContent = _r.annual;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['amount', 'period', 'hoursWeek'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
