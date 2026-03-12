(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var retirementIncome = parseFloat(document.getElementById('retirementIncome').value) || 0;
    var taxWeight = parseFloat(document.getElementById('taxWeight').value) || 0;
    var colWeight = parseFloat(document.getElementById('colWeight').value) || 0;
    var healthWeight = parseFloat(document.getElementById('healthWeight').value) || 0;
    var weatherWeight = parseFloat(document.getElementById('weatherWeight').value) || 0;

    // Calculation logic
    var states = [ {name:'Florida',taxScore:10,colScore:6,healthScore:7,weatherScore:9,taxRate:0,colIdx:1.03}, {name:'Texas',taxScore:10,colScore:7,healthScore:5,weatherScore:6,taxRate:0,colIdx:0.93}, {name:'Tennessee',taxScore:9,colScore:8,healthScore:5,weatherScore:6,taxRate:0,colIdx:0.89}, {name:'Nevada',taxScore:10,colScore:6,healthScore:5,weatherScore:7,taxRate:0,colIdx:1.01}, {name:'Wyoming',taxScore:10,colScore:7,healthScore:4,weatherScore:3,taxRate:0,colIdx:0.95}, {name:'South Dakota',taxScore:10,colScore:8,healthScore:5,weatherScore:2,taxRate:0,colIdx:0.88}, {name:'Arizona',taxScore:8,colScore:7,healthScore:6,weatherScore:8,taxRate:0.025,colIdx:0.97}, {name:'Georgia',taxScore:6,colScore:8,healthScore:6,weatherScore:7,taxRate:0.055,colIdx:0.91}, {name:'South Carolina',taxScore:7,colScore:8,healthScore:5,weatherScore:7,taxRate:0.065,colIdx:0.90}, {name:'North Carolina',taxScore:7,colScore:7,healthScore:7,weatherScore:7,taxRate:0.0475,colIdx:0.95}, {name:'New Hampshire',taxScore:9,colScore:4,healthScore:8,weatherScore:3,taxRate:0.05,colIdx:1.15}, {name:'Pennsylvania',taxScore:7,colScore:7,healthScore:7,weatherScore:4,taxRate:0.0307,colIdx:0.98}, {name:'Delaware',taxScore:7,colScore:6,healthScore:7,weatherScore:5,taxRate:0.066,colIdx:1.02}, {name:'Virginia',taxScore:6,colScore:6,healthScore:7,weatherScore:6,taxRate:0.0575,colIdx:1.04}, {name:'Colorado',taxScore:7,colScore:5,healthScore:8,weatherScore:6,taxRate:0.044,colIdx:1.10} ]; var totalWeight = taxWeight + colWeight + healthWeight + weatherWeight; states.forEach(function(s) { s.score = ((s.taxScore * taxWeight + s.colScore * colWeight + s.healthScore * healthWeight + s.weatherScore * weatherWeight) / totalWeight * 10); }); states.sort(function(a, b) { return b.score - a.score; }); var top = states.slice(0, 3); var estTax = top[0].taxRate * retirementIncome; var estMonthly = (retirementIncome / 12) * top[0].colIdx * 0.7; document.getElementById('state1').textContent = top[0].name; document.getElementById('score1').textContent = top[0].score.toFixed(1) + ' / 10'; document.getElementById('state2').textContent = top[1].name; document.getElementById('score2').textContent = top[1].score.toFixed(1) + ' / 10'; document.getElementById('state3').textContent = top[2].name; document.getElementById('score3').textContent = top[2].score.toFixed(1) + ' / 10'; document.getElementById('estTaxBurden').textContent = '$' + estTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/yr'; document.getElementById('estCOL').textContent = '$' + estMonthly.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['retirementIncome', 'taxWeight', 'colWeight', 'healthWeight', 'weatherWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
