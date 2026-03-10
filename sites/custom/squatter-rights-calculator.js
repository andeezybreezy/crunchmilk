(function() {
  'use strict';

  var stateData = {
    'AL': { name: 'Alabama', years: 10, colorTitle: 10, taxReq: false, reform: true, notes: 'Standard 10-year period. 2024 reform introduced expedited removal process.' },
    'AK': { name: 'Alaska', years: 10, colorTitle: 7, taxReq: false, reform: false, notes: '10 years standard; 7 with color of title.' },
    'AZ': { name: 'Arizona', years: 10, colorTitle: 3, taxReq: true, reform: false, notes: '10 years standard; as low as 3 with color of title. Tax payment required.' },
    'AR': { name: 'Arkansas', years: 7, colorTitle: 7, taxReq: true, reform: false, notes: '7 years with tax payment. Color of title also 7 years.' },
    'CA': { name: 'California', years: 5, colorTitle: 5, taxReq: true, reform: false, notes: '5 years with continuous tax payment required. One of the shortest periods.' },
    'CO': { name: 'Colorado', years: 18, colorTitle: 7, taxReq: true, reform: false, notes: '18 years standard; 7 with color of title and tax payment.' },
    'CT': { name: 'Connecticut', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15 years continuous occupation required.' },
    'DE': { name: 'Delaware', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20-year period. Relatively long timeline.' },
    'FL': { name: 'Florida', years: 7, colorTitle: 7, taxReq: true, reform: true, notes: '7 years with color of title and tax payment. SB 621 (2024) allows law enforcement removal with owner affidavit — no court needed.' },
    'GA': { name: 'Georgia', years: 20, colorTitle: 7, taxReq: false, reform: true, notes: '20 years standard; 7 with color of title. SB 503 (2024) created expedited removal process.' },
    'HI': { name: 'Hawaii', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20-year period. Long timeline protects property owners.' },
    'ID': { name: 'Idaho', years: 20, colorTitle: 5, taxReq: true, reform: false, notes: '20 years standard; 5 with tax payment.' },
    'IL': { name: 'Illinois', years: 20, colorTitle: 7, taxReq: true, reform: false, notes: '20 years standard; 7 with color of title and tax payment.' },
    'IN': { name: 'Indiana', years: 10, colorTitle: 10, taxReq: true, reform: false, notes: '10 years with tax payment required.' },
    'IA': { name: 'Iowa', years: 10, colorTitle: 5, taxReq: false, reform: false, notes: '10 years standard; 5 with color of title.' },
    'KS': { name: 'Kansas', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15 years continuous occupation.' },
    'KY': { name: 'Kentucky', years: 15, colorTitle: 7, taxReq: false, reform: false, notes: '15 years standard; 7 with color of title.' },
    'LA': { name: 'Louisiana', years: 30, colorTitle: 10, taxReq: false, reform: false, notes: '30 years without title; 10 with good faith title. Civil law system (unique rules).' },
    'ME': { name: 'Maine', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20-year occupation period.' },
    'MD': { name: 'Maryland', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20-year period.' },
    'MA': { name: 'Massachusetts', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20 years continuous, adverse possession.' },
    'MI': { name: 'Michigan', years: 15, colorTitle: 5, taxReq: true, reform: false, notes: '15 years standard; 5 with color of title and tax payment.' },
    'MN': { name: 'Minnesota', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15-year occupation period.' },
    'MS': { name: 'Mississippi', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years adverse occupation.' },
    'MO': { name: 'Missouri', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years continuous hostile possession.' },
    'MT': { name: 'Montana', years: 5, colorTitle: 5, taxReq: true, reform: false, notes: '5 years with tax payment. One of the shortest timelines.' },
    'NE': { name: 'Nebraska', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10-year statutory period.' },
    'NV': { name: 'Nevada', years: 15, colorTitle: 5, taxReq: true, reform: false, notes: '15 years standard; 5 with color of title and tax payment.' },
    'NH': { name: 'New Hampshire', years: 20, colorTitle: 20, taxReq: false, reform: false, notes: '20-year continuous occupation.' },
    'NJ': { name: 'New Jersey', years: 30, colorTitle: 30, taxReq: false, reform: false, notes: '30-year period. One of the longest in the nation. Strong property owner protections.' },
    'NM': { name: 'New Mexico', years: 10, colorTitle: 10, taxReq: true, reform: false, notes: '10 years with tax payment and color of title.' },
    'NY': { name: 'New York', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years. 2008 reform made requirements stricter (must show reasonable basis for belief of ownership).' },
    'NC': { name: 'North Carolina', years: 20, colorTitle: 7, taxReq: true, reform: false, notes: '20 years standard; 7 with color of title and tax payment.' },
    'ND': { name: 'North Dakota', years: 20, colorTitle: 10, taxReq: true, reform: false, notes: '20 years standard; 10 with tax payment.' },
    'OH': { name: 'Ohio', years: 21, colorTitle: 21, taxReq: false, reform: false, notes: '21-year period. Among the longest.' },
    'OK': { name: 'Oklahoma', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15 years continuous occupation.' },
    'OR': { name: 'Oregon', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years hostile, continuous occupation.' },
    'PA': { name: 'Pennsylvania', years: 21, colorTitle: 21, taxReq: false, reform: false, notes: '21-year period. Among the longest in the US.' },
    'RI': { name: 'Rhode Island', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10-year adverse possession period.' },
    'SC': { name: 'South Carolina', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years continuous occupation.' },
    'SD': { name: 'South Dakota', years: 20, colorTitle: 10, taxReq: true, reform: false, notes: '20 years standard; 10 with tax payment.' },
    'TN': { name: 'Tennessee', years: 20, colorTitle: 7, taxReq: true, reform: false, notes: '20 years standard; 7 with color of title.' },
    'TX': { name: 'Texas', years: 10, colorTitle: 3, taxReq: false, reform: false, notes: '10 years standard; 5 with color of title; 3 with title and good faith. Complex system.' },
    'UT': { name: 'Utah', years: 7, colorTitle: 7, taxReq: true, reform: false, notes: '7 years with tax payment.' },
    'VT': { name: 'Vermont', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15-year continuous occupation.' },
    'VA': { name: 'Virginia', years: 15, colorTitle: 15, taxReq: false, reform: true, notes: '15 years. 2024-2025 reforms strengthened owner removal rights.' },
    'WA': { name: 'Washington', years: 10, colorTitle: 7, taxReq: true, reform: false, notes: '10 years standard; 7 with color of title and tax payment.' },
    'WV': { name: 'West Virginia', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10-year continuous hostile occupation.' },
    'WI': { name: 'Wisconsin', years: 20, colorTitle: 10, taxReq: false, reform: false, notes: '20 years standard; 10 with color of title.' },
    'WY': { name: 'Wyoming', years: 10, colorTitle: 10, taxReq: false, reform: false, notes: '10 years adverse possession.' },
    'DC': { name: 'District of Columbia', years: 15, colorTitle: 15, taxReq: false, reform: false, notes: '15-year occupation period.' }
  };

  function fmt(n, d) {
    return n.toFixed(d || 0);
  }

  var stateEl = document.getElementById('sqState');
  stateEl.innerHTML = '<option value="">— Select State —</option>';
  Object.keys(stateData).sort(function(a, b) {
    return stateData[a].name.localeCompare(stateData[b].name);
  }).forEach(function(code) {
    var opt = document.createElement('option');
    opt.value = code;
    opt.textContent = stateData[code].name;
    stateEl.appendChild(opt);
  });

  var chartData = [
    ['California', '5 years', '5 years', 'Yes', 'No'],
    ['Florida', '7 years', '7 years', 'Yes', 'Yes — SB 621 (fast removal)'],
    ['Texas', '10 years', '3-5 years', 'No', 'No'],
    ['New York', '10 years', '10 years', 'No', 'Proposed'],
    ['Georgia', '20 years', '7 years', 'No', 'Yes — SB 503'],
    ['Pennsylvania', '21 years', '21 years', 'No', 'No'],
    ['New Jersey', '30 years', '30 years', 'No', 'No']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var code = stateEl.value;
    var duration = parseFloat(document.getElementById('sqDuration').value) || 0;
    var propType = document.getElementById('sqPropertyType').value;
    var circumstances = document.getElementById('sqCircumstances').value;

    if (!code) return;

    var state = stateData[code];
    var apYears = state.years;
    var progress = duration > 0 ? Math.min(100, (duration / apYears) * 100) : 0;
    var yearsLeft = Math.max(0, apYears - duration);

    var status = '';
    var statusColor = '';
    if (duration >= apYears) {
      status = 'Adverse Possession May Apply';
      statusColor = '#dc2626';
    } else if (progress >= 50) {
      status = 'Significant Progress — Act Now';
      statusColor = '#f59e0b';
    } else {
      status = 'Early Stage — Eviction Recommended';
      statusColor = '#059669';
    }

    document.getElementById('rTimeline').textContent = apYears + ' years in ' + state.name;
    document.getElementById('rStatus').textContent = status;
    document.getElementById('rStatus').style.color = statusColor;

    var d = '';

    // State info
    d += '<div style="padding:14px;background:#fef2f2;border-radius:8px;border-left:4px solid #dc2626;margin-bottom:16px">';
    d += '<strong>' + state.name + ' — Adverse Possession Law</strong><br>';
    d += state.notes + '<br>';
    d += 'Standard period: <strong>' + apYears + ' years</strong>';
    if (state.colorTitle !== apYears) {
      d += ' | With color of title: <strong>' + state.colorTitle + ' years</strong>';
    }
    d += '<br>Tax payment required: <strong>' + (state.taxReq ? 'Yes' : 'No') + '</strong>';
    if (state.reform) {
      d += '<br><span style="color:#059669;font-weight:bold">2024-2025 reform: expedited squatter removal process enacted</span>';
    }
    d += '</div>';

    // Progress bar
    if (duration > 0) {
      d += '<div style="margin-bottom:16px">';
      d += '<div style="font-size:0.9rem;margin-bottom:6px"><strong>Adverse Possession Progress:</strong> ' + fmt(duration, 1) + ' of ' + apYears + ' years (' + fmt(progress, 0) + '%)</div>';
      d += '<div style="width:100%;height:24px;background:#e5e7eb;border-radius:12px;overflow:hidden">';
      d += '<div style="width:' + Math.min(100, progress) + '%;height:100%;background:' + (progress >= 100 ? '#dc2626' : progress >= 50 ? '#f59e0b' : '#059669') + ';border-radius:12px;transition:width 0.3s"></div>';
      d += '</div>';
      if (yearsLeft > 0) {
        d += '<div style="font-size:0.8rem;color:var(--text-light);margin-top:4px">' + fmt(yearsLeft, 1) + ' years remaining before adverse possession could be claimed</div>';
      }
      d += '</div>';
    }

    // Eviction process
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:16px">';
    d += '<strong>Recommended Actions for Property Owner</strong>';
    d += '<ol style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';

    if (circumstances === 'unknown_squatter') {
      if (state.reform) {
        d += '<li>File a sworn affidavit with local law enforcement for expedited removal (new ' + state.name + ' law)</li>';
      }
      d += '<li>Contact local police to report trespassing (criminal trespass if no claim of residency)</li>';
      d += '<li>If police cannot remove immediately, serve a formal notice to vacate (check state requirements)</li>';
      d += '<li>File an unlawful detainer or ejectment action in court</li>';
      d += '<li>Obtain court order for removal — sheriff will enforce</li>';
      d += '<li>Secure the property immediately after removal (change locks, board windows)</li>';
      d += '<li><strong>Do NOT</strong> attempt self-help removal (changing locks while occupied, removing belongings, shutting utilities)</li>';
    } else if (circumstances === 'holdover_tenant') {
      d += '<li>Serve proper notice to quit (typically 3-30 days depending on state)</li>';
      d += '<li>If tenant does not leave, file formal eviction (unlawful detainer) in court</li>';
      d += '<li>Attend court hearing — bring lease agreement and proof of termination</li>';
      d += '<li>Obtain court judgment and writ of possession</li>';
      d += '<li>Sheriff executes removal</li>';
    } else if (circumstances === 'boundary_dispute') {
      d += '<li>Hire a licensed surveyor to establish exact property boundaries</li>';
      d += '<li>Send written notice to neighbor with survey results</li>';
      d += '<li>Attempt to negotiate resolution (boundary agreement or easement)</li>';
      d += '<li>If unresolved, file a quiet title action to establish ownership</li>';
      d += '<li>Consider a boundary line adjustment if both parties agree</li>';
    } else if (circumstances === 'abandoned') {
      d += '<li>Verify ownership through county records</li>';
      d += '<li>Contact the actual property owner (may be deceased estate, bank, or government)</li>';
      d += '<li>If you are occupying: understand that adverse possession requires ' + apYears + ' years' + (state.taxReq ? ' AND tax payment' : '') + '</li>';
      d += '<li>If you are the owner: post no-trespassing notices, file a police report, and begin eviction</li>';
    } else {
      d += '<li>Consult a real estate attorney to evaluate the title claim</li>';
      d += '<li>Conduct a title search to verify ownership history</li>';
      d += '<li>File a quiet title action if ownership is disputed</li>';
      d += '<li>If color of title is invalid, proceed with standard eviction</li>';
    }

    d += '</ol></div>';

    // Adverse possession requirements
    d += '<div style="padding:14px;background:#eff6ff;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Adverse Possession Requirements in ' + state.name + '</strong><br>';
    d += 'All five elements must be met for ' + apYears + ' continuous years:<br>';
    d += '<ol style="margin:4px 0 0 0;padding-left:20px;line-height:1.7">';
    d += '<li><strong>Actual:</strong> physically present and using the property</li>';
    d += '<li><strong>Open & Notorious:</strong> visible to anyone, not hidden</li>';
    d += '<li><strong>Exclusive:</strong> not sharing possession with the owner</li>';
    d += '<li><strong>Continuous:</strong> uninterrupted for the full statutory period</li>';
    d += '<li><strong>Hostile:</strong> without permission of the owner</li>';
    if (state.taxReq) {
      d += '<li><strong>Tax Payment:</strong> must have paid property taxes during the entire period</li>';
    }
    d += '</ol></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.8rem">';
    d += '<strong>Important:</strong> This tool provides general information about ' + state.name + ' adverse possession law. Actual outcomes depend on specific facts, evidence, and judicial interpretation. Property law is complex — consult a licensed real estate attorney in your jurisdiction for advice on your situation.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

})();
