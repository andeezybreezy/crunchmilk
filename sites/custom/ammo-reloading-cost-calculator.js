(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var primerCost = parseFloat(document.getElementById('primerCost').value) || 0;
    var powderCost = parseFloat(document.getElementById('powderCost').value) || 0;
    var grainCharge = parseFloat(document.getElementById('grainCharge').value) || 0;
    var bulletCost = parseFloat(document.getElementById('bulletCost').value) || 0;
    var brassCost = parseFloat(document.getElementById('brassCost').value) || 0;
    var reloads = parseFloat(document.getElementById('reloads').value) || 0;
    var factoryCost = parseFloat(document.getElementById('factoryCost').value) || 0;

    // Calculation logic
    var primer = primerCost / 100; var powder = (grainCharge / 7000) * powderCost; var bullet = bulletCost / 100; var brass = (brassCost / 100) / reloads; var costPerRound = primer + powder + bullet + brass; var savings = factoryCost - costPerRound; var savingsPer100 = savings * 100;     document.getElementById('costPerRound').textContent = fmt(costPerRound * 100, 1);
    document.getElementById('savings').textContent = fmt(savings * 100, 1);
    document.getElementById('savingsPer100').textContent = dollar(savingsPer100);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['primerCost', 'powderCost', 'grainCharge', 'bulletCost', 'brassCost', 'reloads', 'factoryCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
