(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var medianPriceChange = parseFloat(document.getElementById('medianPriceChange').value) || 0;
    var inventoryMonths = parseFloat(document.getElementById('inventoryMonths').value) || 0;
    var daysOnMarket = parseFloat(document.getElementById('daysOnMarket').value) || 0;
    var targetPrice = parseFloat(document.getElementById('targetPrice').value) || 0;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var currentRate = parseFloat(document.getElementById('currentRate').value) || 0;

    // Calculation logic
    var marketType = inventoryMonths < 3 ? 'Strong Seller\'s Market' : inventoryMonths < 5 ? 'Balanced Market' : inventoryMonths < 7 ? 'Buyer\'s Market' : 'Strong Buyer\'s Market'; var buyerPower = inventoryMonths < 2 ? 'Very Low — expect bidding wars' : inventoryMonths < 4 ? 'Low to Moderate — some room to negotiate' : inventoryMonths < 6 ? 'Good — can negotiate price and terms' : 'Strong — significant leverage on price'; var priceDir = medianPriceChange > 5 ? 'Prices rising fast — urgency to buy' : medianPriceChange > 0 ? 'Prices rising moderately — steady appreciation' : medianPriceChange > -5 ? 'Prices softening — potential buyer opportunity' : 'Prices falling — wait or negotiate hard'; var dp = targetPrice * 0.20; var loanAmt = targetPrice * 0.80; var monthlyRate = currentRate / 100 / 12; var payment = loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, 360)) / (Math.pow(1 + monthlyRate, 360) - 1); var piti = payment + (targetPrice * 0.012 / 12) + (targetPrice * 0.005 / 12); var dti = annualIncome > 0 ? (piti * 12 / annualIncome) * 100 : 0; var affordScore = dti < 28 ? 'Comfortable (' + fmt(dti, 0) + '% DTI)' : dti < 36 ? 'Stretched (' + fmt(dti, 0) + '% DTI)' : 'Unaffordable (' + fmt(dti, 0) + '% DTI — above 36% guideline)'; var futurePrice = targetPrice * (1 + medianPriceChange / 100); var waitCost = futurePrice - targetPrice; var strategy = inventoryMonths < 3 && medianPriceChange > 3 ? 'Act quickly if you find a home you like — waive minor contingencies if comfortable' : inventoryMonths >= 5 ? 'Take your time — make below-asking offers and request seller concessions' : 'Balanced approach — make fair offers, keep standard contingencies'; document.getElementById('marketType').textContent = marketType + ' (' + fmt(inventoryMonths, 1) + ' months supply)'; document.getElementById('buyerPower').textContent = buyerPower; document.getElementById('priceDirection').textContent = priceDir; document.getElementById('affordability').textContent = affordScore; document.getElementById('waitImpact').textContent = (waitCost >= 0 ? '+' : '') + dollar(waitCost) + ' if prices continue trend'; document.getElementById('strategy').textContent = strategy;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['medianPriceChange', 'inventoryMonths', 'daysOnMarket', 'targetPrice', 'annualIncome', 'currentRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
