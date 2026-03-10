(function() {
  'use strict';

  // Standard round duct sizes (inches)
  var stdRound = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  var cfmMethod = document.getElementById('cfmMethod');
  var cfmDirectWrap = document.getElementById('cfmDirectWrap');
  var cfmRoomWrap = document.getElementById('cfmRoomWrap');
  var cfm = document.getElementById('cfm');
  var roomSqFt = document.getElementById('roomSqFt');
  var ductType = document.getElementById('ductType');
  var maxVelocity = document.getElementById('maxVelocity');
  var calcBtn = document.getElementById('calcBtn');
  var rRound = document.getElementById('rRound');
  var rVelocity = document.getElementById('rVelocity');
  var rRect = document.getElementById('rRect');
  var rArea = document.getElementById('rArea');
  var resultDetails = document.getElementById('resultDetails');

  cfmMethod.addEventListener('change', function() {
    if (cfmMethod.value === 'direct') {
      cfmDirectWrap.style.display = '';
      cfmRoomWrap.style.display = 'none';
    } else {
      cfmDirectWrap.style.display = 'none';
      cfmRoomWrap.style.display = '';
    }
  });

  function getCFM() {
    if (cfmMethod.value === 'roomsize') {
      var sf = parseFloat(roomSqFt.value);
      return isNaN(sf) || sf <= 0 ? NaN : sf; // 1 CFM per sq ft
    }
    var v = parseFloat(cfm.value);
    return isNaN(v) || v <= 0 ? NaN : v;
  }

  function calculate() {
    var airflow = getCFM();
    var velocity = parseFloat(maxVelocity.value);

    if (isNaN(airflow)) {
      rRound.textContent = '—';
      rVelocity.textContent = '—';
      rRect.textContent = '—';
      rArea.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    // Required area in sq ft
    var areaSqFt = airflow / velocity;
    var areaSqIn = areaSqFt * 144;

    // Round duct diameter (inches)
    var exactDia = Math.sqrt(4 * areaSqIn / Math.PI);

    // Find next standard round size
    var stdDia = stdRound[stdRound.length - 1];
    for (var i = 0; i < stdRound.length; i++) {
      if (stdRound[i] >= exactDia) {
        stdDia = stdRound[i];
        break;
      }
    }

    var actualArea = Math.PI * (stdDia / 2) * (stdDia / 2);
    var actualVelocity = airflow / (actualArea / 144);

    // Equivalent rectangular sizes (common aspect ratios)
    var rectOptions = [];
    var widths = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24];
    for (var w = 0; w < widths.length; w++) {
      var h = Math.ceil(areaSqIn / widths[w]);
      if (h >= 4 && h <= widths[w] * 4 && widths[w] <= h * 4) {
        // Round h to nearest even number
        h = Math.ceil(h / 2) * 2;
        if (widths[w] * h >= areaSqIn) {
          rectOptions.push(widths[w] + '" × ' + h + '"');
          if (rectOptions.length >= 3) break;
        }
      }
    }

    rRound.textContent = stdDia + '"';
    rVelocity.textContent = Math.round(actualVelocity) + ' FPM';
    rRect.textContent = rectOptions.length > 0 ? rectOptions[0] : '—';
    rArea.textContent = actualArea.toFixed(1) + ' sq in';

    var html = '<p style="margin:0 0 8px"><strong>Required area:</strong> ' + areaSqIn.toFixed(1) + ' sq in (exact diameter: ' + exactDia.toFixed(1) + '")</p>';
    html += '<p style="margin:0 0 8px"><strong>Standard round:</strong> ' + stdDia + '" (' + actualArea.toFixed(1) + ' sq in, ' + Math.round(actualVelocity) + ' FPM actual)</p>';

    if (rectOptions.length > 0) {
      html += '<p style="margin:0 0 8px"><strong>Rectangular options:</strong> ' + rectOptions.join(' &bull; ') + '</p>';
    }

    // Friction loss estimate (approx 0.08 in. w.g. per 100 ft for properly sized residential duct)
    var frictionPer100 = 0.08;
    html += '<p style="margin:0 0 8px"><strong>Estimated friction:</strong> ~' + frictionPer100 + ' in. w.g. per 100 ft (standard residential design)</p>';

    // Noise guidance
    if (actualVelocity > 900) {
      html += '<p style="margin:0;color:#ca8a04"><strong>Noise note:</strong> Velocity above 900 FPM may produce audible air noise in residential settings. Consider upsizing for bedrooms.</p>';
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [cfmMethod, cfm, roomSqFt, ductType, maxVelocity].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
