(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var experience = document.getElementById('experience').value;
    var goal = document.getElementById('goal').value;

    // Calculation logic
    var times = {beginner:{stress:5,focus:5,sleep:10,anxiety:5,spiritual:10},some:{stress:10,focus:15,sleep:15,anxiety:10,spiritual:15},regular:{stress:15,focus:20,sleep:15,anxiety:15,spiritual:25},advanced:{stress:20,focus:30,sleep:20,anxiety:20,spiritual:45}}; var mins = ((times[experience]||times.beginner)[goal])||10; document.getElementById('recTime').textContent = mins + ' minutes/day'; document.getElementById('weeklyTotal').textContent = (mins * 7) + ' minutes/week'; var notes = {stress:'8 weeks of daily meditation reduces cortisol by 23% (JAMA study).',focus:'Just 10 min/day improves attention span within 2 weeks (University of Waterloo).',sleep:'Mindfulness meditation improves sleep quality comparable to sleep medication (JAMA Internal Medicine).',anxiety:'MBSR programs (8 weeks) reduce anxiety as effectively as medication for some people.',spiritual:'Experienced meditators show measurable brain changes in compassion and empathy regions.'}; document.getElementById('scienceNote').textContent = notes[goal] || '';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['experience', 'goal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
