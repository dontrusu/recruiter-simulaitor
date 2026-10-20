# Incremental Game Progression: Observable Patterns and Talent.OS Hypotheses

**Scope:** Compare three incrementals through first-party playable games, in-game help, and developer-maintained source. The set covers an economy that expands from manual input to automation (*Universal Paperclips*), narrative and settlement transformation (*A Dark Room*), and layered optimization with configurable automation (*Antimatter Dimensions*). Each title was selected because primary materials for its relevant mechanics were available. This is a design comparison, not evidence that any mechanic causes engagement.

## Universal Paperclips

### Observable mechanics

The browser game opens with a “Make Paperclip” button and a small business: clips can be sold, wire is bought, and players can adjust clip pricing and marketing. Purchasable AutoClippers and later factories/drones shift production from individual clicks to automated manufacturing. Its project source defines gated upgrades, including automated wire buying, strategy tournaments, investments, matter harvesting, factories, and probe exploration. The visible game and source show the system changing from office-scale manufacturing to an autonomous, spacefaring production network. [Official playable game](https://www.decisionproblem.com/paperclips/index2.html) · [Official project definitions](https://www.decisionproblem.com/paperclips/projects.js?v3) · [Official game state](https://www.decisionproblem.com/paperclips/globals.js?v3)

### Choices, goals, and resets

Choices persist after clicking becomes less central: set prices, allocate processing and memory capacity, choose investment risk, select strategies for tournaments (or automate tournaments), and distribute probe trust across speed, exploration, replication, hazard response, and production. The listed projects shift the goal from selling a profitable product to expanding production, then toward probes and exploration; the script includes endgame choices to accept/reject an outcome or restart in a neighboring/simulated universe with a stated bonus. These are observed game rules, not proof that the escalating stakes motivate players. [Official game interface](https://www.decisionproblem.com/paperclips/index2.html) · [Official projects](https://www.decisionproblem.com/paperclips/projects.js?v3) · [Official main game script](https://www.decisionproblem.com/paperclips/main.js?v3)

### Creator intent

The game's own staged project text and interface are primary evidence of how its fictional goals and mechanisms are presented. I did not locate a first-party developer essay or talk explaining the intended effect of those transitions; interpreting them as a critique or as an “engagement hook” would go beyond the reviewed evidence.

### Player evidence

No systematic player research was located in the first-party materials reviewed. The game and its code establish mechanics, not how players respond to them.

## A Dark Room

### Observable mechanics

The developer-maintained repository describes the game as a minimalist text adventure. Its code begins with the room/fire loop; the forest then introduces gathering, traps, huts, population, and work assignments. Workers generate and convert resources over time, while the player can reassign them. Later, the path and world introduce travel, supply choices, and direct combat. The player moves among distinct contexts rather than only buying production multipliers. [Developer README and play link](https://github.com/doublespeakgames/adarkroom/blob/main/README.md) · [Room mechanics](https://github.com/doublespeakgames/adarkroom/blob/main/script/room.js) · [Forest, population, and workers](https://github.com/doublespeakgames/adarkroom/blob/main/script/outside.js) · [Travel and supply choices](https://github.com/doublespeakgames/adarkroom/blob/main/script/path.js) · [World mechanics](https://github.com/doublespeakgames/adarkroom/blob/main/script/world.js)

### Choices, goals, and resets

Active decisions include how to use scarce resources, which production jobs villagers perform, what to carry, and when to embark and fight. What begins as maintaining a room opens into settlement management and a journey with a different immediate goal. On completion, the source saves a score and a reduced, randomized selection of stores for the previous run, clears the current save, and offers a restart. This is a limited carryover/reset, not an endless prestige ladder. [Worker allocation and income](https://github.com/doublespeakgames/adarkroom/blob/main/script/outside.js) · [End sequence](https://github.com/doublespeakgames/adarkroom/blob/main/script/space.js) · [Stored carryover](https://github.com/doublespeakgames/adarkroom/blob/main/script/prestige.js)

### Creator intent

The first-party README calls it a “minimalist text adventure game.” That supports the developer's framing, but I did not locate a first-party design essay or talk describing why the progression, worker roles, or reset work as they do. Claims about intended player psychology would be speculative.

### Player evidence

No systematic player research was located in the developer materials reviewed. Source-code mechanics do not establish whether changing context, worker assignment, or carryover improves engagement.

## Antimatter Dimensions

### Observable mechanics

The playable game's built-in **How To Play** guide explains its systems as they unlock; open the `?` help control and select a topic. At the start, players buy Antimatter Dimensions and Tickspeed upgrades; production feeds higher tiers. Dimension Boosts reset dimensions to unlock a higher tier and strengthen the first, while Antimatter Galaxies reset dimensions and boosts in exchange for stronger Tickspeed upgrades. The in-game guide also documents Autobuyers for dimensions, upgrades, and prestiges. [Official playable game and in-game guide](https://ivark.github.io/AntimatterDimensions/)

### Choices, goals, and resets

Automation can be configured rather than simply switched on: the guide documents intervals, single-versus-bulk purchasing, limits and thresholds for Boost/Galaxy buyers, prestige triggers, and global pause/enable controls. Thus some active choices migrate from repeatedly purchasing to tuning rules and deciding how to sequence resets and unlocks. The guide's later-game entries are unlocked progressively; the available game materials support describing layered resets and autobuyer settings, but not a full claim about every late-game strategy. [Official playable game, “How To Play” entries for Dimension Boosts, Antimatter Galaxies, and Autobuyers](https://ivark.github.io/AntimatterDimensions/)

### Creator intent

The first-party in-game guide says it provides explanations for mechanics as they are encountered. I did not locate a creator talk or essay that claims configurable automation or reset layers improve engagement. The guide is documentation, not a player-outcome study.

### Player evidence

No systematic player research was located in the primary materials reviewed. Detailed options and unlocks show what players can do, not whether complexity, automation, or repeated resets are enjoyable or accessible.

## Cross-game observations and boundaries

- Across the three, automation changes the **kind** of active work: from repeated production to balancing a system, assigning roles, configuring rules, or responding to a new context. It does not eliminate all decisions in these examples.
- Goals can be reframed by newly unlocked systems or settings, but the comparisons do not establish that surprise, escalation, or a longer progression is engaging.
- Resets vary: *A Dark Room* carries limited score/resources into a restart; *Antimatter Dimensions* repeatedly exchanges current progress for stronger progression; *Universal Paperclips* includes explicit endgame restart choices. They are not interchangeable templates.
- These first-party sources describe mechanics and, in places, the game's own framing. I found no systematic primary player research for these titles in this research pass. This is a search limit, not evidence that no research exists. No “hook” or causal engagement claim is warranted.

## Talent.OS hypotheses to test — not decisions

1. **Routine-to-automation transition:** A manual CV-review loop might gradually automate familiar cases while leaving policy-setting, explanations, and unusual cases active. Test whether players understand what automation handles and what it changes; the comparisons do not prove this is engaging.
2. **Exceptions with a legible reason:** A candidate-specific exception or optional mini-game might provide a distinct active task, if its trigger and consequence make sense in context. Test whether it feels meaningful rather than arbitrary or interruptive.
3. **Useful systems with rising overhead:** Accumulating workflow tools could increase capability while making their effects, dependencies, or workspace footprint harder to track. Test whether players can still understand and manage the system. A single spendable Credits currency remains a constraint; these games' extra resources are not a reason to add currencies.
4. **Shifting institutional stakes:** The work could change from reviewing individual candidates to handling the consequences of metrics, throughput, and automation. Test whether satire targets institutional incentives while candidate details remain human, rather than treating applicants as punchlines.

These are prototype questions only. Playtests would be needed to assess comprehension, perceived agency, interruption cost, pacing, and player response; this comparison does not select mechanics or settle the loop.

## Primary sources

- *Universal Paperclips*: [official playable game](https://www.decisionproblem.com/paperclips/index2.html), [project definitions](https://www.decisionproblem.com/paperclips/projects.js?v3), [main game script](https://www.decisionproblem.com/paperclips/main.js?v3), [game state](https://www.decisionproblem.com/paperclips/globals.js?v3).
- *A Dark Room*: [developer-maintained repository and README](https://github.com/doublespeakgames/adarkroom), [room](https://github.com/doublespeakgames/adarkroom/blob/main/script/room.js), [outside/workers](https://github.com/doublespeakgames/adarkroom/blob/main/script/outside.js), [path](https://github.com/doublespeakgames/adarkroom/blob/main/script/path.js), [world](https://github.com/doublespeakgames/adarkroom/blob/main/script/world.js), [space/end sequence](https://github.com/doublespeakgames/adarkroom/blob/main/script/space.js), [prestige/carryover](https://github.com/doublespeakgames/adarkroom/blob/main/script/prestige.js).
- *Antimatter Dimensions*: [official playable game and built-in How To Play documentation](https://ivark.github.io/AntimatterDimensions/).
