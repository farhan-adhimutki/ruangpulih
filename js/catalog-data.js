/**
 * Data katalog statis Ruang Pulih.
 * Ubah array ini untuk memperbarui katalog — tidak ada backend.
 * Jika array dikosongkan ([]), halaman otomatis menampilkan "Produk akan segera hadir".
 *
 * @typedef {Object} CatalogItem
 * @property {string} id
 * @property {string} title
 * @property {'Buku'|'Jurnal'} category
 * @property {number} price        Harga dalam Rupiah
 * @property {string} coverColor   Hex, dipakai sebagai warna cover placeholder
 * @property {string} [description]
 *
 * CATATAN: judul, kategori, dan harga masih DUMMY — menunggu finalisasi dari Cakap.
 */
window.CATALOG_ITEMS = [
  {
    id: 'rp-b01',
    title: 'Pelan-Pelan Saja',
    category: 'Buku',
    price: 89000,
    coverColor: '#00BFFF',
    description: 'Kumpulan esai pendek tentang menerima hari-hari yang tidak baik-baik saja.'
  },
  {
    id: 'rp-b02',
    title: 'Mengenal Cemas',
    category: 'Buku',
    price: 95000,
    coverColor: '#062B3D',
    description: 'Panduan ringan memahami kecemasan: dari tubuh, pikiran, hingga cara meredakannya.'
  },
  {
    id: 'rp-b03',
    title: 'Surat untuk Diri Sendiri',
    category: 'Buku',
    price: 79000,
    coverColor: '#7FDFFF',
    description: 'Prompt menulis reflektif untuk berdamai dengan masa lalu dan merawat harapan.'
  },
  {
    id: 'rp-j01',
    title: 'Jurnal Syukur 90 Hari',
    category: 'Jurnal',
    price: 69000,
    coverColor: '#FFFFFF',
    description: 'Tiga baris sehari untuk melatih perhatian pada hal-hal kecil yang menguatkan.'
  },
  {
    id: 'rp-j02',
    title: 'Jurnal Suasana Hati',
    category: 'Jurnal',
    price: 75000,
    coverColor: '#0099CC',
    description: 'Lacak pola emosimu dengan pelacak harian, mingguan, dan catatan pemicu.'
  }
];
