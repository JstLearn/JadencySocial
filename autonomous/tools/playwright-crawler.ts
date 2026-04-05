import { chromium, Browser, Page } from 'playwright';

// ============================================
// TYPES
// ============================================

export interface WebsiteAudit {
  url: string;
  exists: boolean;
  sslValid: boolean;
  title?: string;
  metaDescription?: string;
  ogTags: OgTags;
  h1s: string[];
  imagesCount: number;
  linksCount: number;
  hasContactPage: boolean;
  hasMobileFriendlyIndicators: boolean;
  socialMediaLinks: SocialMediaLinks;
  emailAddresses: string[];
  phoneNumbers: string[];
  technologies: string[];
  auditTimestamp: string;
  error?: string;
}

export interface OgTags {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  ogSiteName?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// ============================================
// REGEX PATTERNS
// ============================================

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(?:\+90|0)[-\s]?(?:[0-9]{2}[-\s]?)?[0-9]{3}[-\s]?[0-9]{4}|[0-9]{10,11}/g;

const SOCIAL_MEDIA_PATTERNS = {
  facebook: /facebook\.com\/[a-zA-Z0-9._-]+/gi,
  instagram: /(?:instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+/gi,
  twitter: /twitter\.com\/[a-zA-Z0-9._-]+/gi,
  linkedin: /linkedin\.com\/in\/[a-zA-Z0-9._-]+/gi,
  youtube: /youtube\.com\/@?[a-zA-Z0-9._-]+/gi,
};

// Common technologies detected from HTML/source
const TECHNOLOGY_PATTERNS = {
  'WordPress': /wp-content|wp-includes|WordPress/i,
  'Shopify': /cdn\.shopify\.com|shopify/i,
  'React': /react|react-dom|_react_/i,
  'Vue': /vue|vue\.js/i,
  'Angular': /angular|ng-component/i,
  'Bootstrap': /bootstrap@[0-9.]+|bootstrap[\s.-][0-9.]+/i,
  'Tailwind': /tailwindcss|tailwind/i,
  'jQuery': /jquery[\s.-][0-9.]+|jquery@/i,
  'Google Analytics': /google-analytics\.com|gtag|ga\(['"]/i,
  'Cloudflare': /cloudflare|Turnstile|_cf|_cf_attribution/i,
  'Font Awesome': /fontawesome|fa-[a-z-]+/i,
};

// ============================================
// WEBSITE AUDITOR CLASS
// ============================================

export class WebsiteAuditor {
  private browser: Browser | null = null;
  private timeout: number;

  constructor(timeout: number = 30000) {
    this.timeout = timeout;
  }

  /**
   * Initialize browser instance
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Audit a website
   */
  async audit(url: string): Promise<WebsiteAudit> {
    await this.initialize();

    const baseAudit: WebsiteAudit = {
      url,
      exists: false,
      sslValid: false,
      ogTags: {},
      h1s: [],
      imagesCount: 0,
      linksCount: 0,
      hasContactPage: false,
      hasMobileFriendlyIndicators: false,
      socialMediaLinks: {},
      emailAddresses: [],
      phoneNumbers: [],
      technologies: [],
      auditTimestamp: new Date().toISOString(),
    };

    try {
      // Normalize URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Check if website exists and get basic info
      const { exists, sslValid } = await this.checkWebsite(normalizedUrl);

      if (!exists) {
        return { ...baseAudit, exists: false, error: 'Website does not exist or is not reachable' };
      }

      // Launch page and extract info
      const context = await this.browser!.newContext({
        userAgent: 'Mozilla/5.0 (compatible; ScoutBot/1.0)',
      });
      const page = await context.newPage();

      try {
        await page.goto(normalizedUrl, {
          waitUntil: 'domcontentloaded',
          timeout: this.timeout,
        });

        // Extract all data in parallel for speed
        const [
          title,
          metaDescription,
          ogTags,
          h1s,
          imagesCount,
          linksCount,
          pageContent,
          hasContactPage,
        ] = await Promise.all([
          this.extractTitle(page),
          this.extractMetaDescription(page),
          this.extractOgTags(page),
          this.extractH1s(page),
          this.countImages(page),
          this.countLinks(page),
          page.content(),
          this.checkContactPage(page, normalizedUrl),
        ]);

        // Extract emails, phones, social from content
        const emailAddresses = this.extractEmails(pageContent);
        const phoneNumbers = this.extractPhones(pageContent);
        const socialMediaLinks = this.extractSocialMedia(pageContent);
        const technologies = this.detectTechnologies(pageContent);

        // Check mobile friendliness indicators
        const hasMobileFriendlyIndicators = await this.checkMobileFriendly(page);

        return {
          ...baseAudit,
          exists: true,
          sslValid,
          title,
          metaDescription,
          ogTags,
          h1s,
          imagesCount,
          linksCount,
          hasContactPage,
          hasMobileFriendlyIndicators,
          socialMediaLinks,
          emailAddresses,
          phoneNumbers,
          technologies,
        };
      } finally {
        await page.close();
        await context.close();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { ...baseAudit, error: errorMessage };
    }
  }

  /**
   * Check if website exists
   */
  private async checkWebsite(url: string): Promise<{ exists: boolean; sslValid: boolean }> {
    const isHttps = url.startsWith('https://');
    const sslValid = isHttps;

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
      });
      return { exists: response.ok || response.status === 301 || response.status === 302, sslValid };
    } catch {
      return { exists: false, sslValid: false };
    }
  }

  /**
   * Extract page title
   */
  private async extractTitle(page: Page): Promise<string | undefined> {
    try {
      return await page.title();
    } catch {
      return undefined;
    }
  }

  /**
   * Extract meta description
   */
  private async extractMetaDescription(page: Page): Promise<string | undefined> {
    try {
      const description = await page.getAttribute('meta[name="description"]', 'content');
      return description || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Extract Open Graph tags
   */
  private async extractOgTags(page: Page): Promise<OgTags> {
    const ogTags: OgTags = {};

    try {
      const ogSelectors = {
        ogTitle: 'meta[property="og:title"]',
        ogDescription: 'meta[property="og:description"]',
        ogImage: 'meta[property="og:image"]',
        ogType: 'meta[property="og:type"]',
        ogUrl: 'meta[property="og:url"]',
        ogSiteName: 'meta[property="og:site_name"]',
      };

      for (const [key, selector] of Object.entries(ogSelectors)) {
        const content = await page.getAttribute(selector, 'content');
        if (content) {
          (ogTags as Record<string, string | undefined>)[key] = content;
        }
      }
    } catch {
      // Ignore errors
    }

    return ogTags;
  }

  /**
   * Extract all H1 tags
   */
  private async extractH1s(page: Page): Promise<string[]> {
    try {
      return await page.locator('h1').allTextContents();
    } catch {
      return [];
    }
  }

  /**
   * Count images on page
   */
  private async countImages(page: Page): Promise<number> {
    try {
      return await page.locator('img').count();
    } catch {
      return 0;
    }
  }

  /**
   * Count links on page
   */
  private async countLinks(page: Page): Promise<number> {
    try {
      return await page.locator('a[href]').count();
    } catch {
      return 0;
    }
  }

  /**
   * Check if contact page exists
   */
  private async checkContactPage(page: Page, baseUrl: string): Promise<boolean> {
    const contactPaths = ['/contact', '/contact-us', '/iletisim', '/contact.html', '/contact.php'];

    try {
      for (const path of contactPaths) {
        const contactUrl = new URL(path, baseUrl).href;
        const response = await page.request.head(contactUrl);
        if (response.ok()) {
          return true;
        }
      }
    } catch {
      // Ignore errors
    }

    return false;
  }

  /**
   * Check mobile friendly indicators
   */
  private async checkMobileFriendly(page: Page): Promise<boolean> {
    try {
      const viewport = page.viewportSize();
      if (viewport && (viewport.width < 768 || viewport.height < 768)) {
        return true;
      }

      // Check for mobile stylesheet
      const hasMobileMeta = await page.locator('meta[name="viewport"]').count();
      const hasResponsiveMeta = await page.locator('meta[name="viewport"][content*="width"]').count();

      return hasMobileMeta > 0 || hasResponsiveMeta > 0;
    } catch {
      return false;
    }
  }

  /**
   * Extract email addresses from HTML content
   */
  private extractEmails(content: string): string[] {
    const matches = content.match(EMAIL_PATTERN);
    if (!matches) return [];
    return [...new Set(matches)].filter(e => !e.includes('example.com'));
  }

  /**
   * Extract phone numbers from HTML content
   */
  private extractPhones(content: string): string[] {
    const matches = content.match(PHONE_PATTERN);
    if (!matches) return [];
    return [...new Set(matches)];
  }

  /**
   * Extract social media links from HTML content
   */
  private extractSocialMedia(content: string): SocialMediaLinks {
    const links: SocialMediaLinks = {};

    for (const [platform, pattern] of Object.entries(SOCIAL_MEDIA_PATTERNS)) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        const url = matches[0].startsWith('http') ? matches[0] : `https://${matches[0]}`;
        (links as Record<string, string | undefined>)[platform] = url;
      }
    }

    return links;
  }

  /**
   * Detect technologies from HTML content
   */
  private detectTechnologies(content: string): string[] {
    const detected: string[] = [];

    for (const [tech, pattern] of Object.entries(TECHNOLOGY_PATTERNS)) {
      if (pattern.test(content)) {
        detected.push(tech);
      }
    }

    return detected;
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export async function createWebsiteAuditor(timeout?: number): Promise<WebsiteAuditor> {
  const auditor = new WebsiteAuditor(timeout);
  await auditor.initialize();
  return auditor;
}

// ============================================
// QUICK AUDIT FUNCTION
// ============================================

export async function quickAudit(url: string): Promise<WebsiteAudit> {
  const auditor = new WebsiteAuditor();
  try {
    return await auditor.audit(url);
  } finally {
    await auditor.close();
  }
}

// ============================================
// EXTENDED SEO AUDIT
// ============================================

export interface SEOAuditResult {
  url: string;
  score: number; // 0-25
  issues: string[];
  title: string | null;
  metaDescription: string | null;
  ogTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    ogUrl: string | null;
  };
  h1s: string[];
  hasSSL: boolean;
  schemaMarkup: string[];
  details: {
    canonicalUrl: string | null;
    viewportMeta: string | null;
    robotsMeta: string | null;
    hasSvg: boolean;
  };
}

export interface ContentAnalysisResult {
  url: string;
  score: number; // 0-25
  blogPosts: number;
  lastUpdate: Date | null;
  hasRecentUpdates: boolean;
  pageCount: number;
  textContentLength: number;
  imagesCount: number;
  linksCount: number;
  contentIssues: string[];
}

export interface PerformanceAnalysisResult {
  url: string;
  loadTime: 'fast' | 'medium' | 'slow';
  loadTimeMs: number;
  pageSize: number;
  resourceCount: number;
  issues: string[];
  recommendations: string[];
}

export interface FullCrawlResult {
  url: string;
  websiteScore: number;
  seoScore: number;
  contentScore: number;
  seoDetails: SEOAuditResult;
  contentDetails: ContentAnalysisResult;
  performanceDetails: PerformanceAnalysisResult;
  mobileFriendly: boolean;
  contactInfo: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasAddress: boolean;
  };
  socialLinks: SocialMediaLinks;
  recommendations: string[];
  priorityIssues: string[];
}

/**
 * Extended website analysis with SEO, content, and performance scoring
 */
export async function analyzeWebsite(url: string): Promise<FullCrawlResult> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  const auditor = new WebsiteAuditor();
  let websiteAudit: WebsiteAudit;

  try {
    websiteAudit = await auditor.audit(normalizedUrl);
  } finally {
    await auditor.close();
  }

  // Calculate Website Score (0-25)
  let websiteScore = 0;
  const websiteIssues: string[] = [];

  if (!websiteAudit.exists) {
    websiteScore = 0;
    websiteIssues.push('Web sitesi yok');
  } else {
    websiteScore = 10; // Base score for existing site
    if (websiteAudit.sslValid) websiteScore += 5;
    if (websiteAudit.hasMobileFriendlyIndicators) websiteScore += 5;
    if (websiteAudit.phoneNumbers.length > 0 || websiteAudit.emailAddresses.length > 0) websiteScore += 5;
    if (websiteScore > 25) websiteScore = 25;
  }

  // Calculate SEO Score (0-25)
  const seoResult = calculateSEOScore(websiteAudit);
  const seoDetails: SEOAuditResult = {
    url: normalizedUrl,
    score: seoResult.score,
    issues: seoResult.issues,
    title: websiteAudit.title || null,
    metaDescription: websiteAudit.metaDescription || null,
    ogTags: {
      ogTitle: websiteAudit.ogTags.ogTitle || null,
      ogDescription: websiteAudit.ogTags.ogDescription || null,
      ogImage: websiteAudit.ogTags.ogImage || null,
      ogUrl: websiteAudit.ogTags.ogUrl || null,
    },
    h1s: websiteAudit.h1s,
    hasSSL: websiteAudit.sslValid,
    schemaMarkup: [],
    details: {
      canonicalUrl: null,
      viewportMeta: null,
      robotsMeta: null,
      hasSvg: false,
    },
  };

  // Calculate Content Score (0-25)
  const contentResult = calculateContentScore(websiteAudit);
  const contentDetails: ContentAnalysisResult = {
    url: normalizedUrl,
    score: contentResult.score,
    blogPosts: contentResult.blogPosts,
    lastUpdate: contentResult.lastUpdate,
    hasRecentUpdates: contentResult.hasRecentUpdates,
    pageCount: websiteAudit.linksCount,
    textContentLength: websiteAudit.linksCount * 100,
    imagesCount: websiteAudit.imagesCount,
    linksCount: websiteAudit.linksCount,
    contentIssues: contentResult.issues,
  };

  // Performance Analysis
  const performanceDetails: PerformanceAnalysisResult = {
    url: normalizedUrl,
    loadTime: 'medium',
    loadTimeMs: 0,
    pageSize: 0,
    resourceCount: 0,
    issues: [],
    recommendations: [],
  };

  // Build recommendations
  const recommendations: string[] = [];
  const priorityIssues: string[] = [];

  if (seoResult.issues.includes('Title tag yok')) {
    recommendations.push('Title tag ekle - SEO için kritik');
    priorityIssues.push('Title tag eksik');
  }
  if (seoResult.issues.includes('Meta description yok')) {
    recommendations.push('Meta description ekle');
    priorityIssues.push('Meta description eksik');
  }
  if (seoResult.issues.includes('OG tagları eksik')) {
    recommendations.push('Open Graph tagları ekle (sosyal paylaşım için)');
  }
  if (seoResult.issues.includes('H1 tag yok')) {
    recommendations.push('H1 başlık etiketi ekle');
  }
  if (seoResult.issues.includes('SSL yok')) {
    recommendations.push('HTTPS sertifikası al (güvenlik ve SEO için zorunlu)');
    priorityIssues.push('SSL sertifikası yok');
  }
  if (!websiteAudit.hasMobileFriendlyIndicators) {
    recommendations.push('Mobil uyumlu tasarım yap');
  }
  if (!websiteAudit.hasContactPage) {
    recommendations.push('İletişim sayfası oluştur');
  }

  return {
    url: normalizedUrl,
    websiteScore,
    seoScore: seoResult.score,
    contentScore: contentResult.score,
    seoDetails,
    contentDetails,
    performanceDetails,
    mobileFriendly: websiteAudit.hasMobileFriendlyIndicators,
    contactInfo: {
      hasPhone: websiteAudit.phoneNumbers.length > 0,
      hasEmail: websiteAudit.emailAddresses.length > 0,
      hasAddress: false,
    },
    socialLinks: websiteAudit.socialMediaLinks,
    recommendations,
    priorityIssues,
  };
}

function calculateSEOScore(audit: WebsiteAudit): { score: number; issues: string[] } {
  let score = 25;
  const issues: string[] = [];

  if (!audit.title) {
    score -= 10;
    issues.push('Title tag yok');
  }

  if (!audit.metaDescription) {
    score -= 5;
    issues.push('Meta description yok');
  }

  const hasOgTags = audit.ogTags.ogTitle && audit.ogTags.ogDescription;
  if (!hasOgTags) {
    score -= 5;
    issues.push('OG tagları eksik');
  }

  if (audit.h1s.length === 0) {
    score -= 5;
    issues.push('H1 tag yok');
  }

  if (!audit.sslValid) {
    score -= 5;
    issues.push('SSL yok');
  }

  return { score: Math.max(0, score), issues };
}

function calculateContentScore(audit: WebsiteAudit): {
  score: number;
  issues: string[];
  blogPosts: number;
  lastUpdate: Date | null;
  hasRecentUpdates: boolean;
} {
  let score = 0;
  const issues: string[] = [];

  const hasContent = audit.linksCount > 5 && audit.imagesCount > 2;

  if (!hasContent) {
    issues.push('Web sitesinde içerik yok veya yetersiz');
  } else {
    score = 10;
    if (audit.linksCount > 20) score += 5;
    if (audit.imagesCount > 10) score += 5;
  }

  const hasRecentUpdates = audit.technologies.some(t =>
    ['WordPress', 'Shopify', 'React'].includes(t)
  );

  if (hasRecentUpdates) score += 5;

  return {
    score: Math.min(25, score),
    issues,
    blogPosts: 0,
    lastUpdate: null,
    hasRecentUpdates,
  };
}

// ============================================
// EXPORTS
// ============================================

export default WebsiteAuditor;
