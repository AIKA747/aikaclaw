export function resolveDaemonContainerContext(
  env: Record<string, string | undefined> = process.env,
): string | null {
  return env.AIKACLAW_CONTAINER_HINT?.trim() || env.AIKACLAW_CONTAINER?.trim() || null;
}
