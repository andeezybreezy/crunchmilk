(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var goodsValue = parseFloat(document.getElementById('goodsValue').value) || 0;
    var freightCost = parseFloat(document.getElementById('freightCost').value) || 0;
    var insurancePct = parseFloat(document.getElementById('insurancePct').value) || 0;
    var dutyRate = parseFloat(document.getElementById('dutyRate').value) || 0;
    var additionalTariff = parseFloat(document.getElementById('additionalTariff').value) || 0;

    // Calculation logic
    var insurance = goodsValue * (insurancePct / 100);
    var cif = goodsValue + freightCost + insurance;
    var duty = cif * (dutyRate / 100);
    var addTariff = goodsValue * (additionalTariff / 100);
    var totalDuties = duty + addTariff;
    var mPF = Math.min(Math.max(cif * 0.003464, 31.67), 614.35);
    var hmf = cif * 0.00125;
    var landed = cif + totalDuties + mPF + hmf;
    var effectiveRate = ((landed - goodsValue) / goodsValue) * 100;
    document.getElementById('cifValue').textContent = dollar(cif);
    document.getElementById('dutyAmount').textContent = dollar(duty) + ' (' + dutyRate + '%)';
    document.getElementById('additionalTariffAmt').textContent = dollar(addTariff) + ' (' + additionalTariff + '%)';
    document.getElementById('totalLanded').textContent = dollar(landed);
    document.getElementById('effectiveRate').textContent = fmt(effectiveRate, 1) + '% total cost increase';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['goodsValue', 'freightCost', 'insurancePct', 'dutyRate', 'additionalTariff'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
