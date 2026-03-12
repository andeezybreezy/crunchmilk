(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var firstTerm = parseFloat(document.getElementById('firstTerm').value) || 0;
    var commonDifference = parseFloat(document.getElementById('commonDifference').value) || 0;
    var n = parseFloat(document.getElementById('n').value) || 0;

    // Calculation logic
    var an=firstTerm+(n-1)*commonDifference;var s=n*(firstTerm+an)/2;document.getElementById('nthTerm').textContent='a'+n+' = '+fmt(an,4);document.getElementById('sum').textContent='S'+n+' = '+fmt(s,4);document.getElementById('formula').textContent='aₙ = '+firstTerm+' + (n-1)·'+commonDifference;

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
