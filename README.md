# Page Expiry Notification System

A comprehensive content lifecycle management system for Thomson Reuters websites.

## Database Setup

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`
4. Run the database schema from `src/lib/database.ts`

### 2. Database Schema

The system uses the following main tables:

- **site_configurations**: Website settings and thresholds
- **stakeholder_mappings**: URL pattern to stakeholder email mappings
- **system_config**: System-wide configuration settings
- **scheduled_jobs**: Job scheduling and status tracking
- **email_notifications**: Email sending and delivery tracking

### 3. Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_FROM_EMAIL=noreply@thomsonreuters.com
```

## Features

### ✅ Site Configuration Management
- **Database-backed configuration** with real-time updates
- **Stakeholder mapping** with pattern matching
- **Threshold customization** per domain
- **Enable/disable sites** functionality

### ✅ Email Testing
- **Interactive email modal** for testing configuration
- **Real email sending** with status tracking
- **Database logging** of all email attempts

### ✅ Scheduler Management
- **Start/Stop scheduler** functionality
- **Database persistence** of scheduler state
- **Real-time status updates**
- **Job tracking** and history

### ✅ File Processing
- **Excel file upload** and validation
- **Progress tracking** with visual indicators
- **Database storage** of processing results

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start development server: `npm run dev`

## Database Migration

Run this SQL in your Supabase SQL editor:

```sql
-- Copy the DATABASE_SCHEMA from src/lib/database.ts
```

## Production Deployment

1. Build the application: `npm run build`
2. Deploy to your hosting platform
3. Set up environment variables in production
4. Configure email service (SendGrid recommended)

## Support

For technical support, contact the development team or refer to the documentation in the `/docs` folder.