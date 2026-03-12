(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
    var numAdults = parseFloat(document.getElementById('numAdults').value) || 0;
    var numKids = parseFloat(document.getElementById('numKids').value) || 0;
    var foodBudget = parseFloat(document.getElementById('foodBudget').value) || 0;
    var decorBudget = parseFloat(document.getElementById('decorBudget').value) || 0;
    var travelBudget = parseFloat(document.getElementById('travelBudget').value) || 0;

    // Calculation logic
    var kidMultiplier = 1.5; var totalRecipientWeight = numAdults + (numKids * kidMultiplier); var perRecipient = totalRecipientWeight > 0 ? totalBudget / totalRecipientWeight : 0; var perAdult = perRecipient; var perKid = perRecipient * kidMultiplier; var giftTotal = (perAdult * numAdults) + (perKid * numKids); var grandTotal = giftTotal + foodBudget + decorBudget + travelBudget; var avgAmerican = 920; var diff = grandTotal - avgAmerican; var monthlySaving = grandTotal / 11; document.getElementById('perAdult').textContent = dollar(perAdult); document.getElementById('perKid').textContent = dollar(perKid); document.getElementById('giftTotal').textContent = dollar(giftTotal); document.getElementById('grandTotal').textContent = dollar(grandTotal); document.getElementById('vsAverage').textContent = (diff >= 0 ? '+' : '') + dollar(diff) + ' vs $920 average'; document.getElementById('monthlySaving').textContent = dollar(monthlySaving) + '/month (Jan-Nov)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalBudget', 'numAdults', 'numKids', 'foodBudget', 'decorBudget', 'travelBudget'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
