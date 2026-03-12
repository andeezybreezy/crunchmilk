(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var number = parseFloat(document.getElementById('number').value) || 0;

    // Calculation logic
    var n=Math.abs(parseInt(number));if(n<2){document.getElementById('factors').textContent=n<2?'Numbers less than 2 have no prime factorization':'';document.getElementById('isPrime').textContent='No';return;}var orig=n;var primeFactors=[];var d=2;while(d*d<=n){while(n%d===0){primeFactors.push(d);n=n/d;}d++;}if(n>1)primeFactors.push(n);document.getElementById('factors').textContent=primeFactors.join(' × ');var counts={};primeFactors.forEach(function(f){counts[f]=(counts[f]||0)+1;});var expForm=Object.keys(counts).map(function(k){return counts[k]>1?k+'^'+counts[k]:k;}).join(' × ');document.getElementById('factorTree').textContent=orig+' = '+expForm;document.getElementById('isPrime').textContent=primeFactors.length===1?'Yes — '+orig+' is a prime number':'No — '+orig+' is a composite number';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['number'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
