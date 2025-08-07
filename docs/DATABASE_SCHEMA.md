# Database Schema

## PostgreSQL Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. File Uploads Table
```sql
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'uploaded',
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB
);

CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_status ON file_uploads(status);
CREATE INDEX idx_file_uploads_upload_date ON file_uploads(upload_date);
```

### 3. Processing Results Table
```sql
CREATE TABLE processing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_upload_id UUID REFERENCES file_uploads(id) ON DELETE CASCADE,
  total_rows INTEGER NOT NULL,
  processed_rows INTEGER NOT NULL,
  expired_pages INTEGER DEFAULT 0,
  low_engagement_pages INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  processing_duration INTEGER, -- milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_processing_results_file_upload_id ON processing_results(file_upload_id);
```

### 4. Pages Table
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_upload_id UUID REFERENCES file_uploads(id) ON DELETE CASCADE,
  url VARCHAR(2000) NOT NULL,
  title VARCHAR(500),
  created_date DATE,
  updated_date DATE,
  published_date DATE,
  page_views INTEGER DEFAULT 0,
  page_type VARCHAR(50), -- 'expired', 'low-engagement', 'normal'
  stakeholder_email VARCHAR(255),
  department VARCHAR(100),
  last_analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_pages_url ON pages(url);
CREATE INDEX idx_pages_type ON pages(page_type);
CREATE INDEX idx_pages_stakeholder ON pages(stakeholder_email);
CREATE INDEX idx_pages_last_analyzed ON pages(last_analyzed_at);
CREATE INDEX idx_pages_file_upload_id ON pages(file_upload_id);
```

### 5. Stakeholder Mappings Table
```sql
CREATE TABLE stakeholder_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_type VARCHAR(50) NOT NULL, -- 'exact_url', 'pattern', 'department'
  url_pattern VARCHAR(1000),
  department VARCHAR(100),
  stakeholder_email VARCHAR(255) NOT NULL,
  priority INTEGER DEFAULT 100, -- Lower number = higher priority
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stakeholder_mappings_type ON stakeholder_mappings(mapping_type);
CREATE INDEX idx_stakeholder_mappings_pattern ON stakeholder_mappings(url_pattern);
CREATE INDEX idx_stakeholder_mappings_department ON stakeholder_mappings(department);
CREATE INDEX idx_stakeholder_mappings_active ON stakeholder_mappings(is_active);
```

### 6. Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'expired', 'low-engagement'
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  external_id VARCHAR(255), -- SendGrid message ID
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_page_id ON notifications(page_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_email);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX idx_notifications_external_id ON notifications(external_id);
```

### 7. Notification History Table
```sql
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_notification_history_notification_id ON notification_history(notification_id);
CREATE INDEX idx_notification_history_timestamp ON notification_history(timestamp);
```

### 8. System Configuration Table
```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_config_key ON system_config(config_key);

-- Insert default configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('thresholds', '{"expiryDays": 730, "lowEngagementViews": 5, "newPageDays": 30}', 'Page analysis thresholds'),
('notifications', '{"cooldownHours": 168, "maxRetries": 3, "fromEmail": "noreply@company.com"}', 'Notification settings'),
('scheduling', '{"enabled": true, "cronExpression": "0 9 * * 1", "timezone": "UTC"}', 'Scheduler configuration'),
('email', '{"provider": "sendgrid", "apiKey": "", "templates": {}}', 'Email service configuration');
```

### 9. Scheduled Jobs Table
```sql
CREATE TABLE scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR(100) NOT NULL,
  job_type VARCHAR(50) NOT NULL, -- 'file-processing', 'notification-sending'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- milliseconds
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scheduled_jobs_name ON scheduled_jobs(job_name);
CREATE INDEX idx_scheduled_jobs_status ON scheduled_jobs(status);
CREATE INDEX idx_scheduled_jobs_scheduled_at ON scheduled_jobs(scheduled_at);
```

### 10. Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

## Data Models (TypeScript)

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

### File Upload Model
```typescript
interface FileUpload {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  uploadDate: Date;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}
```

### Page Model
```typescript
interface Page {
  id: string;
  fileUploadId: string;
  url: string;
  title?: string;
  createdDate?: Date;
  updatedDate?: Date;
  publishedDate?: Date;
  pageViews: number;
  pageType: 'expired' | 'low-engagement' | 'normal';
  stakeholderEmail?: string;
  department?: string;
  lastAnalyzedAt: Date;
  metadata?: Record<string, any>;
}
```

### Notification Model
```typescript
interface Notification {
  id: string;
  pageId: string;
  notificationType: 'expired' | 'low-engagement';
  recipientEmail: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  errorMessage?: string;
  externalId?: string;
  retryCount: number;
  createdAt: Date;
}
```

### Stakeholder Mapping Model
```typescript
interface StakeholderMapping {
  id: string;
  mappingType: 'exact_url' | 'pattern' | 'department';
  urlPattern?: string;
  department?: string;
  stakeholderEmail: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### System Configuration Model
```typescript
interface SystemConfig {
  id: string;
  configKey: string;
  configValue: Record<string, any>;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ThresholdConfig {
  expiryDays: number;
  lowEngagementViews: number;
  newPageDays: number;
}

interface NotificationConfig {
  cooldownHours: number;
  maxRetries: number;
  fromEmail: string;
}

interface SchedulingConfig {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
}
```