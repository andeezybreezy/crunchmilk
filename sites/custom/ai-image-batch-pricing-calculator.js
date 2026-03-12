(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var images = parseFloat(document.getElementById('images').value) || 0;
    var platform = document.getElementById('platform').value;
    var resolution = document.getElementById('resolution').value;

    // Calculation logic
    var prices = {'DALL-E 3': {'Standard (1024x1024)': 0.04, 'HD (1792x1024)': 0.08, '4K Upscale': 0.12}, 'Midjourney': {'Standard (1024x1024)': 0.02, 'HD (1792x1024)': 0.04, '4K Upscale': 0.06}, 'Stable Diffusion (API)': {'Standard (1024x1024)': 0.002, 'HD (1792x1024)': 0.006, '4K Upscale': 0.01}, 'Adobe Firefly': {'Standard (1024x1024)': 0.03, 'HD (1792x1024)': 0.06, '4K Upscale': 0.10}}; var cpp = prices[platform][resolution] || 0.04; var monthlyCost = cpp * images; var annualCost = monthlyCost * 12;     document.getElementById('costPerImage').textContent = dollar(cpp);
    document.getElementById('monthlyCost').textContent = dollar(monthlyCost);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['images', 'platform', 'resolution'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
