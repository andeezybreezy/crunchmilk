(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var collegeTuition = parseFloat(document.getElementById('collegeTuition').value) || 0;
    var tradeCost = parseFloat(document.getElementById('tradeCost').value) || 0;
    var collegeStartSalary = parseFloat(document.getElementById('collegeStartSalary').value) || 0;
    var tradeStartSalary = parseFloat(document.getElementById('tradeStartSalary').value) || 0;
    var directStartSalary = parseFloat(document.getElementById('directStartSalary').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) || 0;

    // Calculation logic
    var collegeGrowth = 0.035; var tradeGrowth = 0.025; var directGrowth = 0.02; var collegeMonthlyRate = (loanRate / 100) / 12; var collegeLoanPayment = collegeTuition * (collegeMonthlyRate * Math.pow(1 + collegeMonthlyRate, 120)) / (Math.pow(1 + collegeMonthlyRate, 120) - 1); var collegeTotalLoan = collegeLoanPayment * 120; var tradeMonthlyRate = (loanRate / 100) / 12; var tradeLoanPayment = tradeCost * (tradeMonthlyRate * Math.pow(1 + tradeMonthlyRate, 60)) / (Math.pow(1 + tradeMonthlyRate, 60) - 1); var tradeTotalLoan = tradeLoanPayment * 60; var collegeEarnings = 0; var tradeEarnings = 0; var directEarnings = 0; var collegeSalary = collegeStartSalary; var tradeSalary = tradeStartSalary; var directSalary = directStartSalary; var collegeBreak = 0; var directCumulative = 0; var collegeCumulative = 0; for (var yr = 1; yr <= 30; yr++) { if (yr <= 4) { directEarnings += directSalary; directSalary *= (1 + directGrowth); if (yr <= 2) { tradeEarnings -= tradeCost / 2; } else { tradeEarnings += tradeSalary; tradeSalary *= (1 + tradeGrowth); } collegeEarnings -= collegeTuition / 4; } else { directEarnings += directSalary; directSalary *= (1 + directGrowth); tradeEarnings += tradeSalary; tradeSalary *= (1 + tradeGrowth); collegeEarnings += collegeSalary; collegeSalary *= (1 + collegeGrowth); if (yr <= 14) { collegeEarnings -= collegeLoanPayment * 12; } if (yr <= 9) { tradeEarnings -= tradeLoanPayment * 12; } } directCumulative = directEarnings; collegeCumulative = collegeEarnings; if (collegeBreak === 0 && collegeCumulative > directCumulative) { collegeBreak = yr; } } document.getElementById('college30yr').textContent = '$' + collegeEarnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('trade30yr').textContent = '$' + tradeEarnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('direct30yr').textContent = '$' + directEarnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('collegeBreakeven').textContent = collegeBreak > 0 ? 'Year ' + collegeBreak : 'Not within 30 years'; document.getElementById('collegeLoanTotal').textContent = '$' + collegeTotalLoan.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('tradeLoanTotal').textContent = '$' + tradeTotalLoan.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); var best = 'College'; var bestVal = collegeEarnings; var worst = directEarnings; if (tradeEarnings > bestVal) { best = 'Trade School'; bestVal = tradeEarnings; } if (directEarnings > bestVal) { best = 'Direct Workforce'; bestVal = directEarnings; } if (collegeEarnings < tradeEarnings && collegeEarnings < directEarnings) worst = collegeEarnings; if (tradeEarnings < collegeEarnings && tradeEarnings < directEarnings) worst = tradeEarnings; var diff = bestVal - worst; document.getElementById('bestPath').textContent = best; document.getElementById('earningsDiff').textContent = '$' + diff.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['collegeTuition', 'tradeCost', 'collegeStartSalary', 'tradeStartSalary', 'directStartSalary', 'loanRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
