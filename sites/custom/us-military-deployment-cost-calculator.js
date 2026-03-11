(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var deployment = document.getElementById('deployment').value;
    var region = document.getElementById('region').value;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var costs = {carrier: {daily: 6.5, personnel: 7500, name: 'Carrier Strike Group'}, brigade: {daily: 4.2, personnel: 5000, name: 'Army Brigade'}, air: {daily: 8.5, personnel: 2000, name: 'Air Wing'}, special: {daily: 1.8, personnel: 200, name: 'Special Operations'}, base: {daily: 2.5, personnel: 3000, name: 'Forward Base'}}; var regionMult = {mideast: 1.0, pacific: 0.85, europe: 0.75, africa: 0.9}; var c = costs[v.deployment]; var mult = regionMult[v.region]; var daily = c.daily * mult; var total = daily * v.days; var perSoldier = (daily * 1e6) / c.personnel; var taxpayerShare = (total * 1e6) / 150e6; return {dailyCost: '$' + daily.toFixed(1) + ' million/day', totalCost: '$' + total.toFixed(0) + ' million (' + (total / 1e3).toFixed(2) + ' billion)', personnel: c.personnel.toLocaleString() + ' service members', perSoldier: '$' + Math.round(perSoldier).toLocaleString() + '/person/day', taxpayerShare: '$' + taxpayerShare.toFixed(2) + ' per US taxpayer'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['deployment', 'region', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
