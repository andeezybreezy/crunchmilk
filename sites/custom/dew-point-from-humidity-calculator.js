(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var temp = parseFloat(document.getElementById('temp').value) || 0;
    var humidity = parseFloat(document.getElementById('humidity').value) || 0;

    // Calculation logic
    var tempC = (temp - 32) * 5/9; var a = 17.27; var b = 237.7; var alpha = (a * tempC)/(b + tempC) + Math.log(humidity/100); var dewC = (b * alpha)/(a - alpha); var dewPoint = dewC * 9/5 + 32; var comfort = dewPoint > 75 ? 'Extremely uncomfortable' : dewPoint > 70 ? 'Very muggy' : dewPoint > 65 ? 'Uncomfortable' : dewPoint > 60 ? 'Slightly humid' : dewPoint > 55 ? 'Comfortable' : 'Dry and pleasant'; return {dewPoint: fmt(dewPoint,0), comfort: comfort};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['temp', 'humidity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
