(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    var expenses = parseFloat(document.getElementById('expenses').value) || 0;
    var hoursPerMonth = parseFloat(document.getElementById('hoursPerMonth').value) || 0;
    var taxBracket = document.getElementById('taxBracket').value;
    var selfEmployTax = parseFloat(document.getElementById('selfEmployTax').value) || 0;

    // Calculation logic
    var net = grossIncome - expenses;
    var seTax = net * (selfEmployTax / 100);
    var seDeduction = seTax * 0.5;
    var taxableIncome = net - seDeduction;
    var incomeTax = taxableIncome * (parseInt(taxBracket) / 100);
    var totalTax = seTax + incomeTax;
    var takeHome = net - totalTax;
    var hourlyRate = hoursPerMonth > 0 ? takeHome / hoursPerMonth : 0;
    document.getElementById('netIncome').textContent = dollar(net) + '/month';
    document.getElementById('totalTax').textContent = dollar(totalTax) + ' (SE: ' + dollar(seTax) + ' + Income: ' + dollar(incomeTax) + ')';
    document.getElementById('takeHome').textContent = dollar(takeHome) + '/month (' + dollar(takeHome * 12) + '/year)';
    document.getElementById('effectiveHourly').textContent = dollar(hourlyRate) + '/hour';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossIncome', 'expenses', 'hoursPerMonth', 'taxBracket', 'selfEmployTax'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
