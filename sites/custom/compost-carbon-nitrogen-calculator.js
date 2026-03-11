(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var brownLbs = parseFloat(document.getElementById('brownLbs').value) || 0;
    var brownCN = parseFloat(document.getElementById('brownCN').value) || 0;
    var greenLbs = parseFloat(document.getElementById('greenLbs').value) || 0;
    var greenCN = parseFloat(document.getElementById('greenCN').value) || 0;

    // Calculation logic
    var totalCarbon = (brownLbs * brownCN) + (greenLbs * greenCN); var totalNitrogen = brownLbs + greenLbs; var blendRatio = totalCarbon / totalNitrogen; var rating = blendRatio >= 25 && blendRatio <= 35 ? 'Ideal' : blendRatio < 25 ? 'Too much nitrogen - add browns' : 'Too much carbon - add greens'; return {blendRatio: fmt(blendRatio,1), rating: rating};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['brownLbs', 'brownCN', 'greenLbs', 'greenCN'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
