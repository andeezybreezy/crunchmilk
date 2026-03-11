(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var snowType = document.getElementById('snowType').value;

    // Calculation logic
    var densities = {'Fresh/Fluffy (3 lb/sqft per ft)': 3, 'Settled (10 lb/sqft per ft)': 10, 'Packed/Wet (15 lb/sqft per ft)': 15, 'Ice Layer (57 lb/sqft per ft)': 57}; var density = densities[snowType] || 10; var psfLoad = (depth / 12) * density; var totalLoad = psfLoad * area; var warning = psfLoad > 30 ? 'DANGER: Exceeds most residential roof limits. Consider snow removal.' : psfLoad > 20 ? 'Heavy load - monitor closely' : 'Within typical limits'; return {psfLoad: fmt(psfLoad,1), totalLoad: fmt(totalLoad,0), warning: warning};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'depth', 'snowType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
