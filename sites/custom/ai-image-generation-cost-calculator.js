(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var service = document.getElementById('service').value;
    var imagesPerDay = parseFloat(document.getElementById('imagesPerDay').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;

    // Calculation logic
    var totalImages=imagesPerDay*days; var costPerImg={dalle3:0.04,dalle3hd:0.08,midjourney:10/200,sdapi:0.02}; var cost=costPerImg[service]||0.04; var monthlyCost; if(service==='midjourney'){monthlyCost=totalImages<=200?10:10+((totalImages-200)*0.05);cost=monthlyCost/totalImages;}else{monthlyCost=totalImages*cost;}     document.getElementById('totalImages').textContent = fmt(totalImages,0);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('costPerImage').textContent = '$'+fmt(cost,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['service', 'imagesPerDay', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
