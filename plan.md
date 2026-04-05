# Plan: Mobilde Bulut Parçacıklarını Ekran İçinde Tutma

## Context
Mobil cihazlarda Hero bölümündeki bulut/parçacık efektleri ekranın sağ ve sol kenarlarından taşıyor. Bunun sebebi, partiküllerin 4.5 birimlik yarıçapla 3D küre şeklinde dağılması ve mobil ekranların dar olması.

## Çözüm
`ParticleSystem.tsx` içinde `generateParticlePositions` fonksiyonunu mobilde (768px altı ekran genişliği) daha küçük bir yarıçap kullanacak şekilde güncellemek.

## Değişiklik
**Dosya:** `src/components/Hero/ParticleSystem.tsx`

Partikül dağılım yarıçapını viewport genişliğine göre dinamik hale getir:

```typescript
function generateParticlePositions(count: number, isMobile: boolean): Float32Array {
  const positions = new Float32Array(count * 3);
  // Mobilde yarıçapı küçült (ekran dışına taşmayı önlemek için)
  const maxRadius = isMobile ? 3.0 : 4.5;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.5) * maxRadius;
    // ...
  }
  return positions;
}
```

`ParticleSystem` bileşeninde viewport genişliğini kontrol edip `isMobile` parametresini geçir.

## Doğrulama
1. `npm run build` - build başarılı olmalı
2. Mobil tarayıcıda (Chrome DevTools mobile view) bulutların ekran içinde kaldığını doğrula
3. Desktop'ta görünümün değişmediğini doğrula
