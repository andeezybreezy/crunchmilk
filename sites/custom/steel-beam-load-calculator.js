(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var beamSize = document.getElementById('beamSize').value;
    var span = parseFloat(document.getElementById('span').value) || 0;
    var loadType = document.getElementById('loadType').value;

    // Calculation logic
    var beams = {'W8x18':{Sx:15.2,Ix:61.9,w:18},'W8x31':{Sx:27.5,Ix:110,w:31},'W10x22':{Sx:23.2,Ix:118,w:22},'W10x33':{Sx:35.0,Ix:171,w:33},'W12x26':{Sx:33.4,Ix:204,w:26},'W12x40':{Sx:51.5,Ix:310,w:40},'W14x30':{Sx:42.0,Ix:291,w:30},'W14x48':{Sx:70.3,Ix:485,w:48}}; var b = beams[beamSize] || beams['W10x22']; var Fb = 24000; var moment = b.Sx * Fb; var maxLbs = 0; if (loadType === 'uniform') { maxLbs = (8 * moment) / (span * 12); } else { maxLbs = (4 * moment) / (span * 12); } var deflIn = 0; var E = 29000000; if (loadType === 'uniform') { deflIn = (5 * maxLbs * Math.pow(span * 12, 3)) / (384 * E * b.Ix); } else { deflIn = (maxLbs * Math.pow(span * 12, 3)) / (48 * E * b.Ix); } document.getElementById('maxLoad').textContent = fmt(Math.round(maxLbs), 0) + ' lbs'; document.getElementById('momentCapacity').textContent = fmt(Math.round(moment / 12), 0) + ' ft-lbs'; document.getElementById('beamWeight').textContent = b.w + ' lbs/ft'; document.getElementById('deflection').textContent = fmt(deflIn, 3);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['beamSize', 'span', 'loadType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
