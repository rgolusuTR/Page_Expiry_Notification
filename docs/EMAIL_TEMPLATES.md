# Email Templates

## 1. Expired Page Alert Template

### Subject Line
```
Action Required: Expired Page Review - {{pageTitle || pageUrl}}
```

### HTML Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expired Page Review Required</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .button-primary { background: #007bff; color: white; }
        .button-secondary { background: #6c757d; color: white; }
        .recommendations { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #dc3545; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        .page-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .page-info th, .page-info td { text-align: left; padding: 8px; }
        .page-info th { font-weight: bold; color: #495057; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Expired Page Review Required</h1>
            <p>Immediate attention needed for outdated content</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <strong>Alert:</strong> The following page has been identified as expired and requires immediate review.
            </div>
            
            <div class="page-info">
                <h3>Page Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="width: 30%;">Page URL:</th>
                        <td><a href="{{pageUrl}}" target="_blank">{{pageUrl}}</a></td>
                    </tr>
                    <tr>
                        <th>Page Title:</th>
                        <td>{{pageTitle || 'Not available'}}</td>
                    </tr>
                    <tr>
                        <th>Created Date:</th>
                        <td>{{createdDate}}</td>
                    </tr>
                    <tr>
                        <th>Last Updated:</th>
                        <td>{{updatedDate}}</td>
                    </tr>
                    <tr>
                        <th>Age:</th>
                        <td>{{pageAge}} days ({{Math.floor(pageAge/365)}} years)</td>
                    </tr>
                    <tr>
                        <th>Recent Page Views:</th>
                        <td>{{pageViews}} (last 30 days)</td>
                    </tr>
                </table>
            </div>
            
            <div class="recommendations">
                <h3>📋 Recommended Actions</h3>
                <p>As the stakeholder for this content, please take one of the following actions:</p>
                <ul>
                    <li><strong>Review and Update:</strong> If the content is still relevant, update it with current information and republish.</li>
                    <li><strong>Verify Dependencies:</strong> Check if other pages or systems link to this content before making changes.</li>
                    <li><strong>Communicate Changes:</strong> Notify relevant teams before removing or significantly modifying the page.</li>
                    <li><strong>Archive or Remove:</strong> If the content is no longer needed, consider archiving or removing it to improve site maintenance.</li>
                    <li><strong>Set Redirect:</strong> If removing the page, implement appropriate redirects to prevent broken links.</li>
                </ul>
            </div>
            
            <div class="action-buttons">
                <a href="{{pageUrl}}" class="button button-primary" target="_blank">View Page</a>
                <a href="{{dashboardUrl}}/pages/{{pageId}}" class="button button-secondary" target="_blank">Manage in Dashboard</a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4>Why This Matters</h4>
                <p>Expired content can:</p>
                <ul>
                    <li>Damage user experience and trust</li>
                    <li>Negatively impact SEO rankings</li>
                    <li>Create maintenance overhead</li>
                    <li>Lead to broken links and references</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This alert was generated by the Page Expiry Notification System</p>
            <p>You're receiving this because you're listed as the stakeholder for this page.</p>
            <p>Questions? Contact the web team at <a href="mailto:webmaster@company.com">webmaster@company.com</a></p>
        </div>
    </div>
</body>
</html>
```

## 2. Low Engagement Alert Template

### Subject Line
```
Low Engagement Alert: {{pageTitle || pageUrl}} needs attention
```

### HTML Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Engagement Page Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffc107; color: #212529; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .button-primary { background: #007bff; color: white; }
        .button-secondary { background: #6c757d; color: white; }
        .recommendations { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        .page-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .page-info th, .page-info td { text-align: left; padding: 8px; }
        .page-info th { font-weight: bold; color: #495057; }
        .tips { background: #d4edda; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Low Engagement Page Alert</h1>
            <p>Optimization opportunity detected</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <strong>Notice:</strong> This recently published page has low engagement and may benefit from optimization.
            </div>
            
            <div class="page-info">
                <h3>Page Performance</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="width: 30%;">Page URL:</th>
                        <td><a href="{{pageUrl}}" target="_blank">{{pageUrl}}</a></td>
                    </tr>
                    <tr>
                        <th>Page Title:</th>
                        <td>{{pageTitle || 'Not available'}}</td>
                    </tr>
                    <tr>
                        <th>Published Date:</th>
                        <td>{{publishedDate}}</td>
                    </tr>
                    <tr>
                        <th>Days Since Publication:</th>
                        <td>{{daysSincePublished}} days</td>
                    </tr>
                    <tr>
                        <th>Total Page Views:</th>
                        <td>{{pageViews}} (below 5 view threshold)</td>
                    </tr>
                    <tr>
                        <th>Department:</th>
                        <td>{{department || 'Not specified'}}</td>
                    </tr>
                </table>
            </div>
            
            <div class="recommendations">
                <h3>🚀 Optimization Recommendations</h3>
                <p>To improve page engagement, consider these strategies:</p>
                <ul>
                    <li><strong>Review Content Necessity:</strong> Confirm the page serves a clear purpose and meets user needs.</li>
                    <li><strong>Improve Discoverability:</strong> Ensure the page is properly linked from relevant sections of your site.</li>
                    <li><strong>Enhance Internal Linking:</strong> Add links to this page from related content and navigation menus.</li>
                    <li><strong>Optimize for Search:</strong> Review and improve SEO elements like title tags, meta descriptions, and headings.</li>
                    <li><strong>Promote Through Channels:</strong> Share the page through email campaigns, social media, or internal communications.</li>
                    <li><strong>Consider Consolidation:</strong> If similar content exists elsewhere, consider merging or redirecting.</li>
                </ul>
            </div>
            
            <div class="tips">
                <h4>💡 Quick Wins</h4>
                <ul>
                    <li>Add the page to your site's main navigation if relevant</li>
                    <li>Include internal links from popular pages</li>
                    <li>Share in your next newsletter or team update</li>
                    <li>Check that the page loads quickly and is mobile-friendly</li>
                    <li>Ensure the content is scannable with clear headings</li>
                </ul>
            </div>
            
            <div class="action-buttons">
                <a href="{{pageUrl}}" class="button button-primary" target="_blank">View Page</a>
                <a href="{{dashboardUrl}}/pages/{{pageId}}" class="button button-secondary" target="_blank">View Analytics</a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4>Why This Matters</h4>
                <p>Pages with low engagement may indicate:</p>
                <ul>
                    <li>Poor discoverability or navigation issues</li>
                    <li>Content that doesn't meet user needs</li>
                    <li>Missing promotional opportunities</li>
                    <li>Potential for content consolidation</li>
                </ul>
                <p>Early optimization can improve user experience and content ROI.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This alert was generated by the Page Expiry Notification System</p>
            <p>You're receiving this because you're listed as the stakeholder for this page.</p>
            <p>Questions? Contact the web team at <a href="mailto:webmaster@company.com">webmaster@company.com</a></p>
        </div>
    </div>
</body>
</html>
```

## 3. Batch Summary Email Template

### Subject Line
```
Weekly Page Review Summary - {{summaryDate}}
```

### HTML Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Review Summary</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .summary-cards { display: flex; gap: 20px; margin: 20px 0; }
        .card { background: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; }
        .card h3 { margin: 0 0 10px 0; color: #007bff; }
        .card .number { font-size: 2em; font-weight: bold; color: #dc3545; }
        .page-list { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .page-item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .page-item:last-child { border-bottom: none; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; margin: 10px; text-decoration: none; border-radius: 5px; font-weight: bold; background: #007bff; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📈 Page Review Summary</h1>
            <p>Weekly content lifecycle report</p>
        </div>
        
        <div class="content">
            <div class="summary-cards">
                <div class="card">
                    <h3>Expired Pages</h3>
                    <div class="number">{{expiredCount}}</div>
                    <p>Requiring review</p>
                </div>
                <div class="card">
                    <h3>Low Engagement</h3>
                    <div class="number">{{lowEngagementCount}}</div>
                    <p>Need optimization</p>
                </div>
                <div class="card">
                    <h3>Alerts Sent</h3>
                    <div class="number">{{alertsSent}}</div>
                    <p>This week</p>
                </div>
            </div>
            
            {{#if expiredPages}}
            <div class="page-list">
                <h3>🚨 Expired Pages Requiring Attention</h3>
                {{#each expiredPages}}
                <div class="page-item">
                    <strong><a href="{{url}}" target="_blank">{{title || url}}</a></strong><br>
                    <small>Age: {{age}} days | Stakeholder: {{stakeholder}}</small>
                </div>
                {{/each}}
            </div>
            {{/if}}
            
            {{#if lowEngagementPages}}
            <div class="page-list">
                <h3>📊 Low Engagement Pages</h3>
                {{#each lowEngagementPages}}
                <div class="page-item">
                    <strong><a href="{{url}}" target="_blank">{{title || url}}</a></strong><br>
                    <small>Views: {{views}} | Published: {{publishedDate}} | Stakeholder: {{stakeholder}}</small>
                </div>
                {{/each}}
            </div>
            {{/if}}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{dashboardUrl}}" class="button">View Full Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This summary was generated by the Page Expiry Notification System</p>
            <p>Report generated on {{generatedDate}}</p>
        </div>
    </div>
</body>
</html>
```

## 4. Template Configuration

### Dynamic Variables Available
```javascript
// Common variables for all templates
const templateVariables = {
  // Page Information
  pageUrl: string,
  pageTitle: string | null,
  pageId: string,
  createdDate: string,
  updatedDate: string,
  publishedDate: string,
  pageViews: number,
  pageAge: number, // days since creation
  daysSincePublished: number,
  
  // Stakeholder Information
  stakeholderEmail: string,
  stakeholderName: string,
  department: string,
  
  // System Information
  dashboardUrl: string,
  companyName: string,
  supportEmail: string,
  
  // Date/Time
  currentDate: string,
  alertDate: string,
  
  // Batch Summary Variables
  expiredCount: number,
  lowEngagementCount: number,
  alertsSent: number,
  expiredPages: Array<PageSummary>,
  lowEngagementPages: Array<PageSummary>,
  summaryDate: string,
  generatedDate: string
};
```

### Template Customization
```yaml
# email-templates.yml
templates:
  expired_page:
    subject: "Action Required: Expired Page Review - {{pageTitle || pageUrl}}"
    template_file: "expired_page.html"
    enabled: true
    
  low_engagement:
    subject: "Low Engagement Alert: {{pageTitle || pageUrl}} needs attention"
    template_file: "low_engagement.html"
    enabled: true
    
  batch_summary:
    subject: "Weekly Page Review Summary - {{summaryDate}}"
    template_file: "batch_summary.html"
    enabled: true
    schedule: "0 17 * * 5" # Friday 5 PM
    
  reminder:
    subject: "Reminder: Page Review Still Needed - {{pageTitle || pageUrl}}"
    template_file: "reminder.html"
    enabled: false
    delay_days: 7
```