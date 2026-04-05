import axios, { AxiosInstance } from 'axios';

// ============================================
// TYPES
// ============================================

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types?: string[];
  opening_hours?: {
    open_now: boolean;
    periods?: OpeningPeriod[];
    weekday_text?: string[];
  };
  photos?: PhotoReference[];
  url?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  reviews?: PlaceReview[];
}

export interface OpeningPeriod {
  open: {
    day: number;
    time: string;
    hours?: number;
    minutes?: number;
  };
  close?: {
    day: number;
    time: string;
    hours?: number;
    minutes?: number;
  };
}

export interface PhotoReference {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

export interface PlaceReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlaceDetails extends PlaceResult {
  reviews?: PlaceReview[];
  photos?: PhotoReference[];
  address_components?: AddressComponent[];
  url?: string;
  utc_offset?: number;
  alt_ids?: Record<string, unknown>;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface TextSearchResult {
  places: PlaceResult[];
  next_page_token?: string;
  status: string;
}

export interface NearbySearchResult {
  places: PlaceResult[];
  next_page_token?: string;
  status: string;
}

export interface PhotoResult {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

// ============================================
// GOOGLE MAPS API WRAPPER
// ============================================

export class GoogleMapsClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api',
      timeout: 30000,
    });
  }

  /**
   * Search for places near a location using the Places API
   */
  async searchNearby(
    lat: number,
    lng: number,
    radiusMeters: number,
    type?: string
  ): Promise<PlaceResult[]> {
    const params: Record<string, string | number> = {
      location: `${lat},${lng}`,
      radius: radiusMeters,
      key: this.apiKey,
    };

    if (type) {
      params.type = type;
    }

    try {
      const response = await this.client.get<NearbySearchResult>(
        '/place/nearbysearch/json',
        { params }
      );

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        console.error(`Google Maps API error: ${response.data.status}`);
        return [];
      }

      return response.data.places || [];
    } catch (error) {
      console.error('searchNearby error:', error);
      return [];
    }
  }

  /**
   * Search for places using text query
   */
  async searchText(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<PlaceResult[]> {
    const params: Record<string, string | number> = {
      query,
      key: this.apiKey,
    };

    if (location) {
      params.location = `${location.lat},${location.lng}`;
    }

    if (radius) {
      params.radius = radius;
    }

    try {
      const response = await this.client.get<TextSearchResult>(
        '/place/textsearch/json',
        { params }
      );

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        console.error(`Google Maps API error: ${response.data.status}`);
        return [];
      }

      return response.data.places || [];
    } catch (error) {
      console.error('searchText error:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const response = await this.client.get<{ result: PlaceDetails; status: string }>(
        '/place/details/json',
        {
          params: {
            place_id: placeId,
            key: this.apiKey,
            fields: [
              'place_id',
              'name',
              'formatted_address',
              'vicinity',
              'geometry',
              'rating',
              'user_ratings_total',
              'price_level',
              'types',
              'opening_hours',
              'photos',
              'reviews',
              'url',
              'website',
              'formatted_phone_number',
              'international_phone_number',
              'address_components',
              'utc_offset',
              'alt_ids',
            ].join(','),
          },
        }
      );

      if (response.data.status !== 'OK') {
        console.error(`getPlaceDetails error: ${response.data.status}`);
        return null;
      }

      return response.data.result;
    } catch (error) {
      console.error('getPlaceDetails error:', error);
      return null;
    }
  }

  /**
   * Get photo URLs from a place
   */
  async getPlacePhotos(placeId: string): Promise<PhotoResult[]> {
    try {
      const response = await this.client.get<{ result: { photos: PhotoResult[] }; status: string }>(
        '/place/details/json',
        {
          params: {
            place_id: placeId,
            key: this.apiKey,
            fields: 'photos',
          },
        }
      );

      if (response.data.status !== 'OK') {
        return [];
      }

      return response.data.result?.photos || [];
    } catch (error) {
      console.error('getPlacePhotos error:', error);
      return [];
    }
  }

  /**
   * Get photo URL for display
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Rate limited wrapper for API calls
   */
  async withRateLimit<T>(
    fn: () => Promise<T>,
    delayMs: number = 1000,
    retries: number = 3
  ): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await fn();
        await this.sleep(delayMs);
        return result;
      } catch (error: unknown) {
        const isRateLimit =
          axios.isAxiosError(error) &&
          error.response?.status === 429;

        if (isRateLimit && attempt < retries - 1) {
          const waitTime = (attempt + 1) * delayMs * 2;
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry...`);
          await this.sleep(waitTime);
        } else if (attempt === retries - 1) {
          throw error;
        }
      }
    }
    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createGoogleMapsClient(apiKey: string): GoogleMapsClient {
  return new GoogleMapsClient(apiKey);
}

// ============================================
// HELPER: Turkish Business Type Mapping
// ============================================

export const TURKISH_BUSINESS_TYPES: Record<string, string> = {
  'restaurant': 'restaurant',
  'cafe': 'cafe',
  'bar': 'bar',
  'hotel': 'lodging',
  'pansiyon': 'lodging',
  'shop': 'store',
  'retail': 'store',
  'beauty_salon': 'beauty_salon',
  'kuaför': 'hair_care',
  'auto_service': 'car_repair',
  'garaj': 'car_repair',
  'construction': 'general_contractor',
  'inşaat': 'general_contractor',
  'healthcare': 'hospital',
  'sağlık': 'hospital',
  'education': 'school',
  'eğitim': 'school',
  'law': 'lawyer',
  'hukuk': 'lawyer',
  'real_estate': 'real_estate_agency',
  'emlak': 'real_estate_agency',
};

// ============================================
// HELPER: Region Coordinates
// ============================================

export interface Region {
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
}

export const TARGET_REGIONS: Region[] = [
  {
    name: 'Tekirdağ Merkez',
    center: { lat: 40.9783, lng: 27.5145 },
    radius: 15000,
  },
  {
    name: 'Çerkezköy',
    center: { lat: 41.2697, lng: 28.0003 },
    radius: 10000,
  },
  {
    name: 'Kapaklı',
    center: { lat: 41.2906, lng: 28.0228 },
    radius: 8000,
  },
  {
    name: 'Saray',
    center: { lat: 41.4497, lng: 28.1614 },
    radius: 8000,
  },
  {
    name: 'Çorlu',
    center: { lat: 41.1681, lng: 27.8028 },
    radius: 12000,
  },
];

// ============================================
// EXPORTS
// ============================================

export default GoogleMapsClient;
