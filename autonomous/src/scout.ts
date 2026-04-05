/**
 * Scout Agent - Lead Discovery for JadencySocial
 *
 * Discovers businesses in Tekirdağ, Çerkezköy, Kapaklı region
 * using Google Maps API and web crawling.
 */

import {
  createLead,
  getLeadByGooglePlaceId,
  getDb,
  LeadInsert,
} from '../db/index.js';

// ============================================
// CONFIG & TYPES
// ============================================

interface Config {
  googleMapsApiKey: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}

interface SectorConfig {
  name: string;
  googleTypes: string[];
  keywords: string[];
}

interface Region {
  name: string;
  center: { lat: number; lng: number };
  radius: number;
}

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types?: string[];
  opening_hours?: { open_now: boolean; weekday_text?: string[] };
  photos?: { photo_reference: string }[];
  url?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
}

interface WebsiteAudit {
  url: string;
  exists: boolean;
  sslValid: boolean;
  title?: string;
  metaDescription?: string;
  hasContactPage: boolean;
  emailAddresses: string[];
  phoneNumbers: string[];
  socialLinks: Record<string, string>;
  technologies: string[];
  auditTimestamp: string;
  error?: string;
}

// ============================================
// CONSTANTS
// ============================================

// JADENCYSOCIAL İÇİN ÖNCELİKLİ SEKTÖRLER
// Dijital hizmetlere para vermeye hevesli, potansiyeli yüksek işletmeler
const SECTORS: SectorConfig[] = [
  { name: 'Restaurant / Cafe / Bar', googleTypes: ['restaurant', 'cafe', 'bar'], keywords: ['restaurant', 'cafe', 'bar', 'kafe', 'restoran', 'bar', 'büfe', 'lokanta', 'kırkpınar', 'pide', 'kebap'] },
  { name: 'Güzellik Salonu / SPA', googleTypes: ['beauty_salon', 'hair_care', 'spa'], keywords: ['güzellik', 'salon', 'spa', 'kuaför', 'berber', 'nail', 'esthetic', 'cilt bakım', 'masaj'] },
  { name: 'Hotel / Pansiyon', googleTypes: ['lodging'], keywords: ['hotel', 'pansiyon', 'motel', 'otel', 'konaklama', 'resort', 'butik otel'] },
  { name: 'Shop / Retail', googleTypes: ['store', 'shopping_mall', 'clothing_store'], keywords: ['mağaza', 'shop', 'store', 'butik', ' aksesuar', 'çanta', 'ayakkabı', 'tekstil'] },
  { name: 'Auto Service / Lastik', googleTypes: ['car_repair', 'gas_station', 'car_wash'], keywords: ['oto servis', 'garaj', 'lastik', 'auto service', 'car repair', 'vidanjör', 'çekici', 'otoservis'] },
  { name: 'E-ticaret / Online Satış', googleTypes: ['store'], keywords: ['online satış', 'e-ticaret', 'dropshipping', 'etsy', 'shopify', 'trendyol'] },
];

// SADECE ÇERKEZKÖY VE KAPAKLI - JadencySocial'un hizmet bölgesi
const REGIONS: Region[] = [
  { name: 'Çerkezköy', center: { lat: 41.2697, lng: 28.0003 }, radius: 10000 },
  { name: 'Kapaklı', center: { lat: 41.2906, lng: 28.0228 }, radius: 8000 },
];

// ============================================
// UTILITIES
// ============================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[Telegram] Bot token or chat ID not configured, skipping notification');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });

    if (!response.ok) {
      console.error('[Telegram] Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('[Telegram] Error sending message:', error);
  }
}

// ============================================
// GOOGLE MAPS API CLIENT
// ============================================

class GoogleMapsClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchText(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<PlaceResult[]> {
    const params = new URLSearchParams({ query, key: this.apiKey });
    if (location) params.set('location', `${location.lat},${location.lng}`);
    if (radius) params.set('radius', radius.toString());

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error(`[Google Maps] API error: ${data.status}`);
        return [];
      }
      return data.results || [];
    } catch (error) {
      console.error('[Google Maps] searchText error:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    const fields = ['place_id', 'name', 'formatted_address', 'vicinity', 'geometry', 'rating',
      'user_ratings_total', 'price_level', 'types', 'opening_hours', 'photos', 'url',
      'website', 'formatted_phone_number', 'international_phone_number'].join(',');

    const params = new URLSearchParams({ place_id: placeId, key: this.apiKey, fields });

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error(`[Google Maps] Details API error: ${data.status}`);
        return null;
      }
      return data.result;
    } catch (error) {
      console.error('[Google Maps] getPlaceDetails error:', error);
      return null;
    }
  }
}

// ============================================
// WEBSITE AUDITOR (fetch-based, no Playwright needed for basic audit)
// ============================================

class WebsiteAuditor {
  private timeout: number;

  constructor(timeout: number = 30000) {
    this.timeout = timeout;
  }

  async audit(url: string): Promise<WebsiteAudit> {
    const baseAudit: WebsiteAudit = {
      url,
      exists: false,
      sslValid: false,
      hasContactPage: false,
      emailAddresses: [],
      phoneNumbers: [],
      socialLinks: {},
      technologies: [],
      auditTimestamp: new Date().toISOString(),
    };

    try {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      const isHttps = normalizedUrl.startsWith('https://');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(normalizedUrl, {
          signal: controller.signal,
          redirect: 'follow',
        });

        clearTimeout(timeoutId);

        if (!response.ok && response.status !== 301 && response.status !== 302) {
          return { ...baseAudit, error: `HTTP ${response.status}` };
        }

        baseAudit.exists = true;
        baseAudit.sslValid = isHttps;

        const html = await response.text();
        baseAudit.title = this.extractTitle(html);
        baseAudit.metaDescription = this.extractMetaDescription(html);
        baseAudit.hasContactPage = this.checkContactPage(html);
        baseAudit.emailAddresses = this.extractEmails(html);
        baseAudit.phoneNumbers = this.extractPhones(html);
        baseAudit.socialLinks = this.extractSocialLinks(html);
        baseAudit.technologies = this.detectTechnologies(html);

        return baseAudit;
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        return { ...baseAudit, error: fetchError instanceof Error ? fetchError.message : 'Unknown error' };
      }
    } catch (error: unknown) {
      return { ...baseAudit, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private extractTitle(html: string): string | undefined {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : undefined;
  }

  private extractMetaDescription(html: string): string | undefined {
    const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (match) return match[1];
    const altMatch = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    return altMatch ? altMatch[1] : undefined;
  }

  private checkContactPage(html: string): boolean {
    const lower = html.toLowerCase();
    return lower.includes('contact') || lower.includes('iletisim') || lower.includes('contact-us');
  }

  private extractEmails(html: string): string[] {
    const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = html.match(pattern) || [];
    return [...new Set(matches)].filter(e => !e.includes('example.com') && !e.includes('localhost'));
  }

  private extractPhones(html: string): string[] {
    const pattern = /(?:\+90|0)[-\s]?[0-9]{2,4}[-\s]?[0-9]{3,4}[-\s]?[0-9]{4}/g;
    return [...new Set(html.match(pattern) || [])];
  }

  private extractSocialLinks(html: string): Record<string, string> {
    const links: Record<string, string> = {};
    const patterns: Record<string, RegExp> = {
      facebook: /facebook\.com\/[a-zA-Z0-9._-]+/gi,
      instagram: /(?:instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+/gi,
      linkedin: /linkedin\.com\/in\/[a-zA-Z0-9._-]+/gi,
      youtube: /youtube\.com\/@?[a-zA-Z0-9._-]+/gi,
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      const match = html.match(pattern);
      if (match && match[0]) {
        links[platform] = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
      }
    }
    return links;
  }

  private detectTechnologies(html: string): string[] {
    const technologies: string[] = [];
    const patterns: Record<string, RegExp> = {
      WordPress: /wp-content|wp-includes|WordPress/i,
      Shopify: /cdn\.shopify\.com|shopify/i,
      React: /react|react-dom|_react_/i,
      Vue: /vue|vue\.js/i,
      Bootstrap: /bootstrap/i,
      jQuery: /jquery/i,
      GoogleAnalytics: /google-analytics|gtag|ga\(/i,
      Cloudflare: /cloudflare|_cf/i,
    };

    for (const [tech, pattern] of Object.entries(patterns)) {
      if (pattern.test(html)) technologies.push(tech);
    }
    return technologies;
  }
}

// ============================================
// SCOUT AGENT
// ============================================

class ScoutAgent {
  private mapsClient: GoogleMapsClient;
  private auditor: WebsiteAuditor;
  private errors: string[] = [];
  private leadsFound: number = 0;
  private leadsSaved: number = 0;

  constructor(config: Config) {
    this.mapsClient = new GoogleMapsClient(config.googleMapsApiKey);
    this.auditor = new WebsiteAuditor();
  }

  async run(): Promise<{
    sectorsScanned: string[];
    regionsScanned: string[];
    leadsFound: number;
    leadsSaved: number;
    errors: string[];
    priorityLeads: { business_name: string; district: string | null; website: string | null }[];
  }> {
    const startTime = new Date().toISOString();
    const regionsScanned: string[] = [];

    console.log('===========================================');
    console.log(`[Scout Agent] Started at ${startTime}`);
    console.log(`[Scout Agent] Regions: ${REGIONS.map(r => r.name).join(', ')}`);
    console.log(`[Scout Agent] Sectors: ${SECTORS.map(s => s.name).join(', ')}`);
    console.log('===========================================');

    // Tüm sektörleri tara (aylık döngüde hepsi taranacak)
    for (const sector of SECTORS) {
      console.log(`\n[Scout Agent] === Scanning sector: ${sector.name} ===`);

      for (const region of REGIONS) {
        console.log(`\n[Scout Agent] Scanning ${region.name} for ${sector.name}...`);
        if (!regionsScanned.includes(region.name)) {
          regionsScanned.push(region.name);
        }

        try {
          await this.scanRegion(region, sector);
        } catch (error) {
          const errorMsg = `Region ${region.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(`[Scout Agent] Error: ${errorMsg}`);
          this.errors.push(errorMsg);
        }

        await sleep(2000);
      }
    }

    const priorityLeads = this.getPriorityLeads(5);

    console.log('\n===========================================');
    console.log('[Scout Agent] Summary:');
    console.log(`  Sectors: ${SECTORS.map(s => s.name).join(', ')}`);
    console.log(`  Regions: ${regionsScanned.join(', ')}`);
    console.log(`  Leads found: ${this.leadsFound}`);
    console.log(`  Leads saved: ${this.leadsSaved}`);
    console.log(`  Errors: ${this.errors.length}`);
    console.log(`  Priority leads (no website): ${priorityLeads.length}`);
    console.log('===========================================');

    return {
      sectorsScanned: SECTORS.map(s => s.name),
      regionsScanned,
      leadsFound: this.leadsFound,
      leadsSaved: this.leadsSaved,
      errors: this.errors,
      priorityLeads,
    };
  }

  private getPriorityLeads(limit: number): { business_name: string; district: string | null; website: string | null }[] {
    const db = getDb();
    return db.prepare(`
      SELECT business_name, district, website FROM leads
      WHERE website IS NULL OR website = ''
      ORDER BY created_at DESC LIMIT ?
    `).all(limit) as { business_name: string; district: string | null; website: string | null }[];
  }

  private async scanRegion(region: Region, sector: SectorConfig): Promise<void> {
    console.log(`[Scout Agent] Searching for ${sector.name} in ${region.name}...`);

    for (const keyword of sector.keywords) {
      const query = `${keyword} ${region.name} Tekirdağ`;
      console.log(`[Scout Agent] Query: "${query}"`);

      const results = await this.mapsClient.searchText(query, region.center, region.radius);
      console.log(`[Scout Agent] Found ${results.length} results`);

      for (const place of results) {
        this.leadsFound++;
        await this.processPlace(place, region.name, sector.name);
        await sleep(1000);
      }
    }
  }

  private async processPlace(place: PlaceResult, regionName: string, category: string): Promise<void> {
    const existing = getLeadByGooglePlaceId(place.place_id);
    if (existing) {
      console.log(`[Scout Agent] Skipping existing: ${place.name}`);
      return;
    }

    const details = await this.mapsClient.getPlaceDetails(place.place_id);

    let email: string | null = null;
    let phone: string | null = details?.formatted_phone_number || details?.international_phone_number || null;
    let website = details?.website || place.website || null;

    if (website) {
      try {
        const audit = await this.auditor.audit(website);
        if (audit.emailAddresses.length > 0) email = audit.emailAddresses[0];
        if (audit.phoneNumbers.length > 0 && !phone) phone = audit.phoneNumbers[0];
      } catch (error) {
        console.error(`[Scout Agent] Website audit failed for ${website}:`, error);
      }
    }

    const lead: LeadInsert = {
      business_name: place.name,
      phone,
      email,
      website,
      address: place.formatted_address || details?.formatted_address || '',
      city: 'Tekirdağ',
      district: regionName,
      google_place_id: place.place_id,
      google_maps_url: place.url || null,
      instagram_handle: null,
      facebook_url: null,
      linkedin_url: null,
      business_type: category,
      source: 'google_places',
      status: 'new',
    };

    try {
      createLead(lead);
      this.leadsSaved++;
      console.log(`[Scout Agent] Saved: ${lead.business_name} (${regionName})`);
    } catch (error) {
      const errorMsg = `Failed to save ${place.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`[Scout Agent] ${errorMsg}`);
      this.errors.push(errorMsg);
    }
  }
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('[Scout Agent] Error: GOOGLE_MAPS_API_KEY not found in environment');
    process.exit(1);
  }

  const config: Config = {
    googleMapsApiKey: apiKey,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
  };

  const agent = new ScoutAgent(config);

  try {
    const result = await agent.run();

    const message = `
<b>Scout Agent - Aylık Tarama Raporu</b>

<i>Tarih:</i> ${new Date().toLocaleDateString('tr-TR')}
<i>Bölgeler:</i> ${result.regionsScanned.join(', ')}
<i>Sektörler:</i> ${result.sectorsScanned.length}

<b>Sonuçlar:</b>
- Bulunan: ${result.leadsFound}
- Kaydedilen: ${result.leadsSaved}
- Hatalar: ${result.errors.length}

${result.priorityLeads.length > 0 ? `<b>Öncelikli Leadler (web sitesi yok):</b>\n${result.priorityLeads.map((l: { business_name: string; district: string | null }) => `• ${l.business_name} (${l.district})`).join('\n')}` : ''}
    `.trim();

    await sendTelegramMessage(message);
  } catch (error) {
    console.error('[Scout Agent] Fatal error:', error);
    await sendTelegramMessage(`[Scout Agent] Kritik hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    process.exit(1);
  }
}

main().catch(console.error);

export { ScoutAgent };
