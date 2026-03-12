(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var audience = parseFloat(document.getElementById('audience').value) || 0;
    var venueType = document.getElementById('venueType').value;
    var musicType = document.getElementById('musicType').value;

    // Calculation logic
    var baseWatts = audience * 5;
    var venueMultiplier = venueType === 'outdoor' ? 2.5 : (venueType === 'tent' ? 1.5 : 1.0);
    var typeMultiplier = musicType === 'speech' ? 0.5 : (musicType === 'acoustic' ? 0.75 : (musicType === 'band' ? 1.0 : 1.5));
    var totalWatts = baseWatts * venueMultiplier * typeMultiplier;
    var speakerCount = totalWatts <= 1000 ? 2 : (totalWatts <= 4000 ? 4 : (totalWatts <= 10000 ? 6 : 8));
    var perSpk = totalWatts / speakerCount;
    var subCount = musicType === 'speech' ? 0 : (totalWatts <= 2000 ? 1 : (totalWatts <= 6000 ? 2 : 4));
    var targetSPL = musicType === 'speech' ? '85-90 dB' : (musicType === 'acoustic' ? '90-95 dB' : (musicType === 'band' ? '100-105 dB' : '105-110 dB'));
    document.getElementById('wattage').textContent = fmt(totalWatts, 0) + ' watts RMS total';
    document.getElementById('perSpeaker').textContent = fmt(perSpk, 0) + ' W each x ' + speakerCount + ' speakers';
    document.getElementById('subs').textContent = subCount === 0 ? 'Not required for speech' : subCount + ' x 18-inch powered sub(s)';
    document.getElementById('spl').textContent = targetSPL;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['audience', 'venueType', 'musicType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
