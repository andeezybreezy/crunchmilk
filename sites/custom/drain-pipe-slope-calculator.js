(function() {
  'use strict';

  // IPC minimum slope (inches per foot) by pipe diameter
  var minSlopes = {
    '1.5': 0.25,
    '2': 0.25,
    '3': 0.25,
    '4': 0.125,
    '6': 0.125
  };

  var maxSlopePerFt = 0.5; // inches per foot

  var pipeDiameter = document.getElementById('pipeDiameter');
  var pipeLength = document.getElementById('pipeLength');
  var availableDrop = document.getElementById('availableDrop');
  var calcBtn = document.getElementById('calcBtn');
  var rSlope = document.getElementById('rSlope');
  var rDrop = document.getElementById('rDrop');
  var rPct = document.getElementById('rPct');
  var rStatus = document.getElementById('rStatus');
  var resultDetails = document.getElementById('resultDetails');

  function fractionLabel(val) {
    if (val === 0.25) return '1/4';
    if (val === 0.125) return '1/8';
    if (val === 0.5) return '1/2';
    return val.toString();
  }

  function calculate() {
    var dia = pipeDiameter.value;
    var length = parseFloat(pipeLength.value);

    if (isNaN(length) || length <= 0) {
      rSlope.textContent = '—';
      rDrop.textContent = '—';
      rPct.textContent = '—';
      rStatus.textContent = '—';
      resultDetails.innerHTML = '';
      return;
    }

    var minSlope = minSlopes[dia];
    var totalMinDrop = minSlope * length;
    var totalMaxDrop = maxSlopePerFt * length;
    var pct = (minSlope / 12) * 100;

    rSlope.textContent = fractionLabel(minSlope) + '\" per foot';
    rDrop.textContent = totalMinDrop.toFixed(2) + '"';
    rPct.textContent = pct.toFixed(2) + '% grade';

    // Check available drop
    var dropVal = parseFloat(availableDrop.value);
    var hasAvail = !isNaN(dropVal) && dropVal > 0;

    var html = '';
    var diaLabel = dia === '1.5' ? '1-1/2"' : dia === '6' ? '6"' : dia + '"';

    if (hasAvail) {
      var actualSlope = dropVal / length;
      var actualPct = (actualSlope / 12) * 100;

      if (actualSlope >= minSlope && actualSlope <= maxSlopePerFt) {
        rStatus.textContent = 'PASS';
        rStatus.style.color = '#16a34a';
      } else if (actualSlope < minSlope) {
        rStatus.textContent = 'FAIL — Too flat';
        rStatus.style.color = '#dc2626';
      } else {
        rStatus.textContent = 'WARNING — Too steep';
        rStatus.style.color = '#ca8a04';
      }

      html += '<p style="margin:0 0 8px"><strong>Your slope:</strong> ' + actualSlope.toFixed(3) + '\" per foot (' + actualPct.toFixed(2) + '% grade)</p>';
      html += '<p style="margin:0 0 8px"><strong>Available drop:</strong> ' + dropVal.toFixed(2) + '\" over ' + length + ' ft</p>';

      if (actualSlope < minSlope) {
        var needed = totalMinDrop - dropVal;
        html += '<p style="margin:0 0 8px;color:#dc2626"><strong>Short by:</strong> ' + needed.toFixed(2) + '\" — need at least ' + totalMinDrop.toFixed(2) + '\" total drop</p>';
      }
    } else {
      rStatus.textContent = 'Enter drop to check';
      rStatus.style.color = 'var(--text-light)';
    }

    html += '<p style="margin:0 0 8px"><strong>Pipe:</strong> ' + diaLabel + ' diameter, ' + length + ' ft run</p>';
    html += '<p style="margin:0 0 8px"><strong>Minimum drop:</strong> ' + totalMinDrop.toFixed(2) + '" (' + fractionLabel(minSlope) + '"/ft × ' + length + ' ft)</p>';
    html += '<p style="margin:0 0 8px"><strong>Maximum drop:</strong> ' + totalMaxDrop.toFixed(2) + '" (1/2"/ft × ' + length + ' ft)</p>';

    // In feet and inches
    var dropFt = Math.floor(totalMinDrop / 12);
    var dropIn = totalMinDrop % 12;
    if (dropFt > 0) {
      html += '<p style="margin:0"><strong>Total drop:</strong> ' + dropFt + '\' ' + dropIn.toFixed(1) + '" minimum</p>';
    }

    resultDetails.innerHTML = html;
  }

  calcBtn.addEventListener('click', calculate);

  [pipeDiameter, pipeLength, availableDrop].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

})();
