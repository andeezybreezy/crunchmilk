(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var principal = parseFloat(document.getElementById('principal').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var termYears = parseFloat(document.getElementById('termYears').value) || 0;
    var extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;

    // Calculation logic
    var r = (rate / 100) / 12; var n = termYears * 12; var pmt = r > 0 ? principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : principal / n; var totalPd = pmt * n; var totalInt = totalPd - principal; var monthsWithExtra = n; var totalIntExtra = totalInt; var saved = 0; var intSaved = 0; if(extraPayment > 0 && r > 0) { var balance = principal; var months = 0; var intPaidExtra = 0; while(balance > 0 && months < n * 2) { var intCharge = balance * r; var princPmt = pmt - intCharge + extraPayment; if(princPmt > balance) { intPaidExtra += balance * r; balance = 0; } else { intPaidExtra += intCharge; balance -= princPmt; } months++; } monthsWithExtra = months; totalIntExtra = intPaidExtra; saved = n - monthsWithExtra; intSaved = totalInt - totalIntExtra; } var payoffYears = Math.floor((extraPayment > 0 ? monthsWithExtra : n) / 12); var payoffMonths = (extraPayment > 0 ? monthsWithExtra : n) % 12; var newPayoffStr = payoffYears + ' years' + (payoffMonths > 0 ? ', ' + payoffMonths + ' months' : ''); var intSavePct = totalInt > 0 ? (intSaved / totalInt) * 100 : 0; var now = new Date(); var payoffMs = now.getTime() + (extraPayment > 0 ? monthsWithExtra : n) * 30.44 * 24 * 3600 * 1000; var payoffDate = new Date(payoffMs); var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; var dateStr = monthNames[payoffDate.getMonth()] + ' ' + payoffDate.getFullYear(); document.getElementById('monthlyPayment').textContent = dollar(pmt) + (extraPayment > 0 ? ' + ' + dollar(extraPayment) + ' extra = ' + dollar(pmt + extraPayment) : ''); document.getElementById('totalInterest').textContent = dollar(extraPayment > 0 ? totalIntExtra : totalInt); document.getElementById('totalPaid').textContent = dollar(extraPayment > 0 ? principal + totalIntExtra : totalPd); document.getElementById('monthsSaved').textContent = extraPayment > 0 ? saved + ' months (' + fmt(saved/12, 1) + ' years)' : 'Add extra payments to see savings'; document.getElementById('interestSaved').textContent = extraPayment > 0 ? dollar(intSaved) : 'Add extra payments to see savings'; document.getElementById('newPayoffTime').textContent = newPayoffStr; document.getElementById('interestSavingsPct').textContent = extraPayment > 0 ? pct(intSavePct, 1) + ' of interest eliminated' : 'N/A'; document.getElementById('payoffDate').textContent = dateStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['principal', 'rate', 'termYears', 'extraPayment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
