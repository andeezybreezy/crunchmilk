(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sweepSpeed = parseFloat(document.getElementById('sweepSpeed').value) || 0;
    var channelRange = parseFloat(document.getElementById('channelRange').value) || 0;
    var bandType = document.getElementById('bandType').value;

    // Calculation logic
    var fullSweep = (sweepSpeed * channelRange) / 1000; var sweepsPerMinute = 60 / fullSweep; var recommendation = sweepSpeed < 75 ? 'Very fast - may miss responses' : sweepSpeed <= 150 ? 'Good balance of speed and clarity' : 'Slow sweep - easier to analyze but fewer passes';     document.getElementById('fullSweep').textContent = fmt(fullSweep,1);
    document.getElementById('sweepsPerMinute').textContent = fmt(sweepsPerMinute,1);
    document.getElementById('recommendation').textContent = recommendation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sweepSpeed', 'channelRange', 'bandType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
