(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var windowW = parseFloat(document.getElementById('windowW').value) || 0;
    var windowH = parseFloat(document.getElementById('windowH').value) || 0;
    var fullness = document.getElementById('fullness').value;
    var panels = parseFloat(document.getElementById('panels').value) || 0;

    // Calculation logic
    var f = parseFloat(fullness); var totalWidth = windowW * f; var perPanel = totalWidth / panels; var cutW = perPanel + 6; var cutL = windowH + 12; var totalInches = cutL * panels; var yards = totalInches / 36; var fabricWidth = 54; var widthPanels = Math.ceil(cutW / fabricWidth); yards = yards * widthPanels; document.getElementById('cutWidth').textContent = fmt(cutW, 0) + '"'; document.getElementById('cutLength').textContent = fmt(cutL, 0) + '"'; document.getElementById('totalYards').textContent = fmt(yards, 1) + ' yards'; document.getElementById('cost').textContent = dollar(yards * 12) + ' - ' + dollar(yards * 25);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['windowW', 'windowH', 'fullness', 'panels'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
