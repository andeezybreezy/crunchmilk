(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var region = document.getElementById('region').value;
    var disruption = parseFloat(document.getElementById('disruption').value) || 0;

    // Calculation logic
    var data = {eu: {lng: 270, demand: 400, pipeline: 200}, japan: {lng: 210, demand: 100, pipeline: 0}, china: {lng: 120, demand: 380, pipeline: 80}, india: {lng: 60, demand: 65, pipeline: 0}, 'south-korea': {lng: 90, demand: 55, pipeline: 0}, uk: {lng: 50, demand: 80, pipeline: 40}}; var d = data[v.region]; var pipelineLost = d.pipeline * (v.disruption / 100); var nonPipeline = d.demand - d.pipeline; var needed = nonPipeline + pipelineLost; var coverage = Math.min(100, (d.lng / needed * 100)); var deficit = d.lng - needed; return {lngCapacity: d.lng + ' bcm/year', totalDemand: d.demand + ' bcm/year', pipelineGap: Math.round(pipelineLost) + ' bcm lost', canLngCover: coverage.toFixed(0) + '% of non-pipeline demand', deficit: deficit > 0 ? 'Surplus: ' + deficit + ' bcm' : 'Deficit: ' + Math.abs(Math.round(deficit)) + ' bcm'};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['region', 'disruption'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
