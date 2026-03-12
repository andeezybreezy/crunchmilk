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
    var surfaceType = document.getElementById('surfaceType').value;

    // Calculation logic
    var vol = length * width * height;
    var sa = 2 * (length * width + length * height + width * height);
    var alpha = parseFloat(surfaceType);
    var absorption = sa * alpha;
    var rt60 = 0.049 * vol / absorption;
    var rec = rt60 < 0.3 ? 'Very dry — good for recording/podcasting' : (rt60 < 0.6 ? 'Good for mixing/control rooms' : (rt60 < 1.0 ? 'Good for live music/rehearsal' : (rt60 < 2.0 ? 'Concert hall territory' : 'Very reverberant — cathedral-like')));
    document.getElementById('rt60').textContent = fmt(rt60, 2) + ' seconds';
    document.getElementById('volume').textContent = fmt(vol, 0) + ' cu ft (' + fmt(vol * 0.0283, 1) + ' cu m)';
    document.getElementById('surfaceArea').textContent = fmt(sa, 0) + ' sq ft';
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height', 'surfaceType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
