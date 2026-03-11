(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var state = document.getElementById('state').value;

    // Calculation logic
    var limits = {'$5,000': 5000, '$7,500': 7500, '$10,000': 10000, '$12,000': 12000, '$15,000': 15000, '$25,000': 25000}; var limit = limits[state] || 10000; var qualifies = amount <= limit ? 'Yes' : 'No - exceeds limit'; var filingFee = amount <= 2500 ? 50 : amount <= 5000 ? 75 : amount <= 10000 ? 100 : 150; var netRecovery = amount - filingFee; return {qualifies: qualifies, filingFee: dollar(filingFee), netRecovery: dollar(netRecovery)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'state'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
