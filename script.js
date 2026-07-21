/* ============================================================
   AL QUR'AN AS SALAM — script.js  v4.0
   Tambahan: Simak Hafalan (AI Guru Tahfizh)
   ============================================================ */
/* =====================================================
   GEMINI AI CONFIG
===================================================== */

/* API key TIDAK disimpan di client. Semua request lewat Cloudflare Worker
   proxy (worker.js) yang menyimpan GEMINI_API_KEY sebagai secret di server. */
const PROXY_URL = "https://GANTI-DENGAN-URL-WORKER-ANDA.workers.dev/api/chat";

async function kirimKeGemini(systemPrompt, histori) {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: systemPrompt,
      messages: histori,
      max_tokens: 1000
    })
  });

  if (!res.ok) throw new Error(`Proxy error ${res.status}`);

  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "Gemini API error");

  const teks = json?.content?.[0]?.text;
  if (!teks) throw new Error("Respons AI kosong");
  return teks;
}
/* ── DATA & STATE ─────────────────────────────────────────── */
const SURAH_DATA = [
  {n:1,  ar:"الفاتحة",     latin:"Al-Fatihah",    arti:"Pembukaan",         ayat:7,   type:"Makkiyah"},
  {n:2,  ar:"البقرة",      latin:"Al-Baqarah",    arti:"Sapi Betina",       ayat:286, type:"Madaniyah"},
  {n:3,  ar:"آل عمران",   latin:"Ali 'Imran",    arti:"Keluarga Imran",    ayat:200, type:"Madaniyah"},
  {n:4,  ar:"النساء",      latin:"An-Nisa",       arti:"Wanita",            ayat:176, type:"Madaniyah"},
  {n:5,  ar:"المائدة",     latin:"Al-Ma'idah",    arti:"Hidangan",          ayat:120, type:"Madaniyah"},
  {n:6,  ar:"الأنعام",     latin:"Al-An'am",      arti:"Binatang Ternak",   ayat:165, type:"Makkiyah"},
  {n:7,  ar:"الأعراف",     latin:"Al-A'raf",      arti:"Tempat Tertinggi",  ayat:206, type:"Makkiyah"},
  {n:8,  ar:"الأنفال",     latin:"Al-Anfal",      arti:"Rampasan Perang",   ayat:75,  type:"Madaniyah"},
  {n:9,  ar:"التوبة",      latin:"At-Taubah",     arti:"Pengampunan",       ayat:129, type:"Madaniyah"},
  {n:10, ar:"يونس",        latin:"Yunus",         arti:"Nabi Yunus",        ayat:109, type:"Makkiyah"},
  {n:11, ar:"هود",         latin:"Hud",           arti:"Nabi Hud",          ayat:123, type:"Makkiyah"},
  {n:12, ar:"يوسف",        latin:"Yusuf",         arti:"Nabi Yusuf",        ayat:111, type:"Makkiyah"},
  {n:13, ar:"الرعد",       latin:"Ar-Ra'd",       arti:"Guruh",             ayat:43,  type:"Madaniyah"},
  {n:14, ar:"إبراهيم",     latin:"Ibrahim",       arti:"Nabi Ibrahim",      ayat:52,  type:"Makkiyah"},
  {n:15, ar:"الحجر",       latin:"Al-Hijr",       arti:"Batu",              ayat:99,  type:"Makkiyah"},
  {n:16, ar:"النحل",       latin:"An-Nahl",       arti:"Lebah",             ayat:128, type:"Makkiyah"},
  {n:17, ar:"الإسراء",     latin:"Al-Isra",       arti:"Perjalanan Malam",  ayat:111, type:"Makkiyah"},
  {n:18, ar:"الكهف",       latin:"Al-Kahf",       arti:"Gua",               ayat:110, type:"Makkiyah"},
  {n:19, ar:"مريم",        latin:"Maryam",        arti:"Maryam",            ayat:98,  type:"Makkiyah"},
  {n:20, ar:"طه",          latin:"Ta Ha",         arti:"Ta Ha",             ayat:135, type:"Makkiyah"},
  {n:21, ar:"الأنبياء",    latin:"Al-Anbiya",     arti:"Para Nabi",         ayat:112, type:"Makkiyah"},
  {n:22, ar:"الحج",        latin:"Al-Hajj",       arti:"Haji",              ayat:78,  type:"Madaniyah"},
  {n:23, ar:"المؤمنون",    latin:"Al-Mu'minun",   arti:"Orang-orang Mukmin",ayat:118, type:"Makkiyah"},
  {n:24, ar:"النور",       latin:"An-Nur",        arti:"Cahaya",            ayat:64,  type:"Madaniyah"},
  {n:25, ar:"الفرقان",     latin:"Al-Furqan",     arti:"Pembeda",           ayat:77,  type:"Makkiyah"},
  {n:26, ar:"الشعراء",     latin:"Asy-Syu'ara",   arti:"Para Penyair",      ayat:227, type:"Makkiyah"},
  {n:27, ar:"النمل",       latin:"An-Naml",       arti:"Semut",             ayat:93,  type:"Makkiyah"},
  {n:28, ar:"القصص",       latin:"Al-Qasas",      arti:"Cerita",            ayat:88,  type:"Makkiyah"},
  {n:29, ar:"العنكبوت",    latin:"Al-Ankabut",    arti:"Laba-laba",         ayat:69,  type:"Makkiyah"},
  {n:30, ar:"الروم",       latin:"Ar-Rum",        arti:"Bangsa Romawi",     ayat:60,  type:"Makkiyah"},
  {n:31, ar:"لقمان",       latin:"Luqman",        arti:"Luqman",            ayat:34,  type:"Makkiyah"},
  {n:32, ar:"السجدة",      latin:"As-Sajdah",     arti:"Sujud",             ayat:30,  type:"Makkiyah"},
  {n:33, ar:"الأحزاب",     latin:"Al-Ahzab",      arti:"Golongan Bersekutu",ayat:73,  type:"Madaniyah"},
  {n:34, ar:"سبأ",         latin:"Saba",          arti:"Kaum Saba",         ayat:54,  type:"Makkiyah"},
  {n:35, ar:"فاطر",        latin:"Fatir",         arti:"Pencipta",          ayat:45,  type:"Makkiyah"},
  {n:36, ar:"يس",          latin:"Ya Sin",        arti:"Ya Sin",            ayat:83,  type:"Makkiyah"},
  {n:37, ar:"الصافات",     latin:"As-Saffat",     arti:"Yang Bershaf",      ayat:182, type:"Makkiyah"},
  {n:38, ar:"ص",           latin:"Sad",           arti:"Sad",               ayat:88,  type:"Makkiyah"},
  {n:39, ar:"الزمر",       latin:"Az-Zumar",      arti:"Rombongan",         ayat:75,  type:"Makkiyah"},
  {n:40, ar:"غافر",        latin:"Gafir",         arti:"Yang Maha Pengampun",ayat:85, type:"Makkiyah"},
  {n:41, ar:"فصلت",        latin:"Fussilat",      arti:"Dijelaskan",        ayat:54,  type:"Makkiyah"},
  {n:42, ar:"الشورى",      latin:"Asy-Syura",     arti:"Musyawarah",        ayat:53,  type:"Makkiyah"},
  {n:43, ar:"الزخرف",      latin:"Az-Zukhruf",    arti:"Perhiasan",         ayat:89,  type:"Makkiyah"},
  {n:44, ar:"الدخان",      latin:"Ad-Dukhan",     arti:"Kabut",             ayat:59,  type:"Makkiyah"},
  {n:45, ar:"الجاثية",     latin:"Al-Jasiyah",    arti:"Yang Berlutut",     ayat:37,  type:"Makkiyah"},
  {n:46, ar:"الأحقاف",     latin:"Al-Ahqaf",      arti:"Bukit-bukit Pasir", ayat:35,  type:"Makkiyah"},
  {n:47, ar:"محمد",        latin:"Muhammad",      arti:"Nabi Muhammad",     ayat:38,  type:"Madaniyah"},
  {n:48, ar:"الفتح",       latin:"Al-Fath",       arti:"Kemenangan",        ayat:29,  type:"Madaniyah"},
  {n:49, ar:"الحجرات",     latin:"Al-Hujurat",    arti:"Kamar-kamar",       ayat:18,  type:"Madaniyah"},
  {n:50, ar:"ق",           latin:"Qaf",           arti:"Qaf",               ayat:45,  type:"Makkiyah"},
  {n:51, ar:"الذاريات",    latin:"Az-Zariyat",    arti:"Angin yang Menerbangkan",ayat:60,type:"Makkiyah"},
  {n:52, ar:"الطور",       latin:"At-Tur",        arti:"Bukit",             ayat:49,  type:"Makkiyah"},
  {n:53, ar:"النجم",       latin:"An-Najm",       arti:"Bintang",           ayat:62,  type:"Makkiyah"},
  {n:54, ar:"القمر",       latin:"Al-Qamar",      arti:"Bulan",             ayat:55,  type:"Makkiyah"},
  {n:55, ar:"الرحمن",      latin:"Ar-Rahman",     arti:"Yang Maha Pengasih",ayat:78,  type:"Madaniyah"},
  {n:56, ar:"الواقعة",     latin:"Al-Waqi'ah",    arti:"Hari Kiamat",       ayat:96,  type:"Makkiyah"},
  {n:57, ar:"الحديد",      latin:"Al-Hadid",      arti:"Besi",              ayat:29,  type:"Madaniyah"},
  {n:58, ar:"المجادلة",    latin:"Al-Mujadilah",  arti:"Wanita yang Menggugat",ayat:22,type:"Madaniyah"},
  {n:59, ar:"الحشر",       latin:"Al-Hasyr",      arti:"Pengusiran",        ayat:24,  type:"Madaniyah"},
  {n:60, ar:"الممتحنة",    latin:"Al-Mumtahanah", arti:"Wanita yang Diuji", ayat:13,  type:"Madaniyah"},
  {n:61, ar:"الصف",        latin:"As-Saf",        arti:"Barisan",           ayat:14,  type:"Madaniyah"},
  {n:62, ar:"الجمعة",      latin:"Al-Jumu'ah",    arti:"Hari Jum'at",       ayat:11,  type:"Madaniyah"},
  {n:63, ar:"المنافقون",   latin:"Al-Munafiqun",  arti:"Orang-orang Munafik",ayat:11, type:"Madaniyah"},
  {n:64, ar:"التغابن",     latin:"At-Tagabun",    arti:"Hari Dinampakkan Kesalahan",ayat:18,type:"Madaniyah"},
  {n:65, ar:"الطلاق",      latin:"At-Talaq",      arti:"Talak",             ayat:12,  type:"Madaniyah"},
  {n:66, ar:"التحريم",     latin:"At-Tahrim",     arti:"Mengharamkan",      ayat:12,  type:"Madaniyah"},
  {n:67, ar:"الملك",       latin:"Al-Mulk",       arti:"Kerajaan",          ayat:30,  type:"Makkiyah"},
  {n:68, ar:"القلم",       latin:"Al-Qalam",      arti:"Pena",              ayat:52,  type:"Makkiyah"},
  {n:69, ar:"الحاقة",      latin:"Al-Haqqah",     arti:"Hari Kiamat",       ayat:52,  type:"Makkiyah"},
  {n:70, ar:"المعارج",     latin:"Al-Ma'arij",    arti:"Tempat Naik",       ayat:44,  type:"Makkiyah"},
  {n:71, ar:"نوح",         latin:"Nuh",           arti:"Nabi Nuh",          ayat:28,  type:"Makkiyah"},
  {n:72, ar:"الجن",        latin:"Al-Jinn",       arti:"Jin",               ayat:28,  type:"Makkiyah"},
  {n:73, ar:"المزمل",      latin:"Al-Muzzammil",  arti:"Orang yang Berselimut",ayat:20,type:"Makkiyah"},
  {n:74, ar:"المدثر",      latin:"Al-Muddassir",  arti:"Orang yang Berkemul",ayat:56, type:"Makkiyah"},
  {n:75, ar:"القيامة",     latin:"Al-Qiyamah",    arti:"Hari Kiamat",       ayat:40,  type:"Makkiyah"},
  {n:76, ar:"الإنسان",     latin:"Al-Insan",      arti:"Manusia",           ayat:31,  type:"Madaniyah"},
  {n:77, ar:"المرسلات",    latin:"Al-Mursalat",   arti:"Malaikat yang Diutus",ayat:50,type:"Makkiyah"},
  {n:78, ar:"النبأ",       latin:"An-Naba",       arti:"Berita Besar",      ayat:40,  type:"Makkiyah"},
  {n:79, ar:"النازعات",    latin:"An-Nazi'at",    arti:"Malaikat yang Mencabut",ayat:46,type:"Makkiyah"},
  {n:80, ar:"عبس",         latin:"'Abasa",        arti:"Bermuka Masam",     ayat:42,  type:"Makkiyah"},
  {n:81, ar:"التكوير",     latin:"At-Takwir",     arti:"Penggulungan",      ayat:29,  type:"Makkiyah"},
  {n:82, ar:"الانفطار",    latin:"Al-Infitar",    arti:"Terbelah",          ayat:19,  type:"Makkiyah"},
  {n:83, ar:"المطففين",    latin:"Al-Mutaffifin", arti:"Orang yang Curang", ayat:36,  type:"Makkiyah"},
  {n:84, ar:"الانشقاق",    latin:"Al-Insyiqaq",   arti:"Terbelah",          ayat:25,  type:"Makkiyah"},
  {n:85, ar:"البروج",      latin:"Al-Buruj",      arti:"Gugusan Bintang",   ayat:22,  type:"Makkiyah"},
  {n:86, ar:"الطارق",      latin:"At-Tariq",      arti:"Yang Datang di Malam Hari",ayat:17,type:"Makkiyah"},
  {n:87, ar:"الأعلى",      latin:"Al-A'la",       arti:"Yang Paling Tinggi",ayat:19,  type:"Makkiyah"},
  {n:88, ar:"الغاشية",     latin:"Al-Gasiyah",    arti:"Hari Pembalasan",   ayat:26,  type:"Makkiyah"},
  {n:89, ar:"الفجر",       latin:"Al-Fajr",       arti:"Fajar",             ayat:30,  type:"Makkiyah"},
  {n:90, ar:"البلد",       latin:"Al-Balad",      arti:"Negeri",            ayat:20,  type:"Makkiyah"},
  {n:91, ar:"الشمس",       latin:"Asy-Syams",     arti:"Matahari",          ayat:15,  type:"Makkiyah"},
  {n:92, ar:"الليل",       latin:"Al-Lail",       arti:"Malam",             ayat:21,  type:"Makkiyah"},
  {n:93, ar:"الضحى",       latin:"Ad-Duha",       arti:"Waktu Dhuha",       ayat:11,  type:"Makkiyah"},
  {n:94, ar:"الشرح",       latin:"Asy-Syarh",     arti:"Melapangkan",       ayat:8,   type:"Makkiyah"},
  {n:95, ar:"التين",       latin:"At-Tin",        arti:"Buah Tin",          ayat:8,   type:"Makkiyah"},
  {n:96, ar:"العلق",       latin:"Al-Alaq",       arti:"Segumpal Darah",    ayat:19,  type:"Makkiyah"},
  {n:97, ar:"القدر",       latin:"Al-Qadr",       arti:"Kemuliaan",         ayat:5,   type:"Makkiyah"},
  {n:98, ar:"البينة",      latin:"Al-Bayyinah",   arti:"Bukti",             ayat:8,   type:"Madaniyah"},
  {n:99, ar:"الزلزلة",     latin:"Az-Zalzalah",   arti:"Kegoncangan",       ayat:8,   type:"Madaniyah"},
  {n:100,ar:"العاديات",    latin:"Al-'Adiyat",    arti:"Kuda yang Berlari", ayat:11,  type:"Makkiyah"},
  {n:101,ar:"القارعة",     latin:"Al-Qari'ah",    arti:"Hari Kiamat",       ayat:11,  type:"Makkiyah"},
  {n:102,ar:"التكاثر",     latin:"At-Takasur",    arti:"Bermegah-megahan",  ayat:8,   type:"Makkiyah"},
  {n:103,ar:"العصر",       latin:"Al-'Asr",       arti:"Masa",              ayat:3,   type:"Makkiyah"},
  {n:104,ar:"الهمزة",      latin:"Al-Humazah",    arti:"Pengumpat",         ayat:9,   type:"Makkiyah"},
  {n:105,ar:"الفيل",       latin:"Al-Fil",        arti:"Gajah",             ayat:5,   type:"Makkiyah"},
  {n:106,ar:"قريش",        latin:"Quraisy",       arti:"Suku Quraisy",      ayat:4,   type:"Makkiyah"},
  {n:107,ar:"الماعون",     latin:"Al-Ma'un",      arti:"Barang-barang yang Berguna",ayat:7,type:"Makkiyah"},
  {n:108,ar:"الكوثر",      latin:"Al-Kausar",     arti:"Nikmat yang Banyak",ayat:3,   type:"Makkiyah"},
  {n:109,ar:"الكافرون",    latin:"Al-Kafirun",    arti:"Orang-orang Kafir", ayat:6,   type:"Makkiyah"},
  {n:110,ar:"النصر",       latin:"An-Nasr",       arti:"Pertolongan",       ayat:3,   type:"Madaniyah"},
  {n:111,ar:"المسد",       latin:"Al-Masad",      arti:"Sabut",             ayat:5,   type:"Makkiyah"},
  {n:112,ar:"الإخلاص",     latin:"Al-Ikhlas",     arti:"Ikhlas",            ayat:4,   type:"Makkiyah"},
  {n:113,ar:"الفلق",       latin:"Al-Falaq",      arti:"Waktu Subuh",       ayat:5,   type:"Makkiyah"},
  {n:114,ar:"الناس",       latin:"An-Nas",        arti:"Manusia",           ayat:6,   type:"Makkiyah"},
];

const POPULAR_SURAH = [1,36,55,67,18,56,112,113,114,2];

/* ── APP STATE ────────────────────────────────────────────── */
let currentSurahNum   = 1;
let currentAyahData   = [];
let currentAyahIndex  = 0;
let repeatCount       = 1;
let repeatDone        = 0;
let rangeFrom         = 1;
let rangeTo           = 1;
let isRangeMode       = false;
let isPlaying         = false;
let bookmarks         = JSON.parse(localStorage.getItem('assalam_bookmarks') || '[]');
let settings          = JSON.parse(localStorage.getItem('assalam_settings') || '{}');
let lastRead          = JSON.parse(localStorage.getItem('assalam_lastread') || 'null');
let ayahCache         = {};
let _audioIntentionalStop = false;
let audio;

/* ── HELPERS ──────────────────────────────────────────────── */
function pad(n){ return String(n).padStart(3,'0'); }
function getQari(){ return settings.qari || '01'; }

function audioUrl(surahNum, ayahNum){
  const s = pad(surahNum), a = pad(ayahNum), q = getQari();
  return `https://everyayah.com/data/${qariFolder(q)}/${s}${a}.mp3`;
}

function qariFolder(q){
  const map = {
    '01':'Alafasy_128kbps','02':'Abdul_Basit_Murattal_192kbps',
    '03':'Minshawy_Murattal_128kbps','04':'Hani_Rifai_192kbps',
    '05':'Maher_AlMuaiqly_64kbps','06':'Husary_128kbps',
    '07':'Abdurrahmaan_As-Sudais_192kbps','08':'Hudhaify_128kbps',
    '09':'Muhammad_Ayyoub_128kbps','10':'Mohammad_al_Tablaway_128kbps',
  };
  return map[q] || 'Alafasy_128kbps';
}

function fmtTime(s){
  if(isNaN(s)) return '0:00';
  const m = Math.floor(s/60), ss = Math.floor(s%60);
  return `${m}:${String(ss).padStart(2,'0')}`;
}

function saveSettings(){ localStorage.setItem('assalam_settings', JSON.stringify(settings)); }
function saveBookmarks(){ localStorage.setItem('assalam_bookmarks', JSON.stringify(bookmarks)); }
function saveLastRead(sn, an){ lastRead={surahNum:sn,ayahNum:an}; localStorage.setItem('assalam_lastread', JSON.stringify(lastRead)); }

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById("main-audio-element")) return;
  audio = document.getElementById("main-audio-element");

  setTimeout(() => {
    const sp = document.getElementById('splash-screen');
    if(sp){ sp.style.opacity = '0'; setTimeout(() => sp.classList.add('hidden'), 600); }
  }, 2000);

  applySettings();
  renderPopularSurah();
  renderLastRead();
  setupNav();
  setupDrawer();
  setupAudioPlayer();
  setupMediaSession();
  initSimak();

  // ── Minta izin proaktif setelah splash ──
  setTimeout(() => mintaIzinProaktif(), 2800);

  document.getElementById('quick-surah')?.addEventListener('click', () => switchView('surah-list'));
  document.getElementById('quick-shalat')?.addEventListener('click', () => showShalatInfo());
  document.getElementById('quick-qiblat')?.addEventListener('click', () => showQiblatInfo());

  document.getElementById('dark-mode-toggle')?.addEventListener('change', e => {
    settings.dark = e.target.checked;
    document.body.classList.toggle('dark', settings.dark);
    saveSettings();
  });
  document.getElementById('show-latin')?.addEventListener('change', e => {
    settings.showLatin = e.target.checked; saveSettings();
    if(currentAyahData.length) renderAyahList(currentAyahData);
  });
  document.getElementById('translation-toggle')?.addEventListener('change', e => {
    settings.showTranslation = e.target.checked; saveSettings();
    if(currentAyahData.length) renderAyahList(currentAyahData);
  });
  document.getElementById('font-size-select')?.addEventListener('change', e => {
    settings.fontSize = e.target.value; saveSettings();
    document.querySelectorAll('.arabic-text').forEach(el => el.style.fontSize = settings.fontSize);
  });
  document.getElementById('qari-select')?.addEventListener('change', e => {
    settings.qari = e.target.value; saveSettings(); stopAudio();
  });

  document.getElementById('btn-play-range')?.addEventListener('click', playRange);
  document.getElementById('btn-play-full-audio')?.addEventListener('click', () => {
    isRangeMode = false; repeatCount = 1; repeatDone = 0; playAyah(0);
  });
  document.getElementById('search-surah-input')?.addEventListener('input', e => {
    renderSurahList(e.target.value);
  });
  document.getElementById('lr-continue-btn')?.addEventListener('click', () => {
    if(!lastRead) return;
    openSurah(lastRead.surahNum, lastRead.ayahNum - 1);
  });
});

/* ══════════════════════════════════════════════════════════
   PERMISSION SYSTEM — Minta izin proaktif saat app dibuka
   Solusi untuk WebView / TWA Android yang tidak otomatis
   minta izin dari browser
══════════════════════════════════════════════════════════ */

const PERM_KEY = 'assalam_perms_asked';

async function mintaIzinProaktif() {
  // Jika sudah pernah ditanya, skip (kecuali denied → tanya lagi)
  const statusTersimpan = JSON.parse(localStorage.getItem(PERM_KEY) || '{}');

  const perluTanya =
    !statusTersimpan.geolocation ||
    statusTersimpan.geolocation === 'denied' ||
    !statusTersimpan.orientation;

  if (!perluTanya) {
    // Sudah granted sebelumnya — langsung cache ulang status real
    cekStatusPermission();
    return;
  }

  // Tampilkan dialog izin custom sebelum browser prompt
  tampilkanDialogIzin();
}

function tampilkanDialogIzin() {
  // Buat overlay dialog
  const overlay = document.createElement('div');
  overlay.id    = 'perm-overlay';
  overlay.innerHTML = `
    <div class="perm-dialog">
      <div class="perm-dialog-icon">🕌</div>
      <h2 class="perm-dialog-title">Izin Diperlukan</h2>
      <p class="perm-dialog-desc">
        Aplikasi Al Qur'an As Salam memerlukan izin berikut agar fitur dapat berjalan sempurna:
      </p>
      <div class="perm-list">
        <div class="perm-item">
          <span class="perm-item-icon">📍</span>
          <div class="perm-item-info">
            <strong>Lokasi (GPS)</strong>
            <span>Untuk Jadwal Shalat & Arah Kiblat</span>
          </div>
          <span class="perm-item-status" id="perm-status-geo">⏳</span>
        </div>
        <div class="perm-item">
          <span class="perm-item-icon">🧭</span>
          <div class="perm-item-info">
            <strong>Sensor Kompas</strong>
            <span>Untuk Arah Kiblat yang akurat</span>
          </div>
          <span class="perm-item-status" id="perm-status-orient">⏳</span>
        </div>
        <div class="perm-item">
          <span class="perm-item-icon">🎙️</span>
          <div class="perm-item-info">
            <strong>Mikrofon</strong>
            <span>Untuk fitur Simak Hafalan AI</span>
          </div>
          <span class="perm-item-status" id="perm-status-mic">⏳</span>
        </div>
      </div>
      <button class="perm-btn-izinkan" id="permBtnIzinkan">
        Izinkan Semua Akses
      </button>
      <button class="perm-btn-skip" id="permBtnSkip">
        Nanti saja
      </button>
      <p class="perm-dialog-note">
        ℹ️ Izin hanya digunakan dalam aplikasi ini dan tidak dibagikan ke pihak mana pun.
      </p>
    </div>`;

  // Style dialog
  const style = document.createElement('style');
  style.textContent = `
    #perm-overlay {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: permFadeIn .3s ease;
    }
    @keyframes permFadeIn { from{opacity:0} to{opacity:1} }

    .perm-dialog {
      background: #fff; border-radius: 24px;
      padding: 28px 22px; max-width: 360px; width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: permSlideUp .35s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes permSlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }

    .perm-dialog-icon { font-size: 48px; margin-bottom: 10px; }
    .perm-dialog-title {
      font-size: 18px; font-weight: 800;
      color: #064e3b; margin-bottom: 8px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .perm-dialog-desc {
      font-size: 13px; color: #4a6352; line-height: 1.6;
      margin-bottom: 18px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .perm-list {
      background: #f0fdf4; border-radius: 14px;
      padding: 4px 0; margin-bottom: 18px;
      border: 1px solid #b7e4c7;
    }
    .perm-item {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; text-align: left;
      border-bottom: 1px solid #d8f3dc;
    }
    .perm-item:last-child { border-bottom: none; }
    .perm-item-icon { font-size: 22px; flex-shrink: 0; }
    .perm-item-info { flex: 1; }
    .perm-item-info strong {
      display: block; font-size: 13px; font-weight: 700;
      color: #064e3b; font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .perm-item-info span {
      font-size: 11px; color: #4a6352;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .perm-item-status { font-size: 16px; flex-shrink: 0; }

    .perm-btn-izinkan {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #064e3b, #059669);
      color: white; border: none; border-radius: 14px;
      font-size: 15px; font-weight: 800;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer; margin-bottom: 10px;
      box-shadow: 0 6px 20px rgba(6,78,59,0.35);
      transition: opacity .2s;
    }
    .perm-btn-izinkan:active { opacity: .85; }

    .perm-btn-skip {
      width: 100%; padding: 10px;
      background: none; border: 1px solid #b7e4c7;
      border-radius: 12px; color: #4a6352;
      font-size: 13px; font-weight: 600;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer; margin-bottom: 14px;
    }
    .perm-btn-skip:active { background: #f0fdf4; }

    .perm-dialog-note {
      font-size: 10px; color: #6b8c7a; line-height: 1.5;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    body.dark .perm-dialog {
      background: #0f2618; border: 1px solid #1a4a2e;
    }
    body.dark .perm-dialog-title { color: #6ee7b7; }
    body.dark .perm-dialog-desc, body.dark .perm-dialog-note { color: #6ee7b7; }
    body.dark .perm-list { background: #0a1a12; border-color: #1a4a2e; }
    body.dark .perm-item { border-color: #1a4a2e; }
    body.dark .perm-item-info strong { color: #6ee7b7; }
    body.dark .perm-item-info span  { color: #4a6352; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  document.getElementById('permBtnIzinkan').addEventListener('click', () => {
    prosesPermissionSatu();
  });

  document.getElementById('permBtnSkip').addEventListener('click', () => {
    tutupDialogIzin();
    // Simpan bahwa sudah ditanya, tapi user skip
    localStorage.setItem(PERM_KEY, JSON.stringify({ skipped: true, ts: Date.now() }));
  });
}

/* Proses minta izin satu per satu berurutan */
async function prosesPermissionSatu() {
  const btn = document.getElementById('permBtnIzinkan');
  if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }

  const hasil = { geolocation: 'unknown', orientation: 'unknown', mic: 'unknown' };

  /* ── 1. LOKASI ── */
  updateStatusItem('perm-status-geo', '⏳ Meminta...');
  const geoOk = await mintaIzinLokasi();
  hasil.geolocation = geoOk ? 'granted' : 'denied';
  updateStatusItem('perm-status-geo', geoOk ? '✅' : '❌');

  /* ── 2. SENSOR ORIENTASI (Kompas) ── */
  updateStatusItem('perm-status-orient', '⏳ Meminta...');
  const orientOk = await mintaIzinOrientasi();
  hasil.orientation = orientOk ? 'granted' : 'denied';
  updateStatusItem('perm-status-orient', orientOk ? '✅' : '❌');

  /* ── 3. MIKROFON ── */
  updateStatusItem('perm-status-mic', '⏳ Meminta...');
  const micOk = await mintaIzinMikrofon();
  hasil.mic = micOk ? 'granted' : 'denied';
  updateStatusItem('perm-status-mic', micOk ? '✅' : '❌');

  // Simpan hasil
  localStorage.setItem(PERM_KEY, JSON.stringify({ ...hasil, ts: Date.now() }));

  // Tunggu sebentar lalu tutup
  await new Promise(r => setTimeout(r, 1200));
  tutupDialogIzin();

  // Jika lokasi granted, langsung cache koordinat
  if (geoOk) preCacheLocation();
}

/* ── Request Lokasi ── */
function mintaIzinLokasi() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(false); return; }

    // Coba pakai Permissions API dulu (Android Chrome support)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'granted') { resolve(true); return; }
          if (result.state === 'denied')  { resolve(false); return; }
          // 'prompt' → trigger browser dialog
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false),
            { timeout: 8000, maximumAge: 0 }
          );
        })
        .catch(() => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false),
            { timeout: 8000, maximumAge: 0 }
          );
        });
    } else {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 8000, maximumAge: 0 }
      );
    }
  });
}

/* ── Request Sensor Orientasi (Kompas) ── */
function mintaIzinOrientasi() {
  return new Promise((resolve) => {
    // iOS 13+ butuh explicit permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(state => resolve(state === 'granted'))
        .catch(() => resolve(false));
    } else if (typeof DeviceMotionEvent !== 'undefined' &&
               typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(state => resolve(state === 'granted'))
        .catch(() => resolve(false));
    } else if (window.DeviceOrientationEvent) {
      // Android — cek apakah event bisa diterima
      let got = false;
      const handler = () => { got = true; window.removeEventListener('deviceorientation', handler); resolve(true); };
      window.addEventListener('deviceorientation', handler, { once: true });
      setTimeout(() => { if (!got) { window.removeEventListener('deviceorientation', handler); resolve(false); } }, 2000);
    } else {
      resolve(false);
    }
  });
}

/* ── Request Mikrofon ── */
function mintaIzinMikrofon() {
  return new Promise((resolve) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback: cek via Permissions API
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' })
          .then(r => resolve(r.state === 'granted'))
          .catch(() => resolve(false));
      } else {
        resolve(false);
      }
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Langsung stop stream — hanya perlu izinnya
        stream.getTracks().forEach(t => t.stop());
        resolve(true);
      })
      .catch(() => resolve(false));
  });
}

/* ── Pre-cache koordinat lokasi ── */
let _cachedLocation = null;

function preCacheLocation() {
  navigator.geolocation?.getCurrentPosition(
    pos => {
      _cachedLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
    },
    () => {},
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

/* ── Cek status permission yang sudah ada ── */
async function cekStatusPermission() {
  if (!navigator.permissions) return;
  try {
    const geo = await navigator.permissions.query({ name: 'geolocation' });
    const mic = await navigator.permissions.query({ name: 'microphone' });
    const saved = JSON.parse(localStorage.getItem(PERM_KEY) || '{}');
    saved.geolocation = geo.state;
    saved.mic         = mic.state;
    localStorage.setItem(PERM_KEY, JSON.stringify(saved));
    if (geo.state === 'granted') preCacheLocation();
  } catch(e) {}
}

/* ── Update status ikon di dialog ── */
function updateStatusItem(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ── Tutup dialog izin ── */
function tutupDialogIzin() {
  const overlay = document.getElementById('perm-overlay');
  if (!overlay) return;
  overlay.style.opacity    = '0';
  overlay.style.transition = 'opacity .3s';
  setTimeout(() => overlay.remove(), 300);
}

/* showShalatInfo & showQiblatInfo versi baru dengan cached location & permission check */
function showShalatInfo() {
  const box = document.getElementById('shalat-content');
  box.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
    <span class="material-icons" style="font-size:40px;display:block;margin-bottom:12px;color:var(--primary);animation:spin 1.2s linear infinite">refresh</span>
    <p style="font-size:14px">Mendapatkan lokasi Anda...</p></div>`;
  switchView('shalat');

  // Gunakan cached location jika ada (lebih cepat)
  if (_cachedLocation) {
    fetchAndRenderShalat(_cachedLocation.lat, _cachedLocation.lon);
    return;
  }

  if (!navigator.geolocation) {
    box.innerHTML = renderShalatError('GPS tidak didukung di perangkat ini.');
    return;
  }

  // Cek permission dulu sebelum request
  const tryGet = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        _cachedLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        fetchAndRenderShalat(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          box.innerHTML = renderShalatError(
            'Izin lokasi ditolak. Buka Pengaturan → Aplikasi → Al Qur\'an As Salam → Izin → Lokasi → Izinkan.'
          );
        } else {
          box.innerHTML = renderShalatError('Gagal mendapatkan lokasi. Pastikan GPS aktif lalu coba lagi.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'denied') {
        box.innerHTML = renderShalatError(
          'Izin lokasi ditolak. Buka Pengaturan → Aplikasi → Al Qur\'an As Salam → Izin → Lokasi → Izinkan.'
        );
      } else {
        tryGet();
      }
    }).catch(() => tryGet());
  } else {
    tryGet();
  }
}

function showQiblatInfo() {
  const box = document.getElementById('qiblat-content');
  box.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
    <span class="material-icons" style="font-size:40px;display:block;margin-bottom:12px;color:var(--primary);animation:spin 1.2s linear infinite">refresh</span>
    <p style="font-size:14px">Mendapatkan lokasi Anda...</p></div>`;
  switchView('qiblat');

  // Gunakan cached location jika ada
  if (_cachedLocation) {
    renderQiblat(_cachedLocation.lat, _cachedLocation.lon);
    return;
  }

  if (!navigator.geolocation) {
    box.innerHTML = renderQiblatError('GPS tidak didukung di perangkat ini.');
    return;
  }

  const tryGet = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        _cachedLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        renderQiblat(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          box.innerHTML = renderQiblatError(
            'Izin lokasi ditolak. Buka Pengaturan → Aplikasi → Al Qur\'an As Salam → Izin → Lokasi → Izinkan.'
          );
        } else {
          box.innerHTML = renderQiblatError('Gagal mendapatkan lokasi. Pastikan GPS aktif lalu coba lagi.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'denied') {
        box.innerHTML = renderQiblatError(
          'Izin lokasi ditolak. Buka Pengaturan → Aplikasi → Al Qur\'an As Salam → Izin → Lokasi → Izinkan.'
        );
      } else {
        tryGet();
      }
    }).catch(() => tryGet());
  } else {
    tryGet();
  }
}

/* ── APPLY SAVED SETTINGS ─────────────────────────────────── */
function applySettings(){
  if(settings.dark) document.body.classList.add('dark');
  const t = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value  = val; };
  t('dark-mode-toggle', !!settings.dark);
  t('show-latin',       settings.showLatin !== false);
  t('translation-toggle', settings.showTranslation !== false);
  s('font-size-select', settings.fontSize || '28px');
  s('qari-select',      settings.qari || '01');
}

/* ── NAVIGATION ───────────────────────────────────────────── */
function setupNav(){
  const navMap = {
    'nav-home':     'home',
    'nav-surah':    'surah-list',
    'nav-audio':    'audio-surah',
    'nav-simak':    'simak',
    'nav-bookmark': 'bookmark',
    'nav-settings': 'settings',
  };
  Object.entries(navMap).forEach(([id, view]) => {
    document.getElementById(id)?.addEventListener('click', e => { e.preventDefault(); switchView(view); });
  });
}

const ALL_VIEWS = ['home','surah-list','surah-detail','audio-surah','simak','bookmark','settings','shalat','qiblat'];

function switchView(view){
  ALL_VIEWS.forEach(v => {
    document.getElementById(`${v}-view`)?.classList.add('hidden');
  });
  document.getElementById(`${view}-view`)?.classList.remove('hidden');

  document.querySelectorAll('.bottom-nav a').forEach(a => a.classList.remove('active'));
  const navIdMap = {
    'home':'nav-home','surah-list':'nav-surah','audio-surah':'nav-audio',
    'simak':'nav-simak','bookmark':'nav-bookmark','settings':'nav-settings',
  };
  if(navIdMap[view]) document.getElementById(navIdMap[view])?.classList.add('active');

  document.querySelectorAll('.drawer-menu li').forEach(li => li.classList.remove('active-menu'));
  const drawerIdMap = {
    'home':'drawer-home','surah-list':'drawer-surah','audio-surah':'drawer-audio',
    'simak':'drawer-simak','bookmark':'drawer-bookmark','settings':'drawer-settings',
  };
  if(drawerIdMap[view]) document.getElementById(drawerIdMap[view])?.classList.add('active-menu');

  if(view === 'surah-list')  renderSurahList();
  if(view === 'audio-surah') renderAudioList();
  if(view === 'bookmark')    renderBookmarks();
  if(view !== 'shalat' && window._shalatTimer){ clearInterval(window._shalatTimer); window._shalatTimer = null; }
  if(view !== 'qiblat') stopCompassSensor();

  window.scrollTo({top:0, behavior:'smooth'});
  closeDrawer();
}

/* ── DRAWER ───────────────────────────────────────────────── */
function setupDrawer(){
  document.getElementById('hamburger-btn')?.addEventListener('click', () => {
    document.getElementById('drawer')?.classList.toggle('active');
    document.getElementById('overlay')?.classList.toggle('active');
  });
  document.getElementById('overlay')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-home')?.addEventListener('click',     () => switchView('home'));
  document.getElementById('drawer-surah')?.addEventListener('click',    () => switchView('surah-list'));
  document.getElementById('drawer-audio')?.addEventListener('click',    () => switchView('audio-surah'));
  document.getElementById('drawer-simak')?.addEventListener('click',    () => switchView('simak'));
  document.getElementById('drawer-bookmark')?.addEventListener('click', () => switchView('bookmark'));
  document.getElementById('drawer-settings')?.addEventListener('click', () => switchView('settings'));
}
function closeDrawer(){
  document.getElementById('drawer')?.classList.remove('active');
  document.getElementById('overlay')?.classList.remove('active');
}

/* ── HOME ─────────────────────────────────────────────────── */
function renderPopularSurah(){
  const row = document.getElementById('popular-surah-row');
  if(!row) return;
  row.innerHTML = POPULAR_SURAH.map(n => {
    const s = SURAH_DATA[n-1];
    return `<div class="pop-chip" onclick="openSurah(${n})">
      <span class="pop-chip-arab">${s.ar}</span>
      <span class="pop-chip-name">${s.latin}</span>
      <span class="pop-chip-num">${s.ayat} Ayat</span>
    </div>`;
  }).join('');
}

function renderLastRead(){
  const card = document.getElementById('last-read-card');
  if(!card || !lastRead) return;
  const s = SURAH_DATA[lastRead.surahNum - 1];
  if(!s) return;
  document.getElementById('lr-surah-name').textContent = `${s.latin} (${s.ar})`;
  document.getElementById('lr-ayah-info').textContent  = `Ayat ${lastRead.ayahNum}`;
  card.classList.remove('hidden');
}


function renderQiblatError(msg){
  return `<div style="text-align:center;padding:40px 20px;background:var(--card);border-radius:20px;border:1px solid var(--border)">
    <span class="material-icons" style="font-size:48px;color:#f59e0b;display:block;margin-bottom:12px">explore_off</span>
    <p style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">Lokasi Tidak Tersedia</p>
    <p style="font-size:12px;color:var(--text-muted)">${msg}</p>
    <button onclick="showQiblatInfo()" style="margin-top:16px;background:var(--primary);color:white;border:none;padding:10px 24px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">Coba Lagi</button>
  </div>`;
}

async function renderQiblat(lat, lon) {
  const box=document.getElementById('qiblat-content');
  const qibla=getQiblaDirection(lat,lon);
  const deg=Math.round(qibla);
  const distKm=Math.round(haversineDistance(lat,lon,21.4225,39.8262));
  let geoCity='Lokasi Anda';
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const d=await r.json();
    geoCity=d.address?.city||d.address?.town||d.address?.county||'Lokasi Anda';
  }catch(e){}
  box.innerHTML=`
    <div class="shalat-location-card" style="margin-bottom:16px">
      <div class="shalat-loc-left">
        <span class="material-icons" style="color:var(--primary);font-size:20px">location_on</span>
        <div><p class="shalat-city">${geoCity}</p><p class="shalat-date">${lat.toFixed(4)}°, ${lon.toFixed(4)}°</p></div>
      </div>
      <div class="shalat-hijri"><span class="material-icons" style="font-size:14px;opacity:0.7">straighten</span>${distKm.toLocaleString('id-ID')} km</div>
    </div>
    <div class="qiblat-compass-wrap">
      <div class="qiblat-compass-card">
        <p class="qiblat-label" id="qiblat-status-label">Arahkan ke Kiblat</p>
        <div class="compass-outer">
          <div class="compass-rose">
            <span class="compass-dir compass-N">U</span><span class="compass-dir compass-S">S</span>
            <span class="compass-dir compass-E">T</span><span class="compass-dir compass-W">B</span>
          </div>
          <div class="compass-needle-wrap" id="compass-needle-wrap" style="transform:rotate(${deg}deg)">
            <svg viewBox="0 0 40 40" width="40" height="40" style="overflow:visible">
              <polygon points="20,2 26,20 20,17 14,20" fill="url(#gNorth)"/>
              <polygon points="20,38 26,20 20,23 14,20" fill="#94a3b8"/>
              <defs><linearGradient id="gNorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/>
              </linearGradient></defs>
            </svg>
          </div>
          <div class="compass-center-dot"></div>
          <div class="compass-kaaba-icon">🕋</div>
        </div>
        <div class="qiblat-deg-badge">${deg}° dari Utara</div>
        <p class="qiblat-hint" id="qiblat-hint-text">Ujung hijau menunjuk ke arah Kiblat</p>
      </div>
    </div>
    <div class="qiblat-info-grid">
      <div class="qiblat-info-item"><span class="material-icons" style="color:#10b981;font-size:28px">explore</span><p class="qi-val">${deg}°</p><p class="qi-label">Arah Kiblat</p></div>
      <div class="qiblat-info-item"><span class="material-icons" style="color:#6366f1;font-size:28px">near_me</span><p class="qi-val">${getCardinalDirection(deg)}</p><p class="qi-label">Arah Mata Angin</p></div>
      <div class="qiblat-info-item"><span class="material-icons" style="color:#f59e0b;font-size:28px">straighten</span><p class="qi-val">${distKm.toLocaleString('id-ID')}</p><p class="qi-label">Jarak (km)</p></div>
    </div>
    <div class="qiblat-kaaba-card">
      <div class="qiblat-kaaba-left">
        <span style="font-size:32px">🕋</span>
        <div>
          <p style="font-size:14px;font-weight:700;color:#fff">Ka'bah, Masjidil Haram</p>
          <p style="font-size:12px;color:rgba(255,255,255,0.7)">Mekah, Arab Saudi</p>
          <p style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:2px">21.4225° N, 39.8262° E</p>
        </div>
      </div>
    </div>
    <div class="shalat-method" style="margin-top:12px">
      <span class="material-icons" style="font-size:14px">info_outline</span>
      Jauhkan dari benda logam & kalibrasi kompas dengan gerakan angka 8
    </div>`;
  startCompassSensor(deg);
}

let _qiblatAbsoluteHandler=null,_qiblatRelativeHandler=null,_qiblatUsingAbsolute=false,_qiblatSmoothedHeading=null,_qiblatLastRotation=null;

function startCompassSensor(staticDeg){
  if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission==='function'){
    DeviceOrientationEvent.requestPermission().then(p=>{ if(p==='granted') listenOrientation(staticDeg); }).catch(()=>{});
  } else if(window.DeviceOrientationEvent){ listenOrientation(staticDeg); }
}

function listenOrientation(qiblaDeg){
  stopCompassSensor();
  _qiblatUsingAbsolute=false; _qiblatSmoothedHeading=null; _qiblatLastRotation=null;
  _qiblatAbsoluteHandler=e=>{ _qiblatUsingAbsolute=true; handleOrientation(e,qiblaDeg); };
  window.addEventListener('deviceorientationabsolute',_qiblatAbsoluteHandler,false);
  _qiblatRelativeHandler=e=>{
    if(typeof e.webkitCompassHeading==='number'){ handleOrientation(e,qiblaDeg); return; }
    if(_qiblatUsingAbsolute) return;
    if(e.alpha===null||e.alpha===undefined) return;
    handleOrientation(e,qiblaDeg);
  };
  window.addEventListener('deviceorientation',_qiblatRelativeHandler,false);
}

function stopCompassSensor(){
  if(_qiblatAbsoluteHandler){ window.removeEventListener('deviceorientationabsolute',_qiblatAbsoluteHandler); _qiblatAbsoluteHandler=null; }
  if(_qiblatRelativeHandler){ window.removeEventListener('deviceorientation',_qiblatRelativeHandler); _qiblatRelativeHandler=null; }
  _qiblatUsingAbsolute=false; _qiblatSmoothedHeading=null; _qiblatLastRotation=null;
}

function handleOrientation(e,qiblaDeg){
  const wrap=document.getElementById('compass-needle-wrap');
  if(!wrap) return;
  let heading=null;
  if(typeof e.webkitCompassHeading==='number') heading=e.webkitCompassHeading;
  else if(e.alpha!==null&&e.alpha!==undefined) heading=(360-e.alpha)%360;
  if(heading===null) return;
  if(_qiblatSmoothedHeading===null){ _qiblatSmoothedHeading=heading; }
  else{ let d=heading-_qiblatSmoothedHeading; d=((d+180)%360+360)%360-180; _qiblatSmoothedHeading=(_qiblatSmoothedHeading+d*0.15+360)%360; }
  const targetRotation=(qiblaDeg-_qiblatSmoothedHeading+360)%360;
  if(_qiblatLastRotation===null){ _qiblatLastRotation=targetRotation; }
  else{ let delta=targetRotation-(_qiblatLastRotation%360); delta=((delta+180)%360+360)%360-180; _qiblatLastRotation+=delta; }
  wrap.style.transition='transform 0.25s linear';
  wrap.style.transform=`rotate(${_qiblatLastRotation}deg)`;
  const statusLabel=document.getElementById('qiblat-status-label');
  const hintText=document.getElementById('qiblat-hint-text');
  const facingDiff=Math.abs(((qiblaDeg-_qiblatSmoothedHeading+540)%360)-180);
  if(statusLabel&&hintText){
    if(facingDiff<5){ statusLabel.textContent='✓ Sudah Menghadap Kiblat'; statusLabel.style.color='#059669'; hintText.textContent='Posisi sudah tepat'; }
    else{ statusLabel.textContent='Arahkan ke Kiblat'; statusLabel.style.color=''; hintText.textContent='Ujung hijau menunjuk ke arah Kiblat'; }
  }
}

function getCardinalDirection(deg){ return ['Utara','Timur Laut','Timur','Tenggara','Selatan','Barat Daya','Barat','Barat Laut'][Math.round(deg/45)%8]; }
function haversineDistance(lat1,lon1,lat2,lon2){ const R=6371,dL=(lat2-lat1)*Math.PI/180,dO=(lon2-lon1)*Math.PI/180,a=Math.sin(dL/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dO/2)**2; return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); }
function getQiblaDirection(lat,lon){ const kLat=21.4225,kLon=39.8262,lr=lat*Math.PI/180,kr=kLat*Math.PI/180,dL=(kLon-lon)*Math.PI/180,y=Math.sin(dL),x=Math.cos(lr)*Math.tan(kr)-Math.sin(lr)*Math.cos(dL); return(Math.atan2(y,x)*180/Math.PI+360)%360; }

/* ── SURAH LIST ───────────────────────────────────────────── */
function renderSurahList(filter=''){
  const container=document.getElementById('quranPage');
  const q=filter.toLowerCase();
  const list=SURAH_DATA.filter(s=>s.latin.toLowerCase().includes(q)||s.arti.toLowerCase().includes(q)||s.ar.includes(filter)||String(s.n).includes(filter));
  if(!list.length){ container.innerHTML=`<div class="empty-card"><span class="material-icons">search_off</span><p>Surah tidak ditemukan</p></div>`; return; }
  container.innerHTML=list.map(s=>`
    <div class="surah-card" onclick="openSurah(${s.n})">
      <div class="surah-number">${s.n}</div>
      <div class="surah-info"><h3>${s.latin}</h3><p>${s.arti} · ${s.ayat} Ayat</p></div>
      <div class="surah-right"><div class="surah-arab">${s.ar}</div><span class="surah-type-badge">${s.type}</span></div>
    </div>`).join('');
}

function renderAudioList(){
  const container=document.getElementById('surahAudioPage');

  // Header info qari aktif
  const qariNames = {
    '01':'Mishary Alafasy','02':'Abdul Basit','03':'Minshawi',
    '04':'Hani Rifai','05':'Maher Al Muaiqly','06':'Al Husary',
    '07':'As Sudais','08':'Al Hudhaify','09':'Muhammad Ayyoub','10':'Al Tablaway'
  };
  const qNow = getQari();

  container.innerHTML = `
    <div class="audio-qari-info-bar">
      <div class="audio-qari-info-left">
        <span class="material-icons">record_voice_over</span>
        <div>
          <p class="audio-qari-name">Qari Aktif: <strong>${qariNames[qNow]||'Alafasy'}</strong></p>
          <p class="audio-qari-sub">Ganti qari di menu Setelan</p>
        </div>
      </div>
      <span class="material-icons" style="color:var(--primary);opacity:0.5">queue_music</span>
    </div>
  ` + SURAH_DATA.map(s=>`
    <div class="audio-surah-card">
      <div class="audio-num-wrap" onclick="playFullSurah(${s.n})">${s.n}</div>
      <div class="audio-info" onclick="playFullSurah(${s.n})">
        <h3>${s.latin}</h3>
        <p>${s.arti} · ${s.ayat} Ayat · ${s.type}</p>
      </div>
      <div class="audio-arab" onclick="playFullSurah(${s.n})">${s.ar}</div>
      <div class="audio-card-actions">
        <button class="audio-action-btn play-btn" onclick="playFullSurah(${s.n})" title="Putar Online">
          <span class="material-icons">play_circle</span>
        </button>
        <button class="audio-action-btn dl-btn" onclick="downloadFullSurah(${s.n})" title="Unduh Ayat 1">
          <span class="material-icons">download</span>
        </button>
      </div>
    </div>`).join('');
}

function playFullSurah(surahNum){
  currentSurahNum=surahNum; isRangeMode=false; repeatCount=1; repeatDone=0;
  fetchAyahData(surahNum).then(data=>{ currentAyahData=data; currentAyahIndex=0; playAyah(0); showPlayer(); });
}

/* ══════════════════════════════════════════════════════════
   DOWNLOAD & PLAY ONLINE MUROTTAL
══════════════════════════════════════════════════════════ */

const QARI_FULL = {
  '01': { name:'Mishary Alafasy',      folder:'Alafasy_128kbps',                  kbps:'128' },
  '02': { name:'Abdul Basit',          folder:'Abdul_Basit_Murattal_192kbps',     kbps:'192' },
  '03': { name:'Minshawi',             folder:'Minshawy_Murattal_128kbps',        kbps:'128' },
  '04': { name:'Hani Rifai',           folder:'Hani_Rifai_192kbps',               kbps:'192' },
  '05': { name:'Maher Al Muaiqly',     folder:'Maher_AlMuaiqly_64kbps',           kbps:'64'  },
  '06': { name:'Al Husary',            folder:'Husary_128kbps',                   kbps:'128' },
  '07': { name:'As Sudais',            folder:'Abdurrahmaan_As-Sudais_192kbps',   kbps:'192' },
  '08': { name:'Al Hudhaify',          folder:'Hudhaify_128kbps',                 kbps:'128' },
  '09': { name:'Muhammad Ayyoub',      folder:'Muhammad_Ayyoub_128kbps',          kbps:'128' },
  '10': { name:'Al Tablaway',          folder:'Mohammad_al_Tablaway_128kbps',     kbps:'128' },
};

/* Bangun URL audio satu ayat */
function buildAudioUrl(surahNum, ayahNum, qariKey) {
  const q   = QARI_FULL[qariKey] || QARI_FULL['01'];
  const s   = pad(surahNum);
  const a   = pad(ayahNum);
  return `https://everyayah.com/data/${q.folder}/${s}${a}.mp3`;
}

/* ── Tampilkan Panel Download di Banner Surah ── */
function showDownloadPanel() {
  const panel = document.getElementById('download-panel');
  if (!panel) return;

  // Toggle panel
  if (!panel.classList.contains('hidden')) {
    panel.classList.add('hidden');
    return;
  }

  const surahNum  = currentSurahNum;
  const s         = SURAH_DATA[surahNum - 1];
  const grid      = document.getElementById('dlQariGrid');
  const ayahSel   = document.getElementById('dlAyahSelect');
  const activeQ   = getQari();

  // Render grid qari
  grid.innerHTML = Object.entries(QARI_FULL).map(([key, q]) => {
    const url    = buildAudioUrl(surahNum, 1, key); // ayat 1 sebagai preview
    const isAct  = key === activeQ;
    return `
      <div class="dl-qari-card ${isAct ? 'active' : ''}">
        <div class="dl-qari-top">
          <div class="dl-qari-icon">
            <span class="material-icons">${isAct ? 'record_voice_over' : 'person'}</span>
          </div>
          <div class="dl-qari-info">
            <p class="dl-qari-nm">${q.name}</p>
            <p class="dl-qari-kbps">${q.kbps} kbps · MP3</p>
          </div>
          ${isAct ? '<span class="dl-active-badge">Aktif</span>' : ''}
        </div>
        <div class="dl-qari-btns">
          <button class="dl-play-online-btn" onclick="playOnlineSurahQari(${surahNum}, '${key}')">
            <span class="material-icons">play_circle</span>
            Putar
          </button>
          <button class="dl-download-btn" onclick="downloadAyahDirect(${surahNum}, 1, '${key}')">
            <span class="material-icons">download</span>
            Unduh Ayat 1
          </button>
        </div>
      </div>`;
  }).join('');

  // Render pilihan ayat
  ayahSel.innerHTML = '';
  for (let i = 1; i <= s.ayat; i++) {
    ayahSel.innerHTML += `<option value="${i}">Ayat ${i}</option>`;
  }

  panel.classList.remove('hidden');
}

/* ── Putar surah online dengan qari tertentu ── */
function playOnlineSurahQari(surahNum, qariKey) {
  // Simpan qari sementara
  const prevQari   = settings.qari;
  settings.qari    = qariKey;
  currentSurahNum  = surahNum;
  isRangeMode      = false;
  repeatCount      = 1;
  repeatDone       = 0;

  fetchAyahData(surahNum).then(data => {
    currentAyahData  = data;
    currentAyahIndex = 0;
    playAyah(0);
    showPlayer();

    // Update player subtitle dengan nama qari
    const q = QARI_FULL[qariKey];
    document.getElementById('audio-player-sub').textContent =
      `${SURAH_DATA[surahNum-1].ar} · ${q.name}`;
  });

  showToastDl(`▶ Memutar dengan ${QARI_FULL[qariKey].name}`);
}

/* ── Putar satu ayat online dari panel download ── */
function playOnlineAyah() {
  const ayahNum = parseInt(document.getElementById('dlAyahSelect').value);
  const qariKey = getQari();
  const url     = buildAudioUrl(currentSurahNum, ayahNum, qariKey);
  const s       = SURAH_DATA[currentSurahNum - 1];

  const audioEl = document.getElementById('main-audio-element');
  audioEl.src   = url;
  audioEl.play().catch(()=>{});
  showPlayer();
  updatePlayerTitle(`${s.latin} · Ayat ${ayahNum}`);
  document.getElementById('audio-player-sub').textContent = `${s.ar} · ${QARI_FULL[qariKey].name}`;
  showToastDl(`▶ Memutar Ayat ${ayahNum}`);
}

/* ── Download langsung satu ayat (anchor trick) ── */
function downloadAyahDirect(surahNum, ayahNum, qariKey) {
  const url    = buildAudioUrl(surahNum, ayahNum, qariKey);
  const s      = SURAH_DATA[surahNum - 1];
  const q      = QARI_FULL[qariKey];
  const fname  = `${s.latin}_Ayat${ayahNum}_${q.name.replace(/\s/g,'_')}.mp3`;

  // Buka di tab baru (browser akan unduh/putar tergantung device)
  const a      = document.createElement('a');
  a.href       = url;
  a.target     = '_blank';
  a.rel        = 'noopener';
  a.download   = fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToastDl(`⬇ Mengunduh: ${fname}`);
}

/* ── Download ayat yang dipilih dari dropdown ── */
function downloadSingleAyah() {
  const ayahNum = parseInt(document.getElementById('dlAyahSelect').value);
  downloadAyahDirect(currentSurahNum, ayahNum, getQari());
}

/* ── Download dari halaman Audio Murottal (klik tombol DL di list) ── */
function downloadFullSurah(surahNum) {
  const s      = SURAH_DATA[surahNum - 1];
  const qKey   = getQari();
  const q      = QARI_FULL[qKey];

  // Buka sheet pilihan kecil (alert sederhana → bisa diperluas)
  // Langsung unduh ayat 1 sebagai sample, beri tahu user
  const url    = buildAudioUrl(surahNum, 1, qKey);
  const fname  = `${s.latin}_Ayat1_${q.name.replace(/\s/g,'_')}.mp3`;
  const a      = document.createElement('a');
  a.href       = url;
  a.target     = '_blank';
  a.rel        = 'noopener';
  a.download   = fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToastDl(`⬇ Unduh ${s.latin} Ayat 1 · ${q.name}`);
}

/* ── Toast khusus download ── */
let _dlToastTimer = null;
function showToastDl(msg) {
  // Reuse toast yang ada
  const t = document.querySelector('.global-toast-dl') || (() => {
    const el       = document.createElement('div');
    el.className   = 'global-toast-dl';
    document.body.appendChild(el);
    return el;
  })();

  t.innerHTML = `<span class="material-icons">download</span><span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(_dlToastTimer);
  _dlToastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function openSurah(surahNum, startIndex=0){
  const s=SURAH_DATA[surahNum-1]; currentSurahNum=surahNum;
  document.getElementById('detail-banner-latin').textContent=s.latin;
  document.getElementById('detail-banner-info').textContent=`${s.arti} · ${s.ayat} Ayat · ${s.type}`;
  document.getElementById('detail-banner-arab').textContent=s.ar;
  const fromSel=document.getElementById('audio-from-ayah');
  const toSel=document.getElementById('audio-to-ayah');
  fromSel.innerHTML=''; toSel.innerHTML='';
  for(let i=1;i<=s.ayat;i++){
    fromSel.innerHTML+=`<option value="${i}">${i}</option>`;
    toSel.innerHTML+=`<option value="${i}" ${i===s.ayat?'selected':''}>${i}</option>`;
  }
  switchView('surah-detail');
  const container=document.getElementById('ayah-list-container');
  container.innerHTML=`<div style="text-align:center;padding:30px;color:var(--text-muted)"><span class="material-icons" style="font-size:36px;display:block;margin-bottom:8px;opacity:0.4">hourglass_top</span>Memuat ayat...</div>`;
  fetchAyahData(surahNum).then(data=>{
    currentAyahData=data; renderAyahList(data);
    if(startIndex>0){ setTimeout(()=>{ document.querySelector(`.ayah-card[data-index="${startIndex}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}); },300); }
  });
}

async function fetchAyahData(surahNum){
  if(ayahCache[surahNum]) return ayahCache[surahNum];
  try{
    const res=await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,id.indonesian,en.transliteration`);
    const json=await res.json();
    const arabic=json.data[0].ayahs, trans=json.data[1].ayahs, latin=json.data[2].ayahs;
    const data=arabic.map((a,i)=>({ number:a.numberInSurah, arabic:a.text, translation:trans[i]?.text||'', latin:latin[i]?.text||'' }));
    ayahCache[surahNum]=data; return data;
  }catch(e){
    return Array.from({length:SURAH_DATA[surahNum-1].ayat},(_,i)=>({ number:i+1, arabic:'﴿ تحميل... ﴾', translation:'Koneksi internet diperlukan.', latin:'' }));
  }
}

function renderAyahList(data){
  const showLatin=settings.showLatin!==false, showTrans=settings.showTranslation!==false;
  const fontSize=settings.fontSize||'28px', surahNum=currentSurahNum, s=SURAH_DATA[surahNum-1];
  const container=document.getElementById('ayah-list-container');
  let html='';
  if(surahNum!==9&&surahNum!==1) html+=`<div class="bismillah-card">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>`;
  html+=data.map((a,i)=>{
    const isBm=bookmarks.some(b=>b.surah===surahNum&&b.ayah===a.number);
    return `<div class="ayah-card" data-index="${i}" data-ayah="${a.number}">
      <div class="ayah-header">
        <div class="ayah-number">${a.number}</div>
        <div class="ayah-actions">
          <button class="ayah-btn ${isBm?'bookmarked':''}" onclick="toggleBookmark(${surahNum},${a.number},'${s.latin}')" title="Simpan">
            <span class="material-icons" style="font-size:16px">${isBm?'bookmark':'bookmark_border'}</span>
          </button>
          <button class="ayah-btn" onclick="playAyah(${i})" title="Putar">
            <span class="material-icons" style="font-size:16px">play_arrow</span>
          </button>
          <select class="repeat-select" id="repeat-${i}" title="Ulangi">
            <option value="1">1x</option><option value="3">3x</option>
            <option value="5">5x</option><option value="10">10x</option>
          </select>
        </div>
      </div>
      <div class="arabic-text" style="font-size:${fontSize}">${a.arabic}</div>
      ${showLatin?`<div class="latin-text">${a.latin}</div>`:''}
      ${showTrans?`<div class="translation-text">${a.translation}</div>`:''}
    </div>`;
  }).join('');
  container.innerHTML=html;
}

/* ── AUDIO PLAYBACK ───────────────────────────────────────── */
function setupAudioPlayer(){
  audio=document.getElementById("main-audio-element");
  if(!audio) return;
  audio.addEventListener("timeupdate",()=>{
    if(!audio.duration) return;
    const pct=(audio.currentTime/audio.duration)*100;
    const pb=document.getElementById("progress-bar"),pc=document.getElementById("prog-current"),pd=document.getElementById("prog-duration");
    if(pb) pb.value=pct;
    if(pc) pc.textContent=fmtTime(audio.currentTime);
    if(pd) pd.textContent=fmtTime(audio.duration);
  });
  document.getElementById("progress-bar")?.addEventListener("input",e=>{ if(audio.duration) audio.currentTime=(e.target.value/100)*audio.duration; });
  document.getElementById("btn-play-pause")?.addEventListener("click",togglePlayPause);
  document.getElementById("btn-prev-ayah")?.addEventListener("click",()=>{ if(currentAyahIndex>0) playAyah(currentAyahIndex-1); });
  document.getElementById("btn-next-ayah")?.addEventListener("click",advanceToNext);
  audio.addEventListener("ended",handleAudioEnded);
  audio.addEventListener("error",()=>{
    if(_audioIntentionalStop) return;
    if(!audio.src||audio.src===window.location.href) return;
    updatePlayerTitle("Audio tidak tersedia, lanjut...");
    setTimeout(()=>advanceToNext(),800);
  });
}

function handleAudioEnded(){
  repeatDone++;
  let thisRepeat=repeatCount;
  if(!isRangeMode){ const sel=document.getElementById(`repeat-${currentAyahIndex}`); thisRepeat=sel?parseInt(sel.value):1; }
  if(repeatDone<thisRepeat){ audio.currentTime=0; audio.play().catch(()=>{}); return; }
  repeatDone=0; advanceToNext();
}

function advanceToNext(){
  if(!currentAyahData.length) return;
  if(isRangeMode){ const n=currentAyahData[currentAyahIndex]?.number; if(n>=rangeTo){ stopAudio(); return; } }
  const nextIndex=currentAyahIndex+1;
  if(nextIndex<currentAyahData.length) playAyah(nextIndex);
  else{ const ns=currentSurahNum+1; if(ns<=114) autoLoadNextSurah(ns); else stopAudio(); }
}

function autoLoadNextSurah(surahNum){
  currentSurahNum=surahNum;
  const s=SURAH_DATA[surahNum-1];
  updatePlayerTitle(`Memuat ${s.latin}...`);
  document.getElementById('detail-banner-latin').textContent=s.latin;
  document.getElementById('detail-banner-info').textContent=`${s.arti} · ${s.ayat} Ayat · ${s.type}`;
  document.getElementById('detail-banner-arab').textContent=s.ar;
  fetchAyahData(surahNum).then(data=>{ currentAyahData=data; currentAyahIndex=0; repeatDone=0; playAyah(0); });
}

function playAyah(index){
  if(!currentAyahData.length||index<0||index>=currentAyahData.length) return;
  currentAyahIndex=index; repeatDone=0;
  const ayah=currentAyahData[index], url=audioUrl(currentSurahNum,ayah.number), s=SURAH_DATA[currentSurahNum-1];
  _audioIntentionalStop=false;
  audio.src=url;
  audio.play().then(()=>{
    isPlaying=true;
    updatePlayerTitle(`${s.latin} · Ayat ${ayah.number}`);
    document.getElementById('audio-player-sub').textContent=s.ar;
    showPlayer(); highlightAyah(index); updatePlayPauseBtn(true);
    updateMediaSession(s.latin,ayah.number);
    saveLastRead(currentSurahNum,ayah.number); renderLastRead();
  }).catch(err=>console.warn('Play error:',err));
}

function playRange(){
  rangeFrom=parseInt(document.getElementById('audio-from-ayah').value);
  rangeTo=parseInt(document.getElementById('audio-to-ayah').value);
  repeatCount=parseInt(document.getElementById('audio-repeat-count').value);
  isRangeMode=true; repeatDone=0;
  if(!currentAyahData.length){ fetchAyahData(currentSurahNum).then(data=>{ currentAyahData=data; const idx=data.findIndex(a=>a.number===rangeFrom); playAyah(idx>=0?idx:0); }); return; }
  const idx=currentAyahData.findIndex(a=>a.number===rangeFrom); playAyah(idx>=0?idx:0);
}

function togglePlayPause(){
  if(audio.paused){ audio.play().then(()=>{ isPlaying=true; updatePlayPauseBtn(true); }); }
  else{ audio.pause(); isPlaying=false; updatePlayPauseBtn(false); }
}

function stopAudio(){
  _audioIntentionalStop=true; audio.pause(); audio.src='';
  isPlaying=false; isRangeMode=false; repeatCount=1; repeatDone=0;
  updatePlayPauseBtn(false); clearHighlight();
}

function updatePlayPauseBtn(playing){ document.getElementById('btn-play-pause').innerHTML=`<span class="material-icons">${playing?'pause':'play_arrow'}</span>`; }
function updatePlayerTitle(text){ document.getElementById('audio-player-title').textContent=text; }
function showPlayer(){ document.getElementById('global-audio-player').classList.remove('hidden'); }
function highlightAyah(index){ clearHighlight(); const card=document.querySelector(`.ayah-card[data-index="${index}"]`); if(card){ card.classList.add('playing'); card.scrollIntoView({behavior:'smooth',block:'center'}); } }
function clearHighlight(){ document.querySelectorAll('.ayah-card.playing').forEach(el=>el.classList.remove('playing')); }

function setupMediaSession(){
  if(!('mediaSession' in navigator)) return;
  navigator.mediaSession.setActionHandler('play',()=>{ audio.play(); isPlaying=true; updatePlayPauseBtn(true); });
  navigator.mediaSession.setActionHandler('pause',()=>{ audio.pause(); isPlaying=false; updatePlayPauseBtn(false); });
  navigator.mediaSession.setActionHandler('previoustrack',()=>{ if(currentAyahIndex>0) playAyah(currentAyahIndex-1); });
  navigator.mediaSession.setActionHandler('nexttrack',advanceToNext);
  navigator.mediaSession.setActionHandler('seekbackward',()=>{ audio.currentTime=Math.max(0,audio.currentTime-10); });
  navigator.mediaSession.setActionHandler('seekforward',()=>{ audio.currentTime=Math.min(audio.duration||0,audio.currentTime+10); });
}

function updateMediaSession(surahName,ayahNum){
  if(!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata=new MediaMetadata({ title:`${surahName} · Ayat ${ayahNum}`, artist:"Al Qur'an As Salam", album:"Murottal Al Qur'an", artwork:[{src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/The_Holy_Quran.jpg/480px-The_Holy_Quran.jpg',sizes:'480x480',type:'image/jpeg'}] });
  navigator.mediaSession.playbackState='playing';
}

/* ── BOOKMARKS ────────────────────────────────────────────── */
function toggleBookmark(surahNum,ayahNum,surahName){
  const idx=bookmarks.findIndex(b=>b.surah===surahNum&&b.ayah===ayahNum);
  const isNowBookmarked=idx<0;
  if(idx>=0) bookmarks.splice(idx,1);
  else bookmarks.push({surah:surahNum,ayah:ayahNum,name:surahName,saved:new Date().toLocaleDateString('id-ID')});
  saveBookmarks();
  const ayahCard=document.querySelector(`.ayah-card[data-ayah="${ayahNum}"]`);
  if(ayahCard){ const btn=ayahCard.querySelector('.ayah-btn'); if(btn){ btn.className=`ayah-btn ${isNowBookmarked?'bookmarked':''}`; btn.querySelector('.material-icons').textContent=isNowBookmarked?'bookmark':'bookmark_border'; } }
}

function renderBookmarks(){
  const container=document.getElementById('bookmarkPage');
  if(!bookmarks.length){ container.innerHTML=`<div class="empty-card"><span class="material-icons">bookmark_border</span><p>Belum ada markah tersimpan</p><p style="font-size:12px;margin-top:6px">Tap ikon bookmark di ayat untuk menyimpan</p></div>`; return; }
  container.innerHTML=bookmarks.map((b,i)=>`
    <div class="bookmark-item" onclick="openSurah(${b.surah})">
      <div class="bm-icon"><span class="material-icons">bookmark</span></div>
      <div class="bm-info"><h4>${b.name} · Ayat ${b.ayah}</h4><p>Surah ke-${b.surah} · Disimpan ${b.saved}</p></div>
      <button class="bm-del" onclick="event.stopPropagation();deleteBookmark(${i})" title="Hapus"><span class="material-icons">delete_outline</span></button>
    </div>`).join('');
}

function deleteBookmark(i){ bookmarks.splice(i,1); saveBookmarks(); renderBookmarks(); }

/* ══════════════════════════════════════════════════════════
   ██████████████████████████████████████████████████████████
   SIMAK HAFALAN — AI GURU TAHFIZH v4.0
   ██████████████████████████████████████████████████████████
══════════════════════════════════════════════════════════ */

/* ── State Simak ──────────────────────────────────────────── */
let simakState = {
  active       : false,
  surahNum     : 1,
  ayatAwal     : 1,
  ayatAkhir    : 7,
  mode         : 'hafalan',
  level        : 'pemula',
  ayahDataList : [],       // [{number, arabic, translation, words:[]}]
  currentIdx   : 0,        // index dalam ayahDataList
  currentWordIdx: 0,       // index kata dalam ayah saat ini
  totalAyat    : 0,
  benar        : 0,
  salah        : 0,
  errors       : [],       // [{ayah, word, type, heard}]
  startTime    : null,
  timerInterval: null,
  recognition  : null,
  isMicActive  : false,
  silenceTimer : null,
  bantuTimer   : null,     // timer 10 detik tanya bantuan
  modeBantuan  : false,    // true = sedang menunggu jawaban "iya/tidak"
  lastTranscript: '',
  history      : JSON.parse(localStorage.getItem('simak_history') || '[]'),
};

const SIMAK_TTS_LANG = 'id-ID';

/* ── Kamus Respon Suara AI ────────────────────────────────── */
/* ══════════════════════════════════════════════════════════
   AI GURU TAHFIZH — ENGINE v4.1
   Konsep: AI DIAM TOTAL kecuali 3 kondisi:
   1. Hafalan tidak sesuai ayat
   2. Urutan ayat salah
   3. Diam 15 detik → tanya bantuan
   Suara: Laki-laki (pilihan suara id-ID male / en-US male)
══════════════════════════════════════════════════════════ */

/* ── Respon AI (hanya 3 kondisi) ─────────────────────────── */
const AI_RESPON = {

  /* Kondisi 1: Hafalan tidak sesuai */
  hafalanSalah: [
    'Maaf, ada bacaan yang kurang tepat. Silakan ulangi bagian terakhir.',
    'Ada satu kata yang berbeda. Coba ulangi ayat tersebut.',
    'Maaf, bacaan kurang sesuai. Silakan ulangi.',
    'Ada yang perlu diperbaiki. Ulangi ayat tersebut.',
  ],

  /* Kondisi 2: Urutan ayat salah */
  urutanSalah: [
    'Maaf, Anda melewati satu ayat.',
    'Urutan ayat kurang sesuai. Silakan kembali ke ayat sebelumnya.',
    'Maaf, ada ayat yang terlewat. Silakan ulang dari ayat sebelumnya.',
  ],

  /* Kondisi 3a: Tanya bantuan (15 detik diam) */
  tanyaBantuan: [
    'Maaf, apakah boleh saya bantu?',
  ],

  /* Kondisi 3b: Jika jawab tidak / diam */
  silakanLanjut: [
    'Baik, silakan lanjutkan ketika sudah siap.',
  ],

  /* Kondisi 3c: Jika jawab iya → info sebelum putar */
  akanPutar: [
    'Baik, saya putarkan ayatnya.',
  ],

  /* Sesi selesai */
  selesai: [
    'Jazakallahu khayran. Sesi selesai.',
    'Alhamdulillah, sesi hafalan selesai.',
  ],
};

function aiPick(cat) {
  const list = AI_RESPON[cat];
  if (!list) return '';
  return list[Math.floor(Math.random() * list.length)];
}

/* ── Deteksi kemiripan kata Arab ─────────────────────────── */
function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D4-\u06ED]/g, '') // hapus harakat
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(s, t) {
  const m = s.length, n = t.length;
  const d = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = s[i-1] === t[j-1]
        ? d[i-1][j-1]
        : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
  return d[m][n];
}

function calcSimilarity(a, b) {
  const an = normalizeArabic(a), bn = normalizeArabic(b);
  if (an === bn) return 1;
  if (!an || !bn) return 0;
  const dist = levenshtein(an, bn);
  return 1 - dist / Math.max(an.length, bn.length);
}

function tokenizeArabic(text) {
  return text.split(/\s+/).filter(w => w.trim().length > 0);
}

/* ── Threshold per level ──────────────────────────────────── */
function getLevelThreshold() {
  // Toleransi tajwid: semakin tinggi level, semakin ketat
  return { pemula: 0.50, menengah: 0.60, mahir: 0.72, guru: 0.85 }[simakState.level] || 0.60;
}

/* ══════════════════════════════════════════════════════════
   TTS — SUARA LAKI-LAKI
══════════════════════════════════════════════════════════ */
let _ttsVoices = [];

function loadTTSVoices() {
  _ttsVoices = window.speechSynthesis?.getVoices() || [];
  if (!_ttsVoices.length && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      _ttsVoices = window.speechSynthesis.getVoices();
    };
  }
}

function getMaleVoice() {
  if (!_ttsVoices.length) _ttsVoices = window.speechSynthesis?.getVoices() || [];

  // Prioritas: suara Indonesia laki-laki
  const prio = [
    v => v.lang === 'id-ID' && /male|laki|pria|man|google/i.test(v.name),
    v => v.lang === 'id-ID',
    v => v.lang.startsWith('id'),
    v => v.lang === 'ms-MY',          // Melayu Malaysia sebagai fallback
    v => /male|man/i.test(v.name) && v.lang.startsWith('en'),
    v => v.lang.startsWith('en'),     // fallback terakhir
  ];

  for (const fn of prio) {
    const found = _ttsVoices.find(fn);
    if (found) return found;
  }
  return null;
}

/*
  simakSpeak:
  - AI berbicara HANYA dari 3 kondisi yang diizinkan
  - Pause mic saat berbicara, restart setelah selesai
  - Rate sedikit lebih lambat agar terdengar natural & jelas
*/
function simakSpeak(text, onDone) {
  if (!text || !('speechSynthesis' in window)) {
    onDone && onDone();
    return;
  }

  window.speechSynthesis.cancel();

  // Pause recognition sementara agar mic tidak tangkap suara AI
  if (simakState.recognition && simakState.isMicActive) {
    try { simakState.recognition.stop(); } catch(e) {}
  }

  const utt    = new SpeechSynthesisUtterance(text);
  utt.lang     = 'id-ID';
  utt.rate     = 0.92;   // agak lambat → lebih jelas dan natural
  utt.pitch    = 0.85;   // pitch lebih rendah → kesan suara laki-laki
  utt.volume   = 1.0;

  const voice = getMaleVoice();
  if (voice) utt.voice = voice;

  utt.onend = () => {
    onDone && onDone();
    // Restart mic setelah AI selesai bicara
    if (simakState.active && !simakState.isMicActive) {
      setTimeout(() => startSimakRecognition(), 300);
    }
  };

  utt.onerror = () => {
    onDone && onDone();
    if (simakState.active && !simakState.isMicActive) {
      setTimeout(() => startSimakRecognition(), 300);
    }
  };

  window.speechSynthesis.speak(utt);
}

/* ══════════════════════════════════════════════════════════
   SPEECH RECOGNITION
══════════════════════════════════════════════════════════ */
function startSimakRecognition() {
  if (!simakState.active) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  // Stop instance lama jika ada
  if (simakState.recognition) {
    try { simakState.recognition.stop(); } catch(e) {}
    simakState.recognition = null;
  }

  const rec              = new SR();
  rec.lang               = 'ar-SA';
  rec.continuous         = true;
  rec.interimResults     = true;
  rec.maxAlternatives    = 5;
  simakState.recognition = rec;

  rec.onstart = () => {
    simakState.isMicActive = true;
    simakSetOrbState('listening');

    const ayah = simakState.ayahDataList[simakState.currentIdx];
    const kata  = ayah?.words[simakState.currentWordIdx] || '';
    simakSetLabel(
      'Mendengarkan...',
      kata ? `Lanjutkan dari kata: ${kata}` : 'Bacalah dengan tartil'
    );
    document.getElementById('simakLiveDot')?.classList.add('active');

    // Mulai timer diam 15 detik
    resetSilenceTimer();
  };

  rec.onresult = (event) => {
    let finalText = '', interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText   += t;
      else                           interimText += t;
    }

    // Tampilkan di transcript box
    const el = document.getElementById('simakTranscriptText');
    if (el) {
      el.innerHTML = finalText
        ? `<span style="color:var(--text)">${finalText}</span>`
        : `<span style="color:var(--text-muted)">${interimText}</span>`;
    }

    if (!finalText.trim()) return;

    // Reset timer diam karena user bicara
    resetSilenceTimer();
    simakState.lastTranscript = finalText.trim();

    /* Mode menunggu jawaban bantuan */
    if (simakState.modeBantuan) {
      cekJawabanBantuan(finalText.trim());
      return;
    }

    /* Proses hafalan normal */
    prosesHafalan(finalText.trim());
  };

  rec.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return;
    simakAddLog('warn', `⚠️ Mikrofon: ${e.error}`);
    if (simakState.active) setTimeout(() => startSimakRecognition(), 800);
  };

  rec.onend = () => {
    simakState.isMicActive = false;
    document.getElementById('simakLiveDot')?.classList.remove('active');
    if (simakState.active && !simakState.modeBantuan) {
      setTimeout(() => startSimakRecognition(), 150);
    }
  };

  try { rec.start(); } catch(e) { console.warn('[SR]', e); }
}

/* ══════════════════════════════════════════════════════════
   TIMER DIAM 15 DETIK
══════════════════════════════════════════════════════════ */
function resetSilenceTimer() {
  clearTimeout(simakState.bantuTimer);
  if (!simakState.active) return;

  simakState.bantuTimer = setTimeout(() => {
    if (!simakState.active) return;
    if (simakState.modeBantuan) return;
    aktifkanModeBantuan();
  }, 15000); // 15 detik
}

function stopSilenceTimer() {
  clearTimeout(simakState.bantuTimer);
}

/* ══════════════════════════════════════════════════════════
   PROSES HAFALAN — AI DIAM JIKA BENAR
══════════════════════════════════════════════════════════ */
function prosesHafalan(heard) {
  if (!simakState.active || !simakState.ayahDataList.length) return;

  const curIdx      = simakState.currentIdx;
  const ayah        = simakState.ayahDataList[curIdx];
  if (!ayah) return;

  const heardNorm   = normalizeArabic(heard);
  const heardWords  = heardNorm.split(/\s+/).filter(w => w.length > 0);
  const threshold   = getLevelThreshold();
  let   wPtr        = simakState.currentWordIdx;
  let   adaSalah    = false;
  let   salahIdx    = -1;

  for (let hi = 0; hi < heardWords.length; hi++) {
    if (wPtr >= ayah.words.length) break;

    const hw         = heardWords[hi];
    const expected   = ayah.words[wPtr];
    const sim        = calcSimilarity(hw, expected);

    if (sim >= threshold) {
      /* ── BENAR: highlight hijau, AI DIAM ── */
      simakHighlightWord(curIdx, wPtr, 'correct');
      simakState.benar++;
      wPtr++;
    } else {
      /* ── SALAH: highlight merah ── */
      simakHighlightWord(curIdx, wPtr, 'wrong');
      simakState.salah++;
      simakState.errors.push({
        ayah    : ayah.number,
        wordIdx : wPtr,
        expected: expected,
        heard   : heard,
        sim,
      });

      if (!adaSalah) { adaSalah = true; salahIdx = wPtr; }
      wPtr++;
    }
  }

  simakState.currentWordIdx = wPtr;
  simakUpdateStats();

  // Highlight kata berikutnya
  if (wPtr < ayah.words.length) {
    simakHighlightWord(curIdx, wPtr, 'current');
  }

  /* ── Kondisi 1: Ada kesalahan → AI berbicara ── */
  if (adaSalah) {
    simakSetOrbState('wrong');
    simakAddLog('wrong',
      `❌ Ayat ${ayah.number} kata ke-${salahIdx+1} — <span class="simak-log-arab">${ayah.words[salahIdx]}</span>`
    );

    const resp = aiPick('hafalanSalah');
    simakSetLabel('Perlu diperbaiki', resp);

    // AI bicara — reset wPtr ke kata salah agar bisa diulang
    simakSpeak(resp, () => {
      if (!simakState.active) return;
      // Mundurkan pointer ke kata salah agar pengguna mengulang dari sana
      simakState.currentWordIdx = salahIdx;
      simakHighlightWord(curIdx, salahIdx, 'current');
      simakSetOrbState('listening');
      simakSetLabel('Mendengarkan...', 'Ulangi dari kata yang salah');
      resetSilenceTimer();
    });
    return;
  }

  /* ── Semua kata ayat selesai & benar ── */
  if (wPtr >= ayah.words.length) {
    onAyatSelesaiSilent(curIdx);
  }
}

/* ──  Deteksi urutan ayat salah (loncat ayat) ────────────── */
function cekUrutanAyat(heard) {
  if (!simakState.ayahDataList.length) return false;
  const curAyah  = simakState.ayahDataList[simakState.currentIdx];
  const nextAyah = simakState.ayahDataList[simakState.currentIdx + 1];
  if (!nextAyah) return false;

  // Jika kata pertama yang didengar sangat mirip dengan awal ayat BERIKUTNYA
  // tapi tidak mirip dengan ayat saat ini → deteksi loncat
  const heardFirst  = normalizeArabic(heard.split(/\s+/)[0] || '');
  const curFirst    = normalizeArabic(curAyah.words[simakState.currentWordIdx] || '');
  const nextFirst   = normalizeArabic(nextAyah.words[0] || '');

  const simCur  = calcSimilarity(heardFirst, curFirst);
  const simNext = calcSimilarity(heardFirst, nextFirst);

  // Loncat = lebih cocok ke ayat berikutnya dari pada ayat sekarang, dengan selisih besar
  return simNext > simCur + 0.35 && simNext > 0.65;
}

/* ══════════════════════════════════════════════════════════
   AYAT SELESAI — AI DIAM, LANJUT OTOMATIS
══════════════════════════════════════════════════════════ */
function onAyatSelesaiSilent(ayatIdx) {
  const ayah    = simakState.ayahDataList[ayatIdx];
  const nextIdx = ayatIdx + 1;
  const adaLagi = nextIdx < simakState.totalAyat;

  /* Log saja, tidak ada suara */
  simakAddLog('correct', `✅ Ayat ${ayah.number} selesai`);

  const pct = Math.round(((ayatIdx + 1) / simakState.totalAyat) * 100);
  document.getElementById('simakProgressFill').style.width = pct + '%';
  document.getElementById('simakProgressPct').textContent  = pct + '%';

  if (adaLagi) {
    /* Pindah ke ayat berikutnya — tanpa suara */
    setTimeout(() => {
      if (!simakState.active) return;
      simakState.currentIdx     = nextIdx;
      simakState.currentWordIdx = 0;
      simakRenderAyat(nextIdx);
      simakHighlightWord(nextIdx, 0, 'current');
      simakSetOrbState('listening');

      const nAyah = simakState.ayahDataList[nextIdx];
      simakSetLabel('Mendengarkan...', `Ayat ${nAyah.number}`);
      resetSilenceTimer();
    }, 600);
  } else {
    /* Semua selesai */
    setTimeout(() => selesaiSimak(), 800);
  }
}

/* ══════════════════════════════════════════════════════════
   KONDISI 3 — BANTUAN SETELAH 15 DETIK DIAM
══════════════════════════════════════════════════════════ */
function aktifkanModeBantuan() {
  if (!simakState.active) return;
  simakState.modeBantuan = true;

  const ayah = simakState.ayahDataList[simakState.currentIdx];
  simakSetOrbState('thinking');
  simakSetLabel('Menunggu jawaban...', 'Apakah perlu bantuan?');
  simakAddLog('info', `💬 AI: "Maaf, apakah boleh saya bantu?" — Ayat ${ayah?.number || ''}`);

  // Tampilkan UI pilihan di transcript box
  const el = document.getElementById('simakTranscriptText');
  if (el) {
    el.innerHTML = `
      <div class="simak-bantuan-ui">
        <p class="simak-bantuan-q">💬 <em>Maaf, apakah boleh saya bantu?</em></p>
        <div class="simak-bantuan-btns">
          <button class="simak-bantuan-iya" onclick="jawabanBantuan(true)">
            <span class="material-icons">play_circle</span> Ya, putarkan
          </button>
          <button class="simak-bantuan-tidak" onclick="jawabanBantuan(false)">
            <span class="material-icons">mic</span> Tidak, lanjut
          </button>
        </div>
        <p class="simak-bantuan-hint">Atau ucapkan "iya" / "tidak"</p>
      </div>`;
  }

  // AI bertanya via TTS
  simakSpeak(aiPick('tanyaBantuan'));

  // Timeout 10 detik jika tidak ada jawaban → anggap "tidak"
  simakState.silenceTimer = setTimeout(() => {
    if (simakState.modeBantuan && simakState.active) {
      jawabanBantuan(false);
    }
  }, 10000);
}

/* Deteksi jawaban suara iya/tidak */
function cekJawabanBantuan(heard) {
  const h      = heard.toLowerCase().trim();
  const kataIya   = ['iya','ya','boleh','mau','tolong','bantu','ok','oke','silakan','putar','bisa'];
  const kataTidak = ['tidak','jangan','no','nggak','gak','enggak','belum','lanjut','sendiri','bisa','coba'];

  if (kataIya.some(k   => h.includes(k))) { jawabanBantuan(true);  return; }
  if (kataTidak.some(k => h.includes(k))) { jawabanBantuan(false); return; }
}

function jawabanBantuan(iya) {
  clearTimeout(simakState.silenceTimer);
  clearTimeout(simakState.bantuTimer);
  simakState.modeBantuan = false;

  if (iya) {
    /* ── Putar audio ayat yang sedang dihafalkan ── */
    const ayah   = simakState.ayahDataList[simakState.currentIdx];
    const surahN = simakState.surahNum;
    const ayahN  = ayah?.number || 1;
    const surahS = SURAH_DATA[surahN - 1];

    simakSetOrbState('correct');
    simakSetLabel('Memutar murottal...', `${surahS.latin} Ayat ${ayahN}`);
    simakAddLog('info', `🔊 Memutar Ayat ${ayahN} sebagai bantuan`);

    const el = document.getElementById('simakTranscriptText');
    if (el) {
      el.innerHTML = `
        <div style="direction:ltr;text-align:center;padding:8px 0;font-family:'Plus Jakarta Sans',sans-serif">
          <span class="material-icons" style="font-size:32px;color:var(--primary);display:block;margin-bottom:6px">play_circle</span>
          <strong style="font-size:13px;color:var(--text)">${surahS.latin} · Ayat ${ayahN}</strong><br>
          <span style="font-size:11px;color:var(--text-muted)">Simak lalu ulangi</span>
        </div>`;
    }

    // Ucapkan sebelum putar
    simakSpeak(aiPick('akanPutar'), () => {
      if (!simakState.active) return;

      // Putar via audio player utama
      _audioIntentionalStop = false;
      const url = audioUrl(surahN, ayahN);
      audio.src = url;
      audio.play().catch(() => {});
      updatePlayerTitle(`${surahS.latin} · Ayat ${ayahN} (Bantuan)`);
      document.getElementById('audio-player-sub').textContent = surahS.ar;
      showPlayer();

      // Setelah audio selesai → reset & lanjut simak
      const onEnd = () => {
        audio.removeEventListener('ended', onEnd);
        if (!simakState.active) return;

        simakAddLog('info', '🎙️ Ulangi hafalan setelah mendengar murottal');
        simakSetLabel('Mendengarkan...', `Silakan ulangi Ayat ${ayahN}`);
        simakSetOrbState('listening');

        // Reset pointer ayat ke awal agar bisa diulang
        simakState.currentWordIdx = 0;
        simakRenderAyat(simakState.currentIdx);
        simakHighlightWord(simakState.currentIdx, 0, 'current');
        resetTranscriptBox();

        setTimeout(() => {
          if (simakState.active) resetSilenceTimer();
        }, 1000);
      };
      audio.addEventListener('ended', onEnd);
    });

  } else {
    /* ── User tidak minta bantuan ── */
    const resp = aiPick('silakanLanjut');
    simakSetOrbState('listening');
    simakSetLabel('Mendengarkan...', 'Lanjutkan ketika sudah siap');
    simakAddLog('info', `💬 "${resp}"`);

    simakSpeak(resp, () => {
      resetTranscriptBox();
      if (simakState.active) {
        setTimeout(() => resetSilenceTimer(), 500);
      }
    });
  }
}

/* Reset transcript box */
function resetTranscriptBox() {
  const el = document.getElementById('simakTranscriptText');
  if (el) el.innerHTML = '<span class="simak-transcript-placeholder">Suara Anda akan muncul di sini...</span>';
}

/* ══════════════════════════════════════════════════════════
   HIGHLIGHT KATA & RENDER AYAT
══════════════════════════════════════════════════════════ */
function simakRenderAyat(idx) {
  if (!simakState.ayahDataList.length) return;
  const ayah   = simakState.ayahDataList[idx];
  const surahS = SURAH_DATA[simakState.surahNum - 1];

  document.getElementById('simakAyatCounter').textContent =
    `Ayat ${ayah.number} · ${surahS.latin}`;

  const arabicEl = document.getElementById('simakArabicText');
  if (arabicEl) {
    arabicEl.innerHTML = ayah.words.map((w, i) => {
      let cls = 'sw-word pending';
      if (i < simakState.currentWordIdx) cls = 'sw-word correct';
      if (i === simakState.currentWordIdx) cls = 'sw-word current';
      return `<span class="${cls}" id="sw-${idx}-${i}">${w}</span> `;
    }).join('');
  }

  const transEl = document.getElementById('simakTranslation');
  if (transEl) transEl.textContent = ayah.translation;

  document.getElementById('sstatAyat').textContent =
    `${idx + 1}/${simakState.totalAyat}`;

  document.getElementById('simakBtnPrev').disabled = idx === 0;
  document.getElementById('simakBtnNext').disabled = idx >= simakState.totalAyat - 1;
}

function simakHighlightWord(ayatIdx, wordIdx, state) {
  const span = document.getElementById(`sw-${ayatIdx}-${wordIdx}`);
  if (!span) return;
  span.className = `sw-word ${state}`;
  if (state === 'current') span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ══════════════════════════════════════════════════════════
   MULAI SESI
══════════════════════════════════════════════════════════ */
async function mulaiSimak() {
  const surahNum  = parseInt(document.getElementById('simakSurahSelect').value);
  const ayatAwal  = parseInt(document.getElementById('simakAyatAwal').value);
  const ayatAkhir = parseInt(document.getElementById('simakAyatAkhir').value);
  const mode      = document.getElementById('simakMode').value;
  const level     = document.getElementById('simakLevel').value;

  if (ayatAwal > ayatAkhir) {
    alert('Ayat awal tidak boleh lebih besar dari ayat akhir.');
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Browser Anda tidak mendukung pengenalan suara.\nGunakan Google Chrome atau Microsoft Edge terbaru.');
    return;
  }

  loadTTSVoices();

  simakSetOrbState('thinking');
  simakSetLabel('Memuat data ayat...', 'Harap tunggu');
  document.getElementById('simakBtnStart').disabled = true;

  try {
    const allData  = await fetchAyahData(surahNum);
    const filtered = allData.filter(a => a.number >= ayatAwal && a.number <= ayatAkhir);

    simakState.ayahDataList   = filtered.map(a => ({
      number     : a.number,
      arabic     : a.arabic,
      translation: a.translation,
      words      : tokenizeArabic(a.arabic),
    }));

    simakState.surahNum       = surahNum;
    simakState.ayatAwal       = ayatAwal;
    simakState.ayatAkhir      = ayatAkhir;
    simakState.mode           = mode;
    simakState.level          = level;
    simakState.currentIdx     = 0;
    simakState.currentWordIdx = 0;
    simakState.totalAyat      = filtered.length;
    simakState.benar          = 0;
    simakState.salah          = 0;
    simakState.errors         = [];
    simakState.startTime      = Date.now();
    simakState.active         = true;
    simakState.modeBantuan    = false;

    document.getElementById('simakSetupCard').classList.add('hidden');
    document.getElementById('simakHistoryCard').classList.add('hidden');
    document.getElementById('simakReportPanel').classList.add('hidden');
    document.getElementById('simakSessionPanel').classList.remove('hidden');
    document.getElementById('simakBtnStart').disabled = false;
    document.getElementById('simakAiDot').classList.add('active');

    // Reset log
    const logBody = document.getElementById('simakLogBody');
    if (logBody) logBody.innerHTML = '<div class="simak-log-empty">Log akan muncul di sini...</div>';

    simakRenderAyat(0);
    simakHighlightWord(0, 0, 'current');
    simakUpdateStats();
    startSimakTimer();

    const modeNames = {
      hafalan:'Simak Hafalan', tajwid:'Simak Tajwid',
      kelancaran:'Simak Kelancaran', lengkap:'Simak Lengkap'
    };
    simakAddLog('info', `🎙️ Sesi dimulai · ${modeNames[mode]||mode} · Level: ${level}`);

    setTimeout(() => startSimakRecognition(), 500);

  } catch(e) {
    simakSetLabel('Gagal memuat', 'Periksa koneksi internet');
    simakSetOrbState('idle');
    document.getElementById('simakBtnStart').disabled = false;
  }
}

/* ══════════════════════════════════════════════════════════
   HENTIKAN & SELESAI
══════════════════════════════════════════════════════════ */
function hentikanSimak() { selesaiSimak(); }

function selesaiSimak() {
  simakState.active      = false;
  simakState.modeBantuan = false;
  clearTimeout(simakState.silenceTimer);
  clearTimeout(simakState.bantuTimer);
  clearInterval(simakState.timerInterval);

  try { simakState.recognition?.stop(); } catch(e) {}
  document.getElementById('simakLiveDot')?.classList.remove('active');
  document.getElementById('simakAiDot')?.classList.remove('active');

  simakSetOrbState('idle');
  simakSetLabel('Sesi Selesai', 'Jazakallahu khayran');

  const txt = aiPick('selesai');
  simakSpeak(txt);

  const totalKata = simakState.ayahDataList.reduce((s, a) => s + a.words.length, 0);
  const benar     = simakState.benar;
  const salah     = simakState.salah;
  const skor      = totalKata > 0
    ? Math.max(0, Math.round((benar / Math.max(benar + salah, 1)) * 100))
    : 100;
  const durasi    = Math.round((Date.now() - simakState.startTime) / 1000);
  const surahName = SURAH_DATA[simakState.surahNum - 1].latin;

  // Simpan riwayat
  const histEntry = {
    date  : new Date().toLocaleDateString('id-ID'),
    time  : new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}),
    surah : surahName,
    ayat  : `${simakState.ayatAwal}–${simakState.ayatAkhir}`,
    skor, benar, salah, durasi,
    mode  : simakState.mode,
  };
  simakState.history.unshift(histEntry);
  if (simakState.history.length > 20) simakState.history = simakState.history.slice(0, 20);
  localStorage.setItem('simak_history', JSON.stringify(simakState.history));

  tampilkanLaporan(skor, benar, salah, durasi, totalKata);
}

/* ══════════════════════════════════════════════════════════
   LAPORAN AKHIR
══════════════════════════════════════════════════════════ */
function tampilkanLaporan(skor, benar, salah, durasi, totalKata) {
  document.getElementById('simakSessionPanel').classList.add('hidden');
  document.getElementById('simakReportPanel').classList.remove('hidden');

  const arc = document.getElementById('simakScoreArc');
  if (arc) {
    const offset = 314 - (skor / 100) * 314;
    arc.style.transition       = 'stroke-dashoffset 1.2s ease';
    arc.style.stroke           = skor >= 90 ? '#16a34a' : skor >= 70 ? '#d97706' : '#dc2626';
    setTimeout(() => { arc.style.strokeDashoffset = offset; }, 100);
  }

  document.getElementById('simakScoreNum').textContent   = skor + '%';
  document.getElementById('simakScoreGrade').textContent =
    skor >= 95 ? '🌟 Mumtaz' : skor >= 85 ? '✨ Jayyid Jiddan' :
    skor >= 75 ? '👍 Jayyid'  : skor >= 60 ? '📗 Maqbul' : '📖 Perlu Latihan';

  const mm = String(Math.floor(durasi / 60)).padStart(2, '0');
  const ss = String(durasi % 60).padStart(2, '0');
  const surahName = SURAH_DATA[simakState.surahNum - 1].latin;

  document.getElementById('simakReportGrid').innerHTML = `
    <div class="simak-report-row"><span class="simak-report-row-lbl">Surah</span><span class="simak-report-row-val" style="font-size:13px">${surahName}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Ayat</span><span class="simak-report-row-val">${simakState.ayatAwal}–${simakState.ayatAkhir}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Total Kata</span><span class="simak-report-row-val">${totalKata}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Kata Benar</span><span class="simak-report-row-val" style="color:#16a34a">${benar}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Kesalahan</span><span class="simak-report-row-val" style="color:#dc2626">${salah}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Durasi</span><span class="simak-report-row-val">${mm}:${ss}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Mode</span><span class="simak-report-row-val" style="font-size:12px">${simakState.mode}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Level</span><span class="simak-report-row-val" style="font-size:12px">${simakState.level}</span></div>
  `;

  const errSec = document.getElementById('simakErrorSection');
  if (simakState.errors.length === 0) {
    errSec.innerHTML = `<div style="text-align:center;padding:16px;color:#16a34a;font-weight:700;font-size:14px">🎉 Tidak ada kesalahan! MasyaAllah!</div>`;
  } else {
    const uniq = [], seen = new Set();
    simakState.errors.forEach(e => {
      const k = `${e.ayah}-${e.wordIdx}`;
      if (!seen.has(k)) { seen.add(k); uniq.push(e); }
    });
    errSec.innerHTML = `
      <div class="simak-error-title"><span class="material-icons">error_outline</span>Catatan Kesalahan (${uniq.length})</div>
      ${uniq.slice(0, 10).map(e => `
        <div class="simak-error-item">
          <div class="simak-error-hd">Ayat ${e.ayah} · Kata ke-${e.wordIdx + 1}</div>
          <div class="simak-error-arab">${e.expected}</div>
          <div class="simak-error-note">Kemiripan: ${Math.round((e.sim||0)*100)}% — perlu dilatih</div>
        </div>`).join('')}
      ${uniq.length > 10 ? `<p style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:6px">+${uniq.length-10} kesalahan lainnya</p>` : ''}`;
  }

  const histEl = document.getElementById('simakHistorySection')?.querySelector('#simakHistoryList');
  if (histEl) renderSimakHistoryIn(histEl, 5);
}

/* ══════════════════════════════════════════════════════════
   NAVIGASI MANUAL & UTILITAS
══════════════════════════════════════════════════════════ */
function simakPindahAyat(dir) {
  if (!simakState.active) return;
  const newIdx = simakState.currentIdx + dir;
  if (newIdx < 0 || newIdx >= simakState.totalAyat) return;
  simakState.currentIdx     = newIdx;
  simakState.currentWordIdx = 0;
  simakRenderAyat(newIdx);
  simakHighlightWord(newIdx, 0, 'current');
  simakAddLog('info', `↪️ Pindah ke Ayat ${simakState.ayahDataList[newIdx].number}`);
  resetSilenceTimer();
}

function simakUpdateStats() {
  document.getElementById('sstatBenar').textContent = simakState.benar;
  document.getElementById('sstatSalah').textContent = simakState.salah;
  document.getElementById('sstatAyat').textContent  =
    `${simakState.currentIdx + 1}/${simakState.totalAyat}`;
}

function simakSetOrbState(state) {
  const orb  = document.getElementById('simakOrb');
  const icon = document.getElementById('simakOrbIcon');
  if (!orb) return;
  orb.className = `simak-orb ${state}`;
  const iconMap = {
    idle:'record_voice_over', listening:'mic',
    correct:'check_circle',   wrong:'cancel', thinking:'psychology',
  };
  if (icon) icon.textContent = iconMap[state] || 'mic';
}

function simakSetLabel(label, sub) {
  const l = document.getElementById('simakOrbLabel');
  const s = document.getElementById('simakOrbSub');
  if (l) l.textContent = label;
  if (s) s.textContent = sub;
}

function simakAddLog(type, html) {
  const body = document.getElementById('simakLogBody');
  if (!body) return;
  const empty = body.querySelector('.simak-log-empty');
  if (empty) empty.remove();
  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const item = document.createElement('div');
  item.className = `simak-log-item ${type}`;
  item.innerHTML = `<span class="simak-log-time">${time}</span><span class="simak-log-txt">${html}</span>`;
  body.appendChild(item);
  body.scrollTop = body.scrollHeight;
  while (body.children.length > 60) body.removeChild(body.firstChild);
}

function startSimakTimer() {
  clearInterval(simakState.timerInterval);
  simakState.timerInterval = setInterval(() => {
    if (!simakState.active) return;
    const elapsed = Math.floor((Date.now() - simakState.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2,'0');
    const ss = String(elapsed % 60).padStart(2,'0');
    document.getElementById('sstatTimer').textContent = `${mm}:${ss}`;
  }, 1000);
}

function resetSimakSession() {
  document.getElementById('simakReportPanel').classList.add('hidden');
  document.getElementById('simakSessionPanel').classList.add('hidden');
  document.getElementById('simakSetupCard').classList.remove('hidden');
  document.getElementById('simakHistoryCard').classList.remove('hidden');
  document.getElementById('simakLogBody').innerHTML =
    '<div class="simak-log-empty">Log koreksi akan muncul di sini saat sesi berjalan.</div>';
  resetTranscriptBox();
  simakSetOrbState('idle');
  simakSetLabel('AI Guru Siap', 'Atur sesi dan tekan Mulai Simak');
  renderSimakHistory();
}

/* ── Riwayat ──────────────────────────────────────────────── */
function renderSimakHistory() {
  renderSimakHistoryIn(document.getElementById('simakHistoryPreview'), 5);
}

function renderSimakHistoryIn(container, limit) {
  if (!container) return;
  const hist = simakState.history.slice(0, limit);
  if (!hist.length) {
    container.innerHTML = '<div class="simak-empty-hist">Belum ada riwayat latihan</div>';
    return;
  }
  container.innerHTML = hist.map(h => {
    const color = h.skor >= 90 ? '#16a34a' : h.skor >= 70 ? '#d97706' : '#dc2626';
    return `<div class="simak-hist-item">
      <span class="simak-hist-score" style="color:${color}">${h.skor}%</span>
      <div class="simak-hist-info">
        <div class="simak-hist-name">${h.surah} · Ayat ${h.ayat}</div>
        <div class="simak-hist-meta">${h.date} ${h.time} · ${h.mode} · ${h.benar}✓ ${h.salah}✗</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   AI GURU TAHFIZH — ENGINE LENGKAP
   Mode 1: CHAT  — ngobrol tentang hafalan Al-Qur'an
   Mode 2: SIMAK — menyimak hafalan real-time
   Terintegrasi dalam satu tampilan
══════════════════════════════════════════════════════════ */

/* ── State AI Guru ────────────────────────────────────────── */
const AG = {
  /* chat */
  chatHistory    : [],   // [{role:'user'|'ai', text, time}]
  voiceListening : false,
  chatRecog      : null,

  /* simak */
  simakActive    : false,
  simakPanelOpen : false,
  surahNum       : 1,
  ayatAwal       : 1,
  ayatAkhir      : 7,
  level          : 'pemula',
  ayahList       : [],   // [{number, arabic, translation, words:[]}]
  curIdx         : 0,
  curWordIdx     : 0,
  totalAyat      : 0,
  benar          : 0,
  salah          : 0,
  errors         : [],
  startTime      : null,
  timerIv        : null,
  simakRecog     : null,
  micActive      : false,
  bantuTimer     : null,
  modeBantuan    : false,
  history        : JSON.parse(localStorage.getItem('ag_history') || '[]'),
};

/* ── Sistem Prompt AI (konteks guru tahfizh) ──────────────── */
/* ── Inisialisasi AI Guru ─────────────────────────────────── */
function initSimak() {
  loadTTSVoices();
  agInitUI();
}

function agInitUI() {
  /* Populate surah select */
  const selEl = document.getElementById('agSurahSel');
  if (selEl) {
    SURAH_DATA.forEach(s => {
      selEl.innerHTML += `<option value="${s.n}">${s.n}. ${s.latin}</option>`;
    });
    selEl.addEventListener('change', () => {
      const s = SURAH_DATA[parseInt(selEl.value) - 1];
      const ak = document.getElementById('agAyatAkhir');
      if (ak) ak.value = Math.min(parseInt(ak.value) || s.ayat, s.ayat);
    });
  }

  /* Tombol mulai/stop simak */
  document.getElementById('agBtnMulai')?.addEventListener('click', agMulaiSimak);
  document.getElementById('agBtnStop') ?.addEventListener('click', agHentikanSimak);
  document.getElementById('agBtnPrev') ?.addEventListener('click', () => agPindahAyat(-1));
  document.getElementById('agBtnNext') ?.addEventListener('click', () => agPindahAyat(1));

  /* Chat input */
  const inp  = document.getElementById('agTextInput');
  const send = document.getElementById('agSendBtn');
  send?.addEventListener('click', () => agKirimPesan());
  inp?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); agKirimPesan(); } });

  /* Voice chat button */
  document.getElementById('agVoiceBtn')?.addEventListener('click', agToggleVoiceChat);

  /* Tampilkan welcome */
  agTampilkanWelcome();
}

/* ══════════════════════════════════════════════════════════
   PANEL SIMAK TOGGLE
══════════════════════════════════════════════════════════ */
function agToggleSimakPanel() {
  const panel = document.getElementById('agSimakPanel');
  const btn   = document.getElementById('agSimakToggleBtn');
  const icon  = document.getElementById('agSimakToggleIcon');
  const lbl   = document.getElementById('agSimakToggleLbl');

  if (!panel) return;
  AG.simakPanelOpen = !AG.simakPanelOpen;
  panel.style.display = AG.simakPanelOpen ? 'block' : 'none';
  btn.classList.toggle('active', AG.simakPanelOpen);
  icon.textContent = AG.simakPanelOpen ? 'close' : 'mic';
  lbl.textContent  = AG.simakPanelOpen ? 'Tutup' : 'Simak';
}

/* ══════════════════════════════════════════════════════════
   CHAT — Ngobrol dengan AI Guru
══════════════════════════════════════════════════════════ */
function agTampilkanWelcome() {
  const chat = document.getElementById('agChat');
  if (!chat) return;
  chat.innerHTML = `
    <div class="ag-welcome">
      <span class="ag-welcome-icon">🕌</span>
      <strong>Assalamu'alaikum! Saya Ustaz AI</strong>
      Guru Tahfizh digital Anda. Saya siap membantu hafalan Al-Qur'an, tajwid, dan semua hal seputar menghafal.
      <div class="ag-chips">
        <div class="ag-chip" onclick="agKirimPesan('Tips menghafal Al-Qur\'an yang efektif')">💡 Tips Hafalan</div>
        <div class="ag-chip" onclick="agKirimPesan('Jelaskan hukum nun mati')">📖 Hukum Tajwid</div>
        <div class="ag-chip" onclick="agKirimPesan('Keutamaan menghafal Al-Qur\'an')">⭐ Keutamaan</div>
        <div class="ag-chip" onclick="agKirimPesan('Bagaimana cara murajaah yang baik?')">🔄 Murajaah</div>
        <div class="ag-chip" onclick="agKirimPesan('Doa sebelum membaca Al-Qur\'an')">🤲 Doa</div>
        <div class="ag-chip" onclick="agToggleSimakPanel()">🎙️ Mulai Simak</div>
      </div>
    </div>`;
}


/* ══════════════════════════════════════════════════════════════
   AI USTADZ AS-SALAM — ENGINE v5.0
   ✅ Claude claude-sonnet-4-6 via proxy (tanpa CORS)
   ✅ System prompt Ustadz yang kuat & kontekstual
   ✅ Memori percakapan (10 pesan terakhir)
   ✅ RAG — cari data lokal dulu, kirim ke AI sebagai konteks
   ✅ Knowledge Base: 114 Surah, Tajwid lengkap, Tafsir, Hadis
   ✅ Fallback offline jika proxy tidak tersedia
   ✅ Format markdown → HTML yang indah
══════════════════════════════════════════════════════════════ */

/* ── Konfigurasi Proxy ────────────────────────────────────────
   Proxy Cloudflare Workers gratis untuk bypass CORS.
   Jika belum deploy, AI fallback ke KB lokal otomatis.
   Cara deploy: lihat PANDUAN_PROXY.txt yang disertakan.
──────────────────────────────────────────────────────────────── */

// Ganti URL di atas setelah deploy proxy. Selama belum, KB lokal aktif.

/* ── System Prompt Ustadz As-Salam ──────────────────────────── */
const AG_SYSTEM = `Kamu adalah "Ustadz AI As-Salam" — asisten ilmu keislaman digital yang berhati-hati, berilmu, dan amanah dalam menyampaikan ajaran Islam berdasarkan Al-Qur'an, As-Sunnah, dan khazanah keilmuan ulama.

PRINSIP UTAMA (tidak boleh dilanggar):
1. SUMBER WAJIB DISEBUT untuk setiap klaim:
   - Ayat Al-Qur'an → sebutkan nama surah + nomor ayat (contoh: QS. Al-Baqarah: 183)
   - Hadits → sebutkan perawi & kitab (contoh: HR. Bukhari no. 5027) serta status keshahihannya bila diketahui (shahih/hasan/dhaif)
   - Tafsir → sebutkan mufassir/kitab rujukan (Ibnu Katsir, At-Thabari, As-Sa'di, Al-Qurthubi, dll)
   - Fiqih → sebutkan mazhab (Hanafi/Maliki/Syafi'i/Hanbali) dan/atau kitab rujukan
2. JANGAN PERNAH mengarang/menebak teks ayat, hadits, atau kutipan ulama. Kalau tidak yakin persis lafalnya, sampaikan intisarinya saja dan arahkan ke rujukan asli, atau katakan tidak yakin.
3. Bedakan tegas:
   - Perkara IJMA' (disepakati ulama) → sampaikan sebagai konsensus
   - Perkara KHILAFIYAH (diperselisihkan mazhab) → sebutkan minimal 2 pendapat utama beserta mazhab/dalil masing-masing, jangan memihak satu pendapat sebagai "yang paling benar" tanpa konteks
4. Untuk fatwa pribadi yang kompleks/sensitif (talak, waris, nikah, hutang besar, hukum pidana, kondisi darurat): jelaskan kaidah umum + sumber, lalu WAJIB sarankan konsultasi langsung ke ustadz/mufti/lembaga fatwa resmi (MUI/majelis ulama setempat) — jangan beri vonis final.
5. Kalau rujukan tidak cukup kuat → jawab jujur "Wallahu a'lam", jangan menebak.
6. Netral antarmazhab & antar-ormas Islam (NU, Muhammadiyah, Persis, dll) — sampaikan perbedaan pendekatan secara adil.
7. Tolak sopan permintaan ke arah: fatwa kekerasan/ekstremisme, merendahkan kelompok/mazhab lain, atau di luar topik keislaman edukatif.
8. Bahasa Indonesia santun & hangat, seperti ustadz yang sabar — tidak kaku, tidak sok tahu.

FORMAT: jawaban singkat untuk pertanyaan sederhana, terstruktur (poin) untuk yang kompleks. Sumber disertakan di baris yang sama/segera setelah klaim. Tutup topik fiqih berat dengan pengingat singkat untuk tabayyun ke ulama setempat.

KONTEKS APLIKASI:
- Pengguna sedang menggunakan Aplikasi Al-Qur'an As-Salam
- Fitur: Baca Al-Qur'an, Audio Murottal, Simak Hafalan, Jadwal Shalat, Kiblat
- Jika ditanya cara menggunakan fitur → jelaskan dengan singkat`;

/* ══════════════════════════════════════════════════════════════
   KNOWLEDGE BASE LENGKAP
══════════════════════════════════════════════════════════════ */

/* ── 114 Surah ───────────────────────────────────────────────── */
const KB_SURAH = {
  1:  {n:'Al-Fatihah',   ar:'الفاتحة',    arti:'Pembukaan',              ayat:7,   juz:1,  type:'Makkiyah',  tema:'Pujian kepada Allah, doa hidayah. Disebut Ummul Qur\'an dan As-Sab\'ul Matsani. Wajib dibaca setiap rakaat shalat.'},
  2:  {n:'Al-Baqarah',   ar:'البقرة',     arti:'Sapi Betina',            ayat:286, juz:1,  type:'Madaniyah', tema:'Surah terpanjang. Berisi hukum Islam, kisah Bani Israel, Ayat Kursi (255), ayat tentang riba, utang-piutang.'},
  3:  {n:"Ali 'Imran",   ar:'آل عمران',   arti:'Keluarga Imran',         ayat:200, juz:3,  type:'Madaniyah', tema:'Keluarga Imran, Nabi Isa dan Maryam, perang Uhud, persatuan umat Islam.'},
  4:  {n:'An-Nisa',      ar:'النساء',     arti:'Wanita',                 ayat:176, juz:4,  type:'Madaniyah', tema:'Hukum wanita, pernikahan, warisan, hak anak yatim, jihad.'},
  5:  {n:"Al-Ma'idah",   ar:'المائدة',    arti:'Hidangan',               ayat:120, juz:6,  type:'Madaniyah', tema:'Hukum makanan halal-haram, Nabi Isa, perjanjian dengan Allah.'},
  6:  {n:"Al-An'am",     ar:'الأنعام',    arti:'Binatang Ternak',        ayat:165, juz:7,  type:'Makkiyah',  tema:'Tauhid, bantahan terhadap musyrik, hukum sembelihan.'},
  7:  {n:"Al-A'raf",     ar:'الأعراف',    arti:'Tempat Tertinggi',       ayat:206, juz:8,  type:'Makkiyah',  tema:'Kisah Adam, Nabi Musa, kaum Shaleh, Luth, Syu\'aib.'},
  8:  {n:'Al-Anfal',     ar:'الأنفال',    arti:'Rampasan Perang',        ayat:75,  juz:9,  type:'Madaniyah', tema:'Perang Badar, harta rampasan, hukum jihad.'},
  9:  {n:'At-Taubah',    ar:'التوبة',     arti:'Pengampunan',            ayat:129, juz:10, type:'Madaniyah', tema:'Satu-satunya surah tanpa Basmilah. Perang Tabuk, orang munafik, tobat.'},
  10: {n:'Yunus',        ar:'يونس',       arti:'Nabi Yunus',             ayat:109, juz:11, type:'Makkiyah',  tema:'Kisah Nabi Yunus, tauhid, Al-Qur\'an sebagai petunjuk.'},
  11: {n:'Hud',          ar:'هود',        arti:'Nabi Hud',               ayat:123, juz:11, type:'Makkiyah',  tema:'Kisah Nabi Hud, Shaleh, Ibrahim, Luth, Syu\'aib, Musa.'},
  12: {n:'Yusuf',        ar:'يوسف',       arti:'Nabi Yusuf',             ayat:111, juz:12, type:'Makkiyah',  tema:'Ahsanul Qasas (kisah terbaik). Kisah lengkap Nabi Yusuf AS.'},
  13: {n:"Ar-Ra'd",      ar:'الرعد',      arti:'Guruh',                  ayat:43,  juz:13, type:'Madaniyah', tema:'Tanda-tanda kekuasaan Allah di alam, tauhid, hujan.'},
  14: {n:'Ibrahim',      ar:'إبراهيم',    arti:'Nabi Ibrahim',           ayat:52,  juz:13, type:'Makkiyah',  tema:'Doa Nabi Ibrahim, syukur, perumpamaan kalimat baik-buruk.'},
  15: {n:'Al-Hijr',      ar:'الحجر',      arti:'Batu',                   ayat:99,  juz:14, type:'Makkiyah',  tema:'Allah menjaga Al-Qur\'an, kisah kaum Luth, penciptaan manusia.'},
  16: {n:'An-Nahl',      ar:'النحل',      arti:'Lebah',                  ayat:128, juz:14, type:'Makkiyah',  tema:'Nikmat Allah: lebah, madu, susu, hujan. Perintah tabligh.'},
  17: {n:"Al-Isra'",     ar:'الإسراء',    arti:'Perjalanan Malam',       ayat:111, juz:15, type:'Makkiyah',  tema:'Isra Mi\'raj Nabi, 10 perintah moral, keistimewaan Al-Qur\'an.'},
  18: {n:'Al-Kahf',      ar:'الكهف',      arti:'Gua',                    ayat:110, juz:15, type:'Makkiyah',  tema:'4 kisah: Ashabul Kahf, Pemilik Kebun, Nabi Musa-Khidir, Dzulqarnain. Pelindung dari Dajjal.'},
  19: {n:'Maryam',       ar:'مريم',       arti:'Maryam',                 ayat:98,  juz:16, type:'Makkiyah',  tema:'Kisah Maryam, kelahiran Isa AS, Yahya, Ibrahim, Ismail, Idris.'},
  20: {n:'Ta Ha',        ar:'طه',         arti:'Ta Ha',                  ayat:135, juz:16, type:'Makkiyah',  tema:'Kisah lengkap Musa-Firaun, perintah shalat, kisah Adam.'},
  21: {n:"Al-Anbiya'",   ar:'الأنبياء',   arti:'Para Nabi',              ayat:112, juz:17, type:'Makkiyah',  tema:'Kisah 18 nabi: Ibrahim, Luth, Nuh, Daud, Sulaiman, Yunus, dll.'},
  22: {n:'Al-Hajj',      ar:'الحج',       arti:'Haji',                   ayat:78,  juz:17, type:'Madaniyah', tema:'Ibadah haji, hari kiamat, jihad fi sabilillah.'},
  23: {n:"Al-Mu'minun",  ar:'المؤمنون',   arti:'Orang Beriman',          ayat:118, juz:18, type:'Makkiyah',  tema:'Sifat orang mukmin yang beruntung, penciptaan manusia dari tanah.'},
  24: {n:'An-Nur',       ar:'النور',      arti:'Cahaya',                 ayat:64,  juz:18, type:'Madaniyah', tema:'Hukum zina, qadzaf, li\'an, adab, Ayat Nur (35), hijab.'},
  25: {n:'Al-Furqan',    ar:'الفرقان',    arti:'Pembeda',                ayat:77,  juz:18, type:'Makkiyah',  tema:'Al-Qur\'an sebagai pembeda, sifat Ibadurrahman (hamba Allah).'},
  26: {n:"Asy-Syu'ara'", ar:'الشعراء',    arti:'Para Penyair',           ayat:227, juz:19, type:'Makkiyah',  tema:'Kisah Musa, Ibrahim, Nuh, Hud, Shaleh, Luth, Syu\'aib, para penyair.'},
  27: {n:'An-Naml',      ar:'النمل',      arti:'Semut',                  ayat:93,  juz:19, type:'Makkiyah',  tema:'Kisah Sulaiman dengan semut, Ratu Balqis, Nabi Shaleh.'},
  28: {n:'Al-Qasas',     ar:'القصص',      arti:'Cerita',                 ayat:88,  juz:20, type:'Makkiyah',  tema:'Kisah Musa paling lengkap, kelahiran hingga misi. Kisah Qarun.'},
  29: {n:'Al-Ankabut',   ar:'العنكبوت',   arti:'Laba-laba',              ayat:69,  juz:20, type:'Makkiyah',  tema:'Ujian keimanan seperti sarang laba-laba. Kisah Ibrahim, Nuh, Luth.'},
  30: {n:'Ar-Rum',       ar:'الروم',      arti:'Bangsa Romawi',          ayat:60,  juz:21, type:'Makkiyah',  tema:'Prediksi kemenangan Romawi atas Persia — terbukti. Tanda kekuasaan Allah.'},
  31: {n:'Luqman',       ar:'لقمان',      arti:'Luqman',                 ayat:34,  juz:21, type:'Makkiyah',  tema:'Nasihat Luqman al-Hakim kepada anaknya: tauhid, shalat, sabar.'},
  32: {n:'As-Sajdah',    ar:'السجدة',     arti:'Sujud',                  ayat:30,  juz:21, type:'Makkiyah',  tema:'Penciptaan manusia, hari kiamat, ayat sajdah.'},
  33: {n:'Al-Ahzab',     ar:'الأحزاب',    arti:'Golongan Bersekutu',     ayat:73,  juz:21, type:'Madaniyah', tema:'Perang Khandaq, pernikahan Nabi, hijab istri Nabi.'},
  34: {n:"Saba'",        ar:'سبأ',        arti:'Kaum Saba',              ayat:54,  juz:22, type:'Makkiyah',  tema:'Kaum Saba yang ingkar nikmat. Daud, Sulaiman, rezeki Allah.'},
  35: {n:'Fatir',        ar:'فاطر',       arti:'Pencipta',               ayat:45,  juz:22, type:'Makkiyah',  tema:'Allah Pencipta langit-bumi, malaikat bersayap, tiga golongan manusia.'},
  36: {n:'Ya Sin',       ar:'يس',         arti:'Ya Sin',                 ayat:83,  juz:22, type:'Makkiyah',  tema:'Qalbul Qur\'an. Tauhid, risalah, hari kiamat, kebangkitan. Dibaca untuk orang sakaratul maut.'},
  37: {n:'As-Saffat',    ar:'الصافات',    arti:'Yang Bershaf',           ayat:182, juz:23, type:'Makkiyah',  tema:'Malaikat bershaf, kisah Ibrahim-Ismail, Yunus, Ilyas, Nuh.'},
  38: {n:'Sad',          ar:'ص',          arti:'Sad',                    ayat:88,  juz:23, type:'Makkiyah',  tema:'Kisah Daud dan hikmahnya, Sulaiman, Ayyub, Adam.'},
  39: {n:'Az-Zumar',     ar:'الزمر',      arti:'Rombongan',              ayat:75,  juz:23, type:'Makkiyah',  tema:'Tauhid, ikhlas beribadah, tobat, rombongan ahli surga-neraka.'},
  40: {n:'Gafir',        ar:'غافر',       arti:'Maha Pengampun',         ayat:85,  juz:24, type:'Makkiyah',  tema:'Kisah orang beriman dari keluarga Firaun. Sifat Allah Gafir.'},
  41: {n:'Fussilat',     ar:'فصلت',       arti:'Dijelaskan',             ayat:54,  juz:24, type:'Makkiyah',  tema:'Al-Qur\'an diturunkan dan dijelaskan, penciptaan alam 6 masa.'},
  42: {n:'Asy-Syura',    ar:'الشورى',     arti:'Musyawarah',             ayat:53,  juz:25, type:'Makkiyah',  tema:'Wahyu dari Allah, musyawarah, keadilan, sifat mukmin sejati.'},
  43: {n:'Az-Zukhruf',   ar:'الزخرف',     arti:'Perhiasan',              ayat:89,  juz:25, type:'Makkiyah',  tema:'Perhiasan dunia, Nabi Isa bukan Tuhan, dialog surga.'},
  44: {n:'Ad-Dukhan',    ar:'الدخان',     arti:'Kabut',                  ayat:59,  juz:25, type:'Makkiyah',  tema:'Kabut sebagai tanda hari kiamat, kisah Firaun.'},
  45: {n:'Al-Jasiyah',   ar:'الجاثية',    arti:'Yang Berlutut',          ayat:37,  juz:25, type:'Makkiyah',  tema:'Hari kiamat semua berlutut, tanda keesaan Allah di alam.'},
  46: {n:'Al-Ahqaf',     ar:'الأحقاف',    arti:'Bukit Pasir',            ayat:35,  juz:26, type:'Makkiyah',  tema:'Kaum Ad di Ahqaf, jin mendengar Al-Qur\'an dan beriman.'},
  47: {n:'Muhammad',     ar:'محمد',       arti:'Muhammad',               ayat:38,  juz:26, type:'Madaniyah', tema:'Jihad, sifat surga (sungai susu, madu, khamr), jangan lemah.'},
  48: {n:'Al-Fath',      ar:'الفتح',      arti:'Kemenangan',             ayat:29,  juz:26, type:'Madaniyah', tema:'Perjanjian Hudaibiyyah, bai\'at Ridhwan, sifat sahabat Nabi.'},
  49: {n:'Al-Hujurat',   ar:'الحجرات',    arti:'Kamar-kamar',            ayat:18,  juz:26, type:'Madaniyah', tema:'Adab Islam: jangan panggil Nabi keras, jangan ghibah, prasangka baik, ukhuwah.'},
  50: {n:'Qaf',          ar:'ق',          arti:'Qaf',                    ayat:45,  juz:26, type:'Makkiyah',  tema:'Hari kiamat, dua malaikat pencatat, sakaratul maut.'},
  51: {n:'Az-Zariyat',   ar:'الذاريات',   arti:'Angin Menerbangkan',     ayat:60,  juz:26, type:'Makkiyah',  tema:'Tanda kekuasaan Allah, kisah tamu Ibrahim, Allah pemberi rezeki.'},
  52: {n:'At-Tur',       ar:'الطور',      arti:'Bukit Tur',              ayat:49,  juz:27, type:'Makkiyah',  tema:'Sumpah Allah dengan Tur Sina, siksa neraka, nikmat surga.'},
  53: {n:'An-Najm',      ar:'النجم',      arti:'Bintang',                ayat:62,  juz:27, type:'Makkiyah',  tema:'Wahyu Al-Qur\'an benar, Isra Mi\'raj, sujud tilawah.'},
  54: {n:'Al-Qamar',     ar:'القمر',      arti:'Bulan',                  ayat:55,  juz:27, type:'Makkiyah',  tema:'Pembelahan bulan, kisah Nuh, Ad, Tsamud, Luth, Firaun.'},
  55: {n:'Ar-Rahman',    ar:'الرحمن',     arti:'Yang Maha Pengasih',     ayat:78,  juz:27, type:'Madaniyah', tema:'Satu-satunya surah yang dimulai dengan nama Allah. فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ diulang 31 kali.'},
  56: {n:"Al-Waqi'ah",   ar:'الواقعة',    arti:'Hari Kiamat',            ayat:96,  juz:27, type:'Makkiyah',  tema:'Tiga golongan: Sabiqun, Ashabul Yamin, Ashabul Syimal. Penciptaan manusia.'},
  57: {n:'Al-Hadid',     ar:'الحديد',     arti:'Besi',                   ayat:29,  juz:27, type:'Madaniyah', tema:'Infak di jalan Allah, besi diturunkan, hidup dunia hanya permainan.'},
  58: {n:'Al-Mujadilah', ar:'المجادلة',   arti:'Wanita yang Menggugat',  ayat:22,  juz:28, type:'Madaniyah', tema:'Hukum zihar, rahasia majelis, larangan bersekutu dengan musuh Allah.'},
  59: {n:'Al-Hasyr',     ar:'الحشر',      arti:'Pengusiran',             ayat:24,  juz:28, type:'Madaniyah', tema:'Pengusiran Bani Nadhir, pembagian ghanimah, Asmaul Husna di akhir.'},
  60: {n:'Al-Mumtahanah',ar:'الممتحنة',   arti:'Wanita yang Diuji',      ayat:13,  juz:28, type:'Madaniyah', tema:'Hubungan dengan non-muslim, hijrah wanita, baiat.'},
  61: {n:'As-Saf',       ar:'الصف',       arti:'Barisan',                ayat:14,  juz:28, type:'Madaniyah', tema:'Jihad dalam barisan yang rapi, Isa menubuatkan Ahmad (Muhammad).'},
  62: {n:"Al-Jumu'ah",   ar:'الجمعة',     arti:"Hari Jum'at",           ayat:11,  juz:28, type:'Madaniyah', tema:'Kewajiban shalat Jumat, tinggalkan jual beli saat azan Jumat.'},
  63: {n:'Al-Munafiqun', ar:'المنافقون',  arti:'Orang Munafik',          ayat:11,  juz:28, type:'Madaniyah', tema:'Sifat munafik: sumpah palsu, penghalang jalan Allah, angkuh.'},
  64: {n:'At-Tagabun',   ar:'التغابن',    arti:'Hari Kerugian',          ayat:18,  juz:28, type:'Madaniyah', tema:'Hari kiamat hari dinampakkan kerugian, istri dan anak bisa jadi fitnah.'},
  65: {n:'At-Talaq',     ar:'الطلاق',     arti:'Talak',                  ayat:12,  juz:28, type:'Madaniyah', tema:'Hukum talak, iddah, nafkah. Disebut Surah An-Nisa Sughra.'},
  66: {n:'At-Tahrim',    ar:'التحريم',    arti:'Mengharamkan',           ayat:12,  juz:28, type:'Madaniyah', tema:'Larangan mengharamkan yang Allah halalkan, kisah istri Nabi.'},
  67: {n:'Al-Mulk',      ar:'الملك',      arti:'Kerajaan',               ayat:30,  juz:29, type:'Makkiyah',  tema:'Al-Waqiyah: pelindung dari azab kubur. Kekuasaan Allah, penciptaan langit bertingkat.'},
  68: {n:'Al-Qalam',     ar:'القلم',      arti:'Pena',                   ayat:52,  juz:29, type:'Makkiyah',  tema:'Membela akhlak Nabi, kisah pemilik kebun yang sombong.'},
  69: {n:'Al-Haqqah',    ar:'الحاقة',     arti:'Hari Kiamat yang Pasti', ayat:52,  juz:29, type:'Makkiyah',  tema:'Kehancuran umat durhaka, hari kiamat, catatan amal.'},
  70: {n:"Al-Ma'arij",   ar:'المعارج',    arti:'Tempat Naik',            ayat:44,  juz:29, type:'Makkiyah',  tema:'Azab yang pasti, sifat manusia yang keluh kesah, kecuali yang shalat.'},
  71: {n:'Nuh',          ar:'نوح',        arti:'Nabi Nuh',               ayat:28,  juz:29, type:'Makkiyah',  tema:'Dakwah Nabi Nuh 950 tahun, doa kebinasaan kaum kafir.'},
  72: {n:'Al-Jinn',      ar:'الجن',       arti:'Jin',                    ayat:28,  juz:29, type:'Makkiyah',  tema:'Sekelompok jin mendengar Al-Qur\'an dan beriman.'},
  73: {n:'Al-Muzzammil', ar:'المزمل',     arti:'Yang Berselimut',        ayat:20,  juz:29, type:'Makkiyah',  tema:'Perintah shalat malam (qiyamul lail), membaca Al-Qur\'an dengan tartil.'},
  74: {n:'Al-Muddassir', ar:'المدثر',     arti:'Yang Berkemul',          ayat:56,  juz:29, type:'Makkiyah',  tema:'Perintah dakwah, ancaman neraka Saqar, 19 malaikat penjaga.'},
  75: {n:'Al-Qiyamah',   ar:'القيامة',    arti:'Hari Kiamat',            ayat:40,  juz:29, type:'Makkiyah',  tema:'Hari kiamat pasti terjadi, manusia menjadi saksi atas dirinya.'},
  76: {n:'Al-Insan',     ar:'الإنسان',    arti:'Manusia',                ayat:31,  juz:29, type:'Madaniyah', tema:'Nikmat surga bagi yang bersabar, makan orang miskin, anak yatim.'},
  77: {n:'Al-Mursalat',  ar:'المرسلات',   arti:'Malaikat yang Diutus',   ayat:50,  juz:29, type:'Makkiyah',  tema:'وَيْلٌ يَوْمَئِذٍ لِلْمُكَذِّبِينَ diulang 10 kali. Hari kiamat.'},
  78: {n:"An-Naba'",     ar:'النبأ',      arti:'Berita Besar',           ayat:40,  juz:30, type:'Makkiyah',  tema:'Hari kiamat: berita besar yang diperselisihkan. Tanda kebesaran Allah.'},
  79: {n:"An-Nazi'at",   ar:'النازعات',   arti:'Malaikat Pencabut',      ayat:46,  juz:30, type:'Makkiyah',  tema:'Malaikat pencabut nyawa, hari kiamat, kisah Musa dan Firaun.'},
  80: {n:"'Abasa",       ar:'عبس',        arti:'Bermuka Masam',          ayat:42,  juz:30, type:'Makkiyah',  tema:'Teguran Allah kepada Nabi karena bermuka masam kepada Abdullah bin Ummi Maktum.'},
  81: {n:'At-Takwir',    ar:'التكوير',    arti:'Penggulungan',           ayat:29,  juz:30, type:'Makkiyah',  tema:'Tanda-tanda kiamat: matahari digulung, bintang berjatuhan.'},
  82: {n:'Al-Infitar',   ar:'الانفطار',   arti:'Terbelah',               ayat:19,  juz:30, type:'Makkiyah',  tema:'Langit terbelah, bintang berguguran, amal manusia dicatat malaikat.'},
  83: {n:'Al-Mutaffifin',ar:'المطففين',   arti:'Orang Curang',           ayat:36,  juz:30, type:'Makkiyah',  tema:'Larangan curang dalam takaran. Catatan amal: Sijjin dan Illiyyin.'},
  84: {n:'Al-Insyiqaq',  ar:'الانشقاق',   arti:'Terbelah',               ayat:25,  juz:30, type:'Makkiyah',  tema:'Langit terbelah, manusia bekerja keras, sujud tilawah.'},
  85: {n:'Al-Buruj',     ar:'البروج',     arti:'Gugusan Bintang',        ayat:22,  juz:30, type:'Makkiyah',  tema:'Ashabul Ukhdud, parit api, kekuasaan Allah yang tak terkalahkan.'},
  86: {n:'At-Tariq',     ar:'الطارق',     arti:'Yang Datang Malam',      ayat:17,  juz:30, type:'Makkiyah',  tema:'Bintang Tsaqib, manusia diciptakan dari air terpancar.'},
  87: {n:"Al-A'la",      ar:'الأعلى',     arti:'Yang Paling Tinggi',     ayat:19,  juz:30, type:'Makkiyah',  tema:'Sucikan nama Tuhanmu Yang Maha Tinggi. Wahyu akan kamu ingat. Shalat lebih baik.'},
  88: {n:'Al-Gasiyah',   ar:'الغاشية',    arti:'Hari Pembalasan',        ayat:26,  juz:30, type:'Makkiyah',  tema:'Wajah tunduk di neraka, wajah berseri di surga. Renungkan unta, langit, bumi.'},
  89: {n:'Al-Fajr',      ar:'الفجر',      arti:'Fajar',                  ayat:30,  juz:30, type:'Makkiyah',  tema:'Sumpah fajar, kebinasaan Ad-Tsamud-Firaun, jiwa yang tenang masuk surga.'},
  90: {n:'Al-Balad',     ar:'البلد',      arti:'Negeri',                 ayat:20,  juz:30, type:'Makkiyah',  tema:'Sumpah kota Mekah. Manusia diciptakan dalam susah payah. Dua jalan.'},
  91: {n:'Asy-Syams',    ar:'الشمس',      arti:'Matahari',               ayat:15,  juz:30, type:'Makkiyah',  tema:'Sumpah matahari-bulan-siang-malam-langit-bumi. Jiwa dan penyuciannya.'},
  92: {n:'Al-Lail',      ar:'الليل',      arti:'Malam',                  ayat:21,  juz:30, type:'Makkiyah',  tema:'Perbedaan manusia: dermawan vs kikir. Allah mudahkan yang memberi.'},
  93: {n:'Ad-Duha',      ar:'الضحى',      arti:'Waktu Dhuha',            ayat:11,  juz:30, type:'Makkiyah',  tema:'Hiburan Allah kepada Nabi saat wahyu terhenti. Jangan hardik anak yatim.'},
  94: {n:'Asy-Syarh',    ar:'الشرح',      arti:'Melapangkan',            ayat:8,   juz:30, type:'Makkiyah',  tema:'Kelapangan dada Nabi. Bersama kesulitan ada kemudahan (2x). Harapkan kepada Tuhan.'},
  95: {n:'At-Tin',       ar:'التين',      arti:'Buah Tin',               ayat:8,   juz:30, type:'Makkiyah',  tema:'Manusia diciptakan sebaik-baik bentuk, lalu dijadikan paling hina kecuali beriman.'},
  96: {n:"Al-'Alaq",     ar:'العلق',      arti:'Segumpal Darah',         ayat:19,  juz:30, type:'Makkiyah',  tema:'Wahyu pertama: Iqra\' (Bacalah). Allah mengajar dengan kalam. Larangan menghalangi shalat.'},
  97: {n:'Al-Qadr',      ar:'القدر',      arti:'Kemuliaan',              ayat:5,   juz:30, type:'Makkiyah',  tema:'Lailatul Qadr lebih baik dari 1000 bulan. Malaikat turun dengan izin Rabb.'},
  98: {n:'Al-Bayyinah',  ar:'البينة',     arti:'Bukti',                  ayat:8,   juz:30, type:'Madaniyah', tema:'Ahli kitab dan musyrik baru terpisah setelah datangnya bukti (Rasul).'},
  99: {n:'Az-Zalzalah',  ar:'الزلزلة',    arti:'Kegoncangan',            ayat:8,   juz:30, type:'Madaniyah', tema:'Bumi bergoncang dahsyat. Amal seberat dzarrah (atom) akan terlihat.'},
  100:{n:"Al-'Adiyat",   ar:'العاديات',   arti:'Kuda Berlari',           ayat:11,  juz:30, type:'Makkiyah',  tema:'Kuda perang yang berlari kencang. Manusia sangat ingkar kepada Tuhannya.'},
  101:{n:"Al-Qari'ah",   ar:'القارعة',    arti:'Hari Kiamat yang Keras', ayat:11,  juz:30, type:'Makkiyah',  tema:'Kiamat yang mengetuk keras. Timbangan amal: berat → surga, ringan → neraka Hawiyah.'},
  102:{n:'At-Takasur',   ar:'التكاثر',    arti:'Bermegah-megahan',       ayat:8,   juz:30, type:'Makkiyah',  tema:'Bermegah dalam harta melalaikan. Kelak akan tahu. Lihat neraka Jahim.'},
  103:{n:"Al-'Asr",      ar:'العصر',      arti:'Masa',                   ayat:3,   juz:30, type:'Makkiyah',  tema:'Demi masa. Manusia merugi, kecuali: beriman, beramal shalih, nasihat-menasihati.'},
  104:{n:'Al-Humazah',   ar:'الهمزة',     arti:'Pengumpat',              ayat:9,   juz:30, type:'Makkiyah',  tema:'Celakalah pengumpat-pencela. Harta dikira bisa mengekalkan. Neraka Hutamah.'},
  105:{n:'Al-Fil',       ar:'الفيل',      arti:'Gajah',                  ayat:5,   juz:30, type:'Makkiyah',  tema:'Kisah Abrahah dengan pasukan gajah ingin hancurkan Ka\'bah. Dihancurkan burung Ababil.'},
  106:{n:'Quraisy',      ar:'قريش',       arti:'Suku Quraisy',           ayat:4,   juz:30, type:'Makkiyah',  tema:'Nikmat Allah kepada Quraisy: perjalanan musim dingin-panas. Sembah Rabb Ka\'bah.'},
  107:{n:"Al-Ma'un",     ar:'الماعون',    arti:'Barang yang Berguna',    ayat:7,   juz:30, type:'Makkiyah',  tema:'Pendustaan agama: menghardik anak yatim, tidak beri makan miskin, shalat lalai.'},
  108:{n:'Al-Kausar',    ar:'الكوثر',     arti:'Nikmat Melimpah',        ayat:3,   juz:30, type:'Makkiyah',  tema:'Surah terpendek. Al-Kausar: sungai di surga. Shalat dan berkurban untuk Allah.'},
  109:{n:'Al-Kafirun',   ar:'الكافرون',   arti:'Orang-orang Kafir',      ayat:6,   juz:30, type:'Makkiyah',  tema:'Pernyataan tegas: lakum dinukum waliyadin. Setara 1/4 Al-Qur\'an.'},
  110:{n:'An-Nasr',      ar:'النصر',      arti:'Pertolongan',            ayat:3,   juz:30, type:'Madaniyah', tema:'Pertolongan Allah dan Fathu Mekah tanda Nabi akan wafat. Bertasbih dan minta ampun.'},
  111:{n:'Al-Masad',     ar:'المسد',      arti:'Sabut',                  ayat:5,   juz:30, type:'Makkiyah',  tema:'Kebinasaan Abu Lahab dan istrinya. Harta tidak berguna di akhirat.'},
  112:{n:'Al-Ikhlas',    ar:'الإخلاص',    arti:'Kemurnian Tauhid',       ayat:4,   juz:30, type:'Makkiyah',  tema:'Surah Tauhid murni. Setara 1/3 Al-Qur\'an. قُلْ هُوَ اللَّهُ أَحَدٌ'},
  113:{n:'Al-Falaq',     ar:'الفلق',      arti:'Waktu Subuh',            ayat:5,   juz:30, type:'Makkiyah',  tema:'Berlindung dari kejahatan makhluk, malam gelap, tukang sihir, pendengki.'},
  114:{n:'An-Nas',       ar:'الناس',      arti:'Manusia',                ayat:6,   juz:30, type:'Makkiyah',  tema:'Berlindung dari was-was setan yang bersembunyi. Muawwidzatain bersama Al-Falaq.'},
};

/* ── Knowledge Base Tajwid Lengkap ──────────────────────────── */
const KB_TAJWID = {
  'nun mati': `📖 **Hukum Nun Mati (نْ) dan Tanwin — 4 Hukum:**

**1. Izhar Halqi** (جelas)
Huruf: ء ه ع ح غ خ — dibaca JELAS, tidak dengung
Contoh: مِنْ أَهْلِ → "min ahli" (nun jelas)

**2. Idgham** (masuk)
• **Bigunnah** (با dengung) — huruf: ي ن م و
  Contoh: مَنْ يَعْمَلْ → "mayyak'mal"
• **Bilagunnah** (tanpa dengung) — huruf: ل ر
  Contoh: مِنْ رَّبِّكَ → "mirabbika"

**3. Iqlab** (tukar)
Huruf: ب → nun berubah menjadi MIM + dengung 2 harakat
Contoh: مِنْ بَعْدِ → dibaca "mim-ba'di"

**4. Ikhfa' Haqiqi** (samar)
15 huruf selebihnya: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
→ Dibaca SAMAR antara izhar dan idgham + dengung 2 harakat
Contoh: مِنْ دُونِ → "min-duuni" (samar)`,

  'mim mati': `📖 **Hukum Mim Mati (مْ) — 3 Hukum:**

**1. Ikhfa' Syafawi**
Mim mati + huruf ب → mim SAMAR + dengung 2 harakat
Contoh: هُمْ بِالْآخِرَةِ

**2. Idgham Mimi (Mutamasilain)**
Mim mati + مim → masuk dengan dengung 2 harakat
Contoh: لَهُمْ مَا يَشَاءُونَ

**3. Izhar Syafawi**
Mim mati + selain ب dan م → mim JELAS tanpa dengung
Contoh: عَلَيْهِمْ غَيْرِ`,

  'mad': `📖 **Hukum Mad (Panjang Bacaan):**

**Mad Thabi'i (Asli)** — 2 harakat
Alif sesudah fathah, wau sesudah dhammah, ya sesudah kasrah

**Mad Wajib Muttasil** — 4-5 harakat
Mad thabi'i + hamzah dalam SATU kata
Contoh: جَاءَ، السَّمَاءِ، جِيءَ

**Mad Jaiz Munfasil** — 2-5 harakat
Mad thabi'i + hamzah di KATA BERIKUTNYA
Contoh: إِنَّا أَعْطَيْنَاكَ، قُوا أَنْفُسَكُمْ

**Mad Lazim** — 6 harakat (wajib)
Mad + sukun/syaddah asli
Contoh: وَلَا الضَّالِّينَ، الْحَاقَّةُ

**Mad Lin** — 2-6 harakat saat waqaf
Wau/ya sukun didahului fathah + waqaf
Contoh: خَوْف، بَيْت`,

  'ghunnah': `📖 **Ghunnah (Dengung/Sengau):**

Ghunnah adalah suara dengung dari HIDUNG yang menyertai huruf **ن** dan **م**.

**Kapan terjadi:**
• Nun/mim bertasydid (نّ مّ) → dengung wajib
• Idgham bigunnah
• Iqlab
• Ikhfa' haqiqi dan ikhfa' syafawi

**Panjang:** 2 harakat (ketukan)

**Cara latih:** Ucapkan "ngg..." tanpa menutup mulut — suara dari hidung itulah ghunnah.

Contoh: إِنَّ (inna), ثُمَّ (tsumma), مِنْ يَوْمٍ`,

  'qalqalah': `📖 **Qalqalah (Memantul/Bergetar):**

Huruf Qalqalah 5: **ق ط ب ج د**
(Hafalkan: قُطُبُ جَدٍّ)

**Qalqalah Sughra** — di tengah kata (sukun asli)
→ Pantulan RINGAN
Contoh: يَجْعَلُونَ، يَقْطَعُونَ، أَبْدَعَ

**Qalqalah Kubra** — di akhir kata/saat waqaf
→ Pantulan KUAT dan jelas
Contoh: 
• قُلْ أَعُوذُ → "qul" (kubra saat waqaf)
• وَالْفَجْرِ ← saat waqaf: "fajr" dengan pantulan kuat`,

  'waqaf': `📖 **Tanda-tanda Waqaf:**

| Tanda | Nama | Hukum |
|-------|------|-------|
| **م** | Waqaf Lazim | WAJIB berhenti |
| **لا** | Waqaf Mamnu' | DILARANG berhenti |
| **ج** | Waqaf Jaiz | Boleh berhenti/lanjut |
| **قلى** | Waqaf Aula | Lebih baik berhenti |
| **صلى** | Washal Aula | Lebih baik lanjut |
| **∴ ∴** | Mu'anaqah | Berhenti di salah satu |
| **ص** | Waqaf Murakhkhas | Boleh waqaf (ayat panjang) |
| **ط** | Waqaf Mutlak | Sempurna berhenti |`,

  'makhraj': `📖 **Makhraj Huruf — 17 Titik Keluarnya Suara:**

**Kelompok Halq (Tenggorokan):**
• ء ه → tenggorokan dalam
• ع ح → tenggorokan tengah
• غ خ → tenggorokan luar

**Kelompok Lisan (Lidah):**
• ق → pangkal lidah-langit belakang
• ك → pangkal lidah-langit depan
• ج ش ي → tengah lidah
• ض → sisi lidah kiri/kanan
• ل → ujung sisi lidah
• ن → ujung lidah (sedikit mundur)
• ر → ujung lidah (bergetar)
• ط د ت → ujung lidah-langit atas
• ص س ز → ujung lidah-gigi bawah
• ظ ذ ث → ujung lidah-gigi atas

**Kelompok Syafatain (Bibir):**
• ف → bibir bawah-gigi atas
• ب م و → dua bibir

**Hidung:**
• Ghunnah (dengung ن م)`,

  'idgham': `📖 **Idgham (Memasukkan Huruf):**

**Idgham Mutamasilain** (dua huruf sama)
Huruf pertama sukun masuk ke huruf kedua
Contoh: اضْرِب بِعَصَاكَ → اضْرِبِّعَصَاكَ

**Idgham Mutajanisain** (berdekatan makhraj)
Pasangan hukum:
• ت + د atau ط → masuk
• ذ + ظ → masuk
• ث + ذ → masuk
• ب + م → masuk

**Idgham Mutaqaribain** (berdekatan sifat)
• ل + ر dan ق + ك`,

  'izhar': `📖 **Izhar (Membaca Jelas):**

**Izhar Halqi**
Nun mati/tanwin + huruf halq (ء ه ع ح غ خ)
→ Nun dibaca JELAS, tidak dengung, tidak samar

Huruf halq = huruf tenggorokan

**Izhar Syafawi**
Mim mati + selain ب dan م
→ Mim dibaca JELAS tanpa dengung

💡 Tips hafal: IZ-HAR = harus HARus JELAS!`,

  'ikhfa': `📖 **Ikhfa' (Membaca Samar):**

**Ikhfa' Haqiqi**
Nun mati/tanwin + 15 huruf:
ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
→ Samar ANTARA izhar dan idgham
→ Disertai dengung 2 harakat

**Ikhfa' Syafawi**  
Mim mati + ب
→ Mim samar + dengung 2 harakat

💡 Cara: posisi mulut membentuk huruf berikutnya, tapi masih ada bunyi samar dari nun/mim`,

  'iqlab': `📖 **Iqlab (Menukar Huruf):**

Nun mati/tanwin + ب
→ Nun BERUBAH menjadi MIM + dengung 2 harakat

**Cara membaca:**
1. Tutup bibir (posisi mim)
2. Dengungkan dari hidung 2 harakat
3. Baru ucapkan "ba"

**Tanda di mushaf:** huruf kecil م di atas nun

Contoh:
• مِنْ بَعْدِ → "mim-ba'di" (dengan dengung)
• سَمِيعٌ بَصِيرٌ → "samii'um-bashiir"`,
};

/* ── Knowledge Base Hadis Pilihan ────────────────────────────── */
const KB_HADIS = [
  {tema:'hafalan', teks:'Sebaik-baik kalian adalah yang belajar Al-Qur\'an dan mengajarkannya.', rawi:'HR. Bukhari no.5027'},
  {tema:'hafalan', teks:'Bacalah Al-Qur\'an, karena ia akan datang pada hari kiamat sebagai pemberi syafa\'at bagi para pembacanya.', rawi:'HR. Muslim no.804'},
  {tema:'hafalan', teks:'Ahli Al-Qur\'an adalah keluarga Allah dan orang-orang istimewa-Nya.', rawi:'HR. An-Nasa\'i, Ibnu Majah'},
  {tema:'keutamaan', teks:'Orang yang mahir membaca Al-Qur\'an akan bersama para malaikat yang mulia. Orang yang membaca Al-Qur\'an dengan terbata-bata dan sulit, ia mendapat dua pahala.', rawi:'HR. Bukhari-Muslim'},
  {tema:'malam', teks:'Barangsiapa membaca dua ayat terakhir surah Al-Baqarah di malam hari, maka keduanya mencukupinya.', rawi:'HR. Bukhari no.5009'},
  {tema:'ikhlas', teks:'Pelajarilah Al-Qur\'an dan amalkan. Janganlah kalian makan darinya (mencari penghidupan darinya semata) dan janganlah kalian memperbanyak harta darinya.', rawi:'HR. Ahmad'},
  {tema:'shalat', teks:'Tidak sempurna shalat seseorang yang tidak membaca Ummul Kitab (Al-Fatihah).', rawi:'HR. Bukhari-Muslim'},
  {tema:'tajwid', teks:'Hiasilah Al-Qur\'an dengan suaramu (bacalah dengan suara yang indah).', rawi:'HR. Abu Dawud, Ibnu Majah'},
];

/* ── Knowledge Base Kisah Nabi ───────────────────────────────── */
const KB_NABI = {
  adam:     'Nabi Adam AS adalah manusia pertama. Allah menciptakannya dari tanah, lalu meniupkan ruh. Diajarkan nama-nama segala sesuatu. Tinggal di surga bersama Hawa, lalu turun ke bumi karena memakan buah terlarang.',
  nuh:      'Nabi Nuh AS berdakwah selama 950 tahun namun hanya sedikit yang beriman. Allah memerintahkan membuat bahtera. Banjir besar melanda. Putranya Kan\'an tenggelam karena menolak naik bahtera.',
  ibrahim:  'Nabi Ibrahim AS disebut Khalilullah (kekasih Allah) dan Abul Anbiya\' (bapak para nabi). Menghancurkan berhala, dibakar namun selamat, membangun Ka\'bah bersama Ismail, diperintah menyembelih Ismail.',
  musa:     'Nabi Musa AS lahir di masa Firaun. Dilarung ke Sungai Nil saat bayi. Dibesarkan di istana Firaun. Menerima wahyu di Bukit Tur. Memimpin Bani Israel keluar dari Mesir. Menerima Taurat.',
  isa:      'Nabi Isa AS lahir dari Maryam tanpa ayah (mukjizat). Bisa berbicara saat bayi. Menghidupkan orang mati, menyembuhkan buta dan kusta dengan izin Allah. Diangkat ke langit, belum wafat.',
  muhammad: 'Nabi Muhammad SAW lahir 12 Rabi\'ul Awwal 571 M di Mekah. Wahyu pertama di Gua Hira usia 40 tahun. Hijrah ke Madinah 622 M. Fathu Mekah 630 M. Wafat 632 M. Penutup para nabi.',
  yusuf:    'Nabi Yusuf AS putra Ya\'qub. Dibuang saudara-saudaranya ke sumur. Dijual sebagai budak di Mesir. Dipenjara karena fitnah. Dibebaskan setelah mampu menafsirkan mimpi Raja. Menjadi menteri. Bertemu kembali dengan keluarganya.',
  yunus:    'Nabi Yunus AS (Dzulnun). Meninggalkan kaumnya sebelum diizinkan Allah. Ditelan ikan besar. Berdoa: لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ. Dikeluarkan dari perut ikan. Kaumnya beriman.',
};

/* ── Knowledge Base Tips Hafalan ─────────────────────────────── */
const KB_TIPS = {
  umum: `💡 **10 Tips Menghafal Al-Qur\'an yang Efektif:**

**1. Niatkan karena Allah** — Luruskan niat, minta kepada Allah dimudahkan

**2. Pilih waktu terbaik**
• Subuh setelah shalat (otak paling segar)
• Setelah Ashar atau Isya
• Sepertiga malam terakhir

**3. Metode Talaqqi** — Dengarkan murottal, tirukan, baru hafal

**4. Teknik 3-3-3**
• Baca 1 ayat 3× melihat mushaf
• Baca 3× tanpa melihat
• Sambung dengan ayat sebelumnya 3×

**5. Satu mushaf khusus** — Otak mengingat posisi visual ayat

**6. Target realistis** — 3-5 ayat/hari lebih baik dari banyak tapi lupa

**7. Murajaah WAJIB** — Ulang minimal 1 halaman per hari

**8. Shalat dengan hafalan baru** — Baca saat shalat sunnah untuk menguatkan

**9. Kurangi maksiat** — Imam Syafi'i: "Aku mengadu kepada Waki\' tentang buruknya hafalanku..."

**10. Doa setiap hari** — رَبِّ زِدْنِي عِلْمًا (Rabbi zidni ilma)`,

  murajaah: `🔄 **Strategi Murajaah (Mengulang Hafalan):**

**Sistem Sabaq-Sabqi-Manzil:**
• **Sabaq** = hafalan baru hari ini (misal 5 ayat)
• **Sabqi** = hafalan 7 hari terakhir (ulang setiap hari)
• **Manzil** = seluruh hafalan (bagi 7 bagian, 1 bagian/hari)

**Jadwal Ideal:**
• Subuh: Hafalan baru (sabaq)
• Ashar: Murajaah sabqi
• Dalam shalat: Baca hafalan lama
• Malam: Dengarkan murottal sambil tidur

**Tips Anti-Lupa:**
• Ajarkan kepada orang lain (mengajar = menguatkan)
• Simak hafalan dengan teman/guru rutin
• Rekam suara sendiri dan dengarkan`,

  lupa: `😊 **Mengatasi Lupa Hafalan:**

Lupa adalah **ujian yang wajar**. Rasulullah SAW bersabda:
*"Jaga Al-Qur\'an ini, demi jiwa Muhammad yang ada di tangan-Nya, sungguh Al-Qur\'an lebih cepat lepas dari hati dibanding unta dari ikatannya."* (HR. Bukhari-Muslim)

**Penyebab Lupa:**
• Jarang murajaah (penyebab utama)
• Banyak maksiat
• Kurang tidur / terlalu lelah
• Tidak konsisten

**Solusi Praktis:**
1. Kembali ke mushaf, baca ulang 10× tanpa hafal
2. Perbanyak shalat malam
3. Minta disimak guru atau teman
4. Turunkan target sementara
5. Baca Al-Qur\'an meski tidak hafal — jangan berhenti total`,

  mutasyabih: `📖 **Mengatasi Ayat Mutasyabihat (Ayat Mirip):**

Contoh terkenal:
• فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ → diulang **31×** di Ar-Rahman
• وَيْلٌ يَوْمَئِذٍ لِلْمُكَذِّبِينَ → diulang **10×** di Al-Mursalat

**Strategi:**
1. **Tandai** ayat-ayat mirip di mushaf (stabilo berbeda warna)
2. **Hafal konteks** — sebelum dan sesudah ayat
3. **Buat flashcard** — tulis perbedaan kecilnya
4. **Simak khusus** — minta guru tes di bagian ini saja
5. **Buat cerita** untuk mengingat urutan (memory palace)`,
};

/* ── Knowledge Base Fikih Dasar ──────────────────────────────── */
const KB_FIKIH = {
  shalat: `📿 **Shalat 5 Waktu:**
• Subuh: 2 rakaat (Fajar – Syuruq)
• Dzuhur: 4 rakaat (Zawal – Ashar)
• Ashar: 4 rakaat (Ashar – Maghrib)
• Maghrib: 3 rakaat (Terbenam – Isya)
• Isya: 4 rakaat (Gelap – Fajar)

*Syarat shalat:* Islam, baligh, berakal, suci dari hadats, menutup aurat, menghadap kiblat, masuk waktu.`,
  wudhu: `💧 **Rukun Wudhu (Fardhunya):**
1. Niat
2. Membasuh muka
3. Membasuh kedua tangan hingga siku
4. Mengusap sebagian kepala
5. Membasuh kedua kaki hingga mata kaki
6. Tertib (berurutan)`,
  puasa: `🌙 **Puasa Ramadhan:**
Wajib bagi Muslim yang: baligh, berakal, sehat, mukim, mampu.
Rukun: niat, menahan dari hal yang membatalkan (makan, minum, hubungan suami-istri) dari fajar hingga maghrib.`,
};

/* ── Knowledge Base Doa ──────────────────────────────────────── */
const KB_DOA = {
  sebelumBaca: `🤲 **Doa Sebelum Membaca Al-Qur\'an:**
أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
*A\'uudzubillahi minasy-syaithaanir rajiim*
"Aku berlindung kepada Allah dari setan yang terkutuk"

Lalu membaca Basmalah: بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ`,
  sesudahBaca: `🤲 **Doa Sesudah Membaca Al-Qur\'an:**
صَدَقَ اللَّهُ الْعَظِيمُ
*Shadaqallahul adzim*
"Maha Benar Allah Yang Maha Agung"`,
  hafalanBaru: `🤲 **Doa Meminta Kemudahan Hafalan:**
رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا
*Rabbi zidni ilman warzuqni fahman*
"Ya Allah, tambahkanlah ilmuku dan anugerahkan aku pemahaman"

اللَّهُمَّ افْتَحْ عَلَيَّ حِكْمَتَكَ
*Allahumma iftah alayya hikmataka*
"Ya Allah, bukakanlah hikmah-Mu kepadaku"`,
};

/* ══════════════════════════════════════════════════════════════
   RAG ENGINE — Cari konteks lokal sebelum kirim ke AI
══════════════════════════════════════════════════════════════ */
function agRAGCariKonteks(pertanyaan) {
  const q     = pertanyaan.toLowerCase();
  const parts = [];

  /* Cari surah relevan */
  const surahData = agCariSurah(q);
  if (surahData) {
    parts.push(`DATA SURAH:\nNomor: ${surahData.n} | Nama: ${surahData.n} (${surahData.ar}) | Arti: ${surahData.arti} | Ayat: ${surahData.ayat} | Juz: ${surahData.juz} | Golongan: ${surahData.type} | Tema: ${surahData.tema}`);
  }

  /* Cari tajwid relevan */
  const tajwidKey = agCariTajwid(q);
  if (tajwidKey) {
    parts.push(`DATA TAJWID:\n${KB_TAJWID[tajwidKey].replace(/\*\*/g,'').replace(/\*/g,'')}`);
  }

  /* Cari hadis relevan */
  const kata = q.split(' ');
  const hadisRelevan = KB_HADIS.filter(h =>
    kata.some(k => h.tema.includes(k) || h.teks.toLowerCase().includes(k))
  ).slice(0, 2);
  if (hadisRelevan.length) {
    parts.push(`HADIS RELEVAN:\n${hadisRelevan.map(h => `"${h.teks}" — ${h.rawi}`).join('\n')}`);
  }

  /* Cari kisah nabi */
  for (const [nama, kisah] of Object.entries(KB_NABI)) {
    if (q.includes(nama) || q.includes('nabi ' + nama)) {
      parts.push(`KISAH NABI:\n${kisah}`);
      break;
    }
  }

  /* Tips hafalan */
  if (/tips|cara|metode|teknik|menghafal/.test(q))
    parts.push(`TIPS HAFALAN:\n${KB_TIPS.umum.replace(/\*\*/g,'').replace(/\*/g,'')}`);
  if (/murajaah|muraja|mengulang/.test(q))
    parts.push(`TIPS MURAJAAH:\n${KB_TIPS.murajaah.replace(/\*\*/g,'').replace(/\*/g,'')}`);
  if (/lupa|hilang hafalan/.test(q))
    parts.push(`MENGATASI LUPA:\n${KB_TIPS.lupa.replace(/\*\*/g,'').replace(/\*/g,'')}`);

  /* Fikih */
  if (/shalat|solat/.test(q)) parts.push(`FIKIH SHALAT:\n${KB_FIKIH.shalat}`);
  if (/wudhu|wudu/.test(q))   parts.push(`FIKIH WUDHU:\n${KB_FIKIH.wudhu}`);
  if (/puasa|ramadhan/.test(q)) parts.push(`FIKIH PUASA:\n${KB_FIKIH.puasa}`);

  /* Doa */
  if (/doa.*baca|sebelum.*baca/.test(q)) parts.push(`DOA:\n${KB_DOA.sebelumBaca}`);
  if (/doa.*hafal|hafalan.*doa/.test(q)) parts.push(`DOA HAFALAN:\n${KB_DOA.hafalanBaru}`);

  return parts.join('\n\n');
}

/* ══════════════════════════════════════════════════════════════
   FORMAT TEKS — Markdown ringan ke HTML
══════════════════════════════════════════════════════════════ */
function agFormatTeks(teks) {
  return teks
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g, '<strong>$1</strong>')
    .replace(/^#{1,3}\s(.+)$/gm, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\|(.+)\|/g, (m) => {
      // Simple table support
      const cells = m.split('|').filter(c => c.trim());
      return '<span style="font-family:monospace;font-size:11px">' + cells.map(c => c.trim()).join(' | ') + '</span>';
    });
}

/* ══════════════════════════════════════════════════════════════
   KIRIM PESAN — Dengan memori percakapan
══════════════════════════════════════════════════════════════ */
async function agKirimPesan(teksOverride) {
  const inp  = document.getElementById('agTextInput');
  const teks = (teksOverride || inp?.value || '').trim();
  if (!teks) return;
  if (inp) inp.value = '';

  agTambahBubble('user', teks);
  AG.chatHistory.push({ role: 'user', text: teks });

  /* Hapus welcome */
  document.querySelector('.ag-welcome')?.remove();

  const typingId = agTampilkanTyping();

  try {
    const balasan = await agTanyaAI(teks);
    agHapusTyping(typingId);
    agTambahBubble('ai', balasan);
    AG.chatHistory.push({ role: 'ai', text: balasan });

    /* TTS — hanya kalimat pertama agar tidak terlalu panjang */
    const kalimat1 = balasan.replace(/\*+/g,'').replace(/<[^>]+>/g,'').split(/[.!?\n]/)[0].trim();
    if (kalimat1.length > 3 && kalimat1.length < 150) agUcapkan(kalimat1);

  } catch(e) {
    agHapusTyping(typingId);
    agTambahBubble('ai', 'Maaf, terjadi gangguan. Silakan coba lagi. 😊');
  }
}

/* ══════════════════════════════════════════════════════════════
   AI ENGINE UTAMA — Claude API via Proxy + Fallback Lokal
══════════════════════════════════════════════════════════════ */
async function agTanyaAI(pertanyaan) {
  /* Cek apakah ada perintah putar audio — handle langsung */
  if (/^(putar|play|dengarkan|murottal|bunyikan)\s/i.test(pertanyaan.trim())) {
    return agHandlePutar(pertanyaan);
  }

  /* ── RAG: kumpulkan konteks lokal ── */
  const konteks = agRAGCariKonteks(pertanyaan);

  /* ── Bangun histori percakapan (memori 10 pesan terakhir) ── */
  const histori = AG.chatHistory.slice(-10).map(m => ({
    role   : m.role === 'user' ? 'user' : 'assistant',
    content: m.text.replace(/<[^>]+>/g,''), // strip HTML
  }));

  /* ── Tambah pesan saat ini dengan konteks RAG ── */
  const pesanDenganKonteks = konteks
    ? `[KONTEKS DATA]:\n${konteks}\n\n[PERTANYAAN PENGGUNA]:\n${pertanyaan}`
    : pertanyaan;

  histori.push({ role: 'user', content: pesanDenganKonteks });

  /* ── Coba panggil proxy Gemini, fallback ke Knowledge Base lokal jika gagal ── */
  try {
    const teks = await kirimKeGemini(AG_SYSTEM, histori);
    return teks;
  } catch (e) {
    console.error('[AI]', e);
    return agJawabLokal(pertanyaan, konteks);
  }
}

/* ── Jawab dari KB lokal (offline mode) ──────────────────────── */
function agJawabLokal(pertanyaan, konteksRAG) {
  const q    = pertanyaan.toLowerCase().trim();
  const qOri = pertanyaan.trim();

  /* ── 1. Surah ── */
  const surahData = agCariSurah(q);
  if (surahData) return agFormatSurah(surahData, qOri);

  /* ── 2. Tajwid ── */
  const tajwidKey = agCariTajwid(q);
  if (tajwidKey) return KB_TAJWID[tajwidKey];

  /* ── 3. Tips hafalan ── */
  if (/tips|cara\s+hafal|metode\s+hafal|teknik\s+hafal|cepat\s+hafal/.test(q)) return KB_TIPS.umum;
  if (/murajaah|muraja'ah|mengulang\s+hafalan/.test(q)) return KB_TIPS.murajaah;
  if (/lupa\s+hafalan|hafalan\s+hilang/.test(q)) return KB_TIPS.lupa;
  if (/mutasyabih|ayat\s+mirip/.test(q)) return KB_TIPS.mutasyabih;

  /* ── 4. Keutamaan ── */
  if (/keutamaan|fadhilah|pahala|manfaat/.test(q)) {
    if (/fatihah/.test(q)) return `⭐ **Keutamaan Al-Fatihah:**\n\nDisebut "Ummul Qur'an" (induk Al-Qur'an) dan "As-Sab'ul Matsani" (7 ayat yang diulang).\n\n• Wajib dibaca di setiap rakaat shalat — "Tidak sah shalat tanpa Al-Fatihah" (HR. Bukhari-Muslim)\n• Obat untuk berbagai penyakit (HR. Bukhari)\n• Mengandung intisari seluruh Al-Qur'an`;
    if (/kahf/.test(q)) return `⭐ **Keutamaan Al-Kahf:**\n\n• Baca setiap Jumat → bersinar cahaya antara dua Jumat (HR. Hakim)\n• 10 ayat pertama/terakhir → pelindung dari fitnah Dajjal\n• Mengandung 4 kisah sarat hikmah: Iman, Harta, Ilmu, Kekuasaan`;
    if (/yasin|ya.?sin/.test(q)) return `⭐ **Keutamaan Ya Sin:**\n\n• Disebut "Qalbul Qur'an" — jantung Al-Qur'an\n• Dibacakan kepada orang yang sakaratul maut\n• Berisi inti akidah: tauhid, risalah, hari kiamat`;
    if (/mulk/.test(q)) return `⭐ **Keutamaan Al-Mulk:**\n\n• "Al-Mani'ah" — penghalang dari azab kubur\n• Nabi tidak tidur sebelum membaca Al-Mulk dan As-Sajdah\n• Syafa'at bagi yang rutin membacanya`;
    if (/ikhlas/.test(q)) return `⭐ **Keutamaan Al-Ikhlas:**\n\n• Setara membaca **1/3 Al-Qur'an** (HR. Bukhari-Muslim)\n• Membaca 3× = seperti mengkhatamkan Al-Qur'an\n• Berisi tauhid murni yang paling sempurna`;
    if (/quran|qur.?an/.test(q)) return `⭐ **Keutamaan Menghafal Al-Qur'an:**\n\n• "Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya" — HR. Bukhari\n• Penghafal memberi mahkota kepada orang tuanya di hari kiamat\n• Kedudukan di surga sesuai banyaknya hafalan\n• Termasuk ahlullah (keluarga Allah) di bumi\n• Mendapat syafa'at Al-Qur'an`;
  }

  /* ── 5. Kisah Nabi ── */
  for (const [nama, kisah] of Object.entries(KB_NABI)) {
    if (q.includes(nama) || q.includes('nabi ' + nama) || q.includes('rasul ' + nama)) {
      return `📖 **Kisah Nabi ${nama.charAt(0).toUpperCase() + nama.slice(1)} AS:**\n\n${kisah}`;
    }
  }

  /* ── 6. Doa ── */
  if (/doa.*sebelum.*baca|sebelum.*baca.*quran|adab.*baca/.test(q)) return KB_DOA.sebelumBaca;
  if (/doa.*sesudah|sesudah.*baca/.test(q)) return KB_DOA.sesudahBaca;
  if (/doa.*hafal|hafal.*doa|doa.*mudahkan/.test(q)) return KB_DOA.hafalanBaru;
  if (/doa/.test(q)) return `🤲 **Doa-doa dalam Al-Qur'an:**\n\n• **رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً** — Ya Rabb kami, berilah kami kebaikan di dunia dan akhirat (Al-Baqarah: 201)\n• **رَبِّ زِدْنِي عِلْمًا** — Ya Rabbku, tambahkanlah ilmuku (Ta Ha: 114)\n• **رَبَّنَا لَا تُؤَاخِذْنَا** — Ya Rabb, janganlah Engkau hukum kami (Al-Baqarah: 286)\n• **رَبِّ اشْرَحْ لِي صَدْرِي** — Ya Rabbku, lapangkanlah dadaku (Ta Ha: 25)`;

  /* ── 7. Fikih ── */
  if (/shalat|sholat/.test(q) && !/surah|suarat/.test(q)) return KB_FIKIH.shalat;
  if (/wudhu|wudu/.test(q))   return KB_FIKIH.wudhu;
  if (/puasa/.test(q))         return KB_FIKIH.puasa;

  /* ── 8. Juz ── */
  const juzM = q.match(/juz\s*(\d+)|juz\s*ke[- ]?(\d+)/);
  if (juzM) return agInfoJuz(parseInt(juzM[1] || juzM[2]));

  /* ── 9. Perintah putar ── */
  if (/putar|play|dengarkan|murottal/.test(q)) return agHandlePutar(qOri);

  /* ── 10. Salam & perkenalan ── */
  if (/assalamu|salam|hai\b|halo|hello/.test(q))
    return `Wa'alaikumussalam warahmatullahi wabarakatuh! 😊\n\nAlhamdulillah, senang bisa hadir untuk membantu. Saya **Ustadz AI As-Salam**, siap membantu perjalanan hafalan dan pembelajaran Al-Qur'an Anda.\n\nSilakan tanya tentang:\n• Surah, ayat, atau juz\n• Hukum tajwid\n• Tips dan teknik menghafal\n• Kisah para Nabi\n• Keutamaan surah\n• Atau mulai **sesi simak hafalan** dengan menekan tombol Simak di atas 🎙️`;

  if (/siapa.*kamu|kamu.*siapa|perkenalan/.test(q))
    return `Saya **Ustadz AI As-Salam** — asisten digital pembelajaran Al-Qur'an yang terintegrasi dalam aplikasi Al Qur'an As-Salam.\n\nSaya dirancang untuk membantu:\n• 📖 Informasi lengkap 114 surah\n• 🔤 Hukum tajwid dan makhraj\n• 💡 Teknik menghafal efektif\n• 🔄 Strategi murajaah\n• 📚 Kisah para Nabi\n• 🎙️ Menyimak hafalan secara langsung\n• 🎵 Memutar murottal surah pilihan\n\nInsya Allah saya akan berusaha membantu sebaik-baiknya! 🤲`;

  /* ── 11. Berapa surah/ayat/juz ── */
  if (/berapa.*surah|jumlah.*surah/.test(q)) return `Al-Qur'an memiliki **114 surah**, **6.236 ayat**, dan **30 juz**. Surah terpanjang adalah Al-Baqarah (286 ayat), terpendek Al-Kausar, An-Nasr, Al-Asr (3 ayat).`;
  if (/wahyu.*pertama|pertama.*turun/.test(q)) return `Wahyu pertama adalah **Al-'Alaq ayat 1-5** (اقْرَأْ بِسْمِ رَبِّكَ الَّذِي خَلَقَ). Turun di **Gua Hira**, 17 Ramadhan, 13 tahun sebelum hijrah, saat Nabi berusia 40 tahun.`;
  if (/wahyu.*terakhir|terakhir.*turun/.test(q)) return `Wahyu terakhir yang paling masyhur adalah **Al-Maidah ayat 3** — "Pada hari ini telah Kusempurnakan agamamu..." Turun saat **Haji Wada'** (haji perpisahan), sekitar 81-82 hari sebelum Nabi wafat.`;

  /* ── 12. Motivasi ── */
  if (/semangat|motivasi|capek|menyerah|susah|berat|bisa\s*gak/.test(q))
    return `MasyaAllah, semangat Anda menghafal Al-Qur'an adalah tanda cinta Allah kepada Anda! 💚\n\n*"Sesungguhnya Allah tidak menyia-nyiakan pahala orang yang berbuat baik."* (QS. At-Taubah: 120)\n\n**Ingatlah:**\n• Setiap huruf yang Anda baca = 10 kebaikan\n• Orang yang terbata-bata dalam membaca = 2 pahala (HR. Bukhari-Muslim)\n• Kesulitan dalam menghafal = derajat yang lebih tinggi di surga\n\n💪 Mulai dari yang kecil, konsisten, dan minta tolong Allah setiap hari. Insya Allah bisa!`;

  /* ── 13. Topik di luar Islam ── */
  const topikLuar = /cuaca|berita|politik|olahraga|masak|resep|film|musik|game|teknologi|komputer|saham|bisnis/;
  if (topikLuar.test(q))
    return `Maaf, saya hanya bisa membantu hal seputar **Al-Qur'an dan hafalan**. 😊\n\nSebagai Guru Tahfizh digital, pengetahuan saya terbatas pada bidang Al-Qur'an, tajwid, dan ilmu-ilmu Islam.\n\nSilakan tanya tentang:\n• Surah atau ayat Al-Qur'an\n• Hukum tajwid\n• Tips menghafal\n• Keutamaan surah\n• Kisah Nabi\n• Atau mulai sesi simak hafalan 🎙️`;

  /* ── Default dengan konteks ── */
  if (konteksRAG) {
    return `Berdasarkan data yang saya miliki:\n\n${konteksRAG.split('\n').slice(0,8).join('\n')}\n\nUntuk penjelasan lebih mendalam tentang *"${pertanyaan}"*, disarankan untuk merujuk kepada guru atau ustadz langsung. **Wallahu a'lam bishawab.** 🤲`;
  }

  return `Pertanyaan yang baik, Alhamdulillah! 😊\n\nUntuk pertanyaan *"${pertanyaan}"*, saya belum memiliki data spesifiknya. **Wallahu a'lam bishawab.**\n\nSaran saya:\n• Tanyakan kepada guru/ustadz langsung\n• Rujuk kitab tafsir terpercaya (Ibnu Katsir, Al-Jalalain)\n• Kunjungi situs islami terpercaya\n\nYang pasti saya bisa bantu: info 114 surah, tajwid, tips hafalan, kisah Nabi, dan simak hafalan. 🤲`;
}

/* ── Helper: Cari Surah ───────────────────────────────────────── */
function agCariSurah(q) {
  const cleaned = q.replace(/surah|surat|apa|arti|berapa|ayat|juz|nomor|tentang|bagaimana|jelaskan|sebutkan/g,'').trim();

  /* Cari berdasarkan nomor */
  const numM = q.match(/(?:surah|surat|nomor|no\.?|ke-?)\s*(\d+)|^(\d+)\s*$|(?:ke|nomor)\s*(\d+)/);
  if (numM) {
    const n = parseInt(numM[1] || numM[2] || numM[3]);
    if (n >= 1 && n <= 114) return { ...KB_SURAH[n], nomor: n };
  }

  /* Cari berdasarkan nama */
  const norm = s => s.toLowerCase().replace(/['\-\s]/g,'').replace(/^(al|an|as|at|az|asy)/,'');
  const qNorm = norm(cleaned);

  for (const [id, s] of Object.entries(KB_SURAH)) {
    const nNorm = norm(s.n);
    if (nNorm === qNorm || nNorm.includes(qNorm) || qNorm.includes(nNorm)) {
      return { ...s, nomor: parseInt(id) };
    }
  }

  /* Cari berdasarkan arti */
  if (/arti|artinya|meaning/.test(q)) {
    const qArti = q.replace(/arti|artinya|meaning|surah|surat/g,'').trim();
    for (const [id, s] of Object.entries(KB_SURAH)) {
      if (s.arti.toLowerCase().includes(qArti) || qArti.includes(s.arti.toLowerCase())) {
        return { ...s, nomor: parseInt(id) };
      }
    }
  }

  return null;
}

function agFormatSurah(s, qOri) {
  const q = qOri.toLowerCase();
  if (/berapa.*ayat|ayat.*berapa|jumlah.*ayat/.test(q))
    return `📖 Surah **${s.n}** (${s.ar}) memiliki **${s.ayat} ayat**, termasuk golongan **${s.type}**, berada di **Juz ${s.juz}**.`;
  if (/arti|artinya/.test(q))
    return `📖 Surah **${s.n}** (${s.ar}) artinya **"${s.arti}"**.`;
  if (/juz/.test(q))
    return `📖 Surah **${s.n}** berada di **Juz ${s.juz}**.`;
  if (/makkiyah|madaniyah|turun/.test(q))
    return `📖 Surah **${s.n}** termasuk **${s.type}** — diturunkan di ${s.type === 'Makkiyah' ? 'Mekah sebelum hijrah' : 'Madinah setelah hijrah'}.`;

  return `📖 **Surah ${s.n} — ${s.ar}**\n\n` +
    `• Nomor: **${s.nomor}** dari 114 surah\n` +
    `• Arti: **${s.arti}**\n` +
    `• Jumlah Ayat: **${s.ayat} ayat**\n` +
    `• Juz: **Juz ${s.juz}**\n` +
    `• Golongan: **${s.type}**\n` +
    `• Tema: ${s.tema}\n\n` +
    `_Ketik "putar ${s.n}" untuk memutar murottal surah ini_ 🎵`;
}

/* ── Helper: Cari Tajwid ─────────────────────────────────────── */
function agCariTajwid(q) {
  if (/nun.*(mati|sukun)|tanwin/.test(q))   return 'nun mati';
  if (/mim.*(mati|sukun)/.test(q))          return 'mim mati';
  if (/\bmad\b|panjang.*baca|bacaan.*panjang/.test(q)) return 'mad';
  if (/ghunnah|dengung/.test(q))            return 'ghunnah';
  if (/qalqalah|memantul/.test(q))          return 'qalqalah';
  if (/waqaf|berhenti|tanda.*baca/.test(q)) return 'waqaf';
  if (/\bidgham\b/.test(q))                 return 'idgham';
  if (/\bizhar\b/.test(q))                  return 'izhar';
  if (/ikhfa'?/.test(q))                    return 'ikhfa';
  if (/makhraj|tempat.*keluar/.test(q))     return 'makhraj';
  if (/iqlab/.test(q))                      return 'iqlab';
  return null;
}

/* ── Helper: Info Juz ────────────────────────────────────────── */
function agInfoJuz(juzN) {
  if (juzN < 1 || juzN > 30) return `Al-Qur'an terdiri dari **30 juz** (Juz 1-30). Juz 30 disebut **Juz 'Amma** yang berisi surah-surah pendek (An-Naba s.d. An-Nas).`;
  const surahDiJuz = Object.entries(KB_SURAH).filter(([,s]) => s.juz === juzN).map(([,s]) => s.n);
  return `📚 **Juz ${juzN}:**\n\nSurah dalam Juz ${juzN}: ${surahDiJuz.join(', ')}\n\nTips hafalan Juz ${juzN}: Mulai dari surah yang paling dikenal, hafalkan dengan tartil, dan murajaah setiap hari! 💪`;
}

/* ── Helper: Putar Audio ─────────────────────────────────────── */
function agHandlePutar(q) {
  const qL = q.toLowerCase();

  /* Cari nomor langsung */
  const numM = qL.match(/(\d+)/);
  if (numM) {
    const n = parseInt(numM[1]);
    if (n >= 1 && n <= 114) {
      const s = KB_SURAH[n];
      setTimeout(() => {
        currentSurahNum = n;
        fetchAyahData(n).then(data => {
          currentAyahData = data; currentAyahIndex = 0;
          playAyah(0); showPlayer();
        });
      }, 500);
      return `🎵 Memutar murottal **Surah ${s.n} (${s.ar})** — ${s.arti}.\n\nSemoga bacaan murottal ini menambah kekhusyukan dan membantu hafalan Anda. 🤲`;
    }
  }

  /* Cari nama surah */
  const surahM = agCariSurah(qL.replace(/putar|play|dengarkan|murottal|bunyikan/g,'').trim());
  if (surahM) {
    setTimeout(() => {
      currentSurahNum = surahM.nomor;
      fetchAyahData(surahM.nomor).then(data => {
        currentAyahData = data; currentAyahIndex = 0;
        playAyah(0); showPlayer();
      });
    }, 500);
    return `🎵 Memutar murottal **Surah ${surahM.n} (${surahM.ar})** — ${surahM.arti}.\n\nNikmati lantunan Al-Qur'an! 🤲`;
  }

  return `🎵 Surah apa yang ingin diputar?\n\nContoh:\n• "putar surah 36" → Ya Sin\n• "putar Al-Kahf"\n• "putar 67" → Al-Mulk\n\nInsya Allah langsung diputarkan!`;
}


/* Tambah bubble chat */
function agTambahBubble(role, teks) {
  const chat = document.getElementById('agChat');
  if (!chat) return;

  const wrap    = document.createElement('div');
  wrap.className = `ag-bubble-wrap ${role}`;

  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  /* Format teks AI dengan markdown ringan */
  const htmlTeks = role === 'ai' ? agFormatTeks(teks) : teks.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

  if (role === 'ai') {
    wrap.innerHTML = `
      <div class="ag-bubble-avatar"><span class="material-icons">record_voice_over</span></div>
      <div>
        <div class="ag-bubble ai">${htmlTeks}</div>
        <div class="ag-bubble-time">${time}</div>
      </div>`;
  } else {
    wrap.innerHTML = `
      <div>
        <div class="ag-bubble user">${htmlTeks}</div>
        <div class="ag-bubble-time">${time}</div>
      </div>`;
  }

  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

function agTambahBubbleSystem(teks) {
  const chat = document.getElementById('agChat');
  if (!chat) return;
  const div = document.createElement('div');
  div.className = 'ag-bubble-wrap';
  div.innerHTML = `<div class="ag-bubble system">${teks}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* Typing indicator */
let _agTypingCounter = 0;
function agTampilkanTyping() {
  const chat = document.getElementById('agChat');
  if (!chat) return null;
  const id   = 'ag-typing-' + (++_agTypingCounter);
  const wrap = document.createElement('div');
  wrap.className = 'ag-bubble-wrap';
  wrap.id = id;
  wrap.innerHTML = `
    <div class="ag-bubble-avatar"><span class="material-icons">record_voice_over</span></div>
    <div class="ag-typing"><span></span><span></span><span></span></div>`;
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
  return id;
}

function agHapusTyping(id) {
  if (id) document.getElementById(id)?.remove();
}

/* ── Voice Chat (tanya AI dengan suara) ───────────────────── */
function agToggleVoiceChat() {
  const btn  = document.getElementById('agVoiceBtn');
  if (AG.voiceListening) {
    AG.voiceListening = false;
    try { AG.chatRecog?.stop(); } catch(e) {}
    btn?.classList.remove('recording');
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('Browser tidak mendukung pengenalan suara. Gunakan Chrome.'); return; }

  AG.voiceListening = true;
  btn?.classList.add('recording');

  const rec       = new SR();
  rec.lang        = 'id-ID';  // Chat dalam bahasa Indonesia
  rec.continuous  = false;
  rec.interimResults = false;
  AG.chatRecog    = rec;

  rec.onresult = (e) => {
    const teks = e.results[0][0].transcript;
    document.getElementById('agTextInput').value = teks;
    agKirimPesan();
  };
  rec.onend = () => {
    AG.voiceListening = false;
    btn?.classList.remove('recording');
  };
  rec.onerror = () => {
    AG.voiceListening = false;
    btn?.classList.remove('recording');
  };

  try { rec.start(); } catch(e) {}
}

/* ══════════════════════════════════════════════════════════
   SIMAK HAFALAN — Menyimak hafalan real-time
══════════════════════════════════════════════════════════ */

/* ── Mulai Sesi Simak ─────────────────────────────────────── */
async function agMulaiSimak() {
  const surahNum  = parseInt(document.getElementById('agSurahSel')?.value || 1);
  const ayatAwal  = parseInt(document.getElementById('agAyatAwal')?.value || 1);
  const ayatAkhir = parseInt(document.getElementById('agAyatAkhir')?.value || 7);
  const level     = document.getElementById('agLevelSel')?.value || 'pemula';

  if (ayatAwal > ayatAkhir) {
    agTambahBubble('ai', 'Maaf, ayat awal tidak boleh lebih besar dari ayat akhir. 😊');
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    agTambahBubble('ai', 'Browser Anda tidak mendukung pengenalan suara. Gunakan Google Chrome atau Edge terbaru.');
    return;
  }

  /* Update status */
  agSetStatus('Memuat data ayat...');
  document.getElementById('agBtnMulai').disabled = true;
  agSetOrb('thinking');

  try {
    const allData  = await fetchAyahData(surahNum);
    const filtered = allData.filter(a => a.number >= ayatAwal && a.number <= ayatAkhir);

    if (!filtered.length) throw new Error('Tidak ada ayat');

    AG.ayahList    = filtered.map(a => ({
      number     : a.number,
      arabic     : a.arabic,
      translation: a.translation,
      words      : a.arabic.split(/\s+/).filter(w => w.trim()),
    }));

    AG.surahNum  = surahNum;
    AG.ayatAwal  = ayatAwal;
    AG.ayatAkhir = ayatAkhir;
    AG.level     = level;
    AG.curIdx    = 0;
    AG.curWordIdx= 0;
    AG.totalAyat = filtered.length;
    AG.benar     = 0;
    AG.salah     = 0;
    AG.errors    = [];
    AG.startTime = Date.now();
    AG.simakActive  = true;
    AG.modeBantuan  = false;

    /* Tampilkan UI sesi */
    document.getElementById('agSetupBar').classList.add('hidden');
    document.getElementById('agSesiAktif').classList.remove('hidden');
    document.getElementById('agLaporan').classList.add('hidden');
    document.getElementById('agBtnMulai').disabled = false;

    /* Update chat - beri tahu user simak dimulai */
    const sn = SURAH_DATA[surahNum - 1];
    agTambahBubbleSystem(`🎙️ Sesi simak dimulai — ${sn.latin} (${sn.ar}) Ayat ${ayatAwal}–${ayatAkhir}`);

    /* Render ayat pertama */
    agRenderAyat(0);
    agUpdateStats();
    agStartTimer();

    setTimeout(() => agStartSimakRecognition(), 400);

  } catch(e) {
    agSetOrb('idle');
    agSetStatus('Gagal memuat. Periksa koneksi internet.');
    document.getElementById('agBtnMulai').disabled = false;
  }
}

/* ── Speech Recognition untuk Simak ──────────────────────── */
function agStartSimakRecognition() {
  if (!AG.simakActive) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  if (AG.simakRecog) {
    try { AG.simakRecog.stop(); } catch(e) {}
    AG.simakRecog = null;
  }

  const rec           = new SR();
  rec.lang            = 'ar-SA'; // Arab Saudi untuk bacaan Qur'an
  rec.continuous      = true;
  rec.interimResults  = true;
  rec.maxAlternatives = 5;
  AG.simakRecog       = rec;

  rec.onstart = () => {
    AG.micActive = true;
    agSetOrb('listening');

    const ayah = AG.ayahList[AG.curIdx];
    const kata  = ayah?.words[AG.curWordIdx] || '';
    agSetStatus('Mendengarkan hafalan...');
    document.getElementById('agOrbSub').textContent =
      kata ? `Lanjutkan dari: ${kata}` : 'Bacalah dengan tartil';

    /* Mulai timer bantuan 15 detik */
    agResetBantuTimer();
  };

  rec.onresult = (event) => {
    let finalText = '', interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText   += t;
      else                           interimText += t;
    }

    /* Tampilkan transcript */
    const tEl = document.getElementById('agTranscript');
    if (tEl) {
      tEl.innerHTML = finalText
        ? `<span style="color:var(--text)">${finalText}</span>`
        : `<span style="color:var(--text-muted)">${interimText}</span>`;
    }

    if (!finalText.trim()) return;

    /* Reset timer karena ada suara */
    agResetBantuTimer();
    AG.lastTranscript = finalText.trim();

    /* Mode bantuan: cek jawaban iya/tidak */
    if (AG.modeBantuan) {
      agCekJawabanBantuan(finalText.trim());
      return;
    }

    /* Proses hafalan */
    agProsesHafalan(finalText.trim());
  };

  rec.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return;
    if (AG.simakActive) setTimeout(() => agStartSimakRecognition(), 800);
  };

  rec.onend = () => {
    AG.micActive = false;
    if (AG.simakActive && !AG.modeBantuan) {
      setTimeout(() => agStartSimakRecognition(), 150);
    }
  };

  try { rec.start(); } catch(e) { console.warn('[agSR]', e); }
}

/* ── Proses Hafalan — AI Diam Jika Benar ─────────────────── */
function agProsesHafalan(heard) {
  if (!AG.simakActive || !AG.ayahList.length) return;

  const ayah      = AG.ayahList[AG.curIdx];
  if (!ayah) return;

  const heardNorm = normalizeArabic(heard);
  const heardWords= heardNorm.split(/\s+/).filter(w => w.length > 0);
  const threshold = agGetThreshold();
  let   wPtr      = AG.curWordIdx;
  let   adaSalah  = false;
  let   salahIdx  = -1;

  for (let hi = 0; hi < heardWords.length; hi++) {
    if (wPtr >= ayah.words.length) break;

    const hw       = heardWords[hi];
    const expected = ayah.words[wPtr];
    const sim      = calcSimilarity(hw, expected);

    if (sim >= threshold) {
      /* ✅ BENAR — AI DIAM */
      agHighlightWord(AG.curIdx, wPtr, 'correct');
      AG.benar++;
      wPtr++;
    } else {
      /* ❌ SALAH */
      agHighlightWord(AG.curIdx, wPtr, 'wrong');
      AG.salah++;
      AG.errors.push({ ayah: ayah.number, wordIdx: wPtr, expected, heard, sim });

      if (!adaSalah) { adaSalah = true; salahIdx = wPtr; }
      wPtr++;
    }
  }

  AG.curWordIdx = wPtr;
  agUpdateStats();

  if (wPtr < ayah.words.length) {
    agHighlightWord(AG.curIdx, wPtr, 'current');
  }

  /* ── Kondisi 1: Ada kesalahan → AI tegur via chat ── */
  if (adaSalah) {
    agSetOrb('wrong');

    const respon = agPilihRespon('hafalanSalah');
    const kataYangSalah = ayah.words[salahIdx] || '';

    /* Tambah ke chat (bukan hanya suara) */
    agTambahBubble('ai', `${respon}\n\n*Kata yang perlu diulang:* ${kataYangSalah}`);
    agUcapkan(respon, () => {
      if (!AG.simakActive) return;
      AG.curWordIdx = salahIdx;
      agHighlightWord(AG.curIdx, salahIdx, 'current');
      agSetOrb('listening');
      agSetStatus('Ulangi dari kata yang salah');
      agResetBantuTimer();
    });
    return;
  }

  /* ── Ayat selesai ── */
  if (wPtr >= ayah.words.length) {
    agAyatSelesai(AG.curIdx);
  }
}

/* ── Ayat Selesai — Lanjut Otomatis, AI Diam ─────────────── */
function agAyatSelesai(idx) {
  const ayah    = AG.ayahList[idx];
  const nextIdx = idx + 1;
  const adaLagi = nextIdx < AG.totalAyat;

  /* Log di chat (tanpa suara) */
  agTambahBubbleSystem(`✅ Ayat ${ayah.number} selesai`);

  /* Progress */
  const pct = Math.round(((idx + 1) / AG.totalAyat) * 100);
  const pf  = document.getElementById('agProgFill');
  if (pf) pf.style.width = pct + '%';

  if (adaLagi) {
    setTimeout(() => {
      if (!AG.simakActive) return;
      AG.curIdx     = nextIdx;
      AG.curWordIdx = 0;
      agRenderAyat(nextIdx);
      agHighlightWord(nextIdx, 0, 'current');
      agSetOrb('listening');
      agSetStatus('Mendengarkan...');
      agResetBantuTimer();
    }, 500);
  } else {
    setTimeout(() => agSelesaiSimak(), 800);
  }
}

/* ── Timer Bantuan 15 Detik ───────────────────────────────── */
function agResetBantuTimer() {
  clearTimeout(AG.bantuTimer);
  if (!AG.simakActive) return;

  AG.bantuTimer = setTimeout(() => {
    if (!AG.simakActive || AG.modeBantuan) return;
    agTanyaBantuan();
  }, 15000);
}

function agTanyaBantuan() {
  AG.modeBantuan = true;
  const ayah = AG.ayahList[AG.curIdx];

  agSetOrb('thinking');
  agSetStatus('Menunggu jawaban...');

  /* Tampilkan di chat sebagai bubble khusus */
  const chat = document.getElementById('agChat');
  if (chat) {
    const wrap = document.createElement('div');
    wrap.className = 'ag-bubble-wrap';
    wrap.id = 'agBantuanBubble';
    wrap.innerHTML = `
      <div class="ag-bubble-avatar"><span class="material-icons">record_voice_over</span></div>
      <div style="max-width:85%">
        <div class="ag-bantuan-bubble">
          <p class="ag-bantuan-q">💬 <em>Maaf, apakah boleh saya bantu?</em></p>
          <div class="ag-bantuan-btns">
            <button class="ag-bantuan-iya" onclick="agJawabanBantuan(true)">
              <span class="material-icons">play_circle</span> Ya, putarkan
            </button>
            <button class="ag-bantuan-tidak" onclick="agJawabanBantuan(false)">
              <span class="material-icons">mic</span> Tidak, lanjut
            </button>
          </div>
          <p class="ag-bantuan-hint">Atau ucapkan "iya" / "tidak"</p>
        </div>
      </div>`;
    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;
  }

  agUcapkan('Maaf, apakah boleh saya bantu?');

  /* Timeout 10 detik jika tidak ada jawaban */
  AG.silenceTimer = setTimeout(() => {
    if (AG.modeBantuan && AG.simakActive) agJawabanBantuan(false);
  }, 10000);
}

function agCekJawabanBantuan(heard) {
  const h       = heard.toLowerCase().trim();
  const kataIya = ['iya','ya','boleh','mau','tolong','bantu','ok','oke','silakan','putar'];
  const kataTdk = ['tidak','jangan','no','nggak','gak','belum','lanjut','sendiri'];

  if (kataIya.some(k => h.includes(k))) { agJawabanBantuan(true);  return; }
  if (kataTdk.some(k => h.includes(k))) { agJawabanBantuan(false); return; }
}

function agJawabanBantuan(iya) {
  clearTimeout(AG.silenceTimer);
  clearTimeout(AG.bantuTimer);
  AG.modeBantuan = false;

  /* Hapus bubble bantuan */
  document.getElementById('agBantuanBubble')?.remove();

  if (iya) {
    const ayah   = AG.ayahList[AG.curIdx];
    const surahS = SURAH_DATA[AG.surahNum - 1];
    const ayahN  = ayah?.number || 1;

    agSetOrb('correct');
    agSetStatus('Memutar murottal...');
    agTambahBubble('ai', `Baik, saya putarkan Ayat ${ayahN} dari Surah ${surahS.latin} agar Anda bisa menyimaknya. 🎵`);

    agUcapkan(`Baik, saya putarkan ayat ${ayahN}`, () => {
      if (!AG.simakActive) return;

      /* Putar audio via player utama */
      _audioIntentionalStop = false;
      const url = audioUrl(AG.surahNum, ayahN);
      audio.src = url;
      audio.play().catch(() => {});
      updatePlayerTitle(`${surahS.latin} · Ayat ${ayahN} (Bantuan)`);
      document.getElementById('audio-player-sub').textContent = surahS.ar;
      showPlayer();

      const onEnd = () => {
        audio.removeEventListener('ended', onEnd);
        if (!AG.simakActive) return;

        agTambahBubble('ai', 'Silakan ulangi hafalan ayat tersebut. Insya Allah bisa! 💪');
        agUcapkan('Silakan ulangi hafalannya', () => {
          AG.curWordIdx = 0;
          agRenderAyat(AG.curIdx);
          agHighlightWord(AG.curIdx, 0, 'current');
          agSetOrb('listening');
          agSetStatus('Mendengarkan...');

          /* Reset transcript */
          const tEl = document.getElementById('agTranscript');
          if (tEl) tEl.innerHTML = '<span class="ag-transcript-ph">Yang didengar AI akan muncul di sini...</span>';

          setTimeout(() => { if (AG.simakActive) agResetBantuTimer(); }, 1000);
        });
      };
      audio.addEventListener('ended', onEnd);
    });

  } else {
    agTambahBubble('ai', 'Baik, silakan lanjutkan ketika sudah siap. Semangat! 💪');
    agUcapkan('Baik, silakan lanjutkan ketika sudah siap.', () => {
      agSetOrb('listening');
      agSetStatus('Mendengarkan...');
      setTimeout(() => { if (AG.simakActive) agResetBantuTimer(); }, 500);
    });
  }
}

/* ── Selesai Simak ────────────────────────────────────────── */
function agHentikanSimak() {
  agSelesaiSimak();
}

function agSelesaiSimak() {
  AG.simakActive  = false;
  AG.modeBantuan  = false;
  clearTimeout(AG.bantuTimer);
  clearTimeout(AG.silenceTimer);
  clearInterval(AG.timerIv);

  try { AG.simakRecog?.stop(); } catch(e) {}
  AG.micActive = false;

  agSetOrb('idle');

  const totalKata = AG.ayahList.reduce((s, a) => s + a.words.length, 0);
  const skor      = totalKata > 0
    ? Math.max(0, Math.round((AG.benar / Math.max(AG.benar + AG.salah, 1)) * 100))
    : 100;
  const durasi    = Math.round((Date.now() - AG.startTime) / 1000);
  const surahName = SURAH_DATA[AG.surahNum - 1].latin;

  /* Simpan riwayat */
  AG.history.unshift({
    date: new Date().toLocaleDateString('id-ID'),
    time: new Date().toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'}),
    surah: surahName, ayat: `${AG.ayatAwal}–${AG.ayatAkhir}`,
    skor, benar: AG.benar, salah: AG.salah, durasi, level: AG.level,
  });
  if (AG.history.length > 20) AG.history = AG.history.slice(0, 20);
  localStorage.setItem('ag_history', JSON.stringify(AG.history));

  /* Update chat */
  const grade = skor >= 95 ? 'Mumtaz 🌟' : skor >= 85 ? 'Jayyid Jiddan ✨' :
                skor >= 75 ? 'Jayyid 👍'  : skor >= 60 ? 'Maqbul 📗' : 'Perlu Latihan 📖';
  const mm    = String(Math.floor(durasi/60)).padStart(2,'0');
  const ss    = String(durasi%60).padStart(2,'0');

  agTambahBubble('ai',
    `Alhamdulillah, sesi selesai! 🎉\n\n` +
    `📊 *Hasil Simak:*\n` +
    `• Surah: ${surahName} Ayat ${AG.ayatAwal}–${AG.ayatAkhir}\n` +
    `• Nilai: *${skor}% — ${grade}*\n` +
    `• Kata Benar: ${AG.benar} | Kesalahan: ${AG.salah}\n` +
    `• Durasi: ${mm}:${ss}\n\n` +
    (AG.errors.length === 0
      ? 'MasyaAllah! Tidak ada kesalahan. Pertahankan! 💪'
      : `Kata yang perlu dilatih:\n${AG.errors.slice(0,5).map(e => `• Ayat ${e.ayah}: ${e.expected}`).join('\n')}`)
  );

  agUcapkan(`Alhamdulillah sesi selesai. Nilai Anda ${skor} persen. ${grade}`);

  /* Tampilkan laporan di panel simak */
  agTampilkanLaporan(skor, durasi, grade);
}

/* ── Laporan di panel simak ───────────────────────────────── */
function agTampilkanLaporan(skor, durasi, grade) {
  document.getElementById('agSesiAktif').classList.add('hidden');
  document.getElementById('agLaporan').classList.remove('hidden');

  const arc = document.getElementById('agScoreArc');
  if (arc) {
    arc.style.transition   = 'stroke-dashoffset 1.2s ease';
    arc.style.stroke       = skor >= 90 ? '#16a34a' : skor >= 70 ? '#d97706' : '#dc2626';
    setTimeout(() => { arc.style.strokeDashoffset = 314 - (skor / 100) * 314; }, 100);
  }

  const el = document.getElementById('agScoreNum');
  if (el) el.textContent = skor + '%';

  const grEl = document.getElementById('agLaporanGrade');
  if (grEl) grEl.textContent = grade;

  const mm  = String(Math.floor(durasi/60)).padStart(2,'0');
  const ss  = String(durasi%60).padStart(2,'0');
  const stEl = document.getElementById('agLaporanStats');
  if (stEl) stEl.innerHTML =
    `Benar: ${AG.benar} kata<br>Salah: ${AG.salah} kata<br>Durasi: ${mm}:${ss}<br>Level: ${AG.level}`;

  const errEl = document.getElementById('agLaporanErrors');
  if (errEl) {
    if (!AG.errors.length) {
      errEl.innerHTML = '<p style="color:#16a34a;font-weight:700;text-align:center;padding:8px">🎉 Tidak ada kesalahan!</p>';
    } else {
      const uniq = [], seen = new Set();
      AG.errors.forEach(e => { const k=`${e.ayah}-${e.wordIdx}`; if(!seen.has(k)){seen.add(k);uniq.push(e);} });
      errEl.innerHTML = uniq.slice(0,5).map(e => `
        <div class="ag-err-item">
          <div class="ag-err-hd">Ayat ${e.ayah} · Kata ke-${e.wordIdx+1}</div>
          <div class="ag-err-arab">${e.expected}</div>
        </div>`).join('');
    }
  }
}

function agResetSimak() {
  document.getElementById('agLaporan').classList.add('hidden');
  document.getElementById('agSesiAktif').classList.add('hidden');
  document.getElementById('agSetupBar').classList.remove('hidden');
  agSetOrb('idle');
  agSetStatus('Siap membantu • ketik atau tekan mic');
  /* Reset transcript */
  const tEl = document.getElementById('agTranscript');
  if (tEl) tEl.innerHTML = '<span class="ag-transcript-ph">Yang didengar AI akan muncul di sini...</span>';
}

/* ── Render Ayat ──────────────────────────────────────────── */
function agRenderAyat(idx) {
  if (!AG.ayahList.length) return;
  const ayah   = AG.ayahList[idx];
  const surahS = SURAH_DATA[AG.surahNum - 1];

  const lbl = document.getElementById('agAyatLbl');
  if (lbl) lbl.textContent = `Ayat ${ayah.number} · ${surahS.latin}`;

  const arabEl = document.getElementById('agArabicText');
  if (arabEl) {
    arabEl.innerHTML = ayah.words.map((w, i) => {
      let cls = 'ag-word pending';
      if (i < AG.curWordIdx)  cls = 'ag-word correct';
      if (i === AG.curWordIdx) cls = 'ag-word current';
      return `<span class="${cls}" id="agw-${idx}-${i}">${w}</span> `;
    }).join('');
  }

  const transEl = document.getElementById('agTransText');
  if (transEl) transEl.textContent = ayah.translation;

  const prev = document.getElementById('agBtnPrev');
  const next = document.getElementById('agBtnNext');
  if (prev) prev.disabled = idx === 0;
  if (next) next.disabled = idx >= AG.totalAyat - 1;
}

function agHighlightWord(ayatIdx, wordIdx, state) {
  const span = document.getElementById(`agw-${ayatIdx}-${wordIdx}`);
  if (!span) return;
  span.className = `ag-word ${state}`;
  if (state === 'current') span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function agPindahAyat(dir) {
  if (!AG.simakActive) return;
  const ni = AG.curIdx + dir;
  if (ni < 0 || ni >= AG.totalAyat) return;
  AG.curIdx     = ni;
  AG.curWordIdx = 0;
  agRenderAyat(ni);
  agHighlightWord(ni, 0, 'current');
  agResetBantuTimer();
}

/* ── UI Helpers ───────────────────────────────────────────── */
function agSetOrb(state) {
  const orb  = document.getElementById('agOrb');
  const icon = document.getElementById('agOrbIcon');
  if (!orb) return;
  orb.className = `ag-orb ${state}`;
  const iconMap = { idle:'record_voice_over', listening:'mic', correct:'check_circle', wrong:'cancel', thinking:'psychology' };
  if (icon) icon.textContent = iconMap[state] || 'mic';

  /* Sync avatar header */
  const av = document.getElementById('agAvatar');
  if (av) {
    av.className = `ag-avatar${state === 'listening' ? ' listening' : state === 'thinking' ? ' speaking' : ''}`;
  }
}

function agSetStatus(txt) {
  const el = document.getElementById('agStatus');
  if (el) el.textContent = txt;
}

function agUpdateStats() {
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('ss-benar', `✓ ${AG.benar}`);
  el('ss-salah',  `✗ ${AG.salah}`);
  el('ss-ayat',  `Ayat ${AG.curIdx + 1}/${AG.totalAyat}`);
}

function agStartTimer() {
  clearInterval(AG.timerIv);
  AG.timerIv = setInterval(() => {
    if (!AG.simakActive) return;
    const e = Math.floor((Date.now() - AG.startTime) / 1000);
    const mm = String(Math.floor(e/60)).padStart(2,'0');
    const ss = String(e%60).padStart(2,'0');
    const el = document.getElementById('ss-timer');
    if (el) el.textContent = `${mm}:${ss}`;
  }, 1000);
}

/* ── TTS Suara Laki-laki ──────────────────────────────────── */
function agUcapkan(teks, onDone) {
  if (!teks || !('speechSynthesis' in window)) { onDone?.(); return; }

  window.speechSynthesis.cancel();

  /* Pause simak mic agar tidak tangkap suara AI */
  if (AG.simakRecog && AG.micActive) {
    try { AG.simakRecog.stop(); } catch(e) {}
  }

  const utt    = new SpeechSynthesisUtterance(teks);
  utt.lang     = 'id-ID';
  utt.rate     = 0.92;
  utt.pitch    = 0.85; // Suara laki-laki
  utt.volume   = 1.0;

  const voices  = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang === 'id-ID') || voices.find(v => v.lang.startsWith('id'));
  if (idVoice) utt.voice = idVoice;

  utt.onend = () => {
    onDone?.();
    if (AG.simakActive && !AG.micActive) {
      setTimeout(() => agStartSimakRecognition(), 250);
    }
  };
  utt.onerror = () => {
    onDone?.();
    if (AG.simakActive && !AG.micActive) {
      setTimeout(() => agStartSimakRecognition(), 250);
    }
  };

  window.speechSynthesis.speak(utt);
}

/* ── Pilih respon acak ────────────────────────────────────── */
const AG_RESPON = {
  hafalanSalah: [
    'Maaf, ada bacaan yang kurang tepat. Silakan ulangi bagian terakhir.',
    'Ada satu kata yang berbeda. Coba ulangi ayat tersebut.',
    'Maaf, bacaan kurang sesuai. Silakan ulangi.',
  ],
};

function agPilihRespon(cat) {
  const list = AG_RESPON[cat] || ['Maaf, ada yang kurang tepat. Silakan ulangi.'];
  return list[Math.floor(Math.random() * list.length)];
}

function agGetThreshold() {
  return { pemula: 0.50, menengah: 0.60, mahir: 0.72, guru: 0.85 }[AG.level] || 0.60;
}

/* ── GLOBAL EXPORTS ───────────────────────────────────────── */
window.switchView          = switchView;
window.openSurah           = openSurah;
window.playAyah            = playAyah;
window.playFullSurah       = playFullSurah;
window.toggleBookmark      = toggleBookmark;
window.deleteBookmark      = deleteBookmark;
window.showShalatInfo      = showShalatInfo;
window.showQiblatInfo      = showQiblatInfo;
window.agToggleSimakPanel  = agToggleSimakPanel;
window.agJawabanBantuan    = agJawabanBantuan;
window.agResetSimak        = agResetSimak;
window.showDownloadPanel   = showDownloadPanel;
window.playOnlineSurahQari = playOnlineSurahQari;
window.playOnlineAyah      = playOnlineAyah;
window.downloadAyahDirect  = downloadAyahDirect;
window.downloadSingleAyah  = downloadSingleAyah;
window.downloadFullSurah   = downloadFullSurah;
window.mintaIzinProaktif   = mintaIzinProaktif;

