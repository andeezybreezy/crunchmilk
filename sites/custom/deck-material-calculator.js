(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var deckLength = parseFloat(document.getElementById('deckLength').value) || 0;
    var deckWidth = parseFloat(document.getElementById('deckWidth').value) || 0;
    var boardWidth = document.getElementById('boardWidth').value;
    var railing = document.getElementById('railing').value;
    var stairs = document.getElementById('stairs').value;

    // Calculation logic
    var area = deckLength * deckWidth; var bw = parseFloat(boardWidth); var gap = 0.125; var boardsPerFt = 12 / (bw + gap); var totalBoards = Math.ceil(deckLength * boardsPerFt); totalBoards = Math.ceil(totalBoards * 1.10); var numJoists = Math.ceil(deckLength / 1.333) + 1; var rimJoists = 2; var totalJoists = numJoists + rimJoists; var perimPosts = 2 * Math.ceil(deckLength / 8) + 2 * Math.ceil(deckWidth / 8); perimPosts = Math.max(perimPosts, 2); var railPerim = 0; if(railing === 'yes') { railPerim = deckLength + (deckWidth * 2); } var stairCount = parseInt(stairs) || 0; var stairStringers = stairCount > 0 ? 3 : 0; var stairBoards = stairCount * 2; var screwsPerBoard = Math.ceil(deckWidth / 1.33) * 2; var totalScrews = totalBoards * screwsPerBoard + (stairBoards * 6) + (railing === 'yes' ? railPerim * 4 : 0); var screwLbs = Math.ceil(totalScrews / 125); var costPT = (totalBoards * deckWidth * 0.65) + (totalJoists * deckWidth * 1.10) + (perimPosts * 12) + (railing === 'yes' ? railPerim * 8 : 0) + (stairStringers * 25) + (screwLbs * 12); var costComp = (totalBoards * deckWidth * 2.50) + (totalJoists * deckWidth * 1.10) + (perimPosts * 12) + (railing === 'yes' ? railPerim * 25 : 0) + (stairStringers * 25) + (screwLbs * 15); document.getElementById('deckBoards').textContent = totalBoards + ' boards (incl. 10% waste)'; document.getElementById('joists').textContent = totalJoists + ' joists (16" on center + rim)'; document.getElementById('posts').textContent = perimPosts + ' posts (8 ft on center)'; document.getElementById('railingFt').textContent = railing === 'yes' ? fmt(railPerim, 0) + ' linear feet (3 sides)' : 'None'; document.getElementById('screws').textContent = screwLbs + ' lbs (~' + totalScrews + ' screws)'; document.getElementById('costPT').textContent = dollar(costPT); document.getElementById('costComposite').textContent = dollar(costComp); document.getElementById('sqft').textContent = fmt(area, 0) + ' sq ft';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['deckLength', 'deckWidth', 'boardWidth', 'railing', 'stairs'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
