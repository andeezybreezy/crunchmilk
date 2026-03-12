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
    var height = parseFloat(document.getElementById('height').value) || 0;
    var actualWeight = parseFloat(document.getElementById('actualWeight').value) || 0;
    var carrier = document.getElementById('carrier').value;

    // Calculation logic
    var factor = parseInt(carrier);
    var dimWeight;
    if (factor >= 5000) {
      var cmL = length * 2.54;
      var cmW = width * 2.54;
      var cmH = height * 2.54;
      dimWeight = (cmL * cmW * cmH) / factor;
      dimWeight = dimWeight * 2.20462;
    } else {
      dimWeight = (length * width * height) / factor;
    }
    var billable = Math.max(dimWeight, actualWeight);
    var cubicIn = length * width * height;
    var cubicFt = cubicIn / 1728;
    var suggestion;
    if (dimWeight > actualWeight * 1.5) suggestion = 'Box is oversized for contents. Reduce box size to save on shipping.';
    else if (dimWeight > actualWeight) suggestion = 'Volumetric weight applies. Consider a slightly smaller box.';
    else suggestion = 'Actual weight applies. Box size is appropriate.';
    document.getElementById('dimWeight').textContent = fmt(dimWeight, 1) + ' lbs (DIM)';
    document.getElementById('billableWeight').textContent = fmt(billable, 1) + ' lbs (' + (billable === dimWeight ? 'DIM weight used' : 'actual weight used') + ')';
    document.getElementById('cubicFt').textContent = fmt(cubicFt, 2) + ' cu ft (' + fmt(cubicIn, 0) + ' cu in)';
    document.getElementById('savings').textContent = suggestion;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height', 'actualWeight', 'carrier'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
