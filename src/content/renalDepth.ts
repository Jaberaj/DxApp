/* ══════════════════════════════════════════════════════════════
   Renal & GU — in-depth pour.

   Renal was the thinnest of the flagship systems: electrolytes were
   one potassium concept, and the glomerular subtopic had almost no
   named diseases. This module fills that in with the high-yield renal
   spine — the sodium/water disorders, the acid-base approach, the
   named glomerulonephritides, rhabdomyolysis, cystic disease, stone
   chemistry, and the dialysis-threshold rule — each concept drilled
   from several angles (recognise it, separate it from its mimic, the
   next step, the treatment threshold).

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   clinical-evidence source (KDIGO, ADA/AASLD/AUA guidelines, agency
   guidance, or primary literature). Commercial board-prep is used
   only to see which diseases are commonly tested — never copied,
   scraped, or cited. All patients are synthetic. Content enters the
   multi-reviewer pipeline (docs/REVIEW.md) drafted and UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'siadh', name: 'SIADH & the euvolemic hyponatremias', system: 'renal', topic: 'Sodium & water',
    illnessScript: {
      epidemiology: 'Small-cell lung cancer, CNS disease, pulmonary disease, and drugs (SSRIs, carbamazepine, cyclophosphamide) in adults.',
      timeCourse: 'Develops over days; symptoms track how fast sodium fell more than the absolute value.',
      keyFindings: ['Euvolemic hypotonic hyponatremia', 'Urine osm > 100 mOsm/kg (inappropriately concentrated)', 'Urine Na > 30 mmol/L', 'Normal thyroid & adrenal function'],
      classicDistractors: ['Hypovolemic hyponatremia (urine Na < 20)', 'Psychogenic polydipsia (urine osm < 100)', 'Hypothyroidism / adrenal insufficiency'],
    },
  },
  {
    conceptId: 'diabetes-insipidus', name: 'Diabetes insipidus (central vs nephrogenic)', system: 'renal', topic: 'Sodium & water',
    illnessScript: {
      epidemiology: 'Central: pituitary surgery, trauma, tumor. Nephrogenic: lithium, chronic hypercalcemia, hereditary.',
      timeCourse: 'Polyuria and polydipsia; hypernatremia only when access to water is limited.',
      keyFindings: ['Large volumes of dilute urine (urine osm < 300)', 'Hypernatremia if water intake restricted', 'Response to desmopressin separates the two forms'],
      classicDistractors: ['Primary polydipsia', 'Osmotic (glucose) diuresis'],
    },
  },
  {
    conceptId: 'hypokalemia', name: 'Hypokalemia & the magnesium link', system: 'renal', topic: 'Potassium',
    illnessScript: {
      epidemiology: 'Diuretics, vomiting/diarrhea, hyperaldosteronism, and refeeding; often with concurrent hypomagnesemia.',
      timeCourse: 'Weakness, cramps, and arrhythmia risk; refractory to replacement until magnesium is corrected.',
      keyFindings: ['Muscle weakness, ileus', 'ECG: U waves, flattened T, long QT', 'Will not correct if Mg is low'],
      classicDistractors: ['Hyperkalemia (peaked T waves)', 'Hypocalcemia'],
    },
  },
  {
    conceptId: 'metabolic-alkalosis', name: 'Metabolic alkalosis (saline responsive vs resistant)', system: 'renal', topic: 'Acid–base',
    illnessScript: {
      epidemiology: 'Vomiting/NG suction and diuretics (responsive); hyperaldosteronism and Bartter/Gitelman (resistant).',
      timeCourse: 'Maintained by volume depletion or mineralocorticoid excess even after the trigger stops.',
      keyFindings: ['High HCO₃⁻ with high pH', 'Urine chloride separates the two classes', 'Often with hypokalemia'],
      classicDistractors: ['Respiratory alkalosis', 'Contraction alkalosis alone'],
    },
  },
  {
    conceptId: 'acid-base-compensation', name: 'Acid–base: reading compensation', system: 'renal', topic: 'Acid–base',
    illnessScript: {
      epidemiology: 'Any critically ill or vomiting/hyperventilating patient; the skill is spotting a second, hidden disorder.',
      timeCourse: 'Compensation is bounded and predictable; values outside the expected range mean a mixed disorder.',
      keyFindings: ['Winter’s formula predicts pCO₂ in metabolic acidosis', 'Delta-gap flags a coexisting non-gap acidosis or metabolic alkalosis'],
      classicDistractors: ['Assuming a single primary disorder', 'Calling overcorrection "compensation"'],
    },
  },
  {
    conceptId: 'minimal-change-disease', name: 'Minimal change disease', system: 'renal', topic: 'Nephrotic syndrome',
    illnessScript: {
      epidemiology: 'Most common nephrotic syndrome in children; can follow infection/immunization or Hodgkin lymphoma in adults.',
      timeCourse: 'Abrupt edema; typically steroid-responsive with a good prognosis.',
      keyFindings: ['Selective heavy proteinuria', 'Normal light microscopy', 'Podocyte foot-process effacement on EM'],
      classicDistractors: ['FSGS (segmental sclerosis, steroid-resistant)', 'Membranous nephropathy (adults)'],
    },
  },
  {
    conceptId: 'membranous-nephropathy', name: 'Membranous nephropathy', system: 'renal', topic: 'Nephrotic syndrome',
    illnessScript: {
      epidemiology: 'A leading cause of primary nephrotic syndrome in white adults; secondary to solid tumors, hepatitis B, SLE, and drugs.',
      timeCourse: 'Insidious nephrotic syndrome with the highest thrombotic (renal vein) risk of the nephrotic diseases.',
      keyFindings: ['Anti-PLA2R antibodies in primary disease', 'Subepithelial deposits, "spike and dome" on EM', 'Renal vein thrombosis risk'],
      classicDistractors: ['Minimal change disease (children)', 'Diabetic nephropathy'],
    },
  },
  {
    conceptId: 'iga-nephropathy', name: 'IgA nephropathy', system: 'renal', topic: 'Nephritic syndrome',
    illnessScript: {
      epidemiology: 'The most common primary glomerulonephritis worldwide; young adults.',
      timeCourse: 'Gross hematuria within 1–2 days of a mucosal (usually URI) infection — "synpharyngitic."',
      keyFindings: ['Recurrent gross hematuria with URI', 'Mesangial IgA deposits', 'Normal serum complement'],
      classicDistractors: ['Post-streptococcal GN (latent period, low C3)', 'Thin basement membrane disease'],
    },
  },
  {
    conceptId: 'psgn', name: 'Post-streptococcal glomerulonephritis', system: 'renal', topic: 'Nephritic syndrome',
    illnessScript: {
      epidemiology: 'Children 1–3 weeks after group A strep pharyngitis or impetigo.',
      timeCourse: 'Latent period then abrupt nephritic syndrome; usually self-limited in children.',
      keyFindings: ['Cola-colored urine, edema, hypertension', 'Low C3, elevated anti-DNase B / ASO', 'Subepithelial "humps" on EM'],
      classicDistractors: ['IgA nephropathy (concurrent, no latent period, normal C3)', 'Rapidly progressive GN'],
    },
  },
  {
    conceptId: 'diabetic-nephropathy', name: 'Diabetic nephropathy', system: 'renal', topic: 'Glomerular — chronic',
    illnessScript: {
      epidemiology: 'The single leading cause of end-stage renal disease; years after diabetes onset.',
      timeCourse: 'Hyperfiltration → moderately increased albuminuria → overt proteinuria → falling GFR.',
      keyFindings: ['Albuminuria', 'Kimmelstiel–Wilson nodules', 'Concurrent retinopathy'],
      classicDistractors: ['Hypertensive nephrosclerosis', 'Membranous nephropathy'],
    },
  },
  {
    conceptId: 'rhabdomyolysis', name: 'Rhabdomyolysis', system: 'renal', topic: 'Acute kidney injury',
    illnessScript: {
      epidemiology: 'Crush injury, prolonged immobilization/"found down," extreme exertion, statins, and seizures.',
      timeCourse: 'Muscle injury releases myoglobin, causing pigment-induced AKI over hours to a day.',
      keyFindings: ['CK many times the upper limit', 'Tea-colored urine, dipstick heme-positive with no RBCs', 'Hyperkalemia, hyperphosphatemia, hypocalcemia'],
      classicDistractors: ['Hematuria (RBCs present)', 'Hemolysis (hemoglobinuria)'],
    },
  },
  {
    conceptId: 'contrast-induced-aki', name: 'Contrast-associated AKI', system: 'renal', topic: 'Acute kidney injury',
    illnessScript: {
      epidemiology: 'Pre-existing CKD, diabetes, and volume depletion after iodinated contrast.',
      timeCourse: 'Creatinine rises 48–72 h after exposure and usually recovers within 1–2 weeks.',
      keyFindings: ['Cr rise 48–72 h post-contrast', 'Often non-oliguric', 'Prevented mainly by IV isotonic fluids'],
      classicDistractors: ['Cholesterol embolization (delayed, eosinophilia, livedo)', 'ATN from another insult'],
    },
  },
  {
    conceptId: 'adpkd', name: 'Autosomal dominant polycystic kidney disease', system: 'renal', topic: 'Cystic disease',
    illnessScript: {
      epidemiology: 'PKD1/PKD2 mutations; family history; presents in adulthood.',
      timeCourse: 'Progressive cyst growth with hypertension, then declining GFR over decades.',
      keyFindings: ['Bilateral flank masses, hematuria, hypertension', 'Hepatic cysts, mitral valve prolapse', 'Berry (saccular) aneurysms → subarachnoid hemorrhage'],
      classicDistractors: ['Autosomal recessive PKD (infants)', 'Simple renal cysts'],
    },
  },
  {
    conceptId: 'nephrolithiasis-types', name: 'Kidney stone chemistry', system: 'renal', topic: 'Stones',
    illnessScript: {
      epidemiology: 'Calcium oxalate is most common; uric acid with gout/acidic urine; struvite with urease-positive UTIs; cystine in children.',
      timeCourse: 'Colicky flank-to-groin pain; management and prevention depend on the stone type.',
      keyFindings: ['Calcium: radiopaque, envelope crystals', 'Uric acid: radiolucent, acidic urine', 'Struvite: staghorn, alkaline urine, Proteus', 'Cystine: hexagonal crystals'],
      classicDistractors: ['Papillary necrosis', 'Clot colic'],
    },
  },
  {
    conceptId: 'uremia-dialysis', name: 'Indications for urgent dialysis', system: 'renal', topic: 'CKD & renal replacement',
    illnessScript: {
      epidemiology: 'Severe AKI or ESRD with a life-threatening complication.',
      timeCourse: 'Emergent when a metabolic derangement is refractory to medical therapy.',
      keyFindings: ['A-E-I-O-U: Acidosis, Electrolytes (refractory K), Intoxications, Overload, Uremia'],
      classicDistractors: ['An isolated high creatinine number', 'Asymptomatic mild hyperkalemia'],
    },
  },
];

const subtopics: Record<string, string> = {
  'siadh': 'renal.electrolytes',
  'diabetes-insipidus': 'renal.electrolytes',
  'hypokalemia': 'renal.electrolytes',
  'metabolic-alkalosis': 'renal.acid-base',
  'acid-base-compensation': 'renal.acid-base',
  'minimal-change-disease': 'renal.glomerular',
  'membranous-nephropathy': 'renal.glomerular',
  'iga-nephropathy': 'renal.glomerular',
  'psgn': 'renal.glomerular',
  'diabetic-nephropathy': 'renal.glomerular',
  'rhabdomyolysis': 'renal.aki',
  'contrast-induced-aki': 'renal.aki',
  'adpkd': 'renal.tubulointerstitial',
  'nephrolithiasis-types': 'renal.stones-uti',
  'uremia-dialysis': 'renal.ckd',
};

const items: RawItem[] = [
  /* ── SIADH ────────────────────────────────────────────────────── */
  {
    itemId: 'siadh-1', version: 1, type: 'one_liner', conceptId: 'siadh', presentation: 'classic',
    stem: 'A 68-year-old smoker with weight loss has confusion. Na 116, serum osm 248, he is clinically euvolemic, urine osm 480 mOsm/kg and urine Na 62 mmol/L. Thyroid and morning cortisol are normal. What is the diagnosis?',
    vitals: [v('Na', '116', true), v('Serum osm', '248', true)],
    findings: ['Euvolemic; no edema and no orthostasis.', 'Chest imaging shows a hilar mass.'],
    options: [
      { id: 'a', text: 'Syndrome of inappropriate antidiuresis (SIADH)', correct: true },
      { id: 'b', text: 'Hypovolemic hyponatremia', whyNot: 'Hypovolemia gives clinical volume depletion and urine Na < 20; here the patient is euvolemic with urine Na 62.' },
      { id: 'c', text: 'Psychogenic polydipsia', whyNot: 'Water intoxication suppresses ADH, giving maximally dilute urine (osm < 100); this urine is concentrated at 480.' },
      { id: 'd', text: 'Hypothyroidism', whyNot: 'Thyroid function is normal, and hypothyroid hyponatremia is a diagnosis of exclusion here.' },
    ],
    discriminator: 'Euvolemic hypotonic hyponatremia with inappropriately concentrated urine (osm > 100) and urine Na > 30, with normal thyroid and adrenal function, is SIADH.',
    teachingPoint: 'A small-cell lung cancer is the classic ectopic-ADH source behind SIADH.',
    tags: { system: 'renal', complaint: 'hyponatremia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Spasovski et al., European Clinical Practice Guideline on Diagnosis and Treatment of Hyponatraemia (ESICM/ESE/ERA-EDTA)', year: 2014 },
      { ref: 'Verbalis et al., Diagnosis, Evaluation, and Treatment of Hyponatremia — Expert Panel Recommendations (Am J Med)', year: 2013 },
    ],
  },
  {
    itemId: 'siadh-2', version: 1, type: 'discriminator', conceptId: 'siadh', presentation: 'atypical',
    stem: 'Three euvolemic-appearing patients each have Na 124. Which single test best sorts SIADH from primary polydipsia and from a reset-osmostat picture?',
    vitals: [v('Na', '124', true)],
    findings: ['All have normal thyroid and adrenal testing.'],
    options: [
      { id: 'a', text: 'Urine osmolality (with urine sodium)', correct: true },
      { id: 'b', text: 'Serum sodium alone', whyNot: 'The sodium is the same in all three; it cannot separate the mechanisms.' },
      { id: 'c', text: 'Serum glucose', whyNot: 'Hyperglycemia causes translocational (not hypotonic) hyponatremia — worth excluding, but it does not distinguish these three.' },
      { id: 'd', text: 'Brain natriuretic peptide', whyNot: 'BNP reflects volume/cardiac status, not the ADH-driven urine concentration that defines SIADH.' },
    ],
    discriminator: 'Primary polydipsia dilutes the urine (osm < 100) because ADH is appropriately off, whereas SIADH keeps it inappropriately concentrated (osm > 100) — urine osmolality is the discriminating test.',
    tags: { system: 'renal', complaint: 'hyponatremia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Spasovski et al., European Hyponatraemia Guideline (ESICM/ESE/ERA-EDTA)', year: 2014 },
    ],
  },
  {
    itemId: 'siadh-3', version: 1, type: 'tx_threshold', conceptId: 'siadh', presentation: 'severe',
    stem: 'A patient with chronic SIADH has Na 112 but is alert with only mild nausea. Over the first 24 hours, by how much may the sodium safely rise?',
    vitals: [v('Na', '112', true)],
    findings: ['Sodium is known to have been low for several days (chronic).'],
    options: [
      { id: 'a', text: 'No more than about 6–8 mmol/L in 24 h', correct: true },
      { id: 'b', text: 'Straight back to 135 as fast as possible', whyNot: 'Overrapid correction of chronic hyponatremia causes osmotic demyelination (central pontine myelinolysis).' },
      { id: 'c', text: 'To 125 within the first 4 hours', whyNot: 'That is a ~13 mmol/L rise — far over the safe daily limit for chronic hyponatremia.' },
      { id: 'd', text: 'Rate does not matter as long as you stop at 135', whyNot: 'The rate is exactly what determines demyelination risk, independent of the endpoint.' },
    ],
    discriminator: 'Chronic hyponatremia must be corrected slowly — a rise of roughly 6–8 mmol/L per 24 h — because overrapid correction causes osmotic demyelination syndrome.',
    teachingPoint: 'Only a seizing or obtunded patient gets small 3% saline boluses, and even then the 24-h limit still applies.',
    tags: { system: 'renal', complaint: 'hyponatremia', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['central-pontine-myelinolysis'],
    source: [
      { ref: 'Spasovski et al., European Hyponatraemia Guideline (ESICM/ESE/ERA-EDTA)', year: 2014 },
      { ref: 'Sterns, Disorders of Plasma Sodium (NEJM review)', year: 2015 },
    ],
  },

  /* ── Diabetes insipidus ───────────────────────────────────────── */
  {
    itemId: 'di-1', version: 1, type: 'discriminator', conceptId: 'diabetes-insipidus', presentation: 'classic',
    stem: 'A patient passes 6 L of dilute urine daily. After supervised water deprivation the urine stays dilute; then desmopressin is given and urine osmolality rises by more than 50%. Which type of diabetes insipidus is this?',
    vitals: [v('Urine osm', '90 → 300', true)],
    findings: ['Serum sodium climbs during deprivation while urine stays inappropriately dilute — until desmopressin is given.'],
    options: [
      { id: 'a', text: 'Central diabetes insipidus', correct: true },
      { id: 'b', text: 'Nephrogenic diabetes insipidus', whyNot: 'In nephrogenic DI the kidney cannot respond to ADH, so desmopressin does NOT raise urine osmolality.' },
      { id: 'c', text: 'Primary polydipsia', whyNot: 'Primary polydipsia concentrates the urine with water deprivation alone, before any desmopressin is needed.' },
      { id: 'd', text: 'Osmotic diuresis', whyNot: 'Osmotic diuresis (e.g., glucosuria) produces a high urine osmolality from the solute itself, not free-water loss.' },
    ],
    discriminator: 'Central DI concentrates the urine after exogenous desmopressin (the hormone was missing); nephrogenic DI does not respond because the defect is renal ADH resistance.',
    tags: { system: 'renal', complaint: 'polyuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Christ-Crain et al., Diabetes insipidus (Nature Reviews Disease Primers)', year: 2019 },
    ],
  },
  {
    itemId: 'di-2', version: 1, type: 'tx_next_step', conceptId: 'diabetes-insipidus', presentation: 'atypical',
    stem: 'A patient on long-term lithium has polyuria and hypernatremia; desmopressin does not concentrate the urine. What is the best management?',
    vitals: [v('Na', '149', true)],
    findings: ['Urine remains dilute after desmopressin (nephrogenic pattern).'],
    options: [
      { id: 'a', text: 'Address the cause (reduce/stop lithium if possible), a low-salt/low-protein diet, and a thiazide ± amiloride', correct: true },
      { id: 'b', text: 'High-dose desmopressin', whyNot: 'Nephrogenic DI is ADH-resistant, so more desmopressin will not concentrate the urine.' },
      { id: 'c', text: 'Fluid restriction', whyNot: 'Restricting water in a patient losing free water will worsen the hypernatremia.' },
      { id: 'd', text: 'A loop diuretic', whyNot: 'Loops impair urinary concentration and worsen free-water loss; thiazides (paradoxically) reduce urine output in nephrogenic DI.' },
    ],
    discriminator: 'Nephrogenic DI is treated by removing the offending drug and lowering solute delivery with a low-salt/low-protein diet plus a thiazide — not with more ADH.',
    tags: { system: 'renal', complaint: 'polyuria', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Christ-Crain et al., Diabetes insipidus (Nature Reviews Disease Primers)', year: 2019 },
    ],
  },

  /* ── Hypokalemia ──────────────────────────────────────────────── */
  {
    itemId: 'hypok-1', version: 1, type: 'next_step', conceptId: 'hypokalemia', presentation: 'atypical',
    stem: 'A patient on a thiazide and a proton-pump inhibitor has K 2.8 that will not rise despite repeated potassium boluses. What is the key next step?',
    vitals: [v('K', '2.8', true), v('Mg', '1.1', true)],
    findings: ['Potassium keeps falling back down after each replacement dose.'],
    options: [
      { id: 'a', text: 'Replace magnesium', correct: true },
      { id: 'b', text: 'Give ever-larger potassium boluses', whyNot: 'With hypomagnesemia the kidney keeps wasting potassium; more KCl alone will not hold until Mg is repleted.' },
      { id: 'c', text: 'Start insulin and glucose', whyNot: 'That shifts potassium INTO cells and would deepen the hypokalemia — it is a hyperkalemia treatment.' },
      { id: 'd', text: 'Add a second potassium-wasting diuretic', whyNot: 'More diuresis worsens both the potassium and magnesium losses.' },
    ],
    discriminator: 'Hypokalemia that resists replacement is usually magnesium-dependent — low Mg drives renal potassium wasting, so potassium will not correct until magnesium is repleted.',
    tags: { system: 'renal', complaint: 'hypokalemia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Huang & Kuo, Mechanism of Hypokalemia in Magnesium Deficiency (JASN)', year: 2007 },
      { ref: 'Cohn et al., New Guidelines for Potassium Replacement in Clinical Practice (Arch Intern Med)', year: 2000 },
    ],
  },
  {
    itemId: 'hypok-2', version: 1, type: 'one_liner', conceptId: 'hypokalemia', presentation: 'classic',
    stem: 'A patient with weeks of vomiting has weakness and cramps. ECG shows flattened T waves with prominent U waves and a long QU interval. Which electrolyte abnormality fits best?',
    vitals: [v('HR', '96', false)],
    findings: ['Muscle weakness and a mild ileus.'],
    options: [
      { id: 'a', text: 'Hypokalemia', correct: true },
      { id: 'b', text: 'Hyperkalemia', whyNot: 'Hyperkalemia produces peaked T waves and widened QRS, not U waves.' },
      { id: 'c', text: 'Hypercalcemia', whyNot: 'Hypercalcemia shortens the QT; it does not cause U waves.' },
      { id: 'd', text: 'Hypocalcemia', whyNot: 'Hypocalcemia prolongs the QT via the ST segment but does not produce U waves.' },
    ],
    discriminator: 'U waves, flattened T waves and a long QU interval in a patient with GI losses point to hypokalemia — the mirror image of the peaked T waves of hyperkalemia.',
    tags: { system: 'renal', complaint: 'weakness', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['hyperk-first'],
    source: [
      { ref: 'Cohn et al., New Guidelines for Potassium Replacement in Clinical Practice (Arch Intern Med)', year: 2000 },
    ],
  },

  /* ── Metabolic alkalosis ──────────────────────────────────────── */
  {
    itemId: 'metalk-1', version: 1, type: 'discriminator', conceptId: 'metabolic-alkalosis', presentation: 'classic',
    stem: 'A patient with metabolic alkalosis (HCO₃⁻ 38, pH 7.52) has a urine chloride of 8 mmol/L. What does the low urine chloride tell you?',
    vitals: [v('HCO₃⁻', '38', true), v('pH', '7.52', true)],
    findings: ['History of protracted vomiting; the patient looks volume-depleted.'],
    options: [
      { id: 'a', text: 'It is saline (chloride) responsive — from vomiting/NG loss or prior diuretics', correct: true },
      { id: 'b', text: 'It is saline resistant, so give more chloride', whyNot: 'Saline-resistant causes have urine Cl > 20; a low urine Cl indicates the responsive, volume-depleted type.' },
      { id: 'c', text: 'The patient has primary hyperaldosteronism', whyNot: 'Mineralocorticoid excess is saline-resistant with urine Cl > 20 and usually hypertension, not a low urine Cl.' },
      { id: 'd', text: 'There is a respiratory cause', whyNot: 'The high bicarbonate with alkalemia is a primary metabolic alkalosis, not respiratory.' },
    ],
    discriminator: 'A urine chloride < 20 mmol/L marks saline-responsive metabolic alkalosis (vomiting, NG suction, remote diuretics) that corrects with volume/chloride repletion, versus > 20 for the saline-resistant mineralocorticoid causes.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 },
    ],
  },
  {
    itemId: 'metalk-2', version: 1, type: 'next_step', conceptId: 'metabolic-alkalosis', presentation: 'atypical',
    stem: 'A hypertensive patient has metabolic alkalosis with hypokalemia and no vomiting or diuretic use. What best clarifies the cause?',
    vitals: [v('BP', '168/104', true), v('K', '2.9', true)],
    findings: ['Urine chloride returns at 45 mmol/L (not low).'],
    options: [
      { id: 'a', text: 'Evaluate for mineralocorticoid excess (aldosterone/renin ratio)', correct: true },
      { id: 'b', text: 'Give a large saline bolus to correct it', whyNot: 'Saline-resistant alkalosis (urine Cl high, hypertension) does not correct with volume — and volume loading may worsen it.' },
      { id: 'c', text: 'Assume surreptitious vomiting', whyNot: 'Vomiting gives a LOW urine chloride and volume depletion, not hypertension with a high urine Cl.' },
      { id: 'd', text: 'Start acetazolamide empirically', whyNot: 'Treating before identifying mineralocorticoid excess misses a correctable, often surgical, cause.' },
    ],
    discriminator: 'Saline-resistant metabolic alkalosis (high urine chloride) with hypertension and hypokalemia points to mineralocorticoid excess — work it up with an aldosterone-to-renin ratio.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 },
      { ref: 'Funder et al., Management of Primary Aldosteronism (Endocrine Society Clinical Practice Guideline)', year: 2016 },
    ],
  },

  /* ── Acid-base compensation ───────────────────────────────────── */
  {
    itemId: 'abcomp-1', version: 1, type: 'next_step', conceptId: 'acid-base-compensation', presentation: 'classic',
    stem: 'A septic patient has pH 7.28, HCO₃⁻ 12, anion gap 24, and measured pCO₂ 34. Winter’s formula predicts a pCO₂ of ~26 (1.5×12 + 8). What does the higher-than-predicted pCO₂ mean?',
    vitals: [v('pH', '7.28', true), v('HCO₃⁻', '12', true), v('pCO₂', '34', true)],
    findings: ['High anion-gap metabolic acidosis is present.'],
    options: [
      { id: 'a', text: 'There is a superimposed respiratory acidosis (inadequate compensation)', correct: true },
      { id: 'b', text: 'This is appropriate respiratory compensation', whyNot: 'Appropriate compensation would bring pCO₂ near the predicted 26; 34 is significantly higher, so ventilation is inadequate.' },
      { id: 'c', text: 'It is a primary respiratory alkalosis', whyNot: 'A primary respiratory alkalosis would have a LOW pCO₂ with alkalemia; here pCO₂ is inappropriately high with acidemia.' },
      { id: 'd', text: 'The blood gas is drawn wrong', whyNot: 'The internal consistency (pH, HCO₃⁻, pCO₂) is coherent; the mismatch reflects a real second disorder, not an artifact.' },
    ],
    discriminator: 'When the measured pCO₂ exceeds Winter’s predicted value in a metabolic acidosis, respiratory compensation is inadequate and a second, respiratory acidosis is present.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [
      { ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 },
      { ref: 'Seifter, Integration of Acid–Base and Electrolyte Disorders (NEJM)', year: 2014 },
    ],
  },
  {
    itemId: 'abcomp-2', version: 1, type: 'discriminator', conceptId: 'acid-base-compensation', presentation: 'atypical',
    stem: 'A vomiting alcoholic has an anion gap of 22 (from ketoacidosis) but a HCO₃⁻ of 24 and pH 7.41. The delta-gap analysis shows bicarbonate is "too high" for the gap. What hidden disorder does this reveal?',
    vitals: [v('Anion gap', '22', true), v('HCO₃⁻', '24', false)],
    findings: ['On the surface the pH and bicarbonate look normal.'],
    options: [
      { id: 'a', text: 'A coexisting metabolic alkalosis (from vomiting)', correct: true },
      { id: 'b', text: 'A pure anion-gap acidosis only', whyNot: 'A pure gap acidosis would have dropped the bicarbonate roughly one-for-one with the gap; the preserved HCO₃⁻ signals a second process.' },
      { id: 'c', text: 'A non-anion-gap acidosis', whyNot: 'The elevated gap and the "excess" bicarbonate point to a concurrent alkalosis, not a normal-gap acidosis.' },
      { id: 'd', text: 'No acid-base disorder', whyNot: 'The wide anion gap already proves an acidosis exists despite the normal-looking pH.' },
    ],
    discriminator: 'The delta-gap (delta-delta) unmasks mixed disorders: a bicarbonate higher than the fall in the anion gap predicts reveals a concurrent metabolic alkalosis behind a normal-looking pH.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.62,
    source: [
      { ref: 'Seifter, Integration of Acid–Base and Electrolyte Disorders (NEJM)', year: 2014 },
    ],
  },

  /* ── Minimal change disease ───────────────────────────────────── */
  {
    itemId: 'mcd-1', version: 1, type: 'one_liner', conceptId: 'minimal-change-disease', presentation: 'classic',
    stem: 'A 5-year-old has sudden periorbital and leg edema. Urine shows 4+ protein with no blood; albumin is low and lipids are high. Light microscopy of a biopsy would be normal. What is the diagnosis?',
    vitals: [v('BP', '98/60', false)],
    findings: ['Heavy, selective proteinuria without hematuria or hypertension.'],
    options: [
      { id: 'a', text: 'Minimal change disease', correct: true },
      { id: 'b', text: 'Post-streptococcal glomerulonephritis', whyNot: 'PSGN is nephritic — hematuria, hypertension and low C3 — not the pure nephrotic picture here.' },
      { id: 'c', text: 'Focal segmental glomerulosclerosis', whyNot: 'FSGS is the steroid-resistant nephrotic disease of older children/adults and often has some hematuria/hypertension.' },
      { id: 'd', text: 'IgA nephropathy', whyNot: 'IgA nephropathy presents with hematuria (nephritic), not isolated heavy proteinuria.' },
    ],
    discriminator: 'A child with abrupt nephrotic-range proteinuria, normal light microscopy and podocyte foot-process effacement on EM has minimal change disease — and it is typically steroid-responsive.',
    tags: { system: 'renal', complaint: 'edema', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['psgn', 'iga-nephropathy'],
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },
  {
    itemId: 'mcd-2', version: 1, type: 'tx_next_step', conceptId: 'minimal-change-disease', presentation: 'atypical',
    stem: 'A child with new nephrotic syndrome and a biopsy-normal light microscopy pattern is otherwise well. What is first-line therapy?',
    vitals: [],
    findings: ['No features to suggest a secondary cause.'],
    options: [
      { id: 'a', text: 'Corticosteroids', correct: true },
      { id: 'b', text: 'Cyclophosphamide up front', whyNot: 'Cytotoxic/steroid-sparing agents are reserved for frequently relapsing or steroid-dependent disease, not first line.' },
      { id: 'c', text: 'Plasmapheresis', whyNot: 'Plasma exchange has no role in uncomplicated minimal change disease.' },
      { id: 'd', text: 'Rituximab as initial therapy', whyNot: 'Rituximab is considered for relapsing/steroid-dependent cases, after steroids, not as first-line treatment.' },
    ],
    discriminator: 'Minimal change disease is treated first with corticosteroids, to which most children respond within weeks — steroid-sparing agents are reserved for frequent relapses.',
    tags: { system: 'renal', complaint: 'edema', rotation: ['peds', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },

  /* ── Membranous nephropathy ───────────────────────────────────── */
  {
    itemId: 'membranous-1', version: 1, type: 'one_liner', conceptId: 'membranous-nephropathy', presentation: 'classic',
    stem: 'A 55-year-old man has 8 g/day of proteinuria and edema. Anti-PLA2R antibodies are positive; EM shows subepithelial deposits with "spike and dome" appearance. What is the diagnosis?',
    vitals: [v('BP', '138/86', false)],
    findings: ['Nephrotic-range proteinuria without hematuria.'],
    options: [
      { id: 'a', text: 'Primary membranous nephropathy', correct: true },
      { id: 'b', text: 'Minimal change disease', whyNot: 'Minimal change has normal light microscopy and no immune deposits, and is a childhood disease.' },
      { id: 'c', text: 'Diabetic nephropathy', whyNot: 'Diabetic nephropathy shows Kimmelstiel–Wilson nodules and needs years of diabetes, not anti-PLA2R with subepithelial spikes.' },
      { id: 'd', text: 'Membranoproliferative GN', whyNot: 'MPGN shows a tram-track double contour and usually low complement, not spike-and-dome subepithelial deposits.' },
    ],
    discriminator: 'Adult nephrotic syndrome with anti-PLA2R antibodies and subepithelial "spike and dome" deposits is primary membranous nephropathy.',
    tags: { system: 'renal', complaint: 'edema', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['diabetic-nephropathy', 'minimal-change-disease'],
    source: [
      { ref: 'Beck et al., M-Type PLA2R as Target Antigen in Idiopathic Membranous Nephropathy (NEJM)', year: 2009 },
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },
  {
    itemId: 'membranous-2', version: 1, type: 'association', conceptId: 'membranous-nephropathy', presentation: 'atypical',
    stem: 'An older adult has nephrotic syndrome from membranous nephropathy and is anti-PLA2R NEGATIVE. What must you look for?',
    vitals: [],
    findings: ['The membranous pattern is confirmed on biopsy, but the usual primary antibody is absent.'],
    options: [
      { id: 'a', text: 'A secondary cause — solid-organ malignancy, hepatitis B, SLE, or a drug', correct: true },
      { id: 'b', text: 'Nothing further; it is always primary', whyNot: 'PLA2R-negative membranous, especially in older adults, raises the probability of a secondary cause that must be sought.' },
      { id: 'c', text: 'An inherited podocyte gene panel', whyNot: 'Genetic podocytopathies cause FSGS-type disease, not the secondary membranous pattern in question.' },
      { id: 'd', text: 'Anti-GBM antibodies', whyNot: 'Anti-GBM causes a rapidly progressive nephritic/pulmonary-renal syndrome, not nephrotic membranous disease.' },
    ],
    discriminator: 'Membranous nephropathy that is anti-PLA2R negative, particularly in an older patient, should prompt a search for a secondary cause — malignancy, hepatitis B, SLE, or drugs.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.6,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },

  /* ── IgA nephropathy ──────────────────────────────────────────── */
  {
    itemId: 'iga-1', version: 1, type: 'discriminator', conceptId: 'iga-nephropathy', presentation: 'classic',
    stem: 'A 22-year-old develops visible (gross) hematuria on the SAME day as a sore throat. Complement is normal. How does this differ from post-streptococcal GN?',
    vitals: [v('BP', '128/80', false)],
    findings: ['No latent period between the infection and the hematuria; normal C3.'],
    options: [
      { id: 'a', text: 'IgA nephropathy — synpharyngitic hematuria with normal complement', correct: true },
      { id: 'b', text: 'Post-streptococcal GN', whyNot: 'PSGN follows strep by 1–3 weeks (a latent period) and depresses C3; here hematuria is concurrent with normal complement.' },
      { id: 'c', text: 'Alport syndrome', whyNot: 'Alport features sensorineural hearing loss and a family history, not infection-triggered episodic gross hematuria.' },
      { id: 'd', text: 'Thin basement membrane disease', whyNot: 'Thin basement membrane disease causes persistent microscopic (not recurrent gross, infection-linked) hematuria.' },
    ],
    discriminator: 'IgA nephropathy causes gross hematuria concurrent with a mucosal infection ("synpharyngitic") and keeps complement normal, whereas post-streptococcal GN follows a 1–3 week latent period with a low C3.',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['psgn'],
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },
  {
    itemId: 'iga-2', version: 1, type: 'one_liner', conceptId: 'iga-nephropathy', presentation: 'atypical',
    stem: 'A young adult has recurrent episodes of tea-colored urine after minor infections; renal biopsy immunofluorescence shows mesangial IgA deposits. What is the diagnosis?',
    vitals: [],
    findings: ['Between episodes there is mild microscopic hematuria.'],
    options: [
      { id: 'a', text: 'IgA nephropathy', correct: true },
      { id: 'b', text: 'Lupus nephritis', whyNot: 'Lupus nephritis shows a "full-house" immunofluorescence and systemic SLE features, not isolated mesangial IgA.' },
      { id: 'c', text: 'Anti-GBM disease', whyNot: 'Anti-GBM shows linear GBM staining and a rapidly progressive course, not mesangial IgA.' },
      { id: 'd', text: 'Minimal change disease', whyNot: 'Minimal change is nephrotic with no deposits, not recurrent hematuria with mesangial IgA.' },
    ],
    discriminator: 'Recurrent infection-associated hematuria with mesangial IgA deposits on immunofluorescence is IgA nephropathy — the same deposits seen systemically in IgA vasculitis (Henoch–Schönlein).',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },

  /* ── PSGN ─────────────────────────────────────────────────────── */
  {
    itemId: 'psgn-1', version: 1, type: 'one_liner', conceptId: 'psgn', presentation: 'classic',
    stem: 'A 7-year-old develops cola-colored urine, periorbital edema and hypertension two weeks after impetigo. C3 is low and anti-DNase B is elevated. What is the diagnosis?',
    vitals: [v('BP', '142/92', true)],
    findings: ['Latent period after a streptococcal skin infection; low complement.'],
    options: [
      { id: 'a', text: 'Post-streptococcal glomerulonephritis', correct: true },
      { id: 'b', text: 'IgA nephropathy', whyNot: 'IgA nephropathy has no latent period (hematuria is concurrent with infection) and normal complement.' },
      { id: 'c', text: 'Hemolytic uremic syndrome', whyNot: 'HUS follows bloody diarrhea with anemia, thrombocytopenia and schistocytes, not a post-strep low-C3 nephritis.' },
      { id: 'd', text: 'Henoch–Schönlein nephritis', whyNot: 'IgA vasculitis has palpable purpura, abdominal pain and arthralgia with normal complement.' },
    ],
    discriminator: 'A nephritic child 1–3 weeks after strep pharyngitis or impetigo, with a LOW C3 and elevated anti-DNase B/ASO, has post-streptococcal glomerulonephritis.',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['iga-nephropathy'],
    source: [
      { ref: 'VanDeVoorde, Acute Poststreptococcal Glomerulonephritis (Pediatrics in Review)', year: 2015 },
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },
  {
    itemId: 'psgn-2', version: 1, type: 'association', conceptId: 'psgn', presentation: 'atypical',
    stem: 'A nephritic patient has a LOW serum complement (C3). Which grouping of glomerulonephritides does low complement point toward?',
    vitals: [],
    findings: ['The nephritic syndrome is confirmed; the discriminating lab is the complement level.'],
    options: [
      { id: 'a', text: 'Post-streptococcal GN, membranoproliferative GN, and lupus nephritis', correct: true },
      { id: 'b', text: 'IgA nephropathy and anti-GBM disease', whyNot: 'These are normal-complement (pauci-immune/normocomplementemic) nephritides.' },
      { id: 'c', text: 'ANCA-associated (pauci-immune) GN', whyNot: 'Pauci-immune vasculitic GN characteristically has NORMAL complement.' },
      { id: 'd', text: 'Thin basement membrane disease', whyNot: 'Thin basement membrane disease is not a complement-consuming immune-complex nephritis.' },
    ],
    discriminator: 'Low-complement nephritis narrows to post-streptococcal GN, membranoproliferative GN, and lupus nephritis — the immune-complex diseases that consume complement.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.6,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 },
    ],
  },

  /* ── Diabetic nephropathy ─────────────────────────────────────── */
  {
    itemId: 'dmneph-1', version: 1, type: 'one_liner', conceptId: 'diabetic-nephropathy', presentation: 'classic',
    stem: 'A patient with 12 years of type 2 diabetes and background retinopathy has slowly rising albuminuria and a gradually falling GFR, with bland urine. What is the most likely cause?',
    vitals: [v('BP', '146/88', false)],
    findings: ['Concurrent diabetic retinopathy; no active urinary sediment.'],
    options: [
      { id: 'a', text: 'Diabetic nephropathy', correct: true },
      { id: 'b', text: 'Post-infectious glomerulonephritis', whyNot: 'That is an acute nephritic syndrome with active sediment, not an indolent albuminuric decline.' },
      { id: 'c', text: 'Minimal change disease', whyNot: 'Minimal change causes abrupt nephrotic syndrome, usually in children, not a slow albuminuric decline with retinopathy.' },
      { id: 'd', text: 'Rapidly progressive glomerulonephritis', whyNot: 'RPGN causes a rapid Cr rise over days–weeks with crescents and active sediment, not a years-long course.' },
    ],
    discriminator: 'Slowly progressive albuminuria and GFR decline with bland urine and concurrent retinopathy in long-standing diabetes is diabetic nephropathy — the leading cause of ESRD.',
    tags: { system: 'renal', complaint: 'proteinuria', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for Diabetes Management in CKD', year: 2022 },
    ],
  },
  {
    itemId: 'dmneph-2', version: 1, type: 'tx_next_step', conceptId: 'diabetic-nephropathy', presentation: 'atypical',
    stem: 'A type 2 diabetic with albuminuria and hypertension needs renoprotective therapy. Which choice best slows progression?',
    vitals: [v('BP', '150/90', true)],
    findings: ['eGFR 55 with persistent albuminuria.'],
    options: [
      { id: 'a', text: 'An ACE inhibitor or ARB, plus an SGLT2 inhibitor', correct: true },
      { id: 'b', text: 'A dihydropyridine calcium-channel blocker alone', whyNot: 'It lowers blood pressure but does not provide the specific antiproteinuric, renoprotective effect of RAAS blockade + SGLT2 inhibition.' },
      { id: 'c', text: 'Combined ACE inhibitor AND ARB together', whyNot: 'Dual RAAS blockade increases hyperkalemia and AKI without added benefit and is not recommended.' },
      { id: 'd', text: 'Protein loading to preserve muscle', whyNot: 'High protein intake raises intraglomerular pressure; it does not protect the diabetic kidney.' },
    ],
    discriminator: 'Diabetic kidney disease is slowed by an ACE inhibitor or ARB (never both together) combined with an SGLT2 inhibitor, alongside glycemic and blood-pressure control.',
    tags: { system: 'renal', complaint: 'proteinuria', rotation: ['im', 'fm'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'KDIGO Clinical Practice Guideline for Diabetes Management in CKD', year: 2022 },
      { ref: 'ADA Standards of Care in Diabetes — Chronic Kidney Disease', year: 2023 },
    ],
  },

  /* ── Rhabdomyolysis ───────────────────────────────────────────── */
  {
    itemId: 'rhabdo-1', version: 1, type: 'one_liner', conceptId: 'rhabdomyolysis', presentation: 'classic',
    stem: 'A man is found down after a night on the floor. Urine dipstick is strongly positive for blood, but microscopy shows NO red cells. CK is 42,000. What is going on?',
    vitals: [v('K', '6.0', true), v('CK', '42,000', true)],
    findings: ['Tea-colored urine; tender, swollen muscles.'],
    options: [
      { id: 'a', text: 'Rhabdomyolysis with myoglobinuria', correct: true },
      { id: 'b', text: 'Glomerular hematuria', whyNot: 'Glomerular bleeding shows dysmorphic RBCs on microscopy; here the dipstick is heme-positive with no RBCs (myoglobin).' },
      { id: 'c', text: 'Hemolysis with hemoglobinuria', whyNot: 'Intravascular hemolysis gives a very high CK-free picture with anemia and low haptoglobin, not a CK of 42,000.' },
      { id: 'd', text: 'Urinary tract infection', whyNot: 'A UTI shows pyuria and bacteriuria, not a heme-positive dipstick with no cells and a sky-high CK.' },
    ],
    discriminator: 'A heme-positive urine dipstick with NO red cells on microscopy plus a markedly elevated CK is myoglobinuria from rhabdomyolysis, not true hematuria.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Bosch, Poch & Grau, Rhabdomyolysis and Acute Kidney Injury (NEJM)', year: 2009 },
    ],
  },
  {
    itemId: 'rhabdo-2', version: 1, type: 'cant_miss', conceptId: 'rhabdomyolysis', presentation: 'severe',
    stem: 'In a patient with severe rhabdomyolysis (CK 60,000), which complication must you screen for and treat FIRST because it can be immediately fatal?',
    vitals: [v('K', '6.8', true)],
    findings: ['Peaked T waves are appearing on the monitor.'],
    options: [
      { id: 'a', text: 'Hyperkalemia', correct: true },
      { id: 'b', text: 'Hypocalcemia', whyNot: 'Hypocalcemia occurs but is usually not treated unless symptomatic, and it is not the immediate arrhythmic threat here.' },
      { id: 'c', text: 'Hyperuricemia', whyNot: 'Hyperuricemia contributes to AKI but does not cause the immediate lethal arrhythmia that hyperkalemia does.' },
      { id: 'd', text: 'Compartment syndrome', whyNot: 'It matters and needs assessment, but the peaked T waves make hyperkalemia the immediately life-threatening priority.' },
    ],
    discriminator: 'Rhabdomyolysis dumps intracellular potassium, so hyperkalemia — with its risk of lethal arrhythmia — is the can’t-miss complication to stabilize first.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['hyperk-first'],
    source: [
      { ref: 'Bosch, Poch & Grau, Rhabdomyolysis and Acute Kidney Injury (NEJM)', year: 2009 },
    ],
  },
  {
    itemId: 'rhabdo-3', version: 1, type: 'tx_next_step', conceptId: 'rhabdomyolysis', presentation: 'classic',
    stem: 'After stabilizing the potassium in a rhabdomyolysis patient, what is the cornerstone of preventing pigment-induced AKI?',
    vitals: [v('K', '5.2', false)],
    findings: ['Urine output is low and the urine is dark.'],
    options: [
      { id: 'a', text: 'Early, aggressive isotonic IV fluid resuscitation', correct: true },
      { id: 'b', text: 'Loop diuretics to force diuresis', whyNot: 'Diuretics do not replace volume and may worsen tubular myoglobin precipitation; volume expansion is the priority.' },
      { id: 'c', text: 'Fluid restriction to avoid overload', whyNot: 'Restricting fluid in myoglobinuric AKI concentrates pigment in the tubules and worsens injury.' },
      { id: 'd', text: 'Empiric hemodialysis for everyone', whyNot: 'Dialysis is reserved for established indications (refractory hyperkalemia, severe acidosis, overload), not routine early therapy.' },
    ],
    discriminator: 'The mainstay of rhabdomyolysis renal protection is early, aggressive isotonic fluid resuscitation to maintain urine flow and dilute tubular myoglobin.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Bosch, Poch & Grau, Rhabdomyolysis and Acute Kidney Injury (NEJM)', year: 2009 },
    ],
  },

  /* ── Contrast-associated AKI ──────────────────────────────────── */
  {
    itemId: 'contrast-aki-1', version: 1, type: 'discriminator', conceptId: 'contrast-induced-aki', presentation: 'atypical',
    stem: 'A CKD patient’s creatinine rises 48 hours after a contrast CT, then trends back down over a week. Urine is bland. A second patient after angiography develops livedo, eosinophilia and a slower, stepwise decline. What distinguishes them?',
    vitals: [],
    findings: ['One is early and reversible; the other is delayed with skin and eosinophil findings.'],
    options: [
      { id: 'a', text: 'The first is contrast-associated AKI; the second is cholesterol (atheroembolic) disease', correct: true },
      { id: 'b', text: 'Both are contrast-associated AKI', whyNot: 'Atheroembolism is delayed with livedo reticularis and eosinophilia and does not spontaneously reverse over a week.' },
      { id: 'c', text: 'Both are atheroembolic disease', whyNot: 'The early, reversible bland-urine rise after contrast is the classic contrast-associated pattern, not atheroembolism.' },
      { id: 'd', text: 'The first is acute interstitial nephritis', whyNot: 'AIN follows a drug with WBC casts/eosinophiluria, not the timing and reversibility of contrast-associated AKI.' },
    ],
    discriminator: 'Contrast-associated AKI rises at 48–72 h with bland urine and usually reverses, whereas cholesterol embolization is delayed and progressive with livedo reticularis, eosinophilia, and low complement.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.6,
    distractorConceptIds: ['ain', 'prerenal-vs-atn'],
    source: [
      { ref: 'ACR Manual on Contrast Media', year: 2023 },
      { ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 },
    ],
  },

  /* ── ADPKD ────────────────────────────────────────────────────── */
  {
    itemId: 'adpkd-1', version: 1, type: 'one_liner', conceptId: 'adpkd', presentation: 'classic',
    stem: 'A 40-year-old with hypertension has bilateral palpable flank masses and episodic hematuria. His father died of a "brain bleed" and was on dialysis. Ultrasound shows numerous bilateral renal cysts. What is the diagnosis?',
    vitals: [v('BP', '158/98', true)],
    findings: ['Bilateral enlarged, cystic kidneys; strong family history.'],
    options: [
      { id: 'a', text: 'Autosomal dominant polycystic kidney disease', correct: true },
      { id: 'b', text: 'Simple renal cysts', whyNot: 'Simple cysts are few and incidental and do not cause bilateral flank masses, hypertension and a familial pattern.' },
      { id: 'c', text: 'Acquired cystic kidney disease', whyNot: 'Acquired cystic disease develops in long-standing ESRD/dialysis, not as an inherited adult-onset flank-mass syndrome.' },
      { id: 'd', text: 'Medullary sponge kidney', whyNot: 'Medullary sponge kidney causes recurrent stones/hematuria without the massive bilateral cystic enlargement or autosomal-dominant family history.' },
    ],
    discriminator: 'Adult-onset hypertension with bilateral enlarged cystic kidneys and a dominant family history is ADPKD — distinct from the few incidental simple cysts.',
    tags: { system: 'renal', complaint: 'flank mass', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Chapman et al., KDIGO Controversies Conference on ADPKD', year: 2015 },
    ],
  },
  {
    itemId: 'adpkd-2', version: 1, type: 'association', conceptId: 'adpkd', presentation: 'atypical',
    stem: 'A patient with ADPKD develops a sudden "worst headache of my life." Which associated lesion must be excluded?',
    vitals: [v('BP', '176/100', true)],
    findings: ['Sudden thunderclap headache with neck stiffness.'],
    options: [
      { id: 'a', text: 'A ruptured berry (saccular) aneurysm causing subarachnoid hemorrhage', correct: true },
      { id: 'b', text: 'A hepatic cyst', whyNot: 'Hepatic cysts are the most common extrarenal manifestation but do not cause a thunderclap headache.' },
      { id: 'c', text: 'Mitral valve prolapse', whyNot: 'MVP is associated with ADPKD but causes a click/murmur, not an acute thunderclap headache.' },
      { id: 'd', text: 'A colonic diverticulum', whyNot: 'Diverticulosis is associated but presents with GI bleeding or diverticulitis, not headache.' },
    ],
    discriminator: 'ADPKD carries intracranial berry aneurysms, so a thunderclap headache demands urgent evaluation for aneurysmal subarachnoid hemorrhage.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['sah-thunderclap'],
    source: [
      { ref: 'Chapman et al., KDIGO Controversies Conference on ADPKD', year: 2015 },
    ],
  },

  /* ── Stone chemistry ──────────────────────────────────────────── */
  {
    itemId: 'stones-1', version: 1, type: 'association', conceptId: 'nephrolithiasis-types', presentation: 'classic',
    stem: 'A patient with recurrent UTIs from a urease-producing organism forms a large branching "staghorn" calculus in alkaline urine. What stone type is this?',
    vitals: [],
    findings: ['Urine pH is persistently alkaline; culture grows Proteus.'],
    options: [
      { id: 'a', text: 'Struvite (magnesium-ammonium-phosphate)', correct: true },
      { id: 'b', text: 'Uric acid', whyNot: 'Uric acid stones form in ACIDIC urine and are radiolucent — the opposite of the alkaline, urease-driven struvite stone.' },
      { id: 'c', text: 'Calcium oxalate', whyNot: 'Calcium oxalate is the most common stone but is not the urease-driven staghorn calculus of chronic Proteus infection.' },
      { id: 'd', text: 'Cystine', whyNot: 'Cystine stones occur in children with cystinuria and hexagonal crystals, not from urease-positive UTIs.' },
    ],
    discriminator: 'A staghorn calculus in persistently alkaline urine with a urease-positive organism (Proteus, Klebsiella) is a struvite stone.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im', 'surg'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['nephrolithiasis'],
    source: [
      { ref: 'Pearle et al., AUA Guideline: Medical Management of Kidney Stones', year: 2019 },
    ],
  },
  {
    itemId: 'stones-2', version: 1, type: 'tx_next_step', conceptId: 'nephrolithiasis-types', presentation: 'atypical',
    stem: 'A gout patient forms a radiolucent kidney stone in acidic urine. Beyond hydration, what best prevents recurrence?',
    vitals: [],
    findings: ['24-hour urine shows a low urine pH; the stone did not appear on plain X-ray.'],
    options: [
      { id: 'a', text: 'Urinary alkalinization (potassium citrate) ± allopurinol', correct: true },
      { id: 'b', text: 'Acidify the urine', whyNot: 'Uric acid precipitates in acidic urine; acidifying would promote, not prevent, stones.' },
      { id: 'c', text: 'A thiazide as the primary measure', whyNot: 'Thiazides target calcium stones by lowering urine calcium; the specific fix for uric acid stones is alkalinization.' },
      { id: 'd', text: 'Restrict all fluids', whyNot: 'Low fluid intake concentrates the urine and promotes every stone type.' },
    ],
    discriminator: 'Radiolucent uric acid stones that form in acidic urine are prevented mainly by alkalinizing the urine with potassium citrate, adding allopurinol when uric acid is high.',
    tags: { system: 'renal', complaint: 'stones', rotation: ['im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Pearle et al., AUA Guideline: Medical Management of Kidney Stones', year: 2019 },
      { ref: 'EAU Guidelines on Urolithiasis', year: 2023 },
    ],
  },

  /* ── Dialysis threshold ───────────────────────────────────────── */
  {
    itemId: 'dialysis-1', version: 1, type: 'tx_threshold', conceptId: 'uremia-dialysis', presentation: 'severe',
    stem: 'A patient with severe AKI has a pericardial friction rub, asterixis, and a potassium of 7.4 that keeps rising despite medical therapy. What does this combination indicate?',
    vitals: [v('K', '7.4', true)],
    findings: ['Uremic pericarditis and encephalopathy with refractory hyperkalemia.'],
    options: [
      { id: 'a', text: 'An urgent indication for dialysis', correct: true },
      { id: 'b', text: 'Continue medical therapy alone and recheck tomorrow', whyNot: 'Uremic pericarditis, encephalopathy, and refractory hyperkalemia are life-threatening — they mandate dialysis now, not watchful waiting.' },
      { id: 'c', text: 'A high creatinine number that can be observed', whyNot: 'Dialysis is triggered by complications (A-E-I-O-U), not by any single creatinine value.' },
      { id: 'd', text: 'Only fluid overload needs dialysis', whyNot: 'Overload is one indication, but refractory hyperkalemia, severe acidosis, intoxications, and uremic complications each independently qualify.' },
    ],
    discriminator: 'Urgent dialysis is indicated for the A-E-I-O-U emergencies — refractory Acidosis, Electrolytes (hyperkalemia), Intoxications, Overload, and Uremic complications (pericarditis, encephalopathy) — not for an isolated creatinine number.',
    tags: { system: 'renal', complaint: 'renal failure', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['hyperk-first'],
    source: [
      { ref: 'KDOQI Clinical Practice Guideline for Hemodialysis Adequacy', year: 2015 },
      { ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 },
    ],
  },
];

const alsoSystems: Record<string, System[]> = {
  'diabetic-nephropathy': ['endocrine'],
  'rhabdomyolysis': ['msk_rheum'],
  'adpkd': ['neuro'],
};

export const RENAL_DEPTH: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
