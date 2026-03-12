(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var ftp=f('ftp');var kg=f('weight')*0.453592;var wpkg=ftp/kg;var _r = {wpkg:fmt(wpkg,2)+' W/kg',zone2:fmt(ftp*0.56,0)+'-'+fmt(ftp*0.75,0)+' W',zone4:fmt(ftp*0.91,0)+'-'+fmt(ftp*1.05,0)+' W',zone5:fmt(ftp*1.06,0)+'-'+fmt(ftp*1.20,0)+' W'};

    document.getElementById('wpkg').textContent = _r.wpkg;
    document.getElementById('zone2').textContent = _r.zone2;
    document.getElementById('zone4').textContent = _r.zone4;
    document.getElementById('zone5').textContent = _r.zone5;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['ftp', 'weight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
