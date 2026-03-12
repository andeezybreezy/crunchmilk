(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgEarnings = parseFloat(document.getElementById('avgEarnings').value) || 0;
    var claimAge = document.getElementById('claimAge').value;
    var birthYear = parseFloat(document.getElementById('birthYear').value) || 0;

    // Calculation logic
    var aime = Math.round(avgEarnings / 12); var pia = 0; if (aime <= 1174) pia = aime * 0.90; else if (aime <= 7078) pia = 1174 * 0.90 + (aime - 1174) * 0.32; else pia = 1174 * 0.90 + (7078 - 1174) * 0.32 + (aime - 7078) * 0.15; pia = Math.round(pia * 10) / 10; var fraAge = birthYear <= 1954 ? 66 : birthYear >= 1960 ? 67 : 66 + (birthYear - 1954) / 6; var ca = parseInt(claimAge); var adjPct = 0; var monthly = pia; if (ca < fraAge) { var monthsEarly = Math.round((fraAge - ca) * 12); var reduction = 0; if (monthsEarly <= 36) reduction = monthsEarly * 0.00556; else reduction = 36 * 0.00556 + (monthsEarly - 36) * 0.00417; monthly = pia * (1 - reduction); adjPct = -Math.round(reduction * 1000) / 10; } else if (ca > fraAge) { var monthsLate = Math.round((ca - fraAge) * 12); var increase = monthsLate * 0.00667; monthly = pia * (1 + increase); adjPct = Math.round(increase * 1000) / 10; } monthly = Math.round(monthly); document.getElementById('monthlyBenefit').textContent = dollar(monthly); document.getElementById('annualBenefit').textContent = dollar(monthly * 12); document.getElementById('pia').textContent = dollar(Math.round(pia)); document.getElementById('fra').textContent = 'Age ' + fmt(fraAge, 1); document.getElementById('adjustment').textContent = (adjPct >= 0 ? '+' : '') + pct(adjPct, 1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgEarnings', 'claimAge', 'birthYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
