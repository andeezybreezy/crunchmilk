(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nozzleDia = parseFloat(document.getElementById('nozzleDia').value) || 0;
    var layerHeight = parseFloat(document.getElementById('layerHeight').value) || 0;
    var printSpeed = parseFloat(document.getElementById('printSpeed').value) || 0;
    var lineWidth = parseFloat(document.getElementById('lineWidth').value) || 0;

    // Calculation logic
    var flow = layerHeight * lineWidth * printSpeed;
    var maxFlow = 15;
    var maxSpd = maxFlow / (layerHeight * lineWidth);
    var filDia = 1.75;
    var filArea = Math.PI * Math.pow(filDia / 2, 2);
    var extRate = flow / filArea;
    document.getElementById('flowRate').textContent = fmt(flow, 2) + ' mm³/s';
    document.getElementById('maxSpeed').textContent = fmt(maxSpd, 0) + ' mm/s';
    document.getElementById('extrusionRate').textContent = fmt(extRate, 2) + ' mm/s';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nozzleDia', 'layerHeight', 'printSpeed', 'lineWidth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
