/* ══════════════════════════════════════════════════════════════
   Neuroscience — breadth pour (knowledge-graph driven).

   New high-yield neuro concepts chosen from the usmle-knowledge-graph
   disease scaffold (its board-priority-ranked disease list). The graph
   supplied WHICH diseases to add; every clinical fact here is authored
   from PUBLIC sources — the graph's own prose/edges are placeholder and
   were not copied. Each concept is drilled several ways.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (AHA/ASA, AAN,
   ILAE/AES, AAO, CDC, primary literature). Synthetic patients; enters
   the multi-reviewer pipeline UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'brainstem-stroke', name: 'Brainstem stroke syndromes', system: 'neuro', topic: 'Cerebrovascular disease',
    illnessScript: {
      epidemiology: 'Vertebrobasilar occlusion; classic crossed (ipsilateral cranial nerve + contralateral body) deficits.',
      timeCourse: 'Sudden onset with a recognizable named pattern.',
      keyFindings: ['Wallenberg (lateral medullary): ipsilateral facial pain/temp loss + Horner + dysphagia, contralateral body pain/temp loss, vertigo', 'Weber (midbrain): ipsilateral CN III palsy + contralateral hemiparesis', 'Locked-in (ventral pons): quadriplegia + anarthria with preserved consciousness and vertical gaze'],
      classicDistractors: ['Hemispheric MCA stroke', 'Psychogenic unresponsiveness'],
    },
  },
  {
    conceptId: 'lacunar-syndrome', name: 'Lacunar syndromes', system: 'neuro', topic: 'Cerebrovascular disease',
    illnessScript: {
      epidemiology: 'Small-vessel lipohyalinosis from chronic hypertension and diabetes.',
      timeCourse: 'Sudden focal deficit WITHOUT cortical signs.',
      keyFindings: ['Pure motor (internal capsule) or pure sensory (thalamus)', 'No aphasia, neglect, or visual field cut', 'Small deep infarct on imaging'],
      classicDistractors: ['Cortical (MCA) stroke with cortical signs', 'Watershed infarct'],
    },
  },
  {
    conceptId: 'watershed-infarct', name: 'Watershed (border-zone) infarction', system: 'neuro', topic: 'Cerebrovascular disease',
    illnessScript: {
      epidemiology: 'Global hypoperfusion — cardiac arrest, severe hypotension, carotid stenosis.',
      timeCourse: 'Deficit follows a hypotensive event.',
      keyFindings: ['Border-zone infarcts (ACA-MCA, MCA-PCA)', 'Proximal "man-in-a-barrel" weakness', 'Follows a documented hypotensive insult'],
      classicDistractors: ['Embolic territorial stroke', 'Lacunar infarct'],
    },
  },
  {
    conceptId: 'absence-seizure', name: 'Absence (petit mal) epilepsy', system: 'neuro', topic: 'Generalized epilepsy',
    illnessScript: {
      epidemiology: 'School-age children; genetic generalized epilepsy.',
      timeCourse: 'Brief (seconds) staring spells, many per day, no postictal state.',
      keyFindings: ['Staring spells provoked by hyperventilation', '3-Hz generalized spike-and-wave on EEG', 'No aura or postictal confusion'],
      classicDistractors: ['Focal (temporal-lobe) dyscognitive seizures with postictal confusion', 'Daydreaming'],
    },
  },
  {
    conceptId: 'jme', name: 'Juvenile myoclonic epilepsy', system: 'neuro', topic: 'Generalized epilepsy',
    illnessScript: {
      epidemiology: 'Adolescence; a common genetic generalized epilepsy.',
      timeCourse: 'Morning myoclonic jerks; generalized tonic-clonic seizures on awakening.',
      keyFindings: ['Early-morning myoclonic jerks (dropping objects)', 'Triggered by sleep deprivation and alcohol', 'Usually lifelong, treatment-responsive'],
      classicDistractors: ['Absence epilepsy', 'Psychogenic events'],
    },
  },
  {
    conceptId: 'febrile-seizure', name: 'Febrile seizure', system: 'neuro', topic: 'Pediatric seizure',
    illnessScript: {
      epidemiology: 'Children 6 months–5 years during a febrile illness; usually benign.',
      timeCourse: 'Occurs with fever; simple type is brief and self-limited.',
      keyFindings: ['Simple: generalized, < 15 min, once in 24 h, normal exam', 'Complex: focal, prolonged, or recurrent within 24 h', 'No chronic antiepileptic for simple febrile seizures'],
      classicDistractors: ['CNS infection (meningitis)', 'Epilepsy'],
    },
  },
  {
    conceptId: 'cord-syndromes', name: 'Spinal cord syndromes', system: 'neuro', topic: 'Myelopathy',
    illnessScript: {
      epidemiology: 'Trauma, ischemia (anterior spinal artery), B12 deficiency, hyperextension in the elderly.',
      timeCourse: 'The lesion pattern maps to which tracts are hit.',
      keyFindings: ['Brown-Séquard (hemisection): ipsilateral motor + dorsal-column loss, contralateral pain/temp loss', 'Anterior cord: bilateral motor + pain/temp loss, dorsal columns spared', 'Central cord: cape-like, arms > legs (elderly hyperextension)'],
      classicDistractors: ['Guillain–Barré (peripheral, areflexic)', 'Cauda equina (LMN, saddle anesthesia)'],
    },
  },
  {
    conceptId: 'alzheimer-disease', name: 'Alzheimer disease', system: 'neuro', topic: 'Neurocognitive disorders',
    illnessScript: {
      epidemiology: 'The most common dementia; age is the dominant risk factor.',
      timeCourse: 'Insidious, gradually progressive memory-first decline over years.',
      keyFindings: ['Early episodic (short-term) memory loss', 'Hippocampal/temporoparietal atrophy', 'Amyloid plaques and neurofibrillary (tau) tangles'],
      classicDistractors: ['Vascular dementia (stepwise)', 'Lewy body (hallucinations, parkinsonism)', 'Frontotemporal (behavior/language first)'],
    },
  },
  {
    conceptId: 'optic-neuritis', name: 'Optic neuritis', system: 'neuro', topic: 'Demyelinating disease',
    illnessScript: {
      epidemiology: 'Young adults; often the first attack of multiple sclerosis.',
      timeCourse: 'Subacute monocular visual loss over hours to days.',
      keyFindings: ['Painful monocular vision loss (pain on eye movement)', 'Relative afferent pupillary defect; red desaturation', 'MRI links it to MS risk'],
      classicDistractors: ['Central retinal artery occlusion (painless, sudden)', 'Acute angle-closure glaucoma'],
    },
  },
  {
    conceptId: 'carpal-tunnel', name: 'Carpal tunnel syndrome', system: 'neuro', topic: 'Peripheral neuropathy',
    illnessScript: {
      epidemiology: 'Median nerve compression at the wrist; repetitive use, pregnancy, hypothyroidism, diabetes.',
      timeCourse: 'Progressive nocturnal paresthesias, later thenar weakness.',
      keyFindings: ['Numbness/tingling of the thumb, index, middle fingers', 'Positive Phalen and Tinel signs', 'Thenar atrophy in advanced disease'],
      classicDistractors: ['C6 radiculopathy', 'Ulnar neuropathy'],
    },
  },
  {
    conceptId: 'neurosyphilis', name: 'Neurosyphilis', system: 'neuro', topic: 'CNS infection',
    illnessScript: {
      epidemiology: 'Untreated Treponema pallidum, often years after primary infection; higher risk in HIV.',
      timeCourse: 'Late — tabes dorsalis and general paresis.',
      keyFindings: ['Tabes dorsalis: dorsal-column loss, sensory ataxia, lancinating pains', 'Argyll Robertson pupil (accommodates, does not react to light)', 'Reactive CSF-VDRL'],
      classicDistractors: ['B12 subacute combined degeneration', 'Diabetic neuropathy'],
    },
  },
];

const subtopics: Record<string, string> = {
  'brainstem-stroke': 'neuro.stroke',
  'lacunar-syndrome': 'neuro.stroke',
  'watershed-infarct': 'neuro.stroke',
  'absence-seizure': 'neuro.seizure',
  'jme': 'neuro.seizure',
  'febrile-seizure': 'neuro.seizure',
  'cord-syndromes': 'neuro.neuromuscular',
  'alzheimer-disease': 'neuro.altered',
  'optic-neuritis': 'neuro.demyelinating',
  'carpal-tunnel': 'neuro.neuromuscular',
  'neurosyphilis': 'neuro.infection-neuro',
};

const alsoSystems: Record<string, System[]> = {
  'febrile-seizure': ['pediatrics'],
  'absence-seizure': ['pediatrics'],
  'neurosyphilis': ['infectious'],
};

const items: RawItem[] = [
  /* ── Brainstem stroke ─────────────────────────────────────────── */
  {
    itemId: 'brainstem-assoc', version: 1, type: 'association', conceptId: 'brainstem-stroke', presentation: 'classic',
    stem: 'A patient has sudden vertigo, hoarseness, and dysphagia with ipsilateral facial numbness and Horner syndrome, plus contralateral loss of pain and temperature on the body. Which stroke is this?',
    vitals: [],
    findings: ['"Crossed" findings: ipsilateral face, contralateral body.'],
    options: [
      { id: 'a', text: 'Lateral medullary (Wallenberg) syndrome — PICA/vertebral', correct: true },
      { id: 'b', text: 'Middle cerebral artery stroke', whyNot: 'An MCA stroke gives contralateral face/arm weakness and cortical signs, not crossed brainstem findings with Horner and dysphagia.' },
      { id: 'c', text: 'Anterior cerebral artery stroke', whyNot: 'ACA strokes cause contralateral leg weakness, not the vertigo/dysphagia/crossed sensory pattern.' },
      { id: 'd', text: 'Lacunar pure motor stroke', whyNot: 'Lacunar strokes give pure motor or sensory deficits without vertigo, Horner, or crossed signs.' },
    ],
    discriminator: 'Ipsilateral facial sensory loss, Horner, and dysphagia with contralateral body pain/temperature loss and vertigo is lateral medullary (Wallenberg) syndrome from vertebral/PICA occlusion.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['neuro', 'em'], level: 'both' },
    difficultySeed: 0.6,
    distractorConceptIds: ['stroke-localization', 'lacunar-syndrome'],
    source: [{ ref: 'Caplan, Vertebrobasilar Ischemia and Stroke (AHA/ASA scientific statement basis / review)', year: 2015 }],
  },
  {
    itemId: 'brainstem-ol', version: 1, type: 'one_liner', conceptId: 'brainstem-stroke', presentation: 'severe',
    stem: 'After a basilar artery event, a patient is quadriplegic and unable to speak but is awake and can move the eyes vertically and blink to command. What is this state?',
    vitals: [],
    findings: ['Preserved consciousness and vertical gaze with total motor paralysis.'],
    options: [
      { id: 'a', text: 'Locked-in syndrome (ventral pons)', correct: true },
      { id: 'b', text: 'Coma', whyNot: 'The patient is conscious and communicates with vertical eye movements/blinks — the opposite of coma.' },
      { id: 'c', text: 'Persistent vegetative state', whyNot: 'A vegetative state lacks awareness; locked-in patients are fully aware.' },
      { id: 'd', text: 'Psychogenic unresponsiveness', whyNot: 'There is a structural ventral pontine lesion with preserved vertical gaze, not a functional disorder.' },
    ],
    discriminator: 'Quadriplegia and anarthria with preserved consciousness and vertical eye movements/blinking after a ventral pontine (basilar) stroke is locked-in syndrome — awareness is intact.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
  },

  /* ── Lacunar ──────────────────────────────────────────────────── */
  {
    itemId: 'lacunar-ol', version: 1, type: 'one_liner', conceptId: 'lacunar-syndrome', presentation: 'classic',
    stem: 'A hypertensive diabetic has pure loss of sensation over the entire left face, arm, and leg with no weakness, aphasia, or visual field cut. Where is the lesion?',
    vitals: [v('BP', '168/96', false)],
    findings: ['Isolated hemisensory loss without cortical signs.'],
    options: [
      { id: 'a', text: 'A lacunar infarct of the thalamus (VPL)', correct: true },
      { id: 'b', text: 'A cortical parietal stroke', whyNot: 'Cortical strokes add signs like neglect, aphasia, or graphesthesia loss; pure hemisensory loss localizes to the thalamus.' },
      { id: 'c', text: 'A peripheral neuropathy', whyNot: 'A hemibody distribution (face + arm + leg on one side) is central, not a peripheral nerve pattern.' },
      { id: 'd', text: 'A brainstem syndrome', whyNot: 'Brainstem lesions give crossed findings and cranial-nerve signs, not isolated contralateral hemisensory loss.' },
    ],
    discriminator: 'Pure hemisensory loss of face, arm, and leg without any cortical sign is a thalamic (VPL) lacunar stroke — small-vessel disease produces pure syndromes without cortical features.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['stroke-localization'],
    source: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
  },
  {
    itemId: 'lacunar-tx', version: 1, type: 'tx_next_step', conceptId: 'lacunar-syndrome', presentation: 'atypical',
    stem: 'A patient recovers from a small-vessel (lacunar) stroke. What is the cornerstone of secondary prevention?',
    vitals: [v('BP', '158/94', true)],
    findings: ['Small deep infarct on MRI; no carotid stenosis or atrial fibrillation.'],
    options: [
      { id: 'a', text: 'Aggressive blood-pressure and diabetes control, statin, and antiplatelet therapy', correct: true },
      { id: 'b', text: 'Long-term anticoagulation with warfarin', whyNot: 'Anticoagulation is for cardioembolic sources (e.g., atrial fibrillation); lacunar disease is treated with risk-factor control and antiplatelets.' },
      { id: 'c', text: 'Carotid endarterectomy', whyNot: 'Endarterectomy addresses significant carotid stenosis, not small-vessel lacunar disease.' },
      { id: 'd', text: 'No secondary prevention needed', whyNot: 'Untreated vascular risk factors drive recurrent lacunar strokes and vascular dementia.' },
    ],
    discriminator: 'Lacunar stroke is small-vessel disease, so prevention targets blood pressure, glucose, lipids, and antiplatelet therapy — not the anticoagulation or endarterectomy used for cardioembolic or carotid sources.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Kleindorfer et al., AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA', year: 2021 }],
  },

  /* ── Watershed ────────────────────────────────────────────────── */
  {
    itemId: 'watershed-ol', version: 1, type: 'discriminator', conceptId: 'watershed-infarct', presentation: 'atypical',
    stem: 'After resuscitation from cardiac arrest, a patient has bilateral proximal arm and leg weakness ("man in a barrel") with relatively preserved distal function. What kind of infarction is this?',
    vitals: [],
    findings: ['Deficit followed a period of profound hypotension.'],
    options: [
      { id: 'a', text: 'Watershed (border-zone) infarction', correct: true },
      { id: 'b', text: 'A single MCA territory embolic stroke', whyNot: 'A territorial embolus produces a unilateral cortical syndrome, not bilateral proximal-predominant weakness after global hypotension.' },
      { id: 'c', text: 'Lacunar infarct', whyNot: 'Lacunar disease gives a small pure deficit, not the bilateral proximal border-zone pattern.' },
      { id: 'd', text: 'Guillain–Barré syndrome', whyNot: 'GBS is a peripheral areflexic ascending weakness, not a post-arrest central border-zone infarct.' },
    ],
    discriminator: 'Bilateral proximal ("man-in-a-barrel") weakness after global hypotension is watershed infarction of the ACA-MCA border zones, distinct from a single embolic territorial stroke.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
  },

  /* ── Absence ──────────────────────────────────────────────────── */
  {
    itemId: 'absence-ol', version: 1, type: 'one_liner', conceptId: 'absence-seizure', presentation: 'classic',
    stem: 'A 7-year-old has frequent brief episodes of staring and eyelid flutter lasting a few seconds, with immediate return to normal and no postictal confusion. Hyperventilation reproduces one. EEG shows 3-Hz spike-and-wave. What is the diagnosis?',
    vitals: [],
    findings: ['Very brief staring spells, many per day, provoked by hyperventilation.'],
    options: [
      { id: 'a', text: 'Absence (petit mal) epilepsy', correct: true },
      { id: 'b', text: 'Focal (temporal-lobe) dyscognitive seizures', whyNot: 'Focal dyscognitive seizures last longer with automatisms and POSTICTAL confusion; absence is brief with instant recovery.' },
      { id: 'c', text: 'Daydreaming', whyNot: 'Daydreaming is not reproduced by hyperventilation and lacks the 3-Hz spike-and-wave EEG.' },
      { id: 'd', text: 'Syncope', whyNot: 'Syncope causes loss of postural tone and a fall, not brief staring with preserved posture.' },
    ],
    discriminator: 'Brief staring spells with instant recovery, hyperventilation provocation, and 3-Hz generalized spike-and-wave are absence epilepsy — distinct from the longer, postictal focal dyscognitive seizures.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['peds', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Glauser et al., ILAE Treatment Guidelines: Evidence-Based Analysis of Antiepileptic Drug Efficacy', year: 2013 }],
  },
  {
    itemId: 'absence-tx', version: 1, type: 'tx_next_step', conceptId: 'absence-seizure', presentation: 'classic',
    stem: 'A child with typical absence epilepsy (and no generalized tonic-clonic seizures) needs treatment. What is first-line?',
    vitals: [],
    findings: ['Pure absence seizures without other seizure types.'],
    options: [
      { id: 'a', text: 'Ethosuximide', correct: true },
      { id: 'b', text: 'Carbamazepine', whyNot: 'Carbamazepine can WORSEN absence (and myoclonic) seizures and is avoided in generalized epilepsies.' },
      { id: 'c', text: 'Phenytoin', whyNot: 'Phenytoin is ineffective for absence seizures and can aggravate generalized epilepsy.' },
      { id: 'd', text: 'No treatment is ever needed', whyNot: 'Frequent absences impair learning and safety and warrant treatment.' },
    ],
    discriminator: 'Ethosuximide is first-line for pure absence epilepsy (valproate if generalized tonic-clonic seizures coexist), while narrow-spectrum drugs like carbamazepine can worsen absence.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['peds', 'neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Glauser et al., Ethosuximide, Valproic Acid, and Lamotrigine in Childhood Absence Epilepsy (NEJM)', year: 2010 }],
  },

  /* ── JME ──────────────────────────────────────────────────────── */
  {
    itemId: 'jme-ol', version: 1, type: 'one_liner', conceptId: 'jme', presentation: 'classic',
    stem: 'A teenager has morning myoclonic jerks (spilling breakfast) and has now had a generalized tonic-clonic seizure after a night of sleep deprivation and alcohol. EEG shows generalized polyspike-wave. What is the diagnosis?',
    vitals: [],
    findings: ['Early-morning myoclonus with a GTC provoked by sleep loss/alcohol.'],
    options: [
      { id: 'a', text: 'Juvenile myoclonic epilepsy', correct: true },
      { id: 'b', text: 'Focal epilepsy', whyNot: 'The generalized polyspike-wave with morning myoclonus and provocation by sleep deprivation is a generalized epilepsy, not focal.' },
      { id: 'c', text: 'Absence epilepsy alone', whyNot: 'Absence lacks the prominent morning myoclonic jerks and GTCs that define JME.' },
      { id: 'd', text: 'Psychogenic nonepileptic events', whyNot: 'The stereotyped morning myoclonus with an epileptiform EEG is epileptic, not psychogenic.' },
    ],
    discriminator: 'Morning myoclonic jerks plus generalized tonic-clonic seizures triggered by sleep deprivation and alcohol, with generalized polyspike-wave, is juvenile myoclonic epilepsy — usually lifelong.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['neuro', 'peds'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Glauser et al., ILAE Treatment Guidelines (Antiepileptic Drug Efficacy)', year: 2013 }],
  },

  /* ── Febrile seizure ──────────────────────────────────────────── */
  {
    itemId: 'febrile-ddx', version: 1, type: 'discriminator', conceptId: 'febrile-seizure', presentation: 'classic',
    stem: 'An 18-month-old has a single 3-minute generalized seizure during a fever from otitis media, recovers fully, and has a normal neurologic exam. What best classifies this and guides management?',
    vitals: [v('Temp', '39.5', true)],
    findings: ['Brief generalized seizure with fever and a normal exam and no meningeal signs.'],
    options: [
      { id: 'a', text: 'A simple febrile seizure — reassurance, no chronic antiepileptic or routine LP', correct: true },
      { id: 'b', text: 'A complex febrile seizure requiring admission', whyNot: 'Complex features are focal, prolonged (> 15 min), or recurrent within 24 h; this brief generalized event is simple.' },
      { id: 'c', text: 'Epilepsy requiring lifelong medication', whyNot: 'A simple febrile seizure does not equal epilepsy and does not warrant chronic antiepileptics.' },
      { id: 'd', text: 'Mandatory lumbar puncture for all', whyNot: 'LP is reserved for meningeal signs or a toxic-appearing child, not every simple febrile seizure.' },
    ],
    discriminator: 'A simple febrile seizure (brief, generalized, once in 24 h, normal exam, ages 6 months–5 years) needs only reassurance, whereas focal, prolonged, or recurrent (complex) features prompt further workup.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['peds', 'em'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['bacterial-meningitis'],
    source: [{ ref: 'AAP Clinical Practice Guideline: Neurodiagnostic Evaluation of the Child With a Simple Febrile Seizure', year: 2011 }],
  },

  /* ── Spinal cord syndromes ────────────────────────────────────── */
  {
    itemId: 'cord-assoc', version: 1, type: 'association', conceptId: 'cord-syndromes', presentation: 'classic',
    stem: 'After a penetrating injury, a patient has ipsilateral weakness and loss of vibration/proprioception below the lesion, with contralateral loss of pain and temperature. Which cord syndrome is this?',
    vitals: [],
    findings: ['Hemisection pattern of the cord.'],
    options: [
      { id: 'a', text: 'Brown-Séquard syndrome (cord hemisection)', correct: true },
      { id: 'b', text: 'Anterior cord syndrome', whyNot: 'Anterior cord spares the dorsal columns (vibration/proprioception preserved); Brown-Séquard loses them ipsilaterally.' },
      { id: 'c', text: 'Central cord syndrome', whyNot: 'Central cord gives cape-like, arms-greater-than-legs deficits in the elderly, not a hemisection pattern.' },
      { id: 'd', text: 'Cauda equina syndrome', whyNot: 'Cauda equina is a LMN syndrome with saddle anesthesia and bladder dysfunction, not a crossed hemisection.' },
    ],
    discriminator: 'Ipsilateral motor and dorsal-column loss with contralateral pain/temperature loss below the lesion is Brown-Séquard (hemisection) — the spinothalamic tract crosses, the corticospinal and dorsal columns do not.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['neuro', 'surg'], level: 'both' },
    difficultySeed: 0.6,
    distractorConceptIds: ['cauda-equina'],
    source: [{ ref: 'Kirshblum et al., International Standards for Neurological Classification of Spinal Cord Injury (ASIA)', year: 2011 }],
  },

  /* ── Cauda equina ─────────────────────────────────────────────── */
  {
    itemId: 'cauda-cm', version: 1, type: 'cant_miss', conceptId: 'cauda-equina', presentation: 'severe',
    stem: 'A patient with acute low-back pain now has saddle anesthesia, bilateral leg weakness, and new urinary retention. What must you do?',
    vitals: [],
    findings: ['Bilateral radicular deficit with sphincter involvement.'],
    options: [
      { id: 'a', text: 'Emergent MRI and urgent surgical decompression', correct: true },
      { id: 'b', text: 'Prescribe NSAIDs and arrange outpatient physiotherapy', whyNot: 'Saddle anesthesia with urinary retention is cauda equina syndrome — a surgical emergency where delay causes permanent deficits.' },
      { id: 'c', text: 'Bed rest and reassess in a week', whyNot: 'A week’s delay risks irreversible bladder/bowel and motor dysfunction.' },
      { id: 'd', text: 'Plain lumbar radiographs only', whyNot: 'Plain films miss the compressive lesion; MRI is needed urgently to guide decompression.' },
    ],
    discriminator: 'Low-back pain with saddle anesthesia, bilateral leg weakness, and urinary retention is cauda equina syndrome — an emergency requiring immediate MRI and surgical decompression.',
    tags: { system: 'msk_rheum', complaint: 'back pain', rotation: ['em', 'surg', 'neuro'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Todd, Guidelines for the Management of Cauda Equina Syndrome (British Association of Spine Surgeons)', year: 2017 }],
  },
  {
    itemId: 'cauda-ddx', version: 1, type: 'discriminator', conceptId: 'cauda-equina', presentation: 'atypical',
    stem: 'How does cauda equina syndrome differ from conus medullaris syndrome?',
    vitals: [],
    findings: ['Both cause lower-limb and bladder symptoms.'],
    options: [
      { id: 'a', text: 'Cauda equina is asymmetric LMN with late bladder involvement; conus is symmetric with mixed UMN/LMN and EARLY bladder dysfunction', correct: true },
      { id: 'b', text: 'Cauda equina causes purely upper-motor-neuron signs', whyNot: 'Cauda equina compresses nerve roots (LMN): areflexia and flaccid weakness, not UMN signs.' },
      { id: 'c', text: 'Conus medullaris spares the bladder entirely', whyNot: 'Conus lesions characteristically cause EARLY, prominent bladder dysfunction.' },
      { id: 'd', text: 'They are clinically identical', whyNot: 'Symmetry, reflex pattern, and timing of bladder involvement distinguish them.' },
    ],
    discriminator: 'Cauda equina is an asymmetric lower-motor-neuron root syndrome with later bladder involvement, whereas conus medullaris is more symmetric with mixed UMN/LMN signs and early bladder dysfunction.',
    tags: { system: 'neuro', complaint: 'back pain', rotation: ['neuro', 'surg'], level: 'clerkship' },
    difficultySeed: 0.62,
    source: [{ ref: 'Brouwers et al., Definitions of Cauda Equina and Conus Medullaris Syndromes (systematic review)', year: 2017 }],
  },

  /* ── Alzheimer ────────────────────────────────────────────────── */
  {
    itemId: 'alz-ol', version: 1, type: 'one_liner', conceptId: 'alzheimer-disease', presentation: 'classic',
    stem: 'A 74-year-old has an insidious multi-year decline that began with forgetting recent conversations and appointments, later with word-finding difficulty; MRI shows medial temporal atrophy. What is the most likely dementia?',
    vitals: [],
    findings: ['Memory-first, gradually progressive cognitive decline with hippocampal atrophy.'],
    options: [
      { id: 'a', text: 'Alzheimer disease', correct: true },
      { id: 'b', text: 'Vascular dementia', whyNot: 'Vascular dementia declines in stepwise fashion with focal signs and vascular lesions, not a smooth memory-first course.' },
      { id: 'c', text: 'Frontotemporal dementia', whyNot: 'FTD leads with personality/behavior or language change, with memory relatively spared early.' },
      { id: 'd', text: 'Normal-pressure hydrocephalus', whyNot: 'NPH presents with the gait–incontinence–cognition triad and ventriculomegaly, not memory-first atrophy.' },
    ],
    discriminator: 'Insidious, gradually progressive episodic-memory-first decline with medial temporal (hippocampal) atrophy is Alzheimer disease — the most common dementia.',
    tags: { system: 'neuro', complaint: 'cognitive decline', rotation: ['neuro', 'im', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    distractorConceptIds: ['dementia-subtypes', 'nph'],
    source: [{ ref: 'McKhann et al., NIA-AA Diagnostic Guidelines for Alzheimer’s Disease (Alzheimers Dement)', year: 2011 }],
  },
  {
    itemId: 'alz-tx', version: 1, type: 'tx_next_step', conceptId: 'alzheimer-disease', presentation: 'atypical',
    stem: 'A patient with mild-to-moderate Alzheimer disease is started on symptomatic therapy. Which class is first-line?',
    vitals: [],
    findings: ['Established Alzheimer dementia, mild-to-moderate stage.'],
    options: [
      { id: 'a', text: 'A cholinesterase inhibitor (donepezil, rivastigmine, or galantamine)', correct: true },
      { id: 'b', text: 'A first-generation antipsychotic for routine treatment', whyNot: 'Antipsychotics carry increased mortality in dementia and are not cognitive therapy; reserved for severe refractory agitation.' },
      { id: 'c', text: 'A benzodiazepine daily', whyNot: 'Benzodiazepines worsen cognition and fall risk in the elderly.' },
      { id: 'd', text: 'High-dose anticholinergics', whyNot: 'Anticholinergics worsen memory — the opposite of cholinesterase inhibition — and are avoided.' },
    ],
    discriminator: 'Alzheimer disease is treated symptomatically with cholinesterase inhibitors (adding memantine in moderate-to-severe disease); these modestly help symptoms and do not cure the disease.',
    tags: { system: 'neuro', complaint: 'cognitive decline', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [{ ref: 'AAN — Practice Guideline Update: Mild Cognitive Impairment', year: 2018 }],
  },

  /* ── Optic neuritis ───────────────────────────────────────────── */
  {
    itemId: 'on-ol', version: 1, type: 'one_liner', conceptId: 'optic-neuritis', presentation: 'classic',
    stem: 'A 28-year-old woman has subacute blurring of vision in one eye over 2 days with PAIN on eye movement, reduced color vision, and a relative afferent pupillary defect. What is the diagnosis?',
    vitals: [],
    findings: ['Painful monocular vision loss with an afferent pupillary defect and dyschromatopsia.'],
    options: [
      { id: 'a', text: 'Optic neuritis', correct: true },
      { id: 'b', text: 'Central retinal artery occlusion', whyNot: 'CRAO is SUDDEN, painless, complete monocular loss with a cherry-red spot, not painful subacute loss with an APD.' },
      { id: 'c', text: 'Acute angle-closure glaucoma', whyNot: 'Angle closure causes a painful red eye with a mid-dilated fixed pupil and halos, not an afferent pupillary defect with pain on movement.' },
      { id: 'd', text: 'Amaurosis fugax', whyNot: 'Amaurosis fugax is transient monocular blindness ("curtain") that resolves, not persistent subacute loss with an APD.' },
    ],
    discriminator: 'Painful subacute monocular vision loss with a relative afferent pupillary defect and impaired color vision is optic neuritis — commonly the presenting attack of multiple sclerosis.',
    tags: { system: 'neuro', complaint: 'vision loss', rotation: ['neuro'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['multiple-sclerosis'],
    source: [{ ref: 'Beck et al., Optic Neuritis Treatment Trial (ONTT) — long-term follow-up (Arch Ophthalmol)', year: 2008 }],
  },
  {
    itemId: 'on-tx', version: 1, type: 'tx_next_step', conceptId: 'optic-neuritis', presentation: 'severe',
    stem: 'A patient with acute optic neuritis and significant visual loss is treated to speed recovery. What is appropriate?',
    vitals: [],
    findings: ['Acute demyelinating optic neuritis.'],
    options: [
      { id: 'a', text: 'IV methylprednisolone (not oral prednisone alone)', correct: true },
      { id: 'b', text: 'Oral prednisone alone as first-line', whyNot: 'The ONTT found oral prednisone alone offered no benefit and was associated with more recurrences; IV steroids are used to hasten recovery.' },
      { id: 'c', text: 'No treatment and reassure it always fully resolves', whyNot: 'IV steroids speed recovery, and evaluation for MS (MRI) is important for prognosis and therapy.' },
      { id: 'd', text: 'Antibiotics', whyNot: 'Optic neuritis is inflammatory/demyelinating, not bacterial.' },
    ],
    discriminator: 'Acute optic neuritis is treated with IV methylprednisolone to hasten recovery — oral prednisone alone is avoided (ONTT showed no benefit and more recurrences) — plus MRI to assess MS risk.',
    tags: { system: 'neuro', complaint: 'vision loss', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Beck et al., The Optic Neuritis Treatment Trial (ONTT, NEJM)', year: 1992 }],
  },

  /* ── Carpal tunnel ────────────────────────────────────────────── */
  {
    itemId: 'cts-ol', version: 1, type: 'one_liner', conceptId: 'carpal-tunnel', presentation: 'classic',
    stem: 'A pregnant woman has nocturnal tingling and numbness of the thumb, index, and middle fingers that she shakes out for relief; Phalen and Tinel signs are positive. What is the diagnosis?',
    vitals: [],
    findings: ['Median-distribution paresthesias worse at night; positive provocative signs.'],
    options: [
      { id: 'a', text: 'Carpal tunnel syndrome (median nerve at the wrist)', correct: true },
      { id: 'b', text: 'C6 cervical radiculopathy', whyNot: 'Radiculopathy follows a dermatome with neck pain and reflex changes, not the median hand distribution relieved by shaking.' },
      { id: 'c', text: 'Ulnar neuropathy', whyNot: 'Ulnar neuropathy affects the 4th/5th fingers, not the thumb-index-middle median distribution.' },
      { id: 'd', text: 'Raynaud phenomenon', whyNot: 'Raynaud causes color changes with cold, not median-nerve paresthesias with positive Phalen/Tinel.' },
    ],
    discriminator: 'Nocturnal median-distribution paresthesias (thumb, index, middle) with positive Phalen and Tinel signs is carpal tunnel syndrome — associated with pregnancy, hypothyroidism, and diabetes.',
    tags: { system: 'neuro', complaint: 'hand numbness', rotation: ['fm', 'neuro'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'AAOS Clinical Practice Guideline: Management of Carpal Tunnel Syndrome', year: 2016 }],
  },
  {
    itemId: 'cts-tx', version: 1, type: 'tx_next_step', conceptId: 'carpal-tunnel', presentation: 'classic',
    stem: 'A patient with mild-to-moderate carpal tunnel syndrome and no thenar atrophy wants treatment. What is first-line?',
    vitals: [],
    findings: ['Mild-to-moderate symptoms without motor loss.'],
    options: [
      { id: 'a', text: 'A neutral wrist splint (especially at night), with a local corticosteroid injection as escalation', correct: true },
      { id: 'b', text: 'Immediate surgical release for everyone', whyNot: 'Surgery is reserved for severe disease (thenar atrophy, denervation) or failed conservative therapy, not first-line for mild cases.' },
      { id: 'c', text: 'Long-term oral opioids', whyNot: 'Opioids do not treat the compressive neuropathy and carry dependence risk.' },
      { id: 'd', text: 'No treatment', whyNot: 'Untreated progressive compression can cause permanent thenar weakness.' },
    ],
    discriminator: 'Mild-to-moderate carpal tunnel is managed first with wrist splinting and corticosteroid injection, reserving surgical decompression for severe disease (thenar atrophy) or conservative failure.',
    tags: { system: 'neuro', complaint: 'hand numbness', rotation: ['fm', 'neuro', 'surg'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [{ ref: 'AAOS Clinical Practice Guideline: Management of Carpal Tunnel Syndrome', year: 2016 }],
  },

  /* ── Neurosyphilis ────────────────────────────────────────────── */
  {
    itemId: 'neurosyph-assoc', version: 1, type: 'association', conceptId: 'neurosyphilis', presentation: 'atypical',
    stem: 'A patient has a lancinating "lightning" leg pain, a broad-based ataxic gait worse in the dark, absent ankle reflexes, and small pupils that constrict to accommodation but not to light. What is the diagnosis?',
    vitals: [],
    findings: ['Dorsal-column sensory ataxia with an Argyll Robertson pupil.'],
    options: [
      { id: 'a', text: 'Tabes dorsalis (neurosyphilis)', correct: true },
      { id: 'b', text: 'Diabetic peripheral neuropathy', whyNot: 'Diabetic neuropathy does not cause an Argyll Robertson pupil or the lancinating dorsal-column pattern of tabes.' },
      { id: 'c', text: 'Multiple sclerosis', whyNot: 'MS gives disseminated CNS lesions, not the classic Argyll Robertson pupil and tabetic gait.' },
      { id: 'd', text: 'Guillain–Barré syndrome', whyNot: 'GBS is an acute areflexic ascending weakness, not a chronic dorsal-column syndrome with a light-near dissociated pupil.' },
    ],
    discriminator: 'Sensory ataxia with lancinating pains and an Argyll Robertson pupil (accommodates but does not react to light) is tabes dorsalis from neurosyphilis — confirmed by a reactive CSF-VDRL.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.6,
    source: [{ ref: 'CDC Sexually Transmitted Infections Treatment Guidelines — Neurosyphilis', year: 2021 }],
  },
  {
    itemId: 'neurosyph-tx', version: 1, type: 'tx_next_step', conceptId: 'neurosyphilis', presentation: 'classic',
    stem: 'A patient has confirmed neurosyphilis with a reactive CSF-VDRL. What is the treatment?',
    vitals: [],
    findings: ['CSF-confirmed neurosyphilis.'],
    options: [
      { id: 'a', text: 'IV aqueous penicillin G', correct: true },
      { id: 'b', text: 'A single dose of intramuscular benzathine penicillin', whyNot: 'Single-dose IM benzathine treats early syphilis but does not achieve treponemicidal CSF levels for neurosyphilis; IV penicillin is required.' },
      { id: 'c', text: 'Oral doxycycline as first-line', whyNot: 'Doxycycline is an alternative for penicillin-allergic early syphilis, not the preferred neurosyphilis therapy; penicillin (with desensitization if allergic) is standard.' },
      { id: 'd', text: 'No treatment for late disease', whyNot: 'Neurosyphilis requires treatment to halt progression regardless of stage.' },
    ],
    discriminator: 'Neurosyphilis is treated with IV aqueous penicillin G to achieve treponemicidal CSF levels — intramuscular benzathine penicillin alone is inadequate.',
    tags: { system: 'neuro', complaint: 'CNS infection', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'CDC Sexually Transmitted Infections Treatment Guidelines — Neurosyphilis', year: 2021 }],
  },
];

export const NEURO_DEPTH3: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
