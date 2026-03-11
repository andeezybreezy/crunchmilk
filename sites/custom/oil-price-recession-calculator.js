(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentOil = parseFloat(document.getElementById('currentOil').value) || 0;
    var yearAgoOil = parseFloat(document.getElementById('yearAgoOil').value) || 0;
    var gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value) || 0;

    // Calculation logic
    var yoy = ((v.currentOil - v.yearAgoOil) / v.yearAgoOil) * 100; var prob = 0; var risk = ''; var precedent = ''; if (yoy > 100) { prob = 85; risk = 'Very High'; precedent = 'Similar to 1973, 1979, 2008'; } else if (yoy > 70) { prob = 65; risk = 'High'; precedent = 'Similar to 1990 Gulf War'; } else if (yoy > 40) { prob = 40; risk = 'Elevated'; precedent = 'Similar to 2000, 2011'; } else if (yoy > 20) { prob = 20; risk = 'Moderate'; precedent = 'Manageable if temporary'; } else { prob = 10; risk = 'Low'; precedent = 'Within normal volatility'; } if (v.gdpGrowth < 1) prob = Math.min(95, prob + 15); var timeline = prob > 50 ? '6-18 months after sustained spike' : '12-24 months if prices stay elevated'; return {yoyChange: (yoy >= 0 ? '+' : '') + yoy.toFixed(1) + '%', riskLevel: risk, probability: prob + '%', precedent: precedent, timeline: timeline};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentOil', 'yearAgoOil', 'gdpGrowth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
