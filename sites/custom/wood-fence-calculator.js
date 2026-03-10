(function() {
  'use strict';

  var fencePreset = document.getElementById('fencePreset');
  var fenceLen = document.getElementById('fenceLen');
  var fenceHt = document.getElementById('fenceHt');
  var postSpacing = document.getElementById('postSpacing');
  var picketW = document.getElementById('picketW');
  var picketGap = document.getElementById('picketGap');
  var numGates = document.getElementById('numGates');

  var outPosts = document.getElementById('outPosts');
  var outRails = document.getElementById('outRails');
  var outPickets = document.getElementById('outPickets');
  var outConcrete = document.getElementById('outConcrete');
  var outFasteners = document.getElementById('outFasteners');
  var outGateHW = document.getElementById('outGateHW');
  var resultTip = document.getElementById('resultTip');

  var presets = {
    privacy: { ht: '6', spacing: '6', pw: '3.5', gap: 0, bob: false },
    picket:  { ht: '4', spacing: '6', pw: '3.5', gap: 2, bob: false },
    bob:     { ht: '6', spacing: '6', pw: '5.5', gap: 0, bob: true }
  };

  fencePreset.addEventListener('change', function() {
    var p = presets[fencePreset.value];
    if (p) {
      fenceHt.value = p.ht;
      postSpacing.value = p.spacing;
      picketW.value = p.pw;
      picketGap.value = p.gap;
    }
    calculate();
  });

  function calculate() {
    var len = parseFloat(fenceLen.value);
    var ht = parseFloat(fenceHt.value);
    var spacing = parseFloat(postSpacing.value);
    var pw = parseFloat(picketW.value);
    var gap = parseFloat(picketGap.value) || 0;
    var gates = parseInt(numGates.value) || 0;
    var isBob = fencePreset.value === 'bob';

    if (isNaN(len) || len <= 0) {
      outPosts.textContent = '—';
      outRails.textContent = '—';
      outPickets.textContent = '—';
      outConcrete.textContent = '—';
      outFasteners.textContent = '—';
      outGateHW.textContent = '—';
      resultTip.textContent = 'Enter fence details to calculate materials.';
      return;
    }

    var posts = Math.ceil(len / spacing) + 1;
    var sections = posts - 1;
    var railsPerSection = ht >= 5 ? 3 : 2;
    var totalRails = sections * railsPerSection;

    var lenInches = len * 12;
    var pickets;
    if (isBob) {
      // Board-on-board: boards overlap by half their width on alternating sides
      pickets = Math.ceil(lenInches / (pw / 2 + gap));
    } else {
      pickets = Math.ceil(lenInches / (pw + gap));
    }
    pickets = Math.ceil(pickets * 1.10); // 10% waste

    var concreteBags = Math.ceil(posts * 1.5);
    var fastenersPerPicket = railsPerSection * 2;
    var totalFasteners = pickets * fastenersPerPicket;

    outPosts.textContent = posts;
    outRails.textContent = totalRails + ' (' + railsPerSection + '/section)';
    outPickets.textContent = pickets.toLocaleString();
    outConcrete.textContent = concreteBags + ' bags';
    outFasteners.textContent = totalFasteners.toLocaleString();
    outGateHW.textContent = gates > 0 ? gates + (gates === 1 ? ' set' : ' sets') : 'None';

    var style = isBob ? 'board-on-board' : (gap > 0 ? 'spaced picket' : 'privacy');
    resultTip.textContent = len + ' ft ' + style + ' fence: ' + posts + ' posts, ' + totalRails + ' rails, ' + pickets.toLocaleString() + ' pickets, ' + concreteBags + ' bags concrete.';
  }

  fenceLen.addEventListener('input', calculate);
  fenceHt.addEventListener('change', calculate);
  postSpacing.addEventListener('change', calculate);
  picketW.addEventListener('change', calculate);
  picketGap.addEventListener('input', calculate);
  numGates.addEventListener('input', calculate);

  calculate();
})();
