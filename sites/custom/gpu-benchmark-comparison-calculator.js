(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gpuTier = document.getElementById('gpuTier').value;
    var resolution = document.getElementById('resolution').value;
    var gameComplexity = document.getElementById('gameComplexity').value;

    // Calculation logic
    var baseFPS = {'budget':90,'mid':130,'high':170,'ultra':220};
    var resScale = {'1080':1.0,'1440':0.65,'2160':0.35};
    var gameScale = {'esports':1.8,'aaa':1.0,'ultra':0.65};
    var fps = baseFPS[gpuTier] * resScale[resolution] * gameScale[gameComplexity];
    var onePctLow = fps * 0.65;
    var smooth = fps >= 144 ? 'Buttery smooth — exceeds 144 Hz' : (fps >= 60 ? 'Good — solid 60+ FPS experience' : (fps >= 30 ? 'Playable — consider lowering settings' : 'Struggling — lower resolution or settings'));
    var rec = '';
    if (fps >= 144) rec = 'Excellent pairing for ' + resolution + 'p gaming';
    else if (fps >= 60) rec = 'Good for ' + resolution + 'p — enable DLSS/FSR for higher FPS';
    else rec = 'Consider ' + (resolution === '2160' ? '1440p' : '1080p') + ' or enable upscaling (DLSS/FSR)';
    document.getElementById('estFPS').textContent = fmt(fps, 0) + ' FPS (estimated)';
    document.getElementById('onePercentLow').textContent = fmt(onePctLow, 0) + ' FPS';
    document.getElementById('smooth').textContent = smooth;
    document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gpuTier', 'resolution', 'gameComplexity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
