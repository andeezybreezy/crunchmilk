(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var greenLbs = parseFloat(document.getElementById('greenLbs').value) || 0;
    var brownLbs = parseFloat(document.getElementById('brownLbs').value) || 0;

    // Calculation logic
    var greenCN = 15; var brownCN = 50; var totalN = greenLbs / greenCN + brownLbs / brownCN; var totalC = greenLbs + brownLbs; var ratio = (greenLbs * greenCN + brownLbs * brownCN) / (greenLbs + brownLbs); var eff = ratio; var assess = eff >= 25 && eff <= 35 ? 'Ideal — good composting conditions' : eff < 25 ? 'Too much nitrogen — add more browns' : 'Too much carbon — add more greens'; var adj = eff >= 25 && eff <= 35 ? 'No adjustment needed' : eff < 25 ? 'Add ' + fmt((25 * (greenLbs + brownLbs) - greenLbs * greenCN - brownLbs * brownCN) / (brownCN - 25), 1) + ' lbs more browns' : 'Add ' + fmt(Math.abs((35 * (greenLbs + brownLbs) - greenLbs * greenCN - brownLbs * brownCN) / (greenCN - 35)), 1) + ' lbs more greens'; document.getElementById('ratio').textContent = fmt(eff, 0) + ':1 (C:N)'; document.getElementById('assessment').textContent = assess; document.getElementById('adjustment').textContent = adj;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['greenLbs', 'brownLbs'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
