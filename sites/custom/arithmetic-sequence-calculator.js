(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var firstTerm = parseFloat(document.getElementById('firstTerm').value) || 0;
    var commonDifference = parseFloat(document.getElementById('commonDifference').value) || 0;
    var n = parseFloat(document.getElementById('n').value) || 0;

    // Calculation logic
    var an=firstTerm+(n-1)*commonDifference;var s=n*(firstTerm+an)/2;document.getElementById('nthTerm').textContent='a'+n+' = '+fmt(an, 2);document.getElementById('sum').textContent='S'+n+' = '+fmt(s, 2);document.getElementById('formula').textContent='aₙ = '+firstTerm+' + (n-1)·'+commonDifference;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['firstTerm', 'commonDifference', 'n'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
