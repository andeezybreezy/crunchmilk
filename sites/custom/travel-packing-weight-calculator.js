(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var clothing = parseFloat(document.getElementById('clothing').value) || 0;
    var shoes = parseFloat(document.getElementById('shoes').value) || 0;
    var toiletries = parseFloat(document.getElementById('toiletries').value) || 0;
    var electronics = parseFloat(document.getElementById('electronics').value) || 0;
    var misc = parseFloat(document.getElementById('misc').value) || 0;
    var bagWeight = parseFloat(document.getElementById('bagWeight').value) || 0;
    var bagType = document.getElementById('bagType').value;

    // Calculation logic
    var avgClothingWeight = 0.6; var avgShoeWeight = 2; var clothingWeight = clothing * avgClothingWeight; var shoeWeight = shoes * avgShoeWeight; var totalWeight = clothingWeight + shoeWeight + toiletries + electronics + misc + bagWeight; var limits = {'Carry-on (22 lb limit)': 22, 'Checked Bag (50 lb limit)': 50, 'Checked Bag (70 lb limit)': 70}; var weightLimit = limits[bagType] || 50; var remaining = weightLimit - totalWeight; var status = remaining >= 10 ? 'Well under limit' : remaining >= 0 ? 'Close to limit' : 'OVER LIMIT by ' + fmt(Math.abs(remaining), 1) + ' lbs';     document.getElementById('totalWeight').textContent = fmt(totalWeight, 1);
    document.getElementById('weightLimit').textContent = fmt(weightLimit, 0);
    document.getElementById('remaining').textContent = fmt(remaining, 1);
    document.getElementById('status').textContent = status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['clothing', 'shoes', 'toiletries', 'electronics', 'misc', 'bagWeight', 'bagType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
