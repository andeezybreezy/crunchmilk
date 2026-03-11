(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var printWidth = parseFloat(document.getElementById('printWidth').value) || 0;
    var printHeight = parseFloat(document.getElementById('printHeight').value) || 0;
    var dpi = parseFloat(document.getElementById('dpi').value) || 0;

    // Calculation logic
    var pixelWidth = printWidth * dpi; var pixelHeight = printHeight * dpi; var megapixels = (pixelWidth * pixelHeight) / 1000000; return {megapixels: fmt(megapixels,1), pixelWidth: fmt(pixelWidth,0), pixelHeight: fmt(pixelHeight,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['printWidth', 'printHeight', 'dpi'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
