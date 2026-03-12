(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var base = parseFloat(document.getElementById('base').value) || 0;
    var exponent = parseFloat(document.getElementById('exponent').value) || 0;

    // Calculation logic
    var val=Math.pow(base,exponent);var posExp=Math.abs(exponent);var denom=Math.pow(base,posExp);document.getElementById('answer').textContent=fmt(val,8);document.getElementById('fraction').textContent='1 / '+base+'^'+posExp+' = 1/'+denom;document.getElementById('steps').textContent=base+'^('+exponent+') = 1/'+base+'^'+posExp+' = 1/'+denom+' = '+fmt(val,8);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['base', 'exponent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
