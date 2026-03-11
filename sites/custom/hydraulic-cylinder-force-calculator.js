(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bore = parseFloat(document.getElementById('bore').value) || 0;
    var rodDia = parseFloat(document.getElementById('rodDia').value) || 0;
    var pressure = parseFloat(document.getElementById('pressure').value) || 0;

    // Calculation logic
    var boreArea = Math.PI * Math.pow(bore/2, 2); var rodArea = Math.PI * Math.pow(rodDia/2, 2); var pushForce = boreArea * pressure; var pullForce = (boreArea - rodArea) * pressure;     document.getElementById('pushForce').textContent = fmt(pushForce,0);
    document.getElementById('pullForce').textContent = fmt(pullForce,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bore', 'rodDia', 'pressure'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
