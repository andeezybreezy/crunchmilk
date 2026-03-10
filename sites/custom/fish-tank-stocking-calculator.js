(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var addFishBtn = document.getElementById('addFishBtn');
  var result = document.getElementById('result');
  var fishListEl = document.getElementById('fishList');

  // Fish entries: [{name, size, bioloadFactor, count}]
  var fishEntries = [];

  function getSpeciesData() {
    var sel = document.getElementById('fishSpecies');
    var parts = sel.value.split('|');
    return {
      name: sel.options[sel.selectedIndex].text,
      size: parseFloat(parts[0]),
      bioloadFactor: parseFloat(parts[1])
    };
  }

  function renderFishList() {
    fishListEl.innerHTML = '';
    fishEntries.forEach(function(entry, i) {
      var div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;margin-bottom:6px;background:#f0f9ff;border-radius:6px;font-size:0.95rem';
      div.innerHTML =
        '<span>' + entry.count + '× ' + entry.name + ' (' + entry.size + '\" each)</span>' +
        '<button type="button" style="background:#dc2626;color:#fff;border:none;border-radius:4px;padding:2px 10px;cursor:pointer;font-size:0.85rem" data-idx="' + i + '">✕</button>';
      div.querySelector('button').addEventListener('click', function() {
        fishEntries.splice(i, 1);
        renderFishList();
        calculate();
      });
      fishListEl.appendChild(div);
    });
  }

  addFishBtn.addEventListener('click', function() {
    var species = getSpeciesData();
    var count = parseInt(document.getElementById('fishCount').value) || 1;
    fishEntries.push({
      name: species.name,
      size: species.size,
      bioloadFactor: species.bioloadFactor,
      count: count
    });
    renderFishList();
    calculate();
  });

  function calculate() {
    var tankGallons = parseFloat(document.getElementById('tankGallons').value) || 0;
    var filterMult = parseFloat(document.getElementById('filterType').value);

    if (tankGallons <= 0) return;

    // Effective capacity in inches (1 inch per gallon × filter multiplier)
    var maxInches = tankGallons * filterMult;

    // Sum total inches and weighted bioload
    var totalInches = 0;
    var totalBioload = 0;
    var totalFish = 0;

    fishEntries.forEach(function(entry) {
      totalInches += entry.size * entry.count;
      totalBioload += entry.size * entry.bioloadFactor * entry.count;
      totalFish += entry.count;
    });

    // Stocking percentage based on bioload-adjusted inches
    // Bioload factor > 1 means messier fish
    var effectiveInches = totalBioload;
    var stockPct = (effectiveInches / maxInches) * 100;
    var remainingInches = maxInches - effectiveInches;

    // Status color
    var color;
    if (stockPct <= 75) color = '#059669';
    else if (stockPct <= 100) color = '#d97706';
    else color = '#dc2626';

    var stockEl = document.getElementById('stockLevel');
    stockEl.textContent = stockPct.toFixed(0) + '%';
    stockEl.style.color = color;

    document.getElementById('totalInches').textContent = totalInches.toFixed(1) + '"';
    document.getElementById('maxInches').textContent = maxInches.toFixed(0) + '" capacity';
    document.getElementById('remaining').textContent = remainingInches > 0
      ? remainingInches.toFixed(1) + '" available'
      : 'OVERSTOCKED by ' + Math.abs(remainingInches).toFixed(1) + '"';
    document.getElementById('remaining').style.color = remainingInches >= 0 ? '' : '#dc2626';

    document.getElementById('bioload').textContent = effectiveInches.toFixed(1) + ' effective inches';
    document.getElementById('fishTotal').textContent = totalFish + ' fish';

    var status;
    if (stockPct <= 50) status = 'Lightly stocked — room for more fish';
    else if (stockPct <= 75) status = 'Moderately stocked — comfortable level';
    else if (stockPct <= 100) status = 'Heavily stocked — monitor water quality closely';
    else status = 'Overstocked — reduce fish or upgrade tank/filtration';
    document.getElementById('resultTip').textContent = status;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.getElementById('tankGallons').addEventListener('input', calculate);
  document.getElementById('filterType').addEventListener('change', calculate);

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var tanks = [10, 20, 29, 40, 55, 75];
    var fishTypes = [
      { name: 'Neon Tetras (1")', size: 1, bio: 0.5 },
      { name: 'Guppies (2")', size: 2, bio: 0.8 },
      { name: 'Corydoras (2")', size: 2, bio: 1 },
      { name: 'Platys (2.5")', size: 2.5, bio: 1 }
    ];
    tanks.forEach(function(gal) {
      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      td0.textContent = gal + ' gallon';
      tr.appendChild(td0);
      fishTypes.forEach(function(f) {
        // Max = (gallons / (size * bioload)) at ~85% stocking
        var max = Math.floor((gal * 0.85) / (f.size * f.bio));
        var low = Math.floor(max * 0.85);
        var td = document.createElement('td');
        td.textContent = low + '-' + max;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
