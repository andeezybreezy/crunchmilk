(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var doorWidth = parseFloat(document.getElementById('doorWidth').value) || 0;
    var doorHeight = parseFloat(document.getElementById('doorHeight').value) || 0;
    var doorType = document.getElementById('doorType').value;
    var wallThickness = document.getElementById('wallThickness').value;

    // Calculation logic
    var widthAdd = doorType === 'prehung' ? 2 : (doorType === 'slab' ? 2.5 : (doorType === 'bifold' ? 1 : 2));
    var heightAdd = doorType === 'prehung' ? 2.5 : (doorType === 'slab' ? 3 : (doorType === 'bifold' ? 1.5 : 2.5));
    if (doorType === 'pocket') widthAdd = doorWidth + 3;
    var roW = doorWidth + widthAdd;
    var roH = doorHeight + heightAdd;
    var headerSpan = roW;
    var headerSize = headerSpan <= 36 ? '2x4 doubled' : (headerSpan <= 48 ? '2x6 doubled' : (headerSpan <= 72 ? '2x8 doubled' : '2x10 doubled or LVL'));
    var jackstuds = 2;
    var kingstuds = 2;
    var cripples = Math.ceil(roW / 16);
    document.getElementById('roWidth').textContent = fmt(roW, 1) + ' inches (' + fmt(roW / 12, 2) + ' ft)';
    document.getElementById('roHeight').textContent = fmt(roH, 1) + ' inches (' + fmt(roH / 12, 2) + ' ft)';
    document.getElementById('headerSize').textContent = headerSize + ' (for ' + fmt(headerSpan, 0) + ' inch span)';
    document.getElementById('materials').textContent = jackstuds + ' jack studs + ' + kingstuds + ' king studs + ' + cripples + ' cripple studs + header';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['doorWidth', 'doorHeight', 'doorType', 'wallThickness'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
