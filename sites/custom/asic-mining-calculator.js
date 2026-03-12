(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hashrate = parseFloat(document.getElementById('hashrate').value) || 0;
    var power = parseFloat(document.getElementById('power').value) || 0;
    var electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;
    var btcPrice = parseFloat(document.getElementById('btcPrice').value) || 0;
    var difficulty = parseFloat(document.getElementById('difficulty').value) || 0;

    // Calculation logic
    var blocksPerDay=144; var blockReward=3.125; var networkHashrate=difficulty*1e12*Math.pow(2,32)/(600); var myShare=hashrate*1e12/networkHashrate; var dailyBTC=blocksPerDay*blockReward*myShare; var dailyRevenue=dailyBTC*btcPrice; var dailyElectricity=(power/1000)*24*electricityCost; var dailyProfit=dailyRevenue-dailyElectricity; var monthlyProfit=dailyProfit*30;     document.getElementById('dailyBTC').textContent = fmt(dailyBTC,8)+' BTC';
    document.getElementById('dailyRevenue').textContent = dollar(dailyRevenue);
    document.getElementById('dailyElectricity').textContent = dollar(dailyElectricity);
    document.getElementById('dailyProfit').textContent = dollar(dailyProfit);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hashrate', 'power', 'electricityCost', 'btcPrice', 'difficulty'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
