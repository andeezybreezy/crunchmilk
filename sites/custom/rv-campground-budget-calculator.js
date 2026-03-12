(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nights = parseFloat(document.getElementById('nights').value) || 0;
    var privateNights = parseFloat(document.getElementById('privateNights').value) || 0;
    var publicNights = parseFloat(document.getElementById('publicNights').value) || 0;
    var freeNights = parseFloat(document.getElementById('freeNights').value) || 0;

    // Calculation logic
    var privateCost = privateNights * 55; var publicCost = publicNights * 30; var totalCost = privateCost + publicCost; var avgPerNight = nights > 0 ? totalCost / nights : 0;     document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('avgPerNight').textContent = dollar(avgPerNight);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nights', 'privateNights', 'publicNights', 'freeNights'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
