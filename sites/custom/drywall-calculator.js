(function() {
  'use strict';

  var roomLength = document.getElementById('roomLength');
  var roomWidth = document.getElementById('roomWidth');
  var roomHeight = document.getElementById('roomHeight');
  var includeCeiling = document.getElementById('includeCeiling');
  var numDoors = document.getElementById('numDoors');
  var numWindows = document.getElementById('numWindows');
  var sheetSizeDW = document.getElementById('sheetSizeDW');

  var outSheets = document.getElementById('outSheets');
  var outArea = document.getElementById('outArea');
  var outTape = document.getElementById('outTape');
  var outMud = document.getElementById('outMud');
  var outScrews = document.getElementById('outScrews');
  var outWallArea = document.getElementById('outWallArea');
  var outCeilArea = document.getElementById('outCeilArea');
  var outOpenings = document.getElementById('outOpenings');
  var resultTip = document.getElementById('resultTip');

  var DOOR_AREA = 21; // 3' x 7'
  var WINDOW_AREA = 15; // 3' x 5'
  var TAPE_PER_SQFT = 0.36;
  var MUD_PER_SQFT = 0.053;
  var SCREWS_PER_SQFT = 1;
  var WASTE = 0.10;

  function calculate() {
    var len = parseFloat(roomLength.value);
    var wid = parseFloat(roomWidth.value);
    var ht = parseFloat(roomHeight.value);
    var ceiling = includeCeiling.value === 'yes';
    var doors = parseInt(numDoors.value, 10) || 0;
    var windows = parseInt(numWindows.value, 10) || 0;
    var sheetSqFt = parseFloat(sheetSizeDW.value);

    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) {
      outSheets.textContent = '—';
      outArea.textContent = '—';
      outTape.textContent = '—';
      outMud.textContent = '—';
      outScrews.textContent = '—';
      outWallArea.textContent = '—';
      outCeilArea.textContent = '—';
      outOpenings.textContent = '—';
      return;
    }

    var perimeter = 2 * (len + wid);
    var wallArea = perimeter * ht;
    var ceilingArea = ceiling ? len * wid : 0;
    var openingArea = doors * DOOR_AREA + windows * WINDOW_AREA;
    var netArea = wallArea + ceilingArea - openingArea;
    if (netArea < 0) netArea = 0;

    var sheetsRaw = netArea / sheetSqFt;
    var sheets = Math.ceil(sheetsRaw * (1 + WASTE));

    var tape = Math.ceil(netArea * TAPE_PER_SQFT);
    var mud = netArea * MUD_PER_SQFT;
    var screws = Math.ceil(netArea * SCREWS_PER_SQFT);
    var screwLbs = Math.ceil(screws / 200); // ~200 screws per lb

    outSheets.textContent = sheets + ' sheets';
    outArea.textContent = netArea.toFixed(0) + ' sq ft (net)';
    outWallArea.textContent = wallArea.toFixed(0) + ' sq ft';
    outCeilArea.textContent = ceilingArea > 0 ? ceilingArea.toFixed(0) + ' sq ft' : 'Not included';
    outOpenings.textContent = openingArea.toFixed(0) + ' sq ft (' + doors + ' door, ' + windows + ' window)';

    outTape.textContent = tape + ' ft (' + Math.ceil(tape / 500) + ' rolls)';
    outMud.textContent = mud.toFixed(1) + ' gal (' + Math.ceil(mud / 4.5) + ' buckets)';
    outScrews.textContent = screws + ' screws (~' + screwLbs + ' lbs)';

    var sheetLabel = sheetSqFt === 48 ? '4×12' : '4×8';
    resultTip.textContent = netArea.toFixed(0) + ' sq ft net area → ' + sheets + ' ' + sheetLabel + ' sheets (with 10% waste), ' + Math.ceil(mud / 4.5) + ' bucket(s) compound, ' + Math.ceil(tape / 500) + ' roll(s) tape.';
  }

  roomLength.addEventListener('input', calculate);
  roomWidth.addEventListener('input', calculate);
  roomHeight.addEventListener('change', calculate);
  includeCeiling.addEventListener('change', calculate);
  numDoors.addEventListener('input', calculate);
  numWindows.addEventListener('input', calculate);
  sheetSizeDW.addEventListener('change', calculate);

  calculate();
})();
