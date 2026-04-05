import { chromium, Browser, Page } from 'playwright';

export interface SocialAccountInfo {
  platform: 'instagram' | 'facebook' | 'linkedin';
  handle: string | null;
  url: string | null;
  followers: number;
  found: boolean;
  bio?: string;
  recentPosts?: number;
}

export interface SocialCheckResult {
  businessName: string;
  website: string | null;
  accounts: SocialAccountInfo[];
  totalFollowers: number;
  overallSocialScore: number;
  checkedAt: Date;
}

const INSTAGRAM_BASE = 'https://www.instagram.com';

async function initBrowser(): Promise<Browser> {
  return chromium.launch({ headless: true });
}

async function checkInstagram(businessName: string, existingHandle?: string): Promise<SocialAccountInfo> {
  const result: SocialAccountInfo = {
    platform: 'instagram',
    handle: existingHandle || null,
    url: null,
    followers: 0,
    found: false,
  };

  const browser = await initBrowser();
  const page = await browser.newPage();

  try {
    let targetHandle: string | null | undefined = existingHandle;

    // If no handle provided, try to find from website
    if (!targetHandle) {
      targetHandle = await searchInstagramHandle(page, businessName);
    }

    if (!targetHandle) {
      console.log(`[Social] Instagram not found for: ${businessName}`);
      return result;
    }

    result.handle = targetHandle;
    result.url = `${INSTAGRAM_BASE}/${targetHandle}/`;

    // Navigate to profile
    await page.goto(result.url, { timeout: 15000, waitUntil: 'domcontentloaded' });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if account exists (not found page)
    const pageContent = await page.content();
    if (pageContent.includes('Page Not Found') || pageContent.includes('Sorry, this page')) {
      console.log(`[Social] Instagram page not found: ${targetHandle}`);
      return result;
    }

    result.found = true;

    // Extract follower count
    const followerText = await page.$eval('span[title]', (el) => el.getAttribute('title')).catch(() => null);
    if (followerText) {
      result.followers = parseFollowerCount(followerText);
    } else {
      // Try alternative selectors for follower count
      const altFollower = await page.evaluate(() => {
        const spans = Array.from(document.querySelectorAll('span'));
        for (const span of spans) {
          const text = span.textContent || '';
          if (text.includes('followers') || text.includes('takipçi')) {
            return text.match(/[\d,.KkMm]+/)?.[0] || null;
          }
        }
        return null;
      });
      if (altFollower) result.followers = parseFollowerCount(altFollower);
    }

    // Get bio
    result.bio = await page.$eval('div.-vDIg span', (el) => el.textContent?.trim() || '').catch(() => undefined);

  } catch (error) {
    console.error(`[Social] Instagram check error for ${businessName}:`, error);
  } finally {
    await page.close();
    await browser.close();
  }

  return result;
}

async function searchInstagramHandle(page: Page, businessName: string): Promise<string | null> {
  try {
    // Search Instagram
    await page.goto(`${INSTAGRAM_BASE}/accounts/login/`, { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Try to use search (without login it's limited)
    const searchUrl = `${INSTAGRAM_BASE}/explore/search/?keyword=${encodeURIComponent(businessName)}`;
    await page.goto(searchUrl, { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Look for profile links in results
    const firstProfile = await page.$('a[href*="/"][class*="走得"]').catch(() => null);
    if (firstProfile) {
      const href = await firstProfile.getAttribute('href');
      const match = href?.match(/\/([a-zA-Z0-9._]+)\/?$/);
      if (match && !match[1].includes('explore')) {
        return match[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function checkFacebook(businessName: string, existingUrl?: string): Promise<SocialAccountInfo> {
  const result: SocialAccountInfo = {
    platform: 'facebook',
    handle: null,
    url: existingUrl || null,
    followers: 0,
    found: false,
  };

  const browser = await initBrowser();
  const page = await browser.newPage();

  try {
    let targetUrl: string | null | undefined = existingUrl;

    if (!targetUrl) {
      // Search Facebook
      const searchUrl = `https://www.facebook.com/search/top?q=${encodeURIComponent(businessName)}`;
      await page.goto(searchUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Find first page result
      const firstResult = await page.$('a[role="presentation"][href*="/pages/"]').catch(() => null);
      if (firstResult) {
        targetUrl = await firstResult.getAttribute('href');
      }
    }

    if (!targetUrl) {
      console.log(`[Social] Facebook not found for: ${businessName}`);
      return result;
    }

    // Clean URL to page name
    const urlMatch = targetUrl.match(/facebook\.com\/([^/?]+)/);
    if (urlMatch) result.handle = urlMatch[1];

    await page.goto(targetUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    result.url = page.url();
    result.found = !page.url().includes('login');

    // Get follower/like count
    const countText = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      for (const span of spans) {
        const text = span.textContent || '';
        if (text.includes('like') && text.match(/\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (countText) {
      const numMatch = countText.match(/[\d,.KkMm]+/);
      if (numMatch) result.followers = parseFollowerCount(numMatch[0]);
    }

  } catch (error) {
    console.error(`[Social] Facebook check error for ${businessName}:`, error);
  } finally {
    await page.close();
    await browser.close();
  }

  return result;
}

async function checkLinkedIn(_businessName: string, existingUrl?: string): Promise<SocialAccountInfo> {
  const result: SocialAccountInfo = {
    platform: 'linkedin',
    handle: null,
    url: existingUrl || null,
    followers: 0,
    found: false,
  };

  // LinkedIn typically requires authentication, so we just try to verify if URL exists
  if (existingUrl) {
    const browser = await initBrowser();
    const page = await browser.newPage();

    try {
      await page.goto(existingUrl, { timeout: 10000, waitUntil: 'domcontentloaded' });

      result.url = page.url();
      result.found = !page.url().includes('login');
      result.handle = existingUrl.split('linkedin.com/company/')[1]?.split('/')[0] || null;

    } catch (error) {
      console.error(`[Social] LinkedIn check error:`, error);
    } finally {
      await page.close();
      await browser.close();
    }
  }

  return result;
}

function parseFollowerCount(text: string): number {
  // Handle Turkish and English formats
  const cleaned = text.replace(/[^\d,.KkMm]/gi, '');
  const match = cleaned.match(/([\d,]+)[.,]?([KkMm])?/);

  if (!match) return 0;

  let num = parseFloat(match[1].replace(/,/g, '.'));

  if (match[2]) {
    switch (match[2].toUpperCase()) {
      case 'K': num *= 1000; break;
      case 'M': num *= 1000000; break;
      case 'G': num *= 1000000000; break;
    }
  }

  return Math.round(num);
}

export async function checkSocialMedia(
  businessName: string,
  website?: string,
  existingInstagram?: string,
  existingFacebook?: string,
  existingLinkedin?: string
): Promise<SocialCheckResult> {
  const results: SocialCheckResult = {
    businessName,
    website: website || null,
    accounts: [],
    totalFollowers: 0,
    overallSocialScore: 0,
    checkedAt: new Date(),
  };

  console.log(`[Social] Checking social media for: ${businessName}`);

  // Run checks in parallel
  const [instagram, facebook, linkedin] = await Promise.all([
    checkInstagram(businessName, existingInstagram),
    checkFacebook(businessName, existingFacebook),
    checkLinkedIn(businessName, existingLinkedin),
  ]);

  results.accounts = [instagram, facebook, linkedin];

  // Calculate total followers
  for (const account of results.accounts) {
    results.totalFollowers += account.followers;
  }

  // Calculate social score
  let score = 0;

  // Instagram scoring
  if (instagram.found) {
    if (instagram.followers > 1000) score += 15;
    else if (instagram.followers > 100) score += 10;
    else score += 5;
  }

  // Facebook scoring
  if (facebook.found) score += 5;

  // LinkedIn scoring
  if (linkedin.found) score += 5;

  results.overallSocialScore = Math.min(25, score); // Cap at 25

  return results;
}

export async function checkSocialMediaBatch(
  businesses: Array<{
    businessName: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  }>
): Promise<SocialCheckResult[]> {
  const results: SocialCheckResult[] = [];

  for (const business of businesses) {
    console.log(`[Social] Processing: ${business.businessName}`);
    const result = await checkSocialMedia(
      business.businessName,
      business.website,
      business.instagram,
      business.facebook,
      business.linkedin
    );
    results.push(result);
  }

  return results;
}
