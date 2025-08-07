// Database Configuration and Setup
import { createClient } from '@supabase/supabase-js';

// Database Schema Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface SiteConfiguration {
  id: string;
  domain: string;
  name: string;
  enabled: boolean;
  expiry_days: number;
  engagement_threshold: number;
  new_page_days: number;
  default_stakeholder: string;
  created_at: string;
  updated_at: string;
}

export interface StakeholderMapping {
  id: string;
  site_id: string;
  pattern: string;
  email: string;
  type: 'exact' | 'pattern' | 'department';
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledJob {
  id: string;
  job_name: string;
  job_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  duration?: number;
  error_message?: string;
  metadata?: any;
  created_at: string;
}

export interface EmailNotification {
  id: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
}

// Supabase Client Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are configured
const isSupabaseConfigured = supabaseUrl && supabaseKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseKey.includes('your-anon-key') &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseKey !== 'your-anon-key-here';

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not configured. Using mock data for demo purposes.');
}

export const supabase = isSupabaseConfigured ? 
  createClient(supabaseUrl, supabaseKey) : 
  null;

// Database Service Class
export class DatabaseService {
  // Site Configuration Methods
  static async getSiteConfigurations(): Promise<SiteConfiguration[]> {
    if (!supabase) {
      // Use localStorage for persistence when Supabase is not configured
      const storedSites = localStorage.getItem('site_configurations');
      if (storedSites) {
        return JSON.parse(storedSites);
      }
      
      // Return default mock data only if no stored data exists
      const defaultSites = [
        {
          id: '1',
          domain: 'www.thomsonreuters.com',
          name: 'Thomson Reuters Corporate',
          enabled: true,
          expiry_days: 1095,
          engagement_threshold: 10,
          new_page_days: 45,
          default_stakeholder: 'corporate-web@thomsonreuters.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          domain: 'legal.thomsonreuters.com',
          name: 'Thomson Reuters Legal',
          enabled: true,
          expiry_days: 365,
          engagement_threshold: 15,
          new_page_days: 60,
          default_stakeholder: 'legal-web@thomsonreuters.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          domain: 'tax.thomsonreuters.com',
          name: 'Thomson Reuters Tax',
          enabled: true,
          expiry_days: 365,
          engagement_threshold: 8,
          new_page_days: 30,
          default_stakeholder: 'tax-web@thomsonreuters.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('site_configurations', JSON.stringify(defaultSites));
      return defaultSites;
    }
    
    const { data, error } = await supabase
      .from('site_configurations')
      .select('*')
      .order('domain');
    
    if (error) throw error;
    return data || [];
  }

  static async updateSiteConfiguration(id: string, updates: Partial<SiteConfiguration>): Promise<SiteConfiguration> {
    if (!supabase) {
      // Update in localStorage when Supabase is not configured
      const storedSites = localStorage.getItem('site_configurations');
      if (storedSites) {
        const sites: SiteConfiguration[] = JSON.parse(storedSites);
        const updatedSites = sites.map(site => 
          site.id === id 
            ? { ...site, ...updates, updated_at: new Date().toISOString() }
            : site
        );
        localStorage.setItem('site_configurations', JSON.stringify(updatedSites));
        
        const updatedSite = updatedSites.find(site => site.id === id);
        if (updatedSite) {
          return updatedSite;
        }
      }
      
      // Fallback if site not found
      throw new Error('Site not found');
    }
    
    const { data, error } = await supabase
      .from('site_configurations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createSiteConfiguration(config: Omit<SiteConfiguration, 'id' | 'created_at' | 'updated_at'>): Promise<SiteConfiguration> {
    if (!supabase) {
      // Add to localStorage when Supabase is not configured
      const newSite: SiteConfiguration = {
        id: Date.now().toString(),
        ...config,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const storedSites = localStorage.getItem('site_configurations');
      const sites: SiteConfiguration[] = storedSites ? JSON.parse(storedSites) : [];
      sites.push(newSite);
      localStorage.setItem('site_configurations', JSON.stringify(sites));
      
      return newSite;
    }
    
    const { data, error } = await supabase
      .from('site_configurations')
      .insert({
        ...config,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Stakeholder Mapping Methods
  static async getStakeholderMappings(siteId: string): Promise<StakeholderMapping[]> {
    if (!supabase) {
      // Use localStorage for mappings persistence
      const storedMappings = localStorage.getItem('stakeholder_mappings');
      if (storedMappings) {
        const allMappings: StakeholderMapping[] = JSON.parse(storedMappings);
        return allMappings.filter(mapping => mapping.site_id === siteId && mapping.is_active);
      }
      
      // Return default mappings if none stored
      const defaultMappings = [
        {
          id: '1',
          site_id: siteId,
          pattern: '/products/*',
          email: 'product@thomsonreuters.com',
          type: 'pattern' as const,
          priority: 100,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default mappings
      localStorage.setItem('stakeholder_mappings', JSON.stringify(defaultMappings));
      return defaultMappings;
    }
    
    const { data, error } = await supabase
      .from('stakeholder_mappings')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .order('priority');
    
    if (error) throw error;
    return data || [];
  }

  static async createStakeholderMapping(mapping: Omit<StakeholderMapping, 'id' | 'created_at' | 'updated_at'>): Promise<StakeholderMapping> {
    if (!supabase) {
      // Add to localStorage when Supabase is not configured
      const newMapping: StakeholderMapping = {
        id: Date.now().toString(),
        ...mapping,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const storedMappings = localStorage.getItem('stakeholder_mappings');
      const mappings: StakeholderMapping[] = storedMappings ? JSON.parse(storedMappings) : [];
      mappings.push(newMapping);
      localStorage.setItem('stakeholder_mappings', JSON.stringify(mappings));
      
      return newMapping;
    }
    
    const { data, error } = await supabase
      .from('stakeholder_mappings')
      .insert({
        ...mapping,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteStakeholderMapping(id: string): Promise<void> {
    if (!supabase) {
      // Update localStorage to mark as inactive
      const storedMappings = localStorage.getItem('stakeholder_mappings');
      if (storedMappings) {
        const mappings: StakeholderMapping[] = JSON.parse(storedMappings);
        const updatedMappings = mappings.map(mapping =>
          mapping.id === id
            ? { ...mapping, is_active: false, updated_at: new Date().toISOString() }
            : mapping
        );
        localStorage.setItem('stakeholder_mappings', JSON.stringify(updatedMappings));
      }
      return;
    }
    
    const { error } = await supabase
      .from('stakeholder_mappings')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }

  // System Configuration Methods
  static async getSystemConfig(key: string): Promise<SystemConfig | null> {
    if (!supabase) {
      // Return mock config
      return {
        id: '1',
        config_key: key,
        config_value: { enabled: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('config_key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateSystemConfig(key: string, value: any, description?: string): Promise<SystemConfig> {
    if (!supabase) {
      // Mock successful update
      return {
        id: '1',
        config_key: key,
        config_value: value,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('system_config')
      .upsert({
        config_key: key,
        config_value: value,
        description,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Scheduled Jobs Methods
  static async getScheduledJobs(): Promise<ScheduledJob[]> {
    if (!supabase) {
      // Return mock jobs
      return [];
    }
    
    const { data, error } = await supabase
      .from('scheduled_jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateJobStatus(id: string, status: ScheduledJob['status'], metadata?: any): Promise<ScheduledJob> {
    if (!supabase) {
      // Mock successful update
      return {
        id,
        job_name: 'Mock Job',
        job_type: 'test',
        status,
        scheduled_at: new Date().toISOString(),
        metadata,
        created_at: new Date().toISOString()
      };
    }
    
    const updates: any = { status };
    
    if (status === 'running') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed' || status === 'stopped') {
      updates.completed_at = new Date().toISOString();
    }
    
    if (metadata) {
      updates.metadata = metadata;
    }

    const { data, error } = await supabase
      .from('scheduled_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Email Notification Methods
  static async sendEmailNotification(email: string, subject: string, body: string): Promise<EmailNotification> {
    if (!supabase) {
      // Mock successful email sending
      return {
        id: Date.now().toString(),
        recipient_email: email,
        subject,
        body,
        status: 'sent',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('email_notifications')
      .insert({
        recipient_email: email,
        subject,
        body,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;

    // Simulate email sending (replace with actual email service)
    setTimeout(async () => {
      await supabase
        .from('email_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', data.id);
    }, 1000);

    return data;
  }

  // Analytics and Reporting
  static async getSystemMetrics(): Promise<any> {
    if (!supabase) {
      // Return mock metrics
      return {
        totalSites: 2,
        activeSites: 2,
        recentJobs: [],
        emailsSent: 0,
        lastProcessed: new Date().toISOString()
      };
    }
    
    const [sites, jobs, notifications] = await Promise.all([
      this.getSiteConfigurations(),
      this.getScheduledJobs(),
      supabase.from('email_notifications').select('*').limit(100)
    ]);

    return {
      totalSites: sites.length,
      activeSites: sites.filter(s => s.enabled).length,
      recentJobs: jobs.slice(0, 10),
      emailsSent: notifications.data?.filter(n => n.status === 'sent').length || 0,
      lastProcessed: jobs.find(j => j.status === 'completed')?.completed_at
    };
  }
}

// Database Migration SQL
export const DATABASE_SCHEMA = `
-- Site Configurations Table
CREATE TABLE IF NOT EXISTS site_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  expiry_days INTEGER DEFAULT 730,
  engagement_threshold INTEGER DEFAULT 5,
  new_page_days INTEGER DEFAULT 30,
  default_stakeholder VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stakeholder Mappings Table
CREATE TABLE IF NOT EXISTS stakeholder_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES site_configurations(id) ON DELETE CASCADE,
  pattern VARCHAR(1000) NOT NULL,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'pattern',
  priority INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Configuration Table
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled Jobs Table
CREATE TABLE IF NOT EXISTS scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR(100) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Notifications Table
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_configurations_domain ON site_configurations(domain);
CREATE INDEX IF NOT EXISTS idx_site_configurations_enabled ON site_configurations(enabled);
CREATE INDEX IF NOT EXISTS idx_stakeholder_mappings_site_id ON stakeholder_mappings(site_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_mappings_active ON stakeholder_mappings(is_active);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_status ON scheduled_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_scheduled_at ON scheduled_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON email_notifications(recipient_email);

-- Insert default site configurations
INSERT INTO site_configurations (domain, name, expiry_days, engagement_threshold, new_page_days, default_stakeholder) VALUES
('www.thomsonreuters.com', 'Thomson Reuters Corporate', 1095, 10, 45, 'corporate-web@thomsonreuters.com'),
('www.thomsonreuters.ca', 'Thomson Reuters Canada', 730, 5, 30, 'canada-web@thomsonreuters.com'),
('legal.thomsonreuters.com', 'Thomson Reuters Legal', 365, 15, 60, 'legal-web@thomsonreuters.com'),
('tax.thomsonreuters.com', 'Thomson Reuters Tax', 365, 8, 30, 'tax-web@thomsonreuters.com'),
('legalsolutions.thomsonreuters.co.uk', 'Thomson Reuters Legal UK', 365, 12, 45, 'legal-uk-web@thomsonreuters.com')
ON CONFLICT (domain) DO NOTHING;

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('scheduler_settings', '{"enabled": true, "cronExpression": "0 9 * * 1", "timezone": "UTC"}', 'Scheduler configuration'),
('email_settings', '{"provider": "sendgrid", "fromEmail": "noreply@thomsonreuters.com"}', 'Email service configuration'),
('notification_settings', '{"cooldownHours": 168, "maxRetries": 3}', 'Notification settings')
ON CONFLICT (config_key) DO NOTHING;
`;