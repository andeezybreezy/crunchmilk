(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var expression = parseFloat(document.getElementById('expression').value) || 0;

    // Calculation logic
    var expr=expression.trim();var safe=/^[0-9+\-*/().^\s]+$/.test(expr);if(!safe){document.getElementById('answer').textContent='Error: only numbers and operators (+, -, *, /, ^, parentheses) are allowed';return;}try{var jsExpr=expr.replace(/\^/g,'**');var result=new Function('return ('+jsExpr+')')();document.getElementById('answer').textContent=fmt(result,6);document.getElementById('steps').textContent='PEMDAS: 1) Parentheses 2) Exponents 3) Multiplication/Division (left to right) 4) Addition/Subtraction (left to right) → Result: '+fmt(result,6);}catch(e){document.getElementById('answer').textContent='Error: invalid expression';}

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['expression'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
