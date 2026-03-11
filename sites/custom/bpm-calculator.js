(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bpm = parseFloat(document.getElementById('bpm').value) || 0;
    var timeSignature = document.getElementById('timeSignature').value;

    // Calculation logic
    var msPerBeat=60000/bpm; var beatsPerBar=parseInt(timeSignature); var msPerBar=msPerBeat*beatsPerBar; var barsPerMin=60000/msPerBar; var beatsPerSec=bpm/60; return {bpmDisplay:bpm+' BPM', msPerBeat:fmt(msPerBeat,1)+' ms', msPerBar:fmt(msPerBar,1)+' ms', barsPerMin:fmt(barsPerMin,1), beatsPerSec:fmt(beatsPerSec,2)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bpm', 'timeSignature'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
