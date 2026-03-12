(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var projectType = document.getElementById('projectType').value;
    var yarnWeight = document.getElementById('yarnWeight').value;

    // Calculation logic
    var yards = {'Scarf': {'Lace': 600,'Fingering': 500,'Sport': 400,'Worsted': 300,'Bulky': 200,'Super Bulky': 150}, 'Hat': {'Lace': 400,'Fingering': 300,'Sport': 250,'Worsted': 200,'Bulky': 150,'Super Bulky': 100}, 'Sweater (Adult)': {'Lace': 3000,'Fingering': 2500,'Sport': 2000,'Worsted': 1500,'Bulky': 1200,'Super Bulky': 900}, 'Blanket (Throw)': {'Lace': 4000,'Fingering': 3500,'Sport': 2800,'Worsted': 2200,'Bulky': 1800,'Super Bulky': 1400}, 'Socks (pair)': {'Lace': 500,'Fingering': 400,'Sport': 350,'Worsted': 300,'Bulky': 250,'Super Bulky': 200}, 'Baby Blanket': {'Lace': 1800,'Fingering': 1500,'Sport': 1200,'Worsted': 1000,'Bulky': 800,'Super Bulky': 600}}; var yardage = yards[projectType][yarnWeight] || 500; var skeins = Math.ceil(yardage / 200); var cost = skeins * 8;     document.getElementById('yardage').textContent = fmt(yardage,0);
    document.getElementById('skeins').textContent = fmt(skeins,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['projectType', 'yarnWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
