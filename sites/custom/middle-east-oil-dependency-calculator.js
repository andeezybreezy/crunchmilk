(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var country = document.getElementById('country').value;

    // Calculation logic
    var data = {us: {dep: 11, imports: 0.5, suppliers: 'Saudi Arabia, Iraq', vuln: 'Low', spr: 90}, china: {dep: 47, imports: 5.2, suppliers: 'Saudi Arabia, Iraq, UAE, Oman', vuln: 'High', spr: 40}, japan: {dep: 87, imports: 2.8, suppliers: 'Saudi Arabia, UAE, Kuwait, Qatar', vuln: 'Critical', spr: 145}, india: {dep: 62, imports: 2.8, suppliers: 'Iraq, Saudi Arabia, UAE', vuln: 'Very High', spr: 10}, 'south-korea': {dep: 72, imports: 2.1, suppliers: 'Saudi Arabia, Kuwait, Iraq', vuln: 'Very High', spr: 90}, germany: {dep: 8, imports: 0.15, suppliers: 'Kazakhstan, Libya (non-ME mainly)', vuln: 'Low', spr: 90}, uk: {dep: 6, imports: 0.08, suppliers: 'Mostly North Sea, some Saudi', vuln: 'Low', spr: 60}, france: {dep: 18, imports: 0.25, suppliers: 'Saudi Arabia, Libya, Algeria', vuln: 'Moderate', spr: 90}}; var d = data[v.country];     document.getElementById('meDependency').textContent = d.dep + '% of oil from Middle East';
    document.getElementById('dailyImports').textContent = d.imports + ' million bpd';
    document.getElementById('topSuppliers').textContent = d.suppliers;
    document.getElementById('vulnerabilityScore').textContent = d.vuln;
    document.getElementById('sprDays').textContent = d.spr + ' days of strategic reserves';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['country'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
