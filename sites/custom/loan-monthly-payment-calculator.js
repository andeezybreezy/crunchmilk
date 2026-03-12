(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;

    // Calculation logic
    var r = rate/100/12; var payment = amount * r / (1 - Math.pow(1+r,-months)); var total = payment * months; var totalInterest = total - amount;     document.getElementById('payment').textContent = dollar(payment);
    document.getElementById('totalInterest').textContent = dollar(totalInterest);
    document.getElementById('total').textContent = dollar(total);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'rate', 'months'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
