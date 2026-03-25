import Foundation

public enum AikaClawDeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum AikaClawBatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum AikaClawThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum AikaClawNetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum AikaClawNetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct AikaClawBatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: AikaClawBatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: AikaClawBatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct AikaClawThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: AikaClawThermalState

    public init(state: AikaClawThermalState) {
        self.state = state
    }
}

public struct AikaClawStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct AikaClawNetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: AikaClawNetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [AikaClawNetworkInterfaceType]

    public init(
        status: AikaClawNetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [AikaClawNetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct AikaClawDeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: AikaClawBatteryStatusPayload
    public var thermal: AikaClawThermalStatusPayload
    public var storage: AikaClawStorageStatusPayload
    public var network: AikaClawNetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: AikaClawBatteryStatusPayload,
        thermal: AikaClawThermalStatusPayload,
        storage: AikaClawStorageStatusPayload,
        network: AikaClawNetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct AikaClawDeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}
