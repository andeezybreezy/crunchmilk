(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var chain = document.getElementById('chain').value;

    // Calculation logic
    var fees={bitcoin:{fee:5,speed:'10-60 min'},ethereum:{fee:3,speed:'15-30 sec'},xrp:{fee:0.001,speed:'3-5 sec'},solana:{fee:0.003,speed:'<1 sec'},polygon:{fee:0.01,speed:'2-5 sec'},arbitrum:{fee:0.10,speed:'<1 sec'},base:{fee:0.05,speed:'<1 sec'}}; var data=fees[chain]||fees.bitcoin; var feePct=(data.fee/amount)*100; var netReceived=amount-data.fee;     document.getElementById('estimatedFee').textContent = dollar(data.fee);
    document.getElementById('feePct').textContent = fmt(feePct, 2)+'%';
    document.getElementById('netReceived').textContent = dollar(netReceived);
    document.getElementById('speed').textContent = data.speed;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'chain'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
