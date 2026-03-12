(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var opening = parseFloat(document.getElementById('opening').value) || 0;
    var application = document.getElementById('application').value;

    // Calculation logic
    var addInches = {'Dress (center back)': 1, 'Skirt (side)': 0.5, 'Pants (fly)': 0.5, 'Jacket (separating)': 0, 'Bag/Pouch': -1, 'Pillow': -2}; var types = {'Dress (center back)': 'Invisible zipper', 'Skirt (side)': 'Invisible zipper', 'Pants (fly)': 'Metal jean zipper', 'Jacket (separating)': 'Separating zipper', 'Bag/Pouch': 'Nylon coil', 'Pillow': 'Nylon coil'}; var zipperLength = opening + (addInches[application] || 0); var type = types[application] || 'Standard';     document.getElementById('zipperLength').textContent = fmt(zipperLength,1);
    document.getElementById('type').textContent = type;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['opening', 'application'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
