(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var modelSize = document.getElementById('modelSize').value;
    var gpuType = document.getElementById('gpuType').value;
    var trainingType = document.getElementById('trainingType').value;
    var datasetSize = parseFloat(document.getElementById('datasetSize').value) || 0;

    // Calculation logic
    var params = parseFloat(modelSize);
    var gpuRate = parseFloat(gpuType);
    var tokens = datasetSize * 1e6;
    var flopsPerToken, gpuFlops, memPerParam;
    if (trainingType === 'finetune') {
      flopsPerToken = params * 1e9 * 2;
      memPerParam = 2;
    } else if (trainingType === 'full') {
      flopsPerToken = params * 1e9 * 6;
      memPerParam = 16;
    } else {
      flopsPerToken = params * 1e9 * 6;
      memPerParam = 16;
      tokens = tokens * 10;
    }
    var totalFlops = flopsPerToken * tokens;
    var gpuTflops = gpuRate <= 2 ? 312e12 : gpuRate <= 4 ? 312e12 : 989e12;
    var effectiveUtil = 0.4;
    var gpuSeconds = totalFlops / (gpuTflops * effectiveUtil);
    var gpuHrs = gpuSeconds / 3600;
    var memNeeded = params * memPerParam;
    var gpuMem = gpuRate <= 2 ? 40 : gpuRate <= 4 ? 80 : 80;
    var numGPU = Math.max(1, Math.ceil(memNeeded / gpuMem));
    var wallHrs = gpuHrs / numGPU;
    var cost = gpuHrs * gpuRate;
    document.getElementById('gpuHours').textContent = fmt(gpuHrs, 1) + ' GPU-hours';
    document.getElementById('numGPUs').textContent = numGPU + ' GPU(s) minimum';
    document.getElementById('totalCost').textContent = dollar(cost);
    document.getElementById('wallTime').textContent = wallHrs >= 24 ? fmt(wallHrs / 24, 1) + ' days' : fmt(wallHrs, 1) + ' hours';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['modelSize', 'gpuType', 'trainingType', 'datasetSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
