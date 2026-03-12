(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var whole1 = parseFloat(document.getElementById('whole1').value) || 0;
    var num1 = parseFloat(document.getElementById('num1').value) || 0;
    var den1 = parseFloat(document.getElementById('den1').value) || 0;
    var whole2 = parseFloat(document.getElementById('whole2').value) || 0;
    var num2 = parseFloat(document.getElementById('num2').value) || 0;
    var den2 = parseFloat(document.getElementById('den2').value) || 0;
    var operation = document.getElementById('operation').value;

    // Calculation logic
    var w1=parseInt(whole1),n1=parseInt(num1),d1=parseInt(den1),w2=parseInt(whole2),n2=parseInt(num2),d2=parseInt(den2);if(d1===0||d2===0){document.getElementById('answerWhole').textContent='Error: denominator cannot be zero';return;}var imp1=w1*d1+(w1<0?-Math.abs(n1):n1),imp2=w2*d2+(w2<0?-Math.abs(n2):n2);var rn,rd;if(operation==='add'){rn=imp1*d2+imp2*d1;rd=d1*d2;}else if(operation==='subtract'){rn=imp1*d2-imp2*d1;rd=d1*d2;}else if(operation==='multiply'){rn=imp1*imp2;rd=d1*d2;}else{if(imp2===0){document.getElementById('answerWhole').textContent='Error: cannot divide by zero';return;}rn=imp1*d2;rd=d1*imp2;}if(rd<0){rn=-rn;rd=-rd;}function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}var g=gcd(Math.abs(rn),rd);rn=rn/g;rd=rd/g;var neg=rn<0?-1:1;rn=Math.abs(rn);var w=Math.floor(rn/rd)*neg;var rem=rn%rd;document.getElementById('answerWhole').textContent=w;document.getElementById('answerNum').textContent=rem;document.getElementById('answerDen').textContent=rd;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['whole1', 'num1', 'den1', 'whole2', 'num2', 'den2', 'operation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
