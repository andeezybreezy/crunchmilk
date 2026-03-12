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

    // Calculation logic
    var a=Math.abs(parseInt(number1)),b=Math.abs(parseInt(number2));if(a===0&&b===0){document.getElementById('gcf').textContent='Undefined';document.getElementById('lcm').textContent='Undefined';document.getElementById('method').textContent='GCF and LCM are undefined when both numbers are zero';return;}function gcd(x,y){while(y){var t=y;y=x%y;x=t;}return x;}var g=gcd(a,b);var l=(a===0||b===0)?0:(a*b)/g;document.getElementById('gcf').textContent=g;document.getElementById('lcm').textContent=l;var factorsA=[],factorsB=[];for(var i=1;i<=a;i++){if(a%i===0)factorsA.push(i);}for(var j=1;j<=b;j++){if(b%j===0)factorsB.push(j);}document.getElementById('method').textContent='Factors of '+a+': '+factorsA.join(', ')+' | Factors of '+b+': '+factorsB.join(', ')+' | GCF × LCM = '+a+' × '+b;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number1', 'number2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
