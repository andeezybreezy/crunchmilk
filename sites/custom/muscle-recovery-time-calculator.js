(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var muscleGroup = document.getElementById('muscleGroup').value;
    var intensity = document.getElementById('intensity').value;
    var experience = document.getElementById('experience').value;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var sleepHours = parseFloat(document.getElementById('sleepHours').value) || 0;

    // Calculation logic
    var baseHours = {chest:{light:36,moderate:48,heavy:72,extreme:96},back:{light:36,moderate:48,heavy:72,extreme:96},legs:{light:48,moderate:60,heavy:84,extreme:108},shoulders:{light:24,moderate:36,heavy:60,extreme:72},arms:{light:24,moderate:36,heavy:48,extreme:60},core:{light:24,moderate:36,heavy:48,extreme:60}}; var base = baseHours[muscleGroup] ? baseHours[muscleGroup][intensity] || 48 : 48; var expMult = experience === 'beginner' ? 1.3 : experience === 'advanced' ? 0.85 : 1.0; var ageMult = age > 50 ? 1.3 : age > 40 ? 1.15 : age > 30 ? 1.05 : 1.0; var sleepMult = sleepHours < 6 ? 1.3 : sleepHours < 7 ? 1.1 : sleepHours >= 8 ? 0.9 : 1.0; var opt = Math.round(base * expMult * ageMult * sleepMult); var min = Math.round(opt * 0.7); var days = Math.ceil(opt / 24); var tipText = sleepHours < 7 ? 'Prioritize sleep — it is the #1 recovery factor' : intensity === 'extreme' ? 'Consider active recovery (walking, light stretching) on rest days' : experience === 'beginner' ? 'Your body is still adapting — do not skip rest days' : 'Good recovery window — stay hydrated and eat enough protein'; document.getElementById('minRecovery').textContent = min + ' hrs'; document.getElementById('optRecovery').textContent = opt + ' hrs'; document.getElementById('nextWorkout').textContent = days + ' day' + (days > 1 ? 's' : ''); document.getElementById('tips').textContent = tipText;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['muscleGroup', 'intensity', 'experience', 'age', 'sleepHours'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
