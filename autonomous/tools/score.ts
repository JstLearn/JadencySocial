/**
 * Dijital Skor Hesaplama
 *
 * Bir işletmenin dijital olgunluk seviyesini hesaplar.
 * Yüksek skor = daha önce dijitale yatırım yapmış = müşteri adayı
 */

export interface BusinessDigitalProfile {
  // Web varlığı
  hasWebsite: boolean;
  websiteQuality: number; // 0-100
  hasSSL: boolean;
  isMobileFriendly: boolean;
  hasContactPage: boolean;
  hasOnlineBooking: boolean;

  // Sosyal medya
  hasInstagram: boolean;
  instagramFollowers: number;
  hasFacebook: boolean;
  hasLinkedIn: boolean;
  hasTwitter: boolean;

  // İtibar
  googleRating: number | null; // 1-5
  reviewCount: number | null;
  hasTrustindex: boolean;
  hasGoogleReviews: boolean;

  // Teknik altyapı
  hasWhatsApp: boolean;
  hasEmailMarketing: boolean;
  hasBlog: boolean;
}

export interface DigitalScoreResult {
  totalScore: number; // 0-100
  websiteScore: number; // 0-30
  socialScore: number; // 0-25
  reputationScore: number; // 0-25
  infrastructureScore: number; // 0-20
  tier: 'premium' | 'active' | 'basic' | 'none';
  insights: string[];
  recommendations: string[];
}

const SCORING = {
  // Website scoring (30 puan)
  website: {
    exists: 10,
    quality: 10, // title, description, OG tags
    ssl: 5,
    mobileFriendly: 3,
    contactPage: 2,
  },

  // Sosyal medya scoring (25 puan)
  social: {
    instagram: 10,
    instagramFollowersBonus: 5, // >1000 takipçi
    facebook: 5,
    linkedIn: 3,
    twitter: 2,
  },

  // İtibar scoring (25 puan)
  reputation: {
    rating4Plus: 10,
    rating45Plus: 5,
    rating5: 3,
    reviewCount20Plus: 5,
    trustindex: 2,
  },

  // Altyapı scoring (20 puan)
  infrastructure: {
    whatsapp: 8,
    onlineBooking: 7,
    emailMarketing: 3,
    blog: 2,
  },
};

export function calculateDigitalScore(profile: BusinessDigitalProfile): DigitalScoreResult {
  const insights: string[] = [];
  const recommendations: string[] = [];

  let websiteScore = 0;
  let socialScore = 0;
  let reputationScore = 0;
  let infrastructureScore = 0;

  // === WEBSITE SCORING (30 puan) ===
  if (profile.hasWebsite) {
    websiteScore += SCORING.website.exists;

    if (profile.websiteQuality >= 50) {
      websiteScore += SCORING.website.quality;
    } else if (profile.websiteQuality >= 30) {
      websiteScore += 5;
    }

    if (profile.hasSSL) {
      websiteScore += SCORING.website.ssl;
    }

    if (profile.isMobileFriendly) {
      websiteScore += SCORING.website.mobileFriendly;
    }

    if (profile.hasContactPage) {
      websiteScore += SCORING.website.contactPage;
    }

    if (profile.hasOnlineBooking) {
      websiteScore += 3; // Bonus
    }
  }

  // === SOCIAL SCORING (25 puan) ===
  if (profile.hasInstagram) {
    socialScore += SCORING.social.instagram;

    if (profile.instagramFollowers > 1000) {
      socialScore += SCORING.social.instagramFollowersBonus;
      insights.push(`${profile.instagramFollowers} Instagram takipçisi - aktif bir kitle`);
    }
  }

  if (profile.hasFacebook) {
    socialScore += SCORING.social.facebook;
  }

  if (profile.hasLinkedIn) {
    socialScore += SCORING.social.linkedIn;
  }

  if (profile.hasTwitter) {
    socialScore += SCORING.social.twitter;
  }

  // === REPUTATION SCORING (25 puan) ===
  if (profile.googleRating !== null) {
    if (profile.googleRating >= 4.5) {
      reputationScore += SCORING.reputation.rating45Plus + SCORING.reputation.rating4Plus;
      insights.push(`${profile.googleRating} Google puanı - kaliteli hizmet`);
    } else if (profile.googleRating >= 4.0) {
      reputationScore += SCORING.reputation.rating4Plus;
    }

    if (profile.reviewCount !== null && profile.reviewCount >= 20) {
      reputationScore += SCORING.reputation.reviewCount20Plus;
      insights.push(`${profile.reviewCount} Google yorumu - aktif müşteri memnuniyeti`);
    }
  }

  if (profile.hasTrustindex) {
    reputationScore += SCORING.reputation.trustindex;
    insights.push('Trustindex kullanıyor - itibar yönetimi biliyor');
  }

  // === INFRASTRUCTURE SCORING (20 puan) ===
  if (profile.hasWhatsApp) {
    infrastructureScore += SCORING.infrastructure.whatsapp;
    insights.push('WhatsApp entegrasyonu var - müşteri iletişimine açık');
  }

  if (profile.hasOnlineBooking) {
    infrastructureScore += SCORING.infrastructure.onlineBooking;
  }

  if (profile.hasEmailMarketing) {
    infrastructureScore += SCORING.infrastructure.emailMarketing;
  }

  if (profile.hasBlog) {
    infrastructureScore += SCORING.infrastructure.blog;
  }

  // === TOTAL SCORE ===
  const totalScore = websiteScore + socialScore + reputationScore + infrastructureScore;

  // === TIER BELIRLEME ===
  let tier: DigitalScoreResult['tier'];
  if (totalScore >= 70) {
    tier = 'premium';
  } else if (totalScore >= 45) {
    tier = 'active';
  } else if (totalScore >= 20) {
    tier = 'basic';
  } else {
    tier = 'none';
  }

  // === RECOMMENDATIONS ===
  if (!profile.hasWebsite) {
    recommendations.push('Web sitesi yok - ilk adım olarak profesyonel site önerisi');
  } else if (!profile.hasSSL) {
    recommendations.push('SSL sertifikası yok - güvenlik için zorunlu');
  }

  if (!profile.hasInstagram) {
    recommendations.push('Instagram hesabı yok - görsel pazarlama için gerekli');
  }

  if (profile.googleRating !== null && profile.googleRating < 4.0) {
    recommendations.push('Google puanı düşük - itibar yönetimi eğitimi gerekli');
  }

  if (!profile.hasOnlineBooking && profile.hasWebsite) {
    recommendations.push('Online randevu sistemi yok - dönüşüm için kritik');
  }

  if (!profile.hasWhatsApp) {
    recommendations.push('WhatsApp butonu yok - müşteri iletişimini kolaylaştırır');
  }

  return {
    totalScore: Math.min(100, totalScore),
    websiteScore: Math.min(30, websiteScore),
    socialScore: Math.min(25, socialScore),
    reputationScore: Math.min(25, reputationScore),
    infrastructureScore: Math.min(20, infrastructureScore),
    tier,
    insights,
    recommendations,
  };
}

/**
 * Website quality score hesapla
 */
export function calculateWebsiteQuality(data: {
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasOgTags: boolean;
  hasH1: boolean;
  hasContactInfo: boolean;
}): number {
  let score = 0;

  if (data.hasTitle) score += 20;
  if (data.hasMetaDescription) score += 20;
  if (data.hasOgTags) score += 25;
  if (data.hasH1) score += 15;
  if (data.hasContactInfo) score += 20;

  return score;
}

/**
 * Analiz verilerinden Dijital Skor oluştur
 */
export function buildProfileFromAnalysis(analysis: {
  website_score: number | null;
  seo_score: number | null;
  social_score: number | null;
  content_score: number | null;
  has_whatsapp?: boolean;
  has_online_booking?: boolean;
  has_email_marketing?: boolean;
  has_blog?: boolean;
  google_rating?: number | null;
  review_count?: number | null;
  has_trustindex?: boolean;
}): BusinessDigitalProfile {
  return {
    hasWebsite: analysis.website_score !== null && analysis.website_score > 0,
    websiteQuality: analysis.website_score || 0,
    hasSSL: (analysis.seo_score || 0) > 0, // Basit heuristic
    isMobileFriendly: (analysis.content_score || 0) > 50, // Basit heuristic
    hasContactPage: (analysis.content_score || 0) > 30,
    hasOnlineBooking: analysis.has_online_booking || false,
    hasInstagram: (analysis.social_score || 0) > 0,
    instagramFollowers: 0, // Social checker'dan gelmeli
    hasFacebook: (analysis.social_score || 0) > 20,
    hasLinkedIn: (analysis.social_score || 0) > 40,
    hasTwitter: false,
    googleRating: analysis.google_rating || null,
    reviewCount: analysis.review_count || null,
    hasTrustindex: analysis.has_trustindex || false,
    hasGoogleReviews: analysis.review_count !== null && analysis.review_count > 0,
    hasWhatsApp: analysis.has_whatsapp || false,
    hasEmailMarketing: analysis.has_email_marketing || false,
    hasBlog: analysis.has_blog || false,
  };
}
