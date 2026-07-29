/* ══════════════════════════════════════════════════════════════
   Renal & GU — variety pour #2.

   Depth, not breadth: each item adds a NEW angle to an existing renal
   concept — recognise, separate, work up, treat — so the block's
   differentials and their management are drilled several ways rather
   than once. Items only; no new concepts or subtopics.

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   source (KDIGO, IDSA, AUA, Endocrine Society, primary literature).
   Commercial board-prep is coverage/inspiration only, never copied or
   cited. Synthetic patients; content enters review UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import { v, type ContentModule, type RawItem } from './authoring';

const items: RawItem[] = [
  /* ── Anti-GBM / Goodpasture ───────────────────────────────────── */
  {
    itemId: 'antigbm-ol', version: 1, type: 'one_liner', conceptId: 'assoc-anti-gbm', presentation: 'classic',
    stem: 'A young man has hemoptysis and rapidly rising creatinine with hematuria and RBC casts. Kidney biopsy shows crescents with LINEAR IgG along the glomerular basement membrane. What is the diagnosis?',
    vitals: [v('Cr', '3.6', true)],
    findings: ['Pulmonary hemorrhage plus rapidly progressive glomerulonephritis.'],
    options: [
      { id: 'a', text: 'Anti-GBM disease (Goodpasture syndrome)', correct: true },
      { id: 'b', text: 'Granulomatosis with polyangiitis', whyNot: 'GPA is pauci-immune (ANCA-positive) with granulomatous upper-airway disease, not linear anti-GBM staining.' },
      { id: 'c', text: 'IgA nephropathy', whyNot: 'IgA nephropathy shows mesangial IgA, not linear GBM staining, and does not cause pulmonary hemorrhage.' },
      { id: 'd', text: 'Post-streptococcal GN', whyNot: 'PSGN follows strep with low C3 and subepithelial humps, not a pulmonary-renal linear-IgG syndrome.' },
    ],
    discriminator: 'A pulmonary-renal syndrome with crescentic GN and LINEAR IgG along the basement membrane is anti-GBM (Goodpasture) disease — distinct from the granular/pauci-immune patterns of immune-complex and ANCA vasculitis.',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['gpa-vasculitis'],
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },
  {
    itemId: 'antigbm-tx', version: 1, type: 'tx_next_step', conceptId: 'assoc-anti-gbm', presentation: 'severe',
    stem: 'A patient with biopsy-proven anti-GBM disease has rising creatinine and pulmonary hemorrhage. What is the cornerstone of treatment?',
    vitals: [],
    findings: ['Circulating anti-GBM antibodies; active alveolar hemorrhage.'],
    options: [
      { id: 'a', text: 'Urgent plasma exchange plus corticosteroids and cyclophosphamide', correct: true },
      { id: 'b', text: 'Corticosteroids alone', whyNot: 'Steroids alone are inadequate; removing the pathogenic antibody by plasma exchange is central, with immunosuppression to stop its production.' },
      { id: 'c', text: 'Observation with ACE inhibitor', whyNot: 'This is a fulminant disease; delay costs renal function and risks fatal pulmonary hemorrhage.' },
      { id: 'd', text: 'Antibiotics', whyNot: 'Anti-GBM disease is autoimmune, not infectious.' },
    ],
    discriminator: 'Anti-GBM disease is treated urgently with plasma exchange (to remove the antibody) plus corticosteroids and cyclophosphamide (to stop its production) — the earlier, the better the renal salvage.',
    tags: { system: 'renal', complaint: 'hematuria', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },

  /* ── CKD-MBD ──────────────────────────────────────────────────── */
  {
    itemId: 'ckdmbd-nx', version: 1, type: 'next_step', conceptId: 'ckd-mbd', presentation: 'classic',
    stem: 'A patient with advanced CKD is evaluated for mineral-bone disease. Which laboratory pattern is expected?',
    vitals: [],
    findings: ['Reduced GFR with secondary hyperparathyroidism.'],
    options: [
      { id: 'a', text: 'High phosphate, low calcium, low calcitriol, high PTH', correct: true },
      { id: 'b', text: 'Low phosphate, high calcium, high calcitriol, low PTH', whyNot: 'That is the opposite of CKD-MBD; the failing kidney retains phosphate and cannot make calcitriol.' },
      { id: 'c', text: 'High calcium with suppressed PTH', whyNot: 'CKD drives SECONDARY hyperparathyroidism (high PTH), not PTH suppression.' },
      { id: 'd', text: 'Normal phosphate and PTH', whyNot: 'Advancing CKD characteristically deranges phosphate, calcitriol, and PTH.' },
    ],
    discriminator: 'CKD-mineral bone disease is phosphate retention → low calcitriol and low calcium → a rise in PTH (secondary hyperparathyroidism).',
    tags: { system: 'renal', complaint: 'CKD', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Diagnosis, Evaluation, Prevention, and Treatment of CKD-MBD', year: 2017 }],
  },
  {
    itemId: 'ckdmbd-tx', version: 1, type: 'tx_next_step', conceptId: 'ckd-mbd', presentation: 'atypical',
    stem: 'A CKD patient has persistent hyperphosphatemia despite dietary counseling. What is the appropriate next therapeutic step?',
    vitals: [v('PO₄', '6.8', true)],
    findings: ['Elevated phosphate with rising PTH.'],
    options: [
      { id: 'a', text: 'Add a phosphate binder taken with meals', correct: true },
      { id: 'b', text: 'Give IV phosphate', whyNot: 'The phosphate is already high; giving more worsens it and accelerates vascular calcification.' },
      { id: 'c', text: 'High-dose vitamin D without controlling phosphate', whyNot: 'Active vitamin D raises calcium and phosphate absorption; phosphate must be controlled first to avoid calcification.' },
      { id: 'd', text: 'Restrict fluids', whyNot: 'Fluid restriction does not lower serum phosphate in CKD.' },
    ],
    discriminator: 'Hyperphosphatemia in CKD is managed by dietary phosphate restriction plus meal-time phosphate binders, alongside active vitamin D and calcimimetics for the secondary hyperparathyroidism.',
    tags: { system: 'renal', complaint: 'CKD', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for CKD-MBD', year: 2017 }],
  },

  /* ── High anion-gap acidosis ──────────────────────────────────── */
  {
    itemId: 'agma-nx', version: 1, type: 'next_step', conceptId: 'agma-mudpiles', presentation: 'atypical',
    stem: 'A patient has a high anion-gap metabolic acidosis of unclear cause. Which added calculation most efficiently narrows it toward a toxic alcohol?',
    vitals: [v('Anion gap', '28', true)],
    findings: ['No ketones, normal lactate, and no obvious cause on first pass.'],
    options: [
      { id: 'a', text: 'The osmolar gap', correct: true },
      { id: 'b', text: 'The urine anion gap', whyNot: 'The urine anion gap helps with NON-gap (hyperchloremic) acidosis, not for identifying toxic alcohols.' },
      { id: 'c', text: 'The A-a gradient', whyNot: 'The A-a gradient assesses oxygenation, not the cause of a metabolic acidosis.' },
      { id: 'd', text: 'The reticulocyte count', whyNot: 'Reticulocytes assess anemia, unrelated to a toxic-alcohol acidosis.' },
    ],
    discriminator: 'An elevated osmolar gap with a high anion-gap acidosis and no ketones/lactate points to a toxic alcohol (methanol, ethylene glycol) — the MUDPILES causes that also raise measured osmolality.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 }],
  },

  /* ── RTA ──────────────────────────────────────────────────────── */
  {
    itemId: 'rta-assoc', version: 1, type: 'association', conceptId: 'rta-types', presentation: 'atypical',
    stem: 'A patient has a normal anion-gap metabolic acidosis with HYPERkalemia and mildly low aldosterone effect. Which renal tubular acidosis is this?',
    vitals: [v('K', '5.6', true)],
    findings: ['Hyperkalemic non-gap acidosis; often diabetic nephropathy.'],
    options: [
      { id: 'a', text: 'Type 4 RTA (hypoaldosteronism)', correct: true },
      { id: 'b', text: 'Type 1 (distal) RTA', whyNot: 'Type 1 causes HYPOkalemia with urine pH > 5.5 and calcium-phosphate stones, not hyperkalemia.' },
      { id: 'c', text: 'Type 2 (proximal) RTA', whyNot: 'Type 2 causes hypokalemia and bicarbonate wasting with Fanconi features, not hyperkalemia.' },
      { id: 'd', text: 'A high anion-gap acidosis', whyNot: 'RTAs are NON-anion-gap (hyperchloremic) acidoses by definition.' },
    ],
    discriminator: 'Type 4 RTA is the HYPERkalemic non-gap acidosis of hypoaldosteronism (classically diabetic nephropathy), unlike the hypokalemic type 1 (distal) and type 2 (proximal) RTAs.',
    tags: { system: 'renal', complaint: 'acid-base', rotation: ['im'], level: 'both' },
    difficultySeed: 0.6,
    source: [{ ref: 'Palmer, Kelepouris & Clegg, Renal Tubular Acidosis and Management Strategies (Advances in CKD / review)', year: 2021 }],
  },

  /* ── Pyelonephritis ───────────────────────────────────────────── */
  {
    itemId: 'pyelo-ddx', version: 1, type: 'discriminator', conceptId: 'pyelonephritis', presentation: 'classic',
    stem: 'A woman has dysuria and frequency. What most clearly makes this pyelonephritis rather than simple cystitis?',
    vitals: [v('Temp', '38.9', true)],
    findings: ['Fever, flank pain, and costovertebral-angle tenderness with white-cell casts in the urine.'],
    options: [
      { id: 'a', text: 'Fever, flank/CVA tenderness, and white-cell casts (upper-tract signs)', correct: true },
      { id: 'b', text: 'Dysuria and urinary frequency', whyNot: 'Lower urinary symptoms occur in both; systemic and upper-tract signs distinguish pyelonephritis.' },
      { id: 'c', text: 'Positive nitrites alone', whyNot: 'Nitrites indicate bacteriuria in either cystitis or pyelonephritis; they do not localize the infection.' },
      { id: 'd', text: 'Suprapubic discomfort', whyNot: 'Suprapubic pain suggests cystitis; flank pain with fever and casts indicates upper-tract disease.' },
    ],
    discriminator: 'Fever, costovertebral-angle tenderness, and white-cell casts mark pyelonephritis (upper tract), whereas isolated dysuria/frequency/suprapubic pain without systemic signs is cystitis.',
    tags: { system: 'renal', complaint: 'UTI', rotation: ['im', 'em', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Gupta et al., IDSA Guidelines for Acute Uncomplicated Cystitis and Pyelonephritis', year: 2011 }],
  },
  {
    itemId: 'pyelo-nx', version: 1, type: 'next_step', conceptId: 'pyelonephritis', presentation: 'severe',
    stem: 'A patient with pyelonephritis has been on appropriate IV antibiotics for 72 hours but remains febrile with persistent flank pain. What is the best next step?',
    vitals: [v('Temp', '38.8', true)],
    findings: ['Failure to defervesce on adequate therapy.'],
    options: [
      { id: 'a', text: 'Imaging (CT) to look for an obstructing stone or perinephric abscess', correct: true },
      { id: 'b', text: 'Continue the same antibiotics and keep waiting', whyNot: 'Failure to improve by 48–72 h suggests a complication (obstruction, abscess) that imaging is needed to find.' },
      { id: 'c', text: 'Stop all antibiotics', whyNot: 'Stopping therapy in ongoing pyelonephritis risks progression to sepsis.' },
      { id: 'd', text: 'Discharge on oral antibiotics', whyNot: 'A patient failing therapy should be evaluated for a complication, not stepped down and sent home.' },
    ],
    discriminator: 'Pyelonephritis that fails to improve by 48–72 hours needs cross-sectional imaging for an obstructing stone or perinephric abscess — obstruction with infection is a urologic emergency.',
    tags: { system: 'renal', complaint: 'UTI', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    distractorConceptIds: ['nephrolithiasis'],
    source: [{ ref: 'Gupta et al., IDSA Guidelines for Acute Pyelonephritis', year: 2011 }],
  },

  /* ── Nephritic vs nephrotic ───────────────────────────────────── */
  {
    itemId: 'nephsyn-assoc', version: 1, type: 'association', conceptId: 'nephritic-vs-nephrotic', presentation: 'classic',
    stem: 'A urinalysis shows more than 3.5 g/day of protein with fatty casts and oval fat bodies; the patient has heavy edema, hypoalbuminemia, and hyperlipidemia. Which syndrome is this?',
    vitals: [],
    findings: ['Massive proteinuria with lipiduria; bland of red cells.'],
    options: [
      { id: 'a', text: 'Nephrotic syndrome', correct: true },
      { id: 'b', text: 'Nephritic syndrome', whyNot: 'Nephritic disease features hematuria with RBC casts, hypertension, and subnephrotic proteinuria — not the >3.5 g/day with lipiduria seen here.' },
      { id: 'c', text: 'Isolated hematuria', whyNot: 'The picture is dominated by heavy proteinuria and its metabolic consequences, not hematuria.' },
      { id: 'd', text: 'Acute tubular necrosis', whyNot: 'ATN shows muddy-brown granular casts and AKI, not nephrotic-range proteinuria with fatty casts.' },
    ],
    discriminator: 'Nephrotic syndrome is >3.5 g/day proteinuria with hypoalbuminemia, edema, hyperlipidemia, and lipiduria, whereas nephritic syndrome is hematuria with RBC casts, hypertension, and lesser proteinuria.',
    tags: { system: 'renal', complaint: 'proteinuria', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
  },

  /* ── Testicular torsion ───────────────────────────────────────── */
  {
    itemId: 'torsion-nx', version: 1, type: 'next_step', conceptId: 'testicular-torsion', presentation: 'severe',
    stem: 'An adolescent has sudden severe testicular pain for 2 hours with a high-riding testis and an absent cremasteric reflex. Clinical suspicion for torsion is high. What is the best next step?',
    vitals: [],
    findings: ['Acute unilateral scrotal pain with a firm, elevated, tender testis.'],
    options: [
      { id: 'a', text: 'Immediate urologic surgical exploration (do not delay for imaging)', correct: true },
      { id: 'b', text: 'Wait for a formal Doppler ultrasound before doing anything', whyNot: 'When suspicion is high, salvage depends on detorsion within ~6 hours; do not let imaging delay the operating room.' },
      { id: 'c', text: 'Trial of antibiotics for epididymitis', whyNot: 'The high-riding testis with absent cremasteric reflex is torsion, not epididymitis; antibiotics waste the salvage window.' },
      { id: 'd', text: 'Reassure and discharge with analgesia', whyNot: 'Delay causes irreversible ischemic loss of the testis.' },
    ],
    discriminator: 'High clinical suspicion of testicular torsion goes straight to surgical exploration because salvage falls sharply after ~6 hours — ultrasound is only for equivocal cases and must not delay surgery.',
    tags: { system: 'renal', complaint: 'scrotal pain', rotation: ['em', 'surg'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Sharp et al., Testicular Torsion: Diagnosis, Evaluation, and Management (Am Fam Physician)', year: 2013 }],
  },
  {
    itemId: 'torsion-ddx', version: 1, type: 'discriminator', conceptId: 'testicular-torsion', presentation: 'classic',
    stem: 'Two young men have acute scrotal pain. What best separates torsion from epididymitis?',
    vitals: [],
    findings: ['One has abrupt severe pain; the other has gradual pain with dysuria.'],
    options: [
      { id: 'a', text: 'Absent cremasteric reflex with a high-riding testis and abrupt onset (torsion)', correct: true },
      { id: 'b', text: 'Relief of pain on elevating the testis (Prehn sign)', whyNot: 'Prehn sign (relief with elevation) and preserved cremasteric reflex favor EPIDIDYMITIS, not torsion.' },
      { id: 'c', text: 'The presence of any scrotal pain', whyNot: 'Both cause scrotal pain; the discriminators are onset, testis position, and the cremasteric reflex.' },
      { id: 'd', text: 'Dysuria and urethral discharge', whyNot: 'Dysuria/discharge point to epididymitis (often infectious), not torsion.' },
    ],
    discriminator: 'Torsion is abrupt severe pain with a high-riding testis and an ABSENT cremasteric reflex, whereas epididymitis is gradual, with dysuria, a preserved cremasteric reflex, and relief on elevation (Prehn sign).',
    tags: { system: 'renal', complaint: 'scrotal pain', rotation: ['em', 'surg', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Sharp et al., Testicular Torsion (Am Fam Physician)', year: 2013 }],
  },

  /* ── BPH vs prostate cancer ───────────────────────────────────── */
  {
    itemId: 'bph-nx', version: 1, type: 'next_step', conceptId: 'bph-vs-prostate-ca', presentation: 'atypical',
    stem: 'On digital rectal exam a 66-year-old has a hard, irregular prostate nodule and his PSA is elevated. What is the appropriate next step?',
    vitals: [],
    findings: ['A discrete hard nodule in the peripheral zone with a raised PSA.'],
    options: [
      { id: 'a', text: 'Refer for prostate biopsy (often MRI-targeted)', correct: true },
      { id: 'b', text: 'Start an alpha-blocker and reassure', whyNot: 'A hard nodule with elevated PSA is suspicious for cancer and needs tissue diagnosis, not symptomatic BPH therapy.' },
      { id: 'c', text: 'Begin finasteride to shrink the nodule', whyNot: '5-alpha-reductase inhibitors treat BPH; they do not address a suspicious nodule requiring biopsy.' },
      { id: 'd', text: 'Repeat PSA in one year', whyNot: 'Delaying evaluation of a hard nodule with elevated PSA risks missing a treatable cancer.' },
    ],
    discriminator: 'A hard, irregular prostate nodule with elevated PSA is worked up with biopsy for cancer, whereas the smooth, symmetric enlargement of BPH is managed medically.',
    tags: { system: 'renal', complaint: 'prostate', rotation: ['im', 'surg', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Wei et al., AUA/SUO Guideline: Early Detection of Prostate Cancer', year: 2023 }],
  },
  {
    itemId: 'bph-tx', version: 1, type: 'tx_next_step', conceptId: 'bph-vs-prostate-ca', presentation: 'classic',
    stem: 'A man with a large, smooth, symmetrically enlarged prostate has bothersome lower urinary tract symptoms and a normal PSA. What is appropriate medical therapy?',
    vitals: [],
    findings: ['Weak stream, hesitancy, and nocturia; benign DRE.'],
    options: [
      { id: 'a', text: 'An alpha-blocker (e.g., tamsulosin), adding a 5-alpha-reductase inhibitor for a large gland', correct: true },
      { id: 'b', text: 'Immediate radical prostatectomy', whyNot: 'Surgery of that type is for cancer; benign symptomatic enlargement is managed medically first.' },
      { id: 'c', text: 'Chemotherapy', whyNot: 'BPH is benign; there is no role for chemotherapy.' },
      { id: 'd', text: 'Antibiotics', whyNot: 'There is no infection; LUTS from BPH respond to alpha-blockade and 5-ARI, not antibiotics.' },
    ],
    discriminator: 'Symptomatic BPH is treated with an alpha-blocker for rapid symptom relief, adding a 5-alpha-reductase inhibitor to shrink a large gland over months.',
    tags: { system: 'renal', complaint: 'prostate', rotation: ['fm', 'im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [{ ref: 'Sandhu et al., AUA Guideline: Management of Lower Urinary Tract Symptoms Attributed to BPH', year: 2023 }],
  },

  /* ── Contrast-associated AKI (prevention) ─────────────────────── */
  {
    itemId: 'contrast-nx', version: 1, type: 'tx_next_step', conceptId: 'contrast-induced-aki', presentation: 'atypical',
    stem: 'A patient with CKD needs a contrast-enhanced CT. What best reduces the risk of contrast-associated AKI?',
    vitals: [],
    findings: ['Baseline eGFR 38; the study is clinically necessary.'],
    options: [
      { id: 'a', text: 'Peri-procedure intravenous isotonic fluids and using the minimum contrast volume', correct: true },
      { id: 'b', text: 'Routine high-dose N-acetylcysteine as the main measure', whyNot: 'Trials did not show NAC prevents contrast AKI; isotonic IV fluid is the evidence-based measure.' },
      { id: 'c', text: 'Prophylactic dialysis after the scan for everyone', whyNot: 'Routine post-contrast dialysis is not indicated to prevent contrast AKI.' },
      { id: 'd', text: 'Withhold all fluids to "rest" the kidney', whyNot: 'Volume depletion increases risk; hydration is protective.' },
    ],
    discriminator: 'Contrast-associated AKI is prevented mainly by peri-procedure intravenous isotonic fluids and minimizing contrast volume, not by N-acetylcysteine or prophylactic dialysis.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'ACR Manual on Contrast Media', year: 2023 }],
  },

  /* ── Prerenal vs ATN (sediment) ───────────────────────────────── */
  {
    itemId: 'atn-nx', version: 1, type: 'next_step', conceptId: 'prerenal-vs-atn', presentation: 'classic',
    stem: 'A hypotensive patient develops AKI that does NOT improve after adequate fluid resuscitation. Which bedside test best confirms established acute tubular necrosis?',
    vitals: [],
    findings: ['No response to volume; a prolonged ischemic insult.'],
    options: [
      { id: 'a', text: 'Urine microscopy for muddy-brown granular casts', correct: true },
      { id: 'b', text: 'Renal biopsy as the first step', whyNot: 'Biopsy is rarely needed for classic ischemic ATN; the urine sediment is diagnostic at the bedside.' },
      { id: 'c', text: 'Repeat a fluid bolus regardless of response', whyNot: 'Continued volume when the AKI is intrinsic (ATN) risks overload without benefit.' },
      { id: 'd', text: 'Urine culture', whyNot: 'Culture evaluates infection, not the tubular injury of ATN.' },
    ],
    discriminator: 'AKI that fails to respond to fluids with muddy-brown granular casts and FENa > 2% is established ATN, whereas prerenal disease has a bland sediment, FENa < 1%, and corrects with volume.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 }],
  },

  /* ── Hyperkalemia (ECG can't-miss) ────────────────────────────── */
  {
    itemId: 'hyperk-cm', version: 1, type: 'cant_miss', conceptId: 'hyperk-first', presentation: 'severe',
    stem: 'A dialysis patient missed sessions and has K 7.6. Which finding makes this an immediate emergency demanding calcium NOW?',
    vitals: [v('K', '7.6', true)],
    findings: ['The monitor shows peaked T waves progressing to a widening QRS.'],
    options: [
      { id: 'a', text: 'ECG changes (peaked T waves, widening QRS) — cardiac membrane instability', correct: true },
      { id: 'b', text: 'A mildly elevated potassium with a normal ECG', whyNot: 'The emergency is the ECG instability; a normal ECG allows a less frantic pace even with a high number.' },
      { id: 'c', text: 'The absolute potassium value alone', whyNot: 'ECG changes, more than the number itself, drive the urgency to stabilize the membrane with calcium.' },
      { id: 'd', text: 'Mild hyperphosphatemia', whyNot: 'Phosphate is not the immediate arrhythmic threat here; the widening QRS from hyperkalemia is.' },
    ],
    discriminator: 'Hyperkalemia with ECG changes (peaked T waves, widening QRS toward a sine wave) is a can’t-miss arrhythmic emergency — give IV calcium immediately to stabilize the myocardium, then shift and remove potassium.',
    tags: { system: 'renal', complaint: 'electrolyte emergency', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['ecg-hyperk'],
    source: [{ ref: 'European Resuscitation Council Guidelines — Cardiac Arrest in Special Circumstances (hyperkalaemia)', year: 2021 }],
  },

  /* ── Acute interstitial nephritis ─────────────────────────────── */
  {
    itemId: 'ain-nx', version: 1, type: 'tx_next_step', conceptId: 'ain', presentation: 'classic',
    stem: 'A patient develops AKI with a rash, low-grade fever, and eosinophils in the urine two weeks after starting a proton-pump inhibitor. What is the key management step?',
    vitals: [v('Temp', '37.9', false)],
    findings: ['Sterile pyuria with white-cell casts; peripheral eosinophilia.'],
    options: [
      { id: 'a', text: 'Stop the offending drug', correct: true },
      { id: 'b', text: 'Continue the drug and give fluids only', whyNot: 'Acute interstitial nephritis is driven by the drug; continuing it perpetuates the injury.' },
      { id: 'c', text: 'Start the patient on that drug class again to confirm', whyNot: 'Rechallenge risks worsening AKI and is not appropriate management.' },
      { id: 'd', text: 'Empiric antibiotics for a UTI', whyNot: 'The pyuria is sterile and immune-mediated (AIN), not a bacterial UTI.' },
    ],
    discriminator: 'Acute interstitial nephritis — AKI with rash, fever, eosinophilia/eosinophiluria, and sterile pyuria after a culprit drug (NSAIDs, PPIs, antibiotics) — is treated first by stopping the offending agent.',
    tags: { system: 'renal', complaint: 'AKI', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['prerenal-vs-atn'],
    source: [{ ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 }],
  },

  /* ── Nephrolithiasis (imaging + intervention threshold) ───────── */
  {
    itemId: 'stone-nx', version: 1, type: 'next_step', conceptId: 'nephrolithiasis', presentation: 'classic',
    stem: 'A patient has acute colicky flank pain radiating to the groin with hematuria. What is the best imaging test to confirm a stone?',
    vitals: [],
    findings: ['Writhing in pain; microscopic hematuria.'],
    options: [
      { id: 'a', text: 'Non-contrast helical CT of the abdomen and pelvis', correct: true },
      { id: 'b', text: 'Contrast-enhanced CT urogram first', whyNot: 'Non-contrast CT is the standard first study for suspected stones; contrast can obscure a calculus.' },
      { id: 'c', text: 'MRI', whyNot: 'MRI is poor at detecting calcified stones and is not first-line.' },
      { id: 'd', text: 'No imaging; treat empirically for months', whyNot: 'Imaging confirms the stone, its size, and any obstruction that changes management.' },
    ],
    discriminator: 'Suspected renal colic is confirmed with a non-contrast helical CT, which shows the stone, its size and location, and any obstruction (ultrasound is preferred in pregnancy).',
    tags: { system: 'renal', complaint: 'stones', rotation: ['em', 'surg', 'im'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'Assimos et al., AUA/Endourological Society Guideline: Surgical Management of Stones', year: 2016 }],
  },
  {
    itemId: 'stone-tx', version: 1, type: 'tx_threshold', conceptId: 'nephrolithiasis', presentation: 'severe',
    stem: 'A patient with a ureteral stone develops fever and rigors with obstruction on CT. What must happen?',
    vitals: [v('Temp', '39.2', true), v('HR', '116', true)],
    findings: ['An obstructing stone with signs of infection above it.'],
    options: [
      { id: 'a', text: 'Emergent urologic decompression (stent or nephrostomy) plus antibiotics', correct: true },
      { id: 'b', text: 'Oral analgesia and outpatient follow-up', whyNot: 'An infected, obstructed system is a urologic emergency that can progress to sepsis without decompression.' },
      { id: 'c', text: 'Wait for the stone to pass on its own', whyNot: 'Obstruction with infection cannot be observed; the pus under pressure must be drained.' },
      { id: 'd', text: 'Antibiotics alone without drainage', whyNot: 'Antibiotics cannot sterilize an obstructed, infected collecting system; it must be decompressed.' },
    ],
    discriminator: 'An obstructing stone with infection (fever, sepsis) is a urologic emergency requiring immediate decompression by ureteral stent or percutaneous nephrostomy plus antibiotics — small uncomplicated stones can instead be observed to pass.',
    tags: { system: 'renal', complaint: 'stones', rotation: ['em', 'surg'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Assimos et al., AUA/Endourological Society Guideline: Surgical Management of Stones', year: 2016 }],
  },

  /* ── Uremia / dialysis ────────────────────────────────────────── */
  {
    itemId: 'uremia-cm', version: 1, type: 'cant_miss', conceptId: 'uremia-dialysis', presentation: 'severe',
    stem: 'A patient with severe untreated CKD develops pleuritic chest pain with a scratchy three-component friction rub. What complication does this indicate, and what does it mandate?',
    vitals: [],
    findings: ['A pericardial friction rub in advanced uremia.'],
    options: [
      { id: 'a', text: 'Uremic pericarditis — an indication for urgent dialysis', correct: true },
      { id: 'b', text: 'Viral pericarditis needing only NSAIDs', whyNot: 'Uremic pericarditis is an indication for dialysis; NSAIDs alone are inadequate and risk bleeding/renal harm.' },
      { id: 'c', text: 'Stable angina', whyNot: 'A three-component friction rub is pericarditis, not myocardial ischemia.' },
      { id: 'd', text: 'Costochondritis', whyNot: 'A pericardial rub in advanced uremia is uremic pericarditis, not musculoskeletal pain.' },
    ],
    discriminator: 'A pericardial friction rub in advanced uremia is uremic pericarditis — one of the A-E-I-O-U indications for urgent dialysis, not a condition to treat with NSAIDs alone.',
    tags: { system: 'renal', complaint: 'renal failure', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'KDOQI Clinical Practice Guideline for Hemodialysis Adequacy', year: 2015 }],
  },
];

export const RENAL_DEPTH2: ContentModule = {
  concepts: [],
  subtopics: {},
  items,
};
