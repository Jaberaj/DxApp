/* ══════════════════════════════════════════════════════════════
   Neuroscience — depth pour.

   The base bank covered the stroke/seizure/headache emergencies but
   thinly. This module adds the high-yield neuro spine that trips up
   trainees: hemorrhagic stroke and its BP rule, TIA risk-stratifying,
   the epidural/subdural distinction, cortical-territory localization,
   Bell palsy vs a central seven, ALS, the dementia subtypes, normal-
   pressure hydrocephalus, Huntington chorea, idiopathic intracranial
   hypertension, trigeminal neuralgia, and osmotic demyelination — the
   last a deliberate cross-link to the renal sodium-correction rule.

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   clinical-evidence source (AHA/ASA, AAN, and diagnostic-criteria
   consensus statements, agency guidance, or primary literature).
   Commercial board-prep is used only to see which diseases are
   commonly tested — never copied, scraped, or cited. All patients are
   synthetic. Content enters the multi-reviewer pipeline
   (docs/REVIEW.md) drafted and UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'intracerebral-hemorrhage', name: 'Intracerebral hemorrhage', system: 'neuro', topic: 'Hemorrhagic stroke',
    illnessScript: {
      epidemiology: 'Chronic hypertension (deep/basal ganglia bleeds) and cerebral amyloid angiopathy (lobar bleeds in the elderly).',
      timeCourse: 'Sudden focal deficit with headache, vomiting, and a depressed level of consciousness that may worsen.',
      keyFindings: ['Hyperdense blood on non-contrast CT', 'Early headache/vomiting more than ischemia', 'Not a candidate for thrombolysis'],
      classicDistractors: ['Ischemic stroke', 'Subarachnoid hemorrhage'],
    },
  },
  {
    conceptId: 'tia', name: 'Transient ischemic attack', system: 'neuro', topic: 'Cerebrovascular disease',
    illnessScript: {
      epidemiology: 'Same risk factors as ischemic stroke; a warning of high short-term stroke risk.',
      timeCourse: 'Focal neurologic deficit that fully resolves, classically within an hour, without infarction.',
      keyFindings: ['Transient focal deficit, full recovery', 'No acute infarct on imaging', 'High early stroke risk — urgent workup'],
      classicDistractors: ['Completed ischemic stroke', 'Seizure with Todd paralysis', 'Complicated migraine'],
    },
  },
  {
    conceptId: 'epidural-vs-subdural', name: 'Epidural vs subdural hematoma', system: 'neuro', topic: 'Traumatic intracranial hemorrhage',
    illnessScript: {
      epidemiology: 'Epidural: young trauma, temporal bone/middle meningeal artery. Subdural: elderly/alcoholic, bridging veins.',
      timeCourse: 'Epidural: lucid interval then rapid decline. Subdural: acute after big trauma or insidious in the elderly.',
      keyFindings: ['Epidural: biconvex (lens), does not cross sutures', 'Subdural: crescent, crosses sutures', 'Lucid interval → epidural'],
      classicDistractors: ['Subarachnoid hemorrhage', 'Intraparenchymal hemorrhage'],
    },
  },
  {
    conceptId: 'stroke-localization', name: 'Stroke territory localization', system: 'neuro', topic: 'Cerebrovascular disease',
    illnessScript: {
      epidemiology: 'Occlusion of a specific arterial territory produces a recognizable deficit pattern.',
      timeCourse: 'Sudden onset; the syndrome maps to the vessel.',
      keyFindings: ['MCA: face/arm > leg weakness, aphasia (dominant) or neglect', 'ACA: leg > arm weakness', 'PCA: homonymous hemianopia', 'Lacunar: pure motor/sensory, no cortical signs'],
      classicDistractors: ['Global hypoperfusion', 'Todd paralysis'],
    },
  },
  {
    conceptId: 'bell-palsy', name: 'Bell palsy vs central facial palsy', system: 'neuro', topic: 'Cranial neuropathy',
    illnessScript: {
      epidemiology: 'Idiopathic (often post-viral) lower motor neuron CN VII palsy; peripheral.',
      timeCourse: 'Acute unilateral facial weakness over hours to a couple of days.',
      keyFindings: ['Whole hemiface, INCLUDING the forehead, is weak', 'Cannot close the eye; loss of nasolabial fold', 'A central (UMN) lesion spares the forehead'],
      classicDistractors: ['Cortical stroke (forehead spared)', 'Ramsay Hunt (vesicles)', 'Lyme facial palsy'],
    },
  },
  {
    conceptId: 'als', name: 'Amyotrophic lateral sclerosis', system: 'neuro', topic: 'Motor neuron disease',
    illnessScript: {
      epidemiology: 'Degeneration of upper AND lower motor neurons; middle-aged and older adults.',
      timeCourse: 'Progressive painless weakness spreading over months, eventually bulbar and respiratory.',
      keyFindings: ['Mixed UMN (hyperreflexia, spasticity) and LMN (atrophy, fasciculations) signs', 'No sensory loss', 'Cognition largely spared'],
      classicDistractors: ['Cervical myelopathy', 'Multiple sclerosis', 'Myasthenia gravis'],
    },
  },
  {
    conceptId: 'dementia-subtypes', name: 'Dementia subtypes', system: 'neuro', topic: 'Neurocognitive disorders',
    illnessScript: {
      epidemiology: 'Alzheimer is most common; vascular, Lewy body, and frontotemporal each have signature features.',
      timeCourse: 'Alzheimer: insidious memory-first decline. Vascular: stepwise. DLB/FTD have earlier non-memory features.',
      keyFindings: ['Alzheimer: early episodic memory loss', 'Vascular: stepwise, focal signs', 'DLB: visual hallucinations, parkinsonism, fluctuations', 'FTD: early personality/behavior or language change'],
      classicDistractors: ['Normal-pressure hydrocephalus', 'Delirium', 'Pseudodementia (depression)'],
    },
  },
  {
    conceptId: 'nph', name: 'Normal-pressure hydrocephalus', system: 'neuro', topic: 'Neurocognitive disorders',
    illnessScript: {
      epidemiology: 'Older adults; a potentially reversible cause of dementia.',
      timeCourse: 'Gradual onset of the classic triad over months.',
      keyFindings: ['Gait apraxia ("magnetic," wide-based)', 'Urinary incontinence', 'Cognitive slowing', 'Ventriculomegaly out of proportion to atrophy'],
      classicDistractors: ['Alzheimer disease', 'Parkinson disease'],
    },
  },
  {
    conceptId: 'huntington', name: 'Huntington disease', system: 'neuro', topic: 'Movement disorders',
    illnessScript: {
      epidemiology: 'Autosomal dominant CAG trinucleotide repeat in HTT; onset 30s–40s, with anticipation.',
      timeCourse: 'Progressive chorea, psychiatric change, and dementia over years.',
      keyFindings: ['Chorea', 'Behavioral/psychiatric change, dementia', 'Caudate atrophy with ex-vacuo ventricular dilation', 'Positive family history'],
      classicDistractors: ['Sydenham chorea', 'Wilson disease', 'Tardive dyskinesia'],
    },
  },
  {
    conceptId: 'iih', name: 'Idiopathic intracranial hypertension', system: 'neuro', topic: 'Headache syndromes',
    illnessScript: {
      epidemiology: 'Young obese women; associated with vitamin A derivatives and tetracyclines.',
      timeCourse: 'Daily headache with transient visual obscurations and pulsatile tinnitus.',
      keyFindings: ['Papilledema', 'Elevated opening pressure, normal CSF composition', 'Normal neuroimaging (may show empty sella)', 'Vision loss is the feared complication'],
      classicDistractors: ['Venous sinus thrombosis', 'Space-occupying lesion', 'Migraine'],
    },
  },
  {
    conceptId: 'trigeminal-neuralgia', name: 'Trigeminal neuralgia', system: 'neuro', topic: 'Facial pain',
    illnessScript: {
      epidemiology: 'Often neurovascular compression of CN V; MS in younger patients.',
      timeCourse: 'Recurrent paroxysms of severe, electric-shock facial pain triggered by light touch.',
      keyFindings: ['Brief, stabbing, unilateral V2/V3 pain', 'Triggered by chewing, talking, touch', 'Normal neurologic exam between attacks'],
      classicDistractors: ['Dental pain', 'Cluster headache', 'Temporal arteritis'],
    },
  },
  {
    conceptId: 'central-pontine-myelinolysis', name: 'Osmotic demyelination syndrome', system: 'neuro', topic: 'Demyelinating disease',
    illnessScript: {
      epidemiology: 'Overrapid correction of chronic hyponatremia; malnourished, alcoholic, or liver-transplant patients at higher risk.',
      timeCourse: 'A few days AFTER sodium is corrected too quickly, a new deficit appears.',
      keyFindings: ['Delayed onset after rapid Na correction', 'Dysarthria, dysphagia, spastic quadriparesis', '"Locked-in" in severe cases', 'Central pontine signal change on MRI'],
      classicDistractors: ['Acute stroke', 'Guillain–Barré syndrome'],
    },
  },
];

const subtopics: Record<string, string> = {
  'intracerebral-hemorrhage': 'neuro.stroke',
  'tia': 'neuro.stroke',
  'epidural-vs-subdural': 'neuro.stroke',
  'stroke-localization': 'neuro.stroke',
  'bell-palsy': 'neuro.neuromuscular',
  'als': 'neuro.neuromuscular',
  'dementia-subtypes': 'neuro.altered',
  'nph': 'neuro.altered',
  'huntington': 'neuro.movement',
  'iih': 'neuro.headache',
  'trigeminal-neuralgia': 'neuro.headache',
  'central-pontine-myelinolysis': 'neuro.demyelinating',
};

const items: RawItem[] = [
  /* ── Intracerebral hemorrhage ─────────────────────────────────── */
  {
    itemId: 'ich-1', version: 1, type: 'discriminator', conceptId: 'intracerebral-hemorrhage', presentation: 'classic',
    stem: 'A hypertensive patient has sudden left-sided weakness with severe headache and vomiting, then becomes drowsy. Non-contrast CT shows a hyperdense collection in the right basal ganglia. How does this differ from an acute ischemic stroke?',
    vitals: [v('BP', '210/118', true)],
    findings: ['Depressed consciousness and early vomiting; blood on CT.'],
    options: [
      { id: 'a', text: 'It is an intracerebral hemorrhage — thrombolysis is contraindicated', correct: true },
      { id: 'b', text: 'It is an ischemic stroke; give tPA', whyNot: 'CT shows blood; thrombolysis in hemorrhage is catastrophic. tPA is only for ischemic stroke after hemorrhage is excluded.' },
      { id: 'c', text: 'The two are indistinguishable without MRI', whyNot: 'Non-contrast CT reliably shows acute blood as hyperdensity — that is exactly why it is the first test.' },
      { id: 'd', text: 'Early vomiting and depressed consciousness favor ischemia', whyNot: 'Prominent headache, vomiting, and early depressed consciousness favor hemorrhage over ischemia.' },
    ],
    discriminator: 'Acute blood is hyperdense on non-contrast CT and, with early headache/vomiting and depressed consciousness, marks intracerebral hemorrhage — which absolutely contraindicates thrombolysis.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['em', 'neuro', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['ischemic-stroke', 'stroke-thrombolysis'],
    source: [
      { ref: 'Greenberg et al., AHA/ASA Guideline for the Management of Spontaneous Intracerebral Hemorrhage', year: 2022 },
    ],
  },
  {
    itemId: 'ich-2', version: 1, type: 'tx_next_step', conceptId: 'intracerebral-hemorrhage', presentation: 'severe',
    stem: 'A patient with a spontaneous intracerebral hemorrhage has a blood pressure of 200/115. What is a key acute management step?',
    vitals: [v('BP', '200/115', true)],
    findings: ['Hemorrhage confirmed on CT; no coagulopathy identified yet.'],
    options: [
      { id: 'a', text: 'Careful blood-pressure lowering and reversal of any anticoagulation', correct: true },
      { id: 'b', text: 'Thrombolysis to restore flow', whyNot: 'Thrombolysis is for ischemic stroke; giving it in hemorrhage worsens the bleed.' },
      { id: 'c', text: 'Permissive hypertension to maintain perfusion', whyNot: 'Very high blood pressure promotes hematoma expansion; controlled lowering is recommended.' },
      { id: 'd', text: 'Aspirin loading', whyNot: 'Antiplatelet therapy would worsen active bleeding.' },
    ],
    discriminator: 'Acute intracerebral hemorrhage is managed by controlled blood-pressure lowering and rapid reversal of anticoagulation to limit hematoma expansion — never thrombolysis or antiplatelets.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['em', 'neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Greenberg et al., AHA/ASA Guideline for the Management of Spontaneous Intracerebral Hemorrhage', year: 2022 },
    ],
  },

  /* ── TIA ──────────────────────────────────────────────────────── */
  {
    itemId: 'tia-1', version: 1, type: 'one_liner', conceptId: 'tia', presentation: 'classic',
    stem: 'A 70-year-old had 40 minutes of right arm weakness and slurred speech that fully resolved. Exam is now normal and MRI shows no infarct. What is the diagnosis?',
    vitals: [v('BP', '162/94', false)],
    findings: ['Complete resolution of a focal deficit with no infarct on imaging.'],
    options: [
      { id: 'a', text: 'Transient ischemic attack', correct: true },
      { id: 'b', text: 'Completed ischemic stroke', whyNot: 'A completed stroke leaves a deficit or an infarct on imaging; here both resolved.' },
      { id: 'c', text: 'Todd paralysis after a seizure', whyNot: 'Todd paralysis follows a witnessed seizure; there is no seizure history here.' },
      { id: 'd', text: 'Complicated migraine', whyNot: 'Migraine aura spreads and is usually positive phenomena in a younger patient, not sudden negative deficits in a vasculopath.' },
    ],
    discriminator: 'A focal neurologic deficit that fully resolves with NO infarct on imaging is a transient ischemic attack — a warning of high short-term stroke risk that needs urgent workup.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['em', 'im', 'neuro'], level: 'both' },
    difficultySeed: 0.4,
    distractorConceptIds: ['ischemic-stroke'],
    source: [
      { ref: 'Kleindorfer et al., AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA', year: 2021 },
    ],
  },
  {
    itemId: 'tia-2', version: 1, type: 'next_step', conceptId: 'tia', presentation: 'atypical',
    stem: 'After a resolved TIA, which workup best targets the two treatable high-yield sources of emboli?',
    vitals: [],
    findings: ['The deficit has fully resolved; the goal is secondary prevention.'],
    options: [
      { id: 'a', text: 'Carotid imaging and an ECG/rhythm evaluation (for atrial fibrillation)', correct: true },
      { id: 'b', text: 'Lumbar puncture', whyNot: 'CSF analysis has no role in the standard TIA embolic-source workup.' },
      { id: 'c', text: 'EEG', whyNot: 'EEG evaluates seizures, not the carotid stenosis or atrial fibrillation behind most TIAs.' },
      { id: 'd', text: 'Reassurance and routine follow-up', whyNot: 'TIA carries a high early stroke risk; it warrants prompt evaluation, not deferral.' },
    ],
    discriminator: 'TIA workup targets the two treatable embolic sources — carotid stenosis (carotid imaging) and atrial fibrillation (ECG/rhythm monitoring) — because the early stroke risk is high.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['im', 'neuro'], level: 'clerkship' },
    difficultySeed: 0.45,
    distractorConceptIds: ['afib-anticoag'],
    source: [
      { ref: 'Kleindorfer et al., AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA', year: 2021 },
    ],
  },

  /* ── Epidural vs subdural ─────────────────────────────────────── */
  {
    itemId: 'edh-sdh-1', version: 1, type: 'discriminator', conceptId: 'epidural-vs-subdural', presentation: 'classic',
    stem: 'A young man is struck in the temple, is briefly knocked out, wakes and talks (a "lucid interval"), then rapidly deteriorates. CT shows a biconvex (lens-shaped) hyperdensity that does not cross suture lines. Which hematoma is this?',
    vitals: [v('GCS', '15 → 8', true)],
    findings: ['Temporal impact with a lucid interval then decline.'],
    options: [
      { id: 'a', text: 'Epidural hematoma (middle meningeal artery)', correct: true },
      { id: 'b', text: 'Subdural hematoma', whyNot: 'Subdurals are crescent-shaped, cross sutures, and come from bridging veins, usually without a classic arterial lucid interval.' },
      { id: 'c', text: 'Subarachnoid hemorrhage', whyNot: 'SAH shows blood in the sulci/cisterns with thunderclap headache, not a lens-shaped extra-axial collection.' },
      { id: 'd', text: 'Intraparenchymal hemorrhage', whyNot: 'Parenchymal bleeds are within brain tissue, not a biconvex extra-axial collection.' },
    ],
    discriminator: 'A lucid interval with a biconvex (lens) hyperdensity that does not cross sutures is an arterial epidural hematoma, versus the crescent, suture-crossing venous subdural.',
    tags: { system: 'neuro', complaint: 'head injury', rotation: ['em', 'surg', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Carney et al., Brain Trauma Foundation Guidelines for the Management of Severe Traumatic Brain Injury', year: 2016 },
    ],
  },
  {
    itemId: 'edh-sdh-2', version: 1, type: 'one_liner', conceptId: 'epidural-vs-subdural', presentation: 'elderly',
    stem: 'An 80-year-old on anticoagulation has weeks of progressive headache and confusion after a minor fall. CT shows a crescent-shaped collection over the convexity that crosses suture lines. What is the diagnosis?',
    vitals: [],
    findings: ['Insidious course in an elderly, anticoagulated patient.'],
    options: [
      { id: 'a', text: 'Subdural hematoma', correct: true },
      { id: 'b', text: 'Epidural hematoma', whyNot: 'Epidurals are acute biconvex arterial bleeds that do not cross sutures, not an insidious crescent in the elderly.' },
      { id: 'c', text: 'Alzheimer disease', whyNot: 'A crescentic collection on CT after a fall is structural bleeding, not a neurodegenerative dementia.' },
      { id: 'd', text: 'Ischemic stroke', whyNot: 'An extra-axial crescent of blood is not an ischemic infarct.' },
    ],
    discriminator: 'A crescent-shaped collection crossing suture lines with an insidious course in an elderly or anticoagulated patient after minor trauma is a subdural hematoma from torn bridging veins.',
    tags: { system: 'neuro', complaint: 'confusion', rotation: ['em', 'neuro', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['dementia-subtypes'],
    source: [
      { ref: 'Carney et al., Brain Trauma Foundation Guidelines for Severe TBI', year: 2016 },
    ],
  },

  /* ── Stroke localization ──────────────────────────────────────── */
  {
    itemId: 'strokeloc-1', version: 1, type: 'association', conceptId: 'stroke-localization', presentation: 'classic',
    stem: 'A patient has sudden right face and arm weakness worse than the leg, with expressive aphasia. Which arterial territory is involved?',
    vitals: [],
    findings: ['Cortical signs (aphasia) with face/arm-predominant weakness.'],
    options: [
      { id: 'a', text: 'Left middle cerebral artery', correct: true },
      { id: 'b', text: 'Anterior cerebral artery', whyNot: 'ACA strokes cause LEG > arm weakness, not face/arm-predominant weakness with aphasia.' },
      { id: 'c', text: 'Posterior cerebral artery', whyNot: 'PCA strokes cause a homonymous hemianopia (visual), not the motor/aphasia cortical pattern.' },
      { id: 'd', text: 'A lacunar (small-vessel) infarct', whyNot: 'Lacunar syndromes are pure motor or sensory WITHOUT cortical signs like aphasia.' },
    ],
    discriminator: 'Face/arm-predominant weakness with aphasia (dominant hemisphere) or neglect localizes to the middle cerebral artery, whereas leg-predominant weakness is ACA and a hemianopia is PCA.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['neuro', 'em', 'im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['ischemic-stroke'],
    source: [
      { ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Patients With Acute Ischemic Stroke', year: 2019 },
    ],
  },
  {
    itemId: 'strokeloc-2', version: 1, type: 'discriminator', conceptId: 'stroke-localization', presentation: 'atypical',
    stem: 'A hypertensive diabetic has PURE motor hemiparesis of the face, arm, and leg equally, with no aphasia, neglect, or visual field cut. Which stroke type is this?',
    vitals: [v('BP', '170/95', false)],
    findings: ['No cortical signs; equal face/arm/leg weakness.'],
    options: [
      { id: 'a', text: 'A lacunar (small-vessel) infarct of the internal capsule', correct: true },
      { id: 'b', text: 'A large MCA territory stroke', whyNot: 'A large MCA stroke produces cortical signs (aphasia/neglect) and face/arm-predominant weakness, not a pure motor deficit.' },
      { id: 'c', text: 'A PCA stroke', whyNot: 'PCA strokes cause visual field loss, not pure motor hemiparesis.' },
      { id: 'd', text: 'A watershed infarct', whyNot: 'Watershed infarcts follow hypotension with proximal ("man-in-a-barrel") weakness, not a capsular pure-motor pattern.' },
    ],
    discriminator: 'Pure motor hemiparesis affecting face, arm, and leg equally with NO cortical signs is a lacunar infarct (e.g., internal capsule) from small-vessel disease in a hypertensive diabetic.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 },
    ],
  },

  /* ── Bell palsy ───────────────────────────────────────────────── */
  {
    itemId: 'bell-1', version: 1, type: 'discriminator', conceptId: 'bell-palsy', presentation: 'classic',
    stem: 'A patient has acute right facial droop. He CANNOT wrinkle the right forehead or close the right eye, and the nasolabial fold is flattened. Why is this Bell palsy rather than a stroke?',
    vitals: [],
    findings: ['The entire right hemiface, including the forehead, is weak.'],
    options: [
      { id: 'a', text: 'Forehead involvement indicates a peripheral (LMN) CN VII lesion', correct: true },
      { id: 'b', text: 'Forehead sparing indicates a peripheral lesion', whyNot: 'That is backwards — a central (UMN) lesion SPARES the forehead; forehead weakness points to a peripheral nerve lesion.' },
      { id: 'c', text: 'Any facial weakness must be a stroke', whyNot: 'A cortical stroke spares the forehead due to bilateral upper-face innervation; whole-face weakness is peripheral.' },
      { id: 'd', text: 'The eye closure is preserved in Bell palsy', whyNot: 'Bell palsy impairs eye closure (a peripheral CN VII sign); this is exactly what distinguishes it from a central lesion.' },
    ],
    discriminator: 'A peripheral (Bell) facial palsy weakens the WHOLE hemiface including the forehead and eye closure, whereas a central lesion spares the forehead because the upper face has bilateral cortical input.',
    tags: { system: 'neuro', complaint: 'facial weakness', rotation: ['em', 'neuro', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['ischemic-stroke'],
    source: [
      { ref: 'Baugh et al., AAO-HNS Clinical Practice Guideline: Bell’s Palsy', year: 2013 },
    ],
  },
  {
    itemId: 'bell-2', version: 1, type: 'tx_next_step', conceptId: 'bell-palsy', presentation: 'atypical',
    stem: 'A patient presents within 2 days of onset of an isolated peripheral facial palsy with no vesicles and an otherwise normal exam. What is the evidence-based treatment?',
    vitals: [],
    findings: ['Early presentation of idiopathic peripheral CN VII palsy.'],
    options: [
      { id: 'a', text: 'Oral corticosteroids (started early), plus eye protection', correct: true },
      { id: 'b', text: 'Antivirals alone', whyNot: 'Antivirals add little by themselves; steroids are the intervention with the strongest evidence and may be combined with antivirals in severe cases.' },
      { id: 'c', text: 'No treatment; all cases resolve fully', whyNot: 'Early steroids improve the odds of complete recovery, and the exposed eye needs protection from drying.' },
      { id: 'd', text: 'Urgent facial nerve decompression surgery', whyNot: 'Surgery is not first-line for uncomplicated Bell palsy; medical therapy with steroids is standard.' },
    ],
    discriminator: 'Bell palsy is treated with early oral corticosteroids plus eye protection (the eye cannot close), with antivirals added only in severe cases.',
    tags: { system: 'neuro', complaint: 'facial weakness', rotation: ['em', 'fm', 'neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Baugh et al., AAO-HNS Clinical Practice Guideline: Bell’s Palsy', year: 2013 },
      { ref: 'Gronseth & Paduga, AAN Evidence-Based Guideline Update: Steroids and Antivirals for Bell Palsy', year: 2012 },
    ],
  },

  /* ── ALS ──────────────────────────────────────────────────────── */
  {
    itemId: 'als-1', version: 1, type: 'discriminator', conceptId: 'als', presentation: 'classic',
    stem: 'A 55-year-old has progressive painless weakness. Exam shows BOTH atrophy with fasciculations AND brisk reflexes with spasticity, but sensation is completely normal. What is the diagnosis?',
    vitals: [],
    findings: ['Mixed upper and lower motor neuron signs with intact sensation.'],
    options: [
      { id: 'a', text: 'Amyotrophic lateral sclerosis', correct: true },
      { id: 'b', text: 'Multiple sclerosis', whyNot: 'MS causes CNS demyelination with sensory, visual, and cerebellar signs and relapses — not pure mixed motor neuron disease with normal sensation.' },
      { id: 'c', text: 'Guillain–Barré syndrome', whyNot: 'GBS is an ascending areflexic weakness over days, not a chronic mix of hyperreflexia and fasciculations.' },
      { id: 'd', text: 'Myasthenia gravis', whyNot: 'MG causes fatigable weakness with normal reflexes and no atrophy/fasciculations or UMN signs.' },
    ],
    discriminator: 'Combined upper motor neuron (spasticity, hyperreflexia) and lower motor neuron (atrophy, fasciculations) signs with entirely NORMAL sensation is amyotrophic lateral sclerosis.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['guillain-barre', 'myasthenia-gravis', 'multiple-sclerosis'],
    source: [
      { ref: 'Miller et al., AAN Practice Parameter Update: The Care of the Patient With ALS', year: 2009 },
    ],
  },
  {
    itemId: 'als-2', version: 1, type: 'one_liner', conceptId: 'als', presentation: 'atypical',
    stem: 'A patient presents with new dysarthria, dysphagia, tongue fasciculations and a brisk jaw jerk, later developing limb weakness with a mix of atrophy and hyperreflexia. Sensation is normal. What is the diagnosis?',
    vitals: [],
    findings: ['Bulbar-onset disease with mixed motor neuron signs and spared sensation.'],
    options: [
      { id: 'a', text: 'Amyotrophic lateral sclerosis (bulbar onset)', correct: true },
      { id: 'b', text: 'Myasthenia gravis', whyNot: 'MG can cause bulbar symptoms but they are fatigable, without tongue fasciculations, atrophy, or a brisk jaw jerk.' },
      { id: 'c', text: 'Stroke', whyNot: 'A single stroke does not cause progressive, diffuse mixed UMN/LMN signs with fasciculations and normal sensation.' },
      { id: 'd', text: 'Parkinson disease', whyNot: 'Parkinson causes bradykinesia, rest tremor, and rigidity, not fasciculations with mixed motor neuron signs.' },
    ],
    discriminator: 'Bulbar symptoms (dysarthria, dysphagia, tongue fasciculations, brisk jaw jerk) plus progressive mixed motor neuron limb signs with normal sensation is bulbar-onset ALS.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.6,
    distractorConceptIds: ['myasthenia-gravis', 'parkinson'],
    source: [
      { ref: 'Miller et al., AAN Practice Parameter Update: The Care of the Patient With ALS', year: 2009 },
    ],
  },

  /* ── Dementia subtypes ────────────────────────────────────────── */
  {
    itemId: 'dementia-1', version: 1, type: 'association', conceptId: 'dementia-subtypes', presentation: 'classic',
    stem: 'An older patient has fluctuating cognition, recurrent well-formed VISUAL hallucinations, spontaneous parkinsonism, and severe sensitivity to antipsychotics. Which dementia is this?',
    vitals: [],
    findings: ['Cognitive fluctuations with early visual hallucinations and parkinsonism.'],
    options: [
      { id: 'a', text: 'Dementia with Lewy bodies', correct: true },
      { id: 'b', text: 'Alzheimer disease', whyNot: 'Alzheimer starts with episodic memory loss; early visual hallucinations, fluctuations, and parkinsonism point to Lewy body disease.' },
      { id: 'c', text: 'Frontotemporal dementia', whyNot: 'FTD presents with early personality/behavior or language change, not visual hallucinations with parkinsonism.' },
      { id: 'd', text: 'Vascular dementia', whyNot: 'Vascular dementia is stepwise with focal deficits, not fluctuating cognition with visual hallucinations and neuroleptic sensitivity.' },
    ],
    discriminator: 'Fluctuating cognition with early well-formed visual hallucinations, spontaneous parkinsonism, and antipsychotic sensitivity is dementia with Lewy bodies.',
    tags: { system: 'neuro', complaint: 'cognitive decline', rotation: ['neuro', 'im', 'psych'], level: 'both' },
    difficultySeed: 0.55,
    source: [
      { ref: 'McKeith et al., Diagnosis and Management of Dementia with Lewy Bodies: Fourth Consensus Report of the DLB Consortium (Neurology)', year: 2017 },
    ],
  },
  {
    itemId: 'dementia-2', version: 1, type: 'discriminator', conceptId: 'dementia-subtypes', presentation: 'atypical',
    stem: 'A 60-year-old has striking early personality change, disinhibition, and loss of empathy, with relatively preserved memory early on. Which dementia does this pattern suggest?',
    vitals: [],
    findings: ['Behavioral and personality change dominates the early course.'],
    options: [
      { id: 'a', text: 'Frontotemporal dementia', correct: true },
      { id: 'b', text: 'Alzheimer disease', whyNot: 'Alzheimer leads with memory loss; prominent early behavior/personality change with spared memory suggests frontotemporal dementia.' },
      { id: 'c', text: 'Dementia with Lewy bodies', whyNot: 'DLB features early visual hallucinations and parkinsonism, not behavioral disinhibition as the lead feature.' },
      { id: 'd', text: 'Normal-pressure hydrocephalus', whyNot: 'NPH presents with the gait–incontinence–cognition triad, not early disinhibition and loss of empathy.' },
    ],
    discriminator: 'Early prominent personality change, disinhibition, and loss of empathy with relatively spared memory is behavioral-variant frontotemporal dementia — memory-first decline is Alzheimer.',
    tags: { system: 'neuro', complaint: 'cognitive decline', rotation: ['neuro', 'psych'], level: 'both' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Rascovsky et al., Sensitivity of Revised Diagnostic Criteria for Behavioural Variant Frontotemporal Dementia (Brain)', year: 2011 },
    ],
  },

  /* ── Normal-pressure hydrocephalus ────────────────────────────── */
  {
    itemId: 'nph-1', version: 1, type: 'one_liner', conceptId: 'nph', presentation: 'classic',
    stem: 'An older adult has a wide-based "magnetic" gait, urinary incontinence, and cognitive slowing. MRI shows ventriculomegaly out of proportion to cortical atrophy. What is the diagnosis?',
    vitals: [],
    findings: ['The classic triad with disproportionate ventricular enlargement.'],
    options: [
      { id: 'a', text: 'Normal-pressure hydrocephalus', correct: true },
      { id: 'b', text: 'Alzheimer disease', whyNot: 'Alzheimer leads with memory loss and cortical atrophy, not a gait-first triad with disproportionate ventriculomegaly.' },
      { id: 'c', text: 'Parkinson disease', whyNot: 'Parkinson has rest tremor, rigidity, and bradykinesia, not the magnetic gait with early incontinence and ventriculomegaly.' },
      { id: 'd', text: 'Vascular dementia', whyNot: 'Vascular dementia is stepwise with focal signs; NPH is the reversible triad with ventricular enlargement.' },
    ],
    discriminator: 'The triad of a magnetic wide-based gait, urinary incontinence, and cognitive slowing with ventriculomegaly out of proportion to atrophy is normal-pressure hydrocephalus — a potentially reversible dementia ("wet, wobbly, wacky").',
    tags: { system: 'neuro', complaint: 'gait disturbance', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['parkinson', 'dementia-subtypes'],
    source: [
      { ref: 'Relkin et al., Diagnosing Idiopathic Normal-Pressure Hydrocephalus (Neurosurgery guideline)', year: 2005 },
    ],
  },

  /* ── Huntington ───────────────────────────────────────────────── */
  {
    itemId: 'hunt-1', version: 1, type: 'one_liner', conceptId: 'huntington', presentation: 'classic',
    stem: 'A 38-year-old develops irritability and involuntary dance-like movements. His father had a similar illness beginning at 45. MRI shows caudate atrophy with enlarged frontal horns. What is the diagnosis?',
    vitals: [],
    findings: ['Chorea, psychiatric change, and an autosomal-dominant family history.'],
    options: [
      { id: 'a', text: 'Huntington disease', correct: true },
      { id: 'b', text: 'Sydenham chorea', whyNot: 'Sydenham chorea follows streptococcal infection in children and is self-limited, without caudate atrophy or a dominant family history.' },
      { id: 'c', text: 'Wilson disease', whyNot: 'Wilson causes tremor/dystonia with liver disease, Kayser–Fleischer rings, and low ceruloplasmin, not autosomal-dominant chorea with caudate atrophy.' },
      { id: 'd', text: 'Tardive dyskinesia', whyNot: 'Tardive dyskinesia follows dopamine-blocker exposure and lacks the family history and caudate atrophy.' },
    ],
    discriminator: 'Adult-onset chorea with psychiatric change, caudate atrophy, and an autosomal-dominant family history is Huntington disease (a CAG trinucleotide-repeat disorder with anticipation).',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'psych'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['wilson-disease'],
    source: [
      { ref: 'Bates et al., Huntington Disease (Nature Reviews Disease Primers)', year: 2015 },
    ],
  },
  {
    itemId: 'hunt-2', version: 1, type: 'association', conceptId: 'huntington', presentation: 'atypical',
    stem: 'A family shows Huntington disease appearing at younger ages and more severely in each successive generation, especially with paternal transmission. What genetic phenomenon explains this?',
    vitals: [],
    findings: ['Earlier onset and greater severity down the generations.'],
    options: [
      { id: 'a', text: 'Anticipation from expansion of a CAG trinucleotide repeat', correct: true },
      { id: 'b', text: 'Genomic imprinting', whyNot: 'Imprinting silences a parental allele (as in Prader–Willi/Angelman); it does not explain progressive earlier onset across generations.' },
      { id: 'c', text: 'Mitochondrial inheritance', whyNot: 'Mitochondrial disease is maternally transmitted; here paternal transmission gives the most anticipation.' },
      { id: 'd', text: 'Incomplete penetrance', whyNot: 'Penetrance describes whether the disease appears, not the progressively earlier, more severe onset that defines anticipation.' },
    ],
    discriminator: 'Progressively earlier and more severe onset across generations — most with paternal transmission — is anticipation from CAG trinucleotide-repeat expansion in Huntington disease.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['neuro'], level: 'both' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Bates et al., Huntington Disease (Nature Reviews Disease Primers)', year: 2015 },
    ],
  },

  /* ── IIH ──────────────────────────────────────────────────────── */
  {
    itemId: 'iih-1', version: 1, type: 'one_liner', conceptId: 'iih', presentation: 'classic',
    stem: 'An obese 28-year-old woman has daily headaches, transient graying of vision, and pulsatile tinnitus. Exam shows papilledema; neuroimaging is normal and lumbar puncture shows a high opening pressure with normal CSF composition. What is the diagnosis?',
    vitals: [v('Opening pressure', '32 cmH₂O', true)],
    findings: ['Papilledema with raised opening pressure and normal imaging and CSF.'],
    options: [
      { id: 'a', text: 'Idiopathic intracranial hypertension', correct: true },
      { id: 'b', text: 'Cerebral venous sinus thrombosis', whyNot: 'CVST is an important mimic but shows a thrombus on venography; IIH requires normal imaging including venous drainage.' },
      { id: 'c', text: 'Migraine', whyNot: 'Migraine does not cause papilledema or a raised opening pressure.' },
      { id: 'd', text: 'A brain tumor', whyNot: 'A mass would appear on neuroimaging; IIH has normal imaging with raised pressure.' },
    ],
    discriminator: 'Headache with papilledema and a raised opening pressure but normal CSF composition and normal imaging in a young obese woman is idiopathic intracranial hypertension — after excluding venous sinus thrombosis.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Friedman et al., Revised Diagnostic Criteria for the Pseudotumor Cerebri Syndrome (Neurology)', year: 2013 },
    ],
  },
  {
    itemId: 'iih-2', version: 1, type: 'tx_next_step', conceptId: 'iih', presentation: 'atypical',
    stem: 'A patient with idiopathic intracranial hypertension has headaches and early visual field changes. Besides weight loss, what is the first-line medical therapy?',
    vitals: [],
    findings: ['Mild visual field constriction on formal perimetry.'],
    options: [
      { id: 'a', text: 'Acetazolamide (plus weight management)', correct: true },
      { id: 'b', text: 'Prophylactic triptans', whyNot: 'Triptans treat migraine attacks; they do not lower CSF pressure or protect vision in IIH.' },
      { id: 'c', text: 'Long-term opioids', whyNot: 'Opioids do not address the raised pressure and risk medication-overuse headache.' },
      { id: 'd', text: 'Immediate optic nerve sheath fenestration for everyone', whyNot: 'Surgery is reserved for progressive vision loss despite medical therapy, not first-line for all.' },
    ],
    discriminator: 'Idiopathic intracranial hypertension is treated with weight loss and acetazolamide to lower CSF production, escalating to surgery only when vision is threatened despite medical therapy.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'NORDIC Idiopathic Intracranial Hypertension Study Group, Effect of Acetazolamide on Visual Function in IIH (IIHTT, JAMA)', year: 2014 },
    ],
  },

  /* ── Trigeminal neuralgia ─────────────────────────────────────── */
  {
    itemId: 'tgn-1', version: 1, type: 'one_liner', conceptId: 'trigeminal-neuralgia', presentation: 'classic',
    stem: 'A 60-year-old has recurrent paroxysms of severe, brief electric-shock pain over the right cheek and jaw, triggered by chewing and light touch. The neurologic exam is normal between attacks. What is the diagnosis and first-line drug?',
    vitals: [],
    findings: ['Stereotyped, trigger-evoked, lancinating unilateral V2/V3 pain.'],
    options: [
      { id: 'a', text: 'Trigeminal neuralgia — treat with carbamazepine', correct: true },
      { id: 'b', text: 'Cluster headache — high-flow oxygen', whyNot: 'Cluster headache is periorbital with autonomic tearing/rhinorrhea and lasts 15–180 minutes, not touch-triggered electric-shock jabs.' },
      { id: 'c', text: 'Dental abscess — antibiotics', whyNot: 'A dental abscess causes constant throbbing pain with local signs, not stereotyped touch-triggered paroxysms with a normal exam.' },
      { id: 'd', text: 'Giant cell arteritis — steroids', whyNot: 'GCA causes jaw claudication with systemic symptoms and a high ESR in older patients, not brief shock-like V2/V3 jabs.' },
    ],
    discriminator: 'Brief, severe, electric-shock unilateral facial pain in the V2/V3 distribution triggered by light touch with a normal exam is trigeminal neuralgia, treated first with carbamazepine.',
    tags: { system: 'neuro', complaint: 'facial pain', rotation: ['neuro', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['cluster-headache', 'giant-cell-arteritis'],
    source: [
      { ref: 'Cruccu et al., Trigeminal Neuralgia: New Classification and Diagnostic Grading (Neurology)', year: 2016 },
    ],
  },

  /* ── Osmotic demyelination ────────────────────────────────────── */
  {
    itemId: 'odsyn-1', version: 1, type: 'discriminator', conceptId: 'central-pontine-myelinolysis', presentation: 'severe',
    stem: 'A malnourished alcoholic with chronic hyponatremia (Na 108) is corrected to 130 within 12 hours. Two days later he develops dysarthria, dysphagia, and spastic quadriparesis. What happened?',
    vitals: [v('Na change', '108 → 130 / 12 h', true)],
    findings: ['A new brainstem syndrome appearing DAYS after overrapid sodium correction.'],
    options: [
      { id: 'a', text: 'Osmotic demyelination syndrome (central pontine myelinolysis)', correct: true },
      { id: 'b', text: 'Acute brainstem stroke', whyNot: 'The deficit followed overrapid sodium correction with a characteristic delay, not a sudden vascular occlusion.' },
      { id: 'c', text: 'Recurrent hyponatremia', whyNot: 'The sodium was raised, not lowered; the injury is from correcting it too fast.' },
      { id: 'd', text: 'Wernicke encephalopathy', whyNot: 'Wernicke gives confusion, ophthalmoplegia, and ataxia, not the delayed spastic quadriparesis/dysarthria of osmotic demyelination.' },
    ],
    discriminator: 'A delayed dysarthria–dysphagia–spastic quadriparesis syndrome days after overrapid correction of chronic hyponatremia is osmotic demyelination — which is why the correction rate is capped at ~6–8 mmol/L per 24 h.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    distractorConceptIds: ['siadh', 'wernicke'],
    source: [
      { ref: 'Sterns, Disorders of Plasma Sodium (NEJM review)', year: 2015 },
      { ref: 'Spasovski et al., European Hyponatraemia Guideline (ESICM/ESE/ERA-EDTA)', year: 2014 },
    ],
  },
];

const alsoSystems: Record<string, System[]> = {
  'central-pontine-myelinolysis': ['renal'],
};

export const NEURO_DEPTH: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
