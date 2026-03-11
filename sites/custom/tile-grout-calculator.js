(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var areaLength = parseFloat(document.getElementById('areaLength').value) || 0;
    var areaWidth = parseFloat(document.getElementById('areaWidth').value) || 0;
    var tileSize = document.getElementById('tileSize').value;
    var wastePct = parseFloat(document.getElementById('wastePct').value) || 0;

    // Calculation logic
    var area=areaLength*areaWidth; var tileSizeIn=parseInt(tileSize); var tilesPerSqFt=144/(tileSizeIn*tileSizeIn); var tilesNeeded=Math.ceil(area*tilesPerSqFt*(1+wastePct/100)); var boxes=Math.ceil(tilesNeeded/10); var groutLbs=Math.ceil(area*0.5); return {areaSqFt:fmt(area,0)+' sq ft', tiles:tilesNeeded+' tiles', boxes:boxes+' boxes', groutLbs:groutLbs+' lbs'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['areaLength', 'areaWidth', 'tileSize', 'wastePct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
