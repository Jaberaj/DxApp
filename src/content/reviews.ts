/* ══════════════════════════════════════════════════════════════
   Accrued review verdicts, kept OUT of the content modules.

   Reviews arrive over time from the multi-reviewer pipeline
   (scripts/review-content.ts, docs/REVIEW.md): several LLMs — ideally
   distinct model families — and later humans, each checking a concept
   against external PUBLIC sources. They are stored here, keyed by
   conceptId, and merged onto the concept during normalization
   (bank.ts). A concept's status is DERIVED from these by
   reviewStatus() (content/review.ts): it only becomes `validated`
   with enough INDEPENDENT passing reviews.

   ── Honesty note ────────────────────────────────────────────────
   The seed below is a genuine FIRST-PASS review by a single reviewer
   (claude-opus-4-8, family "anthropic"). One reviewer of one family
   is deliberately NOT enough to validate — these concepts sit at
   `in_review` until a second, INDEPENDENT model (or a human) agrees.
   Do not hand-edit these to force a validated status; run the
   pipeline with additional providers instead.
   ════════════════════════════════════════════════════════════════ */

import type { ReviewRecord } from '../types';

/** conceptId → the reviews accrued for it. */
export const REVIEWS: Record<string, ReviewRecord[]> = {};

/** Register one reviewer's verdicts (used by the seed and the runner output). */
function record(reviewer: string, kind: 'llm' | 'human', family: string | undefined, checkedOn: string, verdicts: Array<{ conceptId: string; verdict: ReviewRecord['verdict']; sources: ReviewRecord['sources']; notes?: string }>): void {
  for (const vd of verdicts) {
    (REVIEWS[vd.conceptId] ??= []).push({
      reviewer,
      kind,
      family,
      sources: vd.sources,
      verdict: vd.verdict,
      notes: vd.notes,
      checkedOn,
    });
  }
}

/** Reviews for a concept (empty if none yet). */
export function reviewsFor(conceptId: string): ReviewRecord[] {
  return REVIEWS[conceptId] ?? [];
}

/* ── Seed: first-pass review (one reviewer, one family → in_review) ── */
record('claude-opus-4-8', 'llm', 'anthropic', '2026-07-28', [
  {
    conceptId: 'dka-firststep',
    verdict: 'pass',
    sources: [
      { ref: 'ADA Standards of Care in Diabetes — Hyperglycemic Crises', year: 2023 },
      { ref: 'Kitabchi et al., Hyperglycemic Crises in Adult Patients With Diabetes (ADA consensus)', year: 2009 },
    ],
    notes: 'Verified: isotonic fluids precede insulin; insulin withheld until K ≥ 3.3 mmol/L. Both vignettes consistent with ADA guidance.',
  },
  {
    conceptId: 'thyroid-storm',
    verdict: 'pass',
    sources: [
      { ref: 'ATA Guidelines for Diagnosis and Management of Hyperthyroidism', year: 2016 },
      { ref: 'Burch & Wartofsky, Life-threatening thyrotoxicosis', year: 1993 },
    ],
    notes: 'Verified: clinical diagnosis; beta-blocker + thionamide, iodine ≥1 h after thionamide to avoid Jod-Basedow; storm vs sepsis discrimination sound.',
  },
  {
    conceptId: 'adrenal-crisis',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 }],
    notes: 'Verified: stress-dose IV hydrocortisone + fluids; pressor-refractory shock after steroid withdrawal is the flag. Single strong guideline source.',
  },
  {
    conceptId: 'hypothyroid',
    verdict: 'pass',
    sources: [{ ref: 'ATA Guidelines for Treatment of Hypothyroidism', year: 2014 }],
    notes: 'Verified: Hashimoto primary hypothyroid; myxedema coma treated with IV thyroid hormone + hydrocortisone until AI excluded.',
  },
  {
    conceptId: 'cushing',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Diagnosis of Cushing Syndrome', year: 2008 }],
    notes: 'Verified: confirm hypercortisolism (late-night salivary cortisol / 24-h UFC / low-dose dex) before ACTH localization and imaging.',
  },
  {
    conceptId: 'addison',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 }],
    notes: 'Verified: hyperpigmentation + hyperkalemia distinguish primary from secondary insufficiency.',
  },
  {
    conceptId: 'spont-ptx',
    verdict: 'pass',
    sources: [
      { ref: 'BTS Pleural Disease Guideline', year: 2010 },
      { ref: 'ATLS (American College of Surgeons)', year: 2018 },
    ],
    notes: 'Verified: primary spontaneous pneumothorax presentation; tension is a clinical diagnosis decompressed before imaging.',
  },
  {
    conceptId: 'ards',
    verdict: 'pass',
    sources: [
      { ref: 'ARDS Network — Lower Tidal Volumes for ARDS (NEJM)', year: 2000 },
      { ref: 'ATS/ESICM/SCCM Clinical Practice Guideline: Mechanical Ventilation in ARDS', year: 2017 },
    ],
    notes: 'Verified: Berlin-type presentation; ~6 mL/kg PBW with plateau < 30 cmH₂O lowers mortality (ARDSNet).',
  },
  {
    conceptId: 'sarcoidosis',
    verdict: 'pass',
    sources: [{ ref: 'ATS/ERS/WASOG Statement on Sarcoidosis', year: 2020 }],
    notes: 'Verified: non-caseating granulomas, hypercalcemia via macrophage vitamin-D activation; Löfgren triad (EN + hilar adenopathy + arthritis) accurate.',
  },
  {
    conceptId: 'ipf',
    verdict: 'pass',
    sources: [
      { ref: 'ATS/ERS/JRS/ALAT Clinical Practice Guideline: Idiopathic Pulmonary Fibrosis', year: 2022 },
      { ref: 'PANTHER-IPF (NHLBI) (NEJM)', year: 2012 },
    ],
    notes: 'Verified: UIP/honeycombing; PANTHER showed harm from prednisone/azathioprine/NAC; antifibrotics + transplant referral correct.',
  },
  {
    conceptId: 'prerenal-vs-atn',
    verdict: 'pass',
    sources: [{ ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 }],
    notes: 'Verified: FENa < 1%, BUN:Cr > 20, bland sediment, fluid-responsive = prerenal; FENa > 2% with muddy-brown casts = ATN.',
  },
  {
    conceptId: 'hyperk-first',
    verdict: 'pass',
    sources: [
      { ref: 'KDIGO Controversies Conference on Potassium Management', year: 2020 },
      { ref: 'European Resuscitation Council Guidelines — hyperkalaemia', year: 2021 },
    ],
    notes: 'Verified: calcium stabilizes membrane without lowering K; shift (insulin+glucose/albuterol) then remove (dialysis/binder/diuresis).',
  },
]);

/* ── Depth pour: GI / Renal / Neuro first-pass review ─────────────
   Same honesty rule as the seed above: a single reviewer of a single
   family (claude-opus-4-8, "anthropic") is deliberately NOT enough to
   validate. These sit at `in_review` until a second independent model
   family (or a human) agrees. Each verdict was checked against the
   PUBLIC sources cited on the concept's own vignettes. */
record('claude-opus-4-8', 'llm', 'anthropic', '2026-07-29', [
  /* Renal */
  {
    conceptId: 'siadh', verdict: 'pass',
    sources: [
      { ref: 'European Clinical Practice Guideline on Diagnosis and Treatment of Hyponatraemia (ESICM/ESE/ERA-EDTA)', year: 2014 },
      { ref: 'Verbalis et al., Diagnosis, Evaluation, and Treatment of Hyponatremia (Am J Med)', year: 2013 },
    ],
    notes: 'Verified: euvolemic hypotonic hyponatremia with urine osm > 100 and urine Na > 30, normal thyroid/adrenal; chronic correction capped ~6–8 mmol/L/24 h to avoid ODS.',
  },
  {
    conceptId: 'diabetes-insipidus', verdict: 'pass',
    sources: [{ ref: 'Christ-Crain et al., Diabetes insipidus (Nature Reviews Disease Primers)', year: 2019 }],
    notes: 'Verified: desmopressin concentrates urine in central but not nephrogenic DI; nephrogenic managed by removing cause + low-solute diet + thiazide.',
  },
  {
    conceptId: 'hypokalemia', verdict: 'pass',
    sources: [
      { ref: 'Huang & Kuo, Mechanism of Hypokalemia in Magnesium Deficiency (JASN)', year: 2007 },
      { ref: 'Cohn et al., New Guidelines for Potassium Replacement in Clinical Practice (Arch Intern Med)', year: 2000 },
    ],
    notes: 'Verified: hypomagnesemia drives renal K wasting → replace Mg first; ECG U waves/flat T are the mirror of hyperkalemia.',
  },
  {
    conceptId: 'metabolic-alkalosis', verdict: 'pass',
    sources: [{ ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 }],
    notes: 'Verified: urine Cl < 20 = saline-responsive (vomiting/NG/diuretics), > 20 = saline-resistant (mineralocorticoid excess). Single strong source.',
  },
  {
    conceptId: 'acid-base-compensation', verdict: 'pass',
    sources: [
      { ref: 'Berend et al., Physiological Approach to Assessment of Acid–Base Disturbances (NEJM)', year: 2014 },
      { ref: 'Seifter, Integration of Acid–Base and Electrolyte Disorders (NEJM)', year: 2014 },
    ],
    notes: 'Verified: Winter’s formula (1.5×HCO3 + 8 ± 2) detects a superimposed respiratory disorder; delta-gap unmasks a concurrent metabolic alkalosis.',
  },
  {
    conceptId: 'minimal-change-disease', verdict: 'pass',
    sources: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
    notes: 'Verified: childhood nephrotic syndrome, normal LM with foot-process effacement, steroid-responsive first line.',
  },
  {
    conceptId: 'membranous-nephropathy', verdict: 'pass',
    sources: [
      { ref: 'Beck et al., M-Type PLA2R as Target Antigen in Idiopathic Membranous Nephropathy (NEJM)', year: 2009 },
      { ref: 'KDIGO Glomerular Diseases Guideline', year: 2021 },
    ],
    notes: 'Verified: adult nephrotic; anti-PLA2R in primary disease; PLA2R-negative/older → search for secondary cause (malignancy, HBV, SLE, drugs).',
  },
  {
    conceptId: 'iga-nephropathy', verdict: 'pass',
    sources: [{ ref: 'KDIGO Clinical Practice Guideline for the Management of Glomerular Diseases', year: 2021 }],
    notes: 'Verified: synpharyngitic gross hematuria with normal complement and mesangial IgA; contrasts with the latent period + low C3 of PSGN.',
  },
  {
    conceptId: 'psgn', verdict: 'pass',
    sources: [
      { ref: 'VanDeVoorde, Acute Poststreptococcal Glomerulonephritis (Pediatrics in Review)', year: 2015 },
      { ref: 'KDIGO Glomerular Diseases Guideline', year: 2021 },
    ],
    notes: 'Verified: 1–3 week latent period, low C3, anti-DNase B/ASO, subepithelial humps; low-complement GN differential (PSGN/MPGN/lupus) is accurate.',
  },
  {
    conceptId: 'diabetic-nephropathy', verdict: 'pass',
    sources: [
      { ref: 'KDIGO Clinical Practice Guideline for Diabetes Management in CKD', year: 2022 },
      { ref: 'ADA Standards of Care in Diabetes — CKD', year: 2023 },
    ],
    notes: 'Verified: leading ESRD cause; albuminuria + Kimmelstiel–Wilson; ACEi/ARB (not both) + SGLT2 renoprotection.',
  },
  {
    conceptId: 'rhabdomyolysis', verdict: 'pass',
    sources: [{ ref: 'Bosch, Poch & Grau, Rhabdomyolysis and Acute Kidney Injury (NEJM)', year: 2009 }],
    notes: 'Verified: heme-positive dipstick with no RBCs = myoglobinuria; hyperkalemia is the can’t-miss; early aggressive isotonic fluids protect the kidney.',
  },
  {
    conceptId: 'contrast-induced-aki', verdict: 'pass',
    sources: [
      { ref: 'ACR Manual on Contrast Media', year: 2023 },
      { ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 },
    ],
    notes: 'Verified: Cr rise 48–72 h, bland urine, usually reversible; contrasted against delayed, livedo/eosinophilia atheroembolic disease.',
  },
  {
    conceptId: 'adpkd', verdict: 'pass',
    sources: [{ ref: 'Chapman et al., KDIGO Controversies Conference on ADPKD', year: 2015 }],
    notes: 'Verified: bilateral cystic kidneys, hypertension, hepatic cysts, MVP, and berry aneurysms → SAH risk on thunderclap headache.',
  },
  {
    conceptId: 'nephrolithiasis-types', verdict: 'pass',
    sources: [
      { ref: 'Pearle et al., AUA Guideline: Medical Management of Kidney Stones', year: 2019 },
      { ref: 'EAU Guidelines on Urolithiasis', year: 2023 },
    ],
    notes: 'Verified: struvite staghorn in alkaline urine with urease+ organisms; radiolucent uric acid stones in acidic urine treated by alkalinization ± allopurinol.',
  },
  {
    conceptId: 'uremia-dialysis', verdict: 'pass',
    sources: [
      { ref: 'KDOQI Clinical Practice Guideline for Hemodialysis Adequacy', year: 2015 },
      { ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 },
    ],
    notes: 'Verified: A-E-I-O-U emergent dialysis indications; not triggered by an isolated creatinine value.',
  },
  /* GI */
  {
    conceptId: 'gerd-barrett', verdict: 'pass',
    sources: [
      { ref: 'Katz et al., ACG Clinical Guideline for the Diagnosis and Management of GERD', year: 2022 },
      { ref: 'Shaheen et al., ACG Clinical Guideline: Barrett’s Esophagus', year: 2022 },
    ],
    notes: 'Verified: alarm features (dysphagia, weight loss, bleeding/anemia) → endoscopy; Barrett intestinal metaplasia → adenocarcinoma risk.',
  },
  {
    conceptId: 'achalasia', verdict: 'pass',
    sources: [{ ref: 'Vaezi et al., ACG Clinical Guideline: Diagnosis and Management of Achalasia', year: 2020 }],
    notes: 'Verified: dysphagia to solids AND liquids, bird-beak, incomplete LES relaxation; older/rapid/weight-losing → exclude pseudoachalasia (tumor).',
  },
  {
    conceptId: 'esophageal-cancer', verdict: 'pass',
    sources: [{ ref: 'Rustgi & El-Serag, Esophageal Carcinoma (NEJM review)', year: 2014 }],
    notes: 'Verified: SCC proximal/mid with smoking+alcohol; adenocarcinoma distal with GERD/Barrett/obesity; endoscopy with biopsy first, then staging.',
  },
  {
    conceptId: 'mallory-weiss', verdict: 'pass',
    sources: [{ ref: 'Laine et al., ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding', year: 2021 }],
    notes: 'Verified: mucosal tear (self-limited hematemesis after retching) vs transmural Boerhaave rupture (pneumomediastinum, sepsis). Single strong source.',
  },
  {
    conceptId: 'acute-viral-hepatitis', verdict: 'pass',
    sources: [
      { ref: 'CDC — Interpretation of Hepatitis B Serologic Test Results', year: 2020 },
      { ref: 'Terrault et al., AASLD Guidance on Chronic Hepatitis B', year: 2018 },
    ],
    notes: 'Verified: HBsAg = active, anti-HBs = immunity, isolated anti-HBc IgM = window; HAV IgM = acute, self-limited.',
  },
  {
    conceptId: 'acetaminophen-toxicity', verdict: 'pass',
    sources: [
      { ref: 'Heard, Acetylcysteine for Acetaminophen Poisoning (NEJM review)', year: 2008 },
      { ref: 'Lee et al., AASLD Position Paper: The Management of Acute Liver Failure', year: 2011 },
    ],
    notes: 'Verified: nomogram-guided NAC given early without waiting for enzymes; transaminases in the thousands + rising INR = APAP acute liver failure.',
  },
  {
    conceptId: 'wilson-disease', verdict: 'pass',
    sources: [
      { ref: 'Roberts & Schilsky, AASLD Practice Guideline: Diagnosis and Treatment of Wilson Disease', year: 2008 },
      { ref: 'EASL Clinical Practice Guidelines: Wilson’s Disease', year: 2012 },
    ],
    notes: 'Verified: young hepatic + neuropsychiatric disease, Kayser–Fleischer rings, low ceruloplasmin, high urinary copper; contrasts with iron in hemochromatosis.',
  },
  {
    conceptId: 'hemochromatosis', verdict: 'pass',
    sources: [{ ref: 'Kowdley et al., ACG Clinical Guideline: Hereditary Hemochromatosis', year: 2019 }],
    notes: 'Verified: C282Y homozygosity, high transferrin saturation/ferritin, bronze diabetes + MCP arthropathy; phlebotomy first line, chelation only if intolerant.',
  },
  {
    conceptId: 'hepatorenal-syndrome', verdict: 'pass',
    sources: [
      { ref: 'Biggins et al., AASLD Practice Guidance: Ascites, SBP, and HRS in Cirrhosis', year: 2021 },
      { ref: 'EASL Clinical Practice Guidelines for Decompensated Cirrhosis', year: 2018 },
    ],
    notes: 'Verified: AKI in cirrhosis, very low urine Na, bland sediment, no response to albumin; diagnosis of exclusion vs prerenal/ATN.',
  },
  {
    conceptId: 'diverticulitis', verdict: 'pass',
    sources: [
      { ref: 'Peery et al., AGA Institute Guideline on the Management of Acute Diverticulitis', year: 2015 },
      { ref: 'Hall et al., ASCRS Clinical Practice Guidelines: Left-Sided Colonic Diverticulitis', year: 2020 },
    ],
    notes: 'Verified: LLQ pain + fever → CT; colonoscopy deferred to after recovery; uncomplicated disease can be outpatient with selective antibiotics.',
  },
  {
    conceptId: 'bowel-obstruction', verdict: 'pass',
    sources: [{ ref: 'Ten Broek et al., Bologna Guidelines for Adhesive Small Bowel Obstruction (WSES)', year: 2018 }],
    notes: 'Verified: adhesive SBO with air-fluid levels and colicky pain vs quiet ileus; fever/peritonitis/rising lactate = strangulation needing surgery.',
  },
  {
    conceptId: 'choledocholithiasis', verdict: 'pass',
    sources: [
      { ref: 'Buxbaum et al., ASGE Guideline on the Management of Choledocholithiasis', year: 2019 },
      { ref: 'Tokyo Guidelines (TG18) for Acute Cholangitis and Cholecystitis', year: 2018 },
    ],
    notes: 'Verified: painless obstructive jaundice + dilated duct (choledocholithiasis) vs Murphy-positive cholecystitis vs Charcot-triad cholangitis.',
  },
  /* Neuro */
  {
    conceptId: 'intracerebral-hemorrhage', verdict: 'pass',
    sources: [{ ref: 'Greenberg et al., AHA/ASA Guideline for the Management of Spontaneous Intracerebral Hemorrhage', year: 2022 }],
    notes: 'Verified: hyperdense blood on non-contrast CT, early headache/vomiting/depressed consciousness; thrombolysis contraindicated; controlled BP lowering + reversal.',
  },
  {
    conceptId: 'tia', verdict: 'pass',
    sources: [{ ref: 'Kleindorfer et al., AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA', year: 2021 }],
    notes: 'Verified: transient focal deficit with full recovery and no infarct; high early stroke risk → urgent carotid imaging + rhythm evaluation.',
  },
  {
    conceptId: 'epidural-vs-subdural', verdict: 'pass',
    sources: [{ ref: 'Carney et al., Brain Trauma Foundation Guidelines for the Management of Severe TBI', year: 2016 }],
    notes: 'Verified: epidural biconvex/lucid interval/does not cross sutures (middle meningeal); subdural crescent/crosses sutures/bridging veins, insidious in elderly.',
  },
  {
    conceptId: 'stroke-localization', verdict: 'pass',
    sources: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
    notes: 'Verified: MCA face/arm > leg + aphasia/neglect; ACA leg > arm; PCA hemianopia; lacunar pure motor/sensory without cortical signs.',
  },
  {
    conceptId: 'bell-palsy', verdict: 'pass',
    sources: [
      { ref: 'Baugh et al., AAO-HNS Clinical Practice Guideline: Bell’s Palsy', year: 2013 },
      { ref: 'Gronseth & Paduga, AAN Evidence-Based Guideline Update: Steroids and Antivirals for Bell Palsy', year: 2012 },
    ],
    notes: 'Verified: peripheral CN VII weakens whole hemiface incl. forehead (central spares forehead); early corticosteroids + eye protection.',
  },
  {
    conceptId: 'als', verdict: 'pass',
    sources: [{ ref: 'Miller et al., AAN Practice Parameter Update: The Care of the Patient With ALS', year: 2009 }],
    notes: 'Verified: combined UMN + LMN signs with normal sensation; bulbar-onset variant accurate; sensory sparing separates it from MS/GBS/MG.',
  },
  {
    conceptId: 'dementia-subtypes', verdict: 'pass',
    sources: [
      { ref: 'McKeith et al., Diagnosis and Management of Dementia with Lewy Bodies (4th DLB Consortium report, Neurology)', year: 2017 },
      { ref: 'Rascovsky et al., Revised Criteria for Behavioural Variant Frontotemporal Dementia (Brain)', year: 2011 },
    ],
    notes: 'Verified: DLB = fluctuations + visual hallucinations + parkinsonism + neuroleptic sensitivity; bvFTD = early disinhibition with spared memory.',
  },
  {
    conceptId: 'nph', verdict: 'pass',
    sources: [{ ref: 'Relkin et al., Diagnosing Idiopathic Normal-Pressure Hydrocephalus (Neurosurgery guideline)', year: 2005 }],
    notes: 'Verified: magnetic gait + incontinence + cognitive slowing with ventriculomegaly out of proportion to atrophy; potentially reversible.',
  },
  {
    conceptId: 'huntington', verdict: 'pass',
    sources: [{ ref: 'Bates et al., Huntington Disease (Nature Reviews Disease Primers)', year: 2015 }],
    notes: 'Verified: AD CAG-repeat chorea + psychiatric change + caudate atrophy; anticipation greatest with paternal transmission.',
  },
  {
    conceptId: 'iih', verdict: 'pass',
    sources: [
      { ref: 'Friedman et al., Revised Diagnostic Criteria for the Pseudotumor Cerebri Syndrome (Neurology)', year: 2013 },
      { ref: 'NORDIC IIHTT, Effect of Acetazolamide on Visual Function in IIH (JAMA)', year: 2014 },
    ],
    notes: 'Verified: young obese woman, papilledema, raised opening pressure with normal CSF/imaging; weight loss + acetazolamide; exclude venous sinus thrombosis.',
  },
  {
    conceptId: 'trigeminal-neuralgia', verdict: 'pass',
    sources: [{ ref: 'Cruccu et al., Trigeminal Neuralgia: New Classification and Diagnostic Grading (Neurology)', year: 2016 }],
    notes: 'Verified: brief electric-shock V2/V3 pain triggered by light touch with normal interictal exam; carbamazepine first line.',
  },
  {
    conceptId: 'central-pontine-myelinolysis', verdict: 'pass',
    sources: [
      { ref: 'Sterns, Disorders of Plasma Sodium (NEJM review)', year: 2015 },
      { ref: 'European Hyponatraemia Guideline (ESICM/ESE/ERA-EDTA)', year: 2014 },
    ],
    notes: 'Verified: delayed dysarthria/dysphagia/spastic quadriparesis days after overrapid Na correction; the mechanistic basis of the ~6–8 mmol/L/24 h cap.',
  },
]);

/* ── Heme variety pour: first-pass review of the new disease concepts ──
   Same honesty rule: one reviewer of one family → in_review, never
   validated. Each verdict checked against the concept's cited public
   sources (ASH/ASCO/NCCN/IDSA/WHO and primary literature). */
record('claude-opus-4-8', 'llm', 'anthropic', '2026-07-29', [
  {
    conceptId: 'iron-deficiency-anemia', verdict: 'pass',
    sources: [
      { ref: 'Ko et al., ACG Clinical Guideline: GI Evaluation of Iron Deficiency Anemia', year: 2020 },
      { ref: 'Camaschella, Iron-Deficiency Anemia (NEJM review)', year: 2015 },
    ],
    notes: 'Verified: microcytic, low ferritin/high TIBC; GI endoscopy mandatory in men/postmenopausal women; ferritin is the discriminator among microcytic anemias.',
  },
  {
    conceptId: 'b12-folate-deficiency', verdict: 'pass',
    sources: [{ ref: 'Stabler, Vitamin B12 Deficiency (NEJM review)', year: 2013 }],
    notes: 'Verified: macrocytosis + hypersegmented PMNs; B12 raises MMA + causes neuro disease; folate raises only homocysteine; folate alone can mask B12 neuropathy. Single strong source.',
  },
  {
    conceptId: 'thalassemia', verdict: 'pass',
    sources: [{ ref: 'Taher et al., Thalassaemia (Lancet Seminar)', year: 2018 }],
    notes: 'Verified: microcytosis with preserved/high RBC count, target cells, normal iron studies, elevated HbA2 in beta-thal; RBC count separates from iron deficiency. Single source.',
  },
  {
    conceptId: 'sickle-cell', verdict: 'pass',
    sources: [
      { ref: 'Brandow et al., ASH Guidelines for Sickle Cell Disease: Management of Acute and Chronic Pain', year: 2020 },
      { ref: 'NHLBI Evidence-Based Management of Sickle Cell Disease: Expert Panel Report', year: 2014 },
    ],
    notes: 'Verified: VOC managed with analgesia/hydration/O2; acute chest syndrome (fever, hypoxia, new infiltrate) is the can’t-miss; hydroxyurea reduces crises.',
  },
  {
    conceptId: 'hemolytic-anemia', verdict: 'pass',
    sources: [{ ref: 'Barcellini, Immune Hemolysis: Diagnosis and Treatment of AIHA (review)', year: 2015 }],
    notes: 'Verified: high LDH/indirect bili, low haptoglobin, high retic; warm (IgG, spherocytes, +DAT) vs cold agglutinin (IgM, Mycoplasma/EBV). Single review source.',
  },
  {
    conceptId: 'itp', verdict: 'pass',
    sources: [{ ref: 'Neunert et al., ASH Guidelines for Immune Thrombocytopenia', year: 2019 }],
    notes: 'Verified: isolated thrombocytopenia, no schistocytes; steroids ± IVIG first-line; platelets only for life-threatening bleeding. Single guideline source.',
  },
  {
    conceptId: 'hemophilia', verdict: 'pass',
    sources: [{ ref: 'Srivastava et al., WFH Guidelines for the Management of Hemophilia', year: 2020 }],
    notes: 'Verified: X-linked factor VIII/IX deficiency; isolated prolonged PTT that corrects on mixing; deep bleeding/hemarthroses; distinct from vWD. Single guideline source.',
  },
  {
    conceptId: 'von-willebrand', verdict: 'pass',
    sources: [{ ref: 'James et al., ASH/ISTH/NHF/WFH Guidelines on the Management of von Willebrand Disease', year: 2021 }],
    notes: 'Verified: most common inherited bleeding disorder; mucocutaneous bleeding, abnormal platelet-function assay; desmopressin first-line for type 1. Single guideline source.',
  },
  {
    conceptId: 'hit', verdict: 'pass',
    sources: [{ ref: 'Cuker et al., ASH Guidelines for VTE: Heparin-Induced Thrombocytopenia', year: 2018 }],
    notes: 'Verified: > 50% platelet fall days 5–10 with thrombosis; stop all heparin, start non-heparin anticoagulant; avoid platelets and warfarin monotherapy. Single guideline source.',
  },
  {
    conceptId: 'multiple-myeloma', verdict: 'pass',
    sources: [{ ref: 'Rajkumar et al., IMWG Updated Criteria for the Diagnosis of Multiple Myeloma (Lancet Oncol)', year: 2014 }],
    notes: 'Verified: CRAB features, M-spike/Bence Jones, rouleaux; whole-body CT/MRI/PET preferred over bone scan (lytic lesions); distinct from MGUS. Single strong source.',
  },
  {
    conceptId: 'polycythemia-vera', verdict: 'pass',
    sources: [
      { ref: 'Arber et al., WHO Classification of Myeloid Neoplasms and Acute Leukemia (Blood)', year: 2016 },
      { ref: 'Marchioli et al., CYTO-PV (NEJM)', year: 2013 },
    ],
    notes: 'Verified: JAK2 with low EPO, aquagenic pruritus/erythromelalgia; phlebotomy + low-dose aspirin, cytoreduction for high risk; low EPO separates from secondary polycythemia.',
  },
  {
    conceptId: 'acute-leukemia', verdict: 'pass',
    sources: [
      { ref: 'Arber et al., WHO Classification of Myeloid Neoplasms and Acute Leukemia (Blood)', year: 2016 },
      { ref: 'Sanz et al., Management of APL — European LeukemiaNet (Blood)', year: 2019 },
    ],
    notes: 'Verified: pancytopenia + blasts; AML (Auer rods, adults) vs ALL (TdT+, children, CNS/testicular/mediastinal); APL t(15;17) → DIC needs urgent ATRA.',
  },
]);

/* ── Knowledge-graph-driven breadth pour: Neuro + Cardio ──────────
   The usmle-knowledge-graph supplied the disease list; every clinical
   fact was authored from and checked against the PUBLIC sources cited
   on each concept's vignettes (the graph's own prose/edges are
   placeholder and were not used). One family → in_review, not validated. */
record('claude-opus-4-8', 'llm', 'anthropic', '2026-07-29', [
  /* Neuro */
  {
    conceptId: 'brainstem-stroke', verdict: 'pass',
    sources: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
    notes: 'Verified: Wallenberg crossed findings (ipsilateral face + Horner/dysphagia, contralateral body), Weber (CN III + contralateral hemiparesis), locked-in (ventral pons, preserved vertical gaze). Single guideline source.',
  },
  {
    conceptId: 'lacunar-syndrome', verdict: 'pass',
    sources: [
      { ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 },
      { ref: 'Kleindorfer et al., AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA', year: 2021 },
    ],
    notes: 'Verified: pure motor (internal capsule) / pure sensory (thalamus) without cortical signs; small-vessel prevention = BP/glucose/lipids + antiplatelet, not anticoagulation.',
  },
  {
    conceptId: 'watershed-infarct', verdict: 'pass',
    sources: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
    notes: 'Verified: border-zone infarcts after global hypotension; "man-in-a-barrel" proximal weakness. Single guideline source.',
  },
  {
    conceptId: 'absence-seizure', verdict: 'pass',
    sources: [{ ref: 'Glauser et al., Ethosuximide, Valproic Acid, and Lamotrigine in Childhood Absence Epilepsy (NEJM)', year: 2010 }],
    notes: 'Verified: 3-Hz spike-wave, hyperventilation-provoked staring, no postictal state; ethosuximide first-line; carbamazepine can worsen. Single strong RCT source.',
  },
  {
    conceptId: 'jme', verdict: 'pass',
    sources: [{ ref: 'Glauser et al., ILAE Treatment Guidelines: Antiepileptic Drug Efficacy', year: 2013 }],
    notes: 'Verified: morning myoclonus + GTC, sleep-deprivation/alcohol triggers, generalized polyspike-wave, lifelong. Single guideline source.',
  },
  {
    conceptId: 'febrile-seizure', verdict: 'pass',
    sources: [{ ref: 'AAP Clinical Practice Guideline: Neurodiagnostic Evaluation of the Child With a Simple Febrile Seizure', year: 2011 }],
    notes: 'Verified: simple (brief, generalized, once/24 h, normal exam, 6 mo–5 y) → reassurance, no chronic AED or routine LP; complex features prompt workup. Single guideline.',
  },
  {
    conceptId: 'cord-syndromes', verdict: 'pass',
    sources: [{ ref: 'Kirshblum et al., International Standards for Neurological Classification of Spinal Cord Injury (ASIA)', year: 2011 }],
    notes: 'Verified: Brown-Séquard (ipsilateral motor+dorsal column, contralateral pain/temp), anterior cord (spares dorsal columns), central cord (cape-like, arms>legs). Single standards source.',
  },
  {
    conceptId: 'alzheimer-disease', verdict: 'pass',
    sources: [
      { ref: 'McKhann et al., NIA-AA Diagnostic Guidelines for Alzheimer’s Disease (Alzheimers Dement)', year: 2011 },
      { ref: 'AAN Practice Guideline Update: Mild Cognitive Impairment', year: 2018 },
    ],
    notes: 'Verified: insidious memory-first decline with medial temporal atrophy, amyloid/tau; cholinesterase inhibitors ± memantine symptomatic. Distinct from vascular/DLB/FTD/NPH.',
  },
  {
    conceptId: 'optic-neuritis', verdict: 'pass',
    sources: [{ ref: 'Beck et al., The Optic Neuritis Treatment Trial (ONTT, NEJM)', year: 1992 }],
    notes: 'Verified: painful monocular loss + RAPD + dyschromatopsia, MS link; IV methylprednisolone (oral prednisone alone avoided — ONTT). Landmark trial source.',
  },
  {
    conceptId: 'carpal-tunnel', verdict: 'pass',
    sources: [{ ref: 'AAOS Clinical Practice Guideline: Management of Carpal Tunnel Syndrome', year: 2016 }],
    notes: 'Verified: median-distribution nocturnal paresthesias, Phalen/Tinel, thenar atrophy late; splint ± steroid injection first, surgery for severe/refractory. Single guideline.',
  },
  {
    conceptId: 'neurosyphilis', verdict: 'pass',
    sources: [{ ref: 'CDC Sexually Transmitted Infections Treatment Guidelines — Neurosyphilis', year: 2021 }],
    notes: 'Verified: tabes dorsalis (dorsal-column, Argyll Robertson pupil), reactive CSF-VDRL; IV aqueous penicillin G (IM benzathine inadequate). Single guideline source.',
  },
  /* Cardio */
  {
    conceptId: 'acs-spectrum', verdict: 'pass',
    sources: [{ ref: 'Amsterdam et al., ACC/AHA Guideline for the Management of Patients With Non-ST-Elevation ACS', year: 2014 }],
    notes: 'Verified: UA (troponin−), NSTEMI (troponin+, no ST elevation), STEMI (ST elevation); NSTE-ACS → DAPT + anticoagulation + risk-stratified angiography, not fibrinolysis.',
  },
  {
    conceptId: 'stable-angina', verdict: 'pass',
    sources: [{ ref: 'Fihn et al., ACC/AHA Guideline for the Diagnosis and Management of Patients With Stable Ischemic Heart Disease', year: 2012 }],
    notes: 'Verified: exertional, reproducible, relieved by rest/nitro; prognostic aspirin+statin plus antianginal beta-blocker/nitrate. Single guideline source.',
  },
  {
    conceptId: 'prinzmetal-angina', verdict: 'pass',
    sources: [{ ref: 'JCS Guidelines for Diagnosis and Treatment of Patients With Vasospastic Angina', year: 2013 }],
    notes: 'Verified: rest angina with transient ST elevation and normal coronaries; calcium-channel blockers/nitrates, avoid nonselective beta-blockers (unopposed alpha). Single guideline.',
  },
  {
    conceptId: 'dressler', verdict: 'pass',
    sources: [{ ref: 'Adler et al., ESC Guidelines for the Diagnosis and Management of Pericardial Diseases', year: 2015 }],
    notes: 'Verified: immune post-MI pericarditis weeks later, pleuritic positional pain + rub + fever; distinct from recurrent ischemia. Single guideline source.',
  },
  {
    conceptId: 'pericardial-effusion', verdict: 'pass',
    sources: [{ ref: 'Adler et al., ESC Guidelines for the Diagnosis and Management of Pericardial Diseases', year: 2015 }],
    notes: 'Verified: muffled sounds, low-voltage QRS + electrical alternans, water-bottle silhouette; echo confirms and assesses tamponade physiology. Single guideline source.',
  },
  {
    conceptId: 'long-qt', verdict: 'pass',
    sources: [{ ref: 'Priori et al., ESC Guidelines for Ventricular Arrhythmias and Prevention of Sudden Cardiac Death', year: 2015 }],
    notes: 'Verified: prolonged QTc → torsades; remove QT-prolonging drugs + correct K/Mg, beta-blockers for congenital. Single guideline source.',
  },
  {
    conceptId: 'brugada', verdict: 'pass',
    sources: [{ ref: 'Priori et al., ESC Guidelines for Ventricular Arrhythmias and Prevention of Sudden Cardiac Death', year: 2015 }],
    notes: 'Verified: coved type-1 ST elevation V1–V2, SCN5A, sudden-death risk unmasked by fever/Na-channel blockers; ICD for high risk. Single guideline source.',
  },
  {
    conceptId: 'hcm', verdict: 'pass',
    sources: [{ ref: 'Ommen et al., ACC/AHA Guideline for the Diagnosis and Treatment of Patients With Hypertrophic Cardiomyopathy', year: 2020 }],
    notes: 'Verified: murmur louder with reduced preload (Valsalva/standing), asymmetric septal hypertrophy, athlete sudden death; avoid preload/afterload reducers, beta-blockers first. Single guideline.',
  },
  {
    conceptId: 'infective-endocarditis', verdict: 'pass',
    sources: [{ ref: 'Baddour et al., AHA Scientific Statement: Infective Endocarditis in Adults', year: 2015 }],
    notes: 'Verified: fever + new murmur, Duke criteria (blood cultures + echo), peripheral stigmata; IVDU → tricuspid S. aureus, subacute native → viridans strep. Single statement source.',
  },
  {
    conceptId: 'mitral-regurgitation', verdict: 'pass',
    sources: [{ ref: 'Otto et al., ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease', year: 2020 }],
    notes: 'Verified: holosystolic apical murmur to axilla, louder with handgrip; contrasted with AS (carotid radiation, softens with reduced preload) and HCM. Single guideline source.',
  },
  {
    conceptId: 'dilated-cardiomyopathy', verdict: 'pass',
    sources: [{ ref: 'Heidenreich et al., AHA/ACC/HFSA Guideline for the Management of Heart Failure', year: 2022 }],
    notes: 'Verified: dilated low-EF ventricle with S3 (alcohol/viral/peripartum/doxorubicin/Chagas); distinct from restrictive and HCM. Single guideline source.',
  },
  {
    conceptId: 'rheumatic-fever', verdict: 'pass',
    sources: [{ ref: 'Gewitz et al., AHA Revision of the Jones Criteria for the Diagnosis of Acute Rheumatic Fever', year: 2015 }],
    notes: 'Verified: post-strep Jones criteria (migratory polyarthritis, carditis, Sydenham chorea, erythema marginatum, nodules), mitral stenosis late; penicillin + anti-inflammatory + secondary prophylaxis.',
  },
]);
