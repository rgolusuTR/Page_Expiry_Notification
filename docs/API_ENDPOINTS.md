# REST API Endpoints

## Authentication

### POST /api/auth/login
**Description**: Authenticate user and receive JWT token
**Request Body**:
```json
{
  "username": "admin@company.com",
  "password": "securepassword"
}
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### POST /api/auth/refresh
**Description**: Refresh JWT token
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2024-02-15T10:30:00Z"
}
```

## File Processing

### POST /api/files/upload
**Description**: Upload Excel file for processing
**Content-Type**: `multipart/form-data`
**Request Body**:
```
file: <Excel file>
processImmediately: true/false
```
**Response**:
```json
{
  "uploadId": "uuid-123-456",
  "filename": "analytics_report.xlsx",
  "status": "uploaded",
  "size": 1024000,
  "uploadedAt": "2024-01-15T10:00:00Z"
}
```

### GET /api/files/upload/{uploadId}/status
**Description**: Check processing status
**Response**:
```json
{
  "uploadId": "uuid-123-456",
  "status": "processing|completed|failed",
  "progress": 75,
  "totalRows": 1000,
  "processedRows": 750,
  "errors": [],
  "results": {
    "expiredPages": 45,
    "lowEngagementPages": 12,
    "totalPages": 1000
  }
}
```

### GET /api/files/history
**Description**: Get file processing history
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status

**Response**:
```json
{
  "files": [
    {
      "id": "uuid-123",
      "filename": "report.xlsx",
      "status": "completed",
      "uploadedAt": "2024-01-15T10:00:00Z",
      "processedAt": "2024-01-15T10:05:00Z",
      "results": {
        "expiredPages": 45,
        "lowEngagementPages": 12,
        "totalPages": 1000
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Analytics & Insights

### GET /api/analytics/dashboard
**Description**: Get dashboard statistics
**Response**:
```json
{
  "metrics": {
    "totalPages": 12847,
    "expiredPages": 324,
    "lowEngagementPages": 89,
    "alertsSent": 156,
    "lastProcessed": "2024-01-15T09:00:00Z"
  },
  "trends": {
    "expiredPagesThisMonth": 45,
    "lowEngagementPagesThisMonth": 23,
    "alertsThisMonth": 156
  }
}
```

### GET /api/analytics/pages
**Description**: Get page analysis results
**Query Parameters**:
- `type`: `expired|low-engagement|all`
- `page`: Page number
- `limit`: Items per page
- `sortBy`: `date|views|url`
- `sortOrder`: `asc|desc`

**Response**:
```json
{
  "pages": [
    {
      "url": "/old-blog-post",
      "title": "Old Blog Post",
      "createdDate": "2021-01-15",
      "updatedDate": "2021-02-01",
      "publishedDate": "2021-01-15",
      "pageViews": 5,
      "type": "expired",
      "stakeholder": "content@company.com",
      "lastAlertSent": "2024-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 324,
    "pages": 17
  }
}
```

## Notifications

### GET /api/notifications/history
**Description**: Get notification history
**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `type`: `expired|low-engagement`
- `status`: `sent|delivered|opened|clicked`

**Response**:
```json
{
  "notifications": [
    {
      "id": "uuid-789",
      "type": "expired",
      "recipient": "content@company.com",
      "subject": "Expired Page Review Required",
      "pageUrl": "/old-blog-post",
      "sentAt": "2024-01-15T09:00:00Z",
      "status": "delivered",
      "openedAt": "2024-01-15T09:15:00Z",
      "clickedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

### POST /api/notifications/send
**Description**: Send manual notification
**Request Body**:
```json
{
  "type": "expired|low-engagement",
  "pageUrl": "/specific-page",
  "recipient": "stakeholder@company.com",
  "customMessage": "Additional context about this page"
}
```

### GET /api/notifications/templates
**Description**: Get email templates
**Response**:
```json
{
  "templates": [
    {
      "type": "expired",
      "subject": "Expired Page Review Required: {{pageUrl}}",
      "body": "HTML template content...",
      "lastUpdated": "2024-01-10T08:00:00Z"
    }
  ]
}
```

## Configuration

### GET /api/config/settings
**Description**: Get system configuration
**Response**:
```json
{
  "thresholds": {
    "expiryDays": 730,
    "lowEngagementViews": 5,
    "newPageDays": 30
  },
  "notifications": {
    "cooldownHours": 168,
    "maxRetries": 3,
    "fromEmail": "noreply@company.com"
  },
  "scheduling": {
    "enabled": true,
    "cronExpression": "0 9 * * 1",
    "timezone": "UTC"
  }
}
```

### PUT /api/config/settings
**Description**: Update system configuration
**Request Body**:
```json
{
  "thresholds": {
    "expiryDays": 730,
    "lowEngagementViews": 5
  },
  "notifications": {
    "cooldownHours": 168
  }
}
```

### GET /api/config/mappings
**Description**: Get stakeholder mappings
**Response**:
```json
{
  "mappings": {
    "exact_urls": {
      "/about": "admin@company.com",
      "/contact": "marketing@company.com"
    },
    "patterns": {
      "/blog/*": "content@company.com",
      "/products/*": "product@company.com"
    },
    "departments": {
      "default": "webmaster@company.com",
      "marketing": "marketing@company.com"
    }
  },
  "lastUpdated": "2024-01-10T08:00:00Z"
}
```

### PUT /api/config/mappings
**Description**: Update stakeholder mappings
**Request Body**:
```json
{
  "mappings": {
    "exact_urls": {
      "/about": "admin@company.com"
    },
    "patterns": {
      "/blog/*": "content@company.com"
    }
  }
}
```

## Scheduler

### POST /api/scheduler/trigger
**Description**: Trigger manual processing
**Request Body**:
```json
{
  "fileId": "uuid-123-456",
  "sendNotifications": true
}
```

### GET /api/scheduler/status
**Description**: Get scheduler status
**Response**:
```json
{
  "enabled": true,
  "nextRun": "2024-01-22T09:00:00Z",
  "lastRun": "2024-01-15T09:00:00Z",
  "lastRunStatus": "success",
  "currentlyRunning": false
}
```

### PUT /api/scheduler/config
**Description**: Update scheduler configuration
**Request Body**:
```json
{
  "enabled": true,
  "cronExpression": "0 9 * * 1",
  "timezone": "UTC"
}
```

## Logging & Monitoring

### GET /api/logs
**Description**: Get system logs
**Query Parameters**:
- `level`: `error|warn|info|debug`
- `service`: Service name filter
- `startDate`: Start date filter
- `endDate`: End date filter
- `page`: Page number
- `limit`: Items per page

**Response**:
```json
{
  "logs": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "level": "info",
      "service": "file-processor",
      "message": "File processing completed successfully",
      "metadata": {
        "fileId": "uuid-123",
        "processedRows": 1000
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "pages": 20
  }
}
```

### GET /api/health
**Description**: Health check endpoint
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "email": "healthy",
    "fileStorage": "healthy"
  },
  "version": "1.0.0"
}
```