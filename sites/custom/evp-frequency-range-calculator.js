(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sampleRate = document.getElementById('sampleRate').value;
    var peakFreq = parseFloat(document.getElementById('peakFreq').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;

    // Calculation logic
    var nyquist = parseFloat(sampleRate) * 1000 / 2; var range = peakFreq < 300 ? 'Low frequency (unusual for voice)' : peakFreq < 1000 ? 'Low voice range' : peakFreq < 3000 ? 'Normal voice range' : 'High frequency (unusual)'; var classification = duration > 2 ? 'Extended vocalization' : duration > 0.5 ? 'Word/phrase length' : 'Brief burst';     document.getElementById('range').textContent = range;
    document.getElementById('classification').textContent = classification;
    document.getElementById('nyquist').textContent = fmt(nyquist,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sampleRate', 'peakFreq', 'duration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
