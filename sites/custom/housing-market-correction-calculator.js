(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
    var priceToIncome = parseFloat(document.getElementById('priceToIncome').value) || 0;
    var inventoryMonths = parseFloat(document.getElementById('inventoryMonths').value) || 0;
    var mortgageRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    var mortgageBalance = parseFloat(document.getElementById('mortgageBalance').value) || 0;
    var yearsPurchased = parseFloat(document.getElementById('yearsPurchased').value) || 0;

    // Calculation logic
    var riskScore = 0; if (priceToIncome > 5) riskScore += (priceToIncome - 5) * 10; if (priceToIncome > 7) riskScore += 10; if (inventoryMonths < 2) riskScore -= 10; else if (inventoryMonths > 4) riskScore += (inventoryMonths - 4) * 5; if (mortgageRate > 6) riskScore += (mortgageRate - 6) * 5; else if (mortgageRate < 4) riskScore += 5; riskScore = Math.max(5, Math.min(85, riskScore)); var equity = homeValue - mortgageBalance; var mild = homeValue * 0.10; var moderate = homeValue * 0.20; var severe = homeValue * 0.30; var mildVal = homeValue - mild; var modVal = homeValue - moderate; var sevVal = homeValue - severe; var equityAfterMod = modVal - mortgageBalance; var uwPct = mortgageBalance > 0 ? ((homeValue - mortgageBalance) / homeValue) * 100 : 100; document.getElementById('correctionProb').textContent = fmt(riskScore, 0) + '% risk score'; document.getElementById('mildDrop').textContent = dollar(mildVal) + ' (lose ' + dollar(mild) + ')'; document.getElementById('moderateDrop').textContent = dollar(modVal) + ' (lose ' + dollar(moderate) + ')'; document.getElementById('severeDrop').textContent = dollar(sevVal) + ' (lose ' + dollar(severe) + ')'; document.getElementById('equityAtRisk').textContent = equityAfterMod >= 0 ? dollar(equityAfterMod) + ' equity remaining' : '-' + dollar(Math.abs(equityAfterMod)) + ' UNDERWATER'; document.getElementById('underwaterThreshold').textContent = uwPct < 100 ? '-' + fmt(uwPct, 1) + '% decline = underwater' : 'No mortgage — no underwater risk';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homeValue', 'priceToIncome', 'inventoryMonths', 'mortgageRate', 'mortgageBalance', 'yearsPurchased'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
