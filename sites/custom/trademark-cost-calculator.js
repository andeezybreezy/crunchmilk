(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var classes = parseFloat(document.getElementById('classes').value) || 0;
    var filingType = document.getElementById('filingType').value;
    var useAttorney = document.getElementById('useAttorney').value;

    // Calculation logic
    var perClass = filingType === 'teas_plus' ? 250 : 350; var gov = perClass * classes; var legal = useAttorney === 'yes' ? 1500 : 0; var total = gov + legal; document.getElementById('govFees').textContent = dollar(gov); document.getElementById('legalFees').textContent = useAttorney === 'yes' ? dollar(legal) + ' (est.)' : 'N/A — self-filing'; document.getElementById('totalCost').textContent = dollar(total); document.getElementById('timeline').textContent = '8-12 months (if no opposition)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['classes', 'filingType', 'useAttorney'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
