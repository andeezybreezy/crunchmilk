(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var n = parseFloat(document.getElementById('n').value) || 0;
    var r = parseFloat(document.getElementById('r').value) || 0;
    var type = document.getElementById('type').value;

    // Calculation logic
    var n=parseInt(document.getElementById('n').value); var r=parseInt(document.getElementById('r').value); var type=document.getElementById('type').value; if(isNaN(n)||n<0||isNaN(r)||r<0||r>n){document.getElementById('answer').textContent='Enter valid values (0 \u2264 r \u2264 n)';return;} function fact(x){if(x<=1)return 1;var result=1;for(var i=2;i<=x;i++)result*=i;return result;} var nFact=fact(n); var rFact=fact(r); var nrFact=fact(n-r); var result; if(type==='combination'){result=nFact/(rFact*nrFact); document.getElementById('formula').textContent='C('+n+','+r+') = '+n+'! / ('+r+'! \u00D7 '+(n-r)+'!) = '+fmt(nFact,0)+' / ('+fmt(rFact,0)+' \u00D7 '+fmt(nrFact,0)+')';} else {result=nFact/nrFact; document.getElementById('formula').textContent='P('+n+','+r+') = '+n+'! / '+(n-r)+'! = '+fmt(nFact,0)+' / '+fmt(nrFact,0);} document.getElementById('answer').textContent=fmt(result,0); document.getElementById('factorial_n').textContent=n+'! = '+fmt(nFact,0); document.getElementById('factorial_r').textContent=r+'! = '+fmt(rFact,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['n', 'r', 'type'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
