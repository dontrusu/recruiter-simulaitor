import { deskItems, deskCost } from './desk';
import * as g from './engine';
export type Profile = 'basic' | 'active' | 'optimized' | 'interview-heavy' | 'passive';
export function simulate(seed: string, profile: Profile) {
  let s = g.createGame(seed);
  let nextReview = 0;
  let finalAt = 0;
  let maxGap = 0;
  let lastPurchase = 0;
  const pace = profile === 'optimized' ? 6500 : profile === 'basic' ? 10000 : 8000;
  for (let t = 0; t < 2400000 && s.status === 'running'; t += 1000) {
    s = g.tick(s, 1000);
    if (s.ending) break;
    for (const e of [...s.events])
      if (e.template !== 'sprint' && (e.blocking || e.protocol || profile !== 'passive')) {
        if (profile === 'basic' && !e.blocking && !e.protocol && t % 3 !== 0) continue;
        s = g.resolveEvent(s, e.id, profile === 'basic' ? 0 : (e.best ?? 0));
      }
    if (s.elapsedMs >= nextReview && (profile !== 'passive' || !g.has(s, 'U08'))) {
      if (profile === 'interview-heavy' && g.candidateDecisionAvailable(s, 'interview'))
        s = g.interview(s);
      else s = g.reject(s);
      nextReview = s.elapsedMs + pace;
    }
    // Reinvest in producers as the workplace grows. This models buying from both tabs.
    const targetLevel = Math.min(5, 1 + Math.floor(s.owned.length / 8));
    const investment = deskItems.find(
      (item) =>
        item.rate > 0 &&
        s.owned.length >= item.minOwned &&
        (s.desk[item.id] ?? 0) < targetLevel &&
        deskCost(item, s.desk[item.id] ?? 0) <= s.credits,
    );
    if (investment) s = g.buyDesk(s, investment.id);
    if (profile === 'optimized' || profile === 'active') {
      if (s.operations.brew.startedAt === null) s = g.operateStation(s, { type: 'brew-start' });
      else if (s.elapsedMs - s.operations.brew.startedAt >= 2000)
        s = g.operateStation(s, { type: 'brew-release' });
    }
    const offer = g.offers(s).find((u) => u.cost <= s.credits);
    if (offer) {
      s = g.purchase(s, offer.id);
      maxGap = Math.max(maxGap, s.elapsedMs - lastPurchase);
      lastPurchase = s.elapsedMs;
      if (offer.id === 'U33') finalAt = s.elapsedMs;
    }
    if (g.corporateReady(s)) s = g.confirm(g.beginConfirmation(s, 'corporate'));
  }
  return {
    seed,
    profile,
    ending: s.ending,
    minutes: s.elapsedMs / 60000,
    finalMinute: finalAt / 60000,
    maxPurchaseGap: maxGap / 1000,
    manual: s.manualRejects,
    automatic: s.automaticRejects,
    specials: s.usedSpecials.length,
    interviews: s.interviews,
    income: s.income,
    passiveShare: (s.income.passive + s.income.automatic) / Math.max(1, s.earned),
    desk: s.desk,
    purchaseTimes: s.purchaseTimes,
    owned: s.owned.length,
  };
}
