/* ══════════════════════════════════════════════════════════════
   Neuroscience — variety pour #2.

   Depth, not breadth: every item here adds a NEW reasoning angle to a
   neuro concept that already exists, so each diagnosis is drilled the
   way it's actually tested — recognise it, separate it from its mimic,
   work it up, and treat it — across several patients and presentations.
   No new concepts or subtopics; this module only adds `items`, pushing
   the block's differentials past the variety floor (≥3 vignettes, ≥2
   item types) and adding the management (tx_*) side.

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   clinical-evidence source (AHA/ASA, AAN, IDSA, AES, and consensus
   criteria). Commercial board-prep is used only to see which topics are
   tested — never copied or cited. Synthetic patients; drafted content
   enters the multi-reviewer pipeline UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import { v, type ContentModule, type RawItem } from './authoring';

const items: RawItem[] = [
  /* ── Migraine ─────────────────────────────────────────────────── */
  {
    itemId: 'migraine-tx', version: 1, type: 'tx_next_step', conceptId: 'migraine', presentation: 'classic',
    stem: 'A 30-year-old with known migraine without aura has a moderate-to-severe attack that is not relieved by ibuprofen. She has no cardiovascular disease. What is the best acute treatment?',
    vitals: [],
    findings: ['Unilateral throbbing headache with photophobia and nausea, disabling.'],
    options: [
      { id: 'a', text: 'A triptan (serotonin 1B/1D agonist)', correct: true },
      { id: 'b', text: 'A long-acting opioid', whyNot: 'Opioids are discouraged for migraine — they risk dependence and medication-overuse headache without treating the mechanism.' },
      { id: 'c', text: 'Start daily propranolol today for this attack', whyNot: 'Propranolol is PROPHYLAXIS; it does not abort an attack in progress.' },
      { id: 'd', text: 'Oral prednisone taper', whyNot: 'Steroids are not first-line abortive therapy for routine migraine (occasionally used for status migrainosus).' },
    ],
    discriminator: 'A triptan is the migraine-specific abortive when NSAIDs fail — but avoid it in coronary disease, uncontrolled hypertension, or hemiplegic/basilar migraine because of its vasoconstrictor effect.',
    teachingPoint: 'Move to prophylaxis (propranolol, topiramate, amitriptyline, or a CGRP agent) when attacks are frequent or disabling.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['fm', 'neuro', 'im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'AHS Consensus Statement: Integrating New Migraine Treatments into Clinical Practice (American Headache Society)', year: 2021 }],
  },
  {
    itemId: 'migraine-ddx', version: 1, type: 'discriminator', conceptId: 'migraine', presentation: 'atypical',
    stem: 'A 68-year-old has, for the first time, 20 minutes of a slowly SPREADING zig-zag visual disturbance followed by a throbbing headache. What most favors migraine aura over a TIA?',
    vitals: [],
    findings: ['The visual symptom marched gradually across the field before the headache.'],
    options: [
      { id: 'a', text: 'Gradual "march" of positive visual phenomena over minutes, then resolution', correct: true },
      { id: 'b', text: 'Sudden, maximal negative deficit (loss of field) at onset', whyNot: 'An abrupt, maximal NEGATIVE deficit favors ischemia (TIA); aura builds gradually with positive phenomena.' },
      { id: 'c', text: 'Presence of any headache', whyNot: 'Headache can accompany either; it does not discriminate aura from ischemia.' },
      { id: 'd', text: 'Older age by itself', whyNot: 'New aura-like symptoms in an older vasculopath actually raise concern for TIA and warrant evaluation, not reassurance.' },
    ],
    discriminator: 'Migraine aura spreads gradually with POSITIVE phenomena (scintillations) over 5–20 minutes and resolves, whereas TIA is sudden, maximal, and produces NEGATIVE deficits — new "aura" in an older adult still earns a stroke workup.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro', 'em'], level: 'both' },
    difficultySeed: 0.6,
    distractorConceptIds: ['tia'],
    source: [{ ref: 'International Classification of Headache Disorders, 3rd edition (ICHD-3, IHS)', year: 2018 }],
  },

  /* ── Cluster headache ─────────────────────────────────────────── */
  {
    itemId: 'cluster-tx', version: 1, type: 'tx_next_step', conceptId: 'cluster-headache', presentation: 'severe',
    stem: 'A man has an excruciating unilateral periorbital headache with ipsilateral tearing and a running nose, one of several attacks today. What aborts the attack fastest?',
    vitals: [v('SpO₂', '98%', false)],
    findings: ['Restless, pacing; ptosis and conjunctival injection on the painful side.'],
    options: [
      { id: 'a', text: 'High-flow 100% oxygen (± subcutaneous/intranasal sumatriptan)', correct: true },
      { id: 'b', text: 'Oral verapamil now to stop this attack', whyNot: 'Verapamil is the PREVENTIVE bridge; it does not abort an acute cluster attack.' },
      { id: 'c', text: 'Oral acetaminophen', whyNot: 'Oral analgesics act too slowly for an attack that peaks in minutes.' },
      { id: 'd', text: 'Indomethacin', whyNot: 'Indomethacin is diagnostic/therapeutic for paroxysmal hemicrania, not cluster headache.' },
    ],
    discriminator: 'Cluster headache is aborted with high-flow 100% oxygen and/or subcutaneous sumatriptan, while verapamil is the preventive — oxygen responsiveness itself supports the diagnosis.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Robbins et al., Treatment of Cluster Headache — AHS Evidence-Based Guidelines', year: 2016 }],
  },
  {
    itemId: 'cluster-ddx', version: 1, type: 'discriminator', conceptId: 'cluster-headache', presentation: 'classic',
    stem: 'Which single feature best separates cluster headache from trigeminal neuralgia?',
    vitals: [],
    findings: ['Both cause severe unilateral facial/head pain.'],
    options: [
      { id: 'a', text: 'Cranial autonomic features (tearing, rhinorrhea, ptosis) with attacks lasting 15–180 minutes', correct: true },
      { id: 'b', text: 'Pain triggered by light touch to the face', whyNot: 'Cutaneous trigger zones and brief electric-shock jabs describe trigeminal neuralgia, not cluster.' },
      { id: 'c', text: 'Complete relief with carbamazepine', whyNot: 'Carbamazepine is the trigeminal neuralgia drug; cluster responds to oxygen/triptans and verapamil.' },
      { id: 'd', text: 'A normal neurologic exam', whyNot: 'Both typically have a normal interictal exam; that does not discriminate them.' },
    ],
    discriminator: 'Cluster headache brings prominent ipsilateral cranial autonomic features and 15–180-minute attacks with restlessness, whereas trigeminal neuralgia is brief, shock-like, touch-triggered pain without autonomic signs.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['trigeminal-neuralgia'],
    source: [{ ref: 'ICHD-3 (International Headache Society)', year: 2018 }],
  },

  /* ── Subarachnoid hemorrhage ──────────────────────────────────── */
  {
    itemId: 'sah-nx', version: 1, type: 'next_step', conceptId: 'sah-thunderclap', presentation: 'classic',
    stem: 'A patient presents 3 hours after a sudden "worst headache of my life." What is the best first test?',
    vitals: [v('BP', '176/98', true)],
    findings: ['Thunderclap onset; neck stiffness; no focal deficit.'],
    options: [
      { id: 'a', text: 'Non-contrast head CT', correct: true },
      { id: 'b', text: 'Lumbar puncture first', whyNot: 'CT comes first; LP (for xanthochromia) is reserved for when an early CT is negative but suspicion remains.' },
      { id: 'c', text: 'MRI brain', whyNot: 'MRI is less available acutely and not the first test for suspected acute SAH.' },
      { id: 'd', text: 'CT angiography before any non-contrast CT', whyNot: 'Non-contrast CT confirms blood first; CTA localizes the aneurysm afterward.' },
    ],
    discriminator: 'A thunderclap headache is worked up with an immediate non-contrast CT (most sensitive within 6 hours); if that is negative but suspicion persists, LP for xanthochromia is the next step.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['em', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Connolly et al., AHA/ASA Guidelines for the Management of Aneurysmal Subarachnoid Hemorrhage', year: 2012 }],
  },
  {
    itemId: 'sah-tx', version: 1, type: 'tx_next_step', conceptId: 'sah-thunderclap', presentation: 'severe',
    stem: 'A patient with CT-confirmed aneurysmal subarachnoid hemorrhage is admitted. Which measure reduces delayed ischemic deficits from vasospasm?',
    vitals: [v('BP', '168/94', true)],
    findings: ['Aneurysm identified on CT angiography, awaiting securing.'],
    options: [
      { id: 'a', text: 'Oral nimodipine plus early aneurysm securing (clip or coil)', correct: true },
      { id: 'b', text: 'Prophylactic hyperventilation', whyNot: 'Hyperventilation causes cerebral vasoconstriction and can worsen ischemia; it is not preventive therapy.' },
      { id: 'c', text: 'Therapeutic anticoagulation', whyNot: 'Anticoagulation in an unsecured ruptured aneurysm risks catastrophic rebleeding.' },
      { id: 'd', text: 'Immediate aggressive blood-pressure lowering to normal', whyNot: 'Extremes are avoided, but nimodipine and securing the aneurysm — not tight normalization — are the vasospasm-directed measures.' },
    ],
    discriminator: 'In aneurysmal SAH, oral nimodipine improves neurologic outcome from vasospasm and the aneurysm is secured early by clipping or coiling — nimodipine works by reducing ischemic injury, not by raising cerebral blood flow.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Connolly et al., AHA/ASA Guidelines for Aneurysmal Subarachnoid Hemorrhage', year: 2012 }],
  },

  /* ── Trigeminal neuralgia ─────────────────────────────────────── */
  {
    itemId: 'tgn-nx', version: 1, type: 'next_step', conceptId: 'trigeminal-neuralgia', presentation: 'atypical',
    stem: 'A 35-year-old woman with trigeminal-neuralgia-type facial pain also reports a prior episode of transient monocular vision loss. What should be done?',
    vitals: [],
    findings: ['Young age with a second neurologic symptom raises concern for a secondary cause.'],
    options: [
      { id: 'a', text: 'MRI of the brain to look for a secondary cause (e.g., multiple sclerosis or vascular compression)', correct: true },
      { id: 'b', text: 'Reassure and treat with carbamazepine only', whyNot: 'Young age plus another CNS symptom (optic neuritis) demands imaging to exclude MS before assuming classic idiopathic disease.' },
      { id: 'c', text: 'Empiric antibiotics for sinusitis', whyNot: 'The stereotyped neuralgic pain and prior optic symptom are not sinus disease.' },
      { id: 'd', text: 'Tooth extraction', whyNot: 'There is no dental pathology; extraction would not address a neurologic cause.' },
    ],
    discriminator: 'Trigeminal neuralgia in a young patient or with other neurologic signs warrants MRI to find a secondary cause — multiple sclerosis or neurovascular compression — rather than treating it as idiopathic.',
    tags: { system: 'neuro', complaint: 'facial pain', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.55,
    distractorConceptIds: ['multiple-sclerosis'],
    source: [{ ref: 'Cruccu et al., Trigeminal Neuralgia: New Classification and Diagnostic Grading (Neurology)', year: 2016 }],
  },

  /* ── Status epilepticus ───────────────────────────────────────── */
  {
    itemId: 'se-ol', version: 1, type: 'one_liner', conceptId: 'status-epilepticus', presentation: 'classic',
    stem: 'A patient has been convulsing continuously for 7 minutes without regaining consciousness. How is this best characterized?',
    vitals: [v('SpO₂', '90%', true)],
    findings: ['Ongoing generalized tonic-clonic activity, no recovery between.'],
    options: [
      { id: 'a', text: 'Convulsive status epilepticus — a neurologic emergency', correct: true },
      { id: 'b', text: 'A simple self-limited seizure; observe', whyNot: 'A seizure lasting ≥5 minutes (or repeated without recovery) is status epilepticus and needs immediate treatment, not observation.' },
      { id: 'c', text: 'Psychogenic nonepileptic event', whyNot: 'The sustained convulsion with hypoxia is treated as status; misclassifying delays life-saving therapy.' },
      { id: 'd', text: 'Syncope', whyNot: 'Syncope is brief with rapid recovery, not 7 minutes of continuous convulsion.' },
    ],
    discriminator: 'Five or more minutes of continuous seizure activity, or repeated seizures without recovery of consciousness, defines status epilepticus — the threshold to start treatment, not to keep waiting.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['em', 'neuro'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'Glauser et al., Evidence-Based Guideline: Treatment of Convulsive Status Epilepticus (American Epilepsy Society)', year: 2016 }],
  },
  {
    itemId: 'se-cm', version: 1, type: 'cant_miss', conceptId: 'status-epilepticus', presentation: 'masked',
    stem: 'A patient remains unexplainably comatose after a witnessed generalized seizure stopped 40 minutes ago, with subtle eye twitching but no overt convulsions. What must you not miss?',
    vitals: [],
    findings: ['Persistent depressed consciousness out of proportion to a post-ictal state.'],
    options: [
      { id: 'a', text: 'Nonconvulsive status epilepticus — obtain an urgent EEG', correct: true },
      { id: 'b', text: 'Expected prolonged post-ictal drowsiness; just observe', whyNot: 'Persistent unexplained coma after a seizure can be ongoing nonconvulsive status; EEG is needed to detect and treat it.' },
      { id: 'c', text: 'Malingering', whyNot: 'A comatose post-seizure patient with subtle twitching is not feigning; nonconvulsive status must be excluded.' },
      { id: 'd', text: 'Acute stroke only', whyNot: 'Stroke is possible but does not explain the picture; ongoing seizure activity on EEG is the can’t-miss.' },
    ],
    discriminator: 'Unexplained persistent coma after a seizure — or in any critically ill patient — should trigger an EEG for nonconvulsive status epilepticus, which is invisible without it.',
    tags: { system: 'neuro', complaint: 'altered mental status', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.6,
    source: [{ ref: 'Glauser et al., Treatment of Convulsive Status Epilepticus (American Epilepsy Society)', year: 2016 }],
  },

  /* ── First seizure / seizure vs syncope ───────────────────────── */
  {
    itemId: 'svs-nx', version: 1, type: 'next_step', conceptId: 'seizure-vs-syncope', presentation: 'atypical',
    stem: 'A healthy 26-year-old has a first unprovoked generalized seizure, now fully recovered with a normal exam and normal glucose. What is the appropriate workup?',
    vitals: [],
    findings: ['No fever, no drugs, no metabolic derangement identified.'],
    options: [
      { id: 'a', text: 'Neuroimaging (MRI) and an EEG to assess recurrence risk', correct: true },
      { id: 'b', text: 'Start a lifelong antiepileptic immediately for everyone', whyNot: 'After a single unprovoked seizure, the decision to treat depends on recurrence risk (EEG/imaging findings), not reflexive lifelong therapy.' },
      { id: 'c', text: 'No workup; discharge with reassurance', whyNot: 'A first unprovoked seizure warrants imaging and EEG to find a structural or epileptiform cause.' },
      { id: 'd', text: 'Lumbar puncture routinely', whyNot: 'LP is reserved for suspected CNS infection or subarachnoid hemorrhage, not a routine first afebrile seizure.' },
    ],
    discriminator: 'A first unprovoked seizure is worked up with MRI and EEG to gauge recurrence risk; antiepileptic therapy is guided by that risk rather than started automatically.',
    tags: { system: 'neuro', complaint: 'seizure', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Krumholz et al., AAN/AES Evidence-Based Guideline: Management of an Unprovoked First Seizure in Adults', year: 2015 }],
  },
  {
    itemId: 'svs-ol', version: 1, type: 'one_liner', conceptId: 'seizure-vs-syncope', presentation: 'classic',
    stem: 'A collapse was followed by 90 seconds of confusion, a bitten lateral tongue, and incontinence, with slow re-orientation. Seizure or syncope?',
    vitals: [],
    findings: ['Prolonged post-event confusion; lateral tongue laceration.'],
    options: [
      { id: 'a', text: 'Seizure', correct: true },
      { id: 'b', text: 'Vasovagal syncope', whyNot: 'Syncope recovers quickly without a prolonged post-ictal state, and tongue biting is typically the TIP, not the lateral tongue.' },
      { id: 'c', text: 'Cardiac syncope', whyNot: 'Cardiac syncope gives rapid recovery; lateral tongue biting and postictal confusion point to seizure.' },
      { id: 'd', text: 'Orthostatic syncope', whyNot: 'Orthostatic events recover promptly on lying flat, without postictal confusion or lateral tongue injury.' },
    ],
    discriminator: 'Lateral tongue biting, incontinence, and prolonged postictal confusion point to a seizure, whereas syncope recovers within seconds and lacks a true postictal phase.',
    tags: { system: 'neuro', complaint: 'syncope', rotation: ['em', 'neuro', 'im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Sheldon et al., Historical Criteria That Distinguish Syncope From Seizures (J Am Coll Cardiol)', year: 2002 }],
  },

  /* ── Guillain–Barré ───────────────────────────────────────────── */
  {
    itemId: 'gbs-cm', version: 1, type: 'cant_miss', conceptId: 'guillain-barre', presentation: 'severe',
    stem: 'A patient with ascending weakness from Guillain–Barré now feels short of breath. Which bedside measure most urgently guides the need for intubation?',
    vitals: [v('RR', '26', true), v('SpO₂', '94%', false)],
    findings: ['Weak cough and a falling vital capacity on serial checks.'],
    options: [
      { id: 'a', text: 'Serial forced vital capacity / negative inspiratory force', correct: true },
      { id: 'b', text: 'Wait for the oxygen saturation to drop', whyNot: 'Hypoxia is a LATE sign in neuromuscular respiratory failure; falling FVC/NIF warns earlier, before desaturation.' },
      { id: 'c', text: 'A single ABG at presentation', whyNot: 'A one-off gas can look normal while ventilation is failing; the trend in FVC/NIF is what matters.' },
      { id: 'd', text: 'Chest CT', whyNot: 'The problem is neuromuscular pump failure, not a parenchymal process CT would show.' },
    ],
    discriminator: 'In Guillain–Barré, respiratory failure is neuromuscular, so serial vital capacity and negative inspiratory force (not oxygen saturation) predict the need for intubation — desaturation comes too late.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Hughes et al., Supportive Care for Guillain–Barré Syndrome (Arch Neurol)', year: 2005 }],
  },
  {
    itemId: 'gbs-tx', version: 1, type: 'tx_next_step', conceptId: 'guillain-barre', presentation: 'classic',
    stem: 'A patient with confirmed Guillain–Barré syndrome and progressing weakness needs disease-directed therapy. What is appropriate?',
    vitals: [],
    findings: ['Areflexic ascending weakness with albuminocytologic dissociation on LP.'],
    options: [
      { id: 'a', text: 'IVIG or plasma exchange', correct: true },
      { id: 'b', text: 'High-dose corticosteroids', whyNot: 'Unlike many inflammatory neuropathies, steroids are NOT effective in Guillain–Barré and are not recommended.' },
      { id: 'c', text: 'Both IVIG and plasma exchange together', whyNot: 'Combining them adds no benefit over either alone.' },
      { id: 'd', text: 'Pyridostigmine', whyNot: 'Pyridostigmine treats myasthenia gravis, not the demyelinating neuropathy of GBS.' },
    ],
    discriminator: 'Guillain–Barré is treated with IVIG OR plasma exchange (equivalent, not combined) — and, unlike CIDP, it does not respond to corticosteroids.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Hughes et al., AAN Practice Parameter: Immunotherapy for Guillain–Barré Syndrome', year: 2003 }],
  },

  /* ── MG vs LEMS / Myasthenia gravis ───────────────────────────── */
  {
    itemId: 'mglems-assoc', version: 1, type: 'association', conceptId: 'mg-vs-lems', presentation: 'atypical',
    stem: 'A smoker has proximal leg weakness that IMPROVES after sustained exertion, dry mouth, and hyporeflexia. Antibodies to presynaptic voltage-gated calcium channels are positive. What underlying condition must be sought?',
    vitals: [],
    findings: ['Weakness that facilitates with repeated use; autonomic symptoms.'],
    options: [
      { id: 'a', text: 'Small cell lung cancer (paraneoplastic Lambert–Eaton syndrome)', correct: true },
      { id: 'b', text: 'Thymoma', whyNot: 'Thymoma associates with myasthenia gravis (anti-AChR), not with the anti-VGCC Lambert–Eaton picture.' },
      { id: 'c', text: 'Multiple sclerosis', whyNot: 'MS is CNS demyelination, unrelated to presynaptic calcium-channel antibodies and small cell lung cancer.' },
      { id: 'd', text: 'Diabetes', whyNot: 'Diabetic neuropathy is length-dependent sensory-predominant, not exertion-facilitated proximal weakness with anti-VGCC.' },
    ],
    discriminator: 'Lambert–Eaton — proximal weakness that improves with use, autonomic features, and anti-VGCC antibodies — is paraneoplastic to small cell lung cancer, whereas myasthenia (anti-AChR) links to thymoma.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['myasthenia-gravis'],
    source: [{ ref: 'Titulaer et al., Lambert–Eaton Myasthenic Syndrome — Diagnosis and Management (Lancet Neurology)', year: 2011 }],
  },
  {
    itemId: 'mg-tx', version: 1, type: 'tx_next_step', conceptId: 'myasthenia-gravis', presentation: 'severe',
    stem: 'A patient with myasthenia gravis develops rapidly worsening bulbar and respiratory weakness (myasthenic crisis). Beyond airway support, what is the disease-directed treatment?',
    vitals: [v('FVC', 'falling', true)],
    findings: ['Weak cough, dysphagia, and a declining vital capacity.'],
    options: [
      { id: 'a', text: 'IVIG or plasma exchange', correct: true },
      { id: 'b', text: 'Increase pyridostigmine to very high doses', whyNot: 'Escalating cholinesterase inhibitors in crisis risks secretions/cholinergic effects and does not reverse crisis; IVIG/PLEX does.' },
      { id: 'c', text: 'Observation off all therapy', whyNot: 'Crisis is life-threatening; rapid immunotherapy plus airway management is required.' },
      { id: 'd', text: 'Edrophonium infusion', whyNot: 'Edrophonium is a historical diagnostic test, not a treatment for crisis.' },
    ],
    discriminator: 'Myasthenic crisis is treated with IVIG or plasma exchange plus airway support — rapid-acting immunotherapies — while chronically the disease is managed with pyridostigmine and immunosuppression.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Sanders et al., International Consensus Guidance for Management of Myasthenia Gravis (Neurology)', year: 2016 }],
  },
  {
    itemId: 'mg-nx', version: 1, type: 'next_step', conceptId: 'myasthenia-gravis', presentation: 'classic',
    stem: 'A patient has fatigable ptosis and diplopia worse at the end of the day. Serum acetylcholine-receptor antibodies confirm myasthenia gravis. What imaging is indicated?',
    vitals: [],
    findings: ['Fatigable ocular and bulbar weakness; positive anti-AChR antibodies.'],
    options: [
      { id: 'a', text: 'CT (or MRI) of the chest to evaluate for thymoma', correct: true },
      { id: 'b', text: 'No imaging is needed', whyNot: 'Myasthenia is associated with thymic abnormality; chest imaging for thymoma is part of the workup.' },
      { id: 'c', text: 'Abdominal ultrasound', whyNot: 'The associated tumor is thymic (anterior mediastinum), not abdominal.' },
      { id: 'd', text: 'DEXA scan', whyNot: 'Bone density is unrelated to the thymic evaluation myasthenia requires.' },
    ],
    discriminator: 'Every new myasthenia gravis diagnosis gets chest imaging to look for a thymoma, because thymectomy can improve or resolve the disease.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Sanders et al., International Consensus Guidance for Management of Myasthenia Gravis (Neurology)', year: 2016 }],
  },

  /* ── Essential tremor ─────────────────────────────────────────── */
  {
    itemId: 'et-tx', version: 1, type: 'tx_next_step', conceptId: 'essential-tremor', presentation: 'classic',
    stem: 'A patient with a bilateral action tremor of the hands that improves with a glass of wine and worsens with caffeine seeks treatment because it interferes with writing. What is first-line?',
    vitals: [],
    findings: ['Postural/kinetic tremor, family history, no rest tremor or rigidity.'],
    options: [
      { id: 'a', text: 'Propranolol (or primidone)', correct: true },
      { id: 'b', text: 'Levodopa', whyNot: 'Levodopa treats Parkinson disease; essential tremor is not dopaminergic and responds to propranolol/primidone.' },
      { id: 'c', text: 'An anticholinergic', whyNot: 'Anticholinergics are used for some parkinsonian tremor, not first-line essential tremor.' },
      { id: 'd', text: 'More caffeine', whyNot: 'Stimulants worsen essential tremor.' },
    ],
    discriminator: 'Essential tremor — a bilateral action tremor that improves with alcohol and often runs in families — is treated first with propranolol or primidone, not the dopaminergic drugs used for Parkinson tremor.',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['parkinson'],
    source: [{ ref: 'Ferreira et al., MDS Evidence-Based Review: Treatments for Essential Tremor (Movement Disorders)', year: 2019 }],
  },
  {
    itemId: 'et-ol', version: 1, type: 'one_liner', conceptId: 'essential-tremor', presentation: 'elderly', vitals: [],
    stem: 'An older adult has a symmetric hand tremor present when holding a cup or writing, absent at rest, with a normal gait and no rigidity. What is the diagnosis?',
    findings: ['Action/postural tremor; long-standing and slowly progressive.'],
    options: [
      { id: 'a', text: 'Essential tremor', correct: true },
      { id: 'b', text: 'Parkinson disease', whyNot: 'Parkinson tremor is a RESTING pill-rolling tremor with bradykinesia and rigidity, not a symmetric action tremor.' },
      { id: 'c', text: 'Cerebellar tremor', whyNot: 'Cerebellar (intention) tremor worsens on approaching a target with other cerebellar signs, not a simple postural tremor.' },
      { id: 'd', text: 'Physiologic tremor', whyNot: 'Enhanced physiologic tremor is fine, low-amplitude, and provoked (caffeine, anxiety), not this disabling familial action tremor.' },
    ],
    discriminator: 'A symmetric action/postural tremor with a normal gait and no rigidity is essential tremor — the opposite pattern to the asymmetric resting tremor of Parkinson disease.',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    distractorConceptIds: ['parkinson'],
    source: [{ ref: 'Bhatia et al., Consensus Statement on the Classification of Tremors (Movement Disorders)', year: 2018 }],
  },

  /* ── Parkinson disease ────────────────────────────────────────── */
  {
    itemId: 'park-tx', version: 1, type: 'tx_next_step', conceptId: 'parkinson', presentation: 'classic',
    stem: 'A 70-year-old with disabling bradykinesia and rigidity from Parkinson disease needs symptomatic therapy. What provides the greatest motor benefit?',
    vitals: [],
    findings: ['Asymmetric rest tremor, cogwheel rigidity, and slowed movement affecting function.'],
    options: [
      { id: 'a', text: 'Levodopa (with carbidopa)', correct: true },
      { id: 'b', text: 'A first-generation (typical) antipsychotic', whyNot: 'Dopamine-blocking antipsychotics WORSEN parkinsonism — the opposite of what is needed.' },
      { id: 'c', text: 'Metoclopramide for the tremor', whyNot: 'Metoclopramide blocks dopamine and induces/worsens parkinsonism.' },
      { id: 'd', text: 'Propranolol', whyNot: 'Propranolol treats essential tremor, not the bradykinesia/rigidity of Parkinson disease.' },
    ],
    discriminator: 'Levodopa/carbidopa gives the greatest motor benefit in Parkinson disease, while dopamine-blocking drugs (typical antipsychotics, metoclopramide) worsen it and must be avoided.',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Fox et al., MDS Evidence-Based Medicine Review: Treatments for the Motor Symptoms of Parkinson’s Disease', year: 2018 }],
  },
  {
    itemId: 'park-ci', version: 1, type: 'tx_contraindication', conceptId: 'parkinson', presentation: 'elderly',
    stem: 'A patient with Parkinson disease develops visual hallucinations. Which drug should be AVOIDED to control them?',
    vitals: [],
    findings: ['Psychosis on a background of Parkinson disease.'],
    options: [
      { id: 'a', text: 'Haloperidol', correct: true },
      { id: 'b', text: 'Quetiapine', whyNot: 'Quetiapine is a preferred low-potency option in Parkinson psychosis because it has less dopamine blockade.' },
      { id: 'c', text: 'Pimavanserin', whyNot: 'Pimavanserin is specifically approved for Parkinson disease psychosis and does not block dopamine.' },
      { id: 'd', text: 'Reducing offending dopaminergic doses', whyNot: 'Adjusting/withdrawing the drugs contributing to psychosis is an appropriate step, not something to avoid.' },
    ],
    discriminator: 'High-potency dopamine blockers like haloperidol are contraindicated in Parkinson disease because they sharply worsen motor function — quetiapine or pimavanserin are used instead for psychosis.',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'psych'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Seppi et al., MDS Evidence-Based Review: Treatments for the Non-Motor Symptoms of Parkinson’s Disease', year: 2019 }],
  },

  /* ── Multiple sclerosis ───────────────────────────────────────── */
  {
    itemId: 'ms-nx', version: 1, type: 'next_step', conceptId: 'multiple-sclerosis', presentation: 'classic',
    stem: 'A 29-year-old woman has a second discrete neurologic episode (now a partial myelitis; previously optic neuritis) months apart. What is the best diagnostic step?',
    vitals: [],
    findings: ['Two clinical attacks separated in time and CNS location.'],
    options: [
      { id: 'a', text: 'MRI of the brain and spine (± CSF for oligoclonal bands)', correct: true },
      { id: 'b', text: 'Nerve conduction studies', whyNot: 'NCS evaluate peripheral nerve/muscle; MS is a CNS demyelinating disease diagnosed by MRI and CSF.' },
      { id: 'c', text: 'Muscle biopsy', whyNot: 'Biopsy of muscle addresses myopathy, not central demyelination.' },
      { id: 'd', text: 'Empiric lifelong immunosuppression without imaging', whyNot: 'Diagnosis (dissemination in space and time on MRI) must precede committing to disease-modifying therapy.' },
    ],
    discriminator: 'Multiple sclerosis is confirmed by dissemination in space AND time on MRI (supported by CSF oligoclonal bands), reflecting CNS — not peripheral — demyelination.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Thompson et al., Diagnosis of Multiple Sclerosis: 2017 Revisions of the McDonald Criteria (Lancet Neurology)', year: 2018 }],
  },
  {
    itemId: 'ms-tx', version: 1, type: 'tx_next_step', conceptId: 'multiple-sclerosis', presentation: 'severe',
    stem: 'A patient with multiple sclerosis has an acute relapse with disabling new weakness over several days. What is the treatment for the acute attack?',
    vitals: [],
    findings: ['Acute functionally significant relapse; no infection.'],
    options: [
      { id: 'a', text: 'High-dose IV corticosteroids', correct: true },
      { id: 'b', text: 'Start a disease-modifying therapy to abort this attack', whyNot: 'DMTs reduce FUTURE relapses; they do not treat the acute attack, which needs steroids.' },
      { id: 'c', text: 'IVIG as first-line for the relapse', whyNot: 'IV steroids are first-line for acute relapse; plasma exchange is reserved for steroid-refractory severe attacks.' },
      { id: 'd', text: 'Antibiotics', whyNot: 'An MS relapse is inflammatory demyelination, not infection.' },
    ],
    discriminator: 'An acute MS relapse is treated with high-dose IV corticosteroids (plasma exchange if steroid-refractory), while disease-modifying therapies prevent future relapses rather than abort the current one.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Rae-Grant et al., AAN Practice Guideline: Disease-Modifying Therapies for Adults with Multiple Sclerosis', year: 2018 }],
  },

  /* ── Wernicke ─────────────────────────────────────────────────── */
  {
    itemId: 'wern-tx', version: 1, type: 'tx_sequencing', conceptId: 'wernicke', presentation: 'severe',
    stem: 'A malnourished patient with alcohol use disorder arrives confused and hypoglycemic. In what order do you give thiamine and glucose?',
    vitals: [v('Glucose', '48', true)],
    findings: ['Confusion with nystagmus and gait ataxia.'],
    options: [
      { id: 'a', text: 'Give thiamine before (or with) the glucose', correct: true },
      { id: 'b', text: 'Give glucose first, then thiamine later', whyNot: 'A glucose load without thiamine can precipitate or worsen Wernicke encephalopathy in a thiamine-deficient patient.' },
      { id: 'c', text: 'Give neither until an MRI is done', whyNot: 'Treatment is empiric and urgent; imaging must not delay thiamine and glucose.' },
      { id: 'd', text: 'Give glucose only', whyNot: 'Omitting thiamine risks irreversible Wernicke–Korsakoff injury.' },
    ],
    discriminator: 'In a thiamine-deficient patient, thiamine is given before or with glucose, because a glucose load consumes the last thiamine and can precipitate Wernicke encephalopathy.',
    tags: { system: 'neuro', complaint: 'altered mental status', rotation: ['em', 'im', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Galvin et al., EFNS Guidelines for Diagnosis, Therapy and Prevention of Wernicke Encephalopathy', year: 2010 }],
  },
  {
    itemId: 'wern-ddx', version: 1, type: 'discriminator', conceptId: 'wernicke', presentation: 'atypical',
    stem: 'After treatment of acute Wernicke encephalopathy, a patient is left with a profound inability to form new memories and confabulation. How does this differ from the acute syndrome?',
    vitals: [],
    findings: ['Persistent anterograde amnesia with confabulation after the acute phase resolves.'],
    options: [
      { id: 'a', text: 'This is Korsakoff syndrome — a chronic, often irreversible amnestic state', correct: true },
      { id: 'b', text: 'It is ongoing Wernicke encephalopathy', whyNot: 'The acute triad (confusion, ophthalmoplegia, ataxia) has resolved; persistent amnesia/confabulation defines Korsakoff.' },
      { id: 'c', text: 'It is delirium', whyNot: 'Delirium fluctuates and is usually reversible with treatment of the cause; Korsakoff amnesia persists.' },
      { id: 'd', text: 'It is Alzheimer disease', whyNot: 'The context of alcohol/thiamine deficiency and confabulation, not a slow degenerative course, defines Korsakoff.' },
    ],
    discriminator: 'Wernicke is the acute, reversible triad of confusion, ophthalmoplegia, and ataxia; Korsakoff is the chronic, often irreversible amnesia with confabulation that can follow untreated disease.',
    tags: { system: 'neuro', complaint: 'altered mental status', rotation: ['neuro', 'psych'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Galvin et al., EFNS Guidelines for Wernicke Encephalopathy', year: 2010 }],
  },

  /* ── Delirium vs dementia ─────────────────────────────────────── */
  {
    itemId: 'dd-nx', version: 1, type: 'next_step', conceptId: 'delirium-vs-dementia', presentation: 'elderly',
    stem: 'An 82-year-old becomes acutely confused and inattentive over a day, fluctuating and worse at night, on a background of previously normal cognition. What is the priority?',
    vitals: [v('Temp', '38.3', true)],
    findings: ['Acute inattention and fluctuation; new since admission.'],
    options: [
      { id: 'a', text: 'Search for and treat the precipitating cause (infection, drugs, metabolic)', correct: true },
      { id: 'b', text: 'Diagnose dementia and start a cholinesterase inhibitor', whyNot: 'Acute fluctuating inattention is delirium, not dementia; the priority is finding a reversible cause.' },
      { id: 'c', text: 'Start a standing antipsychotic for everyone', whyNot: 'Antipsychotics are a last resort for severe agitation, not the first step; the cause must be treated.' },
      { id: 'd', text: 'Physical restraints as first-line', whyNot: 'Restraints worsen delirium and are avoided; addressing the cause and nonpharmacologic measures come first.' },
    ],
    discriminator: 'Delirium is an acute, fluctuating disturbance of attention from an underlying medical cause, so the first step is to identify and treat that cause — not to label it dementia or reach for sedation.',
    tags: { system: 'neuro', complaint: 'altered mental status', rotation: ['im', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Inouye et al., Delirium in Elderly People (Lancet)', year: 2014 }],
  },

  /* ── NPH ──────────────────────────────────────────────────────── */
  {
    itemId: 'nph-nx', version: 1, type: 'next_step', conceptId: 'nph', presentation: 'classic',
    stem: 'A patient with the gait–incontinence–cognition triad and ventriculomegaly is considered for a shunt. What test best predicts whether shunting will help?',
    vitals: [],
    findings: ['Disproportionate ventricular enlargement on imaging.'],
    options: [
      { id: 'a', text: 'A large-volume lumbar puncture (tap test) looking for gait improvement', correct: true },
      { id: 'b', text: 'Empiric shunt without any predictive test', whyNot: 'A tap test (or lumbar drainage) helps select responders; shunting carries risk and should be targeted.' },
      { id: 'c', text: 'EEG', whyNot: 'EEG does not predict shunt responsiveness in NPH.' },
      { id: 'd', text: 'Carotid ultrasound', whyNot: 'Carotid disease is unrelated to the CSF dynamics being tested in NPH.' },
    ],
    discriminator: 'In normal-pressure hydrocephalus, a high-volume LP (tap test) that transiently improves gait predicts a good response to ventriculoperitoneal shunting.',
    tags: { system: 'neuro', complaint: 'gait disturbance', rotation: ['neuro'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Relkin et al., Diagnosing Idiopathic Normal-Pressure Hydrocephalus (Neurosurgery guideline)', year: 2005 }],
  },

  /* ── Ischemic stroke workup ───────────────────────────────────── */
  {
    itemId: 'is-nx', version: 1, type: 'next_step', conceptId: 'ischemic-stroke', presentation: 'classic',
    stem: 'A patient arrives 90 minutes after sudden left-sided weakness. Before considering thrombolysis, what two things must be done immediately?',
    vitals: [v('Glucose', '?', true)],
    findings: ['Acute focal deficit within the treatment window.'],
    options: [
      { id: 'a', text: 'A non-contrast head CT and a fingerstick glucose', correct: true },
      { id: 'b', text: 'MRI with contrast before anything else', whyNot: 'Non-contrast CT (to exclude hemorrhage) plus glucose are immediate; MRI is not required before thrombolysis decisions.' },
      { id: 'c', text: 'Lumbar puncture', whyNot: 'LP has no role in the acute ischemic-stroke pathway and would delay treatment.' },
      { id: 'd', text: 'Start thrombolysis empirically without imaging', whyNot: 'Thrombolysis before excluding hemorrhage on CT is dangerous; imaging and glucose come first.' },
    ],
    discriminator: 'Every acute stroke gets an immediate non-contrast CT (to rule out hemorrhage) and a glucose check (hypoglycemia is a classic stroke mimic) before thrombolysis is considered.',
    tags: { system: 'neuro', complaint: 'focal deficit', rotation: ['em', 'neuro'], level: 'both' },
    difficultySeed: 0.4,
    distractorConceptIds: ['intracerebral-hemorrhage', 'stroke-thrombolysis'],
    source: [{ ref: 'Powers et al., AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke', year: 2019 }],
  },

  /* ── Bacterial meningitis ─────────────────────────────────────── */
  {
    itemId: 'bm-cm', version: 1, type: 'cant_miss', conceptId: 'bacterial-meningitis', presentation: 'severe',
    stem: 'An adult with suspected pneumococcal meningitis is about to receive antibiotics. What co-treatment reduces neurologic complications and must not be forgotten?',
    vitals: [v('Temp', '39.4', true)],
    findings: ['Fever, neck stiffness, and altered mental status.'],
    options: [
      { id: 'a', text: 'Dexamethasone given before or with the first antibiotic dose', correct: true },
      { id: 'b', text: 'Dexamethasone started 24 hours after antibiotics', whyNot: 'Adjunctive steroids must be given before/with the first dose to blunt the inflammatory response; giving them late loses the benefit.' },
      { id: 'c', text: 'No steroids ever in meningitis', whyNot: 'In suspected pneumococcal meningitis, timely dexamethasone reduces hearing loss and mortality.' },
      { id: 'd', text: 'Delay antibiotics until the steroid is arranged', whyNot: 'Antibiotics must not be delayed; the steroid is given just before or together with them.' },
    ],
    discriminator: 'Adjunctive dexamethasone reduces neurologic sequelae in pneumococcal meningitis only when given before or with the first antibiotic dose — never delay antibiotics to arrange it.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['em', 'im', 'neuro'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Tunkel et al., IDSA Practice Guidelines for the Management of Bacterial Meningitis', year: 2004 }],
  },
  {
    itemId: 'bm-nx', version: 1, type: 'next_step', conceptId: 'bacterial-meningitis', presentation: 'atypical',
    stem: 'A patient with suspected meningitis has new papilledema and a focal neurologic deficit. What should happen before lumbar puncture?',
    vitals: [],
    findings: ['Focal deficit and papilledema raising concern for raised intracranial pressure.'],
    options: [
      { id: 'a', text: 'Give antibiotics (± dexamethasone) and obtain a head CT before the LP', correct: true },
      { id: 'b', text: 'Proceed straight to LP', whyNot: 'With focal deficit/papilledema, LP risks herniation; image first — but do not delay empiric antibiotics.' },
      { id: 'c', text: 'Withhold antibiotics until the LP is done', whyNot: 'Antibiotics must be started empirically without waiting; treatment is not delayed for imaging.' },
      { id: 'd', text: 'Cancel the workup and observe', whyNot: 'Suspected bacterial meningitis is an emergency; empiric therapy and evaluation are mandatory.' },
    ],
    discriminator: 'When focal deficits, papilledema, or altered consciousness suggest raised pressure, give empiric antibiotics first, then CT before LP — treatment is never delayed for the scan.',
    tags: { system: 'neuro', complaint: 'headache', rotation: ['em', 'im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Tunkel et al., IDSA Practice Guidelines for Bacterial Meningitis', year: 2004 }],
  },

  /* ── Huntington ───────────────────────────────────────────────── */
  {
    itemId: 'hunt-tx', version: 1, type: 'tx_next_step', conceptId: 'huntington', presentation: 'classic',
    stem: 'A patient with genetically confirmed Huntington disease has chorea severe enough to interfere with daily activities. What class of drug is used to reduce the chorea?',
    vitals: [],
    findings: ['Disabling generalized chorea.'],
    options: [
      { id: 'a', text: 'A VMAT2 inhibitor (e.g., tetrabenazine/deutetrabenazine) or a dopamine-blocking antipsychotic', correct: true },
      { id: 'b', text: 'Levodopa', whyNot: 'Increasing dopaminergic tone would WORSEN chorea; the goal is to reduce dopaminergic signaling.' },
      { id: 'c', text: 'A dopamine agonist', whyNot: 'Dopamine agonists exacerbate chorea in Huntington disease.' },
      { id: 'd', text: 'Amantadine as the definitive cure', whyNot: 'No drug halts Huntington; symptomatic chorea control uses VMAT2 inhibitors or antipsychotics, and amantadine is at best adjunctive.' },
    ],
    discriminator: 'Huntington chorea is reduced by lowering dopaminergic transmission — VMAT2 inhibitors or dopamine-blocking antipsychotics — the mirror image of Parkinson treatment; nothing yet halts the disease.',
    tags: { system: 'neuro', complaint: 'movement disorder', rotation: ['neuro', 'psych'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Armstrong & Miyasaki, AAN Evidence-Based Guideline: Pharmacologic Treatment of Chorea in Huntington Disease', year: 2012 }],
  },

  /* ── Osmotic demyelination ────────────────────────────────────── */
  {
    itemId: 'cpm-ol', version: 1, type: 'one_liner', conceptId: 'central-pontine-myelinolysis', presentation: 'classic',
    stem: 'Several days after hyponatremia was corrected too quickly, a patient develops dysarthria, dysphagia, and a spastic quadriparesis with MRI signal change in the central pons. What is the diagnosis?',
    vitals: [],
    findings: ['Delayed brainstem syndrome following rapid sodium correction.'],
    options: [
      { id: 'a', text: 'Osmotic demyelination syndrome (central pontine myelinolysis)', correct: true },
      { id: 'b', text: 'Acute ischemic pontine stroke', whyNot: 'The deficit developed with a characteristic delay after overrapid sodium correction, not as a sudden vascular event.' },
      { id: 'c', text: 'Multiple sclerosis relapse', whyNot: 'MS gives disseminated CNS lesions over time, not a single central pontine lesion tied to sodium correction.' },
      { id: 'd', text: 'Guillain–Barré syndrome', whyNot: 'GBS is a peripheral areflexic weakness, not a central pontine lesion with spasticity.' },
    ],
    discriminator: 'A delayed dysarthria–dysphagia–spastic quadriparesis syndrome with central pontine MRI change after rapid sodium correction is osmotic demyelination.',
    tags: { system: 'neuro', complaint: 'weakness', rotation: ['neuro', 'im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['siadh'],
    source: [{ ref: 'Sterns, Disorders of Plasma Sodium (NEJM review)', year: 2015 }],
  },

  /* ── NF1 ──────────────────────────────────────────────────────── */
  {
    itemId: 'nf1-ol', version: 1, type: 'one_liner', conceptId: 'assoc-nf1', presentation: 'classic',
    stem: 'A child has six café-au-lait macules over 5 mm, axillary freckling, and several soft cutaneous nodules; an optic pathway glioma is found. What is the diagnosis?',
    vitals: [],
    findings: ['Multiple café-au-lait macules, axillary freckling, neurofibromas, Lisch nodules.'],
    options: [
      { id: 'a', text: 'Neurofibromatosis type 1', correct: true },
      { id: 'b', text: 'Neurofibromatosis type 2', whyNot: 'NF2 features bilateral vestibular schwannomas and few skin findings, not the café-au-lait/axillary-freckling/optic-glioma pattern.' },
      { id: 'c', text: 'Tuberous sclerosis', whyNot: 'Tuberous sclerosis shows ash-leaf spots, angiofibromas, and seizures, not café-au-lait with neurofibromas and optic glioma.' },
      { id: 'd', text: 'McCune–Albright syndrome', whyNot: 'McCune–Albright has large irregular café-au-lait macules with fibrous dysplasia and precocious puberty, not neurofibromas and Lisch nodules.' },
    ],
    discriminator: 'Café-au-lait macules, axillary/inguinal freckling, neurofibromas, Lisch nodules, and optic glioma make neurofibromatosis type 1 (chromosome 17), distinct from the bilateral vestibular schwannomas of NF2.',
    tags: { system: 'neuro', complaint: 'buzzword', rotation: ['peds', 'neuro'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Miller et al., Health Supervision for Children With Neurofibromatosis Type 1 (Pediatrics)', year: 2019 }],
  },
];

export const NEURO_DEPTH2: ContentModule = {
  concepts: [],
  subtopics: {},
  items,
};
