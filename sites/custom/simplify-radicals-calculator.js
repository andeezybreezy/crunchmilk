(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var radicand = parseFloat(document.getElementById('radicand').value) || 0;

    // Calculation logic
    var n=Math.abs(Math.floor(radicand));if(n===0){document.getElementById('simplified').textContent='0';document.getElementById('coefficient').textContent='0';document.getElementById('insideRadical').textContent='0';document.getElementById('explanation').textContent='√0 = 0';return;}var coeff=1;var inside=n;for(var i=Math.floor(Math.sqrt(n));i>=2;i--){if(inside%(i*i)===0){coeff*=i;inside=inside/(i*i);i=Math.floor(Math.sqrt(inside))+1;}}if(inside===1){document.getElementById('simplified').textContent=String(coeff);}else if(coeff===1){document.getElementById('simplified').textContent='√'+inside;}else{document.getElementById('simplified').textContent=coeff+'√'+inside;}document.getElementById('coefficient').textContent=coeff;document.getElementById('insideRadical').textContent=inside;document.getElementById('explanation').textContent='√'+n+' = √('+coeff*coeff+'·'+inside+') = '+coeff+'√'+inside;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['radicand'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
