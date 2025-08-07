# Page Expiry Notification System - Architecture Documentation

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                     Web Application Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Frontend UI   │  │   REST API      │  │   Admin Panel   │  │
│  │   (React)       │  │   (Node.js)     │  │   (React)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ File Processing │  │ Analytics       │  │ Stakeholder     │  │
│  │ Service         │  │ Engine          │  │ Mapping Service │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Notification    │  │ Scheduler       │  │ Configuration   │  │
│  │ Service         │  │ Service         │  │ Manager         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                     Data & Infrastructure Layer                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │     Redis       │  │   File Storage  │  │
│  │   (Primary DB)  │  │   (Cache/Queue) │  │   (Uploads)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    SendGrid     │  │    Bull Queue   │  │    Winston      │  │
│  │  (Email Service)│  │  (Job Processor)│  │   (Logging)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Component Breakdown

### 2.1 Frontend Application (React)
- **Dashboard**: Overview of system status and metrics
- **Upload Interface**: File upload with progress tracking
- **Alert Management**: View and manage notification history
- **Configuration Panel**: System settings and stakeholder mapping
- **Responsive Design**: Mobile-friendly interface

### 2.2 Backend API (Node.js + Express)
- **File Processing Controller**: Handle Excel uploads and validation
- **Analytics Controller**: Process page data and generate insights
- **Notification Controller**: Manage email alerts and templates
- **Configuration Controller**: Handle system settings and mappings
- **Authentication Middleware**: Secure API endpoints

### 2.3 Business Logic Services
- **File Processing Service**: Parse Excel files, validate data structure
- **Analytics Engine**: Identify expired and low-engagement pages
- **Stakeholder Mapping Service**: Match pages to responsible parties
- **Notification Service**: Generate and send personalized emails
- **Scheduler Service**: Handle automated processing workflows

### 2.4 Data Layer
- **PostgreSQL**: Primary database for structured data
- **Redis**: Caching and job queue management
- **File Storage**: Secure upload handling and retention

## 3. Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14+
- **Cache/Queue**: Redis 7+
- **Job Processing**: Bull Queue
- **Email Service**: SendGrid API
- **File Processing**: xlsx, csv-parser
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **Logging**: Winston with structured logging

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form
- **Charts**: Chart.js or D3.js
- **File Upload**: react-dropzone
- **Routing**: React Router

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev) / Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Load Balancer**: Nginx
- **SSL**: Let's Encrypt

## 4. Security Measures

### File Upload Security
- File type validation (Excel only)
- Size limits (50MB max)
- Virus scanning integration
- Secure file storage with signed URLs
- Input sanitization and validation

### API Security
- JWT authentication
- Rate limiting
- CORS configuration
- Input validation on all endpoints
- SQL injection prevention
- XSS protection headers

### Data Protection
- Encrypted data at rest
- Secure database connections
- PII handling compliance
- Audit logging
- Regular security updates

## 5. Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer configuration
- Database connection pooling
- Redis clustering support

### Performance Optimization
- Database indexing strategy
- Caching frequently accessed data
- Lazy loading for large datasets
- Asynchronous processing for heavy tasks

### Monitoring & Observability
- Application metrics
- Database performance monitoring
- Error tracking and alerting
- User activity analytics