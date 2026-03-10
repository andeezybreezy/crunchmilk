(function() {
  'use strict';

  var airTemp = document.getElementById('airTemp');
  var humidity = document.getElementById('humidity');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var T = parseFloat(airTemp.value);
    var R = parseFloat(humidity.value);
    if (isNaN(T) || isNaN(R)) return;

    var HI;

    // Simple formula first
    HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));

    if (HI >= 80) {
      // Full Rothfusz regression
      HI = -42.379
        + 2.04901523 * T
        + 10.14333127 * R
        - 0.22475541 * T * R
        - 0.00683783 * T * T
        - 0.05481717 * R * R
        + 0.00122874 * T * T * R
        + 0.00085282 * T * R * R
        - 0.00000199 * T * T * R * R;

      // Adjustments
      if (R < 13 && T >= 80 && T <= 112) {
        HI -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      }
      if (R > 85 && T >= 80 && T <= 87) {
        HI += ((R - 85) / 10) * ((87 - T) / 5);
      }
    }

    var hiRound = Math.round(HI);
    var hiC = Math.round((HI - 32) * 5 / 9);

    // Danger level
    var danger, risk, color;
    if (HI < 80) {
      danger = 'None'; risk = 'No significant risk'; color = '#16a34a';
    } else if (HI < 90) {
      danger = 'Caution'; risk = 'Fatigue possible with prolonged exposure and activity'; color = '#ca8a04';
    } else if (HI < 103) {
      danger = 'Extreme Caution'; risk = 'Heat cramps and heat exhaustion possible'; color = '#ea580c';
    } else if (HI < 125) {
      danger = 'Danger'; risk = 'Heat cramps and heat exhaustion likely; heatstroke possible'; color = '#dc2626';
    } else {
      danger = 'Extreme Danger'; risk = 'Heatstroke highly likely'; color = '#991b1b';
    }

    document.getElementById('heatIndex').textContent = hiRound + '°F (' + hiC + '°C)';
    var dangerEl = document.getElementById('dangerLevel');
    dangerEl.textContent = danger;
    dangerEl.style.color = color;
    document.getElementById('healthRisk').textContent = risk;
    document.getElementById('resultTip').textContent = 'Air temp: ' + T + '°F, Humidity: ' + R + '%. Add up to 15°F for full sun exposure.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [airTemp, humidity].forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  calculate();
})();
