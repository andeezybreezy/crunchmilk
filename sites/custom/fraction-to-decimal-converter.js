(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numerator = parseFloat(document.getElementById('numerator').value) || 0;
    var denominator = parseFloat(document.getElementById('denominator').value) || 0;

    // Calculation logic
    var n=parseInt(numerator),d=parseInt(denominator);if(d===0){document.getElementById('decimal').textContent='Error: denominator cannot be zero';return;}var dec=n/d;document.getElementById('decimal').textContent=fmt(dec,8);var tempD=Math.abs(d);function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}var g=gcd(Math.abs(n),tempD);tempD=tempD/g;while(tempD%2===0)tempD/=2;while(tempD%5===0)tempD/=5;document.getElementById('isRepeating').textContent=tempD===1?'No — terminating decimal':'Yes — repeating decimal';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numerator', 'denominator'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
