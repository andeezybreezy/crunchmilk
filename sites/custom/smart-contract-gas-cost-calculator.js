(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var contractSize = parseFloat(document.getElementById('contractSize').value) || 0;
    var functions = parseFloat(document.getElementById('functions').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;

    // Calculation logic
    var deployGas = contractSize * 200 + 21000; var deployCostEth = (deployGas * gasPrice) / 1e9; var deployCost = deployCostEth * ethPrice; var avgCallGas = 65000; var dailyGas = avgCallGas * functions; var dailyCostEth = (dailyGas * gasPrice) / 1e9; var dailyInteractionCost = dailyCostEth * ethPrice; var monthlyCost = dailyInteractionCost * 30;     document.getElementById('deployGas').textContent = fmt(deployGas, 0);
    document.getElementById('deployCost').textContent = dollar(deployCost);
    document.getElementById('dailyInteractionCost').textContent = dollar(dailyInteractionCost);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['contractSize', 'functions', 'gasPrice', 'ethPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
