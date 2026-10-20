// Convenience entry point retained for existing local workflows.
import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'test:browser', '--', '--project=chrome'], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
