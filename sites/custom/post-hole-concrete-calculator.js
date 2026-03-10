(function() {
  'use strict';

  var postSize = document.getElementById('postSize');
  var holeDia = document.getElementById('holeDia');
  var holeDepth = document.getElementById('holeDepth');
  var numPosts = document.getElementById('numPosts');
  var phBagSize = document.getElementById('phBagSize');

  var outPerHole = document.getElementById('outPerHole');
  var outTotal = document.getElementById('outTotal');
  var outBags = document.getElementById('outBags');
  var outBagsPerPost = document.getElementById('outBagsPerPost');
  var outWeight = document.getElementById('outWeight');
  var outHoleVol = document.getElementById('outHoleVol');
  var resultTip = document.getElementById('resultTip');

  // Actual post dimensions in inches [width, depth]
  var postDims = {
    '4x4': [3.5, 3.5],
    '4x6': [3.5, 5.5],
    '6x6': [5.5, 5.5]
  };

  var yieldPerBag = { '60': 0.45, '80': 0.60 };

  function calculate() {
    var post = postDims[postSize.value];
    var dia = parseFloat(holeDia.value);
    var depth = parseFloat(holeDepth.value);
    var posts = parseInt(numPosts.value);
    var bagSz = phBagSize.value;

    if (isNaN(posts) || posts <= 0) {
      clearResults();
      return;
    }

    var radius = dia / 2;
    // Volumes in cubic inches
    var holeVolCuIn = Math.PI * radius * radius * depth;
    var postVolCuIn = post[0] * post[1] * depth;
    var concretePerHoleCuIn = holeVolCuIn - postVolCuIn;
    var concretePerHoleCuFt = concretePerHoleCuIn / 1728;

    var totalConcreteCuFt = concretePerHoleCuFt * posts;
    var bagYield = yieldPerBag[bagSz];
    var bagsPerPost = Math.ceil(concretePerHoleCuFt / bagYield);
    var totalBags = Math.ceil(totalConcreteCuFt / bagYield);
    var totalWeight = totalBags * parseInt(bagSz);

    outPerHole.textContent = concretePerHoleCuFt.toFixed(2) + ' cu ft';
    outTotal.textContent = totalConcreteCuFt.toFixed(1) + ' cu ft';
    outBags.textContent = totalBags + ' bags';
    outBagsPerPost.textContent = bagsPerPost;
    outWeight.textContent = totalWeight.toLocaleString() + ' lbs';
    outHoleVol.textContent = (holeVolCuIn / 1728).toFixed(2) + ' cu ft';

    resultTip.textContent = posts + ' posts × ' + concretePerHoleCuFt.toFixed(2) + ' cu ft/hole = ' + totalConcreteCuFt.toFixed(1) + ' cu ft → ' + totalBags + ' bags of ' + bagSz + ' lb concrete (' + bagsPerPost + ' bags/post).';
  }

  function clearResults() {
    outPerHole.textContent = '—';
    outTotal.textContent = '—';
    outBags.textContent = '—';
    outBagsPerPost.textContent = '—';
    outWeight.textContent = '—';
    outHoleVol.textContent = '—';
    resultTip.textContent = 'Configure post and hole settings to calculate concrete needed.';
  }

  postSize.addEventListener('change', calculate);
  holeDia.addEventListener('change', calculate);
  holeDepth.addEventListener('change', calculate);
  numPosts.addEventListener('input', calculate);
  phBagSize.addEventListener('change', calculate);

  calculate();
})();
