(function() {
  'use strict';

  function calculate() {
    var primerPer1000 = parseFloat(document.getElementById('primerCost').value);
    var powderPerLb = parseFloat(document.getElementById('powderCost').value);
    var powderCharge = parseFloat(document.getElementById('powderCharge').value);
    var bulletBoxCost = parseFloat(document.getElementById('bulletCost').value);
    var bulletsPerBox = parseFloat(document.getElementById('bulletsPerBox').value);
    var brassCostEach = parseFloat(document.getElementById('brassCost').value);
    var brassLife = parseFloat(document.getElementById('brassLife').value) || 5;
    var factoryBox = parseFloat(document.getElementById('factoryPrice').value);
    var equipCost = parseFloat(document.getElementById('equipCost').value) || 0;

    if (isNaN(primerPer1000) || isNaN(powderPerLb) || isNaN(powderCharge) ||
        isNaN(bulletBoxCost) || isNaN(bulletsPerBox) || bulletsPerBox <= 0) return;

    var primerEach = primerPer1000 / 1000;
    var powderEach = (powderCharge / 7000) * powderPerLb;
    var bulletEach = bulletBoxCost / bulletsPerBox;
    var brassEach = (isNaN(brassCostEach) ? 0 : brassCostEach) / brassLife;

    var totalCPR = primerEach + powderEach + bulletEach + brassEach;
    var factoryCPR = !isNaN(factoryBox) ? factoryBox / 20 : 0;
    var savingsPerRound = factoryCPR > 0 ? factoryCPR - totalCPR : 0;

    document.getElementById('costRound').textContent = '$' + totalCPR.toFixed(3);
    document.getElementById('factoryCPR').textContent = factoryCPR > 0 ? '$' + factoryCPR.toFixed(3) : '—';
    document.getElementById('costBox20').textContent = '$' + (totalCPR * 20).toFixed(2);
    document.getElementById('costBox50').textContent = '$' + (totalCPR * 50).toFixed(2);

    if (savingsPerRound > 0) {
      document.getElementById('savingsRound').textContent = '$' + savingsPerRound.toFixed(3) + ' (' + Math.round(savingsPerRound / factoryCPR * 100) + '%)';
    } else {
      document.getElementById('savingsRound').textContent = factoryCPR > 0 ? 'None' : '—';
    }

    if (equipCost > 0 && savingsPerRound > 0) {
      var breakEvenRounds = Math.ceil(equipCost / savingsPerRound);
      document.getElementById('breakEven').textContent = breakEvenRounds.toLocaleString() + ' rounds';
    } else {
      document.getElementById('breakEven').textContent = '—';
    }

    // Breakdown table
    var components = [
      { name: 'Primer', cost: primerEach },
      { name: 'Powder', cost: powderEach },
      { name: 'Bullet', cost: bulletEach },
      { name: 'Brass (amortized)', cost: brassEach }
    ];

    var tbody = document.getElementById('breakdownBody');
    tbody.innerHTML = '';
    for (var i = 0; i < components.length; i++) {
      var c = components[i];
      var pct = totalCPR > 0 ? (c.cost / totalCPR * 100) : 0;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + c.name + '</td>' +
        '<td>$' + c.cost.toFixed(4) + '</td>' +
        '<td>' + pct.toFixed(1) + '%</td>';
      tbody.appendChild(tr);
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
