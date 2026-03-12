(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var a = parseFloat(document.getElementById('a').value) || 0;
    var b = parseFloat(document.getElementById('b').value) || 0;
    var c = parseFloat(document.getElementById('c').value) || 0;

    // Calculation logic
    var av=parseFloat(a),bv=parseFloat(b),cv=parseFloat(c);if(av===0){document.getElementById('answer').textContent=(cv-bv)===0?'Infinite solutions':'No solution';document.getElementById('step1').textContent=av+'x + '+bv+' = '+cv;return;}var afterSub=cv-bv;var x=afterSub/av;document.getElementById('step1').textContent='Subtract '+bv+' from both sides: '+av+'x = '+cv+' - '+bv+' = '+afterSub;document.getElementById('step2').textContent='Divide both sides by '+av+': x = '+afterSub+' ÷ '+av+' = '+fmt(x,6);document.getElementById('answer').textContent=fmt(x,6);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['a', 'b', 'c'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
