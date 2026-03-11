(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cpuTier = document.getElementById('cpuTier').value;
    var gpuTier = document.getElementById('gpuTier').value;
    var resolution = document.getElementById('resolution').value;

    // Calculation logic
    var cpuScore={budget:40,mid:70,high:90,top:100}; var gpuScore={budget:40,mid:60,high:80,top:100}; var resolutionWeight={1080:0.6,1440:0.4,2160:0.2}; var cpuWeight=resolutionWeight[resolution]; var gpuWeight=1-cpuWeight; var cpuS=cpuScore[cpuTier]; var gpuS=gpuScore[gpuTier]; var cpuImpact=cpuS*cpuWeight; var gpuImpact=gpuS*gpuWeight; var bottleneck=cpuImpact<gpuImpact?'CPU':'GPU'; var diff=Math.abs(cpuImpact-gpuImpact); var severity=diff<10?'Balanced (minimal bottleneck)':diff<25?'Mild '+bottleneck+' bottleneck':'Significant '+bottleneck+' bottleneck'; var fps=Math.round((cpuImpact+gpuImpact)*0.9); var rec=diff<10?'Good balance — no upgrade needed':bottleneck==='CPU'?'Upgrade CPU for better performance':'Upgrade GPU for better performance'; return {bottleneck:bottleneck+' limited', severity:severity, recommendation:rec, estimatedFPS:fps+' FPS (approximate)'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cpuTier', 'gpuTier', 'resolution'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
