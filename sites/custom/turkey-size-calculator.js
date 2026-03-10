(function() {
  'use strict';

  function calculate() {
    var guests = parseInt(document.getElementById('guestCount').value);
    var appetite = document.getElementById('appetite').value;
    var boneType = document.getElementById('boneType').value;
    var wantLeftovers = document.getElementById('wantLeftovers').checked;

    if (isNaN(guests) || guests <= 0) return;

    // Per-person amounts in lbs
    var perPerson;
    if (boneType === 'bonein') {
      if (appetite === 'light') perPerson = 1.0;
      else if (appetite === 'moderate') perPerson = 1.25;
      else perPerson = 1.5;
    } else {
      if (appetite === 'light') perPerson = 0.5;
      else if (appetite === 'moderate') perPerson = 0.625;
      else perPerson = 0.75;
    }

    var totalLbs = guests * perPerson;

    // Add 25% for leftovers
    if (wantLeftovers) {
      totalLbs *= 1.25;
    }

    // Round up to nearest whole pound
    totalLbs = Math.ceil(totalLbs);

    // Thawing time: 24 hours per 4-5 lbs (use 4.5 avg)
    var thawDays = Math.ceil(totalLbs / 4.5);

    // Cooking time at 325°F: ~13-15 min/lb for unstuffed
    var cookMinLow = Math.round(totalLbs * 13);
    var cookMinHigh = Math.round(totalLbs * 15);

    function formatTime(mins) {
      var hrs = Math.floor(mins / 60);
      var m = mins % 60;
      if (m === 0) return hrs + ' hrs';
      return hrs + ' hrs ' + m + ' min';
    }

    document.getElementById('turkeyWeight').textContent = totalLbs + ' lbs';
    document.getElementById('cookTime').textContent = formatTime(cookMinLow) + ' – ' + formatTime(cookMinHigh);

    var extraHtml = '<div style="display:grid;gap:4px;">';
    extraHtml += '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">Thawing Time (fridge)</span><span>' + thawDays + ' days</span></div>';
    extraHtml += '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">Cold Water Thaw</span><span>' + (totalLbs * 0.5).toFixed(1) + ' hours</span></div>';
    extraHtml += '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
      '<span style="font-weight:600;">Per Person</span><span>' + perPerson + ' lbs</span></div>';

    if (totalLbs > 22) {
      extraHtml += '<div style="padding:10px;background:#fef3c7;border-radius:8px;margin-top:8px;">' +
        '<strong>Tip:</strong> Consider buying two smaller turkeys instead of one ' + totalLbs + '-lb bird. They cook faster and more evenly.' +
        '</div>';
    }

    extraHtml += '</div>';
    document.getElementById('extraInfo').innerHTML = extraHtml;

    var tip = wantLeftovers
      ? 'Includes 25% extra for leftovers. Use a meat thermometer — done at 165°F in the thigh.'
      : 'Use a meat thermometer — the turkey is done when the thickest part of the thigh reaches 165°F.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('guestCount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
