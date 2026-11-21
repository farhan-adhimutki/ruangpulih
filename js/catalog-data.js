/**
 * Data katalog statis Ruang Pulih.
 * Ubah array ini untuk memperbarui katalog — tidak ada backend.
 * Jika array dikosongkan ([]), halaman otomatis menampilkan "Produk akan segera hadir".
 *
 * @typedef {Object} CatalogItem
 * @property {string} id
 * @property {string} title
 * @property {'Buku'|'Merchandise'} category
 * @property {number} price        Harga dalam Rupiah
 * @property {string[]} images     Path gambar (img/web/*.webp). Lebih dari 1 → slider otomatis tiap 2 detik.
 * @property {string} [buyUrl]     Link pembelian (mis. Shopee). Jika kosong, tombol beli tidak tampil.
 * @property {string} [description]
 *
 * Gambar asli (PNG besar) ada di img/. Versi web terkompresi ada di img/web/.
 */
var SHOPEE_BUKU = 'https://id.shp.ee/ShdejYjZ';

window.CATALOG_ITEMS = [
  {
    id: 'rp-b01',
    title: 'Rusak Saja Buku Ini',
    category: 'Buku',
    price: 35000,
    description: 'Tersedia 3 versi: for Emotional Therapy, Girl Version, dan The Journal.',
    images: ['img/web/book.webp', 'img/web/girlversion.webp', 'img/web/thejourney.webp'],
    buyUrl: SHOPEE_BUKU
  },
  {
    id: 'rp-m01',
    title: 'Psymirror',
    category: 'Merchandise',
    price: 15000,
    images: ['img/web/Psymirrorslide1.webp', 'img/web/Psymirrorslide2.webp']
  },
  {
    id: 'rp-m02',
    title: 'Anxiety Ring',
    category: 'Merchandise',
    price: 27000,
    images: ['img/web/cincinslide1.webp', 'img/web/cincinslide2.webp', 'img/web/cincinslide3.webp']
  },
  {
    id: 'rp-m03',
    title: 'Sleeping Patch',
    category: 'Merchandise',
    price: 37000,
    images: ['img/web/sleepingpatchslide1.webp', 'img/web/sleepingpatchslide2.webp']
  },
  {
    id: 'rp-m04',
    title: 'Affirmation Card',
    category: 'Merchandise',
    price: 15000,
    images: ['img/web/AfirmationCardslide1.webp', 'img/web/AfirmationCardslide2.webp']
  }
];
