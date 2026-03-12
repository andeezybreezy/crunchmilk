(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var units = parseFloat(document.getElementById('units').value) || 0;
    var totalCost = parseFloat(document.getElementById('totalCost').value) || 0;

    // Calculation logic
    var q=parseFloat(quantity),t=parseFloat(totalCost);var u=units||'units';if(q===0){document.getElementById('unitRate').textContent='Error: quantity cannot be zero';return;}var rate=t/q;document.getElementById('unitRate').textContent=fmt(rate,4)+' per '+u;document.getElementById('explanation').textContent=fmt(t,2)+' ÷ '+fmt(q,2)+' '+u+' = '+fmt(rate,4)+' per '+u;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['quantity', 'units', 'totalCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
