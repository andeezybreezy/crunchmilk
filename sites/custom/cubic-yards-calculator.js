(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // Convert any unit to feet
  function toFeet(val, unit) {
    switch(unit) {
      case 'in': return val / 12;
      case 'ft': return val;
      case 'yd': return val * 3;
      case 'm': return val * 3.28084;
      default: return val;
    }
  }

  var shape = 'rect';
  var shapeToggle = document.getElementById('shapeToggle');
  var shapeBtns = shapeToggle.querySelectorAll('button');
  var sections = {
    rect: document.getElementById('rectInputs'),
    cylinder: document.getElementById('cylinderInputs'),
    triangle: document.getElementById('triangleInputs'),
    trapezoid: document.getElementById('trapezoidInputs')
  };

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rYards = document.getElementById('rYards');
  var rFeet = document.getElementById('rFeet');
  var resultDetails = document.getElementById('resultDetails');

  shapeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      shapeBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      shape = btn.dataset.mode;
      Object.keys(sections).forEach(function(k) {
        sections[k].style.display = k === shape ? '' : 'none';
      });
      calculate();
    });
  });

  // Chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var rows = [
      ['1 inch','324','Light topdressing'],['2 inches','162','Mulch refresh / gravel path'],
      ['3 inches','108','New mulch bed'],['4 inches','81','Concrete slab / gravel drive'],
      ['6 inches','54','New lawn topsoil / deep base'],['12 inches','27','Raised beds / deep fill']
    ];
    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(id) { return parseFloat(document.getElementById(id).value); }
  function getUnit(id) { return document.getElementById(id).value; }

  function calculate() {
    var cuFt = NaN;

    if (shape === 'rect') {
      var l = getVal('rLength'), w = getVal('rWidth'), d = getVal('rDepth');
      if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) { hideResult(); return; }
      var lFt = toFeet(l, getUnit('rLengthUnit'));
      var wFt = toFeet(w, getUnit('rWidthUnit'));
      var dFt = toFeet(d, getUnit('rDepthUnit'));
      cuFt = lFt * wFt * dFt;
    } else if (shape === 'cylinder') {
      var dia = getVal('cDia'), cd = getVal('cDepth');
      if (isNaN(dia) || isNaN(cd) || dia <= 0 || cd <= 0) { hideResult(); return; }
      var diaFt = toFeet(dia, getUnit('cDiaUnit'));
      var cdFt = toFeet(cd, getUnit('cDepthUnit'));
      var radius = diaFt / 2;
      cuFt = Math.PI * radius * radius * cdFt;
    } else if (shape === 'triangle') {
      var b = getVal('tBase'), h = getVal('tHeight'), td = getVal('tDepth');
      if (isNaN(b) || isNaN(h) || isNaN(td) || b <= 0 || h <= 0 || td <= 0) { hideResult(); return; }
      var bFt = toFeet(b, getUnit('tBaseUnit'));
      var hFt = toFeet(h, getUnit('tHeightUnit'));
      var tdFt = toFeet(td, getUnit('tDepthUnit'));
      cuFt = 0.5 * bFt * hFt * tdFt;
    } else if (shape === 'trapezoid') {
      var a = getVal('zTop'), zb = getVal('zBottom'), zh = getVal('zHeight'), zl = getVal('zLength');
      if (isNaN(a) || isNaN(zb) || isNaN(zh) || isNaN(zl) || a <= 0 || zb <= 0 || zh <= 0 || zl <= 0) { hideResult(); return; }
      var aFt = toFeet(a, getUnit('zTopUnit'));
      var zbFt = toFeet(zb, getUnit('zBottomUnit'));
      var zhFt = toFeet(zh, getUnit('zHeightUnit'));
      var zlFt = toFeet(zl, getUnit('zLengthUnit'));
      cuFt = 0.5 * (aFt + zbFt) * zhFt * zlFt;
    }

    if (isNaN(cuFt)) { hideResult(); return; }

    var cuYd = cuFt / 27;
    var cuIn = cuFt * 1728;
    var liters = cuFt * 28.3168;
    var cuM = cuFt * 0.0283168;

    rYards.textContent = fmt(cuYd) + ' yd\u00B3';
    rFeet.textContent = fmt(cuFt, 1) + ' ft\u00B3';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Cubic Yards</strong><br>' + fmt(cuYd, 4) + '</div>';
    d += '<div><strong>Cubic Feet</strong><br>' + fmt(cuFt, 2) + '</div>';
    d += '<div><strong>Cubic Inches</strong><br>' + fmt(cuIn, 0) + '</div>';
    d += '<div><strong>Cubic Meters</strong><br>' + fmt(cuM, 4) + '</div>';
    d += '<div><strong>Liters</strong><br>' + fmt(liters, 1) + '</div>';
    d += '<div><strong>Gallons</strong><br>' + fmt(cuFt * 7.48052, 1) + '</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong>Material Weight Estimates (approx)</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.85rem;margin-top:8px">';
    d += '<div>Concrete: ' + fmt(cuYd * 4050, 0) + ' lbs</div>';
    d += '<div>Gravel: ' + fmt(cuYd * 2800, 0) + ' lbs</div>';
    d += '<div>Sand: ' + fmt(cuYd * 2700, 0) + ' lbs</div>';
    d += '<div>Topsoil: ' + fmt(cuYd * 2200, 0) + ' lbs</div>';
    d += '<div>Mulch: ' + fmt(cuYd * 600, 0) + ' lbs</div>';
    d += '<div>Fill dirt: ' + fmt(cuYd * 2000, 0) + ' lbs</div>';
    d += '</div></div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() { resultEl.classList.remove('visible'); resultEl.style.display = 'none'; }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Attach listeners to all inputs and selects
  var allInputs = document.querySelectorAll('.calc-card input[type="number"]');
  var allSelects = document.querySelectorAll('.calc-card select');
  allInputs.forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
  allSelects.forEach(function(sel) {
    sel.addEventListener('change', calculate);
  });
})();
