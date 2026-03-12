(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sanctionLevel = document.getElementById('sanctionLevel').value;
    var salary = parseFloat(document.getElementById('salary').value) || 0;

    // Calculation logic
    var rates = {jcpoa: {official: 32000, black: 38000, inflation: 12}, moderate: {official: 42000, black: 180000, inflation: 30}, strict: {official: 42000, black: 350000, inflation: 45}, max: {official: 42000, black: 550000, inflation: 55}}; var r = rates[sanctionLevel]; var salaryRial = salary * 1e6; var salaryUSDblack = salaryRial / r.black; var preJCPOArate = 32000; var powerLoss = ((r.black - preJCPOArate) / r.black * 100);     document.getElementById('officialRate').textContent = '1 USD = ' + r.official.toLocaleString() + ' rial (gov)';
    document.getElementById('blackMarketRate').textContent = '1 USD = ' + r.black.toLocaleString() + ' rial (market)';
    document.getElementById('salaryUSD').textContent = '$' + Math.round(salaryUSDblack) + '/month (at market rate)';
    document.getElementById('purchasingPower').textContent = '-' + powerLoss.toFixed(0) + '% vs pre-sanctions';
    document.getElementById('inflation').textContent = r.inflation + '% annually';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sanctionLevel', 'salary'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
