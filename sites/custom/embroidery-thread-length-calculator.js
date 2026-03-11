(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var stitches = parseFloat(document.getElementById('stitches').value) || 0;
    var fabric = document.getElementById('fabric').value;
    var strands = parseFloat(document.getElementById('strands').value) || 0;

    // Calculation logic
    var inchesPerStitch = {'14 count Aida': 0.14, '16 count Aida': 0.125, '18 count Aida': 0.11, '28 count linen': 0.07}; var ips = inchesPerStitch[fabric] || 0.14; var totalInches = stitches * ips * strands * 1.3; var lengthYards = totalInches / 36; var skeins = Math.ceil(lengthYards / 8.7);     document.getElementById('lengthYards').textContent = fmt(lengthYards,1);
    document.getElementById('skeins').textContent = fmt(skeins,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['stitches', 'fabric', 'strands'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
