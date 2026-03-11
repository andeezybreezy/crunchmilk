(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var scenario = document.getElementById('scenario').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;

    // Calculation logic
    var scenarios = {sanctions: {chipLoss: 30, gdp: 0.5, recovery: '12-18 months', devices: 'Phone/PC prices up 20-40%', cars: '2-4 million fewer cars produced', industries: 'Consumer electronics, automotive, AI/data centers'}, blockade: {chipLoss: 65, gdp: 1.5, recovery: '2-3 years', devices: 'Severe shortages — phone prices double', cars: '8-12 million fewer cars', industries: 'Nearly all tech sectors, medical devices, military'}, invasion: {chipLoss: 85, gdp: 3, recovery: '3-5 years', devices: 'Critical shortage — rationing likely', cars: '15+ million fewer cars globally', industries: 'All manufacturing dependent on advanced chips'}, destruction: {chipLoss: 92, gdp: 5, recovery: '5-10 years to rebuild capacity', devices: 'Technology regression — no new advanced chips', cars: 'Auto production halved globally', industries: 'Every sector — catastrophic cascading failure'}}; var s = scenarios[v.scenario]; var durationFactor = Math.min(2, v.duration / 6); return {chipSupplyLoss: s.chipLoss + '% of advanced chips', industriesHit: s.industries, gdpImpact: '$' + (s.gdp * durationFactor * 1000).toFixed(0) + ' billion global GDP loss', recoveryTime: s.recovery, deviceImpact: s.devices, carImpact: s.cars};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['scenario', 'duration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
