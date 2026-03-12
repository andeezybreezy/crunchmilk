(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var firstTerm = parseFloat(document.getElementById('firstTerm').value) || 0;
    var commonRatio = parseFloat(document.getElementById('commonRatio').value) || 0;
    var n = parseFloat(document.getElementById('n').value) || 0;

    // Calculation logic
    var an=firstTerm*Math.pow(commonRatio,n-1);var s;if(commonRatio===1){s=firstTerm*n;}else{s=firstTerm*(1-Math.pow(commonRatio,n))/(1-commonRatio);}document.getElementById('nthTerm').textContent='a'+n+' = '+fmt(an, 2);document.getElementById('sum').textContent='S'+n+' = '+fmt(s, 2);document.getElementById('formula').textContent='aₙ = '+firstTerm+' · '+commonRatio+'^(n-1)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['firstTerm', 'commonRatio', 'n'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
