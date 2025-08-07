import React, { useState } from 'react';
import { FileText, Edit3, Save, Plus, Trash2, AlertCircle, CheckCircle, Download, Upload } from 'lucide-react';

interface ColumnMapping {
  id: string;
  displayName: string;
  expectedNames: string[];
  dataType: 'string' | 'date' | 'number';
  required: boolean;
  description: string;
}

interface DataFormat {
  id: string;
  name: string;
  description: string;
  columns: ColumnMapping[];
  isDefault: boolean;
}

const DataFormatManager: React.FC = () => {
  const [formats, setFormats] = useState<DataFormat[]>([
    {
      id: '1',
      name: 'Adobe Analytics Standard',
      description: 'Standard Adobe Analytics export format with page URLs, dates, and metrics',
      isDefault: true,
      columns: [
        {
          id: '1',
          displayName: 'Page URL',
          expectedNames: ['Page URL', 'URL', 'Page', 'page_url', 'url'],
          dataType: 'string',
          required: true,
          description: 'The full URL or path of the page'
        },
        {
          id: '2',
          displayName: 'Creation Date',
          expectedNames: ['Creation Date', 'Created Date', 'Date Created', 'created_date', 'creation_date'],
          dataType: 'date',
          required: true,
          description: 'When the page was first created'
        },
        {
          id: '3',
          displayName: 'Updated Date',
          expectedNames: ['Updated Date', 'Last Updated', 'Modified Date', 'updated_date', 'last_modified'],
          dataType: 'date',
          required: false,
          description: 'When the page was last updated'
        },
        {
          id: '4',
          displayName: 'Published Date',
          expectedNames: ['Published Date', 'Publish Date', 'Date Published', 'published_date', 'publish_date'],
          dataType: 'date',
          required: false,
          description: 'When the page was published'
        },
        {
          id: '5',
          displayName: 'Page Views',
          expectedNames: ['Page Views', 'Views', 'Pageviews', 'page_views', 'unique_pageviews'],
          dataType: 'number',
          required: true,
          description: 'Number of page views in the reporting period'
        }
      ]
    },
    {
      id: '2',
      name: 'Google Analytics 4',
      description: 'Google Analytics 4 export format',
      isDefault: false,
      columns: [
        {
          id: '6',
          displayName: 'Page URL',
          expectedNames: ['Page path and screen class', 'Page', 'pagePath'],
          dataType: 'string',
          required: true,
          description: 'The page path from GA4'
        },
        {
          id: '7',
          displayName: 'Page Views',
          expectedNames: ['Views', 'Screenviews', 'screenPageViews'],
          dataType: 'number',
          required: true,
          description: 'Number of page views from GA4'
        }
      ]
    }
  ]);

  const [selectedFormat, setSelectedFormat] = useState<string>('1');
  const [editingFormat, setEditingFormat] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DataFormat | null>(null);
  const [newColumn, setNewColumn] = useState<Partial<ColumnMapping>>({
    displayName: '',
    expectedNames: [],
    dataType: 'string',
    required: false,
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditFormat = (format: DataFormat) => {
    setEditingFormat(format.id);
    setEditForm({ ...format, columns: [...format.columns] });
  };

  const handleSaveFormat = () => {
    if (editForm) {
      setFormats(formats.map(format => 
        format.id === editForm.id ? editForm : format
      ));
      setEditingFormat(null);
      setEditForm(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingFormat(null);
    setEditForm(null);
  };

  const addColumnToFormat = () => {
    if (editForm && newColumn.displayName && newColumn.expectedNames?.length) {
      const column: ColumnMapping = {
        id: Date.now().toString(),
        displayName: newColumn.displayName,
        expectedNames: newColumn.expectedNames,
        dataType: newColumn.dataType || 'string',
        required: newColumn.required || false,
        description: newColumn.description || ''
      };
      setEditForm({
        ...editForm,
        columns: [...editForm.columns, column]
      });
      setNewColumn({
        displayName: '',
        expectedNames: [],
        dataType: 'string',
        required: false,
        description: ''
      });
    }
  };

  const removeColumnFromFormat = (columnId: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        columns: editForm.columns.filter(col => col.id !== columnId)
      });
    }
  };

  const setDefaultFormat = (formatId: string) => {
    setFormats(formats.map(format => ({
      ...format,
      isDefault: format.id === formatId
    })));
    setSelectedFormat(formatId);
  };

  const exportFormat = (format: DataFormat) => {
    const dataStr = JSON.stringify(format, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${format.name.toLowerCase().replace(/\s+/g, '-')}-format.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const currentFormat = formats.find(f => f.id === selectedFormat);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Data format saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Data Format Manager</h2>
        </div>
        <p className="text-gray-600">
          Configure expected data formats for Excel file uploads. Define column mappings and validation rules.
        </p>
      </div>

      {/* Format Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Data Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => (
            <div
              key={format.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedFormat === format.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{format.name}</h4>
                <div className="flex items-center space-x-2">
                  {format.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFormat(format);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{format.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{format.columns.length} columns defined</span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultFormat(format.id);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportFormat(format);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Format Editor */}
      {editingFormat && editForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Edit Format: {editForm.name}</h3>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveFormat}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Column Definitions */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Column Definitions</h4>
            <div className="space-y-4">
              {editForm.columns.map((column) => (
                <div key={column.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h5 className="font-medium text-gray-900">{column.displayName}</h5>
                      {column.required && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {column.dataType}
                      </span>
                    </div>
                    <button
                      onClick={() => removeColumnFromFormat(column.id)}
                      className="p-1 text-red-500 hover:text-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{column.description}</p>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expected column names: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {column.expectedNames.map((name, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Column */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Column</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newColumn.displayName || ''}
                  onChange={(e) => setNewColumn({ ...newColumn, displayName: e.target.value })}
                  placeholder="Page Title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                <select
                  value={newColumn.dataType || 'string'}
                  onChange={(e) => setNewColumn({ ...newColumn, dataType: e.target.value as 'string' | 'date' | 'number' })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="string">String</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Names</label>
                <input
                  type="text"
                  value={newColumn.expectedNames?.join(', ') || ''}
                  onChange={(e) => setNewColumn({ 
                    ...newColumn, 
                    expectedNames: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  })}
                  placeholder="Title, Page Title, title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end space-x-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newColumn.required || false}
                    onChange={(e) => setNewColumn({ ...newColumn, required: e.target.checked })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newColumn.description || ''}
                onChange={(e) => setNewColumn({ ...newColumn, description: e.target.value })}
                placeholder="Description of this column"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={addColumnToFormat}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Column</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Format Preview */}
      {currentFormat && !editingFormat && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expected Data Format: {currentFormat.name}</h3>
            <button
              onClick={() => exportFormat(currentFormat)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Format</span>
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">File Requirements:</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Maximum file size: 50MB</li>
              <li>• Supported formats: .xlsx, .xls</li>
              <li>• Required columns: {currentFormat.columns.filter(c => c.required).map(c => c.displayName).join(', ')}</li>
              <li>• Column names can be case-insensitive and may contain variations</li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {currentFormat.columns.map((column) => (
                    <th key={column.id} className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                      {column.displayName}
                      {column.required && <span className="text-red-500 ml-1">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">/about-us/</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2022-01-15</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2024-01-10</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2022-01-20</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">1250</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">/products/laptop/</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2023-06-20</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2023-12-01</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2023-06-25</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">3</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">/blog/new-features/</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2024-12-01</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2024-12-01</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2024-12-01</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">45</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Column Mapping Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentFormat.columns.map((column) => (
                <div key={column.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{column.displayName}</span>
                    {column.required && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{column.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {column.expectedNames.map((name, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFormatManager;