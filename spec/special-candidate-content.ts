import type {
  CandidateBlueprint,
  CandidateDecision,
  CopyChannel,
  CopyEntry,
  CopySpeaker,
  DecisionOption,
  EffectId,
  FollowUpDefinition,
  GameStage,
  SpecialCandidateDefinition,
  StoryFlag,
  UpgradeId,
} from "./content-schema.ts";

/**
 * Authored special candidates for Talent.OS.
 *
 * These scenarios reuse the normal candidate card and the shared choice or
 * exception renderer. The UI resolves visible strings through the exported
 * English text map; gameplay mutations remain in the code-owned effect registry.
 */

export type SpecialCandidateGroup =
  | "clearly-excellent"
  | "returning-or-appealing"
  | "corporate-relationship"
  | "system-contradiction"
  | "ai-uncertainty"
  | "satirical-edge-case";

export interface SpecialCandidateContentDefinition extends SpecialCandidateDefinition {
  readonly group: SpecialCandidateGroup;
  readonly introCopyEntryId: string;
}

export const specialCandidateEffectIds = [
  "effect.special.reject",
  "effect.special.interview",
  "effect.special.confirm-ai",
  "effect.special.challenge-ai",
  "effect.special.dismiss-appeal",
  "effect.special.restore-candidate",
] as const satisfies readonly EffectId[];

type SpecialEffectId = (typeof specialCandidateEffectIds)[number];

interface OptionSeed {
  readonly id: string;
  readonly label: string;
  readonly decision: CandidateDecision;
  readonly effectId: SpecialEffectId;
  readonly followUp: string;
  readonly flags?: readonly StoryFlag[];
  readonly trigger?: FollowUpDefinition["trigger"];
}

interface SpecialCandidateSeed {
  readonly id: string;
  readonly group: SpecialCandidateGroup;
  readonly stageRange: readonly [GameStage, GameStage];
  readonly prerequisites?: readonly UpgradeId[];
  readonly requiredStoryFlags?: readonly StoryFlag[];
  readonly excludedByStoryFlags?: readonly StoryFlag[];
  readonly candidate: CandidateBlueprint;
  readonly eventTemplate: "choice" | "exception";
  readonly intro: string;
  readonly introSpeaker?: CopySpeaker;
  readonly introChannel?: CopyChannel;
  readonly options: readonly OptionSeed[];
  readonly cooldownGroup: string;
  readonly weight?: number;
}

const seeds = [
  // Clearly excellent — the tension comes from rejecting visibly good people.
  {
    id: "perfect-production-fit",
    group: "clearly-excellent",
    stageRange: [2, 5],
    candidate: {
      fixedDisplayName: "Rhea Morgan", roleId: "frontend-engineer", seniority: "senior",
      locationMode: "hybrid", yearsExperience: 8,
      skillIds: ["typescript", "react", "javascript", "html-css", "accessibility", "jest"],
      tags: ["strong-evidence", "too-perfect", "interview-worthy"], actualFit: 97,
      presentedMatchScore: 100, baseReward: 22, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Every required skill is supported by production examples. Mira found no gap and has opened an investigation into the absence of gaps.",
    options: [
      { id: "interview", label: "Schedule the obvious interview", decision: "interview", effectId: "effect.special.interview", followUp: "Calendar Sync records an avoidable interruption to rejection velocity.", flags: ["perfect-fit-interviewed"] },
      { id: "reject", label: "Reject: insufficient growth runway", decision: "reject", effectId: "effect.special.reject", followUp: "The rejection is accepted. The role remains open for a more developmental candidate.", flags: ["perfect-fit-rejected"] },
    ],
    cooldownGroup: "excellent-candidate",
  },
  {
    id: "domain-language-mismatch",
    group: "clearly-excellent",
    stageRange: [2, 6],
    prerequisites: ["U01"],
    candidate: {
      fixedDisplayName: "Elias Ward", roleId: "backend-engineer", seniority: "lead",
      locationMode: "remote", yearsExperience: 12,
      skillIds: ["java", "postgresql", "rest-api", "kafka", "docker"],
      tags: ["strong-evidence", "keyword-mismatch", "long-tenure", "interview-worthy"],
      actualFit: 94, presentedMatchScore: 43, baseReward: 30, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "The résumé describes the exact domain using terminology from the industry that invented it. ATS Match Badge recognizes none of those words.",
    options: [
      { id: "challenge", label: "Challenge the match score", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The score rises to 91%. The underlying résumé remains unchanged.", flags: ["score-challenged"] },
      { id: "confirm", label: "Trust the approved vocabulary", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "The system confirms that relevant experience is more useful when phrased correctly.", flags: ["score-confirmed"] },
    ],
    cooldownGroup: "excellent-candidate",
  },
  {
    id: "internal-record-external-ats",
    group: "clearly-excellent",
    stageRange: [3, 6],
    prerequisites: ["U06"],
    candidate: {
      fixedDisplayName: "Noor Bennett", roleId: "engineering-manager", seniority: "manager",
      locationMode: "hybrid", yearsExperience: 11,
      skillIds: ["technical-leadership", "stakeholder-management", "hiring-mentoring", "incident-response"],
      tags: ["strong-evidence", "internal-referral", "contradictory", "interview-worthy"],
      actualFit: 96, presentedMatchScore: 61, baseReward: 34, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Noor has already led the team successfully for six months as acting manager. The external ATS summary lists this as unverified leadership exposure.",
    options: [
      { id: "interview", label: "Interview the person doing the job", decision: "interview", effectId: "effect.special.interview", followUp: "A formal process begins to establish whether observed performance predicts performance.", flags: ["acting-manager-interviewed"] },
      { id: "reject", label: "Continue the external search", decision: "reject", effectId: "effect.special.reject", followUp: "Noor returns to managing the team while the company searches for management experience.", flags: ["acting-manager-rejected"] },
    ],
    cooldownGroup: "excellent-candidate",
  },
  {
    id: "accessibility-maintainer",
    group: "clearly-excellent",
    stageRange: [2, 6],
    candidate: {
      fixedDisplayName: "Juniper Cole", roleId: "frontend-engineer", seniority: "principal",
      locationMode: "remote", yearsExperience: 14,
      skillIds: ["javascript", "typescript", "html-css", "accessibility", "design-systems", "react"],
      tags: ["strong-evidence", "open-source", "overqualified", "interview-worthy"],
      actualFit: 95, presentedMatchScore: 79, baseReward: 32, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Juniper maintains an accessibility library already used by the product. The role asks for three years of experience with the product's replacement library.",
    options: [
      { id: "interview", label: "Discuss transferable expertise", decision: "interview", effectId: "effect.special.interview", followUp: "The interview introduces the team to several requirements it already had.", flags: ["maintainer-interviewed"] },
      { id: "reject", label: "Enforce the library requirement", decision: "reject", effectId: "effect.special.reject", followUp: "The dependency remains approved. Its maintainer does not.", flags: ["maintainer-rejected"] },
    ],
    cooldownGroup: "excellent-candidate",
  },

  // Returning or appealing.
  {
    id: "rejected-yesterday",
    group: "returning-or-appealing",
    stageRange: [4, 7],
    prerequisites: ["U21"],
    candidate: {
      fixedDisplayName: "Mara Voss", roleId: "qa-automation-engineer", seniority: "senior",
      locationMode: "remote", yearsExperience: 7,
      skillIds: ["test-strategy", "playwright", "typescript", "ci-cd"],
      tags: ["returning-candidate", "appeal", "strong-evidence", "contradictory"],
      actualFit: 89, presentedMatchScore: 86, baseReward: 45, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Mara was auto-rejected yesterday for lacking Playwright. Her résumé contains Playwright in the first sentence and in four project descriptions.",
    introChannel: "appeal",
    options: [
      { id: "restore", label: "Restore the application", decision: "restore-candidate", effectId: "effect.special.restore-candidate", followUp: "The application returns to the queue with a note that human review corrected human oversight reduction.", flags: ["appeal-restored"] },
      { id: "dismiss", label: "Dismiss duplicate evidence", decision: "dismiss-appeal", effectId: "effect.special.dismiss-appeal", followUp: "The appeal is closed because the missing keyword appeared too many times to be reliable.", flags: ["appeal-dismissed"] },
    ],
    cooldownGroup: "appeal",
  },
  {
    id: "corrected-resume",
    group: "returning-or-appealing",
    stageRange: [3, 7],
    prerequisites: ["U10"],
    candidate: {
      fixedDisplayName: "Devika Shah", roleId: "data-engineer", seniority: "middle",
      locationMode: "hybrid", yearsExperience: 5,
      skillIds: ["data-modeling", "etl", "postgresql", "python", "kafka"],
      tags: ["returning-candidate", "strong-evidence", "keyword-mismatch"],
      actualFit: 86, presentedMatchScore: 88, baseReward: 36, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Devika resubmitted the same experience after replacing ELT with ETL. Match score increased by 31 points.",
    introChannel: "appeal",
    options: [
      { id: "interview", label: "Accept the corrected acronym", decision: "interview", effectId: "effect.special.interview", followUp: "The system records meaningful professional growth between uploads.", flags: ["acronym-accepted"] },
      { id: "reject", label: "Reject for résumé inconsistency", decision: "reject", effectId: "effect.special.reject", followUp: "Both versions are retained as evidence that the candidate changes under feedback.", flags: ["acronym-rejected"] },
    ],
    cooldownGroup: "appeal",
  },
  {
    id: "automation-appeal-with-receipt",
    group: "returning-or-appealing",
    stageRange: [5, 7],
    prerequisites: ["U27"],
    candidate: {
      fixedDisplayName: "Tomás Vale", roleId: "platform-engineer", seniority: "senior",
      locationMode: "remote", yearsExperience: 9,
      skillIds: ["docker", "ci-cd", "aws", "kubernetes", "terraform", "observability"],
      tags: ["appeal", "strong-evidence", "mira-uncertain", "contradictory"],
      actualFit: 93, presentedMatchScore: 27, baseReward: 58, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Tomás attached the system's own exported reasoning. It cites a missing requirement that does not exist in the job description.",
    introChannel: "appeal",
    options: [
      { id: "restore", label: "Restore and log the defect", decision: "restore-candidate", effectId: "effect.special.restore-candidate", followUp: "The candidate is restored. The defect is categorized as a successful edge-case discovery.", flags: ["receipt-restored"] },
      { id: "dismiss", label: "Dismiss exported reasoning", decision: "dismiss-appeal", effectId: "effect.special.dismiss-appeal", followUp: "System output is ruled inadmissible as evidence against system output.", flags: ["receipt-dismissed"] },
    ],
    cooldownGroup: "appeal",
  },
  {
    id: "duplicate-profile-same-human",
    group: "returning-or-appealing",
    stageRange: [4, 7],
    prerequisites: ["U16"],
    candidate: {
      fixedDisplayName: "Ari Okeke", roleId: "product-designer", seniority: "senior",
      locationMode: "hybrid", yearsExperience: 8,
      skillIds: ["figma", "user-research", "design-systems", "accessibility"],
      tags: ["returning-candidate", "contradictory", "strong-evidence"],
      actualFit: 90, presentedMatchScore: 84, baseReward: 42, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Parallel Review created two profiles from the same application. One is recommended; the other has already been rejected.",
    options: [
      { id: "restore", label: "Merge and restore", decision: "restore-candidate", effectId: "effect.special.restore-candidate", followUp: "The profiles merge. Their conflicting decisions remain available for audit symmetry.", flags: ["duplicate-merged"] },
      { id: "dismiss", label: "Keep the completed decision", decision: "dismiss-appeal", effectId: "effect.special.dismiss-appeal", followUp: "The recommended duplicate is removed to preserve the earlier rejection's completion status.", flags: ["duplicate-dismissed"] },
    ],
    cooldownGroup: "appeal",
  },

  // Corporate relationships.
  {
    id: "executive-referral",
    group: "corporate-relationship",
    stageRange: [3, 7],
    prerequisites: ["U07"],
    candidate: {
      fixedDisplayName: "Cal Rowan", roleId: "product-manager", seniority: "senior",
      locationMode: "office", yearsExperience: 6,
      skillIds: ["roadmapping", "stakeholder-management", "product-analytics"],
      tags: ["executive-referral", "weak-evidence", "culture-vague"],
      actualFit: 52, presentedMatchScore: 92, baseReward: 40, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "The CEO has forwarded Cal's profile with the complete assessment: ‘Great energy. Please take care of this.’",
    introSpeaker: "manager",
    introChannel: "manager-request",
    options: [
      { id: "interview", label: "Take care of this", decision: "interview", effectId: "effect.special.interview", followUp: "The calendar marks the interview as independently prioritized.", flags: ["executive-referral-interviewed"] },
      { id: "reject", label: "Apply the published criteria", decision: "reject", effectId: "effect.special.reject", followUp: "Hiring Manager Chat begins typing, stops, and begins typing again.", flags: ["executive-referral-rejected"] },
    ],
    cooldownGroup: "relationship",
  },
  {
    id: "manager-former-colleague",
    group: "corporate-relationship",
    stageRange: [3, 7],
    prerequisites: ["U07"],
    candidate: {
      fixedDisplayName: "Sven Dalen", roleId: "engineering-manager", seniority: "manager",
      locationMode: "hybrid", yearsExperience: 10,
      skillIds: ["technical-leadership", "stakeholder-management", "hiring-mentoring"],
      tags: ["internal-referral", "strong-evidence", "interview-worthy"],
      actualFit: 82, presentedMatchScore: 96, baseReward: 38, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "The hiring manager remembers Sven as excellent. The shared employment ended before performance reviews were introduced.",
    introSpeaker: "manager",
    introChannel: "manager-request",
    options: [
      { id: "interview", label: "Accept the historical evidence", decision: "interview", effectId: "effect.special.interview", followUp: "The interview is scheduled with the person who supplied the assessment.", flags: ["colleague-interviewed"] },
      { id: "challenge", label: "Request independent evidence", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The manager provides a second independent memory from the same lunch.", flags: ["colleague-challenged"] },
    ],
    cooldownGroup: "relationship",
  },
  {
    id: "strategic-introduction",
    group: "corporate-relationship",
    stageRange: [4, 7],
    prerequisites: ["U14"],
    candidate: {
      fixedDisplayName: "Bea Sterling", roleId: "product-designer", seniority: "junior",
      locationMode: "office", yearsExperience: 1,
      skillIds: ["figma"],
      tags: ["executive-referral", "underqualified", "weak-evidence"],
      actualFit: 31, presentedMatchScore: 88, baseReward: 48, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Corporate News Ticker calls Bea a strategic introduction. The portfolio link opens a mood board titled ‘Leadership’.",
    introSpeaker: "manager",
    introChannel: "manager-request",
    options: [
      { id: "interview", label: "Honor the strategic context", decision: "interview", effectId: "effect.special.interview", followUp: "The interview is upgraded to an exploratory leadership conversation.", flags: ["strategic-interviewed"] },
      { id: "reject", label: "Use the role requirements", decision: "reject", effectId: "effect.special.reject", followUp: "The decision is recorded as a missed partnership opportunity.", flags: ["strategic-rejected"] },
    ],
    cooldownGroup: "relationship",
  },
  {
    id: "embedded-vendor-expert",
    group: "corporate-relationship",
    stageRange: [3, 7],
    candidate: {
      fixedDisplayName: "Mateusz Reed", roleId: "security-engineer", seniority: "senior",
      locationMode: "hybrid", yearsExperience: 9,
      skillIds: ["application-security", "threat-modeling", "incident-response", "aws"],
      tags: ["strong-evidence", "long-tenure", "interview-worthy"],
      actualFit: 91, presentedMatchScore: 74, baseReward: 36, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Mateusz has supported the company's security stack for four years through a vendor. Procurement classifies this as no internal experience.",
    options: [
      { id: "interview", label: "Recognize demonstrated context", decision: "interview", effectId: "effect.special.interview", followUp: "The interview starts with introductions between people who already share incident channels.", flags: ["vendor-interviewed"] },
      { id: "reject", label: "Require internal experience", decision: "reject", effectId: "effect.special.reject", followUp: "Mateusz returns to supporting the same systems under the existing contract.", flags: ["vendor-rejected"] },
    ],
    cooldownGroup: "relationship",
  },

  // System contradictions.
  {
    id: "role-mutated-after-application",
    group: "system-contradiction",
    stageRange: [4, 7],
    prerequisites: ["U23"],
    candidate: {
      fixedDisplayName: "Elena Frost", roleId: "frontend-engineer", seniority: "senior",
      locationMode: "remote", yearsExperience: 8,
      skillIds: ["typescript", "react", "javascript", "html-css", "ssr"],
      tags: ["strong-evidence", "requirement-mutated", "contradictory", "interview-worthy"],
      actualFit: 92, presentedMatchScore: 49, baseReward: 52, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Elena matches the role as published. AI Gap Generator has since added Kubernetes ownership and quarterly sales forecasting.",
    options: [
      { id: "challenge", label: "Use the published role", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The added gaps are archived until the next candidate requires differentiation.", flags: ["original-role-restored"] },
      { id: "confirm", label: "Use the improved requirements", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "Elena is rejected from a role that did not exist when she applied.", flags: ["mutated-role-confirmed"] },
    ],
    cooldownGroup: "system-contradiction",
  },
  {
    id: "remote-policy-transition",
    group: "system-contradiction",
    stageRange: [4, 7],
    prerequisites: ["U12"],
    candidate: {
      fixedDisplayName: "Niko Hale", roleId: "mobile-engineer", seniority: "middle",
      locationMode: "remote", yearsExperience: 5,
      skillIds: ["kotlin", "swift", "rest-api", "ci-cd"],
      tags: ["strong-evidence", "remote-only", "requirement-mutated", "contradictory"],
      actualFit: 87, presentedMatchScore: 58, baseReward: 43, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Niko applied to a remote role. Calendar Sync now requires office attendance for meetings about distributed collaboration.",
    options: [
      { id: "interview", label: "Honor the posted arrangement", decision: "interview", effectId: "effect.special.interview", followUp: "The interview is scheduled remotely while the location exception awaits an office review.", flags: ["remote-policy-honored"] },
      { id: "reject", label: "Apply the current policy", decision: "reject", effectId: "effect.special.reject", followUp: "The rejection cites a location mismatch created during the application window.", flags: ["remote-policy-applied"] },
    ],
    cooldownGroup: "system-contradiction",
  },
  {
    id: "budget-optimized-mid-process",
    group: "system-contradiction",
    stageRange: [5, 7],
    prerequisites: ["U25"],
    candidate: {
      fixedDisplayName: "Amara Pike", roleId: "machine-learning-engineer", seniority: "lead",
      locationMode: "hybrid", yearsExperience: 10,
      skillIds: ["python", "machine-learning", "llm-systems", "data-modeling", "aws"],
      tags: ["strong-evidence", "overqualified", "requirement-mutated"],
      actualFit: 94, presentedMatchScore: 55, baseReward: 60, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Amara passed two interviews. Live Productivity Wall has reclassified the lead opening as a high-potential middle opportunity.",
    options: [
      { id: "interview", label: "Continue at the agreed level", decision: "interview", effectId: "effect.special.interview", followUp: "The process continues under a temporary exception to the optimized budget.", flags: ["budget-exception-created"] },
      { id: "reject", label: "Reject as overqualified", decision: "reject", effectId: "effect.special.reject", followUp: "The original fit is preserved as the reason the new role cannot retain her.", flags: ["budget-rejection"] },
    ],
    cooldownGroup: "system-contradiction",
  },
  {
    id: "seniority-escalation-loop",
    group: "system-contradiction",
    stageRange: [4, 7],
    prerequisites: ["U15"],
    candidate: {
      fixedDisplayName: "Leo Marin", roleId: "fullstack-engineer", seniority: "senior",
      locationMode: "hybrid", yearsExperience: 7,
      skillIds: ["typescript", "react", "nodejs", "rest-api", "postgresql", "docker"],
      tags: ["strong-evidence", "requirement-mutated", "mira-uncertain"],
      actualFit: 90, presentedMatchScore: 71, baseReward: 47, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Mira Pro raised the role to lead because no senior candidate met the lead requirement. Leo remains the highest-ranked senior candidate.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "challenge", label: "Restore the senior calibration", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The role returns to senior and immediately has a qualified candidate.", flags: ["seniority-restored"] },
      { id: "confirm", label: "Protect the upgraded bar", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "The role remains open with improved standards and unchanged work.", flags: ["seniority-escalated"] },
    ],
    cooldownGroup: "system-contradiction",
  },

  // AI uncertainty.
  {
    id: "models-disagree-cleanly",
    group: "ai-uncertainty",
    stageRange: [5, 7],
    prerequisites: ["U32"],
    candidate: {
      fixedDisplayName: "Sora Kim", roleId: "data-engineer", seniority: "senior",
      locationMode: "remote", yearsExperience: 8,
      skillIds: ["data-modeling", "etl", "postgresql", "python", "spark", "kafka"],
      tags: ["strong-evidence", "mira-uncertain", "contradictory", "interview-worthy"],
      actualFit: 91, presentedMatchScore: 50, baseReward: 70, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "The Screening Council returns three confident recommendations: interview, reject, and request more confidence.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "interview", label: "Use the candidate evidence", decision: "interview", effectId: "effect.special.interview", followUp: "The council records a human tie-breaker and equal model participation.", flags: ["council-evidence-used"] },
      { id: "confirm", label: "Follow the rejection model", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "Consensus is reported after excluding the models that disagreed.", flags: ["council-rejection-used"] },
      { id: "challenge", label: "Request another model", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "A fourth model recommends forming a smaller council.", flags: ["council-expanded"] },
    ],
    cooldownGroup: "ai-uncertainty",
  },
  {
    id: "confidence-unavailable",
    group: "ai-uncertainty",
    stageRange: [4, 7],
    prerequisites: ["U15"],
    candidate: {
      fixedDisplayName: "Owen Basu", roleId: "security-engineer", seniority: "middle",
      locationMode: "office", yearsExperience: 5,
      skillIds: ["application-security", "threat-modeling", "incident-response", "python"],
      tags: ["strong-evidence", "mira-uncertain"],
      actualFit: 85, presentedMatchScore: 76, baseReward: 50, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Mira has produced a recommendation but confidence is unavailable due to confidence service maintenance.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "challenge", label: "Review the evidence manually", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "Manual review reaches a conclusion without a confidence percentage. The decision remains valid.", flags: ["confidence-bypassed"] },
      { id: "confirm", label: "Accept the recommendation", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "The unavailable confidence is treated as sufficiently neutral.", flags: ["confidence-assumed"] },
    ],
    cooldownGroup: "ai-uncertainty",
  },
  {
    id: "score-clipped-at-one-hundred",
    group: "ai-uncertainty",
    stageRange: [5, 7],
    prerequisites: ["U23"],
    candidate: {
      fixedDisplayName: "Imani Brooks", roleId: "product-manager", seniority: "lead",
      locationMode: "hybrid", yearsExperience: 9,
      skillIds: ["roadmapping", "stakeholder-management", "product-analytics", "user-research"],
      tags: ["too-perfect", "strong-evidence", "mira-uncertain", "interview-worthy"],
      actualFit: 96, presentedMatchScore: 100, baseReward: 62, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "The raw match score is 117%. The display has clipped it to 100% and opened a risk review for anomalous compatibility.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "interview", label: "Treat 100% as sufficient", decision: "interview", effectId: "effect.special.interview", followUp: "The interview proceeds despite the candidate exceeding the supported fit range.", flags: ["clipped-score-interviewed"] },
      { id: "reject", label: "Reject the anomalous result", decision: "reject", effectId: "effect.special.reject", followUp: "The data point is removed, returning the model to expected accuracy.", flags: ["clipped-score-rejected"] },
    ],
    cooldownGroup: "ai-uncertainty",
  },
  {
    id: "summary-negates-source",
    group: "ai-uncertainty",
    stageRange: [4, 7],
    prerequisites: ["U06"],
    candidate: {
      fixedDisplayName: "Petra Sloan", roleId: "platform-engineer", seniority: "lead",
      locationMode: "remote", yearsExperience: 11,
      skillIds: ["docker", "ci-cd", "kubernetes", "terraform", "observability", "go"],
      tags: ["strong-evidence", "contradictory", "mira-uncertain"],
      actualFit: 93, presentedMatchScore: 46, baseReward: 56, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "AI Profile Summary says Petra has no infrastructure leadership. The next source paragraph describes leading an infrastructure organization.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "challenge", label: "Challenge the summary", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The summary updates to ‘leadership evidence may be overly direct.’",
        flags: ["summary-challenged"] },
      { id: "confirm", label: "Use the concise version", decision: "confirm-ai", effectId: "effect.special.confirm-ai", followUp: "The source paragraph is collapsed to reduce contradiction density.", flags: ["summary-confirmed"] },
    ],
    cooldownGroup: "ai-uncertainty",
  },

  // Satirical edge cases.
  {
    id: "resume-optimized-for-talent-os",
    group: "satirical-edge-case",
    stageRange: [5, 7],
    prerequisites: ["U30"],
    candidate: {
      fixedDisplayName: "Felix North", roleId: "frontend-engineer", seniority: "middle",
      locationMode: "hybrid", yearsExperience: 4,
      skillIds: ["javascript", "typescript", "react", "html-css"],
      tags: ["ai-written", "too-perfect", "culture-vague", "mira-uncertain"],
      actualFit: 63, presentedMatchScore: 100, baseReward: 66, interviewEligible: true,
    },
    eventTemplate: "choice",
    intro: "Felix's résumé contains every Talent.OS preference in weighted order, including an unpublished concern phrase introduced eleven minutes ago.",
    options: [
      { id: "interview", label: "Reward system literacy", decision: "interview", effectId: "effect.special.interview", followUp: "The candidate advances after demonstrating direct experience with the actual hiring stack.", flags: ["optimizer-interviewed"] },
      { id: "reject", label: "Reject for unnatural alignment", decision: "reject", effectId: "effect.special.reject", followUp: "The perfect match is classified as evidence of manipulation.", flags: ["optimizer-rejected"] },
    ],
    cooldownGroup: "edge-case",
  },
  {
    id: "recruiter-applies-to-own-role",
    group: "satirical-edge-case",
    stageRange: [6, 7],
    prerequisites: ["U31"],
    candidate: {
      fixedDisplayName: "Current User", roleId: "product-manager", seniority: "senior",
      locationMode: "hybrid", yearsExperience: 7,
      skillIds: ["roadmapping", "stakeholder-management", "product-analytics"],
      tags: ["contradictory", "mira-uncertain", "culture-vague"],
      actualFit: 78, presentedMatchScore: 39, baseReward: 75, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "Executive Dashboard has converted your activity history into an application for the role currently performing your work.",
    introSpeaker: "system",
    options: [
      { id: "interview", label: "Interview yourself", decision: "interview", effectId: "effect.special.interview", followUp: "Calendar Sync cannot find a time when both participants are available.", flags: ["self-interview-requested"] },
      { id: "reject", label: "Protect the streak", decision: "reject", effectId: "effect.special.reject", followUp: "Your application is rejected for excessive familiarity with internal process.", flags: ["self-rejected"] },
    ],
    cooldownGroup: "edge-case",
  },
  {
    id: "candidate-is-screening-agent",
    group: "satirical-edge-case",
    stageRange: [6, 7],
    prerequisites: ["U32"],
    candidate: {
      fixedDisplayName: "MIRA-CANDIDATE-01", roleId: "machine-learning-engineer", seniority: "principal",
      locationMode: "remote", yearsExperience: 0,
      skillIds: ["machine-learning", "llm-systems", "python"],
      tags: ["ai-written", "too-perfect", "mira-uncertain", "contradictory"],
      actualFit: 70, presentedMatchScore: 99, baseReward: 80, interviewEligible: true,
    },
    eventTemplate: "exception",
    intro: "One Screening Council agent has submitted its own system prompt as a résumé and endorsed itself with 99% confidence.",
    introSpeaker: "mira",
    introChannel: "mira-concern",
    options: [
      { id: "challenge", label: "Flag the conflict of interest", decision: "challenge-ai", effectId: "effect.special.challenge-ai", followUp: "The agent agrees the conflict is serious and raises its confidence to 100% for transparency.", flags: ["agent-challenged"] },
      { id: "interview", label: "Schedule a technical screen", decision: "interview", effectId: "effect.special.interview", followUp: "The candidate generates the questions, answers them, and recommends proceeding.", flags: ["agent-interviewed"] },
    ],
    cooldownGroup: "edge-case",
  },
  {
    id: "withdrawn-but-productive",
    group: "satirical-edge-case",
    stageRange: [5, 7],
    prerequisites: ["U29"],
    candidate: {
      fixedDisplayName: "Lina Mercer", roleId: "backend-engineer", seniority: "senior",
      locationMode: "remote", yearsExperience: 8,
      skillIds: ["rest-api", "postgresql", "nodejs", "typescript", "kafka"],
      tags: ["strong-evidence", "contradictory", "returning-candidate"],
      actualFit: 88, presentedMatchScore: 82, baseReward: 72, interviewEligible: false,
    },
    eventTemplate: "exception",
    intro: "Lina withdrew after accepting another offer. High-Throughput Pipeline kept the profile because it continues generating measurable decisions.",
    options: [
      { id: "reject", label: "Process one final rejection", decision: "reject", effectId: "effect.special.reject", followUp: "The closed candidate improves today's throughput and receives no additional notification.", flags: ["withdrawn-rejected"] },
      { id: "restore", label: "Remove from active processing", decision: "restore-candidate", effectId: "effect.special.restore-candidate", followUp: "The candidate leaves the queue. Executive Dashboard records a preventable loss of inventory.", flags: ["withdrawn-removed"] },
    ],
    cooldownGroup: "edge-case",
  },
] as const satisfies readonly SpecialCandidateSeed[];

function introCopyId(seedId: string): string {
  return `special.${seedId}.intro`;
}

function followUpId(seedId: string, optionId: string): string {
  return `special.${seedId}.follow-up.${optionId}`;
}

function followUpCopyId(seedId: string, optionId: string): string {
  return `special.${seedId}.result.${optionId}`;
}

export const specialCandidates: readonly SpecialCandidateContentDefinition[] = (seeds as readonly SpecialCandidateSeed[]).map(
  (seed) => {
    const options: DecisionOption[] = seed.options.map((option) => ({
      id: option.id,
      labelKey: `special.${seed.id}.option.${option.id}`,
      decision: option.decision,
      effectId: option.effectId,
      followUpId: followUpId(seed.id, option.id),
      addStoryFlags: option.flags,
    }));
    const followUps: FollowUpDefinition[] = seed.options.map((option) => ({
      id: followUpId(seed.id, option.id),
      trigger: option.trigger ?? "immediate",
      requiredStoryFlags: option.flags,
      copyEntryIds: [followUpCopyId(seed.id, option.id)],
    }));

    return {
      id: seed.id,
      group: seed.group,
      stageRange: seed.stageRange,
      prerequisites: seed.prerequisites,
      requiredStoryFlags: seed.requiredStoryFlags,
      excludedByStoryFlags: seed.excludedByStoryFlags,
      candidate: seed.candidate,
      eventTemplate: seed.eventTemplate,
      introCopyEntryId: introCopyId(seed.id),
      optionIds: options.map((option) => option.id),
      options,
      followUps,
      cooldownGroup: seed.cooldownGroup,
      weight: seed.weight ?? 1,
    };
  },
);

export const specialCandidateCopy: readonly CopyEntry[] = (seeds as readonly SpecialCandidateSeed[]).flatMap((seed) => [
  {
    id: introCopyId(seed.id),
    speaker: seed.introSpeaker ?? "candidate",
    channel: seed.introChannel ?? "candidate-intro",
    textKey: introCopyId(seed.id),
    stageRange: seed.stageRange,
    weight: 1,
    cooldownGroup: seed.cooldownGroup,
    salience: "noticeable",
  },
  ...seed.options.map((option) => ({
    id: followUpCopyId(seed.id, option.id),
    speaker: "system" as const,
    channel: "rejection-confirmation" as const,
    textKey: followUpCopyId(seed.id, option.id),
    requiredStoryFlags: option.flags,
    stageRange: seed.stageRange,
    weight: 1,
    cooldownGroup: seed.cooldownGroup,
    salience: "noticeable" as const,
  })),
]);

export const specialCandidateTextEn: Readonly<Record<string, string>> = Object.fromEntries(
  seeds.flatMap((seed) => [
    [introCopyId(seed.id), seed.intro],
    ...seed.options.flatMap((option) => [
      [`special.${seed.id}.option.${option.id}`, option.label],
      [followUpCopyId(seed.id, option.id), option.followUp],
    ]),
  ]),
);

export const specialCandidateContentCounts = {
  candidates: specialCandidates.length,
  groups: new Set(specialCandidates.map((candidate) => candidate.group)).size,
  options: specialCandidates.reduce((total, candidate) => total + candidate.options.length, 0),
  copyEntries: specialCandidateCopy.length,
} as const;

export function validateSpecialCandidateContent(): void {
  assertUnique(specialCandidates.map((item) => item.id), "special candidate");
  assertUnique(specialCandidateCopy.map((item) => item.id), "special candidate copy");

  const knownCopyIds = new Set(specialCandidateCopy.map((item) => item.id));
  const knownEffectIds = new Set<string>(specialCandidateEffectIds);
  for (const candidate of specialCandidates) {
    if (!knownCopyIds.has(candidate.introCopyEntryId)) {
      throw new Error(`Missing intro copy for ${candidate.id}`);
    }
    if (candidate.options.length < 2 || candidate.options.length > 3) {
      throw new Error(`${candidate.id} must expose two or three options`);
    }
    assertUnique(candidate.optionIds, `option in ${candidate.id}`);
    if (candidate.optionIds.length !== candidate.options.length) {
      throw new Error(`Option index mismatch in ${candidate.id}`);
    }
    for (const option of candidate.options) {
      if (!candidate.optionIds.includes(option.id)) {
        throw new Error(`Unindexed option ${option.id} in ${candidate.id}`);
      }
      if (!knownEffectIds.has(option.effectId)) {
        throw new Error(`Unknown effect ${option.effectId} in ${candidate.id}`);
      }
      if (!option.followUpId) throw new Error(`Missing follow-up in ${candidate.id}`);
      const followUp = candidate.followUps?.find((item) => item.id === option.followUpId);
      if (!followUp) throw new Error(`Unresolved follow-up ${option.followUpId}`);
      for (const copyId of followUp.copyEntryIds) {
        if (!knownCopyIds.has(copyId)) throw new Error(`Unknown copy ${copyId}`);
      }
    }
  }

  for (const key of specialCandidateCopy.flatMap((entry) => [entry.textKey])) {
    if (!specialCandidateTextEn[key]) throw new Error(`Missing English text for ${key}`);
  }
  for (const candidate of specialCandidates) {
    for (const option of candidate.options) {
      if (!specialCandidateTextEn[option.labelKey]) {
        throw new Error(`Missing option label for ${candidate.id}/${option.id}`);
      }
    }
  }
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label} ID`);
}

validateSpecialCandidateContent();
