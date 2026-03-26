# AikaClaw - Personal AI Assistant

A personal AI assistant that runs on your own devices and connects to your favorite messaging platforms.

## Quick Installation

### Prerequisites
- **Node.js**: Version 24 (recommended) or Node 22.16+
- **Package Manager**: npm, pnpm, or bun

### Install via npm (recommended)
```bash
npm install -g aikaclaw@latest
# or
pnpm add -g aikaclaw@latest
```

### Run Onboarding Wizard
```bash
aikaclaw onboard --install-daemon
```

The onboarding wizard will guide you through setting up:
- Gateway configuration
- Workspace setup  
- Channel connections
- Skills installation

## Basic Usage

### Start the Gateway
```bash
aikaclaw gateway --port 18789 --verbose
```

### Send a Message
```bash
aikaclaw message send --to +1234567890 --message "Hello from AikaClaw"
```

### Interact with the Assistant
```bash
aikaclaw agent --message "Your question here" --thinking high
```

## Supported Channels

AikaClaw supports multiple messaging platforms:
- WhatsApp, Telegram, Slack, Discord
- Google Chat, Signal, iMessage
- Microsoft Teams, Matrix, LINE
- WebChat, and many more

## Documentation

For detailed documentation, visit:
- **Website**: [https://aikaclaw.ai](https://aikaclaw.ai)
- **Docs**: [https://docs.aikaclaw.ai](https://docs.aikaclaw.ai)
- **Getting Started**: [https://docs.aikaclaw.ai/start/getting-started](https://docs.aikaclaw.ai/start/getting-started)

## Updating

To update to the latest version:
```bash
npm install -g aikaclaw@latest
aikaclaw doctor
```

## License

MIT License
