# JadencySocial Autonomous Agent System

Otonom sosyal medya ajansı sistemi. Google Maps'ten işletme keşfi, analiz, arama, teklif oluşturma ve raporlama süreçlerini otomatikleştirir.

## Kurulum

### Gereksinimler

- Node.js 20+
- Bun veya npm
- SQLite (otomatik kurulur)

### Adımlar

```bash
# 1. Bağımlılıkları yükle
cd autonomous
npm install

# 2. .env dosyasını oluştur
cp .env.example .env

# 3. .env dosyasını düzenle ve API anahtarlarını ekle
nano .env

# 4. Veritabanını başlat
npm run migrate
npm run db:seed

# 5. Cron job'ları ayarla (opsiyonel)
./cron/setup-cron.sh
```

## Yapılandırma

### .env Değişkenleri

```bash
# Google Maps API (Scout için gerekli)
GOOGLE_MAPS_API_KEY=your_key_here

# Anthropic (AI agent'lar için gerekli)
ANTHROPIC_API_KEY=your_key_here

# Stripe (Ödemeler için gerekli)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Twilio (Aramalar için gerekli)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx

# ElevenLabs (Sesli yanıt için)
ELEVENLABS_API_KEY=xxx

# Resend (E-posta için)
RESEND_API_KEY=re_xxx

# Telegram Bildirimleri
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
```

### Bölge Yapılandırması

Bölgeleri düzenlemek için `config/regions.json` dosyasını değiştir:

```json
{
  "regions": [
    {
      "id": "tekirdag-merkez",
      "name": "Tekirdağ Merkez",
      "coordinates": { "lat": 40.9833, "lng": 27.5167 },
      "radius_km": 10,
      "categories": ["restaurant", "cafe", "hotel"]
    }
  ]
}
```

### Fiyatlandırma Yapılandırması

Paketleri ve fiyatları değiştirmek için `config/pricing.json` dosyasını düzenle.

## Kullanım

### Agent'ları Manuel Çalıştırma

```bash
# Scout - Yeni işletme keşfi
npm run scout

# Analyst - İşletme analizi
npm run analyst

# Prioritizer - Öncelik sıralama
npm run prioritizer

# Caller - Aramalar
npm run caller

# Proposal - Teklif oluşturma
npm run proposal

# Reporter - Raporlama
npm run reporter
```

### Cron Job'lar

Sistem cron job'ları otomatik olarak çalışır:

| Cron | Zamanlama | Açıklama |
|------|-----------|----------|
| `nightly-scout.sh` | Her gece 02:00 | Yeni işletme taraması |
| `daily-calls.sh` | Her gün 09:00 | Öncelikli aramalar |
| `payment-monitor.sh` | Her gün 10:00 | Ödeme takibi |
| `weekly-report.sh` | Her Pazartesi 08:00 | Haftalık raporlar |

### Cron Job'ları Etkinleştir

```bash
# Cron job'ları kur
./cron/setup-cron.sh

# Kurulumu doğrula
crontab -l
```

## Agent Sistemi

### Scout Agent
- Google Maps API ile işletme keşfi
- Bölge bazlı tarama
- İşletme bilgileri toplama

### Analyst Agent
- Web sitesi analizi
- SEO skoru hesaplama
- Sosyal medya varlık kontrolü
- Yorum analizi

### Prioritizer Agent
- Lead skoru hesaplama
- Öncelik sıralaması
- Çağrı kuyruğu yönetimi

### Caller Agent
- Twilio ile otomatik arama
- WhatsApp/Telegram mesajlaşma
- Görüşme kaydı

### Proposal Agent
- PDF teklif oluşturma
- Fiyatlandırma hesaplama
- Stripe ödeme linkleri

### Builder Agent
- İçerik takvimi oluşturma
- Kampanya yönetimi
- Performans optimizasyonu

### Reporter Agent
- Haftalık/aylık raporlar
- Metrik analizi
- Müşteri bildirimleri

## Veritabanı

### Şemayı Güncelleme

```bash
npm run migrate
```

### Veritabanını Sıfırlama

```bash
# Dikkat: Tüm veriler silinir!
npm run reset
```

### Veritabanı İstatistikleri

```bash
npm run db:stats
```

## API Entegrasyonları

### Google Maps
- Places API: İşletme keşfi
- Geocoding: Adres dönüşümü

### Stripe
- Müşteri yönetimi
- Faturalama
- Ödeme takibi

### Twilio
- VoIP aramaları
- SMS/WhatsApp mesajları

### Anthropic/Claude
- İçerik üretimi
- Metin analizi
- Rapor özetleme

## Loglar

Loglar `logs/` dizininde saklanır:

```bash
# Scout logları
tail -f logs/scout-$(date +%Y%m%d).log

# Aramalar logları
tail -f logs/calls-$(date +%Y%m%d).log
```

## Sorun Giderme

### Scout çalışmıyor
```bash
# API anahtarını kontrol et
echo $GOOGLE_MAPS_API_KEY

# Rate limit kontrol et
tail -20 logs/scout-$(date +%Y%m%d).log
```

### Arama yapılamıyor
```bash
# Twilio yapılandırmasını kontrol et
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_PHONE_NUMBER

# Numara formatını kontrol et (+90 ile başlamalı)
```

### Veritabanı hatası
```bash
# Veritabanı dosyasını kontrol et
ls -la data/

# Şemayı yeniden oluştur
npm run migrate
```

## Güvenlik

- API anahtarlarını asla git'e commit etme
- `.env` dosyası `.gitignore`'da olmalı
- Hassas verileri log'lama
- Webhook imzalarını doğrula

## Lisans

Özel kullanım - JadencySocial
