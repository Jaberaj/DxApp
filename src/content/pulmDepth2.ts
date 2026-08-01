/* ══════════════════════════════════════════════════════════════
   Pulmonary — breadth pour.

   New high-yield respiratory concepts to grow the block toward parity:
   tuberculosis, bronchiectasis, the PFT obstructive/restrictive split,
   obstructive sleep apnea, the solitary pulmonary nodule, the
   pneumoconioses, cystic fibrosis, the pediatric airway emergencies,
   bronchiolitis, and hypersensitivity pneumonitis — each drilled
   several ways with recognition, discrimination, and management.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (ATS/IDSA/CDC,
   GOLD, AASM, Fleischner Society, CF Foundation, AAP, primary lit).
   Synthetic patients; enters the multi-reviewer pipeline UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'tuberculosis', name: 'Tuberculosis', system: 'pulmonary', topic: 'Respiratory infection',
    illnessScript: {
      epidemiology: 'Immigrants, HIV, incarceration, homelessness; reactivation with immune compromise.',
      timeCourse: 'Weeks–months of cough, fevers, night sweats, and weight loss.',
      keyFindings: ['Reactivation: apical cavitary disease, hemoptysis', 'Sputum acid-fast bacilli / NAAT / culture', 'Latent infection: positive IGRA or tuberculin test with no active disease'],
      classicDistractors: ['Community-acquired pneumonia', 'Lung cancer', 'Fungal infection'],
    },
  },
  {
    conceptId: 'bronchiectasis', name: 'Bronchiectasis', system: 'pulmonary', topic: 'Obstructive airway disease',
    illnessScript: {
      epidemiology: 'Cystic fibrosis, prior severe/recurrent infection, ABPA, immunodeficiency.',
      timeCourse: 'Chronic daily cough with copious purulent sputum and recurrent infections.',
      keyFindings: ['Chronic cough with large-volume purulent sputum', 'Recurrent respiratory infections and hemoptysis', 'Airway dilation ("tram-track"/signet-ring) on HRCT'],
      classicDistractors: ['Chronic bronchitis (COPD)', 'Asthma'],
    },
  },
  {
    conceptId: 'obstructive-vs-restrictive', name: 'Obstructive vs restrictive pattern (PFTs)', system: 'pulmonary', topic: 'Pulmonary function testing',
    illnessScript: {
      epidemiology: 'The framework for interpreting spirometry.',
      timeCourse: 'Pattern is defined by the FEV₁/FVC ratio and lung volumes.',
      keyFindings: ['Obstructive: LOW FEV₁/FVC (< 0.7)', 'Restrictive: normal/high FEV₁/FVC with LOW total lung capacity', 'DLCO helps subclassify'],
      classicDistractors: ['Mixed defects', 'Poor test effort'],
    },
  },
  {
    conceptId: 'osa', name: 'Obstructive sleep apnea', system: 'pulmonary', topic: 'Sleep-disordered breathing',
    illnessScript: {
      epidemiology: 'Obesity, large neck circumference, male sex, retrognathia.',
      timeCourse: 'Chronic; daytime consequences from fragmented sleep.',
      keyFindings: ['Loud snoring, witnessed apneas, gasping', 'Daytime somnolence', 'Diagnosed by polysomnography; treated with CPAP'],
      classicDistractors: ['Central sleep apnea', 'Narcolepsy'],
    },
  },
  {
    conceptId: 'solitary-nodule', name: 'Solitary pulmonary nodule', system: 'pulmonary', topic: 'Pulmonary neoplasm',
    illnessScript: {
      epidemiology: 'Often incidental; malignancy risk rises with age, smoking, size, and spiculation.',
      timeCourse: 'Static (benign) vs growing (malignant).',
      keyFindings: ['Compare with any PRIOR imaging first', 'Benign features: small, smooth, calcified, stable ≥ 2 years', 'Suspicious: large, spiculated, growing → PET/biopsy'],
      classicDistractors: ['Granuloma', 'Hamartoma'],
    },
  },
  {
    conceptId: 'pneumoconioses', name: 'Pneumoconioses', system: 'pulmonary', topic: 'Interstitial & parenchymal disease',
    illnessScript: {
      epidemiology: 'Occupational inhalational exposures with long latency.',
      timeCourse: 'Years after exposure.',
      keyFindings: ['Asbestosis: LOWER lobes, pleural plaques, mesothelioma/bronchogenic cancer risk', 'Silicosis: UPPER lobes, eggshell calcification, increased TB risk', 'Coal workers: upper-lobe nodules'],
      classicDistractors: ['Sarcoidosis', 'Idiopathic pulmonary fibrosis'],
    },
  },
  {
    conceptId: 'cystic-fibrosis', name: 'Cystic fibrosis', system: 'pulmonary', topic: 'Obstructive airway disease',
    illnessScript: {
      epidemiology: 'Autosomal recessive CFTR mutation; presents in childhood.',
      timeCourse: 'Recurrent sinopulmonary infection and pancreatic insufficiency.',
      keyFindings: ['Recurrent infections (Pseudomonas), bronchiectasis', 'Pancreatic insufficiency (steatorrhea, failure to thrive)', 'Elevated sweat chloride'],
      classicDistractors: ['Primary ciliary dyskinesia', 'Immunodeficiency'],
    },
  },
  {
    conceptId: 'hypersensitivity-pneumonitis', name: 'Hypersensitivity pneumonitis', system: 'pulmonary', topic: 'Interstitial & parenchymal disease',
    illnessScript: {
      epidemiology: 'Inhaled organic antigens — birds, molds (farmer’s lung), hot tubs.',
      timeCourse: 'Cough/dyspnea hours after exposure; improves away from the antigen.',
      keyFindings: ['Symptoms tied to a specific exposure', 'Improvement when away from the antigen', 'Antigen avoidance is the cornerstone'],
      classicDistractors: ['Asthma', 'Idiopathic pulmonary fibrosis'],
    },
  },
];

const subtopics: Record<string, string> = {
  'tuberculosis': 'pulm.infection',
  'bronchiectasis': 'pulm.airways',
  'obstructive-vs-restrictive': 'pulm.airways',
  'osa': 'pulm.airways',
  'solitary-nodule': 'pulm.neoplasm',
  'pneumoconioses': 'pulm.parenchyma',
  'cystic-fibrosis': 'pulm.airways',
  'hypersensitivity-pneumonitis': 'pulm.parenchyma',
};

const alsoSystems: Record<string, System[]> = {
  'tuberculosis': ['infectious'],
  'cystic-fibrosis': ['pediatrics', 'gi'],
};

const items: RawItem[] = [
  /* ── Tuberculosis ─────────────────────────────────────────────── */
  {
    itemId: 'tb-ol', version: 1, type: 'one_liner', conceptId: 'tuberculosis', presentation: 'classic',
    stem: 'A recent immigrant has weeks of cough, night sweats, weight loss, and hemoptysis; the chest X-ray shows an apical cavitary lesion. What is the most likely diagnosis?',
    vitals: [v('Temp', '38.0', false)],
    findings: ['Chronic constitutional symptoms with apical cavitation.'],
    options: [
      { id: 'a', text: 'Reactivation pulmonary tuberculosis', correct: true },
      { id: 'b', text: 'Community-acquired pneumonia', whyNot: 'CAP is acute over days with lobar consolidation, not a weeks-long cavitary apical illness with night sweats and weight loss.' },
      { id: 'c', text: 'Heart failure', whyNot: 'Heart failure causes dependent edema and orthopnea, not apical cavitation with constitutional symptoms.' },
      { id: 'd', text: 'Asthma', whyNot: 'Asthma causes episodic wheeze, not cavitary lung disease with hemoptysis and weight loss.' },
    ],
    discriminator: 'Weeks of cough, night sweats, weight loss, and hemoptysis with an APICAL CAVITARY lesion in an at-risk patient is reactivation tuberculosis.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Lewinsohn et al., ATS/IDSA/CDC Clinical Practice Guidelines: Diagnosis of Tuberculosis in Adults and Children', year: 2017 }],
  },
  {
    itemId: 'tb-nx', version: 1, type: 'next_step', conceptId: 'tuberculosis', presentation: 'severe',
    stem: 'A patient with suspected active pulmonary tuberculosis is being admitted. What are the immediate priorities?',
    vitals: [],
    findings: ['High suspicion of contagious active TB.'],
    options: [
      { id: 'a', text: 'Airborne isolation (negative-pressure room) and sputum for AFB smear/NAAT and culture', correct: true },
      { id: 'b', text: 'Place in a standard room and start antibiotics for pneumonia', whyNot: 'Active TB is airborne-transmissible; isolation and mycobacterial testing are needed, not standard-room CAP care.' },
      { id: 'c', text: 'Discharge pending an outpatient IGRA', whyNot: 'IGRA detects infection but does not rule out active contagious disease; sputum testing with isolation is required.' },
      { id: 'd', text: 'Begin RIPE therapy without any microbiologic testing', whyNot: 'Sputum for smear/NAAT/culture (with drug-susceptibility) should be obtained to confirm and guide therapy.' },
    ],
    discriminator: 'Suspected active pulmonary TB requires airborne isolation and sputum for AFB smear, NAAT, and culture before or alongside starting therapy — protecting others while confirming the diagnosis.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Lewinsohn et al., ATS/IDSA/CDC Guidelines: Diagnosis of Tuberculosis', year: 2017 }],
  },
  {
    itemId: 'tb-tx', version: 1, type: 'tx_next_step', conceptId: 'tuberculosis', presentation: 'classic',
    stem: 'A patient has confirmed drug-susceptible active pulmonary tuberculosis. What is the standard initial treatment?',
    vitals: [],
    findings: ['Culture-confirmed, drug-susceptible active TB.'],
    options: [
      { id: 'a', text: 'Four-drug therapy (rifampin, isoniazid, pyrazinamide, ethambutol) — "RIPE"', correct: true },
      { id: 'b', text: 'Isoniazid monotherapy', whyNot: 'Single-drug therapy breeds resistance; isoniazid alone is for LATENT infection, not active disease.' },
      { id: 'c', text: 'A short azithromycin course', whyNot: 'Macrolide monotherapy does not treat tuberculosis.' },
      { id: 'd', text: 'No treatment if the patient feels better', whyNot: 'Active TB requires a full multidrug course to cure and prevent transmission and resistance.' },
    ],
    discriminator: 'Active drug-susceptible tuberculosis is treated with four drugs (RIPE) — never monotherapy, which drives resistance; isoniazid alone treats only latent infection.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [{ ref: 'Nahid et al., ATS/CDC/IDSA Clinical Practice Guidelines: Treatment of Drug-Susceptible Tuberculosis', year: 2016 }],
  },

  /* ── Bronchiectasis ───────────────────────────────────────────── */
  {
    itemId: 'bronchiectasis-ol', version: 1, type: 'one_liner', conceptId: 'bronchiectasis', presentation: 'classic',
    stem: 'A patient has years of daily cough producing large volumes of purulent sputum with recurrent chest infections and occasional hemoptysis; HRCT shows dilated, thick-walled airways. What is the diagnosis?',
    vitals: [],
    findings: ['Chronic copious purulent sputum with airway dilation on CT.'],
    options: [
      { id: 'a', text: 'Bronchiectasis', correct: true },
      { id: 'b', text: 'Asthma', whyNot: 'Asthma is episodic reversible airflow obstruction, not chronic copious purulent sputum with dilated airways on CT.' },
      { id: 'c', text: 'Pulmonary embolism', whyNot: 'PE is acute pleuritic dyspnea, not a chronic productive-cough syndrome with airway dilation.' },
      { id: 'd', text: 'Idiopathic pulmonary fibrosis', whyNot: 'IPF causes dry cough with honeycombing and restriction, not large-volume purulent sputum with dilated airways.' },
    ],
    discriminator: 'Chronic daily large-volume purulent sputum with recurrent infections and airway dilation ("tram-track"/signet-ring) on HRCT is bronchiectasis.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Polverino et al., ERS Guidelines for the Management of Adult Bronchiectasis', year: 2017 }],
  },

  /* ── PFTs ─────────────────────────────────────────────────────── */
  {
    itemId: 'pft-ddx', version: 1, type: 'discriminator', conceptId: 'obstructive-vs-restrictive', presentation: 'classic',
    stem: 'On spirometry, which single value first separates an obstructive from a restrictive ventilatory defect?',
    vitals: [],
    findings: ['Interpreting the pattern of a pulmonary function test.'],
    options: [
      { id: 'a', text: 'The FEV₁/FVC ratio (low in obstruction; normal/high in restriction)', correct: true },
      { id: 'b', text: 'The FVC alone', whyNot: 'FVC can be reduced in both; the RATIO of FEV₁ to FVC is what separates obstruction from restriction.' },
      { id: 'c', text: 'The respiratory rate', whyNot: 'Respiratory rate is not a spirometric classifier of obstruction vs restriction.' },
      { id: 'd', text: 'The oxygen saturation', whyNot: 'Saturation reflects gas exchange, not the mechanical pattern on spirometry.' },
    ],
    discriminator: 'A LOW FEV₁/FVC ratio (< 0.7) defines an obstructive defect, whereas a preserved/high ratio with a reduced total lung capacity defines restriction.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Stanojevic et al., ERS/ATS Technical Standard: Interpretive Strategies for Lung Function Tests', year: 2022 }],
  },

  /* ── OSA ──────────────────────────────────────────────────────── */
  {
    itemId: 'osa-ol', version: 1, type: 'one_liner', conceptId: 'osa', presentation: 'classic',
    stem: 'An obese man has loud snoring, witnessed pauses in breathing at night, morning headaches, and daytime sleepiness. What test confirms the diagnosis, and what is first-line therapy?',
    vitals: [v('BMI', '38', true)],
    findings: ['Snoring with witnessed apneas and daytime somnolence.'],
    options: [
      { id: 'a', text: 'Polysomnography confirms obstructive sleep apnea; treat with CPAP', correct: true },
      { id: 'b', text: 'A daytime chest X-ray confirms it', whyNot: 'A chest X-ray does not diagnose sleep apnea; the sleep study (polysomnography) does.' },
      { id: 'c', text: 'Start a nightly sedative-hypnotic', whyNot: 'Sedatives worsen upper-airway collapse and are avoided in OSA.' },
      { id: 'd', text: 'Supplemental oxygen alone as first-line', whyNot: 'Oxygen does not relieve the airway obstruction; CPAP splints the airway and is first-line.' },
    ],
    discriminator: 'Snoring with witnessed apneas and daytime sleepiness in an obese patient is obstructive sleep apnea — confirmed by polysomnography and treated with CPAP (plus weight loss).',
    tags: { system: 'pulmonary', complaint: 'daytime sleepiness', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'Kapur et al., AASM Clinical Practice Guideline: Diagnostic Testing for Adult Obstructive Sleep Apnea', year: 2017 }],
  },

  /* ── Solitary nodule ──────────────────────────────────────────── */
  {
    itemId: 'nodule-nx', version: 1, type: 'next_step', conceptId: 'solitary-nodule', presentation: 'classic',
    stem: 'A 6-mm pulmonary nodule is found incidentally on CT. What is the single most useful first step in assessing it?',
    vitals: [],
    findings: ['An incidental small nodule with no prior comparison available yet.'],
    options: [
      { id: 'a', text: 'Compare with any prior imaging to assess stability', correct: true },
      { id: 'b', text: 'Immediate surgical resection', whyNot: 'Resecting every small nodule causes needless harm; stability over time and risk features guide management.' },
      { id: 'c', text: 'Empiric chemotherapy', whyNot: 'There is no tissue diagnosis; chemotherapy is never started for an undiagnosed small nodule.' },
      { id: 'd', text: 'Ignore it entirely', whyNot: 'Nodules need risk-based follow-up (e.g., Fleischner criteria), not to be dismissed without assessment.' },
    ],
    discriminator: 'The first step for a solitary pulmonary nodule is to compare with prior imaging — stability for ≥ 2 years strongly favors benignity — then stratify by size and risk (Fleischner criteria) for surveillance versus PET/biopsy.',
    tags: { system: 'pulmonary', complaint: 'lung nodule', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['lung-cancer-types'],
    source: [{ ref: 'MacMahon et al., Fleischner Society Guidelines for Management of Incidental Pulmonary Nodules', year: 2017 }],
  },

  /* ── Pneumoconioses ───────────────────────────────────────────── */
  {
    itemId: 'pneumo-assoc', version: 1, type: 'association', conceptId: 'pneumoconioses', presentation: 'classic',
    stem: 'A retired shipyard insulator has dyspnea with LOWER-lobe fibrosis and pleural plaques on imaging. Which exposure and complication does this pattern suggest?',
    vitals: [],
    findings: ['Lower-zone fibrosis with calcified pleural plaques.'],
    options: [
      { id: 'a', text: 'Asbestos exposure — risk of mesothelioma and bronchogenic carcinoma', correct: true },
      { id: 'b', text: 'Silica exposure with eggshell calcification', whyNot: 'Silicosis affects the UPPER lobes with eggshell nodal calcification, not lower-lobe disease with pleural plaques.' },
      { id: 'c', text: 'Coal dust with upper-lobe nodules', whyNot: 'Coal workers’ pneumoconiosis is upper-lobe nodular disease, not lower-lobe fibrosis with pleural plaques.' },
      { id: 'd', text: 'Berylliosis', whyNot: 'Berylliosis mimics sarcoid with granulomas, not asbestos-type lower-lobe fibrosis and pleural plaques.' },
    ],
    discriminator: 'Lower-lobe fibrosis with pleural plaques in a shipyard/insulation worker is asbestosis — carrying risk of mesothelioma and bronchogenic carcinoma — whereas silica and coal cause UPPER-lobe disease.',
    tags: { system: 'pulmonary', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    source: [{ ref: 'ATS — Diagnosis and Initial Management of Nonmalignant Diseases Related to Asbestos (Official Statement)', year: 2004 }],
  },

  /* ── Cystic fibrosis ──────────────────────────────────────────── */
  {
    itemId: 'cf-ol', version: 1, type: 'one_liner', conceptId: 'cystic-fibrosis', presentation: 'classic',
    stem: 'A young child has recurrent sinopulmonary infections (including Pseudomonas), bulky greasy stools, and failure to thrive. What single test confirms the diagnosis?',
    vitals: [],
    findings: ['Recurrent infections with pancreatic insufficiency and poor growth.'],
    options: [
      { id: 'a', text: 'An elevated sweat chloride (with CFTR analysis)', correct: true },
      { id: 'b', text: 'A serum IgE level', whyNot: 'IgE evaluates allergy/ABPA, not the CFTR defect; the sweat chloride test diagnoses cystic fibrosis.' },
      { id: 'c', text: 'A tuberculin skin test', whyNot: 'A TST screens for TB infection, unrelated to the CF phenotype here.' },
      { id: 'd', text: 'A D-dimer', whyNot: 'D-dimer assesses thromboembolism, not cystic fibrosis.' },
    ],
    discriminator: 'Recurrent sinopulmonary infection (Pseudomonas) with pancreatic insufficiency and failure to thrive in a child is cystic fibrosis, confirmed by an elevated sweat chloride and CFTR testing.',
    tags: { system: 'pulmonary', complaint: 'cough', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Farrell et al., Diagnosis of Cystic Fibrosis: Cystic Fibrosis Foundation Consensus Guidelines', year: 2017 }],
  },

  /* ── Croup vs epiglottitis ────────────────────────────────────── */
  {
    itemId: 'croup-cm', version: 1, type: 'cant_miss', conceptId: 'croup-vs-epiglottitis', presentation: 'severe',
    stem: 'An unvaccinated child is toxic-appearing, drooling, leaning forward on both hands (tripod), with muffled voice and rapidly worsening stridor. What must you NOT do, and what is the concern?',
    vitals: [v('Temp', '39.4', true)],
    findings: ['Rapid onset, toxic, drooling, tripod posture.'],
    options: [
      { id: 'a', text: 'Do NOT examine the throat or agitate the child — this is epiglottitis; secure the airway in a controlled setting', correct: true },
      { id: 'b', text: 'Depress the tongue for a good look at the throat', whyNot: 'Instrumenting the pharynx in epiglottitis can trigger complete airway obstruction; the airway is secured first in a controlled setting (OR).' },
      { id: 'c', text: 'Send home with oral steroids as for croup', whyNot: 'The toxic, drooling, tripod picture is epiglottitis, not croup; it is a life-threatening airway emergency.' },
      { id: 'd', text: 'Force the child supine for imaging', whyNot: 'Lying the child flat and agitating them can precipitate airway collapse; keep them calm and upright.' },
    ],
    discriminator: 'Epiglottitis (toxic, drooling, tripod, muffled voice, rapid onset) is an airway emergency — do not examine the throat or agitate the child; secure the airway in a controlled setting, unlike the barky, steeple-sign croup.',
    tags: { system: 'pediatrics', complaint: 'stridor', rotation: ['peds', 'em'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Woods, Clinical Features and Diagnosis of Croup and Epiglottitis (peer-reviewed review)', year: 2019 }],
  },
  {
    itemId: 'croup-ddx', version: 1, type: 'discriminator', conceptId: 'croup-vs-epiglottitis', presentation: 'classic',
    stem: 'A toddler has a barky "seal-like" cough and inspiratory stridor for two days following a cold, but is well-appearing with no drooling. A neck film shows a "steeple sign." What is the diagnosis and treatment?',
    vitals: [v('Temp', '38.1', false)],
    findings: ['Barky cough with steeple sign; non-toxic.'],
    options: [
      { id: 'a', text: 'Croup — corticosteroids (± nebulized epinephrine if stridor at rest)', correct: true },
      { id: 'b', text: 'Epiglottitis — emergent airway', whyNot: 'The gradual barky cough with a steeple sign in a well-appearing child is croup, not the toxic drooling of epiglottitis.' },
      { id: 'c', text: 'Asthma — bronchodilators', whyNot: 'Croup is upper-airway (inspiratory stridor, barky cough), not the expiratory wheeze of asthma.' },
      { id: 'd', text: 'Foreign body — bronchoscopy', whyNot: 'A post-viral barky cough with steeple sign is croup, not the sudden choking of aspiration.' },
    ],
    discriminator: 'A barky cough with inspiratory stridor and a "steeple sign" after a URI in a well child is croup (parainfluenza), treated with corticosteroids and nebulized epinephrine for stridor at rest — distinct from toxic epiglottitis.',
    tags: { system: 'pediatrics', complaint: 'stridor', rotation: ['peds', 'em'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Bjornson & Johnson, Croup in Children (CMAJ review)', year: 2013 }],
  },

  /* ── Bronchiolitis ────────────────────────────────────────────── */
  {
    itemId: 'bronchiolitis-tx', version: 1, type: 'tx_next_step', conceptId: 'bronchiolitis', presentation: 'classic',
    stem: 'A 9-month-old has wheeze, crackles, and mild respiratory distress after a few days of URI symptoms in winter. What is the mainstay of management?',
    vitals: [v('SpO₂', '93%', false)],
    findings: ['Typical RSV bronchiolitis in an infant.'],
    options: [
      { id: 'a', text: 'Supportive care — hydration, nasal suctioning, and oxygen as needed', correct: true },
      { id: 'b', text: 'Routine bronchodilators and corticosteroids for all', whyNot: 'Bronchodilators and steroids are not routinely beneficial in typical bronchiolitis; care is supportive.' },
      { id: 'c', text: 'Empiric antibiotics', whyNot: 'Bronchiolitis is viral; antibiotics are not indicated without a bacterial complication.' },
      { id: 'd', text: 'A chest CT for every infant', whyNot: 'Bronchiolitis is a clinical diagnosis; routine CT is unnecessary and exposes the infant to radiation.' },
    ],
    discriminator: 'Typical RSV bronchiolitis in an infant is managed with supportive care (hydration, suctioning, oxygen); routine bronchodilators, steroids, and antibiotics are not recommended.',
    tags: { system: 'pediatrics', complaint: 'wheeze', rotation: ['peds', 'em'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Ralston et al., AAP Clinical Practice Guideline: The Diagnosis, Management, and Prevention of Bronchiolitis', year: 2014 }],
  },

  /* ── Hypersensitivity pneumonitis ─────────────────────────────── */
  {
    itemId: 'hp-ol', version: 1, type: 'one_liner', conceptId: 'hypersensitivity-pneumonitis', presentation: 'classic',
    stem: 'A bird keeper has recurrent cough and dyspnea that begin a few hours after handling the birds and clear when away for a weekend. What is the diagnosis and key treatment?',
    vitals: [],
    findings: ['Symptoms temporally linked to an organic antigen exposure.'],
    options: [
      { id: 'a', text: 'Hypersensitivity pneumonitis — remove the offending antigen', correct: true },
      { id: 'b', text: 'Asthma — inhaled bronchodilators only', whyNot: 'The exposure-linked cough/dyspnea that clears away from the antigen is hypersensitivity pneumonitis; antigen avoidance is central.' },
      { id: 'c', text: 'Community-acquired pneumonia — antibiotics', whyNot: 'The recurrent, exposure-related pattern that resolves away from birds is immunologic, not bacterial pneumonia.' },
      { id: 'd', text: 'Idiopathic pulmonary fibrosis — antifibrotics', whyNot: 'IPF is progressive without an exposure link; here symptoms track a specific antigen and improve on avoidance.' },
    ],
    discriminator: 'Cough and dyspnea that begin hours after an organic-antigen exposure (birds, mold/farmer’s lung) and improve away from it is hypersensitivity pneumonitis — treated first by removing the antigen.',
    tags: { system: 'pulmonary', complaint: 'dyspnea', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Raghu et al., ATS/JRS/ALAT Clinical Practice Guideline: Diagnosis of Hypersensitivity Pneumonitis in Adults', year: 2020 }],
  },
];

export const PULM_DEPTH2: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
