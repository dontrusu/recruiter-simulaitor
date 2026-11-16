# Testing

## Accessibility checks

```bash
pnpm run test:a11y
pnpm run test:browser
pnpm run test:production
pnpm exec playwright show-report playwright-report/browser
pnpm exec playwright show-report playwright-report/production
```

The axe-core scans cover Screen and Room with the visible Shop, on a fresh run
and after a Rejection. `test:a11y` runs only these scans in Chromium, Firefox,
and WebKit; `test:browser` includes them in the full browser suite.
`test:production` builds the application and repeats the scans in Chromium.

WCAG 2.2 A/AA violations fail tests and block CI. The rule selection includes
WCAG 2.0 and 2.1 A/AA tags as well as the WCAG 2.2 AA tag. Axe best-practice
violations and `incomplete` results (requiring manual assessment) are reported
without failing CI. No WCAG rule exceptions are configured.

Every scan attaches the full axe JSON and a summary separating WCAG violations,
best-practice findings, and incomplete results to the Playwright HTML report.
GitHub Actions retains both browser and production reports, including their
attachments and failure diagnostics, as `accessibility-and-browser-reports`
for 14 days, even when tests fail. Download and extract that artifact, then use
`playwright show-report` with the extracted report directory.

Existing keyboard tests continue to verify Reason navigation, activation, and
focus after Rejection. Automated scans do not establish full WCAG conformance;
manual screen-reader assessment is deferred from this change.
