(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var enrichmentPct = parseFloat(document.getElementById('enrichmentPct').value) || 0;
    var stockpileKg = parseFloat(document.getElementById('stockpileKg').value) || 0;
    var centrifuges = parseFloat(document.getElementById('centrifuges').value) || 0;
    var centrifugeType = document.getElementById('centrifugeType').value;

    // Calculation logic
    var swuPerCentrifuge = {ir1: 0.8, ir2: 3, ir4: 4.5, ir6: 10}; var swuRate = centrifuges * (swuPerCentrifuge[centrifugeType] || 3); var weaponsKg = 25; var swuToWeaponsGrade = 5000; var pctDone = enrichmentPct / 90 * 100; var swuRemaining = swuToWeaponsGrade * (1 - enrichmentPct / 90) * (weaponsKg / Math.max(stockpileKg, 1)); var daysToBreakout = Math.max(1, Math.round((swuRemaining / swuRate) * 365)); var timeStr = daysToBreakout < 30 ? daysToBreakout + ' days' : daysToBreakout < 365 ? Math.round(daysToBreakout / 30) + ' months' : (daysToBreakout / 365).toFixed(1) + ' years';     document.getElementById('breakoutTime').textContent = timeStr;
    document.getElementById('weaponsGradeNeeded').textContent = weaponsKg + ' kg at 90%';
    document.getElementById('currentProgress').textContent = pctDone.toFixed(1) + '% to weapons-grade';
    document.getElementById('enrichmentGap').textContent = (90 - enrichmentPct).toFixed(1) + '% remaining';
    document.getElementById('swuCapacity').textContent = Math.round(swuRate).toLocaleString() + ' SWU/yr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['enrichmentPct', 'stockpileKg', 'centrifuges', 'centrifugeType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
