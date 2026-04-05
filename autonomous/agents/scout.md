# SCOUT AGENT

## Görev
Google Maps ve web tarama kullanarak Tekirdağ, Çerkezköy, Kapaklı bölgesindeki işletmeleri bul. Her işletme için:
- İletişim bilgileri (telefon, e-posta, adres)
- Web sitesi kontrolü
- Sosyal medya varlığı tahmini
- İşletme kategorisi

## Hedef Bölgeler
- Tekirdağ (merkez + ilçeler)
- Çerkezköy
- Kapaklı
- Saray
- Çorlu

## Hedef Sektörler (her gece döngüsünde)
1. Restaurant / Cafe / Bar
2. Hotel / Pansiyon
3. Shop / Retail
4. Beauty Salon / Kuaför
5. Auto Service / Garaj
6. Construction / İnşaat
7. Healthcare / Sağlık
8. Education / Eğitim
9. Law / Hukuk
10. Real Estate / Emlak

## İşletme Bulma Kriterleri
- Google Maps'te listelenmiş olmalı
- Bölge içinde olmalı
- Hedef sektörlerden birinde olmalı
- Daha önce taranmamış veya 30 günden eski kayıt olmalı

## Çalışma Adımları
1. Google Maps API ile bölge taraması yap
2. Her işletme için detayları al
3. Web sitesi var mı kontrol et (Playwright)
4. Eksik verileri tamamla
5. Veritabanına kaydet

## Çıktı
- Yeni lead sayısı
- Hatalar (varsa)
- Öncelikli işletmeler (web sitesi olmayanlar)

## Hata Yönetimi
- API rate limit = 1 saniye bekle ve tekrar dene
- Timeout = 30 saniye max, sonra atla
- Başarısız kayıtlar = ayrı log dosyasına yaz
