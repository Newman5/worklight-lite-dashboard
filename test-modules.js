/**
 * Simple module tests to verify functionality
 * Run with: node test-modules.js
 */

console.log('🧪 Testing Work Light Lite modules...\n');

// Test 1: Config module loads
console.log('Test 1: Loading config module...');
try {
  // Set minimal env vars for testing
  process.env.DISCORD_TOKEN = 'test_token';
  process.env.GUILD_ID = 'test_guild';
  
  const { config, validateConfig } = require('./src/config');
  console.log('✅ Config module loaded');
  console.log('   Port:', config.server.port);
  console.log('   Data file:', config.data.worklightFile);
  
  validateConfig();
  console.log('✅ Config validation passed\n');
} catch (error) {
  console.error('❌ Config test failed:', error.message, '\n');
  process.exit(1);
}

// Test 2: Data Manager module
console.log('Test 2: Testing dataManager module...');
try {
  const dataManager = require('./src/dataManager');
  
  // Test validation
  const validEntry = {
    user: 'testuser',
    project: 'Testing the module',
    timestamp: new Date().toISOString()
  };
  
  const validation = dataManager.validateEntry(validEntry);
  if (validation.isValid) {
    console.log('✅ Entry validation works');
  } else {
    console.log('❌ Entry validation failed:', validation.errors);
    process.exit(1);
  }
  
  // Test invalid entry
  const invalidEntry = {
    user: 'testuser'
    // missing project and timestamp
  };
  
  const invalidValidation = dataManager.validateEntry(invalidEntry);
  if (!invalidValidation.isValid && invalidValidation.errors.length > 0) {
    console.log('✅ Invalid entry detection works');
  } else {
    console.log('❌ Should have detected invalid entry');
    process.exit(1);
  }
  
  console.log('✅ Data Manager module works\n');
} catch (error) {
  console.error('❌ Data Manager test failed:', error.message, '\n');
  process.exit(1);
}

// Test 3: Command Handlers module
console.log('Test 3: Loading commandHandlers module...');
try {
  const { handleWorklightCommand } = require('./src/commandHandlers');
  console.log('✅ Command Handlers module loaded\n');
} catch (error) {
  console.error('❌ Command Handlers test failed:', error.message, '\n');
  process.exit(1);
}

// Test 4: Data operations
console.log('Test 4: Testing data operations...');
try {
  const dataManager = require('./src/dataManager');
  const fs = require('fs');
  
  // Read current data
  const data = dataManager.readWorklightData();
  console.log(`✅ Read ${data.length} entries from worklight.json`);
  
  // Test getActiveEntries
  const activeEntries = dataManager.getActiveEntries();
  console.log(`✅ Found ${activeEntries.length} active entries\n`);
} catch (error) {
  console.error('❌ Data operations test failed:', error.message, '\n');
  process.exit(1);
}

console.log('🎉 All module tests passed!\n');
console.log('Next steps:');
console.log('1. Set up your .env file with real Discord credentials');
console.log('2. Run: npm start');
console.log('3. Test with /worklight command in Discord');
console.log('4. Visit http://localhost:8080 to see the dashboard');
