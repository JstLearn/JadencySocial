/**
 * Multi-Source Scraper
 *
 * İşletme verisi çekmek için birden fazla kaynak:
 * - Apify: Google Maps, Yelp actor'ları
 * - SerpAPI: Google search
 * - Firecrawl: Website crawl + SEO analiz
 */

import { chromium } from 'playwright';

// ============================================
// TYPES
// ============================================

export interface BusinessLead {
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  googleMapsUrl: string | null;
  placeId: string | null;
  source: 'apify' | 'serpapi' | 'manual';
  businessType?: string;
  location?: string;
}

// ============================================
// APIFY - Google Maps Scraper
// ============================================

export async function scrapeGoogleMapsViaApify(
  searchQueries: string[],
  options: {
    country?: string;
    language?: string;
    maxResults?: number;
  } = {}
): Promise<BusinessLead[]> {
  const Apify = await import('apify');
  await Apify.launch({ headless: true });

  const results: BusinessLead[] = [];

  for (const query of searchQueries) {
    console.log(`[Apify] Searching: ${query}`);

    try {
      const input = {
        queries: [query],
        coordinates: {
          countryCode: options.country || 'TR',
          languageCode: options.language || 'tr',
        },
        maxResults: options.maxResults || 20,
        addSerpapi: false,
      };

      // Google Maps actor
      const run = await Apify.callActor('compass/crawler-google-maps', input);

      if (run?.status === 'succeeded') {
        const items = run.output?.length > 0 ? run.output : [];
        for (const item of items) {
          results.push({
            name: item.title || item.name || '',
            address: item.address || null,
            phone: item.phone || null,
            website: item.website || null,
            rating: item.rating || null,
            reviewCount: item.reviewCount || null,
            googleMapsUrl: item.url || null,
            placeId: item.placeId || null,
            source: 'apify',
            businessType: query.split(' in ')[0] || undefined,
            location: query.split(' in ')[1] || undefined,
          });
        }
      }
    } catch (error) {
      console.error(`[Apify] Error for ${query}:`, error);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }

  return results;
}

// ============================================
// SERPAPI - Google Search
// ============================================

export async function searchViaSerpapi(
  queries: string[],
  options: {
    language?: string;
    country?: string;
  } = {}
): Promise<BusinessLead[]> {
  const { google } = await import('serpapi');

  const results: BusinessLead[] = [];
  const client = new google.search.Web(process.env.SERPAPI_API_KEY || '');

  for (const query of queries) {
    console.log(`[SerpAPI] Searching: ${query}`);

    try {
      const search = await client.search({
        q: query,
        hl: options.language || 'tr',
        gl: options.country || 'tr',
        num: 10,
      });

      const organic = search.organic_results || [];

      for (const result of organic) {
        if (result.title && result.link) {
          results.push({
            name: result.title,
            address: result.snippet || null,
            phone: null, // SerpAPI doesn't give phone in basic search
            website: result.link,
            rating: null,
            reviewCount: null,
            googleMapsUrl: null,
            placeId: null,
            source: 'serpapi',
            businessType: query.split(' in ')[0] || undefined,
            location: query.split(' in ')[1] || undefined,
          });
        }
      }
    } catch (error) {
      console.error(`[SerpAPI] Error for ${query}:`, error);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }

  return results;
}

// ============================================
// FIRECRAWL - Website Crawl & SEO
// ================================================

export interface WebsiteAnalysis {
  url: string;
  title: string | null;
  metaDescription: string | null;
  ogTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  emailAddresses: string[];
  phoneNumbers: string[];
  technologies: string[];
  h1s: string[];
  linksCount: number;
  imagesCount: number;
  score: number; // 0-100
}

export async function analyzeWebsite(
  url: string,
  options: { waitForSelector?: string } = {}
): Promise<WebsiteAnalysis | null> {
  const FirecrawlApp = (await import('firecrawl')).default;

  const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY || '',
  });

  try {
    console.log(`[Firecrawl] Analyzing: ${url}`);

    const response = await firecrawl.analyze(url);

    if (!response.success) {
      console.log(`[Firecrawl] Failed: ${url}`);
      return null;
    }

    const data = response.data;

    // Calculate basic score
    let score = 0;
    if (data.title) score += 20;
    if (data.metaDescription) score += 20;
    if (data.ogTags?.ogTitle && data.ogTags?.ogDescription) score += 20;
    if (data.socialLinks && Object.keys(data.socialLinks).length > 0) score += 20;
    if (data.h1s && data.h1s.length > 0) score += 20;

    return {
      url,
      title: data.title || null,
      metaDescription: data.metaDescription || null,
      ogTags: {
        ogTitle: data.ogTags?.ogTitle || null,
        ogDescription: data.ogTags?.ogDescription || null,
        ogImage: data.ogTags?.ogImage || null,
      },
      socialLinks: {
        instagram: data.socialLinks?.instagram || undefined,
        facebook: data.socialLinks?.facebook || undefined,
        linkedin: data.socialLinks?.linkedin || undefined,
        twitter: data.socialLinks?.twitter || undefined,
      },
      emailAddresses: data.emailAddresses || [],
      phoneNumbers: data.phoneNumbers || [],
      technologies: data.technologies || [],
      h1s: data.h1s || [],
      linksCount: data.linksCount || 0,
      imagesCount: data.imagesCount || 0,
      score,
    };
  } catch (error) {
    console.error(`[Firecrawl] Error analyzing ${url}:`, error);
    return null;
  }
}

export async function crawlWebsite(
  url: string,
  options: {
    limit?: number;
    query?: string;
  } = {}
): Promise<string[]> {
  const FirecrawlApp = (await import('firecrawl')).default;

  const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY || '',
  });

  try {
    console.log(`[Firecrawl] Crawling: ${url}`);

    const response = await firecrawl.crawl(url, {
      limit: options.limit || 10,
      query: options.query,
    });

    if (!response.success) {
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error(`[Firecrawl] Error crawling ${url}:`, error);
    return [];
  }
}

// ============================================
// PLAYWRIGHT FALLBACK - Direct website analysis
// ============================================

export async function quickAnalyzeWebsite(url: string): Promise<Partial<WebsiteAnalysis>> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const title = await page.title();
    const metaDesc = await page.$eval(
      'meta[name="description"]',
      el => el.getAttribute('content')
    ).catch(() => null);

    // Extract OG tags
    const ogTags = {
      ogTitle: await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => null),
      ogDescription: await page.$eval('meta[property="og:description"]', el => el.getAttribute('content')).catch(() => null),
      ogImage: await page.$eval('meta[property="og:image"]', el => el.getAttribute('content')).catch(() => null),
    };

    // Social links from page content
    const pageContent = await page.content();
    const socialLinks: WebsiteAnalysis['socialLinks'] = {};

    const instagramMatch = pageContent.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (instagramMatch) socialLinks.instagram = instagramMatch[0];

    const facebookMatch = pageContent.match(/facebook\.com\/([a-zA-Z0-9._-]+)/i);
    if (facebookMatch) socialLinks.facebook = facebookMatch[0];

    const linkedinMatch = pageContent.match(/linkedin\.com\/in\/([a-zA-Z0-9._-]+)/i);
    if (linkedinMatch) socialLinks.linkedin = linkedinMatch[0];

    // Emails
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = pageContent.match(emailPattern) || [];

    // Phones
    const phonePattern = /(?:\+90|0)[-\s]?(?:[0-9]{2}[-\s]?)?[0-9]{3}[-\s]?[0-9]{4}/g;
    const phones = pageContent.match(phonePattern) || [];

    return {
      url,
      title,
      metaDescription: metaDesc,
      ogTags,
      socialLinks,
      emailAddresses: [...new Set(emails)],
      phoneNumbers: [...new Set(phones)],
      score: calculateBasicScore({ title, metaDesc, ogTags, socialLinks }),
    };
  } finally {
    await browser.close();
  }
}

function calculateBasicScore(data: {
  title: string | null;
  metaDescription: string | null;
  ogTags: { ogTitle: string | null; ogDescription: string | null };
  socialLinks: WebsiteAnalysis['socialLinks'];
}): number {
  let score = 0;
  if (data.title) score += 25;
  if (data.metaDescription) score += 25;
  if (data.ogTags.ogTitle && data.ogTags.ogDescription) score += 25;
  const hasSocial = data.socialLinks && Object.values(data.socialLinks).some(v => v);
  if (hasSocial) score += 25;
  return score;
}

// ============================================
// HELPER - Combined website audit
// ============================================

export async function auditBusiness(lead: BusinessLead): Promise<{
  website: WebsiteAnalysis | null;
  socialScore: number;
  needsImprovements: string[];
}> {
  const improvements: string[] = [];
  let socialScore = 0;

  // 1. Try Firecrawl first, fallback to Playwright
  let website: WebsiteAnalysis | null = null;

  if (lead.website) {
    // Try Firecrawl first
    if (process.env.FIRECRAWL_API_KEY) {
      website = await analyzeWebsite(lead.website);
    }

    // Fallback to Playwright if Firecrawl failed or not configured
    if (!website) {
      const quickResult = await quickAnalyzeWebsite(lead.website);
      if (quickResult) {
        website = {
          url: lead.website,
          title: quickResult.title || null,
          metaDescription: quickResult.metaDescription || null,
          ogTags: quickResult.ogTags || { ogTitle: null, ogDescription: null, ogImage: null },
          socialLinks: quickResult.socialLinks || {},
          emailAddresses: quickResult.emailAddresses || [],
          phoneNumbers: quickResult.phoneNumbers || [],
          technologies: [],
          h1s: [],
          linksCount: 0,
          imagesCount: 0,
          score: quickResult.score || 0,
        };
      }
    }
  }

  // 2. Calculate social score
  if (website) {
    if (!website.title) improvements.push('Title tag yok');
    if (!website.metaDescription) improvements.push('Meta description yok');
    if (!website.ogTags.ogTitle) improvements.push('OG Title yok');
    if (!website.ogTags.ogDescription) improvements.push('OG Description yok');
    if (!website.socialLinks.instagram && !website.socialLinks.facebook) {
      improvements.push('Sosyal medya hesabı yok');
      socialScore = 20;
    } else {
      socialScore = 50;
      if (website.socialLinks.instagram && website.socialLinks.facebook) socialScore = 100;
    }

    // Bonus for contact info
    if (website.phoneNumbers.length > 0) socialScore += 10;
    if (website.emailAddresses.length > 0) socialScore += 10;

    // Rating bonus
    if (lead.rating && lead.rating >= 4) socialScore += 15;
    if (lead.reviewCount && lead.reviewCount >= 20) socialScore += 10;

    socialScore = Math.min(100, socialScore);
  } else {
    improvements.push('Web sitesi yok veya ulaşılamıyor');
    socialScore = 0;
  }

  return {
    website,
    socialScore,
    needsImprovements: improvements,
  };
}
