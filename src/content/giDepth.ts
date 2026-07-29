/* ══════════════════════════════════════════════════════════════
   GI & Hepatobiliary — depth pour.

   The base bank had the surgical GI emergencies but thin coverage of
   the esophagus, the metabolic liver diseases, and the common ward
   differentials. This module adds the high-yield spine — reflux and
   Barrett's, achalasia, the esophageal cancers, the hepatitis
   serologies, acetaminophen toxicity, Wilson and hemochromatosis,
   hepatorenal syndrome, diverticulitis, bowel obstruction, and the
   RUQ-pain trio — each concept drilled from several angles.

   Sourcing (docs/CONTENT_POLICY.md): every vignette cites a PUBLIC
   clinical-evidence source (ACG/AASLD/EASL/CDC guidelines, agency
   guidance, or primary literature). Commercial board-prep is used
   only to see which diseases are commonly tested — never copied,
   scraped, or cited. All patients are synthetic. Content enters the
   multi-reviewer pipeline (docs/REVIEW.md) drafted and UNREVIEWED.
   ══════════════════════════════════════════════════════════════ */

import type { System } from '../types';
import { v, type ContentModule, type RawConcept, type RawItem } from './authoring';

const concepts: RawConcept[] = [
  {
    conceptId: 'gerd-barrett', name: 'GERD, alarm features & Barrett esophagus', system: 'gi', topic: 'Esophagus',
    illnessScript: {
      epidemiology: 'Very common; chronic reflux, obesity, and hiatal hernia. Barrett is a complication of long-standing GERD.',
      timeCourse: 'Chronic heartburn/regurgitation; alarm features signal the need to look past empiric therapy.',
      keyFindings: ['Postprandial retrosternal burning', 'Alarm features: dysphagia, weight loss, bleeding, anemia, age of onset', 'Barrett = intestinal metaplasia → adenocarcinoma risk'],
      classicDistractors: ['Cardiac chest pain', 'Peptic ulcer disease', 'Achalasia'],
    },
  },
  {
    conceptId: 'achalasia', name: 'Achalasia', system: 'gi', topic: 'Esophagus',
    illnessScript: {
      epidemiology: 'Loss of inhibitory myenteric (Auerbach) neurons; any adult age.',
      timeCourse: 'Progressive dysphagia to BOTH solids and liquids from the start, with regurgitation.',
      keyFindings: ['Dysphagia to solids and liquids together', 'Bird-beak tapering on barium esophagram', 'Manometry: incomplete LES relaxation, aperistalsis'],
      classicDistractors: ['Mechanical stricture (solids first)', 'Pseudoachalasia from tumor', 'Diffuse esophageal spasm'],
    },
  },
  {
    conceptId: 'esophageal-cancer', name: 'Esophageal cancer (SCC vs adenocarcinoma)', system: 'gi', topic: 'GI neoplasms',
    illnessScript: {
      epidemiology: 'SCC: smoking, alcohol, upper/mid esophagus. Adenocarcinoma: GERD/Barrett, obesity, distal esophagus.',
      timeCourse: 'Progressive dysphagia to solids then liquids, with weight loss.',
      keyFindings: ['Progressive solid-food dysphagia + weight loss', 'SCC = proximal, smoking/alcohol', 'Adeno = distal, Barrett/GERD'],
      classicDistractors: ['Achalasia (liquids and solids together)', 'Benign peptic stricture'],
    },
  },
  {
    conceptId: 'mallory-weiss', name: 'Mallory–Weiss vs Boerhaave', system: 'gi', topic: 'Esophagus',
    illnessScript: {
      epidemiology: 'Retching/vomiting, often with alcohol; Mallory–Weiss is a mucosal tear, Boerhaave a full-thickness rupture.',
      timeCourse: 'Hematemesis after vomiting (tear) versus chest pain, subcutaneous emphysema and sepsis (rupture).',
      keyFindings: ['Mallory–Weiss: mucosal tear, hematemesis, usually self-limited', 'Boerhaave: transmural rupture, pneumomediastinum, Hamman crunch'],
      classicDistractors: ['Peptic ulcer bleed', 'Variceal hemorrhage'],
    },
  },
  {
    conceptId: 'acute-viral-hepatitis', name: 'Viral hepatitis serologies', system: 'gi', topic: 'Liver — infectious',
    illnessScript: {
      epidemiology: 'Hepatitis A (fecal-oral), B (blood/sexual/perinatal), C (blood). Serology defines the phase.',
      timeCourse: 'Prodrome then jaundice with elevated transaminases; the window period is a classic trap.',
      keyFindings: ['HBsAg = active infection', 'Anti-HBs = immunity/recovery', 'Anti-HBc IgM (isolated) = window period'],
      classicDistractors: ['Autoimmune hepatitis', 'Drug-induced liver injury'],
    },
  },
  {
    conceptId: 'acetaminophen-toxicity', name: 'Acetaminophen hepatotoxicity', system: 'gi', topic: 'Liver — toxic',
    illnessScript: {
      epidemiology: 'Intentional overdose or staggered supratherapeutic dosing; the leading cause of acute liver failure in the US.',
      timeCourse: 'Nausea (0–24 h) → apparent improvement (24–72 h) → hepatic necrosis with rising AST/ALT and INR (72–96 h).',
      keyFindings: ['Very high transaminases (often > 1000)', 'Rising INR', 'Rumack–Matthew nomogram guides NAC'],
      classicDistractors: ['Ischemic hepatitis', 'Acute viral hepatitis'],
    },
  },
  {
    conceptId: 'wilson-disease', name: 'Wilson disease', system: 'gi', topic: 'Liver — metabolic',
    illnessScript: {
      epidemiology: 'Autosomal recessive ATP7B defect; presents in the young (children to ~40).',
      timeCourse: 'Liver disease and/or neuropsychiatric symptoms from copper accumulation.',
      keyFindings: ['Low ceruloplasmin, high urinary copper', 'Kayser–Fleischer rings', 'Neuropsychiatric features (tremor, dysarthria, mood change)'],
      classicDistractors: ['Hereditary hemochromatosis (iron, older)', 'Autoimmune hepatitis'],
    },
  },
  {
    conceptId: 'hemochromatosis', name: 'Hereditary hemochromatosis', system: 'gi', topic: 'Liver — metabolic',
    illnessScript: {
      epidemiology: 'Autosomal recessive HFE (C282Y); middle-aged, men earlier than women.',
      timeCourse: 'Iron loads over decades into liver, pancreas, heart, joints, skin, gonads.',
      keyFindings: ['High ferritin and transferrin saturation', '"Bronze diabetes," arthropathy (2nd/3rd MCP)', 'Cirrhosis and HCC risk'],
      classicDistractors: ['Wilson disease (copper, young)', 'Alcoholic liver disease'],
    },
  },
  {
    conceptId: 'hepatorenal-syndrome', name: 'Hepatorenal syndrome', system: 'gi', topic: 'Liver — complications',
    illnessScript: {
      epidemiology: 'Advanced cirrhosis with ascites; splanchnic vasodilation causes renal hypoperfusion.',
      timeCourse: 'Progressive AKI with no other identifiable cause and no response to volume.',
      keyFindings: ['AKI in cirrhosis', 'Very low urine sodium, bland sediment', 'No improvement after albumin volume expansion'],
      classicDistractors: ['Prerenal azotemia (responds to volume)', 'Acute tubular necrosis (muddy-brown casts)'],
    },
  },
  {
    conceptId: 'diverticulitis', name: 'Acute diverticulitis', system: 'gi', topic: 'Colon',
    illnessScript: {
      epidemiology: 'Older adults; low-fiber diet; sigmoid colon most often.',
      timeCourse: 'Left-lower-quadrant pain, fever, and altered bowel habits over days.',
      keyFindings: ['LLQ pain and fever', 'CT: bowel-wall thickening, pericolic fat stranding', 'Colonoscopy deferred until the acute episode resolves'],
      classicDistractors: ['Colorectal cancer', 'Ischemic colitis', 'IBS'],
    },
  },
  {
    conceptId: 'bowel-obstruction', name: 'Small-bowel obstruction', system: 'gi', topic: 'Intestinal obstruction',
    illnessScript: {
      epidemiology: 'Adhesions (prior surgery) and hernias are the leading causes.',
      timeCourse: 'Colicky pain, vomiting, distension, and obstipation.',
      keyFindings: ['Prior abdominal surgery', 'Dilated loops with air-fluid levels', 'High-pitched then absent bowel sounds'],
      classicDistractors: ['Paralytic ileus (no mechanical point, quiet abdomen)', 'Large-bowel obstruction'],
    },
  },
  {
    conceptId: 'choledocholithiasis', name: 'The RUQ trio (stone, cholecystitis, cholangitis)', system: 'gi', topic: 'Biliary',
    illnessScript: {
      epidemiology: 'Gallstones migrating into the common bile duct in patients with cholelithiasis.',
      timeCourse: 'From painless jaundice (obstruction) to fever/sepsis (cholangitis).',
      keyFindings: ['Choledocholithiasis: obstruction, dilated CBD, jaundice, afebrile', 'Cholecystitis: RUQ pain + Murphy sign, usually no jaundice', 'Cholangitis: Charcot triad (fever, jaundice, RUQ pain)'],
      classicDistractors: ['Acute cholecystitis', 'Ascending cholangitis'],
    },
  },
];

const subtopics: Record<string, string> = {
  'gerd-barrett': 'gi.upper',
  'achalasia': 'gi.upper',
  'esophageal-cancer': 'gi.neoplasm',
  'mallory-weiss': 'gi.upper',
  'acute-viral-hepatitis': 'gi.hepatic',
  'acetaminophen-toxicity': 'gi.hepatic',
  'wilson-disease': 'gi.hepatic',
  'hemochromatosis': 'gi.hepatic',
  'hepatorenal-syndrome': 'gi.hepatic',
  'diverticulitis': 'gi.lower',
  'bowel-obstruction': 'gi.lower',
  'choledocholithiasis': 'gi.biliary',
};

const items: RawItem[] = [
  /* ── GERD & Barrett ───────────────────────────────────────────── */
  {
    itemId: 'gerd-1', version: 1, type: 'next_step', conceptId: 'gerd-barrett', presentation: 'atypical',
    stem: 'A 58-year-old with 10 years of heartburn now reports food "sticking," a 4 kg weight loss, and iron-deficiency anemia. What is the best next step?',
    vitals: [v('Hb', '10.4', true)],
    findings: ['New dysphagia and weight loss on a background of chronic reflux.'],
    options: [
      { id: 'a', text: 'Upper endoscopy', correct: true },
      { id: 'b', text: 'A trial of high-dose PPI and reassess in 8 weeks', whyNot: 'Alarm features (dysphagia, weight loss, anemia) mandate endoscopy now, not another empiric PPI trial.' },
      { id: 'c', text: 'Barium swallow only', whyNot: 'Barium may show a lesion but cannot biopsy; endoscopy is needed to sample and diagnose.' },
      { id: 'd', text: 'Reassurance and antacids', whyNot: 'Alarm features raise concern for malignancy and cannot be reassured away.' },
    ],
    discriminator: 'Reflux with alarm features — dysphagia, weight loss, bleeding/anemia, or new onset in an older patient — requires prompt upper endoscopy rather than more empiric acid suppression.',
    tags: { system: 'gi', complaint: 'dysphagia', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Katz et al., ACG Clinical Guideline for the Diagnosis and Management of GERD', year: 2022 },
    ],
  },
  {
    itemId: 'gerd-2', version: 1, type: 'association', conceptId: 'gerd-barrett', presentation: 'classic',
    stem: 'Endoscopy for chronic GERD shows salmon-colored mucosa extending above the gastroesophageal junction; biopsy confirms intestinal metaplasia with goblet cells. What does this finding predict?',
    vitals: [],
    findings: ['Columnar-lined distal esophagus replacing normal squamous mucosa.'],
    options: [
      { id: 'a', text: 'Barrett esophagus → increased risk of esophageal ADENOcarcinoma', correct: true },
      { id: 'b', text: 'Increased risk of squamous cell carcinoma', whyNot: 'Barrett (from acid/GERD) predisposes to adenocarcinoma; SCC is linked to smoking and alcohol.' },
      { id: 'c', text: 'A benign finding with no cancer risk', whyNot: 'Intestinal metaplasia is premalignant and warrants surveillance.' },
      { id: 'd', text: 'Eosinophilic esophagitis', whyNot: 'EoE shows dense eosinophils with rings/furrows in an atopic patient, not goblet-cell intestinal metaplasia.' },
    ],
    discriminator: 'Salmon-colored columnar mucosa with goblet-cell intestinal metaplasia is Barrett esophagus — the metaplasia that raises esophageal adenocarcinoma risk and drives surveillance.',
    tags: { system: 'gi', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['esophageal-cancer'],
    source: [
      { ref: 'Shaheen et al., ACG Clinical Guideline: Diagnosis and Management of Barrett’s Esophagus', year: 2022 },
    ],
  },

  /* ── Achalasia ────────────────────────────────────────────────── */
  {
    itemId: 'achalasia-1', version: 1, type: 'one_liner', conceptId: 'achalasia', presentation: 'classic',
    stem: 'A 45-year-old has 1 year of dysphagia to both solids AND liquids from the outset, with regurgitation of undigested food. Barium esophagram shows a dilated esophagus tapering to a "bird-beak." What is the diagnosis?',
    vitals: [],
    findings: ['Dysphagia to solids and liquids simultaneously; nocturnal regurgitation.'],
    options: [
      { id: 'a', text: 'Achalasia', correct: true },
      { id: 'b', text: 'Peptic stricture', whyNot: 'A mechanical stricture causes dysphagia to SOLIDS first, not solids and liquids together.' },
      { id: 'c', text: 'Esophageal cancer', whyNot: 'Cancer gives progressive solid-then-liquid dysphagia with weight loss, not the early solid+liquid pattern with a bird-beak.' },
      { id: 'd', text: 'GERD', whyNot: 'GERD causes heartburn and regurgitation but not the bird-beak, aperistaltic esophagus of achalasia.' },
    ],
    discriminator: 'Dysphagia to solids AND liquids from the start, with a bird-beak esophagram and manometric failure of LES relaxation, is achalasia — mechanical obstructions hit solids first.',
    tags: { system: 'gi', complaint: 'dysphagia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['esophageal-cancer'],
    source: [
      { ref: 'Vaezi et al., ACG Clinical Guideline: Diagnosis and Management of Achalasia', year: 2020 },
    ],
  },
  {
    itemId: 'achalasia-2', version: 1, type: 'discriminator', conceptId: 'achalasia', presentation: 'mimic',
    stem: 'A 70-year-old smoker has a rapid 3-month history of achalasia-like dysphagia and 10 kg weight loss; manometry looks achalasia-like. Why must this not be treated as primary achalasia yet?',
    vitals: [v('Weight loss', '10 kg', true)],
    findings: ['Short, rapidly progressive course with marked weight loss at an older age.'],
    options: [
      { id: 'a', text: 'It may be pseudoachalasia from a tumor at the gastroesophageal junction', correct: true },
      { id: 'b', text: 'Primary achalasia is certain given the manometry', whyNot: 'Older age, short duration, and rapid weight loss are red flags for pseudoachalasia; manometry alone cannot exclude a tumor.' },
      { id: 'c', text: 'It must be GERD', whyNot: 'GERD does not reproduce the achalasia manometric pattern or this degree of weight loss.' },
      { id: 'd', text: 'It is diffuse esophageal spasm', whyNot: 'Spasm causes intermittent chest pain/dysphagia with a corkscrew esophagus, not this progressive weight-losing picture.' },
    ],
    discriminator: 'New "achalasia" in an older patient with rapid onset and weight loss is pseudoachalasia until a malignancy at the gastroesophageal junction is excluded by endoscopy.',
    tags: { system: 'gi', complaint: 'dysphagia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.6,
    distractorConceptIds: ['esophageal-cancer'],
    source: [
      { ref: 'Vaezi et al., ACG Clinical Guideline: Diagnosis and Management of Achalasia', year: 2020 },
    ],
  },

  /* ── Esophageal cancer ────────────────────────────────────────── */
  {
    itemId: 'esoca-1', version: 1, type: 'discriminator', conceptId: 'esophageal-cancer', presentation: 'classic',
    stem: 'Two men have esophageal cancer with progressive solid-food dysphagia. One is a heavy smoker and drinker with a mid-esophageal tumor; the other is obese with long-standing GERD and a distal tumor. Which histology matches which?',
    vitals: [],
    findings: ['Both have weight loss and progressive dysphagia.'],
    options: [
      { id: 'a', text: 'Smoker/alcohol + mid-esophagus = squamous cell; GERD/obesity + distal = adenocarcinoma', correct: true },
      { id: 'b', text: 'Both are squamous cell carcinoma', whyNot: 'The distal, GERD/Barrett-associated tumor is adenocarcinoma, not squamous cell.' },
      { id: 'c', text: 'Both are adenocarcinoma', whyNot: 'The proximal/mid tumor in a smoker-drinker is squamous cell carcinoma.' },
      { id: 'd', text: 'The distal tumor is squamous, the proximal adenocarcinoma', whyNot: 'This reverses the classic associations — adeno is distal (Barrett), SCC is proximal/mid.' },
    ],
    discriminator: 'Esophageal squamous cell carcinoma is proximal/mid and driven by smoking and alcohol, whereas adenocarcinoma is distal and driven by GERD, Barrett, and obesity.',
    tags: { system: 'gi', complaint: 'dysphagia', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['gerd-barrett'],
    source: [
      { ref: 'Rustgi & El-Serag, Esophageal Carcinoma (NEJM review)', year: 2014 },
    ],
  },
  {
    itemId: 'esoca-2', version: 1, type: 'next_step', conceptId: 'esophageal-cancer', presentation: 'atypical',
    stem: 'A 62-year-old with progressive solid-food dysphagia and weight loss is otherwise well. What is the single best first test?',
    vitals: [v('Weight loss', '8 kg', true)],
    findings: ['Solid-food dysphagia progressing over months.'],
    options: [
      { id: 'a', text: 'Upper endoscopy with biopsy', correct: true },
      { id: 'b', text: 'CT of the chest first', whyNot: 'CT is used for staging AFTER tissue diagnosis; it cannot biopsy the lesion.' },
      { id: 'c', text: 'Empiric PPI trial', whyNot: 'Progressive dysphagia with weight loss is an alarm picture requiring endoscopy, not empiric acid suppression.' },
      { id: 'd', text: 'Barium swallow only', whyNot: 'Barium may outline a lesion but endoscopy is required to biopsy and confirm.' },
    ],
    discriminator: 'Progressive solid-food dysphagia with weight loss is evaluated first by upper endoscopy with biopsy to obtain tissue; cross-sectional imaging follows for staging.',
    tags: { system: 'gi', complaint: 'dysphagia', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Rustgi & El-Serag, Esophageal Carcinoma (NEJM review)', year: 2014 },
    ],
  },

  /* ── Mallory–Weiss vs Boerhaave ───────────────────────────────── */
  {
    itemId: 'mw-1', version: 1, type: 'discriminator', conceptId: 'mallory-weiss', presentation: 'classic',
    stem: 'After several bouts of forceful vomiting, one patient has streaks of hematemesis and stable vitals; another has severe chest pain, crepitus in the neck, and looks septic. What separates the two?',
    vitals: [v('HR', '124 (2nd pt)', true)],
    findings: ['One is a mucosal tear; the other has air tracking into the mediastinum.'],
    options: [
      { id: 'a', text: 'Mallory–Weiss mucosal tear vs Boerhaave transmural rupture', correct: true },
      { id: 'b', text: 'Both are Mallory–Weiss tears', whyNot: 'Subcutaneous emphysema and sepsis indicate a full-thickness (Boerhaave) rupture, not a mucosal tear.' },
      { id: 'c', text: 'Both are variceal bleeds', whyNot: 'Variceal bleeding arises in portal hypertension and does not cause pneumomediastinum or the post-retching mucosal tear pattern.' },
      { id: 'd', text: 'Both are peptic ulcer bleeding', whyNot: 'Ulcer bleeding is not triggered by retching and does not cause mediastinal air.' },
    ],
    discriminator: 'A Mallory–Weiss tear is a mucosal laceration causing self-limited hematemesis after vomiting, whereas Boerhaave is a transmural rupture with pneumomediastinum, subcutaneous emphysema, and sepsis.',
    tags: { system: 'gi', complaint: 'GI bleed', rotation: ['em', 'im', 'surg'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['boerhaave', 'variceal-bleed'],
    source: [
      { ref: 'Laine et al., ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding', year: 2021 },
    ],
  },

  /* ── Viral hepatitis serology ─────────────────────────────────── */
  {
    itemId: 'hep-1', version: 1, type: 'association', conceptId: 'acute-viral-hepatitis', presentation: 'classic',
    stem: 'A patient with acute hepatitis has this hepatitis B panel: HBsAg negative, anti-HBc IgM POSITIVE, anti-HBs negative. What does this pattern indicate?',
    vitals: [],
    findings: ['Elevated transaminases with jaundice; the surface antigen has cleared but immunity has not yet appeared.'],
    options: [
      { id: 'a', text: 'The acute "window period" of hepatitis B', correct: true },
      { id: 'b', text: 'Vaccination', whyNot: 'Vaccination gives isolated anti-HBs positivity, with anti-HBc NEGATIVE.' },
      { id: 'c', text: 'Chronic hepatitis B', whyNot: 'Chronic HBV keeps HBsAg positive for > 6 months; here HBsAg is negative.' },
      { id: 'd', text: 'Distant resolved infection', whyNot: 'Resolved infection shows anti-HBc IgG (not IgM) with anti-HBs positive.' },
    ],
    discriminator: 'Isolated anti-HBc IgM with HBsAg and anti-HBs both negative is the hepatitis B window period — the interval after surface antigen clears but before anti-HBs rises.',
    tags: { system: 'gi', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.6,
    source: [
      { ref: 'CDC — Interpretation of Hepatitis B Serologic Test Results', year: 2020 },
      { ref: 'Terrault et al., AASLD Guidance on Prevention, Diagnosis, and Treatment of Chronic Hepatitis B', year: 2018 },
    ],
  },
  {
    itemId: 'hep-2', version: 1, type: 'one_liner', conceptId: 'acute-viral-hepatitis', presentation: 'atypical',
    stem: 'A traveler returns from an endemic region with fever, malaise, and jaundice after eating raw shellfish; transaminases are markedly elevated. Anti-HAV IgM is positive. What is the diagnosis and course?',
    vitals: [v('Temp', '38.4', false)],
    findings: ['Self-limited acute hepatitis with a fecal-oral exposure history.'],
    options: [
      { id: 'a', text: 'Acute hepatitis A — self-limited, does not become chronic', correct: true },
      { id: 'b', text: 'Chronic hepatitis C', whyNot: 'Hepatitis C is blood-borne and often chronic; anti-HAV IgM indicates acute hepatitis A.' },
      { id: 'c', text: 'Hepatitis B carrier state', whyNot: 'A carrier state is defined by persistent HBsAg, not a positive anti-HAV IgM.' },
      { id: 'd', text: 'Autoimmune hepatitis', whyNot: 'Autoimmune hepatitis shows autoantibodies and a chronic relapsing course, not an acute fecal-oral exposure with anti-HAV IgM.' },
    ],
    discriminator: 'Anti-HAV IgM after a fecal-oral exposure is acute hepatitis A — an acute, self-limited hepatitis that does not progress to a chronic carrier state.',
    tags: { system: 'gi', complaint: 'jaundice', rotation: ['im', 'fm'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'CDC — Hepatitis A Questions and Answers for Health Professionals', year: 2023 },
    ],
  },

  /* ── Acetaminophen toxicity ───────────────────────────────────── */
  {
    itemId: 'apap-1', version: 1, type: 'tx_next_step', conceptId: 'acetaminophen-toxicity', presentation: 'severe',
    stem: 'A patient presents 10 hours after a large intentional acetaminophen ingestion. The level plots above the treatment line on the Rumack–Matthew nomogram. What is the treatment?',
    vitals: [],
    findings: ['Currently asymptomatic; transaminases still normal.'],
    options: [
      { id: 'a', text: 'N-acetylcysteine', correct: true },
      { id: 'b', text: 'Wait for transaminases to rise before treating', whyNot: 'NAC is most effective given early (ideally within 8–10 h); waiting for hepatotoxicity to declare itself loses the window.' },
      { id: 'c', text: 'Activated charcoal alone', whyNot: 'Charcoal helps only very early after ingestion and does not replace NAC once the level is toxic.' },
      { id: 'd', text: 'Urgent hemodialysis', whyNot: 'Dialysis is not standard for acetaminophen; NAC replenishes glutathione and is the antidote.' },
    ],
    discriminator: 'A toxic acetaminophen level by the Rumack–Matthew nomogram is treated with N-acetylcysteine, which is most effective when started early — do not wait for liver enzymes to rise.',
    tags: { system: 'gi', complaint: 'overdose', rotation: ['em', 'im'], level: 'both' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Heard, Acetylcysteine for Acetaminophen Poisoning (NEJM review)', year: 2008 },
      { ref: 'Lee et al., AASLD Position Paper: The Management of Acute Liver Failure', year: 2011 },
    ],
  },
  {
    itemId: 'apap-2', version: 1, type: 'one_liner', conceptId: 'acetaminophen-toxicity', presentation: 'atypical',
    stem: 'Three days after a large acetaminophen overdose, a patient has AST 6800, ALT 7200, INR 3.4 and encephalopathy. What is the diagnosis?',
    vitals: [v('INR', '3.4', true)],
    findings: ['Transaminases in the thousands with coagulopathy and confusion.'],
    options: [
      { id: 'a', text: 'Acetaminophen-induced acute liver failure', correct: true },
      { id: 'b', text: 'Acute viral hepatitis', whyNot: 'Viral hepatitis rarely drives transaminases this high; the massive elevation with this history is acetaminophen toxicity.' },
      { id: 'c', text: 'Alcoholic hepatitis', whyNot: 'Alcoholic hepatitis has AST:ALT > 2 with values usually < 300–400, not transaminases in the thousands.' },
      { id: 'd', text: 'Choledocholithiasis', whyNot: 'Biliary obstruction raises alkaline phosphatase and bilirubin with modest transaminases, not values in the thousands.' },
    ],
    discriminator: 'Transaminases in the thousands with rising INR and encephalopathy days after overdose is acetaminophen-induced acute liver failure — far higher aminotransferases than viral or alcoholic hepatitis produce.',
    tags: { system: 'gi', complaint: 'jaundice', rotation: ['im', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Lee et al., AASLD Position Paper: The Management of Acute Liver Failure', year: 2011 },
    ],
  },

  /* ── Wilson disease ───────────────────────────────────────────── */
  {
    itemId: 'wilson-1', version: 1, type: 'one_liner', conceptId: 'wilson-disease', presentation: 'classic',
    stem: 'A 20-year-old has new tremor, dysarthria and mood change plus abnormal liver tests. Slit-lamp shows golden-brown rings at the corneal margin; ceruloplasmin is low and 24-hour urinary copper is high. What is the diagnosis?',
    vitals: [],
    findings: ['Combined hepatic and neuropsychiatric disease in a young adult.'],
    options: [
      { id: 'a', text: 'Wilson disease', correct: true },
      { id: 'b', text: 'Hereditary hemochromatosis', whyNot: 'Hemochromatosis is an iron disorder of older adults with high ferritin, not low ceruloplasmin with Kayser–Fleischer rings.' },
      { id: 'c', text: 'Autoimmune hepatitis', whyNot: 'Autoimmune hepatitis shows autoantibodies, not corneal copper rings and low ceruloplasmin.' },
      { id: 'd', text: 'Alcoholic liver disease', whyNot: 'Alcoholic disease does not cause Kayser–Fleischer rings or the low-ceruloplasmin, high-urinary-copper profile.' },
    ],
    discriminator: 'A young patient with combined liver and neuropsychiatric disease, Kayser–Fleischer rings, low ceruloplasmin and high urinary copper has Wilson disease.',
    tags: { system: 'gi', complaint: 'jaundice', rotation: ['im', 'neuro'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['hemochromatosis'],
    source: [
      { ref: 'Roberts & Schilsky, AASLD Practice Guideline: Diagnosis and Treatment of Wilson Disease', year: 2008 },
      { ref: 'EASL Clinical Practice Guidelines: Wilson’s Disease', year: 2012 },
    ],
  },
  {
    itemId: 'wilson-2', version: 1, type: 'discriminator', conceptId: 'wilson-disease', presentation: 'atypical',
    stem: 'Two young patients have liver disease from a metabolic overload. One has copper deposition; the other, iron. Which single feature most specifically points to Wilson rather than hemochromatosis?',
    vitals: [],
    findings: ['Both have transaminase elevation and a positive family history.'],
    options: [
      { id: 'a', text: 'Kayser–Fleischer rings with low ceruloplasmin', correct: true },
      { id: 'b', text: 'Elevated transferrin saturation', whyNot: 'High transferrin saturation indicates iron overload (hemochromatosis), not copper (Wilson).' },
      { id: 'c', text: 'Skin bronzing and diabetes', whyNot: '"Bronze diabetes" is the hemochromatosis phenotype, not Wilson disease.' },
      { id: 'd', text: 'Arthropathy of the 2nd and 3rd MCP joints', whyNot: 'This MCP arthropathy is characteristic of hemochromatosis.' },
    ],
    discriminator: 'Kayser–Fleischer rings with a low ceruloplasmin mark copper overload (Wilson), whereas high transferrin saturation, bronze skin, and MCP arthropathy mark iron overload (hemochromatosis).',
    tags: { system: 'gi', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['hemochromatosis'],
    source: [
      { ref: 'EASL Clinical Practice Guidelines: Wilson’s Disease', year: 2012 },
    ],
  },

  /* ── Hemochromatosis ──────────────────────────────────────────── */
  {
    itemId: 'hemochrom-1', version: 1, type: 'one_liner', conceptId: 'hemochromatosis', presentation: 'classic',
    stem: 'A 52-year-old man has fatigue, arthralgia of the 2nd–3rd knuckles, new diabetes, and skin bronzing. Ferritin and transferrin saturation are high; HFE testing shows C282Y homozygosity. What is the diagnosis?',
    vitals: [v('Transferrin sat', '78%', true)],
    findings: ['Iron overload with pancreatic, joint, and skin involvement.'],
    options: [
      { id: 'a', text: 'Hereditary hemochromatosis', correct: true },
      { id: 'b', text: 'Wilson disease', whyNot: 'Wilson is copper overload in younger patients with Kayser–Fleischer rings and low ceruloplasmin, not high transferrin saturation.' },
      { id: 'c', text: 'Type 2 diabetes with incidental cirrhosis', whyNot: 'The combination of high transferrin saturation, C282Y homozygosity and iron-loading features defines hemochromatosis.' },
      { id: 'd', text: 'Porphyria cutanea tarda alone', whyNot: 'PCT causes photosensitive blistering; while it associates with iron, the C282Y-homozygous multi-organ iron overload here is hemochromatosis.' },
    ],
    discriminator: '"Bronze diabetes" with 2nd/3rd MCP arthropathy, high transferrin saturation/ferritin, and C282Y homozygosity is hereditary hemochromatosis.',
    tags: { system: 'gi', complaint: 'buzzword', rotation: ['im'], level: 'both' },
    difficultySeed: 0.5,
    distractorConceptIds: ['wilson-disease'],
    source: [
      { ref: 'Kowdley et al., ACG Clinical Guideline: Hereditary Hemochromatosis', year: 2019 },
    ],
  },
  {
    itemId: 'hemochrom-2', version: 1, type: 'tx_next_step', conceptId: 'hemochromatosis', presentation: 'atypical',
    stem: 'A newly diagnosed C282Y-homozygous patient has iron overload but no anemia. What is the mainstay of treatment?',
    vitals: [v('Ferritin', '1450', true)],
    findings: ['Elevated ferritin and transferrin saturation without anemia.'],
    options: [
      { id: 'a', text: 'Therapeutic phlebotomy', correct: true },
      { id: 'b', text: 'Iron chelation (deferoxamine) first line', whyNot: 'Chelation is reserved for those who cannot tolerate phlebotomy (e.g., anemia); phlebotomy is first line in hereditary hemochromatosis.' },
      { id: 'c', text: 'Oral iron supplementation', whyNot: 'Giving iron worsens the overload — exactly the wrong direction.' },
      { id: 'd', text: 'Observation only', whyNot: 'Untreated iron overload progresses to cirrhosis, cardiomyopathy, and hepatocellular carcinoma; de-ironing is needed.' },
    ],
    discriminator: 'Hereditary hemochromatosis is treated first with therapeutic phlebotomy to remove iron; chelation is reserved for patients who cannot tolerate phlebotomy.',
    tags: { system: 'gi', complaint: 'iron overload', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.45,
    source: [
      { ref: 'Kowdley et al., ACG Clinical Guideline: Hereditary Hemochromatosis', year: 2019 },
    ],
  },

  /* ── Hepatorenal syndrome ─────────────────────────────────────── */
  {
    itemId: 'hrs-1', version: 1, type: 'discriminator', conceptId: 'hepatorenal-syndrome', presentation: 'severe',
    stem: 'A patient with cirrhosis and ascites develops AKI. Urine sodium is very low, sediment is bland, and creatinine does NOT improve after 2 days of albumin and withdrawal of diuretics. What is the diagnosis?',
    vitals: [v('Cr', '2.8', true), v('Urine Na', '8', true)],
    findings: ['No shock, no nephrotoxins, no obstruction; ATN and prerenal disease have been addressed.'],
    options: [
      { id: 'a', text: 'Hepatorenal syndrome', correct: true },
      { id: 'b', text: 'Prerenal azotemia', whyNot: 'Prerenal AKI improves with volume expansion; hepatorenal AKI does not respond to albumin.' },
      { id: 'c', text: 'Acute tubular necrosis', whyNot: 'ATN shows muddy-brown granular casts and a higher urine sodium, not the bland, sodium-avid urine of HRS.' },
      { id: 'd', text: 'Postrenal obstruction', whyNot: 'Obstruction is excluded by ultrasound; HRS is a functional, diagnosis-of-exclusion AKI.' },
    ],
    discriminator: 'Hepatorenal syndrome is AKI in advanced cirrhosis with a very low urine sodium and bland sediment that fails to improve with albumin volume expansion — a functional diagnosis of exclusion.',
    tags: { system: 'gi', complaint: 'AKI', rotation: ['im'], level: 'clerkship' },
    difficultySeed: 0.6,
    distractorConceptIds: ['prerenal-vs-atn'],
    source: [
      { ref: 'Biggins et al., AASLD Practice Guidance: Diagnosis, Evaluation, and Management of Ascites, SBP, and HRS in Cirrhosis', year: 2021 },
      { ref: 'EASL Clinical Practice Guidelines for the Management of Patients with Decompensated Cirrhosis', year: 2018 },
    ],
  },

  /* ── Diverticulitis ───────────────────────────────────────────── */
  {
    itemId: 'divert-1', version: 1, type: 'next_step', conceptId: 'diverticulitis', presentation: 'classic',
    stem: 'A 63-year-old has 2 days of left-lower-quadrant pain, low-grade fever, and a mild leukocytosis. What is the best initial imaging test?',
    vitals: [v('Temp', '38.1', false), v('WBC', '13.5', true)],
    findings: ['Localized LLQ tenderness without peritonitis.'],
    options: [
      { id: 'a', text: 'CT of the abdomen and pelvis with contrast', correct: true },
      { id: 'b', text: 'Colonoscopy now', whyNot: 'Colonoscopy is contraindicated in acute diverticulitis (perforation risk); it is done 6–8 weeks later to exclude cancer.' },
      { id: 'c', text: 'Barium enema', whyNot: 'Barium enema is avoided acutely due to leakage risk if there is a perforation.' },
      { id: 'd', text: 'No imaging; treat empirically', whyNot: 'CT confirms the diagnosis and detects complications (abscess, perforation) that change management.' },
    ],
    discriminator: 'Acute left-lower-quadrant pain with fever is evaluated with CT of the abdomen/pelvis; colonoscopy is deferred until after recovery because scoping an inflamed colon risks perforation.',
    tags: { system: 'gi', complaint: 'abdominal pain', rotation: ['im', 'surg', 'em'], level: 'both' },
    difficultySeed: 0.45,
    distractorConceptIds: ['colorectal-cancer'],
    source: [
      { ref: 'Peery et al., AGA Institute Guideline on the Management of Acute Diverticulitis', year: 2015 },
      { ref: 'Hall et al., ASCRS Clinical Practice Guidelines for the Treatment of Left-Sided Colonic Diverticulitis', year: 2020 },
    ],
  },
  {
    itemId: 'divert-2', version: 1, type: 'tx_next_step', conceptId: 'diverticulitis', presentation: 'atypical',
    stem: 'A well-appearing patient has CT-confirmed uncomplicated diverticulitis, tolerating oral intake, no abscess or perforation. What is appropriate management?',
    vitals: [v('Temp', '37.6', false)],
    findings: ['No systemic toxicity, immunocompromise, or complication on CT.'],
    options: [
      { id: 'a', text: 'Outpatient management with close follow-up (selective, not automatic, antibiotics)', correct: true },
      { id: 'b', text: 'Emergent sigmoid colectomy', whyNot: 'Surgery is for complicated or recurrent disease, not a first uncomplicated episode.' },
      { id: 'c', text: 'Immediate colonoscopy', whyNot: 'Scoping is deferred until the acute inflammation resolves because of perforation risk.' },
      { id: 'd', text: 'Long-term suppressive antibiotics', whyNot: 'Chronic antibiotic suppression is not standard; even acute antibiotics are used selectively in uncomplicated disease.' },
    ],
    discriminator: 'Uncomplicated diverticulitis in a well patient can be managed as an outpatient with supportive care and selective antibiotics, reserving surgery for complications or recurrence.',
    tags: { system: 'gi', complaint: 'abdominal pain', rotation: ['im', 'surg'], level: 'clerkship' },
    difficultySeed: 0.55,
    source: [
      { ref: 'Peery et al., AGA Institute Guideline on the Management of Acute Diverticulitis', year: 2015 },
    ],
  },

  /* ── Small-bowel obstruction ──────────────────────────────────── */
  {
    itemId: 'sbo-1', version: 1, type: 'discriminator', conceptId: 'bowel-obstruction', presentation: 'classic',
    stem: 'A patient with prior abdominal surgery has colicky pain, bilious vomiting, distension, and obstipation. Imaging shows dilated small-bowel loops with air-fluid levels. Bowel sounds are high-pitched then diminishing. How does this differ from ileus?',
    vitals: [v('HR', '104', false)],
    findings: ['Mechanical pattern with a clear transition and prior adhesions.'],
    options: [
      { id: 'a', text: 'Mechanical small-bowel obstruction (adhesive), not paralytic ileus', correct: true },
      { id: 'b', text: 'Paralytic ileus', whyNot: 'Ileus gives a silent, uniformly gas-filled abdomen without a mechanical transition point or high-pitched sounds.' },
      { id: 'c', text: 'Acute gastroenteritis', whyNot: 'Gastroenteritis causes diarrhea, not obstipation with dilated loops and air-fluid levels.' },
      { id: 'd', text: 'Large-bowel obstruction from cancer', whyNot: 'LBO dilates the colon with the small bowel decompressed; here the small bowel is dilated with a post-surgical adhesive cause.' },
    ],
    discriminator: 'Adhesive small-bowel obstruction shows colicky pain, dilated loops with air-fluid levels, and high-pitched then absent bowel sounds, whereas paralytic ileus is a quiet, diffusely gas-filled abdomen with no mechanical transition.',
    tags: { system: 'gi', complaint: 'abdominal pain', rotation: ['surg', 'em', 'im'], level: 'both' },
    difficultySeed: 0.5,
    source: [
      { ref: 'Ten Broek et al., Bologna Guidelines for Diagnosis and Management of Adhesive Small Bowel Obstruction (WSES)', year: 2018 },
    ],
  },
  {
    itemId: 'sbo-2', version: 1, type: 'cant_miss', conceptId: 'bowel-obstruction', presentation: 'severe',
    stem: 'A patient with a small-bowel obstruction now has fever, tachycardia, focal peritonitis, a rising lactate, and worsening pain. What complication must you not miss?',
    vitals: [v('Lactate', '4.2', true), v('HR', '128', true)],
    findings: ['Localized peritoneal signs with systemic toxicity.'],
    options: [
      { id: 'a', text: 'Strangulation/ischemia requiring urgent surgery', correct: true },
      { id: 'b', text: 'Simple uncomplicated obstruction, continue NG decompression', whyNot: 'Peritonitis, fever, and a rising lactate signal compromised bowel — this needs the operating room, not continued watchful waiting.' },
      { id: 'c', text: 'Constipation', whyNot: 'Constipation does not cause peritonitis, tachycardia, and lactic acidosis.' },
      { id: 'd', text: 'Gastroenteritis', whyNot: 'The peritoneal signs and lactate indicate ischemic bowel, not a self-limited infection.' },
    ],
    discriminator: 'Fever, peritonitis, tachycardia, and a rising lactate on top of a bowel obstruction signal strangulation with ischemia — a surgical emergency, not a case for continued conservative management.',
    tags: { system: 'gi', complaint: 'abdominal pain', rotation: ['surg', 'em'], level: 'clerkship' },
    difficultySeed: 0.5,
    distractorConceptIds: ['mesenteric-ischemia'],
    source: [
      { ref: 'Ten Broek et al., Bologna Guidelines for Adhesive Small Bowel Obstruction (WSES)', year: 2018 },
    ],
  },

  /* ── RUQ trio ─────────────────────────────────────────────────── */
  {
    itemId: 'choledoc-1', version: 1, type: 'discriminator', conceptId: 'choledocholithiasis', presentation: 'classic',
    stem: 'Three patients with gallstones: (A) painless jaundice with a dilated common bile duct and no fever; (B) RUQ pain with a positive Murphy sign and no jaundice; (C) fever, jaundice, and RUQ pain together. Which is which?',
    vitals: [],
    findings: ['All have known cholelithiasis; the discriminators are jaundice, Murphy sign, and fever.'],
    options: [
      { id: 'a', text: 'A = choledocholithiasis, B = acute cholecystitis, C = ascending cholangitis', correct: true },
      { id: 'b', text: 'All three are acute cholecystitis', whyNot: 'Painless obstructive jaundice and Charcot triad are distinct from the RUQ-pain/Murphy picture of cholecystitis.' },
      { id: 'c', text: 'A = cholangitis, C = choledocholithiasis', whyNot: 'This reverses them — Charcot triad (fever + jaundice + RUQ pain) is cholangitis; painless jaundice with a dilated duct is choledocholithiasis.' },
      { id: 'd', text: 'B = choledocholithiasis, A = cholecystitis', whyNot: 'The Murphy-positive, non-jaundiced patient is cholecystitis; the jaundiced patient with a dilated duct is choledocholithiasis.' },
    ],
    discriminator: 'Painless obstructive jaundice with a dilated duct is choledocholithiasis, RUQ pain with a positive Murphy sign is cholecystitis, and fever + jaundice + RUQ pain (Charcot triad) is ascending cholangitis.',
    tags: { system: 'gi', complaint: 'jaundice', rotation: ['im', 'surg', 'em'], level: 'both' },
    difficultySeed: 0.55,
    distractorConceptIds: ['cholecystitis', 'ascending-cholangitis'],
    source: [
      { ref: 'Buxbaum et al., ASGE Guideline on the Role of Endoscopy in the Evaluation and Management of Choledocholithiasis', year: 2019 },
      { ref: 'Tokyo Guidelines (TG18) for the Management of Acute Cholangitis and Cholecystitis', year: 2018 },
    ],
  },
];

const alsoSystems: Record<string, System[]> = {
  'acetaminophen-toxicity': ['multisystem'],
  'wilson-disease': ['neuro'],
  'hemochromatosis': ['endocrine'],
  'hepatorenal-syndrome': ['renal'],
};

export const GI_DEPTH: ContentModule = {
  concepts,
  subtopics,
  alsoSystems,
  items,
};
