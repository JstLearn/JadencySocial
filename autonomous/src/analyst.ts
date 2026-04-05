import 'dotenv/config';
import path from 'path';
import axios from 'axios';
import Database from 'better-sqlite3';
import { analyzeWebsite, WebsiteAuditor } from '../tools/playwright-crawler';
import { checkSocialMedia, SocialCheckResult } from '../tools/social-checker';
import { checkGoogleReviews, GoogleReviewsResult } from '../tools/google-reviews';

// ============================================
// TYPES
// ============================================

export interface Lead {
  id: number;
  business_name: string;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  google_place_id: string | null;
  google_maps_url: string | null;
  instagram_handle: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  business_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  platform: 'instagram' | 'facebook' | 'linkedin';
  handle: string | null;
  followers: number;
  found: boolean;
}

export interface LeadAnalysis {
  leadId: number;
  businessName: string;
  website: string | null;
  scores: {
    website: number;
    seo: number;
    social: number;
    content: number;
    review: number;
    total: number;
  };
  details: {
    websiteIssues: string[];
    seoIssues: string[];
    socialAccounts: SocialAccount[];
    contentInfo: {
      blogPosts: number;
      lastUpdate: Date | null;
      hasRecentUpdates: boolean;
    };
    reviewInfo: {
      rating: number;
      reviewCount: number;
      recentReviews: string[];
    };
  };
  recommendations: Recommendation[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  analyzedAt: Date;
}

export interface Recommendation {
  category: 'website' | 'seo' | 'social' | 'content' | 'reviews';
  priority: 1 | 2 | 3;
  action: string;
  impact: 'high' | 'medium' | 'low';
}

// ============================================
// DATABASE
// ============================================

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'autonomous', 'db', 'jadency.db');

function getDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

function getUnanalyzedLeads(db: Database.Database, limit: number = 10): Lead[] {
  const stmt = db.prepare(`
    SELECT l.* FROM leads l
    LEFT JOIN analysis a ON l.id = a.lead_id
    WHERE a.id IS NULL AND l.website IS NOT NULL AND l.website != ''
    ORDER BY l.created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as Lead[];
}

function getLeadById(db: Database.Database, leadId: number): Lead | undefined {
  const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
  return stmt.get(leadId) as Lead | undefined;
}

function saveAnalysis(db: Database.Database, analysis: LeadAnalysis): void {
  const stmt = db.prepare(`
    INSERT INTO analysis (
      lead_id, website_score, seo_score, social_score, content_score,
      review_score, overall_score, website_checked, website_issues,
      social_accounts_found, competitors_found, recommendations, analyzed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    analysis.leadId,
    analysis.scores.website,
    analysis.scores.seo,
    analysis.scores.social,
    analysis.scores.content,
    analysis.scores.review,
    analysis.scores.total,
    JSON.stringify(analysis.details.websiteIssues),
    JSON.stringify(analysis.details.socialAccounts),
    JSON.stringify([]), // competitors
    JSON.stringify(analysis.recommendations),
    analysis.analyzedAt.toISOString()
  );
}

function logActivity(db: Database.Database, entityType: string, entityId: number, action: string, details?: string): void {
  const stmt = db.prepare(`
    INSERT INTO activity_log (entity_type, entity_id, action, details)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(entityType, entityId, action, details || null);
}

// ============================================
// ANALYSIS ENGINE
// ============================================

async function analyzeWebsiteScore(website: string | null): Promise<{
  score: number;
  issues: string[];
}> {
  if (!website) {
    return { score: 0, issues: ['Web sitesi yok'] };
  }

  try {
    const result = await analyzeWebsite(website);
    return {
      score: result.websiteScore,
      issues: result.priorityIssues,
    };
  } catch (error) {
    console.error(`[Analyst] Website analysis failed for ${website}:`, error);
    return { score: 0, issues: [`Web sitesi analiz hatası: ${error instanceof Error ? error.message : 'Unknown'}`] };
  }
}

async function analyzeSEOScore(website: string | null): Promise<{
  score: number;
  issues: string[];
}> {
  if (!website) {
    return { score: 0, issues: ['Web sitesi yok'] };
  }

  try {
    const auditor = new WebsiteAuditor();
    const audit = await auditor.audit(website);
    await auditor.close();

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
    if (!audit.ogTags.ogTitle || !audit.ogTags.ogDescription) {
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
  } catch (error) {
    console.error(`[Analyst] SEO analysis failed for ${website}:`, error);
    return { score: 0, issues: [`SEO analiz hatası: ${error instanceof Error ? error.message : 'Unknown'}`] };
  }
}

async function analyzeSocialScore(
  businessName: string,
  website: string | null,
  existingInstagram?: string | null,
  existingFacebook?: string | null,
  existingLinkedin?: string | null
): Promise<{
  score: number;
  accounts: SocialAccount[];
}> {
  try {
    const result: SocialCheckResult = await checkSocialMedia(
      businessName,
      website || undefined,
      existingInstagram || undefined,
      existingFacebook || undefined,
      existingLinkedin || undefined
    );

    const accounts: SocialAccount[] = result.accounts.map(acc => ({
      platform: acc.platform,
      handle: acc.handle,
      followers: acc.followers,
      found: acc.found,
    }));

    return { score: result.overallSocialScore, accounts };
  } catch (error) {
    console.error(`[Analyst] Social analysis failed for ${businessName}:`, error);
    return { score: 0, accounts: [] };
  }
}

async function analyzeContentScore(website: string | null): Promise<{
  score: number;
  blogPosts: number;
  lastUpdate: Date | null;
  hasRecentUpdates: boolean;
  issues: string[];
}> {
  if (!website) {
    return { score: 0, blogPosts: 0, lastUpdate: null, hasRecentUpdates: false, issues: ['Web sitesi yok'] };
  }

  try {
    const auditor = new WebsiteAuditor();
    const audit = await auditor.audit(website);
    await auditor.close();

    let score = 0;
    const issues: string[] = [];

    // Content quality assessment
    const hasContent = audit.linksCount > 5 && audit.imagesCount > 2;

    if (!hasContent) {
      issues.push('Web sitesinde içerik yok veya yetersiz');
    } else {
      score = 10;
      if (audit.linksCount > 20) score += 5;
      if (audit.imagesCount > 10) score += 5;
    }

    // Recent updates indicator
    const hasRecentUpdates = audit.technologies.some(t =>
      ['WordPress', 'Shopify', 'React'].includes(t)
    );
    if (hasRecentUpdates) score += 5;

    return {
      score: Math.min(25, score),
      blogPosts: 0,
      lastUpdate: null,
      hasRecentUpdates,
      issues,
    };
  } catch (error) {
    console.error(`[Analyst] Content analysis failed for ${website}:`, error);
    return { score: 0, blogPosts: 0, lastUpdate: null, hasRecentUpdates: false, issues: [`Content analiz hatası: ${error instanceof Error ? error.message : 'Unknown'}`] };
  }
}

async function analyzeReviewScore(
  businessName: string,
  placeId?: string,
  location?: string
): Promise<{
  score: number;
  rating: number;
  reviewCount: number;
  recentReviews: string[];
}> {
  try {
    const result: GoogleReviewsResult = await checkGoogleReviews(
      businessName,
      placeId,
      location
    );

    return {
      score: result.score,
      rating: result.rating,
      reviewCount: result.reviewCount,
      recentReviews: result.reviews.slice(0, 3).map(r => r.text.substring(0, 200)),
    };
  } catch (error) {
    console.error(`[Analyst] Review analysis failed for ${businessName}:`, error);
    return { score: 0, rating: 0, reviewCount: 0, recentReviews: [] };
  }
}

// ============================================
// MAIN ANALYSIS
// ============================================

async function analyzeLead(lead: Lead): Promise<LeadAnalysis> {
  console.log(`[Analyst] Analyzing: ${lead.business_name} (ID: ${lead.id})`);

  const [
    websiteResult,
    seoResult,
    socialResult,
    contentResult,
    reviewResult,
  ] = await Promise.all([
    analyzeWebsiteScore(lead.website),
    analyzeSEOScore(lead.website),
    analyzeSocialScore(
      lead.business_name,
      lead.website,
      lead.instagram_handle || undefined,
      lead.facebook_url || undefined,
      lead.linkedin_url || undefined
    ),
    analyzeContentScore(lead.website),
    analyzeReviewScore(
      lead.business_name,
      lead.google_place_id || undefined,
      lead.district || lead.city || undefined
    ),
  ]);

  const totalScore =
    websiteResult.score +
    seoResult.score +
    socialResult.score +
    contentResult.score +
    reviewResult.score;

  // Determine priority
  let priority: 'critical' | 'high' | 'medium' | 'low';
  if (totalScore < 50) {
    priority = 'critical';
  } else if (totalScore < 70) {
    priority = 'high';
  } else if (totalScore < 85) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  // Build recommendations
  const recommendations: Recommendation[] = [];

  if (websiteResult.score < 15) {
    recommendations.push({
      category: 'website',
      priority: 1,
      action: 'Web sitesi oluşturun veya iyileştirin',
      impact: 'high',
    });
  }

  if (seoResult.score < 15) {
    recommendations.push({
      category: 'seo',
      priority: 1,
      action: 'SEO iyileştirmeleri yapın (title, meta, OG tags)',
      impact: 'high',
    });
  }

  if (socialResult.score < 10) {
    recommendations.push({
      category: 'social',
      priority: 2,
      action: 'Sosyal medya hesapları oluşturun/instagram takipçi kazanın',
      impact: 'high',
    });
  }

  if (contentResult.score < 15) {
    recommendations.push({
      category: 'content',
      priority: 2,
      action: 'Web sitesine düzenli içerik ekleyin',
      impact: 'medium',
    });
  }

  if (reviewResult.score < 5) {
    recommendations.push({
      category: 'reviews',
      priority: 2,
      action: 'Google Maps\'ta yorum toplayın',
      impact: 'medium',
    });
  }

  return {
    leadId: lead.id,
    businessName: lead.business_name,
    website: lead.website,
    scores: {
      website: websiteResult.score,
      seo: seoResult.score,
      social: socialResult.score,
      content: contentResult.score,
      review: reviewResult.score,
      total: totalScore,
    },
    details: {
      websiteIssues: websiteResult.issues,
      seoIssues: seoResult.issues,
      socialAccounts: socialResult.accounts,
      contentInfo: {
        blogPosts: contentResult.blogPosts,
        lastUpdate: contentResult.lastUpdate,
        hasRecentUpdates: contentResult.hasRecentUpdates,
      },
      reviewInfo: {
        rating: reviewResult.rating,
        reviewCount: reviewResult.reviewCount,
        recentReviews: reviewResult.recentReviews,
      },
    },
    recommendations,
    priority,
    analyzedAt: new Date(),
  };
}

// ============================================
// TELEGRAM REPORTING
// ============================================

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[Analyst] Telegram not configured, skipping notification');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('[Analyst] Telegram send failed:', error);
  }
}

async function sendAnalysisSummary(analyses: LeadAnalysis[]): Promise<void> {
  if (analyses.length === 0) return;

  let message = `<b>📊 Analiz Raporu</b>\n\n`;
  message += `${analyses.length} işletme analiz edildi\n\n`;

  // High priority businesses
  const critical = analyses.filter(a => a.priority === 'critical');
  const high = analyses.filter(a => a.priority === 'high');

  if (critical.length > 0) {
    message += `<b>⚠️ Kritik Öncelik (score &lt; 50):</b>\n`;
    for (const a of critical) {
      message += `• ${a.businessName} - Skor: ${a.scores.total}/100\n`;
    }
    message += '\n';
  }

  if (high.length > 0) {
    message += `<b>🔴 Yüksek Öncelik (score &lt; 70):</b>\n`;
    for (const a of high.slice(0, 5)) {
      message += `• ${a.businessName} - Skor: ${a.scores.total}/100\n`;
    }
    if (high.length > 5) {
      message += `... ve ${high.length - 5} işletme daha\n`;
    }
  }

  message += `\n<i>Analiz zamanı: ${new Date().toLocaleString('tr-TR')}</i>`;

  await sendTelegramMessage(message);
}

// ============================================
// MAIN RUNNER
// ============================================

async function runAnalyst(options: {
  leadId?: number;
  batchSize?: number;
  dryRun?: boolean;
} = {}): Promise<void> {
  const { leadId, batchSize = 10, dryRun = false } = options;

  console.log('[Analyst] Starting analysis run...');
  console.log(`[Analyst] Options: leadId=${leadId}, batchSize=${batchSize}, dryRun=${dryRun}`);

  const db = getDb();

  try {
    let leads: Lead[];

    if (leadId) {
      const lead = getLeadById(db, leadId);
      leads = lead ? [lead] : [];
    } else {
      leads = getUnanalyzedLeads(db, batchSize);
    }

    if (leads.length === 0) {
      console.log('[Analyst] No leads to analyze');
      return;
    }

    console.log(`[Analyst] Found ${leads.length} leads to analyze`);

    const analyses: LeadAnalysis[] = [];

    for (const lead of leads) {
      try {
        const analysis = await analyzeLead(lead);
        analyses.push(analysis);

        if (!dryRun) {
          saveAnalysis(db, analysis);
          logActivity(
            db,
            'lead',
            lead.id,
            'analyzed',
            `Score: ${analysis.scores.total}/100, Priority: ${analysis.priority}`
          );

          // Update lead's updated_at
          const updateStmt = db.prepare('UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?');
          updateStmt.run(lead.id);
        }

        console.log(`[Analyst] ✓ ${lead.business_name}: ${analysis.scores.total}/100 (${analysis.priority})`);

        // Rate limiting between analyses
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.error(`[Analyst] Failed to analyze ${lead.business_name}:`, error);
      }
    }

    // Send Telegram summary
    await sendAnalysisSummary(analyses);

    console.log(`[Analyst] Analysis complete. Processed ${analyses.length} leads.`);

    // Print summary
    if (analyses.length > 0) {
      console.log('\n--- SUMMARY ---');
      const avgScore = analyses.reduce((sum, a) => sum + a.scores.total, 0) / analyses.length;
      console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
      console.log(`Critical: ${analyses.filter(a => a.priority === 'critical').length}`);
      console.log(`High: ${analyses.filter(a => a.priority === 'high').length}`);
      console.log(`Medium: ${analyses.filter(a => a.priority === 'medium').length}`);
      console.log(`Low: ${analyses.filter(a => a.priority === 'low').length}`);
    }

  } finally {
    db.close();
  }
}

// ============================================
// CLI
// ============================================

function parseArgs(): { leadId?: number; batchSize?: number; dryRun?: boolean } {
  const args = process.argv.slice(2);
  const options: { leadId?: number; batchSize?: number; dryRun?: boolean } = {
    batchSize: 10,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lead-id' && args[i + 1]) {
      options.leadId = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--batch-size' && args[i + 1]) {
      options.batchSize = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

// Run if executed directly
runAnalyst(parseArgs()).catch(console.error);

export { runAnalyst, analyzeLead };
