# Security Strategy

## 1. File Upload Security

### File Validation
```javascript
const fileValidation = {
  allowedTypes: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv (optional)
  ],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 1,
  allowedExtensions: ['.xlsx', '.xls', '.csv']
};

// File validation middleware
const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Check file type
  if (!fileValidation.allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Check file size
  if (req.file.size > fileValidation.maxFileSize) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  // Check file extension
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!fileValidation.allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: 'Invalid file extension' });
  }
  
  next();
};
```

### Secure File Storage
```javascript
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/temp');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileValidation.maxFileSize,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Additional server-side validation
    if (fileValidation.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});
```

### Virus Scanning Integration
```javascript
const ClamAV = require('clamscan');

const initClamScan = async () => {
  const clamscan = await new ClamAV().init({
    removeInfected: true,
    quarantineInfected: false,
    scanLog: './scan.log',
    debugMode: false
  });
  return clamscan;
};

const scanFile = async (filePath) => {
  try {
    const clamscan = await initClamScan();
    const { isInfected, file, viruses } = await clamscan.scanFile(filePath);
    
    if (isInfected) {
      throw new Error(`File infected with: ${viruses.join(', ')}`);
    }
    
    return { clean: true };
  } catch (error) {
    throw new Error(`Virus scan failed: ${error.message}`);
  }
};
```

## 2. API Security

### Authentication & Authorization
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT Configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  issuer: 'page-expiry-system',
  audience: 'page-expiry-users'
};

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Input Validation
```javascript
const Joi = require('joi');

const schemas = {
  fileUpload: Joi.object({
    processImmediately: Joi.boolean().default(false)
  }),
  
  configUpdate: Joi.object({
    thresholds: Joi.object({
      expiryDays: Joi.number().min(1).max(3650),
      lowEngagementViews: Joi.number().min(1).max(1000),
      newPageDays: Joi.number().min(1).max(365)
    }),
    notifications: Joi.object({
      cooldownHours: Joi.number().min(1).max(8760),
      fromEmail: Joi.string().email()
    })
  }),
  
  mappingUpdate: Joi.object({
    mappings: Joi.object({
      exact_urls: Joi.object().pattern(
        Joi.string().uri({ relativeOnly: true }),
        Joi.string().email()
      ),
      patterns: Joi.object().pattern(
        Joi.string(),
        Joi.string().email()
      ),
      departments: Joi.object().pattern(
        Joi.string(),
        Joi.string().email()
      )
    })
  })
};

const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details.map(d => d.message)
      });
    }
    req.body = value;
    next();
  };
};
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user && req.user.role === 'admin';
    }
  });
};

// Different limits for different endpoints
const rateLimits = {
  general: createLimiter(15 * 60 * 1000, 100, 'Too many requests'),
  upload: createLimiter(60 * 60 * 1000, 10, 'Too many file uploads'),
  auth: createLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  config: createLimiter(60 * 60 * 1000, 20, 'Too many configuration changes')
};
```

## 3. Data Protection

### Database Security
```javascript
// Connection security
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};

// Query parameterization
const safeQuery = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
};
```

### Encryption
```javascript
const crypto = require('crypto');

const encryption = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16
};

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(encryption.ivLength);
  const cipher = crypto.createCipher(encryption.algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
};

const decrypt = (encryptedData, key) => {
  const decipher = crypto.createDecipher(
    encryption.algorithm,
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

### PII Handling
```javascript
const piiFields = ['email', 'firstName', 'lastName', 'phone'];

const sanitizeForLogs = (data) => {
  const sanitized = { ...data };
  
  piiFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

const hashPII = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
```

## 4. Security Headers

### Express Security Configuration
```javascript
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(compression());

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## 5. Monitoring & Alerts

### Security Event Logging
```javascript
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
    new winston.transports.Console()
  ]
});

const logSecurityEvent = (event, user, details) => {
  securityLogger.warn('Security Event', {
    event,
    userId: user?.id,
    userEmail: user?.email,
    ip: details.ip,
    userAgent: details.userAgent,
    timestamp: new Date().toISOString(),
    details
  });
};

// Security event types
const SecurityEvents = {
  FAILED_LOGIN: 'failed_login',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  SUSPICIOUS_FILE_UPLOAD: 'suspicious_file_upload',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INVALID_TOKEN: 'invalid_token',
  PRIVILEGE_ESCALATION: 'privilege_escalation'
};
```

### Intrusion Detection
```javascript
const suspiciousActivity = new Map();

const detectSuspiciousActivity = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!suspiciousActivity.has(key)) {
    suspiciousActivity.set(key, { count: 0, firstSeen: now });
  }
  
  const activity = suspiciousActivity.get(key);
  
  if (now - activity.firstSeen > windowMs) {
    // Reset counter if window expired
    activity.count = 0;
    activity.firstSeen = now;
  }
  
  activity.count++;
  
  // Flag suspicious activity
  if (activity.count > 50) {
    logSecurityEvent(SecurityEvents.SUSPICIOUS_ACTIVITY, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestCount: activity.count,
      timeWindow: windowMs
    });
    
    return res.status(429).json({
      error: 'Suspicious activity detected'
    });
  }
  
  next();
};
```

## 6. Compliance & Audit

### GDPR Compliance
```javascript
const gdprCompliance = {
  dataRetentionPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
  
  anonymizeUser: async (userId) => {
    await pool.query(`
      UPDATE users 
      SET email = 'anonymized@example.com',
          first_name = 'Anonymous',
          last_name = 'User',
          anonymized_at = NOW()
      WHERE id = $1
    `, [userId]);
  },
  
  exportUserData: async (userId) => {
    const userData = await pool.query(`
      SELECT id, email, first_name, last_name, created_at
      FROM users WHERE id = $1
    `, [userId]);
    
    const userActivity = await pool.query(`
      SELECT * FROM audit_logs WHERE user_id = $1
    `, [userId]);
    
    return {
      profile: userData.rows[0],
      activity: userActivity.rows
    };
  }
};
```

### Audit Trail
```javascript
const auditLog = async (req, action, resourceType, resourceId, changes) => {
  const logEntry = {
    userId: req.user?.id,
    action,
    resourceType,
    resourceId,
    oldValues: changes?.before,
    newValues: changes?.after,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  };
  
  await pool.query(`
    INSERT INTO audit_logs 
    (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    logEntry.userId,
    logEntry.action,
    logEntry.resourceType,
    logEntry.resourceId,
    JSON.stringify(logEntry.oldValues),
    JSON.stringify(logEntry.newValues),
    logEntry.ipAddress,
    logEntry.userAgent,
    logEntry.timestamp
  ]);
};
```