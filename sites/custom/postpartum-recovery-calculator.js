(function() {
  'use strict';

  // Milestones: [label, vaginal weeks, csection weeks, description]
  var milestones = [
    ['Initial soreness subsides', 1, 2, 'Pain and discomfort start to decrease. Continue pain management as directed.'],
    ['Bleeding lightens', 2, 2, 'Lochia transitions from heavy red to lighter pink/brown flow.'],
    ['Stitches/incision healing', 2, 3, 'External healing progresses. Keep the area clean and dry.'],
    ['Can resume driving', 2, 3, 'When comfortable braking and off narcotic pain medication.'],
    ['Bleeding typically stops', 4, 4, 'Lochia usually resolves. Light spotting may continue.'],
    ['Postpartum checkup', 6, 6, 'Schedule your 6-week postpartum visit with your provider.'],
    ['Exercise clearance', 6, 8, 'Provider approval needed. Start gentle, build gradually.'],
    ['Lifting restrictions end', 5, 10, 'Gradually increase weight. Avoid straining.'],
    ['Pelvic floor strengthening', 12, 12, 'Noticeable improvement with regular Kegel exercises.'],
    ['Core strength returning', 16, 20, 'Diastasis recti improving. Core exercises helping.'],
    ['Full physical recovery', 26, 40, 'Most physical recovery complete. Some changes permanent.'],
    ['Hormonal stabilization', 40, 40, 'Hormones approaching pre-pregnancy levels (longer if breastfeeding).']
  ];

  function addDays(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function calculate() {
    var birthStr = document.getElementById('birthDate').value;
    var delivery = document.getElementById('deliveryType').value;
    var complications = document.getElementById('complications').value;

    if (!birthStr) return;

    var birthDate = new Date(birthStr + 'T00:00:00');
    var now = new Date();
    var daysSinceBirth = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    var weeksSinceBirth = daysSinceBirth / 7;

    // Complication multiplier
    var mult = 1;
    if (complications === 'minor') mult = 1.2;
    else if (complications === 'major') mult = 1.5;

    var weeksDisplay = Math.max(0, Math.floor(weeksSinceBirth));
    var daysDisplay = Math.max(0, daysSinceBirth);

    // Determine current stage
    var stage = '';
    var isCsection = delivery === 'csection';

    if (daysSinceBirth < 0) {
      stage = 'Baby not yet born';
    } else if (weeksSinceBirth < 1) {
      stage = 'Immediate postpartum (Week 1)';
    } else if (weeksSinceBirth < 2) {
      stage = 'Early recovery (Week 2)';
    } else if (weeksSinceBirth < 6) {
      stage = 'Active healing (Weeks 2–6)';
    } else if (weeksSinceBirth < 12) {
      stage = 'Recovery progressing (Weeks 6–12)';
    } else if (weeksSinceBirth < 26) {
      stage = 'Continued recovery (Months 3–6)';
    } else if (weeksSinceBirth < 52) {
      stage = 'Later recovery (Months 6–12)';
    } else {
      stage = 'Beyond 1 year postpartum';
    }

    document.getElementById('currentStage').textContent = stage;
    document.getElementById('weeksPostpartum').textContent = daysSinceBirth >= 0 ? weeksDisplay + ' weeks, ' + (daysDisplay % 7) + ' days' : 'Not yet born';

    // This week info
    var thisWeekHTML = '';
    if (daysSinceBirth >= 0 && weeksSinceBirth < 52) {
      thisWeekHTML = '<strong>What to expect this week:</strong> ';
      if (weeksSinceBirth < 1) {
        thisWeekHTML += isCsection ? 'Rest is essential. Pain management, incision care, and bonding with baby. Accept help with household tasks.' : 'Rest, manage soreness, begin gentle movement (short walks). Bleeding is heavy — this is normal.';
      } else if (weeksSinceBirth < 2) {
        thisWeekHTML += isCsection ? 'Incision care continues. Gentle walking encouraged. Avoid lifting anything heavier than baby.' : 'Soreness improving. Bleeding transitioning to lighter flow. Short walks are beneficial.';
      } else if (weeksSinceBirth < 4) {
        thisWeekHTML += isCsection ? 'Gradual increase in activity. Incision should be closing well. Still avoid heavy lifting and stairs when possible.' : 'Energy slowly returning. Bleeding should be lighter. Gentle activity is good.';
      } else if (weeksSinceBirth < 6) {
        thisWeekHTML += 'Bleeding may be stopping. Schedule your 6-week checkup. Pelvic floor exercises (Kegels) are important.';
      } else if (weeksSinceBirth < 8) {
        thisWeekHTML += isCsection ? 'Approaching exercise clearance at 8 weeks. Continue gentle activity. Internal healing still progressing.' : 'Post-checkup: may be cleared for exercise and normal activity. Start gradually.';
      } else if (weeksSinceBirth < 12) {
        thisWeekHTML += 'Building strength and endurance. Pelvic floor work continues. Sleep patterns may be improving.';
      } else {
        thisWeekHTML += 'Ongoing recovery. Core and pelvic floor strengthening. Most daily activities should be manageable.';
      }
    }
    document.getElementById('thisWeek').innerHTML = thisWeekHTML;

    // Build milestones list
    var html = '<div style="display:flex;flex-direction:column;gap:8px;">';
    milestones.forEach(function(m) {
      var weeks = isCsection ? m[2] : m[1];
      weeks = Math.round(weeks * mult);
      var milestoneDate = addDays(birthDate, weeks * 7);
      var isPast = now >= milestoneDate;
      var isCurrent = Math.abs(weeksSinceBirth - weeks) < 1.5;

      var bg = isPast ? '#f0fdf4' : (isCurrent ? '#fdf2f8' : '#f9fafb');
      var border = isPast ? '#86efac' : (isCurrent ? '#f9a8d4' : '#e5e7eb');
      var icon = isPast ? '&#10003;' : (isCurrent ? '&#9679;' : '&#9675;');
      var color = isPast ? '#16a34a' : (isCurrent ? '#ec4899' : '#6b7280');

      html += '<div style="padding:10px 12px;background:' + bg + ';border:1px solid ' + border + ';border-radius:8px;">';
      html += '<div style="display:flex;align-items:center;gap:8px;">';
      html += '<span style="color:' + color + ';font-size:1.1rem;">' + icon + '</span>';
      html += '<strong>' + m[0] + '</strong>';
      html += '<span style="margin-left:auto;font-size:0.85rem;color:#6b7280;">~' + formatDate(milestoneDate) + ' (week ' + weeks + ')</span>';
      html += '</div>';
      html += '<div style="font-size:0.9rem;color:#4b5563;margin-top:4px;padding-left:26px;">' + m[3] + '</div>';
      html += '</div>';
    });
    html += '</div>';
    document.getElementById('milestones').innerHTML = html;

    var tip = 'Timeline is approximate and varies by individual. ';
    if (complications !== 'none') {
      tip += 'Adjusted for ' + complications + ' complications (longer recovery expected). ';
    }
    tip += 'Always follow your healthcare provider\'s specific instructions.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
