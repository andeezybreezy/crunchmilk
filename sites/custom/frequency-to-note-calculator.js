(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var frequency = parseFloat(document.getElementById('frequency').value) || 0;

    // Calculation logic
    var noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']; var a4=440; var semitones=12*Math.log2(frequency/a4); var nearestSemitone=Math.round(semitones); var cents=Math.round((semitones-nearestSemitone)*100); var noteIdx=((nearestSemitone%12)+12+9)%12; var octave=Math.floor((nearestSemitone+9)/12)+4; var note=noteNames[noteIdx]; var exactFreq=a4*Math.pow(2,nearestSemitone/12);     document.getElementById('note').textContent = note+octave;
    document.getElementById('cents').textContent = (cents>=0?'+':'')+cents+' cents';
    document.getElementById('octave').textContent = 'Octave '+octave;
    document.getElementById('exactFreq').textContent = fmt(exactFreq,2)+' Hz';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['frequency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
