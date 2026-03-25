package ai.aikaclaw.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class AikaClawProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", AikaClawCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", AikaClawCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", AikaClawCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", AikaClawCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", AikaClawCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", AikaClawCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", AikaClawCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", AikaClawCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", AikaClawCapability.Canvas.rawValue)
    assertEquals("camera", AikaClawCapability.Camera.rawValue)
    assertEquals("voiceWake", AikaClawCapability.VoiceWake.rawValue)
    assertEquals("location", AikaClawCapability.Location.rawValue)
    assertEquals("sms", AikaClawCapability.Sms.rawValue)
    assertEquals("device", AikaClawCapability.Device.rawValue)
    assertEquals("notifications", AikaClawCapability.Notifications.rawValue)
    assertEquals("system", AikaClawCapability.System.rawValue)
    assertEquals("photos", AikaClawCapability.Photos.rawValue)
    assertEquals("contacts", AikaClawCapability.Contacts.rawValue)
    assertEquals("calendar", AikaClawCapability.Calendar.rawValue)
    assertEquals("motion", AikaClawCapability.Motion.rawValue)
    assertEquals("callLog", AikaClawCapability.CallLog.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", AikaClawCameraCommand.List.rawValue)
    assertEquals("camera.snap", AikaClawCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", AikaClawCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", AikaClawNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", AikaClawNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", AikaClawDeviceCommand.Status.rawValue)
    assertEquals("device.info", AikaClawDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", AikaClawDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", AikaClawDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", AikaClawSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", AikaClawPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", AikaClawContactsCommand.Search.rawValue)
    assertEquals("contacts.add", AikaClawContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", AikaClawCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", AikaClawCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", AikaClawMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", AikaClawMotionCommand.Pedometer.rawValue)
  }

  @Test
  fun callLogCommandsUseStableStrings() {
    assertEquals("callLog.search", AikaClawCallLogCommand.Search.rawValue)
  }

  @Test
  fun smsCommandsUseStableStrings() {
    assertEquals("sms.search", AikaClawSmsCommand.Search.rawValue)
  }
}
