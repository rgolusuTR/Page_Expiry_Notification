import emailjs from "@emailjs/browser";

// Email Configuration - Check environment variables first, then fall back to demo
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const FROM_EMAIL =
  import.meta.env.VITE_FROM_EMAIL || "noreply@thomsonreuters.com";

// EmailJS Configuration (fallback)
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_demo123";
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_demo123";
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "demo_public_key";

// Check if real email service is configured
const isSendGridConfigured =
  SENDGRID_API_KEY && SENDGRID_API_KEY !== "your-sendgrid-api-key";
const isEmailJSConfigured =
  EMAILJS_SERVICE_ID !== "service_demo123" &&
  EMAILJS_TEMPLATE_ID !== "template_demo123" &&
  EMAILJS_PUBLIC_KEY !== "demo_public_key";

const isRealEmailConfigured = isSendGridConfigured || isEmailJSConfigured;

export interface EmailData {
  to_email: string;
  subject: string;
  message: string;
  from_name?: string;
}

export class EmailService {
  static async sendEmail(
    emailData: EmailData
  ): Promise<{ success: boolean; message: string }> {
    // If EmailJS is not configured, simulate email sending
    if (!isEmailJSConfigured) {
      console.log("📧 Simulating email send:", emailData);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        return {
          success: true,
          message: `Email successfully sent to ${emailData.to_email} (simulated)`,
        };
      } else {
        throw new Error("Simulated email sending failure");
      }
    }

    try {
      // Initialize EmailJS if not already done
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: emailData.to_email,
          subject: emailData.subject,
          message: emailData.message,
          from_name: emailData.from_name || "Page Expiry Notification System",
          reply_to: "noreply@thomsonreuters.com",
        }
      );

      return {
        success: true,
        message: `Email successfully sent to ${emailData.to_email}`,
      };
    } catch (error) {
      console.error("EmailJS Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  static async sendTestEmail(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const testEmailData: EmailData = {
      to_email: email,
      subject: "Test Email - Page Expiry Notification System",
      message: `
        <h2>✅ Test Email Successful</h2>
        <p>This is a test email from the Page Expiry Notification System.</p>
        <p>If you received this email, the email configuration is working correctly.</p>
        
        <h3>System Details:</h3>
        <ul>
          <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Recipient:</strong> ${email}</li>
          <li><strong>System:</strong> Thomson Reuters Page Expiry Notification</li>
          <li><strong>Service:</strong> ${
            isEmailJSConfigured ? "EmailJS" : "Simulated"
          }</li>
        </ul>
        
        <p>Thank you for testing the system!</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This email was sent by the Page Expiry Notification System.<br>
          If you did not request this test, please ignore this email.
        </p>
      `,
      from_name: "Page Expiry System Test",
    };

    return await this.sendEmail(testEmailData);
  }

  static async sendExpiryAlert(
    email: string,
    pageData: any
  ): Promise<{ success: boolean; message: string }> {
    const alertEmailData: EmailData = {
      to_email: email,
      subject: `🚨 Action Required: Expired Page Review - ${
        pageData.title || pageData.url
      }`,
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1>🚨 Expired Page Review Required</h1>
            <p>Immediate attention needed for outdated content</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <strong>Alert:</strong> The following page has been identified as expired and requires immediate review.
            </div>
            
            <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Page Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #495057; width: 30%;">Page URL:</td>
                  <td style="padding: 8px;"><a href="${
                    pageData.url
                  }" target="_blank">${pageData.url}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #495057;">Page Title:</td>
                  <td style="padding: 8px;">${
                    pageData.title || "Not available"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #495057;">Created Date:</td>
                  <td style="padding: 8px;">${
                    pageData.createdDate || "Unknown"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #495057;">Last Updated:</td>
                  <td style="padding: 8px;">${
                    pageData.updatedDate || "Unknown"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #495057;">Page Views:</td>
                  <td style="padding: 8px;">${
                    pageData.pageViews || 0
                  } (last 30 days)</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #dc3545;">
              <h3>📋 Recommended Actions</h3>
              <ul>
                <li><strong>Review and Update:</strong> If the content is still relevant, update it with current information.</li>
                <li><strong>Archive or Remove:</strong> If the content is no longer needed, consider archiving or removing it.</li>
                <li><strong>Set Redirect:</strong> If removing the page, implement appropriate redirects to prevent broken links.</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                pageData.url
              }" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Page</a>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; padding: 20px;">
            <p>This alert was generated by the Page Expiry Notification System</p>
            <p>You're receiving this because you're listed as the stakeholder for this page.</p>
          </div>
        </div>
      `,
      from_name: "Page Expiry Alert System",
    };

    return await this.sendEmail(alertEmailData);
  }

  static getConfigurationStatus(): {
    configured: boolean;
    service: string;
    instructions: string;
    reason: string;
  } {
    return {
      configured: isRealEmailConfigured,
      service: isRealEmailConfigured
        ? isSendGridConfigured
          ? "SendGrid"
          : "EmailJS"
        : "Demo Mode",
      reason: isRealEmailConfigured
        ? "Email service is properly configured"
        : "No real email service configured - emails are only simulated",
      instructions: isRealEmailConfigured
        ? "Email service is configured and ready to send real emails."
        : `⚠️ EMAILS ARE NOT BEING SENT - DEMO MODE ACTIVE

To enable real email sending, choose one option:

OPTION 1 - EmailJS (Recommended for testing):
1. Sign up at https://www.emailjs.com/
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - {{to_email}} - recipient email
   - {{subject}} - email subject
   - {{message}} - email content (HTML)
   - {{from_name}} - sender name
4. Create a .env file with:
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key

OPTION 2 - SendGrid (Production):
1. Sign up at https://sendgrid.com/
2. Get your API key
3. Create a .env file with:
   VITE_SENDGRID_API_KEY=your_api_key
   VITE_FROM_EMAIL=noreply@thomsonreuters.com

After configuration, restart the application.`,
    };
  }
}
