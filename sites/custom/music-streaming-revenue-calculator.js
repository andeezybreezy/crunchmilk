(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyStreams = parseFloat(document.getElementById('monthlyStreams').value) || 0;
    var platform = document.getElementById('platform').value;
    var distributor = parseFloat(document.getElementById('distributor').value) || 0;

    // Calculation logic
    var rates = {'spotify':0.004,'apple':0.008,'amazon':0.004,'tidal':0.010,'youtube':0.002};
    var rate = rates[platform];
    var gross = monthlyStreams * rate;
    var net = gross * (1 - distributor / 100);
    var annual = net * 12;
    var neededFor1k = Math.ceil(1000 / (rate * (1 - distributor / 100)));
    document.getElementById('grossMonthly').textContent = dollar(gross);
    document.getElementById('netMonthly').textContent = dollar(net);
    document.getElementById('annualRevenue').textContent = dollar(annual);
    document.getElementById('streamsFor1k').textContent = fmt(neededFor1k, 0) + ' streams/month';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyStreams', 'platform', 'distributor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
