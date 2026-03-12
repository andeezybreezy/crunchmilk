(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var players = parseFloat(document.getElementById('players').value) || 0;
    var gameType = document.getElementById('gameType').value;
    var hosting = document.getElementById('hosting').value;
    var location = document.getElementById('location').value;

    // Calculation logic
    var ramPerPlayer = {'minecraft':0.1,'fps':0.05,'survival':0.15,'mmo':0.2};
    var cpuPerPlayer = {'minecraft':0.05,'fps':0.03,'survival':0.08,'mmo':0.1};
    var ram = Math.max(2, Math.ceil(players * ramPerPlayer[gameType]));
    var cores = Math.max(2, Math.ceil(players * cpuPerPlayer[gameType]));
    var hostingMult = {'managed':1.5,'vps':1.0,'dedicated':2.0};
    var locMult = {'us':1.0,'eu':1.1,'asia':1.3};
    var baseCost = (ram * 4) + (cores * 8);
    var monthly = baseCost * hostingMult[hosting] * locMult[location];
    monthly = Math.max(monthly, 5);
    document.getElementById('monthlyCost').textContent = dollar(monthly) + '/month';
    document.getElementById('ramNeeded').textContent = fmt(ram, 0) + ' GB RAM';
    document.getElementById('cpuNeeded').textContent = fmt(cores, 0) + ' CPU cores';
    document.getElementById('annualCost').textContent = dollar(monthly * 12) + '/year (' + dollar(monthly * 10) + ' if paid annually)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['players', 'gameType', 'hosting', 'location'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
