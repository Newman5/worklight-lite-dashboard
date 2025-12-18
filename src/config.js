/**
 * Configuration module for Work Light Lite
 * Centralizes all environment variables and application settings
 */

require('dotenv').config();

/**
 * Parses an integer from environment variable with fallback default
 * @param {string} envVar - Environment variable value
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default value
 */
function parseIntWithDefault(envVar, defaultValue) {
  const value = parseInt(envVar || String(defaultValue), 10);
  return isNaN(value) ? defaultValue : value;
}

const config = {
  // Discord Bot Configuration
  discord: {
    token: process.env.DISCORD_TOKEN,
    guildId: process.env.GUILD_ID,
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 8080,
  },

  // Data Configuration
  data: {
    worklightFile: process.env.WORKLIGHT_FILE || './worklight.json',
    enableUserLogs: process.env.ENABLE_USER_LOGS === 'true',
    userLogsDir: process.env.USER_LOGS_DIR || './logs',
  },

  // Feature Flags
  features: {
    enableAutoPruning: process.env.ENABLE_AUTO_PRUNING === 'true',
    defaultExpiryMinutes: parseIntWithDefault(process.env.DEFAULT_EXPIRY_MINUTES, 1440),
    autoPruningIntervalMs: parseIntWithDefault(process.env.AUTO_PRUNING_INTERVAL_MS, 60000),
  },
};

/**
 * Validates required configuration values
 * @throws {Error} If required configuration is missing
 */
function validateConfig() {
  const errors = [];

  if (!config.discord.token) {
    errors.push('DISCORD_TOKEN is required');
  }

  if (!config.discord.guildId) {
    errors.push('GUILD_ID is required');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

module.exports = { config, validateConfig };
