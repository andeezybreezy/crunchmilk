(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var mg=f('amount');var hrs=f('time');var halfLife=5;var remaining=mg*Math.pow(0.5,hrs/halfLife);var clearHrs=Math.log(25/mg)/Math.log(0.5)*halfLife;var _r = {remaining:fmt(remaining,0)+' mg',halfTime:'5 hours (average)',clearTime:fmt(Math.max(0,clearHrs-hrs),1)+' hours from now'};

    document.getElementById('remaining').textContent = _r.remaining;
    document.getElementById('halfTime').textContent = _r.halfTime;
    document.getElementById('clearTime').textContent = _r.clearTime;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['amount', 'time'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
