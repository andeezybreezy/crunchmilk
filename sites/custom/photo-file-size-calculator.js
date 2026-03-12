(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var megapixels = parseFloat(document.getElementById('megapixels').value) || 0;
    var bitDepth = document.getElementById('bitDepth').value;
    var format = document.getElementById('format').value;
    var numPhotos = parseFloat(document.getElementById('numPhotos').value) || 0;

    // Calculation logic
    var bits = parseInt(bitDepth);
    var fmt2 = format;
    var pixels = megapixels * 1000000;
    var bytesPerPixel;
    if (fmt2 === 'rawUncomp') bytesPerPixel = bits * 3 / 8;
    else if (fmt2 === 'raw') bytesPerPixel = bits * 3 / 8 * 0.6;
    else if (fmt2 === 'jpeg_high') bytesPerPixel = 0.75;
    else if (fmt2 === 'jpeg_med') bytesPerPixel = 0.35;
    else if (fmt2 === 'tiff') bytesPerPixel = bits * 3 / 8;
    else bytesPerPixel = bits * 3 / 8 * 0.5;
    var fileSizeBytes = pixels * bytesPerPixel;
    var fileSizeMB = fileSizeBytes / (1024 * 1024);
    var totalMB = fileSizeMB * numPhotos;
    var totalGB = totalMB / 1024;
    var fitsOn64 = Math.floor(64 * 1024 / fileSizeMB);
    var sizeStr = fileSizeMB >= 1 ? fmt(fileSizeMB, 1) + ' MB' : fmt(fileSizeBytes / 1024, 0) + ' KB';
    var totalStr = totalGB >= 1 ? fmt(totalGB, 2) + ' GB' : fmt(totalMB, 0) + ' MB';
    document.getElementById('fileSize').textContent = sizeStr;
    document.getElementById('totalSize').textContent = totalStr;
    document.getElementById('cardsNeeded').textContent = fmt(fitsOn64, 0) + ' photos';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['megapixels', 'bitDepth', 'format', 'numPhotos'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
