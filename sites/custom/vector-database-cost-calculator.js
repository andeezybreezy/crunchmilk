(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var documents = parseFloat(document.getElementById('documents').value) || 0;
    var avgChunkSize = parseFloat(document.getElementById('avgChunkSize').value) || 0;
    var dimensions = parseFloat(document.getElementById('dimensions').value) || 0;
    var queriesPerDay = parseFloat(document.getElementById('queriesPerDay').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var chunksPerDoc=3; var totalChunks=documents*chunksPerDoc; var bytesPerVector=dimensions*4; var storageMB=(totalChunks*bytesPerVector)/(1024*1024); var embeddingTokens=totalChunks*avgChunkSize; var embeddingCost=(embeddingTokens/1000000)*0.02; var queryTokens=queriesPerDay*days*avgChunkSize; var queryCost=(queryTokens/1000000)*0.02; var hostingEst=storageMB>1000?79:storageMB>100?25:7; var totalMonthly=queryCost+hostingEst; return {totalChunks:fmt(totalChunks,0), storageMB:fmt(storageMB,1)+' MB', embeddingCost:dollar(embeddingCost)+' (one-time)', queryCost:dollar(queryCost), totalMonthly:dollar(totalMonthly)+' (incl. hosting est.)'};

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
