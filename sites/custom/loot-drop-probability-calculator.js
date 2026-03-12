(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dropRate = parseFloat(document.getElementById('dropRate').value) || 0;
    var attempts = parseFloat(document.getElementById('attempts').value) || 0;

    // Calculation logic
    var p=dropRate/100; var noDropAll=Math.pow(1-p,attempts); var atLeastOne=(1-noDropAll)*100; var expected=attempts*p; var for50=Math.ceil(Math.log(0.5)/Math.log(1-p)); var for99=Math.ceil(Math.log(0.01)/Math.log(1-p));     document.getElementById('atLeastOne').textContent = fmt(atLeastOne,2)+'%';
    document.getElementById('expected').textContent = fmt(expected,2)+' drops';
    document.getElementById('for50pct').textContent = for50+' attempts';
    document.getElementById('for99pct').textContent = for99+' attempts';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dropRate', 'attempts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
