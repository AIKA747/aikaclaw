import { listSkillCommandsForAgents as listSkillCommandsForAgentsImpl } from "aikaclaw/plugin-sdk/command-auth";

type ListSkillCommandsForAgents =
  typeof import("aikaclaw/plugin-sdk/command-auth").listSkillCommandsForAgents;

export function listSkillCommandsForAgents(
  ...args: Parameters<ListSkillCommandsForAgents>
): ReturnType<ListSkillCommandsForAgents> {
  return listSkillCommandsForAgentsImpl(...args);
}
