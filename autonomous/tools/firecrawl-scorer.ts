/**
 * Firecrawl Website Scorer
 *
 * Firecrawl API kullanarak kapsamlı website analizi yapar.
 */

import { getLeads, createAnalysis, getAnalysisByLeadId } from '../db/index.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-cdd4cc56b6a047e8af79d3b57afd0b65';

interface FirecrawlMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  language?: string;
  statusCode?: number;
}

interface FirecrawlResult {
  url: string;
  success: boolean;
  metadata?: FirecrawlMetadata;
  markdown?: string;
  links?: string[];
  error?: string;
}

async function scrapeWithFirecrawl(url: string): Promise<FirecrawlResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        includeMetadata: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      return { url, success: false, error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();

    return {
      url,
      success: data.success,
      metadata: data.data?.metadata,
      markdown: data.data?.markdown,
      links: data.data?.links,
    };
  } catch (error: unknown) {
    return {
      url,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function calculateWebsiteScore(metadata: FirecrawlMetadata | undefined, markdown?: string): number {
  if (!metadata) return 0;

  let score = 0;
  const content = markdown || '';
  const lower = content.toLowerCase();

  // Basic presence: 20 points
  score += 20;

  // Title: 15 points
  if (metadata.title && metadata.title.length > 5) score += 15;

  // Meta description: 15 points
  if (metadata.description && metadata.description.length > 20) score += 15;

  // OG tags: 20 points
  if (metadata.ogTitle && metadata.ogDescription) score += 20;

  // Twitter card: 5 points
  if (metadata.twitterCard) score += 5;

  // HTTPS (SSL): 10 points
  if (metadata?.pageStatusCode === 200) score += 10;

  // Language set: 5 points
  if (metadata.language) score += 5;

  // Contact info in content: 10 points
  const hasContact = lower.includes('iletisim') || lower.includes('contact') || lower.includes('adres') || lower.includes('telefon');
  if (hasContact) score += 10;

  // WhatsApp: 5 points bonus
  if (lower.includes('whatsapp') || lower.includes('wa.me')) score += 5;

  return Math.min(105, score);
}

function detectSocialLinks(metadata: FirecrawlMetadata, markdown?: string): string[] {
  const links: string[] = [];
  const content = (markdown || '').toLowerCase();

  // Instagram
  if (content.includes('instagram.com') || content.includes('instagr.am')) {
    links.push('instagram');
  }

  // Facebook
  if (content.includes('facebook.com') || content.includes('fb.com')) {
    links.push('facebook');
  }

  // LinkedIn
  if (content.includes('linkedin.com')) {
    links.push('linkedin');
  }

  return links;
}

async function main() {
  console.log('===========================================');
  console.log('[Firecrawl Skorer] Başlıyor...');
  console.log('===========================================');

  // Get leads with websites
  const allLeads = getLeads({ limit: 500 });
  const leadsWithWebsites = allLeads.filter(l => l.website && l.website.trim() !== '');

  console.log(`\nToplam lead: ${allLeads.length}`);
  console.log(`Web sitesi olan: ${leadsWithWebsites.length}`);

  // Process first 10 for demo
  const targets = leadsWithWebsites.slice(0, 10);
  let processed = 0;

  for (const lead of targets) {
    console.log(`\n[${processed + 1}/${targets.length}] ${lead.business_name}`);
    console.log(`    URL: ${lead.website}`);

    // Check if already analyzed
    const existing = getAnalysisByLeadId(lead.id);
    if (existing && existing.website_score !== null) {
      console.log('    ✓ Zaten analiz edilmiş, atlanıyor');
      processed++;
      continue;
    }

    // Scrape with Firecrawl
    const result = await scrapeWithFirecrawl(lead.website!);

    if (!result.success) {
      console.log(`    ✗ Firecrawl hatası: ${result.error}`);
    } else {
      const { metadata, markdown } = result;

      console.log(`    ✓ Status: ${metadata?.pageStatusCode || 'bilinmiyor'}`);
      console.log(`    ✓ Title: ${metadata?.title?.substring(0, 50) || 'Yok'}`);
      console.log(`    ✓ Description: ${metadata?.description?.substring(0, 50) || 'Yok'}...`);
      console.log(`    ✓ OG: ${metadata?.ogTitle ? 'Var' : 'Yok'}`);
      console.log(`    ✓ Twitter Card: ${metadata?.twitterCard || 'Yok'}`);

      // Calculate scores
      const websiteScore = calculateWebsiteScore(metadata, markdown);
      const socialLinks = detectSocialLinks(metadata, markdown);

      // SEO score
      let seoScore = 0;
      if (metadata?.title) seoScore += 25;
      if (metadata?.description) seoScore += 25;
      if (metadata?.ogTitle && metadata?.ogDescription) seoScore += 25;
      if (metadata?.ogImage) seoScore += 15;
      if (metadata?.twitterCard) seoScore += 10;

      // Social score
      let socialScore = 0;
      if (socialLinks.includes('instagram')) socialScore += 50;
      if (socialLinks.includes('facebook')) socialScore += 30;
      if (socialLinks.includes('linkedin')) socialScore += 20;

      // Content score (based on markdown length as proxy)
      const contentScore = markdown ? Math.min(100, (markdown.length / 10)) : 0;

      // Save analysis
      createAnalysis({
        lead_id: lead.id,
        website_score: websiteScore,
        seo_score: seoScore,
        social_score: socialScore,
        content_score: contentScore,
        website_checked: true,
        social_accounts_found: socialLinks,
      });

      console.log(`    → Website Skor: ${websiteScore}/105`);
      console.log(`    → SEO Skor: ${seoScore}/100`);
      console.log(`    → Sosyal Skor: ${socialScore}/100`);
      console.log(`    → Sosyal Bulunan: ${socialLinks.join(', ') || 'hiçbiri'}`);
    }

    processed++;

    // Rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n===========================================');
  console.log('[Firecrawl Skorer] Tamamlandı');
  console.log(`  İşlenen: ${processed}`);
  console.log('===========================================');
}

main().catch(console.error);
