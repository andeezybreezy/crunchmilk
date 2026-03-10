(function() {
  'use strict';

  var presetSelect = document.getElementById('presetMed');
  presetSelect.addEventListener('change', function() {
    if (this.value) {
      document.getElementById('halfLife').value = this.value;
    }
  });

  function calculate() {
    var dose = parseFloat(document.getElementById('initDose').value);
    var halfLife = parseFloat(document.getElementById('halfLife').value);
    var elapsed = parseFloat(document.getElementById('elapsed').value);

    if (isNaN(dose) || dose <= 0 || isNaN(halfLife) || halfLife <= 0 || isNaN(elapsed) || elapsed < 0) return;

    var halvesElapsed = elapsed / halfLife;
    var remaining = dose * Math.pow(0.5, halvesElapsed);
    var pctEliminated = ((dose - remaining) / dose) * 100;
    var clearTime = halfLife * 5; // ~97% eliminated

    document.getElementById('remaining').textContent = remaining.toFixed(2) + ' mg';
    document.getElementById('eliminated').textContent = pctEliminated.toFixed(1) + '%';
    document.getElementById('halvesElapsed').textContent = halvesElapsed.toFixed(2);

    var clearHrs = clearTime;
    if (clearHrs >= 48) {
      document.getElementById('clearTime').textContent = (clearHrs / 24).toFixed(1) + ' days (' + clearHrs.toFixed(0) + ' hr)';
    } else {
      document.getElementById('clearTime').textContent = clearHrs.toFixed(1) + ' hours';
    }

    // Build decay timeline table
    var tableHTML = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin-top:8px;">';
    tableHTML += '<tr style="border-bottom:2px solid #e5e7eb;"><th style="text-align:left;padding:6px;">Time</th><th style="text-align:right;padding:6px;">Remaining</th><th style="text-align:right;padding:6px;">% Left</th></tr>';

    var steps = [0, 1, 2, 3, 4, 5];
    steps.forEach(function(n) {
      var t = halfLife * n;
      var r = dose * Math.pow(0.5, n);
      var pct = (r / dose * 100).toFixed(1);
      var highlight = (Math.abs(t - elapsed) < halfLife * 0.1) ? 'background:#f0f9ff;font-weight:600;' : '';
      var timeStr = t >= 48 ? (t / 24).toFixed(1) + ' days' : t.toFixed(1) + ' hr';
      tableHTML += '<tr style="border-bottom:1px solid #f3f4f6;' + highlight + '"><td style="padding:6px;">' + timeStr + '</td><td style="text-align:right;padding:6px;">' + r.toFixed(2) + ' mg</td><td style="text-align:right;padding:6px;">' + pct + '%</td></tr>';
    });
    tableHTML += '</table>';
    document.getElementById('decayTable').innerHTML = tableHTML;

    document.getElementById('resultTip').textContent = 'After 5 half-lives (' + (clearHrs >= 48 ? (clearHrs / 24).toFixed(1) + ' days' : clearHrs.toFixed(1) + ' hours') + '), approximately 97% of the drug is eliminated.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
