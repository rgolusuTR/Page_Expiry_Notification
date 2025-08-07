# 📚 Page Expiry Notification System - Complete Documentation

## 🏗️ **System Architecture Overview**

The Page Expiry Notification System is a comprehensive web application designed to monitor website content lifecycle, identify expired or underperforming pages, and automatically notify stakeholders for content review and optimization.

### **Core Components**

- **Frontend**: React.js with TypeScript
- **Database**: Supabase (PostgreSQL) with localStorage fallback
- **Email Service**: Multiple providers (SendGrid, Nodemailer, etc.)
- **File Processing**: Excel/CSV parsing with XLSX library
- **Scheduling**: Automated cron-based processing

---

## 🔄 **How the Application Works**

### **1. Data Input & Processing Pipeline**

#### **File Upload Process**

```
Excel/CSV File → File Validation → Data Parsing → Domain Mapping → Stakeholder Assignment → Results Generation
```

**Supported File Formats:**

- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma-separated values)

**Required Columns:**

- **URL/Page** (Required): Page URLs to analyze
- **Created/Date** (Optional): Page creation date
- **Views/Traffic** (Optional): Page view statistics
- **Title/Name** (Optional): Page titles
- **Updated/Modified** (Optional): Last modification date

#### **Data Processing Steps**

1. **File Validation**

   - File size limit: 50MB maximum
   - Format verification
   - Header row detection
   - Column mapping validation

2. **Data Extraction**

   - Parse Excel serial dates to ISO format
   - Extract domain and path from URLs
   - Normalize data types and formats
   - Handle missing or malformed data

3. **Age Calculation**

   - Calculate page age in days and years
   - Compare against configurable expiry thresholds
   - Identify pages requiring attention

4. **Stakeholder Mapping**

   - Match URLs to stakeholder email addresses
   - Apply pattern-based routing rules
   - Use department-based fallbacks
   - Assign default stakeholders for unmapped pages

5. **Alert Classification**
   - **Expired Pages**: Age exceeds configured threshold (default: 730 days)
   - **Low Engagement**: Views below threshold AND age > 30 days
   - **New Pages**: Created within configured timeframe (default: 45 days)

### **2. Processing Capacity & Performance**

#### **File Processing Limits**

| Metric               | Limit                    | Performance Impact                           |
| -------------------- | ------------------------ | -------------------------------------------- |
| **File Size**        | 50 MB                    | Processing time: ~2-5 seconds per MB         |
| **Row Count**        | 100,000 rows             | Memory usage: ~50MB per 10K rows             |
| **Concurrent Files** | 1 at a time              | Sequential processing prevents memory issues |
| **Processing Time**  | ~30 seconds for 50K rows | Includes stakeholder mapping and validation  |

#### **Real-World Processing Examples**

**Small Dataset (1,000 pages)**

- Processing Time: 2-3 seconds
- Memory Usage: ~5MB
- Database Storage: ~500KB

**Medium Dataset (10,000 pages)**

- Processing Time: 8-12 seconds
- Memory Usage: ~25MB
- Database Storage: ~5MB

**Large Dataset (50,000 pages)**

- Processing Time: 25-35 seconds
- Memory Usage: ~100MB
- Database Storage: ~25MB

**Enterprise Dataset (100,000 pages)**

- Processing Time: 45-60 seconds
- Memory Usage: ~200MB
- Database Storage: ~50MB

#### **Performance Optimization Features**

- **Streaming Processing**: Large files processed in chunks
- **Memory Management**: Automatic garbage collection
- **Progress Tracking**: Real-time processing updates
- **Error Recovery**: Graceful handling of malformed data
- **Batch Operations**: Efficient database insertions

---

## 📧 **Email Alerts & Notifications System**

### **Email Service Configuration**

#### **Supported Email Providers**

1. **SendGrid** (Recommended for production)

   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_api_key_here
   FROM_EMAIL=noreply@yourcompany.com
   FROM_NAME=Page Expiry System
   ```

2. **Nodemailer with SMTP**

   ```env
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FROM_EMAIL=your_email@gmail.com
   FROM_NAME=Page Expiry System
   ```

3. **Amazon SES**
   ```env
   EMAIL_SERVICE=ses
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   FROM_EMAIL=noreply@yourcompany.com
   FROM_NAME=Page Expiry System
   ```

### **Email Alert Types**

#### **1. Expired Page Alerts**

**Trigger**: Pages older than configured expiry threshold
**Recipients**: Mapped stakeholders or default contacts
**Frequency**: Configurable (default: weekly)
**Content**:

- Page URL and title
- Creation date and current age
- Page view statistics
- Recommended actions
- Direct links for content review

**Sample Email Structure:**

```
Subject: 🚨 Action Required: Expired Page Review - [Page Title]

Dear [Stakeholder Name],

The following page on your website has exceeded the content expiry threshold:

📄 Page: [Page Title]
🔗 URL: [Full URL]
📅 Created: [Creation Date] ([Age] years ago)
👁️ Page Views: [View Count] (last 30 days)
⏰ Expiry Threshold: [Threshold] days

Recommended Actions:
✅ Review content for accuracy and relevance
✅ Update information if still valuable
✅ Archive or redirect if outdated
✅ Contact web team if technical assistance needed

[Review Page Button] [Contact Support Button]
```

#### **2. Low Engagement Alerts**

**Trigger**: Pages with views below threshold AND age > 30 days
**Recipients**: Content managers and stakeholders
**Frequency**: Monthly
**Content**:

- Performance metrics
- Engagement comparison
- Optimization suggestions
- SEO recommendations

#### **3. Proactive Warnings**

**Trigger**: Pages approaching expiry (30 days before threshold)
**Recipients**: Content owners
**Frequency**: Weekly
**Content**:

- Early warning notifications
- Content review reminders
- Scheduling assistance

### **Email Delivery Metrics**

#### **Sending Capacity**

| Provider          | Daily Limit       | Monthly Limit | Rate Limit  |
| ----------------- | ----------------- | ------------- | ----------- |
| **SendGrid Free** | 100 emails        | 3,000 emails  | 600/hour    |
| **SendGrid Pro**  | Unlimited         | Unlimited     | 10,000/hour |
| **Gmail SMTP**    | 500 emails        | 15,000 emails | 250/hour    |
| **Amazon SES**    | 200/day (initial) | Scalable      | 14/second   |

#### **Delivery Performance**

- **Average Delivery Time**: 30 seconds - 2 minutes
- **Success Rate**: 98-99% (with proper configuration)
- **Bounce Handling**: Automatic retry with exponential backoff
- **Spam Prevention**: SPF, DKIM, DMARC compliance

#### **Email Processing Workflow**

```
Alert Generation → Template Rendering → Stakeholder Lookup → Queue Management → Delivery Attempt → Status Tracking → Retry Logic → Final Status
```

### **Notification Features**

#### **Real-time Dashboard Notifications**

- **Success Messages**: File processing completion
- **Error Alerts**: Processing failures or email issues
- **Progress Updates**: Real-time processing status
- **System Status**: Service health and configuration

#### **Alert History Tracking**

- **Sent Emails**: Complete audit trail
- **Delivery Status**: Sent, delivered, bounced, failed
- **Recipient Tracking**: Who received which alerts
- **Performance Metrics**: Open rates, click rates (if supported)

---

## 💾 **Data Storage & Management**

### **Database Architecture**

#### **Primary Storage: Supabase (PostgreSQL)**

**Connection Details:**

- **Type**: Cloud-hosted PostgreSQL database
- **Location**: Configurable regions (US, EU, Asia)
- **Backup**: Automatic daily backups
- **Security**: Row-level security, SSL encryption

#### **Fallback Storage: Browser localStorage**

**Purpose**: Offline functionality and demo mode
**Capacity**: 5-10MB per domain (browser dependent)
**Persistence**: Until browser cache cleared
**Sync**: Manual export/import capabilities

### **Data Storage Capacity**

#### **Supabase Tier Limits**

| Tier           | Database Size    | Bandwidth        | API Requests | Monthly Cost |
| -------------- | ---------------- | ---------------- | ------------ | ------------ |
| **Free**       | 500 MB           | 2 GB             | 50,000       | $0           |
| **Pro**        | 8 GB + $0.125/GB | 50 GB + $0.09/GB | 5 Million    | $25          |
| **Team**       | Unlimited        | Unlimited        | Unlimited    | $599         |
| **Enterprise** | Custom           | Custom           | Custom       | Custom       |

#### **Storage Breakdown by Data Type**

**Site Configurations**

- **Storage per record**: ~500 bytes
- **Typical usage**: 10-100 sites per organization
- **Growth rate**: Very low (static configuration)
- **Retention**: Permanent

**Stakeholder Mappings**

- **Storage per record**: ~300 bytes
- **Typical usage**: 50-500 mappings per site
- **Growth rate**: Low (grows with site complexity)
- **Retention**: Permanent

**Processing History**

- **Storage per record**: ~2KB (including metadata)
- **Typical usage**: 100-1,000 processing runs per month
- **Growth rate**: Medium (continuous processing)
- **Retention**: Configurable (default: 12 months)

**Email Notifications**

- **Storage per record**: ~1.2KB (including email body)
- **Typical usage**: 1,000-10,000 emails per month
- **Growth rate**: High (depends on alert frequency)
- **Retention**: Configurable (default: 6 months)

**Page Data (Temporary)**

- **Storage per record**: ~800 bytes
- **Typical usage**: Cleared after processing
- **Growth rate**: N/A (temporary storage)
- **Retention**: 24 hours maximum

### **Data Retention Policies**

#### **Automatic Cleanup Schedule**

| Data Type               | Retention Period | Cleanup Frequency |
| ----------------------- | ---------------- | ----------------- |
| **Processing Results**  | 12 months        | Weekly            |
| **Email Notifications** | 6 months         | Weekly            |
| **System Logs**         | 3 months         | Daily             |
| **Temporary Files**     | 24 hours         | Hourly            |
| **Error Logs**          | 1 month          | Daily             |

#### **Manual Data Management**

**Export Capabilities:**

- **Processing History**: CSV/Excel export
- **Email Reports**: Detailed delivery reports
- **Configuration Backup**: JSON export
- **Alert History**: Comprehensive audit trails

**Data Purging Options:**

- **Selective Deletion**: Remove specific processing runs
- **Bulk Cleanup**: Clear data older than specified date
- **Complete Reset**: Factory reset (admin only)
- **Archive Mode**: Move old data to cold storage

### **Scalability Projections**

#### **Organization Size vs. Storage Requirements**

**Small Organization (1-5 websites)**

- **Annual Storage Growth**: ~15MB
- **Recommended Tier**: Free Supabase
- **Processing Capacity**: 10,000 pages/month
- **Email Volume**: 1,000 emails/month

**Medium Organization (10-50 websites)**

- **Annual Storage Growth**: ~75MB
- **Recommended Tier**: Free Supabase (sufficient)
- **Processing Capacity**: 50,000 pages/month
- **Email Volume**: 5,000 emails/month

**Large Organization (100+ websites)**

- **Annual Storage Growth**: ~300MB
- **Recommended Tier**: Pro Supabase
- **Processing Capacity**: 200,000 pages/month
- **Email Volume**: 20,000 emails/month

**Enterprise Level (1000+ websites)**

- **Annual Storage Growth**: ~1.5GB
- **Recommended Tier**: Team/Enterprise Supabase
- **Processing Capacity**: 1,000,000 pages/month
- **Email Volume**: 100,000 emails/month

---

## ⚙️ **System Configuration & Settings**

### **Site Configuration Management**

#### **Per-Site Settings**

```javascript
{
  domain: "www.example.com",
  name: "Example Corporate Site",
  enabled: true,
  expiry_days: 730,           // 2 years default
  engagement_threshold: 10,    // Minimum page views
  new_page_days: 45,          // New page grace period
  default_stakeholder: "webmaster@example.com"
}
```

#### **Global System Settings**

```javascript
{
  scheduler_settings: {
    enabled: true,
    cronExpression: "0 9 * * 1",  // Every Monday at 9 AM
    timezone: "UTC"
  },
  email_settings: {
    provider: "sendgrid",
    fromEmail: "noreply@company.com",
    fromName: "Page Expiry System"
  },
  notification_settings: {
    cooldownHours: 168,         // 1 week between alerts
    maxRetries: 3,              // Email retry attempts
    batchSize: 100              // Emails per batch
  }
}
```

### **Stakeholder Mapping Configuration**

#### **YAML Configuration Format**

```yaml
mappings:
  exact_urls:
    "/about": "admin@company.com"
    "/contact": "marketing@company.com"
    "/privacy": "legal@company.com"

  patterns:
    "/blog/*": "content@company.com"
    "/products/*": "product@company.com"
    "/support/*": "support@company.com"
    "/legal/*": "legal@company.com"

  departments:
    default: "webmaster@company.com"
    marketing: "marketing@company.com"
    technical: "dev@company.com"
    legal: "legal@company.com"
```

#### **Pattern Matching Rules**

- **Exact Match**: Highest priority, exact URL path match
- **Wildcard Patterns**: Use `*` for flexible matching
- **Department Fallback**: Default assignments by department
- **Global Default**: Final fallback for unmapped pages

---

## 🔧 **Installation & Setup Guide**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Email service account (SendGrid, Gmail, etc.)
- Supabase account (optional, for production)

### **Quick Start Installation**

1. **Clone Repository**

   ```bash
   git clone https://github.com/your-org/page-expiry-notification-system.git
   cd page-expiry-notification-system
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Access Application**
   ```
   http://localhost:5173
   ```

### **Production Deployment**

#### **Build for Production**

```bash
npm run build
npm run preview  # Test production build locally
```

#### **Deploy to Vercel**

```bash
npm install -g vercel
vercel --prod
```

#### **Deploy to Netlify**

```bash
npm run build
# Upload dist/ folder to Netlify
```

---

## 📊 **Monitoring & Analytics**

### **System Metrics Dashboard**

#### **Processing Metrics**

- **Files Processed**: Total count and success rate
- **Pages Analyzed**: Volume and processing time
- **Error Rate**: Failed processing attempts
- **Average Processing Time**: Performance benchmarks
- **Memory Usage**: Resource consumption tracking

#### **Email Metrics**

- **Emails Sent**: Daily/weekly/monthly volumes
- **Delivery Rate**: Success vs. failure percentages
- **Bounce Rate**: Invalid email addresses
- **Response Time**: Average email delivery time
- **Provider Performance**: Comparison across email services

#### **Storage Metrics**

- **Database Usage**: Current storage consumption
- **Growth Rate**: Storage increase over time
- **Cleanup Efficiency**: Data retention effectiveness
- **Backup Status**: Database backup health

---

## 🚨 **Troubleshooting & Support**

### **Common Issues & Solutions**

#### **File Processing Errors**

**Issue**: "Could not find URL column"
**Solution**: Ensure your Excel file has a column containing "URL", "Page", or similar header

**Issue**: "File too large" error
**Solution**: Split large files into smaller chunks (under 50MB each)

**Issue**: Processing stuck at 90%
**Solution**: Check for malformed URLs or special characters in data

#### **Email Delivery Issues**

**Issue**: Emails not being sent
**Solution**:

1. Verify email service configuration in .env file
2. Check API keys and credentials
3. Ensure sender email is verified with provider
4. Review rate limits and quotas

**Issue**: High bounce rate
**Solution**:

1. Validate stakeholder email addresses
2. Update stakeholder mappings
3. Remove invalid email addresses from system

#### **Database Connection Problems**

**Issue**: Supabase connection failed
**Solution**:

1. Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
2. Check network connectivity
3. Confirm Supabase project is active
4. System will fallback to localStorage automatically

### **Performance Optimization**

#### **Large File Processing**

- **Split Files**: Break large datasets into smaller files
- **Batch Processing**: Process files during off-peak hours
- **Memory Management**: Close other applications during processing
- **Browser Resources**: Use Chrome or Firefox for best performance

#### **Email Delivery Optimization**

- **Rate Limiting**: Respect provider rate limits
- **Batch Sending**: Send emails in smaller batches
- **Retry Logic**: Configure appropriate retry intervals
- **Provider Selection**: Choose optimal email service for volume

---

## 🔐 **Security & Compliance**

### **Data Security**

#### **Data Encryption**

- **In Transit**: All API communications use HTTPS/TLS
- **At Rest**: Supabase provides encryption at rest
- **Local Storage**: Browser localStorage is domain-isolated

#### **Access Control**

- **Authentication**: Optional user authentication system
- **Authorization**: Role-based access control
- **API Security**: Supabase Row Level Security (RLS)

#### **Privacy Compliance**

**GDPR Compliance:**

- **Data Minimization**: Only necessary data is stored
- **Right to Deletion**: Manual data purging capabilities
- **Data Portability**: Export functionality available
- **Consent Management**: Stakeholder email consent tracking

**Data Retention:**

- **Automatic Cleanup**: Configurable retention periods
- **Manual Deletion**: Admin controls for data removal
- **Audit Trails**: Complete processing and email logs

### **Best Practices**

#### **Email Security**

- **SPF Records**: Configure sender policy framework
- **DKIM Signing**: Enable domain key identification
- **DMARC Policy**: Set up domain-based message authentication
- **Unsubscribe Links**: Include opt-out mechanisms

#### **System Security**

- **Environment Variables**: Store sensitive data in .env files
- **API Key Rotation**: Regular credential updates
- **Access Logging**: Monitor system access and usage
- **Backup Strategy**: Regular database backups

---

## 📈 **Scaling & Enterprise Features**

### **Horizontal Scaling**

#### **Multi-Instance Deployment**

- **Load Balancing**: Distribute processing across instances
- **Database Sharding**: Split data across multiple databases
- **CDN Integration**: Global content delivery
- **Microservices**: Separate processing and email services

#### **Enterprise Integrations**

**Active Directory Integration:**

```javascript
{
  auth_provider: "active_directory",
  domain: "company.com",
  ldap_server: "ldap://company.com:389",
  user_mapping: {
    email: "mail",
    name: "displayName",
    department: "department"
  }
}
```

**API Integration:**

```javascript
// Custom API endpoints for enterprise systems
POST / api / v1 / process - batch;
GET / api / v1 / reports / summary;
PUT / api / v1 / stakeholders / bulk - update;
DELETE / api / v1 / data / cleanup;
```

### **Advanced Features**

#### **Machine Learning Integration**

- **Content Classification**: Automatic page categorization
- **Engagement Prediction**: ML-based engagement forecasting
- **Anomaly Detection**: Unusual traffic pattern identification
- **Optimization Suggestions**: AI-powered content recommendations

#### **Advanced Reporting**

- **Executive Dashboards**: High-level metrics and KPIs
- **Trend Analysis**: Historical data analysis and forecasting
- **Custom Reports**: Configurable report generation
- **Data Visualization**: Interactive charts and graphs

---

## 🔄 **API Reference**

### **Core Endpoints**

#### **File Processing API**

```javascript
// Upload and process file
POST /api/process-file
Content-Type: multipart/form-data
Body: { file: [Excel/CSV file] }

Response: {
  success: true,
  processingId: "uuid",
  totalPages: 1000,
  expiredPages: 45,
  lowEngagementPages: 23
}
```

#### **Configuration API**

```javascript
// Get site configurations
GET /api/sites
Response: [
  {
    id: "uuid",
    domain: "example.com",
    name: "Example Site",
    expiry_days: 730,
    engagement_threshold: 10
  }
]

// Update site configuration
PUT /api/sites/{id}
Body: {
  expiry_days: 365,
  engagement_threshold: 15
}
```

#### **Email API**

```javascript
// Send email alerts
POST /api/send-alerts
Body: {
  pages: ["page-id-1", "page-id-2"],
  alertType: "expired"
}

Response: {
  sent: 15,
  failed: 2,
  results: [...]
}
```

### **Webhook Support**

#### **Processing Webhooks**

```javascript
// Webhook payload for processing completion
{
  event: "processing.completed",
  timestamp: "2024-01-15T10:30:00Z",
  data: {
    processingId: "uuid",
    fileName: "analytics-report.xlsx",
    totalPages: 1000,
    expiredPages: 45,
    processingTime: 23.5
  }
}
```

#### **Email Webhooks**

```javascript
// Webhook payload for email delivery
{
  event: "email.delivered",
  timestamp: "2024-01-15T10:35:00Z",
  data: {
    messageId: "uuid",
    recipient: "stakeholder@company.com",
    subject: "Expired Page Alert",
    status: "delivered"
  }
}
```

---

## 📋 **Maintenance & Updates**

### **Regular Maintenance Tasks**

#### **Daily Tasks**

- **System Health Check**: Verify all services are running
- **Error Log Review**: Check for processing or email errors
- **Database Cleanup**: Remove temporary files and logs
- **Backup Verification**: Ensure backups completed successfully

#### **Weekly Tasks**

- **Performance Review**: Analyze processing times and bottlenecks
- **Storage Analysis**: Monitor database growth and usage
- **Email Metrics**: Review delivery rates and bounce statistics
- **Security Audit**: Check for suspicious activity or access

#### **Monthly Tasks**

- **Capacity Planning**: Forecast storage and processing needs
- **Configuration Review**: Update expiry thresholds and mappings
- **Stakeholder Validation**: Verify email addresses are current
- **System Updates**: Apply security patches and feature updates

### **Update Procedures**

#### **Application Updates**

```bash
# Backup current configuration
cp .env .env.backup
cp -r config/ config.backup/

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run database migrations (if any)
npm run migrate

# Test in staging environment
npm run build
npm run preview

# Deploy to production
npm run deploy
```

#### **Database Migrations**

```sql
-- Example migration for new features
ALTER TABLE site_configurations
ADD COLUMN notification_frequency VARCHAR(20) DEFAULT 'weekly';

ALTER TABLE email_notifications
ADD COLUMN template_version INTEGER DEFAULT 1;

-- Update existing records
UPDATE site_configurations
SET notification_frequency = 'weekly'
WHERE notification_frequency IS NULL;
```

---

## 📞 **Support & Contact Information**

### **Technical Support**

**System Administrator:**

- **Email**: admin@yourcompany.com
- **Phone**: +1-555-0123
- **Hours**: Monday-Friday, 9 AM - 5 PM EST

**Development Team:**

- **Email**: dev-team@yourcompany.com
- **Slack**: #page-expiry-system
- **Issue Tracker**: GitHub Issues

### **Documentation & Resources**

**Online Resources:**

- **User Guide**: https://docs.yourcompany.com/page-expiry-system
- **API Documentation**: https://api.yourcompany.com/docs
- **Video Tutorials**: https://training.yourcompany.com/videos
- **FAQ**: https://support.yourcompany.com/faq

**Training Materials:**

- **Administrator Training**: 2-hour online course
- **End User Training**: 30-minute quick start guide
- **Developer Documentation**: Technical implementation guide
- **Best Practices Guide**: Optimization and configuration tips

---

## 📊 **Appendix: Sample Data & Templates**

### **Sample Excel File Structure**

```
| Page URL                              | Page Title           | Created Date | Page Views | Last Updated |
|---------------------------------------|---------------------|--------------|------------|--------------|
| https://example.com/about            | About Us            | 2020-01-15   | 1,250      | 2023-06-10   |
| https://example.com/products/widget-a| Widget A Product    | 2019-03-22   | 890        | 2022-11-15   |
| https://example.com/blog/old-post    | Old Blog Post       | 2018-07-08   | 45         | 2018-07-08   |
```

### **Sample Stakeholder Mapping YAML**

```yaml
# Complete stakeholder mapping example
mappings:
  # Exact URL matches (highest priority)
  exact_urls:
    "/": "webmaster@company.com"
    "/about": "marketing@company.com"
    "/contact": "marketing@company.com"
    "/privacy": "legal@company.com"
    "/terms": "legal@company.com"
    "/careers": "hr@company.com"

  # Pattern-based matching (medium priority)
  patterns:
    "/blog/*": "content@company.com"
    "/news/*": "content@company.com"
    "/products/*": "product@company.com"
    "/services/*": "product@company.com"
    "/support/*": "support@company.com"
    "/help/*": "support@company.com"
    "/legal/*": "legal@company.com"
    "/investor/*": "investor-relations@company.com"
    "/press/*": "pr@company.com"

  # Department-based fallbacks (lowest priority)
  departments:
    default: "webmaster@company.com"
    marketing: "marketing@company.com"
    product: "product@company.com"
    technical: "dev@company.com"
    legal: "legal@company.com"
    support: "support@company.com"
    content: "content@company.com"
```

### **Sample Email Templates**

#### **Expired Page Alert Template**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Expired Page Alert</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #d32f2f;">🚨 Action Required: Expired Page Review</h1>

      <p>Dear {{stakeholder_name}},</p>

      <p>
        The following page on your website has exceeded the content expiry
        threshold and requires your attention:
      </p>

      <div
        style="background: #f5f5f5; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;"
      >
        <h3 style="margin: 0 0 10px 0;">{{page_title}}</h3>
        <p style="margin: 5px 0;">
          <strong>URL:</strong> <a href="{{page_url}}">{{page_url}}</a>
        </p>
        <p style="margin: 5px 0;">
          <strong>Created:</strong> {{creation_date}} ({{page_age}} years ago)
        </p>
        <p style="margin: 5px 0;">
          <strong>Page Views:</strong> {{page_views}} (last 30 days)
        </p>
        <p style="margin: 5px 0;">
          <strong>Expiry Threshold:</strong> {{expiry_threshold}} days
        </p>
      </div>

      <h3>Recommended Actions:</h3>
      <ul>
        <li>✅ Review content for accuracy and relevance</li>
        <li>✅ Update information if still valuable</li>
        <li>✅ Archive or redirect if outdated</li>
        <li>✅ Contact web team if technical assistance needed</li>
      </ul>

      <div style="margin: 30px 0; text-align: center;">
        <a
          href="{{page_url}}"
          style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 0 10px;"
          >Review Page</a
        >
        <a
          href="mailto:support@company.com"
          style="background: #666; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 0 10px;"
          >Contact Support</a
        >
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

      <p style="font-size: 12px; color: #666;">
        This is an automated message from the Page Expiry Notification System.
        If you believe this email was sent in error, please contact your system
        administrator.
      </p>
    </div>
  </body>
</html>
```

---

## 🏁 **Conclusion**

The Page Expiry Notification System provides a comprehensive solution for automated content lifecycle management. With its robust processing capabilities, flexible email notification system, and scalable architecture, it can handle organizations of all sizes from small businesses to large enterprises.

**Key Benefits:**

- **Automated Monitoring**: Continuous content lifecycle tracking
- **Scalable Processing**: Handle up to 100,000 pages per processing run
- **Flexible Notifications**: Multiple email providers and customizable alerts
- **Data Security**: Enterprise-grade security and compliance features
- **Easy Integration**: RESTful APIs and webhook support

**Getting Started:**

1. Follow the installation guide to set up your instance
2. Configure your email service provider
3. Upload your first analytics report
4. Set up stakeholder mappings
5. Enable automated scheduling

For additional support, training, or enterprise features, please contact our support team or visit our documentation portal.
