(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var multiplier = parseFloat(document.getElementById('multiplier').value) || 0;
    var term1 = parseFloat(document.getElementById('term1').value) || 0;
    var term2 = parseFloat(document.getElementById('term2').value) || 0;

    // Calculation logic
    var a=parseFloat(multiplier),b=parseFloat(term1),c=parseFloat(term2);var ab=a*b,ac=a*c;var total=ab+ac;document.getElementById('expanded').textContent=a+'('+b+' + '+c+') = '+a+' × '+b+' + '+a+' × '+c+' = '+ab+' + '+ac;document.getElementById('simplified').textContent=ab+' + '+ac+' = '+total;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['multiplier', 'term1', 'term2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
