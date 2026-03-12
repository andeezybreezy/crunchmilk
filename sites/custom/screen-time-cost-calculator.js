(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var h=f('hours');var rate=f('hourlyRate');var weekly=h*7;var yearly=h*365;var cost=yearly*rate;var _r = {weekly:fmt(weekly,0)+' hours',yearly:fmt(yearly,0)+' hours ('+fmt(yearly/24,0)+' days)',oppCost:$(cost),lifetime:$(cost*10)};

    document.getElementById('weekly').textContent = _r.weekly;
    document.getElementById('yearly').textContent = _r.yearly;
    document.getElementById('oppCost').textContent = _r.oppCost;
    document.getElementById('lifetime').textContent = _r.lifetime;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['hours', 'hourlyRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
