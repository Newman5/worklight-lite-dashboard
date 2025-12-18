/**
 * Command Handlers for Discord bot
 * Handles slash command interactions
 */

const { MessageFlags } = require('discord.js');
const { addEntry } = require('./dataManager');
const { config } = require('./config');

/**
 * Handles the /worklight command
 * @param {Object} interaction - Discord interaction object
 */
async function handleWorklightCommand(interaction) {
  try {
    const project = interaction.options.getString('project');
    const username = interaction.user.username;

    console.log(`${username} is working on: ${project}`);

    const newEntry = {
      user: username,
      project: project,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    // Add expiry if auto-pruning is enabled
    if (config.features.enableAutoPruning) {
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + config.features.defaultExpiryMinutes);
      newEntry.expiresAt = expiryDate.toISOString();
    }

    const result = addEntry(newEntry);

    if (result.success) {
      await interaction.reply({
        content: `💡 Your worklight is ON for: **${project}**`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: `❌ Failed to save your worklight: ${result.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  } catch (error) {
    console.error('Error handling worklight command:', error);
    
    try {
      await interaction.reply({
        content: '❌ An error occurred while processing your command.',
        flags: MessageFlags.Ephemeral,
      });
    } catch (replyError) {
      console.error('Error sending error reply:', replyError);
    }
  }
}

module.exports = {
  handleWorklightCommand,
};
