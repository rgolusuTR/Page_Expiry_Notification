import React, { useState } from 'react';
import { Globe, Users, Clock, AlertTriangle, Settings, Mail, Calendar } from 'lucide-react';

interface SiteConfig {
  domain: string;
  name: string;
  expiryDays: number;
  engagementThreshold: number;
  newPageDays: number;
  defaultStakeholder: string;
}

const SiteConfiguration: React.FC = () => {
  const [sites] = useState<SiteConfig[]>([
    {
      domain: 'www.thomsonreuters.com',
      name: 'Thomson Reuters Corporate',
      expiryDays: 1095,
      engagementThreshold: 10,
      newPageDays: 45,
      defaultStakeholder: 'corporate-web@thomsonreuters.com'
    },
    {
      domain: 'www.thomsonreuters.ca',
      name: 'Thomson Reuters Canada',
      expiryDays: 730,
      engagementThreshold: 5,
      newPageDays: 30,
      defaultStakeholder: 'canada-web@thomsonreuters.com'
    },
    {
      domain: 'legal.thomsonreuters.com',
      name: 'Thomson Reuters Legal',
      expiryDays: 365,
      engagementThreshold: 15,
      newPageDays: 60,
      defaultStakeholder: 'legal-web@thomsonreuters.com'
    },
    {
      domain: 'tax.thomsonreuters.com',
      name: 'Thomson Reuters Tax',
      expiryDays: 365,
      engagementThreshold: 8,
      newPageDays: 30,
      defaultStakeholder: 'tax-web@thomsonreuters.com'
    },
    {
      domain: 'legalsolutions.thomsonreuters.co.uk',
      name: 'Thomson Reuters Legal UK',
      expiryDays: 365,
      engagementThreshold: 12,
      newPageDays: 45,
      defaultStakeholder: 'legal-uk-web@thomsonreuters.com'
    }
  ]);

  const [selectedSite, setSelectedSite] = useState<string>('');

  const getSiteColor = (domain: string) => {
    const colors = {
      'www.thomsonreuters.com': 'bg-blue-100 text-blue-800 border-blue-200',
      'www.thomsonreuters.ca': 'bg-red-100 text-red-800 border-red-200',
      'legal.thomsonreuters.com': 'bg-purple-100 text-purple-800 border-purple-200',
      'tax.thomsonreuters.com': 'bg-green-100 text-green-800 border-green-200',
      'legalsolutions.thomsonreuters.co.uk': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[domain] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDays = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      return remainingDays > 0 ? `${years}y ${remainingDays}d` : `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Thomson Reuters Site Configuration</h2>
        </div>
        <p className="text-gray-600">
          Customized settings for each Thomson Reuters website with domain-specific expiry thresholds and stakeholder mappings.
        </p>
      </div>

      {/* Site Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site.domain}
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${
              selectedSite === site.domain ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedSite(selectedSite === site.domain ? '' : site.domain)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{site.name}</h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSiteColor(site.domain)}`}>
                  {site.domain}
                </div>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Expiry Threshold</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatDays(site.expiryDays)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Low Engagement</span>
                </div>
                <span className="text-sm font-medium text-gray-900">&lt; {site.engagementThreshold} views</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">New Page Window</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{site.newPageDays} days</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 truncate">{site.defaultStakeholder}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Configuration */}
      {selectedSite && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Stakeholder Mapping - {sites.find(s => s.domain === selectedSite)?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Patterns */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">URL Pattern Mappings</h4>
              <div className="space-y-2">
                {getPatternMappings(selectedSite).map((mapping, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <code className="text-sm text-blue-600">{mapping.pattern}</code>
                    <span className="text-sm text-gray-600">{mapping.stakeholder}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Team Notification Preferences</h4>
              <div className="space-y-2">
                {getTeamPreferences(selectedSite).map((team, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm text-gray-900 mb-1">{team.email}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>Frequency: {team.frequency}</span>
                      <span>Batch: {team.batch ? 'Yes' : 'No'}</span>
                      <span>Escalation: {team.escalationDays}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{sites.length}</div>
            <div className="text-sm text-gray-600">Websites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">25+</div>
            <div className="text-sm text-gray-600">Stakeholders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.min(...sites.map(s => s.expiryDays))} - {Math.max(...sites.map(s => s.expiryDays))}
            </div>
            <div className="text-sm text-gray-600">Expiry Range (days)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.min(...sites.map(s => s.engagementThreshold))} - {Math.max(...sites.map(s => s.engagementThreshold))}
            </div>
            <div className="text-sm text-gray-600">Engagement Range</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for demo data
const getPatternMappings = (domain: string) => {
  const mappings = {
    'www.thomsonreuters.com': [
      { pattern: '/en/products/*', stakeholder: 'product-marketing@thomsonreuters.com' },
      { pattern: '/en/investors/*', stakeholder: 'investor-relations@thomsonreuters.com' },
      { pattern: '/en/careers/*', stakeholder: 'talent-acquisition@thomsonreuters.com' },
      { pattern: '/en/newsroom/*', stakeholder: 'corporate-communications@thomsonreuters.com' }
    ],
    'legal.thomsonreuters.com': [
      { pattern: '/en/products/*', stakeholder: 'legal-product@thomsonreuters.com' },
      { pattern: '/en/insights/*', stakeholder: 'legal-content@thomsonreuters.com' },
      { pattern: '/en/training/*', stakeholder: 'legal-training@thomsonreuters.com' },
      { pattern: '/en/support/*', stakeholder: 'legal-support@thomsonreuters.com' }
    ],
    'tax.thomsonreuters.com': [
      { pattern: '/en/products/*', stakeholder: 'tax-product@thomsonreuters.com' },
      { pattern: '/en/compliance/*', stakeholder: 'tax-compliance@thomsonreuters.com' },
      { pattern: '/en/updates/*', stakeholder: 'tax-regulatory@thomsonreuters.com' },
      { pattern: '/en/training/*', stakeholder: 'tax-training@thomsonreuters.com' }
    ]
  };
  return mappings[domain] || [];
};

const getTeamPreferences = (domain: string) => {
  const preferences = {
    'www.thomsonreuters.com': [
      { email: 'corporate-communications@thomsonreuters.com', frequency: 'immediate', batch: false, escalationDays: 7 },
      { email: 'investor-relations@thomsonreuters.com', frequency: 'immediate', batch: false, escalationDays: 3 },
      { email: 'product-marketing@thomsonreuters.com', frequency: 'weekly', batch: true, escalationDays: 14 }
    ],
    'legal.thomsonreuters.com': [
      { email: 'legal-product@thomsonreuters.com', frequency: 'immediate', batch: false, escalationDays: 5 },
      { email: 'legal-content@thomsonreuters.com', frequency: 'weekly', batch: true, escalationDays: 10 },
      { email: 'legal-support@thomsonreuters.com', frequency: 'bi-weekly', batch: true, escalationDays: 14 }
    ],
    'tax.thomsonreuters.com': [
      { email: 'tax-regulatory@thomsonreuters.com', frequency: 'immediate', batch: false, escalationDays: 3 },
      { email: 'tax-compliance@thomsonreuters.com', frequency: 'immediate', batch: false, escalationDays: 5 },
      { email: 'tax-product@thomsonreuters.com', frequency: 'weekly', batch: true, escalationDays: 10 }
    ]
  };
  return preferences[domain] || [];
};

export default SiteConfiguration;