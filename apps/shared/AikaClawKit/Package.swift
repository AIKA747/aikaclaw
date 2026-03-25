// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "AikaClawKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "AikaClawProtocol", targets: ["AikaClawProtocol"]),
        .library(name: "AikaClawKit", targets: ["AikaClawKit"]),
        .library(name: "AikaClawChatUI", targets: ["AikaClawChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "AikaClawProtocol",
            path: "Sources/AikaClawProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AikaClawKit",
            dependencies: [
                "AikaClawProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/AikaClawKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AikaClawChatUI",
            dependencies: [
                "AikaClawKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/AikaClawChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "AikaClawKitTests",
            dependencies: ["AikaClawKit", "AikaClawChatUI"],
            path: "Tests/AikaClawKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
