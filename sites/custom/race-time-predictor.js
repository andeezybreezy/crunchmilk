(function() {
  'use strict';

  var distances = {
    '5': { name: '5K', km: 5 },
    '10': { name: '10K', km: 10 },
    '15': { name: '15K', km: 15 },
    '21.0975': { name: 'Half Marathon', km: 21.0975 },
    '42.195': { name: 'Marathon', km: 42.195 }
  };

  var chartData = [
    ['5K', '3.1 mi', '30-35 min', '22-28 min', 'Under 20 min'],
    ['10K', '6.2 mi', '60-70 min', '45-55 min', 'Under 40 min'],
    ['15K', '9.3 mi', '95-110 min', '70-85 min', 'Under 60 min'],
    ['Half Marathon', '13.1 mi', '2:15-2:45', '1:45-2:00', 'Under 1:30'],
    ['Marathon', '26.2 mi', '4:30-5:30', '3:30-4:15', 'Under 3:00']
  ];

  // Show/hide custom distance inputs
  document.getElementById('knownDist').addEventListener('change', function() {
    document.getElementById('customDist').style.display = this.value === 'custom' ? '' : 'none';
  });
  document.getElementById('targetDist').addEventListener('change', function() {
    document.getElementById('customTarget').style.display = this.value === 'custom2' ? '' : 'none';
  });

  function formatTime(totalSeconds) {
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.round(totalSeconds % 60);
    if (s === 60) { m++; s = 0; }
    if (m === 60) { h++; m = 0; }
    if (h > 0) {
      return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    return m + ':' + String(s).padStart(2, '0');
  }

  function riegelPredict(t1Seconds, d1Km, d2Km) {
    return t1Seconds * Math.pow(d2Km / d1Km, 1.06);
  }

  function calculate() {
    var distVal = document.getElementById('knownDist').value;
    var d1 = distVal === 'custom' ? parseFloat(document.getElementById('customDist').value) : parseFloat(distVal);

    var targetVal = document.getElementById('targetDist').value;
    var d2 = targetVal === 'custom2' ? parseFloat(document.getElementById('customTarget').value) : parseFloat(targetVal);

    var h = parseFloat(document.getElementById('hours').value) || 0;
    var m = parseFloat(document.getElementById('minutes').value) || 0;
    var s = parseFloat(document.getElementById('seconds').value) || 0;
    var t1 = h * 3600 + m * 60 + s;

    if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0 || t1 <= 0) return;

    var predicted = riegelPredict(t1, d1, d2);
    var pacePerKm = predicted / d2;
    var pacePerMile = pacePerKm * 1.60934;

    document.getElementById('predictedTime').textContent = formatTime(predicted);
    document.getElementById('predictedPace').textContent = formatTime(pacePerKm) + ' /km  \u00B7  ' + formatTime(pacePerMile) + ' /mi';

    // Show all predictions
    var predDiv = document.getElementById('predTable');
    predDiv.innerHTML = '';
    var allDists = ['5', '10', '21.0975', '42.195'];
    allDists.forEach(function(dKey) {
      var dk = parseFloat(dKey);
      var pt = riegelPredict(t1, d1, dk);
      var row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML = '<div class="result-item"><div class="result-label">' + distances[dKey].name + '</div><div class="result-value" style="font-size:1.1rem">' + formatTime(pt) + '</div></div>';
      predDiv.appendChild(row);
    });

    document.getElementById('result').classList.add('visible');
    document.getElementById('allPredictions').style.display = '';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
