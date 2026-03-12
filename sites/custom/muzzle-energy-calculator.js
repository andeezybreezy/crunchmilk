(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bulletWeight = parseFloat(document.getElementById('bulletWeight').value) || 0;
    var velocity = parseFloat(document.getElementById('velocity').value) || 0;
    var bulletDia = parseFloat(document.getElementById('bulletDia').value) || 0;

    // Calculation logic
    var weightLbs = bulletWeight / 7000;
    var energy = (bulletWeight * velocity * velocity) / 450240;
    var momentum = weightLbs * velocity;
    var pf = (bulletWeight * velocity) / 1000;
    var tko = (bulletWeight * velocity * bulletDia) / 7000;
    document.getElementById('energy').textContent = fmt(energy, 0) + ' ft-lbs (' + fmt(energy * 1.356, 0) + ' joules)';
    document.getElementById('momentum').textContent = fmt(momentum, 2) + ' lb·ft/s';
    document.getElementById('powerFactor').textContent = fmt(pf, 1) + (pf >= 165 ? ' (Major)' : pf >= 125 ? ' (Minor)' : ' (Below minimum)');
    document.getElementById('taylorKO').textContent = fmt(tko, 1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bulletWeight', 'velocity', 'bulletDia'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
