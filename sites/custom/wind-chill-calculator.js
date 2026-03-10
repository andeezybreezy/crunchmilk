(function() {
  'use strict';

  var temp = document.getElementById('temp');
  var tempUnit = document.getElementById('tempUnit');
  var wind = document.getElementById('wind');
  var windUnit = document.getElementById('windUnit');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var t = parseFloat(temp.value);
    var v = parseFloat(wind.value);
    if (isNaN(t) || isNaN(v)) return;

    // Convert to °F and mph
    var tF = tempUnit.value === 'C' ? t * 9 / 5 + 32 : t;
    var vMph = windUnit.value === 'kmh' ? v * 0.621371 : v;

    var wc;
    if (vMph < 3 || tF > 50) {
      wc = tF; // formula not applicable
    } else {
      var vPow = Math.pow(vMph, 0.16);
      wc = 35.74 + 0.6215 * tF - 35.75 * vPow + 0.4275 * tF * vPow;
    }

    var wcDisplay = Math.round(wc);
    var wcC = Math.round((wc - 32) * 5 / 9);

    // Danger level and frostbite
    var danger, frostbite, dangerColor;
    if (wc > 32) {
      danger = 'Low'; frostbite = 'Unlikely'; dangerColor = '#16a34a';
    } else if (wc > 0) {
      danger = 'Moderate'; frostbite = 'Possible in 30+ min'; dangerColor = '#ca8a04';
    } else if (wc > -20) {
      danger = 'High'; frostbite = '~30 minutes'; dangerColor = '#ea580c';
    } else if (wc > -45) {
      danger = 'Very High'; frostbite = '~10 minutes'; dangerColor = '#dc2626';
    } else if (wc > -60) {
      danger = 'Extreme'; frostbite = '~5 minutes'; dangerColor = '#991b1b';
    } else {
      danger = 'Extreme Danger'; frostbite = 'Under 5 minutes'; dangerColor = '#7f1d1d';
    }

    document.getElementById('windChill').textContent = wcDisplay + '°F (' + wcC + '°C)';
    var dangerEl = document.getElementById('dangerLevel');
    dangerEl.textContent = danger;
    dangerEl.style.color = dangerColor;
    document.getElementById('frostbite').textContent = frostbite;

    var tip = 'Air temp: ' + Math.round(tF) + '°F, Wind: ' + Math.round(vMph) + ' mph';
    if (vMph < 3) tip += ' — Wind too low for wind chill formula';
    if (tF > 50) tip += ' — Temp too high for wind chill formula';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [temp, tempUnit, wind, windUnit].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
