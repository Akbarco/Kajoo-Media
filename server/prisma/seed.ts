import { PrismaClient, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Create Admin User ──
  const hashedPassword = await bcrypt.hash("MediaKajo2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mediakajo.id" },
    update: {},
    create: {
      name: "Admin Media Kajoo",
      email: "admin@mediakajo.id",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ── Create Categories ──
  const categoriesData = [
    {
      name: "Teknologi",
      slug: "teknologi",
      color: "#2563EB",
      description: "Berita seputar teknologi, gadget, dan dunia digital",
    },
    {
      name: "Bisnis",
      slug: "bisnis",
      color: "#16A34A",
      description: "Update dunia bisnis, ekonomi, dan keuangan",
    },
    {
      name: "Olahraga",
      slug: "olahraga",
      color: "#DC2626",
      description: "Berita terkini dari dunia olahraga",
    },
    {
      name: "Gaya Hidup",
      slug: "gaya-hidup",
      color: "#D97706",
      description: "Tips dan tren gaya hidup modern",
    },
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
  console.log("✅ Categories created:", categories.length);

  // ── Cleanup ALL existing articles for a fresh start ──
  console.log("🧹 Cleaning up old articles...");
  await prisma.article.deleteMany({});

  // ── Create Sample Articles (Original 8) ──
  const articlesData = [
    {
      title: "Revolusi AI di Tahun 2026: Bagaimana Kecerdasan Buatan Mengubah Cara Kita Bekerja",
      slug: "revolusi-ai-di-tahun-2026",
      excerpt: "Kecerdasan buatan telah melampaui ekspektasi banyak orang. Dari otomasi tugas rutin hingga kreativitas, AI kini menjadi bagian tak terpisahkan dari kehidupan kerja modern.",
      content: '<p>Tahun 2026 menjadi tonggak penting dalam sejarah kecerdasan buatan. Berbagai perusahaan teknologi besar telah meluncurkan model AI generasi terbaru yang mampu menyelesaikan tugas-tugas kompleks dengan tingkat akurasi yang belum pernah terlihat sebelumnya.</p><h2>Dampak pada Dunia Kerja</h2><p>Otomasi bukan lagi ancaman, melainkan peluang. Pekerja yang mampu berkolaborasi dengan AI justru menjadi lebih produktif and kreatif. Perusahaan-perusahaan mulai merestrukturisasi tim mereka untuk mengintegrasikan AI sebagai "rekan kerja digital".</p>',
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    },
    {
      title: "Startup Lokal Raih Pendanaan Seri B Senilai $50 Juta untuk Ekspansi ke Asia Tenggara",
      slug: "startup-lokal-raih-pendanaan-seri-b",
      excerpt: "Sebuah startup fintech asal Jakarta berhasil menutup putaran pendanaan Seri B yang dipimpin oleh investor global ternama.",
      content: '<p>Jakarta — Startup fintech <strong>PayNusa</strong> mengumumkan penutupan putaran pendanaan Seri B senilai $50 juta yang dipimpin oleh Sequoia Capital Southeast Asia.</p>',
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    },
    {
      title: "Timnas Indonesia U-23 Melaju ke Semifinal Piala Asia dengan Kemenangan Dramatis",
      slug: "timnas-indonesia-u23-semifinal-piala-asia",
      excerpt: "Dengan gol di injury time, Timnas Indonesia U-23 berhasil mengalahkan Korea Selatan dan melaju ke babak semifinal.",
      content: "<p>Doha, Qatar — Timnas Indonesia U-23 membuat sejarah dengan mengalahkan Korea Selatan 2-1 dalam pertandingan perempat final Piala Asia U-23 2026.</p>",
      categoryIndex: 2,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    },
    {
      title: "Tren Minimalis 2026: Mengapa Semakin Banyak Orang Memilih Hidup dengan Lebih Sedikit",
      slug: "tren-minimalis-2026",
      excerpt: "Gaya hidup minimalis bukan sekadar tren estetika, tapi sebuah gerakan sadar untuk mengurangi konsumsi berlebihan.",
      content: "<p>Di tengah era konsumtif, semakin banyak generasi muda yang memilih jalur berbeda: hidup minimalis.</p>",
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
    },
    {
      title: "Review MacBook Pro M5: Laptop Tercepat yang Pernah Kami Uji",
      slug: "review-macbook-pro-m5",
      excerpt: "Chip M5 membawa performa yang mencengangkan. Kami menguji seberapa jauh MacBook Pro terbaru ini bisa didorong.",
      content: "<p>Apple baru saja merilis MacBook Pro dengan chip M5, dan kami telah menggunakannya selama dua minggu penuh.</p>",
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    },
    {
      title: "Inflasi Global Mulai Mereda: Apa Artinya bagi Ekonomi Indonesia?",
      slug: "inflasi-global-mulai-mereda",
      excerpt: "Bank sentral di berbagai negara mulai menurunkan suku bunga. Bagaimana dampaknya terhadap ekonomi dalam negeri?",
      content: "<p>Setelah dua tahun berjuang melawan inflasi tinggi, tanda-tanda perbaikan ekonomi global mulai terlihat.</p>",
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    },
    {
      title: "Panduan Coffee Brewing di Rumah: Dari French Press hingga Pour Over",
      slug: "panduan-coffee-brewing-di-rumah",
      excerpt: "Tidak perlu ke kafe mahal untuk menikmati kopi berkualitas. Pelajari teknik brewing dasar yang bisa kamu praktikkan di rumah.",
      content: "<p>Menyeduh kopi di rumah bisa menghasilkan secangkir kopi yang setara bahkan lebih baik dari kafe favorit kamu.</p>",
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    },
    {
      title: "Draft: Persiapan Sea Games 2027 — Atlet Muda Indonesia yang Patut Diperhatikan",
      slug: "persiapan-sea-games-2027-atlet-muda",
      excerpt: "Menjelang Sea Games 2027, beberapa atlet muda Indonesia menunjukkan potensi besar di berbagai cabang olahraga.",
      content: "<p>Sea Games 2027 akan diselenggarakan di Malaysia, dan Indonesia menargetkan posisi juara umum.</p>",
      categoryIndex: 2,
      status: ArticleStatus.DRAFT,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    },
    {
      title: "Wisata Indonesia 2026: 5 Destinasi 'The New Bali' yang Wajib Dikunjungi",
      slug: "wisata-indonesia-2026-destinasi-baru",
      excerpt: "Pemerintah fokus kembangkan 5 destinasi super prioritas. Dari Labuan Bajo hingga Mandalika, mana favoritmu?",
      content: "<p>Indonesia tidak hanya Bali. Tahun 2026, infrastruktur di 5 Destinasi Super Prioritas telah rampung sepenuhnya.</p>",
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    },
    {
      title: "Era Robot Humanoid: Asisten Rumah Tangga Masa Depan Segera Tiba",
      slug: "era-robot-humanoid-rumah-tangga",
      excerpt: "Robot yang mampu membantu pekerjaan rumah tangga bukan lagi sekadar film fiksi ilmiah.",
      content: "<p>Beberapa perusahaan teknologi mulai memasok robot asisten rumah tangga yang mampu mencuci piring dan melipat pakaian.</p>",
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
      title: "Memulai Bisnis Tanpa Modal di 2026: Manfaatkan Personal Branding",
      slug: "memulai-bisnis-tanpa-modal-2026",
      excerpt: "Di era digital yang semakin matang, aset terbesar kamu adalah kepercayaan dari audiens.",
      content: "<p>Personal branding menjadi kunci utama bagi para solopreneur untuk meluncurkan produk tanpa biaya iklan yang besar.</p>",
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    {
      title: "Mandalika Siap Gelar MotoGP 2027: Sirkuit dengan Pemandangan Tercantik di Dunia",
      slug: "mandalika-motogp-2027",
      excerpt: "Persiapan matang terus dilakukan untuk menyambut ajang balap motor paling bergengsi di Lombok.",
      content: "<p>Peningkatan fasilitas pendukung dan pengaspalan ulang sirkuit memastikan pengalaman terbaik bagi tim dan penonton.</p>",
      categoryIndex: 2,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1558980335-8e0c25f7f673?w=800&q=80&v=2",
    },
    {
      title: "Seni Digital Parenting: Mendidik Anak di Tengah Gempuran Gadget",
      slug: "seni-digital-parenting-era-modern",
      excerpt: "Screen time bukan musuh, jika orang tua tahu cara mengarahkannya menjadi edukatif.",
      content: "<p>Kunci dari parenting modern adalah keseimbangan antara pemanfaatan teknologi dan interaksi fisik yang berkualitas.</p>",
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    },
    {
      title: "Revolusi Baterai Solid-State: Jarak Tempuh Mobil Listrik Bisa Capai 1000 KM",
      slug: "revolusi-baterai-solid-state-2026",
      excerpt: "Teknologi baterai terbaru menjanjikan pengisian daya lebih cepat dan kapasitas penyimpanan jauh lebih besar.",
      content: "<p>Terobosan dalam penggunaan elektrolit padat menghilangkan risiko kebakaran dan meningkatkan efisiensi energi secara drastis.</p>",
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    },
    {
      title: "Tren Remote Work 2.0: Perusahaan Global Mulai Gunakan Jam Kerja Asinkron",
      slug: "tren-remote-work-asinkron",
      excerpt: "Bekerja jam 9 ke 5 mulai ditinggalkan demi produktivitas yang berbasis pada output nyata.",
      content: "<p>Komunikasi asinkron memungkinkan tim di berbagai zona waktu bekerja lebih efektif tanpa kelelahan akibat meeting virtual.</p>",
      categoryIndex: 1,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80",
    },
    {
      title: "Kebangkitan Bulutangkis Nasional: Regenerasi Atlet Muda Mulai Buah Hasil",
      slug: "kebangkitan-bulutangkis-nasional-2026",
      excerpt: "Dominasi Indonesia di kancah All England dan Kejuaraan Dunia kembali terjalin lewat tangan-tangan muda.",
      content: "<p>Program beasiswa olahraga dan pelatihan terpusat menjadi kunci keberhasilan Indonesia mencetak juara dunia baru.</p>",
      categoryIndex: 2,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    },
    {
      title: "Diet Berbasis Tanaman (Plant-Based) untuk Pemula: Sehat Tanpa Harus Membosankan",
      slug: "diet-plant-based-pemula",
      excerpt: "Semakin banyak orang beralih ke pola makan sayuran demi kesehatan jangka panjang dan kelestarian alam.",
      content: "<p>Mulai dari satu hari dalam seminggu tanpa daging, kamu bisa memberikan dampak besar bagi tubuh dan bumi.</p>",
      categoryIndex: 3,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    },
    {
      title: "Keamanan Data di Era Web3: Mengapa Dompet Digital Kamu Lebih Berharga dari Dompet Fisik",
      slug: "keamanan-data-web3-2026",
      excerpt: "Kehilangan private key berarti kehilangan segalanya. Pelajari cara mengamankan aset digitalmu.",
      content: "<p>Teknologi blockchain memberikan kontrol penuh atas data pribadi, namun juga tanggung jawab keamanan yang lebih besar.</p>",
      categoryIndex: 0,
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    },
  ];

  for (const article of articlesData) {
    const { categoryIndex, ...articleData } = article;
    await prisma.article.create({
      data: {
        ...articleData,
        authorId: admin.id,
        categoryId: categories[categoryIndex].id,
        publishedAt: articleData.status === ArticleStatus.PUBLISHED ? new Date() : null,
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 200) + 10,
      },
    });
  }
  console.log("✅ Articles created:", articlesData.length);

  console.log("🎉 Seeding complete! Database has been reset to initial state.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
