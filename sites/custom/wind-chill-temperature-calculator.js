(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var temp = parseFloat(document.getElementById('temp').value) || 0;
    var wind = parseFloat(document.getElementById('wind').value) || 0;

    // Calculation logic
    var windChill = 35.74 + (0.6215 * temp) - (35.75 * Math.pow(wind, 0.16)) + (0.4275 * temp * Math.pow(wind, 0.16)); var danger = windChill < -40 ? 'Extreme - frostbite in <5 min' : windChill < -20 ? 'High - frostbite in 10-30 min' : windChill < 0 ? 'Moderate - dress in layers' : 'Low'; return {windChill: fmt(windChill,0), danger: danger};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['temp', 'wind'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
