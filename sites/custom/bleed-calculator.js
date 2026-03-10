(function() {
  'use strict';

  var chartData = [
    ['Business Card', '3.5" × 2"', '3.75" × 2.25"', '1125 × 675'],
    ['Postcard (4×6)', '6" × 4"', '6.25" × 4.25"', '1875 × 1275'],
    ['Flyer (Letter)', '8.5" × 11"', '8.75" × 11.25"', '2625 × 3375'],
    ['Poster (11×17)', '11" × 17"', '11.25" × 17.25"', '3375 × 5175'],
    ['Brochure (Tri-fold)', '8.5" × 11"', '8.75" × 11.25"', '2625 × 3375'],
    ['Booklet (5.5×8.5)', '5.5" × 8.5"', '5.75" × 8.75"', '1725 × 2625'],
    ['Poster (18×24)', '18" × 24"', '18.25" × 24.25"', '5475 × 7275'],
    ['Banner (2×6 ft)', '24" × 72"', '24.25" × 72.25"', '7275 × 21675']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  document.getElementById('bleedSize').addEventListener('change', function() {
    document.getElementById('customBleedGroup').style.display =
      this.value === 'custom' ? '' : 'none';
  });

  function calculate() {
    var trimW = parseFloat(document.getElementById('trimWidth').value);
    var trimH = parseFloat(document.getElementById('trimHeight').value);
    var bleedSel = document.getElementById('bleedSize').value;
    var bleed = bleedSel === 'custom'
      ? parseFloat(document.getElementById('customBleed').value)
      : parseFloat(bleedSel);
    var safeMargin = parseFloat(document.getElementById('safeMargin').value);

    if (isNaN(trimW) || isNaN(trimH) || isNaN(bleed) || trimW <= 0 || trimH <= 0 || bleed <= 0) return;

    var docW = trimW + 2 * bleed;
    var docH = trimH + 2 * bleed;
    var safeW = trimW - 2 * safeMargin;
    var safeH = trimH - 2 * safeMargin;
    if (safeW < 0) safeW = 0;
    if (safeH < 0) safeH = 0;

    var docWmm = (docW * 25.4).toFixed(1);
    var docHmm = (docH * 25.4).toFixed(1);
    var pxW = Math.round(docW * 300);
    var pxH = Math.round(docH * 300);

    document.getElementById('docSize').textContent = docW.toFixed(3) + '" × ' + docH.toFixed(3) + '"';
    document.getElementById('trimSize').textContent = trimW + '" × ' + trimH + '"';
    document.getElementById('safeZone').textContent = safeW.toFixed(3) + '" × ' + safeH.toFixed(3) + '"';
    document.getElementById('bleedPerSide').textContent = bleed + '"';
    document.getElementById('docMm').textContent = docWmm + ' × ' + docHmm + ' mm';
    document.getElementById('docPixels').textContent = pxW + ' × ' + pxH + ' px';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['trimWidth', 'trimHeight', 'customBleed'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
