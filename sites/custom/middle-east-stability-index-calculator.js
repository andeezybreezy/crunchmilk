(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var country = document.getElementById('country').value;

    // Calculation logic
    var data = {saudi: {overall: 62, political: 55, economic: 70, security: 60, oil: 'High — swing producer', outlook: 'Stable with reform risks'}, iran: {overall: 30, political: 20, economic: 25, security: 35, oil: 'Critical — sanctions & strait', outlook: 'Elevated risk — nuclear tensions'}, iraq: {overall: 35, political: 30, economic: 40, security: 30, oil: 'High — 5M bpd producer', outlook: 'Fragile stability, militia tensions'}, israel: {overall: 55, political: 45, economic: 75, security: 40, oil: 'Moderate — regional conflict risk', outlook: 'Elevated risk from regional conflict'}, uae: {overall: 80, political: 75, economic: 85, security: 80, oil: 'Moderate — 4M bpd', outlook: 'Stable, diversified economy'}, qatar: {overall: 78, political: 70, economic: 85, security: 80, oil: 'Moderate — LNG leader', outlook: 'Stable'}, turkey: {overall: 45, political: 35, economic: 40, security: 50, oil: 'Low — transit country', outlook: 'Economic pressures, political uncertainty'}, egypt: {overall: 40, political: 35, economic: 35, security: 45, oil: 'Low — Suez Canal risk', outlook: 'Economic stress, IMF dependency'}, jordan: {overall: 55, political: 60, economic: 40, security: 60, oil: 'Low — no production', outlook: 'Stable but aid-dependent'}, lebanon: {overall: 15, political: 10, economic: 8, security: 20, oil: 'Low — Hezbollah conflict risk', outlook: 'Systemic collapse ongoing'}, syria: {overall: 10, political: 5, economic: 5, security: 10, oil: 'Low — minimal production', outlook: 'Ongoing instability, reconstruction uncertain'}, yemen: {overall: 12, political: 8, economic: 5, security: 10, oil: 'Moderate — Houthi shipping attacks', outlook: 'Active conflict, humanitarian crisis'}}; var d = data[country];     document.getElementById('overallScore').textContent = d.overall + '/100';
    document.getElementById('politicalScore').textContent = d.political + '/100';
    document.getElementById('economicScore').textContent = d.economic + '/100';
    document.getElementById('securityScore').textContent = d.security + '/100';
    document.getElementById('oilImpact').textContent = d.oil;
    document.getElementById('outlook').textContent = d.outlook;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['country'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
