(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var sampleRate = document.getElementById('sampleRate').value;
    var bitDepth = document.getElementById('bitDepth').value;
    var channels = document.getElementById('channels').value;

    // Calculation logic
    var sr = parseInt(sampleRate);
    var bd = parseInt(bitDepth);
    var ch = parseInt(channels);
    var bytesPerSec = sr * (bd / 8) * ch;
    var wavBytes = bytesPerSec * duration;
    var wavMB = wavBytes / (1024 * 1024);
    var flacMB = wavMB * 0.55;
    var mp3MB = (320 * 1000 / 8) * duration / (1024 * 1024) * (ch > 1 ? 1 : 0.5);
    var bitrateKbps = bytesPerSec * 8 / 1000;
    var mins = Math.floor(duration / 60);
    var secs = duration % 60;
    document.getElementById('wavSize').textContent = fmt(wavMB, 1) + ' MB';
    document.getElementById('flacSize').textContent = fmt(flacMB, 1) + ' MB (~55% of WAV)';
    document.getElementById('mp3Size').textContent = fmt(mp3MB, 1) + ' MB';
    document.getElementById('bitrate').textContent = fmt(bitrateKbps, 0) + ' kbps (' + fmt(bitrateKbps / 1000, 1) + ' Mbps)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['duration', 'sampleRate', 'bitDepth', 'channels'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
