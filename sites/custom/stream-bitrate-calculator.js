(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var resolution = document.getElementById('resolution').value;
    var fps = document.getElementById('fps').value;
    var platform = document.getElementById('platform').value;
    var uploadSpeed = parseFloat(document.getElementById('uploadSpeed').value) || 0;

    // Calculation logic
    var baseBitrates = {'720':{'30':2500,'60':3500},'1080':{'30':4500,'60':6000},'1440':{'30':9000,'60':12000},'2160':{'30':20000,'60':35000}};
    var platformMax = {'twitch':6000,'youtube':51000,'kick':8000};
    var recBR = baseBitrates[resolution][fps];
    var platMax = platformMax[platform];
    var actualBR = Math.min(recBR, platMax);
    var uploadUsePct = (actualBR / (uploadSpeed * 1000)) * 100;
    var uploadOk = uploadUsePct < 75;
    var quality = actualBR >= recBR ? 'Excellent — full quality for this resolution' : 'Good — platform-limited, still looks great';
    if (!uploadOk) quality = 'WARNING: Using ' + fmt(uploadUsePct, 0) + '% of upload — may cause drops';
    document.getElementById('recBitrate').textContent = fmt(actualBR, 0) + ' kbps (' + fmt(actualBR / 1000, 1) + ' Mbps)';
    document.getElementById('maxBitrate').textContent = fmt(platMax, 0) + ' kbps for ' + platform;
    document.getElementById('uploadUsage').textContent = fmt(uploadUsePct, 1) + '% of ' + fmt(uploadSpeed, 0) + ' Mbps upload' + (uploadOk ? ' (OK)' : ' (TOO HIGH)');
    document.getElementById('quality').textContent = quality;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['resolution', 'fps', 'platform', 'uploadSpeed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
