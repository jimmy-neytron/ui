import { spawnSync } from 'node:child_process';

function resolveNpmInvocation(args) {
  const npmCliPath = process.env.npm_execpath;

  if (npmCliPath) {
    return {
      command: process.execPath,
      args: [npmCliPath, ...args],
    };
  }

  return {
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args,
  };
}

export function runNpm(args, options = {}) {
  const invocation = resolveNpmInvocation(args);
  const result = spawnSync(invocation.command, invocation.args, {
    ...options,
    env: options.env ?? process.env,
  });

  if (result.error) {
    const message = result.error instanceof Error
      ? result.error.message
      : String(result.error);
    throw new Error(`Unable to start npm: ${message}`);
  }

  return result;
}
