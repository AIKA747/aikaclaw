export const AIKACLAW_CLI_ENV_VAR = "AIKACLAW_CLI";
export const AIKACLAW_CLI_ENV_VALUE = "1";

export function markAikaClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [AIKACLAW_CLI_ENV_VAR]: AIKACLAW_CLI_ENV_VALUE,
  };
}

export function ensureAikaClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[AIKACLAW_CLI_ENV_VAR] = AIKACLAW_CLI_ENV_VALUE;
  return env;
}
