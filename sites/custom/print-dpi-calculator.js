(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pixelWidth = parseFloat(document.getElementById('pixelWidth').value) || 0;
    var pixelHeight = parseFloat(document.getElementById('pixelHeight').value) || 0;
    var targetDPI = document.getElementById('targetDPI').value;

    // Calculation logic
    var dpi = parseInt(targetDPI);
    var pw = pixelWidth / dpi;
    var ph = pixelHeight / dpi;
    var mp = (pixelWidth * pixelHeight) / 1000000;
    document.getElementById('printWidth').textContent = fmt(pw, 2) + '" (' + fmt(pw * 2.54, 1) + ' cm)';
    document.getElementById('printHeight').textContent = fmt(ph, 2) + '" (' + fmt(ph * 2.54, 1) + ' cm)';
    document.getElementById('megapixels').textContent = fmt(mp, 1) + ' MP';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pixelWidth', 'pixelHeight', 'targetDPI'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
