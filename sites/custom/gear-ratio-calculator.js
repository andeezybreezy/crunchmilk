(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var transGear = val('transGear');
    var finalDrive = val('finalDrive');
    var tireDiam = val('tireDiam');
    var speed = val('vehicleSpeed');
    var engineTorque = val('engineTorque');

    if (transGear <= 0 || finalDrive <= 0 || tireDiam <= 0) return;

    var overallRatio = transGear * finalDrive;

    // RPM = (speed_mph * overall_ratio * 336) / tire_diameter_inches
    var rpm = (speed * overallRatio * 336) / tireDiam;

    // Wheel torque = engine torque * overall ratio
    var wheelTorqueLbFt = engineTorque * overallRatio;

    // Wheel force = wheel torque / tire radius in feet
    var tireRadiusFt = tireDiam / 2 / 12;
    var wheelForceLbs = wheelTorqueLbFt / tireRadiusFt;

    // Speed at 1000 RPM
    var speedAt1k = (1000 * tireDiam) / (overallRatio * 336);
    // Speed at 6500 RPM (redline)
    var speedAtRedline = (6500 * tireDiam) / (overallRatio * 336);

    document.getElementById('overallRatio').textContent = overallRatio.toFixed(3) + ':1';
    document.getElementById('rpmAtSpeed').textContent = Math.round(rpm).toLocaleString() + ' RPM';
    document.getElementById('wheelTorque').textContent = Math.round(wheelTorqueLbFt).toLocaleString() + ' lb-ft';
    document.getElementById('wheelForce').textContent = Math.round(wheelForceLbs).toLocaleString() + ' lbs';
    document.getElementById('speedAt1k').textContent = speedAt1k.toFixed(1) + ' mph';
    document.getElementById('speedAtRedline').textContent = speedAtRedline.toFixed(1) + ' mph';

    document.getElementById('resultTip').textContent =
      'Driveshaft turns ' + overallRatio.toFixed(2) + ' times per wheel revolution';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart dynamically
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var transGears = [0.63, 0.70, 0.75, 1.00, 1.50, 2.50];
    var labels = ['0.63 (6th OD)', '0.70 (5th OD)', '0.75 (4th OD)', '1.00 (3rd/Direct)', '1.50 (2nd)', '2.50 (1st)'];
    var axles = [3.08, 3.42, 3.73, 4.10];
    var tireDiam = 26.5;
    var speed = 60;

    transGears.forEach(function(tg, i) {
      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      td0.textContent = labels[i];
      tr.appendChild(td0);
      axles.forEach(function(axle) {
        var overall = tg * axle;
        var rpm = Math.round((speed * overall * 336) / tireDiam);
        var td = document.createElement('td');
        td.textContent = rpm.toLocaleString();
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
