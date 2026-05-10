# Mobile Checklist

## Target

Website harus aman untuk HP kecil, tidak melebar, tidak membuat horizontal scroll, dan tetap rapi di RAM rendah.

## Yang Sudah Diamankan

- `html`, `body`, dan `#root` dikunci `overflow-x: hidden`
- Semua container utama diberi `max-width: 100%`
- Dock atas dibuat tidak melebar keluar layar
- Elemen horizontal seperti kategori, frontier, dock metrics, dan lab list memakai scroll internal
- Scrollbar horizontal kecil disembunyikan agar UI bersih
- Hero title mengecil otomatis
- Hero orbital disembunyikan di mobile agar layar tidak penuh
- Grid besar berubah menjadi 1 kolom di mobile
- Lab card dibuat horizontal scroll internal
- Visual 3D dibuat lebih pendek di layar kecil
- Metric dock berubah menjadi 2 kolom atau 1 kolom di layar sangat kecil
- AI answer diberi batas tinggi agar tidak memanjang berlebihan
- Notification popover dikunci agar tidak keluar viewport
- Formula panjang memakai overflow-wrap
- Text panjang tidak membuat layout pecah
- WebGL fallback tetap rapi di HP
- Tombol dibuat lebih pendek dan compact
- Panel dibuat lebih kecil dan padat di mobile

## Ukuran Yang Perlu Dites

- 360px
- 390px
- 412px
- 430px
- 768px
- 820px
- 1024px

## Cara Tes Cepat

```bash
npm run dev