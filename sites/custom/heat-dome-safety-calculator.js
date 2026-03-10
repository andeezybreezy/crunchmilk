(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    return n.toFixed(d);
  }

  var temperatureEl = document.getElementById('temperature');
  var humidityEl = document.getElementById('humidity');
  var windSpeedEl = document.getElementById('windSpeed');
  var sunExposureEl = document.getElementById('sunExposure');
  var workIntensityEl = document.getElementById('workIntensity');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['< 78', 'Low', 'Continuous', 'Continuous', 'Continuous', '50 min / 10 rest'],
    ['78-82', 'Moderate', 'Continuous', 'Continuous', '50 / 10 rest', '40 / 20 rest'],
    ['82-85', 'High', 'Continuous', '50 / 10 rest', '40 / 20 rest', '30 / 30 rest'],
    ['85-88', 'Very High', '50 / 10 rest', '40 / 20 rest', '30 / 30 rest', '20 / 40 rest'],
    ['88-90', 'Extreme', '40 / 20 rest', '30 / 30 rest', '20 / 40 rest', 'STOP WORK'],
    ['> 90', 'Deadly', '30 / 30 rest', '20 / 40 rest', 'STOP WORK', 'STOP WORK']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      var cells = '';
      for (var i = 0; i < row.length; i++) cells += '<td>' + row[i] + '</td>';
      tr.innerHTML = cells;
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var tempF = getVal(temperatureEl);
    var rh = getVal(humidityEl);
    var wind = getVal(windSpeedEl);
    var sun = sunExposureEl.value;
    var intensity = workIntensityEl.value;

    if (tempF <= 0 || rh <= 0) return;

    var tempC = (tempF - 32) * 5 / 9;

    // Approximate wet bulb temperature using Stull formula
    var tWet = tempC * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5))
      + Math.atan(tempC + rh)
      - Math.atan(rh - 1.676331)
      + 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh)
      - 4.686035;

    // Globe temperature approximation
    var sunFactor = sun === 'full' ? 15 : sun === 'partial' ? 7 : 0;
    var windReduction = Math.min(wind * 0.5, 5);
    var tGlobe = tempC + sunFactor - windReduction;

    // WBGT = 0.7 * Twet + 0.2 * Tglobe + 0.1 * Tdry
    var wbgtC = 0.7 * tWet + 0.2 * tGlobe + 0.1 * tempC;
    var wbgtF = (wbgtC * 9 / 5) + 32;

    // Risk level
    var risk, riskColor, bgColor;
    if (wbgtF < 78) { risk = 'Low'; riskColor = '#059669'; bgColor = '#f0fdf4'; }
    else if (wbgtF < 82) { risk = 'Moderate'; riskColor = '#d97706'; bgColor = '#fffbeb'; }
    else if (wbgtF < 85) { risk = 'High'; riskColor = '#ea580c'; bgColor = '#fff7ed'; }
    else if (wbgtF < 88) { risk = 'Very High'; riskColor = '#dc2626'; bgColor = '#fef2f2'; }
    else if (wbgtF < 90) { risk = 'Extreme'; riskColor = '#991b1b'; bgColor = '#fef2f2'; }
    else { risk = 'DEADLY'; riskColor = '#7f1d1d'; bgColor = '#fef2f2'; }

    // Work/rest by intensity
    var workRest;
    if (intensity === 'light') {
      if (wbgtF < 85) workRest = 'Continuous work OK';
      else if (wbgtF < 88) workRest = '50 min work / 10 min rest';
      else if (wbgtF < 90) workRest = '40 min work / 20 min rest';
      else workRest = '30 min work / 30 min rest';
    } else if (intensity === 'moderate') {
      if (wbgtF < 82) workRest = 'Continuous work OK';
      else if (wbgtF < 85) workRest = '50 min work / 10 min rest';
      else if (wbgtF < 88) workRest = '40 min work / 20 min rest';
      else if (wbgtF < 90) workRest = '30 min work / 30 min rest';
      else workRest = '20 min work / 40 min rest';
    } else if (intensity === 'heavy') {
      if (wbgtF < 78) workRest = 'Continuous work OK';
      else if (wbgtF < 82) workRest = '50 min work / 10 min rest';
      else if (wbgtF < 85) workRest = '40 min work / 20 min rest';
      else if (wbgtF < 88) workRest = '30 min work / 30 min rest';
      else if (wbgtF < 90) workRest = '20 min work / 40 min rest';
      else workRest = 'STOP WORK — too dangerous';
    } else {
      if (wbgtF < 78) workRest = '50 min work / 10 min rest';
      else if (wbgtF < 82) workRest = '40 min work / 20 min rest';
      else if (wbgtF < 85) workRest = '30 min work / 30 min rest';
      else if (wbgtF < 88) workRest = '20 min work / 40 min rest';
      else workRest = 'STOP WORK — too dangerous';
    }

    // Hydration
    var hydration;
    if (wbgtF < 78) hydration = '0.5 cups / 20 min';
    else if (wbgtF < 82) hydration = '1 cup / 20 min';
    else if (wbgtF < 85) hydration = '1 cup / 15 min';
    else hydration = '1 cup / 15 min + electrolytes';

    document.getElementById('rWBGT').textContent = fmt(wbgtF, 1) + '\u00b0F';
    document.getElementById('rWBGT').style.color = riskColor;
    document.getElementById('rRisk').textContent = risk;
    document.getElementById('rRisk').style.color = riskColor;
    document.getElementById('rWorkRest').textContent = workRest;
    document.getElementById('rWorkRest').style.color = wbgtF >= 88 ? '#dc2626' : '';
    document.getElementById('rHydration').textContent = hydration;

    var d = '';

    d += '<div style="padding:16px;background:' + bgColor + ';border-radius:8px;font-size:0.9rem;margin-bottom:12px;border-left:4px solid ' + riskColor + '">';
    if (wbgtF >= 88) {
      d += '<strong style="color:' + riskColor + ';font-size:1.1rem">\u26a0 DANGER: Extreme Heat Stress</strong><br>';
      d += 'WBGT ' + fmt(wbgtF, 1) + '\u00b0F is in the <strong>' + risk + '</strong> range. ';
      d += 'Heat illness can develop rapidly. Minimize outdoor exposure, take frequent breaks in air conditioning, and monitor for symptoms.';
    } else if (wbgtF >= 82) {
      d += '<strong style="color:' + riskColor + '">\u26a0 High Heat Stress Risk</strong><br>';
      d += 'WBGT ' + fmt(wbgtF, 1) + '\u00b0F requires mandatory work/rest cycles and aggressive hydration. ';
      d += 'Watch for signs of heat exhaustion: heavy sweating, weakness, nausea, dizziness.';
    } else if (wbgtF >= 78) {
      d += '<strong style="color:' + riskColor + '">Moderate Heat Stress</strong><br>';
      d += 'WBGT ' + fmt(wbgtF, 1) + '\u00b0F. Stay hydrated and take breaks as needed. Higher-intensity activities may require scheduled rest periods.';
    } else {
      d += '<strong style="color:' + riskColor + '">Low Heat Stress Risk</strong><br>';
      d += 'WBGT ' + fmt(wbgtF, 1) + '\u00b0F. Conditions are generally safe for outdoor activity. Stay hydrated as normal.';
    }
    d += '</div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Conditions</strong><br>';
    d += 'Temperature: ' + fmt(tempF, 0) + '\u00b0F (' + fmt(tempC, 1) + '\u00b0C) | Humidity: ' + fmt(rh, 0) + '%<br>';
    d += 'Wind: ' + fmt(wind, 0) + ' mph | Sun: ' + sunExposureEl.options[sunExposureEl.selectedIndex].text + '<br>';
    d += 'Est. wet bulb: ' + fmt((tWet * 9/5) + 32, 1) + '\u00b0F | Est. globe: ' + fmt((tGlobe * 9/5) + 32, 1) + '\u00b0F';
    d += '</div>';

    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Safety Reminders</strong><br>';
    d += '\u2022 Drink <strong>before</strong> you feel thirsty — thirst means you are already dehydrating<br>';
    d += '\u2022 Rest in shade or AC — body needs to cool down, not just stop working<br>';
    d += '\u2022 Wear light, loose clothing and a hat<br>';
    d += '\u2022 New/returning workers need 7-14 days to acclimatize<br>';
    d += '\u2022 Heat stroke (confusion, hot/dry skin, temp >103\u00b0F) = <strong>call 911 immediately</strong>';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [temperatureEl, humidityEl, windSpeedEl, sunExposureEl, workIntensityEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
