(function() {
  'use strict';

  var SIGNS = [
    { name: 'Aries', start: [3,21], end: [4,19], element: 'Fire', modality: 'Cardinal', traits: 'Bold, ambitious, and energetic. Natural leader who loves a challenge.' },
    { name: 'Taurus', start: [4,20], end: [5,20], element: 'Earth', modality: 'Fixed', traits: 'Reliable, patient, and devoted. Enjoys comfort, beauty, and stability.' },
    { name: 'Gemini', start: [5,21], end: [6,20], element: 'Air', modality: 'Mutable', traits: 'Curious, adaptable, and communicative. Quick-witted social butterfly.' },
    { name: 'Cancer', start: [6,21], end: [7,22], element: 'Water', modality: 'Cardinal', traits: 'Intuitive, nurturing, and emotional. Deeply connected to home and family.' },
    { name: 'Leo', start: [7,23], end: [8,22], element: 'Fire', modality: 'Fixed', traits: 'Confident, dramatic, and warm. Natural performer who loves the spotlight.' },
    { name: 'Virgo', start: [8,23], end: [9,22], element: 'Earth', modality: 'Mutable', traits: 'Analytical, practical, and detail-oriented. Strives for perfection in all things.' },
    { name: 'Libra', start: [9,23], end: [10,22], element: 'Air', modality: 'Cardinal', traits: 'Diplomatic, fair-minded, and social. Seeks harmony and beautiful partnerships.' },
    { name: 'Scorpio', start: [10,23], end: [11,21], element: 'Water', modality: 'Fixed', traits: 'Passionate, intense, and resourceful. Deep emotional power and transformation.' },
    { name: 'Sagittarius', start: [11,22], end: [12,21], element: 'Fire', modality: 'Mutable', traits: 'Optimistic, adventurous, and philosophical. Loves freedom and exploration.' },
    { name: 'Capricorn', start: [12,22], end: [1,19], element: 'Earth', modality: 'Cardinal', traits: 'Disciplined, ambitious, and responsible. Patient climb to the top.' },
    { name: 'Aquarius', start: [1,20], end: [2,18], element: 'Air', modality: 'Fixed', traits: 'Independent, humanitarian, and innovative. Visionary thinker ahead of their time.' },
    { name: 'Pisces', start: [2,19], end: [3,20], element: 'Water', modality: 'Mutable', traits: 'Compassionate, artistic, and intuitive. Deep connection to the spiritual realm.' }
  ];

  var CHINESE_ANIMALS = ['Monkey','Rooster','Dog','Pig','Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat'];
  var CHINESE_ELEMENTS = ['Metal','Metal','Water','Water','Wood','Wood','Fire','Fire','Earth','Earth'];

  function getSunSign(month, day) {
    for (var i = 0; i < SIGNS.length; i++) {
      var s = SIGNS[i];
      // Handle Capricorn wrapping
      if (s.start[0] > s.end[0]) {
        if ((month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) {
          return s;
        }
      } else {
        if ((month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) {
          return s;
        }
        if (month > s.start[0] && month < s.end[0]) {
          return s;
        }
      }
    }
    return SIGNS[0];
  }

  function getApproxMoonSign(date) {
    // Approximate: Moon moves through all 12 signs in ~27.3 days
    // Use a known reference: Jan 1, 2000 moon was approx in Gemini
    var ref = new Date(2000, 0, 1);
    var days = (date.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24);
    var moonCycle = 27.3216;
    var signDuration = moonCycle / 12;
    var offset = 2; // Gemini index
    var signIndex = Math.floor((days / signDuration + offset) % 12);
    if (signIndex < 0) signIndex += 12;
    return SIGNS[signIndex];
  }

  function getApproxRisingSign(sunSignIdx, birthHour) {
    // Very rough approximation: Rising sign changes every 2 hours starting from sun sign at sunrise (~6 AM)
    var hoursFromSunrise = (birthHour - 6 + 24) % 24;
    var signShift = Math.floor(hoursFromSunrise / 2);
    var idx = (sunSignIdx + signShift) % 12;
    return SIGNS[idx];
  }

  function getChineseZodiac(year) {
    var animal = CHINESE_ANIMALS[year % 12];
    var element = CHINESE_ELEMENTS[year % 10];
    return { animal: animal, element: element };
  }

  function calculate() {
    var bd = document.getElementById('birthdate').value;
    if (!bd) return;

    var parts = bd.split('-');
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    var date = new Date(year, month - 1, day);

    var sun = getSunSign(month, day);
    var moon = getApproxMoonSign(date);
    var chinese = getChineseZodiac(year);

    document.getElementById('sunSign').textContent = sun.name;
    document.getElementById('moonSign').textContent = moon.name;
    document.getElementById('element').textContent = sun.element;
    document.getElementById('modality').textContent = sun.modality;
    document.getElementById('chineseZodiac').textContent = chinese.animal + ' (' + chinese.element + ')';

    // Rising sign
    var bt = document.getElementById('birthtime').value;
    var sunIdx = SIGNS.indexOf(sun);
    if (bt) {
      var timeParts = bt.split(':');
      var hour = parseInt(timeParts[0]);
      var rising = getApproxRisingSign(sunIdx, hour);
      document.getElementById('risingSign').textContent = rising.name + ' (approx.)';
    } else {
      document.getElementById('risingSign').textContent = 'Enter birth time';
    }

    // Details
    var html = '<div style="background:rgba(124,58,237,0.06);padding:1rem;border-radius:8px;">';
    html += '<p><strong>' + sun.name + ' Sun:</strong> ' + sun.traits + '</p>';
    html += '<p><strong>' + moon.name + ' Moon (approx.):</strong> ' + moon.traits + '</p>';
    html += '<p><strong>Chinese Zodiac — ' + chinese.animal + ':</strong> The ' + chinese.animal + ' is associated with the ' + chinese.element + ' element in the Chinese zodiac for your birth year.</p>';
    html += '<p style="font-size:0.85rem;color:#666;margin-top:0.5rem;"><em>Note: Moon and Rising signs are approximations. For precise placements, consult a full natal chart calculator with ephemeris data.</em></p>';
    html += '</div>';
    document.getElementById('details').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
