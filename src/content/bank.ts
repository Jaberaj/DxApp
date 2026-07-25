/* ══════════════════════════════════════════════════════════════
   Cadence — seed item bank
   Chest pain & dyspnea first (cardiovascular + pulmonary), with a
   renal seed so the review mix has something to draw from.

   Authoring rules (docs/product-guide.md):
   - The discriminator is ONE sentence. It is the product.
   - Every distractor carries its own "why not" rebuttal.
   - Scheduling is per concept; flagship concepts carry 2+ item
     variants so the reasoning is drilled, not the vignette.
   - difficultySeed is an author guess at p(correct); it gets
     overwritten by observed performance once items have exposures.
   - All patients are synthetic. Educational use only, not clinical
     guidance.
   ══════════════════════════════════════════════════════════════ */

import type { Concept, Item, Vital } from '../types';

const v = (label: string, value: string, hot = false): Vital => ({ label, value, hot });

export const CONCEPTS: Concept[] = [
  { conceptId: 'pe-recognition', name: 'Recognising pulmonary embolism', system: 'pulmonary', topic: 'Pulmonary embolism' },
  { conceptId: 'pe-workup', name: 'PE work-up by pretest probability', system: 'pulmonary', topic: 'Pulmonary embolism' },
  { conceptId: 'tension-ptx', name: 'Tension pneumothorax', system: 'pulmonary', topic: 'Pneumothorax & pleura' },
  { conceptId: 'spont-ptx', name: 'Spontaneous pneumothorax', system: 'pulmonary', topic: 'Pneumothorax & pleura' },
  { conceptId: 'silent-chest', name: 'The silent chest in asthma', system: 'pulmonary', topic: 'Airway emergencies' },
  { conceptId: 'copd-vs-hf', name: 'COPD flare vs heart failure', system: 'pulmonary', topic: 'Acute dyspnea' },
  { conceptId: 'cap-recognition', name: 'Community-acquired pneumonia', system: 'pulmonary', topic: 'Pneumonia' },
  { conceptId: 'stemi-recognition', name: 'Recognising STEMI', system: 'cardiovascular', topic: 'Acute coronary syndromes' },
  { conceptId: 'stemi-vs-pericarditis', name: 'STEMI vs pericarditis on ECG', system: 'cardiovascular', topic: 'Acute coronary syndromes' },
  { conceptId: 'dissection-first', name: 'Excluding aortic dissection', system: 'cardiovascular', topic: 'Aorta & pericardium' },
  { conceptId: 'tamponade', name: 'Cardiac tamponade', system: 'cardiovascular', topic: 'Aorta & pericardium' },
  { conceptId: 'vt-vs-svt', name: 'Wide-complex tachycardia', system: 'cardiovascular', topic: 'Tachyarrhythmias' },
  { conceptId: 'adhf-recognition', name: 'Decompensated heart failure', system: 'cardiovascular', topic: 'Heart failure' },
  { conceptId: 'adhf-precipitant', name: 'Naming the precipitant', system: 'cardiovascular', topic: 'Heart failure' },
  { conceptId: 'as-syncope', name: 'Aortic stenosis and syncope', system: 'cardiovascular', topic: 'Syncope & valves' },
  { conceptId: 'pleuritic-ddx', name: 'Building the pleuritic differential', system: 'pulmonary', topic: 'Acute chest pain' },
  { conceptId: 'prerenal-vs-atn', name: 'Prerenal AKI vs ATN', system: 'renal', topic: 'Acute kidney injury' },
  { conceptId: 'hyperk-first', name: 'Hyperkalemia — what comes first', system: 'renal', topic: 'Electrolytes' },
];

export const ITEMS: Item[] = [
  /* ── pe-recognition ──────────────────────────────────────── */
  {
    itemId: 'pe-recognition-1', version: 1, type: 'one_liner', conceptId: 'pe-recognition',
    stem: '41 F, sudden pleuritic chest pain and shortness of breath, six days after a right total knee replacement.',
    vitals: [v('HR', '118', true), v('RR', '24', true), v('SpO₂', '91% RA', true), v('BP', '112/70')],
    findings: ['Lungs clear. Right calf swollen and tender. ECG: sinus tachycardia.'],
    options: [
      { id: 'a', text: 'Pulmonary embolism', correct: true },
      { id: 'b', text: 'Community-acquired pneumonia', whyNot: 'No fever, no cough, and the lungs are clear — pneumonia changes the lung exam.' },
      { id: 'c', text: 'Spontaneous pneumothorax', whyNot: 'Breath sounds are symmetric and present; pneumothorax takes them away on one side.' },
      { id: 'd', text: 'Costochondritis', whyNot: 'Costochondritis does not desaturate you or push your heart rate to 118.' },
    ],
    discriminator: 'Recent surgery, a swollen unilateral calf, and hypoxemia with a clear chest is PE — pneumonia and pneumothorax both change the lung exam.',
    teachingPoint: 'Hypoxemia with a normal lung exam should always make you ask what is blocking the circulation, not the airways.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['im', 'em', 'surg'], level: 'both' },
    difficultySeed: 0.8,
    source: [{ ref: 'ESC Guidelines on Acute Pulmonary Embolism', year: 2019 }],
  },
  {
    itemId: 'pe-recognition-2', version: 1, type: 'one_liner', conceptId: 'pe-recognition',
    stem: '28 F on combined oral contraceptives, sharp right-sided chest pain worse on inspiration, one day after a 14-hour flight.',
    vitals: [v('HR', '112', true), v('RR', '22', true), v('SpO₂', '93% RA', true), v('BP', '118/74')],
    findings: ['Chest clear to auscultation. No chest wall tenderness. ECG: sinus tachycardia.'],
    options: [
      { id: 'a', text: 'Pulmonary embolism', correct: true },
      { id: 'b', text: 'Musculoskeletal chest pain', whyNot: 'There is no wall tenderness, and musculoskeletal pain does not lower the oxygen saturation.' },
      { id: 'c', text: 'Pericarditis', whyNot: 'Pericarditic pain is positional and the ECG would show diffuse ST elevation, not bare sinus tachycardia.' },
      { id: 'd', text: 'Panic attack', whyNot: 'Panic can explain the heart rate but never the hypoxemia — a diagnosis of exclusion after PE is ruled out.' },
    ],
    discriminator: 'Estrogen plus prolonged immobility is a provoked-VTE setting: pleuritic pain, tachycardia, and hypoxemia with a clear chest is PE until proven otherwise.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['im', 'em', 'obgyn'], level: 'both' },
    difficultySeed: 0.75,
    source: [{ ref: 'ESC Guidelines on Acute Pulmonary Embolism', year: 2019 }],
  },
  {
    itemId: 'pe-recognition-3', version: 1, type: 'discriminator', conceptId: 'pe-recognition',
    stem: 'Two diagnoses are on the table for an acutely dyspneic, hypoxemic patient: pulmonary embolism and lobar pneumonia. Which single finding best separates them?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'A completely clear lung exam despite hypoxemia', correct: true },
      { id: 'b', text: 'Tachycardia above 110', whyNot: 'Both diagnoses drive the heart rate up — it separates nothing.' },
      { id: 'c', text: 'Pleuritic quality of the pain', whyNot: 'Both pneumonia touching the pleura and PE cause pleuritic pain.' },
      { id: 'd', text: 'An elevated white cell count', whyNot: 'Leukocytosis is a stress response; PE raises it too.' },
    ],
    discriminator: 'Pneumonia consolidates and you hear it; PE blocks vessels and you hear nothing — hypoxemia with a silent, clear chest points to the circulation.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.7,
    source: [{ ref: 'ESC Guidelines on Acute Pulmonary Embolism', year: 2019 }],
  },

  /* ── pe-workup ───────────────────────────────────────────── */
  {
    itemId: 'pe-workup-1', version: 1, type: 'next_step', conceptId: 'pe-workup',
    stem: '63 M, two weeks after hip surgery, with pleuritic pain, a swollen left calf, HR 116 and SpO₂ 90%. Wells score is 9. What do you order?',
    vitals: [v('HR', '116', true), v('SpO₂', '90% RA', true), v('BP', '124/78')],
    findings: [],
    options: [
      { id: 'a', text: 'CT pulmonary angiography', correct: true },
      { id: 'b', text: 'D-dimer', whyNot: 'With high pretest probability a negative D-dimer cannot rule PE out — it can only delay the scan.' },
      { id: 'c', text: 'Ventilation–perfusion scan', whyNot: 'V/Q is the fallback when CT is contraindicated — renal failure, contrast allergy, pregnancy — not the default.' },
      { id: 'd', text: 'Serial troponins', whyNot: 'Troponin stratifies severity once PE is found; it neither confirms nor excludes the diagnosis.' },
    ],
    discriminator: 'High pretest probability goes straight to CTPA — a D-dimer can only mislead you there, because a negative result still leaves PE likely.',
    teachingPoint: 'D-dimer is a rule-out test for low and intermediate probability only.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.65,
    source: [{ ref: 'ESC Guidelines on Acute Pulmonary Embolism', year: 2019 }],
  },
  {
    itemId: 'pe-workup-2', version: 1, type: 'next_step', conceptId: 'pe-workup',
    stem: '24 M with a day of vague chest discomfort. No risk factors, normal vitals, normal exam, Wells score 0. He is worried about a clot. What do you order?',
    vitals: [v('HR', '76'), v('SpO₂', '99% RA'), v('BP', '122/76')],
    findings: [],
    options: [
      { id: 'a', text: 'D-dimer (or apply PERC and order nothing)', correct: true },
      { id: 'b', text: 'CT pulmonary angiography', whyNot: 'Scanning a low-probability patient trades a tiny miss risk for radiation, contrast, and false positives.' },
      { id: 'c', text: 'Lower-limb Doppler ultrasound', whyNot: 'He has no leg symptoms; Doppler answers a question nobody asked.' },
      { id: 'd', text: 'Empiric anticoagulation', whyNot: 'Anticoagulating on a 0-point pretest exposes him to bleeding for a diagnosis you have not made.' },
    ],
    discriminator: 'Low pretest probability is exactly where D-dimer earns its keep — a negative result ends the work-up without a scan.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['im', 'em', 'fm'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'ESC Guidelines on Acute Pulmonary Embolism', year: 2019 }],
  },

  /* ── tension-ptx ─────────────────────────────────────────── */
  {
    itemId: 'tension-ptx-1', version: 1, type: 'next_step', conceptId: 'tension-ptx',
    stem: '22 M stabbed in the left chest. Rapidly worsening dyspnea, distended neck veins, trachea deviated right, no breath sounds on the left.',
    vitals: [v('HR', '134', true), v('BP', '82/50', true), v('SpO₂', '85%', true), v('RR', '32', true)],
    findings: [],
    options: [
      { id: 'a', text: 'Immediate needle decompression', correct: true },
      { id: 'b', text: 'Portable chest X-ray', whyNot: 'Tension pneumothorax is a clinical diagnosis — the patient can arrest in the time the film takes.' },
      { id: 'c', text: 'CT chest', whyNot: 'Sending an obstructed, hypotensive chest to the scanner is how tension pneumothorax kills in hospital.' },
      { id: 'd', text: 'Intubate first', whyNot: 'Positive-pressure ventilation pumps more air into the pleural space and accelerates the arrest.' },
    ],
    discriminator: 'Hypotension plus absent unilateral breath sounds and distended neck veins is tension pneumothorax — decompress on the clinical picture, never wait for imaging.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['em', 'surg'], level: 'both' },
    difficultySeed: 0.8,
    source: [{ ref: 'ATLS 10th edition', year: 2018 }],
  },
  {
    itemId: 'tension-ptx-2', version: 1, type: 'cant_miss', conceptId: 'tension-ptx',
    stem: 'A ventilated ICU patient suddenly becomes hypotensive with rising airway pressures and absent breath sounds on the right. Which diagnosis must you act on before anything else?',
    vitals: [v('HR', '128', true), v('BP', '78/46', true), v('SpO₂', '84%', true)],
    findings: [],
    options: [
      { id: 'a', text: 'Tension pneumothorax', correct: true },
      { id: 'b', text: 'Ventilator-associated pneumonia', whyNot: 'VAP evolves over days with fever and secretions — it does not crash the blood pressure in a minute.' },
      { id: 'c', text: 'Mucus plugging', whyNot: 'Plugging explains desaturation but not hypotension with high airway pressures on one silent side.' },
      { id: 'd', text: 'Sedation-related hypotension', whyNot: 'Sedation drops pressure without silencing one hemithorax or spiking airway pressures.' },
    ],
    discriminator: 'On positive-pressure ventilation, sudden hypotension with one silent hemithorax is tension physiology — every ventilated breath makes it worse.',
    teachingPoint: 'The can\'t-miss question is about what kills fastest, not what is most likely.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em', 'surg'], level: 'clerkship' },
    difficultySeed: 0.7,
    source: [{ ref: 'ATLS 10th edition', year: 2018 }],
  },

  /* ── spont-ptx ───────────────────────────────────────────── */
  {
    itemId: 'spont-ptx-1', version: 1, type: 'one_liner', conceptId: 'spont-ptx',
    stem: '19 M, tall and thin, smokes, sudden right-sided chest pain while watching television, now short of breath.',
    vitals: [v('HR', '104', true), v('RR', '22', true), v('SpO₂', '94% RA'), v('BP', '126/80')],
    findings: ['Reduced breath sounds and hyperresonance over the right chest. Trachea midline.'],
    options: [
      { id: 'a', text: 'Primary spontaneous pneumothorax', correct: true },
      { id: 'b', text: 'Pulmonary embolism', whyNot: 'PE leaves the lung exam normal — it does not make one side quiet and hyperresonant.' },
      { id: 'c', text: 'Acute asthma', whyNot: 'Asthma wheezes bilaterally; it does not silence a single hemithorax.' },
      { id: 'd', text: 'Pleural effusion', whyNot: 'An effusion is dull to percussion, not hyperresonant, and rarely this sudden.' },
    ],
    discriminator: 'One quiet, hyperresonant hemithorax in a tall thin young smoker is air in the pleural space — dullness would mean fluid instead.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.85,
    source: [{ ref: 'BTS Pleural Disease Guideline', year: 2023 }],
  },

  /* ── silent-chest ────────────────────────────────────────── */
  {
    itemId: 'silent-chest-1', version: 1, type: 'cant_miss', conceptId: 'silent-chest',
    stem: '17 F with severe asthma, brought in wheezing loudly. Twenty minutes later she is drowsy and the wheeze has gone quiet. Which possibility must you act on first?',
    vitals: [v('HR', '138', true), v('RR', '10', true), v('SpO₂', '88%', true)],
    findings: ['Minimal air entry bilaterally. Speaking in single words.'],
    options: [
      { id: 'a', text: 'Impending respiratory arrest — prepare for intubation', correct: true },
      { id: 'b', text: 'The bronchodilators are working', whyNot: 'Improvement means moving air easily and talking in sentences — not drowsiness with a falling respiratory rate.' },
      { id: 'c', text: 'Anxiety settling down', whyNot: 'A settling patient perks up; a tiring one goes quiet. Drowsiness plus hypoxemia is failure, not calm.' },
      { id: 'd', text: 'Pneumonia developing', whyNot: 'Pneumonia takes hours to days — it cannot explain a chest going silent in twenty minutes.' },
    ],
    discriminator: 'A silent chest in asthma means no air is moving at all — the disappearance of wheeze in a tiring patient signals arrest, not improvement.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['em', 'peds', 'im'], level: 'both' },
    difficultySeed: 0.75,
    source: [{ ref: 'GINA Global Strategy for Asthma Management', year: 2024 }],
  },

  /* ── copd-vs-hf ──────────────────────────────────────────── */
  {
    itemId: 'copd-vs-hf-1', version: 1, type: 'discriminator', conceptId: 'copd-vs-hf',
    stem: 'A breathless 70-year-old smoker could be having a COPD exacerbation or decompensated heart failure. Which single finding most strongly points to heart failure?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'An S3 gallop with elevated JVP', correct: true },
      { id: 'b', text: 'Diffuse wheeze', whyNot: '"Cardiac asthma" is real — pulmonary edema wheezes too, so wheeze cannot separate the two.' },
      { id: 'c', text: 'A 40-pack-year smoking history', whyNot: 'Smoking is a risk factor for both COPD and ischemic heart failure; it cuts neither way.' },
      { id: 'd', text: 'Accessory muscle use', whyNot: 'Any severe dyspnea recruits accessory muscles — it measures effort, not cause.' },
    ],
    discriminator: 'An S3 with a distended jugular vein is filling-pressure physiology — airways disease cannot raise the JVP or add a third heart sound.',
    teachingPoint: 'When the exam is equivocal, BNP is the tiebreaker.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em', 'fm'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA/HFSA Heart Failure Guideline', year: 2022 }],
  },

  /* ── cap-recognition ─────────────────────────────────────── */
  {
    itemId: 'cap-1', version: 1, type: 'one_liner', conceptId: 'cap-recognition',
    stem: '58 M, three days of fever, productive cough with rusty sputum, and right-sided chest pain on deep breaths.',
    vitals: [v('T', '38.9', true), v('HR', '102', true), v('RR', '24', true), v('SpO₂', '92% RA', true)],
    findings: ['Crackles and bronchial breathing at the right base with egophony.'],
    options: [
      { id: 'a', text: 'Community-acquired pneumonia', correct: true },
      { id: 'b', text: 'Pulmonary embolism', whyNot: 'Three days of fever with productive cough and a consolidated base is an infected lung, not a clot.' },
      { id: 'c', text: 'Acute bronchitis', whyNot: 'Bronchitis stays in the airways — no focal crackles, no egophony, rarely hypoxemia.' },
      { id: 'd', text: 'Tuberculosis', whyNot: 'TB smoulders over weeks with night sweats and weight loss, not three febrile days.' },
    ],
    discriminator: 'Fever, productive cough, and focal consolidation signs — crackles, bronchial breathing, egophony — localise infection to the lung parenchyma.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.85,
    source: [{ ref: 'ATS/IDSA Community-acquired Pneumonia Guideline', year: 2019 }],
  },

  /* ── stemi-recognition ───────────────────────────────────── */
  {
    itemId: 'stemi-1', version: 1, type: 'one_liner', conceptId: 'stemi-recognition',
    stem: '61 M, 40 minutes of crushing substernal chest pressure radiating to the left arm, diaphoretic and nauseated.',
    vitals: [v('HR', '96', true), v('BP', '148/92', true), v('SpO₂', '96% RA')],
    findings: ['ECG: 3 mm ST elevation in V2–V4 with ST depression in II, III, aVF.'],
    options: [
      { id: 'a', text: 'Anterior STEMI', correct: true },
      { id: 'b', text: 'Pericarditis', whyNot: 'Pericarditis elevates ST segments diffusely and never produces reciprocal depression.' },
      { id: 'c', text: 'Unstable angina', whyNot: 'Unstable angina by definition has no ST elevation — this ECG is diagnostic of infarction.' },
      { id: 'd', text: 'Esophageal spasm', whyNot: 'Spasm can mimic the pain but cannot write ST elevation with reciprocal changes on the ECG.' },
    ],
    discriminator: 'Regional ST elevation with reciprocal depression is a occluded coronary territory — the reciprocal changes are what pericarditis can never produce.',
    teachingPoint: 'The clock to the cath lab starts now, not after the troponin.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.85,
    source: [{ ref: 'ACC/AHA Chest Pain Guideline', year: 2021 }],
  },

  /* ── stemi-vs-pericarditis ───────────────────────────────── */
  {
    itemId: 'stemi-vs-peri-1', version: 1, type: 'discriminator', conceptId: 'stemi-vs-pericarditis',
    stem: 'A 34-year-old with chest pain has ST elevation. STEMI and acute pericarditis are both on the table. Which single ECG finding most favours pericarditis?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'Diffuse concave ST elevation with PR depression', correct: true },
      { id: 'b', text: 'ST elevation in V2–V4 only', whyNot: 'Elevation confined to one territory is regional — that is the anatomy of an occluded artery.' },
      { id: 'c', text: 'Reciprocal ST depression in inferior leads', whyNot: 'Reciprocal depression is the signature of STEMI; pericarditis does not produce it.' },
      { id: 'd', text: 'New Q waves', whyNot: 'Q waves mean dead myocardium — infarction, not inflammation of the sac around it.' },
    ],
    discriminator: 'Pericarditis inflames the whole sac — diffuse concave elevation with PR depression — while an occluded artery injures one territory and mirrors it with reciprocal depression.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.65,
    source: [{ ref: 'ESC Pericardial Diseases Guideline', year: 2015 }],
  },
  {
    itemId: 'stemi-vs-peri-2', version: 1, type: 'one_liner', conceptId: 'stemi-vs-pericarditis',
    stem: '29 M, two days of sharp central chest pain that is worse lying flat and eases when he sits up and leans forward. Recent viral illness.',
    vitals: [v('T', '37.8', true), v('HR', '92'), v('BP', '124/78')],
    findings: ['Scratchy triphasic rub at the left sternal border. ECG: diffuse concave ST elevation, PR depression.'],
    options: [
      { id: 'a', text: 'Acute pericarditis', correct: true },
      { id: 'b', text: 'Anterior STEMI', whyNot: 'STEMI pain does not change with position, and its ST elevation is regional with reciprocal depression.' },
      { id: 'c', text: 'Pulmonary embolism', whyNot: 'PE gives pleuritic pain with hypoxemia and a normal cardiac exam — not a rub with diffuse ST elevation.' },
      { id: 'd', text: 'GERD', whyNot: 'Reflux burns and relates to meals; it neither rubs on auscultation nor rewrites the ECG.' },
    ],
    discriminator: 'Positional pain relieved by sitting forward, a friction rub, and diffuse ST elevation after a viral illness is the full pericarditis script.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.8,
    source: [{ ref: 'ESC Pericardial Diseases Guideline', year: 2015 }],
  },

  /* ── dissection-first ────────────────────────────────────── */
  {
    itemId: 'dissection-1', version: 1, type: 'cant_miss', conceptId: 'dissection-first',
    stem: '66 M hypertensive smoker with abrupt tearing chest pain radiating to the interscapular back. ECG shows inferior ST elevation. Before treating the STEMI, which diagnosis must you exclude?',
    vitals: [v('BP R arm', '186/98', true), v('BP L arm', '148/86', true), v('HR', '98', true)],
    findings: ['Early diastolic murmur at the left sternal edge.'],
    options: [
      { id: 'a', text: 'Aortic dissection', correct: true },
      { id: 'b', text: 'Pulmonary embolism', whyNot: 'PE matters, but it does not cause tearing back pain, an arm-to-arm pressure gap, or a new regurgitant murmur.' },
      { id: 'c', text: 'Pericarditis', whyNot: 'Pericarditis is not made catastrophically worse by anticoagulation the way a dissected aorta is.' },
      { id: 'd', text: 'Esophageal rupture', whyNot: 'Boerhaave follows forceful vomiting and brings subcutaneous emphysema, not a pulse deficit.' },
    ],
    discriminator: 'Tearing pain to the back with a blood-pressure differential can be a dissection dissecting into a coronary — anticoagulate that and you convert an emergency into a fatality.',
    teachingPoint: 'A dissection flap into the right coronary ostium is the classic cause of inferior ST elevation with tearing pain.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['em', 'im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA Aortic Disease Guideline', year: 2022 }],
  },
  {
    itemId: 'dissection-2', version: 1, type: 'discriminator', conceptId: 'dissection-first',
    stem: 'Sudden severe chest pain: acute coronary syndrome or aortic dissection? Which single feature most favours dissection?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'Pain maximal at onset, tearing, radiating to the back', correct: true },
      { id: 'b', text: 'Radiation to the left arm', whyNot: 'Arm radiation is classic for myocardial ischemia — it argues for ACS, not against it.' },
      { id: 'c', text: 'Diaphoresis', whyNot: 'Sympathetic surge accompanies both — sweat separates nothing.' },
      { id: 'd', text: 'An elevated troponin', whyNot: 'A dissection that involves a coronary also raises troponin; the biomarker cannot arbitrate.' },
    ],
    discriminator: 'Ischemic pain crescendos over minutes; a tear is worst the instant it happens — maximal-at-onset pain radiating to the back is the aorta talking.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.65,
    source: [{ ref: 'ACC/AHA Aortic Disease Guideline', year: 2022 }],
  },

  /* ── tamponade ───────────────────────────────────────────── */
  {
    itemId: 'tamponade-1', version: 1, type: 'one_liner', conceptId: 'tamponade',
    stem: '54 F with metastatic breast cancer, progressive dyspnea over three days, now lightheaded on standing.',
    vitals: [v('HR', '122', true), v('BP', '86/64', true), v('SpO₂', '95% RA'), v('Pulsus', '18 mmHg', true)],
    findings: ['JVP elevated. Heart sounds distant. Lungs clear. ECG: low voltage with electrical alternans.'],
    options: [
      { id: 'a', text: 'Cardiac tamponade', correct: true },
      { id: 'b', text: 'Massive pulmonary embolism', whyNot: 'Massive PE shares the hypotension and clear lungs, but not distant heart sounds or electrical alternans.' },
      { id: 'c', text: 'Decompensated heart failure', whyNot: 'Failing ventricles flood the lungs with crackles; her clear chest argues the fluid is around the heart, not in the lungs.' },
      { id: 'd', text: 'Septic shock', whyNot: 'Sepsis drops the JVP and warms the periphery — hers is a high-JVP, obstructed picture.' },
    ],
    discriminator: 'Hypotension with a high JVP and clear lungs means the pump is being squeezed from outside — pulsus paradoxus and alternans confirm the pericardium is the cage.',
    teachingPoint: 'Malignancy is the most common cause of tamponade on the wards; get the echo now.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'ESC Pericardial Diseases Guideline', year: 2015 }],
  },

  /* ── vt-vs-svt ───────────────────────────────────────────── */
  {
    itemId: 'vt-vs-svt-1', version: 1, type: 'one_liner', conceptId: 'vt-vs-svt',
    stem: '72 M with a prior anterior MI, palpitations and presyncope. Regular wide-complex tachycardia at 170.',
    vitals: [v('HR', '170', true), v('BP', '104/68'), v('SpO₂', '97% RA')],
    findings: ['ECG: regular monomorphic wide-complex tachycardia, no clear P waves.'],
    options: [
      { id: 'a', text: 'Ventricular tachycardia', correct: true },
      { id: 'b', text: 'SVT with aberrancy', whyNot: 'Possible on the strip alone — but his infarct scar makes VT overwhelmingly more likely, and treating as SVT can be lethal.' },
      { id: 'c', text: 'Atrial fibrillation with bundle branch block', whyNot: 'AF is irregularly irregular; this rhythm is metronome-regular.' },
      { id: 'd', text: 'Sinus tachycardia with wide QRS', whyNot: 'Sinus rarely sits at 170 in a 72-year-old, and P waves would march in front of every QRS.' },
    ],
    discriminator: 'Structural heart disease makes wide-complex tachycardia VT until proven otherwise — that single line of history outweighs any morphology criterion on the strip.',
    teachingPoint: 'When unsure, treat as VT: the VT drugs are safe in SVT, but verapamil in VT can arrest the patient.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'AHA/ACC/HRS Ventricular Arrhythmias Guideline', year: 2017 }],
  },
  {
    itemId: 'vt-vs-svt-2', version: 1, type: 'discriminator', conceptId: 'vt-vs-svt',
    stem: 'Regular wide-complex tachycardia at 170. VT and SVT with aberrancy are both possible. Which single piece of information most reliably tips the diagnosis to VT?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'A history of prior myocardial infarction', correct: true },
      { id: 'b', text: 'A blood pressure of 104/68', whyNot: 'VT can be perfectly stable and SVT can be hypotensive — hemodynamics never separate the two.' },
      { id: 'c', text: 'Heart rate of exactly 170', whyNot: 'Both rhythms live in the 150–200 range; the number tells you nothing.' },
      { id: 'd', text: 'The patient feeling anxious', whyNot: 'Everyone in a tachyarrhythmia is anxious; symptoms do not sort rhythm origin.' },
    ],
    discriminator: 'Scar is the substrate for re-entry in the ventricle — a prior infarct makes VT the default diagnosis before you apply a single ECG criterion.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'AHA/ACC/HRS Ventricular Arrhythmias Guideline', year: 2017 }],
  },

  /* ── adhf-recognition ────────────────────────────────────── */
  {
    itemId: 'adhf-1', version: 1, type: 'one_liner', conceptId: 'adhf-recognition',
    stem: '68 F with prior MI and EF 35%, four days of worsening breathlessness, sleeping on four pillows, six pounds up on the home scale.',
    vitals: [v('HR', '96', true), v('BP', '158/88', true), v('RR', '22', true), v('SpO₂', '92% RA', true)],
    findings: ['JVP 12 cm. Bibasilar crackles. S3 gallop. Pitting edema to mid-shin. BNP 1840.'],
    options: [
      { id: 'a', text: 'Acute decompensated heart failure', correct: true },
      { id: 'b', text: 'COPD exacerbation', whyNot: 'COPD cannot raise the JVP, add an S3, or put six pounds of fluid on the scale in four days.' },
      { id: 'c', text: 'Pneumonia', whyNot: 'No fever, no cough, and the crackles are bilateral and basal — the pattern of fluid, not focal infection.' },
      { id: 'd', text: 'Pulmonary embolism', whyNot: 'PE presents with clear lungs and sudden onset, not four days of orthopnea and weight gain.' },
    ],
    discriminator: 'Orthopnea, weight gain, elevated JVP, and an S3 are congestion accumulating over days — the story of a failing pump, not an airway or a clot.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.85,
    source: [{ ref: 'ACC/AHA/HFSA Heart Failure Guideline', year: 2022 }],
  },

  /* ── adhf-precipitant ────────────────────────────────────── */
  {
    itemId: 'adhf-precip-1', version: 1, type: 'next_step', conceptId: 'adhf-precipitant',
    stem: 'The same 68-year-old is admitted with decompensated heart failure. Her medication history: lisinopril, metoprolol, atorvastatin, metformin — and furosemide, which she stopped a week ago because "it made me run to the bathroom all night." Diagnosis is settled. What is the most important thing to name in your assessment?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'The precipitant — she stopped her diuretic', correct: true },
      { id: 'b', text: 'Her LDL control on atorvastatin', whyNot: 'Lipids matter over years; they did not put six pounds of fluid on her in a week.' },
      { id: 'c', text: 'Screening for medication allergies', whyNot: 'Routine, and it explains nothing about why she decompensated now.' },
      { id: 'd', text: 'Her hemoglobin A1c', whyNot: 'Glycemic control is chronic-disease housekeeping, not the reason this admission happened this week.' },
    ],
    discriminator: 'A heart-failure admission without a named precipitant is half a diagnosis — hers is written in the medication list, and it is reversible and teachable.',
    teachingPoint: 'Non-adherence, ischemia, arrhythmia, infection, and dietary salt are the precipitants to hunt for every time.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.7,
    source: [{ ref: 'ACC/AHA/HFSA Heart Failure Guideline', year: 2022 }],
  },

  /* ── as-syncope ──────────────────────────────────────────── */
  {
    itemId: 'as-syncope-1', version: 1, type: 'one_liner', conceptId: 'as-syncope',
    stem: '78 M collapsed while climbing the stairs. He recalls exertional chest tightness for months and is increasingly short of breath.',
    vitals: [v('HR', '74'), v('BP', '108/86'), v('SpO₂', '96% RA')],
    findings: ['Harsh crescendo–decrescendo systolic murmur at the right upper sternal border radiating to the carotids. Slow-rising, weak carotid upstroke.'],
    options: [
      { id: 'a', text: 'Severe aortic stenosis', correct: true },
      { id: 'b', text: 'Vasovagal syncope', whyNot: 'Vasovagal faints happen standing still with a prodrome — not mid-exertion in a man with an outflow murmur.' },
      { id: 'c', text: 'Hypertrophic cardiomyopathy', whyNot: 'The right diagnosis in a 20-year-old athlete; at 78 with a slow-rising carotid pulse, the valve is the culprit.' },
      { id: 'd', text: 'Orthostatic hypotension', whyNot: 'Orthostasis strikes on standing up, not on the exertion of a staircase.' },
    ],
    discriminator: 'Exertional syncope with a harsh outflow murmur and a slow-rising pulse is a fixed valve that cannot raise output when the legs demand it.',
    teachingPoint: 'Syncope in severe AS carries a survival measured in a couple of years without valve replacement — this finding changes management today.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.75,
    source: [{ ref: 'ACC/AHA Valvular Heart Disease Guideline', year: 2020 }],
  },

  /* ── pleuritic-ddx ───────────────────────────────────────── */
  {
    itemId: 'pleuritic-ddx-1', version: 1, type: 'build_ddx', conceptId: 'pleuritic-ddx',
    stem: '26 M with sudden sharp chest pain that is clearly worse on inspiration. Pick the three diagnoses that belong at the top of this differential.',
    vitals: [],
    findings: [],
    selectCount: 3,
    options: [
      { id: 'a', text: 'Pulmonary embolism', correct: true },
      { id: 'b', text: 'Spontaneous pneumothorax', correct: true },
      { id: 'c', text: 'Pericarditis', correct: true },
      { id: 'd', text: 'Stable angina', whyNot: 'Anginal pain is a pressure brought on by exertion — it does not catch with each breath.' },
      { id: 'e', text: 'GERD', whyNot: 'Reflux burns after meals and lying down; breathing in does not change it.' },
    ],
    discriminator: 'Pleuritic pain means the pleura or pericardium is inflamed or the lung has acutely changed — PE, pneumothorax, and pericarditis all live on that surface; angina and reflux do not.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.7,
    source: [{ ref: 'ACC/AHA Chest Pain Guideline', year: 2021 }],
  },

  /* ── prerenal-vs-atn ─────────────────────────────────────── */
  {
    itemId: 'prerenal-atn-1', version: 1, type: 'discriminator', conceptId: 'prerenal-vs-atn',
    stem: 'Creatinine has doubled in a hospitalised patient. Prerenal azotemia and acute tubular necrosis are both plausible. Which single finding most favours ATN?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'Muddy brown granular casts on urine microscopy', correct: true },
      { id: 'b', text: 'A creatinine of exactly 2.4', whyNot: 'The absolute number measures severity, not mechanism — both causes can reach any creatinine.' },
      { id: 'c', text: 'Oliguria', whyNot: 'Both prerenal kidneys and necrotic tubules can make little urine; output does not separate them.' },
      { id: 'd', text: 'An elevated BUN', whyNot: 'BUN rises in both — although a high BUN:Cr ratio actually leans prerenal, not ATN.' },
    ],
    discriminator: 'Prerenal kidneys are intact and hold sodium avidly with a bland sediment; dying tubules slough into the urine as muddy brown casts.',
    teachingPoint: 'FeNa below 1% supports prerenal physiology — unless diuretics are on board, when FeUrea does the same job.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for AKI', year: 2012 }],
  },

  /* ── hyperk-first ────────────────────────────────────────── */
  {
    itemId: 'hyperk-1', version: 1, type: 'next_step', conceptId: 'hyperk-first',
    stem: 'Dialysis patient who missed two sessions. Potassium 7.2. ECG shows peaked T waves and a widening QRS. What do you give first?',
    vitals: [v('HR', '58', true), v('BP', '142/84'), v('K⁺', '7.2', true)],
    findings: [],
    options: [
      { id: 'a', text: 'IV calcium gluconate', correct: true },
      { id: 'b', text: 'Insulin with dextrose', whyNot: 'It shifts potassium into cells within the half hour — but the myocardium needs protecting in the next minute.' },
      { id: 'c', text: 'Urgent hemodialysis', whyNot: 'Dialysis removes the potassium and is definitely coming — but the membrane must be stabilised before the machine arrives.' },
      { id: 'd', text: 'Sodium polystyrene sulfonate', whyNot: 'A resin working over hours in the gut has no role in an emergency written on the ECG.' },
    ],
    discriminator: 'A widening QRS is the myocardium announcing imminent arrest — calcium stabilises the membrane in minutes and buys time for everything that actually lowers the potassium.',
    teachingPoint: 'Sequence: protect the membrane, then shift, then remove.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.7,
    source: [{ ref: 'KDIGO Controversies: Potassium Management', year: 2020 }],
  },
];

/** Rotation and course focus definitions (mirrors the mockup). */
export interface FocusOption {
  id: string;
  name: string;
  topicLine: string;
  /** systems whose items count as "on block" for this focus */
  systems: string[];
  /** for rotations: item rotation tag that counts as on-block */
  rotationTag?: string;
}

export const COURSES: FocusOption[] = [
  { id: 'cardiovascular', name: 'Cardiovascular', topicLine: 'chest pain, dyspnea, syncope', systems: ['cardiovascular'] },
  { id: 'pulmonary', name: 'Pulmonary', topicLine: 'cough, hypoxemia, wheeze', systems: ['pulmonary'] },
  { id: 'renal', name: 'Renal', topicLine: 'AKI, electrolytes, acid–base', systems: ['renal'] },
];

export const ROTATIONS: FocusOption[] = [
  { id: 'im', name: 'Internal Med', topicLine: 'chest pain and dyspnea', systems: ['cardiovascular', 'pulmonary', 'renal'], rotationTag: 'im' },
  { id: 'em', name: 'Emergency', topicLine: 'undifferentiated complaints', systems: ['cardiovascular', 'pulmonary', 'renal'], rotationTag: 'em' },
  { id: 'surg', name: 'Surgery', topicLine: 'acute abdomen, post-op', systems: ['pulmonary', 'renal'], rotationTag: 'surg' },
  { id: 'fm', name: 'Family Med', topicLine: 'clinic complaints, chronic care', systems: ['cardiovascular', 'pulmonary'], rotationTag: 'fm' },
];

export function conceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.conceptId === id);
}

export function itemsForConcept(conceptId: string): Item[] {
  return ITEMS.filter((i) => i.conceptId === conceptId);
}
