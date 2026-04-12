import { PrismaClient, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Create Admin User ──
  const hashedPassword = await bcrypt.hash('MediaKajo2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediakajo.id' },
    update: {},
    create: {
      name: 'Admin Media Kajoo',
      email: 'admin@mediakajo.id',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ── Create Categories ──
  const categoriesData = [
    { name: 'Teknologi', slug: 'teknologi', color: '#2563EB', description: 'Berita seputar teknologi, gadget, dan dunia digital' },
    { name: 'Bisnis', slug: 'bisnis', color: '#16A34A', description: 'Update dunia bisnis, ekonomi, dan keuangan' },
    { name: 'Olahraga', slug: 'olahraga', color: '#DC2626', description: 'Berita terkini dari dunia olahraga' },
    { name: 'Gaya Hidup', slug: 'gaya-hidup', color: '#D97706', description: 'Tips dan tren gaya hidup modern' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log('✅ Categories created:', categories.length);

  // ── Create Sample Articles ──
  const articlesData = [
    {
      title: 'Revolusi AI di Tahun 2026: Bagaimana Kecerdasan Buatan Mengubah Cara Kita Bekerja',
      slug: 'revolusi-ai-di-tahun-2026',
      excerpt: 'Kecerdasan buatan telah melampaui ekspektasi banyak orang. Dari otomasi tugas rutin hingga kreativitas, AI kini menjadi bagian tak terpisahkan dari kehidupan kerja modern.',
      content: '<p>Tahun 2026 menjadi tonggak penting dalam sejarah kecerdasan buatan. Berbagai perusahaan teknologi besar telah meluncurkan model AI generasi terbaru yang mampu menyelesaikan tugas-tugas kompleks dengan tingkat akurasi yang belum pernah terlihat sebelumnya.</p><h2>Dampak pada Dunia Kerja</h2><p>Otomasi bukan lagi ancaman, melainkan peluang. Pekerja yang mampu berkolaborasi dengan AI justru menjadi lebih produktif dan kreatif. Perusahaan-perusahaan mulai merestrukturisasi tim mereka untuk mengintegrasikan AI sebagai "rekan kerja digital".</p><h2>Apa yang Harus Dipersiapkan?</h2><p>Para ahli menyarankan agar para profesional mulai membekali diri dengan keterampilan prompt engineering, analisis data, dan pemikiran kritis. Kemampuan beradaptasi menjadi kunci utama di era AI.</p>',
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    },
    {
      title: 'Startup Lokal Raih Pendanaan Seri B Senilai $50 Juta untuk Ekspansi ke Asia Tenggara',
      slug: 'startup-lokal-raih-pendanaan-seri-b',
      excerpt: 'Sebuah startup fintech asal Jakarta berhasil menutup putaran pendanaan Seri B yang dipimpin oleh investor global ternama.',
      content: '<p>Jakarta — Startup fintech <strong>PayNusa</strong> mengumumkan penutupan putaran pendanaan Seri B senilai $50 juta yang dipimpin oleh Sequoia Capital Southeast Asia. Pendanaan ini akan digunakan untuk memperluas layanan ke lima negara di Asia Tenggara.</p><h2>Visi Ekspansi</h2><p>"Kami melihat potensi besar di pasar Asia Tenggara yang masih underbanked," ujar CEO PayNusa, Budi Santoso. "Dengan pendanaan ini, kami berencana meluncurkan di Thailand, Vietnam, dan Filipina dalam 12 bulan ke depan."</p><h2>Pertumbuhan Pesat</h2><p>PayNusa mencatat pertumbuhan pengguna sebesar 300% sepanjang tahun 2025, dengan total transaksi mencapai Rp 2 triliun per bulan. Platform ini menyediakan layanan pembayaran digital, transfer uang, dan pinjaman mikro untuk UMKM.</p>',
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    },
    {
      title: 'Timnas Indonesia U-23 Melaju ke Semifinal Piala Asia dengan Kemenangan Dramatis',
      slug: 'timnas-indonesia-u23-semifinal-piala-asia',
      excerpt: 'Dengan gol di injury time, Timnas Indonesia U-23 berhasil mengalahkan Korea Selatan dan melaju ke babak semifinal.',
      content: '<p>Doha, Qatar — Timnas Indonesia U-23 membuat sejarah dengan mengalahkan Korea Selatan 2-1 dalam pertandingan perempat final Piala Asia U-23 2026. Gol penentu dicetak oleh Marselino Ferdinan di menit ke-90+3.</p><h2>Pertandingan Penuh Drama</h2><p>Korea Selatan membuka skor di menit ke-35 melalui tendangan bebas yang melengkung indah melewati tembok pertahanan Indonesia. Namun, Garuda Muda tidak menyerah dan menyamakan kedudukan melalui sundulan Pratama Arhan di babak kedua.</p><h2>Reaksi Pelatih</h2><p>"Ini adalah momen yang akan dikenang selamanya oleh sepak bola Indonesia," ujar pelatih Shin Tae-yong pasca pertandingan. "Para pemain menunjukkan mental juara dan tidak pernah menyerah."</p>',
      categoryIndex: 2,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    },
    {
      title: 'Tren Minimalis 2026: Mengapa Semakin Banyak Orang Memilih Hidup dengan Lebih Sedikit',
      slug: 'tren-minimalis-2026',
      excerpt: 'Gaya hidup minimalis bukan sekadar tren estetika, tapi sebuah gerakan sadar untuk mengurangi konsumsi berlebihan.',
      content: '<p>Di tengah era konsumtif, semakin banyak generasi muda yang memilih jalur berbeda: hidup minimalis. Bukan sekadar tentang memiliki sedikit barang, minimalis adalah tentang memilih dengan sadar apa yang benar-benar memberi nilai dalam hidup.</p><h2>Lebih dari Sekadar Estetika</h2><p>Minimalis modern tidak berarti rumah putih kosong. Ini tentang mengurangi noise — baik fisik maupun digital — agar fokus pada hal-hal yang bermakna. Dari decluttering rumah hingga digital detox, praktik ini terbukti meningkatkan kesehatan mental.</p><h2>Tips Memulai</h2><ul><li>Mulai dari satu ruangan: bersihkan dan kurangi barang yang tidak dipakai dalam 6 bulan terakhir</li><li>Terapkan aturan "one in, one out"</li><li>Audit langganan digital kamu — berapa banyak yang benar-benar kamu gunakan?</li></ul>',
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
    },
    {
      title: 'Review MacBook Pro M5: Laptop Tercepat yang Pernah Kami Uji',
      slug: 'review-macbook-pro-m5',
      excerpt: 'Chip M5 membawa performa yang mencengangkan. Kami menguji seberapa jauh MacBook Pro terbaru ini bisa didorong.',
      content: '<p>Apple baru saja merilis MacBook Pro dengan chip M5, dan kami telah menggunakannya selama dua minggu penuh untuk workflow editing video, pengembangan software, dan penggunaan sehari-hari.</p><h2>Performa Luar Biasa</h2><p>Dalam benchmark Geekbench 6, M5 mencatatkan skor single-core 3.800 dan multi-core 19.500 — peningkatan 40% dari M4. Rendering video 4K di DaVinci Resolve terasa hampir real-time, dan Xcode build time berkurang drastis.</p><h2>Baterai</h2><p>Apple mengklaim 24 jam battery life, dan dalam pengujian kami, MacBook Pro M5 bertahan 20 jam dengan penggunaan campuran. Ini adalah laptop yang bisa Anda bawa seharian tanpa khawatir mencari colokan.</p><h2>Kesimpulan</h2><p>MacBook Pro M5 adalah laptop terbaik yang pernah kami review. Performanya melampaui kompetisi, baterainya tahan seharian, dan build quality-nya tetap premium. Rating: <strong>9.5/10</strong></p>',
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    },
    {
      title: 'Inflasi Global Mulai Mereda: Apa Artinya bagi Ekonomi Indonesia?',
      slug: 'inflasi-global-mulai-mereda',
      excerpt: 'Bank sentral di berbagai negara mulai menurunkan suku bunga. Bagaimana dampaknya terhadap ekonomi dalam negeri?',
      content: '<p>Setelah dua tahun berjuang melawan inflasi tinggi, tanda-tanda perbaikan ekonomi global mulai terlihat. Bank sentral Amerika Serikat (The Fed) telah menurunkan suku bunga sebanyak tiga kali sejak awal 2026.</p><h2>Dampak ke Indonesia</h2><p>Bank Indonesia merespons dengan menurunkan BI Rate sebesar 25 basis poin menjadi 5,5%. Langkah ini diharapkan dapat mendorong pertumbuhan kredit dan investasi domestik.</p><h2>Peluang Investasi</h2><p>Para analis merekomendasikan sektor properti dan infrastruktur sebagai pilihan investasi yang menarik di tengah tren penurunan suku bunga. Obligasi pemerintah juga menjadi pilihan menarik dengan yield yang masih kompetitif.</p>',
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    },
    {
      title: 'Panduan Coffee Brewing di Rumah: Dari French Press hingga Pour Over',
      slug: 'panduan-coffee-brewing-di-rumah',
      excerpt: 'Tidak perlu ke kafe mahal untuk menikmati kopi berkualitas. Pelajari teknik brewing dasar yang bisa kamu praktikkan di rumah.',
      content: '<p>Menyeduh kopi di rumah bisa menghasilkan secangkir kopi yang setara bahkan lebih baik dari kafe favorit kamu. Yang dibutuhkan hanyalah pengetahuan dasar tentang teknik brewing dan bahan yang berkualitas.</p><h2>French Press</h2><p>Metode paling mudah untuk pemula. Gunakan rasio 1:15 (kopi:air), grind size coarse, dan seduh selama 4 menit. Hasilnya: kopi dengan body yang kuat dan rich flavor.</p><h2>Pour Over (V60)</h2><p>Untuk yang menginginkan clarity dan complexity dalam secangkir kopi. Gunakan filter, rasio 1:16, grind size medium, dan total waktu brew sekitar 3 menit. Teknik pouring yang konsisten adalah kunci.</p><h2>Aeropress</h2><p>Versatile dan portable. Bisa menghasilkan espresso-like concentration atau clean filter coffee tergantung resep yang digunakan. Favorit para traveler dan barista home brewer.</p>',
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    },
    {
      title: 'Draft: Persiapan Sea Games 2027 — Atlet Muda Indonesia yang Patut Diperhatikan',
      slug: 'persiapan-sea-games-2027-atlet-muda',
      excerpt: 'Menjelang Sea Games 2027, beberapa atlet muda Indonesia menunjukkan potensi besar di berbagai cabang olahraga.',
      content: '<p>Sea Games 2027 akan diselenggarakan di Malaysia, dan Indonesia menargetkan posisi juara umum. Beberapa atlet muda menunjukkan performa luar biasa di ajang kualifikasi regional.</p><p>Artikel ini masih dalam tahap penulisan dan akan diperbarui menjelang event.</p>',
      categoryIndex: 2,
      status: ArticleStatus.DRAFT,
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b8e25?w=800&q=80',
    },
  ];

  for (const article of articlesData) {
    const { categoryIndex, ...articleData } = article;
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: { thumbnail: articleData.thumbnail },
      create: {
        ...articleData,
        authorId: admin.id,
        categoryId: categories[categoryIndex].id,
        publishedAt: articleData.status === ArticleStatus.PUBLISHED ? new Date() : null,
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 200) + 10,
      },
    });
  }
  console.log('✅ Articles created:', articlesData.length);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
