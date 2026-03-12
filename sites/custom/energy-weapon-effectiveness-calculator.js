(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var aggressor = document.getElementById('aggressor').value;
    var target = document.getElementById('target').value;

    // Calculation logic
    var data = {'russia-eu': {score: 85, leverage: '40% of EU gas supply pre-2022', damage: '2-5% GDP reduction', time: '2-3 years to diversify', history: 'Used in 2022 — reduced gas 80%, caused energy crisis'}, 'russia-japan': {score: 30, leverage: '8% of LNG imports', damage: '0.5% GDP', time: '6 months', history: 'Limited leverage — Japan diversified after 2011'}, 'russia-india': {score: 15, leverage: 'Minor oil supplier', damage: 'Minimal', time: 'Immediate alternatives', history: 'India actually increased Russian oil imports post-2022'}, 'russia-us': {score: 5, leverage: 'Minimal dependency', damage: 'Negligible direct', time: 'N/A', history: 'US is net energy exporter'}, 'iran-eu': {score: 40, leverage: 'Strait of Hormuz chokepoint', damage: '1-3% GDP if strait closed', time: '3-6 months via alternatives', history: 'Threatened multiple times, never fully executed'}, 'iran-japan': {score: 75, leverage: '87% of oil transits Hormuz', damage: '4-8% GDP', time: '6-12 months', history: 'Japan extremely vulnerable to strait closure'}, 'iran-india': {score: 55, leverage: '62% from ME via Hormuz', damage: '2-4% GDP', time: '6-12 months', history: 'India has limited strategic reserves'}, 'iran-us': {score: 20, leverage: 'Indirect via global price', damage: '0.5-1% GDP', time: 'SPR covers 90 days', history: 'US mostly insulated but faces price spikes'}, 'opec-eu': {score: 60, leverage: 'Controls 30% of global supply', damage: '2-4% GDP', time: '12+ months', history: '1973 embargo devastated West'}, 'opec-japan': {score: 70, leverage: 'Near-total dependency', damage: '5-8% GDP', time: '12+ months', history: '1973 embargo caused severe recession'}, 'opec-india': {score: 55, leverage: 'Major importer', damage: '3-5% GDP', time: '12+ months', history: 'Rising vulnerability with growth'}, 'opec-us': {score: 25, leverage: 'Limited since shale boom', damage: '0.5-1% GDP via prices', time: '3-6 months', history: '1973 embargo led to SPR creation'}, 'qatar-eu': {score: 35, leverage: '15% of EU LNG', damage: '0.5-1% GDP', time: '6-12 months', history: 'Replaced some Russian gas post-2022'}, 'qatar-japan': {score: 45, leverage: '12% of LNG imports', damage: '1-2% GDP', time: '6-12 months', history: 'Important but diversified LNG sources'}, 'qatar-india': {score: 40, leverage: '40% of LNG imports', damage: '1-2% GDP', time: '12+ months', history: 'Growing dependency'}, 'qatar-us': {score: 5, leverage: 'Minimal', damage: 'Negligible', time: 'N/A', history: 'US is LNG exporter'}}; var key = aggressor + '-' + target; var d = data[key] || {score: 20, leverage: 'Limited data', damage: 'Unknown', time: 'Unknown', history: 'No major precedent'};     document.getElementById('effectivenessScore').textContent = d.score + '/100';
    document.getElementById('supplyLeverage').textContent = d.leverage;
    document.getElementById('economicDamage').textContent = d.damage;
    document.getElementById('mitigationTime').textContent = d.time;
    document.getElementById('historicalUse').textContent = d.history;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['aggressor', 'target'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
