(function() {
  'use strict';

  var unit = 'tsp';
  var GRAMS_PER_TSP = 3.1; // active dry yeast

  // Conversion factors relative to active dry yeast (by weight in grams)
  // To convert FROM type to active dry grams, divide by factor
  // To convert FROM active dry grams TO type, multiply by factor
  var factors = {
    activeDry: 1,
    instant: 0.75,
    fresh: 3,
    starter: 42
  };

  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  function calculate() {
    var amount = parseFloat(document.getElementById('yeastAmount').value);
    var fromType = document.getElementById('fromType').value;
    var toType = document.getElementById('toType').value;

    if (isNaN(amount) || amount <= 0) return;

    // Convert input to grams of that type
    var fromGrams = unit === 'tsp' ? amount * GRAMS_PER_TSP : amount;

    // Adjust if input is not active dry — need grams per tsp for that type
    if (unit === 'tsp') {
      // grams per tsp varies by type
      var gramsPerTsp = { activeDry: 3.1, instant: 3.0, fresh: 6.0, starter: 5.0 };
      fromGrams = amount * gramsPerTsp[fromType];
    }

    // Convert to active dry equivalent
    var activeDryGrams = fromGrams / factors[fromType];

    // Convert from active dry to target type
    var toGrams = activeDryGrams * factors[toType];

    // Display
    var gramsPerTspTo = { activeDry: 3.1, instant: 3.0, fresh: 6.0, starter: 5.0 };
    var toTsp = toGrams / gramsPerTspTo[toType];

    var names = {
      activeDry: 'Active Dry Yeast',
      instant: 'Instant Yeast',
      fresh: 'Fresh/Cake Yeast',
      starter: 'Sourdough Starter'
    };

    var displayAmount = '';
    if (toType === 'starter') {
      displayAmount = toGrams.toFixed(0) + 'g (' + (toGrams / 227).toFixed(1) + ' cups)';
    } else {
      displayAmount = toGrams.toFixed(1) + 'g (' + toTsp.toFixed(1) + ' tsp)';
    }

    document.getElementById('convertedAmount').innerHTML = displayAmount +
      '<div style="font-size:0.85rem;color:#666;margin-top:4px;">' + names[toType] + '</div>';

    // Flour/water adjustments for sourdough starter
    var adjHtml = '';
    if (toType === 'starter') {
      var flourReduce = toGrams / 2;
      var waterReduce = toGrams / 2;
      adjHtml = '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin-top:8px;">' +
        '<strong>Recipe Adjustments for Starter:</strong>' +
        '<div style="margin-top:8px;">Since 100% hydration starter is half flour, half water:</div>' +
        '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span>Reduce flour by:</span><span style="font-weight:600;">' + flourReduce.toFixed(0) + 'g (' + (flourReduce / 120).toFixed(2) + ' cups)</span></div>' +
        '<div style="display:flex;justify-content:space-between;padding:6px 0;">' +
        '<span>Reduce liquid by:</span><span style="font-weight:600;">' + waterReduce.toFixed(0) + 'g (' + (waterReduce / 237).toFixed(2) + ' cups)</span></div>' +
        '</div>';
    } else if (fromType === 'starter') {
      adjHtml = '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin-top:8px;">' +
        '<strong>Recipe Adjustments:</strong>' +
        '<div style="margin-top:8px;">Since you are replacing starter, add back the flour and water it contributed:</div>' +
        '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span>Add flour:</span><span style="font-weight:600;">' + (fromGrams / 2).toFixed(0) + 'g</span></div>' +
        '<div style="display:flex;justify-content:space-between;padding:6px 0;">' +
        '<span>Add liquid:</span><span style="font-weight:600;">' + (fromGrams / 2).toFixed(0) + 'g</span></div>' +
        '</div>';
    }

    document.getElementById('adjustments').innerHTML = adjHtml;

    var tips = {
      activeDry: 'Dissolve active dry yeast in warm water (105-110°F) for 5-10 minutes before adding to dough.',
      instant: 'Instant yeast can be mixed directly into dry ingredients — no proofing needed.',
      fresh: 'Crumble fresh yeast into lukewarm liquid. Use within 1-2 weeks of purchase. Store refrigerated.',
      starter: 'Use active, bubbly starter fed 4-12 hours prior. Rise time will be 2-3x longer than commercial yeast.'
    };

    document.getElementById('resultTip').textContent = tips[toType];

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('yeastAmount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
