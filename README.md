# AikaClaw - Персональный AI-ассистент

Персональный AI-ассистент, который работает на ваших устройствах и подключается к вашим любимым мессенджерам.

## Быстрая установка

### Предварительные требования
- **Node.js**: Версия 24 (рекомендуется) или Node 22.16+
- **Менеджер пакетов**: npm, pnpm или bun

### Установка через npm (рекомендуется)
```bash
npm install -g aikaclaw@latest
# или
pnpm add -g aikaclaw@latest
```

### Запуск мастера начальной настройки
```bash
aikaclaw onboard --install-daemon
```

Мастер настройки проведёт вас через:
- Конфигурацию шлюза
- Настройку рабочего пространства
- Подключение каналов
- Установку навыков

## Основное использование

### Запуск шлюза
```bash
aikaclaw gateway --port 18789 --verbose
```

### Отправка сообщения
```bash
aikaclaw message send --to +1234567890 --message "Привет от AikaClaw"
```

### Взаимодействие с ассистентом
```bash
aikaclaw agent --message "Ваш вопрос здесь" --thinking high
```

## Поддерживаемые каналы

AikaClaw поддерживает множество мессенджеров:
- WhatsApp, Telegram, Slack, Discord
- Google Chat, Signal, iMessage
- Microsoft Teams, Matrix, LINE
- WebChat и многие другие

## Обновление

Для обновления до последней версии:
```bash
npm install -g aikaclaw@latest
aikaclaw doctor
```

## Лицензия

MIT License
