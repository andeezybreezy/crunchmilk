(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyViews = parseFloat(document.getElementById('monthlyViews').value) || 0;
    var cpm = parseFloat(document.getElementById('cpm').value) || 0;
    var adRate = parseFloat(document.getElementById('adRate').value) || 0;
    var revSharePct = document.getElementById('revSharePct').value;
    var months = parseFloat(document.getElementById('months').value) || 0;
    var growthRate = parseFloat(document.getElementById('growthRate').value) || 0;

    // Calculation logic
    var adImpressions = monthlyViews * (adRate / 100);
    var grossMonthly = adImpressions * cpm / 1000;
    var creatorShare = parseFloat(revSharePct) / 100;
    var creatorMonthly = grossMonthly * creatorShare;
    var rpmVal = monthlyViews > 0 ? (creatorMonthly / monthlyViews * 1000) : 0;
    var totalRev = 0;
    var views = monthlyViews;
    var gf = 1 + (growthRate / 100);
    for (var i = 0; i < months; i++) {
      totalRev += (views * (adRate / 100) * cpm / 1000) * creatorShare;
      views = Math.round(views * gf);
    }
    var dailyAvgVal = creatorMonthly / 30;
    document.getElementById('grossRevenue').textContent = '$' + grossMonthly.toFixed(2);
    document.getElementById('creatorRevenue').textContent = '$' + creatorMonthly.toFixed(2);
    document.getElementById('rpm').textContent = '$' + rpmVal.toFixed(2);
    document.getElementById('annualProjection').textContent = '$' + totalRev.toFixed(2);
    document.getElementById('dailyAvg').textContent = '$' + dailyAvgVal.toFixed(2) + '/day';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyViews', 'cpm', 'adRate', 'revSharePct', 'months', 'growthRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
