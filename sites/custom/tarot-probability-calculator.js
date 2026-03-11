(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var deckSize = document.getElementById('deckSize').value;
    var cardsDrawn = document.getElementById('cardsDrawn').value;
    var targetCards = parseFloat(document.getElementById('targetCards').value) || 0;
    var reversed = document.getElementById('reversed').value;

    // Calculation logic
    var deck = parseInt(deckSize);
    var drawn = parseInt(cardsDrawn);
    var target = Math.min(targetCards, drawn);
    var rev = reversed === 'yes';
    function factorial(n) { if (n <= 1) return 1; var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
    function comb(n, k) { if (k > n || k < 0) return 0; if (k === 0 || k === n) return 1; var r = 1; for (var i = 0; i < k; i++) { r *= (n - i); r /= (i + 1); } return r; }
    var totalCombs = comb(deck, drawn);
    var probExact = comb(target, target) * comb(deck - target, drawn - target) / totalCombs;
    var majors = deck === 78 ? 22 : (deck === 22 ? 22 : 0);
    var probAllMajor = majors > 0 ? comb(majors, drawn) / totalCombs : 0;
    var suitSize = deck === 78 ? 14 : (deck === 56 ? 14 : deck);
    var probSameSuit = deck >= 56 ? (4 * comb(suitSize, drawn)) / totalCombs : 1;
    if (rev) { totalCombs = Math.pow(deck * 2, drawn); probExact = Math.pow(1/(deck*2), target); }
    document.getElementById('exactProb').textContent = (probExact * 100).toFixed(4) + '% (1 in ' + fmt(1/probExact, 0) + ')';
    document.getElementById('majorArcanaProb').textContent = majors > 0 ? (probAllMajor * 100).toFixed(2) + '%' : 'N/A for this deck';
    document.getElementById('suitProb').textContent = deck >= 56 ? (probSameSuit * 100).toFixed(2) + '%' : 'N/A';
    document.getElementById('totalCombinations').textContent = totalCombs > 1e15 ? totalCombs.toExponential(2) : fmt(totalCombs, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['deckSize', 'cardsDrawn', 'targetCards', 'reversed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
