(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hopOz = parseFloat(document.getElementById('hopOz').value) || 0;
    var alphaAcid = parseFloat(document.getElementById('alphaAcid').value) || 0;
    var boilTime = parseFloat(document.getElementById('boilTime').value) || 0;
    var batchGal = parseFloat(document.getElementById('batchGal').value) || 0;
    var gravity = parseFloat(document.getElementById('gravity').value) || 0;

    // Calculation logic
    var util=(1.65*Math.pow(0.000125,(gravity-1)))*((1-Math.pow(Math.E,-0.04*boilTime))/4.15); var ibu=(hopOz*alphaAcid*util*7489)/(batchGal*100); var style=ibu>60?'Very Bitter (IPA/DIPA)':ibu>40?'Bitter (Pale Ale/IPA)':ibu>25?'Moderate (Amber/ESB)':ibu>15?'Mild (Wheat/Lager)':'Very Low (Light Lager)'; return {ibu:fmt(ibu,1)+' IBU', utilization:fmt(util*100,1)+'%', style:style};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hopOz', 'alphaAcid', 'boilTime', 'batchGal', 'gravity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
