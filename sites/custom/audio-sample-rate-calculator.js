(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sampleRate = document.getElementById('sampleRate').value;
    var bitDepth = document.getElementById('bitDepth').value;
    var channels = document.getElementById('channels').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;

    // Calculation logic
    var sr = parseInt(sampleRate);
    var bd = parseInt(bitDepth);
    var ch = parseInt(channels);
    var bitsPerSec = sr * bd * ch;
    var bytesTotal = (bitsPerSec * duration) / 8;
    var maxFreq = sr / 2;
    var dynRange = bd * 6.02;
    document.getElementById('fileSize').textContent = bytesTotal > 1073741824 ? fmt(bytesTotal / 1073741824, 2) + ' GB' : fmt(bytesTotal / 1048576, 1) + ' MB';
    document.getElementById('bitrate').textContent = fmt(bitsPerSec / 1000, 0) + ' kbps (' + fmt(bitsPerSec / 1000000, 2) + ' Mbps)';
    document.getElementById('maxFreq').textContent = fmt(maxFreq / 1000, 2) + ' kHz (Nyquist limit)';
    document.getElementById('dynamicRange').textContent = fmt(dynRange, 0) + ' dB';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sampleRate', 'bitDepth', 'channels', 'duration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
