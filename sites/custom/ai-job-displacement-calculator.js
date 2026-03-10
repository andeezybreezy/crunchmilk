(function() {
  'use strict';

  var occupations = [
    { name: 'Accountant / Auditor', baseRisk: 42, taskType: 'analytical', skills: ['AI-augmented auditing', 'Strategic advisory', 'Complex tax planning'], alts: ['Financial Controller', 'Forensic Accountant'] },
    { name: 'Administrative Assistant', baseRisk: 65, taskType: 'routine_cognitive', skills: ['Project management', 'Executive strategy support', 'AI tool administration'], alts: ['Operations Coordinator', 'Executive Chief of Staff'] },
    { name: 'Attorney / Lawyer', baseRisk: 22, taskType: 'analytical', skills: ['Complex litigation strategy', 'Client relationship management', 'AI-assisted legal research'], alts: ['Compliance Officer', 'Legal Technology Consultant'] },
    { name: 'Bank Teller', baseRisk: 75, taskType: 'routine_cognitive', skills: ['Financial advising', 'Relationship banking', 'Wealth management'], alts: ['Personal Banker', 'Financial Advisor'] },
    { name: 'Bookkeeper', baseRisk: 78, taskType: 'routine_cognitive', skills: ['Financial analysis', 'Business advisory', 'Cloud accounting systems'], alts: ['Financial Analyst', 'Accounting Manager'] },
    { name: 'Carpenter', baseRisk: 6, taskType: 'physical_skill', skills: ['Sustainable building methods', 'Project management', 'Specialty craftsmanship'], alts: ['Construction Foreman', 'Building Inspector'] },
    { name: 'Chef / Cook', baseRisk: 12, taskType: 'physical_skill', skills: ['Menu innovation', 'Restaurant management', 'Food science'], alts: ['Food Service Manager', 'Culinary Instructor'] },
    { name: 'Civil Engineer', baseRisk: 15, taskType: 'analytical', skills: ['AI-assisted design', 'Sustainable infrastructure', 'Complex project management'], alts: ['Infrastructure Consultant', 'Construction Manager'] },
    { name: 'Content Writer / Copywriter', baseRisk: 58, taskType: 'creative', skills: ['Brand strategy', 'AI-assisted content management', 'Multimedia storytelling'], alts: ['Content Strategist', 'Brand Manager'] },
    { name: 'Customer Service Representative', baseRisk: 68, taskType: 'routine_cognitive', skills: ['Complex problem resolution', 'Customer success management', 'AI chatbot training'], alts: ['Customer Success Manager', 'Account Manager'] },
    { name: 'Data Entry Clerk', baseRisk: 85, taskType: 'routine_cognitive', skills: ['Data analysis', 'Database administration', 'AI workflow management'], alts: ['Data Analyst', 'Operations Specialist'] },
    { name: 'Dentist', baseRisk: 5, taskType: 'physical_skill', skills: ['Advanced procedures', 'Practice management', 'AI diagnostic tools'], alts: ['Oral Surgeon', 'Dental Practice Owner'] },
    { name: 'Electrician', baseRisk: 5, taskType: 'physical_skill', skills: ['Renewable energy systems', 'EV infrastructure', 'Smart home technology'], alts: ['Electrical Inspector', 'Solar Installation Manager'] },
    { name: 'Elementary School Teacher', baseRisk: 10, taskType: 'interpersonal', skills: ['AI-enhanced curriculum design', 'Social-emotional learning', 'EdTech integration'], alts: ['Instructional Designer', 'Education Consultant'] },
    { name: 'Financial Analyst', baseRisk: 45, taskType: 'analytical', skills: ['AI-augmented modeling', 'Strategic advisory', 'Alternative data analysis'], alts: ['Investment Manager', 'FP&A Director'] },
    { name: 'Graphic Designer', baseRisk: 42, taskType: 'creative', skills: ['AI art direction', 'Brand system design', 'UX/UI strategy'], alts: ['Creative Director', 'UX Designer'] },
    { name: 'HR Specialist', baseRisk: 35, taskType: 'interpersonal', skills: ['People analytics', 'DEI strategy', 'Organizational development'], alts: ['HR Business Partner', 'People Operations Manager'] },
    { name: 'Insurance Underwriter', baseRisk: 62, taskType: 'analytical', skills: ['Complex risk assessment', 'AI model oversight', 'Specialty markets'], alts: ['Risk Manager', 'Actuarial Analyst'] },
    { name: 'Janitor / Maintenance', baseRisk: 15, taskType: 'routine_physical', skills: ['Facilities management', 'Building systems technology', 'Environmental compliance'], alts: ['Facilities Manager', 'Building Engineer'] },
    { name: 'Journalist / Reporter', baseRisk: 38, taskType: 'creative', skills: ['Investigative journalism', 'Multimedia production', 'AI fact-checking tools'], alts: ['Investigative Reporter', 'Communications Director'] },
    { name: 'Marketing Manager', baseRisk: 25, taskType: 'management', skills: ['AI-driven marketing strategy', 'Brand building', 'Cross-channel analytics'], alts: ['Chief Marketing Officer', 'Growth Strategist'] },
    { name: 'Mechanical Engineer', baseRisk: 14, taskType: 'analytical', skills: ['AI-assisted design optimization', 'Robotics integration', 'Sustainable engineering'], alts: ['Engineering Manager', 'Product Design Lead'] },
    { name: 'Medical Doctor (General)', baseRisk: 8, taskType: 'physical_skill', skills: ['AI diagnostic tools', 'Telemedicine', 'Precision medicine'], alts: ['Medical Director', 'Healthcare Administrator'] },
    { name: 'Nurse (RN)', baseRisk: 6, taskType: 'interpersonal', skills: ['Advanced practice nursing', 'AI health monitoring', 'Care coordination'], alts: ['Nurse Practitioner', 'Clinical Nurse Specialist'] },
    { name: 'Paralegal', baseRisk: 55, taskType: 'routine_cognitive', skills: ['AI legal research tools', 'Complex case management', 'E-discovery expertise'], alts: ['Legal Project Manager', 'Compliance Analyst'] },
    { name: 'Pharmacist', baseRisk: 28, taskType: 'analytical', skills: ['Clinical pharmacy', 'Medication therapy management', 'AI drug interaction tools'], alts: ['Clinical Pharmacist', 'Pharmacy Director'] },
    { name: 'Photographer', baseRisk: 30, taskType: 'creative', skills: ['AI-enhanced editing', 'Videography', 'Brand visual strategy'], alts: ['Visual Director', 'Multimedia Producer'] },
    { name: 'Physical Therapist', baseRisk: 7, taskType: 'physical_skill', skills: ['Telerehab technology', 'Sports performance', 'AI movement analysis'], alts: ['PT Practice Owner', 'Sports Medicine Specialist'] },
    { name: 'Plumber', baseRisk: 4, taskType: 'physical_skill', skills: ['Sustainable plumbing systems', 'Project management', 'Business development'], alts: ['Plumbing Contractor', 'Building Inspector'] },
    { name: 'Police Officer', baseRisk: 8, taskType: 'interpersonal', skills: ['Data-driven policing', 'Community relations', 'Technology forensics'], alts: ['Detective', 'Security Director'] },
    { name: 'Product Manager', baseRisk: 18, taskType: 'management', skills: ['AI product strategy', 'Data-driven decision making', 'Cross-functional leadership'], alts: ['VP of Product', 'Strategy Consultant'] },
    { name: 'Professor / Lecturer', baseRisk: 15, taskType: 'interpersonal', skills: ['AI-enhanced pedagogy', 'Research innovation', 'Online education design'], alts: ['Research Director', 'EdTech Consultant'] },
    { name: 'Project Manager', baseRisk: 22, taskType: 'management', skills: ['AI-augmented planning', 'Change management', 'Agile transformation'], alts: ['Program Director', 'Operations Director'] },
    { name: 'Real Estate Agent', baseRisk: 32, taskType: 'interpersonal', skills: ['Luxury/commercial specialization', 'AI market analytics', 'Client relationship building'], alts: ['Real Estate Developer', 'Property Manager'] },
    { name: 'Receptionist', baseRisk: 72, taskType: 'routine_cognitive', skills: ['Office management', 'Executive support', 'AI scheduling tools'], alts: ['Office Manager', 'Operations Coordinator'] },
    { name: 'Retail Cashier', baseRisk: 70, taskType: 'routine_cognitive', skills: ['Customer experience', 'Visual merchandising', 'Retail management'], alts: ['Retail Manager', 'E-commerce Specialist'] },
    { name: 'Retail Sales Associate', baseRisk: 48, taskType: 'interpersonal', skills: ['Consultative selling', 'Product expertise', 'Omnichannel retail'], alts: ['Sales Manager', 'Brand Ambassador'] },
    { name: 'Social Worker', baseRisk: 8, taskType: 'interpersonal', skills: ['Trauma-informed care', 'Community resource coordination', 'Telehealth skills'], alts: ['Clinical Social Worker', 'Program Director'] },
    { name: 'Software Developer', baseRisk: 25, taskType: 'analytical', skills: ['AI/ML engineering', 'System architecture', 'AI tool orchestration'], alts: ['Engineering Manager', 'Solutions Architect'] },
    { name: 'Surgeon', baseRisk: 4, taskType: 'physical_skill', skills: ['Robotic surgery', 'Minimally invasive techniques', 'AI diagnostic integration'], alts: ['Department Chief', 'Medical Researcher'] },
    { name: 'Tax Preparer', baseRisk: 78, taskType: 'routine_cognitive', skills: ['Complex tax strategy', 'AI tax tool management', 'Business advisory'], alts: ['Tax Attorney', 'Financial Planner'] },
    { name: 'Therapist / Counselor', baseRisk: 6, taskType: 'interpersonal', skills: ['Teletherapy', 'Specialized modalities', 'Group facilitation'], alts: ['Clinical Director', 'Private Practice Owner'] },
    { name: 'Translator / Interpreter', baseRisk: 60, taskType: 'analytical', skills: ['Cultural consulting', 'Specialized domain translation', 'AI translation oversight'], alts: ['Localization Manager', 'Cultural Consultant'] },
    { name: 'Truck Driver', baseRisk: 15, taskType: 'routine_physical', skills: ['Fleet management', 'Logistics technology', 'Autonomous vehicle oversight'], alts: ['Logistics Coordinator', 'Fleet Manager'] },
    { name: 'UX/UI Designer', baseRisk: 22, taskType: 'creative', skills: ['AI-informed design research', 'Design systems', 'Product strategy'], alts: ['Head of Design', 'Product Manager'] },
    { name: 'Warehouse Worker', baseRisk: 55, taskType: 'routine_physical', skills: ['Robotics maintenance', 'Logistics coordination', 'Inventory management'], alts: ['Warehouse Manager', 'Supply Chain Analyst'] },
    { name: 'Web Developer', baseRisk: 42, taskType: 'analytical', skills: ['Full-stack architecture', 'AI-assisted development', 'DevOps & cloud'], alts: ['Solutions Architect', 'Engineering Manager'] }
  ];

  var taskMultipliers = {
    routine_cognitive: 1.3,
    routine_physical: 0.9,
    analytical: 1.0,
    creative: 0.85,
    interpersonal: 0.6,
    physical_skill: 0.4,
    management: 0.7,
    mixed: 0.85
  };

  function fmt(n, d) {
    return n.toFixed(typeof d === 'undefined' ? 0 : d);
  }

  var occupationEl = document.getElementById('occupation');
  occupations.sort(function(a, b) { return a.name.localeCompare(b.name); });
  occupationEl.innerHTML = '<option value="">— Select Occupation —</option>';
  occupations.forEach(function(occ, i) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = occ.name;
    occupationEl.appendChild(opt);
  });

  var chartData = [
    ['Data Entry Clerk', '72%', '89%', 'LLMs + RPA', 'Very High Risk'],
    ['Software Developer', '18%', '35%', 'AI Coding Tools', 'Moderate (Augmentation)'],
    ['Registered Nurse', '5%', '12%', 'Minimal', 'Low Risk'],
    ['Truck Driver', '8%', '28%', 'Autonomous Vehicles', 'Growing Risk'],
    ['Financial Analyst', '35%', '55%', 'LLMs + Analytics AI', 'High Risk'],
    ['Electrician', '3%', '8%', 'Minimal', 'Very Low Risk'],
    ['Customer Service Rep', '55%', '75%', 'Chatbots + LLMs', 'Very High Risk']
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
    var occIdx = parseInt(occupationEl.value);
    if (isNaN(occIdx) || occIdx < 0) return;

    var occ = occupations[occIdx];
    var education = document.getElementById('education').value;
    var experience = parseFloat(document.getElementById('experience').value) || 0;
    var taskType = document.getElementById('tasks').value;

    var base = occ.baseRisk;

    // Task type adjustment
    var taskMult = taskMultipliers[taskType] || 1.0;
    var adjusted = base * taskMult;

    // Education adjustment (higher ed = more adaptable, slightly lower displacement risk)
    var eduAdj = { highschool: 5, associate: 2, bachelor: 0, master: -3, doctoral: -5 };
    adjusted += (eduAdj[education] || 0);

    // Experience: senior people have more resilience but also cost more
    if (experience > 15) adjusted -= 5;
    else if (experience > 8) adjusted -= 3;
    else if (experience < 3) adjusted += 3;

    var risk5 = Math.max(2, Math.min(92, adjusted));
    var risk10 = Math.max(5, Math.min(95, risk5 * 1.45));

    // Task automation percentage (what % of tasks in this role AI can do)
    var taskAutomation = Math.min(95, risk5 * 1.2);

    var category = '';
    var catColor = '';
    if (risk5 <= 15) { category = 'Low Risk'; catColor = '#059669'; }
    else if (risk5 <= 30) { category = 'Moderate Risk'; catColor = '#f59e0b'; }
    else if (risk5 <= 55) { category = 'High Risk'; catColor = '#ea580c'; }
    else { category = 'Very High Risk'; catColor = '#dc2626'; }

    document.getElementById('rRisk5').textContent = fmt(risk5) + '%';
    document.getElementById('rRisk5').style.color = catColor;
    document.getElementById('rRisk10').textContent = fmt(risk10) + '%';
    document.getElementById('rRisk10').style.color = catColor;
    document.getElementById('rCategory').textContent = category;
    document.getElementById('rCategory').style.color = catColor;
    document.getElementById('rTaskPct').textContent = fmt(taskAutomation) + '% of tasks';

    var d = '';

    // Risk meter
    d += '<div style="margin-bottom:20px">';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-light)">';
    d += '<span>Low Risk</span><span>Moderate</span><span>High</span><span>Very High</span>';
    d += '</div>';
    d += '<div style="width:100%;height:20px;background:linear-gradient(to right, #059669, #f59e0b, #ea580c, #dc2626);border-radius:10px;position:relative;margin-top:4px">';
    d += '<div style="position:absolute;left:' + risk5 + '%;top:-4px;transform:translateX(-50%);width:12px;height:28px;background:#1f2937;border-radius:6px;border:2px solid white"></div>';
    d += '</div></div>';

    // Explanation
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;border-left:4px solid #6366f1;margin-bottom:16px">';
    d += '<strong>' + occ.name + '</strong><br>';
    d += '<span style="font-size:0.9rem">';
    if (risk5 <= 15) {
      d += 'This occupation has strong natural defenses against AI displacement. The core tasks require capabilities that AI currently struggles with. Focus on leveraging AI as a tool to enhance your effectiveness.';
    } else if (risk5 <= 30) {
      d += 'AI will change how this job is done but is unlikely to eliminate it in the near term. Some tasks will be automated, but the human elements remain essential. Workers who adopt AI tools will thrive.';
    } else if (risk5 <= 55) {
      d += 'Significant portions of this role are vulnerable to AI automation. The job will likely be restructured, with fewer people needed or different skills required. Active skill development is strongly recommended.';
    } else {
      d += 'This occupation faces substantial displacement risk. Many core tasks can already be performed by AI systems. Career pivoting or significant upskilling should be a priority.';
    }
    d += '</span></div>';

    // Skills to develop
    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:16px">';
    d += '<strong style="color:#059669">Skills to Develop</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    occ.skills.forEach(function(s) {
      d += '<li>' + s + '</li>';
    });
    d += '<li>AI tool proficiency (prompt engineering, workflow automation)</li>';
    d += '</ul></div>';

    // Alternative occupations
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:16px">';
    d += '<strong>Lower-Risk Career Alternatives</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    occ.alts.forEach(function(a) {
      d += '<li>' + a + '</li>';
    });
    d += '</ul></div>';

    // Nuance
    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.8rem">';
    d += '<strong>Important context:</strong> "Displacement risk" does not mean certain job loss. AI more often transforms roles than eliminates them entirely. Even high-risk occupations will not disappear overnight — adoption takes years. Workers who proactively learn AI tools and develop complementary skills will fare much better than those who resist change. This estimate is based on current AI capabilities and research projections, not certainty.';
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
