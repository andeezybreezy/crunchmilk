(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var decimal = parseFloat(document.getElementById('decimal').value) || 0;

    // Calculation logic
    var dec=parseFloat(decimal);if(isNaN(dec)){document.getElementById('fraction').textContent='Please enter a valid decimal';return;}var neg=dec<0?-1:1;dec=Math.abs(dec);var str=dec.toString();var dotIndex=str.indexOf('.');var decPlaces=dotIndex===-1?0:str.length-dotIndex-1;var n=Math.round(dec*Math.pow(10,decPlaces))*neg;var d=Math.pow(10,decPlaces);document.getElementById('fraction').textContent=n+'/'+d;function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}var g=gcd(Math.abs(n),d);document.getElementById('simplified').textContent=(n/g)+'/'+(d/g);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['decimal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
