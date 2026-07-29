/* ══════════════════════════════════════════════════════════════
   Pulmonary — variety pour.

   Depth on the existing respiratory differentials — asthma/COPD
   exacerbations, PE, pneumonia severity, the lung cancers and their
   paraneoplastic syndromes, ILD, and pneumothorax — adding the
   management side so each is drilled several ways. Items only.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (GINA, GOLD,
   ATS/ERS, IDSA/ATS, ESC, primary literature). Board-prep is
   coverage/inspiration only. Synthetic patients; enters review UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import { v, type ContentModule, type RawItem } from './authoring';

const items: RawItem[] = [
  /* ── Severe asthma / the silent chest ─────────────────────────── */
  {
    itemId: 'silentchest-tx', version: 1, type: 'tx_next_step', conceptId: 'silent-chest', presentation: 'severe',
    stem: 'A patient in a severe asthma exacerbation is tiring, with a quiet chest and a rising (now "normal") pCO₂. Beyond oxygen and preparing for possible intubation, what is the pharmacologic management?',
    vitals: [v('pCO₂', '42 (rising)', true), v('SpO₂', '90%', true)],
    findings: ['Impending respiratory failure: fatigue and a normalizing pCO₂ in status asthmaticus.'],
    options: [
      { id: 'a', text: 'Continuous/repeated inhaled SABA + ipratropium, systemic corticosteroids, and IV magnesium', correct: true },
      { id: 'b', text: 'A single dose of inhaled SABA and reassess in an hour', whyNot: 'A tiring patient with a rising pCO₂ needs aggressive continuous bronchodilators, steroids, and magnesium, not a single dose and delay.' },
      { id: 'c', text: 'Sedatives to calm the patient', whyNot: 'Sedation blunts respiratory drive and can precipitate arrest in a fatiguing asthmatic.' },
      { id: 'd', text: 'Oral steroids to start working over the next day', whyNot: 'Steroids are given, but the acute crisis also needs continuous bronchodilators and magnesium now; oral onset is too slow to rely on alone.' },
    ],
    discriminator: 'Severe asthma is treated with continuous SABA + ipratropium, early systemic corticosteroids, and IV magnesium — and a "normalizing" pCO₂ in a tiring asthmatic signals impending failure, not improvement.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Global Initiative for Asthma (GINA) — Global Strategy for Asthma Management and Prevention', year: 2023 }],
  },

  /* ── Lung cancer ──────────────────────────────────────────────── */
  {
    itemId: 'lungca-assoc', version: 1, type: 'association', conceptId: 'lung-cancer-types', presentation: 'atypical',
    stem: 'A smoker with a central lung mass has hyponatremia from SIADH and, separately, proximal weakness that improves with use. Which lung cancer is most likely?',
    vitals: [v('Na', '124', true)],
    findings: ['A central tumor with two paraneoplastic syndromes.'],
    options: [
      { id: 'a', text: 'Small cell lung cancer', correct: true },
      { id: 'b', text: 'Squamous cell carcinoma', whyNot: 'Squamous cell classically causes hypercalcemia (PTHrP), not SIADH and Lambert–Eaton.' },
      { id: 'c', text: 'Adenocarcinoma', whyNot: 'Adenocarcinoma is usually peripheral and is not the classic source of SIADH plus Lambert–Eaton.' },
      { id: 'd', text: 'Carcinoid tumor', whyNot: 'Carcinoid causes flushing/diarrhea (serotonin), not the SIADH + Lambert–Eaton pairing of small cell cancer.' },
    ],
    discriminator: 'Central small cell lung cancer is the classic source of SIADH, ectopic ACTH, and Lambert–Eaton syndrome, whereas squamous cell causes PTHrP-mediated hypercalcemia.',
    tags: { system: 'pulmonary', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['siadh'],
    source: [{ ref: 'Kanaji et al., Paraneoplastic Syndromes Associated With Lung Cancer (World J Clin Oncol / review)', year: 2014 }],
  },
  {
    itemId: 'lungca-nx', version: 1, type: 'next_step', conceptId: 'lung-cancer-types', presentation: 'classic',
    stem: 'A CT shows a spiculated lung mass with mediastinal lymphadenopathy in a smoker. What is needed before deciding on therapy?',
    vitals: [],
    findings: ['A suspicious mass with nodal involvement.'],
    options: [
      { id: 'a', text: 'Tissue diagnosis (biopsy) plus staging', correct: true },
      { id: 'b', text: 'Empiric chemotherapy without biopsy', whyNot: 'Treatment depends on histology (small cell vs non-small cell) and molecular markers; tissue is required first.' },
      { id: 'c', text: 'Immediate lobectomy without staging', whyNot: 'Surgery is only appropriate for early-stage disease; nodal/metastatic staging must precede it.' },
      { id: 'd', text: 'Antibiotics for presumed pneumonia', whyNot: 'A spiculated mass with adenopathy in a smoker is cancer until proven otherwise, not an infection to treat empirically.' },
    ],
    discriminator: 'A suspicious lung mass requires tissue diagnosis and staging before therapy, because management diverges sharply between small cell and non-small cell (and by molecular markers and stage).',
    tags: { system: 'pulmonary', complaint: 'lung mass', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [{ ref: 'Ettinger et al., NCCN Clinical Practice Guidelines: Non-Small Cell Lung Cancer', year: 2023 }],
  },

  /* ── PE treatment ─────────────────────────────────────────────── */
  {
    itemId: 'pe-tx', version: 1, type: 'tx_next_step', conceptId: 'pe-workup', presentation: 'classic',
    stem: 'A hemodynamically STABLE patient has a confirmed segmental pulmonary embolism and no bleeding contraindication. What is the treatment?',
    vitals: [v('BP', '124/78', false), v('HR', '96', false)],
    findings: ['Confirmed PE without hypotension or right-heart strain requiring lysis.'],
    options: [
      { id: 'a', text: 'Therapeutic anticoagulation (e.g., a DOAC or LMWH)', correct: true },
      { id: 'b', text: 'Systemic thrombolysis for everyone with PE', whyNot: 'Thrombolysis is reserved for massive (hemodynamically unstable) PE; in stable PE its bleeding risk outweighs benefit.' },
      { id: 'c', text: 'Aspirin alone', whyNot: 'Antiplatelet therapy is inadequate for venous thromboembolism, which requires anticoagulation.' },
      { id: 'd', text: 'An IVC filter as first-line', whyNot: 'Filters are for when anticoagulation is contraindicated, not first-line therapy for a treatable PE.' },
    ],
    discriminator: 'Stable pulmonary embolism is treated with therapeutic anticoagulation, reserving thrombolysis for massive PE with hemodynamic instability and IVC filters for when anticoagulation is contraindicated.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Stevens et al., Antithrombotic Therapy for VTE Disease (CHEST Guideline)', year: 2021 }],
  },
  {
    itemId: 'pe-thr', version: 1, type: 'tx_threshold', conceptId: 'pe-workup', presentation: 'severe',
    stem: 'A patient with a large pulmonary embolism is now hypotensive (systolic 76 mmHg) with signs of shock and no bleeding contraindication. What is indicated?',
    vitals: [v('BP', '76/50', true), v('HR', '132', true)],
    findings: ['Massive (high-risk) PE with obstructive shock.'],
    options: [
      { id: 'a', text: 'Systemic thrombolysis (or embolectomy if lysis is contraindicated)', correct: true },
      { id: 'b', text: 'Anticoagulation alone and observe', whyNot: 'In massive PE with shock, anticoagulation alone is too slow; reperfusion with thrombolysis is indicated to relieve the obstruction.' },
      { id: 'c', text: 'Diuresis for the hypotension', whyNot: 'The problem is obstructive shock, not volume overload; diuresis would worsen output.' },
      { id: 'd', text: 'Discharge on a DOAC', whyNot: 'A patient in obstructive shock from PE requires emergent reperfusion, not outpatient management.' },
    ],
    discriminator: 'Massive (high-risk) PE — hypotension/shock from the clot burden — is an indication for systemic thrombolysis (or embolectomy), the threshold that separates it from stable PE treated with anticoagulation alone.',
    tags: { system: 'pulmonary', complaint: 'shock', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Konstantinides et al., ESC Guidelines for the Diagnosis and Management of Acute Pulmonary Embolism', year: 2019 }],
  },

  /* ── COPD exacerbation ────────────────────────────────────────── */
  {
    itemId: 'copd-tx', version: 1, type: 'tx_next_step', conceptId: 'copd-vs-hf', presentation: 'severe',
    stem: 'A COPD patient has an exacerbation with increased dyspnea and purulent sputum. His SpO₂ is 84%. What is appropriate management, including the oxygen target?',
    vitals: [v('SpO₂', '84%', true)],
    findings: ['Increased sputum volume and purulence with worsening dyspnea.'],
    options: [
      { id: 'a', text: 'Short-acting bronchodilators, systemic steroids, antibiotics, and controlled O₂ to a target of 88–92%', correct: true },
      { id: 'b', text: 'High-flow oxygen to achieve 100% saturation', whyNot: 'Over-oxygenation in COPD can worsen CO₂ retention; the target is 88–92%.' },
      { id: 'c', text: 'Bronchodilators only, no steroids or antibiotics', whyNot: 'Exacerbations with increased purulence benefit from systemic steroids and antibiotics, not bronchodilators alone.' },
      { id: 'd', text: 'Immediate intubation for everyone', whyNot: 'Most exacerbations respond to medical therapy ± non-invasive ventilation; intubation is reserved for failure.' },
    ],
    discriminator: 'A COPD exacerbation with purulent sputum is treated with bronchodilators, systemic corticosteroids, and antibiotics, titrating oxygen to a target of 88–92% to avoid worsening hypercapnia.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Global Initiative for Chronic Obstructive Lung Disease (GOLD) Report', year: 2023 }],
  },

  /* ── Pneumonia severity ───────────────────────────────────────── */
  {
    itemId: 'cap-thr', version: 1, type: 'tx_threshold', conceptId: 'cap-recognition', presentation: 'classic',
    stem: 'A patient with community-acquired pneumonia is being triaged. Which structured tool helps decide whether they can be treated as an outpatient or need admission?',
    vitals: [v('RR', '24', false)],
    findings: ['Confirmed CAP; disposition decision pending.'],
    options: [
      { id: 'a', text: 'A severity score (CURB-65 or the Pneumonia Severity Index)', correct: true },
      { id: 'b', text: 'The presence of any cough', whyNot: 'Cough is universal in pneumonia and does not stratify severity or disposition.' },
      { id: 'c', text: 'Patient preference alone', whyNot: 'Disposition should be guided by validated severity criteria, not preference alone.' },
      { id: 'd', text: 'The color of the sputum', whyNot: 'Sputum color does not reliably predict severity or the need for admission.' },
    ],
    discriminator: 'CAP disposition is guided by a validated severity score — CURB-65 or the Pneumonia Severity Index — which stratifies mortality risk and the need for admission.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Metlay et al., ATS/IDSA Clinical Practice Guideline: Diagnosis and Treatment of Community-Acquired Pneumonia', year: 2019 }],
  },
  {
    itemId: 'cap-ddx', version: 1, type: 'discriminator', conceptId: 'cap-recognition', presentation: 'atypical',
    stem: 'A young adult has a subacute dry cough, low-grade fever, and diffuse interstitial infiltrates out of proportion to a relatively well appearance. Which pattern does this suggest?',
    vitals: [v('Temp', '37.8', false)],
    findings: ['"Walking pneumonia" — mild symptoms with diffuse infiltrates.'],
    options: [
      { id: 'a', text: 'Atypical pneumonia (e.g., Mycoplasma)', correct: true },
      { id: 'b', text: 'Classic lobar pneumococcal pneumonia', whyNot: 'Typical pneumococcal disease causes abrupt high fever, rigors, and lobar consolidation with a rusty productive cough, not this indolent interstitial picture.' },
      { id: 'c', text: 'Pulmonary embolism', whyNot: 'PE presents with pleuritic pain and dyspnea, not a subacute cough with diffuse infiltrates and a mycoplasma-like course.' },
      { id: 'd', text: 'Heart failure', whyNot: 'Cardiogenic edema shows dependent infiltrates with cardiomegaly and orthopnea, not a febrile walking-pneumonia course in a young patient.' },
    ],
    discriminator: 'Atypical pneumonia is a subacute dry cough with diffuse interstitial infiltrates and symptoms out of proportion to exam ("walking pneumonia"), unlike the abrupt lobar consolidation of typical pneumococcal disease.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Metlay et al., ATS/IDSA Community-Acquired Pneumonia Guideline', year: 2019 }],
  },

  /* ── Sarcoidosis ──────────────────────────────────────────────── */
  {
    itemId: 'sarcoid-nx', version: 1, type: 'next_step', conceptId: 'sarcoidosis', presentation: 'classic',
    stem: 'A patient with bilateral hilar lymphadenopathy and suspected sarcoidosis needs confirmation. What does a diagnostic biopsy characteristically show?',
    vitals: [],
    findings: ['Bilateral hilar adenopathy with possible extrapulmonary involvement.'],
    options: [
      { id: 'a', text: 'Non-caseating granulomas', correct: true },
      { id: 'b', text: 'Caseating (necrotizing) granulomas', whyNot: 'Caseating granulomas suggest tuberculosis or fungal disease, not sarcoidosis.' },
      { id: 'c', text: 'Malignant cells', whyNot: 'Lymphoma/carcinoma would show malignant cells; sarcoidosis shows benign non-caseating granulomas.' },
      { id: 'd', text: 'Eosinophilic microabscesses', whyNot: 'That pattern is not the granulomatous histology of sarcoidosis.' },
    ],
    discriminator: 'Sarcoidosis is confirmed by non-caseating granulomas on biopsy after excluding infection (TB/fungal caseation) and malignancy — a diagnosis of exclusion.',
    tags: { system: 'pulmonary', complaint: 'lymphadenopathy', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Crouser et al., ATS Clinical Practice Guideline: Diagnosis and Detection of Sarcoidosis', year: 2020 }],
  },

  /* ── Spontaneous pneumothorax (management by size) ────────────── */
  {
    itemId: 'spontptx-tx', version: 1, type: 'tx_threshold', conceptId: 'spont-ptx', presentation: 'classic',
    stem: 'A tall young man has a SMALL primary spontaneous pneumothorax and is comfortable with normal vitals. What is the appropriate management?',
    vitals: [v('SpO₂', '97%', false)],
    findings: ['Small pneumothorax, minimal symptoms, hemodynamically stable.'],
    options: [
      { id: 'a', text: 'Supplemental oxygen and observation (with repeat imaging)', correct: true },
      { id: 'b', text: 'Immediate chest tube for all pneumothoraces', whyNot: 'A small, minimally symptomatic primary pneumothorax can be observed with oxygen; tube thoracostomy is for large or symptomatic ones.' },
      { id: 'c', text: 'Emergent needle decompression', whyNot: 'Needle decompression is for TENSION pneumothorax with hemodynamic compromise, not a stable small one.' },
      { id: 'd', text: 'Pleurodesis at first presentation for everyone', whyNot: 'Pleurodesis is considered for recurrence or persistent leak, not routinely at a first small pneumothorax.' },
    ],
    discriminator: 'A small, minimally symptomatic primary spontaneous pneumothorax is managed with oxygen and observation, whereas large or symptomatic ones need aspiration or a chest tube — and tension physiology needs immediate decompression.',
    tags: { system: 'pulmonary', complaint: 'chest pain', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['tension-ptx'],
    source: [{ ref: 'BTS Pleural Disease Guideline', year: 2010 }],
  },

  /* ── ARDS (adjuncts) ──────────────────────────────────────────── */
  {
    itemId: 'ards-nx', version: 1, type: 'tx_next_step', conceptId: 'ards', presentation: 'severe',
    stem: 'A patient with severe ARDS (P/F ratio 90) remains hypoxemic despite lung-protective ventilation and adequate PEEP. Which intervention improves outcomes in severe ARDS?',
    vitals: [v('P/F', '90', true)],
    findings: ['Refractory hypoxemia on optimized ventilator settings.'],
    options: [
      { id: 'a', text: 'Prone positioning', correct: true },
      { id: 'b', text: 'Routine high tidal volumes to improve oxygenation', whyNot: 'High tidal volumes cause ventilator-induced lung injury and raise mortality; lung-protective volumes are maintained.' },
      { id: 'c', text: 'Liberal fluid administration', whyNot: 'A conservative fluid strategy is favored in ARDS; liberal fluids worsen oxygenation.' },
      { id: 'd', text: 'Routine inhaled nitric oxide for all', whyNot: 'Inhaled nitric oxide improves oxygenation transiently but does not improve survival and is not routine.' },
    ],
    discriminator: 'In severe ARDS with refractory hypoxemia, prone positioning improves survival, complementing lung-protective ventilation and a conservative fluid strategy.',
    tags: { system: 'pulmonary', complaint: 'respiratory failure', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Guérin et al., Prone Positioning in Severe ARDS (PROSEVA, NEJM)', year: 2013 }],
  },
];

export const PULM_DEPTH: ContentModule = {
  concepts: [],
  subtopics: {},
  items,
};
