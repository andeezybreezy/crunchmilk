(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number1 = parseFloat(document.getElementById('number1').value) || 0;
    var number2 = parseFloat(document.getElementById('number2').value) || 0;
    var operation = document.getElementById('operation').value;

    // Calculation logic
    var a=parseFloat(number1),b=parseFloat(number2);var result,rule;if(operation==='add'){result=a+b;if(a>=0&&b>=0)rule='Positive + Positive = Positive';else if(a<0&&b<0)rule='Negative + Negative = Negative (add absolute values, keep negative sign)';else rule='Different signs: subtract absolute values, keep sign of larger absolute value';}else if(operation==='subtract'){result=a-b;rule='Subtracting is the same as adding the opposite: '+a+' + '+(b*-1)+' = '+result;}else if(operation==='multiply'){result=a*b;if((a>=0&&b>=0)||(a<0&&b<0))rule='Same signs → Positive result';else rule='Different signs → Negative result';}else{if(b===0){document.getElementById('answer').textContent='Error: cannot divide by zero';document.getElementById('rule').textContent='Division by zero is undefined';return;}result=a/b;if((a>=0&&b>=0)||(a<0&&b<0))rule='Same signs → Positive result';else rule='Different signs → Negative result';}document.getElementById('answer').textContent=fmt(result,4);document.getElementById('rule').textContent=rule;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number1', 'number2', 'operation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
