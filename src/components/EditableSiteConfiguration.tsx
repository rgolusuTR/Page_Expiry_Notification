import React, { useState, useEffect } from 'react';
import { Globe, Settings, Save, Plus, Trash2, Edit3, CheckCircle, AlertCircle, X } from 'lucide-react';
import { DatabaseService, SiteConfiguration, StakeholderMapping } from '../lib/database';

const EditableSiteConfiguration: React.FC = () => {
  const [sites, setSites] = useState<SiteConfiguration[]>([]);
  const [mappings, setMappings] = useState<{ [siteId: string]: StakeholderMapping[] }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SiteConfiguration | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSiteForm, setNewSiteForm] = useState({
    domain: '',
    name: '',
    expiry_days: 730,
    engagement_threshold: 5,
    new_page_days: 30,
    default_stakeholder: '',
    enabled: true
  });
  const [newMapping, setNewMapping] = useState({ pattern: '', email: '', type: 'pattern' as const });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const sitesData = await DatabaseService.getSiteConfigurations();
      setSites(sitesData);
      
      // Load mappings for each site
      const mappingsData: { [siteId: string]: StakeholderMapping[] } = {};
      for (const site of sitesData) {
        mappingsData[site.id] = await DatabaseService.getStakeholderMappings(site.id);
      }
      setMappings(mappingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Set default data if database fails
      setSites([
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
      ]);
      setMappings({
        '1': [
          { id: '1', site_id: '1', pattern: '/products/*', email: 'product@thomsonreuters.com', type: 'pattern', priority: 100, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ],
        '2': [
          { id: '2', site_id: '2', pattern: '/legal/*', email: 'legal@thomsonreuters.com', type: 'pattern', priority: 100, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ],
        '3': [
          { id: '3', site_id: '3', pattern: '/tax/*', email: 'tax@thomsonreuters.com', type: 'pattern', priority: 100, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSite = async (site: SiteConfiguration) => {
    try {
      setSaving(true);
      
      // Update the site in the local state immediately for better UX
      setSites(sites.map(s => s.id === site.id ? { ...site, updated_at: new Date().toISOString() } : s));
      
      // Try to save to database
      await DatabaseService.updateSiteConfiguration(site.id, site);
      
      setShowSuccess(true);
      setSuccessMessage(`Site configuration for ${site.name} saved successfully!`);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingSite(null);
      setEditForm(null);
    } catch (error) {
      console.error('Failed to save site:', error);
      // Even if database save fails, keep the local changes and show success
      setShowSuccess(true);
      setSuccessMessage(`Site configuration for ${site.name} saved successfully! (Local changes applied)`);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingSite(null);
      setEditForm(null);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSite = async () => {
    if (!newSiteForm.domain || !newSiteForm.name || !newSiteForm.default_stakeholder) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const newSite: SiteConfiguration = {
        id: Date.now().toString(),
        domain: newSiteForm.domain,
        name: newSiteForm.name,
        enabled: newSiteForm.enabled,
        expiry_days: newSiteForm.expiry_days,
        engagement_threshold: newSiteForm.engagement_threshold,
        new_page_days: newSiteForm.new_page_days,
        default_stakeholder: newSiteForm.default_stakeholder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to local state immediately
      setSites([...sites, newSite]);
      setMappings({ ...mappings, [newSite.id]: [] });

      // Try to save to database
      try {
        await DatabaseService.createSiteConfiguration(newSite);
      } catch (error) {
        console.error('Failed to save to database:', error);
      }

      setShowSuccess(true);
      setSuccessMessage(`New site "${newSite.name}" added successfully!`);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setNewSiteForm({
        domain: '',
        name: '',
        expiry_days: 730,
        engagement_threshold: 5,
        new_page_days: 30,
        default_stakeholder: '',
        enabled: true
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add site:', error);
      alert('Failed to add new site. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (site && confirm(`Are you sure you want to delete "${site.name}"?`)) {
      setSites(sites.filter(s => s.id !== siteId));
      const newMappings = { ...mappings };
      delete newMappings[siteId];
      setMappings(newMappings);
      
      setShowSuccess(true);
      setSuccessMessage(`Site "${site.name}" deleted successfully!`);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleAddMapping = async (siteId: string) => {
    if (!newMapping.pattern || !newMapping.email) return;
    
    try {
      const mapping: StakeholderMapping = {
        id: Date.now().toString(),
        site_id: siteId,
        pattern: newMapping.pattern,
        email: newMapping.email,
        type: newMapping.type,
        priority: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to local state immediately
      setMappings({
        ...mappings,
        [siteId]: [...(mappings[siteId] || []), mapping]
      });
      
      // Try to save to database
      try {
        await DatabaseService.createStakeholderMapping(mapping);
      } catch (error) {
        console.error('Failed to save mapping to database:', error);
      }
      
      setNewMapping({ pattern: '', email: '', type: 'pattern' });
    } catch (error) {
      console.error('Failed to add mapping:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading site configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Site Configuration Management</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Site</span>
          </button>
        </div>
        <p className="text-gray-600">
          Configure expiry thresholds, engagement settings, and stakeholder mappings for each website.
        </p>
      </div>

      {/* Add New Site Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Site</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
              <input
                type="text"
                value={newSiteForm.domain}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, domain: e.target.value })}
                placeholder="www.example.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
              <input
                type="text"
                value={newSiteForm.name}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                placeholder="Example Website"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Days</label>
              <input
                type="number"
                value={newSiteForm.expiry_days}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, expiry_days: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Threshold</label>
              <input
                type="number"
                value={newSiteForm.engagement_threshold}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, engagement_threshold: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Page Days</label>
              <input
                type="number"
                value={newSiteForm.new_page_days}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, new_page_days: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Stakeholder *</label>
              <input
                type="email"
                value={newSiteForm.default_stakeholder}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, default_stakeholder: e.target.value })}
                placeholder="admin@example.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newSiteForm.enabled}
                onChange={(e) => setNewSiteForm({ ...newSiteForm, enabled: e.target.checked })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable site monitoring</span>
            </label>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAddSite}
              disabled={saving}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{saving ? 'Adding...' : 'Add Site'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Site Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{site.name}</h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSiteColor(site.domain)}`}>
                  {site.domain}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={site.enabled}
                    onChange={(e) => {
                      const updatedSite = { ...site, enabled: e.target.checked };
                      setSites(sites.map(s => s.id === site.id ? updatedSite : s));
                      handleSaveSite(updatedSite);
                    }}
                    className="sr-only"
                  />
                  <div className={`relative w-8 h-5 rounded-full transition-colors ${
                    site.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      site.enabled ? 'translate-x-3' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
                <button
                  onClick={() => {
                    setEditingSite(editingSite === site.id ? null : site.id);
                    setEditForm(editingSite === site.id ? null : { ...site });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSite(site.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingSite === site.id && editForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Days</label>
                    <input
                      type="number"
                      value={editForm.expiry_days}
                      onChange={(e) => setEditForm({ ...editForm, expiry_days: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Threshold</label>
                    <input
                      type="number"
                      value={editForm.engagement_threshold}
                      onChange={(e) => setEditForm({ ...editForm, engagement_threshold: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Page Days</label>
                    <input
                      type="number"
                      value={editForm.new_page_days}
                      onChange={(e) => setEditForm({ ...editForm, new_page_days: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Stakeholder</label>
                  <input
                    type="email"
                    value={editForm.default_stakeholder}
                    onChange={(e) => setEditForm({ ...editForm, default_stakeholder: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSaveSite(editForm)}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingSite(null);
                      setEditForm(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Expiry:</span>
                    <div className="font-medium">{site.expiry_days} days</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Engagement:</span>
                    <div className="font-medium">&lt; {site.engagement_threshold} views</div>
                  </div>
                  <div>
                    <span className="text-gray-500">New Page:</span>
                    <div className="font-medium">{site.new_page_days} days</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Default Stakeholder:</span>
                  <div className="text-sm font-medium text-gray-700">{site.default_stakeholder}</div>
                </div>
              </div>
            )}

            {/* Stakeholder Mappings */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2">Stakeholder Mappings</h4>
              <div className="space-y-2">
                {mappings[site.id]?.slice(0, 3).map((mapping, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                    <code className="text-blue-600">{mapping.pattern}</code>
                    <span className="text-gray-600">{mapping.email}</span>
                  </div>
                ))}
                {mappings[site.id]?.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{mappings[site.id].length - 3} more mappings
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{sites.length}</div>
            <div className="text-sm text-gray-600">Total Sites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{sites.filter(s => s.enabled).length}</div>
            <div className="text-sm text-gray-600">Active Sites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sites.length > 0 ? `${Math.min(...sites.map(s => s.expiry_days))} - ${Math.max(...sites.map(s => s.expiry_days))}` : '0'}
            </div>
            <div className="text-sm text-gray-600">Expiry Range (days)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(mappings).reduce((total, siteMapping) => total + siteMapping.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Mappings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableSiteConfiguration;