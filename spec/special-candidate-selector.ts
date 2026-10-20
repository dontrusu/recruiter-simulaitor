import { createSeededRandom, type RandomSource } from "./routine-candidate-generator.ts";
import {
  specialCandidates,
  type SpecialCandidateContentDefinition,
  type SpecialCandidateGroup,
} from "./special-candidate-content.ts";
import type {
  CooldownGroup,
  GameStage,
  SpecialCandidateId,
  StoryFlag,
  UpgradeId,
} from "./content-schema.ts";

/**
 * Session-level pacing for authored special candidates.
 *
 * Call `consider` once whenever the game is about to show a new player-visible
 * candidate. A `routine` result means the normal generator should be used.
 */

export interface SpecialCandidateSelectionContext {
  readonly stage: GameStage;
  readonly purchasedUpgradeIds: ReadonlySet<UpgradeId>;
  readonly storyFlags: ReadonlySet<StoryFlag>;
  readonly activeCooldownGroups?: ReadonlySet<CooldownGroup>;
  /** Expected visible candidate count for this run, normally 90–140. */
  readonly plannedVisibleCandidates: number;
}

export type SpecialCandidateSelectionResult =
  | {
      readonly kind: "routine";
      readonly reason:
        | "opening"
        | "maximum-reached"
        | "minimum-gap"
        | "no-eligible-scenario"
        | "pacing-roll";
    }
  | {
      readonly kind: "special";
      readonly candidate: SpecialCandidateContentDefinition;
      readonly reason: "pacing-roll" | "hard-gap" | "minimum-target";
    };

export interface SpecialCandidateSelectorSnapshot {
  readonly visibleSlotsObserved: number;
  readonly selectedCount: number;
  readonly candidatesSinceSpecial: number;
  readonly usedSpecialCandidateIds: readonly SpecialCandidateId[];
  readonly recentGroups: readonly SpecialCandidateGroup[];
}

export interface SpecialCandidatePacingBand {
  readonly stage: GameStage;
  readonly baseChance: number;
  readonly minimumRoutineGap: number;
  readonly hardGap: number;
}

export const specialCandidatePacing: readonly SpecialCandidatePacingBand[] = [
  { stage: 1, baseChance: 0, minimumRoutineGap: 999, hardGap: 999 },
  { stage: 2, baseChance: 0.035, minimumRoutineGap: 11, hardGap: 26 },
  { stage: 3, baseChance: 0.055, minimumRoutineGap: 10, hardGap: 22 },
  { stage: 4, baseChance: 0.08, minimumRoutineGap: 9, hardGap: 18 },
  { stage: 5, baseChance: 0.11, minimumRoutineGap: 8, hardGap: 16 },
  { stage: 6, baseChance: 0.14, minimumRoutineGap: 7, hardGap: 14 },
  { stage: 7, baseChance: 0.18, minimumRoutineGap: 6, hardGap: 12 },
] as const;

export const SPECIAL_CANDIDATE_SESSION_MINIMUM = 6;
export const SPECIAL_CANDIDATE_SESSION_TARGET = 8;
export const SPECIAL_CANDIDATE_SESSION_MAXIMUM = 10;
export const SPECIAL_CANDIDATE_OPENING_LOCK = 8;

export class SpecialCandidateSelector {
  readonly #random: RandomSource;
  readonly #definitions: readonly SpecialCandidateContentDefinition[];
  readonly #usedIds = new Set<SpecialCandidateId>();
  readonly #seenGroups = new Set<SpecialCandidateGroup>();
  readonly #recentGroups: SpecialCandidateGroup[] = [];
  #visibleSlotsObserved = 0;
  #candidatesSinceSpecial = 0;

  constructor(
    sessionSeed: string,
    definitions: readonly SpecialCandidateContentDefinition[] = specialCandidates,
  ) {
    if (definitions.length < SPECIAL_CANDIDATE_SESSION_MAXIMUM) {
      throw new Error("Special-candidate library cannot support the per-session maximum");
    }
    this.#random = createSeededRandom(`${sessionSeed}:special-candidates`);
    this.#definitions = definitions;
  }

  consider(context: SpecialCandidateSelectionContext): SpecialCandidateSelectionResult {
    validateContext(context);
    const slotIndex = this.#visibleSlotsObserved;
    this.#visibleSlotsObserved += 1;
    this.#candidatesSinceSpecial += 1;

    if (slotIndex < SPECIAL_CANDIDATE_OPENING_LOCK || context.stage === 1) {
      return { kind: "routine", reason: "opening" };
    }
    if (this.#usedIds.size >= SPECIAL_CANDIDATE_SESSION_MAXIMUM) {
      return { kind: "routine", reason: "maximum-reached" };
    }

    const pacing = specialCandidatePacing[context.stage - 1];
    if (this.#candidatesSinceSpecial <= pacing.minimumRoutineGap) {
      return { kind: "routine", reason: "minimum-gap" };
    }

    const eligible = this.#eligibleCandidates(context);
    if (eligible.length === 0) {
      return { kind: "routine", reason: "no-eligible-scenario" };
    }

    const remainingSlots = Math.max(0, context.plannedVisibleCandidates - this.#visibleSlotsObserved);
    const stillNeededForMinimum = Math.max(
      0,
      SPECIAL_CANDIDATE_SESSION_MINIMUM - this.#usedIds.size,
    );
    const minimumTargetDeadline =
      stillNeededForMinimum > 0 &&
      remainingSlots <= stillNeededForMinimum * (pacing.minimumRoutineGap + 1);
    const hardGapReached = this.#candidatesSinceSpecial >= pacing.hardGap;

    const progress = clamp(
      this.#visibleSlotsObserved / context.plannedVisibleCandidates,
      0,
      1,
    );
    const expectedByNow = progress * SPECIAL_CANDIDATE_SESSION_TARGET;
    const behindTarget = this.#usedIds.size + 0.75 < expectedByNow;
    const chance = clamp(pacing.baseChance * (behindTarget ? 1.75 : 1), 0, 0.7);
    const passedRoll = this.#random.next() < chance;

    if (!minimumTargetDeadline && !hardGapReached && !passedRoll) {
      return { kind: "routine", reason: "pacing-roll" };
    }

    const selected = weightedPick(this.#random, eligible, (candidate) =>
      this.#selectionWeight(candidate),
    );
    this.#remember(selected);

    return {
      kind: "special",
      candidate: selected,
      reason: minimumTargetDeadline
        ? "minimum-target"
        : hardGapReached
          ? "hard-gap"
          : "pacing-roll",
    };
  }

  snapshot(): SpecialCandidateSelectorSnapshot {
    return {
      visibleSlotsObserved: this.#visibleSlotsObserved,
      selectedCount: this.#usedIds.size,
      candidatesSinceSpecial: this.#candidatesSinceSpecial,
      usedSpecialCandidateIds: [...this.#usedIds],
      recentGroups: [...this.#recentGroups],
    };
  }

  #eligibleCandidates(
    context: SpecialCandidateSelectionContext,
  ): SpecialCandidateContentDefinition[] {
    const activeCooldownGroups = context.activeCooldownGroups ?? new Set<CooldownGroup>();
    return this.#definitions.filter(
      (candidate) =>
        !this.#usedIds.has(candidate.id) &&
        withinStage(candidate.stageRange, context.stage) &&
        hasAll(context.purchasedUpgradeIds, candidate.prerequisites ?? []) &&
        hasAll(context.storyFlags, candidate.requiredStoryFlags ?? []) &&
        !hasAny(context.storyFlags, candidate.excludedByStoryFlags ?? []) &&
        !(candidate.cooldownGroup && activeCooldownGroups.has(candidate.cooldownGroup)),
    );
  }

  #selectionWeight(candidate: SpecialCandidateContentDefinition): number {
    let result = candidate.weight;
    if (!this.#seenGroups.has(candidate.group)) result *= 1.6;

    const lastGroup = this.#recentGroups.at(-1);
    const previousGroup = this.#recentGroups.at(-2);
    if (candidate.group === lastGroup) result *= 0.15;
    else if (candidate.group === previousGroup) result *= 0.5;

    return result;
  }

  #remember(candidate: SpecialCandidateContentDefinition): void {
    this.#usedIds.add(candidate.id);
    this.#seenGroups.add(candidate.group);
    this.#recentGroups.push(candidate.group);
    while (this.#recentGroups.length > 3) this.#recentGroups.shift();
    this.#candidatesSinceSpecial = 0;
  }
}

export function createDefaultSpecialCandidateSelector(
  sessionSeed: string,
): SpecialCandidateSelector {
  return new SpecialCandidateSelector(sessionSeed, specialCandidates);
}

export interface SpecialCandidateSelectorSimulation {
  readonly sessions: number;
  readonly minimumSelected: number;
  readonly maximumSelected: number;
  readonly averageSelected: number;
  readonly sessionsBelowMinimum: number;
  readonly sessionsAboveMaximum: number;
  readonly selectedByGroup: Readonly<Record<SpecialCandidateGroup, number>>;
}

/** Deterministic balance smoke test across 1,000 sessions of 90–140 candidates. */
export function simulateSpecialCandidateSelector(
  sessions = 1_000,
): SpecialCandidateSelectorSimulation {
  const counts: number[] = [];
  const selectedByGroup: Record<SpecialCandidateGroup, number> = {
    "clearly-excellent": 0,
    "returning-or-appealing": 0,
    "corporate-relationship": 0,
    "system-contradiction": 0,
    "ai-uncertainty": 0,
    "satirical-edge-case": 0,
  };

  for (let session = 0; session < sessions; session += 1) {
    const plannedVisibleCandidates = 90 + (session % 51);
    const selector = createDefaultSpecialCandidateSelector(`selector-smoke-${session}`);
    const storyFlags = new Set<StoryFlag>();

    for (let index = 0; index < plannedVisibleCandidates; index += 1) {
      const progress = (index + 1) / plannedVisibleCandidates;
      const stage = clamp(Math.ceil(progress * 7), 1, 7) as GameStage;
      const purchasedCount = Math.min(35, Math.floor(progress * 36));
      const purchasedUpgradeIds = new Set<UpgradeId>(
        Array.from(
          { length: purchasedCount },
          (_, upgradeIndex) => `U${String(upgradeIndex + 1).padStart(2, "0")}`,
        ),
      );
      const result = selector.consider({
        stage,
        purchasedUpgradeIds,
        storyFlags,
        plannedVisibleCandidates,
      });
      if (result.kind === "special") selectedByGroup[result.candidate.group] += 1;
    }

    counts.push(selector.snapshot().selectedCount);
  }

  return {
    sessions,
    minimumSelected: Math.min(...counts),
    maximumSelected: Math.max(...counts),
    averageSelected: counts.reduce((sum, count) => sum + count, 0) / counts.length,
    sessionsBelowMinimum: counts.filter(
      (count) => count < SPECIAL_CANDIDATE_SESSION_MINIMUM,
    ).length,
    sessionsAboveMaximum: counts.filter(
      (count) => count > SPECIAL_CANDIDATE_SESSION_MAXIMUM,
    ).length,
    selectedByGroup,
  };
}

function validateContext(context: SpecialCandidateSelectionContext): void {
  if (!Number.isInteger(context.plannedVisibleCandidates)) {
    throw new Error("plannedVisibleCandidates must be an integer");
  }
  if (context.plannedVisibleCandidates < 1) {
    throw new Error("plannedVisibleCandidates must be positive");
  }
}

function withinStage(
  range: readonly [number, number],
  stage: GameStage,
): boolean {
  return stage >= range[0] && stage <= range[1];
}

function hasAll<T>(values: ReadonlySet<T>, required: readonly T[]): boolean {
  return required.every((value) => values.has(value));
}

function hasAny<T>(values: ReadonlySet<T>, candidates: readonly T[]): boolean {
  return candidates.some((value) => values.has(value));
}

function weightedPick<T>(
  random: RandomSource,
  items: readonly T[],
  getWeight: (item: T) => number,
): T {
  const weighted = items.map((item) => ({ item, weight: Math.max(0, getWeight(item)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (!(total > 0)) throw new Error("Special-candidate selection pool has no positive weight");

  let cursor = random.next() * total;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
