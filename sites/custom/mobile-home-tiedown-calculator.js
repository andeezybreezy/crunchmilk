(function() {
  'use strict';

  var chartData = [
    ['Frame Tie Spacing', '8\' max', '6\' max', '4\' max'],
    ['Frame Ties/Side', '7', '10', '14'],
    ['Over-Top Ties', '7', '10', '14'],
    ['Min Anchor Capacity', '4,725 lbs', '4,725 lbs', '4,725 lbs'],
    ['Strap Rating', '4,725 lbs', '4,725 lbs', '4,725 lbs'],
    ['Ground Anchor Type', 'Auger/Screw', 'Auger/Concrete', 'Concrete required'],
    ['Inspection Required', 'Varies by state', 'Yes', 'Yes']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Max spacing in feet by wind zone
  var zoneSpacing = { '1': 8, '2': 6, '3': 4 };
  var zoneAnchorCap = { '1': 4725, '2': 4725, '3': 4725 };

  function calculate() {
    var homeLength = parseFloat(document.getElementById('homeLength').value);
    var homeWidth = parseFloat(document.getElementById('homeWidth').value);
    var windZone = document.getElementById('windZone').value;
    var roofType = document.getElementById('roofType').value;

    if (isNaN(homeLength) || homeLength <= 0) return;

    var maxSpacing = zoneSpacing[windZone];
    var anchorCap = zoneAnchorCap[windZone];

    // Frame ties per side: home length / spacing, minimum 2
    var frameTiesPerSide = Math.max(2, Math.ceil(homeLength / maxSpacing) + 1);
    var totalFrameTies = frameTiesPerSide * 2;

    // Over-the-top ties: same spacing as frame ties for uplift resistance
    // Pitched roofs in high wind zones may need more
    var otTies = Math.ceil(homeLength / maxSpacing) + 1;
    if (roofType === 'pitched' && windZone !== '1') {
      otTies = Math.ceil(otTies * 1.2);
    }

    // Each frame tie needs 1 anchor; each over-top tie needs 2 anchors (one each side)
    var totalAnchors = totalFrameTies + (otTies * 2);

    document.getElementById('frameTies').textContent = frameTiesPerSide;
    document.getElementById('totalFrameTies').textContent = totalFrameTies;
    document.getElementById('otTies').textContent = otTies;
    document.getElementById('totalAnchors').textContent = totalAnchors;
    document.getElementById('spacing').textContent = maxSpacing + ' ft (Zone ' + windZone + ')';
    document.getElementById('anchorCap').textContent = anchorCap.toLocaleString() + ' lbs';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('homeLength').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
