(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var familyIncome = parseFloat(document.getElementById('familyIncome').value) || 0;
    var childrenUnder6 = parseFloat(document.getElementById('childrenUnder6').value) || 0;
    var children6to17 = parseFloat(document.getElementById('children6to17').value) || 0;
    var maritalStatus = document.getElementById('maritalStatus').value;

    // Calculation logic
    var maxUnder6 = 7437;
    var max6to17 = 6275;
    var totalChildren = childrenUnder6 + children6to17;
    var maxAnnual = (childrenUnder6 * maxUnder6) + (children6to17 * max6to17);
    var clawback = 0;
    var threshold1 = 36502;
    var threshold2 = 79087;
    if (familyIncome > threshold1) {
      var rate1 = totalChildren === 1 ? 0.07 : totalChildren === 2 ? 0.135 : totalChildren === 3 ? 0.19 : 0.23;
      if (familyIncome <= threshold2) {
        clawback = (familyIncome - threshold1) * rate1;
      } else {
        clawback = (threshold2 - threshold1) * rate1;
        var rate2 = totalChildren === 1 ? 0.032 : totalChildren === 2 ? 0.057 : totalChildren === 3 ? 0.08 : 0.095;
        clawback += (familyIncome - threshold2) * rate2;
      }
    }
    var annualBen = Math.max(0, maxAnnual - clawback);
    var monthlyBen = annualBen / 12;
    var perChildMon = totalChildren > 0 ? monthlyBen / totalChildren : 0;
    document.getElementById('maxBenefit').textContent = '$' + maxAnnual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('clawback').textContent = '-$' + clawback.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('annualBenefit').textContent = '$' + annualBen.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyBenefit').textContent = '$' + monthlyBen.toFixed(2) + '/mo';
    document.getElementById('perChild').textContent = '$' + perChildMon.toFixed(2) + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['familyIncome', 'childrenUnder6', 'children6to17', 'maritalStatus'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
