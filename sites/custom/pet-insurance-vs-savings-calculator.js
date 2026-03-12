(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyPremium = parseFloat(document.getElementById('monthlyPremium').value) || 0;
    var deductible = parseFloat(document.getElementById('deductible').value) || 0;
    var reimbursement = parseFloat(document.getElementById('reimbursement').value) || 0;
    var petAge = parseFloat(document.getElementById('petAge').value) || 0;
    var expectedEmergencies = parseFloat(document.getElementById('expectedEmergencies').value) || 0;
    var avgEmergencyCost = parseFloat(document.getElementById('avgEmergencyCost').value) || 0;

    // Calculation logic
    var remainingYears = Math.max(1, 14 - petAge); var totalPremiums = monthlyPremium * 12 * remainingYears; var premiumIncrease = totalPremiums * 0.15; totalPremiums += premiumIncrease; var totalEmergencyCost = expectedEmergencies * avgEmergencyCost; var claimPayouts = 0; for(var i = 0; i < expectedEmergencies; i++) { var claimable = Math.max(0, avgEmergencyCost - deductible); claimPayouts += claimable * (reimbursement / 100); } var netCost = totalPremiums - claimPayouts; var selfFundEmergencies = Math.floor(totalPremiums / avgEmergencyCost); var savingsWithInterest = totalPremiums * 1.15; var rec = ''; if(claimPayouts > totalPremiums) { rec = 'Insurance likely saves money — expected claims exceed premiums'; } else if(netCost < 2000) { rec = 'Close call — insurance provides peace of mind for small premium difference'; } else { rec = 'Self-insuring likely cheaper — save ' + dollar(monthlyPremium) + '/mo in a dedicated pet fund'; } document.getElementById('lifetimePremiums').textContent = dollar(totalPremiums); document.getElementById('totalSelfFund').textContent = dollar(savingsWithInterest) + ' (with interest)'; document.getElementById('expectedClaims').textContent = dollar(claimPayouts); document.getElementById('netInsurance').textContent = dollar(netCost); document.getElementById('selfFundCoverage').textContent = selfFundEmergencies + ' emergencies'; document.getElementById('verdict').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyPremium', 'deductible', 'reimbursement', 'petAge', 'expectedEmergencies', 'avgEmergencyCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
