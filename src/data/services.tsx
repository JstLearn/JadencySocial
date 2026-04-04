export interface ServicePackage {
  name: string;
  nameEn: string;
  price: string;
  priceNote?: string;
  priceNoteEn?: string;
  duration: string;
  durationEn: string;
  deliverables: string[];
  deliverablesEn: string[];
  isMonthly?: boolean;
  isOptional?: boolean;
  highlight?: boolean;
}

export interface ServiceProcessStep {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface ServiceFAQ {
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
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
  benefitsEn?: string[];
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
      'Kolay tanınabilirlık ve akılda kalıcılık',
      'Profesyonel kartvizit ve sosyal medya görselleri dahil',
    ],
    benefitsEn: [
      'Increased brand credibility with professional visual identity',
      'Consistent representation across different platforms',
      'Usable system for all digital and print materials',
      'Easy recognition and memorability',
      'Includes professional business cards and social media visuals',
    ],
    process: [
      { title: 'Marka Analizi', titleEn: 'Brand Analysis', description: 'Markanın faaliyet alanı, hedef kitle, konumlandırma ve sektördeki görsel dil analiz edilir.', descriptionEn: 'Analyzing the brand\'s field of activity, target audience, positioning, and visual language in the industry.' },
      { title: 'Tasarım Yönünün Belirlenmesi', titleEn: 'Design Direction', description: 'Logo stil yaklaşımı, renk karakteri ve tipografi yönü belirlenir.', descriptionEn: 'Determining the logo style approach, color character, and typography direction.' },
      { title: 'Logo ve Görsel Sistem Tasarımı', titleEn: 'Logo and Visual System Design', description: 'Ana logo, alternatif varyasyonlar, ikon ve sembol versiyonları hazırlanır.', descriptionEn: 'Preparing the main logo, alternative variations, icon and symbol versions.' },
      { title: 'Marka Görsel Sisteminin Oluşturulması', titleEn: 'Brand Visual System Creation', description: 'Renk paleti, tipografi, sosyal medya görselleri, favicon ve kartvizit tasarımları hazırlanır.', descriptionEn: 'Preparing color palette, typography, social media visuals, favicon and business card designs.' },
      { title: 'Dosyaların Hazırlanması ve Teslim', titleEn: 'Files Preparation and Delivery', description: 'Tüm tasarım dosyaları farklı formatlarda (PNG, SVG, PDF) teslim edilir.', descriptionEn: 'All design files are delivered in different formats (PNG, SVG, PDF).' },
    ],
    packages: [
      {
        name: 'Marka Kimliği Oluşturma',
        nameEn: 'Brand Identity Creation',
        price: '$499',
        duration: '2 Hafta',
        durationEn: '2 Weeks',
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
        deliverablesEn: [
          'Main logo design',
          'Alternative logo variations',
          'Icon / symbol versions',
          'Horizontal and vertical logo versions',
          'Black and white logo versions',
          'Brand color palette creation',
          'Typography (font system) definition',
          'Social media profile images',
          'Social media cover images',
          'Favicon (site icons)',
          'Business card design set',
          'Basic brand usage guidelines',
          'Logo files (PNG / SVG / PDF)',
          'Color codes (HEX / RGB)',
          'Font recommendations',
          'Social media visual sets',
          'Brand usage guideline',
        ],
      },
    ],
    faq: [
      { question: 'Marka kimliği çalışması neleri kapsar?', questionEn: 'What does the brand identity work include?', answer: 'Logo, renk paleti, tipografi ve tüm kurumsal kimlik öğelerini kapsar. Web sitesi kurulumu ve sosyal medya yönetimi bu teklif kapsamında yer almaz.', answerEn: 'Includes logo, color palette, typography and all corporate identity elements. Website setup and social media management are not included in this offer.' },
      { question: 'Teslim süresi nedir?', questionEn: 'What is the delivery time?', answer: 'Ortalama teslim süresi 2 haftadır.', answerEn: 'Average delivery time is 2 weeks.' },
      { question: 'Revizyon hakkı var mı?', questionEn: 'Is there a revision right?', answer: 'Evet, tasarım sürecinde revizyon hakkı sunuyoruz.', answerEn: 'Yes, we offer revision rights during the design process.' },
      { question: 'Ek tasarım çalışmaları yapılabilir mi?', questionEn: 'Can additional design work be done?', answer: 'Evet, talep edilmesi halinde ek tasarım çalışmaları ayrıca fiyatlandırılır.', answerEn: 'Yes, additional design work will be quoted separately if requested.' },
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
    benefitsEn: [
      'Secure connection with SSL certificate',
      'Fast loading times',
      'DDoS security with Cloudflare protection',
      'Professional communication with corporate email',
      'Modern and responsive website',
    ],
    process: [
      { title: 'Planlama ve Domain', titleEn: 'Planning and Domain', description: 'Domain analizi yapılır, uygun domain alınır ve DNS ayarları kurulur.', descriptionEn: 'Domain analysis is performed, suitable domain is acquired and DNS settings are configured.' },
      { title: 'Güvenlik Yapılandırması', titleEn: 'Security Configuration', description: 'Cloudflare kurulumu, SSL sertifikası ve güvenlik ayarları yapılır.', descriptionEn: 'Cloudflare setup, SSL certificate and security settings are configured.' },
      { title: 'E-posta Kurulumu', titleEn: 'Email Setup', description: 'Kurumsal e-posta hesapları oluşturulur ve e-posta istemcileri ayarlanır.', descriptionEn: 'Corporate email accounts are created and email clients are configured.' },
      { title: 'Web Sitesi Kurulumu', titleEn: 'Website Setup', description: 'Web sitesi tasarımı yapılır, içerikler yerleştirilir ve site yayına alınır.', descriptionEn: 'Website design is created, content is placed and the site goes live.' },
    ],
    packages: [
      {
        name: 'Dijital Altyapı Kurulumu',
        nameEn: 'Digital Infrastructure Setup',
        price: '$329',
        duration: '1 Hafta',
        durationEn: '1 Week',
        deliverables: [
          'Domain (alan adı) yapılandırması',
          'DNS ve güvenlik yapılandırması (Cloudflare)',
          'Kurumsal e-posta altyapısının kurulması',
          'Sunucu (VDS / hosting) yapılandırması',
          'SSL sertifikası kurulumu',
          '5 kurumsal e-posta hesabı',
        ],
        deliverablesEn: [
          'Domain (domain name) configuration',
          'DNS and security configuration (Cloudflare)',
          'Corporate email infrastructure setup',
          'Server (VDS / hosting) configuration',
          'SSL certificate installation',
          '5 corporate email accounts',
        ],
      },
      {
        name: 'Web Sitesi Kurulumu',
        nameEn: 'Website Setup',
        price: '$499',
        duration: '2-3 Hafta',
        durationEn: '2-3 Weeks',
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
        deliverablesEn: [
          'Creating site page structure',
          'Preparing menu and navigation structure',
          'Placing images and content',
          'Preparing page layouts',
          'Customizing site design to brand',
          'Mobile-friendly (responsive) design',
          'Basic SEO settings',
        ],
      },
    ],
    faq: [
      { question: 'Domain ücreti dahil mi?', questionEn: 'Is domain fee included?', answer: 'Domain yıllık yenileme ücreti hizmet bedeline dahil değildir.', answerEn: 'Annual domain renewal fee is not included in the service fee.' },
      { question: 'E-posta hesabı sayısı ne kadar?', questionEn: 'How many email accounts?', answer: 'Standart olarak 5 kurumsal e-posta hesabı oluşturuyoruz.', answerEn: 'We create 5 corporate email accounts as standard.' },
      { question: 'Web sitesi hangi platformda olacak?', questionEn: 'What platform will the website be on?', answer: 'Modern web teknolojileri ile özel geliştirme veya WordPress/Tipi gibi CMS seçenekleri sunuyoruz.', answerEn: 'We offer custom development with modern web technologies or CMS options like WordPress/Tipi.' },
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
    benefitsEn: [
      'Product feed ready for Google Ads and Shopping',
      'Meta (Facebook/Instagram) catalog integration',
      'Detailed analytics with GA4 and GTM',
      'Visibility in AI searches',
      'Monthly maintenance and updates included',
    ],
    process: [
      { title: 'Veri Modelleme', titleEn: 'Data Modeling', description: 'Mevcut ürün yapısı analiz edilir ve uygun veri modeli tasarlanır.', descriptionEn: 'Current product structure is analyzed and appropriate data model is designed.' },
      { title: 'Platform Entegrasyonu', titleEn: 'Platform Integration', description: 'Google Merchant Center, Meta Business ve diğer platformlarla entegrasyon kurulur.', descriptionEn: 'Integration is established with Google Merchant Center, Meta Business and other platforms.' },
      { title: 'Test ve Optimizasyon', titleEn: 'Test and Optimization', description: 'Tüm entegrasyonlar test edilir ve hata düzeltmeleri yapılır.', descriptionEn: 'All integrations are tested and bug fixes are made.' },
      { title: 'Yayınlama ve Eğitim', titleEn: 'Launch and Training', description: 'Sistem yayına alınır ve ekibinize eğitim verilir.', descriptionEn: 'System goes live and your team is trained.' },
    ],
    packages: [
      {
        name: 'Google Uyum Mimarisi',
        nameEn: 'Google Compatibility Architecture',
        price: '$899',
        priceNote: '+ $299/ay bakım',
        priceNoteEn: '+ $299/month maintenance',
        duration: '2-3 Hafta',
        durationEn: '2-3 Weeks',
        highlight: true,
        deliverables: [
          'Ürün veri modeli kurgusu',
          'Google Merchant Center uyumu',
          'SEO & Google Ads ortak veri yapısı',
          'GA4 / GTM temel kurulum',
          'Ürün ve kategori sayfaları için yapısal uyum',
          'Aylık sistem bakım ve güncelleme',
        ],
        deliverablesEn: [
          'Product data model design',
          'Google Merchant Center compatibility',
          'SEO & Google Ads shared data structure',
          'GA4 / GTM basic setup',
          'Structural compatibility for product and category pages',
          'Monthly system maintenance and updates',
        ],
      },
      {
        name: 'Meta Uyum Mimarisi',
        nameEn: 'Meta Compatibility Architecture',
        price: '$699',
        priceNote: '+ $229/ay bakım',
        priceNoteEn: '+ $229/month maintenance',
        duration: '2-3 Hafta',
        durationEn: '2-3 Weeks',
        isOptional: true,
        deliverables: [
          'Meta katalog & feed mimarisi',
          'Pixel & Conversion API teknik uyumu',
          'Meta platformları için veri altyapısı',
          'Facebook / Instagram Shop entegrasyonu',
          'Aylık bakım ve güncelleme',
        ],
        deliverablesEn: [
          'Meta catalog & feed architecture',
          'Pixel & Conversion API technical compatibility',
          'Data infrastructure for Meta platforms',
          'Facebook / Instagram Shop integration',
          'Monthly maintenance and updates',
        ],
      },
      {
        name: 'Yapay Zeka (AI/GEO) Uyum',
        nameEn: 'AI / GEO Compatibility',
        price: '$499',
        priceNote: '+ $169/ay bakım',
        priceNoteEn: '+ $169/month maintenance',
        duration: '2 Hafta',
        durationEn: '2 Weeks',
        isOptional: true,
        deliverables: [
          'AI-readable ürün veri yapısı',
          'LLM (yapay zeka arama) uyumlu veri kurgusu',
          'Gelecek uyumlu içerik ve feed altyapısı',
          'ChatGPT, Gemini vb. platform uyumu',
          'Aylık bakım ve güncelleme',
        ],
        deliverablesEn: [
          'AI-readable product data structure',
          'LLM (AI search) compatible data design',
          'Future-proof content and feed infrastructure',
          'ChatGPT, Gemini etc. platform compatibility',
          'Monthly maintenance and updates',
        ],
      },
    ],
    faq: [
      { question: 'Mevcut e-ticaret sitem var, entegrasyon yapılabilir mi?', questionEn: 'I have an existing e-commerce site, can integration be done?', answer: 'Evet, Shopify, WooCommerce, Ticimax ve diğer platformlarla entegrasyon deneyimimiz mevcut.', answerEn: 'Yes, we have experience with integration with Shopify, WooCommerce, Ticimax and other platforms.' },
      { question: 'Aylık bakım neyi kapsıyor?', questionEn: 'What does monthly maintenance include?', answer: 'Feed hataları, veri güncellemeleri ve platform değişikliklerine uyum sağlamayı kapsar.', answerEn: 'It includes feed errors, data updates and adapting to platform changes.' },
      { question: 'Kaç ürün için feed hazırlanır?', questionEn: 'How many products are covered in the feed?', answer: 'Standart paket 500\'e kadar ürün için geçerlidir.', answerEn: 'Standard package is valid for up to 500 products.' },
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
    benefitsEn: [
      'Cold / warm / hot audience architecture',
      'Conversion funnel design',
      'Budget optimization',
      'Weekly performance reporting',
      'Continuous A/B testing',
    ],
    process: [
      { title: 'Audit ve Analiz', titleEn: 'Audit and Analysis', description: 'Mevcut durum analizi ve rakip reklam analizi yapılır.', descriptionEn: 'Current situation analysis and competitor ad analysis are conducted.' },
      { title: 'Strateji Geliştirme', titleEn: 'Strategy Development', description: 'Kitle segmentasyonu, kampanya yapısı ve bütçe planı oluşturulur.', descriptionEn: 'Audience segmentation, campaign structure and budget plan are created.' },
      { title: 'Uygulama', titleEn: 'Implementation', description: 'Kampanyalar kurulur, reklamlar hazırlanır ve yayına alınır.', descriptionEn: 'Campaigns are set up, ads are prepared and launched.' },
      { title: 'Optimizasyon', titleEn: 'Optimization', description: 'Sürekli performans takibi ve optimizasyon yapılır.', descriptionEn: 'Continuous performance tracking and optimization is performed.' },
    ],
    packages: [
      {
        name: 'Reklam Stratejisi Tasarımı',
        nameEn: 'Advertising Strategy Design',
        price: '$999',
        duration: '1 Hafta',
        durationEn: '1 Week',
        highlight: true,
        deliverables: [
          'Soğuk / ılık / sıcak kitle mimarisi',
          'Dönüşüm hunisi (funnel) kurgusu',
          'Kampanya ve reklam seti yapıları',
          'Kreatif türleri ve kullanım çerçevesi',
          'Reklam dili ve mesajlaşma yaklaşımı',
          'Bütçe dağılımı ve önceliklendirme modeli',
        ],
        deliverablesEn: [
          'Cold / warm / hot audience architecture',
          'Conversion funnel design',
          'Campaign and ad set structures',
          'Creative types and usage framework',
          'Ad language and messaging approach',
          'Budget allocation and prioritization model',
        ],
      },
      {
        name: 'Aylık Reklam Yönetimi',
        nameEn: 'Monthly Ad Management',
        price: '$649',
        duration: 'Aylık',
        durationEn: 'Monthly',
        isMonthly: true,
        isOptional: true,
        deliverables: [
          'Kampanya ve reklam setlerinin kurulumu',
          'Reklamların yayına alınması',
          'Haftalık optimizasyon ve düzenlemeler',
          'Performans takibi ve raporlama',
          'A/B test sonuçlarının değerlendirilmesi',
        ],
        deliverablesEn: [
          'Campaign and ad set setup',
          'Ads are published',
          'Weekly optimization and adjustments',
          'Performance tracking and reporting',
          'A/B test results evaluation',
        ],
      },
    ],
    faq: [
      { question: 'Aylık yönetim ücreti var mı?', questionEn: 'Is there a monthly management fee?', answer: 'Kampanya kurulumu sonrası aylık yönetim hizmeti için ayrı teklif sunuyoruz.', answerEn: 'We offer a separate quote for monthly management service after campaign setup.' },
      { question: 'Minimum reklam bütçesi ne olmalı?', questionEn: 'What should the minimum ad budget be?', answer: 'Etkili sonuç için aylık en az $500 reklam bütçesi öneriyoruz.', answerEn: 'We recommend a minimum monthly ad budget of $500 for effective results.' },
      { question: 'Hangi platformlarda reklam verebiliriz?', questionEn: 'On which platforms can we advertise?', answer: 'Meta (Facebook, Instagram), Google (Search, Display, Shopping) ve TikTok platformlarında uzmanız.', answerEn: 'We specialize in Meta (Facebook, Instagram), Google (Search, Display, Shopping) and TikTok platforms.' },
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
    benefitsEn: [
      'Professional photo and video content',
      'Visual language suited to brand identity',
      'Platform-specific format optimization',
      'Flexible working hours and capacity',
      'Caption copywriting',
    ],
    process: [
      { title: 'İhtiyaç Analizi', titleEn: 'Needs Analysis', description: 'Mevcut durum analizi ve hedef kitle belirlemesi yapılır.', descriptionEn: 'Current situation analysis and target audience determination are conducted.' },
      { title: 'İçerik Planlaması', titleEn: 'Content Planning', description: 'Aylık içerik takvimi oluşturulur ve onaya sunulur.', descriptionEn: 'Monthly content calendar is created and submitted for approval.' },
      { title: 'Üretim', titleEn: 'Production', description: 'Fotoğraf/video çekimleri ve edit işlemleri yapılır.', descriptionEn: 'Photo/video shoots and editing are done.' },
      { title: 'Yayınlama ve Raporlama', titleEn: 'Publishing and Reporting', description: 'İçerikler yayınlanır ve aylık rapor sunulur.', descriptionEn: 'Content is published and monthly report is presented.' },
    ],
    packages: [
      {
        name: 'Temel Paket',
        nameEn: 'Basic Package',
        price: '$499',
        duration: 'Aylık • 6-8 saat/hafta',
        durationEn: 'Monthly • 6-8 hours/week',
        isMonthly: true,
        deliverables: [
          'Fotoğraf ve/veya video çekimleri',
          'Temel kurgu ve düzenleme',
          'İçeriklerin paylaşıma hazır hale getirilmesi',
          'Açıklama metinlerinin (caption) kurgulanması',
          'Yerinde veya uzaktan çalışma',
        ],
        deliverablesEn: [
          'Photo and/or video shoots',
          'Basic editing and post-production',
          'Content ready for sharing',
          'Caption copywriting',
          'On-site or remote work',
        ],
      },
      {
        name: 'Standart Paket',
        nameEn: 'Standard Package',
        price: '$649',
        duration: 'Aylık • 10-12 saat/hafta',
        durationEn: 'Monthly • 10-12 hours/week',
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
        deliverablesEn: [
          'Photo and video shoots',
          'Intensive editing and post-production',
          'Caption copywriting',
          'Visual consistency and content diversity',
          'Brand-specific content language',
          'On-site and/or remote work',
        ],
      },
      {
        name: 'Yoğun Paket',
        nameEn: 'Intensive Package',
        price: '$799',
        duration: 'Aylık • 15-18 saat/hafta',
        durationEn: 'Monthly • 15-18 hours/week',
        isMonthly: true,
        deliverables: [
          'Yüksek hacimli fotoğraf ve video çekimleri',
          'Detaylı video kurguları ve seri içerikler',
          'Açıklama metinlerinin (caption) kurgulanması',
          'Marka kimliğine özel içerik dili',
          'Yerinde ve uzaktan yoğun çalışma',
          'Ek içerik ihtiyaçları için öncelikli kapasite',
        ],
        deliverablesEn: [
          'High-volume photo and video shoots',
          'Detailed video edits and series content',
          'Caption copywriting',
          'Brand-specific content language',
          'Intensive on-site and remote work',
          'Priority capacity for additional content needs',
        ],
      },
    ],
    faq: [
      { question: 'Çekimler nerede yapılıyor?', questionEn: 'Where are the shoots done?', answer: 'Ürün çekimleri için ofisimizde stüdyo imkanı mevcuttur. Lansman veya etkinlik çekimleri için yerinde çalışıyoruz.', answerEn: 'We have studio facilities at our office for product shoots. We work on-site for launch or event shoots.' },
      { question: 'Hangi sosyal medya platformları için içerik üretiyorsunuz?', questionEn: 'Which social media platforms do you produce content for?', answer: 'Instagram, Facebook, LinkedIn, TikTok ve YouTube için içerik üretiyoruz.', answerEn: 'We produce content for Instagram, Facebook, LinkedIn, TikTok and YouTube.' },
      { question: 'İçerik takvimi kim belirliyor?', questionEn: 'Who determines the content calendar?', answer: 'Birlikte oluşturuyoruz. Marka değerleriniz ve hedefleriniz doğrultusunda içerik takvimi hazırlanır.', answerEn: 'We create it together. Content calendar is prepared in line with your brand values and goals.' },
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
    benefitsEn: [
      'Professional shooting in 4K resolution',
      'Cinematic color grading',
      'Platform-specific formats',
      'Professional sound design',
      'Motion graphics included',
    ],
    process: [
      { title: 'Konsept ve Planlama', titleEn: 'Concept and Planning', description: 'Senaryo, çekim planı ve lokasyon belirlenir.', descriptionEn: 'Script, shooting plan and location are determined.' },
      { title: 'Pre-Prodüksiyon', titleEn: 'Pre-Production', description: 'Storyboard, çekim listesi ve ekip koordinasyonu yapılır.', descriptionEn: 'Storyboard, shot list and crew coordination are done.' },
      { title: 'Çekim', titleEn: 'Shooting', description: 'Profesyonel ekipman ile çekimler gerçekleştirilir.', descriptionEn: 'Shooting is done with professional equipment.' },
      { title: 'Post-Prodüksiyon', titleEn: 'Post-Production', description: 'Kurgu, renk düzeltme, ses tasarımı ve teslim yapılır.', descriptionEn: 'Editing, color correction, sound design and delivery are done.' },
    ],
    packages: [
      {
        name: 'Sinematik Reklam Filmi',
        nameEn: 'Cinematic Commercial Film',
        price: '$999',
        duration: '7-14 İş Günü',
        durationEn: '7-14 Business Days',
        deliverables: [
          'Profesyonel video çekimi ve post-prodüksiyon',
          'Kara çekim, dron çekimi',
          'Sinematik kurgu',
          'Renk düzeltme (Color Grading)',
          'Profesyonel ses tasarımı ve müzik',
          'Sosyal medya formatlarına uygun içerikler',
          '2 tur ücretsiz revizyon',
        ],
        deliverablesEn: [
          'Professional video shooting and post-production',
          'Studio shooting, drone footage',
          'Cinematic editing',
          'Color grading',
          'Professional sound design and music',
          'Content suitable for social media formats',
          '2 rounds of free revision',
        ],
      },
    ],
    faq: [
      { question: 'Çekim için lokasyon sağlamam gerekiyor mu?', questionEn: 'Do I need to provide a location for shooting?', answer: 'Ürün çekimleri için stüdyomuzu kullanabilirsiniz. Lokasyon çekimleri için lokasyon tedarikinde yardımcı olabiliriz.', answerEn: 'You can use our studio for product shoots. We can help with location sourcing for location shoots.' },
      { question: 'Teslim süresi ne kadar?', questionEn: 'What is the delivery time?', answer: 'Standart paket için 7-14 iş günü içinde teslim yapıyoruz.', answerEn: 'We deliver within 7-14 business days for standard packages.' },
      { question: 'Revizyon hakkı var mı?', questionEn: 'Is there a revision right?', answer: 'Evet, 2 tur ücretsiz revizyon hakkı sunuyoruz.', answerEn: 'Yes, we offer 2 rounds of free revision.' },
    ],
  },
];

export const getServiceData = (key: string): ServiceData | undefined => {
  return servicesData.find((s) => s.key === key);
};
