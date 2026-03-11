(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sqft = parseFloat(document.getElementById('sqft').value) || 0;
    var sunExposure = document.getElementById('sunExposure').value;
    var occupants = parseFloat(document.getElementById('occupants').value) || 0;

    // Calculation logic
    var baseBtu = sqft * 20; var sunMod = {'Heavily Shaded': 0.9, 'Average': 1, 'Very Sunny': 1.1}; var btu = baseBtu * (sunMod[sunExposure] || 1) + (occupants - 2) * 600; btu = Math.ceil(btu / 1000) * 1000; var tonnage = btu / 12000; var estCost = (btu / 12000) * 0.15 * 8 * 30;     document.getElementById('btu').textContent = fmt(btu,0);
    document.getElementById('tonnage').textContent = fmt(tonnage,2);
    document.getElementById('estCost').textContent = dollar(estCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sqft', 'sunExposure', 'occupants'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
