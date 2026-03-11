(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgViewers = parseFloat(document.getElementById('avgViewers').value) || 0;
    var subscribers = parseFloat(document.getElementById('subscribers').value) || 0;
    var hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
    var adRate = parseFloat(document.getElementById('adRate').value) || 0;

    // Calculation logic
    var subRevenue=subscribers*2.50; var monthlyHours=hoursPerWeek*4.33; var adImpressions=avgViewers*monthlyHours*2; var adRevenue=(adImpressions/1000)*adRate; var bitsRevenue=avgViewers*0.5; var total=subRevenue+adRevenue+bitsRevenue; var perHour=total/monthlyHours;     document.getElementById('subRevenue').textContent = dollar(subRevenue);
    document.getElementById('adRevenue').textContent = dollar(adRevenue);
    document.getElementById('bitsRevenue').textContent = dollar(bitsRevenue);
    document.getElementById('totalMonthly').textContent = dollar(total);
    document.getElementById('perHour').textContent = dollar(perHour)+'/hour';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgViewers', 'subscribers', 'hoursPerWeek', 'adRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
