package ai.aikaclaw.app.node

import ai.aikaclaw.app.protocol.AikaClawCalendarCommand
import ai.aikaclaw.app.protocol.AikaClawCameraCommand
import ai.aikaclaw.app.protocol.AikaClawCallLogCommand
import ai.aikaclaw.app.protocol.AikaClawCapability
import ai.aikaclaw.app.protocol.AikaClawContactsCommand
import ai.aikaclaw.app.protocol.AikaClawDeviceCommand
import ai.aikaclaw.app.protocol.AikaClawLocationCommand
import ai.aikaclaw.app.protocol.AikaClawMotionCommand
import ai.aikaclaw.app.protocol.AikaClawNotificationsCommand
import ai.aikaclaw.app.protocol.AikaClawPhotosCommand
import ai.aikaclaw.app.protocol.AikaClawSmsCommand
import ai.aikaclaw.app.protocol.AikaClawSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      AikaClawCapability.Canvas.rawValue,
      AikaClawCapability.Device.rawValue,
      AikaClawCapability.Notifications.rawValue,
      AikaClawCapability.System.rawValue,
      AikaClawCapability.Photos.rawValue,
      AikaClawCapability.Contacts.rawValue,
      AikaClawCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      AikaClawCapability.Camera.rawValue,
      AikaClawCapability.Location.rawValue,
      AikaClawCapability.Sms.rawValue,
      AikaClawCapability.CallLog.rawValue,
      AikaClawCapability.VoiceWake.rawValue,
      AikaClawCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      AikaClawDeviceCommand.Status.rawValue,
      AikaClawDeviceCommand.Info.rawValue,
      AikaClawDeviceCommand.Permissions.rawValue,
      AikaClawDeviceCommand.Health.rawValue,
      AikaClawNotificationsCommand.List.rawValue,
      AikaClawNotificationsCommand.Actions.rawValue,
      AikaClawSystemCommand.Notify.rawValue,
      AikaClawPhotosCommand.Latest.rawValue,
      AikaClawContactsCommand.Search.rawValue,
      AikaClawContactsCommand.Add.rawValue,
      AikaClawCalendarCommand.Events.rawValue,
      AikaClawCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      AikaClawCameraCommand.Snap.rawValue,
      AikaClawCameraCommand.Clip.rawValue,
      AikaClawCameraCommand.List.rawValue,
      AikaClawLocationCommand.Get.rawValue,
      AikaClawMotionCommand.Activity.rawValue,
      AikaClawMotionCommand.Pedometer.rawValue,
      AikaClawSmsCommand.Send.rawValue,
      AikaClawSmsCommand.Search.rawValue,
      AikaClawCallLogCommand.Search.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          callLogAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          callLogAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          sendSmsAvailable = false,
          readSmsAvailable = false,
          callLogAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(AikaClawMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(AikaClawMotionCommand.Pedometer.rawValue))
  }

  @Test
  fun advertisedCommands_splitsSmsSendAndSearchAvailability() {
    val readOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(sendSmsAvailable = true),
      )

    assertTrue(readOnlyCommands.contains(AikaClawSmsCommand.Search.rawValue))
    assertFalse(readOnlyCommands.contains(AikaClawSmsCommand.Send.rawValue))
    assertTrue(sendOnlyCommands.contains(AikaClawSmsCommand.Send.rawValue))
    assertFalse(sendOnlyCommands.contains(AikaClawSmsCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_includeSmsWhenEitherSmsPathIsAvailable() {
    val readOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(sendSmsAvailable = true),
      )

    assertTrue(readOnlyCapabilities.contains(AikaClawCapability.Sms.rawValue))
    assertTrue(sendOnlyCapabilities.contains(AikaClawCapability.Sms.rawValue))
  }

  @Test
  fun advertisedCommands_excludesCallLogWhenUnavailable() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(callLogAvailable = false))

    assertFalse(commands.contains(AikaClawCallLogCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_excludesCallLogWhenUnavailable() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(callLogAvailable = false))

    assertFalse(capabilities.contains(AikaClawCapability.CallLog.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    sendSmsAvailable: Boolean = false,
    readSmsAvailable: Boolean = false,
    callLogAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      sendSmsAvailable = sendSmsAvailable,
      readSmsAvailable = readSmsAvailable,
      callLogAvailable = callLogAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
