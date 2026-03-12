(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tons = parseFloat(document.getElementById('tons').value) || 0;
    var treeType = document.getElementById('treeType').value;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var rates = {'Deciduous (oak, maple)': 0.048, 'Conifer (pine, spruce)': 0.04, 'Tropical (fast-growing)': 0.065}; var rate = rates[treeType] || 0.048; var totalAbsorption = rate * years; var treesNeeded = Math.ceil(tons / totalAbsorption); var acres = treesNeeded / 400; var cost = treesNeeded * 3;     document.getElementById('treesNeeded').textContent = fmt(treesNeeded,0);
    document.getElementById('acres').textContent = fmt(acres,1);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tons', 'treeType', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
