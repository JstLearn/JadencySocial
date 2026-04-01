export interface ServicePackage {
  name: string;
  nameEn: string;
  price: string;
  duration: string;
  deliverables: string[];
}

export interface ServiceData {
  key: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
  highlight: string;
  packages: ServicePackage[];
}

const brandIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const webIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>
);

const ecommerceIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const adsIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const socialIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
  </svg>
);

const videoIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="15" height="12" rx="2"/>
    <path d="M17 10l5-3v10l-5-3V10z"/>
  </svg>
);

export const servicesData: ServiceData[] = [
  {
    key: 'brand',
    title: 'Marka Kimliği',
    desc: 'Markanızın ruhunu yansıtan benzersiz tasarım sistemi. Logo, renk paleti, tipografi ve sosyal medya kitleri ile kurumsal kimliğinizi profesyonel düzeyde oluşturuyoruz.',
    color: '#FFFFFF',
    icon: brandIcon,
    highlight: '4 Paket Seçeneği',
    packages: [
      {
        name: 'Startup',
        nameEn: 'Startup',
        price: '₺4.500',
        duration: '5-7 İş Günü',
        deliverables: [
          '1 Adet Özgün Logo Tasarımı',
          '3 Adet Logo Varyasyonu (Renkli, Siyah-Beyaz, Tek Renk)',
          'Renk Paleti (Pantone, CMYK, RGB, HEX Kodları)',
          '2 Font Ailesi (Başlık & Gövde)',
          'Logo Kullanım Kılavuzu (PDF)',
          'Sosyal Medya Profil & Kapak Görselleri',
          'Favicon & App Icon Tasarımı',
          'E-posta İmza Tasarımı',
        ],
      },
      {
        name: 'Kurumsal',
        nameEn: 'Corporate',
        price: '₺8.500',
        duration: '10-15 İş Günü',
        deliverables: [
          '1 Adet Özgün Logo Tasarımı',
          '6 Adet Logo Varyasyonu',
          'Detaylı Renk Paleti & Alternatif Renkleri',
          '3 Font Ailesi + Google Fonts Entegrasyonu',
          'Marka Kılavuzu (40+ Sayfa PDF)',
          'Sosyal Medya Kit (15+ Şablon)',
          'Kartvizit & Antetli Kağıt Tasarımı',
          'Favicon, App Icon & Favicon Paketi',
          'E-posta İmza & Mail Header Tasarımı',
          'PowerPoint / PDF Şablon Tasarımı',
        ],
      },
      {
        name: 'Premium',
        nameEn: 'Premium',
        price: '₺14.500',
        duration: '15-20 İş Günü',
        deliverables: [
          'Özgün Logo + Alt Marka / Alt Logo Sistemi',
          '10+ Logo Varyasyonu',
          'Tam Renk Paleti + Gradient Sistemi',
          '4+ Font Ailesi + Yazı Karakteri Optimizasyonu',
          'Premium Marka Kılavuzu (80+ Sayfa PDF)',
          'Sosyal Medya Kit (30+ Şablon)',
          'Video Intro/Outro Tasarımı',
          'Sosyal Medya İkon Paketi',
          'Ürün / Katalog Şablon Tasarımı',
          'Web Tasarım UI/UX Danışmanlığı',
          '3 Revizyon Turu',
        ],
      },
      {
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: '₺24.500',
        duration: '25-30 İş Günü',
        deliverables: [
          'Tüm Premium Özellikler',
          'Logo Animasyonu (Lottie / GIF)',
          'Mascot / İllüstrasyon Tasarımı',
          'Fotoğraf Stoku Aboneliği (1 Yıl)',
          'Marka Sözcüleri & Konuşma Tonu Kılavuzu',
          'Reklam Şablonları (Google, Meta, LinkedIn)',
          'LinkedIn Şirket Sayfası Optimizasyonu',
          'Marka Stratejisi & Konumlandırma Belgesi',
          'Sınırsız Revizyon',
          '6 Aylık Telefonla Destek',
        ],
      },
    ],
  },
  {
    key: 'web',
    title: 'Dijital Altyapı',
    desc: 'Domain, sunucu, DNS, Cloudflare ve kurumsal e-posta altyapısı. Web siteniz için teknik temeli sağlamak ve yönetmek.',
    color: '#CCCCCC',
    icon: webIcon,
    highlight: '4 Paket Seçeneği',
    packages: [
      {
        name: 'Startup',
        nameEn: 'Startup',
        price: '₺3.500',
        duration: '3-5 İş Günü',
        deliverables: [
          'Domain Kaydı (.com / .net / .org)',
          'DNS Yönetimi & Yönlendirmeler',
          'Cloudflare Kurulumu & Optimizasyonu',
          'Kurumsal E-posta Hesabı (5 Adet)',
          'SSL Sertifikası Kurulumu',
          'Temel Güvenlik Ayarları',
        ],
      },
      {
        name: 'Kurumsal',
        nameEn: 'Corporate',
        price: '₺7.500',
        duration: '7-10 İş Günü',
        deliverables: [
          'Domain Kaydı & Transfer',
          'Cloudflare Full Setup & CDN',
          'Kurumsal E-posta (20 Adet)',
          'Google Workspace Entegrasyonu',
          'Microsoft 365 Kurulumu',
          'Sunucu Monitoring & Backup',
          'SSL & Güvenlik Güncellemeleri',
          'Yıllık Domain & SSL Yönetimi',
        ],
      },
      {
        name: 'Premium',
        nameEn: 'Premium',
        price: '₺12.500',
        duration: '10-15 İş Günü',
        deliverables: [
          'Premium Domain Seçenekleri (.io, .co, .ai)',
          'Dedicated Cloudflare Kurulumu',
          'Sınırsız E-posta Hesabı',
          'Kurumsal E-posta Arşivleme',
          'Özel Nameserver Yapılandırması',
          'API Entegrasyonları (DNS, SSL)',
          'Web Sitesi Hız Optimizasyonu',
          'Aylık Teknik Raporlama',
          ' öncelikli Destek (5×8)',
        ],
      },
      {
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: '₺22.500',
        duration: '20-25 İş Günü',
        deliverables: [
          'Çoklu Domain Yönetimi (10+)',
          'Custom DNS Yapılandırması',
          'White-label DNS Servisleri',
          'Sınırsız E-posta + Exchange Server',
          'AI Destekli E-posta Güvenliği',
          'Özel Sunucu / VPS Kurulumu',
          'DevOps Pipeline Kurulumu',
          '7/24 Teknik Destek Hattı',
          'Yıllık Altyapı Denetimi',
        ],
      },
    ],
  },
  {
    key: 'ecommerce',
    title: 'E-Ticaret',
    desc: 'Google Merchant Center, Meta Business, Google Analytics 4 ve GTM kurulumu. Ürün feed\'lerinizi AI uyumlu yapılandırıyoruz.',
    color: '#888888',
    icon: ecommerceIcon,
    highlight: '4 Paket Seçeneği',
    packages: [
      {
        name: 'Startup',
        nameEn: 'Startup',
        price: '₺5.500',
        duration: '5-7 İş Günü',
        deliverables: [
          'Google Merchant Center Hesabı',
          'Temel Ürün Feed Kurulumu',
          'Meta Business Suite Başlangıç',
          'Facebook/Instagram Mağaza Entegrasyonu',
          'Google Analytics 4 Kurulumu',
          'Temel E-ticaret Hedefleri',
        ],
      },
      {
        name: 'Kurumsal',
        nameEn: 'Corporate',
        price: '₺10.500',
        duration: '10-15 İş Günü',
        deliverables: [
          'Google Merchant Center Full Setup',
          'Gelişmiş Ürün Feed Yapılandırması',
          'Meta Catalog Kurulumu & Entegrasyonu',
          'Instagram Shopping & Facebook Shop',
          'Google Tag Manager Kurulumu',
          'GA4 Gelişmiş E-ticaret Takibi',
          'Dönüşüm İzleme & Event Tracking',
          'Pixel Kurulumu & Hedefleme',
        ],
      },
      {
        name: 'Premium',
        nameEn: 'Premium',
        price: '₺18.500',
        duration: '15-20 İş Günü',
        deliverables: [
          'AI Uyumlu Ürün Veri Yapısı',
          'Dinamik Remarketing Feed\'leri',
          'Çoklu Dilli & Çoklu Para Birimi',
          'Entegre Stok & Fiyat Yönetimi',
          'Otomatik Fiyat Güncelleme Sistemleri',
          'Gelişmiş GA4 E-ticaret Raporları',
          'Müşteri Yolculuğu Analizi',
          'Sepet Terketme İzleme',
          'Lifetime Value (LTV) Takibi',
        ],
      },
      {
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: '₺32.500',
        duration: '25-30 İş Günü',
        deliverables: [
          'Tam Ölçekli E-ticaret Altyapısı',
          'Marketplace Entegrasyonları (Trendyol, N11, Hepsiburada)',
          'CRM Entegrasyonu & Müşteri Veri Platformu',
          'Otomatize Pazarlama Entegrasyonları',
          'Özel Dashboard & Raporlama Sistemi',
          'API Geliştirme & Özel Entegrasyonlar',
          'AI Tabanlı Ürün Öneri Sistemi',
          '7/24 Teknik Destek & Bakım',
        ],
      },
    ],
  },
  {
    key: 'ads',
    title: 'Reklam Stratejisi',
    desc: 'Cold audience, warm audience ve hot audience segmentasyonu ile Meta Ads, Google Ads reklam yönetimi ve haftalık optimizasyon.',
    color: '#AAAAAA',
    icon: adsIcon,
    highlight: '4 Reklam Bütçesi Seviyesi',
    packages: [
      {
        name: 'Startup',
        nameEn: 'Startup',
        price: '₺15.000/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Reklam Hesabı Kurulumu & Optimizasyonu',
          'Cold Audience Stratejisi',
          'A/B Test Kampanyaları (2 Adet)',
          'Haftalık Performans Raporu',
          'Bütçe: ₺15.000 - ₺50.000/ay',
          'Meta Ads (Facebook & Instagram)',
          'Google Ads (Search & Display)',
          'Hedef Kitle Araştırması',
          'Reklam Metin & Görsel Önerileri',
          'Haftalık 1 Saat Optimizasyon',
        ],
      },
      {
        name: 'Kurumsal',
        nameEn: 'Corporate',
        price: '₺35.000/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Tüm Startup Özellikleri',
          'Warm Audience Retargeting Stratejisi',
          'Dönüşüm Kampanyaları (4+ Adet)',
          'Google Ads Full Funnel',
          'Remarketing & Dynamic Ads',
          'Haftalık 2 Saat Optimizasyon',
          'Bütçe: ₺50.000 - ₺150.000/ay',
          'Landing Page Önerileri',
          'Maliyet & ROAS Analizi',
          'Aylık Strateji Toplantısı',
        ],
      },
      {
        name: 'Premium',
        nameEn: 'Premium',
        price: '₺75.000/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Tüm Kurumsal Özellikler',
          'Hot Audience VIP Retargeting',
          '6+ Eşzamanlı Kampanya',
          'Video & Carousel Ads Stratejisi',
          'Influencer Ads Entegrasyonu',
          'Haftalık 4 Saat Optimizasyon',
          'Bütçe: ₺150.000 - ₺500.000/ay',
          'Gelişmiş Hedefleme & Lookalike',
          'GMV & Satış Tahminlemesi',
          'Özel Raporlama Dashboard\'u',
          '2 Haftalık Strateji Review',
        ],
      },
      {
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: '₺150.000/ay+',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Tüm Premium Özellikler',
          'Tam Ölçekli Medya Planlaması',
          'Çoklu Hesap Yönetimi',
          'Tam Funnel Attribution Modeling',
          'Müşteri Yaşam Boyu Değer (CLV) Takibi',
          'Bütçe: ₺500.000+/ay',
          'Günlük Optimizasyon & Bidding',
          'Özel Algoritma Stratejileri',
          'API Entegrasyonları & Otomasyonlar',
          '7/24 Performans İzleme',
          'Aylık Yönetim Kurulu Sunumu',
        ],
      },
    ],
  },
  {
    key: 'social',
    title: 'Sosyal Medya',
    desc: 'Fotoğraf ve video prodüksiyonu, profesyonel edit, copywriting ve içerik planlaması. Esnek kapasite planları ile içerik üretimi.',
    color: '#999999',
    icon: socialIcon,
    highlight: '4 Paket Seçeneği',
    packages: [
      {
        name: 'Startup',
        nameEn: 'Startup',
        price: '₺8.500/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Aylık 8 Gönderi (Fotoğraf & Video)',
          'Profesyonel Fotoğraf Çekimi (2 Saat)',
          'Video Editing (4 Video)',
          'Copywriting (8 Caption)',
          'Hashtag Araştırması & Stratejisi',
          'Hikaye (Story) İçerikleri (12 Adet)',
          'Ayda 2 Canlı Yayın İçeriği',
          'Google Drive Üzerinden Paylaşım',
        ],
      },
      {
        name: 'Kurumsal',
        nameEn: 'Corporate',
        price: '₺15.000/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Aylık 16 Gönderi (Fotoğraf & Video)',
          'Profesyonel Fotoğraf Çekimi (4 Saat)',
          'Video Editing (8 Video)',
          'Copywriting (16 Caption)',
          'Reels & Short Video İçerikleri',
          'Hikaye (Story) İçerikleri (20 Adet)',
          'Ayda 4 Canlı Yayın İçeriği',
          'DM (Direkt Mesaj) Yönetimi',
          'Influencer İşbirliği Koordinasyonu',
        ],
      },
      {
        name: 'Premium',
        nameEn: 'Premium',
        price: '₺25.000/ay',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Aylık 24 Gönderi (Fotoğraf & Video)',
          'Profesyonel Fotoğraf Çekimi (8 Saat)',
          'Video Editing (16 Video)',
          'Copywriting (24 Caption)',
          '3 Ayda 1 Kurumsal Video Projesi',
          'Animasyonlu İçerikler (GIF/Motion)',
          'Mikhail (Story) & Röportaj İçerikleri',
          'Ayda 8 Canlı Yayın İçeriği',
          'Topluluk Yönetimi & Moderasyon',
          'Aylık Performans Raporu',
          'İçerik Takvimi Yönetimi',
        ],
      },
      {
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: '₺40.000/ay+',
        duration: 'Aylık Yönetim',
        deliverables: [
          'Sınırsız İçerik Üretimi',
          'Dedicated İçerik Ekibi (3 Kişi)',
          'Haftalık Fotoğraf Çekimi',
          'Sınırsız Video Editing',
          'AI Destekli İçerik Üretimi',
          'Çoklu Platform Yönetimi',
          'YouTube İçerik Stratejisi & Üretimi',
          'TikTok & Reels Strategisi',
          '7/24 Sosyal Medya Yönetimi',
          'Kriz Yönetimi & İtibar Takibi',
          'Özel Çekim & Prodüksiyon Stüdyosu',
        ],
      },
    ],
  },
  {
    key: 'video',
    title: 'Sinematik Video',
    desc: 'Tanıtım filmleri, dron çekimleri, kurumsal videolar ve ürün gösterimleri. Profesyonel sinematik prodüksiyon hizmetleri.',
    color: '#BBBBBB',
    icon: videoIcon,
    highlight: 'Per Video Fiyatlandırma',
    packages: [
      {
        name: 'Tanıtım Filmi',
        nameEn: 'Promo Video',
        price: '₺3.500 - ₺12.000',
        duration: '5-10 İş Günü',
        deliverables: [
          'Senaryo & Storyboard Hazırlığı',
          'Profesyonel Kamera Çekimi',
          'Görüntü Renk Düzeltme (Color Grading)',
          'Profesyonel Seslendirme (opsiyonel)',
          'Motion Graphics & Alt Üçüncü Grafikler',
          'Telif Müzik Seçimi & Lisansı',
          '2 Revizyon Turu',
          '4K Çözünürlük & Sosyal Medya Versiyonları',
          'Tüm Raw Footage Teslimi',
        ],
      },
      {
        name: 'Dron Çekimi',
        nameEn: 'Drone Footage',
        price: '₺5.000 - ₺18.000',
        duration: '3-7 İş Günü',
        deliverables: [
          'SHA 1047 İzin Belgesi (Gerekliyse)',
          'Profesyonel Dron (4K/6K) Çekimi',
          'Liyakat Alanı Belirleme & Planlama',
          'Cinematic Hareketli Çekimler',
          'Hava Koşulları Planlaması',
          'Post-Prodüksiyon Renk Düzeltme',
          'Gimbal Stabilizasyonu',
          '4K Çözünürlük Teslim',
          'Sosyal Medya Versiyonları',
        ],
      },
      {
        name: 'Kurumsal Film',
        nameEn: 'Corporate Film',
        price: '₺8.000 - ₺30.000',
        duration: '10-20 İş Günü',
        deliverables: [
          'Kurumsal Kimlik & Değerler Analizi',
          'Detaylı Senaryo & Storyboard',
          'Multi-Gün Çekim Planlaması',
          'Profesyonel Ekip & Ekipman',
          'Oyuncu / Çalışan Yönlendirmesi',
          'Mekansal Ses Kaydı',
          'Premium Post-Prodüksiyon',
          'Alt Müzik Bestesi / Lisansı',
          'İmza / Outro Tasarımı',
          'Sınırsız Revizyon',
          'Tam Prodüksiyon Dosyaları',
        ],
      },
      {
        name: 'Ürün Video',
        nameEn: 'Product Video',
        price: '₺2.500 - ₺8.000',
        duration: '3-7 İş Günü',
        deliverables: [
          'Ürün Analizi & Çekim Planı',
          'Stüdyo Çekimi (White/Black Background)',
          'Lifestyle & Kullanım Sahneleri',
          'Close-up & Detay Çekimleri',
          'Profesyonel Ürün Retouching',
          'Animasyonlu Özellik Gösterimi',
          'Alt Müzik & Ses Efektleri',
          'Sosyal Medya Versiyonları (9:16, 1:1, 16:9)',
          'Ürün Görseli Fotoğraf Çekimi (10 Adet)',
        ],
      },
    ],
  },
];

export const getServiceData = (key: string): ServiceData | undefined => {
  return servicesData.find((s) => s.key === key);
};
