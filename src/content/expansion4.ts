/* ══════════════════════════════════════════════════════════════
   Content expansion #4 — DEPTH, not breadth.

   Every item here is a SECOND (or third) presentation of a concept
   that already exists in the bank. The point: a diagnosis should be
   drilled through several different patients and reasoning paths, not
   one memorized vignette. Each pairs with the concept's existing
   `classic` item by taking a different `presentation` and, where it
   teaches something new, a different item `type` (a management
   threshold, a mimic to separate, the other side of a discriminator).

   No new concepts or subtopics — this module only adds `items`.

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   clinical-evidence source. Commercial board-prep is coverage-only,
   never copied or cited. Synthetic patients only; content is drafted
   and enters the multi-reviewer pipeline (docs/REVIEW.md) UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import { v, type ContentModule, type RawItem } from './authoring';

const items: RawItem[] = [
  /* ── Endocrine ──────────────────────────────────────────────── */

  // DKA #2 — the potassium trap: severe presentation, a threshold rule
  // that complements "fluids first" (item 1).
  {
    itemId: 'dka-firststep-2', version: 1, type: 'tx_threshold', conceptId: 'dka-firststep',
    presentation: 'severe',
    stem: 'A 24-year-old in DKA has had a litre of saline. Glucose 512, pH 7.06. The initial potassium returns at 3.1 mmol/L. What must happen before the insulin infusion is started?',
    vitals: [v('K', '3.1', true), v('pH', '7.06', true), v('Glucose', '512', true)],
    findings: ['Total-body potassium is depleted even when the serum value looks normal or high.'],
    options: [
      { id: 'a', text: 'Replace potassium and hold insulin until K ≥ 3.3 mmol/L', correct: true },
      { id: 'b', text: 'Start the insulin drip immediately at full dose', whyNot: 'Insulin drives potassium into cells; with K already 3.1 that can precipitate fatal hypokalemia and arrhythmia.' },
      { id: 'c', text: 'Give IV sodium bicarbonate', whyNot: 'Bicarbonate is not indicated at this pH and would worsen hypokalemia by shifting potassium intracellularly.' },
      { id: 'd', text: 'Give a bolus of 50% dextrose', whyNot: 'Glucose is 512; dextrose is added later when glucose falls to ~200, not now.' },
    ],
    discriminator: 'In DKA, insulin is withheld until potassium is at least 3.3 mmol/L — insulin shifts K into cells and a low-normal serum value already signals severe total-body depletion.',
    teachingPoint: 'Order after fluids is: check K, then insulin only if K ≥ 3.3; replace K if lower.',
    tags: { system: 'endocrine', complaint: 'metabolic emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'ADA Standards of Care in Diabetes — Hyperglycemic Crises', year: 2023 },
      { ref: 'Kitabchi et al., Hyperglycemic Crises in Adult Patients With Diabetes (ADA consensus)', year: 2009 },
    ],
  },

  // Thyroid storm #2 — separating it from its mimics.
  {
    itemId: 'thyroid-storm-2', version: 1, type: 'discriminator', conceptId: 'thyroid-storm',
    presentation: 'mimic',
    stem: 'An agitated, febrile patient with atrial fibrillation and a temperature of 40.1 °C is being treated as sepsis, but cultures are negative and there is a goiter with a tremor. What best separates thyroid storm from severe sepsis here?',
    vitals: [v('Temp', '40.1', true), v('HR', '148 (AF)', true)],
    findings: ['Recent poorly-controlled hyperthyroidism; an acute illness as the precipitant.'],
    options: [
      { id: 'a', text: 'Disproportionate CNS, cardiac and thermoregulatory dysfunction in a known thyrotoxic patient', correct: true },
      { id: 'b', text: 'The presence of fever alone', whyNot: 'Fever is common to both; it does not discriminate. The pattern and thyrotoxic context do.' },
      { id: 'c', text: 'A raised white cell count', whyNot: 'Leukocytosis is nonspecific and occurs in storm as well as sepsis.' },
      { id: 'd', text: 'Atrial fibrillation by itself', whyNot: 'AF has many causes; here it is one feature of thyrotoxicosis, not the discriminator.' },
    ],
    discriminator: 'Thyroid storm is a clinical diagnosis — exaggerated fever, tachyarrhythmia and altered mentation out of proportion to a precipitating illness in a thyrotoxic patient — not a lab cut-off.',
    tags: { system: 'endocrine', complaint: 'thyroid emergency', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'ATA Guidelines for Diagnosis and Management of Hyperthyroidism', year: 2016 },
      { ref: 'Burch & Wartofsky, Life-threatening thyrotoxicosis (thyroid storm scoring)', year: 1993 },
    ],
  },

  // Adrenal crisis #2 — masked as pressor-refractory shock after
  // abrupt steroid withdrawal (secondary AI).
  {
    itemId: 'adrenal-crisis-2', version: 1, type: 'tx_next_step', conceptId: 'adrenal-crisis',
    presentation: 'masked',
    stem: 'A patient on chronic prednisone for polymyalgia stopped it a week ago and now presents with hypotension that has not responded to 3 L of fluids and rising norepinephrine. What is the key next step?',
    vitals: [v('BP', '78/44', true), v('HR', '118', true)],
    findings: ['Blood pressure refractory to fluids and vasopressors; recent abrupt glucocorticoid withdrawal.'],
    options: [
      { id: 'a', text: 'IV hydrocortisone (stress-dose glucocorticoid)', correct: true },
      { id: 'b', text: 'Add a second vasopressor and continue fluids', whyNot: 'Catecholamine-refractory shock after steroid withdrawal is the clue that cortisol is the missing factor; pressors alone will not fix it.' },
      { id: 'c', text: 'Broad-spectrum antibiotics only', whyNot: 'Sepsis should be covered, but the pressor-refractory pattern after steroid withdrawal points to adrenal insufficiency needing steroids now.' },
      { id: 'd', text: 'Fludrocortisone', whyNot: 'Mineralocorticoid replacement is not the emergency drug; IV hydrocortisone provides the needed glucocorticoid effect acutely.' },
    ],
    discriminator: 'Fluid- and pressor-refractory shock after abrupt steroid withdrawal is adrenal crisis until proven otherwise — give stress-dose IV hydrocortisone without waiting for cortisol results.',
    tags: { system: 'endocrine', complaint: 'shock', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 },
    ],
  },

  // Hypothyroidism #2 — myxedema coma, the severe end.
  {
    itemId: 'hypothyroid-2', version: 1, type: 'tx_next_step', conceptId: 'hypothyroid',
    presentation: 'severe',
    stem: 'An elderly woman is brought in during winter obtunded, with a temperature of 34.2 °C, bradycardia, hyponatremia and non-pitting periorbital edema. What is the correct treatment?',
    vitals: [v('Temp', '34.2', true), v('HR', '46', true), v('Na', '124', true)],
    findings: ['Long-standing untreated hypothyroidism; hypothermia and hypoventilation.'],
    options: [
      { id: 'a', text: 'IV levothyroxine plus IV hydrocortisone', correct: true },
      { id: 'b', text: 'IV levothyroxine alone', whyNot: 'Give hydrocortisone with thyroid hormone until coexisting adrenal insufficiency is excluded — thyroxine alone can precipitate adrenal crisis.' },
      { id: 'c', text: 'Aggressive external rewarming and fluids only', whyNot: 'Supportive care alone misses the cause; myxedema coma needs thyroid hormone replacement.' },
      { id: 'd', text: 'Oral levothyroxine once alert', whyNot: 'This is an emergency with unreliable gut absorption; treatment is IV and immediate, not deferred.' },
    ],
    discriminator: 'Myxedema coma — hypothermia, hypoventilation, hyponatremia and altered mentation in profound hypothyroidism — is treated with IV thyroid hormone plus stress-dose hydrocortisone until adrenal insufficiency is ruled out.',
    tags: { system: 'endocrine', complaint: 'altered mental status', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'ATA Guidelines for Treatment of Hypothyroidism', year: 2014 },
    ],
  },

  // Cushing #2 — the workup sequence (confirm, then localize).
  {
    itemId: 'cushing-2', version: 1, type: 'next_step', conceptId: 'cushing',
    presentation: 'atypical',
    stem: 'A patient has central obesity, wide violaceous striae, proximal weakness and new hypertension and glucose intolerance. What is the best initial step to confirm hypercortisolism?',
    vitals: [v('BP', '158/96', true)],
    findings: ['Clinical features suggest Cushing syndrome; the diagnosis is not yet biochemically confirmed.'],
    options: [
      { id: 'a', text: 'A screening test for cortisol excess (late-night salivary cortisol, 24-h urinary free cortisol, or low-dose dexamethasone suppression)', correct: true },
      { id: 'b', text: 'A pituitary MRI', whyNot: 'Imaging comes after biochemical confirmation and ACTH-based localization; incidental pituitary lesions are common and would mislead.' },
      { id: 'c', text: 'Measure ACTH first', whyNot: 'ACTH is used to localize the source only after hypercortisolism is confirmed, not as the initial screen.' },
      { id: 'd', text: 'Start ketoconazole empirically', whyNot: 'Treatment before confirming and localizing the cause is inappropriate.' },
    ],
    discriminator: 'Cushing work-up is sequential: first confirm cortisol excess with a screening test, then measure ACTH to localize — imaging only after the biochemistry points somewhere.',
    tags: { system: 'endocrine', complaint: 'weight gain', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Endocrine Society Clinical Practice Guideline: Diagnosis of Cushing Syndrome', year: 2008 },
    ],
  },

  // Addison #2 — primary vs secondary, the discriminating features.
  {
    itemId: 'addison-2', version: 1, type: 'discriminator', conceptId: 'addison',
    presentation: 'atypical',
    stem: 'Two patients both have adrenal insufficiency. Which feature tells you the problem is PRIMARY (adrenal) rather than secondary (pituitary)?',
    vitals: [],
    findings: ['One has skin hyperpigmentation and hyperkalemia; the other does not.'],
    options: [
      { id: 'a', text: 'Hyperpigmentation and hyperkalemia', correct: true },
      { id: 'b', text: 'Fatigue and weight loss', whyNot: 'These are common to both primary and secondary insufficiency and do not localize the lesion.' },
      { id: 'c', text: 'Low morning cortisol', whyNot: 'Cortisol is low in both; it confirms insufficiency but not the level of the defect.' },
      { id: 'd', text: 'Postural dizziness', whyNot: 'Orthostasis occurs in both, though it is often more pronounced in primary disease; by itself it is not the discriminator.' },
    ],
    discriminator: 'Hyperpigmentation (high ACTH/POMC) and hyperkalemia (aldosterone loss) are unique to PRIMARY adrenal failure — secondary disease spares the mineralocorticoid axis and does not raise ACTH.',
    tags: { system: 'endocrine', complaint: 'fatigue', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 },
    ],
  },

  /* ── Pulmonary ──────────────────────────────────────────────── */

  // Spontaneous pneumothorax #2 — the tension emergency (don't image).
  {
    itemId: 'spont-ptx-2', version: 1, type: 'next_step', conceptId: 'spont-ptx',
    presentation: 'severe',
    stem: 'A tall young man collapses with sudden dyspnea. He is hypotensive with absent breath sounds and a hyper-resonant left chest, distended neck veins and a trachea deviated to the right. What is the immediate next step?',
    vitals: [v('BP', '82/50', true), v('SpO₂', '84%', true), v('HR', '134', true)],
    findings: ['Tracheal deviation away from the affected side with hemodynamic compromise.'],
    options: [
      { id: 'a', text: 'Immediate needle decompression / finger thoracostomy', correct: true },
      { id: 'b', text: 'Get a portable chest X-ray first', whyNot: 'Tension pneumothorax is a clinical diagnosis; waiting for imaging in a compromised patient can be fatal.' },
      { id: 'c', text: 'CT chest', whyNot: 'CT delays life-saving decompression and requires moving an unstable patient.' },
      { id: 'd', text: 'High-flow oxygen and observe', whyNot: 'Oxygen helps but does not relieve the tension physiology causing obstructive shock.' },
    ],
    discriminator: 'Tension pneumothorax — hypotension, distended neck veins, tracheal deviation and a silent hyper-resonant chest — is decompressed on clinical grounds immediately, before any imaging.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['em', 'surg'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'BTS Pleural Disease Guideline', year: 2010 },
      { ref: 'ATLS (American College of Surgeons) — tension pneumothorax', year: 2018 },
    ],
  },

  // ARDS #2 — lung-protective ventilation threshold.
  {
    itemId: 'ards-2', version: 1, type: 'tx_threshold', conceptId: 'ards',
    presentation: 'severe',
    stem: 'A patient with ARDS from pancreatitis is intubated. Which ventilator strategy reduces mortality?',
    vitals: [v('P/F', '110', true)],
    findings: ['Bilateral infiltrates with a P/F ratio of 110 and no evidence of cardiogenic edema.'],
    options: [
      { id: 'a', text: 'Low tidal volume ~6 mL/kg predicted body weight, plateau pressure < 30 cmH₂O', correct: true },
      { id: 'b', text: 'High tidal volume ~12 mL/kg to normalize the pH', whyNot: 'High tidal volumes cause ventilator-induced lung injury and increase mortality in ARDS.' },
      { id: 'c', text: 'Minimize PEEP to avoid barotrauma', whyNot: 'Adequate PEEP recruits collapsed alveoli; very low PEEP worsens oxygenation and atelectrauma.' },
      { id: 'd', text: 'Routine high-dose corticosteroids for everyone', whyNot: 'Steroids are not a universal ARDS therapy; lung-protective ventilation is the intervention with a proven mortality benefit.' },
    ],
    discriminator: 'Lung-protective ventilation — ~6 mL/kg predicted body weight with plateau pressure under 30 cmH₂O — is the ARDS intervention shown to lower mortality (ARDSNet), permitting mild hypercapnia.',
    tags: { system: 'pulmonary', complaint: 'respiratory failure', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'ARDS Network — Lower Tidal Volumes for ARDS (NEJM)', year: 2000 },
      { ref: 'ATS/ESICM/SCCM Clinical Practice Guideline: Mechanical Ventilation in ARDS', year: 2017 },
    ],
  },

  // Sarcoidosis #2 — Löfgren syndrome, the acute good-prognosis form.
  {
    itemId: 'sarcoidosis-2', version: 1, type: 'association', conceptId: 'sarcoidosis',
    presentation: 'atypical',
    stem: 'A young woman has acute onset of tender red nodules on both shins, painful swollen ankles, fever, and bilateral hilar lymphadenopathy on chest X-ray.',
    vitals: [], findings: [],
    options: [
      { id: 'a', text: 'Löfgren syndrome (acute sarcoidosis)', correct: true },
      { id: 'b', text: 'Reactive arthritis', whyNot: 'Reactive arthritis follows GU/GI infection with urethritis and conjunctivitis, not erythema nodosum with bilateral hilar adenopathy.' },
      { id: 'c', text: 'Lymphoma', whyNot: 'Lymphoma does not produce the erythema-nodosum-plus-ankle-arthritis-plus-hilar-adenopathy triad of Löfgren syndrome.' },
      { id: 'd', text: 'Tuberculosis', whyNot: 'TB can cause erythema nodosum but the acute triad with symmetric hilar adenopathy and a good prognosis is classic Löfgren sarcoidosis.' },
    ],
    discriminator: 'Erythema nodosum, ankle arthritis/periarthritis and bilateral hilar adenopathy is Löfgren syndrome — an acute sarcoidosis presentation with a favorable, often self-limited course.',
    tags: { system: 'pulmonary', complaint: 'buzzword', rotation: ['im'], level: 'both', boards: ['step1', 'step2'] },
    difficultySeed: 0.55,
    source: [
      { ref: 'ATS/ERS/WASOG Statement on Sarcoidosis', year: 2020 },
    ],
  },

  // IPF #2 — the treatment contrast (antifibrotics, not steroids).
  {
    itemId: 'ipf-2', version: 1, type: 'tx_contraindication', conceptId: 'ipf',
    presentation: 'atypical',
    stem: 'A man with biopsy-confirmed usual interstitial pneumonia (IPF) is progressing. Which management choice is INAPPROPRIATE?',
    vitals: [],
    findings: ['Definite UIP pattern on high-resolution CT with honeycombing.'],
    options: [
      { id: 'a', text: 'Long-term high-dose prednisone/azathioprine immunosuppression', correct: true },
      { id: 'b', text: 'An antifibrotic (pirfenidone or nintedanib)', whyNot: 'Antifibrotics slow the decline in FVC and are standard disease-modifying therapy in IPF.' },
      { id: 'c', text: 'Referral for lung transplant evaluation', whyNot: 'Transplant referral is appropriate for progressive IPF and can be life-extending.' },
      { id: 'd', text: 'Supplemental oxygen for resting hypoxemia and pulmonary rehab', whyNot: 'Oxygen and rehab are appropriate supportive measures in IPF.' },
    ],
    discriminator: 'Unlike many interstitial pneumonias, IPF is not steroid-responsive — the PANTHER trial showed prednisone/azathioprine/NAC increased harm; treat with antifibrotics and transplant referral.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'ATS/ERS/JRS/ALAT Clinical Practice Guideline: Idiopathic Pulmonary Fibrosis', year: 2022 },
      { ref: 'PANTHER-IPF (NHLBI) — Prednisone/Azathioprine/NAC in IPF (NEJM)', year: 2012 },
    ],
  },

  /* ── Renal ──────────────────────────────────────────────────── */

  // Prerenal AKI #2 — the prerenal side (FENa/urine indices).
  {
    itemId: 'prerenal-atn-2', version: 1, type: 'discriminator', conceptId: 'prerenal-vs-atn',
    presentation: 'atypical',
    stem: 'An AKI patient after several days of vomiting has a BUN:creatinine ratio of 28:1, a fractional excretion of sodium under 1%, and bland urine that improves after a fluid challenge. Which does this indicate?',
    vitals: [v('BP', '96/60', true)],
    findings: ['FENa < 1%, high urine osmolality, bland sediment, responsive to volume.'],
    options: [
      { id: 'a', text: 'Prerenal azotemia', correct: true },
      { id: 'b', text: 'Acute tubular necrosis', whyNot: 'ATN gives FENa > 2%, muddy-brown granular casts and no response to fluids — the opposite indices.' },
      { id: 'c', text: 'Postrenal obstruction', whyNot: 'Obstruction is diagnosed by a distended bladder or hydronephrosis on ultrasound, not by a low FENa.' },
      { id: 'd', text: 'Acute interstitial nephritis', whyNot: 'AIN typically shows white cells/eosinophils and mild proteinuria with a drug trigger, not a low FENa that corrects with volume.' },
    ],
    discriminator: 'Prerenal AKI concentrates avidly — FENa < 1%, BUN:Cr > 20, high urine osmolality and a bland sediment that responds to fluids — whereas ATN loses that ability (FENa > 2%, muddy-brown casts).',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 },
    ],
  },

  // Hyperkalemia #2 — stabilize ≠ lower; the sequencing after calcium.
  {
    itemId: 'hyperk-2', version: 1, type: 'tx_sequencing', conceptId: 'hyperk-first',
    presentation: 'severe',
    stem: 'A patient with K 7.2 and peaked T waves has just received IV calcium gluconate and the ECG improves. What is true about the next step?',
    vitals: [v('K', '7.2', true)],
    findings: ['Membrane stabilized by calcium, but the serum potassium is unchanged.'],
    options: [
      { id: 'a', text: 'Calcium protects the myocardium but does not lower potassium — shift it (insulin+glucose ± albuterol) and remove it (dialysis, diuresis, or a K-binder)', correct: true },
      { id: 'b', text: 'Calcium has corrected the potassium; no further treatment is needed', whyNot: 'Calcium stabilizes the membrane for minutes but does not change the serum potassium at all.' },
      { id: 'c', text: 'Give more calcium until the potassium normalizes', whyNot: 'Additional calcium does not lower potassium; it only re-stabilizes the membrane transiently.' },
      { id: 'd', text: 'Sodium bicarbonate is the definitive way to remove potassium', whyNot: 'Bicarbonate has a weak, unreliable shifting effect and does not remove potassium from the body.' },
    ],
    discriminator: 'Calcium stabilizes the cardiac membrane within minutes but does not lower potassium — you still must shift it intracellularly and then remove it from the body definitively.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'KDIGO Controversies Conference on Potassium Management', year: 2020 },
      { ref: 'European Resuscitation Council Guidelines — Cardiac Arrest in Special Circumstances (hyperkalaemia)', year: 2021 },
    ],
  },
];

export const EXPANSION4: ContentModule = {
  concepts: [],
  subtopics: {},
  items,
};
