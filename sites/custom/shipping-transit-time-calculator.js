(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var zone = document.getElementById('zone').value;
    var service = document.getElementById('service').value;

    // Calculation logic
    var z = parseFloat(zone); var days = {overnight:1, '2day':2, '3day':3, ground: Math.min(z, 2), economy: z + 2}; var d = days[service] || 5; var now = new Date(); var delivery = new Date(now); var biz = 0; while(biz < d) { delivery.setDate(delivery.getDate()+1); if(delivery.getDay()!==0 && delivery.getDay()!==6) biz++; } var opts = {weekday:'long',month:'long',day:'numeric'}; document.getElementById('transitDays').textContent = d + ' business day' + (d>1?'s':''); document.getElementById('deliveryBy').textContent = delivery.toLocaleDateString('en-US', opts); document.getElementById('cutoffTime').textContent = service === 'overnight' ? 'Ship by 2:00 PM today' : service === '2day' ? 'Ship by 5:00 PM today' : 'Ship by end of business today';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['zone', 'service'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
