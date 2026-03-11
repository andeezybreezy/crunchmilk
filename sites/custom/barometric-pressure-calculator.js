(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pressureValue = parseFloat(document.getElementById('pressureValue').value) || 0;
    var fromUnit = document.getElementById('fromUnit').value;
    var altitude = parseFloat(document.getElementById('altitude').value) || 0;

    // Calculation logic
    var inhg;
    if (fromUnit === 'inHg') inhg = pressureValue;
    else if (fromUnit === 'hPa') inhg = pressureValue * 0.02953;
    else if (fromUnit === 'mmHg') inhg = pressureValue * 0.03937;
    else if (fromUnit === 'atm') inhg = pressureValue * 29.9213;
    else inhg = pressureValue * 2.03602;
    var hpa = inhg / 0.02953;
    var mmhg = inhg / 0.03937;
    var atm = inhg / 29.9213;
    var psi = inhg / 2.03602;
    var altMeters = altitude * 0.3048;
    var altFactor = Math.pow(1 - (0.0000225577 * altMeters), 5.25588);
    var altPressInHg = inhg * altFactor;
    var weather;
    if (inhg >= 30.2) weather = 'High pressure — generally fair, clear skies';
    else if (inhg >= 29.8) weather = 'Normal pressure — typical conditions';
    else if (inhg >= 29.5) weather = 'Falling pressure — change in weather likely';
    else weather = 'Low pressure — stormy or unsettled weather';
    document.getElementById('inHg').textContent = fmt(inhg, 2) + ' inHg';
    document.getElementById('hPa').textContent = fmt(hpa, 1) + ' hPa (mbar)';
    document.getElementById('mmHg').textContent = fmt(mmhg, 1) + ' mmHg';
    document.getElementById('atm').textContent = atm.toFixed(4) + ' atm';
    document.getElementById('altPressure').textContent = altitude > 0 ? fmt(altPressInHg, 2) + ' inHg at ' + fmt(altitude, 0) + ' ft (' + fmt(altPressInHg / 0.02953, 0) + ' hPa)' : 'Enter altitude for adjustment';
    document.getElementById('weather').textContent = weather;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pressureValue', 'fromUnit', 'altitude'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
