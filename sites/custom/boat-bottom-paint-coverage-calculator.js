(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var loa = parseFloat(document.getElementById('loa').value) || 0;
    var beam = parseFloat(document.getElementById('beam').value) || 0;
    var draft = parseFloat(document.getElementById('draft').value) || 0;
    var coats = parseFloat(document.getElementById('coats').value) || 0;

    // Calculation logic
    var sqft = loa * (beam + draft) * 0.85; var gallons = Math.ceil((sqft * coats) / 400); var cost = gallons * 180;     document.getElementById('sqft').textContent = fmt(sqft,0);
    document.getElementById('gallons').textContent = fmt(gallons,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['loa', 'beam', 'draft', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
