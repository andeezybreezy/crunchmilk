(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var og = parseFloat(document.getElementById('og').value) || 0;
    var fg = parseFloat(document.getElementById('fg').value) || 0;

    // Calculation logic
    var abv=(og-fg)*131.25; var abw=abv*0.8; var attenuation=((og-fg)/(og-1))*100;     document.getElementById('abv').textContent = fmt(abv,2)+'%';
    document.getElementById('abw').textContent = fmt(abw,2)+'%';
    document.getElementById('attenuation').textContent = fmt(attenuation,1)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['og', 'fg'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
