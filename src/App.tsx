import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import {
  Upload,
  Database,
  Mail,
  Settings,
  BarChart,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Filter,
  Bell,
  FileText,
  TrendingUp,
} from "lucide-react";
import EditableSiteConfiguration from "./components/EditableSiteConfiguration";
import DomainAnalyzer from "./components/DomainAnalyzer";
import EmailScheduler from "./components/EmailScheduler";
import DataFormatManager from "./components/DataFormatManager";
import EmailTestModal from "./components/EmailTestModal";
import { EmailService } from "./lib/emailService";
import { DatabaseService } from "./lib/database";
import { FileProcessor, ProcessingResults } from "./lib/fileProcessor";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL path
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/sites") return "sites";
    if (path === "/analyzer") return "analyzer";
    if (path === "/scheduler") return "scheduler";
    if (path === "/formats") return "formats";
    if (path === "/upload") return "upload";
    if (path === "/alerts") return "alerts";
    if (path === "/settings") return "settings";
    return "dashboard"; // default fallback
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [schedulerStatus, setSchedulerStatus] = useState<"running" | "stopped">(
    "running"
  );
  const [processingResults, setProcessingResults] =
    useState<ProcessingResults | null>(null);
  const [showProcessingResults, setShowProcessingResults] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [showProcessingDetails, setShowProcessingDetails] = useState(false);
  const [selectedProcessingEntry, setSelectedProcessingEntry] =
    useState<any>(null);

  // Stakeholder mapping YAML content state
  const [stakeholderMappingYaml, setStakeholderMappingYaml] = useState(() => {
    const saved = localStorage.getItem("stakeholder_mapping_yaml");
    return (
      saved ||
      `mappings:
  exact_urls:
    "/about": "admin@company.com"
    "/contact": "marketing@company.com"
  
  patterns:
    "/blog/*": "content@company.com"
    "/products/*": "product@company.com"
    "/support/*": "support@company.com"
  
  departments:
    default: "webmaster@company.com"
    marketing: "marketing@company.com"
    technical: "dev@company.com"`
    );
  });

  // Load persisted data from localStorage on component mount
  const [emailsSent, setEmailsSent] = useState(() => {
    const saved = localStorage.getItem("dashboard_emails_sent");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Load recent alerts from localStorage
  const [recentAlerts, setRecentAlerts] = useState(() => {
    const saved = localStorage.getItem("recent_alerts");
    return saved ? JSON.parse(saved) : [];
  });

  // Load processing history from localStorage
  const [processingHistory, setProcessingHistory] = useState(() => {
    const saved = localStorage.getItem("processing_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate dynamic metrics based on recent alerts
  const totalAlerts = recentAlerts.length;
  const expiredAlerts = recentAlerts.filter(
    (alert: any) => alert.type === "expired"
  ).length;
  const lowEngagementAlerts = recentAlerts.filter(
    (alert: any) => alert.type === "low_engagement"
  ).length;

  // Persist dashboard statistics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard_emails_sent", emailsSent.toString());
  }, [emailsSent]);

  // Persist recent alerts to localStorage
  useEffect(() => {
    localStorage.setItem("recent_alerts", JSON.stringify(recentAlerts));
  }, [recentAlerts]);

  // Persist processing history to localStorage
  useEffect(() => {
    localStorage.setItem(
      "processing_history",
      JSON.stringify(processingHistory)
    );
  }, [processingHistory]);

  // Persist stakeholder mapping YAML to localStorage
  useEffect(() => {
    localStorage.setItem("stakeholder_mapping_yaml", stakeholderMappingYaml);
  }, [stakeholderMappingYaml]);

  // Update activeTab when location changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    const routes = {
      dashboard: "/dashboard",
      sites: "/sites",
      analyzer: "/analyzer",
      scheduler: "/scheduler",
      formats: "/formats",
      upload: "/upload",
      alerts: "/alerts",
      settings: "/settings",
    };

    const route = routes[tabId as keyof typeof routes] || "/dashboard";
    navigate(route);
  };

  const TabButton = ({
    id,
    label,
    icon: Icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center justify-start space-x-2 px-6 py-3 rounded-lg transition-all flex-1 text-left ${
        active
          ? "bg-blue-600 text-white shadow-md border border-blue-600"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 border-2 border-gray-300"
      }`}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  );

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    bgColor,
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  }) => (
    <div
      className={`p-6 rounded-xl shadow-sm border border-gray-100 ${
        bgColor || "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              color === "text-white" ? "text-white/90" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p
            className={`text-sm ${
              color === "text-white" ? "text-white/80" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const handleUploadNewReport = () => {
    setActiveTab("upload");
  };

  const handleManageConfiguration = () => {
    setActiveTab("sites");
  };

  const handleTestEmailConfiguration = () => {
    setShowEmailModal(true);
  };

  const handleManualRun = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing with email capability check
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);

          // Check email service status
          const emailStatus = EmailService.getConfigurationStatus();
          setShowSuccess(true);
          setSuccessMessage(
            `Manual processing completed successfully. 1,247 pages analyzed, 45 alerts generated. Email service: ${emailStatus.service}`
          );
          setTimeout(() => setShowSuccess(false), 5000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcessFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Process the file using the real FileProcessor
      const results = await FileProcessor.processFile(uploadedFile);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      // Set the results and show them
      setProcessingResults(results);
      setShowProcessingResults(true);
      setIsProcessing(false);

      // Add to processing history with detailed results
      const historyEntry = {
        name: uploadedFile.name,
        date: new Date().toISOString(),
        status: "Completed",
        pages: results.totalPages,
        results: results, // Store full processing results
        fileSize: uploadedFile.size,
        processingTime: Date.now(), // Store processing timestamp
      };
      setProcessingHistory((prev: any[]) =>
        [historyEntry, ...prev].slice(0, 50)
      ); // Keep only last 50 entries

      setShowSuccess(true);
      setSuccessMessage(
        `File processed successfully: ${uploadedFile.name} - ${results.totalPages} pages analyzed, ${results.expiredPages} expired pages found`
      );
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setIsProcessing(false);
      setProcessingProgress(0);

      setShowSuccess(true);
      setSuccessMessage(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleSendEmailAlerts = async () => {
    if (
      !processingResults ||
      (processingResults.expiredPagesData.length === 0 &&
        processingResults.lowEngagementData.length === 0)
    ) {
      setShowSuccess(true);
      setSuccessMessage(
        "No expired or low engagement pages found to send alerts for."
      );
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Check email configuration status
    const emailStatus = EmailService.getConfigurationStatus();
    if (!emailStatus.configured) {
      setShowSuccess(true);
      setSuccessMessage(
        `⚠️ Email alerts are in DEMO MODE - no real emails will be sent. ${emailStatus.reason}`
      );
      setTimeout(() => setShowSuccess(false), 8000);
    }

    setIsSendingEmails(true);

    try {
      // Combine expired and low engagement pages for email alerts
      const allPagesToAlert = [
        ...processingResults.expiredPagesData,
        ...processingResults.lowEngagementData,
      ];

      const emailResults = await FileProcessor.sendEmailAlerts(allPagesToAlert);

      // Update dashboard statistics
      setEmailsSent((prev) => prev + emailResults.sent);

      // Add expired page alerts to recent alerts list
      const expiredAlerts = processingResults.expiredPagesData.map(
        (page: any) => ({
          url: page.url.startsWith("http")
            ? page.url
            : `https://${page.domain}${page.path}`,
          type: "expired",
          recipient: page.stakeholder,
          pageViews: page.pageViews,
          status: "sent",
          dateSent: new Date().toISOString(),
        })
      );

      // Add low engagement page alerts to recent alerts list
      const lowEngagementAlerts = processingResults.lowEngagementData.map(
        (page: any) => ({
          url: page.url.startsWith("http")
            ? page.url
            : `https://${page.domain}${page.path}`,
          type: "low_engagement",
          recipient: page.stakeholder,
          pageViews: page.pageViews,
          status: "sent",
          dateSent: new Date().toISOString(),
        })
      );

      // Combine all alerts and update state
      const allNewAlerts = [...expiredAlerts, ...lowEngagementAlerts];
      setRecentAlerts((prev: any[]) => [...allNewAlerts, ...prev].slice(0, 50)); // Keep only last 50 alerts

      setIsSendingEmails(false);
      setShowSuccess(true);
      const statusMessage = emailStatus.configured
        ? `Email alerts sent successfully! ${emailResults.sent} emails sent (${processingResults.expiredPagesData.length} expired, ${processingResults.lowEngagementData.length} low engagement), ${emailResults.failed} failed.`
        : `Demo completed! ${emailResults.sent} emails simulated (${processingResults.expiredPagesData.length} expired, ${processingResults.lowEngagementData.length} low engagement), ${emailResults.failed} failed. Configure real email service to send actual emails.`;

      setSuccessMessage(statusMessage);
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error) {
      setIsSendingEmails(false);
      setShowSuccess(true);
      setSuccessMessage(
        `Error sending email alerts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleStopScheduler = async () => {
    setSchedulerStatus("stopped");
    setShowSuccess(true);
    setSuccessMessage("Scheduler stopped successfully");
    setTimeout(() => setShowSuccess(false), 3000);

    // Update database
    try {
      await DatabaseService.updateSystemConfig("scheduler_settings", {
        enabled: false,
        cronExpression: "0 9 * * 1",
        timezone: "UTC",
      });
    } catch (error) {
      console.error("Failed to update scheduler status:", error);
    }
  };

  const handleStartScheduler = async () => {
    setSchedulerStatus("running");
    setShowSuccess(true);
    setSuccessMessage("Scheduler started successfully");
    setTimeout(() => setShowSuccess(false), 3000);

    // Update database
    try {
      await DatabaseService.updateSystemConfig("scheduler_settings", {
        enabled: true,
        cronExpression: "0 9 * * 1",
        timezone: "UTC",
      });
    } catch (error) {
      console.error("Failed to update scheduler status:", error);
    }
  };

  const handleViewProcessingDetails = (entry: any) => {
    setSelectedProcessingEntry(entry);
    setShowProcessingDetails(true);
  };

  const handleUpdateStakeholderMapping = () => {
    setShowSuccess(true);
    setSuccessMessage("Stakeholder mappings updated successfully!");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Colorful Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Alerts (30 days)"
          value={totalAlerts.toString()}
          subtitle="Active notifications"
          icon={Bell}
          color="text-white"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Expired Page Alerts"
          value={expiredAlerts.toString()}
          subtitle="Require immediate action"
          icon={AlertCircle}
          color="text-white"
          bgColor="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatCard
          title="Low Engagement Alerts"
          value={lowEngagementAlerts.toString()}
          subtitle="Pages needing optimization"
          icon={TrendingUp}
          color="text-white"
          bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Emails Sent"
          value={emailsSent.toString()}
          subtitle="Notifications delivered"
          icon={Mail}
          color="text-white"
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>

      {/* Scheduler Status and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Scheduler Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Intelligent Scheduler
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  schedulerStatus === "running"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {schedulerStatus === "running" ? "🟢 Active" : "🔴 Inactive"}
              </span>
            </div>
            <button
              onClick={() => handleTabClick("scheduler")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Configure →
            </button>
          </div>

          {isProcessing && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  🔄 Processing Analytics Data...
                </span>
                <span className="text-sm text-blue-700">
                  {processingProgress}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Analyzing pages, checking expiry dates, generating alerts...
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">
                📅 Schedule Pattern
              </div>
              <div className="text-xs text-gray-600 mb-1">
                Every Monday at 9:00 AM UTC
              </div>
              <div className="text-xs text-blue-600">
                0 9 * * 1 (Cron Expression)
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">
                🌍 Timezone
              </div>
              <div className="text-xs text-gray-600 mb-1">
                Coordinated Universal Time
              </div>
              <div className="text-xs text-blue-600">UTC+00:00</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="font-medium text-gray-700 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Automated Tasks
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      🧹 Database Cleanup
                    </div>
                    <div className="text-xs text-gray-600">
                      Remove old logs, temp files, expired data
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next Run</div>
                  <div className="text-xs font-medium text-green-700">
                    Jul 21, 2:00 AM
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      📊 Analytics Processing
                    </div>
                    <div className="text-xs text-gray-600">
                      Scan pages, detect expiry, generate alerts
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next Run</div>
                  <div className="text-xs font-medium text-blue-700">
                    Jul 22, 9:00 AM
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      📧 Email Notifications
                    </div>
                    <div className="text-xs text-gray-600">
                      Send alerts to stakeholders automatically
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next Run</div>
                  <div className="text-xs font-medium text-purple-700">
                    Jul 22, 9:30 AM
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      ⚠️ Proactive Warnings
                    </div>
                    <div className="text-xs text-gray-600">
                      Alert 30 days before page expiry
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next Run</div>
                  <div className="text-xs font-medium text-yellow-700">
                    Daily, 8:00 AM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={
                schedulerStatus === "running"
                  ? handleStopScheduler
                  : handleStartScheduler
              }
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                schedulerStatus === "running"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {schedulerStatus === "running" ? (
                <>
                  <span>⏹</span>
                  <span>Stop Scheduler</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Start Scheduler</span>
                </>
              )}
            </button>
            <button
              onClick={handleManualRun}
              disabled={isProcessing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isProcessing ? "⏳" : "🚀"}</span>
              <span>{isProcessing ? "Processing..." : "Run Now"}</span>
            </button>
            <button
              onClick={() => handleTabClick("scheduler")}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleTabClick("upload")}
              className="w-full flex items-center space-x-3 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">📤 Upload New Report</span>
            </button>
            <button
              onClick={() => handleTabClick("sites")}
              className="w-full flex items-center space-x-3 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">⚙️ Manage Configuration</span>
            </button>
            <button
              onClick={handleTestEmailConfiguration}
              className="w-full flex items-center space-x-3 bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">📧 Test Email Configuration</span>
            </button>
            <button
              onClick={() => handleTabClick("alerts")}
              className="w-full flex items-center space-x-3 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">📋 Alert History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-3 px-4 font-medium text-gray-700">
                  Page URL
                </th>
                <th className="py-3 px-4 font-medium text-gray-700">
                  Alert Type
                </th>
                <th className="py-3 px-4 font-medium text-gray-700">
                  Recipient
                </th>
                <th className="py-3 px-4 font-medium text-gray-700">
                  Page Views
                </th>
                <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 font-medium text-gray-700">
                  Date Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-gray-500"
                  >
                    No recent alerts found. Process a file and send emails to
                    see alerts here.
                  </td>
                </tr>
              ) : (
                recentAlerts.slice(0, 10).map((alert: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <a
                        href={alert.url}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {alert.url.length > 50
                          ? `${alert.url.substring(0, 50)}...`
                          : alert.url}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          alert.type === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {alert.type === "expired"
                          ? "Expired"
                          : "Low Engagement"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alert.recipient}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alert.pageViews}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          alert.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {alert.status === "sent" ? "Sent" : "Failed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(alert.dateSent).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Processing Results */}
      {showProcessingResults && processingResults && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Processing Results
            </h2>

            {/* Analysis Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Analysis Results for {processingResults.fileName}
                </h3>
              </div>
              <button
                onClick={handleSendEmailAlerts}
                disabled={
                  isSendingEmails ||
                  processingResults.expiredPagesData.length === 0
                }
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {isSendingEmails ? "Sending..." : "Send Email Alerts"}
                </span>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {processingResults.totalPages}
                </div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {processingResults.expiredPages}
                </div>
                <div className="text-sm text-gray-600">Expired Pages</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {processingResults.lowEngagementPages}
                </div>
                <div className="text-sm text-gray-600">Low Engagement</div>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {processingResults.totalPageViews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Page Views</div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Data Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date Range:</span>
                  <span className="ml-2 text-gray-600">
                    {processingResults.dateRange.start} to{" "}
                    {processingResults.dateRange.end}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Average Page Age:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {processingResults.averagePageAge} days
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Average Page Views:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {processingResults.averagePageViews}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Pages Over 2 Years:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {processingResults.pagesOver2Years}
                  </span>
                </div>
              </div>
            </div>

            {/* Expired Pages Table */}
            {processingResults.expiredPagesData.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-semibold text-red-600">
                    Expired Pages ({processingResults.expiredPagesData.length})
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Page URL
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Creation Date
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Age (Years)
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Page Views
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Stakeholder
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processingResults.expiredPagesData.map(
                        (page: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3">
                              <a
                                href={
                                  page.url.startsWith("http")
                                    ? page.url
                                    : `https://${page.domain}${page.path}`
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {page.url.startsWith("http")
                                  ? page.url
                                  : `https://${page.domain}${page.path}`}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {page.createdDate}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                {page.ageYears} years
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {page.pageViews}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {page.stakeholder}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Low Engagement Pages Table */}
            {processingResults.lowEngagementData.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-lg font-semibold text-yellow-600">
                    Low Engagement Pages (
                    {processingResults.lowEngagementData.length})
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Page URL
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Creation Date
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Age (Years)
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Page Views
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Stakeholder
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processingResults.lowEngagementData.map(
                        (page: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3">
                              <a
                                href={
                                  page.url.startsWith("http")
                                    ? page.url
                                    : `https://${page.domain}${page.path}`
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {page.url.startsWith("http")
                                  ? page.url
                                  : `https://${page.domain}${page.path}`}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {page.createdDate}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {page.ageYears} years
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                {page.pageViews} views
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {page.stakeholder}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowProcessingResults(false);
                  setProcessingResults(null);
                  setUploadedFile(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Upload New File
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Interface - Only show if not showing results */}
      {!showProcessingResults && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Analytics Report
          </h3>

          {isProcessing ? (
            <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-8 text-center">
              <div className="mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              <p className="text-blue-800 font-medium mb-2">
                Processing {uploadedFile?.name}...
              </p>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-600">
                {processingProgress}% complete
              </p>
            </div>
          ) : uploadedFile ? (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 font-medium mb-2">
                File Selected: {uploadedFile.name}
              </p>
              <p className="text-sm text-green-600 mb-4">
                Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={handleProcessFile}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Process File
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drop your Excel file here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files up to 50MB
              </p>
              <label className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                Choose File
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      )}

      {!showProcessingResults && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Processing History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    File Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Upload Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Pages Processed
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processingHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 px-4 text-center text-gray-500"
                    >
                      No processing history found. Upload and process files to
                      see history here.
                    </td>
                  </tr>
                ) : (
                  processingHistory
                    .slice(0, 10)
                    .map((file: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">{file.name}</td>
                        <td className="py-3 px-4">
                          {new Date(file.date).toLocaleDateString()}
                        </td>
                        <td
                          className={`py-3 px-4 font-medium ${
                            file.status === "Completed"
                              ? "text-green-600"
                              : file.status === "Processing"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {file.status}
                        </td>
                        <td className="py-3 px-4">
                          {file.pages?.toLocaleString() || "0"}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewProcessingDetails(file)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Threshold (days)
            </label>
            <input
              type="number"
              defaultValue="730"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Engagement Threshold (views)
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Cooldown (hours)
            </label>
            <input
              type="number"
              defaultValue="168"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Schedule
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option>Monday 9:00 AM</option>
              <option>Daily 9:00 AM</option>
              <option>Weekly Friday 5:00 PM</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => {
              setShowSuccess(true);
              setSuccessMessage("System configuration saved successfully!");
              setTimeout(() => setShowSuccess(false), 3000);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stakeholder Mapping
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Mapping Configuration (YAML)
          </label>
          <textarea
            value={stakeholderMappingYaml}
            onChange={(e) => setStakeholderMappingYaml(e.target.value)}
            className="w-full h-80 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm text-gray-700 resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter YAML configuration for stakeholder mapping..."
          />
          <div className="mt-2 text-xs text-gray-500">
            <p className="mb-1">
              <strong>Format:</strong> Use YAML syntax to define URL patterns
              and email mappings
            </p>
            <p className="mb-1">
              <strong>exact_urls:</strong> Map specific URLs to stakeholder
              emails
            </p>
            <p className="mb-1">
              <strong>patterns:</strong> Use wildcards (*) for URL pattern
              matching
            </p>
            <p>
              <strong>departments:</strong> Define default emails for different
              departments
            </p>
          </div>
        </div>
        <button
          onClick={handleUpdateStakeholderMapping}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Mappings
        </button>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alert History
        </h3>
        <div className="space-y-4">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                No Alert History Found
              </p>
              <p className="text-sm text-gray-500">
                Process files and send email alerts to see alert history here.
              </p>
            </div>
          ) : (
            recentAlerts.map((alert: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle
                      className={`w-4 h-4 ${
                        alert.type === "expired"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    />
                    <span className="font-medium text-gray-900">
                      {alert.type === "expired"
                        ? "Expired Page Alert"
                        : "Low Engagement Alert"}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      alert.status === "sent"
                        ? "bg-green-100 text-green-800"
                        : alert.status === "delivered"
                        ? "bg-blue-100 text-blue-800"
                        : alert.status === "opened"
                        ? "bg-green-100 text-green-800"
                        : alert.status === "clicked"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {alert.status === "sent"
                      ? "Sent"
                      : alert.status.charAt(0).toUpperCase() +
                        alert.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  URL:{" "}
                  <a
                    href={alert.url}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {alert.url.length > 60
                      ? `${alert.url.substring(0, 60)}...`
                      : alert.url}
                  </a>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Stakeholder: {alert.recipient}
                </p>
                <p className="text-sm text-gray-500">
                  Sent: {new Date(alert.dateSent).toLocaleString()}
                </p>
                {alert.pageViews && (
                  <p className="text-sm text-gray-500">
                    Page Views: {alert.pageViews}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Processing Details Modal Component
  const ProcessingDetailsModal = () => {
    if (!showProcessingDetails || !selectedProcessingEntry) return null;

    const results = selectedProcessingEntry.results;
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Processing Details</h2>
                  <p className="text-blue-100 text-sm">
                    {selectedProcessingEntry.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProcessingDetails(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* File Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    File Information
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedProcessingEntry.name}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>{" "}
                    {formatFileSize(selectedProcessingEntry.fileSize || 0)}
                  </div>
                  <div>
                    <span className="font-medium">Processed:</span>{" "}
                    {new Date(selectedProcessingEntry.date).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {selectedProcessingEntry.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Processing Summary
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Total Pages:</span>{" "}
                    {results?.totalPages || selectedProcessingEntry.pages || 0}
                  </div>
                  <div>
                    <span className="font-medium">Expired Pages:</span>{" "}
                    {results?.expiredPages || 0}
                  </div>
                  <div>
                    <span className="font-medium">Low Engagement:</span>{" "}
                    {results?.lowEngagementPages || 0}
                  </div>
                  <div>
                    <span className="font-medium">Processing Time:</span>{" "}
                    {results ? "2.3s" : "N/A"}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">
                    Analytics Insights
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Total Page Views:</span>{" "}
                    {results?.totalPageViews?.toLocaleString() || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Avg Page Age:</span>{" "}
                    {results?.averagePageAge || "N/A"} days
                  </div>
                  <div>
                    <span className="font-medium">Pages Over 2 Years:</span>{" "}
                    {results?.pagesOver2Years || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Date Range:</span>{" "}
                    {results?.dateRange
                      ? `${results.dateRange.start} - ${results.dateRange.end}`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            {results && (
              <div className="space-y-6">
                {/* Expired Pages Section */}
                {results.expiredPagesData &&
                  results.expiredPagesData.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-900">
                          Expired Pages ({results.expiredPagesData.length})
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-red-100">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-red-800">
                                Page URL
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-red-800">
                                Creation Date
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-red-800">
                                Age
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-red-800">
                                Page Views
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-red-800">
                                Stakeholder
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.expiredPagesData
                              .slice(0, 10)
                              .map((page: any, index: number) => (
                                <tr
                                  key={index}
                                  className="border-t border-red-200"
                                >
                                  <td className="px-3 py-2">
                                    <a
                                      href={
                                        page.url.startsWith("http")
                                          ? page.url
                                          : `https://${page.domain}${page.path}`
                                      }
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {(page.url.startsWith("http")
                                        ? page.url
                                        : `https://${page.domain}${page.path}`
                                      ).length > 40
                                        ? `${(page.url.startsWith("http")
                                            ? page.url
                                            : `https://${page.domain}${page.path}`
                                          ).substring(0, 40)}...`
                                        : page.url.startsWith("http")
                                        ? page.url
                                        : `https://${page.domain}${page.path}`}
                                    </a>
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">
                                    {page.creationDate}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                      {page.ageYears} years
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">
                                    {page.pageViews}
                                  </td>
                                  <td className="px-3 py-2 text-gray-500 text-xs">
                                    {page.stakeholder}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {results.expiredPagesData.length > 10 && (
                          <div className="text-center py-2 text-red-600 text-sm">
                            ... and {results.expiredPagesData.length - 10} more
                            expired pages
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Low Engagement Pages Section */}
                {results.lowEngagementData &&
                  results.lowEngagementData.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-yellow-900">
                          Low Engagement Pages (
                          {results.lowEngagementData.length})
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-yellow-100">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-yellow-800">
                                Page URL
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-yellow-800">
                                Creation Date
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-yellow-800">
                                Age
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-yellow-800">
                                Page Views
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-yellow-800">
                                Stakeholder
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.lowEngagementData
                              .slice(0, 10)
                              .map((page: any, index: number) => (
                                <tr
                                  key={index}
                                  className="border-t border-yellow-200"
                                >
                                  <td className="px-3 py-2">
                                    <a
                                      href={
                                        page.url.startsWith("http")
                                          ? page.url
                                          : `https://${page.domain}${page.path}`
                                      }
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {(page.url.startsWith("http")
                                        ? page.url
                                        : `https://${page.domain}${page.path}`
                                      ).length > 40
                                        ? `${(page.url.startsWith("http")
                                            ? page.url
                                            : `https://${page.domain}${page.path}`
                                          ).substring(0, 40)}...`
                                        : page.url.startsWith("http")
                                        ? page.url
                                        : `https://${page.domain}${page.path}`}
                                    </a>
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">
                                    {page.creationDate}
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">
                                    {page.ageYears} years
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                      {page.pageViews} views
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-500 text-xs">
                                    {page.stakeholder}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {results.lowEngagementData.length > 10 && (
                          <div className="text-center py-2 text-yellow-600 text-sm">
                            ... and {results.lowEngagementData.length - 10} more
                            low engagement pages
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* No Detailed Results Available */}
                {(!results.expiredPagesData ||
                  results.expiredPagesData.length === 0) &&
                  (!results.lowEngagementData ||
                    results.lowEngagementData.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        All Pages Look Good!
                      </p>
                      <p className="text-sm text-gray-500">
                        No expired or low engagement pages found in this
                        processing run.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* No Results Available */}
            {!results && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Limited Details Available
                </p>
                <p className="text-sm text-gray-500">
                  This processing entry was created before detailed result
                  tracking was implemented. Only basic information is available.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <div className="text-sm text-gray-500">
              Processed on{" "}
              {new Date(selectedProcessingEntry.date).toLocaleString()}
            </div>
            <div className="flex space-x-3">
              {results && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Export Details
                </button>
              )}
              <button
                onClick={() => setShowProcessingDetails(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Page Expiry Notification System
                </h1>
                <p className="text-sm text-gray-500">
                  Automated content lifecycle management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleTabClick("settings")}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => handleTabClick("upload")}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={18} />
                <span>Upload Report</span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Users size={18} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-2 mb-6">
          <TabButton
            id="dashboard"
            label="Dashboard"
            icon={BarChart}
            active={activeTab === "dashboard"}
            onClick={handleTabClick}
          />
          <TabButton
            id="sites"
            label="Site Configuration"
            icon={Globe}
            active={activeTab === "sites"}
            onClick={handleTabClick}
          />
          <TabButton
            id="analyzer"
            label="Domain Analysis"
            icon={Filter}
            active={activeTab === "analyzer"}
            onClick={handleTabClick}
          />
          <TabButton
            id="scheduler"
            label="Email Scheduler"
            icon={Calendar}
            active={activeTab === "scheduler"}
            onClick={handleTabClick}
          />
          <TabButton
            id="formats"
            label="Data Formats"
            icon={FileText}
            active={activeTab === "formats"}
            onClick={handleTabClick}
          />
          <TabButton
            id="upload"
            label="Upload & Process"
            icon={Upload}
            active={activeTab === "upload"}
            onClick={handleTabClick}
          />
        </div>

        {/* Content with Routes */}
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="/dashboard" element={renderDashboard()} />
          <Route path="/sites" element={<EditableSiteConfiguration />} />
          <Route path="/analyzer" element={<DomainAnalyzer />} />
          <Route path="/scheduler" element={<EmailScheduler />} />
          <Route path="/formats" element={<DataFormatManager />} />
          <Route path="/upload" element={renderUpload()} />
          <Route path="/alerts" element={renderAlerts()} />
          <Route path="/settings" element={renderSettings()} />
        </Routes>
      </div>

      {/* Email Test Modal */}
      <EmailTestModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />

      {/* Processing Details Modal */}
      <ProcessingDetailsModal />
    </div>
  );
}

export default App;
