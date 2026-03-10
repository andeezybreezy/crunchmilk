(function() {
  'use strict';

  // Circle of confusion by sensor size (mm)
  var cocValues = {
    ff: 0.03,
    apsc: 0.02,
    mft: 0.015
  };

  var distUnit = 'ft';

  // Unit toggle
  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      distUnit = btn.dataset.unit;
    });
  });

  function formatDist(mm) {
    if (distUnit === 'ft') {
      var ft = mm / 304.8;
      if (ft > 9999) return '\u221E (infinity)';
      return ft.toFixed(2) + ' ft';
    } else {
      var m = mm / 1000;
      if (m > 9999) return '\u221E (infinity)';
      return m.toFixed(2) + ' m';
    }
  }

  function calculate() {
    var focalLength = parseFloat(document.getElementById('focalLength').value);
    var aperture = parseFloat(document.getElementById('aperture').value);
    var distance = parseFloat(document.getElementById('distance').value);
    var sensor = document.getElementById('sensorSize').value;

    if (isNaN(focalLength) || isNaN(aperture) || isNaN(distance) || focalLength <= 0 || aperture <= 0 || distance <= 0) return;

    var coc = cocValues[sensor];
    var f = focalLength; // mm
    var N = aperture;

    // Convert distance to mm
    var s;
    if (distUnit === 'ft') {
      s = distance * 304.8;
    } else {
      s = distance * 1000;
    }

    // Hyperfocal distance (mm): H = f^2 / (N * c) + f
    var H = (f * f) / (N * coc) + f;

    // Near focus limit (mm): Dn = s * (H - f) / (H + s - 2*f)
    var Dn = (s * (H - f)) / (H + s - 2 * f);

    // Far focus limit (mm): Df = s * (H - f) / (H - s)
    var Df;
    if (s >= H) {
      Df = Infinity;
    } else {
      Df = (s * (H - f)) / (H - s);
    }

    // Total DoF
    var totalDof;
    if (Df === Infinity) {
      totalDof = Infinity;
    } else {
      totalDof = Df - Dn;
    }

    document.getElementById('totalDof').textContent = totalDof === Infinity ? '\u221E (infinity)' : formatDist(totalDof);
    document.getElementById('hyperfocal').textContent = formatDist(H);
    document.getElementById('nearFocus').textContent = formatDist(Dn);
    document.getElementById('farFocus').textContent = Df === Infinity ? '\u221E (infinity)' : formatDist(Df);

    var tip = '';
    if (s >= H) {
      tip = 'Subject is at or beyond hyperfocal distance — everything from ' + formatDist(Dn) + ' to infinity is in focus.';
    } else {
      var pctInFront = (((s - Dn) / totalDof) * 100).toFixed(0);
      tip = 'About ' + pctInFront + '% of the DoF is in front of the subject, ' + (100 - pctInFront) + '% behind.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('#focalLength, #distance');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
