(function() {
  'use strict';

  var taps = [];
  var resetTimeout = null;

  function updateTapDisplay() {
    var count = taps.length;
    document.getElementById('tapCount').textContent = count;

    if (count < 2) {
      document.getElementById('bpmDisplay').textContent = '...';
      document.getElementById('msPerBeat').textContent = '—';
      document.getElementById('bps').textContent = '—';
      return;
    }

    // Calculate average interval from all taps
    var intervals = [];
    for (var i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1]);
    }
    var avgInterval = intervals.reduce(function(a, b) { return a + b; }, 0) / intervals.length;

    var bpm = 60000 / avgInterval;
    var msPerBeat = avgInterval;
    var bps = bpm / 60;

    document.getElementById('bpmDisplay').textContent = Math.round(bpm);
    document.getElementById('msPerBeat').textContent = Math.round(msPerBeat) + ' ms';
    document.getElementById('bps').textContent = bps.toFixed(2);
  }

  function handleTap() {
    var now = Date.now();

    // Reset if more than 3 seconds since last tap
    if (taps.length > 0 && (now - taps[taps.length - 1]) > 3000) {
      taps = [];
    }

    taps.push(now);
    updateTapDisplay();

    // Auto-reset after 3 seconds of no tapping
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(function() {
      // Don't reset, just stop — user can see last reading
    }, 3000);
  }

  function resetTaps() {
    taps = [];
    document.getElementById('tapCount').textContent = '0';
    document.getElementById('bpmDisplay').textContent = '—';
    document.getElementById('msPerBeat').textContent = '—';
    document.getElementById('bps').textContent = '—';
  }

  document.getElementById('tapBtn').addEventListener('click', handleTap);
  document.getElementById('resetBtn').addEventListener('click', resetTaps);

  // Allow spacebar and Enter to tap
  document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      // Don't tap if user is typing in the manual BPM field
      if (document.activeElement && document.activeElement.id === 'manualBpm') return;
      e.preventDefault();
      handleTap();
    }
  });

  // Manual BPM converter
  function convertManual() {
    var bpm = parseFloat(document.getElementById('manualBpm').value);
    if (isNaN(bpm) || bpm <= 0) return;

    var msPerBeat = 60000 / bpm;
    var bps = bpm / 60;
    var barsPerMin = bpm / 4;
    var secPerBar = (60 / bpm) * 4;

    document.getElementById('convMs').textContent = msPerBeat.toFixed(1) + ' ms';
    document.getElementById('convBps').textContent = bps.toFixed(2);
    document.getElementById('convBars').textContent = barsPerMin.toFixed(1);
    document.getElementById('convSecBar').textContent = secPerBar.toFixed(2) + ' sec';

    var tip = 'At ' + bpm + ' BPM: whole note = ' + (msPerBeat * 4).toFixed(0) + 'ms, eighth note = ' + (msPerBeat / 2).toFixed(0) + 'ms, sixteenth = ' + (msPerBeat / 4).toFixed(0) + 'ms.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('convertResult');
    resultEl.classList.add('visible');
  }

  document.getElementById('convertBtn').addEventListener('click', convertManual);
  document.getElementById('manualBpm').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') convertManual();
  });
})();
