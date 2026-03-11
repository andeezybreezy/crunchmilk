(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var bitrate = document.getElementById('bitrate').value;
    var format = document.getElementById('format').value;

    // Calculation logic
    var bitrates = {'64 (mono speech)': 64, '96 (mono music)': 96, '128 (stereo standard)': 128, '192 (stereo high)': 192, '320 (stereo max)': 320}; var br = bitrates[bitrate] || 128; if (format === 'WAV (uncompressed)') br = 1411; if (format === 'AAC') br = br * 0.8; var fileSize = (br * duration * 60) / 8 / 1024; var bandwidth = fileSize * 1000 / 1024; return {fileSize: fmt(fileSize,1), bandwidth: fmt(bandwidth,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['duration', 'bitrate', 'format'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
