(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var type = document.getElementById('type').value;
    var children = document.getElementById('children').value;
    var assets = document.getElementById('assets').value;

    // Calculation logic
    var costs = {'Uncontested': [500,2500], 'Mediated': [3000,8000], 'Collaborative': [5000,15000], 'Contested (Moderate)': [10000,30000], 'Contested (Complex)': [25000,100000]}; var range = costs[type] || [5000,15000]; var childMult = children === 'Yes' ? 1.4 : 1; var assetMult = {'Simple': 1, 'Moderate': 1.3, 'Complex (business, property)': 1.8}; var mult = childMult * (assetMult[assets] || 1); var lowEstimate = range[0] * mult; var highEstimate = range[1] * mult; var timelines = {'Uncontested': 3, 'Mediated': 4, 'Collaborative': 6, 'Contested (Moderate)': 12, 'Contested (Complex)': 24}; var timeline = timelines[type] || 6;     document.getElementById('lowEstimate').textContent = dollar(lowEstimate);
    document.getElementById('highEstimate').textContent = dollar(highEstimate);
    document.getElementById('timeline').textContent = fmt(timeline,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['type', 'children', 'assets'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
