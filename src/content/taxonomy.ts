/* ══════════════════════════════════════════════════════════════
   Cadence — content taxonomy
   The single source of truth for coverage: system → subtopic →
   concept. Subtopic IDs are STABLE join keys; concepts point at
   them, the coverage tracker reports against them, and the build
   fails if a concept names a subtopic that isn't here.

   `usmleOutlineRefs` cite the PUBLIC USMLE Content Outline organ-
   system sections only. No commercial question-bank material is
   referenced anywhere in this app (enforced at build time).

   Scope is deliberately broad — most subtopics have no content yet.
   That is the point: an empty subtopic is a visible, trackable gap,
   which is what makes "cover the tested USMLE topics" a measurable
   target rather than a vibe.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';

export interface Subtopic {
  /** stable id, e.g. "cv.ischemia" — never renumber */
  id: string;
  name: string;
  system: System;
  /** public USMLE Content Outline section references */
  usmleOutlineRefs: string[];
}

export interface SystemNode {
  id: System;
  name: string;
  /** cross-cutting disciplines that span organ systems */
  crossCutting?: boolean;
  subtopics: Subtopic[];
}

const S = (id: string, name: string, system: System, refs: string[]): Subtopic => ({
  id,
  name,
  system,
  usmleOutlineRefs: refs,
});

export const TAXONOMY: SystemNode[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    subtopics: [
      S('cv.ischemia', 'Ischemic heart disease', 'cardiovascular', ['Cardiovascular System: Ischemic heart disease']),
      S('cv.heart-failure', 'Heart failure & shock', 'cardiovascular', ['Cardiovascular System: Heart failure']),
      S('cv.arrhythmia', 'Arrhythmias & conduction', 'cardiovascular', ['Cardiovascular System: Dysrhythmias']),
      S('cv.valvular', 'Valvular disease & endocarditis', 'cardiovascular', ['Cardiovascular System: Valvular heart disease']),
      S('cv.pericardial', 'Pericardial disease & tamponade', 'cardiovascular', ['Cardiovascular System: Diseases of the pericardium']),
      S('cv.vascular', 'Vascular & aortic disease', 'cardiovascular', ['Cardiovascular System: Diseases of the aorta & peripheral vessels']),
      S('cv.congenital', 'Congenital heart disease', 'cardiovascular', ['Cardiovascular System: Congenital disorders']),
      S('cv.htn-lipids', 'Hypertension & dyslipidemia', 'cardiovascular', ['Cardiovascular System: Hypertension', 'Cardiovascular System: Dyslipidemia']),
    ],
  },
  {
    id: 'pulmonary',
    name: 'Pulmonary',
    subtopics: [
      S('pulm.airways', 'Obstructive airway disease', 'pulmonary', ['Respiratory System: Obstructive airway disease']),
      S('pulm.vte', 'Pulmonary embolism & VTE', 'pulmonary', ['Respiratory System: Pulmonary vascular disease']),
      S('pulm.infection', 'Lower respiratory infection', 'pulmonary', ['Respiratory System: Infectious disorders']),
      S('pulm.pleura', 'Pleural disease & pneumothorax', 'pulmonary', ['Respiratory System: Pleural, mediastinal & chest wall']),
      S('pulm.parenchyma', 'Interstitial & parenchymal disease', 'pulmonary', ['Respiratory System: Restrictive & ILD']),
      S('pulm.critical', 'Respiratory failure & ARDS', 'pulmonary', ['Respiratory System: Respiratory failure']),
      S('pulm.neoplasm', 'Pulmonary neoplasms & nodules', 'pulmonary', ['Respiratory System: Neoplasms']),
      S('pulm.vascular', 'Pulmonary hypertension', 'pulmonary', ['Respiratory System: Pulmonary vascular disease']),
    ],
  },
  {
    id: 'renal',
    name: 'Renal & Genitourinary',
    subtopics: [
      S('renal.aki', 'Acute kidney injury', 'renal', ['Renal/Urinary System: Acute kidney injury']),
      S('renal.ckd', 'Chronic kidney disease', 'renal', ['Renal/Urinary System: Chronic kidney disease']),
      S('renal.electrolytes', 'Electrolyte disorders', 'renal', ['Renal/Urinary System: Fluid, electrolyte & acid-base']),
      S('renal.acid-base', 'Acid–base disorders', 'renal', ['Renal/Urinary System: Fluid, electrolyte & acid-base']),
      S('renal.glomerular', 'Glomerular disease', 'renal', ['Renal/Urinary System: Glomerular disorders']),
      S('renal.tubulointerstitial', 'Tubulointerstitial & cystic', 'renal', ['Renal/Urinary System: Tubulointerstitial disorders']),
      S('renal.stones-uti', 'Stones & urinary infection', 'renal', ['Renal/Urinary System: Urinary tract obstruction & infection']),
      S('renal.gu', 'Male GU & prostate', 'renal', ['Reproductive/Renal: Male reproductive & prostate']),
    ],
  },
  {
    id: 'gi',
    name: 'GI & Hepatobiliary',
    subtopics: [
      S('gi.upper', 'Esophageal & gastric', 'gi', ['GI System: Esophagus & stomach']),
      S('gi.lower', 'Intestinal disease', 'gi', ['GI System: Small bowel & colon']),
      S('gi.hepatic', 'Liver disease', 'gi', ['GI System: Hepatic disorders']),
      S('gi.biliary', 'Biliary & pancreatic', 'gi', ['GI System: Biliary tract & pancreas']),
      S('gi.bleed', 'GI bleeding', 'gi', ['GI System: Signs, symptoms & ill-defined']),
      S('gi.infectious', 'Infectious diarrhea', 'gi', ['GI System: Infectious disorders']),
      S('gi.neoplasm', 'GI neoplasms', 'gi', ['GI System: Neoplasms']),
      S('gi.nutrition', 'Malabsorption & nutrition', 'gi', ['GI System: Nutritional disorders']),
    ],
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    subtopics: [
      S('endo.diabetes', 'Diabetes & glycemic emergencies', 'endocrine', ['Endocrine System: Diabetes mellitus']),
      S('endo.thyroid', 'Thyroid disorders', 'endocrine', ['Endocrine System: Thyroid disorders']),
      S('endo.adrenal', 'Adrenal disorders', 'endocrine', ['Endocrine System: Adrenal disorders']),
      S('endo.pituitary', 'Pituitary & hypothalamic', 'endocrine', ['Endocrine System: Hypothalamic-pituitary']),
      S('endo.calcium', 'Calcium & bone metabolism', 'endocrine', ['Endocrine System: Calcium & bone metabolism']),
      S('endo.repro-endo', 'Reproductive endocrinology', 'endocrine', ['Endocrine System: Reproductive endocrinology']),
      S('endo.lipid-metab', 'Metabolic disorders', 'endocrine', ['Endocrine System: Nutritional & metabolic']),
    ],
  },
  {
    id: 'neuro',
    name: 'Neuroscience',
    subtopics: [
      S('neuro.stroke', 'Cerebrovascular disease', 'neuro', ['Nervous System: Cerebrovascular disease']),
      S('neuro.seizure', 'Seizure & epilepsy', 'neuro', ['Nervous System: Paroxysmal disorders']),
      S('neuro.headache', 'Headache disorders', 'neuro', ['Nervous System: Headache syndromes']),
      S('neuro.neuromuscular', 'Neuromuscular & peripheral nerve', 'neuro', ['Nervous System: Peripheral nerve & muscle']),
      S('neuro.movement', 'Movement & neurodegenerative', 'neuro', ['Nervous System: Neurodegenerative & movement']),
      S('neuro.demyelinating', 'Demyelinating disease', 'neuro', ['Nervous System: Demyelinating disease']),
      S('neuro.infection-neuro', 'CNS infection', 'neuro', ['Nervous System: Infectious disorders']),
      S('neuro.altered', 'Altered mental status & delirium', 'neuro', ['Nervous System: Global cerebral dysfunction']),
      S('neuro.neurocutaneous', 'Phakomatoses & neurocutaneous', 'neuro', ['Nervous System: Congenital disorders']),
    ],
  },
  {
    id: 'heme_onc',
    name: 'Heme & Onc',
    subtopics: [
      S('heme.anemia', 'Anemias', 'heme_onc', ['Blood/Lymphoreticular: Anemias']),
      S('heme.hemostasis', 'Bleeding & clotting disorders', 'heme_onc', ['Blood/Lymphoreticular: Coagulation disorders']),
      S('heme.leukemia', 'Leukemias', 'heme_onc', ['Blood/Lymphoreticular: Leukemias']),
      S('heme.lymphoma', 'Lymphomas & plasma cell', 'heme_onc', ['Blood/Lymphoreticular: Lymphomas']),
      S('heme.myeloproliferative', 'Myeloproliferative & MDS', 'heme_onc', ['Blood/Lymphoreticular: Myeloproliferative disorders']),
      S('heme.micro', 'Thrombotic microangiopathies', 'heme_onc', ['Blood/Lymphoreticular: Platelet disorders']),
      S('onc.solid', 'Solid tumors & oncologic emergencies', 'heme_onc', ['Multisystem: Neoplasia']),
      S('heme.transfusion', 'Transfusion & hemolysis', 'heme_onc', ['Blood/Lymphoreticular: Hemolytic anemias']),
    ],
  },
  {
    id: 'infectious',
    name: 'Infectious Disease',
    subtopics: [
      S('id.sepsis', 'Sepsis & bloodstream infection', 'infectious', ['Multisystem: Infectious disorders']),
      S('id.respiratory-id', 'Respiratory infections', 'infectious', ['Respiratory System: Infectious disorders']),
      S('id.gi-id', 'GI & intra-abdominal infection', 'infectious', ['GI System: Infectious disorders']),
      S('id.uti-id', 'Urinary & genital infection', 'infectious', ['Renal/Urinary System: Infectious disorders']),
      S('id.cns-id', 'CNS infection', 'infectious', ['Nervous System: Infectious disorders']),
      S('id.skin-soft', 'Skin & soft tissue infection', 'infectious', ['Skin/Subcutaneous: Infectious disorders']),
      S('id.hiv-oi', 'HIV & opportunistic infection', 'infectious', ['Immune System: HIV & immunodeficiency']),
      S('id.zoonotic', 'Tick-borne & zoonotic', 'infectious', ['Multisystem: Infectious disorders']),
    ],
  },
  {
    id: 'msk_rheum',
    name: 'MSK & Rheumatology',
    subtopics: [
      S('rheum.inflammatory-arthritis', 'Inflammatory & seronegative arthritis', 'msk_rheum', ['MSK System: Rheumatologic disorders']),
      S('rheum.crystal', 'Crystal arthropathies', 'msk_rheum', ['MSK System: Rheumatologic disorders']),
      S('rheum.connective', 'Connective tissue disease', 'msk_rheum', ['Immune System: Connective tissue disorders']),
      S('rheum.vasculitis', 'Vasculitides', 'msk_rheum', ['Immune System: Vasculitis']),
      S('rheum.myopathy', 'Inflammatory myopathies', 'msk_rheum', ['MSK System: Muscular disorders']),
      S('msk.spine-soft', 'Back pain & soft tissue', 'msk_rheum', ['MSK System: Signs, symptoms & ill-defined']),
      S('msk.bone', 'Metabolic bone & fracture', 'msk_rheum', ['MSK System: Osteopenia & metabolic bone']),
      S('msk.infection', 'Septic arthritis & osteomyelitis', 'msk_rheum', ['MSK System: Infectious disorders']),
    ],
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    subtopics: [
      S('derm.infections', 'Cutaneous infections & infestations', 'dermatology', ['Skin/Subcutaneous: Infectious disorders']),
      S('derm.inflammatory', 'Papulosquamous & eczematous', 'dermatology', ['Skin/Subcutaneous: Inflammatory disorders']),
      S('derm.bullous', 'Bullous & severe drug eruptions', 'dermatology', ['Skin/Subcutaneous: Bullous & drug reactions']),
      S('derm.neoplasm', 'Skin neoplasms', 'dermatology', ['Skin/Subcutaneous: Neoplasms']),
      S('derm.systemic', 'Cutaneous signs of systemic disease', 'dermatology', ['Skin/Subcutaneous: Signs of systemic disease']),
      S('derm.hypersensitivity', 'Urticaria & hypersensitivity', 'dermatology', ['Immune System: Hypersensitivity']),
    ],
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    subtopics: [
      S('psych.mood', 'Mood disorders', 'psychiatry', ['Behavioral Health: Mood disorders']),
      S('psych.anxiety', 'Anxiety, OCD & trauma', 'psychiatry', ['Behavioral Health: Anxiety disorders']),
      S('psych.psychotic', 'Psychotic disorders', 'psychiatry', ['Behavioral Health: Psychotic disorders']),
      S('psych.substance', 'Substance use & withdrawal', 'psychiatry', ['Behavioral Health: Substance use disorders']),
      S('psych.neurocognitive', 'Neurocognitive disorders', 'psychiatry', ['Behavioral Health: Neurocognitive disorders']),
      S('psych.somatic-personality', 'Somatic & personality disorders', 'psychiatry', ['Behavioral Health: Personality & somatic']),
      S('psych.child-psych', 'Child & neurodevelopmental', 'psychiatry', ['Behavioral Health: Neurodevelopmental disorders']),
      S('psych.eating', 'Eating disorders', 'psychiatry', ['Behavioral Health: Eating disorders']),
    ],
  },
  {
    id: 'reproductive',
    name: 'Reproductive',
    subtopics: [
      S('repro.obstetrics', 'Pregnancy & complications', 'reproductive', ['Female Reproductive: Pregnancy, childbirth & puerperium']),
      S('repro.gyn-benign', 'Benign gynecology', 'reproductive', ['Female Reproductive: Menstrual & endocrine']),
      S('repro.gyn-onc', 'Gynecologic oncology', 'reproductive', ['Female Reproductive: Neoplasms']),
      S('repro.breast', 'Breast disease', 'reproductive', ['Female Reproductive: Breast disorders']),
      S('repro.infertility', 'Infertility & menstrual disorders', 'reproductive', ['Female Reproductive: Infertility']),
      S('repro.sti', 'Sexually transmitted infection', 'reproductive', ['Reproductive: Infectious disorders']),
      S('repro.contraception', 'Contraception & family planning', 'reproductive', ['Female Reproductive: Contraception']),
    ],
  },
  {
    id: 'multisystem',
    name: 'Multisystem & Critical Care',
    crossCutting: true,
    subtopics: [
      S('multi.shock', 'Shock & resuscitation', 'multisystem', ['Multisystem: Traumatic & mechanical injury']),
      S('multi.allergy-immuno', 'Allergy & immunology', 'multisystem', ['Immune System: Immediate hypersensitivity']),
      S('multi.toxicology', 'Toxicology & overdose', 'multisystem', ['Multisystem: Adverse effects of drugs']),
      S('multi.acid-base-fluids', 'Fluids, electrolytes & acid–base', 'multisystem', ['Multisystem: Fluid & electrolyte']),
      S('multi.nutrition-vitamin', 'Nutritional & vitamin disorders', 'multisystem', ['Multisystem: Nutritional disorders']),
      S('multi.geriatrics', 'Geriatric syndromes', 'multisystem', ['Multisystem: Geriatric care']),
      S('multi.preventive', 'Preventive medicine & screening', 'multisystem', ['Multisystem: Health maintenance & screening']),
      S('multi.genetics', 'Genetic & metabolic syndromes', 'multisystem', ['Multisystem: Genetic disorders']),
    ],
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    crossCutting: true,
    subtopics: [
      S('peds.neonatal', 'Neonatology', 'pediatrics', ['Multisystem: Perinatal & neonatal']),
      S('peds.development', 'Growth & development', 'pediatrics', ['Multisystem: Normal growth & development']),
      S('peds.peds-infectious', 'Pediatric infectious disease', 'pediatrics', ['Multisystem: Infectious disorders']),
      S('peds.peds-respiratory', 'Pediatric respiratory', 'pediatrics', ['Respiratory System: Pediatric airway disease']),
      S('peds.congenital-genetic', 'Congenital & genetic syndromes', 'pediatrics', ['Multisystem: Congenital disorders']),
      S('peds.peds-gi', 'Pediatric GI', 'pediatrics', ['GI System: Congenital & pediatric']),
      S('peds.vaccines', 'Immunization & prevention', 'pediatrics', ['Multisystem: Health maintenance']),
    ],
  },
];

/* ── flat indices ──────────────────────────────────────────── */

export const SUBTOPICS: Subtopic[] = TAXONOMY.flatMap((s) => s.subtopics);

const SUBTOPIC_INDEX = new Map(SUBTOPICS.map((s) => [s.id, s]));

export function subtopicById(id: string): Subtopic | undefined {
  return SUBTOPIC_INDEX.get(id);
}

export function systemNode(id: System): SystemNode | undefined {
  return TAXONOMY.find((s) => s.id === id);
}

/** Every subtopic id in the taxonomy — the set concepts must map into. */
export const SUBTOPIC_IDS: ReadonlySet<string> = new Set(SUBTOPICS.map((s) => s.id));
