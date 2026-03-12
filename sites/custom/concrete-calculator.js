(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var shape = document.getElementById('shape').value;

    // Calculation logic
    var depthFt = depth / 12; var cf = 0; if(shape === 'tube') { var radius = width / 2; cf = Math.PI * radius * radius * length * depthFt; } else if(shape === 'column') { cf = length * width * (depth / 12); } else { cf = length * width * depthFt; } var cy = cf / 27; var cyWithWaste = cy * 1.10; var b40 = Math.ceil(cyWithWaste / 0.011); var b60 = Math.ceil(cyWithWaste / 0.017); var b80 = Math.ceil(cyWithWaste / 0.022); var totalWeight = cyWithWaste * 3700; var costBags = b80 * 6.50; var costReady = cyWithWaste * 165; document.getElementById('cubicFeet').textContent = fmt(cf, 2) + ' cu ft'; document.getElementById('cubicYards').textContent = fmt(cy, 2) + ' cu yd (+ 10% waste = ' + fmt(cyWithWaste, 2) + ')'; document.getElementById('bags40').textContent = b40 + ' bags'; document.getElementById('bags60').textContent = b60 + ' bags'; document.getElementById('bags80').textContent = b80 + ' bags'; document.getElementById('weight').textContent = fmt(totalWeight, 0) + ' lbs (' + fmt(totalWeight / 2000, 1) + ' tons)'; document.getElementById('cost').textContent = dollar(costBags) + ' (at $6.50/bag)'; document.getElementById('readyMix').textContent = dollar(costReady) + ' (at ~$165/cu yd delivered)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'depth', 'shape'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
