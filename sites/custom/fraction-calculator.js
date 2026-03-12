(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var num1 = parseFloat(document.getElementById('num1').value) || 0;
    var den1 = parseFloat(document.getElementById('den1').value) || 0;
    var num2 = parseFloat(document.getElementById('num2').value) || 0;
    var den2 = parseFloat(document.getElementById('den2').value) || 0;
    var operation = document.getElementById('operation').value;

    // Calculation logic
    var n1=parseInt(num1),d1=parseInt(den1),n2=parseInt(num2),d2=parseInt(den2);if(d1===0||d2===0){document.getElementById('simplified').textContent='Error: denominator cannot be zero';return;}var rn,rd;if(operation==='add'){rn=n1*d2+n2*d1;rd=d1*d2;}else if(operation==='subtract'){rn=n1*d2-n2*d1;rd=d1*d2;}else if(operation==='multiply'){rn=n1*n2;rd=d1*d2;}else{if(n2===0){document.getElementById('simplified').textContent='Error: cannot divide by zero';return;}rn=n1*d2;rd=d1*n2;}if(rd<0){rn=-rn;rd=-rd;}function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}var g=gcd(Math.abs(rn),rd);var sn=rn/g,sd=rd/g;document.getElementById('answerNum').textContent=rn;document.getElementById('answerDen').textContent=rd;document.getElementById('simplified').textContent=sn+'/'+sd;document.getElementById('decimal').textContent=fmt(rn/rd,6);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['num1', 'den1', 'num2', 'den2', 'operation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
