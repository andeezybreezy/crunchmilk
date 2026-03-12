(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var documents = parseFloat(document.getElementById('documents').value) || 0;
    var avgChunkSize = parseFloat(document.getElementById('avgChunkSize').value) || 0;
    var dimensions = parseFloat(document.getElementById('dimensions').value) || 0;
    var queriesPerDay = parseFloat(document.getElementById('queriesPerDay').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var chunksPerDoc=3; var totalChunks=documents*chunksPerDoc; var bytesPerVector=dimensions*4; var storageMB=(totalChunks*bytesPerVector)/(1024*1024); var embeddingTokens=totalChunks*avgChunkSize; var embeddingCost=(embeddingTokens/1000000)*0.02; var queryTokens=queriesPerDay*days*avgChunkSize; var queryCost=(queryTokens/1000000)*0.02; var hostingEst=storageMB>1000?79:storageMB>100?25:7; var totalMonthly=queryCost+hostingEst;     document.getElementById('totalChunks').textContent = fmt(totalChunks,0);
    document.getElementById('storageMB').textContent = fmt(storageMB,1)+' MB';
    document.getElementById('embeddingCost').textContent = dollar(embeddingCost)+' (one-time)';
    document.getElementById('queryCost').textContent = dollar(queryCost);
    document.getElementById('totalMonthly').textContent = dollar(totalMonthly)+' (incl. hosting est.)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['documents', 'avgChunkSize', 'dimensions', 'queriesPerDay', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
