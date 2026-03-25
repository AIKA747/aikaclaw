// swift-tools-version: 6.2
// Package manifest for the AikaClaw macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "AikaClaw",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "AikaClawIPC", targets: ["AikaClawIPC"]),
        .library(name: "AikaClawDiscovery", targets: ["AikaClawDiscovery"]),
        .executable(name: "AikaClaw", targets: ["AikaClaw"]),
        .executable(name: "aikaclaw-mac", targets: ["AikaClawMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/AikaClawKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "AikaClawIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AikaClawDiscovery",
            dependencies: [
                .product(name: "AikaClawKit", package: "AikaClawKit"),
            ],
            path: "Sources/AikaClawDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "AikaClaw",
            dependencies: [
                "AikaClawIPC",
                "AikaClawDiscovery",
                .product(name: "AikaClawKit", package: "AikaClawKit"),
                .product(name: "AikaClawChatUI", package: "AikaClawKit"),
                .product(name: "AikaClawProtocol", package: "AikaClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/AikaClaw.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "AikaClawMacCLI",
            dependencies: [
                "AikaClawDiscovery",
                .product(name: "AikaClawKit", package: "AikaClawKit"),
                .product(name: "AikaClawProtocol", package: "AikaClawKit"),
            ],
            path: "Sources/AikaClawMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "AikaClawIPCTests",
            dependencies: [
                "AikaClawIPC",
                "AikaClaw",
                "AikaClawDiscovery",
                .product(name: "AikaClawProtocol", package: "AikaClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
