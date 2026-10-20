# Incremental-Game Activity Archetypes: Passive, Persistent, and Automated

**Scope:** Compare observable activity and income mechanics in incremental games. These examples can inform Talent.OS progression, but do not establish which systems players enjoy.

## Comparison

| Activity pattern | First-party example | Observable mechanics |
|---|---|---|
| Passive production alongside active income | **Cookie Clicker** | Buildings generate cookies per second while clicking the large cookie directly earns cookies. The Garden and Grimoire add player-operated minigames/actions with cookie or related effects. The reviewed client defines these activities; I did not identify a native auto-clicking mechanic in the reviewed sources. [Official game](https://orteil.dashnet.org/cookieclicker/) · [official client](https://orteil.dashnet.org/cookieclicker/main.js) · [Garden code](https://orteil.dashnet.org/cookieclicker/minigameGarden.js) · [Grimoire code](https://orteil.dashnet.org/cookieclicker/minigameGrimoire.js) |
| Passive preparation plus a player-operated burst | **Kittens Game** | Hunter jobs produce catpower over time; a player-triggered Hunt spends that resource and awards resources including furs, ivory, and unicorns. The developer README explicitly says active play should be encouraged but “not an absolute requirement,” and mentions trade as another response to fur needs. This demonstrates coexistence, not that hunting is always the main income. [Developer README](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/README.md) · [hunting code](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/village.js) · [English game text](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/res/i18n/en.json) |
| Selective routine automation | **Trimps** | The interface exposes resource gathering and per-second production alongside AutoJobs and AutoFight. Its tutorial describes configuring maps to repeat and automatically return to the world. Specific routines are automated while the interface continues to expose resource, map, and other choices. [Developer-maintained game client](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/index.html) · [tutorial and automation text](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/objects.js) |
| Manual production evolving into automated production | **Universal Paperclips** | The game moves from manual clicking and business decisions into AutoClippers, factories, drones, and other automated production. Choices continue around allocation, strategy, and later systems; it is not simply a global switch from active to idle. [Official game](https://www.decisionproblem.com/paperclips/index2.html) · [official project definitions](https://www.decisionproblem.com/paperclips/projects.js?v3) · [existing comparison](./incremental-game-engagement-patterns.md) |
| Configurable automation | **Antimatter Dimensions** | In-game help documents autobuyer intervals, bulk purchases, thresholds, prestige triggers, and global controls. Repeated purchases can be delegated while the player configures automation and progression. [Official game and help](https://ivark.github.io/AntimatterDimensions/) · [existing comparison](./incremental-game-engagement-patterns.md) |
| Passive workers alongside activities that remain active | **A Dark Room** | Workers generate and convert resources over time, while players can reassign them and later travel, choose supplies, and fight. The game's activities do not all become one automatically repeated action. [Developer-maintained repository](https://github.com/doublespeakgames/adarkroom) · [existing comparison](./incremental-game-engagement-patterns.md) |
| Active collection later automated | **Stimulation Clicker** | The Hydraulic Press begins as a Start/Collect interaction that awards stimulation; a later Auto Hydraulics purchase automates collection. Other purchases create passive production streams. This is an example of one activity changing from manual to automated, not a rule for every activity. [Official game](https://neal.fun/stimulation-clicker/) · [source and detailed notes](./stimulation-clicker-patterns.md) |

## What the examples establish

- A game can combine passive income, manually played activities, and automated routines; these are separate design dimensions rather than mutually exclusive genres.
- Automation can target one routine while other activities remain player-operated. It need not erase all active play.
- A modest passive contribution can coexist with an active reward, but the sources do not establish a generally preferred income ratio. Nor do they show that a hands-on activity must later be automated.
- *Kittens Game*'s developer explicitly frames active play as encouraged but not absolutely required. This is one creator-stated design principle, not evidence that every optional activity or economy works equally well.
- The existing Talent.OS code already includes passive station rates as well as active Coffee, Network, and Probe mechanics. The user enjoys those three distinct activity types and leans toward a small passive effect plus a noticeable active reward where appropriate, while allowing some other systems to automate. This is a design preference to evaluate per activity, not a research-derived requirement.

## Questions for Talent.OS

1. Which activity should remain directly player-operated throughout the run, and which routine (if any) should later be automated?
2. Does each activity have a clear active reward distinct from its passive contribution?
3. Can a player understand what produces Credits, what requires interaction, and what is optional?
4. How much does missing or ignoring an activity change purchase pace, without blocking progress?

## Limits

These first-party sources verify mechanics and, for *Kittens Game*, one developer-stated principle. They do not establish player preferences, engagement effects, the ideal active/passive income split, or whether these patterns fit Talent.OS. The Cookie Clicker source check does not establish a typical player's income distribution. Automation details are version-specific. NGU Idle, Melvor Idle, and Realm Grinder were not included because the relevant mechanics were not verified against suitable primary sources in this research pass.

## Primary sources

- Cookie Clicker: [official game](https://orteil.dashnet.org/cookieclicker/), [client](https://orteil.dashnet.org/cookieclicker/main.js), [Garden](https://orteil.dashnet.org/cookieclicker/minigameGarden.js), [Grimoire](https://orteil.dashnet.org/cookieclicker/minigameGrimoire.js).
- Kittens Game: [developer README](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/README.md), [village code](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/village.js), [English game text](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/res/i18n/en.json).
- Trimps: [game client](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/index.html), [tutorial text](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/objects.js).
- Universal Paperclips: [official game](https://www.decisionproblem.com/paperclips/index2.html), [projects](https://www.decisionproblem.com/paperclips/projects.js?v3).
- Antimatter Dimensions: [official game and help](https://ivark.github.io/AntimatterDimensions/).
- A Dark Room: [developer-maintained repository](https://github.com/doublespeakgames/adarkroom).
- Stimulation Clicker: [official game](https://neal.fun/stimulation-clicker/).
