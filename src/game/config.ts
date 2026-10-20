export type UpgradeId =
  | 'U01'
  | 'U02'
  | 'U03'
  | 'U04'
  | 'U05'
  | 'U06'
  | 'U07'
  | 'U08'
  | 'U09'
  | 'U10'
  | 'U11'
  | 'U12'
  | 'U13'
  | 'U14'
  | 'U15'
  | 'U16'
  | 'U17'
  | 'U18'
  | 'U19'
  | 'U20'
  | 'U21'
  | 'U22'
  | 'U23'
  | 'U24'
  | 'U25'
  | 'U26'
  | 'U27'
  | 'U28'
  | 'U29'
  | 'U30'
  | 'U31'
  | 'U32'
  | 'U33'
  | 'U34'
  | 'U35';
export type UpgradeKind =
  'modifier' | 'interrupt' | 'choice' | 'sprint' | 'passive' | 'exception' | 'automation' | 'final';
export type Upgrade = {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  requires: UpgradeId[];
  minOwned: number;
  kind: UpgradeKind;
  icon: string;
  desktop: string;
};
export const upgrades: Upgrade[] = [
  {
    id: 'U01',
    name: 'ATS Match Badge',
    description:
      'Reveals a match score; rejecting a clearly low match adds a small decision bonus.',
    cost: 3,
    requires: [],
    minOwned: 0,
    kind: 'modifier',
    icon: '\u25ce',
    desktop: 'Match badge appears on candidate cards.',
  },
  {
    id: 'U02',
    name: 'Decision Feedback',
    description: 'Periodic decision-confirmation toasts can be collected for a small Credit bonus.',
    cost: 6,
    requires: ['U01'],
    minOwned: 1,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Toast rail begins accumulating confirmations.',
  },
  {
    id: 'U03',
    name: 'Rejection Streak',
    description: 'Unlocks the manual-rejection streak and multiplier tiers.',
    cost: 10,
    requires: ['U01'],
    minOwned: 1,
    kind: 'modifier',
    icon: '\u25ce',
    desktop: 'Streak counter attaches to the title bar.',
  },
  {
    id: 'U04',
    name: 'Mira Lite',
    description:
      'Mira offers two concern tags; choosing the better-supported one adds a decision bonus.',
    cost: 16,
    requires: ['U01'],
    minOwned: 2,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Assistant chip and speech bubble remain open.',
  },
  {
    id: 'U05',
    name: 'Queue Counter',
    description: 'Reveals the backlog and awards a small milestone bonus for processed batches.',
    cost: 25,
    requires: ['U01'],
    minOwned: 3,
    kind: 'modifier',
    icon: '\u25ce',
    desktop: 'Applicant queue widget appears behind Talent.OS.',
  },
  {
    id: 'U06',
    name: 'AI Profile Summary',
    description:
      'Condenses a profile into three claims; identifying the useful claim increases the next candidate reward.',
    cost: 35,
    requires: ['U04'],
    minOwned: 4,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Summary panel expands each candidate card.',
  },
  {
    id: 'U07',
    name: 'Hiring Manager Chat',
    description: 'Creates short optional rejection targets with a flat completion reward.',
    cost: 50,
    requires: ['U05'],
    minOwned: 5,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'Manager chat docks to the screen edge.',
  },
  {
    id: 'U08',
    name: 'Focus Playlist',
    description:
      'Adds a small amount to the shared passive Credit rate while the player remains active.',
    cost: 70,
    requires: [],
    minOwned: 5,
    kind: 'passive',
    icon: '\u266b',
    desktop: 'Music player and animated level meter appear.',
  },
  {
    id: 'U09',
    name: 'Achievement Feed',
    description: 'Milestones create collectable achievement cards with one-time Credit rewards.',
    cost: 95,
    requires: ['U03'],
    minOwned: 6,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Feed and trophy shelf occupy part of the desktop.',
  },
  {
    id: 'U10',
    name: 'Smart Rejection Templates',
    description: 'Selecting the most defensible rejection template adds a flat decision bonus.',
    cost: 125,
    requires: ['U06'],
    minOwned: 7,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Template picker expands the decision area.',
  },
  {
    id: 'U11',
    name: 'Critical Fit Alerts',
    description: 'Temporary candidate alerts grant a larger bonus when handled before expiry.',
    cost: 160,
    requires: ['U05'],
    minOwned: 9,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Alert ribbon and notification control appear.',
  },
  {
    id: 'U12',
    name: 'Calendar Sync',
    description:
      'Introduces rare interview decisions. An interview resets the streak but can prevent one later event penalty.',
    cost: 210,
    requires: ['U07'],
    minOwned: 10,
    kind: 'exception',
    icon: '\u2691',
    desktop: 'Calendar and meeting reminders remain visible.',
  },
  {
    id: 'U13',
    name: 'ATS Keyword Lens',
    description: 'Short keyword sequences award a combo bonus without creating a new currency.',
    cost: 270,
    requires: ['U06'],
    minOwned: 10,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'Keyword chips accumulate across candidate cards.',
  },
  {
    id: 'U14',
    name: 'Company Broadcast',
    description:
      'Adds to the shared passive Credit rate while publishing irrelevant company updates.',
    cost: 340,
    requires: ['U08'],
    minOwned: 11,
    kind: 'passive',
    icon: '\u266b',
    desktop: 'A ticker occupies the lower desktop edge.',
  },
  {
    id: 'U15',
    name: 'Mira Pro',
    description:
      'Improves Mira bonuses and sometimes presents contradictory concerns that require a choice.',
    cost: 430,
    requires: ['U04', 'U06'],
    minOwned: 12,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Mira gains a portrait, confidence meter and second bubble.',
  },
  {
    id: 'U16',
    name: 'Low-Risk Auto Sort',
    description:
      'Automatically ranks incoming candidates but leaves every final decision to the player. Extreme scores have larger manual rewards.',
    cost: 540,
    requires: ['U13'],
    minOwned: 14,
    kind: 'modifier',
    icon: '\u25ce',
    desktop: 'Animated sorting lane appears beside the queue.',
  },
  {
    id: 'U17',
    name: 'AI Desk Pet',
    description:
      'Active play causes the pet to bring collectable Credit gifts. Gifts expire but never cover essential controls.',
    cost: 680,
    requires: ['U09'],
    minOwned: 15,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Animated pet moves between non-critical surfaces.',
  },
  {
    id: 'U18',
    name: 'Workload Capacity Monitor',
    description:
      'Reveals System Load as Sustainable Capacity and explains the next escalation band. It does not reduce load.',
    cost: 850,
    requires: ['U12'],
    minOwned: 16,
    kind: 'modifier',
    icon: '\u25ce',
    desktop: 'Wellness ring and weekly capacity card appear.',
  },
  {
    id: 'U19',
    name: 'Priority Candidate Radar',
    description:
      'Signals valuable special candidates shortly before they arrive; acknowledging the signal increases their potential reward.',
    cost: 1050,
    requires: ['U11'],
    minOwned: 17,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Radar sweep overlays part of the queue.',
  },
  {
    id: 'U20',
    name: 'Paired Review',
    description:
      'Temporarily presents two candidates as a short comparison sequence with a completion bonus.',
    cost: 1300,
    requires: ['U16'],
    minOwned: 18,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'A second candidate pane narrows the workspace.',
  },
  {
    id: 'U21',
    name: 'Routine Screening Engine',
    description:
      'Rejects routine low-ranked candidates for a reduced base reward and begins spawning appeals. It never increases streak.',
    cost: 1500,
    requires: ['U16'],
    minOwned: 19,
    kind: 'automation',
    icon: '\u2301',
    desktop: 'Automation log scrolls behind candidate panes.',
  },
  {
    id: 'U22',
    name: 'Weekly Quotas',
    description:
      'Adds higher-value timed targets using the existing sprint template. Failure creates an interruption, not a separate penalty resource.',
    cost: 1700,
    requires: ['U07'],
    minOwned: 20,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'Sprint timer and manager reaction remain pinned.',
  },
  {
    id: 'U23',
    name: 'Synthetic Workforce Lab',
    description:
      'Mira generates concerns for automated decisions; the player confirms or challenges them for Credit bonuses.',
    cost: 1900,
    requires: ['U15', 'U21'],
    minOwned: 21,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Concern cloud and confidence chart appear.',
  },
  {
    id: 'U24',
    name: 'Notice Archive',
    description:
      'Clears cosmetic notices automatically but occasionally archives a valuable alert that can be restored for a reward.',
    cost: 2200,
    requires: ['U11'],
    minOwned: 22,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Mail badge, archive animation and undo toast persist.',
  },
  {
    id: 'U25',
    name: 'Moving Quota Board',
    description:
      'Repackages recent actions as moving corporate quotas with larger completion bonuses.',
    cost: 2500,
    requires: ['U18', 'U22'],
    minOwned: 23,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'KPI board occupies a desktop quadrant.',
  },
  {
    id: 'U26',
    name: 'Operations Hub',
    description:
      'Adds 45 passive EC/s and gives every active workflow a shared queue.',
    cost: 2800,
    requires: ['U08'],
    minOwned: 24,
    kind: 'passive',
    icon: '\u266b',
    desktop:
      'A CSS-animated ambient panel and focus quote appear; no video background or separate mixer is required.',
  },
  {
    id: 'U27',
    name: 'Escalated Appeals',
    description:
      'Turns automation appeals into higher-value triage events using the shared exception template.',
    cost: 3000,
    requires: ['U21'],
    minOwned: 25,
    kind: 'exception',
    icon: '\u2691',
    desktop: 'Appeal inbox and unread badge remain open.',
  },
  {
    id: 'U28',
    name: 'Resilience Training',
    description:
      'Occasional coaching prompts can earn one stored prevention of a future late-game event penalty. Current System Load never decreases.',
    cost: 3200,
    requires: ['U18'],
    minOwned: 26,
    kind: 'interrupt',
    icon: '\u2726',
    desktop: 'Coach avatar, affirmation card and resilience score appear.',
  },
  {
    id: 'U29',
    name: 'Parallel Recruiters',
    description:
      'Adds parallel screening workers. Increases batch income, throughput and the frequency of appeals.',
    cost: 3400,
    requires: ['U21'],
    minOwned: 27,
    kind: 'automation',
    icon: '\u2301',
    desktop: 'A second automation lane and throughput graph appear.',
  },
  {
    id: 'U30',
    name: 'Fit Oracle',
    description:
      'Produces cultural-risk predictions; agreeing is quick, while challenging them offers a larger evidence-based reward.',
    cost: 3600,
    requires: ['U23'],
    minOwned: 28,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Oracle window and compatibility constellation appear.',
  },
  {
    id: 'U31',
    name: 'Executive Boardroom',
    description:
      'Converts throughput and active-event performance into executive targets and Credit bonuses. It does not create a second approval currency.',
    cost: 3800,
    requires: ['U25'],
    minOwned: 29,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'Executive scorecard spans the upper desktop.',
  },
  {
    id: 'U32',
    name: 'Screening Council',
    description:
      'Three models debate special candidates; choosing a recommendation resolves the shared choice event for a high reward.',
    cost: 4100,
    requires: ['U23', 'U29'],
    minOwned: 30,
    kind: 'choice',
    icon: '\u25c8',
    desktop: 'Three assistant windows and a consensus meter appear.',
  },
  {
    id: 'U33',
    name: 'Final Handover Protocol',
    description:
      'Begins the final handover. System Load rises until you choose an ending.',
    cost: 4400,
    requires: ['U28', 'U31', 'U32'],
    minOwned: 32,
    kind: 'final',
    icon: '\u25c7',
    desktop: 'Protocol banner and intensified notifications appear.',
  },
  {
    id: 'U34',
    name: 'Burnout Readiness Certification',
    description:
      'Activates `Take a Break` and can provide one prevention of a marked final-pressure penalty. It does not reduce System Load.',
    cost: 4700,
    requires: ['U33'],
    minOwned: 33,
    kind: 'sprint',
    icon: '\u2197',
    desktop: 'Certificate, learning window and confetti remain.',
  },
  {
    id: 'U35',
    name: 'HR Autopilot',
    description:
      'Removes one routine confirmation, increases special-case density and unlocks the ending purchase.',
    cost: 5000,
    requires: ['U33', 'U34'],
    minOwned: 34,
    kind: 'automation',
    icon: '\u2301',
    desktop: 'Human controls shrink while automation status expands.',
  },
];
export const config = {
  tickMs: 250,
  economy: {
    specialMultiplier: 1.6,
    lowMatchThreshold: 55,
    highMatchThreshold: 90,
    matchBonusRatio: 0.25,
    sortBonusRatio: 0.3,
    evidenceBonusRatio: 0.5,
    interviewRewardMultiplier: 3,
    milestoneEvery: 10,
    milestoneMultiplier: 2,
    eventMultiplier: { sprint: 5, exception: 4, choice: 3, interrupt: 3 },
    passiveRates: { focus: 2, news: 10, ambient: 45 },
    automationRates: { routine: 1, pipeline: 4, final: 15 },
    automationRewards: { routine: 12, final: 3 },
    protocolRewardMultiplier: 4,
  },
  protocolDurationMs: 120000,
  manualBase: [1, 3, 8, 18, 35, 65, 110],
  streakTiers: [
    { at: 0, mult: 1 },
    { at: 10, mult: 1.25 },
    { at: 25, mult: 1.5 },
    { at: 60, mult: 2 },
    { at: 120, mult: 3 },
  ],
  finalBaseLoad: 72,
  finalLoadPerSecond: 0.12,
  finalMissPenalty: 3,
  riskyActionPenalty: 0.35,
  warnings: [80, 90, 96],
  e01Cost: 8000,
  eventIntervalMs: 14000,
  appealIntervalMs: 38000,
  protocolEventIntervalMs: 20000,
  eventDurationMs: 32000,
  interviewDelayCandidates: 4,
} as const;
