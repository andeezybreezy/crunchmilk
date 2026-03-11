(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gross = parseFloat(document.getElementById('gross').value) || 0;
    var frequency = document.getElementById('frequency').value;
    var stateTax = parseFloat(document.getElementById('stateTax').value) || 0;

    // Calculation logic
    var periods = {'Weekly': 52, 'Bi-Weekly': 26, 'Monthly': 12}; var annual = gross * (periods[frequency] || 26); var fedRate = annual > 95375 ? 0.22 : annual > 44725 ? 0.17 : 0.12; var federal = gross * fedRate; var fica = gross * 0.0765; var state = gross * (stateTax/100); var net = gross - federal - fica - state; return {federal: dollar(federal), fica: dollar(fica), state: dollar(state), net: dollar(net)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gross', 'frequency', 'stateTax'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
