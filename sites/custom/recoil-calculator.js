(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bulletWeight = parseFloat(document.getElementById('bulletWeight').value) || 0;
    var muzzleVelocity = parseFloat(document.getElementById('muzzleVelocity').value) || 0;
    var chargeWeight = parseFloat(document.getElementById('chargeWeight').value) || 0;
    var gunWeight = parseFloat(document.getElementById('gunWeight').value) || 0;

    // Calculation logic
    var bulletLbs = bulletWeight / 7000;
    var chargeLbs = chargeWeight / 7000;
    var gasVelocity = muzzleVelocity * 1.75;
    var recoilVel = ((bulletLbs * muzzleVelocity) + (chargeLbs * gasVelocity)) / gunWeight;
    var recoilE = (gunWeight * recoilVel * recoilVel) / (2 * 32.174);
    var impulse = gunWeight * recoilVel / 32.174;
    var rating;
    if (recoilE < 8) rating = 'Light — comfortable for all shooters';
    else if (recoilE < 15) rating = 'Moderate — manageable for most shooters';
    else if (recoilE < 25) rating = 'Heavy — noticeable recoil, technique important';
    else if (recoilE < 40) rating = 'Very heavy — experienced shooters only';
    else rating = 'Severe — magnum/dangerous game class';
    document.getElementById('recoilVelocity').textContent = fmt(recoilVel, 1) + ' fps';
    document.getElementById('recoilEnergy').textContent = fmt(recoilE, 1) + ' ft-lbs';
    document.getElementById('recoilImpulse').textContent = fmt(impulse, 2) + ' lb-s';
    document.getElementById('rating').textContent = rating;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bulletWeight', 'muzzleVelocity', 'chargeWeight', 'gunWeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
