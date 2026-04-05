import { chromium, Browser, Page } from 'playwright';

export interface ReviewInfo {
  author: string;
  rating: number;
  text: string;
  date: string;
  relativeTime: string;
}

export interface GoogleReviewsResult {
  placeId: string | null;
  businessName: string;
  rating: number;
  reviewCount: number;
  reviews: ReviewInfo[];
  score: number; // 0-10 bonus score
  issues: string[];
  checkedAt: Date;
}

async function initBrowser(): Promise<Browser> {
  return chromium.launch({ headless: true });
}

/**
 * Extract reviews from Google Maps place page
 */
async function scrapeGoogleMaps(page: Page, placeUrl: string): Promise<GoogleReviewsResult> {
  const result: GoogleReviewsResult = {
    placeId: null,
    businessName: '',
    rating: 0,
    reviewCount: 0,
    reviews: [],
    score: 0,
    issues: [],
    checkedAt: new Date(),
  };

  try {
    await page.goto(placeUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // Wait for dynamic content

    // Extract place ID from URL if available
    const url = page.url();
    const placeIdMatch = url.match(/place\/([a-zA-Z0-9]+)/);
    if (placeIdMatch) {
      result.placeId = placeIdMatch[1];
    }

    // Extract business name
    result.businessName = await page.$eval('h1.DUwDvf', (el) => el.textContent?.trim() || '').catch(() => '');

    // Extract rating
    const ratingText = await page.$eval('div.jANrlb div[aria-label*="yıldız"], div[jstcache="2"][aria-label*="star"]', (el) => el.getAttribute('aria-label') || '').catch(() => '');
    const ratingMatch = ratingText.match(/(\d+[.,]?\d*)/);
    if (ratingMatch) {
      result.rating = parseFloat(ratingMatch[1].replace(',', '.'));
    }

    // Extract review count
    const reviewCountText = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('span[aria-label]'));
      for (const el of elements) {
        const text = el.getAttribute('aria-label') || '';
        if (text.includes('değerlendirme') || text.includes('review')) {
          const match = text.match(/[\d.,]+/);
          if (match) return match[0].replace(/[.,]/g, '');
        }
      }
      return null;
    });
    if (reviewCountText) {
      result.reviewCount = parseInt(reviewCountText, 10);
    }

    // Scroll to load reviews
    await page.evaluate(() => {
      const reviewSection = document.querySelector('button[aria-label*=" değerlendirme"], button[aria-label*=" review"]');
      if (reviewSection) (reviewSection as HTMLElement).click();
    });
    await page.waitForTimeout(2000);

    // Extract reviews
    const reviewElements = await page.$$('div.jftiEf, div[data-review-id]');
    for (const reviewEl of reviewElements.slice(0, 10)) {
      const author = await reviewEl.$eval('div.d4rUZ', (el) => el.textContent?.trim() || '').catch(() => 'Anonymous');
      const ratingStr = await reviewEl.$eval('span[aria-label]', (el) => el.getAttribute('aria-label') || '').catch(() => '');
      const ratingMatch = ratingStr.match(/(\d)/);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

      const text = await reviewEl.$eval('span.jsvTjv, div.MyEned', (el) => el.textContent?.trim() || '').catch(() => '');
      const date = await reviewEl.$eval('span.rvMkTa', (el) => el.textContent?.trim() || '').catch(() => '');

      result.reviews.push({
        author,
        rating,
        text: text.substring(0, 500),
        date,
        relativeTime: date,
      });
    }

    // Calculate score
    result.score = calculateReviewScore(result.reviewCount, result.rating);

  } catch (error) {
    result.issues.push(`Scrape error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return result;
}

/**
 * Search for a business on Google Maps
 */
async function searchGoogleMaps(page: Page, businessName: string, location?: string): Promise<string | null> {
  const searchQuery = location ? `${businessName} ${location}` : businessName;
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

  try {
    await page.goto(searchUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Click on first result
    const firstResult = await page.$('a[href*="/place/"]');
    if (firstResult) {
      const href = await firstResult.getAttribute('href');
      if (href) return href;
    }

    // Alternative: click on search result card
    const resultCard = await page.$('div.Nv2PK');
    if (resultCard) {
      const link = await resultCard.$('a[href*="/place/"]');
      if (link) {
        return await link.getAttribute('href');
      }
    }

  } catch (error) {
    console.error(`[GoogleReviews] Search failed: ${error}`);
  }

  return null;
}

/**
 * Calculate review score based on count and rating
 */
function calculateReviewScore(count: number, rating: number): number {
  let score = 0;

  if (count === 0) {
    score = 0;
  } else if (count < 10) {
    score = 3;
  } else if (count < 50) {
    score = 6;
  } else {
    score = 10;
  }

  // Bonus for high rating
  if (rating >= 4) {
    score += 5;
  }

  return Math.min(10, score);
}

/**
 * Check Google reviews for a business
 */
export async function checkGoogleReviews(
  businessName: string,
  placeId?: string,
  location?: string
): Promise<GoogleReviewsResult> {
  const browser = await initBrowser();
  const page = await browser.newPage();

  const result: GoogleReviewsResult = {
    placeId: placeId || null,
    businessName,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    score: 0,
    issues: [],
    checkedAt: new Date(),
  };

  try {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8' });

    let placeUrl: string | null = null;

    // If we have a place ID, construct URL directly
    if (placeId) {
      placeUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    } else {
      // Search for the business
      console.log(`[GoogleReviews] Searching for: ${businessName}`);
      placeUrl = await searchGoogleMaps(page, businessName, location);
    }

    if (!placeUrl) {
      result.issues.push('İşletme bulunamadı');
      return result;
    }

    console.log(`[GoogleReviews] Found place: ${placeUrl}`);
    const scrapeResult = await scrapeGoogleMaps(page, placeUrl);

    // Merge results
    result.placeId = scrapeResult.placeId || result.placeId;
    result.businessName = scrapeResult.businessName || businessName;
    result.rating = scrapeResult.rating;
    result.reviewCount = scrapeResult.reviewCount;
    result.reviews = scrapeResult.reviews;
    result.score = scrapeResult.score;
    result.issues = scrapeResult.issues;

  } catch (error) {
    result.issues.push(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
  } finally {
    await page.close();
    await browser.close();
  }

  return result;
}

/**
 * Batch check Google reviews for multiple businesses
 */
export async function checkGoogleReviewsBatch(
  businesses: Array<{
    businessName: string;
    placeId?: string;
    location?: string;
  }>
): Promise<GoogleReviewsResult[]> {
  const results: GoogleReviewsResult[] = [];

  for (const business of businesses) {
    console.log(`[GoogleReviews] Checking: ${business.businessName}`);
    const result = await checkGoogleReviews(
      business.businessName,
      business.placeId,
      business.location
    );
    results.push(result);

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}

/**
 * Quick check using Google Places API-like approach via scraping
 */
export async function quickReviewCheck(businessName: string, location?: string): Promise<{
  rating: number;
  reviewCount: number;
  score: number;
}> {
  const result = await checkGoogleReviews(businessName, undefined, location);
  return {
    rating: result.rating,
    reviewCount: result.reviewCount,
    score: result.score,
  };
}
