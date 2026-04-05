/**
 * İşletme Analiz Raporu PDF Generator
 *
 * GOLD MOON BEAUTY HOME için kapsamlı analiz raporu
 * Türkçe karakter desteği ve profesyonel tasarım
 */

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Font paths
const FONTS = {
  regular: path.join(__dirname, '..', 'fonts', 'NotoSans-Regular.ttf'),
  bold: path.join(__dirname, '..', 'fonts', 'NotoSans-Bold.ttf'),
};

// Logo path
const LOGO_PATH = '/home/deniz/Cloud/JadencySocial/Kurumsal Marka/01_Logo/PNG/logo_white_2x.png';

// Renk Paleti
const colors = {
  primary: '#1a365d',      // Koyu mavi
  secondary: '#2d3748',    // Koyu gri
  accent: '#d4af37',       // Altın
  background: '#f7fafc',   // Açık gri arka plan
  cardBg: '#ffffff',       // Beyaz kart
  text: '#1a202c',         // Koyu yazı
  lightText: '#718096',    // Açık yazı
  border: '#e2e8f0',       // Kenarlık
  success: '#10b981',      // Yeşil
  warning: '#f59e0b',      // Turuncu
  danger: '#ef4444',       // Kırmızı
  white: '#ffffff',
};

// İşletme Verileri
const businessData = {
  name: 'GOLD MOON BEAUTY HOME',
  type: 'Güzellik Salonu / SPA',
  district: 'Kapaklı, Tekirdağ',
  address: 'Cumhuriyet, Yeni Cami Cd., 59500 Kapaklı/Tekirdağ',
  phone: '0531 402 72 45',
  placeId: 'ChIJ7ypTHW0ptRQR2tiE59GBMoY',
  openingHours: [
    { day: 'Pazartesi', hours: '10:00 - 18:00' },
    { day: 'Salı', hours: '10:00 - 18:00' },
    { day: 'Çarşamba', hours: '10:00 - 18:00' },
    { day: 'Perşembe', hours: '10:00 - 18:00' },
    { day: 'Cuma', hours: '09:00 - 17:00' },
    { day: 'Cumartesi', hours: '10:00 - 18:00' },
    { day: 'Pazar', hours: 'Kapalı' },
  ],
  rating: null,
  reviews: 0,
  photoCount: 10,
};

// Dijital Varlıklar
interface DigitalAsset {
  name: string;
  status: 'var' | 'yok' | 'belirsiz';
  score: number;
  maxScore: number;
  note?: string;
}

const digitalAssets: DigitalAsset[] = [
  { name: 'Web Sitesi', status: 'yok', score: 0, maxScore: 30 },
  { name: 'Instagram Hesabı', status: 'yok', score: 0, maxScore: 25 },
  { name: 'Facebook Sayfası', status: 'yok', score: 0, maxScore: 10 },
  { name: 'Google Maps Kaydı', status: 'var', score: 15, maxScore: 15, note: 'Listelenmiş, optimize edilmemiş' },
  { name: 'Google Yorumları', status: 'yok', score: 0, maxScore: 15, note: '0 yorum, sosyal kanıt yok' },
  { name: 'WhatsApp Entegrasyonu', status: 'belirsiz', score: 0, maxScore: 8 },
  { name: 'Online Randevu Sistemi', status: 'yok', score: 0, maxScore: 7 },
];

const totalScore = digitalAssets.reduce((sum, a) => sum + a.score, 0);
const maxTotalScore = digitalAssets.reduce((sum, a) => sum + a.maxScore, 0);
const scorePercentage = Math.round((totalScore / maxTotalScore) * 100);

// Eksiklikler
interface Eksiklik {
  title: string;
  description: string;
  impact: 'yüksek' | 'orta' | 'düşük';
}

const eksiklikler: Eksiklik[] = [
  {
    title: 'Web Sitesi Bulunmuyor',
    description: 'Müşterilerin işletme hakkında bilgi edineceği dijital bir vitrin yok. Çalışma saatleri, hizmetler ve iletişim bilgileri paylaşılamıyor.',
    impact: 'yüksek',
  },
  {
    title: 'Sosyal Medya Hesabı Yok',
    description: 'Instagram ve Facebook gibi platformlarda işletme hesabı bulunmuyor. Müşterilerin %78\'i bir işletmeyi sosyal medyadan araştırıyor.',
    impact: 'yüksek',
  },
  {
    title: 'Google Yorumları Yok',
    description: 'Sosyal kanıt eksikliği yeni müşterilerin güvenini zedeliyor. Potansiyel müşteriler referans bulamıyor.',
    impact: 'yüksek',
  },
  {
    title: 'Online Randevu Sistemi Yok',
    description: 'Müşteriler telefonla randevu almak zorunda kalıyor. Mesai dışı saatlerde randevu kaybı yaşanıyor.',
    impact: 'orta',
  },
  {
    title: 'Profesyonel E-posta Yok',
    description: 'Sadece telefon numarası kullanılıyor. info@isletme.com gibi profesyonel e-posta güvenilirlik oluşturur.',
    impact: 'orta',
  },
];

// Potansiyeller
interface Potansiyel {
  title: string;
  description: string;
  value: string;
}

const potansiyeller: Potansiyel[] = [
  {
    title: 'Premium Marka Konsepti',
    description: '"GOLD MOON" ve "BEAUTY HOME" isimleri premium bir konsept hissiyatı veriyor. Yüksek fiyat segmentine hitap etme potansiyeli taşıyor.',
    value: 'Premium müşteri segmentine erişim',
  },
  {
    title: 'Güçlü Görsel Varlık',
    description: 'Google Maps\'e 10 fotoğraf yüklenmiş. Profesyonel çekimlerle görsel varlık daha da güçlendirilebilir.',
    value: 'Mevcut fotoğraflar değerlendirilebilir',
  },
  {
    title: 'Merkezi Konum Avantajı',
    description: 'Cumhuriyet Mahallesi, Yeni Cami Caddesi üzerinde merkezi lokasyon. Yüksek foot trafik potansiyeli.',
    value: 'Kapalıçarşı ve pazar günleri görünürlük',
  },
  {
    title: 'Geniş Hizmet Yelpazesi',
    description: 'Güzellik salonu olarak birçok farklı hizmet sunulabilir: cilt bakımı, saç tasarımı, makyaj, SPA.',
    value: 'Çapraz satış fırsatları',
  },
  {
    title: 'Bölgesel Erken Hareket Avantajı',
    description: 'Tekirdağ\'da dijital pazarlama henüz çok yaygın değil. Erken hareket edenler pazarda avantaj sağlayabilir.',
    value: 'Rekabet avantajı',
  },
];

// Kazanımlar
interface Kazanım {
  title: string;
  before: string;
  after: string;
}

const kazanımlar: Kazanım[] = [
  {
    title: 'Web Sitesi',
    before: 'Müşteriler bilgi bulamıyor, güven eksikliği yaşanıyor',
    after: '24 saat erişilebilir dijital vitrin, SEO ile yeni müşteri keşfi',
  },
  {
    title: 'Sosyal Medya',
    before: 'Sosyal medyada görünür değil, rakiplerin gerisinde',
    after: 'Instagram\'da aktif takipçi, haftalık içerik ile etkileşim',
  },
  {
    title: 'Google Yorumları',
    before: '0 yorum, sosyal kanıt yok, güvenilmeyen işletme algısı',
    after: '20+ yorum ile sosyal kanıt, Google Maps\'te üst sıralarda çıkma',
  },
  {
    title: 'Online Randevu',
    before: 'Sadece telefonla randevu, mesai dışı kayıp, telefon trafiği',
    after: '7/24 online randevu, otomatik hatırlatmalar, verimlilik artışı',
  },
];

// Yol Haritası
interface SonrakiAdim {
  step: number;
  title: string;
  description: string;
  timeline: string;
}

const sonrakiAdimlar: SonrakiAdim[] = [
  {
    step: 1,
    title: 'Dijital Kimlik Oluşturma',
    description: 'Profesyonel logo, kurumsal kimlik tasarımı ve marka stratejisi belirleme',
    timeline: '1 hafta',
  },
  {
    step: 2,
    title: 'Web Sitesi Kurulumu',
    description: 'Modern, mobil uyumlu web sitesi; hizmetler, galeri, iletişim ve randevu sayfaları',
    timeline: '2-3 hafta',
  },
  {
    step: 3,
    title: 'Sosyal Medya Açılışı',
    description: 'Instagram ve Facebook hesapları oluşturma, ilk içerikler ve profesyonel çekimler',
    timeline: '1 hafta',
  },
  {
    step: 4,
    title: 'Google Optimizasyonu',
    description: 'Google Business profili optimizasyonu, yorum toplama stratejisi ve yerel SEO',
    timeline: '2-4 hafta',
  },
];

// Yardımcı fonksiyonlar
function getScoreColor(percentage: number): string {
  if (percentage >= 70) return colors.success;
  if (percentage >= 40) return colors.warning;
  return colors.danger;
}

function getStatusIcon(status: string): string {
  if (status === 'var') return '✓';
  if (status === 'yok') return '✗';
  return '?';
}

function getStatusColor(status: string): string {
  if (status === 'var') return colors.success;
  if (status === 'yok') return colors.danger;
  return colors.warning;
}

function getImpactColor(impact: string): string {
  if (impact === 'yüksek') return colors.danger;
  if (impact === 'orta') return colors.warning;
  return colors.success;
}

// Logo'yu base64 olarak yükle
function getLogoBase64(): string {
  try {
    const logoPath = LOGO_PATH;
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return logoBuffer.toString('base64');
    }
  } catch (e) {
    console.log('Logo yüklenemedi, atlanıyor');
  }
  return '';
}

export async function generateBusinessReport(): Promise<Buffer> {
  const pdfMake = await import('pdfmake');
  const PdfPrinter = pdfMake.default;

  const logoBase64 = getLogoBase64();

  const printer = new PdfPrinter({
    'Noto Sans': {
      normal: FONTS.regular,
      bold: FONTS.bold,
      italics: FONTS.regular,
      bolditalics: FONTS.bold,
    },
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [35, 40, 35, 40],
    info: {
      title: `JadencySocial - ${businessData.name} Analiz Raporu`,
      author: 'JadencySocial',
      subject: 'Dijital Analiz Raporu',
    },
    content: [
      // HEADER - Gradient bar with logo
      {
        columns: [
          {
            width: 60,
            image: logoBase64 ? `data:image/png;base64,${logoBase64}` : undefined,
            fit: [60, 60],
          },
          {
            width: '*',
            stack: [
              { text: 'İŞLETME ANALİZ RAPORU', style: 'reportType' },
              { text: businessData.name, style: 'businessName' },
              { text: businessData.type, style: 'businessType' },
            ],
            margin: [15, 0, 0, 0],
          },
        ],
        marginBottom: 5,
      },
      // Altın accent çizgi
      {
        canvas: [{
          type: 'rect',
          x: 0, y: 0,
          w: 540, h: 4,
          lineWidth: 0,
          fillColor: colors.accent,
        }],
        margin: [0, 0, 0, 15],
      },

      // BİLGİ KARTLARI
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                text: 'İşletme Bilgileri',
                style: 'cardTitle',
                fillColor: colors.primary,
                color: colors.white,
                margin: [10, 8, 10, 8],
              },
              {
                stack: [
                  { text: businessData.name, style: 'cardValue', margin: [10, 10, 10, 5] },
                  { text: businessData.type, style: 'cardSubValue', margin: [10, 0, 10, 10] },
                ],
                fillColor: colors.cardBg,
                border: [true, true, true, true],
              },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                text: 'Konum & İletişim',
                style: 'cardTitle',
                fillColor: colors.primary,
                color: colors.white,
                margin: [10, 8, 10, 8],
              },
              {
                stack: [
                  { text: businessData.district, style: 'cardValue', margin: [10, 10, 10, 5] },
                  { text: businessData.phone, style: 'cardSubValue', margin: [10, 0, 10, 5] },
                  { text: businessData.address, style: 'cardSubValue', margin: [10, 0, 10, 10] },
                ],
                fillColor: colors.cardBg,
                border: [true, true, true, true],
              },
            ],
          },
        ],
        marginBottom: 20,
      },

      // ÇALIŞMA SAATLERİ
      {
        text: 'Çalışma Saatleri',
        style: 'sectionTitle',
        marginBottom: 8,
      },
      {
        table: {
          widths: [120, '*'],
          body: businessData.openingHours.map((item, idx) => [
            {
              text: item.day,
              style: 'dayLabel',
              fillColor: idx % 2 === 0 ? colors.background : colors.white,
            },
            {
              text: item.hours,
              style: item.hours === 'Kapalı' ? 'hoursClosed' : 'hoursValue',
              fillColor: idx % 2 === 0 ? colors.background : colors.white,
            },
          ]),
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: () => colors.border,
          paddingTop: () => 6,
          paddingBottom: () => 6,
          paddingLeft: () => 10,
          paddingRight: () => 10,
        },
        marginBottom: 25,
      },

      // DİJİTAL SKOR
      {
        text: 'Dijital Olgunluk Skoru',
        style: 'sectionTitle',
        marginBottom: 10,
      },
      {
        table: {
          widths: [130, '*'],
          body: [
            [
              // Sol taraf - Skor gösterimi
              {
                stack: [
                  {
                    text: scorePercentage.toString(),
                    style: 'scoreNumber',
                    color: getScoreColor(scorePercentage),
                    alignment: 'center',
                  },
                  {
                    text: '/100',
                    style: 'scoreMax',
                    alignment: 'center',
                  },
                  {
                    canvas: [{
                      type: 'rect',
                      x: 10, y: 0,
                      w: 110, h: 10,
                      lineWidth: 1,
                      lineColor: colors.border,
                      fillColor: colors.background,
                      r: 5,
                    }],
                    margin: [0, 5, 0, 0],
                  },
                  {
                    canvas: [{
                      type: 'rect',
                      x: 10, y: 0,
                      w: Math.max(scorePercentage * 1.1, 5),
                      h: 10,
                      lineWidth: 0,
                      fillColor: getScoreColor(scorePercentage),
                      r: 5,
                    }],
                    margin: [0, -11, 0, 0],
                  },
                  {
                    text: scorePercentage < 40 ? 'Başlangıç Seviyesi' : scorePercentage < 70 ? 'Geliştirme Gerekli' : 'İyi Seviye',
                    style: 'scoreLabel',
                    alignment: 'center',
                    margin: [0, 8, 0, 0],
                  },
                ],
                fillColor: colors.cardBg,
                border: [true, true, true, true],
                margin: [0, 0, 10, 0],
              },
              // Sağ taraf - Varlık listesi
              {
                stack: digitalAssets.map((asset, idx) => ({
                  columns: [
                    {
                      text: getStatusIcon(asset.status),
                      style: 'statusIcon',
                      color: getStatusColor(asset.status),
                      width: 20,
                    },
                    {
                      text: asset.name,
                      style: 'assetName',
                      width: 110,
                    },
                    {
                      text: `${asset.score}/${asset.maxScore}`,
                      style: 'assetScore',
                      width: 40,
                    },
                    {
                      text: asset.note || (asset.status === 'var' ? 'Mevcut' : asset.status === 'yok' ? 'Eksik' : 'Kontrol edilmeli'),
                      style: 'assetNote',
                    },
                  ],
                  margin: [5, idx === 0 ? 0 : 5, 5, 5],
                  fillColor: idx % 2 === 0 ? colors.background : colors.white,
                })),
                border: [true, true, true, true],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingTop: () => 10,
          paddingBottom: () => 10,
          paddingLeft: () => 5,
          paddingRight: () => 5,
        },
        marginBottom: 25,
      },

      // EKSİKLİKLER
      {
        text: 'Eksiklikler',
        style: 'sectionTitle',
        marginBottom: 10,
      },
      ...eksiklikler.map((item, idx) => ({
        stack: [
          {
            columns: [
              {
                text: `${idx + 1}. ${item.title}`,
                style: 'eksiklikTitle',
                width: '*',
              },
              {
                text: item.impact.toUpperCase(),
                style: 'impactBadge',
                color: getImpactColor(item.impact),
                fillColor: getImpactColor(item.impact) + '20',
                margin: [10, 0, 0, 0],
              },
            ],
            marginBottom: 5,
          },
          {
            text: item.description,
            style: 'eksiklikDesc',
            marginBottom: idx < eksiklikler.length - 1 ? 12 : 0,
          },
          ...(idx < eksiklikler.length - 1 ? [{
            canvas: [{
              type: 'line',
              x1: 0, y1: 0,
              x2: 470, y2: 0,
              lineWidth: 0.5,
              lineColor: colors.border,
              dash: { length: 4, space: 4 },
            }],
            margin: [0, 8, 0, 0],
          }] : []),
        ],
      })),
      { text: '', marginBottom: 20 },

      // POTANSİYELLER
      {
        text: 'Potansiyeller',
        style: 'sectionTitle',
        marginBottom: 10,
      },
      ...potansiyeller.map((item, idx) => ({
        columns: [
          {
            width: 25,
            stack: [
              {
                text: '◆',
                style: 'bulletIcon',
                color: colors.accent,
                alignment: 'center',
              },
            ],
          },
          {
            width: '*',
            stack: [
              { text: item.title, style: 'potansiyelTitle' },
              { text: item.description, style: 'potansiyelDesc' },
              {
                text: item.value,
                style: 'potansiyelValue',
                margin: [0, 6, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 8, 0, 8],
        fillColor: idx % 2 === 0 ? colors.background : colors.white,
        colSpan: 2,
      })),
      { text: '', marginBottom: 20 },

      // KAZANIM TABLOSU
      {
        text: 'Eksiklikler Giderildiğinde Kazanımlar',
        style: 'sectionTitle',
        marginBottom: 10,
      },
      {
        table: {
          widths: [90, '*', '*'],
          body: [
            [
              { text: 'Alan', style: 'tableHeader' },
              { text: 'Şu An', style: 'tableHeader' },
              { text: 'Sonrasında', style: 'tableHeader' },
            ],
            ...kazanımlar.map((item) => [
              { text: item.title, style: 'kazanımTitle' },
              { text: item.before, style: 'kazanımBefore' },
              { text: item.after, style: 'kazanımAfter' },
            ]),
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => colors.border,
          paddingTop: () => 8,
          paddingBottom: () => 8,
          paddingLeft: () => 10,
          paddingRight: () => 10,
        },
        marginBottom: 25,
      },

      // YOL HARİTASI
      {
        text: 'Önerilen Yol Haritası',
        style: 'sectionTitle',
        marginBottom: 10,
      },
      {
        table: {
          widths: [35, '*', 70],
          body: [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'Adım', style: 'tableHeader' },
              { text: 'Süre', style: 'tableHeader', alignment: 'center' },
            ],
            ...sonrakiAdimlar.map((item) => [
              {
                text: item.step.toString(),
                style: 'stepNumber',
                alignment: 'center',
                fillColor: colors.accent,
                color: colors.white,
              },
              {
                stack: [
                  { text: item.title, style: 'stepTitle' },
                  { text: item.description, style: 'stepDesc' },
                ],
              },
              {
                text: item.timeline,
                style: 'stepTimeline',
                alignment: 'center',
              },
            ]),
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => colors.border,
          paddingTop: () => 10,
          paddingBottom: () => 10,
          paddingLeft: () => 10,
          paddingRight: () => 10,
        },
        marginBottom: 30,
      },

      // FOOTER
      {
        canvas: [{
          type: 'rect',
          x: 0, y: 0,
          w: 540, h: 2,
          lineWidth: 0,
          fillColor: colors.accent,
        }],
        margin: [0, 0, 0, 10],
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'JADENCY SOCIAL', style: 'footerCompany' },
              { text: 'Dijital Çözüm Ortağınız', style: 'footerTag' },
              { text: 'info@jadencysocial.com', style: 'footerContact' },
              { text: 'www.jadencysocial.com', style: 'footerContact' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Bu rapor otomatik olarak oluşturulmuştur.', style: 'footerNote', alignment: 'right' },
              { text: `Tarih: ${new Date().toLocaleDateString('tr-TR')}`, style: 'footerDate', alignment: 'right' },
            ],
          },
        ],
      },
    ],
    styles: {
      reportType: {
        fontSize: 10,
        color: colors.accent,
        bold: true,
        marginBottom: 3,
      },
      businessName: {
        fontSize: 20,
        color: colors.primary,
        bold: true,
      },
      businessType: {
        fontSize: 11,
        color: colors.lightText,
        marginTop: 3,
      },
      sectionTitle: {
        fontSize: 13,
        color: colors.primary,
        bold: true,
        marginBottom: 10,
      },
      cardTitle: {
        fontSize: 10,
        bold: true,
      },
      cardValue: {
        fontSize: 13,
        color: colors.text,
        bold: true,
      },
      cardSubValue: {
        fontSize: 9,
        color: colors.lightText,
      },
      dayLabel: {
        fontSize: 10,
        color: colors.text,
        bold: true,
      },
      hoursValue: {
        fontSize: 10,
        color: colors.text,
      },
      hoursClosed: {
        fontSize: 10,
        color: colors.danger,
        bold: true,
      },
      scoreNumber: {
        fontSize: 42,
        bold: true,
      },
      scoreMax: {
        fontSize: 16,
        color: colors.lightText,
      },
      scoreLabel: {
        fontSize: 9,
        color: colors.lightText,
        bold: true,
      },
      statusIcon: {
        fontSize: 12,
        bold: true,
      },
      assetName: {
        fontSize: 9,
        color: colors.text,
      },
      assetScore: {
        fontSize: 9,
        color: colors.lightText,
        bold: true,
      },
      assetNote: {
        fontSize: 8,
        color: colors.lightText,
      },
      eksiklikTitle: {
        fontSize: 11,
        color: colors.text,
        bold: true,
      },
      eksiklikDesc: {
        fontSize: 9,
        color: colors.lightText,
        lineHeight: 1.3,
      },
      impactBadge: {
        fontSize: 8,
        bold: true,
      },
      bulletIcon: {
        fontSize: 14,
      },
      potansiyelTitle: {
        fontSize: 11,
        color: colors.text,
        bold: true,
      },
      potansiyelDesc: {
        fontSize: 9,
        color: colors.lightText,
        lineHeight: 1.3,
      },
      potansiyelValue: {
        fontSize: 9,
        color: colors.success,
        bold: true,
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: colors.white,
        fillColor: colors.primary,
      },
      kazanımTitle: {
        fontSize: 9,
        color: colors.text,
        bold: true,
      },
      kazanımBefore: {
        fontSize: 9,
        color: colors.danger,
      },
      kazanımAfter: {
        fontSize: 9,
        color: colors.success,
      },
      stepNumber: {
        fontSize: 14,
        bold: true,
      },
      stepTitle: {
        fontSize: 10,
        color: colors.text,
        bold: true,
      },
      stepDesc: {
        fontSize: 8,
        color: colors.lightText,
        marginTop: 2,
      },
      stepTimeline: {
        fontSize: 9,
        color: colors.primary,
        bold: true,
      },
      footerCompany: {
        fontSize: 11,
        color: colors.primary,
        bold: true,
      },
      footerTag: {
        fontSize: 9,
        color: colors.accent,
        marginTop: 2,
      },
      footerContact: {
        fontSize: 9,
        color: colors.lightText,
        marginTop: 2,
      },
      footerNote: {
        fontSize: 9,
        color: colors.lightText,
      },
      footerDate: {
        fontSize: 9,
        color: colors.lightText,
        marginTop: 2,
      },
    },
    defaultStyle: {
      font: 'Noto Sans',
    },
  };

  return new Promise<Buffer>((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}

export async function savePdf(buffer: Buffer, filePath: string): Promise<string> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

async function main() {
  console.log('📊 GOLD MOON BEAUTY HOME - Analiz Raporu Oluşturuluyor...\n');

  const pdfBuffer = await generateBusinessReport();
  const outputPath = path.join(__dirname, '..', 'reports', 'gold-moon-analiz-raporu.pdf');
  const savedPath = await savePdf(pdfBuffer, outputPath);

  console.log(`✅ Rapor oluşturuldu: ${savedPath}`);
  console.log(`📄 Dosya boyutu: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
