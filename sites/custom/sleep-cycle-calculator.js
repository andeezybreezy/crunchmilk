(function() {
  'use strict';

  var mode = 'wake';
  var CYCLE_MIN = 90;
  var FALL_ASLEEP_MIN = 14;

  document.querySelectorAll('[data-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-mode]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.mode;
      document.getElementById('wakeMode').style.display = mode === 'wake' ? '' : 'none';
      document.getElementById('sleepMode').style.display = mode === 'sleep' ? '' : 'none';
    });
  });

  function fmtTime12(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  function parseTimeInput(val) {
    var parts = val.split(':');
    var d = new Date();
    d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
    return d;
  }

  document.getElementById('calcBtn').addEventListener('click', function() {
    var results = [];

    if (mode === 'wake') {
      var wakeTime = parseTimeInput(document.getElementById('wakeTime').value);
      // Work backwards: 6, 5, 4 cycles
      [6, 5, 4].forEach(function(cycles) {
        var totalMin = cycles * CYCLE_MIN + FALL_ASLEEP_MIN;
        var bedTime = new Date(wakeTime.getTime() - totalMin * 60000);
        results.push({
          cycles: cycles,
          hours: (cycles * CYCLE_MIN / 60).toFixed(1),
          time: fmtTime12(bedTime),
          label: 'Go to bed at'
        });
      });
    } else {
      var bedTime = parseTimeInput(document.getElementById('bedTime').value);
      // Work forwards: 4, 5, 6 cycles
      [4, 5, 6].forEach(function(cycles) {
        var totalMin = cycles * CYCLE_MIN + FALL_ASLEEP_MIN;
        var wakeUp = new Date(bedTime.getTime() + totalMin * 60000);
        results.push({
          cycles: cycles,
          hours: (cycles * CYCLE_MIN / 60).toFixed(1),
          time: fmtTime12(wakeUp),
          label: 'Wake up at'
        });
      });
    }

    var html = '';
    results.forEach(function(r) {
      var quality = r.cycles >= 5 ? 'color:#059669;font-weight:600' : 'color:#d97706';
      html += '<div class="result-row" style="margin-bottom:0.5rem">';
      html += '<div class="result-item"><div class="result-label">' + r.label + '</div><div class="result-value">' + r.time + '</div></div>';
      html += '<div class="result-item"><div class="result-label">' + r.cycles + ' cycles (' + r.hours + ' hrs)</div><div class="result-value" style="' + quality + '">' + (r.cycles >= 5 ? 'Recommended' : 'Short') + '</div></div>';
      html += '</div>';
    });

    document.getElementById('sleepResults').innerHTML = html;
    document.getElementById('result').style.display = '';
  });
})();
