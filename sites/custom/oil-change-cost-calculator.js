(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var oilTypeEl = document.getElementById('oilType');
  var oilPriceEl = document.getElementById('oilPriceQt');
  var changeIntervalEl = document.getElementById('changeInterval');

  var defaults = {
    conventional: { price: 4.50, interval: 5000 },
    blend: { price: 6.75, interval: 6000 },
    synthetic: { price: 9.50, interval: 7500 }
  };

  oilTypeEl.addEventListener('change', function() {
    var type = oilTypeEl.value;
    oilPriceEl.value = defaults[type].price.toFixed(2);
    changeIntervalEl.value = defaults[type].interval;
  });

  function calculate() {
    var capacity = f('oilCapacity');
    var pricePerQt = f('oilPriceQt');
    var filterCost = f('filterCost');
    var laborCost = f('laborCost');
    var interval = f('changeInterval');
    var annualMiles = f('annualMiles');

    if (capacity <= 0 || pricePerQt <= 0 || interval <= 0 || annualMiles <= 0) return;

    var oilCost = capacity * pricePerQt;
    var totalPerChange = oilCost + filterCost + laborCost;
    var changesPerYear = annualMiles / interval;
    var annualCost = totalPerChange * changesPerYear;
    var costPerMile = totalPerChange / interval;

    document.getElementById('oilCostOut').textContent = $(oilCost);
    document.getElementById('totalPerChange').textContent = $(totalPerChange);
    document.getElementById('changesPerYear').textContent = changesPerYear.toFixed(1);
    document.getElementById('annualCost').textContent = $(annualCost);
    document.getElementById('costPerMile').textContent = '$' + costPerMile.toFixed(4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['oilCapacity', 'oilPriceQt', 'filterCost', 'laborCost', 'changeInterval', 'annualMiles'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();