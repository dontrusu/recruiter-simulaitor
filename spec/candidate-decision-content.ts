import type {
  CandidateNameEntry,
  CandidateTag,
  ContentFragment,
  StageRange,
} from "./content-schema";

const nameSeeds = [
  ["n001", "Alex Moreno"], ["n002", "Maya Chen"], ["n003", "Daniel Kovacs"], ["n004", "Iryna Bondar"],
  ["n005", "Samira Haddad"], ["n006", "Tomas Novak"], ["n007", "Priya Raman"], ["n008", "Liam Osei"],
  ["n009", "Nora Lind"], ["n010", "Mateo Silva"], ["n011", "Olena Marchenko"], ["n012", "Kenji Sato"],
  ["n013", "Amina Diallo"], ["n014", "Jonas Berg"], ["n015", "Leila Mansour"], ["n016", "Victor Ionescu"],
  ["n017", "Sofia Petrescu"], ["n018", "Arjun Mehta"], ["n019", "Eva Horvat"], ["n020", "Noah Williams"],
  ["n021", "Zara Khan"], ["n022", "Marek Zielinski"], ["n023", "Lucia Ferrer"], ["n024", "Omar Rahman"],
  ["n025", "Hana Kim"], ["n026", "Milan Jovanovic"], ["n027", "Ada Okafor"], ["n028", "Theo Martin"],
  ["n029", "Kateryna Melnyk"], ["n030", "Ravi Kapoor"], ["n031", "Elena Rossi"], ["n032", "David Mensah"],
  ["n033", "Mei Lin"], ["n034", "Andrei Popescu"], ["n035", "Sara Nordin"], ["n036", "Leo Costa"],
  ["n037", "Nadiia Koval"], ["n038", "Yuki Tanaka"], ["n039", "Fatima Zahra"], ["n040", "Pavel Dvorak"],
  ["n041", "Camila Torres"], ["n042", "Amir Saleh"], ["n043", "Jiho Park"], ["n044", "Emil Larsen"],
  ["n045", "Rina Patel"], ["n046", "Bohdan Tkachenko"], ["n047", "Ines Duarte"], ["n048", "Kwame Boateng"],
  ["n049", "Marta Nowak"], ["n050", "Elias Haddad"], ["n051", "Aya Nakamura"], ["n052", "Stefan Markovic"],
  ["n053", "Lina Georgiou"], ["n054", "Gabriel Santos"], ["n055", "Yana Shevchenko"], ["n056", "Nikhil Rao"],
  ["n057", "Clara Weiss"], ["n058", "Malik Johnson"], ["n059", "Soojin Lee"], ["n060", "Anton Ivanov"],
  ["n061", "Mira Benali"], ["n062", "Jakub Wrona"], ["n063", "Isabel Cruz"], ["n064", "Tariq Aziz"],
  ["n065", "Anika Bose"], ["n066", "Danylo Rudenko"], ["n067", "Freja Holm"], ["n068", "Bruno Almeida"],
  ["n069", "Laila Nasser"], ["n070", "Minho Choi"], ["n071", "Petra Vukovic"], ["n072", "Lucas Meyer"],
  ["n073", "Oksana Hrytsenko"], ["n074", "Dev Malhotra"], ["n075", "Chiara Bianchi"], ["n076", "Kojo Asante"],
  ["n077", "Linnea Eriksen"], ["n078", "Rafael Mendes"], ["n079", "Daria Mazur"], ["n080", "Farid Karim"],
  ["n081", "Naomi Ito"], ["n082", "Nikola Petrovic"], ["n083", "Elif Demir"], ["n084", "Hugo Bernard"],
  ["n085", "Sana Qureshi"], ["n086", "Mykhailo Lysenko"], ["n087", "Teresa Molina"], ["n088", "Samuel Adebayo"],
  ["n089", "Klara Svoboda"], ["n090", "Adrian Flores"], ["n091", "Yasmin Farouk"], ["n092", "Jun Seo"],
  ["n093", "Ivana Kovac"], ["n094", "Martin Keller"], ["n095", "Vira Chernenko"], ["n096", "Neha Iyer"],
  ["n097", "Alessio Romano"], ["n098", "Ama Owusu"], ["n099", "Ewa Kowalska"], ["n100", "Karim Boulos"],
] as const;

export const candidateNames: readonly CandidateNameEntry[] = nameSeeds.map(
  ([id, displayName]) => ({ id, displayName, weight: 1 }),
);

type DecisionFragmentSeed = {
  readonly id: string;
  readonly kind: "concern" | "reject-reason";
  readonly text: string;
  readonly tags: readonly CandidateTag[];
  readonly stage?: StageRange;
  readonly salience?: "neutral" | "noticeable" | "punchline";
  readonly weight?: number;
};

const decisionFragmentSeeds = [
  // Mira concerns — 50
  { id: "concern-keyword-equivalent", kind: "concern", text: "Uses equivalent terminology rather than the exact approved keyword.", tags: ["keyword-mismatch"], salience: "neutral" },
  { id: "concern-framework-adjacent", kind: "concern", text: "Demonstrates transferable framework knowledge, which may complicate stack loyalty.", tags: ["adjacent-stack", "keyword-mismatch"], salience: "noticeable" },
  { id: "concern-version-current-production", kind: "concern", text: "Experience centers on the version currently running in production, not the version in the roadmap.", tags: ["legacy-stack", "keyword-mismatch"], salience: "noticeable" },
  { id: "concern-fundamentals-over-brand", kind: "concern", text: "Emphasizes fundamentals more often than approved technology brands.", tags: ["keyword-mismatch", "strong-evidence"], salience: "noticeable" },
  { id: "concern-skill-alias", kind: "concern", text: "Lists a recognized skill alias that may not satisfy literal matching requirements.", tags: ["keyword-mismatch"], salience: "neutral" },

  { id: "concern-overqualified-retention", kind: "concern", text: "Depth of experience may create a statistically inconvenient retention expectation.", tags: ["overqualified"], salience: "noticeable" },
  { id: "concern-principal-autonomy", kind: "concern", text: "History of autonomy may reduce enthusiasm for multi-layer approval workflows.", tags: ["overqualified", "leadership"], salience: "noticeable" },
  { id: "concern-lead-title", kind: "concern", text: "Previous lead title introduces alignment risk with the current reporting geometry.", tags: ["overqualified", "leadership"], salience: "noticeable" },
  { id: "concern-salary-unmodeled", kind: "concern", text: "Experience level suggests compensation expectations outside the current optimism model.", tags: ["overqualified"], salience: "punchline" },
  { id: "concern-too-ready", kind: "concern", text: "Could become productive before the onboarding program demonstrates sufficient value.", tags: ["overqualified", "too-perfect"], salience: "punchline" },

  { id: "concern-job-mobility", kind: "concern", text: "Multiple successful engagements may indicate comfort with leaving completed work.", tags: ["job-hopper"], salience: "noticeable" },
  { id: "concern-long-tenure-change", kind: "concern", text: "Long tenure may have reduced exposure to annual reorganization resilience.", tags: ["long-tenure"], salience: "noticeable" },
  { id: "concern-consultant-context", kind: "concern", text: "Rapid context switching may conflict with our preference for prolonged ambiguity.", tags: ["job-hopper", "strong-evidence"], salience: "punchline" },
  { id: "concern-career-break-recency", kind: "concern", text: "Recent project evidence exists, but the timeline contains an unoptimized interval.", tags: ["career-change"], salience: "noticeable" },
  { id: "concern-founder-reporting", kind: "concern", text: "Founder experience may create questions about comfort receiving priorities from a committee.", tags: ["career-change", "leadership"], salience: "neutral" },

  { id: "concern-culture-specificity", kind: "concern", text: "Provides concrete collaboration examples instead of stating cultural alignment directly.", tags: ["culture-vague", "strong-evidence"], salience: "noticeable" },
  { id: "concern-values-independent", kind: "concern", text: "Appears to hold professional values independently of the company values page.", tags: ["culture-vague"], salience: "punchline" },
  { id: "concern-low-enthusiasm-language", kind: "concern", text: "Uses measured language where exceptional excitement is usually observed.", tags: ["culture-vague"], salience: "neutral" },
  { id: "concern-boundaries", kind: "concern", text: "Mentions sustainable working boundaries before receiving the wellbeing presentation.", tags: ["culture-vague"], salience: "noticeable" },
  { id: "concern-asks-why", kind: "concern", text: "History of asking why may add latency to urgent predetermined decisions.", tags: ["culture-vague", "strong-evidence"], salience: "punchline" },

  { id: "concern-ai-language-density", kind: "concern", text: "Résumé contains an unusually high concentration of measurable transformation.", tags: ["ai-written"], salience: "noticeable" },
  { id: "concern-perfect-grammar", kind: "concern", text: "Grammar consistency exceeds the expected human confidence interval.", tags: ["ai-written", "too-perfect"], salience: "punchline" },
  { id: "concern-unverifiable-synergy", kind: "concern", text: "Claims cross-functional synergy without identifying the functions that crossed.", tags: ["ai-written", "weak-evidence"], salience: "noticeable" },
  { id: "concern-certification-production", kind: "concern", text: "Certification coverage is broader than demonstrated production exposure.", tags: ["underqualified"], salience: "neutral" },
  { id: "concern-portfolio-uniform", kind: "concern", text: "Every portfolio project has identical architecture and unusually supportive users.", tags: ["underqualified", "ai-written"], salience: "noticeable" },

  { id: "concern-remote-documentation", kind: "concern", text: "Strong written communication may reduce spontaneous meeting participation.", tags: ["remote-only", "strong-evidence"], salience: "punchline" },
  { id: "concern-remote-only", kind: "concern", text: "Remote preference conflicts with an office strategy currently described as flexible.", tags: ["remote-only", "contradictory"], salience: "noticeable" },
  { id: "concern-office-only", kind: "concern", text: "Office preference may limit participation in the globally distributed mandatory culture.", tags: ["office-only", "contradictory"], salience: "noticeable" },
  { id: "concern-timezone", kind: "concern", text: "Asynchronous habits may reduce availability for recurring cross-time-zone syncs.", tags: ["remote-only"], salience: "noticeable" },
  { id: "concern-commute", kind: "concern", text: "Has included realistic commute time in availability planning.", tags: ["office-only"], salience: "neutral" },

  { id: "concern-ownership-resistance", kind: "concern", text: "Demonstrated ownership may indicate resistance to alignment.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "concern-mentoring-capacity", kind: "concern", text: "Mentoring history could create unplanned demand from less productive colleagues.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "concern-decision-records", kind: "concern", text: "Documents decisions in ways that may preserve accountability beyond the current quarter.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "concern-challenges-roadmap", kind: "concern", text: "Has previously changed roadmaps using evidence rather than hierarchy.", tags: ["leadership", "contradictory"], salience: "noticeable" },
  { id: "concern-incident-transparency", kind: "concern", text: "Promotes incident transparency, which may increase the number of visible incidents.", tags: ["leadership", "strong-evidence"], salience: "punchline" },

  { id: "concern-no-obvious-gap", kind: "concern", text: "No obvious gap detected; absence of concern requires additional review.", tags: ["too-perfect", "mira-uncertain"], salience: "punchline" },
  { id: "concern-consistent-results", kind: "concern", text: "Results are unusually consistent and may reflect insufficient experimentation.", tags: ["too-perfect", "strong-evidence"], salience: "punchline" },
  { id: "concern-references-agree", kind: "concern", text: "References agree on key facts with potentially rehearsed precision.", tags: ["too-perfect"], salience: "noticeable" },
  { id: "concern-metrics-context", kind: "concern", text: "Metrics include baselines and methodology, reducing narrative flexibility.", tags: ["too-perfect", "strong-evidence"], salience: "punchline" },
  { id: "concern-fit-score-ceiling", kind: "concern", text: "Match score reached the display ceiling before culture normalization.", tags: ["too-perfect", "mira-uncertain"], salience: "noticeable" },

  { id: "concern-appeal-correct", kind: "concern", text: "Appeal evidence appears correct, which may undermine automation confidence.", tags: ["appeal", "contradictory"], stage: [4, 7], salience: "punchline" },
  { id: "concern-returning-memory", kind: "concern", text: "Candidate remembers the previous rejection more accurately than the system.", tags: ["returning-candidate"], stage: [4, 7], salience: "noticeable" },
  { id: "concern-models-disagree", kind: "concern", text: "Screening models agree that further models are required.", tags: ["mira-uncertain", "contradictory"], stage: [5, 7], salience: "punchline" },
  { id: "concern-auto-reason-conflict", kind: "concern", text: "Automated rejection reason conflicts with the automated profile summary.", tags: ["appeal", "contradictory"], stage: [4, 7], salience: "noticeable" },
  { id: "concern-confidence-rounded", kind: "concern", text: "Model confidence has been rounded upward for decision velocity.", tags: ["mira-uncertain"], stage: [5, 7], salience: "punchline" },

  { id: "concern-role-expanded", kind: "concern", text: "Candidate fits the published role but not its newly discovered responsibilities.", tags: ["requirement-mutated", "contradictory"], stage: [4, 7], salience: "noticeable" },
  { id: "concern-cloud-added", kind: "concern", text: "Required cloud expertise was added after application to improve candidate quality.", tags: ["requirement-mutated", "keyword-mismatch"], stage: [4, 7], salience: "punchline" },
  { id: "concern-seniority-shifted", kind: "concern", text: "Role seniority changed while the candidate’s experience remained inconveniently constant.", tags: ["requirement-mutated", "contradictory"], stage: [4, 7], salience: "punchline" },
  { id: "concern-office-policy-updated", kind: "concern", text: "Location alignment was valid under the policy shown when the candidate applied.", tags: ["requirement-mutated", "remote-only"], stage: [4, 7], salience: "noticeable" },
  { id: "concern-budget-reclassified", kind: "concern", text: "Candidate matches the role before compensation was reclassified as an efficiency target.", tags: ["requirement-mutated", "overqualified"], stage: [5, 7], salience: "punchline" },

  // Rejection reasons — 60
  { id: "reject-core-skill-missing", kind: "reject-reason", text: "Does not demonstrate one of the role’s core skills.", tags: ["weak-evidence"], salience: "neutral" },
  { id: "reject-experience-insufficient", kind: "reject-reason", text: "Relevant production experience is below the current requirement.", tags: ["underqualified"], salience: "neutral" },
  { id: "reject-role-evidence-unclear", kind: "reject-reason", text: "Provided evidence does not clearly support the responsibilities of this role.", tags: ["weak-evidence"], salience: "neutral" },
  { id: "reject-seniority-mismatch", kind: "reject-reason", text: "Demonstrated scope does not align with the advertised seniority.", tags: ["underqualified"], salience: "neutral" },
  { id: "reject-location-conflict", kind: "reject-reason", text: "The candidate’s working-location requirement conflicts with the role.", tags: ["remote-only", "office-only"], salience: "neutral" },
  { id: "reject-availability", kind: "reject-reason", text: "Availability does not match the current hiring timeline.", tags: ["weak-evidence"], salience: "neutral" },

  { id: "reject-keyword-exact", kind: "reject-reason", text: "Relevant experience is present under non-approved terminology.", tags: ["keyword-mismatch"], salience: "noticeable" },
  { id: "reject-framework-name", kind: "reject-reason", text: "Framework expertise is transferable but not textually identical.", tags: ["adjacent-stack", "keyword-mismatch"], salience: "noticeable" },
  { id: "reject-version-gap", kind: "reject-reason", text: "Experience is one major version behind the aspirational environment.", tags: ["legacy-stack", "keyword-mismatch"], salience: "noticeable" },
  { id: "reject-cloud-brand", kind: "reject-reason", text: "Cloud experience is substantial but associated with a different logo.", tags: ["adjacent-stack", "keyword-mismatch"], salience: "punchline" },
  { id: "reject-title-keyword", kind: "reject-reason", text: "Previous title does not contain the expected seniority keyword.", tags: ["keyword-mismatch"], salience: "noticeable" },
  { id: "reject-skill-order", kind: "reject-reason", text: "Required skill appears too low in the résumé’s declared priority order.", tags: ["keyword-mismatch"], salience: "punchline" },

  { id: "reject-culture-specific", kind: "reject-reason", text: "Collaboration examples were too specific to confirm broad cultural alignment.", tags: ["culture-vague"], salience: "punchline" },
  { id: "reject-culture-measured", kind: "reject-reason", text: "Communication style was measured rather than visibly passionate.", tags: ["culture-vague"], salience: "noticeable" },
  { id: "reject-culture-boundaries", kind: "reject-reason", text: "Candidate expressed boundaries before completing resilience onboarding.", tags: ["culture-vague"], salience: "punchline" },
  { id: "reject-culture-questions", kind: "reject-reason", text: "Asked questions that may slow immediate alignment.", tags: ["culture-vague"], salience: "punchline" },
  { id: "reject-culture-independent", kind: "reject-reason", text: "Professional values appear insufficiently dependent on company messaging.", tags: ["culture-vague"], salience: "punchline" },
  { id: "reject-culture-low-emoji", kind: "reject-reason", text: "Written communication displayed below-benchmark celebratory punctuation.", tags: ["culture-vague"], salience: "punchline" },

  { id: "reject-overqualified-flight", kind: "reject-reason", text: "Experience suggests elevated future mobility risk.", tags: ["overqualified"], salience: "noticeable" },
  { id: "reject-overqualified-autonomy", kind: "reject-reason", text: "History of autonomy may conflict with the current approval structure.", tags: ["overqualified", "leadership"], salience: "noticeable" },
  { id: "reject-overqualified-compensation", kind: "reject-reason", text: "Profile exceeds the role’s compensation confidence interval.", tags: ["overqualified"], salience: "punchline" },
  { id: "reject-overqualified-onboarding", kind: "reject-reason", text: "Candidate may require less onboarding than the program is designed to provide.", tags: ["overqualified", "too-perfect"], salience: "punchline" },
  { id: "reject-overqualified-manager", kind: "reject-reason", text: "Experience may create an avoidable comparison with the hiring manager.", tags: ["overqualified", "leadership"], salience: "punchline" },
  { id: "reject-overqualified-ready", kind: "reject-reason", text: "Immediate readiness leaves limited room for visible development planning.", tags: ["overqualified", "too-perfect"], salience: "punchline" },

  { id: "reject-resume-ai-density", kind: "reject-reason", text: "Résumé language exceeds the acceptable transformation-per-paragraph ratio.", tags: ["ai-written"], salience: "punchline" },
  { id: "reject-resume-perfect", kind: "reject-reason", text: "Application is statistically cleaner than the available human baseline.", tags: ["ai-written", "too-perfect"], salience: "punchline" },
  { id: "reject-resume-template", kind: "reject-reason", text: "Résumé structure matches too many other uniquely optimized candidates.", tags: ["ai-written"], salience: "noticeable" },
  { id: "reject-resume-metrics", kind: "reject-reason", text: "Metrics include context that complicates automated comparison.", tags: ["too-perfect", "strong-evidence"], salience: "punchline" },
  { id: "reject-resume-certificates", kind: "reject-reason", text: "Certification breadth is not yet supported by production depth.", tags: ["underqualified"], salience: "neutral" },
  { id: "reject-resume-portfolio", kind: "reject-reason", text: "Portfolio evidence appears optimized for demonstration rather than organizational ambiguity.", tags: ["underqualified", "ai-written"], salience: "noticeable" },

  { id: "reject-job-hopper", kind: "reject-reason", text: "Successful project transitions were classified as insufficient permanence.", tags: ["job-hopper"], salience: "noticeable" },
  { id: "reject-long-tenure", kind: "reject-reason", text: "Long tenure may limit recent onboarding experience.", tags: ["long-tenure"], salience: "punchline" },
  { id: "reject-career-break", kind: "reject-reason", text: "Career timeline includes an interval with no company-assigned title.", tags: ["career-change"], salience: "noticeable" },
  { id: "reject-career-change", kind: "reject-reason", text: "Transferable experience was gained before the approved career narrative began.", tags: ["career-change", "keyword-mismatch"], salience: "noticeable" },
  { id: "reject-founder", kind: "reject-reason", text: "Founder background creates unresolved reporting-line assumptions.", tags: ["career-change", "leadership"], salience: "neutral" },
  { id: "reject-consultant", kind: "reject-reason", text: "Consulting history shows repeated completion followed by departure.", tags: ["job-hopper", "strong-evidence"], salience: "punchline" },

  { id: "reject-ownership-risk", kind: "reject-reason", text: "Demonstrated ownership may create alignment friction.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "reject-mentoring-distraction", kind: "reject-reason", text: "Mentoring activity may reduce directly attributable output.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "reject-documentation-accountability", kind: "reject-reason", text: "Decision documentation could preserve context beyond the intended planning cycle.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "reject-incident-transparency", kind: "reject-reason", text: "Incident transparency may negatively affect perceived reliability metrics.", tags: ["leadership", "strong-evidence"], salience: "punchline" },
  { id: "reject-roadmap-evidence", kind: "reject-reason", text: "Previously used evidence to challenge committed roadmap direction.", tags: ["leadership", "contradictory"], salience: "noticeable" },
  { id: "reject-deletes-code", kind: "reject-reason", text: "Preference for deleting code may reduce visible delivery volume.", tags: ["strong-evidence"], salience: "punchline" },

  { id: "reject-auto-confidence", kind: "reject-reason", text: "Automated confidence remained below the automatically approved threshold.", tags: ["mira-uncertain"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-auto-model-majority", kind: "reject-reason", text: "Two of three models recommended requesting a fourth opinion.", tags: ["mira-uncertain", "contradictory"], stage: [5, 7], salience: "punchline" },
  { id: "reject-auto-summary", kind: "reject-reason", text: "Profile summary omitted evidence later found in the profile.", tags: ["appeal", "contradictory"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-auto-appeal", kind: "reject-reason", text: "Appeal was rejected to preserve confidence in the original automation.", tags: ["appeal"], stage: [4, 7], salience: "punchline" },
  { id: "reject-auto-returning", kind: "reject-reason", text: "Returning application was evaluated using the previous rejection context.", tags: ["returning-candidate"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-auto-rounded", kind: "reject-reason", text: "Match score rounded below the display threshold after normalization.", tags: ["mira-uncertain"], stage: [5, 7], salience: "punchline" },

  { id: "reject-requirement-added", kind: "reject-reason", text: "Candidate does not meet a requirement added after application.", tags: ["requirement-mutated"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-role-expanded", kind: "reject-reason", text: "Original role fit does not cover the responsibilities discovered during screening.", tags: ["requirement-mutated", "contradictory"], stage: [4, 7], salience: "punchline" },
  { id: "reject-location-updated", kind: "reject-reason", text: "Location preference matches the policy that was active when the role was posted.", tags: ["requirement-mutated", "remote-only"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-seniority-updated", kind: "reject-reason", text: "Candidate matches the previous seniority calibration.", tags: ["requirement-mutated"], stage: [4, 7], salience: "noticeable" },
  { id: "reject-budget-updated", kind: "reject-reason", text: "Experience exceeds the budget after compensation optimization.", tags: ["requirement-mutated", "overqualified"], stage: [5, 7], salience: "punchline" },
  { id: "reject-stack-updated", kind: "reject-reason", text: "Technology alignment expired during the hiring process.", tags: ["requirement-mutated", "keyword-mismatch"], stage: [4, 7], salience: "punchline" },

  { id: "reject-success-too-consistent", kind: "reject-reason", text: "Consistent delivery suggests insufficient exposure to recoverable failure.", tags: ["too-perfect", "strong-evidence"], stage: [3, 7], salience: "punchline" },
  { id: "reject-performance-too-fast", kind: "reject-reason", text: "Performance improvements may reduce future optimization opportunities.", tags: ["strong-evidence", "too-perfect"], stage: [3, 7], salience: "punchline" },
  { id: "reject-reliability-low-visibility", kind: "reject-reason", text: "Prevented incidents produced insufficient visible crisis leadership.", tags: ["strong-evidence", "too-perfect"], stage: [3, 7], salience: "punchline" },
  { id: "reject-user-focus", kind: "reject-reason", text: "Strong user focus may conflict with internal stakeholder throughput.", tags: ["strong-evidence", "contradictory"], stage: [3, 7], salience: "punchline" },
  { id: "reject-clear-communication", kind: "reject-reason", text: "Clear communication may reduce demand for alignment infrastructure.", tags: ["strong-evidence", "too-perfect"], stage: [3, 7], salience: "punchline" },
  { id: "reject-good-judgment", kind: "reject-reason", text: "Independent judgment exceeds the role’s planned decision allocation.", tags: ["strong-evidence", "leadership"], stage: [3, 7], salience: "punchline" },
] as const satisfies readonly DecisionFragmentSeed[];

export const candidateDecisionFragments: readonly ContentFragment[] = (decisionFragmentSeeds as readonly DecisionFragmentSeed[]).map(
  ({ text: _text, stage, weight, ...seed }) => ({
    id: seed.id,
    kind: seed.kind,
    textKey: `fragment.${seed.id}`,
    tags: seed.tags,
    stageRange: stage,
    weight: weight ?? 1,
    salience: seed.salience ?? "neutral",
  }),
);

export const candidateDecisionTextEn = Object.fromEntries(
  decisionFragmentSeeds.map((seed) => [`fragment.${seed.id}`, seed.text]),
) as Readonly<Record<string, string>>;

export const candidateDecisionContentCounts = {
  names: candidateNames.length,
  concerns: decisionFragmentSeeds.filter((item) => item.kind === "concern").length,
  rejectionReasons: decisionFragmentSeeds.filter((item) => item.kind === "reject-reason").length,
} as const;
