(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var words = parseFloat(document.getElementById('words').value) || 0;
    var sentences = parseFloat(document.getElementById('sentences').value) || 0;
    var syllables = parseFloat(document.getElementById('syllables').value) || 0;

    // Calculation logic
    var asl = words / sentences; var asw = syllables / words; var grade = 0.39 * asl + 11.8 * asw - 15.59; var ease = 206.835 - 1.015 * asl - 84.6 * asw; var aud = ease >= 80 ? '5th Grade (Easy)' : ease >= 60 ? '8th-9th Grade (Standard)' : ease >= 40 ? 'College (Somewhat Difficult)' : ease >= 20 ? 'College Graduate (Difficult)' : 'Professional (Very Difficult)'; document.getElementById('gradeLevel').textContent = fmt(Math.max(0, grade), 1); document.getElementById('readingEase').textContent = fmt(Math.max(0, Math.min(100, ease)), 1) + ' / 100'; document.getElementById('audience').textContent = aud; document.getElementById('avgSentLen').textContent = fmt(asl, 1) + ' words/sentence';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['words', 'sentences', 'syllables'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
