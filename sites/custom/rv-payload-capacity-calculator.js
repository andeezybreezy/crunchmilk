(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gvwr = parseFloat(document.getElementById('gvwr').value) || 0;
    var dryWeight = parseFloat(document.getElementById('dryWeight').value) || 0;
    var passengers = parseFloat(document.getElementById('passengers').value) || 0;
    var waterGallons = parseFloat(document.getElementById('waterGallons').value) || 0;

    // Calculation logic
    var ccc = gvwr - dryWeight; var passengerWeight = passengers * 175; var waterWeight = waterGallons * 8.34; var remaining = ccc - passengerWeight - waterWeight;     document.getElementById('ccc').textContent = fmt(ccc,0);
    document.getElementById('remaining').textContent = fmt(remaining,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gvwr', 'dryWeight', 'passengers', 'waterGallons'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
