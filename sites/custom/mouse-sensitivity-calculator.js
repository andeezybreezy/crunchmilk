(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dpi = parseFloat(document.getElementById('dpi').value) || 0;
    var gameSens = parseFloat(document.getElementById('gameSens').value) || 0;
    var targetGame = document.getElementById('targetGame').value;

    // Calculation logic
    var edpi=dpi*gameSens; var multipliers={csgo:1,valorant:3.18,apex:1/3.18,overwatch:10.6,fortnite:2.5}; var converted=gameSens/multipliers[targetGame]; var cm360=360/(edpi*0.022);     document.getElementById('edpi').textContent = fmt(edpi,0);
    document.getElementById('converted').textContent = fmt(converted, 2)+' in-game sens';
    document.getElementById('cm360').textContent = fmt(cm360,1)+' cm/360°';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dpi', 'gameSens', 'targetGame'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
