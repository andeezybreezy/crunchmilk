(function() {
  'use strict';

  // Known new moon reference: January 6, 2000 18:14 UTC
  var REF_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  var SYNODIC = 29.53059;

  // Set default date to today
  var dateInput = document.getElementById('dateInput');
  var today = new Date();
  dateInput.value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  function getMoonAge(date) {
    var diff = (date.getTime() - REF_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
    var age = diff % SYNODIC;
    if (age < 0) age += SYNODIC;
    return age;
  }

  function getPhaseName(age) {
    var p = age / SYNODIC;
    if (p < 0.0339) return 'New Moon';
    if (p < 0.25) return 'Waxing Crescent';
    if (p < 0.2839) return 'First Quarter';
    if (p < 0.5) return 'Waxing Gibbous';
    if (p < 0.5339) return 'Full Moon';
    if (p < 0.75) return 'Waning Gibbous';
    if (p < 0.7839) return 'Last Quarter';
    if (p < 0.9661) return 'Waning Crescent';
    return 'New Moon';
  }

  function getIllumination(age) {
    return (1 - Math.cos(2 * Math.PI * age / SYNODIC)) / 2 * 100;
  }

  function drawMoon(container, age) {
    container.innerHTML = '';
    var size = 120;
    var illum = getIllumination(age);
    var phase = age / SYNODIC;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 100 100');

    // Dark circle (moon background)
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '48');
    circle.setAttribute('fill', '#1a1a2e');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '1');
    svg.appendChild(circle);

    // Lit portion using path
    var sweep;
    var rx;

    if (phase <= 0.5) {
      // Waxing: lit on right
      rx = Math.abs(1 - 4 * phase) * 48;
      if (phase < 0.25) {
        // Less than half: right crescent
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 50 2 A 48 48 0 0 1 50 98 A ' + rx + ' 48 0 0 1 50 2');
        path.setAttribute('fill', '#e8e8d0');
        svg.appendChild(path);
      } else {
        // More than half: right gibbous
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 50 2 A 48 48 0 0 1 50 98 A ' + rx + ' 48 0 0 0 50 2');
        path.setAttribute('fill', '#e8e8d0');
        svg.appendChild(path);
      }
    } else {
      // Waning: lit on left
      rx = Math.abs(1 - 4 * (phase - 0.5)) * 48;
      if (phase < 0.75) {
        // More than half: left gibbous
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 50 2 A 48 48 0 0 0 50 98 A ' + rx + ' 48 0 0 0 50 2');
        path.setAttribute('fill', '#e8e8d0');
        svg.appendChild(path);
      } else {
        // Less than half: left crescent
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 50 2 A 48 48 0 0 0 50 98 A ' + rx + ' 48 0 0 1 50 2');
        path.setAttribute('fill', '#e8e8d0');
        svg.appendChild(path);
      }
    }

    container.appendChild(svg);
  }

  function calculate() {
    var val = document.getElementById('dateInput').value;
    if (!val) return;

    var parts = val.split('-');
    var date = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0));

    var age = getMoonAge(date);
    var phaseName = getPhaseName(age);
    var illum = getIllumination(age);

    // Days until full moon (age ~14.76)
    var fullAge = SYNODIC / 2;
    var daysToFull = fullAge - age;
    if (daysToFull < 0) daysToFull += SYNODIC;
    if (daysToFull > SYNODIC - 0.5) daysToFull = 0;

    // Days until new moon (age ~0 / 29.53)
    var daysToNew = SYNODIC - age;
    if (daysToNew > SYNODIC - 0.5) daysToNew = 0;

    document.getElementById('phaseName').textContent = phaseName;
    document.getElementById('illumination').textContent = illum.toFixed(1) + '%';
    document.getElementById('moonAge').textContent = age.toFixed(1) + ' days';
    document.getElementById('daysToFull').textContent = daysToFull < 0.5 ? 'Today!' : daysToFull.toFixed(1) + ' days';
    document.getElementById('daysToNew').textContent = daysToNew < 0.5 ? 'Today!' : daysToNew.toFixed(1) + ' days';

    drawMoon(document.getElementById('moonVisual'), age);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('dateInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

  // Auto-calculate on load
  calculate();
})();
