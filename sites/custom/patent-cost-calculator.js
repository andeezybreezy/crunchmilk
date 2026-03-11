(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var patentType = document.getElementById('patentType').value;
    var entitySize = document.getElementById('entitySize').value;

    // Calculation logic
    var fees = {provisional:{micro:80,small:160,large:320},utility:{micro:430,small:860,large:1720},design:{micro:210,small:420,large:840},plant:{micro:210,small:420,large:840}}; var atty = {provisional:2500,utility:12000,design:3500,plant:5000}; var f = (fees[patentType] || fees.utility)[entitySize] || 860; var a = atty[patentType] || 12000; document.getElementById('filingFees').textContent = dollar(f); document.getElementById('attorneyEst').textContent = dollar(a); document.getElementById('totalEst').textContent = dollar(f + a); var tl = {provisional:'12 months (then must file non-provisional)',utility:'2-3 years',design:'12-18 months',plant:'18-24 months'}; document.getElementById('timeline').textContent = tl[patentType] || '2-3 years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['patentType', 'entitySize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
