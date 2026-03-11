(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var assets = parseFloat(document.getElementById('assets').value) || 0;
    var debts = parseFloat(document.getElementById('debts').value) || 0;

    // Calculation logic
    var nw = assets - debts; var brackets = {'18-24':{median:8000,avg:120000,p25:-5000,p50:8000,p75:35000,p90:100000,p95:200000},'25-34':{median:39000,avg:183000,p25:1000,p50:39000,p75:130000,p90:350000,p95:600000},'35-44':{median:135000,avg:549000,p25:15000,p50:135000,p75:350000,p90:850000,p95:1500000},'45-54':{median:247000,avg:975000,p25:30000,p50:247000,p75:650000,p90:1500000,p95:2800000},'55-64':{median:364000,avg:1400000,p25:45000,p50:364000,p75:950000,p90:2200000,p95:4000000},'65+':{median:409000,avg:1600000,p25:50000,p50:409000,p75:1000000,p90:2500000,p95:4500000}}; var group = age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : age < 55 ? '45-54' : age < 65 ? '55-64' : '65+'; var b = brackets[group]; var pctile = 50; if(nw <= b.p25) { pctile = Math.max(1, Math.round(25 * (nw - (b.p25 - Math.abs(b.p25)*2)) / (b.p25 - (b.p25 - Math.abs(b.p25)*2)))); if(nw <= 0) pctile = Math.max(1, Math.min(15, Math.round(15 * (nw + 100000) / 100000))); else pctile = Math.round(10 + 15 * nw / b.p25); pctile = Math.max(1, Math.min(25, pctile)); } else if(nw <= b.p50) { pctile = 25 + Math.round(25 * (nw - b.p25) / (b.p50 - b.p25)); } else if(nw <= b.p75) { pctile = 50 + Math.round(25 * (nw - b.p50) / (b.p75 - b.p50)); } else if(nw <= b.p90) { pctile = 75 + Math.round(15 * (nw - b.p75) / (b.p90 - b.p75)); } else if(nw <= b.p95) { pctile = 90 + Math.round(5 * (nw - b.p90) / (b.p95 - b.p90)); } else { pctile = 95 + Math.min(4, Math.round(4 * (nw - b.p95) / (b.p95 * 2))); } pctile = Math.max(1, Math.min(99, pctile)); var diff = nw - b.median; var diffStr = diff >= 0 ? dollar(diff) + ' above median' : dollar(Math.abs(diff)) + ' below median'; var topStr = (100 - pctile) + '%'; var level = pctile >= 95 ? 'Excellent — Top tier wealth for your age' : pctile >= 75 ? 'Strong — Well above typical for your age' : pctile >= 50 ? 'Solid — Above the median for your age' : pctile >= 25 ? 'Building — Below median but growing' : 'Early stage — Focus on debt reduction and saving'; document.getElementById('netWorth').textContent = dollar(nw); document.getElementById('percentile').textContent = pctile + 'th percentile'; document.getElementById('medianAge').textContent = dollar(b.median); document.getElementById('avgAge').textContent = dollar(b.avg); document.getElementById('vMedian').textContent = diffStr; document.getElementById('ageGroup').textContent = group + ' years old'; document.getElementById('topPct').textContent = 'Top ' + topStr; document.getElementById('wealthLevel').textContent = level;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'assets', 'debts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
