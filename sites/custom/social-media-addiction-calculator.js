(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var daily=f('dailyMin');var pickups=f('pickups');var bed=f('beforeBed');var yearly=daily*365/60;var days=yearly/24;var lifetime=yearly*50/8760;var score=daily>180?'Heavy — significantly impacting life':daily>120?'High — above average usage':daily>60?'Moderate — typical usage':'Light — below average';var _r = {yearlyHours:fmt(yearly,0)+' hours',yearlyDays:fmt(days,0)+' days',addictionScore:score,lifetimeYears:fmt(lifetime,1)+' years'};

    document.getElementById('yearlyHours').textContent = _r.yearlyHours;
    document.getElementById('yearlyDays').textContent = _r.yearlyDays;
    document.getElementById('addictionScore').textContent = _r.addictionScore;
    document.getElementById('lifetimeYears').textContent = _r.lifetimeYears;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['dailyMin', 'pickups', 'beforeBed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
