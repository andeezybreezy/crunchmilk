(function() {
  'use strict';

  // Retrograde dates: [start, end] as [year, month (0-indexed), day]
  var RETROGRADES = {
    2024: [
      [[2023,11,13],[2024,0,1]],
      [[2024,3,1],[2024,3,25]],
      [[2024,7,5],[2024,7,28]],
      [[2024,10,25],[2024,11,15]]
    ],
    2025: [
      [[2025,2,15],[2025,3,7]],
      [[2025,6,18],[2025,7,11]],
      [[2025,10,9],[2025,10,29]]
    ],
    2026: [
      [[2026,2,14],[2026,3,7]],
      [[2026,6,17],[2026,7,10]],
      [[2026,10,9],[2026,10,29]]
    ],
    2027: [
      [[2027,1,25],[2027,2,20]],
      [[2027,5,29],[2027,6,23]],
      [[2027,9,24],[2027,10,13]]
    ],
    2028: [
      [[2028,1,8],[2028,2,2]],
      [[2028,5,10],[2028,6,4]],
      [[2028,9,5],[2028,9,26]]
    ],
    2029: [
      [[2029,0,22],[2029,1,13]],
      [[2029,4,24],[2029,5,17]],
      [[2029,8,18],[2029,9,10]]
    ],
    2030: [
      [[2030,0,5],[2030,0,27]],
      [[2030,4,7],[2030,4,31]],
      [[2030,8,1],[2030,8,23]],
      [[2030,11,20],[2031,0,10]]
    ]
  };

  var SHADOW_DAYS = 14;

  function toDate(arr) {
    return new Date(arr[0], arr[1], arr[2]);
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function addDays(d, n) {
    var r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function daysBetween(a, b) {
    return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  }

  function calculate() {
    var year = parseInt(document.getElementById('yearSelect').value);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var periods = RETROGRADES[year] || [];

    // Current status check (across all years)
    var currentStatus = 'Mercury is NOT in retrograde';
    var statusColor = '#16a34a';
    var allPeriods = [];
    for (var y in RETROGRADES) {
      RETROGRADES[y].forEach(function(p) {
        allPeriods.push(p);
      });
    }

    allPeriods.forEach(function(p) {
      var start = toDate(p[0]);
      var end = toDate(p[1]);
      var preShadow = addDays(start, -SHADOW_DAYS);
      var postShadow = addDays(end, SHADOW_DAYS);

      if (today >= start && today <= end) {
        var daysLeft = daysBetween(today, end);
        currentStatus = 'IN RETROGRADE (' + daysLeft + ' days left)';
        statusColor = '#dc2626';
      } else if (today >= preShadow && today < start) {
        var daysToStart = daysBetween(today, start);
        currentStatus = 'Pre-Shadow Period (' + daysToStart + ' days to retrograde)';
        statusColor = '#f59e0b';
      } else if (today > end && today <= postShadow) {
        var daysToEnd = daysBetween(today, postShadow);
        currentStatus = 'Post-Shadow Period (' + daysToEnd + ' days remaining)';
        statusColor = '#f59e0b';
      }
    });

    document.getElementById('currentStatus').textContent = currentStatus;
    document.getElementById('currentStatus').style.color = statusColor;

    // Next retrograde
    var nextStart = null;
    var nextEnd = null;
    allPeriods.forEach(function(p) {
      var start = toDate(p[0]);
      var end = toDate(p[1]);
      if (start > today && (!nextStart || start < nextStart)) {
        nextStart = start;
        nextEnd = end;
      }
    });

    if (nextStart) {
      var daysUntil = daysBetween(today, nextStart);
      document.getElementById('nextRetro').textContent = formatDate(nextStart) + ' (' + daysUntil + ' days away)';
    } else {
      document.getElementById('nextRetro').textContent = 'No upcoming data';
    }

    // Year retrogrades
    var html = '<h3 style="margin-bottom:0.75rem;">' + year + ' Mercury Retrogrades</h3>';
    if (periods.length === 0) {
      html += '<p>No retrograde data available for this year.</p>';
    } else {
      periods.forEach(function(p, i) {
        var start = toDate(p[0]);
        var end = toDate(p[1]);
        var preShadow = addDays(start, -SHADOW_DAYS);
        var postShadow = addDays(end, SHADOW_DAYS);
        var duration = daysBetween(start, end);

        var isActive = today >= start && today <= end;

        html += '<div style="background:' + (isActive ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.05)') + ';padding:0.75rem;border-radius:8px;margin-bottom:0.5rem;text-align:left;">';
        html += '<strong>Retrograde ' + (i + 1) + ':</strong> ' + formatDate(start) + ' \u2013 ' + formatDate(end) + ' (' + duration + ' days)';
        if (isActive) html += ' <span style="color:#dc2626;font-weight:bold;">\u2190 ACTIVE NOW</span>';
        html += '<br><span style="font-size:0.85rem;color:#666;">Pre-shadow: ' + formatDate(preShadow) + ' | Post-shadow ends: ' + formatDate(postShadow) + '</span>';
        html += '</div>';
      });
    }

    document.getElementById('yearRetrogrades').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Auto-calculate on load
  calculate();
})();
