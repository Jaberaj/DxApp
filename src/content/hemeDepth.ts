/* ══════════════════════════════════════════════════════════════
   Heme & Onc — variety pour.

   Heme was the thinnest flagship block — almost all single buzzword
   associations with few real disease concepts. This module adds the
   clinical spine: the anemias (iron, B12/folate, thalassemia, sickle,
   hemolytic), the bleeding/clotting disorders (ITP, hemophilia, vWD,
   HIT), the plasma-cell and myeloproliferative diseases, acute leukemia,
   and depth on the oncologic emergencies — each drilled several ways
   with recognition, discrimination, and management.

   Sourcing (docs/CONTENT_POLICY.md): PUBLIC sources only (ASH, ASCO,
   NCCN, BCSH, primary literature). Board-prep is coverage/inspiration
   only, never copied. Synthetic patients; enters review UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'iron-deficiency-anemia', name: 'Iron deficiency anemia', system: 'heme_onc', topic: 'Microcytic anemia',
    illnessScript: {
      epidemiology: 'Menstrual/pregnancy loss in women; occult GI blood loss in men and postmenopausal women.',
      timeCourse: 'Gradual fatigue, pallor, pica; microcytosis develops as stores deplete.',
      keyFindings: ['Microcytic hypochromic anemia', 'Low ferritin, low iron, HIGH TIBC', 'A GI source must be sought in men/older women'],
      classicDistractors: ['Anemia of chronic disease (high ferritin)', 'Thalassemia (normal/high RBC count)'],
    },
  },
  {
    conceptId: 'b12-folate-deficiency', name: 'B12 vs folate deficiency', system: 'heme_onc', topic: 'Macrocytic anemia',
    illnessScript: {
      epidemiology: 'B12: pernicious anemia, ileal disease, vegans. Folate: poor intake, alcohol, pregnancy, methotrexate.',
      timeCourse: 'Macrocytic anemia; B12 additionally causes a subacute combined degeneration.',
      keyFindings: ['Macrocytosis with hypersegmented neutrophils', 'B12: high methylmalonic acid + neurologic signs', 'Folate: high homocysteine, MMA normal, no neuro signs'],
      classicDistractors: ['Alcohol/liver macrocytosis', 'Myelodysplastic syndrome'],
    },
  },
  {
    conceptId: 'thalassemia', name: 'Thalassemia', system: 'heme_onc', topic: 'Microcytic anemia',
    illnessScript: {
      epidemiology: 'Mediterranean, African, and Southeast Asian ancestry; inherited globin-chain defect.',
      timeCourse: 'Lifelong microcytic anemia, often mild, with a normal or high red-cell count.',
      keyFindings: ['Microcytosis out of proportion to mild anemia', 'Normal/HIGH RBC count, low Mentzer index', 'Target cells; elevated HbA₂ in β-thalassemia', 'Normal iron studies'],
      classicDistractors: ['Iron deficiency (low RBC count, low ferritin)'],
    },
  },
  {
    conceptId: 'sickle-cell', name: 'Sickle cell disease', system: 'heme_onc', topic: 'Hemoglobinopathy',
    illnessScript: {
      epidemiology: 'Homozygous HbSS; African ancestry; presents in childhood.',
      timeCourse: 'Chronic hemolysis punctuated by vaso-occlusive crises and acute complications.',
      keyFindings: ['Vaso-occlusive pain crises', 'Acute chest syndrome (fever, hypoxia, new infiltrate)', 'Functional asplenia → encapsulated-organism risk', 'Hydroxyurea reduces crises'],
      classicDistractors: ['Sickle cell trait (usually asymptomatic)'],
    },
  },
  {
    conceptId: 'hemolytic-anemia', name: 'Hemolytic anemia (warm vs cold)', system: 'heme_onc', topic: 'Hemolysis',
    illnessScript: {
      epidemiology: 'Warm (IgG): idiopathic, SLE, CLL, drugs. Cold (IgM): Mycoplasma, EBV, lymphoma.',
      timeCourse: 'Anemia with jaundice; severity varies with the trigger.',
      keyFindings: ['High LDH and indirect bilirubin, LOW haptoglobin, high reticulocytes', 'Warm: IgG, spherocytes, positive direct antiglobulin (Coombs) test', 'Cold: IgM cold agglutinins'],
      classicDistractors: ['Bleeding-related anemia (haptoglobin normal)', 'Ineffective erythropoiesis'],
    },
  },
  {
    conceptId: 'itp', name: 'Immune thrombocytopenia', system: 'heme_onc', topic: 'Platelet disorders',
    illnessScript: {
      epidemiology: 'Children after a viral illness; adults often chronic. A diagnosis of exclusion.',
      timeCourse: 'Isolated thrombocytopenia with mucocutaneous bleeding in an otherwise well patient.',
      keyFindings: ['ISOLATED thrombocytopenia (normal WBC/Hgb)', 'Petechiae, mucosal bleeding', 'No schistocytes (distinguishes from TTP/DIC)'],
      classicDistractors: ['TTP (MAHA + neuro/renal)', 'DIC (consumptive coagulopathy)'],
    },
  },
  {
    conceptId: 'hemophilia', name: 'Hemophilia A/B', system: 'heme_onc', topic: 'Coagulation disorders',
    illnessScript: {
      epidemiology: 'X-linked recessive; factor VIII (A) or factor IX (B) deficiency; affects males.',
      timeCourse: 'Deep bleeding — hemarthroses and muscle hematomas — from childhood.',
      keyFindings: ['Prolonged PTT with a NORMAL PT and platelet count', 'Hemarthroses, deep-tissue bleeding', 'Corrects on mixing study (factor deficiency)'],
      classicDistractors: ['von Willebrand disease (mucocutaneous)', 'Vitamin K deficiency (PT and PTT up)'],
    },
  },
  {
    conceptId: 'von-willebrand', name: 'von Willebrand disease', system: 'heme_onc', topic: 'Coagulation disorders',
    illnessScript: {
      epidemiology: 'The most common inherited bleeding disorder; usually autosomal dominant.',
      timeCourse: 'Lifelong mucocutaneous bleeding — epistaxis, menorrhagia, easy bruising.',
      keyFindings: ['Mucocutaneous bleeding', 'Prolonged bleeding time / abnormal platelet-function assay', 'Sometimes a mildly prolonged PTT (vWF carries factor VIII)'],
      classicDistractors: ['Hemophilia (deep bleeding, X-linked male)', 'ITP (thrombocytopenia)'],
    },
  },
  {
    conceptId: 'hit', name: 'Heparin-induced thrombocytopenia', system: 'heme_onc', topic: 'Coagulation disorders',
    illnessScript: {
      epidemiology: 'Antibodies to platelet factor 4–heparin complexes, 5–10 days after heparin exposure.',
      timeCourse: 'Platelet drop with paradoxical THROMBOSIS (not bleeding).',
      keyFindings: ['Platelet fall > 50% at days 5–10 of heparin', 'New arterial/venous thrombosis', 'Positive PF4 antibody / serotonin release assay'],
      classicDistractors: ['DIC (bleeding, low fibrinogen)', 'Dilutional thrombocytopenia'],
    },
  },
  {
    conceptId: 'multiple-myeloma', name: 'Multiple myeloma', system: 'heme_onc', topic: 'Plasma cell disorders',
    illnessScript: {
      epidemiology: 'Older adults; clonal plasma-cell proliferation.',
      timeCourse: 'Bone pain, recurrent infection, renal impairment, and anemia.',
      keyFindings: ['CRAB: hyperCalcemia, Renal failure, Anemia, Bone lytic lesions', 'Monoclonal (M) spike on SPEP; Bence Jones protein in urine', 'Rouleaux on smear; marrow plasmacytosis'],
      classicDistractors: ['MGUS (asymptomatic, no CRAB)', 'Metastatic bone disease'],
    },
  },
  {
    conceptId: 'polycythemia-vera', name: 'Polycythemia vera', system: 'heme_onc', topic: 'Myeloproliferative disease',
    illnessScript: {
      epidemiology: 'JAK2 V617F–driven clonal erythrocytosis; older adults.',
      timeCourse: 'Insidious; hyperviscosity and thrombosis risk.',
      keyFindings: ['Elevated hemoglobin/hematocrit with low erythropoietin', 'Aquagenic pruritus (itching after a hot shower), erythromelalgia', 'JAK2 mutation; thrombosis risk'],
      classicDistractors: ['Secondary polycythemia (high EPO, hypoxia)', 'Relative (dehydration) polycythemia'],
    },
  },
  {
    conceptId: 'acute-leukemia', name: 'Acute leukemia (AML vs ALL)', system: 'heme_onc', topic: 'Leukemia',
    illnessScript: {
      epidemiology: 'ALL peaks in children; AML in adults. Rapid marrow failure from blast proliferation.',
      timeCourse: 'Days to weeks of fatigue, infection, and bleeding.',
      keyFindings: ['Pancytopenia with circulating BLASTS', 'AML: Auer rods, adults; ALL: children, CNS/testicular involvement', 'APL (t(15;17)) presents with DIC and needs urgent ATRA'],
      classicDistractors: ['Leukemoid reaction (no blasts, high LAP)', 'Chronic leukemias'],
    },
  },
];

const subtopics: Record<string, string> = {
  'iron-deficiency-anemia': 'heme.anemia',
  'b12-folate-deficiency': 'heme.anemia',
  'thalassemia': 'heme.anemia',
  'sickle-cell': 'heme.anemia',
  'hemolytic-anemia': 'heme.transfusion',
  'itp': 'heme.micro',
  'hemophilia': 'heme.hemostasis',
  'von-willebrand': 'heme.hemostasis',
  'hit': 'heme.hemostasis',
  'multiple-myeloma': 'heme.lymphoma',
  'polycythemia-vera': 'heme.myeloproliferative',
  'acute-leukemia': 'heme.leukemia',
};

const alsoSystems: Record<string, System[]> = {
  'sickle-cell': ['pediatrics'],
  'multiple-myeloma': ['renal'],
};

const items: RawItem[] = [
  /* ── Iron deficiency anemia ───────────────────────────────────── */
  {
    itemId: 'ida-ol', version: 1, type: 'one_liner', conceptId: 'iron-deficiency-anemia', presentation: 'classic',
    stem: 'A menstruating woman has fatigue and pica. Labs show a microcytic hypochromic anemia with LOW ferritin, low serum iron, and a HIGH total iron-binding capacity. What is the diagnosis?',
    vitals: [v('MCV', '72', true), v('Ferritin', '6', true)],
    findings: ['Microcytosis with low iron stores.'],
    options: [
      { id: 'a', text: 'Iron deficiency anemia', correct: true },
      { id: 'b', text: 'Anemia of chronic disease', whyNot: 'ACD has HIGH or normal ferritin with low TIBC; iron deficiency has low ferritin with high TIBC.' },
      { id: 'c', text: 'Thalassemia', whyNot: 'Thalassemia has a normal/high RBC count with normal iron studies, not low ferritin.' },
      { id: 'd', text: 'Sideroblastic anemia', whyNot: 'Sideroblastic anemia shows iron overload with ringed sideroblasts, not depleted stores.' },
    ],
    discriminator: 'Microcytic anemia with LOW ferritin, low iron, and HIGH TIBC is iron deficiency — the low ferritin is the key, separating it from the high-ferritin anemia of chronic disease.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.4,
    source: [{ ref: 'Ko et al., ACG Clinical Guideline: Gastrointestinal Evaluation of Iron Deficiency Anemia', year: 2020 }],
  },
  {
    itemId: 'ida-nx', version: 1, type: 'next_step', conceptId: 'iron-deficiency-anemia', presentation: 'elderly',
    stem: 'A 68-year-old man is found to have iron deficiency anemia with no obvious bleeding source. What is the essential next step?',
    vitals: [],
    findings: ['New iron deficiency without menstrual loss.'],
    options: [
      { id: 'a', text: 'Endoscopic evaluation of the GI tract (colonoscopy ± upper endoscopy)', correct: true },
      { id: 'b', text: 'Iron supplements and no further workup', whyNot: 'In a man or postmenopausal woman, iron deficiency signals occult GI blood loss (including malignancy) that must be investigated.' },
      { id: 'c', text: 'Reassurance', whyNot: 'Unexplained iron deficiency in this group is a red flag for a GI source, not a benign finding.' },
      { id: 'd', text: 'Bone marrow biopsy first', whyNot: 'The stores are clearly depleted; the priority is finding the bleeding source, not marrow sampling.' },
    ],
    discriminator: 'Iron deficiency without an obvious source in a man or postmenopausal woman mandates GI endoscopy to exclude an occult bleeding lesion, especially colorectal cancer.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im', 'fm'], level: 'clerkship' },
    difficultySeed: 0.45,
    distractorConceptIds: ['colorectal-cancer'],
    source: [{ ref: 'Ko et al., ACG Clinical Guideline: GI Evaluation of Iron Deficiency Anemia', year: 2020 }],
  },
  {
    itemId: 'ida-ddx', version: 1, type: 'discriminator', conceptId: 'iron-deficiency-anemia', presentation: 'atypical',
    stem: 'A microcytic anemia could be iron deficiency, thalassemia, or anemia of chronic disease. Which single result most cleanly separates iron deficiency from the others?',
    vitals: [],
    findings: ['Microcytosis is confirmed; the cause is unclear.'],
    options: [
      { id: 'a', text: 'A low ferritin (with high TIBC)', correct: true },
      { id: 'b', text: 'A low MCV', whyNot: 'All three can be microcytic; MCV alone does not separate them.' },
      { id: 'c', text: 'A high reticulocyte count', whyNot: 'Reticulocytes are typically low in these hypoproliferative microcytic anemias and do not discriminate them.' },
      { id: 'd', text: 'The hemoglobin value', whyNot: 'The degree of anemia does not identify the mechanism.' },
    ],
    discriminator: 'Ferritin is the discriminator among microcytic anemias — low in iron deficiency, high/normal in anemia of chronic disease, and normal in thalassemia (which also keeps a high RBC count).',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['thalassemia'],
    source: [{ ref: 'Camaschella, Iron-Deficiency Anemia (NEJM review)', year: 2015 }],
  },

  /* ── B12 vs folate ────────────────────────────────────────────── */
  {
    itemId: 'b12-ddx', version: 1, type: 'discriminator', conceptId: 'b12-folate-deficiency', presentation: 'classic',
    stem: 'Two patients have a macrocytic anemia with hypersegmented neutrophils. One also has numbness and a loss of vibration/proprioception. What separates B12 from folate deficiency?',
    vitals: [v('MCV', '112', true)],
    findings: ['Both are macrocytic; one has neurologic signs.'],
    options: [
      { id: 'a', text: 'Neurologic signs and an elevated methylmalonic acid (B12 deficiency)', correct: true },
      { id: 'b', text: 'An elevated homocysteine', whyNot: 'Homocysteine rises in BOTH B12 and folate deficiency; it does not discriminate.' },
      { id: 'c', text: 'The presence of macrocytosis', whyNot: 'Both cause macrocytosis with hypersegmented neutrophils.' },
      { id: 'd', text: 'A low reticulocyte count', whyNot: 'Both are hypoproliferative with low reticulocytes; this does not separate them.' },
    ],
    discriminator: 'B12 deficiency raises methylmalonic acid AND causes neurologic disease (subacute combined degeneration), whereas folate deficiency raises only homocysteine with no neurologic signs.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    source: [{ ref: 'Stabler, Vitamin B12 Deficiency (NEJM review)', year: 2013 }],
  },
  {
    itemId: 'b12-cm', version: 1, type: 'cant_miss', conceptId: 'b12-folate-deficiency', presentation: 'atypical',
    stem: 'A patient with megaloblastic anemia and paresthesias is about to be treated. Why must you not give folate alone if B12 deficiency is possible?',
    vitals: [],
    findings: ['Neurologic symptoms accompany the anemia.'],
    options: [
      { id: 'a', text: 'Folate can correct the anemia but lets the B12 neurologic damage progress', correct: true },
      { id: 'b', text: 'Folate worsens the anemia', whyNot: 'Folate actually improves the megaloblastic anemia — the danger is masking B12 deficiency while the neuropathy advances.' },
      { id: 'c', text: 'Folate causes hemolysis', whyNot: 'Folate does not cause hemolysis; the concern is unopposed neurologic progression of B12 deficiency.' },
      { id: 'd', text: 'There is no risk', whyNot: 'There is a real risk: treating with folate alone can allow irreversible B12-related neurologic injury.' },
    ],
    discriminator: 'Giving folate alone to a B12-deficient patient corrects the anemia but allows the neurologic damage to progress irreversibly — so B12 status must be checked and replaced too.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Stabler, Vitamin B12 Deficiency (NEJM review)', year: 2013 }],
  },

  /* ── Thalassemia ──────────────────────────────────────────────── */
  {
    itemId: 'thal-ol', version: 1, type: 'one_liner', conceptId: 'thalassemia', presentation: 'classic',
    stem: 'A patient of Mediterranean ancestry has a mild microcytic anemia with a NORMAL/high red-cell count, target cells, and normal iron studies; HbA₂ is elevated. What is the diagnosis?',
    vitals: [v('MCV', '68', true), v('RBC', '6.1', false)],
    findings: ['Microcytosis out of proportion to the mild anemia, with a preserved RBC count.'],
    options: [
      { id: 'a', text: 'Beta-thalassemia (trait)', correct: true },
      { id: 'b', text: 'Iron deficiency anemia', whyNot: 'Iron deficiency lowers the RBC count and ferritin; thalassemia keeps a high RBC count with normal iron studies.' },
      { id: 'c', text: 'Anemia of chronic disease', whyNot: 'ACD is usually normocytic with high ferritin, not a microcytosis with elevated HbA₂ and target cells.' },
      { id: 'd', text: 'Lead poisoning', whyNot: 'Lead poisoning shows basophilic stippling and an exposure history, not an elevated HbA₂.' },
    ],
    discriminator: 'Microcytosis with a normal/high RBC count, target cells, normal iron studies, and elevated HbA₂ is beta-thalassemia — the preserved RBC count separates it from iron deficiency.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['iron-deficiency-anemia'],
    source: [{ ref: 'Taher et al., Thalassaemia (Lancet Seminar)', year: 2018 }],
  },

  /* ── Sickle cell ──────────────────────────────────────────────── */
  {
    itemId: 'sickle-tx', version: 1, type: 'tx_next_step', conceptId: 'sickle-cell', presentation: 'severe',
    stem: 'A child with sickle cell disease has a severe vaso-occlusive pain crisis. What is the management?',
    vitals: [v('SpO₂', '95%', false)],
    findings: ['Diffuse bone pain typical of a vaso-occlusive crisis; no focal infection.'],
    options: [
      { id: 'a', text: 'Prompt analgesia (often opioids), hydration, and oxygen if hypoxemic', correct: true },
      { id: 'b', text: 'Routine exchange transfusion for every pain crisis', whyNot: 'Transfusion is reserved for specific severe complications (e.g., acute chest syndrome, stroke), not routine uncomplicated pain crises.' },
      { id: 'c', text: 'Withhold opioids to avoid dependence', whyNot: 'Undertreating sickle pain is a known pitfall; adequate analgesia is standard care.' },
      { id: 'd', text: 'Corticosteroids as first-line', whyNot: 'Steroids are not standard for a vaso-occlusive crisis and can precipitate rebound crises.' },
    ],
    discriminator: 'An uncomplicated vaso-occlusive crisis is managed with prompt analgesia, hydration, and oxygen as needed, reserving transfusion for severe complications like acute chest syndrome or stroke.',
    tags: { system: 'heme_onc', complaint: 'pain crisis', rotation: ['em', 'peds', 'im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Brandow et al., ASH Clinical Practice Guidelines for Sickle Cell Disease: Management of Acute and Chronic Pain', year: 2020 }],
  },
  {
    itemId: 'sickle-cm', version: 1, type: 'cant_miss', conceptId: 'sickle-cell', presentation: 'severe',
    stem: 'A patient with sickle cell disease develops fever, chest pain, hypoxia, and a NEW pulmonary infiltrate. What complication must you not miss?',
    vitals: [v('SpO₂', '86%', true), v('Temp', '38.9', true)],
    findings: ['New infiltrate with hypoxia in sickle cell disease.'],
    options: [
      { id: 'a', text: 'Acute chest syndrome', correct: true },
      { id: 'b', text: 'A simple viral upper respiratory infection', whyNot: 'A new infiltrate with hypoxia in sickle disease is acute chest syndrome — a leading cause of death requiring urgent treatment.' },
      { id: 'c', text: 'Anxiety', whyNot: 'Objective hypoxia and a new infiltrate are not anxiety; this is an emergency.' },
      { id: 'd', text: 'Uncomplicated vaso-occlusive pain', whyNot: 'The new infiltrate and hypoxia define acute chest syndrome, which is treated more aggressively (antibiotics, oxygen, often transfusion).' },
    ],
    discriminator: 'Fever, hypoxia, chest pain, and a new pulmonary infiltrate in sickle cell disease is acute chest syndrome — a can’t-miss emergency treated with antibiotics, oxygen, and often transfusion.',
    tags: { system: 'heme_onc', complaint: 'dyspnea', rotation: ['em', 'im', 'peds'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'NHLBI Evidence-Based Management of Sickle Cell Disease: Expert Panel Report', year: 2014 }],
  },

  /* ── Hemolytic anemia ─────────────────────────────────────────── */
  {
    itemId: 'hemolysis-ol', version: 1, type: 'one_liner', conceptId: 'hemolytic-anemia', presentation: 'classic',
    stem: 'A patient has anemia with jaundice. Labs show a HIGH LDH and indirect bilirubin, a LOW haptoglobin, and a high reticulocyte count. What process is this?',
    vitals: [],
    findings: ['Anemia with markers of red-cell breakdown and a brisk marrow response.'],
    options: [
      { id: 'a', text: 'Hemolytic anemia', correct: true },
      { id: 'b', text: 'Iron deficiency anemia', whyNot: 'Iron deficiency has a LOW reticulocyte count and normal haptoglobin, not the hemolysis pattern.' },
      { id: 'c', text: 'Anemia of chronic disease', whyNot: 'ACD is hypoproliferative with normal LDH/haptoglobin, not brisk hemolysis.' },
      { id: 'd', text: 'Acute blood loss', whyNot: 'Bleeding does not lower haptoglobin or raise LDH/indirect bilirubin the way intravascular/extravascular hemolysis does.' },
    ],
    discriminator: 'High LDH and indirect bilirubin with a LOW haptoglobin and high reticulocytes is hemolysis — the low haptoglobin and high LDH separate it from blood loss and hypoproliferative anemias.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Barcellini & Fattizzo, Clinical Applications of Hemolytic Markers (Disease Markers / review)', year: 2015 }],
  },
  {
    itemId: 'hemolysis-ddx', version: 1, type: 'discriminator', conceptId: 'hemolytic-anemia', presentation: 'atypical',
    stem: 'Two patients have autoimmune hemolytic anemia. One has IgG antibodies with spherocytes and a positive direct antiglobulin test for IgG; the other has IgM cold agglutinins after a Mycoplasma infection. How are these classified?',
    vitals: [],
    findings: ['One is warm-antibody, the other cold-antibody mediated.'],
    options: [
      { id: 'a', text: 'Warm AIHA (IgG, spherocytes) vs cold agglutinin disease (IgM)', correct: true },
      { id: 'b', text: 'Both are warm AIHA', whyNot: 'The IgM cold agglutinin case after Mycoplasma is cold agglutinin disease, not warm AIHA.' },
      { id: 'c', text: 'Both are hereditary spherocytosis', whyNot: 'Hereditary spherocytosis has a NEGATIVE Coombs test; these are antibody-mediated (positive DAT).' },
      { id: 'd', text: 'Neither is immune-mediated', whyNot: 'A positive direct antiglobulin test defines immune-mediated hemolysis in both.' },
    ],
    discriminator: 'Warm autoimmune hemolysis is IgG-mediated with spherocytes (idiopathic, SLE, CLL, drugs), whereas cold agglutinin disease is IgM-mediated (Mycoplasma, EBV, lymphoma) — the antibody class and thermal amplitude separate them.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    source: [{ ref: 'Barcellini, Immune Hemolysis: Diagnosis and Treatment of Autoimmune Hemolytic Anemia (review)', year: 2015 }],
  },

  /* ── ITP ──────────────────────────────────────────────────────── */
  {
    itemId: 'itp-ol', version: 1, type: 'one_liner', conceptId: 'itp', presentation: 'classic',
    stem: 'An otherwise-well child develops petechiae and mucosal bleeding after a viral illness. Platelets are 12,000 but the white count, hemoglobin, and smear (no schistocytes) are otherwise normal. What is the diagnosis?',
    vitals: [v('Platelets', '12k', true)],
    findings: ['ISOLATED thrombocytopenia with a normal smear.'],
    options: [
      { id: 'a', text: 'Immune thrombocytopenia (ITP)', correct: true },
      { id: 'b', text: 'Thrombotic thrombocytopenic purpura', whyNot: 'TTP has a microangiopathic hemolytic anemia with schistocytes and neurologic/renal features, not isolated thrombocytopenia.' },
      { id: 'c', text: 'Disseminated intravascular coagulation', whyNot: 'DIC prolongs PT/PTT and lowers fibrinogen; ITP has normal coagulation studies.' },
      { id: 'd', text: 'Leukemia', whyNot: 'Leukemia typically affects multiple cell lines with blasts on smear, not an isolated platelet drop in a well child.' },
    ],
    discriminator: 'Isolated thrombocytopenia in an otherwise-well patient with a normal smear (no schistocytes) is ITP — a diagnosis of exclusion, distinct from the consumptive/microangiopathic thrombocytopenias.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['assoc-ttp', 'dic'],
    source: [{ ref: 'Neunert et al., American Society of Hematology Guidelines for Immune Thrombocytopenia', year: 2019 }],
  },
  {
    itemId: 'itp-tx', version: 1, type: 'tx_next_step', conceptId: 'itp', presentation: 'atypical',
    stem: 'An adult with newly diagnosed ITP has platelets of 8,000 with mucosal bleeding. What is first-line therapy?',
    vitals: [v('Platelets', '8k', true)],
    findings: ['Symptomatic severe thrombocytopenia from ITP.'],
    options: [
      { id: 'a', text: 'Corticosteroids (with IVIG when a faster rise is needed)', correct: true },
      { id: 'b', text: 'Routine platelet transfusion for the low count alone', whyNot: 'Platelet transfusions are reserved for life-threatening bleeding; in ITP transfused platelets are rapidly destroyed and the count alone is not an indication.' },
      { id: 'c', text: 'Splenectomy as the immediate first step', whyNot: 'Splenectomy is a second-line option after medical therapy fails, not first-line.' },
      { id: 'd', text: 'Observation regardless of bleeding', whyNot: 'Active mucosal bleeding with a very low count warrants treatment, not observation.' },
    ],
    discriminator: 'ITP is treated with corticosteroids (adding IVIG for a rapid rise), reserving platelet transfusion for life-threatening bleeding since transfused platelets are quickly consumed.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Neunert et al., ASH Guidelines for Immune Thrombocytopenia', year: 2019 }],
  },

  /* ── Hemophilia ───────────────────────────────────────────────── */
  {
    itemId: 'hemophilia-ol', version: 1, type: 'one_liner', conceptId: 'hemophilia', presentation: 'classic',
    stem: 'A boy has recurrent hemarthroses and a deep muscle bleed. The PTT is prolonged, the PT and platelet count are normal, and the PTT corrects on a mixing study. What is the diagnosis?',
    vitals: [],
    findings: ['Deep-tissue bleeding with an isolated prolonged PTT that corrects on mixing.'],
    options: [
      { id: 'a', text: 'Hemophilia (factor VIII or IX deficiency)', correct: true },
      { id: 'b', text: 'von Willebrand disease', whyNot: 'vWD causes mucocutaneous bleeding with an abnormal platelet-function assay, not the deep hemarthroses of factor deficiency (though vWF carries factor VIII).' },
      { id: 'c', text: 'Vitamin K deficiency', whyNot: 'Vitamin K deficiency prolongs BOTH PT and PTT; hemophilia prolongs only the PTT.' },
      { id: 'd', text: 'A factor inhibitor', whyNot: 'An acquired inhibitor would NOT fully correct on a mixing study; correction here indicates a factor deficiency.' },
    ],
    discriminator: 'Deep bleeding (hemarthroses) with an isolated prolonged PTT that corrects on mixing is hemophilia (factor VIII/IX deficiency), distinct from the mucocutaneous bleeding of von Willebrand disease.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['peds', 'im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['von-willebrand'],
    source: [{ ref: 'Srivastava et al., WFH Guidelines for the Management of Hemophilia', year: 2020 }],
  },

  /* ── von Willebrand ───────────────────────────────────────────── */
  {
    itemId: 'vwd-tx', version: 1, type: 'tx_next_step', conceptId: 'von-willebrand', presentation: 'classic',
    stem: 'A patient with type 1 von Willebrand disease needs coverage for a minor procedure and to control menorrhagia. What is a first-line treatment?',
    vitals: [],
    findings: ['Mild type 1 vWD with mucocutaneous bleeding.'],
    options: [
      { id: 'a', text: 'Desmopressin (DDAVP), which releases stored von Willebrand factor', correct: true },
      { id: 'b', text: 'Platelet transfusion', whyNot: 'The platelets are functional and normal in number; the defect is von Willebrand factor, addressed by desmopressin.' },
      { id: 'c', text: 'Vitamin K', whyNot: 'Vitamin K corrects factor deficiencies of the PT pathway, not von Willebrand factor.' },
      { id: 'd', text: 'Warfarin', whyNot: 'Anticoagulation would worsen bleeding; the goal is to raise vWF.' },
    ],
    discriminator: 'Type 1 von Willebrand disease is treated with desmopressin, which releases endogenous vWF (and factor VIII), with vWF-containing concentrates for severe types or major surgery.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['im', 'obgyn'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'James et al., ASH/ISTH/NHF/WFH Guidelines on the Management of von Willebrand Disease', year: 2021 }],
  },

  /* ── HIT ──────────────────────────────────────────────────────── */
  {
    itemId: 'hit-nx', version: 1, type: 'next_step', conceptId: 'hit', presentation: 'classic',
    stem: 'A patient on heparin for 6 days has a platelet drop from 250,000 to 90,000 and a new DVT. What is the immediate management?',
    vitals: [v('Platelets', '90k', true)],
    findings: ['Platelet fall > 50% with new thrombosis while on heparin.'],
    options: [
      { id: 'a', text: 'Stop ALL heparin and start a non-heparin anticoagulant (e.g., argatroban)', correct: true },
      { id: 'b', text: 'Continue heparin and transfuse platelets', whyNot: 'HIT is a prothrombotic state; continuing heparin drives thrombosis, and platelet transfusions can worsen it.' },
      { id: 'c', text: 'Switch to warfarin alone immediately', whyNot: 'Starting warfarin during acute HIT (before platelet recovery) risks venous limb gangrene/skin necrosis; a non-heparin anticoagulant is used first.' },
      { id: 'd', text: 'Simply lower the heparin dose', whyNot: 'Any heparin exposure perpetuates HIT; it must be stopped entirely.' },
    ],
    discriminator: 'Heparin-induced thrombocytopenia — a > 50% platelet fall with thrombosis 5–10 days into heparin — is managed by stopping ALL heparin and anticoagulating with a non-heparin agent, never platelet transfusion or warfarin alone.',
    tags: { system: 'heme_onc', complaint: 'thrombocytopenia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Cuker et al., American Society of Hematology Guidelines for Management of Venous Thromboembolism: Heparin-Induced Thrombocytopenia', year: 2018 }],
  },

  /* ── Multiple myeloma ─────────────────────────────────────────── */
  {
    itemId: 'mm-ol', version: 1, type: 'one_liner', conceptId: 'multiple-myeloma', presentation: 'classic',
    stem: 'An older adult has bone pain, anemia, hypercalcemia, and renal impairment. The smear shows rouleaux and SPEP reveals a monoclonal spike. What is the diagnosis?',
    vitals: [v('Ca', '11.9', true), v('Cr', '2.4', true)],
    findings: ['Lytic bone pain with a monoclonal protein and end-organ damage.'],
    options: [
      { id: 'a', text: 'Multiple myeloma', correct: true },
      { id: 'b', text: 'MGUS', whyNot: 'MGUS is asymptomatic with no CRAB features; the hypercalcemia, renal failure, anemia, and bone lesions here define myeloma.' },
      { id: 'c', text: 'Metastatic prostate cancer', whyNot: 'Prostate metastases are typically osteoBLASTIC without a monoclonal spike and Bence Jones protein.' },
      { id: 'd', text: 'Primary hyperparathyroidism', whyNot: 'Hyperparathyroidism does not produce a monoclonal spike, rouleaux, or lytic lesions with anemia.' },
    ],
    discriminator: 'The CRAB features (hyperCalcemia, Renal failure, Anemia, Bone lytic lesions) with a monoclonal spike and rouleaux are multiple myeloma, distinguishing it from asymptomatic MGUS.',
    tags: { system: 'heme_onc', complaint: 'bone pain', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Rajkumar et al., International Myeloma Working Group Updated Criteria for the Diagnosis of Multiple Myeloma (Lancet Oncol)', year: 2014 }],
  },
  {
    itemId: 'mm-nx', version: 1, type: 'next_step', conceptId: 'multiple-myeloma', presentation: 'atypical',
    stem: 'Multiple myeloma is suspected in a patient with anemia and a monoclonal spike. Which imaging is preferred to assess bone disease?',
    vitals: [],
    findings: ['Suspected myeloma bone involvement.'],
    options: [
      { id: 'a', text: 'Whole-body low-dose CT / MRI or PET (advanced skeletal imaging)', correct: true },
      { id: 'b', text: 'A radionuclide bone scan', whyNot: 'Bone scintigraphy is insensitive for the purely lytic lesions of myeloma, which lack osteoblastic activity.' },
      { id: 'c', text: 'No imaging is needed', whyNot: 'Defining bone lesions is central to staging and to the CRAB criteria that establish the diagnosis.' },
      { id: 'd', text: 'DEXA scan only', whyNot: 'DEXA measures density for osteoporosis, not the focal lytic lesions of myeloma.' },
    ],
    discriminator: 'Myeloma bone disease is assessed with whole-body low-dose CT, MRI, or PET rather than a radionuclide bone scan, which misses the purely lytic, non-osteoblastic lesions.',
    tags: { system: 'heme_onc', complaint: 'bone pain', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Rajkumar et al., IMWG Updated Criteria for the Diagnosis of Multiple Myeloma (Lancet Oncol)', year: 2014 }],
  },

  /* ── Polycythemia vera ────────────────────────────────────────── */
  {
    itemId: 'pv-ol', version: 1, type: 'one_liner', conceptId: 'polycythemia-vera', presentation: 'classic',
    stem: 'A patient has an elevated hematocrit, itching after hot showers, and a burning redness of the hands. Erythropoietin is LOW and JAK2 V617F is positive. What is the diagnosis?',
    vitals: [v('Hct', '58%', true)],
    findings: ['Erythrocytosis with aquagenic pruritus and erythromelalgia.'],
    options: [
      { id: 'a', text: 'Polycythemia vera', correct: true },
      { id: 'b', text: 'Secondary polycythemia from hypoxia', whyNot: 'Secondary polycythemia has a HIGH erythropoietin driven by hypoxia; PV has low EPO with a JAK2 mutation.' },
      { id: 'c', text: 'Relative polycythemia from dehydration', whyNot: 'Dehydration causes a spurious rise without the JAK2 mutation, low EPO, or pruritus/erythromelalgia.' },
      { id: 'd', text: 'Reactive thrombocytosis', whyNot: 'The picture is erythrocytosis with a JAK2 mutation, not an isolated reactive platelet rise.' },
    ],
    discriminator: 'Erythrocytosis with LOW erythropoietin, a JAK2 mutation, aquagenic pruritus, and erythromelalgia is polycythemia vera — the low EPO separating it from hypoxia-driven secondary polycythemia.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['assoc-jak2'],
    source: [{ ref: 'Arber et al., WHO Classification of Myeloid Neoplasms and Acute Leukemia (Blood)', year: 2016 }],
  },
  {
    itemId: 'pv-tx', version: 1, type: 'tx_next_step', conceptId: 'polycythemia-vera', presentation: 'classic',
    stem: 'What is the cornerstone treatment of polycythemia vera to reduce thrombotic risk?',
    vitals: [v('Hct', '56%', true)],
    findings: ['Confirmed PV with a high hematocrit.'],
    options: [
      { id: 'a', text: 'Therapeutic phlebotomy plus low-dose aspirin (± cytoreduction such as hydroxyurea)', correct: true },
      { id: 'b', text: 'Iron supplementation', whyNot: 'Giving iron fuels red-cell production; PV is managed by removing blood, not supplementing iron.' },
      { id: 'c', text: 'Anticoagulation with warfarin for everyone', whyNot: 'Routine anticoagulation is not standard; phlebotomy plus aspirin reduces thrombosis, with cytoreduction for high-risk patients.' },
      { id: 'd', text: 'Observation only', whyNot: 'Untreated PV carries a high thrombosis risk; hematocrit control is essential.' },
    ],
    discriminator: 'Polycythemia vera is managed by phlebotomy to a target hematocrit plus low-dose aspirin, adding hydroxyurea or another cytoreductive agent in high-risk patients.',
    tags: { system: 'heme_onc', complaint: 'buzzword', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Marchioli et al., Cardiovascular Events and Intensity of Treatment in Polycythemia Vera (CYTO-PV, NEJM)', year: 2013 }],
  },

  /* ── Acute leukemia ───────────────────────────────────────────── */
  {
    itemId: 'leuk-ddx', version: 1, type: 'discriminator', conceptId: 'acute-leukemia', presentation: 'classic',
    stem: 'A patient has pancytopenia with circulating blasts. What most favors AML over ALL?',
    vitals: [],
    findings: ['Marrow failure with blasts on the smear.'],
    options: [
      { id: 'a', text: 'Auer rods in the blasts (and older age)', correct: true },
      { id: 'b', text: 'Peak incidence in young children', whyNot: 'Childhood peak and CNS/testicular involvement favor ALL, not AML.' },
      { id: 'c', text: 'TdT-positive lymphoblasts', whyNot: 'TdT positivity marks lymphoblasts (ALL); AML blasts are myeloid with Auer rods.' },
      { id: 'd', text: 'Mediastinal mass in a teenager', whyNot: 'A thymic mediastinal mass suggests T-cell ALL, not AML.' },
    ],
    discriminator: 'Auer rods in myeloid blasts point to AML (more common in adults), whereas TdT-positive lymphoblasts, childhood onset, and CNS/testicular or mediastinal involvement point to ALL.',
    tags: { system: 'heme_onc', complaint: 'pancytopenia', rotation: ['im', 'peds'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['assoc-auer'],
    source: [{ ref: 'Arber et al., WHO Classification of Myeloid Neoplasms and Acute Leukemia (Blood)', year: 2016 }],
  },
  {
    itemId: 'leuk-cm', version: 1, type: 'cant_miss', conceptId: 'acute-leukemia', presentation: 'severe',
    stem: 'A young adult with acute promyelocytic leukemia (APL, t(15;17)) presents with bleeding, a low fibrinogen, and prolonged PT/PTT. Besides supportive DIC care, what treatment must start urgently?',
    vitals: [],
    findings: ['Coagulopathy (DIC) at APL presentation.'],
    options: [
      { id: 'a', text: 'All-trans retinoic acid (ATRA)', correct: true },
      { id: 'b', text: 'Wait for full genetic confirmation before any therapy', whyNot: 'APL coagulopathy is rapidly fatal; ATRA is started on strong suspicion without waiting for every confirmatory test.' },
      { id: 'c', text: 'Standard induction chemotherapy alone without ATRA', whyNot: 'ATRA is specific to APL and dramatically reduces early hemorrhagic death; omitting it is dangerous.' },
      { id: 'd', text: 'Observation of the coagulopathy', whyNot: 'The DIC of APL is life-threatening and demands immediate ATRA plus aggressive blood-product support.' },
    ],
    discriminator: 'Acute promyelocytic leukemia (t(15;17)) presents with life-threatening DIC, so all-trans retinoic acid is started urgently on suspicion — the one acute leukemia where early targeted therapy is emergent.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.6,
    distractorConceptIds: ['dic'],
    source: [{ ref: 'Sanz et al., Management of Acute Promyelocytic Leukemia: Recommendations From an Expert Panel (European LeukemiaNet, Blood)', year: 2019 }],
  },

  /* ── Deepen existing: TTP ─────────────────────────────────────── */
  {
    itemId: 'ttp-tx', version: 1, type: 'tx_next_step', conceptId: 'assoc-ttp', presentation: 'severe',
    stem: 'A patient has microangiopathic hemolytic anemia, thrombocytopenia, neurologic changes, and renal impairment, with severely deficient ADAMTS13. What is the treatment?',
    vitals: [v('Platelets', '18k', true)],
    findings: ['Schistocytes on smear; the classic thrombotic microangiopathy pentad.'],
    options: [
      { id: 'a', text: 'Urgent plasma exchange (plus corticosteroids)', correct: true },
      { id: 'b', text: 'Platelet transfusion for the low count', whyNot: 'Platelet transfusion in TTP can fuel further microvascular thrombosis and is contraindicated except in life-threatening bleeding.' },
      { id: 'c', text: 'Heparin anticoagulation', whyNot: 'TTP is not treated with anticoagulation; the therapy is plasma exchange to replace ADAMTS13 and remove antibody.' },
      { id: 'd', text: 'Observation', whyNot: 'Untreated TTP has very high mortality; plasma exchange must start urgently.' },
    ],
    discriminator: 'TTP (ADAMTS13 deficiency) is treated with urgent plasma exchange and steroids — and platelet transfusions are avoided because they can worsen the microvascular thrombosis.',
    tags: { system: 'heme_onc', complaint: 'thrombocytopenia', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [{ ref: 'Zheng et al., ISTH Guidelines for the Diagnosis and Management of Thrombotic Thrombocytopenic Purpura', year: 2020 }],
  },

  /* ── Deepen existing: DIC ─────────────────────────────────────── */
  {
    itemId: 'dic-ddx', version: 1, type: 'discriminator', conceptId: 'dic', presentation: 'classic',
    stem: 'A septic patient bleeds from line sites. Which laboratory pattern confirms disseminated intravascular coagulation?',
    vitals: [],
    findings: ['Diffuse bleeding with a consumptive picture.'],
    options: [
      { id: 'a', text: 'Low platelets, prolonged PT and PTT, LOW fibrinogen, and high D-dimer', correct: true },
      { id: 'b', text: 'Isolated thrombocytopenia with normal coagulation times', whyNot: 'That is ITP; DIC consumes clotting factors and fibrinogen, prolonging PT/PTT.' },
      { id: 'c', text: 'Normal fibrinogen with a normal D-dimer', whyNot: 'DIC lowers fibrinogen and raises D-dimer through simultaneous clotting and fibrinolysis.' },
      { id: 'd', text: 'Prolonged PTT alone that corrects on mixing', whyNot: 'That pattern is a factor deficiency (e.g., hemophilia), not the global consumption of DIC.' },
    ],
    discriminator: 'DIC is a consumptive coagulopathy — thrombocytopenia, prolonged PT/PTT, LOW fibrinogen, and elevated D-dimer with schistocytes — treated by correcting the underlying trigger.',
    tags: { system: 'heme_onc', complaint: 'bleeding', rotation: ['im', 'em'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['itp', 'hemophilia'],
    source: [{ ref: 'Wada et al., ISTH Guidance for Diagnosis and Treatment of DIC', year: 2013 }],
  },

  /* ── Deepen existing: tumor lysis ─────────────────────────────── */
  {
    itemId: 'tls-tx', version: 1, type: 'tx_next_step', conceptId: 'tumor-lysis', presentation: 'severe',
    stem: 'A patient starting chemotherapy for a bulky lymphoma develops high potassium, high phosphate, high uric acid, and low calcium with AKI. What is the management?',
    vitals: [v('K', '6.2', true), v('Uric acid', '13', true)],
    findings: ['The metabolic tetrad of tumor lysis syndrome with acute kidney injury.'],
    options: [
      { id: 'a', text: 'Aggressive IV hydration plus rasburicase (or allopurinol) and electrolyte management', correct: true },
      { id: 'b', text: 'Fluid restriction', whyNot: 'Restricting fluid worsens uric acid/phosphate precipitation and AKI; aggressive hydration is central.' },
      { id: 'c', text: 'Give IV calcium and phosphate together', whyNot: 'Calcium is given cautiously (only for symptomatic hypocalcemia) because calcium-phosphate can precipitate; you do not add phosphate.' },
      { id: 'd', text: 'Withhold all treatment and observe', whyNot: 'Tumor lysis is an oncologic emergency that can cause fatal hyperkalemia and renal failure without prompt therapy.' },
    ],
    discriminator: 'Tumor lysis syndrome (high K, phosphate, and uric acid with low calcium and AKI) is treated with aggressive hydration and rasburicase/allopurinol, managing hyperkalemia and avoiding calcium-phosphate precipitation.',
    tags: { system: 'heme_onc', complaint: 'oncologic emergency', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.55,
    distractorConceptIds: ['hyperk-first'],
    source: [{ ref: 'Coiffier et al., Guidelines for the Management of Pediatric and Adult Tumor Lysis Syndrome (J Clin Oncol)', year: 2008 }],
  },

  /* ── Deepen existing: malignant cord compression ──────────────── */
  {
    itemId: 'cord-tx', version: 1, type: 'tx_next_step', conceptId: 'cord-compression', presentation: 'severe',
    stem: 'A cancer patient has progressive back pain with new leg weakness and urinary retention. What must be done immediately, even before definitive imaging is completed?',
    vitals: [],
    findings: ['Progressive myelopathy suggesting malignant epidural cord compression.'],
    options: [
      { id: 'a', text: 'Give IV corticosteroids (dexamethasone) and obtain urgent whole-spine MRI', correct: true },
      { id: 'b', text: 'Schedule outpatient physiotherapy', whyNot: 'New weakness and retention signal cord compression — an emergency; delay risks permanent paralysis.' },
      { id: 'c', text: 'Order a plain radiograph and wait', whyNot: 'Plain films are insensitive; steroids plus urgent MRI (then radiation/surgery) are needed without delay.' },
      { id: 'd', text: 'Give analgesia alone and reassess in a week', whyNot: 'A week’s delay can cost the patient the ability to walk; this is time-critical.' },
    ],
    discriminator: 'Suspected malignant spinal cord compression is treated with immediate corticosteroids and urgent MRI, followed by radiation or surgery — neurologic recovery depends on how fast the cord is decompressed.',
    tags: { system: 'heme_onc', complaint: 'oncologic emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Loblaw et al., Diagnosis and Management of Malignant Extradural Spinal Cord Compression (systematic review/guideline)', year: 2012 }],
  },

  /* ── Deepen existing: febrile neutropenia ─────────────────────── */
  {
    itemId: 'fn-cm', version: 1, type: 'cant_miss', conceptId: 'febrile-neutropenia', presentation: 'severe',
    stem: 'A chemotherapy patient has a temperature of 38.6 °C and an absolute neutrophil count of 300. How urgently must antibiotics be started?',
    vitals: [v('Temp', '38.6', true), v('ANC', '300', true)],
    findings: ['Fever in profound neutropenia.'],
    options: [
      { id: 'a', text: 'Empiric broad-spectrum antipseudomonal antibiotics within about an hour', correct: true },
      { id: 'b', text: 'Wait for blood-culture results before any antibiotics', whyNot: 'Neutropenic fever can progress to septic shock within hours; empiric antibiotics are given immediately after cultures, not after results.' },
      { id: 'c', text: 'Oral acetaminophen and observation', whyNot: 'Treating only the fever misses a potentially fatal infection in a patient with no neutrophil defense.' },
      { id: 'd', text: 'Antifungal therapy alone', whyNot: 'Initial coverage targets bacteria (including Pseudomonas); antifungals are added later for persistent fever.' },
    ],
    discriminator: 'Febrile neutropenia is a can’t-miss emergency: empiric broad-spectrum antipseudomonal antibiotics are given within about an hour of presentation, right after cultures.',
    tags: { system: 'heme_onc', complaint: 'oncologic emergency', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [{ ref: 'Freifeld et al., IDSA Clinical Practice Guideline for the Use of Antimicrobial Agents in Neutropenic Patients With Cancer', year: 2011 }],
  },

  /* ── Deepen existing: G6PD ────────────────────────────────────── */
  {
    itemId: 'g6pd-ol', version: 1, type: 'one_liner', conceptId: 'assoc-heinz-g6pd', presentation: 'atypical',
    stem: 'A man of Mediterranean ancestry develops acute hemolysis after starting an antibiotic (or eating fava beans). The smear shows bite cells and Heinz bodies. What is the diagnosis?',
    vitals: [],
    findings: ['Episodic oxidative hemolysis after a drug/food/infection trigger.'],
    options: [
      { id: 'a', text: 'G6PD deficiency', correct: true },
      { id: 'b', text: 'Hereditary spherocytosis', whyNot: 'Spherocytosis shows spherocytes with a positive osmotic fragility, not bite cells/Heinz bodies triggered by oxidative stress.' },
      { id: 'c', text: 'Autoimmune hemolytic anemia', whyNot: 'AIHA has a positive direct antiglobulin test; G6PD hemolysis is Coombs-negative and oxidative-triggered.' },
      { id: 'd', text: 'Sickle cell disease', whyNot: 'Sickle disease causes vaso-occlusion with sickled cells, not bite cells and Heinz bodies after an oxidant.' },
    ],
    discriminator: 'Episodic oxidative hemolysis after drugs (dapsone, primaquine, sulfonamides), fava beans, or infection with bite cells and Heinz bodies is G6PD deficiency — a Coombs-negative, X-linked enzymopathy.',
    tags: { system: 'heme_onc', complaint: 'anemia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.45,
    source: [{ ref: 'Luzzatto & Seneca, G6PD Deficiency: A Classic Example of Pharmacogenetics (British Journal of Haematology)', year: 2014 }],
  },
];

export const HEME_DEPTH: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
