import * as XLSX from "xlsx";
import {
  DatabaseService,
  SiteConfiguration,
  StakeholderMapping,
} from "./database";

export interface PageData {
  url: string;
  title?: string;
  createdDate: string;
  updatedDate?: string;
  pageViews: number;
  domain: string;
  path: string;
  ageInDays: number;
  ageInYears: number;
  isExpired: boolean;
  isLowEngagement: boolean;
  stakeholder?: string;
}

export interface ProcessingResults {
  fileName: string;
  uploadDate: string;
  totalPages: number;
  expiredPages: number;
  lowEngagementPages: number;
  totalPageViews: number;
  dateRange: {
    start: string;
    end: string;
  };
  averagePageAge: number;
  averagePageViews: number;
  pagesOver2Years: number;
  expiredPagesData: PageData[];
  lowEngagementData: PageData[];
  allPagesData: PageData[];
}

export class FileProcessor {
  private static parseDate(dateValue: any): string {
    if (!dateValue) return new Date().toISOString().split("T")[0];

    // Handle Excel date serial numbers
    if (typeof dateValue === "number") {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(
        excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000
      );
      return date.toISOString().split("T")[0];
    }

    // Handle string dates
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }

    // Handle Date objects
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0];
    }

    return new Date().toISOString().split("T")[0];
  }

  private static extractDomainAndPath(url: string): {
    domain: string;
    path: string;
  } {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return {
        domain: urlObj.hostname,
        path: urlObj.pathname,
      };
    } catch {
      // Fallback for malformed URLs
      const parts = url.split("/");
      return {
        domain: parts[0] || url,
        path: "/" + parts.slice(1).join("/"),
      };
    }
  }

  private static calculateAge(createdDate: string): {
    ageInDays: number;
    ageInYears: number;
  } {
    const created = new Date(createdDate);
    const now = new Date();
    const ageInMs = now.getTime() - created.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    const ageInYears = Math.round((ageInDays / 365.25) * 10) / 10;

    return { ageInDays, ageInYears };
  }

  private static async findStakeholder(
    domain: string,
    path: string
  ): Promise<string> {
    try {
      // Get site configuration for the domain
      const sites = await DatabaseService.getSiteConfigurations();
      const site = sites.find(
        (s) =>
          domain.includes(s.domain.replace("www.", "")) ||
          s.domain.includes(domain)
      );

      if (!site) {
        return "corporate-web@thomsonreuters.com"; // Default fallback
      }

      // Get stakeholder mappings for this site
      const mappings = await DatabaseService.getStakeholderMappings(site.id);

      // Sort by priority (higher priority first)
      const sortedMappings = mappings.sort((a, b) => b.priority - a.priority);

      // Find matching stakeholder
      for (const mapping of sortedMappings) {
        if (mapping.type === "exact" && mapping.pattern === path) {
          return mapping.email;
        } else if (mapping.type === "pattern") {
          // Simple pattern matching (supports wildcards)
          const pattern = mapping.pattern.replace(/\*/g, ".*");
          const regex = new RegExp(`^${pattern}$`);
          if (regex.test(path)) {
            return mapping.email;
          }
        }
      }

      // Return default stakeholder if no mapping found
      return site.default_stakeholder;
    } catch (error) {
      console.error("Error finding stakeholder:", error);
      return "webmaster@thomsonreuters.com";
    }
  }

  static async processFile(file: File): Promise<ProcessingResults> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            throw new Error(
              "File must contain at least a header row and one data row"
            );
          }

          // Get headers and normalize them
          const headers = (jsonData[0] as string[]).map((h) =>
            h?.toString().toLowerCase().trim()
          );

          // Find column indices
          const urlIndex = headers.findIndex(
            (h) => h.includes("url") || h.includes("page")
          );
          const titleIndex = headers.findIndex(
            (h) => h.includes("title") || h.includes("name")
          );
          const createdIndex = headers.findIndex(
            (h) => h.includes("created") || h.includes("date")
          );
          const updatedIndex = headers.findIndex(
            (h) => h.includes("updated") || h.includes("modified")
          );
          const viewsIndex = headers.findIndex(
            (h) =>
              h.includes("view") || h.includes("traffic") || h.includes("visit")
          );

          if (urlIndex === -1) {
            throw new Error(
              'Could not find URL column. Please ensure your file has a column containing "URL" or "Page"'
            );
          }

          // Process data rows
          const pages: PageData[] = [];
          const dataRows = jsonData.slice(1) as any[][];

          // Get site configurations for expiry thresholds
          const sites = await DatabaseService.getSiteConfigurations();

          for (const row of dataRows) {
            if (!row[urlIndex]) continue; // Skip empty URLs

            const url = row[urlIndex].toString().trim();
            const { domain, path } = this.extractDomainAndPath(url);

            // Find site configuration for this domain
            const site = sites.find(
              (s) =>
                domain.includes(s.domain.replace("www.", "")) ||
                s.domain.includes(domain)
            );

            const expiryDays = site?.expiry_days || 730; // Default 2 years
            const engagementThreshold = site?.engagement_threshold || 5;

            const createdDate = this.parseDate(
              createdIndex >= 0 ? row[createdIndex] : null
            );
            const updatedDate = this.parseDate(
              updatedIndex >= 0 ? row[updatedIndex] : null
            );
            const pageViews =
              viewsIndex >= 0 ? parseInt(row[viewsIndex]) || 0 : 0;

            const { ageInDays, ageInYears } = this.calculateAge(createdDate);

            const isExpired = ageInDays > expiryDays;
            const isLowEngagement =
              pageViews < engagementThreshold && ageInDays > 30; // Only flag low engagement for pages older than 30 days

            // Find stakeholder for this page
            const stakeholder = await this.findStakeholder(domain, path);

            const pageData: PageData = {
              url,
              title: titleIndex >= 0 ? row[titleIndex]?.toString() : undefined,
              createdDate,
              updatedDate,
              pageViews,
              domain,
              path,
              ageInDays,
              ageInYears,
              isExpired,
              isLowEngagement,
              stakeholder,
            };

            pages.push(pageData);
          }

          // Calculate statistics
          const expiredPages = pages.filter((p) => p.isExpired);
          const lowEngagementPages = pages.filter(
            (p) => p.isLowEngagement && !p.isExpired
          ); // Don't double-count expired pages
          const totalPageViews = pages.reduce((sum, p) => sum + p.pageViews, 0);
          const averagePageViews =
            Math.round((totalPageViews / pages.length) * 10) / 10;
          const averagePageAge =
            Math.round(
              (pages.reduce((sum, p) => sum + p.ageInDays, 0) / pages.length) *
                10
            ) / 10;
          const pagesOver2Years = pages.filter((p) => p.ageInYears >= 2).length;

          // Find date range
          const dates = pages
            .map((p) => new Date(p.createdDate))
            .sort((a, b) => a.getTime() - b.getTime());
          const dateRange = {
            start:
              dates[0]?.toISOString().split("T")[0] ||
              new Date().toISOString().split("T")[0],
            end:
              dates[dates.length - 1]?.toISOString().split("T")[0] ||
              new Date().toISOString().split("T")[0],
          };

          const results: ProcessingResults = {
            fileName: file.name,
            uploadDate: new Date().toISOString().split("T")[0],
            totalPages: pages.length,
            expiredPages: expiredPages.length,
            lowEngagementPages: lowEngagementPages.length,
            totalPageViews,
            dateRange,
            averagePageAge,
            averagePageViews,
            pagesOver2Years,
            expiredPagesData: expiredPages,
            lowEngagementData: lowEngagementPages,
            allPagesData: pages,
          };

          resolve(results);
        } catch (error) {
          reject(
            new Error(
              `Failed to process file: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  static async sendEmailAlerts(
    pages: PageData[]
  ): Promise<{ sent: number; failed: number; results: any[] }> {
    const { EmailService } = await import("./emailService");

    let sent = 0;
    let failed = 0;
    const results = [];

    for (const page of pages) {
      try {
        const result = await EmailService.sendExpiryAlert(
          page.stakeholder || "webmaster@thomsonreuters.com",
          {
            url: page.url,
            title: page.title,
            createdDate: page.createdDate,
            updatedDate: page.updatedDate,
            pageViews: page.pageViews,
          }
        );

        if (result.success) {
          sent++;
          results.push({
            page: page.url,
            status: "sent",
            message: result.message,
          });

          // Log to database
          await DatabaseService.sendEmailNotification(
            page.stakeholder || "webmaster@thomsonreuters.com",
            `🚨 Action Required: Expired Page Review - ${
              page.title || page.url
            }`,
            `Expired page alert for ${page.url}`
          );
        } else {
          failed++;
          results.push({
            page: page.url,
            status: "failed",
            message: "Unknown error",
          });
        }
      } catch (error) {
        failed++;
        results.push({
          page: page.url,
          status: "failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Add small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return { sent, failed, results };
  }
}
