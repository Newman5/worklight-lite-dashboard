# 💡 Work Light

**A tiny protocol for broadcasting presence and focus.**  
Work Light helps decentralized communities stay connected through lightweight status updates in `worklight.json` format. Whether you're building solo or with friends, it lets others see what you're working on — and when.

---

## 🌐 What is Work Light?

Work Light is:
- A **simple open format** (`worklight.json`) for tracking what you’re working on
- A **Discord bot** that lets you publish your status with `/worklight`
- A **public dashboard** to visualize the current activity of the network

It’s like turning on your garage light while you work — so others can see you're building something cool.

![worklight-cover](https://res.cloudinary.com/dc9njstyu/raw/upload/v1750172542/m_6837d3bcd0e88191b77cbc069d1c8257_qfsle4)
---

## 🚀 Getting Started to use the bot

invite the bot to server - Link coming soon

use the command in a discord message.  /worklight is the only one so far.

check the dashboard to see yours and others status. A live `dashboard.html` page displays the current `worklight.json` contents. - link coming soon

## 🏗️ Getting Started to build the bot
1. **Copy the Discord Bot**  
   Clone the repo and run `node index.js` (requires Node.js and a `.env` file with your bot token)

2. **Set up Discord Dev Account**  
   

3. **Host bot**  
   There are severval ways to host the bot to run 24/7.  Expect to pay 3 to 10 USD a month.

---

## 🔧 Sample possible `worklight.json` format

```json
{
  "user": "@newman",
  "timestamp": "2025-06-15T15:30:00Z",
  "project": "Collaborative Sparks Website",
  "status": "active",
  "summary": "Working on the dashboard layout for public feed.",
  "tags": ["design", "frontend", "astro"],
  "expires_in_minutes": 60
}
