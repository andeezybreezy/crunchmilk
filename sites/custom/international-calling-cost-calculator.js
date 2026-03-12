(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyMinutes = parseFloat(document.getElementById('dailyMinutes').value) || 0;
    var dailyDataGB = parseFloat(document.getElementById('dailyDataGB').value) || 0;
    var tripDays = parseFloat(document.getElementById('tripDays').value) || 0;
    var method = document.getElementById('method').value;

    // Calculation logic
    var costs = {'roaming':10,'intlplan':5,'localsim':1,'wifi':0};
    var dailyCost = costs[method];
    if (method === 'roaming') dailyCost += (dailyDataGB > 0.5 ? dailyDataGB * 5 : 0);
    var totalCost = dailyCost * tripDays;
    var cheapestTotal = 0;
    if (method === 'wifi') { cheapestTotal = 0; }
    else { cheapestTotal = 0; }
    var savings = totalCost - cheapestTotal;
    var rec = method === 'roaming' ? 'Consider an international plan or local SIM to save ' + dollar(savings > 0 ? savings - (1 * tripDays) : 0) : (method === 'wifi' ? 'Most affordable — use WhatsApp, FaceTime, or Skype over WiFi' : (method === 'localsim' ? 'Great value — buy at airport or local shop upon arrival' : 'Good balance of convenience and cost'));
    document.getElementById('dailyCost').textContent = dollar(dailyCost) + '/day';
    document.getElementById('totalCost').textContent = dollar(totalCost) + ' for ' + fmt(tripDays, 0) + ' days';
    document.getElementById('comparison').textContent = 'WiFi-only would save ' + dollar(totalCost) + ' (but requires WiFi access)';
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyMinutes', 'dailyDataGB', 'tripDays', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
