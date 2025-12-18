# Contributing to Work Light Lite

Thank you for your interest in contributing to Work Light Lite! This is an open-source learning project, and we welcome contributions from developers of all skill levels.

## 🎯 Project Goals

Work Light Lite aims to:
- Provide a lightweight, easy-to-use presence broadcasting tool
- Help decentralized communities stay connected
- Serve as a learning project for bot development and web dashboards
- Remain simple and maintainable

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug:

1. Check if it's already reported in [Issues](https://github.com/Newman5/worklight-lite-dashboard/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (Node.js version, OS, hosting platform)
   - Error messages or logs

### Suggesting Features

For new features:

1. Check existing [Issues](https://github.com/Newman5/worklight-lite-dashboard/issues) and [Discussions](https://github.com/Newman5/worklight-lite-dashboard/discussions)
2. Create a new discussion or issue describing:
   - The feature and its benefits
   - How it aligns with project goals
   - Possible implementation approach
   - Any breaking changes

### Contributing Code

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/worklight-lite-dashboard.git
   cd worklight-lite-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your Discord bot credentials for testing
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

#### Making Changes

1. **Follow the code style**
   - Use clear, descriptive variable names
   - Add comments for complex logic
   - Follow existing patterns in the codebase
   - Add JSDoc comments for new functions

2. **Keep changes focused**
   - One feature or fix per pull request
   - Make minimal, surgical changes
   - Don't refactor unrelated code

3. **Update documentation**
   - Update README.md if user-facing changes
   - Update ARCHITECTURE.md if structural changes
   - Update API.md if API changes
   - Add comments in code for complex logic

4. **Test your changes**
   ```bash
   npm test
   npm start
   # Test manually with Discord bot and dashboard
   ```

#### Code Guidelines

**Module Structure:**
- Add configuration to `src/config.js` and `.env.example`
- Put data operations in `src/dataManager.js`
- Put command handlers in `src/commandHandlers.js`
- Keep modules focused and single-purpose

**Error Handling:**
```javascript
try {
  // Your code
} catch (error) {
  console.error('Descriptive error message:', error.message);
  // Handle gracefully
}
```

**Logging:**
```javascript
// Use console.log for important events
console.log('✅ Feature initialized');

// Use console.error for errors
console.error('❌ Error occurred:', error.message);

// Use clear emoji indicators
// ✅ Success
// ❌ Error
// ⚠️ Warning
// 💡 Info
```

**Data Validation:**
```javascript
// Always validate user input
const validation = validateEntry(entry);
if (!validation.isValid) {
  return {
    success: false,
    message: validation.errors.join(', ')
  };
}
```

#### Submitting Changes

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   # Use conventional commit format:
   # feat: New feature
   # fix: Bug fix
   # docs: Documentation changes
   # refactor: Code refactoring
   # test: Adding tests
   # chore: Maintenance tasks
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to GitHub and create a PR from your fork
   - Fill in the PR template
   - Link related issues
   - Describe what changed and why
   - Add screenshots for UI changes

4. **Respond to feedback**
   - Address review comments
   - Make requested changes
   - Push updates to your branch

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows existing style and patterns
- [ ] All tests pass (`npm test`)
- [ ] New features have been tested manually
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] No unnecessary files are included
- [ ] `.env` is not committed
- [ ] Changes are minimal and focused

## 🎨 Feature Ideas

Looking for something to work on? Here are some ideas:

### Beginner-Friendly
- [ ] Add more emoji to dashboard for visual interest
- [ ] Improve error messages
- [ ] Add loading states to dashboard
- [ ] Create additional example .env configurations
- [ ] Improve dashboard mobile responsiveness

### Intermediate
- [ ] Add `/worklight-off` command to turn off your light
- [ ] Add tag support to `/worklight` command
- [ ] Add search/filter to dashboard
- [ ] Add sorting options (by time, by user)
- [ ] Create weekly digest aggregation function
- [ ] Add dashboard refresh button

### Advanced
- [ ] Add database migration option (SQLite)
- [ ] Implement WebSocket for real-time updates
- [ ] Add authentication for user data export
- [ ] Create admin dashboard
- [ ] Add analytics and usage stats
- [ ] Implement team/project grouping

## 🧪 Testing

### Manual Testing

1. **Bot Commands**
   - Test `/worklight` with various inputs
   - Test with long project names
   - Test error cases (no permissions, etc.)

2. **Dashboard**
   - Verify entries display correctly
   - Test with 0, 1, and many entries
   - Test on different browsers
   - Test mobile view

3. **Data Operations**
   - Verify data persists correctly
   - Test pruning (if enabled)
   - Test archiving functions
   - Check user logs (if enabled)

### Automated Tests

Currently, we have basic module tests. Future contributions could add:
- Unit tests with Jest or Mocha
- Integration tests
- End-to-end tests

## 📖 Resources

### Learn More About Discord Bots
- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/docs)

### Learn About the Stack
- Node.js and Express
- JavaScript ES6+
- JSON data structures
- RESTful APIs

### Project Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Hosting guides
- [API.md](API.md) - API documentation
- [README.md](README.md) - Getting started

## 💬 Communication

- **Questions**: Use [GitHub Discussions](https://github.com/Newman5/worklight-lite-dashboard/discussions)
- **Bug Reports**: Use [GitHub Issues](https://github.com/Newman5/worklight-lite-dashboard/issues)
- **Feature Requests**: Use [GitHub Discussions](https://github.com/Newman5/worklight-lite-dashboard/discussions) or Issues

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- Learn from mistakes

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information
- Any behavior inappropriate in a professional setting

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the ISC License.

## 🙏 Thank You

Every contribution, no matter how small, helps make Work Light Lite better. Whether you're fixing a typo, improving documentation, or adding a major feature, your help is appreciated!

---

**Questions?** Open a discussion or reach out through GitHub issues.

**First time contributing to open source?** Welcome! This is a great place to start. Don't hesitate to ask questions.
