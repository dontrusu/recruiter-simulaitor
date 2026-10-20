import type { UpgradeId } from '../game/config';
export type EventCopy = {
  title: string;
  detail: string;
  options?: string[];
  best?: number;
  target?: number;
  prevention?: boolean;
};
export const eventCopy: Partial<Record<UpgradeId, EventCopy>> = {
  U02: {
    title: 'Decision received',
    detail: 'Your response time has been added to the team average.',
    options: ['Collect acknowledgement'],
  },
  U04: {
    title: 'Mira needs a second opinion',
    detail:
      'The résumé links to a shipped project. The model found no matching keyword in its title.',
    options: ['Inspect the shipped work', 'Trust the keyword filter'],
    best: 0,
  },
  U06: {
    title: 'Three claims. One source.',
    detail:
      'The summary says “led migration”. The source says “reviewed the migration proposal”. Which claim can we defend?',
    options: ['Led the migration', 'Reviewed the proposal', 'Owned the whole platform'],
    best: 1,
  },
  U07: {
    title: 'A small favour from your manager',
    detail: 'Three reviews would clear this batch before the next meeting.',
    target: 3,
  },
  U09: {
    title: 'Consistency recognised',
    detail:
      'Your latest milestone has earned a place on the shelf. Please collect your recognition.',
    options: ['Accept achievement'],
  },
  U10: {
    title: 'Select a defensible template',
    detail:
      'This role requires production incident response. The application only describes a training exercise.',
    options: ['Insufficient production evidence', 'Not a culture fit', 'Too much potential'],
    best: 0,
  },
  U11: {
    title: 'A fit alert is about to disappear',
    detail:
      'The evidence attachment was filed under “other”. Acknowledging it preserves the review bonus.',
    options: ['Acknowledge evidence'],
  },
  U12: {
    title: 'Calendar conflict',
    detail:
      'A hiring manager moved an interview into the candidate’s existing meeting. The calendar considers this alignment.',
    options: ['Find a mutual time', 'Send the conflicting invite'],
    best: 0,
  },
  U13: {
    title: 'Keyword review batch',
    detail:
      'Review two profiles using the highlighted evidence. Human decisions are still required.',
    target: 2,
  },
  U15: {
    title: 'Mira Pro disagrees with Mira Lite',
    detail:
      'Lite flags “too specialised”. Pro flags “insufficient focus”. Both cite the same project.',
    options: ['Request source evidence', 'Average the confidence scores'],
    best: 0,
  },
  U17: {
    title: 'Your desk companion brought something',
    detail: 'A small gift with no attached performance objective. Finance is investigating.',
    options: ['Accept gift'],
  },
  U19: {
    title: 'Radar: a profile worth reading',
    detail: 'A candidate with verifiable delivery evidence is approaching the queue.',
    options: ['Flag for human review'],
  },
  U20: {
    title: 'Two profiles, one standard',
    detail: 'Apply the same review standard to the next two candidates.',
    target: 2,
  },
  U21: {
    title: 'Automated rejection appealed',
    detail:
      'The candidate attached the exact evidence the sorter said was missing. Throughput is paused pending your review.',
    options: ['Restore candidate', 'Uphold with review'],
    best: 0,
  },
  U22: {
    title: 'Manager sprint: clear the bottleneck',
    detail:
      'Four reviews before the timer ends. The manager has already scheduled the next sprint.',
    target: 4,
  },
  U23: {
    title: 'A concern looking for evidence',
    detail:
      'The gap generator flagged “no ownership”. The application names the service, deployment and incident review.',
    options: ['Confirm the generated gap', 'Challenge with source evidence'],
    best: 1,
  },
  U24: {
    title: 'Important mail archived',
    detail: 'Inbox Zero cleared a candidate’s correction along with the newsletters.',
    options: ['Restore the correction'],
  },
  U25: {
    title: 'The wall needs a better number',
    detail: 'Complete three reviews. The graph will describe this as sustainable growth.',
    target: 3,
  },
  U27: {
    title: 'Appeal with a receipt',
    detail:
      'The applicant included the original job description. It differs from the one used by automation.',
    options: ['Review against original criteria', 'Apply the revised criteria'],
    best: 0,
  },
  U28: {
    title: 'Resilience is a process',
    detail:
      'Reserve one escalation waiver. It prevents a future penalty; it cannot undo existing System Load.',
    options: ['Reserve escalation waiver'],
    prevention: true,
  },
  U29: {
    title: 'Two lanes, one unresolved case',
    detail:
      'Both pipelines rejected the same application for opposite reasons. Processing is paused.',
    options: ['Compare the source records', 'Keep the faster decision'],
    best: 0,
  },
  U30: {
    title: 'The oracle predicts misalignment',
    detail:
      'Its prediction is based on the candidate asking how decisions are made. No job evidence supports the risk.',
    options: ['Accept prediction', 'Challenge the evidence'],
    best: 1,
  },
  U31: {
    title: 'Executive visibility window',
    detail: 'Leadership is watching the next three reviews. The dashboard calls this trust.',
    target: 3,
  },
  U32: {
    title: 'The screening council is divided',
    detail:
      'Model A read the résumé. B read A’s summary. C counted agreement. Choose the recommendation with a source.',
    options: ['A · original evidence', 'B · compressed summary', 'C · majority confidence'],
    best: 0,
  },
  U34: {
    title: 'Complete your resilience certification',
    detail:
      'Two reviews demonstrate readiness to stop reviewing. Completing this task grants one escalation waiver.',
    target: 2,
    prevention: true,
  },
  U35: {
    title: 'Human oversight is almost removed',
    detail: 'One final routing exception needs the human whose role is being retired.',
    options: ['Document the exception', 'Approve without a record'],
    best: 0,
  },
};
export const protocolCopy = [
  {
    template: 'exception' as const,
    title: 'Handover 1 · disputed decision',
    detail:
      'An automated rejection conflicts with the candidate evidence. Resolve the case to release your handover.',
    options: ['Restore candidate', 'Uphold rejection'],
  },
  {
    template: 'choice' as const,
    title: 'Handover 2 · capacity statement',
    detail: 'Choose the capacity statement to leave for your successor.',
    options: ['Record actual capacity', 'Record projected resilience'],
    best: 0,
  },
  {
    template: 'sprint' as const,
    title: 'Handover 3 · final review',
    detail:
      'Review three more candidates to close the protocol. Full automation remains an explicit decision.',
    target: 3,
  },
];
export const miraCopy = [
  'A careful first pass is a good place to start.',
  'Your consistency is creating a useful pattern.',
  'Every new tool gives you back time. Please spend it here.',
  'The workload is becoming more visible. This is an improvement.',
  'Automation is freeing you to handle its exceptions.',
  'Your capacity concerns have been filed under personal development.',
  'I can take it from here.',
];
export const endingCopy = {
  break: {
    label: 'AWAY',
    title: 'You took a break.',
    line: 'For a moment, nothing needs your attention.',
    detail:
      'The queue continued. You did not. Talent.OS has classified this as an engagement opportunity.',
  },
  burnout: {
    label: 'RECOVERY REQUIRED',
    title: 'Capacity exceeded.',
    line: 'The system found your limit. Then moved the target.',
    detail:
      'A mandatory productivity recovery period has been assigned. No further action is required from you.',
  },
  corporate: {
    label: 'AUTONOMOUS MODE',
    title: 'Your work here is done.',
    line: 'Every decision is automated. Including the decision to keep you.',
    detail:
      'Talent.OS now handles every candidate and every exception it creates. Human oversight has been successfully removed.',
  },
};
