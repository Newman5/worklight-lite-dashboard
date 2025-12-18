/**
 * Data Manager module for Work Light Lite
 * Handles all file operations for worklight data
 */

const fs = require('fs');
const path = require('path');
const { config } = require('./config');

/**
 * Reads and parses the worklight data file
 * @returns {Array} Array of worklight entries
 */
function readWorklightData() {
  try {
    const filePath = config.data.worklightFile;
    
    if (!fs.existsSync(filePath)) {
      console.log('Worklight file does not exist, returning empty array');
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading worklight data:', error.message);
    return [];
  }
}

/**
 * Writes worklight data to file
 * @param {Array} data - Array of worklight entries to write
 * @returns {boolean} Success status
 */
function writeWorklightData(data) {
  try {
    const filePath = config.data.worklightFile;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing worklight data:', error.message);
    return false;
  }
}

/**
 * Validates a worklight entry
 * @param {Object} entry - Entry to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateEntry(entry) {
  const errors = [];

  if (!entry.user || typeof entry.user !== 'string') {
    errors.push('User is required and must be a string');
  }

  if (!entry.project || typeof entry.project !== 'string') {
    errors.push('Project is required and must be a string');
  }

  if (!entry.timestamp) {
    errors.push('Timestamp is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Adds a new worklight entry
 * 
 * Note: This function implements a "one light per user" model. When a user
 * adds a new entry, their previous entry is automatically removed. This ensures
 * each user has only one active worklight status at a time.
 * 
 * @param {Object} entry - New entry to add
 * @returns {Object} Result with success status and message
 */
function addEntry(entry) {
  const validation = validateEntry(entry);
  
  if (!validation.isValid) {
    return {
      success: false,
      message: `Validation failed: ${validation.errors.join(', ')}`,
    };
  }

  try {
    let data = readWorklightData();
    
    // Remove old entries from the same user (one light per user model)
    data = data.filter(e => e.user !== entry.user);
    
    // Add new entry
    data.push(entry);
    
    const writeSuccess = writeWorklightData(data);
    
    if (!writeSuccess) {
      return {
        success: false,
        message: 'Failed to write data to file',
      };
    }

    // Optional: Log to user-specific file
    if (config.data.enableUserLogs) {
      logToUserFile(entry);
    }

    return {
      success: true,
      message: 'Entry added successfully',
    };
  } catch (error) {
    console.error('Error adding entry:', error.message);
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

/**
 * Logs entry to user-specific log file
 * @param {Object} entry - Entry to log
 */
function logToUserFile(entry) {
  try {
    const logsDir = config.data.userLogsDir;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const userLogPath = path.join(logsDir, `${entry.user}.json`);
    let userLogs = [];

    if (fs.existsSync(userLogPath)) {
      const raw = fs.readFileSync(userLogPath, 'utf-8');
      userLogs = JSON.parse(raw);
    }

    userLogs.push(entry);
    fs.writeFileSync(userLogPath, JSON.stringify(userLogs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error logging to user file:', error.message);
  }
}

/**
 * Prunes expired entries based on expiry time
 * @returns {number} Number of entries pruned
 */
function pruneExpiredEntries() {
  try {
    const data = readWorklightData();
    const now = new Date();
    let prunedCount = 0;

    const activeData = data.filter(entry => {
      if (!entry.expiresAt) {
        return true; // Keep entries without expiry
      }

      const expiryDate = new Date(entry.expiresAt);
      if (expiryDate > now) {
        return true; // Keep entries that haven't expired
      }

      prunedCount++;
      return false; // Remove expired entries
    });

    if (prunedCount > 0) {
      writeWorklightData(activeData);
      console.log(`Pruned ${prunedCount} expired entries`);
    }

    return prunedCount;
  } catch (error) {
    console.error('Error pruning expired entries:', error.message);
    return 0;
  }
}

/**
 * Gets active entries (non-expired)
 * @returns {Array} Array of active entries
 */
function getActiveEntries() {
  const data = readWorklightData();
  const now = new Date();

  return data.filter(entry => {
    if (!entry.expiresAt) {
      return true;
    }
    return new Date(entry.expiresAt) > now;
  });
}

/**
 * Archives old entries to a separate file
 * @param {number} daysOld - Archive entries older than this many days
 * @returns {number} Number of entries archived
 */
function archiveOldEntries(daysOld = 7) {
  try {
    const data = readWorklightData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const activeEntries = [];
    const archivedEntries = [];

    data.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      if (entryDate < cutoffDate) {
        archivedEntries.push(entry);
      } else {
        activeEntries.push(entry);
      }
    });

    if (archivedEntries.length > 0) {
      // Write active entries back to main file
      writeWorklightData(activeEntries);

      // Append to archive file
      const parsed = path.parse(config.data.worklightFile);
      const archivePath = path.join(parsed.dir, `${parsed.name}-archive${parsed.ext}`);
      let existingArchive = [];

      if (fs.existsSync(archivePath)) {
        const raw = fs.readFileSync(archivePath, 'utf-8');
        existingArchive = JSON.parse(raw);
      }

      existingArchive.push(...archivedEntries);
      fs.writeFileSync(archivePath, JSON.stringify(existingArchive, null, 2), 'utf-8');

      console.log(`Archived ${archivedEntries.length} old entries`);
    }

    return archivedEntries.length;
  } catch (error) {
    console.error('Error archiving old entries:', error.message);
    return 0;
  }
}

module.exports = {
  readWorklightData,
  writeWorklightData,
  validateEntry,
  addEntry,
  pruneExpiredEntries,
  getActiveEntries,
  archiveOldEntries,
};
