# Security Policy

## Security Summary

Work Light Lite is an MVP designed for small communities and learning purposes. While it includes basic security measures, it's not hardened for large-scale public deployment.

### Current Security Status

✅ **Implemented:**
- Environment variables for secrets (Discord token)
- Input validation on all data entries
- Error handling to prevent data corruption
- Ephemeral Discord responses (private to user)
- .gitignore excludes sensitive files
- No SQL injection risk (file-based storage)

⚠️ **Known Limitations (MVP):**
- No rate limiting on API endpoints
- No authentication for data access
- API endpoints are publicly accessible
- No CORS restrictions
- No HTTPS enforcement
- No input sanitization for XSS (display only, no user HTML input)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainer (see GitHub profile)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

We'll respond within 72 hours and work with you to address the issue.

## Security Best Practices for Deployment

### 1. Rate Limiting (IMPORTANT for public deployments)

Add rate limiting to prevent API abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

Install: `npm install express-rate-limit`

### 2. CORS Configuration

For production, restrict origins:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-dashboard-domain.com',
  methods: ['GET'],
  credentials: false
}));
```

Install: `npm install cors`

### 3. HTTPS

Always use HTTPS in production:
- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (nginx) with SSL
- Platform-provided SSL (Heroku, Railway, etc.)

### 4. Environment Variables

**Never commit:**
- `.env` file
- Discord bot tokens
- API keys
- Any credentials

**Always:**
- Use `.env.example` as template
- Rotate tokens annually
- Use different tokens for dev/prod

### 5. File Permissions (VPS Deployments)

```bash
# Restrict .env file
chmod 600 .env

# Restrict application directory
chmod 755 /opt/worklight

# Run as non-root user
# Never run Node.js as root in production
```

### 6. Dependencies

Regularly check for vulnerabilities:

```bash
npm audit
npm audit fix
```

Keep dependencies updated:

```bash
npm update
```

### 7. Input Validation

Current validation in `src/dataManager.js`:
- User and project are required strings
- Timestamp validation
- Maximum lengths should be considered for production

### 8. Monitoring

Set up monitoring for:
- Failed login attempts (if auth is added)
- Unusual API traffic patterns
- File system errors
- Disk space usage

## Known Security Considerations

### 1. API Endpoints (No Authentication)

**Risk:** Anyone can read worklight data

**Mitigation Options:**
- Accept this for public MVP use
- Add API key authentication
- Implement user authentication with JWT
- Use Discord OAuth for authentication

**Example with API Key:**
```javascript
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/worklight', apiKeyMiddleware, (req, res) => {
  // Your code
});
```

### 2. No Rate Limiting

**Risk:** API abuse, DoS attacks

**Impact:** File system overload, bandwidth costs

**Mitigation:** Implement express-rate-limit (see above)

**Priority:** HIGH for public deployments

### 3. File-Based Storage

**Risk:** Concurrent write conflicts, file corruption

**Impact:** Data loss on high concurrency

**Mitigation:**
- Current: Acceptable for small communities (<50 concurrent users)
- Future: Migrate to database for scale

### 4. Discord Bot Token

**Risk:** If leaked, attacker gains bot control

**Impact:** Spam, data manipulation, server access

**Mitigation:**
- Never commit to git (✅ implemented)
- Rotate annually (manual process)
- Use environment variables (✅ implemented)
- Monitor bot activity

### 5. No CSRF Protection

**Risk:** Cross-site request forgery

**Impact:** LOW (read-only API, no state changes via web)

**Mitigation:** Not needed for current read-only endpoints

### 6. XSS (Cross-Site Scripting)

**Risk:** Malicious scripts in project names

**Current Protection:** 
- No user HTML input accepted
- Display uses textContent (safe)
- Discord bot validates input length

**Future Consideration:**
- Sanitize output if rich text is added
- Use a library like DOMPurify

## Production Security Checklist

Before deploying to production:

- [ ] Enable HTTPS
- [ ] Add rate limiting to API endpoints
- [ ] Configure CORS properly
- [ ] Set strong file permissions
- [ ] Use environment variables for all secrets
- [ ] Rotate Discord bot token
- [ ] Set up monitoring/alerting
- [ ] Run `npm audit` and fix issues
- [ ] Review logs regularly
- [ ] Consider adding authentication
- [ ] Test error handling
- [ ] Set up backups of worklight.json
- [ ] Document incident response plan

## Development vs Production

### Development (Local)
- HTTP is acceptable
- No rate limiting needed
- Relaxed CORS
- Console logging sufficient

### Production (Public)
- HTTPS required
- Rate limiting essential
- Strict CORS
- Log aggregation service
- Monitoring and alerts
- Regular security audits

## Security Roadmap

### Phase 1 (Current - MVP)
- ✅ Basic input validation
- ✅ Environment variables
- ✅ Error handling
- ⚠️ Documentation of limitations

### Phase 2 (0-100 users)
- [ ] Add rate limiting
- [ ] Configure CORS
- [ ] HTTPS enforcement
- [ ] Dependency auditing workflow

### Phase 3 (100-1000 users)
- [ ] API key authentication
- [ ] User authentication (Discord OAuth)
- [ ] Audit logging
- [ ] Security monitoring

### Phase 4 (1000+ users)
- [ ] Web Application Firewall (WAF)
- [ ] DDoS protection
- [ ] Penetration testing
- [ ] Security compliance

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Discord Bot Security](https://discord.com/developers/docs/topics/security)

## Questions?

For security questions or concerns, open a discussion on GitHub or contact the maintainers directly.

---

**Last Updated:** 2025-01-15
**Security Level:** MVP (Small Scale)
**Recommended For:** Small communities, learning projects, internal use
