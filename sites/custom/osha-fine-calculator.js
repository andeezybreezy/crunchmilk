(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var violationType = document.getElementById('violationType').value;
    var employees = parseFloat(document.getElementById('employees').value) || 0;
    var severity = document.getElementById('severity').value;
    var goodFaith = document.getElementById('goodFaith').value;

    // Calculation logic
    var maxPenalties = {'other':16131,'serious':16131,'willful':161323,'repeat':161323,'failure':16131};
    var severityMult = {'low':0.3,'moderate':0.6,'high':1.0};
    var basePenalty = maxPenalties[violationType] * severityMult[severity];
    var sizeReduction = employees <= 25 ? 0.60 : (employees <= 100 ? 0.40 : (employees <= 250 ? 0.20 : 0));
    var goodFaithReduction = goodFaith === 'yes' ? 0.25 : (goodFaith === 'partial' ? 0.15 : 0);
    var totalReduction = sizeReduction + goodFaithReduction;
    var finalPenalty = basePenalty * (1 - totalReduction);
    finalPenalty = Math.max(finalPenalty, violationType === 'willful' ? 11524 : 0);
    var perDay = violationType === 'failure' ? 16131 : 0;
    document.getElementById('basePenalty').textContent = dollar(basePenalty);
    document.getElementById('adjustments').textContent = fmt(totalReduction * 100, 0) + '% reduction (' + fmt(sizeReduction * 100, 0) + '% size + ' + fmt(goodFaithReduction * 100, 0) + '% good faith)';
    document.getElementById('finalPenalty').textContent = dollar(finalPenalty) + ' per violation';
    document.getElementById('perDay').textContent = perDay > 0 ? dollar(perDay) + ' per day until corrected' : 'N/A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['violationType', 'employees', 'severity', 'goodFaith'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
