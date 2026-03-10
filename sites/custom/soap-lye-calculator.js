(function() {
  'use strict';

  var sapValues = {
    coconut: 0.178, olive: 0.134, palm: 0.141, shea: 0.128,
    castor: 0.128, cocoa: 0.137, avocado: 0.133, sunflower: 0.134,
    sweet_almond: 0.136, lard: 0.138
  };

  var oilEntries = document.getElementById('oilEntries');
  var addOilBtn = document.getElementById('addOilBtn');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function buildOilOptions() {
    var opts = '';
    var names = {
      coconut: 'Coconut Oil', olive: 'Olive Oil', palm: 'Palm Oil',
      shea: 'Shea Butter', castor: 'Castor Oil', cocoa: 'Cocoa Butter',
      avocado: 'Avocado Oil', sunflower: 'Sunflower Oil',
      sweet_almond: 'Sweet Almond Oil', lard: 'Lard'
    };
    for (var key in names) {
      opts += '<option value="' + key + '">' + names[key] + '</option>';
    }
    return opts;
  }

  function addOilRow(defaultOil, defaultWeight) {
    var div = document.createElement('div');
    div.className = 'oil-entry';
    div.style.cssText = 'display:flex;gap:8px;align-items:end;margin-bottom:12px;flex-wrap:wrap';
    div.innerHTML = '<div style="flex:1;min-width:140px"><label>Oil Type</label><select class="oil-select" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:1rem;background:#fff">' + buildOilOptions() + '</select></div>' +
      '<div style="flex:0 0 100px"><label>Weight (oz)</label><input type="number" class="oil-weight" value="' + (defaultWeight || '') + '" min="0" step="0.1" inputmode="decimal" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:1rem"></div>' +
      '<button type="button" class="remove-oil-btn" style="padding:10px 14px;background:#fee2e2;color:#991b1b;border:2px solid #fecaca;border-radius:8px;cursor:pointer;font-weight:700" title="Remove oil">&times;</button>';
    if (defaultOil) div.querySelector('.oil-select').value = defaultOil;
    oilEntries.appendChild(div);
  }

  addOilBtn.addEventListener('click', function() {
    addOilRow('coconut', '');
  });

  oilEntries.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-oil-btn')) {
      var entries = oilEntries.querySelectorAll('.oil-entry');
      if (entries.length > 1) {
        e.target.closest('.oil-entry').remove();
      }
    }
  });

  function calculate() {
    var entries = oilEntries.querySelectorAll('.oil-entry');
    var totalOil = 0;
    var totalLye = 0;

    entries.forEach(function(entry) {
      var oil = entry.querySelector('.oil-select').value;
      var weight = parseFloat(entry.querySelector('.oil-weight').value) || 0;
      totalOil += weight;
      totalLye += weight * (sapValues[oil] || 0);
    });

    if (totalOil <= 0) return;

    var superfat = parseFloat(document.getElementById('superfat').value) || 0;
    var waterRatio = parseFloat(document.getElementById('waterRatio').value) || 2;

    totalLye = totalLye * (1 - superfat / 100);
    var water = totalLye * waterRatio;
    var totalBatch = totalOil + totalLye + water;

    document.getElementById('lyeWeight').textContent = totalLye.toFixed(2) + ' oz (' + (totalLye * 28.3495).toFixed(0) + ' g)';
    document.getElementById('waterWeight').textContent = water.toFixed(2) + ' oz (' + (water * 28.3495).toFixed(0) + ' g)';
    document.getElementById('totalOilWeight').textContent = totalOil.toFixed(2) + ' oz';
    document.getElementById('totalBatchWeight').textContent = totalBatch.toFixed(2) + ' oz (' + (totalBatch / 16).toFixed(2) + ' lbs)';
    document.getElementById('resultTip').textContent = superfat + '% superfat, ' + waterRatio + ':1 water:lye ratio';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  calculate();
})();
