import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-aikaclaw writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.aikaclaw.mac"
let gatewayLaunchdLabel = "ai.aikaclaw.gateway"
let onboardingVersionKey = "aikaclaw.onboardingVersion"
let onboardingSeenKey = "aikaclaw.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "aikaclaw.pauseEnabled"
let iconAnimationsEnabledKey = "aikaclaw.iconAnimationsEnabled"
let swabbleEnabledKey = "aikaclaw.swabbleEnabled"
let swabbleTriggersKey = "aikaclaw.swabbleTriggers"
let voiceWakeTriggerChimeKey = "aikaclaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "aikaclaw.voiceWakeSendChime"
let showDockIconKey = "aikaclaw.showDockIcon"
let defaultVoiceWakeTriggers = ["aikaclaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "aikaclaw.voiceWakeMicID"
let voiceWakeMicNameKey = "aikaclaw.voiceWakeMicName"
let voiceWakeLocaleKey = "aikaclaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "aikaclaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "aikaclaw.voicePushToTalkEnabled"
let talkEnabledKey = "aikaclaw.talkEnabled"
let iconOverrideKey = "aikaclaw.iconOverride"
let connectionModeKey = "aikaclaw.connectionMode"
let remoteTargetKey = "aikaclaw.remoteTarget"
let remoteIdentityKey = "aikaclaw.remoteIdentity"
let remoteProjectRootKey = "aikaclaw.remoteProjectRoot"
let remoteCliPathKey = "aikaclaw.remoteCliPath"
let canvasEnabledKey = "aikaclaw.canvasEnabled"
let cameraEnabledKey = "aikaclaw.cameraEnabled"
let systemRunPolicyKey = "aikaclaw.systemRunPolicy"
let systemRunAllowlistKey = "aikaclaw.systemRunAllowlist"
let systemRunEnabledKey = "aikaclaw.systemRunEnabled"
let locationModeKey = "aikaclaw.locationMode"
let locationPreciseKey = "aikaclaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "aikaclaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "aikaclaw.deepLinkKey"
let modelCatalogPathKey = "aikaclaw.modelCatalogPath"
let modelCatalogReloadKey = "aikaclaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "aikaclaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "aikaclaw.heartbeatsEnabled"
let debugPaneEnabledKey = "aikaclaw.debugPaneEnabled"
let debugFileLogEnabledKey = "aikaclaw.debug.fileLogEnabled"
let appLogLevelKey = "aikaclaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
