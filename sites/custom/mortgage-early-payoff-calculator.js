(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var balance = parseFloat(document.getElementById('balance').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var monthsLeft = parseFloat(document.getElementById('monthsLeft').value) || 0;
    var extra = parseFloat(document.getElementById('extra').value) || 0;

    // Calculation logic
    var r = rate/100/12; var payment = balance * r / (1 - Math.pow(1+r, -monthsLeft)); var totalNormal = payment * monthsLeft; var bal = balance; var earlyMonths = 0; var totalEarly = 0; while (bal > 0 && earlyMonths < monthsLeft) { var interest = bal * r; var principal = payment + extra - interest; if (principal > bal) { totalEarly += bal + interest; break; } bal -= principal; totalEarly += payment + extra; earlyMonths++; } var interestSaved = totalNormal - totalEarly; var yearsSaved = (monthsLeft - earlyMonths) / 12; return {normalPayoff: fmt(monthsLeft,0), earlyPayoff: fmt(earlyMonths,0), interestSaved: dollar(interestSaved), yearsSaved: fmt(yearsSaved,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance', 'rate', 'monthsLeft', 'extra'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
