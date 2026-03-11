(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var target = document.getElementById('target').value;

    // Calculation logic
    var data = {russia: {score: 35, gdp: '-3 to -5% initially, adapted', trade: '45% of exports redirected to Asia', behavior: 'No — continued military operations', evasion: 'High — shadow fleet, China/India trade', civilian: 'Moderate — inflation but resilient'}, iran: {score: 55, gdp: '-15% vs potential, chronic', trade: '70% oil exports restricted', behavior: 'Partial — JCPOA deal in 2015, then reversed', evasion: 'Moderate — China buying, ship-to-ship', civilian: 'Severe — medicine and food shortages'}, 'north-korea': {score: 40, gdp: 'Economy shrunk but nuclear program continued', trade: '90% trade restricted on paper', behavior: 'No — expanded nuclear arsenal', evasion: 'High — China border, cyber theft', civilian: 'Extreme — humanitarian crisis'}, cuba: {score: 20, gdp: 'Chronic poverty but regime survived 60+ years', trade: 'Near-total trade embargo', behavior: 'No — Communist government endured', evasion: 'Moderate — tourism, remittances', civilian: 'Severe — chronic shortages'}, venezuela: {score: 45, gdp: '-75% GDP collapse (also mismanagement)', trade: 'Oil exports dropped 80%', behavior: 'Partial — some electoral concessions', evasion: 'Moderate — Iran, Russia support', civilian: 'Extreme — 7M+ refugees'}, syria: {score: 30, gdp: 'Economy destroyed (war + sanctions)', trade: 'Near-total isolation', behavior: 'No — Assad stayed (until 2024)', evasion: 'Moderate — Iran/Russia lifelines', civilian: 'Catastrophic'}, myanmar: {score: 25, gdp: '-10% but military retains control', trade: 'Limited enforcement', behavior: 'No — military junta continues', evasion: 'High — China/Russia/India trade', civilian: 'Severe — humanitarian crisis'}, 'china-tech': {score: 50, gdp: 'Slowed tech advancement 2-5 years', trade: 'Advanced chips restricted', behavior: 'Partial — accelerated domestic development', evasion: 'Moderate — third countries, stockpiling', civilian: 'Minimal — targeted at industry'}}; var d = data[v.target]; return {effectivenessScore: d.score + '/100', gdpImpact: d.gdp, tradeDisruption: d.trade, behaviorChange: d.behavior, evasion: d.evasion, civilianImpact: d.civilian};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['target'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
