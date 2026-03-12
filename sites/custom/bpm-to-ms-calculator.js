(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bpm = parseFloat(document.getElementById('bpm').value) || 0;
    var noteType = document.getElementById('noteType').value;
    var modifier = document.getElementById('modifier').value;

    // Calculation logic
    var beatMs = 60000 / bpm;
    var noteVal = parseFloat(noteType);
    var mod = parseFloat(modifier);
    var ms = beatMs * noteVal * mod;
    var sec = ms / 1000;
    var freq = 1000 / ms;
    var quarter = beatMs;
    var eighth = quarter / 2;
    var sixteenth = quarter / 4;
    document.getElementById('msResult').textContent = fmt(ms, 1) + ' ms';
    document.getElementById('secondsResult').textContent = fmt(sec, 3) + ' s';
    document.getElementById('freqResult').textContent = fmt(freq, 2) + ' Hz';
    document.getElementById('allNotes').textContent = '1/4: ' + fmt(quarter, 0) + 'ms | 1/8: ' + fmt(eighth, 0) + 'ms | 1/16: ' + fmt(sixteenth, 0) + 'ms | 1/8d: ' + fmt(eighth * 1.5, 0) + 'ms | 1/8t: ' + fmt(eighth * 0.667, 0) + 'ms';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bpm', 'noteType', 'modifier'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
