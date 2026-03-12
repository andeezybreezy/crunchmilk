(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var temp = parseFloat(document.getElementById('temp').value) || 0;
    var humidity = parseFloat(document.getElementById('humidity').value) || 0;

    // Calculation logic
    var tempC = (temp - 32) * 5/9; var a = 17.27; var b = 237.7; var alpha = (a * tempC)/(b + tempC) + Math.log(humidity/100); var dewC = (b * alpha)/(a - alpha); var dewPoint = dewC * 9/5 + 32; var comfort = dewPoint > 75 ? 'Extremely uncomfortable' : dewPoint > 70 ? 'Very muggy' : dewPoint > 65 ? 'Uncomfortable' : dewPoint > 60 ? 'Slightly humid' : dewPoint > 55 ? 'Comfortable' : 'Dry and pleasant';     document.getElementById('dewPoint').textContent = fmt(dewPoint,0);
    document.getElementById('comfort').textContent = comfort;

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
