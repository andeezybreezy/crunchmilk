(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;
    var inequalityType = document.getElementById('inequalityType').value;

    // Calculation logic
    var iq=document.getElementById('inequalityType').value;if(a===0){var lhs=b;var res;if(iq==='lt')res=lhs<c;else if(iq==='gt')res=lhs>c;else if(iq==='lte')res=lhs<=c;else res=lhs>=c;document.getElementById('solution').textContent=res?'All real numbers':'No solution';document.getElementById('intervalNotation').textContent=res?'(-∞, ∞)':'∅';}else{var val=(c-b)/a;var flip=a<0;var sym;if(flip){if(iq==='lt')sym='>';else if(iq==='gt')sym='<';else if(iq==='lte')sym='≥';else sym='≤';}else{if(iq==='lt')sym='<';else if(iq==='gt')sym='>';else if(iq==='lte')sym='≤';else sym='≥';}document.getElementById('solution').textContent='x '+sym+' '+fmt(val,4);if(sym==='<')document.getElementById('intervalNotation').textContent='(-∞, '+fmt(val,4)+')';else if(sym==='>')document.getElementById('intervalNotation').textContent='('+fmt(val,4)+', ∞)';else if(sym==='≤')document.getElementById('intervalNotation').textContent='(-∞, '+fmt(val,4)+']';else document.getElementById('intervalNotation').textContent='['+fmt(val,4)+', ∞)';}

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
