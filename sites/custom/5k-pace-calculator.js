(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var totalSec=f('minutes')*60+f('seconds');var pacePerMile=totalSec/3.107;var pm=Math.floor(pacePerMile/60);var ps=Math.round(pacePerMile%60);var pacePerKm=totalSec/5;var km=Math.floor(pacePerKm/60);var ks=Math.round(pacePerKm%60);var mph=3.107/(totalSec/3600);var _r = {pace:pm+':'+String(ps).padStart(2,'0')+' /mile',paceKm:km+':'+String(ks).padStart(2,'0')+' /km',speed:fmt(mph,1)+' mph'};

    document.getElementById('pace').textContent = _r.pace;
    document.getElementById('paceKm').textContent = _r.paceKm;
    document.getElementById('speed').textContent = _r.speed;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['minutes', 'seconds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
