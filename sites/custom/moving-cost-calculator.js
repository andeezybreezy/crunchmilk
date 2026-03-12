(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var moveType = document.getElementById('moveType').value;
    var homeSize = document.getElementById('homeSize').value;
    var diy = document.getElementById('diy').value;

    // Calculation logic
    var base = {studio:{local:{diy:200,partial:400,full:800},long:{diy:600,partial:1500,full:2500},cross:{diy:1200,partial:2500,full:4000}},'2br':{local:{diy:400,partial:800,full:1500},long:{diy:1000,partial:2500,full:4500},cross:{diy:2000,partial:4000,full:7000}},'4br':{local:{diy:600,partial:1200,full:2500},long:{diy:1500,partial:3500,full:7500},cross:{diy:3000,partial:6000,full:12000}}}; var b = ((base[homeSize]||base['2br'])[moveType]||{})[diy]||2000; document.getElementById('estCost').textContent = dollar(b); document.getElementById('lowRange').textContent = dollar(b * 0.75); document.getElementById('highRange').textContent = dollar(b * 1.35);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['moveType', 'homeSize', 'diy'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
