(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var projectType = document.getElementById('projectType');

  var CU_IN_PER_FL_OZ = 1.805;

  projectType.addEventListener('change', function() {
    var t = projectType.value;
    document.getElementById('rectInputs').style.display = t === 'rectangular' ? '' : 'none';
    document.getElementById('circInputs').style.display = t === 'circular' ? '' : 'none';
    document.getElementById('surfInputs').style.display = t === 'surface' ? '' : 'none';
  });

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var type = projectType.value;
    var depth = val('depth');
    var wastePct = val('wastePct');
    var cubicInches = 0;

    if (type === 'rectangular') {
      cubicInches = val('length') * val('width') * depth;
    } else if (type === 'circular') {
      var r = val('diameter') / 2;
      cubicInches = Math.PI * r * r * depth;
    } else if (type === 'surface') {
      cubicInches = val('surfL') * val('surfW') * depth;
    }

    if (cubicInches <= 0) return;

    // Add waste
    var totalCuIn = cubicInches * (1 + wastePct / 100);

    // Convert cubic inches to fluid ounces
    var flOz = totalCuIn / CU_IN_PER_FL_OZ;
    var cups = flOz / 8;
    var gallons = flOz / 128;
    var liters = gallons * 3.78541;

    // 1:1 mix ratio
    var halfOz = flOz / 2;

    document.getElementById('totalOz').textContent = flOz.toFixed(1) + ' fl oz';
    document.getElementById('totalCups').textContent = cups.toFixed(2) + ' cups';
    document.getElementById('totalGal').textContent = gallons.toFixed(2) + ' gal';
    document.getElementById('totalLiters').textContent = liters.toFixed(2) + ' L';
    document.getElementById('resinPart').textContent = halfOz.toFixed(1) + ' fl oz';
    document.getElementById('hardenerPart').textContent = halfOz.toFixed(1) + ' fl oz';

    document.getElementById('resultTip').textContent =
      'Volume: ' + totalCuIn.toFixed(1) + ' cubic inches (incl. ' + wastePct + '% waste)';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  projectType.addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var projects = [
      { name: 'Coaster (4")', ci: Math.PI * 2 * 2 * 0.5 },
      { name: 'Cutting Board Coat', ci: 18 * 12 * 0.125 },
      { name: 'Small Mold', ci: 12 * 6 * 1 },
      { name: 'Medium River Table', ci: 48 * 6 * 1.5 },
      { name: 'Large River Table', ci: 72 * 8 * 2 },
      { name: 'Table Top Flood', ci: 48 * 24 * 0.125 }
    ];
    var dims = ['4" dia × 0.5"', '18×12 × 1/8"', '12×6 × 1"', '48×6 × 1.5"', '72×8 × 2"', '48×24 × 1/8"'];
    projects.forEach(function(p, i) {
      var oz = p.ci / CU_IN_PER_FL_OZ;
      var gal = oz / 128;
      var tr = document.createElement('tr');
      [p.name, dims[i], p.ci.toFixed(1), oz.toFixed(1) + ' oz', gal.toFixed(2)].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
