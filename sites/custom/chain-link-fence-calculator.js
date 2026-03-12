(function() {
  'use strict';

  var clLength = document.getElementById('clLength');
  var clHeight = document.getElementById('clHeight');
  var clCorners = document.getElementById('clCorners');
  var clEnds = document.getElementById('clEnds');
  var clGates = document.getElementById('clGates');

  var outRolls = document.getElementById('outRolls');
  var outLinePosts = document.getElementById('outLinePosts');
  var outTermPosts = document.getElementById('outTermPosts');
  var outRail = document.getElementById('outRail');
  var outTies = document.getElementById('outTies');
  var outTension = document.getElementById('outTension');
  var outLineCaps = document.getElementById('outLineCaps');
  var outTenBands = document.getElementById('outTenBands');
  var outTenBars = document.getElementById('outTenBars');
  var resultTip = document.getElementById('resultTip');

  function calculate() {
    var len = parseFloat(clLength.value);
    var ht = parseFloat(clHeight.value);
    var corners = parseInt(clCorners.value) || 0;
    var ends = parseInt(clEnds.value) || 0;
    var gates = parseInt(clGates.value) || 0;

    if (isNaN(len) || len <= 0) {
      clearResults();
      return;
    }

    // Terminal posts: corners + ends + 2 per gate
    var termPosts = corners + ends + (gates * 2);

    // Line posts: every 10 ft, minus terminal post positions
    var totalPostPositions = Math.floor(len / 10) + 1;
    var linePosts = Math.max(0, totalPostPositions - termPosts);

    // Mesh rolls (50 ft each)
    var rolls = Math.ceil(len / 50);

    // Top rail (10.5 ft pieces)
    var railPieces = Math.ceil(len / 10.5);

    // Fence ties: 1 per ft of rail + 3 per line post
    var ties = Math.ceil(len) + (linePosts * 3);

    // Tension wire: full length + 10%
    var tensionWire = Math.ceil(len * 1.10);

    // Line post caps (loop caps)
    var lineCaps = linePosts;

    // Tension bands: 1 per ft of height per terminal post (rounded up)
    var tenBands = Math.ceil(ht) * termPosts;

    // Tension bars: 1 per terminal post
    var tenBars = termPosts;

    outRolls.textContent = rolls;
    outLinePosts.textContent = linePosts;
    outTermPosts.textContent = termPosts;
    outRail.textContent = railPieces + ' pcs';
    outTies.textContent = ties;
    outTension.textContent = tensionWire + ' ft';
    outLineCaps.textContent = lineCaps;
    outTenBands.textContent = tenBands;
    outTenBars.textContent = tenBars;

    resultTip.textContent = len + ' ft fence: ' + rolls + ' mesh rolls, ' + linePosts + ' line posts, ' + termPosts + ' terminal posts, ' + railPieces + ' rail pieces, ' + ties + ' ties.';
  }

  function clearResults() {
    outRolls.textContent = '—';
    outLinePosts.textContent = '—';
    outTermPosts.textContent = '—';
    outRail.textContent = '—';
    outTies.textContent = '—';
    outTension.textContent = '—';
    outLineCaps.textContent = '—';
    outTenBands.textContent = '—';
    outTenBars.textContent = '—';
    resultTip.textContent = 'Enter fence details to calculate materials.';
    document.getElementById('result').classList.add('visible');
  }

  clLength.addEventListener('input', calculate);
  clHeight.addEventListener('change', calculate);
  clCorners.addEventListener('input', calculate);
  clEnds.addEventListener('input', calculate);
  clGates.addEventListener('input', calculate);

  calculate();
})();
