(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var destination = document.getElementById('destination').value;
    var applicants = parseFloat(document.getElementById('applicants').value) || 0;
    var processing = document.getElementById('processing').value;

    // Calculation logic
    var fees = {'schengen':80,'uk':130,'australia':15,'china':140,'india':100,'brazil':80,'japan':0,'canada':7};
    var times = {'schengen':'15 business days','uk':'3-6 weeks','australia':'1-3 days','china':'4-7 business days','india':'5-7 business days','brazil':'10-15 business days','japan':'No visa needed','canada':'Minutes (online)'};
    var baseFee = fees[destination];
    var speedMult = processing === 'standard' ? 1.0 : (processing === 'expedited' ? 1.5 : 2.0);
    var procSurcharge = baseFee * (speedMult - 1);
    var perPerson = baseFee + procSurcharge;
    var total = perPerson * applicants;
    var timeline = times[destination];
    if (processing === 'expedited') timeline = 'Expedited: ~50% faster';
    if (processing === 'rush') timeline = 'Rush: ~75% faster';
    document.getElementById('visaFee').textContent = baseFee === 0 ? 'Free (visa waiver)' : dollar(baseFee);
    document.getElementById('processingFee').textContent = procSurcharge > 0 ? dollar(procSurcharge) + ' per person' : 'None';
    document.getElementById('totalCost').textContent = dollar(total);
    document.getElementById('timeline').textContent = timeline;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['destination', 'applicants', 'processing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
