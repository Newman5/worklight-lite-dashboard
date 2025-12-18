# 💡 Work Light Lite

**A tiny protocol for broadcasting presence and focus.**  
Work Light helps decentralized communities stay connected through lightweight status updates in `worklight.json` format. Whether you're building solo or with friends, it lets others see what you're working on — and when.

---

## 🌐 What is Work Light?

Work Light is:
- A **simple open format** (`worklight.json`) for tracking what you're working on
- A **Discord bot** that lets you publish your status with `/worklight`
- A **public dashboard** to visualize the current activity of the network

It's like turning on your garage light while you work — so others can see you're building something cool.

![worklight-cover](https://res.cloudinary.com/dc9njstyu/image/upload/v1750432902/m_6837d3bcd0e88191b77cbc069d1c8257_qfsle4.png)

---

## ✨ Features

- **Discord Integration** - Simple `/worklight` slash command
- **Real-time Dashboard** - See who's working on what right now
- **Auto-pruning** - Optionally expire old entries automatically
- **User Logs** - Keep personal history of your work sessions
- **Modular Architecture** - Easy to extend and customize
- **Deployment Ready** - Works on SparkedHost, Replit, Heroku, and more

---

## 🚀 Quick Start

### For Users

1. **Invite the bot to your Discord server** (Link coming soon)
2. **Use the command**: `/worklight project: What you're working on`
3. **Check the dashboard** to see yours and others' status (Link coming soon)

### For Developers

#### Prerequisites
- Node.js 14 or higher
- A Discord bot token ([Get one here](https://discord.com/developers/applications))
- Your Discord server's Guild ID

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Newman5/worklight-lite-dashboard.git
   cd worklight-lite-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Discord credentials
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Test it out**
   - Use `/worklight` in your Discord server
   - Visit `http://localhost:8080` to see the dashboard

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and technical details
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Hosting guides for various platforms
- **[.env.example](.env.example)** - Configuration options

---

## 🔧 Configuration

Key environment variables in `.env`:

```bash
# Required
DISCORD_TOKEN=your_discord_bot_token_here
GUILD_ID=your_discord_guild_id_here

# Optional
PORT=8080
ENABLE_USER_LOGS=false
ENABLE_AUTO_PRUNING=false
DEFAULT_EXPIRY_MINUTES=1440
```

See `.env.example` for all available options.

---

## 📊 Data Format

Current `worklight.json` structure:

```json
{
  "user": "username",
  "project": "What they're working on",
  "timestamp": "2025-01-15T10:30:00Z",
  "status": "active",
  "expiresAt": "2025-01-16T10:30:00Z"
}
```

The data model supports future extensions like tags, teams, and summaries. See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🛠️ Development

### Project Structure

```
worklight-lite-dashboard/
├── src/
│   ├── config.js           # Configuration management
│   ├── dataManager.js      # Data operations and validation
│   └── commandHandlers.js  # Discord command handlers
├── docs/
│   └── index.html          # Dashboard frontend
├── index.js                # Bot entry point
├── server.js               # Web server
├── worklight.json          # Data file (generated)
└── .env                    # Configuration (not in git)
```

### Available Scripts

```bash
npm start          # Start the bot and server
npm run dev        # Start in development mode
```

### Adding Features

1. Add configuration to `src/config.js` and `.env.example`
2. Implement data operations in `src/dataManager.js`
3. Add command handlers in `src/commandHandlers.js`
4. Update documentation

---

## 🚢 Deployment

Work Light Lite can be deployed to various platforms:

- **SparkedHost** - Node.js hosting ($3-10/month)
- **Replit** - Quick deployment with free tier
- **Railway** - Auto-deploy from GitHub
- **Heroku** - Classic PaaS option
- **VPS** - Full control with Ubuntu/Debian

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides for each platform.

---

## 🔮 Roadmap

### Current Features (v1.0)
- ✅ Discord bot with `/worklight` command
- ✅ Web dashboard
- ✅ Auto-pruning and archiving
- ✅ Per-user logs
- ✅ Modular architecture

### Planned Features
- [ ] Weekly digest DMs
- [ ] Tag-based filtering
- [ ] Team/project grouping
- [ ] Authenticated data exports
- [ ] Enhanced dashboard with filters
- [ ] Additional slash commands
- [ ] Database migration option

---

## 🤝 Contributing

This is an open-source learning project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Inspired by the need for lightweight, decentralized collaboration tools
- Thanks to the open-source community

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Newman5/worklight-lite-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Newman5/worklight-lite-dashboard/discussions)

---

**Goal**: Learn, collaborate, and build something useful — even if it's small! 💡
