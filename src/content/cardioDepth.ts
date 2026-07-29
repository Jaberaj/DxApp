/* ══════════════════════════════════════════════════════════════
   Cardiovascular — variety pour.

   Depth on the existing CV differentials — the murmurs, heart failure,
   the reperfusion and rhythm decisions, and hypertensive emergencies —
   adding the management (tx_*) side and the mimics so each is drilled
   several ways. Items only; no new concepts or subtopics.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (ACC/AHA/ESC
   guidelines, primary literature). Board-prep is coverage/inspiration
   only, never copied. Synthetic patients; enters review UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import { v, type ContentModule, type RawItem } from './authoring';

const items: RawItem[] = [
  /* ── Aortic stenosis ──────────────────────────────────────────── */
  {
    itemId: 'as-ddx', version: 1, type: 'discriminator', conceptId: 'as-syncope', presentation: 'classic',
    stem: 'A harsh systolic murmur is heard. What finding points to aortic stenosis rather than hypertrophic cardiomyopathy?',
    vitals: [],
    findings: ['A crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids.'],
    options: [
      { id: 'a', text: 'The murmur SOFTENS with Valsalva and radiates to the carotids, with pulsus parvus et tardus', correct: true },
      { id: 'b', text: 'The murmur gets LOUDER with Valsalva', whyNot: 'Increasing with Valsalva (reduced preload) is characteristic of HOCM, not aortic stenosis.' },
      { id: 'c', text: 'The murmur gets louder with squatting to standing', whyNot: 'Louder on standing (less preload) again points to HOCM; AS softens when preload falls.' },
      { id: 'd', text: 'A mid-systolic click', whyNot: 'A mid-systolic click suggests mitral valve prolapse, not aortic stenosis.' },
    ],
    discriminator: 'Aortic stenosis softens with maneuvers that reduce preload (Valsalva, standing) and gives pulsus parvus et tardus with carotid radiation, whereas HOCM gets louder as preload falls.',
    tags: { system: 'cardiovascular', complaint: 'murmur', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.55,
    source: [{ ref: 'Otto et al., ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease', year: 2020 }],
  },
  {
    itemId: 'as-tx', version: 1, type: 'tx_threshold', conceptId: 'as-syncope', presentation: 'severe',
    stem: 'A patient with severe aortic stenosis now has exertional syncope and angina. What is the definitive treatment?',
    vitals: [],
    findings: ['Severe AS by echo with new symptoms.'],
    options: [
      { id: 'a', text: 'Aortic valve replacement (surgical or transcatheter)', correct: true },
      { id: 'b', text: 'A vasodilator such as nitroprusside for the symptoms', whyNot: 'Vasodilators are dangerous in severe AS (fixed obstruction) and can cause profound hypotension; they do not treat the valve.' },
      { id: 'c', text: 'Lifelong observation', whyNot: 'Symptomatic severe AS has a poor prognosis without valve replacement; watchful waiting is not appropriate once symptoms appear.' },
      { id: 'd', text: 'Diuretics alone', whyNot: 'Diuretics may transiently help congestion but do not relieve the fixed obstruction; the valve must be replaced.' },
    ],
    discriminator: 'Once severe aortic stenosis causes symptoms — angina, syncope, or heart failure — aortic valve replacement is indicated, and preload-dependent vasodilators are hazardous.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Otto et al., ACC/AHA Valvular Heart Disease Guideline', year: 2020 }],
  },

  /* ── Acute heart failure ──────────────────────────────────────── */
  {
    itemId: 'adhf-tx2', version: 1, type: 'tx_next_step', conceptId: 'adhf-recognition', presentation: 'classic',
    stem: 'A patient arrives with pulmonary edema, orthopnea, and diffuse crackles from decompensated heart failure, warm and wet. What is the immediate treatment for the congestion?',
    vitals: [v('SpO₂', '88%', true), v('BP', '148/92', false)],
    findings: ['Volume overload with adequate perfusion (warm and wet).'],
    options: [
      { id: 'a', text: 'An IV loop diuretic (± vasodilator/oxygen support)', correct: true },
      { id: 'b', text: 'Aggressive IV fluid boluses', whyNot: 'The patient is volume overloaded; fluids would worsen the pulmonary edema.' },
      { id: 'c', text: 'A negative-inotrope rate-control drug as first move', whyNot: 'Blunting contractility acutely in decompensated failure can worsen output; decongestion with diuretics comes first.' },
      { id: 'd', text: 'Start a beta-blocker during the acute decompensation', whyNot: 'Beta-blockers are begun once euvolemic and stable, not during acute pulmonary edema.' },
    ],
    discriminator: 'The "warm and wet" decompensated heart-failure patient is treated with IV loop diuretics (adding vasodilators for hypertension), while beta-blockers are deferred until stabilized.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Guideline for the Management of Heart Failure', year: 2022 }],
  },
  {
    itemId: 'adhf-gdmt', version: 1, type: 'tx_next_step', conceptId: 'adhf-recognition', presentation: 'atypical',
    stem: 'A stable outpatient with heart failure and a reduced ejection fraction (HFrEF, EF 30%) is on no disease-modifying therapy. Which regimen improves survival?',
    vitals: [],
    findings: ['Euvolemic, EF 30%, NYHA class II.'],
    options: [
      { id: 'a', text: 'The four pillars: an ARNI (or ACE inhibitor/ARB), a beta-blocker, an MRA, and an SGLT2 inhibitor', correct: true },
      { id: 'b', text: 'A loop diuretic alone', whyNot: 'Diuretics relieve congestion but do not improve survival; the four guideline-directed classes do.' },
      { id: 'c', text: 'A calcium-channel blocker (verapamil/diltiazem)', whyNot: 'Non-dihydropyridine calcium-channel blockers are avoided in HFrEF because of their negative inotropy.' },
      { id: 'd', text: 'Digoxin as first-line survival therapy', whyNot: 'Digoxin may reduce hospitalizations but does not improve survival and is not foundational therapy.' },
    ],
    discriminator: 'HFrEF survival is improved by guideline-directed medical therapy — an ARNI/ACEi, a beta-blocker, an MRA, and an SGLT2 inhibitor — not by diuretics, which only relieve symptoms.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'fm'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Heart Failure Guideline', year: 2022 }],
  },
  {
    itemId: 'adhf-ddx', version: 1, type: 'discriminator', conceptId: 'adhf-recognition', presentation: 'atypical',
    stem: 'Two patients have heart failure symptoms. One has an ejection fraction of 25%; the other 60% with a stiff, hypertrophied ventricle. How are they classified?',
    vitals: [],
    findings: ['Both are congested; the difference is systolic function on echo.'],
    options: [
      { id: 'a', text: 'HFrEF (reduced EF) vs HFpEF (preserved EF, diastolic dysfunction)', correct: true },
      { id: 'b', text: 'Both are HFrEF', whyNot: 'The preserved-EF patient has HFpEF (diastolic failure), a distinct entity with different evidence-based therapy.' },
      { id: 'c', text: 'Both are HFpEF', whyNot: 'An EF of 25% is reduced ejection fraction (HFrEF), not preserved.' },
      { id: 'd', text: 'Neither is heart failure without a BNP', whyNot: 'Heart failure is a clinical syndrome; the echo EF classifies the type, and BNP supports but does not define it.' },
    ],
    discriminator: 'Heart failure with reduced EF (≤40%) is a contractility problem, whereas HFpEF (EF ≥50%) is a stiff-ventricle diastolic problem — the distinction drives which therapies actually help.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Heart Failure Guideline', year: 2022 }],
  },
  {
    itemId: 'adhf-precip-ol', version: 1, type: 'one_liner', conceptId: 'adhf-precipitant', presentation: 'classic',
    stem: 'A compensated heart-failure patient suddenly decompensates. Which of these is the classic dietary precipitant to ask about first?',
    vitals: [],
    findings: ['Rapid weight gain and worsening edema over days.'],
    options: [
      { id: 'a', text: 'Dietary sodium (and fluid) indiscretion or medication nonadherence', correct: true },
      { id: 'b', text: 'Low-sodium diet', whyNot: 'A low-sodium diet helps prevent decompensation; it is not a precipitant.' },
      { id: 'c', text: 'Taking too much of the prescribed diuretic', whyNot: 'Excess diuretic causes volume depletion, not the congestion of decompensation.' },
      { id: 'd', text: 'Regular exercise', whyNot: 'Appropriate activity is beneficial and not a typical trigger of decompensation.' },
    ],
    discriminator: 'The most common precipitants of heart-failure decompensation are dietary sodium/fluid excess and medication nonadherence — the first things to ask about.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Heart Failure Guideline', year: 2022 }],
  },

  /* ── STEMI reperfusion ────────────────────────────────────────── */
  {
    itemId: 'stemi-reperf-thr', version: 1, type: 'tx_threshold', conceptId: 'stemi-reperfusion', presentation: 'severe',
    stem: 'A patient with a confirmed STEMI presents to a hospital WITHOUT on-site PCI. Transfer to a PCI center would take an estimated 150 minutes. What is the best reperfusion strategy?',
    vitals: [],
    findings: ['STEMI within the reperfusion window; no PCI available in time.'],
    options: [
      { id: 'a', text: 'Give fibrinolysis now (then transfer), since timely PCI is not achievable', correct: true },
      { id: 'b', text: 'Transfer for primary PCI regardless of the delay', whyNot: 'If PCI cannot be achieved within ~120 minutes of first medical contact, fibrinolysis should not be delayed for transfer.' },
      { id: 'c', text: 'Antiplatelet therapy alone without reperfusion', whyNot: 'A STEMI needs reperfusion; antiplatelets alone do not open the occluded artery.' },
      { id: 'd', text: 'Wait and repeat the ECG in a few hours', whyNot: 'Delaying reperfusion in an evolving STEMI increases infarct size and mortality.' },
    ],
    discriminator: 'Primary PCI is preferred within ~90 minutes of arrival, but when it cannot be delivered within ~120 minutes of first medical contact, fibrinolysis is given without delay.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'O’Gara et al., ACC/AHA Guideline for the Management of ST-Elevation Myocardial Infarction', year: 2013 }],
  },

  /* ── Atrial fibrillation ──────────────────────────────────────── */
  {
    itemId: 'afib-unstable', version: 1, type: 'cant_miss', conceptId: 'afib-anticoag', presentation: 'severe',
    stem: 'A patient with new atrial fibrillation and a rapid ventricular rate is hypotensive with chest pain and pulmonary edema. What is the immediate treatment?',
    vitals: [v('BP', '82/50', true), v('HR', '168', true)],
    findings: ['Hemodynamic instability attributed to the tachyarrhythmia.'],
    options: [
      { id: 'a', text: 'Immediate synchronized cardioversion', correct: true },
      { id: 'b', text: 'IV metoprolol and observe', whyNot: 'An unstable tachyarrhythmia requires electrical cardioversion; rate-control drugs act too slowly and can worsen hypotension.' },
      { id: 'c', text: 'Start warfarin and wait', whyNot: 'Anticoagulation is important but does nothing for the immediate hemodynamic collapse; cardioversion is needed now.' },
      { id: 'd', text: 'Adenosine', whyNot: 'Adenosine is for regular SVT; it does not convert atrial fibrillation and will not stabilize this patient.' },
    ],
    discriminator: 'Any tachyarrhythmia causing hemodynamic instability — hypotension, ischemia, or pulmonary edema — is treated with immediate synchronized cardioversion, regardless of the rhythm’s name.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['ecg-afib'],
    source: [{ ref: 'January et al., ACC/AHA/HRS Guideline for the Management of Patients With Atrial Fibrillation', year: 2019 }],
  },
  {
    itemId: 'afib-rate', version: 1, type: 'tx_next_step', conceptId: 'afib-anticoag', presentation: 'classic',
    stem: 'A hemodynamically STABLE patient has atrial fibrillation with a rapid ventricular response and no acute decompensation. What is a reasonable initial approach to the rate?',
    vitals: [v('HR', '128', true), v('BP', '132/80', false)],
    findings: ['Stable; the goal is controlling the ventricular rate.'],
    options: [
      { id: 'a', text: 'A beta-blocker or a non-dihydropyridine calcium-channel blocker for rate control', correct: true },
      { id: 'b', text: 'Immediate cardioversion for everyone', whyNot: 'A stable patient does not need emergent cardioversion, and cardioversion without adequate anticoagulation risks embolic stroke.' },
      { id: 'c', text: 'A calcium-channel blocker even though the EF is 25%', whyNot: 'Non-dihydropyridine calcium-channel blockers are avoided in significant systolic dysfunction; a beta-blocker (or digoxin) is preferred there.' },
      { id: 'd', text: 'No treatment', whyNot: 'A sustained rapid ventricular rate can cause symptoms and tachycardia-mediated cardiomyopathy; rate control is indicated.' },
    ],
    discriminator: 'Stable atrial fibrillation with a rapid rate is first rate-controlled with a beta-blocker or non-DHP calcium-channel blocker (avoid the latter in low EF), separate from the CHA₂DS₂-VASc-based anticoagulation decision.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'January et al., ACC/AHA/HRS Atrial Fibrillation Guideline', year: 2019 }],
  },

  /* ── Hypertensive emergency ───────────────────────────────────── */
  {
    itemId: 'htn-emerg-tx', version: 1, type: 'tx_threshold', conceptId: 'htn-emergency', presentation: 'severe',
    stem: 'A patient has a blood pressure of 220/130 with a headache, blurred vision, and papilledema (hypertensive emergency). How fast should the pressure be lowered?',
    vitals: [v('BP', '220/130', true)],
    findings: ['Acute target-organ damage from severe hypertension.'],
    options: [
      { id: 'a', text: 'Lower it in a controlled way — roughly 10–20% in the first hour — with an IV agent', correct: true },
      { id: 'b', text: 'Normalize the blood pressure within minutes', whyNot: 'Precipitous lowering can cause cerebral, coronary, or renal hypoperfusion; controlled reduction is safer.' },
      { id: 'c', text: 'Give a single oral agent and discharge', whyNot: 'True hypertensive emergency (target-organ damage) needs IV therapy and monitoring, not outpatient oral treatment.' },
      { id: 'd', text: 'Withhold treatment until the cause is found', whyNot: 'Active target-organ damage requires prompt controlled blood-pressure reduction while the workup proceeds.' },
    ],
    discriminator: 'Hypertensive emergency (severe hypertension WITH target-organ damage) is lowered in a controlled fashion — about 10–20% in the first hour — with titratable IV agents, not normalized abruptly.',
    tags: { system: 'cardiovascular', complaint: 'hypertension', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Whelton et al., ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults', year: 2018 }],
  },

  /* ── Secondary hypertension ───────────────────────────────────── */
  {
    itemId: 'sec-htn-assoc', version: 1, type: 'association', conceptId: 'secondary-htn', presentation: 'atypical',
    stem: 'A 32-year-old with resistant hypertension has hypokalemia and metabolic alkalosis without diuretic use. Which secondary cause is most likely?',
    vitals: [v('K', '3.0', true), v('BP', '166/104', true)],
    findings: ['Young, resistant hypertension with spontaneous hypokalemia.'],
    options: [
      { id: 'a', text: 'Primary hyperaldosteronism', correct: true },
      { id: 'b', text: 'Essential hypertension', whyNot: 'Young age, resistance, and spontaneous hypokalemia point to a secondary endocrine cause, not primary essential hypertension.' },
      { id: 'c', text: 'White-coat hypertension', whyNot: 'Genuine hypokalemia and sustained high pressure are not a measurement artifact.' },
      { id: 'd', text: 'Isolated systolic hypertension of aging', whyNot: 'That is a disease of older adults, not a hypokalemic young patient.' },
    ],
    discriminator: 'Resistant hypertension in a young patient with spontaneous hypokalemia and metabolic alkalosis suggests primary hyperaldosteronism — screen with an aldosterone-to-renin ratio.',
    tags: { system: 'cardiovascular', complaint: 'hypertension', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    source: [{ ref: 'Funder et al., The Management of Primary Aldosteronism (Endocrine Society Clinical Practice Guideline)', year: 2016 }],
  },

  /* ── Familial hypercholesterolemia ────────────────────────────── */
  {
    itemId: 'fh-tx', version: 1, type: 'tx_next_step', conceptId: 'familial-hypercholesterolemia', presentation: 'classic',
    stem: 'A young adult has an LDL of 260 mg/dL, tendon xanthomas, and a family history of early myocardial infarction (familial hypercholesterolemia). What is first-line therapy?',
    vitals: [],
    findings: ['Markedly elevated LDL with tendon xanthomas and premature-CAD family history.'],
    options: [
      { id: 'a', text: 'High-intensity statin (adding ezetimibe/PCSK9 inhibitor as needed)', correct: true },
      { id: 'b', text: 'Diet and exercise alone', whyNot: 'Lifestyle helps but cannot control the very high LDL of familial hypercholesterolemia; high-intensity statins are essential.' },
      { id: 'c', text: 'A fibrate as first-line for the LDL', whyNot: 'Fibrates mainly lower triglycerides; statins are first-line for the markedly elevated LDL.' },
      { id: 'd', text: 'No treatment until an event occurs', whyNot: 'The whole point is to prevent premature cardiovascular events with early aggressive LDL lowering.' },
    ],
    discriminator: 'Familial hypercholesterolemia is treated aggressively with a high-intensity statin, escalating to ezetimibe and PCSK9 inhibitors, because the lifelong LDL burden drives premature coronary disease.',
    tags: { system: 'cardiovascular', complaint: 'dyslipidemia', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Grundy et al., AHA/ACC Guideline on the Management of Blood Cholesterol', year: 2018 }],
  },

  /* ── Tamponade ────────────────────────────────────────────────── */
  {
    itemId: 'tamponade-tx', version: 1, type: 'tx_next_step', conceptId: 'tamponade', presentation: 'severe',
    stem: 'A patient has hypotension, distended neck veins, muffled heart sounds, and pulsus paradoxus; echo shows a large effusion with diastolic right-atrial collapse. What is the treatment?',
    vitals: [v('BP', '84/58', true), v('HR', '124', true)],
    findings: ['Obstructive shock from cardiac tamponade.'],
    options: [
      { id: 'a', text: 'Pericardiocentesis (drain the effusion), with IV fluids as a temporizing bridge', correct: true },
      { id: 'b', text: 'IV diuresis to reduce the effusion', whyNot: 'Diuretics drop preload and worsen tamponade physiology; the fluid around the heart must be drained.' },
      { id: 'c', text: 'Nitroglycerin for the hypotension', whyNot: 'Vasodilators reduce preload and can precipitate collapse in tamponade.' },
      { id: 'd', text: 'Beta-blockade to slow the heart', whyNot: 'The compensatory tachycardia maintains output; slowing it can be fatal before the effusion is drained.' },
    ],
    discriminator: 'Cardiac tamponade is treated by draining the pericardial effusion (pericardiocentesis), using IV fluids only to temporize — preload-reducing drugs (diuretics, vasodilators) are dangerous.',
    tags: { system: 'cardiovascular', complaint: 'shock', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Adler et al., ESC Guidelines for the Diagnosis and Management of Pericardial Diseases', year: 2015 }],
  },
];

export const CARDIO_DEPTH: ContentModule = {
  concepts: [],
  subtopics: {},
  items,
};
