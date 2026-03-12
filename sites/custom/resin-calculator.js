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
    var mixRatio = document.getElementById('mixRatio').value;

    // Calculation logic
    var vol = length * width * depth; var oz = vol * 0.554; if (mixRatio === '1:1') { var partA = oz / 2; var partB = oz / 2; } else { var partA = oz * 2 / 3; var partB = oz / 3; } var cost = oz * 0.75; document.getElementById('totalOz').textContent = fmt(oz, 1) + ' fl oz (' + fmt(oz / 128, 2) + ' gal)'; document.getElementById('resinPart').textContent = fmt(partA, 1) + ' fl oz'; document.getElementById('hardenerPart').textContent = fmt(partB, 1) + ' fl oz'; document.getElementById('cost').textContent = dollar(cost) + ' (at ~$0.75/oz)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'depth', 'mixRatio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
