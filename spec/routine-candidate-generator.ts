import { archetypes, roles, skills } from "./candidate-core-data.ts";
import { candidateNames, candidateDecisionFragments } from "./candidate-decision-content.ts";
import { candidateProfileFragments } from "./candidate-profile-fragments.ts";
import type {
  Candidate,
  CandidateArchetype,
  CandidateNameEntry,
  CandidateTag,
  ContentFragment,
  GameStage,
  LocationMode,
  NumericRange,
  RoleDefinition,
  Seniority,
  SkillDefinition,
} from "./content-schema.ts";

export interface RandomSource {
  next(): number;
}

export interface CandidateGeneratorData {
  readonly names: readonly CandidateNameEntry[];
  readonly skills: readonly SkillDefinition[];
  readonly roles: readonly RoleDefinition[];
  readonly archetypes: readonly CandidateArchetype[];
  readonly profileFragments: readonly ContentFragment[];
  readonly decisionFragments: readonly ContentFragment[];
}

export interface GenerateCandidateOptions {
  readonly stage: GameStage;
}

export interface GeneratorSnapshot {
  readonly generatedCount: number;
  readonly usedNameEntryIds: readonly string[];
  readonly recentArchetypeIds: readonly string[];
  readonly recentPunchlineFragmentIds: readonly string[];
}

export class CandidateGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CandidateGenerationError";
  }
}

const defaultData: CandidateGeneratorData = {
  names: candidateNames,
  skills,
  roles,
  archetypes,
  profileFragments: candidateProfileFragments,
  decisionFragments: candidateDecisionFragments,
};

/** FNV-1a string hash followed by Mulberry32. */
export function createSeededRandom(seed: string): RandomSource {
  let state = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 0x01000193);
  }

  return {
    next(): number {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export class RoutineCandidateGenerator {
  readonly #data: CandidateGeneratorData;
  readonly #random: RandomSource;
  readonly #usedNameEntryIds = new Set<string>();
  readonly #recentArchetypeIds: string[] = [];
  readonly #recentPunchlineFragmentIds: string[] = [];
  #generatedCount = 0;

  constructor(seed: string, data: CandidateGeneratorData = defaultData) {
    this.#data = data;
    this.#random = createSeededRandom(seed);
    validateGeneratorData(data);
  }

  generate(options: GenerateCandidateOptions): Candidate {
    const { stage } = options;
    const archetype = this.#selectArchetype(stage);
    const role = this.#selectRole(archetype);
    const seniority = this.#selectSeniority(archetype, role);
    const name = this.#selectUnusedName();
    const baseTags = unique(archetype.requiredTags);

    const headline = this.#selectFragment("headline", stage, role.id, seniority, baseTags);
    const experience = this.#selectDistinctFragments(
      "experience",
      2,
      stage,
      role.id,
      seniority,
      unique([...baseTags, ...headline.tags]),
    );
    const achievement = this.#selectFragment(
      "achievement",
      stage,
      role.id,
      seniority,
      unique([...baseTags, ...headline.tags, ...experience.flatMap((item) => item.tags)]),
    );
    const humanDetail = this.#selectFragment(
      "human-detail",
      stage,
      role.id,
      seniority,
      unique([
        ...baseTags,
        ...headline.tags,
        ...experience.flatMap((item) => item.tags),
        ...achievement.tags,
      ]),
    );

    const tags = unique([
      ...baseTags,
      ...this.#selectOptionalArchetypeTags(archetype),
      ...headline.tags,
      ...experience.flatMap((item) => item.tags),
      ...achievement.tags,
      ...humanDetail.tags,
    ]);

    const selectedSkillIds = this.#selectSkills(role, tags);
    const actualFit = randomInteger(this.#random, archetype.actualFit);
    const keywordFit = this.#calculateKeywordFit(role, selectedSkillIds, tags);
    const corporateFit = this.#calculateCorporateFit(tags);
    const presentedMatchScore = clamp(
      Math.round(
        actualFit * 0.55 +
          keywordFit * 0.3 +
          corporateFit * 0.15 +
          randomBetween(this.#random, -8, 8),
      ),
      0,
      100,
    );
    const miraConfidence = tags.includes("mira-uncertain")
      ? randomInteger(this.#random, { minimum: 32, maximum: 58 })
      : clamp(55 + Math.abs(presentedMatchScore - 50), 55, 96);

    this.#generatedCount += 1;
    this.#rememberArchetype(archetype.id);
    for (const fragment of [headline, ...experience, achievement, humanDetail]) {
      this.#rememberPunchline(fragment);
    }

    const candidateId = `routine-${String(this.#generatedCount).padStart(4, "0")}`;

    return {
      id: candidateId,
      sessionIdentityId: candidateId,
      source: "routine",
      archetypeId: archetype.id,
      name: name.displayName,
      pronouns: name.pronouns,
      roleId: role.id,
      seniority,
      locationMode: this.#selectLocationMode(tags),
      yearsExperience: randomInteger(this.#random, archetype.yearsExperience),
      headlineFragmentId: headline.id,
      experienceFragmentIds: experience.map((item) => item.id),
      achievementFragmentIds: [achievement.id],
      humanDetailFragmentId: humanDetail.id,
      skillIds: selectedSkillIds,
      tags,
      actualFit,
      keywordFit,
      corporateFit,
      presentedMatchScore,
      miraConfidence,
      baseReward: randomInteger(this.#random, archetype.baseReward),
      interviewEligible: this.#isInterviewEligible(archetype),
    };
  }

  selectConcern(candidate: Candidate, stage: GameStage): ContentFragment {
    return this.#selectDecisionFragment("concern", candidate, stage);
  }

  selectRejectionReason(candidate: Candidate, stage: GameStage): ContentFragment {
    return this.#selectDecisionFragment("reject-reason", candidate, stage);
  }

  snapshot(): GeneratorSnapshot {
    return {
      generatedCount: this.#generatedCount,
      usedNameEntryIds: [...this.#usedNameEntryIds],
      recentArchetypeIds: [...this.#recentArchetypeIds],
      recentPunchlineFragmentIds: [...this.#recentPunchlineFragmentIds],
    };
  }

  #selectArchetype(stage: GameStage): CandidateArchetype {
    const eligible = this.#data.archetypes.filter(
      (item) => withinStage(item.stageRange, stage) && this.#recentCount(item.id) < 2,
    );
    const fallback = this.#data.archetypes.filter((item) => withinStage(item.stageRange, stage));
    return weightedPick(this.#random, eligible.length > 0 ? eligible : fallback, (item) => item.weight);
  }

  #selectRole(archetype: CandidateArchetype): RoleDefinition {
    const compatible = this.#data.roles.filter(
      (role) =>
        archetype.compatibleRoleIds.includes(role.id) &&
        archetype.compatibleSeniorities.some((value) => role.allowedSeniorities.includes(value)),
    );
    return weightedPick(this.#random, compatible, (role) => role.weight);
  }

  #selectSeniority(archetype: CandidateArchetype, role: RoleDefinition): Seniority {
    const allowed = archetype.compatibleSeniorities.filter((value) =>
      role.allowedSeniorities.includes(value),
    );
    return pick(this.#random, allowed);
  }

  #selectUnusedName(): CandidateNameEntry {
    const available = this.#data.names.filter((item) => !this.#usedNameEntryIds.has(item.id));
    if (available.length === 0) {
      throw new CandidateGenerationError(
        "Candidate name pool exhausted. Add names before increasing visible candidates per session.",
      );
    }
    const selected = weightedPick(this.#random, available, (item) => item.weight);
    this.#usedNameEntryIds.add(selected.id);
    return selected;
  }

  #selectFragment(
    kind: ContentFragment["kind"],
    stage: GameStage,
    roleId: string,
    seniority: Seniority,
    candidateTags: readonly CandidateTag[],
  ): ContentFragment {
    const base = this.#data.profileFragments.filter(
      (item) => item.kind === kind && (!item.stageRange || withinStage(item.stageRange, stage)),
    );
    const strict = base.filter(
      (item) =>
        (!item.compatibleRoleIds || item.compatibleRoleIds.includes(roleId)) &&
        (!item.compatibleSeniorities || item.compatibleSeniorities.includes(seniority)) &&
        hasAll(candidateTags, item.requiredTags ?? []) &&
        !hasAny(candidateTags, item.incompatibleTags ?? []) &&
        !(item.salience === "punchline" && this.#recentPunchlineFragmentIds.includes(item.id)),
    );
    const compatible = base.filter(
      (item) =>
        (!item.compatibleRoleIds || item.compatibleRoleIds.includes(roleId)) &&
        (!item.compatibleSeniorities || item.compatibleSeniorities.includes(seniority)),
    );
    const pool = strict.length > 0 ? strict : compatible.length > 0 ? compatible : base;
    return weightedPick(this.#random, pool, (item) =>
      item.weight * (hasAny(item.tags, candidateTags) ? 1.7 : 1),
    );
  }

  #selectDistinctFragments(
    kind: ContentFragment["kind"],
    count: number,
    stage: GameStage,
    roleId: string,
    seniority: Seniority,
    candidateTags: readonly CandidateTag[],
  ): ContentFragment[] {
    const result: ContentFragment[] = [];
    for (let index = 0; index < count; index += 1) {
      const selected = this.#selectFragment(kind, stage, roleId, seniority, candidateTags);
      if (!result.some((item) => item.id === selected.id)) {
        result.push(selected);
        continue;
      }

      const alternatives = this.#data.profileFragments.filter(
        (item) =>
          item.kind === kind &&
          !result.some((existing) => existing.id === item.id) &&
          (!item.stageRange || withinStage(item.stageRange, stage)) &&
          (!item.compatibleRoleIds || item.compatibleRoleIds.includes(roleId)) &&
          (!item.compatibleSeniorities || item.compatibleSeniorities.includes(seniority)),
      );
      result.push(weightedPick(this.#random, alternatives, (item) => item.weight));
    }
    return result;
  }

  #selectOptionalArchetypeTags(archetype: CandidateArchetype): CandidateTag[] {
    return (archetype.optionalTags ?? []).filter(() => this.#random.next() < 0.42);
  }

  #selectSkills(role: RoleDefinition, tags: readonly CandidateTag[]): string[] {
    const core = [...role.coreSkillIds];
    if (tags.includes("underqualified") && core.length > 1 && this.#random.next() < 0.65) {
      core.splice(Math.floor(this.#random.next() * core.length), 1);
    }

    const optional = shuffle(this.#random, [...(role.optionalSkillIds ?? [])]);
    const optionalCount = Math.min(optional.length, randomInteger(this.#random, { minimum: 1, maximum: 3 }));
    return unique([...core, ...optional.slice(0, optionalCount)]);
  }

  #calculateKeywordFit(
    role: RoleDefinition,
    selectedSkillIds: readonly string[],
    tags: readonly CandidateTag[],
  ): number {
    const matched = role.coreSkillIds.filter((id) => selectedSkillIds.includes(id)).length;
    let result = (matched / Math.max(1, role.coreSkillIds.length)) * 100;
    if (tags.includes("keyword-mismatch")) result -= 24;
    if (tags.includes("adjacent-stack")) result -= 10;
    if (tags.includes("legacy-stack")) result -= 8;
    return clamp(Math.round(result), 15, 100);
  }

  #calculateCorporateFit(tags: readonly CandidateTag[]): number {
    let result = randomBetween(this.#random, 45, 82);
    if (tags.includes("internal-referral")) result += 12;
    if (tags.includes("executive-referral")) result += 18;
    if (tags.includes("culture-vague")) result -= 14;
    if (tags.includes("remote-only")) result -= 8;
    if (tags.includes("overqualified")) result -= 6;
    return clamp(Math.round(result), 10, 100);
  }

  #selectLocationMode(tags: readonly CandidateTag[]): LocationMode {
    if (tags.includes("remote-only")) return "remote";
    if (tags.includes("office-only")) return "office";
    return pick(this.#random, ["remote", "hybrid", "hybrid", "office"] as const);
  }

  #isInterviewEligible(archetype: CandidateArchetype): boolean {
    if (archetype.interviewEligibility === "never") return false;
    if (archetype.interviewEligibility === "preferred") return true;
    return this.#random.next() < 0.45;
  }

  #selectDecisionFragment(
    kind: Extract<ContentFragment["kind"], "concern" | "reject-reason">,
    candidate: Candidate,
    stage: GameStage,
  ): ContentFragment {
    const eligible = this.#data.decisionFragments.filter(
      (item) =>
        item.kind === kind &&
        (!item.stageRange || withinStage(item.stageRange, stage)) &&
        hasAny(item.tags, candidate.tags),
    );
    const fallback = this.#data.decisionFragments.filter(
      (item) => item.kind === kind && (!item.stageRange || withinStage(item.stageRange, stage)),
    );
    return weightedPick(this.#random, eligible.length > 0 ? eligible : fallback, (item) => item.weight);
  }

  #recentCount(archetypeId: string): number {
    return this.#recentArchetypeIds.filter((id) => id === archetypeId).length;
  }

  #rememberArchetype(archetypeId: string): void {
    this.#recentArchetypeIds.push(archetypeId);
    while (this.#recentArchetypeIds.length > 10) this.#recentArchetypeIds.shift();
  }

  #rememberPunchline(fragment: ContentFragment): void {
    if (fragment.salience !== "punchline") return;
    this.#recentPunchlineFragmentIds.push(fragment.id);
    while (this.#recentPunchlineFragmentIds.length > 12) {
      this.#recentPunchlineFragmentIds.shift();
    }
  }
}

export function createDefaultRoutineCandidateGenerator(seed: string): RoutineCandidateGenerator {
  return new RoutineCandidateGenerator(seed, defaultData);
}

export interface GeneratorSmokeTestResult {
  readonly candidatesGenerated: number;
  readonly sessions: number;
  readonly minPresentedMatchScore: number;
  readonly maxPresentedMatchScore: number;
  readonly archetypesSeen: number;
  readonly rolesSeen: number;
}

/** Generates 10 deterministic 100-candidate sessions and validates every result. */
export function runGeneratorSmokeTest(): GeneratorSmokeTestResult {
  const generated: Candidate[] = [];
  for (let session = 0; session < 10; session += 1) {
    const generator = createDefaultRoutineCandidateGenerator(`smoke-session-${session}`);
    for (let index = 0; index < 100; index += 1) {
      const stage = clamp(Math.floor(index / 15) + 1, 1, 7) as GameStage;
      const candidate = generator.generate({ stage });
      validateGeneratedCandidate(candidate, defaultData);
      generator.selectConcern(candidate, stage);
      generator.selectRejectionReason(candidate, stage);
      generated.push(candidate);
    }
  }

  return {
    candidatesGenerated: generated.length,
    sessions: 10,
    minPresentedMatchScore: Math.min(...generated.map((item) => item.presentedMatchScore)),
    maxPresentedMatchScore: Math.max(...generated.map((item) => item.presentedMatchScore)),
    archetypesSeen: new Set(generated.map((item) => item.archetypeId)).size,
    rolesSeen: new Set(generated.map((item) => item.roleId)).size,
  };
}

export function validateGeneratedCandidate(
  candidate: Candidate,
  data: CandidateGeneratorData = defaultData,
): void {
  const role = data.roles.find((item) => item.id === candidate.roleId);
  const archetype = data.archetypes.find((item) => item.id === candidate.archetypeId);
  if (!role) throw new CandidateGenerationError(`Unknown generated role: ${candidate.roleId}`);
  if (!archetype) throw new CandidateGenerationError(`Unknown archetype: ${candidate.archetypeId}`);
  if (!role.allowedSeniorities.includes(candidate.seniority)) {
    throw new CandidateGenerationError(`Invalid seniority for ${candidate.roleId}`);
  }
  if (!archetype.compatibleRoleIds.includes(candidate.roleId)) {
    throw new CandidateGenerationError(`Archetype and role are incompatible: ${candidate.id}`);
  }
  for (const score of [candidate.actualFit, candidate.keywordFit, candidate.corporateFit, candidate.presentedMatchScore, candidate.miraConfidence]) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new CandidateGenerationError(`Invalid candidate score in ${candidate.id}`);
    }
  }
  const fragmentIds = new Set(data.profileFragments.map((item) => item.id));
  for (const id of [candidate.headlineFragmentId, ...candidate.experienceFragmentIds, ...candidate.achievementFragmentIds, candidate.humanDetailFragmentId]) {
    if (id && !fragmentIds.has(id)) throw new CandidateGenerationError(`Unknown fragment ${id}`);
  }
  if (candidate.experienceFragmentIds.length !== 2) {
    throw new CandidateGenerationError(`Candidate ${candidate.id} must contain two experience fragments`);
  }
  if (new Set(candidate.experienceFragmentIds).size !== candidate.experienceFragmentIds.length) {
    throw new CandidateGenerationError(`Candidate ${candidate.id} repeats an experience fragment`);
  }
}

export function validateGeneratorData(data: CandidateGeneratorData): void {
  if (data.names.length === 0 || data.roles.length === 0 || data.archetypes.length === 0) {
    throw new CandidateGenerationError("Generator data contains an empty required pool");
  }
  uniqueIds(data.names, "candidate name");
  uniqueIds(data.skills, "skill");
  uniqueIds(data.roles, "role");
  uniqueIds(data.archetypes, "archetype");
  uniqueIds(data.profileFragments, "profile fragment");
  uniqueIds(data.decisionFragments, "decision fragment");

  const roleIds = new Set(data.roles.map((item) => item.id));
  const skillIds = new Set(data.skills.map((item) => item.id));
  for (const role of data.roles) {
    for (const skillId of [...role.coreSkillIds, ...(role.optionalSkillIds ?? [])]) {
      if (!skillIds.has(skillId)) throw new CandidateGenerationError(`Unknown skill ${skillId}`);
    }
  }
  for (const archetype of data.archetypes) {
    if (!(archetype.weight > 0)) throw new CandidateGenerationError(`Invalid weight: ${archetype.id}`);
    for (const roleId of archetype.compatibleRoleIds) {
      if (!roleIds.has(roleId)) throw new CandidateGenerationError(`Unknown role ${roleId}`);
    }
    const hasPlayableRole = data.roles.some(
      (role) =>
        archetype.compatibleRoleIds.includes(role.id) &&
        archetype.compatibleSeniorities.some((value) => role.allowedSeniorities.includes(value)),
    );
    if (!hasPlayableRole) {
      throw new CandidateGenerationError(
        `Archetype ${archetype.id} has no role with a compatible seniority`,
      );
    }
  }
}

function weightedPick<T>(
  random: RandomSource,
  items: readonly T[],
  getWeight: (item: T) => number,
): T {
  if (items.length === 0) throw new CandidateGenerationError("Cannot choose from an empty pool");
  const weighted = items.map((item) => ({ item, weight: Math.max(0, getWeight(item)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (!(total > 0)) throw new CandidateGenerationError("Selection pool has no positive weight");
  let cursor = random.next() * total;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function pick<T>(random: RandomSource, items: readonly T[]): T {
  if (items.length === 0) throw new CandidateGenerationError("Cannot choose from an empty pool");
  return items[Math.floor(random.next() * items.length)];
}

function shuffle<T>(random: RandomSource, items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random.next() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function randomInteger(random: RandomSource, range: NumericRange): number {
  return Math.floor(randomBetween(random, range.minimum, range.maximum + 1));
}

function randomBetween(random: RandomSource, minimum: number, maximum: number): number {
  return minimum + random.next() * (maximum - minimum);
}

function withinStage(range: readonly [number, number], stage: number): boolean {
  return stage >= range[0] && stage <= range[1];
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function hasAll<T>(values: readonly T[], required: readonly T[]): boolean {
  return required.every((value) => values.includes(value));
}

function hasAny<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.some((value) => right.includes(value));
}

function uniqueIds(items: readonly { readonly id: string }[], label: string): void {
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    throw new CandidateGenerationError(`Duplicate ${label} ID`);
  }
}
