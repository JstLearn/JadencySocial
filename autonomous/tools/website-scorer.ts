/**
 * Website Skorlama Script
 *
 * Web sitesi olan leadleri analiz eder ve dijital skor hesaplar.
 */

import { getLeads, createAnalysis, getAnalysisByLeadId } from '../db/index.js';
import { calculateDigitalScore, buildProfileFromAnalysis } from './score.js';

interface WebsiteAuditResult {
  url: string;
  exists: boolean;
  sslValid: boolean;
  title?: string;
  metaDescription?: string;
  hasContactPage: boolean;
  hasOgTags: boolean;
  hasH1: boolean;
  emailAddresses: string[];
  phoneNumbers: string[];
  socialLinks: Record<string, string>;
  error?: string;
}

async function auditWebsite(url: string, timeout: number = 15000): Promise<WebsiteAuditResult> {
  const result: WebsiteAuditResult = {
    url,
    exists: false,
    sslValid: false,
    hasContactPage: false,
    hasOgTags: false,
    hasH1: false,
    emailAddresses: [],
    phoneNumbers: [],
    socialLinks: {},
  };

  try {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const isHttps = normalizedUrl.startsWith('https://');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok && response.status !== 301 && response.status !== 302) {
        result.error = `HTTP ${response.status}`;
        return result;
      }

      result.exists = true;
      result.sslValid = isHttps;

      const html = await response.text();

      // Title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) result.title = titleMatch[1].trim();

      // Meta description
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (descMatch) result.metaDescription = descMatch[1];
      else {
        const altDescMatch = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
        if (altDescMatch) result.metaDescription = altDescMatch[1];
      }

      // Contact page
      const lower = html.toLowerCase();
      result.hasContactPage = lower.includes('contact') || lower.includes('iletisim') || lower.includes('contact-us');

      // OG tags
      result.hasOgTags = lower.includes('og:title') && lower.includes('og:description');

      // H1
      result.hasH1 = /<h1[^>]*>/i.test(html);

      // Emails
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = html.match(emailPattern) || [];
      result.emailAddresses = [...new Set(emails)].filter(e =>
        !e.includes('example.com') && !e.includes('localhost')
      );

      // Phones
      const phonePattern = /(?:\+90|0)[-\s]?[0-9]{2,4}[-\s]?[0-9]{3,4}[-\s]?[0-9]{4}/g;
      result.phoneNumbers = [...new Set(html.match(phonePattern) || [])];

      // Social links
      const fbMatch = html.match(/facebook\.com\/[a-zA-Z0-9._-]+/gi);
      if (fbMatch && fbMatch[0]) result.socialLinks.facebook = fbMatch[0];

      const igMatch = html.match(/(?:instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+/gi);
      if (igMatch && igMatch[0]) result.socialLinks.instagram = igMatch[0];

      const liMatch = html.match(/linkedin\.com\/in\/[a-zA-Z0-9._-]+/gi);
      if (liMatch && liMatch[0]) result.socialLinks.linkedin = liMatch[0];

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      result.error = fetchError instanceof Error ? fetchError.message : 'Fetch error';
    }
  } catch (error: unknown) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

function calculateWebsiteScore(audit: WebsiteAuditResult): number {
  let score = 0;

  if (!audit.exists) return 0;

  // Basic presence: 20 points
  score += 20;

  // Title: 20 points
  if (audit.title && audit.title.length > 5) score += 20;

  // Meta description: 20 points
  if (audit.metaDescription && audit.metaDescription.length > 20) score += 20;

  // SSL: 15 points
  if (audit.sslValid) score += 15;

  // Contact page: 10 points
  if (audit.hasContactPage) score += 10;

  // OG tags: 10 points
  if (audit.hasOgTags) score += 10;

  // H1: 5 points
  if (audit.hasH1) score += 5;

  return Math.min(100, score);
}

async function main() {
  console.log('===========================================');
  console.log('[Website Skorer] Başlıyor...');
  console.log('===========================================');

  // Get leads with websites
  const allLeads = getLeads({ limit: 500 });
  const leadsWithWebsites = allLeads.filter(l => l.website && l.website.trim() !== '');

  console.log(`\nToplam lead: ${allLeads.length}`);
  console.log(`Web sitesi olan: ${leadsWithWebsites.length}`);

  // Limit to top 20 for this run
  const targets = leadsWithWebsites.slice(0, 20);
  let processed = 0;
  let scored = 0;

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

    // Audit website
    const audit = await auditWebsite(lead.website!);

    if (!audit.exists) {
      console.log('    ✗ Web sitesi bulunamadı');
    } else {
      console.log(`    ✓ SSL: ${audit.sslValid}, Title: ${audit.title ? 'Var' : 'Yok'}`);
      console.log(`    ✓ Meta: ${audit.metaDescription ? 'Var' : 'Yok'}, OG: ${audit.hasOgTags ? 'Var' : 'Yok'}`);
      console.log(`    ✓ Sosyal: FB=${!!audit.socialLinks.facebook}, IG=${!!audit.socialLinks.instagram}`);

      // Calculate scores
      const websiteScore = calculateWebsiteScore(audit);
      const hasInstagram = !!audit.socialLinks.instagram;
      const hasFacebook = !!audit.socialLinks.facebook;

      // Simple SEO score based on title and meta
      const seoScore = (audit.title ? 30 : 0) + (audit.metaDescription ? 30 : 0) + (audit.hasOgTags ? 20 : 0) + (audit.hasH1 ? 20 : 0);

      // Social score
      let socialScore = 0;
      if (hasInstagram) socialScore += 60;
      if (hasFacebook) socialScore += 30;
      if (hasInstagram && audit.socialLinks.instagram.includes('instagram.com')) socialScore += 10;

      // Content score
      const contentScore = websiteScore;

      // Create analysis record
      createAnalysis({
        lead_id: lead.id,
        website_score: websiteScore,
        seo_score: seoScore,
        social_score: socialScore,
        content_score: contentScore,
        website_checked: true,
        social_accounts_found: Object.keys(audit.socialLinks),
      });

      scored++;
      console.log(`    → Website Skor: ${websiteScore}/100`);
      console.log(`    → SEO Skor: ${seoScore}/100`);
      console.log(`    → Sosyal Skor: ${socialScore}/100`);
    }

    processed++;

    // Rate limiting - be nice to servers
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n===========================================');
  console.log('[Website Skorer] Tamamlandı');
  console.log(`  İşlenen: ${processed}`);
  console.log(`  Skorlanan: ${scored}`);
  console.log('===========================================');
}

main().catch(console.error);
