(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
    var state = document.getElementById('state').value;
    var assessRatio = parseFloat(document.getElementById('assessRatio').value) || 0;

    // Calculation logic
    var rates = {NJ:2.23,IL:2.07,NH:1.93,CT:2.15,VT:1.90,WI:1.76,TX:1.68,NE:1.65,NY:1.62,PA:1.58,OH:1.56,IA:1.52,MI:1.44,KS:1.41,SD:1.28,MN:1.27,ME:1.30,MA:1.20,RI:1.53,AK:1.19,MO:1.00,OR:0.97,GA:0.92,OK:0.88,VA:0.82,NC:0.84,ND:0.98,FL:0.89,MD:1.07,NV:0.60,MT:0.84,IN:0.85,WA:0.98,NM:0.80,KY:0.86,ID:0.69,TN:0.71,AZ:0.66,CA:0.71,WY:0.61,MS:0.81,AR:0.63,DE:0.57,UT:0.58,WV:0.58,SC:0.57,LA:0.55,CO:0.51,AL:0.41,HI:0.28}; var stateRate = rates[state] || 1.0; var assessed = homeValue * (assessRatio / 100); var annual = assessed * (stateRate / 100); var monthly = annual / 12; var nationalAvg = 1.10; var diff = stateRate - nationalAvg; var diffStr = diff >= 0 ? pct(Math.abs(diff), 2) + ' above national avg (' + pct(nationalAvg, 2) + ')' : pct(Math.abs(diff), 2) + ' below national avg (' + pct(nationalAvg, 2) + ')'; var sorted = Object.entries(rates).sort(function(a,b){return b[1]-a[1]}); var rank = 1; for(var i = 0; i < sorted.length; i++) { if(sorted[i][0] === state) { rank = i + 1; break; } } document.getElementById('assessedVal').textContent = dollar(assessed); document.getElementById('annualTax').textContent = dollar(annual); document.getElementById('monthlyTax').textContent = dollar(monthly); document.getElementById('effectiveRate').textContent = pct(stateRate, 2); document.getElementById('stateRank').textContent = '#' + rank + ' of 50 states'; document.getElementById('vsNational').textContent = diffStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homeValue', 'state', 'assessRatio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
