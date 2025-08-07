# Email Configuration Guide

## ⚠️ Important: Email Service Setup Required

The Page Expiry Notification System is currently running in **DEMO MODE** - emails are only simulated and not actually sent to recipients. To enable real email delivery, you need to configure an email service.

## Why Emails Are Not Being Sent

The system is designed to work with real email services but requires proper configuration. Currently:

- ✅ **File Processing**: Working - Excel files are processed correctly
- ✅ **Page Analysis**: Working - Expired pages are identified
- ✅ **Stakeholder Assignment**: Working - Correct stakeholders are assigned
- ❌ **Email Delivery**: **NOT WORKING** - Emails are only simulated

## Email Configuration Options

### Option 1: EmailJS (Recommended for Testing)

EmailJS is perfect for testing and small-scale deployments. It's free and easy to set up.

#### Setup Steps:

1. **Sign up at [EmailJS](https://www.emailjs.com/)**

2. **Create a Service:**

   - Go to Email Services
   - Add a new service (Gmail, Outlook, Yahoo, etc.)
   - Follow the setup instructions for your email provider

3. **Create an Email Template:**

   - Go to Email Templates
   - Create a new template with these variables:

     ```
     Subject: {{subject}}

     To: {{to_email}}
     From: {{from_name}}

     Content: {{{message}}}
     ```

4. **Get Your Credentials:**

   - Service ID (from Email Services)
   - Template ID (from Email Templates)
   - Public Key (from Account settings)

5. **Create Environment File:**
   Create a `.env` file in the project root:

   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

6. **Restart the Application:**
   ```bash
   npm run dev
   ```

### Option 2: SendGrid (Recommended for Production)

SendGrid is ideal for production environments with high email volumes.

#### Setup Steps:

1. **Sign up at [SendGrid](https://sendgrid.com/)**

2. **Get API Key:**

   - Go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions

3. **Verify Sender Identity:**

   - Go to Settings > Sender Authentication
   - Verify your domain or single sender email

4. **Create Environment File:**
   Create a `.env` file in the project root:

   ```env
   VITE_SENDGRID_API_KEY=your_sendgrid_api_key_here
   VITE_FROM_EMAIL=noreply@thomsonreuters.com
   ```

5. **Restart the Application:**
   ```bash
   npm run dev
   ```

## Testing Email Configuration

After setting up either service:

1. **Go to the Dashboard**
2. **Click "Test Email Configuration"**
3. **Enter your email address**
4. **Click "Send Test Email"**
5. **Check your inbox for the test email**

## Current System Behavior

### Demo Mode (Current State):

- ✅ Shows "Email successfully sent" messages
- ✅ Updates dashboard statistics
- ✅ Logs email attempts in console
- ❌ **NO ACTUAL EMAILS ARE SENT**

### Production Mode (After Configuration):

- ✅ Sends real emails to stakeholders
- ✅ Updates dashboard statistics
- ✅ Proper error handling for failed emails
- ✅ Email delivery confirmation

## Troubleshooting

### Common Issues:

1. **"Emails sent successfully" but no emails received:**

   - System is in demo mode
   - Check if `.env` file exists with correct credentials
   - Restart the application after adding credentials

2. **EmailJS errors:**

   - Verify service ID, template ID, and public key
   - Check EmailJS dashboard for service status
   - Ensure template variables match exactly

3. **SendGrid errors:**
   - Verify API key permissions
   - Check sender authentication status
   - Ensure from_email is verified

### Verification Steps:

1. **Check Configuration Status:**

   - Look for email service status in the UI
   - Check browser console for configuration messages

2. **Test Email Functionality:**

   - Use the "Test Email Configuration" feature
   - Send test emails to yourself first

3. **Monitor Email Delivery:**
   - Check EmailJS or SendGrid dashboard
   - Look for delivery confirmations

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific configurations
- Regularly rotate API keys
- Monitor email usage and quotas

## Support

If you continue to experience issues:

1. Check the browser console for error messages
2. Verify your email service dashboard
3. Test with a simple email address first
4. Ensure all credentials are correctly formatted

## Example .env File

```env
# Choose ONE of the following options:

# Option 1: EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_def456

# Option 2: SendGrid Configuration
VITE_SENDGRID_API_KEY=SG.abc123...
VITE_FROM_EMAIL=noreply@thomsonreuters.com

# Application Configuration
VITE_APP_NAME=Page Expiry Notification System
VITE_APP_VERSION=1.0.0
```

After creating the `.env` file, restart the application with `npm run dev`.
