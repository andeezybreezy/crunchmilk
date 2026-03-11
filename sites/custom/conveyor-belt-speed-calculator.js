(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var rollerDia = parseFloat(document.getElementById('rollerDia').value) || 0;
    var rpm = parseFloat(document.getElementById('rpm').value) || 0;
    var ratio = parseFloat(document.getElementById('ratio').value) || 0;

    // Calculation logic
    var outputRpm = rpm / ratio; var circumference = Math.PI * rollerDia / 12; var beltSpeed = outputRpm * circumference; var beltSpeedMph = beltSpeed * 60 / 5280; return {beltSpeed: fmt(beltSpeed,1), beltSpeedMph: fmt(beltSpeedMph,2)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['rollerDia', 'rpm', 'ratio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
