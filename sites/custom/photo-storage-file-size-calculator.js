(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var megapixels = parseFloat(document.getElementById('megapixels').value) || 0;
    var format = document.getElementById('format').value;
    var photos = parseFloat(document.getElementById('photos').value) || 0;

    // Calculation logic
    var sizeFactors = {'JPEG Fine': 0.35, 'JPEG Normal': 0.2, 'RAW': 1.5, 'RAW + JPEG': 1.85}; var factor = sizeFactors[format] || 0.35; var perPhoto = megapixels * factor; var totalGB = (perPhoto * photos) / 1024; var cards = Math.ceil(totalGB / 30);     document.getElementById('perPhoto').textContent = fmt(perPhoto,1);
    document.getElementById('totalGB').textContent = fmt(totalGB,1);
    document.getElementById('cards').textContent = fmt(cards,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['megapixels', 'format', 'photos'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
