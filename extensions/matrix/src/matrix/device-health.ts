export type MatrixManagedDeviceInfo = {
  deviceId: string;
  displayName: string | null;
  current: boolean;
};

export type MatrixDeviceHealthSummary = {
  currentDeviceId: string | null;
  staleAikaClawDevices: MatrixManagedDeviceInfo[];
  currentAikaClawDevices: MatrixManagedDeviceInfo[];
};

const AIKACLAW_DEVICE_NAME_PREFIX = "AikaClaw ";

export function isAikaClawManagedMatrixDevice(displayName: string | null | undefined): boolean {
  return displayName?.startsWith(AIKACLAW_DEVICE_NAME_PREFIX) === true;
}

export function summarizeMatrixDeviceHealth(
  devices: MatrixManagedDeviceInfo[],
): MatrixDeviceHealthSummary {
  const currentDeviceId = devices.find((device) => device.current)?.deviceId ?? null;
  const openClawDevices = devices.filter((device) =>
    isAikaClawManagedMatrixDevice(device.displayName),
  );
  return {
    currentDeviceId,
    staleAikaClawDevices: openClawDevices.filter((device) => !device.current),
    currentAikaClawDevices: openClawDevices.filter((device) => device.current),
  };
}
