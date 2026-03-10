(function() {
  'use strict';

  var chartData = [
    ['Light Lager', '1.028-1.040', '0.998-1.008', '2.8-4.2%', '75-85%'],
    ['American Pale Ale', '1.045-1.060', '1.010-1.015', '4.5-6.2%', '72-80%'],
    ['IPA', '1.056-1.070', '1.008-1.014', '5.5-7.5%', '75-82%'],
    ['Wheat Beer', '1.044-1.052', '1.008-1.014', '4.3-5.6%', '72-80%'],
    ['Porter', '1.040-1.052', '1.012-1.016', '4.0-5.4%', '65-75%'],
    ['Stout', '1.036-1.052', '1.007-1.014', '3.8-5.0%', '72-78%'],
    ['Belgian Tripel', '1.075-1.085', '1.008-1.014', '7.5-9.5%', '82-88%'],
    ['Imperial Stout', '1.075-1.115', '1.018-1.030', '8.0-12.0%', '70-80%'],
    ['Barleywine', '1.080-1.120', '1.018-1.030', '8.0-12.0%', '72-80%'],
    ['Session IPA', '1.035-1.045', '1.006-1.012', '3.5-5.0%', '75-82%']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Convert SG to Plato using the polynomial approximation
  function sgToPlato(sg) {
    return -616.868 + 1111.14 * sg - 630.272 * sg * sg + 135.997 * sg * sg * sg;
  }

  function calculate() {
    var og = parseFloat(document.getElementById('og').value);
    var fg = parseFloat(document.getElementById('fg').value);

    if (isNaN(og) || isNaN(fg) || og <= 1.000 || fg <= 0.990 || fg >= og) return;

    // Standard formula: ABV = (OG - FG) * 131.25
    var abvStandard = (og - fg) * 131.25;

    // Alternate formula (more accurate for high gravity)
    // ABV = (76.08 * (OG - FG) / (1.775 - OG)) * (FG / 0.794)
    var abvAlternate = (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);

    // Apparent attenuation: ((OG - FG) / (OG - 1)) * 100
    var attenuation = ((og - fg) / (og - 1.0)) * 100;

    // Calories per 12 oz (355 ml) — simplified Daniels formula
    // Cal = (6.9 * ABW + 4.0 * (RE - 0.1)) * FG * 3.55
    // ABW = ABV * 0.79336
    // RE (Real Extract) = 0.1808 * OGPlato + 0.8192 * FGPlato
    var ogPlato = sgToPlato(og);
    var fgPlato = sgToPlato(fg);
    var realExtract = 0.1808 * ogPlato + 0.8192 * fgPlato;
    var abw = abvStandard * 0.79336;
    var calories = Math.round((6.9 * abw + 4.0 * (realExtract - 0.1)) * fg * 3.55);

    document.getElementById('abvStandard').textContent = abvStandard.toFixed(2) + '%';
    document.getElementById('abvAlternate').textContent = abvAlternate.toFixed(2) + '%';
    document.getElementById('attenuation').textContent = attenuation.toFixed(1) + '%';
    document.getElementById('calories').textContent = calories + ' cal';
    document.getElementById('ogPlato').textContent = ogPlato.toFixed(1) + '°P';
    document.getElementById('fgPlato').textContent = fgPlato.toFixed(1) + '°P';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('og').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
  document.getElementById('fg').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
