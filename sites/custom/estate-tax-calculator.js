(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossEstate = parseFloat(document.getElementById('grossEstate').value) || 0;
    var debts = parseFloat(document.getElementById('debts').value) || 0;
    var charitableGifts = parseFloat(document.getElementById('charitableGifts').value) || 0;
    var maritalDeduction = parseFloat(document.getElementById('maritalDeduction').value) || 0;

    // Calculation logic
    var exemption = 13610000; var taxableEstate = Math.max(0, grossEstate - debts - charitableGifts - maritalDeduction); var aboveExempt = Math.max(0, taxableEstate - exemption); var tax = 0; if (aboveExempt > 0) { if (aboveExempt <= 10000) tax = aboveExempt * 0.18; else if (aboveExempt <= 20000) tax = 1800 + (aboveExempt - 10000) * 0.20; else if (aboveExempt <= 40000) tax = 3800 + (aboveExempt - 20000) * 0.22; else if (aboveExempt <= 60000) tax = 8200 + (aboveExempt - 40000) * 0.24; else if (aboveExempt <= 80000) tax = 13000 + (aboveExempt - 60000) * 0.26; else if (aboveExempt <= 100000) tax = 18200 + (aboveExempt - 80000) * 0.28; else if (aboveExempt <= 150000) tax = 23800 + (aboveExempt - 100000) * 0.30; else if (aboveExempt <= 250000) tax = 38800 + (aboveExempt - 150000) * 0.32; else if (aboveExempt <= 500000) tax = 70800 + (aboveExempt - 250000) * 0.34; else if (aboveExempt <= 750000) tax = 155800 + (aboveExempt - 500000) * 0.37; else if (aboveExempt <= 1000000) tax = 248300 + (aboveExempt - 750000) * 0.39; else tax = 345800 + (aboveExempt - 1000000) * 0.40; } var effRate = taxableEstate > 0 ? (tax / taxableEstate) * 100 : 0; document.getElementById('taxableEstate').textContent = dollar(taxableEstate); document.getElementById('exemption').textContent = dollar(exemption); document.getElementById('taxableAbove').textContent = dollar(aboveExempt); document.getElementById('estateTax').textContent = dollar(tax); document.getElementById('effectiveRate').textContent = pct(effRate, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossEstate', 'debts', 'charitableGifts', 'maritalDeduction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
