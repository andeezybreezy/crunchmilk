(function() {
  'use strict';

  var chartData = [
    ['13"', '25.6 mph', '28.8 mph', '32.0 mph', '35.2 mph'],
    ['15"', '29.6 mph', '33.3 mph', '37.0 mph', '40.6 mph'],
    ['17"', '33.5 mph', '37.7 mph', '41.9 mph', '46.1 mph'],
    ['19"', '37.5 mph', '42.1 mph', '46.8 mph', '51.5 mph'],
    ['21"', '41.4 mph', '46.6 mph', '51.8 mph', '56.9 mph'],
    ['23"', '45.4 mph', '51.0 mph', '56.7 mph', '62.4 mph'],
    ['25"', '49.3 mph', '55.5 mph', '61.6 mph', '67.8 mph']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var rpm = parseFloat(document.getElementById('rpm').value);
    var gearRatio = parseFloat(document.getElementById('gearRatio').value);
    var pitch = parseFloat(document.getElementById('pitch').value);
    var actualSpeed = parseFloat(document.getElementById('actualSpeed').value);

    if (isNaN(rpm) || isNaN(gearRatio) || isNaN(pitch) || rpm <= 0 || gearRatio <= 0 || pitch <= 0) return;

    var propRpm = rpm / gearRatio;
    // Theoretical speed: propRpm * pitch (inches/rev) / 1056 = mph
    // 1056 = 12 inches/ft * 5280 ft/mile / 60 min/hr ... wait
    // inches/min to mph: divide by (5280*12/60) = 1056
    var theoSpeedMph = (propRpm * pitch) / 1056;
    var theoKnots = theoSpeedMph * 0.868976;

    var slip = '';
    if (!isNaN(actualSpeed) && actualSpeed >= 0 && theoSpeedMph > 0) {
      var slipPct = ((theoSpeedMph - actualSpeed) / theoSpeedMph) * 100;
      slip = slipPct.toFixed(1) + '%';
    } else {
      slip = 'Enter actual speed';
    }

    document.getElementById('theoSpeed').textContent = theoSpeedMph.toFixed(1) + ' mph';
    document.getElementById('propSlip').textContent = slip;
    document.getElementById('propRpm').textContent = Math.round(propRpm).toLocaleString() + ' RPM';
    document.getElementById('theoKnots').textContent = theoKnots.toFixed(1) + ' kn';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['rpm', 'gearRatio', 'pitch', 'actualSpeed'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
