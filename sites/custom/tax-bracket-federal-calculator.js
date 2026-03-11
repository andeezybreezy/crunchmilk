(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var status = document.getElementById('status').value;

    // Calculation logic
    var rate = status === 'Single' ? (income > 191950 ? 32 : income > 100525 ? 24 : income > 47150 ? 22 : income > 11600 ? 12 : 10) : (income > 383900 ? 32 : income > 201050 ? 24 : income > 94300 ? 22 : income > 23200 ? 12 : 10); var tax = income * rate / 100 * 0.75; var effective = (tax / income) * 100;     document.getElementById('bracket').textContent = fmt(rate,0);
    document.getElementById('tax').textContent = dollar(tax);
    document.getElementById('effective').textContent = fmt(effective,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'status'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
