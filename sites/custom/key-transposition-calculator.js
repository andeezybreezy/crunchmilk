(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fromKey = document.getElementById('fromKey').value;
    var toKey = document.getElementById('toKey').value;

    // Calculation logic
    var notes=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']; var fromIdx=notes.indexOf(fromKey); var toIdx=notes.indexOf(toKey); var semitones=((toIdx-fromIdx)+12)%12; var chords=['I','ii','iii','IV','V','vi','vii']; var majorScale=[0,2,4,5,7,9,11]; var fromChords=majorScale.map(function(s){return notes[(fromIdx+s)%12];}); var toChords=majorScale.map(function(s){return notes[(toIdx+s)%12];}); var mapping=fromChords.map(function(c,i){return c+' -> '+toChords[i];}).join(', '); var capo=(12-semitones)%12; return {semitones:'+'+semitones+' semitones', chordMap:mapping, capo:capo===0?'No capo needed':'Capo fret '+capo+' (play in '+fromKey+' shapes)'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fromKey', 'toKey'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
