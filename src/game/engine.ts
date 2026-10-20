import {
  createOperations,
  operate,
  tickOperations,
  operationMultiplier,
  type Operations,
  type OperationAction,
} from './operations';
import { deskItems, deskCost, deskBaseRate, type DeskId, type DeskLevels } from './desk';
import { reaction } from '../content/reactions';
import { eventCopy, protocolCopy } from '../content/events';
import { candidateFor, type CandidateView } from './content';
import { config, upgrades, type UpgradeId } from './config';

export type EventTemplate = 'choice' | 'interrupt' | 'sprint' | 'exception';
export type Ending = 'break' | 'burnout' | 'corporate';
export type Event = {
  id: number;
  template: EventTemplate;
  title: string;
  detail: string;
  source: string;
  reward: number;
  expiresAt: number | null;
  blocking: boolean;
  critical: boolean;
  protocol: boolean;
  options?: string[];
  target?: number;
  progress?: number;
  best?: number;
  prevention?: boolean;
};
export type GameState = {
  operations: Operations;
  desk: DeskLevels;
  boostUntil: number;
  candidate: CandidateView;
  usedSpecials: string[];
  flags: string[];
  interviewOpportunities: number;
  seed: string;
  status: 'running' | 'paused' | 'confirming' | 'summary';
  confirmation: 'interview' | 'break' | 'corporate' | null;
  elapsedMs: number;
  credits: number;
  earned: number;
  spent: number;
  owned: UpgradeId[];
  candidateIndex: number;
  manualRejects: number;
  automaticRejects: number;
  autoFraction: number;
  passiveFraction: number;
  rejectionStreak: number;
  maxStreak: number;
  interviews: number;
  interviewCallbacks: { dueIndex: number; reward: number }[];
  events: Event[];
  nextEventId: number;
  nextEventAt: number;
  nextAppealAt: number;
  finalStartedAt: number;
  protocolStep: number;
  protocolNextAt: number;
  latePressure: number;
  ending: Ending | null;
  log: string[];
  resolvedEvents: number;
  expiredEvents: number;
  strongRejected: number;
  prevention: number;
  decisionBonus: number;
  income: {
    manual: number;
    events: number;
    automatic: number;
    passive: number;
    operations: number;
  };
  purchaseTimes: number[];
  warningsSeen: number[];
};
export const newSeed = (): string => globalThis.crypto?.randomUUID?.() ?? String(Date.now());
export function createGame(seed = newSeed()): GameState {
  return {
    operations: createOperations(),
    desk: {},
    boostUntil: 0,
    candidate: candidateFor(seed, 0, []),
    usedSpecials: [],
    flags: [],
    interviewOpportunities: 0,
    seed,
    status: 'running',
    confirmation: null,
    elapsedMs: 0,
    credits: 0,
    earned: 0,
    spent: 0,
    owned: [],
    candidateIndex: 0,
    manualRejects: 0,
    automaticRejects: 0,
    autoFraction: 0,
    passiveFraction: 0,
    rejectionStreak: 0,
    maxStreak: 0,
    interviews: 0,
    interviewCallbacks: [],
    events: [],
    nextEventId: 1,
    nextEventAt: config.eventIntervalMs,
    nextAppealAt: config.appealIntervalMs,
    finalStartedAt: 0,
    protocolStep: 0,
    protocolNextAt: 0,
    latePressure: 0,
    ending: null,
    log: ['A new candidate is ready for review.'],
    resolvedEvents: 0,
    expiredEvents: 0,
    strongRejected: 0,
    prevention: 0,
    decisionBonus: 0,
    income: { manual: 0, events: 0, automatic: 0, passive: 0, operations: 0 },
    purchaseTimes: [],
    warningsSeen: [],
  };
}
export const has = (s: GameState, id: UpgradeId) => s.owned.includes(id);
export const currentCandidate = (s: GameState): CandidateView => s.candidate;
export const multiplier = (s: GameState) =>
  !has(s, 'U03')
    ? 1
    : [...config.streakTiers].reverse().find((t) => s.rejectionStreak >= t.at)!.mult;
export const stage = (s: GameState) => Math.min(7, Math.floor(s.owned.length / 5) + 1);
export const eventCap = (s: GameState) => (stage(s) < 3 ? 1 : stage(s) < 5 ? 2 : 3);
export const load = (s: GameState) =>
  Math.min(
    100,
    Math.floor(
      (has(s, 'U33')
        ? config.finalBaseLoad
        : Math.min(70, Math.pow(s.owned.length / 32, 1.35) * 70)) + s.latePressure,
    ),
  );
export const breakReady = (s: GameState) => has(s, 'U33') && (has(s, 'U34') || s.protocolStep >= 1);
export const corporateReady = (s: GameState) =>
  s.owned.length === upgrades.length &&
  has(s, 'U35') &&
  s.elapsedMs - s.finalStartedAt >= config.protocolDurationMs &&
  s.protocolStep >= 3 &&
  s.credits >= config.e01Cost &&
  load(s) < 100;
export function offers(s: GameState) {
  const eligible = upgrades.filter(
    (u) => !has(s, u.id) && s.owned.length >= u.minOwned && u.requires.every((id) => has(s, id)),
  );
  const count = s.owned.length < 1 ? 1 : s.owned.length < 25 ? 2 : 3;
  const chosen: typeof eligible = [];
  for (const u of eligible)
    if (!chosen.some((v) => v.kind === u.kind) && chosen.length < count) chosen.push(u);
  for (const u of eligible) if (!chosen.includes(u) && chosen.length < count) chosen.push(u);
  return chosen;
}
function addLog(s: GameState, message: string): GameState {
  return { ...s, log: [message, ...s.log].slice(0, 5) };
}
function credit(
  s: GameState,
  amount: number,
  source: keyof GameState['income'] = 'events',
): GameState {
  return {
    ...s,
    credits: s.credits + amount,
    earned: s.earned + amount,
    income: { ...s.income, [source]: s.income[source] + amount },
  };
}
function canAct(s: GameState) {
  return s.status === 'running' && !s.ending;
}
function blocked(s: GameState) {
  return s.events.some((e) => e.blocking);
}
export function candidateDecisionAvailable(s: GameState, kind: 'reject' | 'interview') {
  if (!canAct(s) || blocked(s)) return false;
  return kind === 'reject' || (has(s, 'U12') && currentCandidate(s).interviewEligible);
}
function manualBase(s: GameState) {
  return config.manualBase[stage(s) - 1];
}
export function manualReward(s: GameState): number {
  const c = currentCandidate(s);
  const streak = s.rejectionStreak + 1;
  const mult = !has(s, 'U03')
    ? 1
    : [...config.streakTiers].reverse().find((t) => streak >= t.at)!.mult;
  return Math.round(
    manualBase(s) * (c.special ? config.economy.specialMultiplier : 1) * mult +
      (has(s, 'U01') && c.match < config.economy.lowMatchThreshold
        ? manualBase(s) * config.economy.matchBonusRatio
        : 0) +
      s.decisionBonus +
      (has(s, 'U16') &&
      (c.match < config.economy.lowMatchThreshold || c.match > config.economy.highMatchThreshold)
        ? manualBase(s) * config.economy.sortBonusRatio
        : 0) +
      (has(s, 'U29') && c.special ? manualBase(s) : 0),
  );
}
function advanceCandidate(s: GameState): GameState {
  const index = s.candidateIndex + 1;
  const due = s.interviewCallbacks.filter((c) => c.dueIndex <= index);
  const usedSpecials = s.candidate.specialId
    ? [...s.usedSpecials, s.candidate.specialId]
    : s.usedSpecials;
  let next = {
    ...s,
    candidateIndex: index,
    usedSpecials,
    candidate: candidateFor(s.seed, index, s.owned, usedSpecials, s.flags),
    interviewCallbacks: s.interviewCallbacks.filter((c) => c.dueIndex > index),
  };
  if (next.candidate.interviewEligible && has(next, 'U12')) {
    next = {
      ...next,
      interviewOpportunities: s.interviewOpportunities + 1,
      candidate: { ...next.candidate, interviewEligible: s.interviewOpportunities < 3 },
    };
  }
  if (due.length)
    next = addLog(
      credit(
        next,
        due.reduce((sum, c) => sum + c.reward, 0),
      ),
      `Interview callback: ${due.length} candidate${due.length > 1 ? 's' : ''} progressed. Credits awarded.`,
    );
  return next;
}
function completeCandidateDecision(s: GameState, flags: string[], message: string): GameState {
  const next = flags.length ? { ...s, flags: [...new Set([...s.flags, ...flags])] } : s;
  return addLog(advanceCandidate(next), message);
}
type CandidateOption = NonNullable<CandidateView['options']>[number];
function rejectCandidate(s: GameState, authored?: CandidateOption): GameState {
  const streak = s.rejectionStreak + 1;
  const reward = manualReward(s);
  let next = credit(
    {
      ...s,
      manualRejects: s.manualRejects + 1,
      rejectionStreak: streak,
      maxStreak: Math.max(s.maxStreak, streak),
      strongRejected: s.strongRejected + (currentCandidate(s).strong ? 1 : 0),
      decisionBonus: 0,
    },
    reward,
    'manual',
  );
  next = {
    ...next,
    events: next.events.map((e) =>
      e.template === 'sprint' ? { ...e, progress: Math.min(e.target!, e.progress! + 1) } : e,
    ),
  };
  const completed = next.events.filter((e) => e.template === 'sprint' && e.progress === e.target);
  for (const e of completed) next = resolveEvent(next, e.id, 0);
  next = completeCandidateDecision(
    next,
    authored?.flags ?? [],
    authored?.followUp ?? reaction('rejection', s.manualRejects),
  );
  if (has(next, 'U03') && config.streakTiers.some((t) => t.at === streak))
    next = addLog(
      next,
      reaction(
        'streak',
        config.streakTiers.findIndex((t) => t.at === streak) + Math.floor(s.elapsedMs / 1000),
      ),
    );
  if (has(next, 'U05') && next.manualRejects % config.economy.milestoneEvery === 0)
    next = addLog(
      credit(next, manualBase(next) * config.economy.milestoneMultiplier),
      'Queue milestone: ten human reviews completed.',
    );
  if (has(next, 'U33') && load(next) >= 90)
    next = addPressure(
      next,
      config.riskyActionPenalty,
      'Continuing manual output after the 90% warning increased System Load.',
    );
  return next;
}
export function reject(s: GameState): GameState {
  if (!candidateDecisionAvailable(s, 'reject')) return s;
  return rejectCandidate(
    s,
    s.candidate.options?.find((o) => o.decision === 'reject'),
  );
}
export function interview(s: GameState): GameState {
  if (!candidateDecisionAvailable(s, 'interview')) return s;
  const next = {
    ...s,
    interviews: s.interviews + 1,
    rejectionStreak: 0,
    prevention: Math.min(1, s.prevention + 1),
    interviewCallbacks: [
      ...s.interviewCallbacks,
      {
        dueIndex: s.candidateIndex + config.interviewDelayCandidates,
        reward: manualBase(s) * config.economy.interviewRewardMultiplier,
      },
    ],
  };
  const authored = s.candidate.options?.find((o) => o.decision === 'interview');
  return completeCandidateDecision(
    next,
    authored?.flags ?? [],
    authored?.followUp ??
      'Interview scheduled. Rejection streak reset; a callback will arrive after four reviews.',
  );
}
export function specialDecision(s: GameState, id: string): GameState {
  if (!candidateDecisionAvailable(s, 'reject')) return s;
  const option = s.candidate.options?.find((o) => o.id === id);
  if (!option) return s;
  if (option.decision === 'interview') return beginConfirmation(s, 'interview');
  if (option.decision === 'reject') return rejectCandidate(s, option);
  return completeCandidateDecision(
    credit(s, manualBase(s) * config.economy.interviewRewardMultiplier),
    option.flags,
    option.followUp,
  );
}
export function purchase(s: GameState, id: UpgradeId): GameState {
  if (!canAct(s)) return s;
  const u = offers(s).find((u) => u.id === id);
  if (!u || s.credits < u.cost) return s;
  let next = addLog(
    {
      ...s,
      credits: s.credits - u.cost,
      spent: s.spent + u.cost,
      owned: [...s.owned, id],
      purchaseTimes: [...s.purchaseTimes, s.elapsedMs],
    },
    `${u.name} installed. A new desktop surface is active.`,
  );
  if (id === 'U33') {
    next = {
      ...next,
      finalStartedAt: s.elapsedMs,
      protocolStep: 0,
      protocolNextAt: s.elapsedMs + 2000,
    };
    next = addLog(
      next,
      'Final Protocol began. Complete three handover tasks. Load now rises with active time.',
    );
  }
  if (id !== 'U33' && eventCopy[id] && u.kind !== 'automation' && u.kind !== 'exception')
    next = spawn(next, eventForUpgrade(next, id));
  if (id === 'U21') next = { ...next, nextAppealAt: s.elapsedMs + 12000 };
  return next;
}
type EventInput = Omit<Event, 'id'>;
function spawn(s: GameState, input: EventInput): GameState {
  if (s.events.filter((e) => !e.blocking).length >= eventCap(s) && !input.blocking) {
    if (!input.protocol) return s;
    const deferred = s.events.find((e) => !e.blocking && !e.protocol);
    if (!deferred) return s;
    s = addLog(
      { ...s, events: s.events.filter((e) => e.id !== deferred.id) },
      'An optional request was deferred to make room for handover.',
    );
  }
  if (input.blocking && blocked(s)) return s;
  if (s.events.some((e) => e.source === input.source && e.protocol === input.protocol)) return s;
  return {
    ...s,
    nextEventId: s.nextEventId + 1,
    events: [...s.events, { ...input, id: s.nextEventId }],
  };
}
export const operationReward = (s: GameState) => Math.max(8, Math.round(deskBaseRate(s.desk) * 6));
export function operateStation(s: GameState, action: OperationAction): GameState {
  if (!canAct(s)) return s;
  const result = operate(s.operations, action, s.elapsedMs, s.desk, operationReward(s));
  if (result.operations === s.operations) return s;
  let next = {
    ...s,
    operations: result.operations,
    ...(result.boostMs ? { boostUntil: s.elapsedMs + result.boostMs } : {}),
  };
  if (result.reward) next = credit(next, result.reward, 'operations');
  if (result.operations.feedback !== s.operations.feedback && result.operations.feedback)
    next = addLog(next, result.operations.feedback.message);
  return next;
}
export function buyDesk(s: GameState, id: DeskId): GameState {
  const item = deskItems.find((item) => item.id === id);
  const level = s.desk[id] ?? 0;
  if (!canAct(s) || !item || s.owned.length < item.minOwned || level >= item.maxLevel) return s;
  const cost = deskCost(item, level);
  if (s.credits < cost) return s;
  return addLog(
    {
      ...s,
      credits: s.credits - cost,
      spent: s.spent + cost,
      desk: { ...s.desk, [id]: level + 1 },
    },
    `${item.name} ${level ? `upgraded to level ${level + 1}` : 'installed'}. ${item.maxLevel === 1 ? 'Permanent bonus active.' : 'Your desk is earning.'}`,
  );
}
export const deskIncomeRate = (s: GameState) =>
  deskBaseRate(s.desk) * operationMultiplier(s.operations) * (s.elapsedMs < s.boostUntil ? 2 : 1);
export const passiveRate = (s: GameState) =>
  deskIncomeRate(s) +
  (has(s, 'U08') ? config.economy.passiveRates.focus : 0) +
  (has(s, 'U14') ? config.economy.passiveRates.news : 0) +
  (has(s, 'U26') ? config.economy.passiveRates.ambient : 0);
export const autoRate = (s: GameState) =>
  !has(s, 'U21')
    ? 0
    : has(s, 'U33')
      ? config.economy.automationRates.final
      : has(s, 'U29')
        ? config.economy.automationRates.pipeline
        : config.economy.automationRates.routine;
function eventForUpgrade(s: GameState, id: UpgradeId): EventInput {
  const u = upgrades.find((u) => u.id === id)!;
  const original = eventCopy[id]!;
  const channel =
    id === 'U28'
      ? 'wellbeing'
      : u.kind === 'sprint'
        ? 'manager'
        : u.kind === 'automation' || id === 'U27'
          ? 'appeal'
          : null;
  const copy = {
    ...original,
    ...(channel
      ? {
          detail:
            reaction(channel, s.nextEventId) +
            (channel === 'appeal'
              ? ' Throughput is paused until you decide.'
              : channel === 'manager'
                ? ` Complete ${original.target ?? 3} reviews before expiry.`
                : ''),
        }
      : {}),
    ...(id === 'U09' ? { title: reaction('achievement', s.nextEventId) } : {}),
  };
  const template = u.kind === 'automation' ? 'exception' : (u.kind as EventTemplate);
  const blocking = template === 'exception';
  return {
    ...copy,
    template,
    source: id,
    reward: Math.round(manualBase(s) * config.economy.eventMultiplier[template]),
    expiresAt: blocking ? null : s.elapsedMs + config.eventDurationMs,
    blocking,
    critical: has(s, 'U33') && template === 'sprint',
    protocol: false,
    progress: template === 'sprint' ? 0 : undefined,
  };
}
function eventFor(s: GameState, template: EventTemplate, protocol = false): EventInput {
  if (protocol) {
    const data = protocolCopy[Math.min(2, s.protocolStep)];
    return {
      ...data,
      source: 'U33',
      reward: manualBase(s) * config.economy.protocolRewardMultiplier,
      expiresAt: null,
      blocking: data.template === 'exception',
      critical: true,
      protocol: true,
      progress: data.template === 'sprint' ? 0 : undefined,
    };
  }
  const candidates = upgrades.filter(
    (u) =>
      has(s, u.id) &&
      eventCopy[u.id] &&
      (u.kind === template || (template === 'exception' && u.kind === 'automation')),
  );
  const defaults: Record<EventTemplate, UpgradeId> = {
    choice: 'U04',
    interrupt: 'U02',
    sprint: 'U07',
    exception: 'U21',
  };
  return eventForUpgrade(
    s,
    candidates.length ? candidates[(s.nextEventId - 1) % candidates.length].id : defaults[template],
  );
}
export function triggerEvent(s: GameState, template: EventTemplate, protocol = false): GameState {
  return spawn(s, eventFor(s, template, protocol));
}
export function resolveEvent(s: GameState, id: number, choice: number): GameState {
  if (!canAct(s)) return s;
  const e = s.events.find((e) => e.id === id);
  if (
    !Number.isInteger(choice) ||
    !e ||
    (e.template === 'sprint' && e.progress! < e.target!) ||
    (e.options && (choice < 0 || choice >= e.options.length))
  )
    return s;
  const evidenceBonus =
    e.best === choice ? Math.round(e.reward * config.economy.evidenceBonusRatio) : 0;
  let next = credit(
    {
      ...s,
      events: s.events.filter((v) => v.id !== id),
      resolvedEvents: s.resolvedEvents + 1,
      prevention: e.prevention ? 1 : s.prevention,
      decisionBonus: e.best === choice || e.source === 'U19' ? manualBase(s) : s.decisionBonus,
    },
    e.reward + evidenceBonus,
  );
  if (e.protocol)
    next = {
      ...next,
      protocolStep: Math.min(3, s.protocolStep + 1),
      protocolNextAt: s.elapsedMs + config.protocolEventIntervalMs,
    };
  return addLog(
    next,
    `${e.title} resolved. +${e.reward + evidenceBonus} Credits${e.protocol ? ' · handover advanced' : ''}.`,
  );
}
function addPressure(s: GameState, amount: number, message: string): GameState {
  if (!has(s, 'U33')) return s;
  if (s.prevention > 0)
    return addLog(
      { ...s, prevention: s.prevention - 1 },
      'Escalation waiver used. This penalty was prevented; accumulated Load is unchanged.',
    );
  const next = addLog({ ...s, latePressure: s.latePressure + amount }, message);
  return load(next) >= 100 ? commitEnding(next, 'burnout') : next;
}
export function tick(s: GameState, deltaMs: number): GameState {
  if (!canAct(s) || !Number.isFinite(deltaMs) || deltaMs <= 0) return s;
  if (deltaMs > 1000) {
    let next = s;
    for (let remaining = deltaMs; remaining > 0 && canAct(next); remaining -= 1000)
      next = tick(next, Math.min(1000, remaining));
    return next;
  }
  const elapsed = s.elapsedMs + deltaMs;
  let next: GameState = { ...s, elapsedMs: elapsed };
  if (has(next, 'U33')) {
    next = {
      ...next,
      latePressure: next.latePressure + (deltaMs / 1000) * config.finalLoadPerSecond,
    };
    if (load(next) >= 100) next = commitEnding(next, 'burnout');
  }
  if (next.ending) return next;
  const autoEnabled = has(next, 'U21') && !blocked(next);
  if (autoEnabled) {
    const total = next.autoFraction + (deltaMs / 1000) * autoRate(next);
    const count = Math.floor(total);
    next = {
      ...next,
      autoFraction: total - count,
      automaticRejects: next.automaticRejects + count,
    };
    if (count)
      next = credit(
        next,
        count *
          (has(next, 'U33')
            ? config.economy.automationRewards.final
            : config.economy.automationRewards.routine),
        'automatic',
      );
  }
  if (passiveRate(next) > 0) {
    const boostedMs = Math.max(0, Math.min(elapsed, s.boostUntil) - s.elapsedMs);
    const baseRate = passiveRate({ ...s, boostUntil: 0 });
    const fractional =
      next.passiveFraction +
      (deltaMs / 1000) * baseRate +
      (boostedMs / 1000) * deskBaseRate(s.desk) * operationMultiplier(s.operations);
    const whole = Math.floor(fractional + 1e-9);
    next = { ...next, passiveFraction: Math.max(0, fractional - whole) };
    if (whole) next = credit(next, whole, 'passive');
  }
  const operationTick = tickOperations(next.operations, elapsed, operationReward(next));
  if (operationTick.operations !== next.operations) {
    next = { ...next, operations: operationTick.operations };
    if (operationTick.reward) next = credit(next, operationTick.reward, 'operations');
  }
  const expired = next.events.filter((e) => e.expiresAt !== null && e.expiresAt <= elapsed);
  if (expired.length) {
    next = {
      ...next,
      events: next.events.filter((e) => !expired.includes(e)),
      expiredEvents: next.expiredEvents + expired.length,
    };
    for (const e of expired) {
      next = addLog(next, `${e.title} expired.`);
      if (e.critical)
        next = addPressure(
          next,
          config.finalMissPenalty,
          'A critical event expired. System Load increased.',
        );
    }
  }
  if (next.ending) return next;
  if (
    has(next, 'U33') &&
    next.protocolStep < 3 &&
    elapsed >= next.protocolNextAt &&
    !next.events.some((e) => e.protocol)
  ) {
    next = triggerEvent(next, 'exception', true);
    next = { ...next, protocolNextAt: elapsed + config.protocolEventIntervalMs };
  }
  if (elapsed >= next.nextEventAt) {
    const sources = upgrades.filter(
      (u) =>
        has(next, u.id) &&
        eventCopy[u.id] &&
        u.kind !== 'automation' &&
        u.kind !== 'exception' &&
        !next.events.some((e) => e.source === u.id),
    );
    if (sources.length)
      next = spawn(
        next,
        eventForUpgrade(
          next,
          sources[
            (next.nextEventId + Math.floor(elapsed / config.eventIntervalMs)) % sources.length
          ].id,
        ),
      );
    next = { ...next, nextEventAt: elapsed + config.eventIntervalMs };
  }
  if (has(next, 'U21') && elapsed >= next.nextAppealAt) {
    next = triggerEvent(next, 'exception');
    next = {
      ...next,
      nextAppealAt:
        elapsed + (has(next, 'U35') ? config.appealIntervalMs * 0.6 : config.appealIntervalMs),
    };
  }
  const warnings = config.warnings.filter((w) => load(next) >= w && !next.warningsSeen.includes(w));
  if (warnings.length)
    next = addLog(
      { ...next, warningsSeen: [...next.warningsSeen, ...warnings] },
      `System Load ${load(next)}%. ${load(next) >= 96 ? 'Critical: choose your exit now.' : load(next) >= 90 ? 'Manual output now adds pressure.' : 'Capacity warning: a break is available after handover.'}`,
    );
  return next;
}
export function beginConfirmation(
  s: GameState,
  kind: 'interview' | 'break' | 'corporate',
): GameState {
  if (!canAct(s)) return s;
  if (kind === 'interview' && !candidateDecisionAvailable(s, 'interview')) return s;
  if (kind === 'break' && !breakReady(s)) return s;
  if (kind === 'corporate' && !corporateReady(s)) return s;
  return {
    ...operateStation(s, { type: 'brew-cancel' }),
    status: 'confirming',
    confirmation: kind,
  };
}
export function cancelConfirmation(s: GameState): GameState {
  return s.status === 'confirming' ? { ...s, status: 'running', confirmation: null } : s;
}
export function confirm(s: GameState): GameState {
  if (s.status !== 'confirming' || !s.confirmation) return s;
  const kind = s.confirmation;
  const next = { ...s, status: 'running' as const, confirmation: null };
  if (kind === 'interview') return interview(next);
  if (kind === 'break' && breakReady(next)) return commitEnding(next, 'break');
  if (kind === 'corporate' && corporateReady(next))
    return commitEnding(
      { ...next, credits: next.credits - config.e01Cost, spent: next.spent + config.e01Cost },
      'corporate',
    );
  return next;
}
export function commitEnding(s: GameState, ending: Ending): GameState {
  if (s.ending || s.status === 'summary') return s;
  return {
    ...s,
    status: 'summary',
    confirmation: null,
    ending,
    events: [],
    log: [`Session ended: ${ending}.`, ...s.log].slice(0, 5),
  };
}
export function pause(s: GameState): GameState {
  return s.status === 'running'
    ? { ...operateStation(s, { type: 'brew-cancel' }), status: 'paused' }
    : s;
}
export function resume(s: GameState): GameState {
  return s.status === 'paused' ? { ...s, status: 'running' } : s;
}
