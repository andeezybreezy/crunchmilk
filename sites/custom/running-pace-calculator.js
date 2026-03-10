(function() {
  'use strict';

  var mode = 'pace';

  function updateVisibility() {
    document.getElementById('distanceGroup').style.display = (mode === 'distance') ? 'none' : '';
    document.getElementById('timeGroup').style.display = (mode === 'time') ? 'none' : '';
    document.getElementById('paceGroup').style.display = (mode === 'pace') ? 'none' : '';
  }

  document.querySelectorAll('[data-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-mode]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.mode;
      updateVisibility();
    });
  });

  document.getElementById('distPreset').addEventListener('change', function() {
    document.getElementById('customDistGroup').style.display = this.value === 'custom' ? '' : 'none';
  });

  function fmtTime(totalSec) {
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = Math.round(totalSec % 60);
    if (s === 60) { m++; s = 0; }
    if (m === 60) { h++; m = 0; }
    if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return m + ':' + String(s).padStart(2, '0');
  }

  function getDistMiles() {
    var val = document.getElementById('distPreset').value;
    if (val === 'custom') return parseFloat(document.getElementById('customDist').value);
    return parseFloat(val);
  }

  function getTimeSec() {
    var h = parseFloat(document.getElementById('timeHrs').value) || 0;
    var m = parseFloat(document.getElementById('timeMin').value) || 0;
    var s = parseFloat(document.getElementById('timeSec').value) || 0;
    return h * 3600 + m * 60 + s;
  }

  function getPaceSec() {
    var m = parseFloat(document.getElementById('paceMin').value) || 0;
    var s = parseFloat(document.getElementById('paceSec').value) || 0;
    return m * 60 + s;
  }

  document.getElementById('calcBtn').addEventListener('click', function() {
    var distMi, totalSec, paceSecPerMi;

    if (mode === 'pace') {
      distMi = getDistMiles();
      totalSec = getTimeSec();
      if (!distMi || !totalSec) { alert('Please enter distance and time.'); return; }
      paceSecPerMi = totalSec / distMi;
    } else if (mode === 'time') {
      distMi = getDistMiles();
      paceSecPerMi = getPaceSec();
      if (!distMi || !paceSecPerMi) { alert('Please enter distance and pace.'); return; }
      totalSec = paceSecPerMi * distMi;
    } else {
      paceSecPerMi = getPaceSec();
      totalSec = getTimeSec();
      if (!paceSecPerMi || !totalSec) { alert('Please enter pace and time.'); return; }
      distMi = totalSec / paceSecPerMi;
    }

    var paceSecPerKm = paceSecPerMi / 1.60934;
    var speedMph = 3600 / paceSecPerMi;
    var speedKph = speedMph * 1.60934;

    document.getElementById('resPaceMi').textContent = fmtTime(paceSecPerMi) + ' /mi';
    document.getElementById('resPaceKm').textContent = fmtTime(paceSecPerKm) + ' /km';
    document.getElementById('resTime').textContent = fmtTime(totalSec);
    document.getElementById('resSpeed').textContent = speedMph.toFixed(1) + ' mph / ' + speedKph.toFixed(1) + ' kph';

    // Splits table
    var miles = Math.ceil(distMi);
    if (miles > 0 && miles <= 30) {
      var html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem">';
      html += '<tr style="border-bottom:2px solid #ddd"><th style="text-align:left;padding:4px">Mile</th><th style="text-align:right;padding:4px">Split</th><th style="text-align:right;padding:4px">Elapsed</th></tr>';
      for (var i = 1; i <= miles; i++) {
        var frac = (i <= distMi) ? 1 : (distMi - (i - 1));
        if (frac <= 0) break;
        var splitSec = paceSecPerMi * frac;
        var elapsedSec = paceSecPerMi * Math.min(i, distMi);
        html += '<tr style="border-bottom:1px solid #eee"><td style="padding:4px">' + (frac < 1 ? distMi.toFixed(2) : i) + '</td><td style="text-align:right;padding:4px">' + fmtTime(splitSec) + '</td><td style="text-align:right;padding:4px">' + fmtTime(elapsedSec) + '</td></tr>';
      }
      html += '</table>';
      document.getElementById('splitsTable').innerHTML = html;
    } else {
      document.getElementById('splitsTable').innerHTML = '';
    }

    document.getElementById('result').style.display = '';
  });
})();
