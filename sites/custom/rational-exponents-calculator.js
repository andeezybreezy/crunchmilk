(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base = parseFloat(document.getElementById('base').value) || 0;
    var numerator = parseFloat(document.getElementById('numerator').value) || 0;
    var denominator = parseFloat(document.getElementById('denominator').value) || 0;

    // Calculation logic
    var decExp=numerator/denominator;var val=Math.pow(base,decExp);document.getElementById('decimalExponent').textContent=fmt(decExp, 2);document.getElementById('radicalForm').textContent='('+denominator+'√'+base+')^'+numerator;document.getElementById('answer').textContent=fmt(val, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base', 'numerator', 'denominator'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
