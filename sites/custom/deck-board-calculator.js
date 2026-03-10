(function() {
  'use strict';

  var deckLength = document.getElementById('deckLength');
  var deckWidth = document.getElementById('deckWidth');
  var boardWidth = document.getElementById('boardWidth');
  var boardGap = document.getElementById('boardGap');
  var boardLen = document.getElementById('boardLen');
  var joistSpacing = document.getElementById('joistSpacing');
  var wastePct = document.getElementById('wastePct');

  var outBoards = document.getElementById('outBoards');
  var outLinFt = document.getElementById('outLinFt');
  var outArea = document.getElementById('outArea');
  var outScrews = document.getElementById('outScrews');
  var outJoists = document.getElementById('outJoists');
  var outRows = document.getElementById('outRows');
  var resultTip = document.getElementById('resultTip');

  function calculate() {
    var dLen = parseFloat(deckLength.value);
    var dWid = parseFloat(deckWidth.value);
    var bWid = parseFloat(boardWidth.value);
    var gap = parseFloat(boardGap.value);
    var bLen = parseFloat(boardLen.value);
    var jSpace = parseFloat(joistSpacing.value);
    var waste = parseFloat(wastePct.value);

    if (isNaN(dLen) || isNaN(dWid) || dLen <= 0 || dWid <= 0) {
      outBoards.textContent = '—';
      outLinFt.textContent = '—';
      outArea.textContent = '—';
      outScrews.textContent = '—';
      outJoists.textContent = '—';
      outRows.textContent = '—';
      resultTip.textContent = 'Enter deck dimensions to calculate.';
      return;
    }

    var widthIn = dWid * 12;
    var lengthIn = dLen * 12;

    // Number of board rows across the width
    var rows = Math.ceil(widthIn / (bWid + gap));

    // Boards per row (if deck length > board length, need multiple per row)
    var boardsPerRow = Math.ceil(dLen / bLen);

    // Total boards before waste
    var totalBoardsRaw = rows * boardsPerRow;
    var totalBoards = Math.ceil(totalBoardsRaw * (1 + waste));

    // Linear feet
    var totalLF = totalBoards * bLen;

    // Area
    var area = dLen * dWid;

    // Joists
    var joists = Math.floor(lengthIn / jSpace) + 1;

    // Screws: 2 per board per joist it crosses
    var joistsPerBoard = Math.ceil((bLen * 12) / jSpace);
    var screwsPerBoard = bWid >= 7 ? 3 * joistsPerBoard : 2 * joistsPerBoard;
    var totalScrews = Math.ceil(totalBoardsRaw * screwsPerBoard * (1 + 0.05)); // 5% extra screws

    outRows.textContent = rows;
    outBoards.textContent = totalBoards + ' boards (' + bLen + "' each)";
    outLinFt.textContent = totalLF.toFixed(0) + ' LF';
    outArea.textContent = area.toFixed(0) + ' sq ft';
    outScrews.textContent = totalScrews.toLocaleString();
    outJoists.textContent = joists + ' joists';

    resultTip.textContent = rows + ' rows of ' + boardsPerRow + ' board(s) each = ' + totalBoardsRaw + ' boards + ' + Math.round(waste * 100) + '% waste = ' + totalBoards + ' total.';
  }

  deckLength.addEventListener('input', calculate);
  deckWidth.addEventListener('input', calculate);
  boardWidth.addEventListener('change', calculate);
  boardGap.addEventListener('change', calculate);
  boardLen.addEventListener('change', calculate);
  joistSpacing.addEventListener('change', calculate);
  wastePct.addEventListener('change', calculate);

  calculate();
})();
