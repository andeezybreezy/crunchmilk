(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var totalMin=f('hours')*60+f('minutes');var pace=totalMin/26.2;var paceMin=Math.floor(pace);var paceSec=Math.round((pace-paceMin)*60);var fiveK=pace*3.107;var half=totalMin/2;var _r = {pace:paceMin+':'+String(paceSec).padStart(2,'0')+' /mile',fiveK:Math.floor(fiveK)+':'+String(Math.round((fiveK-Math.floor(fiveK))*60)).padStart(2,'0'),halfSplit:Math.floor(half)+':'+String(Math.round((half-Math.floor(half))*60)).padStart(2,'0'),perMile:fmt(pace*60,0)+' sec'};

    document.getElementById('pace').textContent = _r.pace;
    document.getElementById('fiveK').textContent = _r.fiveK;
    document.getElementById('halfSplit').textContent = _r.halfSplit;
    document.getElementById('perMile').textContent = _r.perMile;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['hours', 'minutes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
