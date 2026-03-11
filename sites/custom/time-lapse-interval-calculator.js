(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var eventDuration = parseFloat(document.getElementById('eventDuration').value) || 0;
    var clipLength = parseFloat(document.getElementById('clipLength').value) || 0;
    var fps = parseFloat(document.getElementById('fps').value) || 0;

    // Calculation logic
    var totalFrames = clipLength * fps; var eventSeconds = eventDuration * 60; var interval = eventSeconds / totalFrames; var storageGB = totalFrames * 25 / 1024;     document.getElementById('totalFrames').textContent = fmt(totalFrames,0);
    document.getElementById('interval').textContent = fmt(interval,1);
    document.getElementById('storageGB').textContent = fmt(storageGB,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['eventDuration', 'clipLength', 'fps'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
