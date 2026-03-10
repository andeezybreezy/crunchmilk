(function() {
  'use strict';

  var taps = [];

  // Tap tempo
  function handleTap() {
    var now = Date.now();
    if (taps.length > 0 && (now - taps[taps.length - 1]) > 3000) {
      taps = [];
    }
    taps.push(now);

    if (taps.length >= 2) {
      var intervals = [];
      for (var i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      var avg = intervals.reduce(function(a, b) { return a + b; }, 0) / intervals.length;
      var bpm = Math.round(60000 / avg);
      document.getElementById('bpmInput').value = bpm;
      calculate();
    }
  }

  document.getElementById('tapBtn').addEventListener('click', handleTap);
  document.getElementById('resetTap').addEventListener('click', function() {
    taps = [];
  });

  // Allow spacebar for tap
  document.addEventListener('keydown', function(e) {
    if ((e.key === ' ' || e.key === 'Spacebar') && document.activeElement.id !== 'bpmInput') {
      e.preventDefault();
      handleTap();
    }
  });

  var noteValues = [
    { name: 'Whole Note', multiplier: 4 },
    { name: 'Half Note', multiplier: 2 },
    { name: 'Quarter Note', multiplier: 1 },
    { name: 'Eighth Note', multiplier: 0.5 },
    { name: 'Sixteenth Note', multiplier: 0.25 },
    { name: 'Thirty-Second Note', multiplier: 0.125 }
  ];

  function calculate() {
    var bpm = parseFloat(document.getElementById('bpmInput').value);
    if (isNaN(bpm) || bpm <= 0) return;

    var quarterMs = 60000 / bpm;

    document.getElementById('bpmDisplay').textContent = Math.round(bpm) + ' BPM';
    document.getElementById('quarterMs').textContent = quarterMs.toFixed(1) + ' ms';

    // Build delay table
    var tbody = document.getElementById('delayTableBody');
    tbody.innerHTML = '';

    for (var i = 0; i < noteValues.length; i++) {
      var nv = noteValues[i];
      var normal = quarterMs * nv.multiplier;
      var dotted = normal * 1.5;
      var triplet = normal * (2 / 3);

      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + nv.name + '</td>' +
        '<td>' + normal.toFixed(1) + '</td>' +
        '<td>' + dotted.toFixed(1) + '</td>' +
        '<td>' + triplet.toFixed(1) + '</td>';
      tbody.appendChild(tr);
    }

    document.getElementById('delayTable').style.display = '';

    var tip = 'Popular choices: dotted 8th = ' + (quarterMs * 0.5 * 1.5).toFixed(0) + 'ms (rhythmic bounce), triplet 16th = ' + (quarterMs * 0.25 * (2 / 3)).toFixed(0) + 'ms (rapid flutter).';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('bpmInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
})();
