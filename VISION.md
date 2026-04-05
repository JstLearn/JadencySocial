# JadencySocial — Otonom Ajans Sistemi Vizyonu

> Son güncelleme: 2026-04-04  
> Durum: Vizyon / Faz planlaması

---

## Hedef

JadencySocial'ı bir web sitesinden, **kendi kendine müşteri bulan, analiz eden, arayıp sunan, para toplayan ve iş yapan** otonom bir ajans sistemine dönüştürmek.

Sistem insan müdahalesi olmadan çalışır. Zeus (Claude Code) ve alt ajanları cron job'larla tetiklenir, kararları kendileri alır, deterministik pipeline değil — **düşünen ajanlar** zinciri.

---

## Sistem Akışı

```
[CRON: Her gece] 
      │
      ▼
[Scout Agent] ──────────────────────────────────────────────────┐
  Google Maps, Instagram, LinkedIn, web sitelerini tara         │
  Hedef: Tekirdağ, Çerkezköy, Kapaklı bölgesi işletmeleri      │
  Çıktı: lead_db → leads tablosuna kayıt                        │
      │                                                          │
      ▼                                                          │
[Analyst Agent]                                                  │
  Her işletmenin dijital varlığını değerlendir                  │
  Web sitesi var mı? Sosyal medya aktif mi?                     │
  SEO skoru, review sayısı, içerik kalitesi                     │
  Çıktı: lead_db → analysis tablosuna puan + eksik listesi      │
      │                                                          │
      ▼                                                          │
[Prioritizer Agent]                                              │
  Skorlama: düşük dijital varlık + yüksek potansiyel = öncelik  │
  Zaten müşteri olanları filtrele                               │
  Çıktı: call_queue → aranacak sıra                             │
      │                                                          │
      ▼                                                          │
[Caller Agent] ←── ElevenLabs Voice AI                         │
  Kişiselleştirilmiş script oluştur (analiz sonucuna göre)      │
  Twilio üzerinden ara                                           │
  Konuşmayı kaydet + transkript al                              │
  Çıktı: call_db → sonuç (ilgileniyor / ilgisiz / tekrar ara)   │
      │                                                          │
      ▼ (ilgileniyor)                                            │
[Proposal Agent]                                                 │
  PDF teklif oluştur (analiz + öneri + fiyat)                   │
  E-posta ile gönder                                             │
  Stripe ödeme linki ekle                                        │
  Çıktı: proposal_db → takip                                    │
      │                                                          │
      ▼ (ödeme alındı — Stripe webhook)                          │
[Builder Agent] ←── Zeus + Alt Ajanlar                         │
  Müşteri için gerekli geliştirmeleri yap                        │
  Web sitesi / sosyal medya şablonu / içerik üretimi            │
  GitHub repo oluştur, build et, deploy et                       │
  Çıktı: delivery_db → teslim edildi                            │
      │                                                          │
      ▼                                                          │
[Reporter Agent]                                                 │
  Telegram bildirimi: ne yapıldı, kaç TL kazanıldı              │
  Haftalık özet raporu                                           │
  ────────────────────────────────────────────────────────────────┘
```

---

## Mimari: Neden Deterministik Docker Değil?

Deterministik servisler (sabit input → sabit output pipeline) bu iş için yanlış.  
Çünkü:

- Her işletme farklı — analiz kararı bağlama göre değişmeli
- Arama scripti dinamik — müşterinin sektörüne, büyüklüğüne göre şekillenmeli
- Geliştirme görevi tahmin edilemez — ne yapılacağını agent karar vermeli

**Doğru model: Cron → Claude Code Agent → Alt Ajanlar → Araçlar**

```
Cron job
  └─ claude --dangerously-skip-permissions -p "scout görevi çalıştır"
       └─ Scout Agent (bu repodaki prompt + araçlar)
            ├─ Playwright (crawling)
            ├─ SQLite/PostgreSQL (state)
            └─ Claude API (analiz kararı)
```

Her ajan:
- Kendi promptu var (`agents/` altında)
- Araçlarını biliyor (hangi API'yi nasıl kullanacağını)
- State'i DB'ye yazar, bir sonraki ajan oradan okur
- Başarısız olursa retry logic var, hata Telegram'a düşer

---

## Dizin Yapısı (Hedef)

```
JadencySocial/
├── src/                    # Mevcut web sitesi (React)
├── autonomous/             # Otonom sistem
│   ├── agents/             # Her ajanın prompt + config dosyası
│   │   ├── scout.md        # Bölge tarama talimatları
│   │   ├── analyst.md      # Dijital varlık değerlendirme
│   │   ├── prioritizer.md  # Lead sıralama kriterleri
│   │   ├── caller.md       # Arama script şablonları
│   │   ├── proposal.md     # Teklif oluşturma
│   │   ├── builder.md      # Geliştirme görevleri
│   │   └── reporter.md     # Raporlama + Telegram
│   ├── tools/              # Ajan araçları (Node.js scriptleri)
│   │   ├── google-maps.ts  # Maps API wrapper
│   │   ├── playwright-crawler.ts
│   │   ├── elevenlabs.ts   # Voice call wrapper
│   │   ├── twilio.ts       # SMS + arama
│   │   ├── stripe.ts       # Ödeme + webhook
│   │   ├── pdf-generator.ts
│   │   └── github-deploy.ts
│   ├── db/                 # State yönetimi
│   │   ├── schema.sql      # Leads, calls, proposals, deliveries
│   │   └── migrate.ts
│   ├── cron/               # Cron job tanımları
│   │   ├── nightly-scout.sh      # Her gece yeni lead tara
│   │   ├── daily-calls.sh        # Sabah aramaları başlat
│   │   ├── payment-monitor.sh    # Stripe webhook dinle
│   │   └── weekly-report.sh      # Haftalık özet
│   └── config/
│       ├── regions.json    # Hedef bölgeler ve sektörler
│       ├── pricing.json    # Hizmet fiyatlandırması
│       └── scripts/        # ElevenLabs konuşma scriptleri
└── VISION.md               # Bu dosya
```

---

## Faz Planı

### Faz 1 — Scout + Analyst (Temel Veri)
**Hedef:** Bölgedeki işletmeleri otomatik bul ve dijital skorla

- [ ] Google Maps API entegrasyonu (işletme listesi)
- [ ] Playwright ile web sitesi kontrolü (var mı? ne durumda?)
- [ ] Instagram/sosyal medya varlık kontrolü
- [ ] SQLite DB (leads tablosu)
- [ ] Claude ile analiz + skor atama
- [ ] Cron job: her gece çalışır, sonucu Telegram'a bildirir

**Çıktı:** "Bu hafta 47 yeni işletme bulundu, 12'si yüksek öncelikli"

---

### Faz 2 — Proposal + Manuel Onay
**Hedef:** Hazır teklif + manuel arama aşaması

- [ ] Yüksek öncelikli leadler için PDF teklif üret
- [ ] E-posta gönderme (Nodemailer / Resend)
- [ ] Stripe ödeme linki oluştur
- [ ] Telegram'da lead listesi → sen manuel arazsın
- [ ] Ödeme alındığında Telegram bildirimi

**Çıktı:** Sistem hazırlar, sen ararsın

---

### Faz 3 — Caller Agent (Tam Otomasyon)
**Hedef:** Aramaları sisteme devret

- [ ] ElevenLabs voice agent kurulumu
- [ ] Twilio outbound call entegrasyonu
- [ ] Dinamik script: işletme tipine göre kişiselleştir
- [ ] Konuşma transkripsiyonu + sonuç kaydetme
- [ ] "İlgileniyor" → otomatik teklif gönder

**Çıktı:** Sistem arar, merak edeni takibe alır

---

### Faz 4 — Builder Agent
**Hedef:** Ödeme sonrası teslimatı otomatikleştir

- [ ] Ödeme webhook → görev oluştur
- [ ] Builder agent: müşteri için ne gerekiyorsa yap
  - Basit web sitesi → HTML/CSS üret + Cloudflare Pages deploy
  - Sosyal medya içeriği → Claude ile üret + taslak gönder
  - Logo/görsel → Stable Diffusion veya fal.ai
- [ ] Teslim e-postası + Telegram bildirimi

**Çıktı:** Para alındı → 24 saat içinde teslim

---

### Faz 5 — Tam Otonom Döngü
**Hedef:** İnsan müdahalesi sıfıra indir

- [ ] Tüm ajanlar birbirine bağlı
- [ ] Haftalık özet raporu (kazanç, lead sayısı, teslim edilen)
- [ ] Hata yönetimi (başarısız aramaları tekrar zamanla)
- [ ] Müşteri memnuniyet takibi
- [ ] Kendi kendini iyileştiren scriptler (düşük conversion → script güncelle)

**Çıktı:** Sistem kendi başına para kazanıyor

---

## Teknoloji Seçimleri

| İhtiyaç | Araç | Neden |
|---------|------|-------|
| Web crawling | Playwright | Headless, JS render eder |
| İşletme verisi | Google Maps API | Güvenilir, kapsamlı |
| Sosyal analiz | Playwright + Instagram public | API yok, scrape |
| Voice AI | ElevenLabs Conversational AI | Türkçe destek, doğal |
| Arama | Twilio | Programatik outbound call |
| Ödeme | Stripe | Webhook + link oluşturma |
| State DB | SQLite (başlangıç) → PostgreSQL | Basit → ölçeklenebilir |
| E-posta | Resend | Basit API, yüksek deliverability |
| PDF | Puppeteer veya pdfmake | Node.js içinde |
| Deploy | Cloudflare Pages API | Ücretsiz, hızlı |
| Ajan dili | TypeScript + Bun | Mevcut stack ile uyumlu |
| Cron | Linux crontab | Basit, güvenilir |
| Bildirimler | Telegram (mevcut Zeus entegrasyonu) | Zaten kurulu |

---

## Önemli Notlar

**Yasal:**
- KVKK uyumu için arama öncesi opt-out mekanizması
- "Ticari amaçlı otomatik arama" yasal gri alan — dikkatli kurgula
- İlk fazda manuel arama, otomasyon ikinci aşamada

**Maliyet:**
- ElevenLabs: ~$0.10/dakika konuşma
- Twilio: ~$0.013/dakika arama (Türkiye)
- Google Maps API: $17/1000 yer araması
- Claude API: ~$0.015/1K token (Sonnet)
- Hedef: 1 müşteri = minimum 3.000 TL → sistem kendini amorti eder

**Öncelik:**
- Faz 1 olmadan hiçbir şey çalışmaz — önce data
- Her faz bağımsız çalışabilmeli — birini tamamla, sonrakine geç
- Telegram bildirimleri her fazda aktif — ne olduğunu görmek kritik

---

## Başlangıç

Faz 1'i başlatmak için: Patron'un "başla" demesi yeterli.  
Zeus otomatik olarak:
1. `autonomous/` dizin yapısını oluşturur
2. Scout agent için Google Maps entegrasyonunu yazar
3. DB şemasını kurar
4. İlk cron job'u yapılandırır
5. Test çalıştırır, Telegram'a sonuç bildirir
