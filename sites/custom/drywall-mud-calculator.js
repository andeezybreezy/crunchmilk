(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sheets = parseFloat(document.getElementById('sheets').value) || 0;
    var coats = parseFloat(document.getElementById('coats').value) || 0;

    // Calculation logic
    var sqFt=sheets*32; var linearFt=sheets*12; var gallonsPerCoat=sqFt/250; var gallons=gallonsPerCoat*coats*1.2; var buckets=Math.ceil(gallons/4.5); var tape=linearFt; return {sqFt:fmt(sqFt,0)+' sq ft', gallons:fmt(gallons,1)+' gallons', buckets:buckets+' bucket'+(buckets>1?'s':''), tape:fmt(tape,0)+' ft'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sheets', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
