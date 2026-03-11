(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var elevation = parseFloat(document.getElementById('elevation').value) || 0;
    var density = document.getElementById('density').value;

    // Calculation logic
    var densities={water:62.4,salt:64.1}; var d=densities[density]; var psi=elevation*d/144; var kpa=psi*6.895; return {psi:fmt(psi,1)+' PSI', kpa:fmt(kpa,1)+' kPa', head:elevation+' ft of head'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['elevation', 'density'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
