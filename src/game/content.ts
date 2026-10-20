import { profileFallbacks, skillLabels } from '../content/profile-fallbacks';
import { archetypes, roles as roleDefinitions } from '../../spec/candidate-core-data';
import {
  candidateNames,
  candidateDecisionFragments,
  candidateDecisionTextEn,
} from '../../spec/candidate-decision-content';
import {
  candidateProfileFragments,
  candidateProfileTextEn,
} from '../../spec/candidate-profile-fragments';
import { specialCandidates, specialCandidateTextEn } from '../../spec/special-candidate-content';

export type CandidateView = {
  id: string;
  name: string;
  role: string;
  seniority: string;
  location: string;
  years: number;
  summary: string;
  evidence: string;
  skills: string[];
  match: number;
  strong: boolean;
  special: boolean;
  interviewEligible: boolean;
  concern: string;
  specialId?: string;
  options?: { id: string; label: string; decision: string; followUp: string; flags: string[] }[];
};
const roles = roleDefinitions.map((r) =>
  r.id
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' '),
);
const roleIds: readonly string[] = roleDefinitions.map((r) => r.id);
const skills = roleDefinitions.map((r) =>
  r.coreSkillIds.slice(0, 3).map((v) => skillLabels[v] ?? v.replaceAll('-', ' ')),
);
const reservedTags = [
  'remote-only',
  'office-only',
  'returning-candidate',
  'appeal',
  'internal-referral',
  'executive-referral',
  'requirement-mutated',
];
const fragmentPool = candidateProfileFragments.filter(
  (f) =>
    f.kind === 'experience' &&
    f.salience !== 'punchline' &&
    !f.tags.some((tag) => reservedTags.includes(tag)),
);
const achievementPool = candidateProfileFragments.filter(
  (f) => f.kind === 'achievement' && f.salience !== 'punchline',
);
const concerns = candidateDecisionFragments.filter(
  (f) => f.kind === 'concern' && f.salience !== 'punchline',
);
function hash(seed: string, n: number) {
  let h = 2166136261;
  for (const c of `${seed}:${n}`) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function candidateFor(
  seed: string,
  index: number,
  owned: string[],
  usedSpecials: string[] = [],
  flags: string[] = [],
): CandidateView {
  const h = hash(seed, index);
  const currentStage = Math.min(7, Math.floor(owned.length / 5) + 1);
  const pool = specialCandidates.filter(
    (s) =>
      !usedSpecials.includes(s.id) &&
      s.stageRange[0] <= currentStage &&
      s.stageRange[1] >= currentStage &&
      (s.prerequisites ?? []).every((id) => owned.includes(id)) &&
      (s.requiredStoryFlags ?? []).every((f) => flags.includes(f)) &&
      !(s.excludedByStoryFlags ?? []).some((f) => flags.includes(f)),
  );
  if (usedSpecials.length < 8 && owned.length >= 4 + usedSpecials.length * 4 && pool.length) {
    const s = pool[h % pool.length];
    const b = s.candidate;
    return {
      id: `special-${s.id}`,
      specialId: s.id,
      name: b.fixedDisplayName ?? `Applicant ${index + 1}`,
      role: roles[roleIds.indexOf(b.roleId)],
      seniority: b.seniority,
      location: b.locationMode,
      years: b.yearsExperience,
      summary: specialCandidateTextEn[s.introCopyEntryId],
      evidence: `${b.yearsExperience} years of experience. Evidence submitted for ${b.skillIds.slice(0, 3).join(', ')}.`,
      skills: b.skillIds.slice(0, 3).map((v) => skillLabels[v] ?? v.replaceAll('-', ' ')),
      match: b.presentedMatchScore ?? b.actualFit,
      strong: b.actualFit >= 85,
      special: true,
      interviewEligible: b.interviewEligible,
      concern: 'A human review is required before the model can close this case.',
      options: s.options.map((o) => ({
        id: o.id,
        label: specialCandidateTextEn[o.labelKey],
        decision: o.decision,
        followUp:
          specialCandidateTextEn[s.followUps!.find((f) => f.id === o.followUpId)!.copyEntryIds[0]],
        flags: [...(o.addStoryFlags ?? [])],
      })),
    };
  }
  // A seeded permutation of the Cartesian name pool: no exhausted 100-name list.
  const names = candidateNames.map((n) => n.displayName);
  const firsts = [...new Set(names.map((n) => n.split(' ')[0]))];
  const lasts = [...new Set(names.map((n) => n.split(' ').slice(1).join(' ')))];
  const serial = index + (hash(seed, 0) % firsts.length);
  const name = `${firsts[serial % firsts.length]} ${lasts[Math.floor(serial / firsts.length) % lasts.length]}${serial >= firsts.length * lasts.length ? ' ' + (Math.floor(serial / (firsts.length * lasts.length)) + 1) : ''}`;
  const eligible = archetypes.filter(
    (a) => a.stageRange[0] <= currentStage && a.stageRange[1] >= currentStage,
  );
  const archetype = eligible[(index + hash(seed, 1)) % eligible.length];
  const roleId = archetype.compatibleRoleIds[h % archetype.compatibleRoleIds.length];
  const roleIndex = roleIds.indexOf(roleId);
  const match =
    archetype.actualFit.minimum +
    (h % (archetype.actualFit.maximum - archetype.actualFit.minimum + 1));
  const trait = archetype.requiredTags[0];
  const allowed = archetype.compatibleSeniorities.filter((v) =>
    (roleDefinitions[roleIndex].allowedSeniorities as readonly string[]).includes(v),
  );
  const seniority = allowed[h % allowed.length] ?? roleDefinitions[roleIndex].allowedSeniorities[0];
  const compatible = (items: typeof fragmentPool) =>
    items.filter(
      (f) =>
        (!f.compatibleRoleIds || f.compatibleRoleIds.includes(roleIds[roleIndex])) &&
        (!f.compatibleSeniorities || f.compatibleSeniorities.includes(seniority)) &&
        (seniority !== 'junior' ||
          !f.tags.some((t) => ['leadership', 'overqualified', 'long-tenure'].includes(t))) &&
        !f.incompatibleTags?.some((t) => (archetype.requiredTags as readonly string[]).includes(t)),
    );
  const relevant = compatible(fragmentPool).filter((f) =>
    f.tags.includes(trait as (typeof f.tags)[number]),
  );
  const experienceBase = relevant;
  const roleSpecific = experienceBase.filter((f) =>
    f.compatibleRoleIds?.includes(roleIds[roleIndex]),
  );
  const experience = roleSpecific.length ? roleSpecific : experienceBase;
  const achievementBase = compatible(achievementPool).filter((f) =>
    f.tags.some((t) => (archetype.requiredTags as readonly string[]).includes(t)),
  );
  const roleAchievements = achievementBase.filter((f) =>
    f.compatibleRoleIds?.includes(roleIds[roleIndex]),
  );
  const achievements = roleAchievements.length ? roleAchievements : achievementBase;
  const selectedConcerns = concerns.filter((f) =>
    f.tags.includes(trait as (typeof f.tags)[number]),
  );
  const frag = experience[(h >>> 5) % experience.length];
  const achievement = achievements[(h >>> 8) % achievements.length];
  const concern = (selectedConcerns.length ? selectedConcerns : concerns)[
    (h >>> 11) % (selectedConcerns.length || concerns.length)
  ];
  return {
    id: `routine-${index}`,
    name,
    role: roles[roleIndex],
    seniority,
    location: ['Remote', 'Hybrid', 'Office'][(h >>> 4) % 3],
    years:
      archetype.yearsExperience.minimum +
      (h % (archetype.yearsExperience.maximum - archetype.yearsExperience.minimum + 1)),
    summary: frag ? candidateProfileTextEn[frag.textKey] : profileFallbacks[roleId].experience,
    evidence: achievement
      ? candidateProfileTextEn[achievement.textKey]
      : profileFallbacks[roleId].evidence,
    skills: skills[roleIndex],
    match,
    strong: match >= 86,
    special: false,
    interviewEligible: false,
    concern: selectedConcerns.length
      ? candidateDecisionTextEn[concern.textKey]
      : 'The available evidence needs to be compared with the actual requirements before assigning a concern.',
  };
}
