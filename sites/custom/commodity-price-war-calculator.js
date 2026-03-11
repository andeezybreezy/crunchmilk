(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var commodity = document.getElementById('commodity').value;
    var overproduction = parseFloat(document.getElementById('overproduction').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;

    // Calculation logic
    var data = {oil: {base: 70, elasticity: 4, prodLoss: 200, savings: 150, casualties: 'US shale bankruptcies, layoffs in oil sector', precedent: '2020 Saudi-Russia price war: oil crashed to -$37/barrel'}, gas: {base: 3, elasticity: 5, prodLoss: 80, savings: 60, casualties: 'Gas producers, LNG project delays', precedent: '2020 gas glut crashed Henry Hub prices 60%'}, lithium: {base: 25000, elasticity: 3, prodLoss: 15, savings: 8, casualties: 'Junior miners, exploration companies', precedent: '2023-24: China overproduction crashed lithium 80%'}, wheat: {base: 7, elasticity: 2, prodLoss: 30, savings: 20, casualties: 'Small farmers, developing country exporters', precedent: 'EU dumping has historically devastated African farmers'}}; var d = data[v.commodity]; var decline = v.overproduction * d.elasticity; var loss = d.prodLoss * (decline / 100) * (v.duration / 12); var save = d.savings * (decline / 100) * (v.duration / 12);     document.getElementById('priceCollapse').textContent = '-' + decline + '% from current levels';
    document.getElementById('producerLosses').textContent = '$' + Math.round(loss) + ' billion';
    document.getElementById('consumerSavings').textContent = '$' + Math.round(save) + ' billion';
    document.getElementById('casualties').textContent = d.casualties;
    document.getElementById('precedent').textContent = d.precedent;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['commodity', 'overproduction', 'duration'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
