(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var damage = parseFloat(document.getElementById('damage').value) || 0;
    var attackSpeed = parseFloat(document.getElementById('attackSpeed').value) || 0;
    var critChance = parseFloat(document.getElementById('critChance').value) || 0;
    var critDamage = parseFloat(document.getElementById('critDamage').value) || 0;

    // Calculation logic
    var baseDPS=damage*attackSpeed; var critMult=1+((critChance/100)*(critDamage-1)); var avgHit=damage*critMult; var effectiveDPS=avgHit*attackSpeed; var critDPS=effectiveDPS-baseDPS;     document.getElementById('baseDPS').textContent = fmt(baseDPS,1);
    document.getElementById('effectiveDPS').textContent = fmt(effectiveDPS,1);
    document.getElementById('critDPS').textContent = '+'+fmt(critDPS,1)+' from crits';
    document.getElementById('avgHit').textContent = fmt(avgHit,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['damage', 'attackSpeed', 'critChance', 'critDamage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
