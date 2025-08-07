# Thomson Reuters Implementation Guide

## Multi-Site Configuration Overview

The Page Expiry Notification System has been customized for Thomson Reuters' five primary websites with domain-specific settings, stakeholder mappings, and notification preferences.

## Configured Websites

### 1. Corporate Site (www.thomsonreuters.com)
- **Expiry Threshold**: 3 years (1,095 days)
- **Low Engagement Threshold**: < 10 views
- **New Page Evaluation**: 45 days
- **Primary Stakeholder**: corporate-web@thomsonreuters.com
- **Focus**: Corporate communications, investor relations, careers

### 2. Canada Site (www.thomsonreuters.ca)
- **Expiry Threshold**: 2 years (730 days)
- **Low Engagement Threshold**: < 5 views
- **New Page Evaluation**: 30 days
- **Primary Stakeholder**: canada-web@thomsonreuters.com
- **Focus**: Regional content, bilingual support

### 3. Legal Solutions (legal.thomsonreuters.com)
- **Expiry Threshold**: 1 year (365 days)
- **Low Engagement Threshold**: < 15 views
- **New Page Evaluation**: 60 days
- **Primary Stakeholder**: legal-web@thomsonreuters.com
- **Focus**: Legal products, training, compliance

### 4. Tax Solutions (tax.thomsonreuters.com)
- **Expiry Threshold**: 1 year (365 days)
- **Low Engagement Threshold**: < 8 views
- **New Page Evaluation**: 30 days
- **Primary Stakeholder**: tax-web@thomsonreuters.com
- **Focus**: Tax compliance, regulatory updates

### 5. Legal Solutions UK (legalsolutions.thomsonreuters.co.uk)
- **Expiry Threshold**: 1 year (365 days)
- **Low Engagement Threshold**: < 12 views
- **New Page Evaluation**: 45 days
- **Primary Stakeholder**: legal-uk-web@thomsonreuters.com
- **Focus**: UK legal market, local compliance

## Stakeholder Team Structure

### Corporate Teams
- **corporate-web@thomsonreuters.com**: General web management
- **corporate-communications@thomsonreuters.com**: PR, news, announcements
- **investor-relations@thomsonreuters.com**: Financial communications
- **talent-acquisition@thomsonreuters.com**: Careers and recruitment
- **product-marketing@thomsonreuters.com**: Product information
- **sustainability@thomsonreuters.com**: ESG and sustainability content

### Regional Teams
- **canada-web@thomsonreuters.com**: Canada site management
- **canada-product@thomsonreuters.com**: Canada-specific products
- **canada-support@thomsonreuters.com**: Canadian customer support
- **canada-french@thomsonreuters.com**: French language content

### Legal Division Teams
- **legal-web@thomsonreuters.com**: Legal site management
- **legal-product@thomsonreuters.com**: Legal product information
- **legal-content@thomsonreuters.com**: Legal insights and resources
- **legal-training@thomsonreuters.com**: Training and education
- **legal-support@thomsonreuters.com**: Customer support
- **legal-uk-web@thomsonreuters.com**: UK legal site management

### Tax Division Teams
- **tax-web@thomsonreuters.com**: Tax site management
- **tax-product@thomsonreuters.com**: Tax product information
- **tax-compliance@thomsonreuters.com**: Compliance content
- **tax-regulatory@thomsonreuters.com**: Regulatory updates
- **tax-content@thomsonreuters.com**: Tax insights and resources

## Content Type Classifications

### Critical Content (Immediate Attention)
- **Patterns**: `/products/*`, `/pricing/*`, `/compliance/*`, `/regulatory/*`, `/investors/*`
- **Expiry Override**: 6 months
- **Engagement Override**: 20 views minimum
- **Notification**: Immediate alerts with escalation

### Marketing Content (Shorter Lifecycle)
- **Patterns**: `/campaigns/*`, `/promotions/*`, `/events/*`, `/webinars/*`
- **Expiry Override**: 3 months
- **Engagement Override**: 25 views minimum
- **Notification**: Weekly batch alerts

### Evergreen Content (Longer Lifecycle)
- **Patterns**: `/about-us/*`, `/company/*`, `/history/*`, `/mission/*`
- **Expiry Override**: 5 years
- **Engagement Override**: 5 views minimum
- **Notification**: Monthly review

## Notification Preferences by Team

### Immediate Notification Teams
- **corporate-communications@thomsonreuters.com**: PR-sensitive content
- **investor-relations@thomsonreuters.com**: Financial communications
- **legal-product@thomsonreuters.com**: Product-critical content
- **tax-regulatory@thomsonreuters.com**: Regulatory compliance
- **tax-compliance@thomsonreuters.com**: Compliance requirements

### Weekly Batch Teams
- **corporate-web@thomsonreuters.com**: General web management
- **legal-web@thomsonreuters.com**: Legal site oversight
- **tax-web@thomsonreuters.com**: Tax site oversight
- **legal-content@thomsonreuters.com**: Content management

### Bi-weekly Teams
- **canada-product@thomsonreuters.com**: Regional product updates
- **legal-uk-product@thomsonreuters.com**: UK product management
- **legal-support@thomsonreuters.com**: Support documentation

## Escalation Matrix

### No Response Escalation (7-14 days)
- **corporate-communications** → communications-director@thomsonreuters.com
- **investor-relations** → ir-director@thomsonreuters.com
- **legal-product** → legal-product-director@thomsonreuters.com
- **tax-regulatory** → tax-director@thomsonreuters.com
- **legal-uk-product** → legal-uk-director@thomsonreuters.com

### Critical Page Escalation (Immediate CC)
- **web-governance@thomsonreuters.com**: Overall web governance
- **digital-experience@thomsonreuters.com**: User experience oversight

## Regional Considerations

### Canada (www.thomsonreuters.ca)
- **Timezone**: America/Toronto
- **Business Hours**: 9:00-17:00 EST
- **Languages**: English, French
- **Special Handling**: Bilingual content requirements

### UK (legalsolutions.thomsonreuters.co.uk)
- **Timezone**: Europe/London
- **Business Hours**: 9:00-17:00 GMT
- **Languages**: English
- **Special Handling**: UK legal market specifics

### US (Primary Sites)
- **Timezone**: America/New_York
- **Business Hours**: 9:00-17:00 EST
- **Languages**: English
- **Special Handling**: Global corporate standards

## Implementation Steps

### 1. Configuration Deployment
```bash
# Deploy Thomson Reuters specific configuration
cp config/thomson-reuters-mapping.yml /app/config/stakeholder-mapping.yml

# Update environment variables
export TR_CORPORATE_DOMAIN="www.thomsonreuters.com"
export TR_CANADA_DOMAIN="www.thomsonreuters.ca"
export TR_LEGAL_DOMAIN="legal.thomsonreuters.com"
export TR_TAX_DOMAIN="tax.thomsonreuters.com"
export TR_LEGAL_UK_DOMAIN="legalsolutions.thomsonreuters.co.uk"
```

### 2. Database Schema Updates
```sql
-- Add Thomson Reuters specific columns
ALTER TABLE pages ADD COLUMN tr_division VARCHAR(50);
ALTER TABLE pages ADD COLUMN tr_region VARCHAR(50);
ALTER TABLE pages ADD COLUMN tr_content_type VARCHAR(50);

-- Create indexes for TR-specific queries
CREATE INDEX idx_pages_tr_division ON pages(tr_division);
CREATE INDEX idx_pages_tr_region ON pages(tr_region);
CREATE INDEX idx_pages_tr_content_type ON pages(tr_content_type);
```

### 3. Email Template Customization
- Thomson Reuters branding and colors
- Division-specific messaging
- Regional compliance requirements
- Multi-language support for Canada

### 4. Monitoring and Reporting
- Division-specific dashboards
- Regional performance metrics
- Stakeholder response tracking
- Content lifecycle analytics

## Testing Strategy

### 1. Domain Recognition Testing
- Verify correct domain categorization
- Test stakeholder mapping accuracy
- Validate threshold applications

### 2. Notification Testing
- Test email delivery to all stakeholder groups
- Verify escalation workflows
- Check regional timezone handling

### 3. Content Analysis Testing
- Test expired page detection per domain
- Verify low engagement calculations
- Check content type classifications

### 4. Integration Testing
- Adobe Analytics data processing
- Multi-domain URL parsing
- Stakeholder assignment logic

## Maintenance and Updates

### Monthly Reviews
- Stakeholder mapping accuracy
- Threshold effectiveness
- Response rate analysis
- Content lifecycle trends

### Quarterly Updates
- Team structure changes
- Domain configuration adjustments
- Threshold optimization
- Process improvements

### Annual Assessment
- Complete system review
- Stakeholder feedback integration
- Technology stack updates
- Compliance requirements review

This implementation provides Thomson Reuters with a comprehensive, multi-site content lifecycle management system tailored to their organizational structure and business requirements.