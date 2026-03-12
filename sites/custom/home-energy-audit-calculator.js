(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyBill = parseFloat(document.getElementById('monthlyBill').value) || 0;
    var insulation = document.getElementById('insulation').value;
    var airSeal = document.getElementById('airSeal').value;
    var ledLights = document.getElementById('ledLights').value;
    var smartThermo = document.getElementById('smartThermo').value;

    // Calculation logic
    var savingsPct = 0; savingsPct += insulation === 'Yes' ? 15 : 0; savingsPct += airSeal === 'Yes' ? 10 : 0; savingsPct += ledLights === 'Yes' ? 5 : 0; savingsPct += smartThermo === 'Yes' ? 8 : 0; var monthlySavings = monthlyBill * (savingsPct/100); var annualSavings = monthlySavings * 12;     document.getElementById('savingsPct').textContent = fmt(savingsPct,0);
    document.getElementById('monthlySavings').textContent = dollar(monthlySavings);
    document.getElementById('annualSavings').textContent = dollar(annualSavings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyBill', 'insulation', 'airSeal', 'ledLights', 'smartThermo'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
