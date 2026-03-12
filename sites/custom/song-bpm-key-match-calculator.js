(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentKey = document.getElementById('currentKey').value;
    var currentBpm = parseFloat(document.getElementById('currentBpm').value) || 0;
    var bpmRange = parseFloat(document.getElementById('bpmRange').value) || 0;

    // Calculation logic
    var camelot = {'C Major':'8B','C# Major':'3B','D Major':'10B','D# Major':'5B','E Major':'12B','F Major':'7B','F# Major':'2B','G Major':'9B','G# Major':'4B','A Major':'11B','A# Major':'6B','B Major':'1B','A Minor':'8A','A# Minor':'3A','B Minor':'10A','C Minor':'5A','C# Minor':'12A','D Minor':'7A','D# Minor':'2A','E Minor':'9A','F Minor':'4A','F# Minor':'11A','G Minor':'6A','G# Minor':'1A'}; var code = camelot[currentKey] || '8B'; var num = parseInt(code); var letter = code.slice(-1); var up = ((num % 12) + 1) || 12; var down = ((num - 2 + 12) % 12) + 1; var otherLetter = letter === 'A' ? 'B' : 'A'; var rev = {}; for (var k in camelot) { rev[camelot[k]] = k; } var compatible = [rev[num + letter], rev[up + letter], rev[down + letter], rev[num + otherLetter]].filter(function(v){return v;}); var bpmLow = Math.round(currentBpm * (1 - bpmRange / 100)); var bpmHigh = Math.round(currentBpm * (1 + bpmRange / 100)); var halfDouble = Math.round(currentBpm / 2) + ' / ' + Math.round(currentBpm * 2);     document.getElementById('compatibleKeys').textContent = compatible.join(', ');
    document.getElementById('bpmLow').textContent = fmt(bpmLow, 0);
    document.getElementById('bpmHigh').textContent = fmt(bpmHigh, 0);
    document.getElementById('halfDouble').textContent = halfDouble;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentKey', 'currentBpm', 'bpmRange'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
