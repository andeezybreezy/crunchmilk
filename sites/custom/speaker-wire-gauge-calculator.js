(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var impedance = parseFloat(document.getElementById('impedance').value) || 0;
    var power = parseFloat(document.getElementById('power').value) || 0;

    // Calculation logic
    var ratio = distance / impedance; var gauge = ratio > 50 ? 10 : ratio > 25 ? 12 : ratio > 12 ? 14 : 16; var resistance = {'10': 0.001, '12': 0.0016, '14': 0.0025, '16': 0.004}; var wireR = resistance[String(gauge)] * distance * 2; var maxLoss = (wireR / (wireR + impedance)) * 100; return {gauge: fmt(gauge,0), maxLoss: fmt(maxLoss,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'impedance', 'power'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
