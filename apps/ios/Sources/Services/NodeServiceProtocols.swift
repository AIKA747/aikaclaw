import CoreLocation
import Foundation
import AikaClawKit
import UIKit

typealias AikaClawCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias AikaClawCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: AikaClawCameraSnapParams) async throws -> AikaClawCameraSnapResult
    func clip(params: AikaClawCameraClipParams) async throws -> AikaClawCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: AikaClawLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: AikaClawLocationGetParams,
        desiredAccuracy: AikaClawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: AikaClawLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> AikaClawDeviceStatusPayload
    func info() -> AikaClawDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: AikaClawPhotosLatestParams) async throws -> AikaClawPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: AikaClawContactsSearchParams) async throws -> AikaClawContactsSearchPayload
    func add(params: AikaClawContactsAddParams) async throws -> AikaClawContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: AikaClawCalendarEventsParams) async throws -> AikaClawCalendarEventsPayload
    func add(params: AikaClawCalendarAddParams) async throws -> AikaClawCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: AikaClawRemindersListParams) async throws -> AikaClawRemindersListPayload
    func add(params: AikaClawRemindersAddParams) async throws -> AikaClawRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: AikaClawMotionActivityParams) async throws -> AikaClawMotionActivityPayload
    func pedometer(params: AikaClawPedometerParams) async throws -> AikaClawPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: AikaClawWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
