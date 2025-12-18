# Work Light Lite - Deployment Guide

This guide covers deploying Work Light Lite to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:

1. **Discord Bot Token**
   - Create bot at [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable "Message Content Intent" and "Server Members Intent"
   - Copy the bot token

2. **Discord Guild ID**
   - Enable Developer Mode in Discord (User Settings > Advanced)
   - Right-click your server and select "Copy ID"

3. **GitHub Repository** (recommended)
   - Fork or clone this repository
   - Your hosting platform can auto-deploy from GitHub

## Environment Variables

All platforms require these environment variables:

```
DISCORD_TOKEN=your_discord_bot_token_here
GUILD_ID=your_discord_guild_id_here
PORT=8080
```

Optional variables:
```
ENABLE_USER_LOGS=false
ENABLE_AUTO_PRUNING=false
DEFAULT_EXPIRY_MINUTES=1440
```

## Platform-Specific Guides

### Deploying to SparkedHost

SparkedHost offers Node.js hosting with persistent storage.

#### Step 1: Set Up Hosting

1. Purchase a Node.js hosting plan from SparkedHost
2. Access your control panel
3. Go to File Manager and upload your code or connect to GitHub

#### Step 2: Configure Environment

1. In control panel, find "Environment Variables" section
2. Add each variable from the list above
3. Save changes

#### Step 3: Set Startup Command

1. Find "Startup Settings" in control panel
2. Set startup command to: `node index.js`
3. Or use: `npm start`

#### Step 4: Configure Port

1. Use the port provided by SparkedHost (usually in control panel)
2. Set `PORT` environment variable to match

#### Step 5: Deploy

1. Upload files or connect GitHub repository
2. Install dependencies (SparkedHost usually does this automatically)
3. Start the service from control panel
4. Check logs for "Logged in as [BotName]" message

#### Step 6: Verify

1. Try the `/worklight` command in Discord
2. Visit your dashboard URL: `http://your-host:port`
3. Check that your entry appears on the dashboard

### Deploying to Replit

Replit is ideal for quick deployments and testing.

#### Step 1: Import Repository

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repository URL
5. Click "Import from GitHub"

#### Step 2: Configure Secrets

1. Click the "Secrets" tab (lock icon) in left sidebar
2. Add each environment variable:
   - Key: `DISCORD_TOKEN`, Value: `your_token`
   - Key: `GUILD_ID`, Value: `your_guild_id`
   - Key: `PORT`, Value: `8080`

#### Step 3: Configure Run Command

1. Check that `.replit` file exists, or create it:
```toml
run = "npm start"
```

2. Ensure `package.json` has start script (already included)

#### Step 4: Deploy

1. Click "Run" button
2. Replit will install dependencies automatically
3. Check console for "Logged in as [BotName]"

#### Step 5: Keep Alive (24/7 Operation)

Replit has a few options:
- **Always On** - Paid feature, keeps bot running 24/7
- **UptimeRobot** - Free service to ping your server every 5 minutes
  1. Enable the web server in your Repl
  2. Copy the Repl URL
  3. Add it to UptimeRobot monitor

#### Step 6: Update from GitHub

1. Use Replit's Git tools to pull changes
2. Or re-import from GitHub

### Deploying to Heroku

Heroku supports Node.js applications with easy GitHub integration.

#### Step 1: Create Heroku App

```bash
# Install Heroku CLI
# Then login and create app
heroku login
heroku create your-app-name
```

#### Step 2: Add Procfile

Create `Procfile` in root directory:
```
worker: node index.js
```

#### Step 3: Configure Environment

```bash
heroku config:set DISCORD_TOKEN=your_token
heroku config:set GUILD_ID=your_guild_id
heroku config:set PORT=8080
```

#### Step 4: Deploy

```bash
git push heroku main
```

#### Step 5: Scale Dyno

```bash
heroku ps:scale worker=1
```

### Deploying to Railway

Railway offers simple deployments from GitHub.

#### Step 1: Connect Repository

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

#### Step 2: Configure Environment

1. Go to Variables tab
2. Add environment variables
3. Railway will auto-detect the PORT

#### Step 3: Deploy

Railway automatically deploys when you push to GitHub.

### Deploying to a VPS (Ubuntu/Debian)

For advanced users who want full control.

#### Step 1: Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

#### Step 2: Clone Repository

```bash
# Create app directory
mkdir -p /opt/worklight
cd /opt/worklight

# Clone repository
git clone https://github.com/yourusername/worklight-lite-dashboard.git .

# Install dependencies
npm install
```

#### Step 3: Configure Environment

```bash
# Create .env file
nano .env

# Add your environment variables
DISCORD_TOKEN=your_token_here
GUILD_ID=your_guild_id_here
PORT=8080
```

#### Step 4: Start with PM2

```bash
# Start application
pm2 start index.js --name worklight

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions displayed
```

#### Step 5: Configure Reverse Proxy (Optional)

If you want to serve on port 80/443:

```bash
# Install nginx
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/worklight
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/worklight /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Set Up SSL (Optional)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment

### Verify Deployment

1. **Check Bot Status**
   - Bot should appear online in Discord
   - Try `/worklight` command
   - Check for confirmation message

2. **Check Dashboard**
   - Visit your dashboard URL
   - Should load without errors
   - Entry should appear after using command

3. **Check Logs**
   - Look for any error messages
   - Verify configuration was loaded correctly

### Monitoring

Set up monitoring for production:

1. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) - Free
   - [Pingdom](https://www.pingdom.com)

2. **Error Tracking**
   - [Sentry](https://sentry.io) - Free tier available
   - Add to project for error tracking

3. **Log Aggregation**
   - [Papertrail](https://www.papertrail.com)
   - [Loggly](https://www.loggly.com)

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # Add deployment steps for your platform
      # Examples: Railway CLI, Heroku, SSH to VPS, etc.
```

### Auto-Deploy from GitHub

Most platforms support auto-deploy:

- **Railway**: Automatic on push to main
- **Replit**: Use Git integration or re-import
- **Heroku**: Connect GitHub repo in dashboard
- **SparkedHost**: May require manual FTP or GitHub webhook

## Updating Your Deployment

### Pull Latest Changes

```bash
git pull origin main
npm install  # If dependencies changed
```

### Restart Service

- **SparkedHost**: Restart from control panel
- **Replit**: Click "Run" again
- **Heroku**: `heroku restart`
- **Railway**: Automatic on git push
- **PM2**: `pm2 restart worklight`

## Troubleshooting

### Bot Won't Start

1. Check environment variables are set correctly
2. Verify Discord token is valid
3. Check bot has required permissions in Discord
4. Review logs for error messages

### Dashboard Not Loading

1. Verify PORT environment variable
2. Check server logs for errors
3. Ensure `docs/index.html` exists
4. Check firewall settings (VPS deployments)

### Commands Not Working

1. Verify bot has "applications.commands" scope
2. Check GUILD_ID is correct
3. Wait a few minutes (Discord caches commands)
4. Try removing and re-adding bot to server

### Data Not Persisting

1. Ensure file system is persistent (not ephemeral)
2. Check write permissions on `worklight.json`
3. Review logs for file write errors
4. Verify disk space is available

### High Memory Usage

1. Enable auto-pruning to limit data growth
2. Archive old entries regularly
3. Consider moving to database for large datasets

## Security Best Practices

1. **Never commit `.env` file**
   - Use `.env.example` as template
   - Add `.env` to `.gitignore`

2. **Rotate tokens periodically**
   - Generate new Discord token annually
   - Update across all deployments

3. **Use HTTPS in production**
   - Set up SSL certificate
   - Configure reverse proxy

4. **Restrict file permissions** (VPS)
   ```bash
   chmod 600 .env
   chmod 755 /opt/worklight
   ```

5. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

## Cost Estimates

### Free Options
- **Replit**: Free tier available (limited always-on)
- **Railway**: $5/month credit for free tier
- **Self-hosted**: Only server costs (~$5-20/month)

### Paid Options
- **SparkedHost**: $3-10/month (varies by plan)
- **Heroku**: $7/month for hobby dyno
- **DigitalOcean**: $6/month for basic droplet

## Getting Help

If you encounter issues:

1. Check logs first
2. Review this guide and ARCHITECTURE.md
3. Search existing GitHub issues
4. Open a new issue with:
   - Platform you're using
   - Error messages from logs
   - Steps to reproduce
   - Environment details

## Next Steps

After successful deployment:

1. Customize the dashboard (edit `docs/index.html`)
2. Add more slash commands
3. Enable user logs for history
4. Set up monitoring
5. Consider adding features like tags or teams

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
