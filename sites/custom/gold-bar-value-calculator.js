(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var barSize = document.getElementById('barSize').value;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;
    var premium = parseFloat(document.getElementById('premium').value) || 0;

    // Calculation logic
    var gramsMap={'1g':1,'5g':5,'10g':10,'1oz':31.1035,'100g':100,'1kg':1000,'400oz':12441.4}; var grams=gramsMap[barSize]||31.1035; var oz=grams/31.1035; var spotValue=oz*spotPrice; var withPremium=spotValue*(1+premium/100); var totalValue=withPremium*quantity; var perGram=withPremium/grams;     document.getElementById('spotValue').textContent = dollar(spotValue);
    document.getElementById('withPremium').textContent = dollar(withPremium);
    document.getElementById('totalValue').textContent = dollar(totalValue);
    document.getElementById('perGram').textContent = dollar(perGram)+'/gram';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['barSize', 'quantity', 'spotPrice', 'premium'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
