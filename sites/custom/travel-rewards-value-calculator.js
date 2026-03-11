(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var points = parseFloat(document.getElementById('points').value) || 0;
    var program = document.getElementById('program').value;
    var redemption = document.getElementById('redemption').value;

    // Calculation logic
    var baseValues = {'chase':1.5,'amex':1.0,'citi':1.0,'airline':1.2,'hotel':0.5};
    var multipliers = {'portal':1.0,'transfer':1.5,'cashback':0.67};
    var cpp = baseValues[program] * multipliers[redemption];
    var cashValue = (points * cpp) / 100;
    var flightValue = cashValue * (redemption === 'transfer' ? 1.3 : 1.0);
    var tips = {'portal':'Book through your card portal for guaranteed ' + fmt(baseValues[program], 1) + ' cpp','transfer':'Transfer to airline partners for business/first class to maximize value (2-5 cpp possible)','cashback':'Cash back gives the lowest value — consider travel redemption instead'};
    document.getElementById('value').textContent = dollar(cashValue);
    document.getElementById('centsPerPoint').textContent = fmt(cpp, 2) + ' cents per point';
    document.getElementById('equivalentFlight').textContent = 'Approx. ' + dollar(flightValue) + ' in flights';
    document.getElementById('tip').textContent = tips[redemption];

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['points', 'program', 'redemption'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
