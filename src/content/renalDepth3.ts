/* ══════════════════════════════════════════════════════════════
   Renal & GU — breadth pour.

   New high-yield renal/GU concepts to move the block toward parity:
   the rapidly progressive and hereditary glomerulopathies, the tubular
   salt-wasting disorders, the sodium/calcium workups, papillary
   necrosis, HUS, and the male GU infections — each drilled several ways
   with recognition, discrimination, and management.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (KDIGO, IDSA,
   AUA, Endocrine Society, primary literature). Synthetic patients;
   content enters the multi-reviewer pipeline UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'rpgn', name: 'Rapidly progressive (crescentic) GN', system: 'renal', topic: 'Nephritic syndrome',
    illnessScript: {
      epidemiology: 'Anti-GBM, immune-complex, and pauci-immune (ANCA) causes.',
      timeCourse: 'Renal function falls over days to weeks — a nephrologic emergency.',
      keyFindings: ['Nephritic sediment with rapidly rising creatinine', 'Crescents on biopsy', 'Immunofluorescence pattern defines the cause'],
      classicDistractors: ['Post-streptococcal GN (self-limited)', 'Acute tubular necrosis'],
    },
  },
  {
    conceptId: 'alport', name: 'Alport syndrome', system: 'renal', topic: 'Hereditary nephropathy',
    illnessScript: {
      epidemiology: 'X-linked type IV collagen defect; boys.',
      timeCourse: 'Persistent hematuria progressing to renal failure.',
      keyFindings: ['Hematuria', 'Sensorineural hearing loss', 'Ocular findings (anterior lenticonus)', 'Basket-weave GBM on EM'],
      classicDistractors: ['Thin basement membrane disease (benign)', 'IgA nephropathy'],
    },
  },
  {
    conceptId: 'mpgn', name: 'Membranoproliferative GN', system: 'renal', topic: 'Glomerular disease',
    illnessScript: {
      epidemiology: 'Hepatitis C/cryoglobulinemia, chronic infection, complement dysregulation.',
      timeCourse: 'Mixed nephritic-nephrotic picture.',
      keyFindings: ['Low serum complement', '"Tram-track" double-contour basement membrane', 'Mixed nephritic/nephrotic features'],
      classicDistractors: ['Membranous nephropathy (normal complement)', 'PSGN'],
    },
  },
  {
    conceptId: 'bartter-gitelman', name: 'Bartter & Gitelman syndromes', system: 'renal', topic: 'Tubular disorders',
    illnessScript: {
      epidemiology: 'Inherited tubular transporter defects mimicking loop (Bartter) or thiazide (Gitelman) diuretics.',
      timeCourse: 'Chronic; normal or low blood pressure despite the salt wasting.',
      keyFindings: ['Hypokalemic metabolic alkalosis with NORMAL/low blood pressure', 'Bartter ≈ loop diuretic; Gitelman ≈ thiazide', 'Gitelman: hypomagnesemia + hypocalciuria'],
      classicDistractors: ['Primary hyperaldosteronism (hypertension)', 'Surreptitious vomiting/diuretic use'],
    },
  },
  {
    conceptId: 'hyponatremia-workup', name: 'Hyponatremia — the volume-status approach', system: 'renal', topic: 'Sodium & water',
    illnessScript: {
      epidemiology: 'The most common electrolyte disorder; the algorithm is volume status + urine studies.',
      timeCourse: 'Depends on the driver; the approach is systematic.',
      keyFindings: ['Confirm true hypotonic hyponatremia (serum osm low)', 'Assess volume status', 'Urine osmolality and urine sodium localize the cause'],
      classicDistractors: ['Pseudohyponatremia (normal osm)', 'Hyperglycemic (translocational) hyponatremia'],
    },
  },
  {
    conceptId: 'hypercalcemia', name: 'Hypercalcemia', system: 'renal', topic: 'Calcium',
    illnessScript: {
      epidemiology: 'Primary hyperparathyroidism (outpatient) and malignancy (inpatient) dominate.',
      timeCourse: '"Stones, bones, groans, and psychiatric moans."',
      keyFindings: ['PTH separates the causes: high/inappropriately normal = hyperparathyroidism', 'Low PTH → malignancy (PTHrP), vitamin D excess, granulomatous', 'Severe/symptomatic: IV fluids first'],
      classicDistractors: ['Familial hypocalciuric hypercalcemia', 'Lab artifact'],
    },
  },
  {
    conceptId: 'papillary-necrosis', name: 'Renal papillary necrosis', system: 'renal', topic: 'Tubulointerstitial',
    illnessScript: {
      epidemiology: 'Sickle cell disease, analgesic (NSAID) overuse, diabetes, pyelonephritis, obstruction.',
      timeCourse: 'Acute gross hematuria with flank pain.',
      keyFindings: ['Gross hematuria and flank pain', 'Sloughed papilla ± ureteral obstruction', 'Classic risk factors (the mnemonic causes)'],
      classicDistractors: ['Nephrolithiasis', 'Renal cell carcinoma'],
    },
  },
  {
    conceptId: 'hus', name: 'Hemolytic uremic syndrome', system: 'renal', topic: 'Thrombotic microangiopathy',
    illnessScript: {
      epidemiology: 'Children after Shiga-toxin E. coli (O157:H7) bloody diarrhea.',
      timeCourse: 'Diarrheal prodrome then the triad.',
      keyFindings: ['Microangiopathic hemolytic anemia (schistocytes)', 'Thrombocytopenia', 'Acute kidney injury'],
      classicDistractors: ['TTP (neurologic-predominant, ADAMTS13)', 'DIC (abnormal coagulation studies)'],
    },
  },
  {
    conceptId: 'prostatitis', name: 'Acute bacterial prostatitis', system: 'renal', topic: 'Male GU infection',
    illnessScript: {
      epidemiology: 'Gram-negative uropathogens; younger men (STI organisms) and older men (coliforms).',
      timeCourse: 'Acute febrile illness with obstructive/irritative urinary symptoms.',
      keyFindings: ['Fever, dysuria, pelvic/perineal pain', 'Exquisitely tender, boggy prostate', 'Avoid vigorous prostate massage (bacteremia risk)'],
      classicDistractors: ['Cystitis', 'Benign prostatic hyperplasia'],
    },
  },
  {
    conceptId: 'epididymitis', name: 'Epididymitis', system: 'renal', topic: 'Male GU infection',
    illnessScript: {
      epidemiology: '< 35 y: sexually transmitted (gonorrhea/chlamydia); ≥ 35 y: coliforms.',
      timeCourse: 'Gradual scrotal pain and swelling with dysuria.',
      keyFindings: ['Gradual onset with dysuria/discharge', 'Preserved cremasteric reflex; relief on elevation (Prehn sign)', 'Tender epididymis, normal lie of the testis'],
      classicDistractors: ['Testicular torsion (abrupt, high-riding, absent cremasteric)', 'Orchitis'],
    },
  },
];

const subtopics: Record<string, string> = {
  'rpgn': 'renal.glomerular',
  'alport': 'renal.glomerular',
  'mpgn': 'renal.glomerular',
  'bartter-gitelman': 'renal.electrolytes',
  'hyponatremia-workup': 'renal.electrolytes',
  'hypercalcemia': 'renal.electrolytes',
  'papillary-necrosis': 'renal.tubulointerstitial',
  'hus': 'renal.aki',
  'prostatitis': 'renal.gu',
  'epididymitis': 'renal.gu',
};

const alsoSystems: Record<string, System[]> = {
  'hus': ['heme_onc', 'pediatrics'],
  'hypercalcemia': ['endocrine'],
};

const items: RawItem[] = [
  /* ── RPGN ─────────────────────────────────────────────────────── */
  {
    itemId: 'rpgn-ol', version: 1, type: 'one_liner', conceptId: 'rpgn', presentation: 'severe',
    stem: 'Over 10 days a patient develops a nephritic sediment (dysmorphic RBCs, RBC casts) with a creatinine rising from 1.0 to 4.2. Biopsy shows glomerular crescents. What is the diagnosis?',
    vitals: [v('Cr', '4.2', true)],
    findings: ['Rapid renal decline with crescents on biopsy.'],
    options: [
      { id: 'a', text: 'Rapidly progressive (crescentic) glomerulonephritis', correct: true },
      { id: 'b', text: 'Post-streptococcal glomerulonephritis', whyNot: 'PSGN in children is usually self-limited over weeks; crescents with a rapid Cr rise define RPGN, a nephrologic emergency.' },
      { id: 'c', text: 'Acute tubular necrosis', whyNot: 'ATN shows muddy-brown granular casts without crescents or a nephritic sediment.' },
      { id: 'd', text: 'Minimal change disease', whyNot: 'Minimal change is nephrotic with a normal creatinine, not a crescentic nephritic emergency.' },
    ],
    discriminator: 'A nephritic picture with a creatinine rising over days-to-weeks and crescents on biopsy is rapidly progressive glomerulonephritis — a renal emergency needing urgent immunosuppression.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['psgn', 'prerenal-vs-atn'],
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },
  {
    itemId: 'rpgn-ddx', version: 1, type: 'discriminator', conceptId: 'rpgn', presentation: 'atypical',
    stem: 'Crescentic GN has three immunofluorescence patterns. Which mapping is correct?',
    vitals: [],
    findings: ['Biopsy IF pattern defines the RPGN subtype.'],
    options: [
      { id: 'a', text: 'Linear = anti-GBM; granular ("lumpy-bumpy") = immune-complex; pauci-immune = ANCA-associated', correct: true },
      { id: 'b', text: 'Linear = ANCA; pauci-immune = anti-GBM', whyNot: 'This reverses them — anti-GBM is LINEAR, and ANCA vasculitis is PAUCI-immune (little staining).' },
      { id: 'c', text: 'All crescentic GN is immune-complex mediated', whyNot: 'Anti-GBM (linear) and pauci-immune (ANCA) are not immune-complex patterns.' },
      { id: 'd', text: 'Immunofluorescence cannot classify RPGN', whyNot: 'IF pattern is precisely how the three RPGN types are distinguished.' },
    ],
    discriminator: 'Crescentic GN is classified by immunofluorescence: linear (anti-GBM), granular immune-complex (lupus, post-infectious, IgA), and pauci-immune (ANCA-associated vasculitis).',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.62,
    distractorConceptIds: ['assoc-anti-gbm', 'gpa-vasculitis'],
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },

  /* ── Alport ───────────────────────────────────────────────────── */
  {
    itemId: 'alport-assoc', version: 1, type: 'association', conceptId: 'alport', presentation: 'classic',
    stem: 'A teenage boy has persistent hematuria, progressive sensorineural hearing loss, and a lens abnormality (anterior lenticonus), with a family history of renal failure. What is the diagnosis?',
    vitals: [],
    findings: ['Hematuria with ear and eye involvement in a hereditary pattern.'],
    options: [
      { id: 'a', text: 'Alport syndrome (type IV collagen defect)', correct: true },
      { id: 'b', text: 'IgA nephropathy', whyNot: 'IgA nephropathy is not associated with hearing loss or lenticonus and lacks the type IV collagen family pattern.' },
      { id: 'c', text: 'Thin basement membrane disease', whyNot: 'Thin basement membrane disease is benign isolated hematuria without deafness, ocular findings, or progression.' },
      { id: 'd', text: 'Post-streptococcal GN', whyNot: 'PSGN is an acute post-infectious nephritis, not a hereditary syndrome with hearing and eye involvement.' },
    ],
    discriminator: 'Hereditary hematuria with sensorineural hearing loss and ocular lenticonus is Alport syndrome — a type IV collagen defect with a basket-weave GBM on electron microscopy.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im', 'peds'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['iga-nephropathy'],
    source: [{ ref: 'Kashtan et al., Alport Syndrome — Expert Guidelines for Diagnosis and Management', year: 2018 }],
  },

  /* ── MPGN ─────────────────────────────────────────────────────── */
  {
    itemId: 'mpgn-assoc', version: 1, type: 'association', conceptId: 'mpgn', presentation: 'atypical',
    stem: 'A patient with hepatitis C and cryoglobulinemia has a mixed nephritic-nephrotic picture, LOW complement, and a "tram-track" double-contour basement membrane on biopsy. What is the diagnosis?',
    vitals: [],
    findings: ['Low complement with a double-contour GBM.'],
    options: [
      { id: 'a', text: 'Membranoproliferative glomerulonephritis', correct: true },
      { id: 'b', text: 'Membranous nephropathy', whyNot: 'Membranous has NORMAL complement with subepithelial spikes, not low complement with tram-tracking.' },
      { id: 'c', text: 'Minimal change disease', whyNot: 'Minimal change has normal light microscopy and normal complement, not a proliferative low-complement pattern.' },
      { id: 'd', text: 'Diabetic nephropathy', whyNot: 'Diabetic nephropathy shows Kimmelstiel–Wilson nodules with normal complement, not tram-track double contours.' },
    ],
    discriminator: 'A low-complement mixed nephritic/nephrotic GN with tram-track double-contour basement membranes, often with hepatitis C/cryoglobulinemia, is membranoproliferative glomerulonephritis.',
    tags: { system: 'renal', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.6,
    distractorConceptIds: ['membranous-nephropathy', 'psgn'],
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },

  /* ── Bartter/Gitelman ─────────────────────────────────────────── */
  {
    itemId: 'bg-ddx', version: 1, type: 'discriminator', conceptId: 'bartter-gitelman', presentation: 'classic',
    stem: 'A normotensive patient has a hypokalemic metabolic alkalosis with no vomiting or diuretic use. What most supports Bartter/Gitelman over primary hyperaldosteronism?',
    vitals: [v('BP', '112/70', false), v('K', '2.9', true)],
    findings: ['Salt-wasting tubulopathy picture with normal blood pressure.'],
    options: [
      { id: 'a', text: 'NORMAL or low blood pressure (renin and aldosterone are high, not suppressed)', correct: true },
      { id: 'b', text: 'Hypertension with suppressed renin', whyNot: 'Hypertension with suppressed renin is primary hyperaldosteronism; Bartter/Gitelman are normotensive with high renin.' },
      { id: 'c', text: 'A high urine chloride excludes them', whyNot: 'Bartter/Gitelman waste chloride (high urine Cl), which helps separate them from vomiting, not from hyperaldosteronism.' },
      { id: 'd', text: 'Metabolic acidosis', whyNot: 'They cause a metabolic ALKALOSIS, not acidosis.' },
    ],
    discriminator: 'Bartter and Gitelman cause a hypokalemic metabolic alkalosis with NORMAL/low blood pressure and high renin/aldosterone, unlike the hypertension and suppressed renin of primary hyperaldosteronism.',
    tags: { system: 'renal', complaint: 'electrolyte', rotation: ['im'], level: 'both' },
    difficultySeed: 0.62,
    distractorConceptIds: ['metabolic-alkalosis', 'secondary-htn'],
    source: [{ ref: 'Blanchard et al., Gitelman Syndrome — Consensus and Guidance (KDIGO Conference)', year: 2017 }],
  },

  /* ── Hyponatremia workup ──────────────────────────────────────── */
  {
    itemId: 'hypona-nx', version: 1, type: 'next_step', conceptId: 'hyponatremia-workup', presentation: 'classic',
    stem: 'A patient has a serum sodium of 122. After confirming it is a true hypotonic hyponatremia, what is the key next step to find the cause?',
    vitals: [v('Na', '122', true)],
    findings: ['Confirmed hypotonic hyponatremia; cause unknown.'],
    options: [
      { id: 'a', text: 'Assess volume status and check urine osmolality and urine sodium', correct: true },
      { id: 'b', text: 'Immediately give hypertonic saline to everyone', whyNot: 'Hypertonic saline is for severe symptomatic hyponatremia; the general next step is to classify the cause by volume status and urine studies.' },
      { id: 'c', text: 'Restrict all fluid before any assessment', whyNot: 'Fluid restriction helps euvolemic/hypervolemic causes but harms hypovolemic hyponatremia; classify first.' },
      { id: 'd', text: 'Measure serum glucose only', whyNot: 'Glucose is checked to exclude translocational hyponatremia, but the core workup is volume status plus urine osmolality/sodium.' },
    ],
    discriminator: 'Once hyponatremia is confirmed hypotonic, the algorithm is volume status plus urine osmolality and urine sodium — hypovolemic (avid retention), euvolemic (SIADH), or hypervolemic (edematous states).',
    tags: { system: 'renal', complaint: 'hyponatremia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['siadh'],
    source: [{ ref: 'Spasovski et al., European Clinical Practice Guideline on Diagnosis and Treatment of Hyponatraemia', year: 2014 }],
  },
  {
    itemId: 'hypona-ddx', version: 1, type: 'discriminator', conceptId: 'hyponatremia-workup', presentation: 'atypical',
    stem: 'A hyponatremic patient with peripheral edema, ascites, and a urine sodium under 10 has which category of hyponatremia?',
    vitals: [v('Urine Na', '8', true)],
    findings: ['Edematous state with avid renal sodium retention.'],
    options: [
      { id: 'a', text: 'Hypervolemic hyponatremia (heart failure, cirrhosis, nephrotic syndrome)', correct: true },
      { id: 'b', text: 'SIADH (euvolemic)', whyNot: 'SIADH is euvolemic with a urine sodium usually > 30; edema with avid retention indicates a hypervolemic edematous state.' },
      { id: 'c', text: 'Hypovolemic from GI losses', whyNot: 'GI-loss hypovolemia lacks edema/ascites; the fluid-overloaded exam here indicates hypervolemic hyponatremia.' },
      { id: 'd', text: 'Pseudohyponatremia', whyNot: 'Pseudohyponatremia has a normal serum osmolality and no true water excess; this is true hypervolemic hyponatremia.' },
    ],
    discriminator: 'Hyponatremia with edema/ascites and a low urine sodium (avid retention) is hypervolemic hyponatremia of heart failure, cirrhosis, or nephrotic syndrome — the effective circulating volume is low despite total-body overload.',
    tags: { system: 'renal', complaint: 'hyponatremia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Spasovski et al., European Hyponatraemia Guideline', year: 2014 }],
  },

  /* ── Hypercalcemia ────────────────────────────────────────────── */
  {
    itemId: 'hypercal-ddx', version: 1, type: 'discriminator', conceptId: 'hypercalcemia', presentation: 'classic',
    stem: 'A patient has hypercalcemia. Which single test best separates the two dominant causes?',
    vitals: [v('Ca', '11.8', true)],
    findings: ['Hypercalcemia of unclear cause.'],
    options: [
      { id: 'a', text: 'Parathyroid hormone (PTH)', correct: true },
      { id: 'b', text: 'Serum phosphate alone', whyNot: 'Phosphate shifts help but PTH is the pivotal test: high/normal PTH = hyperparathyroidism, low PTH = PTH-independent (often malignancy).' },
      { id: 'c', text: 'Serum albumin', whyNot: 'Albumin is used to correct calcium, not to identify the mechanism.' },
      { id: 'd', text: 'ESR', whyNot: 'ESR is nonspecific and does not distinguish parathyroid from malignant hypercalcemia.' },
    ],
    discriminator: 'PTH divides hypercalcemia: an inappropriately high/normal PTH means primary hyperparathyroidism, whereas a suppressed PTH points to a PTH-independent cause such as malignancy (PTHrP), vitamin D excess, or granulomatous disease.',
    tags: { system: 'renal', complaint: 'electrolyte', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Bilezikian et al., Guidelines on Evaluation and Management of Primary Hyperparathyroidism', year: 2014 }],
  },
  {
    itemId: 'hypercal-tx', version: 1, type: 'tx_sequencing', conceptId: 'hypercalcemia', presentation: 'severe',
    stem: 'A patient with a calcium of 14.5 and confusion needs urgent treatment. What comes FIRST?',
    vitals: [v('Ca', '14.5', true)],
    findings: ['Symptomatic severe hypercalcemia with volume depletion.'],
    options: [
      { id: 'a', text: 'Aggressive IV isotonic saline (volume expansion), then calcitonin and a bisphosphonate', correct: true },
      { id: 'b', text: 'A loop diuretic before any fluids', whyNot: 'Diuresing a volume-depleted patient worsens hypercalcemia; restore volume with saline first (loops are not routinely used up front).' },
      { id: 'c', text: 'A bisphosphonate alone as the immediate fix', whyNot: 'Bisphosphonates take 2–4 days to work; IV fluids give the fastest initial drop, with calcitonin as a rapid bridge.' },
      { id: 'd', text: 'Oral calcium restriction only', whyNot: 'Diet changes are far too slow for symptomatic severe hypercalcemia.' },
    ],
    discriminator: 'Severe symptomatic hypercalcemia is treated first with aggressive IV isotonic fluids (patients are volume-depleted), adding calcitonin for a rapid bridge and a bisphosphonate for durable control.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Endocrine Society / primary literature — Management of Hypercalcemia of Malignancy', year: 2014 }],
  },

  /* ── Papillary necrosis ───────────────────────────────────────── */
  {
    itemId: 'papnec-assoc', version: 1, type: 'association', conceptId: 'papillary-necrosis', presentation: 'classic',
    stem: 'A patient with sickle cell trait and chronic NSAID use develops acute gross hematuria and flank pain, and imaging suggests a sloughed renal papilla. What is the diagnosis?',
    vitals: [],
    findings: ['Gross hematuria with classic risk factors.'],
    options: [
      { id: 'a', text: 'Renal papillary necrosis', correct: true },
      { id: 'b', text: 'Simple nephrolithiasis', whyNot: 'A sloughed papilla with these risk factors is papillary necrosis; a stone would show a discrete calculus, not necrotic papillae.' },
      { id: 'c', text: 'Bladder cancer', whyNot: 'Bladder cancer causes painless hematuria in older smokers, not the acute flank pain with a sloughed papilla and these risk factors.' },
      { id: 'd', text: 'Glomerulonephritis', whyNot: 'GN produces dysmorphic RBCs/casts, not the gross hematuria with a sloughed papilla of papillary necrosis.' },
    ],
    discriminator: 'Gross hematuria with a sloughed papilla in a patient with sickle disease, analgesic overuse, diabetes, pyelonephritis, or obstruction is renal papillary necrosis.',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['nephrolithiasis'],
    source: [{ ref: 'Jung et al., Renal Papillary Necrosis: Review and Comparison of Findings at Multi-Detector Row CT and Intravenous Urography (RadioGraphics)', year: 2006 }],
  },

  /* ── HUS ──────────────────────────────────────────────────────── */
  {
    itemId: 'hus-ddx', version: 1, type: 'discriminator', conceptId: 'hus', presentation: 'classic',
    stem: 'A child develops microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury a week after bloody diarrhea. How does this differ from TTP?',
    vitals: [v('Platelets', '40k', true), v('Cr', '2.9', true)],
    findings: ['Diarrhea-associated thrombotic microangiopathy in a child.'],
    options: [
      { id: 'a', text: 'HUS is renal-predominant, follows Shiga-toxin diarrhea, and typically spares severe neuro findings (TTP is neuro-predominant, ADAMTS13-deficient)', correct: true },
      { id: 'b', text: 'HUS has a normal platelet count', whyNot: 'HUS causes thrombocytopenia; the triad includes low platelets.' },
      { id: 'c', text: 'HUS is defined by ADAMTS13 deficiency', whyNot: 'Severe ADAMTS13 deficiency defines TTP; typical HUS is Shiga-toxin mediated.' },
      { id: 'd', text: 'They are indistinguishable', whyNot: 'The diarrheal prodrome, childhood, and renal-predominant picture distinguish HUS from neuro-predominant TTP.' },
    ],
    discriminator: 'HUS is a renal-predominant thrombotic microangiopathy following Shiga-toxin (O157:H7) bloody diarrhea in children, whereas TTP is neurologic-predominant with severe ADAMTS13 deficiency.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['assoc-ttp'],
    source: [{ ref: 'Cody & Dixon, Hemolytic Uremic Syndrome (Pediatric Clinics / review)', year: 2019 }],
  },
  {
    itemId: 'hus-tx', version: 1, type: 'tx_next_step', conceptId: 'hus', presentation: 'severe',
    stem: 'A child with Shiga-toxin (typical) HUS from E. coli O157:H7 is managed. Which principle is correct?',
    vitals: [],
    findings: ['Diarrhea-associated HUS with AKI.'],
    options: [
      { id: 'a', text: 'Mainly supportive care (fluid/electrolyte and dialysis as needed); avoid antibiotics and antimotility agents', correct: true },
      { id: 'b', text: 'Give antibiotics to clear the E. coli', whyNot: 'Antibiotics may increase Shiga-toxin release and worsen typical HUS; care is supportive.' },
      { id: 'c', text: 'Transfuse platelets to correct the count', whyNot: 'As in other thrombotic microangiopathies, platelet transfusion is avoided unless life-threatening bleeding.' },
      { id: 'd', text: 'Start plasma exchange routinely as in TTP', whyNot: 'Plasma exchange is the treatment for TTP; typical (Shiga-toxin) HUS is managed supportively.' },
    ],
    discriminator: 'Typical Shiga-toxin HUS is managed with supportive care and dialysis as needed, avoiding antibiotics and antimotility agents (which can worsen it) — unlike TTP, which needs plasma exchange.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['peds', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Freedman et al., Shiga Toxin–Producing E. coli Infection and Risk of HUS (systematic review)', year: 2016 }],
  },

  /* ── Prostatitis ──────────────────────────────────────────────── */
  {
    itemId: 'prostatitis-tx', version: 1, type: 'tx_next_step', conceptId: 'prostatitis', presentation: 'classic',
    stem: 'A 40-year-old man has fever, dysuria, perineal pain, and an exquisitely tender, boggy prostate on gentle exam. What is the management?',
    vitals: [v('Temp', '38.7', true)],
    findings: ['Acute bacterial prostatitis with systemic symptoms.'],
    options: [
      { id: 'a', text: 'Antibiotics with good prostate penetration (fluoroquinolone or TMP-SMX); avoid vigorous prostate massage', correct: true },
      { id: 'b', text: 'Vigorous prostatic massage to express and culture secretions', whyNot: 'Aggressive massage in acute bacterial prostatitis risks precipitating bacteremia and is avoided.' },
      { id: 'c', text: 'A short course of nitrofurantoin', whyNot: 'Nitrofurantoin does not achieve adequate prostatic tissue levels; agents like fluoroquinolones/TMP-SMX are preferred.' },
      { id: 'd', text: 'Alpha-blocker alone', whyNot: 'Symptom relief aside, an acute bacterial infection needs an antibiotic with prostate penetration.' },
    ],
    discriminator: 'Acute bacterial prostatitis is treated with a prostate-penetrating antibiotic (fluoroquinolone or TMP-SMX), and vigorous prostatic massage is avoided because it can precipitate bacteremia.',
    tags: { system: 'renal', complaint: 'UTI', rotation: ['im', 'fm', 'surg'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Coker & Dierfeldt, Acute Bacterial Prostatitis: Diagnosis and Management (Am Fam Physician)', year: 2016 }],
  },

  /* ── Epididymitis ─────────────────────────────────────────────── */
  {
    itemId: 'epididymitis-tx', version: 1, type: 'tx_next_step', conceptId: 'epididymitis', presentation: 'classic',
    stem: 'A 24-year-old sexually active man has gradual scrotal pain with dysuria, a preserved cremasteric reflex, and relief on testicular elevation (torsion excluded). What empiric treatment is appropriate?',
    vitals: [],
    findings: ['Likely sexually transmitted epididymitis in a young man.'],
    options: [
      { id: 'a', text: 'Ceftriaxone plus doxycycline (cover gonorrhea and chlamydia)', correct: true },
      { id: 'b', text: 'Surgical exploration', whyNot: 'Exploration is for suspected torsion; here torsion is excluded and epididymitis is treated medically.' },
      { id: 'c', text: 'A fluoroquinolone as the sole agent for a young man', whyNot: 'In men < 35 the likely organisms are gonorrhea/chlamydia, treated with ceftriaxone + doxycycline; coliform-directed therapy fits older men.' },
      { id: 'd', text: 'No treatment; it resolves spontaneously', whyNot: 'Untreated STI epididymitis can cause abscess and infertility and transmits infection.' },
    ],
    discriminator: 'Epididymitis in a man under 35 is usually gonorrhea/chlamydia and treated with ceftriaxone plus doxycycline, whereas older men with coliform infection get a fluoroquinolone — after torsion is excluded.',
    tags: { system: 'renal', complaint: 'scrotal pain', rotation: ['em', 'fm', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['testicular-torsion'],
    source: [{ ref: 'CDC Sexually Transmitted Infections Treatment Guidelines — Epididymitis', year: 2021 }],
  },
];

export const RENAL_DEPTH3: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
