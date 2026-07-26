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

import type { BoardLevel, Concept, Item, PresentationType, System, Vital } from '../types';
import { UNREVIEWED } from '../types';
import { subtopicById } from './taxonomy';

const v = (label: string, value: string, hot = false): Vital => ({ label, value, hot });

/**
 * Authoring shape for a vignette: board tags and the enrichment
 * fields are optional. `normalizeItem` fills them so the exported
 * bank always satisfies the full Item contract.
 */
type RawItem = Omit<Item, 'tags' | 'presentation' | 'exposures' | 'pCorrect'> & {
  tags: Omit<Item['tags'], 'boards'> & { boards?: BoardLevel[] };
  presentation?: PresentationType;
  exposures?: number;
  pCorrect?: number | null;
};

/** Authoring shape for a concept: enrichment fields filled at export. */
type RawConcept = Pick<Concept, 'conceptId' | 'name' | 'system' | 'topic'> &
  Partial<Pick<Concept, 'alsoTaggedSystems' | 'illnessScript' | 'reviewedBy' | 'reviewedOn'>>;

function deriveBoards(raw: RawItem): BoardLevel[] {
  if (raw.tags.boards) return raw.tags.boards;
  switch (raw.type) {
    case 'association':
      return ['step1', 'step2'];
    case 'ecg':
      return ['step2', 'step3'];
    case 'management':
      return ['step2', 'step3'];
    default:
      // reasoning items keyed off the clinical level tag
      if (raw.tags.level === 'preclinical') return ['step1', 'step2'];
      if (raw.tags.level === 'clerkship') return ['step2', 'step3'];
      return ['step1', 'step2', 'step3'];
  }
}

function normalizeItem(raw: RawItem): Item {
  return {
    ...raw,
    tags: { ...raw.tags, boards: deriveBoards(raw) },
    presentation: raw.presentation ?? 'classic',
    exposures: raw.exposures ?? 0,
    pCorrect: raw.pCorrect ?? null,
    legacyItemId: raw.legacyItemId ?? raw.itemId,
  };
}

/**
 * Every existing concept's home in the taxonomy. Subtopic IDs are
 * validated against taxonomy.ts at build time; a concept missing
 * from this map, or pointing at a subtopic in a different system,
 * fails the content-integrity suite.
 */
const CONCEPT_SUBTOPIC: Record<string, string> = {
  'pe-recognition': 'pulm.vte',
  'pe-workup': 'pulm.vte',
  'tension-ptx': 'pulm.pleura',
  'spont-ptx': 'pulm.pleura',
  'silent-chest': 'pulm.airways',
  'copd-vs-hf': 'pulm.airways',
  'cap-recognition': 'pulm.infection',
  'stemi-recognition': 'cv.ischemia',
  'stemi-vs-pericarditis': 'cv.ischemia',
  'dissection-first': 'cv.vascular',
  'tamponade': 'cv.pericardial',
  'vt-vs-svt': 'cv.arrhythmia',
  'adhf-recognition': 'cv.heart-failure',
  'adhf-precipitant': 'cv.heart-failure',
  'as-syncope': 'cv.valvular',
  'pleuritic-ddx': 'pulm.pleura',
  'prerenal-vs-atn': 'renal.aki',
  'hyperk-first': 'renal.electrolytes',
  'stemi-reperfusion': 'cv.ischemia',
  'adhf-firstline': 'cv.heart-failure',
  'anaphylaxis-firstline': 'multi.allergy-immuno',
  'afib-anticoag': 'cv.arrhythmia',
  'dka-firststep': 'endo.diabetes',
  'ecg-stemi': 'cv.ischemia',
  'ecg-vt': 'cv.arrhythmia',
  'ecg-afib': 'cv.arrhythmia',
  'ecg-flutter': 'cv.arrhythmia',
  'ecg-chb': 'cv.arrhythmia',
  'ecg-first-degree': 'cv.arrhythmia',
  'ecg-hyperk': 'renal.electrolytes',
  'ecg-wpw': 'cv.arrhythmia',
  'ecg-torsades': 'cv.arrhythmia',
  'ecg-vfib': 'cv.arrhythmia',
  'assoc-jak2': 'heme.myeloproliferative',
  'assoc-auer': 'heme.leukemia',
  'assoc-philadelphia': 'heme.leukemia',
  'assoc-smudge': 'heme.leukemia',
  'assoc-reed-sternberg': 'heme.lymphoma',
  'assoc-ttp': 'heme.micro',
  'assoc-anti-ccp': 'rheum.inflammatory-arthritis',
  'assoc-anti-dsdna': 'rheum.connective',
  'assoc-anti-histone': 'rheum.connective',
  'assoc-hla-b27': 'rheum.inflammatory-arthritis',
  'assoc-anti-gbm': 'renal.glomerular',
  'assoc-ama': 'gi.hepatic',
  'assoc-rib-notching': 'cv.congenital',
  'assoc-currant-jelly': 'id.respiratory-id',
  'assoc-nf1': 'neuro.neurocutaneous',
};

/** Concepts that legitimately span more than their primary system. */
const CONCEPT_ALSO_SYSTEMS: Record<string, System[]> = {
  'pe-recognition': ['cardiovascular'],
  'pe-workup': ['cardiovascular'],
  'pleuritic-ddx': ['cardiovascular'],
  'copd-vs-hf': ['cardiovascular'],
  'hyperk-first': ['cardiovascular'],
  'ecg-hyperk': ['cardiovascular'],
  'assoc-anti-gbm': ['pulmonary'],
  'assoc-currant-jelly': ['pulmonary'],
  'anaphylaxis-firstline': ['pulmonary', 'cardiovascular'],
};

const RAW_CONCEPTS: RawConcept[] = [
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

  /* ── treatment / management (Step 2–3) ─────────────────────── */
  { conceptId: 'stemi-reperfusion', name: 'STEMI reperfusion strategy', system: 'cardiovascular', topic: 'Acute coronary syndromes' },
  { conceptId: 'adhf-firstline', name: 'First-line for acute pulmonary edema', system: 'cardiovascular', topic: 'Heart failure' },
  { conceptId: 'anaphylaxis-firstline', name: 'First-line for anaphylaxis', system: 'multisystem', topic: 'Anaphylaxis & shock' },
  { conceptId: 'afib-anticoag', name: 'Anticoagulation threshold in AF', system: 'cardiovascular', topic: 'Tachyarrhythmias' },
  { conceptId: 'dka-firststep', name: 'First step in DKA', system: 'endocrine', topic: 'Diabetic emergencies' },

  /* ── ECG mini-game ─────────────────────────────────────────── */
  { conceptId: 'ecg-stemi', name: 'ECG: anterior STEMI', system: 'cardiovascular', topic: 'ECG — ischemia' },
  { conceptId: 'ecg-vt', name: 'ECG: ventricular tachycardia', system: 'cardiovascular', topic: 'ECG — wide-complex' },
  { conceptId: 'ecg-afib', name: 'ECG: atrial fibrillation', system: 'cardiovascular', topic: 'ECG — irregular rhythms' },
  { conceptId: 'ecg-flutter', name: 'ECG: atrial flutter', system: 'cardiovascular', topic: 'ECG — irregular rhythms' },
  { conceptId: 'ecg-chb', name: 'ECG: complete heart block', system: 'cardiovascular', topic: 'ECG — conduction block' },
  { conceptId: 'ecg-first-degree', name: 'ECG: first-degree AV block', system: 'cardiovascular', topic: 'ECG — conduction block' },
  { conceptId: 'ecg-hyperk', name: 'ECG: hyperkalemia', system: 'renal', topic: 'ECG — metabolic' },
  { conceptId: 'ecg-wpw', name: 'ECG: pre-excitation (WPW)', system: 'cardiovascular', topic: 'ECG — wide-complex' },
  { conceptId: 'ecg-torsades', name: 'ECG: torsades de pointes', system: 'cardiovascular', topic: 'ECG — arrest rhythms' },
  { conceptId: 'ecg-vfib', name: 'ECG: ventricular fibrillation', system: 'cardiovascular', topic: 'ECG — arrest rhythms' },

  /* ── Buzzword association mini-game (Step 1–2) ──────────────── */
  { conceptId: 'assoc-jak2', name: 'JAK2 → polycythemia vera', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-auer', name: 'Auer rods → AML', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-philadelphia', name: 'Philadelphia chromosome → CML', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-smudge', name: 'Smudge cells → CLL', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-reed-sternberg', name: 'Reed–Sternberg → Hodgkin', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-ttp', name: 'Schistocytes pentad → TTP', system: 'heme_onc', topic: 'Buzzwords — heme/onc' },
  { conceptId: 'assoc-anti-ccp', name: 'Anti-CCP → rheumatoid arthritis', system: 'msk_rheum', topic: 'Buzzwords — rheumatology' },
  { conceptId: 'assoc-anti-dsdna', name: 'Anti-dsDNA/Smith → SLE', system: 'msk_rheum', topic: 'Buzzwords — rheumatology' },
  { conceptId: 'assoc-anti-histone', name: 'Anti-histone → drug-induced lupus', system: 'msk_rheum', topic: 'Buzzwords — rheumatology' },
  { conceptId: 'assoc-hla-b27', name: 'HLA-B27 bamboo spine → AS', system: 'msk_rheum', topic: 'Buzzwords — rheumatology' },
  { conceptId: 'assoc-anti-gbm', name: 'Anti-GBM → Goodpasture', system: 'renal', topic: 'Buzzwords — renal' },
  { conceptId: 'assoc-ama', name: 'Anti-mitochondrial → PBC', system: 'gi', topic: 'Buzzwords — GI/liver' },
  { conceptId: 'assoc-rib-notching', name: 'Rib notching → coarctation', system: 'cardiovascular', topic: 'Buzzwords — cardiology' },
  { conceptId: 'assoc-currant-jelly', name: 'Currant-jelly sputum → Klebsiella', system: 'infectious', topic: 'Buzzwords — infectious disease' },
  { conceptId: 'assoc-nf1', name: 'Café-au-lait/Lisch → NF1', system: 'neuro', topic: 'Buzzwords — neurology' },
];

const RAW: RawItem[] = [
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

  /* ── single diagnoses, tested another way ─────────────────────
     STEMI already has a recognition one-liner and an ECG-reading
     item in the ECG game; here it is drilled as a can't-miss and as
     a management decision, so the same diagnosis is met from every
     angle across sessions. */
  {
    itemId: 'stemi-2', version: 1, type: 'cant_miss', conceptId: 'stemi-recognition', presentation: 'atypical',
    stem: '58 F, diabetic, with nausea, breathlessness and profound fatigue but no chest pain. Which diagnosis must you actively exclude before calling this a viral illness?',
    vitals: [v('HR', '58', true), v('BP', '104/70'), v('SpO₂', '95% RA')],
    findings: ['Diaphoretic and grey. ECG not yet done.'],
    options: [
      { id: 'a', text: 'Acute myocardial infarction', correct: true },
      { id: 'b', text: 'Gastroenteritis', whyNot: 'Gastroenteritis does not make a diabetic grey and diaphoretic with bradycardia — that is a heart, not a gut.' },
      { id: 'c', text: 'Influenza', whyNot: 'Flu is a reasonable afterthought, but you cannot afford to miss a painless infarct while treating it.' },
      { id: 'd', text: 'Anxiety', whyNot: 'Labelling diaphoresis and grey pallor as anxiety in a diabetic is how silent MIs are sent home.' },
    ],
    discriminator: 'Diabetics and women infarct without chest pain — nausea, dyspnea and diaphoresis are anginal equivalents, so the ECG comes before the diagnosis of a virus.',
    teachingPoint: 'Get the 12-lead: an anginal equivalent is an infarct until the tracing says otherwise.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA Chest Pain Guideline', year: 2021 }],
  },
  {
    itemId: 'stemi-reperfusion-1', version: 1, type: 'management', conceptId: 'stemi-reperfusion',
    stem: 'Confirmed anterior STEMI, symptom onset 90 minutes ago, at a hospital with a 24/7 cath lab. Door-to-balloon can be achieved in 55 minutes. What is the reperfusion strategy?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'Primary percutaneous coronary intervention', correct: true },
      { id: 'b', text: 'Fibrinolysis (tPA)', whyNot: 'Lytics are the fallback when PCI is more than 120 minutes away — with a cath lab on-site, PCI is faster and better.' },
      { id: 'c', text: 'Heparin and admit for observation', whyNot: 'A STEMI with an open cath lab is a plumbing emergency; observation forfeits salvageable myocardium.' },
      { id: 'd', text: 'CT coronary angiography first', whyNot: 'The diagnosis is already made on the ECG — imaging only delays reperfusion.' },
    ],
    discriminator: 'When PCI-capable, primary PCI beats lytics if door-to-balloon is under 90 minutes — the deciding number is time-to-reperfusion, not the drug.',
    teachingPoint: 'Give fibrinolytics only when PCI cannot be delivered within 120 minutes of first medical contact.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'clerkship', boards: ['step2', 'step3'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA/SCAI Coronary Revascularization Guideline', year: 2021 }],
  },
  {
    itemId: 'adhf-firstline-1', version: 1, type: 'management', conceptId: 'adhf-firstline',
    stem: 'Acute pulmonary edema: a patient sitting bolt upright, gasping, SpO₂ 86%, BP 176/98, crackles to the apices. Diagnosis is clear. What is the first-line drug?',
    vitals: [v('BP', '176/98', true), v('SpO₂', '86%', true), v('RR', '32', true)],
    findings: [],
    options: [
      { id: 'a', text: 'IV loop diuretic (furosemide)', correct: true },
      { id: 'b', text: 'IV beta-blocker', whyNot: 'Blunting contractility in acute pulmonary edema can tip a struggling ventricle into cardiogenic shock.' },
      { id: 'c', text: 'IV fluids', whyNot: 'The problem is too much fluid in the wrong place — a bolus makes the edema worse.' },
      { id: 'd', text: 'Oral spironolactone', whyNot: 'An aldosterone antagonist is chronic-care mortality benefit, not minutes-matter decongestion.' },
    ],
    discriminator: 'Hypertensive flash pulmonary edema is decongested with IV loop diuretics plus nitrates and oxygen — beta-blockade and fluids both move the patient the wrong way.',
    teachingPoint: 'Add IV nitroglycerin for afterload when the blood pressure is high, as here.',
    tags: { system: 'cardiovascular', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'clerkship', boards: ['step2', 'step3'] },
    difficultySeed: 0.7,
    source: [{ ref: 'ACC/AHA/HFSA Heart Failure Guideline', year: 2022 }],
  },
  {
    itemId: 'anaphylaxis-1', version: 1, type: 'management', conceptId: 'anaphylaxis-firstline',
    stem: 'Minutes after a cephalosporin dose: diffuse hives, lip swelling, wheeze and BP 82/50. What do you give first, and by what route?',
    vitals: [v('HR', '128', true), v('BP', '82/50', true), v('SpO₂', '90%', true)],
    findings: [],
    options: [
      { id: 'a', text: 'Intramuscular epinephrine to the thigh', correct: true },
      { id: 'b', text: 'IV diphenhydramine', whyNot: 'Antihistamines treat the hives but do nothing for the airway or the collapsing blood pressure — they are adjuncts, not the drug.' },
      { id: 'c', text: 'IV hydrocortisone', whyNot: 'Steroids may blunt a late-phase reaction hours later; they save no one in the first minutes.' },
      { id: 'd', text: 'Nebulised albuterol', whyNot: 'A bronchodilator eases wheeze but leaves the hypotension and laryngeal edema untreated.' },
    ],
    discriminator: 'Anaphylaxis is intramuscular epinephrine, first and without hesitation — antihistamines and steroids are adjuncts that treat neither the airway nor the shock.',
    teachingPoint: 'IM into the anterolateral thigh; repeat every 5–15 minutes as needed before reaching for IV access.',
    tags: { system: 'multisystem', complaint: 'shock', rotation: ['em', 'im', 'peds'], level: 'both', boards: ['step1', 'step2', 'step3'] },
    difficultySeed: 0.8,
    source: [{ ref: 'WAO Anaphylaxis Guidance', year: 2020 }],
  },
  {
    itemId: 'afib-anticoag-1', version: 1, type: 'management', conceptId: 'afib-anticoag',
    stem: 'A 74-year-old woman with hypertension and diabetes is found to have non-valvular atrial fibrillation. She has never had a stroke. What most determines whether she needs long-term anticoagulation?',
    vitals: [],
    findings: [],
    options: [
      { id: 'a', text: 'Her CHA₂DS₂-VASc score', correct: true },
      { id: 'b', text: 'Her heart rate at rest', whyNot: 'Rate guides symptom control, not stroke prophylaxis — a rate-controlled patient still strokes without anticoagulation.' },
      { id: 'c', text: 'Whether she feels palpitations', whyNot: 'Symptom burden does not track embolic risk; silent AF embolises just as readily.' },
      { id: 'd', text: 'Whether rhythm control is chosen', whyNot: 'Anticoagulation is decided by embolic risk regardless of a rate-versus-rhythm strategy.' },
    ],
    discriminator: 'Stroke prophylaxis in AF is driven by CHA₂DS₂-VASc, not by rate, symptoms, or the rhythm strategy — her age, hypertension, diabetes and sex already put her at ≥2.',
    teachingPoint: 'Score ≥2 in men or ≥3 in women warrants a DOAC; her score of 4 clears that bar comfortably.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'fm'], level: 'clerkship', boards: ['step2', 'step3'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA/ACCP/HRS Atrial Fibrillation Guideline', year: 2023 }],
  },
  {
    itemId: 'dka-firststep-1', version: 1, type: 'management', conceptId: 'dka-firststep',
    stem: 'New diabetic ketoacidosis: glucose 540, pH 7.10, potassium 5.2, and clinically dry with tachycardia. What is the first step?',
    vitals: [v('HR', '124', true), v('BP', '104/64'), v('K⁺', '5.2')],
    findings: [],
    options: [
      { id: 'a', text: 'IV isotonic fluids', correct: true },
      { id: 'b', text: 'IV insulin bolus', whyNot: 'Insulin before rehydration collapses the intravascular volume and drives potassium into cells too fast.' },
      { id: 'c', text: 'IV sodium bicarbonate', whyNot: 'Bicarbonate is reserved for extreme acidemia; it does not treat the underlying dehydration and insulin deficit.' },
      { id: 'd', text: 'IV potassium replacement now', whyNot: 'Her potassium is still normal-high — replace only once it falls below 5.3 and urine output is confirmed.' },
    ],
    discriminator: 'DKA is fluids first — restore volume before insulin, and never start insulin if potassium is under 3.3, because insulin will drive it lower.',
    teachingPoint: 'Total-body potassium is depleted even when the serum value looks normal; watch it hourly once insulin runs.',
    tags: { system: 'endocrine', complaint: 'metabolic emergency', rotation: ['im', 'em'], level: 'clerkship', boards: ['step2', 'step3'] },
    difficultySeed: 0.65,
    source: [{ ref: 'ADA Standards of Care — Hyperglycemic Crises', year: 2024 }],
  },

  /* ══════════ ECG MINI-GAME ══════════
     Each item renders a rhythm strip as the prompt; the options are
     rhythm names. The discriminator is the one reading pearl. */
  {
    itemId: 'ecg-stemi-1', version: 1, type: 'ecg', conceptId: 'ecg-stemi',
    stem: '61 M, crushing chest pain for 40 minutes. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 84, regularity: 'regular', pWave: 'normal', qrsWide: false, stShift: 0.55, tWave: 'normal', lead: 'Lead V3' },
    options: [
      { id: 'a', text: 'ST-elevation myocardial infarction', correct: true },
      { id: 'b', text: 'Normal sinus rhythm', whyNot: 'The J points are lifted well off the baseline — that ST elevation is exactly what "normal" rules out.' },
      { id: 'c', text: 'Pericarditis', whyNot: 'Pericarditis elevates ST diffusely with PR depression; this elevation is regional and convex.' },
      { id: 'd', text: 'Atrial fibrillation', whyNot: 'The rhythm is regular with clear P waves — AF is irregularly irregular with none.' },
    ],
    discriminator: 'ST-segment elevation of a millimetre or more, coving up off the baseline in a coronary territory, is an acute infarct until reperfusion proves otherwise.',
    teachingPoint: 'The reciprocal ST depression in the opposite leads is what separates STEMI from the diffuse elevation of pericarditis.',
    tags: { system: 'cardiovascular', complaint: 'chest pain', rotation: ['im', 'em'], level: 'both', boards: ['step2', 'step3'] },
    difficultySeed: 0.75,
    source: [{ ref: 'ACC/AHA Chest Pain Guideline', year: 2021 }],
  },
  {
    itemId: 'ecg-vt-1', version: 1, type: 'ecg', conceptId: 'ecg-vt',
    stem: '70 M with prior MI, palpitations and lightheadedness. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 180, regularity: 'regular', pWave: 'absent', qrsWide: true, tWave: 'inverted', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Ventricular tachycardia', correct: true },
      { id: 'b', text: 'Sinus tachycardia', whyNot: 'Sinus tachycardia has narrow complexes with a P before every QRS; this is broad and P-less.' },
      { id: 'c', text: 'Atrial fibrillation', whyNot: 'AF is irregular; this rhythm is regular and monomorphic.' },
      { id: 'd', text: 'First-degree AV block', whyNot: 'First-degree block is a long PR on otherwise narrow, normal-rate beats — nothing like a wide fast run.' },
    ],
    discriminator: 'A fast, regular, wide-complex rhythm with no P waves — in someone with a prior infarct — is ventricular tachycardia until proven otherwise.',
    teachingPoint: 'Structural heart disease turns "wide and fast" into VT by default; do not talk yourself into SVT with aberrancy.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'both', boards: ['step2', 'step3'] },
    difficultySeed: 0.7,
    source: [{ ref: 'AHA/ACC/HRS Ventricular Arrhythmias Guideline', year: 2017 }],
  },
  {
    itemId: 'ecg-afib-1', version: 1, type: 'ecg', conceptId: 'ecg-afib',
    stem: 'Irregular palpitations in a 68-year-old. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 130, regularity: 'irregularly_irregular', pWave: 'fibrillatory', qrsWide: false, tWave: 'normal', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Atrial fibrillation', correct: true },
      { id: 'b', text: 'Atrial flutter', whyNot: 'Flutter marches in a regular sawtooth; this baseline is chaotic and the R–R intervals never settle.' },
      { id: 'c', text: 'Sinus arrhythmia', whyNot: 'Sinus arrhythmia keeps a P before every QRS and varies only gently with breathing.' },
      { id: 'd', text: 'Multifocal atrial tachycardia', whyNot: 'MAT has visible P waves of three or more shapes; AF has no organised P waves at all.' },
    ],
    discriminator: 'An irregularly irregular rhythm with no discernible P waves and a wavering baseline is atrial fibrillation — the disorganised atrium never produces a clean P.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.7,
    source: [{ ref: 'ACC/AHA/ACCP/HRS Atrial Fibrillation Guideline', year: 2023 }],
  },
  {
    itemId: 'ecg-flutter-1', version: 1, type: 'ecg', conceptId: 'ecg-flutter',
    stem: 'Regular narrow tachycardia around 150. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 150, regularity: 'regular', pWave: 'sawtooth', qrsWide: false, tWave: 'normal', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Atrial flutter', correct: true },
      { id: 'b', text: 'Atrial fibrillation', whyNot: 'AF is irregular with a chaotic baseline; flutter is regular with organised sawtooth waves.' },
      { id: 'c', text: 'Sinus tachycardia', whyNot: 'Sinus tachycardia has one upright P per QRS, not a continuous picket-fence of atrial waves.' },
      { id: 'd', text: 'AVNRT', whyNot: 'AVNRT hides the P waves in the QRS; flutter shows them plainly as sawtooth between complexes.' },
    ],
    discriminator: 'A regular narrow tachycardia at almost exactly 150 with sawtooth flutter waves is atrial flutter with 2:1 block — the atrial rate near 300 halves to a suspiciously round ventricular rate.',
    teachingPoint: 'Any regular narrow tachycardia sitting right at 150 should prompt a hunt for flutter waves.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'clerkship', boards: ['step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA/HRS Supraventricular Tachycardia Guideline', year: 2015 }],
  },
  {
    itemId: 'ecg-chb-1', version: 1, type: 'ecg', conceptId: 'ecg-chb',
    stem: '80 F, lightheaded and bradycardic. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 38, regularity: 'regular', pWave: 'dissociated', qrsWide: true, tWave: 'normal', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Complete (third-degree) heart block', correct: true },
      { id: 'b', text: 'Sinus bradycardia', whyNot: 'Sinus bradycardia keeps a fixed P–QRS relationship; here the P waves march independently of the QRS.' },
      { id: 'c', text: 'First-degree AV block', whyNot: 'First-degree block conducts every P with a long but constant PR; in complete block none conduct.' },
      { id: 'd', text: 'Atrial fibrillation', whyNot: 'AF has no P waves; complete block has too many — marching at their own rate, unrelated to the QRS.' },
    ],
    discriminator: 'P waves and QRS complexes each regular but marching to their own drum — atrioventricular dissociation with a slow escape — is complete heart block.',
    teachingPoint: 'The giveaway is P–P regular, R–R regular, but no fixed relationship between them.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em'], level: 'clerkship', boards: ['step2', 'step3'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACC/AHA/HRS Bradycardia Guideline', year: 2018 }],
  },
  {
    itemId: 'ecg-first-degree-1', version: 1, type: 'ecg', conceptId: 'ecg-first-degree',
    stem: 'Asymptomatic finding on a routine ECG. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 66, regularity: 'regular', pWave: 'normal', prMs: 320, qrsWide: false, tWave: 'normal', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'First-degree AV block', correct: true },
      { id: 'b', text: 'Normal sinus rhythm', whyNot: 'The PR interval is stretched well beyond 200 ms — a normal tracing keeps it under one large box.' },
      { id: 'c', text: 'Complete heart block', whyNot: 'Here every P still conducts to a QRS; in complete block none do.' },
      { id: 'd', text: 'Second-degree block, Mobitz I', whyNot: 'Mobitz I drops beats after progressive PR lengthening; this PR is long but constant and never drops.' },
    ],
    discriminator: 'A PR interval fixed above 200 ms with every P conducting is first-degree AV block — long but constant and never dropping a beat.',
    tags: { system: 'cardiovascular', complaint: 'incidental', rotation: ['im', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.65,
    source: [{ ref: 'ACC/AHA/HRS Bradycardia Guideline', year: 2018 }],
  },
  {
    itemId: 'ecg-hyperk-1', version: 1, type: 'ecg', conceptId: 'ecg-hyperk',
    stem: 'Missed dialysis, now weak. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 62, regularity: 'regular', pWave: 'normal', qrsWide: true, tWave: 'peaked', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Hyperkalemia', correct: true },
      { id: 'b', text: 'STEMI', whyNot: 'This is a peaked, tented T wave, not a lifted ST segment — the injury pattern of ischemia is different.' },
      { id: 'c', text: 'Normal sinus rhythm', whyNot: 'The tall tented T waves and broadening QRS are exactly what a normal tracing lacks.' },
      { id: 'd', text: 'Pericarditis', whyNot: 'Pericarditis gives diffuse ST elevation and PR depression, not tented T waves with a widening QRS.' },
    ],
    discriminator: 'Tall, tented, narrow-based T waves with a broadening QRS are the ECG face of hyperkalemia — the first sign before the sine-wave pattern of arrest.',
    teachingPoint: 'A widening QRS in this setting is a call for IV calcium now, not a repeat potassium in an hour.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['im', 'em'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.65,
    source: [{ ref: 'KDIGO Controversies: Potassium Management', year: 2020 }],
  },
  {
    itemId: 'ecg-wpw-1', version: 1, type: 'ecg', conceptId: 'ecg-wpw',
    stem: 'Young patient with intermittent palpitations, currently in sinus. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 72, regularity: 'regular', pWave: 'normal', prMs: 90, qrsWide: true, delta: true, tWave: 'normal', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Ventricular pre-excitation (WPW)', correct: true },
      { id: 'b', text: 'Bundle branch block', whyNot: 'A bundle branch block widens the QRS but keeps a normal PR and has no delta wave slurring the upstroke.' },
      { id: 'c', text: 'Ventricular tachycardia', whyNot: 'VT is fast and P-less; this is a normal-rate sinus rhythm with a pre-excited QRS.' },
      { id: 'd', text: 'First-degree AV block', whyNot: 'First-degree block lengthens the PR; pre-excitation shortens it and adds a delta wave.' },
    ],
    discriminator: 'A short PR interval with a delta wave slurring the start of a widened QRS is pre-excitation — an accessory pathway lighting the ventricle up early.',
    teachingPoint: 'Avoid AV-nodal blockers if this patient develops AF: they can accelerate conduction down the accessory pathway.',
    tags: { system: 'cardiovascular', complaint: 'palpitations', rotation: ['im', 'em'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'ACC/AHA/HRS Supraventricular Tachycardia Guideline', year: 2015 }],
  },
  {
    itemId: 'ecg-torsades-1', version: 1, type: 'ecg', conceptId: 'ecg-torsades',
    stem: 'Syncope on a QT-prolonging drug; a captured run. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 220, regularity: 'irregular', pWave: 'absent', qrsWide: true, special: 'torsades', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Torsades de pointes', correct: true },
      { id: 'b', text: 'Monomorphic VT', whyNot: 'Monomorphic VT keeps a single QRS shape; torsades twists, its amplitude waxing and waning around the baseline.' },
      { id: 'c', text: 'Atrial fibrillation', whyNot: 'AF is a narrow irregular rhythm; this is a broad polymorphic run spiralling around the isoelectric line.' },
      { id: 'd', text: 'Artifact', whyNot: 'The pattern is a reproducible sinusoidal twist with syncope — too organised and too clinical to dismiss as noise.' },
    ],
    discriminator: 'A polymorphic wide-complex run whose axis twists around the baseline, in the setting of a long QT, is torsades de pointes — treat with magnesium.',
    teachingPoint: 'Hunt for the culprit: QT-prolonging drugs, hypokalemia, hypomagnesemia.',
    tags: { system: 'cardiovascular', complaint: 'syncope', rotation: ['im', 'em'], level: 'both', boards: ['step1', 'step2', 'step3'] },
    difficultySeed: 0.6,
    source: [{ ref: 'AHA/ACC/HRS Ventricular Arrhythmias Guideline', year: 2017 }],
  },
  {
    itemId: 'ecg-vfib-1', version: 1, type: 'ecg', conceptId: 'ecg-vfib',
    stem: 'Unresponsive, no pulse. Read the strip.',
    vitals: [],
    findings: [],
    ecg: { rate: 300, regularity: 'irregularly_irregular', pWave: 'absent', qrsWide: true, special: 'vfib', lead: 'Lead II' },
    options: [
      { id: 'a', text: 'Ventricular fibrillation', correct: true },
      { id: 'b', text: 'Asystole', whyNot: 'Asystole is a flat line; this is chaotic electrical activity — a shockable rhythm, not a silent one.' },
      { id: 'c', text: 'Fine atrial fibrillation', whyNot: 'AF still marches organised QRS complexes; VF has no complexes at all, only chaos.' },
      { id: 'd', text: 'Torsades de pointes', whyNot: 'Torsades has a discernible twisting sinusoidal pattern; VF is disorganised without any repeating axis.' },
    ],
    discriminator: 'Chaotic, disorganised deflections with no identifiable QRS in a pulseless patient is ventricular fibrillation — defibrillate immediately.',
    teachingPoint: 'VF and pulseless VT are the shockable arrest rhythms; asystole and PEA are not.',
    tags: { system: 'cardiovascular', complaint: 'arrest', rotation: ['im', 'em'], level: 'both', boards: ['step2', 'step3'] },
    difficultySeed: 0.75,
    source: [{ ref: 'AHA Guidelines for CPR and ECC', year: 2020 }],
  },

  /* ══════════ BUZZWORD ASSOCIATION MINI-GAME ══════════
     The stem is the buzzword / gene / finding; the options are
     diagnoses. Fast pattern recognition — Step 1 and Step 2 gold. */
  {
    itemId: 'assoc-jak2-1', version: 1, type: 'association', conceptId: 'assoc-jak2',
    stem: 'JAK2 V617F mutation with an elevated red cell mass and aquagenic pruritus.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Polycythemia vera', correct: true },
      { id: 'b', text: 'Chronic myeloid leukemia', whyNot: 'CML is driven by BCR-ABL, not JAK2, and raises the white count rather than the red cell mass.' },
      { id: 'c', text: 'Secondary polycythemia', whyNot: 'Secondary polycythemia is EPO-driven from hypoxia and carries no JAK2 mutation.' },
      { id: 'd', text: 'Essential thrombocythemia', whyNot: 'ET can share JAK2 but the picture is a platelet count in the millions, not a raised red cell mass with itching.' },
    ],
    discriminator: 'JAK2 V617F plus a raised red cell mass and itching after a hot shower is polycythemia vera — the mutation uncouples the marrow from EPO control.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'WHO Classification of Myeloid Neoplasms', year: 2022 }],
  },
  {
    itemId: 'assoc-auer-1', version: 1, type: 'association', conceptId: 'assoc-auer',
    stem: 'Auer rods in myeloid blasts on the peripheral smear.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Acute myeloid leukemia', correct: true },
      { id: 'b', text: 'Acute lymphoblastic leukemia', whyNot: 'ALL blasts are lymphoid and lack Auer rods; think ALL in a child with TdT-positive blasts instead.' },
      { id: 'c', text: 'Chronic myeloid leukemia', whyNot: 'CML shows a left-shifted myeloid series, not sheets of blasts studded with Auer rods.' },
      { id: 'd', text: 'Reactive leukocytosis', whyNot: 'A reactive smear has mature neutrophils with toxic granulation, never Auer-rod-bearing blasts.' },
    ],
    discriminator: 'Auer rods are crystallised azurophilic granules found only in myeloid blasts — they are essentially pathognomonic for AML.',
    teachingPoint: 'Auer rods plus DIC points to acute promyelocytic leukemia (APL), the t(15;17) subtype.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'WHO Classification of Myeloid Neoplasms', year: 2022 }],
  },
  {
    itemId: 'assoc-philadelphia-1', version: 1, type: 'association', conceptId: 'assoc-philadelphia',
    stem: 'The Philadelphia chromosome, t(9;22), producing a BCR-ABL fusion, with a markedly raised neutrophil count.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Chronic myeloid leukemia', correct: true },
      { id: 'b', text: 'Acute myeloid leukemia', whyNot: 'AML is a blast crisis of immature cells; classic CML is a raised mature myeloid count driven by BCR-ABL.' },
      { id: 'c', text: 'Polycythemia vera', whyNot: 'PV is a JAK2-driven red cell disorder, not a BCR-ABL neutrophilia.' },
      { id: 'd', text: 'Leukemoid reaction', whyNot: 'A leukemoid reaction has a high leukocyte alkaline phosphatase; CML famously has a low LAP score.' },
    ],
    discriminator: 'BCR-ABL from t(9;22) is the engine of chronic myeloid leukemia — and the target of imatinib, the drug that made it a chronic disease.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'WHO Classification of Myeloid Neoplasms', year: 2022 }],
  },
  {
    itemId: 'assoc-smudge-1', version: 1, type: 'association', conceptId: 'assoc-smudge',
    stem: 'Smudge cells and a lymphocytosis of mature-looking B cells in an older adult.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Chronic lymphocytic leukemia', correct: true },
      { id: 'b', text: 'Acute lymphoblastic leukemia', whyNot: 'ALL is a disease of children with fragile blasts, not mature smudge-prone lymphocytes in an elder.' },
      { id: 'c', text: 'Infectious mononucleosis', whyNot: 'Mono shows reactive atypical lymphocytes in a young patient, not monoclonal smudge cells.' },
      { id: 'd', text: 'Hairy cell leukemia', whyNot: 'Hairy cell shows cytoplasmic projections and marrow fibrosis, not smudge cells.' },
    ],
    discriminator: 'Smudge cells — fragile mature lymphocytes crushed on the smear — with a B-cell lymphocytosis in an older adult is chronic lymphocytic leukemia.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'WHO Classification of Lymphoid Neoplasms', year: 2022 }],
  },
  {
    itemId: 'assoc-reed-sternberg-1', version: 1, type: 'association', conceptId: 'assoc-reed-sternberg',
    stem: 'Binucleate "owl-eye" Reed–Sternberg cells in a lymph node from a young adult with painless cervical adenopathy.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Hodgkin lymphoma', correct: true },
      { id: 'b', text: 'Non-Hodgkin lymphoma', whyNot: 'NHL lacks Reed–Sternberg cells and tends to spread non-contiguously; the owl-eye cell defines Hodgkin.' },
      { id: 'c', text: 'Reactive lymphadenitis', whyNot: 'Reactive nodes show preserved architecture with follicular hyperplasia, not Reed–Sternberg cells.' },
      { id: 'd', text: 'Sarcoidosis', whyNot: 'Sarcoid nodes contain non-caseating granulomas, not binucleate Reed–Sternberg cells.' },
    ],
    discriminator: 'The binucleate owl-eye Reed–Sternberg cell is the diagnostic cell of Hodgkin lymphoma — its contiguous nodal spread and bimodal age curve follow.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'WHO Classification of Lymphoid Neoplasms', year: 2022 }],
  },
  {
    itemId: 'assoc-ttp-1', version: 1, type: 'association', conceptId: 'assoc-ttp',
    stem: 'Schistocytes, thrombocytopenia, fever, fluctuating neuro signs and acute kidney injury — with a normal coagulation panel.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Thrombotic thrombocytopenic purpura', correct: true },
      { id: 'b', text: 'Disseminated intravascular coagulation', whyNot: 'DIC consumes clotting factors, so PT and PTT are prolonged; in TTP the coagulation panel is normal.' },
      { id: 'c', text: 'Immune thrombocytopenia', whyNot: 'ITP is isolated low platelets with no schistocytes, hemolysis, fever, or organ dysfunction.' },
      { id: 'd', text: 'Hemolytic uremic syndrome', whyNot: 'HUS overlaps but is renal-predominant in children after Shiga toxin; the fever-plus-neuro pentad is TTP.' },
    ],
    discriminator: 'A microangiopathy with schistocytes and low platelets but a normal PT/PTT is TTP, not DIC — the clue is that clotting factors are spared.',
    teachingPoint: 'TTP is an ADAMTS13 deficiency; do not give platelets — start plasma exchange.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im', 'em'], level: 'both', boards: ['step1', 'step2', 'step3'] },
    difficultySeed: 0.55,
    source: [{ ref: 'ISTH Guidelines for TTP', year: 2020 }],
  },
  {
    itemId: 'assoc-anti-ccp-1', version: 1, type: 'association', conceptId: 'assoc-anti-ccp',
    stem: 'Anti-cyclic citrullinated peptide (anti-CCP) antibodies with symmetric small-joint pain and morning stiffness.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Rheumatoid arthritis', correct: true },
      { id: 'b', text: 'Systemic lupus erythematosus', whyNot: 'SLE is defined by anti-dsDNA and anti-Smith; anti-CCP is specific for rheumatoid disease.' },
      { id: 'c', text: 'Osteoarthritis', whyNot: 'OA is a mechanical, seronegative, evening-worse arthritis of the large and DIP joints — no autoantibodies.' },
      { id: 'd', text: 'Gout', whyNot: 'Gout is a crystal arthritis diagnosed on negatively birefringent urate, not an antibody.' },
    ],
    discriminator: 'Anti-CCP is the most specific antibody for rheumatoid arthritis and marks erosive disease — more specific than rheumatoid factor.',
    tags: { system: 'msk_rheum', complaint: 'buzzword', rotation: ['im', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACR/EULAR Rheumatoid Arthritis Criteria', year: 2010 }],
  },
  {
    itemId: 'assoc-anti-dsdna-1', version: 1, type: 'association', conceptId: 'assoc-anti-dsdna',
    stem: 'Anti-double-stranded-DNA and anti-Smith antibodies in a young woman with a malar rash and glomerulonephritis.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Systemic lupus erythematosus', correct: true },
      { id: 'b', text: 'Rheumatoid arthritis', whyNot: 'RA is marked by anti-CCP and rheumatoid factor, not anti-dsDNA or anti-Smith.' },
      { id: 'c', text: 'Systemic sclerosis', whyNot: 'Scleroderma carries anti-Scl-70 or anti-centromere, and skin tightening rather than a malar rash.' },
      { id: 'd', text: 'Sjögren syndrome', whyNot: 'Sjögren is anti-Ro/La with dry eyes and mouth, not anti-dsDNA nephritis.' },
    ],
    discriminator: 'Anti-dsDNA and anti-Smith are both highly specific for lupus, and anti-dsDNA titres track renal disease activity.',
    tags: { system: 'msk_rheum', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ACR/EULAR SLE Classification Criteria', year: 2019 }],
  },
  {
    itemId: 'assoc-anti-histone-1', version: 1, type: 'association', conceptId: 'assoc-anti-histone',
    stem: 'Anti-histone antibodies with arthralgia and serositis that began after starting hydralazine or procainamide.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Drug-induced lupus', correct: true },
      { id: 'b', text: 'Systemic lupus erythematosus', whyNot: 'Idiopathic SLE centres on anti-dsDNA/Smith and commonly involves the kidneys and CNS, which drug-induced lupus spares.' },
      { id: 'c', text: 'Rheumatoid arthritis', whyNot: 'RA is an anti-CCP erosive arthritis without the drug trigger or anti-histone signature.' },
      { id: 'd', text: 'Mixed connective tissue disease', whyNot: 'MCTD is defined by high-titre anti-U1-RNP, not anti-histone antibodies.' },
    ],
    discriminator: 'Anti-histone antibodies after a culprit drug — classically hydralazine, procainamide or isoniazid — is drug-induced lupus, which resolves when the drug stops.',
    tags: { system: 'msk_rheum', complaint: 'buzzword', rotation: ['im', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'Review: Drug-induced lupus erythematosus', year: 2018 }],
  },
  {
    itemId: 'assoc-hla-b27-1', version: 1, type: 'association', conceptId: 'assoc-hla-b27',
    stem: 'A young man with inflammatory back pain, a "bamboo spine" on X-ray, and HLA-B27 positivity.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Ankylosing spondylitis', correct: true },
      { id: 'b', text: 'Mechanical low back pain', whyNot: 'Mechanical pain eases with rest and worsens with activity; inflammatory spondyloarthritis does the reverse and fuses the spine.' },
      { id: 'c', text: 'Rheumatoid arthritis', whyNot: 'RA spares the axial spine below C1–C2 and is anti-CCP positive, not HLA-B27 driven.' },
      { id: 'd', text: 'Osteoporotic compression fracture', whyNot: 'A fracture is acute focal pain, not chronic inflammatory stiffness with syndesmophyte bridging.' },
    ],
    discriminator: 'Inflammatory back pain that improves with exercise, HLA-B27, and syndesmophytes bridging into a bamboo spine is ankylosing spondylitis.',
    tags: { system: 'msk_rheum', complaint: 'buzzword', rotation: ['im', 'fm'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'ASAS Classification of Axial Spondyloarthritis', year: 2009 }],
  },
  {
    itemId: 'assoc-anti-gbm-1', version: 1, type: 'association', conceptId: 'assoc-anti-gbm',
    stem: 'Anti-glomerular-basement-membrane antibodies with hemoptysis and a rapidly progressive glomerulonephritis, and linear IgG on renal biopsy.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Goodpasture syndrome', correct: true },
      { id: 'b', text: 'Granulomatosis with polyangiitis', whyNot: 'GPA is c-ANCA positive with upper-airway involvement, not anti-GBM with linear IgG.' },
      { id: 'c', text: 'IgA nephropathy', whyNot: 'IgA nephropathy shows mesangial IgA after a mucosal infection, not linear anti-GBM staining.' },
      { id: 'd', text: 'Post-streptococcal glomerulonephritis', whyNot: 'PSGN is a lumpy-bumpy immune-complex nephritis after strep, with low complement — not anti-GBM.' },
    ],
    discriminator: 'Anti-GBM antibodies and linear IgG along the basement membrane, striking lung and kidney together, is Goodpasture (anti-GBM) disease.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'KDIGO Glomerular Diseases Guideline', year: 2021 }],
  },
  {
    itemId: 'assoc-ama-1', version: 1, type: 'association', conceptId: 'assoc-ama',
    stem: 'Anti-mitochondrial antibodies in a middle-aged woman with fatigue, intense pruritus and a cholestatic liver panel.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Primary biliary cholangitis', correct: true },
      { id: 'b', text: 'Autoimmune hepatitis', whyNot: 'Autoimmune hepatitis is anti-smooth-muscle positive with a hepatocellular (transaminase-predominant) pattern.' },
      { id: 'c', text: 'Primary sclerosing cholangitis', whyNot: 'PSC is a beaded-duct disease of men with ulcerative colitis and p-ANCA, not AMA.' },
      { id: 'd', text: 'Viral hepatitis', whyNot: 'Viral hepatitis is diagnosed by serologies and raises transaminases; it does not produce anti-mitochondrial antibodies.' },
    ],
    discriminator: 'Anti-mitochondrial antibodies with a cholestatic, itchy picture in a middle-aged woman is primary biliary cholangitis — the AMA is over 90% sensitive.',
    tags: { system: 'gi', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.6,
    source: [{ ref: 'AASLD Primary Biliary Cholangitis Guidance', year: 2018 }],
  },
  {
    itemId: 'assoc-rib-notching-1', version: 1, type: 'association', conceptId: 'assoc-rib-notching',
    stem: 'Rib notching on chest X-ray with upper-extremity hypertension and weak, delayed femoral pulses in a young patient.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Coarctation of the aorta', correct: true },
      { id: 'b', text: 'Essential hypertension', whyNot: 'Essential hypertension does not carve notches in the ribs or give an arm–leg pulse and pressure gap.' },
      { id: 'c', text: 'Patent ductus arteriosus', whyNot: 'A PDA gives a continuous machinery murmur and wide pulse pressure, not rib notching with radiofemoral delay.' },
      { id: 'd', text: 'Takayasu arteritis', whyNot: 'Takayasu causes pulseless upper limbs in young women, but not the classic rib notching of collateral flow in coarctation.' },
    ],
    discriminator: 'Rib notching plus upper-body hypertension with radiofemoral delay is coarctation — dilated intercostal collaterals erode the ribs to bypass the narrowing.',
    teachingPoint: 'Coarctation is associated with bicuspid aortic valve and with Turner syndrome.',
    tags: { system: 'cardiovascular', complaint: 'buzzword', rotation: ['im', 'peds'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'AHA/ACC Adult Congenital Heart Disease Guideline', year: 2018 }],
  },
  {
    itemId: 'assoc-currant-jelly-1', version: 1, type: 'association', conceptId: 'assoc-currant-jelly',
    stem: 'Thick "currant-jelly" sputum and a cavitating upper-lobe pneumonia in an alcoholic.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Klebsiella pneumoniae', correct: true },
      { id: 'b', text: 'Streptococcus pneumoniae', whyNot: 'Pneumococcus gives rusty sputum and lobar consolidation, not gelatinous currant-jelly sputum with cavitation.' },
      { id: 'c', text: 'Mycoplasma pneumoniae', whyNot: 'Mycoplasma is a walking pneumonia with scant sputum and interstitial infiltrates, not a cavitating abscess.' },
      { id: 'd', text: 'Pseudomonas aeruginosa', whyNot: 'Pseudomonas favours cystic fibrosis and ventilated patients; the alcoholic with currant-jelly sputum is classic Klebsiella.' },
    ],
    discriminator: 'Currant-jelly sputum with an upper-lobe cavitating pneumonia in an alcoholic or diabetic is Klebsiella — its thick capsule bulges the fissure on the film.',
    tags: { system: 'infectious', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'ATS/IDSA Community-acquired Pneumonia Guideline', year: 2019 }],
  },
  {
    itemId: 'assoc-nf1-1', version: 1, type: 'association', conceptId: 'assoc-nf1',
    stem: 'Six café-au-lait macules, axillary freckling and Lisch nodules on the iris.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Neurofibromatosis type 1', correct: true },
      { id: 'b', text: 'Neurofibromatosis type 2', whyNot: 'NF2 is defined by bilateral acoustic schwannomas, not café-au-lait spots with Lisch nodules.' },
      { id: 'c', text: 'Tuberous sclerosis', whyNot: 'Tuberous sclerosis brings ash-leaf spots, angiofibromas and seizures, not Lisch nodules.' },
      { id: 'd', text: 'McCune–Albright syndrome', whyNot: 'McCune–Albright has irregular café-au-lait borders with precocious puberty and bone dysplasia, not Lisch nodules.' },
    ],
    discriminator: 'Café-au-lait macules, axillary freckling and iris Lisch nodules are the diagnostic triad of neurofibromatosis type 1 — a chromosome 17 neurocutaneous disorder.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['peds', 'im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [{ ref: 'NIH Consensus Criteria for NF1', year: 2021 }],
  },
];

/** The full bank of vignettes, normalised. */
export const ITEMS: Item[] = RAW.map(normalizeItem);

/**
 * Enrich a raw concept with taxonomy placement and fields derived
 * from its vignettes. Migrated content is marked UNREVIEWED until a
 * physician signs off — every concept cites real sources on its
 * vignettes, but none has yet had clinical review.
 */
function enrichConcept(raw: RawConcept, items: Item[]): Concept {
  const own = items.filter((i) => i.conceptId === raw.conceptId);
  const rotations = [...new Set(own.flatMap((i) => i.tags.rotation))].sort();
  const levels = new Set<'preclinical' | 'clerkship'>();
  for (const i of own) {
    if (i.tags.level === 'preclinical' || i.tags.level === 'both') levels.add('preclinical');
    if (i.tags.level === 'clerkship' || i.tags.level === 'both') levels.add('clerkship');
  }
  const subtopicId = CONCEPT_SUBTOPIC[raw.conceptId] ?? `${raw.system}.UNMAPPED`;
  const sub = subtopicById(subtopicId);
  return {
    conceptId: raw.conceptId,
    name: raw.name,
    system: raw.system,
    topic: raw.topic,
    subtopic: subtopicId,
    alsoTaggedSystems: raw.alsoTaggedSystems ?? CONCEPT_ALSO_SYSTEMS[raw.conceptId] ?? [],
    rotations,
    level: [...levels],
    usmleOutlineRefs: sub?.usmleOutlineRefs ?? [],
    illnessScript: raw.illnessScript,
    reviewedBy: raw.reviewedBy ?? UNREVIEWED,
    reviewedOn: raw.reviewedOn ?? null,
  };
}

/** The full concept set, enriched with taxonomy and derived tags. */
export const CONCEPTS: Concept[] = RAW_CONCEPTS.map((c) => enrichConcept(c, ITEMS));

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

/** Board-level scopes for the Focus screen. */
export const BOARD_LEVELS: { id: BoardLevel | 'all'; label: string; blurb: string }[] = [
  { id: 'all', label: 'All levels', blurb: 'Everything in the bank, unfiltered.' },
  { id: 'step1', label: 'Step 1', blurb: 'Mechanism, basic science, and buzzword pattern-recognition.' },
  { id: 'step2', label: 'Step 2 CK', blurb: 'Clinical diagnosis and the next best step on the wards.' },
  { id: 'step3', label: 'Step 3', blurb: 'Management, thresholds, and sequencing.' },
];

export function conceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.conceptId === id);
}

export function itemsForConcept(conceptId: string): Item[] {
  return ITEMS.filter((i) => i.conceptId === conceptId);
}

/** Does an item serve the given board scope? 'all' matches everything. */
export function servesBoard(item: Item, board: BoardLevel | 'all'): boolean {
  return board === 'all' || item.tags.boards.includes(board);
}
