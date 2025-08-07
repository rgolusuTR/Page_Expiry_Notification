import React, { useState } from 'react';
import { Globe, FileText, AlertCircle, TrendingUp, Clock, Users, Filter } from 'lucide-react';

interface PageData {
  url: string;
  domain: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  publishedDate: string;
  pageViews: number;
  category: 'expired' | 'low-engagement' | 'normal';
  stakeholder: string;
  ageInDays: number;
}

const DomainAnalyzer: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample data representing processed analytics
  const samplePages: PageData[] = [
    {
      url: '/en/products/westlaw-edge',
      domain: 'legal.thomsonreuters.com',
      title: 'Westlaw Edge Legal Research Platform',
      createdDate: '2022-03-15',
      updatedDate: '2024-01-10',
      publishedDate: '2022-03-20',
      pageViews: 1250,
      category: 'normal',
      stakeholder: 'legal-product@thomsonreuters.com',
      ageInDays: 670
    },
    {
      url: '/en/insights/tax-reform-2021',
      domain: 'tax.thomsonreuters.com',
      title: 'Tax Reform Updates 2021',
      createdDate: '2021-01-15',
      updatedDate: '2021-02-01',
      publishedDate: '2021-01-20',
      pageViews: 45,
      category: 'expired',
      stakeholder: 'tax-content@thomsonreuters.com',
      ageInDays: 1095
    },
    {
      url: '/en/new-product-launch',
      domain: 'www.thomsonreuters.com',
      title: 'New AI-Powered Analytics Platform',
      createdDate: '2024-01-01',
      updatedDate: '2024-01-01',
      publishedDate: '2024-01-01',
      pageViews: 3,
      category: 'low-engagement',
      stakeholder: 'product-marketing@thomsonreuters.com',
      ageInDays: 15
    },
    {
      url: '/en/compliance/gdpr-guide',
      domain: 'legalsolutions.thomsonreuters.co.uk',
      title: 'GDPR Compliance Guide',
      createdDate: '2020-05-25',
      updatedDate: '2020-06-01',
      publishedDate: '2020-05-25',
      pageViews: 89,
      category: 'expired',
      stakeholder: 'legal-uk-content@thomsonreuters.com',
      ageInDays: 1330
    },
    {
      url: '/en/about/canada-office',
      domain: 'www.thomsonreuters.ca',
      title: 'Thomson Reuters Canada Office',
      createdDate: '2023-06-15',
      updatedDate: '2023-12-01',
      publishedDate: '2023-06-20',
      pageViews: 234,
      category: 'normal',
      stakeholder: 'canada-marketing@thomsonreuters.com',
      ageInDays: 215
    }
  ];

  const domains = [
    { value: 'all', label: 'All Domains', count: samplePages.length },
    { value: 'www.thomsonreuters.com', label: 'Corporate', count: samplePages.filter(p => p.domain === 'www.thomsonreuters.com').length },
    { value: 'www.thomsonreuters.ca', label: 'Canada', count: samplePages.filter(p => p.domain === 'www.thomsonreuters.ca').length },
    { value: 'legal.thomsonreuters.com', label: 'Legal', count: samplePages.filter(p => p.domain === 'legal.thomsonreuters.com').length },
    { value: 'tax.thomsonreuters.com', label: 'Tax', count: samplePages.filter(p => p.domain === 'tax.thomsonreuters.com').length },
    { value: 'legalsolutions.thomsonreuters.co.uk', label: 'Legal UK', count: samplePages.filter(p => p.domain === 'legalsolutions.thomsonreuters.co.uk').length }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: FileText },
    { value: 'expired', label: 'Expired Pages', icon: AlertCircle },
    { value: 'low-engagement', label: 'Low Engagement', icon: TrendingUp },
    { value: 'normal', label: 'Normal Pages', icon: FileText }
  ];

  const filteredPages = samplePages.filter(page => {
    const domainMatch = selectedDomain === 'all' || page.domain === selectedDomain;
    const categoryMatch = selectedCategory === 'all' || page.category === selectedCategory;
    return domainMatch && categoryMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'low-engagement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getDomainColor = (domain: string) => {
    const colors = {
      'www.thomsonreuters.com': 'text-blue-600',
      'www.thomsonreuters.ca': 'text-red-600',
      'legal.thomsonreuters.com': 'text-purple-600',
      'tax.thomsonreuters.com': 'text-green-600',
      'legalsolutions.thomsonreuters.co.uk': 'text-orange-600'
    };
    return colors[domain] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAgeDisplay = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      return `${years}y ${Math.floor(remainingDays / 30)}m`;
    }
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Domain-Based Page Analysis</h2>
        </div>
        <p className="text-gray-600">
          Analyze pages across Thomson Reuters websites with domain-specific thresholds and stakeholder assignments.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
            <div className="space-y-2">
              {domains.map((domain) => (
                <label key={domain.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="domain"
                    value={domain.value}
                    checked={selectedDomain === domain.value}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{domain.label}</span>
                  <span className="text-xs text-gray-500">({domain.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <label key={category.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Analysis Results</h3>
            <span className="text-sm text-gray-500">{filteredPages.length} pages found</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredPages.map((page, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{page.title}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(page.category)}`}>
                      {page.category === 'low-engagement' ? 'Low Engagement' : page.category.charAt(0).toUpperCase() + page.category.slice(1)}
                    </div>
                  </div>
                  <div className={`text-sm font-mono ${getDomainColor(page.domain)} mb-2`}>
                    {page.domain}{page.url}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{page.pageViews} views</div>
                  <div className="text-xs text-gray-500">Age: {getAgeDisplay(page.ageInDays)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDate(page.createdDate)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Updated: {formatDate(page.updatedDate)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="truncate">{page.stakeholder}</span>
                  </div>
                </div>
              </div>

              {/* Action Recommendations */}
              {page.category !== 'normal' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {page.category === 'expired' ? (
                      <>
                        <li>• Review content relevance and accuracy</li>
                        <li>• Update with current information or archive</li>
                        <li>• Check for dependencies and broken links</li>
                        <li>• Consider implementing redirects if removing</li>
                      </>
                    ) : (
                      <>
                        <li>• Review content necessity and target audience</li>
                        <li>• Improve internal linking and navigation</li>
                        <li>• Optimize SEO elements (title, meta description)</li>
                        <li>• Promote through relevant channels</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainAnalyzer;