(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
    var guestCount = parseFloat(document.getElementById('guestCount').value) || 0;
    var region = document.getElementById('region').value;

    // Calculation logic
    var factor = parseFloat(region);
    var adjusted = totalBudget;
    var venue = adjusted * 0.45;
    var photo = adjusted * 0.12;
    var floral = adjusted * 0.08;
    var music = adjusted * 0.07;
    var attire = adjusted * 0.08;
    var perGuest = adjusted / guestCount;
    document.getElementById('venueFood').textContent = dollar(venue);
    document.getElementById('photoVideo').textContent = dollar(photo);
    document.getElementById('flowers').textContent = dollar(floral);
    document.getElementById('music').textContent = dollar(music);
    document.getElementById('attire').textContent = dollar(attire);
    document.getElementById('perGuest').textContent = dollar(perGuest) + '/guest (industry avg: ' + dollar(200 * factor) + ')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalBudget', 'guestCount', 'region'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
