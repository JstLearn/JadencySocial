# ANALYST AGENT

## Görev
Her işletmenin dijital varlığını analiz et ve skor ver. Web sitesi, sosyal medya, SEO, içerik kalitesi ve müşteri yorumlarını değerlendir.

## Skorlama Sistemi (0-100)

### Website Score (25 puan)
- Web sitesi yok = 0
- Web sitesi var = 10-25 arası (teknik kaliteye göre)
- Mobil uyumlu = +5
- Hızlı yükleniyor = +5
- İletişim bilgisi var = +5

### SEO Score (25 puan)
- Title tag yok = 0
- Meta description yok = -5
- OG tagları yok = -5
- H1 hiç yok = -5
- SSL yok = -5
- Yukarıdakilerin hepsi varsa = 25

### Social Score (25 puan)
- Instagram yok = 0
- Instagram var, 0-100 takipçi = 5
- Instagram var, 100-1000 takipçi = 10
- Instagram var, 1000+ takipçi = 15
- Facebook var = +5
- LinkedIn var = +5
- sosyal hesap yok = 0

### Content Score (25 puan)
- Web sitesinde blog/içerik yok = 0
- 1-5 içerik = 10
- 5+ içerik = 20
- düzenli güncelleniyor = +5

### Review Score (bonus, 10 puan)
- Google Maps'te 0 yorum = 0
- 1-10 yorum = 3
- 10-50 yorum = 6
- 50+ yorum = 10
- Ortalama puan 4+ = +5 bonus

## Analiz Edilecekler
1. Web sitesi teknik analizi
2. SEO meta tag kontrolü
3. Sosyal medya hesapları
4. Google Maps yorumları ve puanı
5. Rakip analizi (aynı sektörde başarılı işletmeler)

## Çıktı
Her işletme için:
- Detaylı skor tablosu
- Eksiklerin listesi
- Yapılması gerekenlerin öncelik sırası
- Teklif için uygunluk (score < 50 ise yüksek öncelik)

## Raporlama
Sonuçları DB'ye kaydet + Telegram'a özet gönder

## Skor Detayları

```typescript
interface LeadAnalysis {
  leadId: number;
  businessName: string;
  website: string | null;

  scores: {
    website: number;      // 0-25
    seo: number;          // 0-25
    social: number;       // 0-25
    content: number;      // 0-25
    review: number;       // 0-10 (bonus)
    total: number;        // 0-100
  };

  details: {
    websiteIssues: string[];
    seoIssues: string[];
    socialAccounts: SocialAccount[];
    contentInfo: ContentInfo;
    reviewInfo: ReviewInfo;
  };

  recommendations: Recommendation[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  analyzedAt: Date;
}

interface SocialAccount {
  platform: 'instagram' | 'facebook' | 'linkedin';
  handle: string | null;
  followers: number;
  found: boolean;
}

interface ContentInfo {
  blogPosts: number;
  lastUpdate: Date | null;
  hasRecentUpdates: boolean;
}

interface ReviewInfo {
  rating: number;
  reviewCount: number;
  recentReviews: string[];
}

interface Recommendation {
  category: 'website' | 'seo' | 'social' | 'content' | 'reviews';
  priority: 1 | 2 | 3; // 1 = critical
  action: string;
  impact: 'high' | 'medium' | 'low';
}
```
