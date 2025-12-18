/**
 * Work Light Lite - Discord Bot Entry Point
 * Main bot initialization and command registration
 */

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { config, validateConfig } = require('./src/config');
const { handleWorklightCommand } = require('./src/commandHandlers');
const { pruneExpiredEntries } = require('./src/dataManager');

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName('worklight')
    .setDescription('Turn on your worklight')
    .addStringOption(option =>
      option.setName('project')
        .setDescription('What are you working on?')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(config.discord.token);

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);

  const CLIENT_ID = client.user.id;
  const GUILD_ID = config.discord.guildId;
  
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash command registered.');
  } catch (err) {
    console.error('❌ Error registering slash commands:', err);
  }

  // Set up auto-pruning if enabled
  if (config.features.enableAutoPruning) {
    setInterval(() => {
      pruneExpiredEntries();
    }, 60000); // Check every minute
    console.log('✅ Auto-pruning enabled');
  }
});

// Listen for slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'worklight') {
    await handleWorklightCommand(interaction);
  }
});

// Error handling
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Start the bot
client.login(config.discord.token).catch(error => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});

// Start the web server
require('./server.js');