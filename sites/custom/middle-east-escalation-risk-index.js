(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var militaryActivity = parseFloat(document.getElementById('militaryActivity').value) || 0;
    var diplomaticTension = parseFloat(document.getElementById('diplomaticTension').value) || 0;
    var proxyConflict = parseFloat(document.getElementById('proxyConflict').value) || 0;
    var oilMarketStress = parseFloat(document.getElementById('oilMarketStress').value) || 0;
    var nuclearThreat = parseFloat(document.getElementById('nuclearThreat').value) || 0;

    // Calculation logic
    var weighted = v.militaryActivity * 0.25 + v.diplomaticTension * 0.15 + v.proxyConflict * 0.25 + v.oilMarketStress * 0.15 + v.nuclearThreat * 0.20; var score = (weighted * 10).toFixed(0); var level = weighted > 8 ? 'Critical' : weighted > 6 ? 'High' : weighted > 4 ? 'Elevated' : weighted > 2 ? 'Moderate' : 'Low'; var oilRisk = '$' + Math.round(weighted * 3) + '-' + Math.round(weighted * 5) + '/barrel war premium'; var comp = weighted > 7 ? 'Similar to pre-Gulf War 1990 or 2019 Iran tensions' : weighted > 5 ? 'Comparable to Arab Spring 2011 or ISIS expansion 2014' : 'Within normal geopolitical baseline'; var maxFactor = Math.max(v.militaryActivity, v.diplomaticTension, v.proxyConflict, v.oilMarketStress, v.nuclearThreat); var drivers = []; if (v.nuclearThreat >= maxFactor) drivers.push('Nuclear program'); if (v.militaryActivity >= maxFactor) drivers.push('Military buildup'); if (v.proxyConflict >= maxFactor) drivers.push('Proxy escalation');     document.getElementById('overallRisk').textContent = score + '/100';
    document.getElementById('riskLevel').textContent = level;
    document.getElementById('oilPriceRisk').textContent = oilRisk;
    document.getElementById('historicalComp').textContent = comp;
    document.getElementById('keyDrivers').textContent = drivers.join(', ') || 'Multiple factors elevated';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['militaryActivity', 'diplomaticTension', 'proxyConflict', 'oilMarketStress', 'nuclearThreat'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
