export interface ServicePackage {
  name: string;
  nameEn: string;
  price: string;
  priceNote?: string;
  duration: string;
  deliverables: string[];
  isMonthly?: boolean;
  isOptional?: boolean;
  highlight?: boolean;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  key: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  fullDescription?: string;
  fullDescriptionEn?: string;
  color: string;
  icon: React.ReactNode;
  highlight: string;
  benefits?: string[];
  process?: ServiceProcessStep[];
  packages: ServicePackage[];
  faq?: ServiceFAQ[];
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
    title: 'Marka Kimliği ve Görsel Sistem Tasarımı',
    titleEn: 'Brand Identity and Visual System Design',
    desc: 'Logo, renk paleti, tipografi ve tüm kurumsal kimlik öğeleri ile profesyonel marka deneyimi.',
    descEn: 'Professional brand experience with logo, color palette, typography and all corporate identity elements.',
    fullDescription: 'Bu hizmet kapsamında markanızın dijital ve fiziksel ortamlarda kullanılacak görsel kimliği oluşturulur. Logo tasarımı, marka renk paleti, tipografi sistemi ve tüm iletişim kanallarında tutarlı kullanım için gerekli tasarım öğeleri hazırlanır.',
    fullDescriptionEn: 'This service covers the creation of your brand\'s visual identity for use in digital and physical environments. Logo design, brand color palette, typography system and all design elements needed for consistent use across all communication channels are prepared.',
    color: '#E8B86D',
    icon: brandIcon,
    highlight: '$499',
    benefits: [
      'Profesyonel görsel kimlik ile marka güvenilirliği artar',
      'Farklı platformlarda tutarlı temsil',
      'Dijital ve basılı tüm materyaller için kullanılabilir sistem',
      'Kolay tanınabilirlik ve akılda kalıcılık',
      'Profesyonel kartvizit ve sosyal medya görselleri dahil',
    ],
    process: [
      { title: 'Marka Analizi', description: 'Markanın faaliyet alanı, hedef kitle, konumlandırma ve sektördeki görsel dil analiz edilir.' },
      { title: 'Tasarım Yönünün Belirlenmesi', description: 'Logo stil yaklaşımı, renk karakteri ve tipografi yönü belirlenir.' },
      { title: 'Logo ve Görsel Sistem Tasarımı', description: 'Ana logo, alternatif varyasyonlar, ikon ve sembol versiyonları hazırlanır.' },
      { title: 'Marka Görsel Sisteminin Oluşturulması', description: 'Renk paleti, tipografi, sosyal medya görselleri, favicon ve kartvizit tasarımları hazırlanır.' },
      { title: 'Dosyaların Hazırlanması ve Teslim', description: 'Tüm tasarım dosyaları farklı formatlarda (PNG, SVG, PDF) teslim edilir.' },
    ],
    packages: [
      {
        name: 'Marka Kimliği Oluşturma',
        nameEn: 'Brand Identity Creation',
        price: '$499',
        duration: '2 Hafta',
        deliverables: [
          'Ana logo tasarımı',
          'Alternatif logo varyasyonları',
          'İkon / sembol versiyonları',
          'Yatay ve dikey logo versiyonları',
          'Siyah beyaz logo versiyonları',
          'Marka renk paleti oluşturulması',
          'Tipografi (font sistemi) belirlenmesi',
          'Sosyal medya profil görselleri',
          'Sosyal medya kapak görselleri',
          'Favicon (site ikonları)',
          'Kartvizit tasarım seti',
          'Temel marka kullanım kuralları',
          'Logo dosyaları (PNG / SVG / PDF)',
          'Renk kodları (HEX / RGB)',
          'Font önerileri',
          'Sosyal medya görsel setleri',
          'Marka kullanım kılavuzu (brand guideline)',
        ],
      },
    ],
    faq: [
      { question: 'Marka kimliği çalışması neleri kapsar?', answer: 'Logo, renk paleti, tipografi ve tüm kurumsal kimlik öğelerini kapsar. Web sitesi kurulumu ve sosyal medya yönetimi bu teklif kapsamında yer almaz.' },
      { question: 'Teslim süresi nedir?', answer: 'Ortalama teslim süresi 2 haftadır.' },
      { question: 'Revizyon hakkı var mı?', answer: 'Evet, tasarım sürecinde revizyon hakkı sunuyoruz.' },
      { question: 'Ek tasarım çalışmaları yapılabilir mi?', answer: 'Evet, talep edilmesi halinde ek tasarım çalışmaları ayrıca fiyatlandırılır.' },
    ],
  },
  {
    key: 'web',
    title: 'Dijital Altyapı ve Web Sitesi Kurulumu',
    titleEn: 'Digital Infrastructure and Website Setup',
    desc: 'Domain, DNS, Cloudflare, kurumsal e-posta ve modern web sitesi kurulumu.',
    descEn: 'Domain, DNS, Cloudflare, corporate email and modern website setup.',
    fullDescription: 'Bu hizmet kapsamında domain seçimi ve yapılandırması, DNS yönetimi, Cloudflare güvenlik ve performans ayarları, kurumsal e-posta altyapısı kurulumu ve modern bir web sitesinin hazırlanması yer alır.',
    fullDescriptionEn: 'This service includes domain selection and configuration, DNS management, Cloudflare security and performance settings, corporate email infrastructure setup, and preparing a modern website.',
    color: '#5BA4E6',
    icon: webIcon,
    highlight: '$329',
    benefits: [
      'SSL sertifikası ile güvenli bağlantı',
      'Hızlı yükleme süreleri',
      'Cloudflare koruması ile DDoS güvenliği',
      'Kurumsal e-posta ile profesyonel iletişim',
      'Modern ve responsive web sitesi',
    ],
    process: [
      { title: 'Planlama ve Domain', description: 'Domain analizi yapılır, uygun domain alınır ve DNS ayarları kurulur.' },
      { title: 'Güvenlik Yapılandırması', description: 'Cloudflare kurulumu, SSL sertifikası ve güvenlik ayarları yapılır.' },
      { title: 'E-posta Kurulumu', description: 'Kurumsal e-posta hesapları oluşturulur ve e-posta istemcileri ayarlanır.' },
      { title: 'Web Sitesi Kurulumu', description: 'Web sitesi tasarımı yapılır, içerikler yerleştirilir ve site yayına alınır.' },
    ],
    packages: [
      {
        name: 'Dijital Altyapı Kurulumu',
        nameEn: 'Digital Infrastructure Setup',
        price: '$329',
        duration: '1 Hafta',
        deliverables: [
          'Domain (alan adı) yapılandırması',
          'DNS ve güvenlik yapılandırması (Cloudflare)',
          'Kurumsal e-posta altyapısının kurulması',
          'Sunucu (VDS / hosting) yapılandırması',
          'SSL sertifikası kurulumu',
          '5 kurumsal e-posta hesabı',
        ],
      },
      {
        name: 'Web Sitesi Kurulumu',
        nameEn: 'Website Setup',
        price: '$499',
        duration: '2-3 Hafta',
        highlight: true,
        deliverables: [
          'Site sayfa yapısının oluşturulması',
          'Menü ve navigasyon yapısının hazırlanması',
          'Görsellerin ve içeriklerin yerleştirilmesi',
          'Sayfa düzenlerinin hazırlanması',
          'Site tasarımının markaya uygun düzenlenmesi',
          'Mobil uyumlu (responsive) tasarım',
          'SEO temel ayarları',
        ],
      },
    ],
    faq: [
      { question: 'Domain ücreti dahil mi?', answer: 'Domain yıllık yenileme ücreti hizmet bedeline dahil değildir.' },
      { question: 'E-posta hesabı sayısı ne kadar?', answer: 'Standart olarak 5 kurumsal e-posta hesabı oluşturuyoruz.' },
      { question: 'Web sitesi hangi platformda olacak?', answer: 'Modern web teknolojileri ile özel geliştirme veya WordPress/Tipi gibi CMS seçenekleri sunuyoruz.' },
    ],
  },
  {
    key: 'ecommerce',
    title: 'E-Ticaret Büyüme Altyapısı',
    titleEn: 'E-Commerce Growth Infrastructure',
    desc: 'Google, Meta ve Yapay Zeka uyumlu e-ticaret altyapısı ile reklam performansınızı artırın.',
    descEn: 'Increase your ad performance with Google, Meta and AI compatible e-commerce infrastructure.',
    fullDescription: 'E-ticaret sitenizin sadece çalışması yeterli değil. Reklam platformlarıyla doğru veri paylaşması, yapay zeka motorlarının içeriğinizi anlaması ve gelecekteki teknolojilere hazır olması gerekir.',
    fullDescriptionEn: 'It is not enough that your e-commerce site just works. It needs to share the right data with advertising platforms, have AI engines understand your content, and be ready for future technologies.',
    color: '#7B68EE',
    icon: ecommerceIcon,
    highlight: '$899',
    benefits: [
      'Google Ads ve Shopping\'e hazır ürün feed\'i',
      'Meta (Facebook/Instagram) katalog entegrasyonu',
      'GA4 ve GTM ile detaylı analitik',
      'Yapay zeka aramalarında görünürlük',
      'Aylık bakım ve güncelleme dahil',
    ],
    process: [
      { title: 'Veri Modelleme', description: 'Mevcut ürün yapısı analiz edilir ve uygun veri modeli tasarlanır.' },
      { title: 'Platform Entegrasyonu', description: 'Google Merchant Center, Meta Business ve diğer platformlarla entegrasyon kurulur.' },
      { title: 'Test ve Optimizasyon', description: 'Tüm entegrasyonlar test edilir ve hata düzeltmeleri yapılır.' },
      { title: 'Yayınlama ve Eğitim', description: 'Sistem yayına alınır ve ekibinize eğitim verilir.' },
    ],
    packages: [
      {
        name: 'Google Uyum Mimarisi',
        nameEn: 'Google Compatibility Architecture',
        price: '$899',
        priceNote: '+ $299/ay bakım',
        duration: '2-3 Hafta',
        highlight: true,
        deliverables: [
          'Ürün veri modeli kurgusu',
          'Google Merchant Center uyumu',
          'SEO & Google Ads ortak veri yapısı',
          'GA4 / GTM temel kurulum',
          'Ürün ve kategori sayfaları için yapısal uyum',
          'Aylık sistem bakım ve güncelleme',
        ],
      },
      {
        name: 'Meta Uyum Mimarisi',
        nameEn: 'Meta Compatibility Architecture',
        price: '$699',
        priceNote: '+ $229/ay bakım',
        duration: '2-3 Hafta',
        isOptional: true,
        deliverables: [
          'Meta katalog & feed mimarisi',
          'Pixel & Conversion API teknik uyumu',
          'Meta platformları için veri altyapısı',
          'Facebook / Instagram Shop entegrasyonu',
          'Aylık bakım ve güncelleme',
        ],
      },
      {
        name: 'Yapay Zeka (AI/GEO) Uyum',
        nameEn: 'AI / GEO Compatibility',
        price: '$499',
        priceNote: '+ $169/ay bakım',
        duration: '2 Hafta',
        isOptional: true,
        deliverables: [
          'AI-readable ürün veri yapısı',
          'LLM (yapay zeka arama) uyumlu veri kurgusu',
          'Gelecek uyumlu içerik ve feed altyapısı',
          'ChatGPT, Gemini vb. platform uyumu',
          'Aylık bakım ve güncelleme',
        ],
      },
    ],
    faq: [
      { question: 'Mevcut e-ticaret sitem var, entegrasyon yapılabilir mi?', answer: 'Evet, Shopify, WooCommerce, Ticimax ve diğer platformlarla entegrasyon deneyimimiz mevcut.' },
      { question: 'Aylık bakım neyi kapsıyor?', answer: 'Feed hataları, veri güncellemeleri ve platform değişikliklerine uyum sağlamayı kapsar.' },
      { question: 'Kaç ürün için feed hazırlanır?', answer: 'Standart paket 500\'e kadar ürün için geçerlidir.' },
    ],
  },
  {
    key: 'ads',
    title: 'Reklam Stratejisi ve Yönetimi',
    titleEn: 'Advertising Strategy and Management',
    desc: 'Soğuk, ılık ve sıcak kitle segmentasyonu ile Meta Ads ve Google Ads yönetimi.',
    descEn: 'Meta Ads and Google Ads management with cold, warm and hot audience segmentation.',
    fullDescription: 'Reklam yönetimi sadece "para basmak" değildir. Doğru kitleye, doğru mesajla, doğru zamanda ulaşmak demektir. Bu hizmet kapsamında soğuk, ılık ve sıcak kitle segmentasyonu ile dönüşüm hunisi oluşturulur.',
    fullDescriptionEn: 'Advertising management is not just "printing money". It means reaching the right audience, with the right message, at the right time. This service includes cold, warm and hot audience segmentation with conversion funnel creation.',
    color: '#4ECDC4',
    icon: adsIcon,
    highlight: '$999',
    benefits: [
      'Soğuk / ılık / sıcak kitle mimarisi',
      'Dönüşüm hunisi (funnel) kurgusu',
      'Bütçe optimizasyonu',
      'Haftalık performans raporlaması',
      'Sürekli A/B testleri',
    ],
    process: [
      { title: 'Audit ve Analiz', description: 'Mevcut durum analizi ve rakip reklam analizi yapılır.' },
      { title: 'Strateji Geliştirme', description: 'Kitle segmentasyonu, kampanya yapısı ve bütçe planı oluşturulur.' },
      { title: 'Uygulama', description: 'Kampanyalar kurulur, reklamlar hazırlanır ve yayına alınır.' },
      { title: 'Optimizasyon', description: 'Sürekli performans takibi ve optimizasyon yapılır.' },
    ],
    packages: [
      {
        name: 'Reklam Stratejisi Tasarımı',
        nameEn: 'Advertising Strategy Design',
        price: '$999',
        duration: '1 Hafta',
        highlight: true,
        deliverables: [
          'Soğuk / ılık / sıcak kitle mimarisi',
          'Dönüşüm hunisi (funnel) kurgusu',
          'Kampanya ve reklam seti yapıları',
          'Kreatif türleri ve kullanım çerçevesi',
          'Reklam dili ve mesajlaşma yaklaşımı',
          'Bütçe dağılımı ve önceliklendirme modeli',
        ],
      },
      {
        name: 'Aylık Reklam Yönetimi',
        nameEn: 'Monthly Ad Management',
        price: '$649',
        duration: 'Aylık',
        isMonthly: true,
        isOptional: true,
        deliverables: [
          'Kampanya ve reklam setlerinin kurulumu',
          'Reklamların yayına alınması',
          'Haftalık optimizasyon ve düzenlemeler',
          'Performans takibi ve raporlama',
          'A/B test sonuçlarının değerlendirilmesi',
        ],
      },
    ],
    faq: [
      { question: 'Aylık yönetim ücreti var mı?', answer: 'Kampanya kurulumu sonrası aylık yönetim hizmeti için ayrı teklif sunuyoruz.' },
      { question: 'Minimum reklam bütçesi ne olmalı?', answer: 'Etkili sonuç için aylık en az $500 reklam bütçesi öneriyoruz.' },
      { question: 'Hangi platformlarda reklam verebiliriz?', answer: 'Meta (Facebook, Instagram), Google (Search, Display, Shopping) ve TikTok platformlarında uzmanız.' },
    ],
  },
  {
    key: 'social',
    title: 'Sosyal Medya İçerik Üretimi ve Yönetimi',
    titleEn: 'Social Media Content Production and Management',
    desc: 'Fotoğraf ve video çekimleri, profesyonel kurgu ve içerik planlaması.',
    descEn: 'Photo and video shoots, professional editing and content planning.',
    fullDescription: 'Sosyal medya, markanızın müşterilerinizle buluştuğu en dinamik platformdur. Bu hizmet kapsamında fotoğraf ve video çekimleri, profesyonel kurgu ve içerik planlaması yer alır.',
    fullDescriptionEn: 'Social media is the most dynamic platform where your brand meets your customers. This service includes photo and video shoots, professional editing and content planning.',
    color: '#FF6B9D',
    icon: socialIcon,
    highlight: '$499/ay',
    benefits: [
      'Profesyonel fotoğraf ve video içerikler',
      'Marka kimliğine uygun görsel dil',
      'Platforma özel format optimizasyonu',
      'Esnek çalışma saatleri ve kapasite',
      'Açıklama metinleri (caption) kurgulanması',
    ],
    process: [
      { title: 'İhtiyaç Analizi', description: 'Mevcut durum analizi ve hedef kitle belirlemesi yapılır.' },
      { title: 'İçerik Planlaması', description: 'Aylık içerik takvimi oluşturulur ve onaya sunulur.' },
      { title: 'Üretim', description: 'Fotoğraf/video çekimleri ve edit işlemleri yapılır.' },
      { title: 'Yayınlama ve Raporlama', description: 'İçerikler yayınlanır ve aylık rapor sunulur.' },
    ],
    packages: [
      {
        name: 'Temel Paket',
        nameEn: 'Basic Package',
        price: '$499',
        duration: 'Aylık • 6-8 saat/hafta',
        isMonthly: true,
        deliverables: [
          'Fotoğraf ve/veya video çekimleri',
          'Temel kurgu ve düzenleme',
          'İçeriklerin paylaşıma hazır hale getirilmesi',
          'Açıklama metinlerinin (caption) kurgulanması',
          'Yerinde veya uzaktan çalışma',
        ],
      },
      {
        name: 'Standart Paket',
        nameEn: 'Standard Package',
        price: '$649',
        duration: 'Aylık • 10-12 saat/hafta',
        isMonthly: true,
        highlight: true,
        deliverables: [
          'Fotoğraf ve video çekimleri',
          'Yoğun kurgu ve düzenleme süreci',
          'Açıklama metinlerinin (caption) kurgulanması',
          'Görsel bütünlük ve içerik çeşitliliği',
          'Marka kimliğine özel içerik dili',
          'Yerinde ve/veya uzaktan çalışma',
        ],
      },
      {
        name: 'Yoğun Paket',
        nameEn: 'Intensive Package',
        price: '$799',
        duration: 'Aylık • 15-18 saat/hafta',
        isMonthly: true,
        deliverables: [
          'Yüksek hacimli fotoğraf ve video çekimleri',
          'Detaylı video kurguları ve seri içerikler',
          'Açıklama metinlerinin (caption) kurgulanması',
          'Marka kimliğine özel içerik dili',
          'Yerinde ve uzaktan yoğun çalışma',
          'Ek içerik ihtiyaçları için öncelikli kapasite',
        ],
      },
    ],
    faq: [
      { question: 'Çekimler nerede yapılıyor?', answer: 'Ürün çekimleri için ofisimizde stüdyo imkanı mevcuttur. Lansman veya etkinlik çekimleri için yerinde çalışıyoruz.' },
      { question: 'Hangi sosyal medya platformları için içerik üretiyorsunuz?', answer: 'Instagram, Facebook, LinkedIn, TikTok ve YouTube için içerik üretiyoruz.' },
      { question: 'İçerik takvimi kim belirliyor?', answer: 'Birlikte oluşturuyoruz. Marka değerleriniz ve hedefleriniz doğrultusunda içerik takvimi hazırlanır.' },
    ],
  },
  {
    key: 'video',
    title: 'Sinematik Reklam Filmi',
    titleEn: 'Cinematic Commercial Film',
    desc: 'Profesyonel video çekimi, dron çekimleri ve sinematik kurgu ile etkileyici reklam filmi.',
    descEn: 'Impressive commercial films with professional video shooting, drone shots and cinematic editing.',
    fullDescription: 'Video içerik, marka hikayenizi en etkili şekilde aktarmanın yoludur. Bu hizmet kapsamında profesyonel video çekimi, dron çekimleri, sinematik kurgu ve post-prodüksiyon yer alır.',
    fullDescriptionEn: 'Video content is the way to communicate your brand story most effectively. This service includes professional video shooting, drone shots, cinematic editing and post-production.',
    color: '#FF8C42',
    icon: videoIcon,
    highlight: '$999',
    benefits: [
      '4K çözünürlükte profesyonel çekim',
      'Sinematik renk düzeltme (Color Grade)',
      'Platforma özel formatlar',
      'Profesyonel ses tasarımı',
      'Motion graphics dahil',
    ],
    process: [
      { title: 'Konsept ve Planlama', description: 'Senaryo, çekim planı ve lokasyon belirlenir.' },
      { title: 'Pre-Prodüksiyon', description: 'Storyboard, çekim listesi ve ekip koordinasyonu yapılır.' },
      { title: 'Çekim', description: 'Profesyonel ekipman ile çekimler gerçekleştirilir.' },
      { title: 'Post-Prodüksiyon', description: 'Kurgu, renk düzeltme, ses tasarımı ve teslim yapılır.' },
    ],
    packages: [
      {
        name: 'Sinematik Reklam Filmi',
        nameEn: 'Cinematic Commercial Film',
        price: '$999',
        duration: '7-14 İş Günü',
        deliverables: [
          'Profesyonel video çekimi ve post-prodüksiyon',
          'Kara çekim, dron çekimi',
          'Sinematik kurgu',
          'Renk düzeltme (Color Grading)',
          'Profesyonel ses tasarımı ve müzik',
          'Sosyal medya formatlarına uygun içerikler',
          '2 tur ücretsiz revizyon',
        ],
      },
    ],
    faq: [
      { question: 'Çekim için lokasyon sağlamam gerekiyor mu?', answer: 'Ürün çekimleri için stüdyomuzu kullanabilirsiniz. Lokasyon çekimleri için lokasyon tedarikinde yardımcı olabiliriz.' },
      { question: 'Teslim süresi ne kadar?', answer: 'Standart paket için 7-14 iş günü içinde teslim yapıyoruz.' },
      { question: 'Revizyon hakkı var mı?', answer: 'Evet, 2 tur ücretsiz revizyon hakkı sunuyoruz.' },
    ],
  },
];

export const getServiceData = (key: string): ServiceData | undefined => {
  return servicesData.find((s) => s.key === key);
};
