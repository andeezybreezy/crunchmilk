(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var compareCountry = document.getElementById('compareCountry').value;

    // Calculation logic
    var israelBudget = 24; var israelPop = 9.8; var israelGDP = 5.2; var countries = {us: {budget: 886, pop: 334, gdp: 3.5}, uk: {budget: 75, pop: 67, gdp: 2.3}, china: {budget: 296, pop: 1412, gdp: 1.7}, russia: {budget: 109, pop: 144, gdp: 5.9}, france: {budget: 56, pop: 68, gdp: 2.1}, germany: {budget: 68, pop: 84, gdp: 1.6}, saudi: {budget: 75, pop: 36, gdp: 6.8}, iran: {budget: 7, pop: 88, gdp: 2.4}, egypt: {budget: 4.6, pop: 105, gdp: 1.2}, turkey: {budget: 16, pop: 85, gdp: 1.4}, india: {budget: 74, pop: 1420, gdp: 2.4}, japan: {budget: 50, pop: 125, gdp: 1.1}}; var c = countries[v.compareCountry]; var iPC = Math.round(israelBudget * 1e9 / (israelPop * 1e6)); var cPC = Math.round(c.budget * 1e9 / (c.pop * 1e6)); var ratio = (iPC / cPC).toFixed(1); return {israelTotal: '$' + israelBudget + ' billion', israelPerCapita: '$' + iPC.toLocaleString() + '/person', israelGDP: israelGDP + '% of GDP', compareTotal: '$' + c.budget + ' billion', comparePerCapita: '$' + cPC.toLocaleString() + '/person', ratio: 'Israel spends ' + ratio + 'x more per person'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['compareCountry'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
