(function() {
  'use strict';

  var ANGEL_NUMBERS = {
    '0': { theme: 'Infinite Potential', meaning: 'Represents wholeness, oneness with the universe, and infinite potential. A reminder that you are connected to all that is.', action: 'Meditate on your connection to the universe and embrace new beginnings.' },
    '1': { theme: 'New Beginnings', meaning: 'The number of creation and leadership. You are being called to take initiative and trust your independence.', action: 'Start that project you have been thinking about. Trust your instincts.' },
    '2': { theme: 'Partnership', meaning: 'Balance, harmony, and cooperation. Trust that things are working out behind the scenes.', action: 'Be patient and trust the timing of your life. Nurture your relationships.' },
    '3': { theme: 'Creativity', meaning: 'Self-expression, creativity, and joy. The ascended masters are encouraging you to share your gifts.', action: 'Express yourself creatively. Share your ideas and talents with the world.' },
    '4': { theme: 'Foundation', meaning: 'Stability, hard work, and angelic protection. Your angels are close and supporting your efforts.', action: 'Keep building. Your hard work is being noticed and supported.' },
    '5': { theme: 'Change', meaning: 'Transformation and freedom. Major positive changes are on the horizon.', action: 'Embrace change with an open heart. Release what no longer serves you.' },
    '6': { theme: 'Harmony', meaning: 'Balance between material and spiritual. Focus on home, family, and nurturing.', action: 'Bring balance to your life. Take care of yourself and your loved ones.' },
    '7': { theme: 'Spirituality', meaning: 'Spiritual awakening, inner wisdom, and divine luck. You are on the right spiritual path.', action: 'Deepen your spiritual practice. Trust your intuition and inner knowing.' },
    '8': { theme: 'Abundance', meaning: 'Material abundance, power, and karmic balance. Financial prosperity is flowing to you.', action: 'Stay focused on your goals. Abundance is coming — be ready to receive.' },
    '9': { theme: 'Completion', meaning: 'Endings, humanitarianism, and spiritual enlightenment. A cycle is completing.', action: 'Release what has ended with gratitude. Prepare for a new chapter.' },
    '11': { theme: 'Master Intuition', meaning: 'A master number representing heightened intuition, spiritual insight, and enlightenment.', action: 'Pay attention to your inner voice. You are being called to a higher purpose.' },
    '22': { theme: 'Master Builder', meaning: 'The most powerful number in numerology. You have the ability to turn your biggest dreams into reality.', action: 'Think big and take practical steps. You can manifest extraordinary things.' },
    '33': { theme: 'Master Teacher', meaning: 'Compassion, healing, and selfless service. You are being called to uplift others.', action: 'Share your wisdom. Your role is to guide and heal those around you.' },
    '111': { theme: 'Manifestation', meaning: 'Your thoughts are manifesting rapidly into reality. This is a powerful sign to monitor your thinking and stay positive. The universe is amplifying whatever you focus on right now.', action: 'Focus only on what you want, not what you fear. Set clear intentions.' },
    '222': { theme: 'Balance & Trust', meaning: 'Everything is working out as it should. Trust the process and maintain faith. Your patience will be rewarded. Partnerships and cooperation are highlighted.', action: 'Stay patient and trust divine timing. Nurture your relationships.' },
    '333': { theme: 'Divine Support', meaning: 'The ascended masters are near you, offering love, guidance, and support. Your creative abilities are being amplified. Express your truth with confidence.', action: 'Express yourself fully. Call on your spiritual guides for help.' },
    '444': { theme: 'Angelic Protection', meaning: 'You are completely surrounded and protected by angels. You are exactly where you need to be. This is confirmation that your hard work is building a solid foundation.', action: 'Keep going — you are protected and supported. Trust your current path.' },
    '555': { theme: 'Major Change', meaning: 'Significant life changes are happening or about to happen. These changes are divinely guided and will ultimately benefit you. Release resistance and go with the flow.', action: 'Embrace the changes coming. Let go of the old to make room for the new.' },
    '666': { theme: 'Spiritual Realignment', meaning: 'A gentle nudge to refocus your attention from material worries to spiritual growth. Your thoughts may be out of balance. This is not a negative number — it is a loving course correction.', action: 'Shift focus from material concerns to gratitude and spiritual practice.' },
    '777': { theme: 'Spiritual Awakening', meaning: 'You are experiencing deep spiritual growth and divine alignment. Luck and miracles are on your side. You are downloading spiritual wisdom and expanding your consciousness.', action: 'Continue your spiritual journey. Study, meditate, and trust your path.' },
    '888': { theme: 'Abundance Flowing', meaning: 'Financial and material abundance is flowing to you. You are in alignment with the energy of prosperity. Karma is rewarding your past efforts and generosity.', action: 'Be open to receiving abundance. Share your blessings generously.' },
    '999': { theme: 'Cycle Completion', meaning: 'A major life chapter is ending to make way for a new beginning. Release what no longer serves you. Completion brings transformation and renewal.', action: 'Let go with grace. Honor what has been and welcome what is coming.' },
    '000': { theme: 'Infinite Oneness', meaning: 'You are one with the universe and infinite source energy. A powerful reset and reminder of your divine nature. Unlimited potential surrounds you.', action: 'Connect with the infinite. Meditate on your divine nature and limitless potential.' },
    '1010': { theme: 'Spiritual Growth', meaning: 'You are on the verge of a personal and spiritual breakthrough. Stay positive and keep your vibration high. Your angels are encouraging rapid growth.', action: 'Stay optimistic. A breakthrough is imminent — maintain high energy.' },
    '1111': { theme: 'Awakening Portal', meaning: 'The most powerful angel number. A gateway to spiritual awakening and manifestation. Your thoughts are creating reality at an accelerated pace. Make a wish.', action: 'Set a powerful intention right now. This is a manifestation portal.' },
    '1212': { theme: 'Stepping Forward', meaning: 'Stay positive and focused on your highest ideals. You are being guided to step outside your comfort zone. Trust that the universe supports your growth.', action: 'Take a leap of faith. Step forward into your highest potential.' },
    '1234': { theme: 'Forward Progress', meaning: 'You are on the right path and making steady progress. Each step is leading you where you need to be. Simplify your life and keep moving forward.', action: 'Keep putting one foot in front of the other. You are making great progress.' }
  };

  function reduceToDigit(num) {
    while (num > 9) {
      var sum = 0;
      var s = String(num);
      for (var i = 0; i < s.length; i++) {
        sum += parseInt(s[i]);
      }
      num = sum;
    }
    return num;
  }

  function lookup() {
    var num = document.getElementById('angelNum').value.trim();
    if (!num) return;

    var data = ANGEL_NUMBERS[num];
    var display = document.getElementById('numDisplay');
    var meaningDiv = document.getElementById('meaningText');

    if (data) {
      display.textContent = num;
      meaningDiv.innerHTML =
        '<p><strong>Theme:</strong> ' + data.theme + '</p>' +
        '<p><strong>Meaning:</strong> ' + data.meaning + '</p>' +
        '<p><strong>What to do:</strong> ' + data.action + '</p>';
    } else {
      display.textContent = num;
      // Try reducing the number
      var total = 0;
      for (var i = 0; i < num.length; i++) {
        var d = parseInt(num[i]);
        if (!isNaN(d)) total += d;
      }
      var reduced = reduceToDigit(total);
      var rData = ANGEL_NUMBERS[String(reduced)];
      if (rData) {
        meaningDiv.innerHTML =
          '<p><em>This exact number is not in our database, but it reduces to <strong>' + reduced + '</strong>:</em></p>' +
          '<p><strong>Theme:</strong> ' + rData.theme + '</p>' +
          '<p><strong>Meaning:</strong> ' + rData.meaning + '</p>' +
          '<p><strong>What to do:</strong> ' + rData.action + '</p>';
      } else {
        meaningDiv.innerHTML = '<p>This number is not in our angel number database. Try common sequences like 111, 222, 333, 444, 555, 666, 777, 888, 999, or 1111.</p>';
      }
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function personalCalc() {
    var bd = document.getElementById('birthdate').value;
    if (!bd) return;

    var digits = bd.replace(/-/g, '');
    var sum = 0;
    for (var i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i]);
    }
    var personal = reduceToDigit(sum);

    document.getElementById('personalNum').textContent = personal;

    var data = ANGEL_NUMBERS[String(personal)];
    var pmDiv = document.getElementById('personalMeaning');
    if (data) {
      pmDiv.innerHTML =
        '<p><strong>Theme:</strong> ' + data.theme + '</p>' +
        '<p><strong>Meaning:</strong> ' + data.meaning + '</p>' +
        '<p><strong>Guidance:</strong> ' + data.action + '</p>';
    }

    var resultEl = document.getElementById('personalResult');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('lookupBtn').addEventListener('click', lookup);
  document.getElementById('personalBtn').addEventListener('click', personalCalc);
  document.getElementById('angelNum').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') lookup();
  });
})();
