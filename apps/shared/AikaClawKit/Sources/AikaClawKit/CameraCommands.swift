import Foundation

public enum AikaClawCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum AikaClawCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum AikaClawCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum AikaClawCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct AikaClawCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: AikaClawCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: AikaClawCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: AikaClawCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: AikaClawCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct AikaClawCameraClipParams: Codable, Sendable, Equatable {
    public var facing: AikaClawCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: AikaClawCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: AikaClawCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: AikaClawCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
