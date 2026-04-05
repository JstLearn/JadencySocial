# =============================================
# CLOUDFLARE DNS KAYITLARI - E-Posta Kurulumu
# =============================================
# Cloudflare Dashboard > Domain > DNS > Add Record
#
# -----------------------------------------------------------
# 1. MX RECORD (Zorunlu - E-posta yönlendirme)
# -----------------------------------------------------------
# Type: MX
# Name: @ (domain adı)
# Mail server: mail.jadencysocial.com
# Priority: 10
# TTL: Auto
#
# -----------------------------------------------------------
# 2. TXT RECORD - SPF (Gönderim yetkilendirme)
# -----------------------------------------------------------
# Type: TXT
# Name: @
# Value: v=spf1 mx ~all
# TTL: Auto
#
# -----------------------------------------------------------
# 3. TXT RECORD - DKIM (Kimlik doğrulama)
# -----------------------------------------------------------
# Cloudflare Email Security'den DKIM key alınır
# Type: TXT
# Name: mail._domainkey
# Value: (Cloudflare'dan alınan public key)
# TTL: Auto
#
# -----------------------------------------------------------
# 4. TXT RECORD - DMARC
# -----------------------------------------------------------
# Type: TXT
# Name: _dmarc
# Value: v=DMARC1; p=quarantine; rua=mailto:hello@jadencysocial.com
# TTL: Auto
#
# -----------------------------------------------------------
# 5. CNAME - Webmail yönlendirme (opsiyonel)
# -----------------------------------------------------------
# Type: CNAME
# Name: webmail
# Target: panel.veriupmail.com
# TTL: Auto
#
# -----------------------------------------------------------
# 6. CNAME - Autodiscover (Outlook/Mobile setup)
# -----------------------------------------------------------
# Type: CNAME
# Name: autoconfig
# Target: panel.veriupmail.com
# TTL: Auto

# =============================================
# SUNUCU BİLGİLERİ
# =============================================
# Gelen Sunucu (IMAP): mail.jadencysocial.com:993
# Giden Sunucu (SMTP): mail.jadencysocial.com:587
# POP3: mail.jadencysocial.com:110
# Webmail: https://panel.veriupmail.com
#
# DNS Sunucuları:
#   ns1.minimail.com.tr (135.181.228.117)
#   ns2.minimail.com.tr (135.181.228.117)
# DNS TTL: 1800 Sn