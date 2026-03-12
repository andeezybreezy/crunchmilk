(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var expression = parseFloat(document.getElementById('expression').value) || 0;
    var xValue = parseFloat(document.getElementById('xValue').value) || 0;

    // Calculation logic
    var expr=expression.trim();var xv=parseFloat(xValue);var substituted=expr.replace(/([0-9)])x/g,'$1*x').replace(/x([0-9(])/g,'x*$1').replace(/x/g,'('+xv+')');var safe=/^[0-9+\-*/().\s]+$/.test(substituted);if(!safe){document.getElementById('answer').textContent='Error: expression contains unsupported characters';return;}try{var result=new Function('return ('+substituted+')')();document.getElementById('answer').textContent='When x = '+xv+': '+expr+' = '+fmt(result,6);}catch(e){document.getElementById('answer').textContent='Error: could not evaluate expression';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['expression', 'xValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
