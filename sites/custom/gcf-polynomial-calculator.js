(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var term1Coeff = parseFloat(document.getElementById('term1Coeff').value) || 0;
    var term1Exp = parseFloat(document.getElementById('term1Exp').value) || 0;
    var term2Coeff = parseFloat(document.getElementById('term2Coeff').value) || 0;
    var term2Exp = parseFloat(document.getElementById('term2Exp').value) || 0;
    var term3Coeff = parseFloat(document.getElementById('term3Coeff').value) || 0;
    var term3Exp = parseFloat(document.getElementById('term3Exp').value) || 0;

    // Calculation logic
    function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}var g=gcd(gcd(Math.abs(term1Coeff),Math.abs(term2Coeff)),Math.abs(term3Coeff));var minExp=Math.min(term1Exp,term2Exp,term3Exp);var gcfStr=g+(minExp>0?'x'+(minExp>1?'^'+minExp:''):'');document.getElementById('gcf').textContent=gcfStr;var t1=term1Coeff/g;var t2=term2Coeff/g;var t3=term3Coeff/g;var e1=term1Exp-minExp;var e2=term2Exp-minExp;var e3=term3Exp-minExp;function termStr(c,e){var s=c+(e>0?'x':'')+(e>1?'^'+e:'');return s;}var inside=termStr(t1,e1);inside+=(t2>=0?' + ':' - ')+termStr(Math.abs(t2),e2);inside+=(t3>=0?' + ':' - ')+termStr(Math.abs(t3),e3);document.getElementById('factored').textContent=gcfStr+'('+inside+')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['term1Coeff', 'term1Exp', 'term2Coeff', 'term2Exp', 'term3Coeff', 'term3Exp'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
