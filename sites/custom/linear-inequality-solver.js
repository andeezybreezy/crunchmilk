(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;
    var inequalityType = document.getElementById('inequalityType').value;

    // Calculation logic
    var iq=document.getElementById('inequalityType').value;if(a===0){var lhs=b;var res;if(iq==='lt')res=lhs<c;else if(iq==='gt')res=lhs>c;else if(iq==='lte')res=lhs<=c;else res=lhs>=c;document.getElementById('solution').textContent=res?'All real numbers':'No solution';document.getElementById('intervalNotation').textContent=res?'(-∞, ∞)':'∅';}else{var val=(c-b)/a;var flip=a<0;var sym;if(flip){if(iq==='lt')sym='>';else if(iq==='gt')sym='<';else if(iq==='lte')sym='≥';else sym='≤';}else{if(iq==='lt')sym='<';else if(iq==='gt')sym='>';else if(iq==='lte')sym='≤';else sym='≥';}document.getElementById('solution').textContent='x '+sym+' '+fmt(val, 2);if(sym==='<')document.getElementById('intervalNotation').textContent='(-∞, '+fmt(val, 2)+')';else if(sym==='>')document.getElementById('intervalNotation').textContent='('+fmt(val, 2)+', ∞)';else if(sym==='≤')document.getElementById('intervalNotation').textContent='(-∞, '+fmt(val, 2)+']';else document.getElementById('intervalNotation').textContent='['+fmt(val, 2)+', ∞)';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c', 'inequalityType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
