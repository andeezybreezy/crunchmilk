(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualDefense = parseFloat(document.getElementById('annualDefense').value) || 0;
    var contractorShare = parseFloat(document.getElementById('contractorShare').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var annual = annualDefense * (contractorShare / 100); var total = annual * years; var perDay = annual * 1e9 / 365; var perHour = perDay / 24;     document.getElementById('annualRevenue').textContent = '$' + annual.toFixed(1) + ' billion/year';
    document.getElementById('totalRevenue').textContent = '$' + total.toFixed(0) + ' billion';
    document.getElementById('perDay').textContent = '$' + Math.round(perDay / 1e6) + ' million/day';
    document.getElementById('perHour').textContent = '$' + Math.round(perHour / 1e6) + ' million/hour';
    document.getElementById('topContractors').textContent = 'Lockheed Martin, Boeing, Raytheon, General Dynamics, Northrop Grumman';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualDefense', 'contractorShare', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
