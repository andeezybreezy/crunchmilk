(function() {
  'use strict';

  // --- Project presets: [name, lengthFt, widthFt, thicknessIn, description] ---
  var presets = [
    ['Single Car Driveway', 20, 10, 2, '10\' x 20\' at 2\"'],
    ['Double Car Driveway', 20, 20, 2, '20\' x 20\' at 2\"'],
    ['Long Driveway', 50, 12, 2.5, '12\' x 50\' at 2.5\"'],
    ['Small Parking Lot', 100, 50, 3, '50\' x 100\' at 3\"'],
    ['Large Parking Lot', 200, 100, 3, '100\' x 200\' at 3\"'],
    ['Walkway / Path', 30, 4, 2, '4\' x 30\' at 2\"']
  ];

  // --- Chart data ---
  var chartData = [
    ['1 inch', '0.06', '0.60', 'Overlay / patch'],
    ['1.5 inches', '0.09', '0.91', 'Thin overlay'],
    ['2 inches', '0.12', '1.21', 'Residential driveway'],
    ['2.5 inches', '0.15', '1.51', 'Heavy-use driveway'],
    ['3 inches', '0.18', '1.81', 'Parking lot'],
    ['4 inches', '0.24', '2.42', 'Commercial'],
    ['6 inches', '0.36', '3.63', 'Road base']
  ];

  // --- Helper: format number with commas ---
  function fmt(n, decimals) {
    if (typeof decimals === 'undefined') decimals = 2;
    var parts = n.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    return '$' + fmt(n, 0).replace(/\..*/, '');
  }

  // --- DOM refs ---
  var lengthInput = document.getElementById('lengthFt');
  var widthInput = document.getElementById('widthFt');
  var areaSqftInput = document.getElementById('areaSqft');
  var thicknessSelect = document.getElementById('thickness');
  var customThicknessWrap = document.getElementById('customThicknessWrap');
  var customThicknessInput = document.getElementById('customThickness');
  var asphaltTypeSelect = document.getElementById('asphaltType');
  var wasteSelect = document.getElementById('wasteFactor');
  var priceMaterialInput = document.getElementById('priceMaterial');
  var priceInstalledInput = document.getElementById('priceInstalled');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rTons = document.getElementById('rTons');
  var rTonsWaste = document.getElementById('rTonsWaste');
  var resultDetails = document.getElementById('resultDetails');

  var areaMode = 'rect'; // 'rect' or 'sqft'

  // --- Area input mode toggle ---
  var areaToggle = document.getElementById('areaToggle');
  var areaToggleBtns = areaToggle.querySelectorAll('button');
  var rectInputs = document.getElementById('rectInputs');
  var sqftInputDiv = document.getElementById('sqftInput');

  areaToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      areaToggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      areaMode = btn.dataset.mode;
      if (areaMode === 'rect') {
        rectInputs.style.display = '';
        sqftInputDiv.style.display = 'none';
      } else {
        rectInputs.style.display = 'none';
        sqftInputDiv.style.display = '';
      }
      calculate();
    });
  });

  // --- Custom thickness toggle ---
  thicknessSelect.addEventListener('change', function() {
    if (thicknessSelect.value === 'custom') {
      customThicknessWrap.style.display = '';
      customThicknessInput.focus();
    } else {
      customThicknessWrap.style.display = 'none';
    }
    calculate();
  });

  // --- Render presets ---
  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p[0] + '<span>' + p[4] + '</span>';
    btn.addEventListener('click', function() {
      // Switch to rect mode
      areaMode = 'rect';
      areaToggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      areaToggleBtns[0].classList.add('active');
      areaToggleBtns[0].setAttribute('aria-pressed', 'true');
      rectInputs.style.display = '';
      sqftInputDiv.style.display = 'none';

      // Fill values
      lengthInput.value = p[1];
      widthInput.value = p[2];

      // Set thickness
      var thickVal = String(p[3]);
      var found = false;
      for (var i = 0; i < thicknessSelect.options.length; i++) {
        if (thicknessSelect.options[i].value === thickVal) {
          thicknessSelect.value = thickVal;
          customThicknessWrap.style.display = 'none';
          found = true;
          break;
        }
      }
      if (!found) {
        thicknessSelect.value = 'custom';
        customThicknessWrap.style.display = '';
        customThicknessInput.value = p[3];
      }

      calculate();
    });
    presetGrid.appendChild(btn);
  });

  // --- Render chart ---
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // --- Core calculation ---
  function calculate() {
    // Get area
    var area;
    if (areaMode === 'rect') {
      var len = parseFloat(lengthInput.value);
      var wid = parseFloat(widthInput.value);
      if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) {
        hideResult();
        return;
      }
      area = len * wid;
    } else {
      area = parseFloat(areaSqftInput.value);
      if (isNaN(area) || area <= 0) {
        hideResult();
        return;
      }
    }

    // Get thickness
    var thicknessIn;
    if (thicknessSelect.value === 'custom') {
      thicknessIn = parseFloat(customThicknessInput.value);
    } else {
      thicknessIn = parseFloat(thicknessSelect.value);
    }
    if (isNaN(thicknessIn) || thicknessIn <= 0) {
      hideResult();
      return;
    }

    // Density
    var density = parseFloat(asphaltTypeSelect.value); // lbs per cubic foot

    // Waste factor
    var wastePct = parseFloat(wasteSelect.value) / 100;

    // Pricing
    var priceMat = parseFloat(priceMaterialInput.value) || 85;
    var priceInst = parseFloat(priceInstalledInput.value) || 150;

    // --- Formulas ---
    var volumeCuFt = area * thicknessIn / 12;
    var volumeCuYd = volumeCuFt / 27;
    var weightLbs = volumeCuFt * density;
    var weightTons = weightLbs / 2000;
    var weightTonsWaste = weightTons * (1 + wastePct);

    // Costs
    var costMatLow = weightTonsWaste * 40;
    var costMatHigh = weightTonsWaste * 80;
    var costMatCustom = weightTonsWaste * priceMat;
    var costInstLow = weightTonsWaste * 100;
    var costInstHigh = weightTonsWaste * 200;
    var costInstCustom = weightTonsWaste * priceInst;

    // Truckloads
    var truckloads = weightTonsWaste / 20;

    // --- Display results ---
    rTons.textContent = fmt(weightTons) + ' tons';
    if (wastePct > 0) {
      rTonsWaste.textContent = fmt(weightTonsWaste) + ' tons';
      rTonsWaste.parentElement.style.display = '';
    } else {
      rTonsWaste.parentElement.style.display = 'none';
    }

    var details = '';
    details += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';

    details += '<div><strong>Area</strong><br>' + fmt(area, 0) + ' sq ft</div>';
    details += '<div><strong>Thickness</strong><br>' + fmt(thicknessIn, 1).replace(/\.0$/, '') + ' inches</div>';

    details += '<div><strong>Volume</strong><br>' + fmt(volumeCuFt, 1) + ' cu ft (' + fmt(volumeCuYd, 2) + ' cu yd)</div>';
    details += '<div><strong>Weight</strong><br>' + fmt(weightLbs, 0) + ' lbs (' + fmt(weightTons, 2) + ' tons)</div>';

    if (wastePct > 0) {
      details += '<div><strong>With ' + (wastePct * 100) + '% Waste</strong><br>' + fmt(weightTonsWaste, 2) + ' tons (' + fmt(weightTonsWaste * 2000, 0) + ' lbs)</div>';
    }

    details += '<div><strong>Truckloads</strong><br>' + (truckloads < 1 ? 'Less than 1' : fmt(Math.ceil(truckloads), 0)) + ' <span style="font-size:0.8rem;color:var(--text-light)">(20-ton trucks)</span></div>';

    details += '</div>';

    // Cost section
    details += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    details += '<strong style="font-size:0.95rem">Cost Estimates</strong>';
    details += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem;margin-top:8px">';

    details += '<div><strong>Material Only</strong><br>';
    details += fmtDollars(costMatCustom) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + priceMat + '/ton</span><br>';
    details += '<span style="font-size:0.8rem;color:var(--text-light)">Range: ' + fmtDollars(costMatLow) + ' – ' + fmtDollars(costMatHigh) + '</span></div>';

    details += '<div><strong>Installed</strong><br>';
    details += fmtDollars(costInstCustom) + ' <span style="font-size:0.8rem;color:var(--text-light)">at $' + priceInst + '/ton</span><br>';
    details += '<span style="font-size:0.8rem;color:var(--text-light)">Range: ' + fmtDollars(costInstLow) + ' – ' + fmtDollars(costInstHigh) + '</span></div>';

    details += '</div></div>';

    resultDetails.innerHTML = details;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  // --- Button click ---
  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // --- Live calculation on input ---
  var liveInputs = [lengthInput, widthInput, areaSqftInput, customThicknessInput, priceMaterialInput, priceInstalledInput];
  liveInputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          calculate();
          if (resultEl.classList.contains('visible')) {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    }
  });

  var liveSelects = [thicknessSelect, asphaltTypeSelect, wasteSelect];
  liveSelects.forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });

})();
