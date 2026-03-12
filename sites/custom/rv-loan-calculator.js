(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var price = parseFloat(document.getElementById('price').value) || 0;
    var down = parseFloat(document.getElementById('down').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var term = parseFloat(document.getElementById('term').value) || 0;

    // Calculation logic
    var loan = price - down; if (loan <= 0) return; var r = rate / 100 / 12; var n = term * 12; var payment = r > 0 ? loan * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1) : loan / n; var totalPaid = payment * n; document.getElementById('monthly').textContent = dollar(payment); document.getElementById('totalInterest').textContent = dollar(totalPaid - loan); document.getElementById('totalCost').textContent = dollar(totalPaid + down); document.getElementById('loanAmount').textContent = dollar(loan); document.getElementById('resultTip').textContent = 'Total interest is ' + pct((totalPaid - loan) / loan * 100, 1) + ' of your loan amount.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['price', 'down', 'rate', 'term'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
