(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base = parseFloat(document.getElementById('base').value) || 0;
    var value = parseFloat(document.getElementById('value').value) || 0;

    // Calculation logic
    var base=parseFloat(document.getElementById('base').value); var x=parseFloat(document.getElementById('value').value); if(isNaN(base)||base<=0||base===1||isNaN(x)||x<=0){document.getElementById('logResult').textContent='Enter positive values (base \u2260 1, value > 0)';return;} var result=Math.log(x)/Math.log(base); var ln=Math.log(x); var log10=Math.log10(x); document.getElementById('logResult').textContent='log\u2080('+x+') = '+fmt(result,8)+' where base = '+base; document.getElementById('naturalLog').textContent='ln('+x+') = '+fmt(ln,8); document.getElementById('log10').textContent='log\u2081\u2080('+x+') = '+fmt(log10,8); document.getElementById('changeOfBase').textContent='log_'+base+'('+x+') = ln('+x+')/ln('+base+') = '+fmt(ln,6)+'/'+fmt(Math.log(base),6)+' = '+fmt(result,8);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base', 'value'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
