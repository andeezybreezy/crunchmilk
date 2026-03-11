(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var nightlyRate = parseFloat(document.getElementById('nightlyRate').value) || 0;
    var hookups = document.getElementById('hookups').value;

    // Calculation logic
    var extras = {full: 10, water_electric: 5, dry: 0}; var extra = extras[hookups] || 0; var effective = nightlyRate + extra; var total = effective * nights; document.getElementById('totalCamp').textContent = dollar(total); document.getElementById('avgNight').textContent = dollar(effective) + '/night'; document.getElementById('weeklyRate').textContent = dollar(effective * 7) + '/week'; document.getElementById('resultTip').textContent = 'Tip: Weekly and monthly rates can save 15-30% at most RV parks.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nights', 'nightlyRate', 'hookups'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
