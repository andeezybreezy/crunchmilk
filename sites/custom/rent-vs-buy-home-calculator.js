(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var rent = parseFloat(document.getElementById('rent').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var loan = homePrice * 0.8; var r = rate/100/12; var mortgage = loan * r / (1 - Math.pow(1+r,-360)); var monthlyOwn = mortgage + homePrice*0.01/12; var totalRent = rent * years * 12; var totalOwn = monthlyOwn * years * 12 + homePrice*0.2; var equity = homePrice*0.2 + homePrice*0.03*years; var netOwn = totalOwn - equity; var verdict = netOwn < totalRent ? 'Buying saves ' + dollar(totalRent-netOwn) : 'Renting saves ' + dollar(netOwn-totalRent);     document.getElementById('monthlyMortgage').textContent = dollar(mortgage);
    document.getElementById('totalRent').textContent = dollar(totalRent);
    document.getElementById('totalOwn').textContent = dollar(netOwn);
    document.getElementById('verdict').textContent = verdict;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homePrice', 'rent', 'rate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
