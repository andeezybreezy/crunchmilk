(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var songs = parseFloat(document.getElementById('songs').value) || 0;
    var avgLength = parseFloat(document.getElementById('avgLength').value) || 0;
    var betweenSongs = parseFloat(document.getElementById('betweenSongs').value) || 0;
    var banter = parseFloat(document.getElementById('banter').value) || 0;

    // Calculation logic
    var musicTime=songs*avgLength; var betweenTotal=((songs-1)*betweenSongs)/60; var totalMin=musicTime+betweenTotal+banter; var hours=Math.floor(totalMin/60); var mins=Math.round(totalMin%60); var setsNeeded=Math.ceil(180/totalMin); return {totalTime:hours+'h '+mins+'m', musicTime:fmt(musicTime,0)+' min', deadTime:fmt(betweenTotal+banter,1)+' min', sets:setsNeeded+' sets (with breaks)'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['songs', 'avgLength', 'betweenSongs', 'banter'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
