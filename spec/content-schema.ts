/**
 * Talent.OS content contract.
 *
 * This file is deliberately dependency-free. It defines the stable shape of
 * authored JSON content without choosing a UI framework, state library, schema
 * validator, or persistence layer.
 *
 * Runtime validation must be generated or implemented against these types
 * before untrusted JSON reaches the game.
 */

export const CONTENT_CONTRACT_VERSION = 1 as const;

export type ContentContractVersion = typeof CONTENT_CONTRACT_VERSION;

export type CandidateId = string;
export type SessionIdentityId = string;
export type RoleId = string;
export type ArchetypeId = string;
export type FragmentId = string;
export type SpecialCandidateId = string;
export type CopyEntryId = string;
export type UpgradeId = string;
export type StoryFlag = string;
export type EffectId = string;
export type TextKey = string;
export type CooldownGroup = string;

export type GameStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StageRange = readonly [minimum: GameStage, maximum: GameStage];

export type Seniority =
  | "intern"
  | "junior"
  | "middle"
  | "senior"
  | "lead"
  | "principal"
  | "manager"
  | "head";

export type LocationMode = "remote" | "hybrid" | "office";

export type CandidateSource = "routine" | "special" | "returning";

export type CandidateTag =
  | "strong-evidence"
  | "weak-evidence"
  | "keyword-mismatch"
  | "leadership"
  | "job-hopper"
  | "long-tenure"
  | "ai-written"
  | "open-source"
  | "overqualified"
  | "underqualified"
  | "culture-vague"
  | "remote-only"
  | "office-only"
  | "legacy-stack"
  | "adjacent-stack"
  | "career-change"
  | "internal-referral"
  | "executive-referral"
  | "returning-candidate"
  | "appeal"
  | "too-perfect"
  | "contradictory"
  | "interview-worthy"
  | "mira-uncertain"
  | "requirement-mutated";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "data"
  | "devops"
  | "qa"
  | "security"
  | "product"
  | "design"
  | "management"
  | "domain";

export interface SkillDefinition {
  readonly id: string;
  readonly labelKey: TextKey;
  readonly category: SkillCategory;
  readonly aliases?: readonly string[];
  readonly tags?: readonly CandidateTag[];
}

export interface RoleDefinition {
  readonly id: RoleId;
  readonly titleKey: TextKey;
  readonly allowedSeniorities: readonly Seniority[];
  readonly coreSkillIds: readonly string[];
  readonly optionalSkillIds?: readonly string[];
  readonly compatibleArchetypeIds?: readonly ArchetypeId[];
  readonly weight: number;
}

export interface CandidateNameEntry {
  readonly id: string;
  readonly displayName: string;
  readonly pronouns?: string;
  readonly weight: number;
}

export type FragmentKind =
  | "headline"
  | "experience"
  | "achievement"
  | "human-detail"
  | "concern"
  | "reject-reason";

export interface ContentFragment {
  readonly id: FragmentId;
  readonly kind: FragmentKind;
  readonly textKey: TextKey;
  readonly tags: readonly CandidateTag[];
  readonly compatibleRoleIds?: readonly RoleId[];
  readonly compatibleSeniorities?: readonly Seniority[];
  readonly requiredTags?: readonly CandidateTag[];
  readonly incompatibleTags?: readonly CandidateTag[];
  readonly stageRange?: StageRange;
  readonly weight: number;
  /** High-salience fragments receive a longer repetition cooldown. */
  readonly salience?: "neutral" | "noticeable" | "punchline";
}

export interface NumericRange {
  readonly minimum: number;
  readonly maximum: number;
}

export interface CandidateArchetype {
  readonly id: ArchetypeId;
  readonly labelKey: TextKey;
  readonly family:
    | "clearly-qualified"
    | "almost-qualified"
    | "keyword-mismatch"
    | "career-ambiguity"
    | "overqualified"
    | "polished-underqualified"
    | "nontraditional-strength"
    | "corporate-familiar";
  readonly stageRange: StageRange;
  readonly compatibleRoleIds: readonly RoleId[];
  readonly compatibleSeniorities: readonly Seniority[];
  readonly yearsExperience: NumericRange;
  readonly actualFit: NumericRange;
  readonly baseReward: NumericRange;
  readonly requiredTags: readonly CandidateTag[];
  readonly optionalTags?: readonly CandidateTag[];
  readonly incompatibleTags?: readonly CandidateTag[];
  readonly preferredFragmentTags?: readonly CandidateTag[];
  readonly interviewEligibility: "never" | "allowed" | "preferred";
  readonly weight: number;
}

/**
 * A blueprint is authored content used by scripted or returning candidates.
 * Omitted display fields may still be composed from the normal fragment pools.
 */
export interface CandidateBlueprint {
  readonly nameEntryId?: string;
  readonly fixedDisplayName?: string;
  readonly pronouns?: string;
  readonly roleId: RoleId;
  readonly seniority: Seniority;
  readonly locationMode: LocationMode;
  readonly yearsExperience: number;
  readonly headlineFragmentId?: FragmentId;
  readonly experienceFragmentIds?: readonly FragmentId[];
  readonly achievementFragmentIds?: readonly FragmentId[];
  readonly humanDetailFragmentId?: FragmentId;
  readonly skillIds: readonly string[];
  readonly tags: readonly CandidateTag[];
  readonly actualFit: number;
  readonly presentedMatchScore?: number;
  readonly baseReward: number;
  readonly interviewEligible: boolean;
}

export type CandidateDecision =
  | "reject"
  | "interview"
  | "confirm-ai"
  | "challenge-ai"
  | "dismiss-appeal"
  | "restore-candidate";

export type EventTemplate = "choice" | "interrupt" | "sprint" | "exception";

export interface DecisionOption {
  readonly id: string;
  readonly labelKey: TextKey;
  readonly decision: CandidateDecision;
  /** References a code-owned, validated gameplay effect. */
  readonly effectId: EffectId;
  readonly followUpId?: string;
  readonly addStoryFlags?: readonly StoryFlag[];
}

export interface FollowUpDefinition {
  readonly id: string;
  readonly trigger:
    | "immediate"
    | "next-candidate"
    | "after-upgrade"
    | "after-automation"
    | "late-game";
  readonly requiredStoryFlags?: readonly StoryFlag[];
  readonly copyEntryIds: readonly CopyEntryId[];
  readonly returningCandidateBlueprint?: CandidateBlueprint;
}

export interface SpecialCandidateDefinition {
  readonly id: SpecialCandidateId;
  readonly stageRange: StageRange;
  readonly prerequisites?: readonly UpgradeId[];
  readonly requiredStoryFlags?: readonly StoryFlag[];
  readonly excludedByStoryFlags?: readonly StoryFlag[];
  readonly candidate: CandidateBlueprint;
  readonly eventTemplate: "choice" | "exception";
  readonly optionIds: readonly string[];
  readonly options: readonly DecisionOption[];
  readonly followUps?: readonly FollowUpDefinition[];
  readonly cooldownGroup?: CooldownGroup;
  readonly weight: number;
}

/** The normalized candidate instance rendered by the game. */
export interface Candidate {
  readonly id: CandidateId;
  readonly sessionIdentityId: SessionIdentityId;
  readonly source: CandidateSource;
  readonly archetypeId?: ArchetypeId;
  readonly specialCandidateId?: SpecialCandidateId;
  readonly name: string;
  readonly pronouns?: string;
  readonly roleId: RoleId;
  readonly seniority: Seniority;
  readonly locationMode: LocationMode;
  readonly yearsExperience: number;
  readonly headlineFragmentId: FragmentId;
  readonly experienceFragmentIds: readonly FragmentId[];
  readonly achievementFragmentIds: readonly FragmentId[];
  readonly humanDetailFragmentId?: FragmentId;
  readonly skillIds: readonly string[];
  readonly tags: readonly CandidateTag[];
  readonly actualFit: number;
  readonly keywordFit: number;
  readonly corporateFit: number;
  readonly presentedMatchScore: number;
  readonly miraConfidence: number;
  readonly baseReward: number;
  readonly interviewEligible: boolean;
  readonly followUpId?: string;
}

export type CopySpeaker =
  | "system"
  | "mira"
  | "manager"
  | "coach"
  | "candidate";

export type CopyChannel =
  | "candidate-intro"
  | "rejection-confirmation"
  | "rejection-reason"
  | "streak-praise"
  | "interview-warning"
  | "mira-concern"
  | "manager-request"
  | "appeal"
  | "achievement-title"
  | "achievement-description"
  | "wellbeing-prompt"
  | "load-warning"
  | "upgrade-reaction"
  | "ending";

export type TemplatePlaceholder =
  | "candidateName"
  | "role"
  | "seniority"
  | "streak"
  | "upgradeName"
  | "credits"
  | "matchScore"
  | "managerName";

export interface CopyEntry {
  readonly id: CopyEntryId;
  readonly speaker: CopySpeaker;
  readonly channel: CopyChannel;
  /** Complete display text or localization key, never a sentence fragment. */
  readonly textKey: TextKey;
  readonly placeholders?: readonly TemplatePlaceholder[];
  readonly requiredCandidateTags?: readonly CandidateTag[];
  readonly excludedCandidateTags?: readonly CandidateTag[];
  readonly stageRange?: StageRange;
  readonly streakRange?: NumericRange;
  readonly requiredUpgrades?: readonly UpgradeId[];
  readonly requiredStoryFlags?: readonly StoryFlag[];
  readonly excludedStoryFlags?: readonly StoryFlag[];
  readonly weight: number;
  readonly cooldownGroup?: CooldownGroup;
  readonly salience?: "neutral" | "noticeable" | "punchline";
}

export interface ContentSelectionContext {
  readonly sessionSeed: string;
  readonly stage: GameStage;
  readonly purchasedUpgradeIds: ReadonlySet<UpgradeId>;
  readonly storyFlags: ReadonlySet<StoryFlag>;
  readonly rejectionStreak: number;
  readonly recentCandidateTags: readonly CandidateTag[];
  readonly usedNameEntryIds: ReadonlySet<string>;
  readonly usedSpecialCandidateIds: ReadonlySet<SpecialCandidateId>;
  readonly activeCooldownGroups: ReadonlySet<CooldownGroup>;
}

export interface ContentManifest {
  readonly contractVersion: ContentContractVersion;
  readonly contentVersion: string;
  readonly sourceLocale: string;
  readonly generatedAt?: string;
  readonly minimumCounts: {
    readonly names: number;
    readonly archetypes: number;
    readonly roles: number;
    readonly fragments: number;
    readonly specialCandidates: number;
    readonly copyEntries: number;
  };
}

/** Canonical aggregate loaded and validated before a session begins. */
export interface ContentBundle {
  readonly manifest: ContentManifest;
  readonly names: readonly CandidateNameEntry[];
  readonly skills: readonly SkillDefinition[];
  readonly roles: readonly RoleDefinition[];
  readonly archetypes: readonly CandidateArchetype[];
  readonly fragments: readonly ContentFragment[];
  readonly specialCandidates: readonly SpecialCandidateDefinition[];
  readonly copy: readonly CopyEntry[];
}

/** Compact content used for background auto-rejection logs. */
export interface AutomationLogEntry {
  readonly id: string;
  readonly candidateName: string;
  readonly roleId: RoleId;
  readonly rejectionReasonFragmentId: FragmentId;
  readonly reward: number;
  readonly createdAtGameTimeMs: number;
}

/**
 * Validator implementations must enforce these invariants:
 *
 * - IDs are unique within their entity kind.
 * - All referenced IDs resolve.
 * - Stage ranges are ordered and remain within stages 1–7.
 * - Weights are finite and greater than zero.
 * - Percent-like scores remain within 0–100.
 * - Numeric ranges have minimum <= maximum.
 * - A special candidate optionId resolves exactly once in its options array.
 * - Each special candidate exposes at least one reachable decision.
 * - Required and incompatible tags do not overlap.
 * - Template placeholders are declared and supported by their copy channel.
 * - Copy text cannot directly mutate game state; effectId resolves through a
 *   code-owned effect registry.
 * - Protected personal characteristics are not candidate tags or rejection
 *   reasons.
 */
export type ContentInvariantDocumentation = never;
