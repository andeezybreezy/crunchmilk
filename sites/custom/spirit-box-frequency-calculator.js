(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sweepRate = parseFloat(document.getElementById('sweepRate').value) || 0;
    var startFreq = parseFloat(document.getElementById('startFreq').value) || 0;
    var endFreq = parseFloat(document.getElementById('endFreq').value) || 0;
    var channelSpacing = parseFloat(document.getElementById('channelSpacing').value) || 0;
    var sessionMinutes = parseFloat(document.getElementById('sessionMinutes').value) || 0;

    // Calculation logic
    var range = endFreq - startFreq;
    var channels = Math.floor(range / channelSpacing);
    var sweepTimeMs = channels * sweepRate;
    var sweepTimeSec = sweepTimeMs / 1000;
    var sessionMs = sessionMinutes * 60 * 1000;
    var sweepsPerSession = Math.floor(sessionMs / sweepTimeMs);
    var syllableMs = 250;
    var channelsPerSyllable = Math.floor(syllableMs / sweepRate);
    document.getElementById('totalChannels').textContent = fmt(channels, 0) + ' channels in ' + fmt(range, 1) + ' MHz range';
    document.getElementById('fullSweepTime').textContent = fmt(sweepTimeSec, 1) + ' seconds per full sweep';
    document.getElementById('sweepsPerSession').textContent = fmt(sweepsPerSession, 0) + ' complete sweeps in ' + sessionMinutes + ' min';
    document.getElementById('responseWindow').textContent = sweepRate + 'ms per channel (' + channelsPerSyllable + ' channels per syllable at ' + syllableMs + 'ms/syllable)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sweepRate', 'startFreq', 'endFreq', 'channelSpacing', 'sessionMinutes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
