/* ══════════════════════════════════════════════════════════════
   Cardiovascular — breadth pour (knowledge-graph driven).

   New high-yield cardiac concepts chosen from the usmle-knowledge-graph
   board-priority disease list (ACS spectrum, the anginas, pericardial
   disease, the channelopathies, the cardiomyopathies, endocarditis,
   valve disease, rheumatic fever). The graph supplied the disease list;
   every clinical fact is authored from PUBLIC sources. Each concept is
   drilled several ways with recognition, discrimination, and management.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (ACC/AHA/ESC
   guidelines, Duke criteria, Jones criteria, primary literature).
   Synthetic patients; enters review UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'acs-spectrum', name: 'Acute coronary syndrome spectrum', system: 'cardiovascular', topic: 'Ischemic heart disease',
    illnessScript: {
      epidemiology: 'Plaque rupture with thrombosis; the spectrum is defined by ECG and troponin.',
      timeCourse: 'Acute ischemic chest pain, often at rest.',
      keyFindings: ['Unstable angina: ischemic rest pain, troponin NEGATIVE', 'NSTEMI: troponin POSITIVE, no persistent ST elevation (ST depression/T inversion)', 'STEMI: ST-segment elevation / new LBBB'],
      classicDistractors: ['Stable angina (exertional, relieved by rest)', 'Pericarditis', 'Aortic dissection'],
    },
  },
  {
    conceptId: 'stable-angina', name: 'Stable angina', system: 'cardiovascular', topic: 'Ischemic heart disease',
    illnessScript: {
      epidemiology: 'Fixed coronary stenosis; classic cardiac risk factors.',
      timeCourse: 'Predictable exertional chest pressure, minutes long, relieved by rest.',
      keyFindings: ['Substernal pressure with exertion/emotion', 'Relieved by rest or nitroglycerin within minutes', 'Reproducible threshold'],
      classicDistractors: ['Unstable angina (rest/crescendo)', 'GERD', 'Musculoskeletal pain'],
    },
  },
  {
    conceptId: 'prinzmetal-angina', name: 'Prinzmetal (vasospastic) angina', system: 'cardiovascular', topic: 'Ischemic heart disease',
    illnessScript: {
      epidemiology: 'Coronary vasospasm; younger patients, smokers; can be triggered.',
      timeCourse: 'Recurrent REST chest pain, often at night/early morning.',
      keyFindings: ['Rest angina with TRANSIENT ST elevation that resolves', 'Normal or near-normal coronaries', 'Provoked by hyperventilation/ergonovine'],
      classicDistractors: ['STEMI (persistent ST elevation, positive troponin)', 'Stable angina'],
    },
  },
  {
    conceptId: 'dressler', name: 'Dressler syndrome', system: 'cardiovascular', topic: 'Pericardial disease',
    illnessScript: {
      epidemiology: 'Immune-mediated pericarditis weeks after a myocardial infarction (or cardiac surgery).',
      timeCourse: 'Days to weeks post-MI.',
      keyFindings: ['Pleuritic chest pain relieved by sitting forward', 'Fever, friction rub, ± pericardial effusion', 'Diffuse ST elevation / PR depression'],
      classicDistractors: ['Re-infarction/recurrent ischemia', 'Post-MI free-wall rupture'],
    },
  },
  {
    conceptId: 'pericardial-effusion', name: 'Pericardial effusion', system: 'cardiovascular', topic: 'Pericardial disease',
    illnessScript: {
      epidemiology: 'Pericarditis, malignancy, uremia, hypothyroidism, trauma.',
      timeCourse: 'Slow effusions can be large before symptoms; rapid ones tamponade early.',
      keyFindings: ['Muffled heart sounds, dyspnea', 'Low-voltage QRS ± electrical alternans', '"Water-bottle" cardiac silhouette; echo confirms'],
      classicDistractors: ['Cardiac tamponade (hemodynamic compromise)', 'Heart failure'],
    },
  },
  {
    conceptId: 'long-qt', name: 'Long QT syndrome', system: 'cardiovascular', topic: 'Channelopathy',
    illnessScript: {
      epidemiology: 'Congenital (ion-channel mutations) or acquired (drugs, hypokalemia, hypomagnesemia).',
      timeCourse: 'Syncope or sudden death from torsades de pointes.',
      keyFindings: ['Prolonged QTc', 'Torsades de pointes risk', 'Triggers: QT-prolonging drugs, electrolyte derangements'],
      classicDistractors: ['Brugada syndrome', 'Vasovagal syncope'],
    },
  },
  {
    conceptId: 'brugada', name: 'Brugada syndrome', system: 'cardiovascular', topic: 'Channelopathy',
    illnessScript: {
      epidemiology: 'SCN5A sodium-channel disease; more common in men of Southeast Asian descent.',
      timeCourse: 'Syncope or sudden cardiac death, classically at rest/sleep or with fever.',
      keyFindings: ['Coved ("type 1") ST elevation in V1–V2 with a RBBB-like pattern', 'Ventricular fibrillation risk', 'Unmasked by fever and sodium-channel blockers'],
      classicDistractors: ['Long QT syndrome', 'STEMI'],
    },
  },
  {
    conceptId: 'hcm', name: 'Hypertrophic cardiomyopathy', system: 'cardiovascular', topic: 'Cardiomyopathy',
    illnessScript: {
      epidemiology: 'Autosomal dominant sarcomere mutations; a leading cause of sudden death in young athletes.',
      timeCourse: 'Exertional syncope, dyspnea, or sudden death.',
      keyFindings: ['Systolic murmur that INCREASES with reduced preload (Valsalva, standing)', 'Asymmetric septal hypertrophy with dynamic LVOT obstruction', 'Family history of sudden death'],
      classicDistractors: ['Aortic stenosis (murmur softens with reduced preload)', 'Athlete’s heart'],
    },
  },
  {
    conceptId: 'infective-endocarditis', name: 'Infective endocarditis', system: 'cardiovascular', topic: 'Valvular disease & endocarditis',
    illnessScript: {
      epidemiology: 'Viridans strep (subacute, native valve), S. aureus (acute, IV drug use → tricuspid), enterococci.',
      timeCourse: 'Fever with a new regurgitant murmur.',
      keyFindings: ['Fever + new murmur', 'Osler nodes, Janeway lesions, Roth spots, splinter hemorrhages', 'Duke criteria: blood cultures + echo vegetation'],
      classicDistractors: ['Rheumatic fever', 'Marantic (nonbacterial thrombotic) endocarditis'],
    },
  },
  {
    conceptId: 'mitral-regurgitation', name: 'Mitral regurgitation', system: 'cardiovascular', topic: 'Valvular disease & endocarditis',
    illnessScript: {
      epidemiology: 'Mitral valve prolapse, ischemic papillary dysfunction, endocarditis, rheumatic disease.',
      timeCourse: 'Chronic (compensated) or acute (papillary rupture — flash pulmonary edema).',
      keyFindings: ['Holosystolic murmur at the apex radiating to the axilla', 'Louder with handgrip (increased afterload)', 'Acute severe MR → pulmonary edema'],
      classicDistractors: ['Aortic stenosis', 'Tricuspid regurgitation (louder with inspiration)'],
    },
  },
  {
    conceptId: 'dilated-cardiomyopathy', name: 'Dilated cardiomyopathy', system: 'cardiovascular', topic: 'Cardiomyopathy',
    illnessScript: {
      epidemiology: 'Idiopathic/genetic, viral myocarditis, alcohol, peripartum, doxorubicin, Chagas.',
      timeCourse: 'Progressive systolic heart failure.',
      keyFindings: ['Dilated, poorly contracting ventricles (low EF)', 'S3 gallop, displaced apex', 'Eccentric remodeling'],
      classicDistractors: ['Restrictive cardiomyopathy (small ventricles, diastolic failure)', 'Hypertrophic cardiomyopathy'],
    },
  },
  {
    conceptId: 'rheumatic-fever', name: 'Acute rheumatic fever', system: 'cardiovascular', topic: 'Valvular disease & endocarditis',
    illnessScript: {
      epidemiology: 'Immune sequela 2–4 weeks after group A streptococcal pharyngitis; children.',
      timeCourse: 'Acute febrile illness; mitral stenosis is the late sequela.',
      keyFindings: ['Jones: migratory polyarthritis, carditis, Sydenham chorea, erythema marginatum, subcutaneous nodules', 'Evidence of preceding strep (ASO)', 'Long-term valve damage (mitral stenosis)'],
      classicDistractors: ['Septic arthritis', 'Infective endocarditis'],
    },
  },
];

const subtopics: Record<string, string> = {
  'acs-spectrum': 'cv.ischemia',
  'stable-angina': 'cv.ischemia',
  'prinzmetal-angina': 'cv.ischemia',
  'dressler': 'cv.pericardial',
  'pericardial-effusion': 'cv.pericardial',
  'long-qt': 'cv.arrhythmia',
  'brugada': 'cv.arrhythmia',
  'hcm': 'cv.heart-failure',
  'infective-endocarditis': 'cv.valvular',
  'mitral-regurgitation': 'cv.valvular',
  'dilated-cardiomyopathy': 'cv.heart-failure',
  'rheumatic-fever': 'cv.valvular',
};

const alsoSystems: Record<string, System[]> = {
  'infective-endocarditis': ['infectious'],
  'rheumatic-fever': ['pediatrics', 'infectious'],
};

const items: RawItem[] = [
  /* ── ACS spectrum ─────────────────────────────────────────────── */
  {
    itemId: 'acs-ddx', version: 1, type: 'discriminator', conceptId: 'acs-spectrum', presentation: 'classic',
    stem: 'A patient has ischemic chest pain at rest. Which pair of results distinguishes unstable angina, NSTEMI, and STEMI?',
    vitals: [],
    findings: ['The chest pain is ischemic; the classification hinges on ECG and troponin.'],
    options: [
      { id: 'a', text: 'The ECG (ST elevation or not) and the troponin (positive or not)', correct: true },
      { id: 'b', text: 'The severity of pain alone', whyNot: 'Pain severity does not separate the three; the ECG and troponin do.' },
      { id: 'c', text: 'The response to nitroglycerin', whyNot: 'Nitroglycerin response is nonspecific (it also relieves esophageal spasm) and does not classify ACS.' },
      { id: 'd', text: 'The presence of any chest pain', whyNot: 'Chest pain is common to all three and to many mimics; objective ECG/troponin data classify ACS.' },
    ],
    discriminator: 'ACS is classified by ECG and troponin: unstable angina has a negative troponin, NSTEMI a positive troponin without ST elevation, and STEMI shows ST-segment elevation (or new LBBB).',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['stemi-recognition', 'stable-angina'],
    source: [{ ref: 'Amsterdam et al., ACC/AHA Guideline for the Management of Patients With Non-ST-Elevation Acute Coronary Syndromes', year: 2014 }],
  },
  {
    itemId: 'acs-tx', version: 1, type: 'tx_next_step', conceptId: 'acs-spectrum', presentation: 'severe',
    stem: 'A patient with rest chest pain has ST depression and a positive troponin (NSTEMI) but is hemodynamically stable. What is the management approach?',
    vitals: [v('BP', '138/84', false)],
    findings: ['NSTEMI without hemodynamic instability or ongoing refractory ischemia.'],
    options: [
      { id: 'a', text: 'Dual antiplatelet therapy, anticoagulation, anti-ischemics, and risk-stratified early invasive angiography', correct: true },
      { id: 'b', text: 'Immediate fibrinolysis', whyNot: 'Fibrinolysis is for STEMI; it is not indicated (and can harm) in NSTE-ACS.' },
      { id: 'c', text: 'Discharge with outpatient stress testing', whyNot: 'A positive-troponin NSTEMI requires admission, antithrombotic therapy, and angiography, not outpatient workup.' },
      { id: 'd', text: 'Aspirin alone', whyNot: 'NSTE-ACS needs dual antiplatelet therapy plus anticoagulation and anti-ischemics, not aspirin monotherapy.' },
    ],
    discriminator: 'NSTE-ACS is treated with dual antiplatelet therapy, anticoagulation, and anti-ischemics, then angiography timed by risk — fibrinolysis is reserved for STEMI and is not used here.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    distractorConceptIds: ['stemi-reperfusion'],
    source: [{ ref: 'Amsterdam et al., ACC/AHA Guideline for NSTE-ACS', year: 2014 }],
  },

  /* ── Stable angina ────────────────────────────────────────────── */
  {
    itemId: 'stable-ang-ddx', version: 1, type: 'discriminator', conceptId: 'stable-angina', presentation: 'classic',
    stem: 'A patient has substernal chest pressure. What feature marks it as STABLE angina rather than unstable?',
    vitals: [],
    findings: ['Exertional chest pressure that has been unchanged for months.'],
    options: [
      { id: 'a', text: 'A predictable exertional threshold, relieved by rest or nitroglycerin within minutes', correct: true },
      { id: 'b', text: 'Pain at rest or a crescendo pattern', whyNot: 'Rest pain or a crescendo (worsening) pattern defines UNSTABLE angina, not stable.' },
      { id: 'c', text: 'Pain lasting many hours with diaphoresis', whyNot: 'Prolonged pain with autonomic features suggests infarction, not stable angina.' },
      { id: 'd', text: 'A positive troponin', whyNot: 'A positive troponin indicates infarction; stable angina has no biomarker rise.' },
    ],
    discriminator: 'Stable angina is exertional, reproducible at a predictable threshold, and relieved by rest or nitroglycerin within minutes — a shift to rest or crescendo pain signals unstable angina.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    distractorConceptIds: ['acs-spectrum'],
    source: [{ ref: 'Fihn et al., ACC/AHA Guideline for the Diagnosis and Management of Patients With Stable Ischemic Heart Disease', year: 2012 }],
  },
  {
    itemId: 'stable-ang-tx', version: 1, type: 'tx_next_step', conceptId: 'stable-angina', presentation: 'atypical',
    stem: 'A patient with confirmed stable angina needs medical therapy. Which combination addresses both symptoms and prognosis?',
    vitals: [],
    findings: ['Stable ischemic heart disease, well-compensated.'],
    options: [
      { id: 'a', text: 'Aspirin and a statin (prognostic) plus a beta-blocker and short-acting nitrate (antianginal), with risk-factor control', correct: true },
      { id: 'b', text: 'Long-term antibiotics', whyNot: 'Angina is ischemic, not infectious; antibiotics have no role.' },
      { id: 'c', text: 'Anticoagulation with warfarin as first-line', whyNot: 'Chronic anticoagulation is not standard for stable angina; antiplatelet therapy plus antianginals and statins are.' },
      { id: 'd', text: 'Nitrates alone', whyNot: 'Nitrates relieve symptoms but omit the prognostic aspirin/statin and anti-ischemic beta-blocker.' },
    ],
    discriminator: 'Stable angina is managed with prognostic therapy (aspirin, statin, risk-factor control) plus antianginal drugs (beta-blocker, nitrates) — not anticoagulation or antibiotics.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'fm'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Fihn et al., ACC/AHA Stable Ischemic Heart Disease Guideline', year: 2012 }],
  },

  /* ── Prinzmetal ───────────────────────────────────────────────── */
  {
    itemId: 'prinz-tx', version: 1, type: 'tx_next_step', conceptId: 'prinzmetal-angina', presentation: 'atypical',
    stem: 'A young smoker has recurrent nocturnal chest pain with transient ST elevation that resolves, and normal coronaries on angiography. What is the treatment — and what should be avoided?',
    vitals: [],
    findings: ['Vasospastic angina with transient ST elevation and clean coronaries.'],
    options: [
      { id: 'a', text: 'Calcium-channel blockers (and nitrates); avoid nonselective beta-blockers', correct: true },
      { id: 'b', text: 'A nonselective beta-blocker as first-line', whyNot: 'Nonselective beta-blockade can leave unopposed alpha vasoconstriction and worsen coronary spasm.' },
      { id: 'c', text: 'Emergent fibrinolysis', whyNot: 'The ST elevation is transient from spasm with normal coronaries; there is no thrombotic occlusion to lyse.' },
      { id: 'd', text: 'No treatment and reassurance', whyNot: 'Vasospasm can cause arrhythmia and infarction; calcium-channel blockers and smoking cessation are indicated.' },
    ],
    discriminator: 'Vasospastic (Prinzmetal) angina is treated with calcium-channel blockers and nitrates and by stopping smoking — nonselective beta-blockers are avoided because unopposed alpha tone worsens spasm.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'JCS Guidelines for Diagnosis and Treatment of Patients With Vasospastic Angina (Coronary Spastic Angina)', year: 2013 }],
  },
  {
    itemId: 'prinz-ol', version: 1, type: 'one_liner', conceptId: 'prinzmetal-angina', presentation: 'classic',
    stem: 'A 40-year-old smoker has recurrent episodes of chest pain at rest, typically early morning, each with transient ST elevation on the monitor that resolves as the pain passes. Troponin is negative and coronaries are normal. What is the diagnosis?',
    vitals: [],
    findings: ['Rest angina with reversible ST elevation and normal coronaries.'],
    options: [
      { id: 'a', text: 'Prinzmetal (vasospastic) angina', correct: true },
      { id: 'b', text: 'STEMI', whyNot: 'STEMI has PERSISTENT ST elevation with a positive troponin and an occluded artery, not transient reversible changes with clean coronaries.' },
      { id: 'c', text: 'Stable angina', whyNot: 'Stable angina is exertional, not rest pain with transient ST elevation.' },
      { id: 'd', text: 'Pericarditis', whyNot: 'Pericarditis gives diffuse ST elevation with PR depression and pleuritic pain, not transient spasm-related elevation.' },
    ],
    discriminator: 'Recurrent rest angina with TRANSIENT ST elevation that resolves and normal coronaries is vasospastic (Prinzmetal) angina — unlike the persistent ST elevation and occlusion of STEMI.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['stemi-recognition', 'stable-angina'],
    source: [{ ref: 'JCS Guidelines for Vasospastic Angina', year: 2013 }],
  },

  /* ── Dressler ─────────────────────────────────────────────────── */
  {
    itemId: 'dressler-ol', version: 1, type: 'discriminator', conceptId: 'dressler', presentation: 'atypical',
    stem: 'Three weeks after a myocardial infarction, a patient has fever with pleuritic chest pain relieved by leaning forward and a friction rub. How does this differ from recurrent ischemia?',
    vitals: [v('Temp', '38.2', false)],
    findings: ['Positional pleuritic pain with a rub, weeks after MI.'],
    options: [
      { id: 'a', text: 'It is Dressler (post-MI) pericarditis — pleuritic, positional, with a rub and fever', correct: true },
      { id: 'b', text: 'It is recurrent myocardial ischemia', whyNot: 'Ischemic pain is pressure-like, exertional, and not relieved by leaning forward; a friction rub and pleuritic positional pain indicate pericarditis.' },
      { id: 'c', text: 'It is pulmonary embolism', whyNot: 'PE is pleuritic but lacks a pericardial friction rub and the weeks-post-MI autoimmune context.' },
      { id: 'd', text: 'It is aortic dissection', whyNot: 'Dissection is sudden tearing pain radiating to the back, not a positional pleuritic rub with fever.' },
    ],
    discriminator: 'Dressler syndrome is immune-mediated pericarditis weeks after MI — pleuritic, positional pain with a friction rub and fever — distinct from the exertional pressure of recurrent ischemia.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['stemi-vs-pericarditis'],
    source: [{ ref: 'Adler et al., ESC Guidelines for the Diagnosis and Management of Pericardial Diseases', year: 2015 }],
  },

  /* ── Pericardial effusion ─────────────────────────────────────── */
  {
    itemId: 'peff-nx', version: 1, type: 'next_step', conceptId: 'pericardial-effusion', presentation: 'classic',
    stem: 'A patient has dyspnea with muffled heart sounds; the ECG shows low-voltage QRS with beat-to-beat variation in QRS amplitude (electrical alternans). What is the best next test?',
    vitals: [],
    findings: ['Low-voltage QRS and electrical alternans suggesting a sizeable effusion.'],
    options: [
      { id: 'a', text: 'Transthoracic echocardiography', correct: true },
      { id: 'b', text: 'Immediate pericardiocentesis regardless of hemodynamics', whyNot: 'Drainage is for tamponade or diagnostic need; echo first defines the effusion size and tamponade physiology.' },
      { id: 'c', text: 'Exercise stress test', whyNot: 'A stress test is inappropriate and unsafe when a pericardial effusion is suspected.' },
      { id: 'd', text: 'D-dimer', whyNot: 'D-dimer evaluates thromboembolism, not a pericardial effusion.' },
    ],
    discriminator: 'Low-voltage QRS with electrical alternans suggests a large pericardial effusion, and echocardiography is the test that confirms it and assesses for tamponade physiology.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['tamponade'],
    source: [{ ref: 'Adler et al., ESC Guidelines for the Diagnosis and Management of Pericardial Diseases', year: 2015 }],
  },

  /* ── Long QT ──────────────────────────────────────────────────── */
  {
    itemId: 'lqt-ci', version: 1, type: 'tx_contraindication', conceptId: 'long-qt', presentation: 'severe',
    stem: 'A patient with a prolonged QTc had a syncopal episode. Which action is most dangerous and must be avoided?',
    vitals: [v('QTc', '520 ms', true)],
    findings: ['Prolonged QT with syncope (torsades risk).'],
    options: [
      { id: 'a', text: 'Adding a QT-prolonging drug (and leaving hypokalemia/hypomagnesemia uncorrected)', correct: true },
      { id: 'b', text: 'Correcting potassium and magnesium', whyNot: 'Repleting K and Mg SHORTENS the QT and reduces torsades risk — it is beneficial, not harmful.' },
      { id: 'c', text: 'Stopping an offending QT-prolonging medication', whyNot: 'Removing the culprit drug is exactly the right move.' },
      { id: 'd', text: 'Beta-blocker for congenital long QT', whyNot: 'Beta-blockers are protective in congenital long QT syndrome, not contraindicated.' },
    ],
    discriminator: 'In long QT syndrome the priority is to remove QT-prolonging drugs and correct potassium/magnesium; adding another QT-prolonging agent (or ignoring low electrolytes) risks torsades de pointes.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['ecg-torsades'],
    source: [{ ref: 'Priori et al., ESC Guidelines for the Management of Patients With Ventricular Arrhythmias and the Prevention of Sudden Cardiac Death', year: 2015 }],
  },

  /* ── Brugada ──────────────────────────────────────────────────── */
  {
    itemId: 'brugada-assoc', version: 1, type: 'association', conceptId: 'brugada', presentation: 'atypical',
    stem: 'A previously healthy man has an episode of syncope; his ECG shows coved ST-segment elevation in V1–V2 with a right-bundle-branch-like pattern, and a relative died suddenly in sleep. What is the diagnosis?',
    vitals: [],
    findings: ['Type 1 coved ST elevation in the right precordial leads.'],
    options: [
      { id: 'a', text: 'Brugada syndrome', correct: true },
      { id: 'b', text: 'STEMI', whyNot: 'The coved pattern is confined to V1–V2 without a clinical infarct or troponin rise; it is a channelopathy, not acute occlusion.' },
      { id: 'c', text: 'Early repolarization (benign)', whyNot: 'Benign early repolarization does not carry the coved type-1 morphology, family sudden-death history, or arrhythmic risk of Brugada.' },
      { id: 'd', text: 'Long QT syndrome', whyNot: 'Long QT prolongs the QT interval and causes torsades; Brugada shows coved right-precordial ST elevation.' },
    ],
    discriminator: 'Coved (type 1) ST elevation in V1–V2 with a RBBB-like pattern and a family history of sudden death is Brugada syndrome — a sodium-channelopathy unmasked by fever and sodium-channel blockers.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.6,
    source: [{ ref: 'Priori et al., ESC Guidelines for Ventricular Arrhythmias and Prevention of Sudden Cardiac Death', year: 2015 }],
  },

  /* ── HCM ──────────────────────────────────────────────────────── */
  {
    itemId: 'hcm-ol', version: 1, type: 'one_liner', conceptId: 'hcm', presentation: 'classic',
    stem: 'A 17-year-old collapses during a sprint. Exam reveals a systolic murmur that gets LOUDER with Valsalva and on standing; echo shows asymmetric septal hypertrophy. What is the diagnosis?',
    vitals: [],
    findings: ['Exertional syncope with a dynamic outflow murmur and septal hypertrophy.'],
    options: [
      { id: 'a', text: 'Hypertrophic cardiomyopathy', correct: true },
      { id: 'b', text: 'Aortic stenosis', whyNot: 'The aortic stenosis murmur SOFTENS with reduced preload (Valsalva/standing); HCM’s dynamic obstruction murmur gets louder.' },
      { id: 'c', text: 'Mitral regurgitation', whyNot: 'MR is holosystolic radiating to the axilla and softens with reduced preload, not the dynamic outflow murmur of HCM.' },
      { id: 'd', text: 'Athlete’s heart (physiologic)', whyNot: 'Physiologic remodeling does not cause asymmetric septal hypertrophy with a dynamic obstructive murmur and exertional syncope.' },
    ],
    discriminator: 'Exertional syncope in a young person with a systolic murmur that INCREASES with reduced preload (Valsalva, standing) and asymmetric septal hypertrophy is hypertrophic cardiomyopathy.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['as-syncope'],
    source: [{ ref: 'Ommen et al., ACC/AHA Guideline for the Diagnosis and Treatment of Patients With Hypertrophic Cardiomyopathy', year: 2020 }],
  },
  {
    itemId: 'hcm-ci', version: 1, type: 'tx_contraindication', conceptId: 'hcm', presentation: 'severe',
    stem: 'A patient with obstructive hypertrophic cardiomyopathy is symptomatic. Which intervention is most likely to worsen the outflow obstruction and should be avoided?',
    vitals: [],
    findings: ['Dynamic LVOT obstruction that worsens when preload/afterload fall.'],
    options: [
      { id: 'a', text: 'Aggressive diuresis or a vasodilator (they reduce preload/afterload)', correct: true },
      { id: 'b', text: 'A beta-blocker', whyNot: 'Beta-blockers slow the heart and improve filling, reducing dynamic obstruction — they are first-line, not harmful.' },
      { id: 'c', text: 'Avoiding dehydration', whyNot: 'Maintaining volume is beneficial; it keeps preload up and lessens obstruction.' },
      { id: 'd', text: 'Considering an ICD in high-risk patients', whyNot: 'An ICD is appropriate for sudden-death risk, not a contraindication.' },
    ],
    discriminator: 'In obstructive HCM, anything that lowers preload or afterload — aggressive diuresis, vasodilators, dehydration — worsens the dynamic obstruction; beta-blockers and maintaining volume are the correct approach.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Ommen et al., ACC/AHA Hypertrophic Cardiomyopathy Guideline', year: 2020 }],
  },

  /* ── Infective endocarditis ───────────────────────────────────── */
  {
    itemId: 'ie-nx', version: 1, type: 'next_step', conceptId: 'infective-endocarditis', presentation: 'classic',
    stem: 'A patient has fever, a new regurgitant murmur, and splinter hemorrhages. Suspecting infective endocarditis, what is the essential diagnostic workup?',
    vitals: [v('Temp', '38.7', true)],
    findings: ['Fever with a new murmur and peripheral embolic stigmata.'],
    options: [
      { id: 'a', text: 'Three sets of blood cultures plus echocardiography (Duke criteria)', correct: true },
      { id: 'b', text: 'A single blood culture and empiric discharge', whyNot: 'Multiple blood-culture sets and echocardiography are required to satisfy the Duke criteria and guide prolonged therapy.' },
      { id: 'c', text: 'Immediate valve surgery before any diagnostics', whyNot: 'Surgery is for specific indications (heart failure, abscess, large vegetations/emboli) after diagnosis, not before a workup.' },
      { id: 'd', text: 'CT coronary angiography', whyNot: 'Coronary CT does not diagnose endocarditis; cultures and echo do.' },
    ],
    discriminator: 'Suspected infective endocarditis is worked up with several sets of blood cultures and echocardiography, the pillars of the Duke criteria that establish the diagnosis and direct prolonged antibiotics.',
    tags: { system: 'cardiovascular', complaint: 'fever', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Baddour et al., AHA Scientific Statement: Infective Endocarditis in Adults — Diagnosis, Antimicrobial Therapy, and Management', year: 2015 }],
  },
  {
    itemId: 'ie-assoc', version: 1, type: 'association', conceptId: 'infective-endocarditis', presentation: 'atypical',
    stem: 'A person who injects drugs has fever, septic pulmonary emboli, and a new murmur. Which valve and organism are most likely?',
    vitals: [v('Temp', '39.1', true)],
    findings: ['Right-sided endocarditis with septic pulmonary emboli.'],
    options: [
      { id: 'a', text: 'Tricuspid valve, Staphylococcus aureus', correct: true },
      { id: 'b', text: 'Mitral valve, viridans streptococci', whyNot: 'Viridans strep causes subacute LEFT-sided native-valve disease after dental procedures, not IV-drug-use tricuspid disease with septic pulmonary emboli.' },
      { id: 'c', text: 'Aortic valve, Enterococcus', whyNot: 'Enterococci follow GU/GI procedures on left-sided valves, not the tricuspid IV-drug-use pattern.' },
      { id: 'd', text: 'Prosthetic valve, coagulase-negative staphylococci', whyNot: 'Coagulase-negative staph favors early prosthetic-valve infection, not native tricuspid disease in injection drug use.' },
    ],
    discriminator: 'Injection drug use classically causes right-sided (tricuspid) endocarditis with Staphylococcus aureus and septic pulmonary emboli, unlike the left-sided viridans-strep disease after dental work.',
    tags: { system: 'cardiovascular', complaint: 'fever', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Baddour et al., AHA Scientific Statement: Infective Endocarditis in Adults', year: 2015 }],
  },

  /* ── Mitral regurgitation ─────────────────────────────────────── */
  {
    itemId: 'mr-ddx', version: 1, type: 'discriminator', conceptId: 'mitral-regurgitation', presentation: 'classic',
    stem: 'A patient has a systolic murmur. Which features identify it as mitral regurgitation rather than aortic stenosis?',
    vitals: [],
    findings: ['A systolic murmur; the task is to localize the valve lesion.'],
    options: [
      { id: 'a', text: 'Holosystolic murmur at the apex radiating to the axilla, LOUDER with handgrip', correct: true },
      { id: 'b', text: 'Crescendo-decrescendo murmur at the base radiating to the carotids', whyNot: 'That describes aortic stenosis, not mitral regurgitation.' },
      { id: 'c', text: 'A murmur that increases with Valsalva', whyNot: 'Increasing with Valsalva suggests HCM (reduced preload); MR softens with reduced preload and increases with handgrip.' },
      { id: 'd', text: 'A mid-diastolic rumble', whyNot: 'A diastolic rumble is mitral stenosis, not the holosystolic murmur of regurgitation.' },
    ],
    discriminator: 'Mitral regurgitation is a holosystolic apical murmur radiating to the axilla that gets louder with handgrip (increased afterload), whereas aortic stenosis radiates to the carotids and softens with reduced preload.',
    tags: { system: 'cardiovascular', complaint: 'murmur', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['as-syncope', 'hcm'],
    source: [{ ref: 'Otto et al., ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease', year: 2020 }],
  },

  /* ── Dilated cardiomyopathy ───────────────────────────────────── */
  {
    itemId: 'dcm-ol', version: 1, type: 'one_liner', conceptId: 'dilated-cardiomyopathy', presentation: 'classic',
    stem: 'A heavy drinker has progressive dyspnea and edema; echo shows a dilated left ventricle with an ejection fraction of 25% and an S3 gallop. What is the diagnosis?',
    vitals: [],
    findings: ['Dilated, poorly contracting ventricle with systolic heart failure.'],
    options: [
      { id: 'a', text: 'Dilated cardiomyopathy', correct: true },
      { id: 'b', text: 'Hypertrophic cardiomyopathy', whyNot: 'HCM shows a thickened, hypercontractile ventricle with dynamic obstruction, not a dilated low-EF ventricle.' },
      { id: 'c', text: 'Restrictive cardiomyopathy', whyNot: 'Restrictive disease has normal-sized ventricles with diastolic failure and preserved EF, not a dilated low-EF chamber.' },
      { id: 'd', text: 'Constrictive pericarditis', whyNot: 'Constriction shows a thickened/calcified pericardium with preserved systolic function, not a dilated low-EF ventricle.' },
    ],
    discriminator: 'A dilated, poorly contracting ventricle with a low ejection fraction and S3 is dilated cardiomyopathy (alcohol, viral, peripartum, doxorubicin, Chagas) — distinct from the thick hypercontractile HCM and small-chamber restrictive disease.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['hcm', 'adhf-recognition'],
    source: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Guideline for the Management of Heart Failure', year: 2022 }],
  },

  /* ── Rheumatic fever ──────────────────────────────────────────── */
  {
    itemId: 'arf-assoc', version: 1, type: 'association', conceptId: 'rheumatic-fever', presentation: 'classic',
    stem: 'Three weeks after a sore throat, a child has migratory polyarthritis, a new murmur, and involuntary dance-like movements, with a raised anti-streptolysin O titer. What is the diagnosis?',
    vitals: [v('Temp', '38.4', false)],
    findings: ['Post-streptococcal illness meeting Jones criteria.'],
    options: [
      { id: 'a', text: 'Acute rheumatic fever', correct: true },
      { id: 'b', text: 'Septic arthritis', whyNot: 'Septic arthritis is a single hot joint with purulent fluid, not migratory polyarthritis with carditis and chorea after strep.' },
      { id: 'c', text: 'Juvenile idiopathic arthritis', whyNot: 'JIA is chronic without the post-strep chorea, carditis, and erythema marginatum of rheumatic fever.' },
      { id: 'd', text: 'Infective endocarditis', whyNot: 'Endocarditis is an active valvular infection with positive blood cultures, not the immune post-strep Jones-criteria syndrome.' },
    ],
    discriminator: 'Migratory polyarthritis, carditis, and Sydenham chorea 2–4 weeks after strep pharyngitis with elevated ASO is acute rheumatic fever (Jones criteria); mitral stenosis is the classic late sequela.',
    tags: { system: 'cardiovascular', complaint: 'buzzword', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Gewitz et al., AHA Scientific Statement: Revision of the Jones Criteria for the Diagnosis of Acute Rheumatic Fever', year: 2015 }],
  },
  {
    itemId: 'arf-tx', version: 1, type: 'tx_next_step', conceptId: 'rheumatic-fever', presentation: 'atypical',
    stem: 'A child diagnosed with acute rheumatic fever needs treatment. What does management include?',
    vitals: [],
    findings: ['Confirmed acute rheumatic fever.'],
    options: [
      { id: 'a', text: 'Penicillin to eradicate strep, anti-inflammatory therapy, and long-term secondary prophylaxis', correct: true },
      { id: 'b', text: 'A single course of antibiotics with no follow-up prophylaxis', whyNot: 'Recurrences worsen valve damage, so long-term secondary antibiotic prophylaxis is essential.' },
      { id: 'c', text: 'Immediate valve replacement in all patients', whyNot: 'Surgery is for established severe valve disease, not routine acute management.' },
      { id: 'd', text: 'No antibiotics since it is post-infectious', whyNot: 'Penicillin is still given to eradicate any residual strep, plus prophylaxis to prevent recurrence.' },
    ],
    discriminator: 'Acute rheumatic fever is treated with penicillin, anti-inflammatory therapy for the acute attack, and — crucially — long-term secondary prophylaxis to prevent recurrent carditis and progressive mitral stenosis.',
    tags: { system: 'cardiovascular', complaint: 'buzzword', rotation: ['peds', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Gewitz et al., AHA Revision of the Jones Criteria for Acute Rheumatic Fever', year: 2015 }],
  },
];

export const CARDIO_DEPTH2: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
