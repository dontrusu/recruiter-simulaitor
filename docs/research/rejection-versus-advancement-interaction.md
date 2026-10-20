# Rejection or Advancement in the Candidate Review Loop

**Scope:** Research whether forwarding a candidate is a meaningful real-world hiring decision and what that implies for Talent.OS. This research can inform the design choice, but cannot establish which mechanic is fun.

## Evidence

### Forwarding is a distinct hiring decision

- In the U.S. federal hiring process described by USAJOBS, an agency reviews eligibility and qualifications, places qualified applicants into categories, and sends the highest-qualified applications to a hiring official. That official reviews them and selects candidates to interview; selection and a job offer happen later. Forwarding is therefore a handoff for further review, not a hire. This is one official workflow, not a universal recruiting model. [USAJOBS Help Center, “How does the application process work?”](https://usajobshelp.opm.gov/hc/en-us/articles/52846644688019-How-does-the-application-process-work)
- USAJOBS separately describes “referred or not referred” as whether an application is sent to the hiring manager, who may then review it and schedule an interview. This reinforces that “refer” can be communicated as a clear, bounded action distinct from interviewing or hiring. [USAJOBS Help Center, “How long does it take to get a federal job?”](https://usajobshelp.opm.gov/hc/en-us/articles/52840180365459-How-long-does-it-take-to-get-a-federal-job)

### Screening criteria should be job-related and consistently applied

- The U.S. Office of Personnel Management frames assessment strategy around reliability, validity, and the relationship between assessment methods and job requirements. Its structured-interview guidance recommends predetermined questions and consistent rating standards across candidates. These are official federal practices, not a claim that every employer follows them. [OPM, “Assessment Strategy”](https://www.opm.gov/policy-data-oversight/assessment-and-selection/assessment-strategy/); [OPM, “Structured Interviews”](https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/)
- The EEOC explains that selection procedures used to screen applicants may raise discrimination concerns if they disproportionately exclude protected groups without legal justification, and discusses job-relatedness and business necessity. DOJ guidance similarly warns that hiring technologies can unfairly screen out qualified people with disabilities. These U.S. sources ground satire about rigid, poorly justified, inconsistent, or inaccessible filters; they do not prove that unrealistic requirements are prevalent or that most strong applicants fail them. [EEOC, “Employment Tests and Selection Procedures”](https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures); [DOJ, “Algorithms, Artificial Intelligence, and Disability Discrimination in Hiring”](https://www.ada.gov/resources/ai-guidance/)

## Design implications for Talent.OS

These are design hypotheses, not findings about player engagement:

- A player-facing **“refer to the hiring manager”** action has a legible real-world analogue. It could create contrast with a rejection-focused performance culture, but is not required for a recognizable hiring process.
- A reject-centric loop fits the stated satire of being praised for repeatedly rejecting strong applicants. Its risk is that the interaction could become a repetitive button press unless each review contributes a small, legible moment of recognition or humor.
- An explicit referral could add agency, but could also shift the focus toward rescuing individual candidates or managing a case pipeline. That may conflict with the preferred fast rhythm and simple controls.
- The current exploratory mechanic—inspect a strong profile, choose a bureaucratic reason that fits a narrow mismatch, then reject—may itself supply the per-candidate interaction. Whether a separate referral choice helps should be tested without changing that mechanic, its rewards, or pacing at the same time.
- Keep “refer” distinct from “hire” or “interview” if it is tested. The cited process describes a handoff to a later reviewer, not a promise of selection.

The existing [hiring-workflow research notes](./human-factors-and-hiring-workflow.md) cover job-related assessment, structured screening, and risks of automated filters. The current prototype's reject/interview/special-case mechanics and authored content are implementation/design context, not evidence that those mechanics work.

## A small test for the open choice

Once the reason-selection interaction is concrete enough to play, compare two short, otherwise-matched sequences:

1. The player identifies a fitting bureaucratic reason and rejects; the stream advances without a separate referral action.
2. The same interaction offers a clearly labeled **“Refer to hiring manager”** alternative.

Use the same candidate sequence, reason options, rewards, requirement changes, and pacing. Observe whether players understand referral, whether they use it, whether it interrupts the rejection rhythm, and which version better communicates that the institution rewards the player's work. Ask whether the review feels interesting, repetitive, or moralizing. Treat a small playtest as formative, not representative evidence.

## Limitations and open questions

The workflow sources are U.S. federal guidance, not a representative account of private-sector or global hiring. They clarify what a referral can mean, but do not establish how often strong candidates are rejected for excessive requirements. No reviewed source compares rejection-only gameplay with interactive advancement, reason selection, or delayed consequences. Research cannot determine whether the reason-selection idea is enjoyable, what makes an answer “wrong,” what consequence an incorrect reason should have, or when automation should take over; these remain design questions for prototyping and playtesting.
