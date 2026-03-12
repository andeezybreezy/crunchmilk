(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var hasUpper = document.getElementById('hasUpper').value;
    var hasLower = document.getElementById('hasLower').value;
    var hasNumbers = document.getElementById('hasNumbers').value;
    var hasSymbols = document.getElementById('hasSymbols').value;

    // Calculation logic
    var pool = 0; pool += hasUpper === 'Yes' ? 26 : 0; pool += hasLower === 'Yes' ? 26 : 0; pool += hasNumbers === 'Yes' ? 10 : 0; pool += hasSymbols === 'Yes' ? 32 : 0; pool = Math.max(pool, 1); var entropy = Math.log2(Math.pow(pool, length)); var combinations = Math.pow(pool, length); var perSecond = 10000000000; var seconds = combinations / perSecond; var crackTime = seconds < 1 ? 'Instant' : seconds < 60 ? fmt(seconds,0) + ' seconds' : seconds < 3600 ? fmt(seconds/60,0) + ' minutes' : seconds < 86400 ? fmt(seconds/3600,0) + ' hours' : seconds < 31536000 ? fmt(seconds/86400,0) + ' days' : seconds < 3.15e10 ? fmt(seconds/31536000,0) + ' years' : fmt(seconds/31536000,0) + ' years'; var strength = entropy >= 80 ? 'Very Strong' : entropy >= 60 ? 'Strong' : entropy >= 40 ? 'Moderate' : entropy >= 28 ? 'Weak' : 'Very Weak';     document.getElementById('entropy').textContent = fmt(entropy,0);
    document.getElementById('crackTime').textContent = crackTime;
    document.getElementById('strength').textContent = strength;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'hasUpper', 'hasLower', 'hasNumbers', 'hasSymbols'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
