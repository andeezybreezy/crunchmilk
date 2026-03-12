(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var percent = parseFloat(document.getElementById('percent').value) || 0;

    // Calculation logic
    var p=parseFloat(percent);var dec=p/100;document.getElementById('decimal').textContent=dec;var n=p*100,d=10000;if(p===Math.floor(p)){n=p;d=100;}else{var str=p.toString();var dotIdx=str.indexOf('.');var places=dotIdx===-1?0:str.length-dotIdx-1;n=Math.round(p*Math.pow(10,places));d=100*Math.pow(10,places);}function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}document.getElementById('fraction').textContent=n+'/'+d;var g=gcd(Math.abs(n),d);document.getElementById('simplified').textContent=(n/g)+'/'+(d/g);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['percent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
