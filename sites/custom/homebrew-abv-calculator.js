(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var og = parseFloat(document.getElementById('og').value) || 0;
    var fg = parseFloat(document.getElementById('fg').value) || 0;

    // Calculation logic
    var abv=(og-fg)*131.25; var abw=abv*0.8; var attenuation=((og-fg)/(og-1))*100; return {abv:fmt(abv,2)+'%', abw:fmt(abw,2)+'%', attenuation:fmt(attenuation,1)+'%'};

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
