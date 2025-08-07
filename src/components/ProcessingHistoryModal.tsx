</div>
        </div>

        {/* Next Steps Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">!</span>
            Recommended Next Steps
          </h4>
          <div className="space-y-3">
            {file.results.expiredPages > 0 && (
              <div className="bg-white p-3 rounded border-l-4 border-red-500">
                <h5 className="font-medium text-red-900 mb-2">🚨 Expired Pages ({file.results.expiredPages})</h5>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Review content relevance and accuracy</li>
                  <li>• Update with current information or archive pages</li>
                  <li>• Check for dependencies and broken links</li>
                  <li>• Implement redirects if removing pages</li>
                  <li>• Notify stakeholders about required actions</li>
                </ul>
              </div>
            )}
            
            {file.results.lowEngagementPages > 0 && (
              <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                <h5 className="font-medium text-yellow-900 mb-2">📊 Low Engagement Pages ({file.results.lowEngagementPages})</h5>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Review content necessity and target audience</li>
                  <li>• Improve internal linking and navigation</li>
                  <li>• Optimize SEO elements (title, meta description)</li>
                  <li>• Promote through relevant marketing channels</li>
                  <li>• Consider content consolidation or merging</li>
                </ul>
              </div>
            )}
            
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <h5 className="font-medium text-green-900 mb-2">✅ General Actions</h5>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Send notifications to identified stakeholders</li>
                <li>• Schedule follow-up reviews for updated content</li>
                <li>• Monitor response rates and completion status</li>
                <li>• Update stakeholder mappings if needed</li>
                <li>• Generate detailed reports for management</li>
              </ul>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <h5 className="font-medium text-blue-900 mb-2">🔄 System Actions</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Go to "Alert History" tab to manage notifications</li>
                <li>• Use "Email Scheduler" to set up automated reminders</li>
                <li>• Check "Site Configuration" for threshold adjustments</li>
                <li>• Review "Domain Analysis" for site-specific insights</li>
                <li>• Schedule next processing run based on findings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}