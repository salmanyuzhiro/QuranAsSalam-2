/* ============================================================
   AL QUR'AN AS SALAM — script.js  v4.0
   Tambahan: Simak Hafalan (AI Guru Tahfizh)
   ============================================================ */

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
  initSimak(); // ← AI Guru Tahfizh

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

/* ── JADWAL SHALAT ────────────────────────────────────────── */
function showShalatInfo() {
  const box = document.getElementById('shalat-content');
  box.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
    <span class="material-icons" style="font-size:40px;display:block;margin-bottom:12px;color:var(--primary);animation:spin 1.2s linear infinite">refresh</span>
    <p style="font-size:14px">Mendapatkan lokasi Anda...</p></div>`;
  switchView('shalat');
  if (!navigator.geolocation) { box.innerHTML = renderShalatError('GPS tidak didukung.'); return; }
  navigator.geolocation.getCurrentPosition(
    pos => fetchAndRenderShalat(pos.coords.latitude, pos.coords.longitude),
    () => { box.innerHTML = renderShalatError('Izinkan akses lokasi untuk menampilkan jadwal shalat.'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function renderShalatError(msg) {
  return `<div style="text-align:center;padding:40px 20px;background:var(--card);border-radius:20px;border:1px solid var(--border)">
    <span class="material-icons" style="font-size:48px;color:#f59e0b;display:block;margin-bottom:12px">location_off</span>
    <p style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">Lokasi Tidak Tersedia</p>
    <p style="font-size:12px;color:var(--text-muted)">${msg}</p>
    <button onclick="showShalatInfo()" style="margin-top:16px;background:var(--primary);color:white;border:none;padding:10px 24px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">Coba Lagi</button>
  </div>`;
}

async function fetchAndRenderShalat(lat, lon) {
  const box = document.getElementById('shalat-content');
  try {
    const [timingRes, geoRes] = await Promise.all([
      fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`),
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    ]);
    const timingData = await timingRes.json();
    const geoData    = await geoRes.json();
    const t     = timingData.data.timings;
    const date  = timingData.data.date.readable;
    const hijri = `${timingData.data.date.hijri.day} ${timingData.data.date.hijri.month.en} ${timingData.data.date.hijri.year} H`;
    const city  = geoData.address?.city || geoData.address?.town || geoData.address?.county || 'Lokasi Anda';
    const prayers = [
      { name:'Subuh',   icon:'nights_stay',  time:t.Fajr,    color:'#6366f1' },
      { name:'Syuruq',  icon:'wb_twilight',  time:t.Sunrise, color:'#f59e0b' },
      { name:'Dzuhur',  icon:'wb_sunny',     time:t.Dhuhr,   color:'#10b981' },
      { name:'Ashar',   icon:'light_mode',   time:t.Asr,     color:'#f97316' },
      { name:'Maghrib', icon:'wb_twilight',  time:t.Maghrib, color:'#ef4444' },
      { name:'Isya',    icon:'dark_mode',    time:t.Isha,    color:'#8b5cf6' },
    ];
    const nextPrayer = getNextPrayer(prayers);
    box.innerHTML = `
      <div class="shalat-location-card">
        <div class="shalat-loc-left">
          <span class="material-icons" style="color:var(--primary);font-size:20px">location_on</span>
          <div><p class="shalat-city">${city}</p><p class="shalat-date">${date}</p></div>
        </div>
        <div class="shalat-hijri"><span class="material-icons" style="font-size:14px;opacity:0.7">calendar_today</span>${hijri}</div>
      </div>
      <div class="shalat-next-card">
        <div class="shalat-next-label">Waktu Shalat Berikutnya</div>
        <div class="shalat-next-name">${nextPrayer.name}</div>
        <div class="shalat-next-time">${nextPrayer.time}</div>
        <div class="shalat-countdown" id="shalat-countdown">--:--:--</div>
        <div class="shalat-next-sub">Menghitung mundur...</div>
      </div>
      <div class="shalat-grid">
        ${prayers.map(p => {
          const isNext = p.name === nextPrayer.name;
          return `<div class="shalat-item ${isNext?'shalat-item-active':''}">
            <div class="shalat-item-icon" style="background:${p.color}22;color:${p.color}">
              <span class="material-icons">${p.icon}</span>
            </div>
            <div class="shalat-item-info">
              <p class="shalat-item-name">${p.name}</p>
              ${isNext?'<span class="shalat-next-badge">Berikutnya</span>':''}
            </div>
            <div class="shalat-item-time" style="color:${isNext?'var(--primary)':'var(--text)'}">${p.time}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="shalat-method"><span class="material-icons" style="font-size:14px">info_outline</span>Metode: Kementerian Agama Indonesia (MWL)</div>`;
    startShalatCountdown(nextPrayer.time);
  } catch(e) {
    box.innerHTML = renderShalatError('Gagal memuat data. Periksa koneksi internet Anda.');
  }
}

function getNextPrayer(prayers) {
  const now = new Date(), nowMin = now.getHours()*60+now.getMinutes();
  for(const p of prayers){ const [h,m]=p.time.split(':').map(Number); if(h*60+m>nowMin) return p; }
  return prayers[0];
}

function startShalatCountdown(timeStr) {
  const [targetH, targetM] = timeStr.split(':').map(Number);
  if(window._shalatTimer) clearInterval(window._shalatTimer);
  window._shalatTimer = setInterval(() => {
    const el = document.getElementById('shalat-countdown');
    if(!el){ clearInterval(window._shalatTimer); window._shalatTimer=null; return; }
    const now=new Date(); let target=new Date();
    target.setHours(targetH,targetM,0,0);
    if(target<=now) target.setDate(target.getDate()+1);
    const diff=target-now;
    const hh=String(Math.floor(diff/3600000)).padStart(2,'0');
    const mm=String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    const ss=String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    el.textContent=`${hh}:${mm}:${ss}`;
  },1000);
}

/* ── ARAH QIBLAT ──────────────────────────────────────────── */
function showQiblatInfo() {
  const box = document.getElementById('qiblat-content');
  box.innerHTML=`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
    <span class="material-icons" style="font-size:40px;display:block;margin-bottom:12px;color:var(--primary);animation:spin 1.2s linear infinite">refresh</span>
    <p style="font-size:14px">Mendapatkan lokasi Anda...</p></div>`;
  switchView('qiblat');
  if(!navigator.geolocation){ box.innerHTML=renderQiblatError('GPS tidak didukung.'); return; }
  navigator.geolocation.getCurrentPosition(
    pos => renderQiblat(pos.coords.latitude, pos.coords.longitude),
    () => { box.innerHTML=renderQiblatError('Izinkan akses lokasi.'); },
    { enableHighAccuracy:true, timeout:10000, maximumAge:0 }
  );
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
  container.innerHTML=SURAH_DATA.map(s=>`
    <div class="audio-surah-card" onclick="playFullSurah(${s.n})">
      <div class="audio-num-wrap">${s.n}</div>
      <div class="audio-info"><h3>${s.latin}</h3><p>${s.arti} · ${s.ayat} Ayat · ${s.type}</p></div>
      <div class="audio-arab">${s.ar}</div>
      <span class="material-icons audio-play-icon">play_circle</span>
    </div>`).join('');
}

function playFullSurah(surahNum){
  currentSurahNum=surahNum; isRangeMode=false; repeatCount=1; repeatDone=0;
  fetchAyahData(surahNum).then(data=>{ currentAyahData=data; currentAyahIndex=0; playAyah(0); showPlayer(); });
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
  lastTranscript: '',
  history      : JSON.parse(localStorage.getItem('simak_history') || '[]'),
};

const SIMAK_TTS_LANG = 'id-ID';

/* ── Inisialisasi Simak ───────────────────────────────────── */
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (e) {
        alert("Aplikasi memerlukan izin mikrofon.");
        return false;
    }
}

function initSimak() {
  // Populate surah select
  const sel = document.getElementById('simakSurahSelect');
  if (!sel) return;
  SURAH_DATA.forEach(s => {
    sel.innerHTML += `<option value="${s.n}">${s.n}. ${s.latin} (${s.ar})</option>`;
  });

  // Update ayat akhir saat surah berubah
  sel.addEventListener('change', () => {
    const s = SURAH_DATA[parseInt(sel.value) - 1];
    document.getElementById('simakAyatAwal').max = s.ayat;
    document.getElementById('simakAyatAkhir').max = s.ayat;
    document.getElementById('simakAyatAkhir').value = s.ayat > 7 ? 7 : s.ayat;
  });

  document.getElementById('simakBtnStart')
    ?.addEventListener('click', async () => {

        const izin = await requestMicrophonePermission();
        if (!izin) return;

        mulaiSimak();
    });
  document.getElementById('simakBtnStop')?.addEventListener('click', hentikanSimak);
  document.getElementById('simakBtnPrev')?.addEventListener('click', () => simakPindahAyat(-1));
  document.getElementById('simakBtnNext')?.addEventListener('click', () => simakPindahAyat(1));

  renderSimakHistory();
}

/* ── Mulai Sesi Simak ─────────────────────────────────────── */
async function mulaiSimak() {
  const surahNum  = parseInt(document.getElementById('simakSurahSelect').value);
  const ayatAwal  = parseInt(document.getElementById('simakAyatAwal').value);
  const ayatAkhir = parseInt(document.getElementById('simakAyatAkhir').value);
  const mode      = document.getElementById('simakMode').value;
  const level     = document.getElementById('simakLevel').value;

  if (ayatAwal > ayatAkhir) {
    simakSpeak('Ayat awal tidak boleh lebih besar dari ayat akhir'); return;
  }

  // Cek Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Browser Anda tidak mendukung pengenalan suara.\nGunakan Google Chrome atau Microsoft Edge terbaru.');
    return;
  }

  // Fetch data ayat
  simakSetOrbState('thinking');
  simakSetLabel('Memuat data ayat...', 'Harap tunggu sebentar');
  document.getElementById('simakBtnStart').disabled = true;

  try {
    const allData = await fetchAyahData(surahNum);
    const filtered = allData.filter(a => a.number >= ayatAwal && a.number <= ayatAkhir);

    // Pecah tiap ayah jadi kata-kata
    simakState.ayahDataList = filtered.map(a => ({
      number      : a.number,
      arabic      : a.arabic,
      translation : a.translation,
      words       : tokenizeArabic(a.arabic),
    }));

    simakState.surahNum      = surahNum;
    simakState.ayatAwal      = ayatAwal;
    simakState.ayatAkhir     = ayatAkhir;
    simakState.mode          = mode;
    simakState.level         = level;
    simakState.currentIdx    = 0;
    simakState.currentWordIdx= 0;
    simakState.totalAyat     = filtered.length;
    simakState.benar         = 0;
    simakState.salah         = 0;
    simakState.errors        = [];
    simakState.startTime     = Date.now();
    simakState.active        = true;

    // Tampilkan panel sesi
    document.getElementById('simakSetupCard').classList.add('hidden');
    document.getElementById('simakHistoryCard').classList.add('hidden');
    document.getElementById('simakReportPanel').classList.add('hidden');
    document.getElementById('simakSessionPanel').classList.remove('hidden');
    document.getElementById('simakBtnStart').disabled = false;

    // Update badge header
    document.getElementById('simakAiDot').classList.add('active');

    // Update mode badge
    const modeNames = { hafalan:'Simak Hafalan', tajwid:'Simak Tajwid', kelancaran:'Simak Kelancaran', lengkap:'Simak Lengkap' };

    // Render ayat pertama
    simakRenderAyat(0);
    simakUpdateStats();
    startSimakTimer();

    // Mulai mic
    setTimeout(() => startSimakRecognition(), 600);

  } catch(e) {
    simakSetLabel('Gagal memuat data', 'Periksa koneksi internet');
    simakSetOrbState('idle');
    document.getElementById('simakBtnStart').disabled = false;
  }
}

/* ── Tokenisasi Arab ──────────────────────────────────────── */
function tokenizeArabic(text) {
  // Hapus tanda baca non-Arab, pisah berdasar spasi
  return text.replace(/[\u0610-\u061A\u064B-\u065F]*/g, m => m) // keep harakat
             .split(/\s+/)
             .filter(w => w.trim().length > 0);
}

/* Normalisasi teks Arab untuk perbandingan */
function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0610-\u061A]/g, '') // hapus harakat & tanda baca
    .replace(/[أإآا]/g, 'ا')   // normalisasi alif
    .replace(/[ىي]/g, 'ي')     // normalisasi ya
    .replace(/ة/g, 'ه')        // ta marbuta → ha
    .replace(/\s+/g, ' ')
    .trim();
}

/* ── Render Ayat di Panel Simak ───────────────────────────── */
function simakRenderAyat(idx) {
  if (!simakState.ayahDataList.length) return;
  const ayah   = simakState.ayahDataList[idx];
  const surahS = SURAH_DATA[simakState.surahNum - 1];

  document.getElementById('simakAyatCounter').textContent =
    `Ayat ${ayah.number} · ${surahS.latin}`;

  // Render kata-kata dengan span
  const arabicEl = document.getElementById('simakArabicText');
  arabicEl.innerHTML = ayah.words.map((w, i) => {
    let cls = 'sw-word pending';
    if (i < simakState.currentWordIdx) cls = 'sw-word correct';
    if (i === simakState.currentWordIdx) cls = 'sw-word current';
    return `<span class="${cls}" id="sw-${idx}-${i}">${w}</span> `;
  }).join('');

  document.getElementById('simakTranslation').textContent = ayah.translation;
  document.getElementById('sstatAyat').textContent =
    `${idx + 1}/${simakState.totalAyat}`;

  // Update progress
  const pct = Math.round(((idx) / simakState.totalAyat) * 100);
  document.getElementById('simakProgressFill').style.width = pct + '%';
  document.getElementById('simakProgressPct').textContent = pct + '%';

  // Nav buttons
  document.getElementById('simakBtnPrev').disabled = idx === 0;
  document.getElementById('simakBtnNext').disabled = idx >= simakState.totalAyat - 1;
}

/* ── Highlight kata saat ini ──────────────────────────────── */
function simakHighlightWord(ayatIdx, wordIdx, state) {
  const span = document.getElementById(`sw-${ayatIdx}-${wordIdx}`);
  if (!span) return;
  span.className = `sw-word ${state}`;
  if (state === 'current') {
    span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── Speech Recognition ───────────────────────────────────── */
function startSimakRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  if (simakState.recognition) {
    try { simakState.recognition.stop(); } catch(e) {}
  }

  const rec = new SR();
  rec.lang = 'ar-SA'; // Bahasa Arab Saudi
  rec.continuous     = true;
  rec.interimResults = true;
  rec.maxAlternatives = 3;

  simakState.recognition = rec;

  rec.onstart = () => {
    simakState.isMicActive = true;
    simakSetOrbState('listening');
    simakSetLabel('AI Mendengarkan...', 'Bacalah ayat dengan tartil dan jelas');
    document.getElementById('simakLiveDot').classList.add('active');
    simakAddLog('info', '🎙️ Mikrofon aktif — mulai baca hafalan Anda');
  };

  rec.onresult = (event) => {
    clearTimeout(simakState.silenceTimer);
    let finalTranscript   = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript   += t;
      else                           interimTranscript += t;
    }

    // Tampilkan di transcript box
    const transcriptEl = document.getElementById('simakTranscriptText');
    transcriptEl.innerHTML = finalTranscript
      ? `<span style="color:var(--text)">${finalTranscript}</span>`
      : `<span style="color:var(--text-muted)">${interimTranscript}</span>`;

    // Proses jika ada teks final
    if (finalTranscript.trim()) {
      simakState.lastTranscript = finalTranscript.trim();
      prosesBackaanAI(finalTranscript.trim());
    }

    // Deteksi diam terlalu lama
    simakState.silenceTimer = setTimeout(() => {
      if (simakState.active && simakState.isMicActive) {
        simakAddLog('warn', '⏱️ Terlalu lama berhenti... lanjutkan bacaan Anda');
        simakSpeak('Lanjutkan bacaan');
      }
    }, getLevelTimeout());
  };

  rec.onerror = (event) => {
    if (event.error === 'no-speech') {
      // Restart otomatis
      if (simakState.active) setTimeout(() => startSimakRecognition(), 300);
      return;
    }
    if (event.error === 'aborted') return;
    simakAddLog('warn', `⚠️ Mikrofon: ${event.error} — mencoba ulang...`);
    if (simakState.active) setTimeout(() => startSimakRecognition(), 1000);
  };

  rec.onend = () => {
    simakState.isMicActive = false;
    document.getElementById('simakLiveDot').classList.remove('active');
    // Restart jika sesi masih aktif
    if (simakState.active) {
      setTimeout(() => startSimakRecognition(), 200);
    }
  };

  try { rec.start(); } catch(e) { console.warn('SR start error:', e); }
}

/* ── Proses Bacaan dari AI ────────────────────────────────── */
function prosesBackaanAI(heard) {
  if (!simakState.active || !simakState.ayahDataList.length) return;

  const curAyatIdx = simakState.currentIdx;
  const ayah       = simakState.ayahDataList[curAyatIdx];
  if (!ayah) return;

  const heardNorm   = normalizeArabic(heard);
  const heardWords  = heardNorm.split(/\s+/).filter(w => w.length > 0);

  let matchCount  = 0;
  let wrongWords  = [];
  let wordPointer = simakState.currentWordIdx;

  // Cocokkan kata per kata dari posisi saat ini
  for (let hi = 0; hi < heardWords.length; hi++) {
    const hw = heardWords[hi];

    if (wordPointer >= ayah.words.length) break;

    const expected     = normalizeArabic(ayah.words[wordPointer]);
    const similarity   = calcSimilarity(hw, expected);
    const threshold    = getLevelThreshold();

    if (similarity >= threshold) {
      // ✅ Kata benar
      simakHighlightWord(curAyatIdx, wordPointer, 'correct');
      matchCount++;
      wordPointer++;
      simakState.benar++;
    } else {
      // ❌ Kata salah
      simakHighlightWord(curAyatIdx, wordPointer, 'wrong');
      wrongWords.push({
        wordIdx  : wordPointer,
        expected : ayah.words[wordPointer],
        heard    : heard,
        similarity
      });
      simakState.salah++;
      simakState.errors.push({
        ayah    : ayah.number,
        wordIdx : wordPointer,
        expected: ayah.words[wordPointer],
        heard   : heard,
        type    : 'salah_kata'
      });

      // Koreksi langsung
      handleKoreksi(ayah.words[wordPointer], heard, ayah.number, wordPointer, similarity);
      wordPointer++; // lanjut ke kata berikutnya
    }
  }

  simakState.currentWordIdx = wordPointer;
  simakUpdateStats();

  // Highlight kata berikutnya sebagai 'current'
  if (wordPointer < ayah.words.length) {
    simakHighlightWord(curAyatIdx, wordPointer, 'current');
  }

  // Jika semua kata ayat ini selesai
  if (wordPointer >= ayah.words.length) {
    onAyatSelesai(curAyatIdx, wrongWords.length);
  }
}

/* ── Handle Koreksi AI ────────────────────────────────────── */
function handleKoreksi(expected, heard, ayahNum, wordIdx, similarity) {
  const level = simakState.level;

  // Level guru: koreksi sangat ketat & detail
  if (level === 'guru') {
    simakAddLog('wrong',
      `❌ Ayat ${ayahNum} kata ke-${wordIdx+1}: <span class="simak-log-arab">${expected}</span>`,
      true);
    simakSpeak('Salah. Ulangi lagi.');
    return;
  }

  if (similarity < 0.3) {
    // Sangat jauh — mungkin loncat ayat atau salah total
    simakAddLog('wrong',
      `❌ Kata tidak dikenali: <span class="simak-log-arab">${expected}</span>`,
      true);
    simakSpeak('Salah. Perbaiki.');
  } else if (similarity < getLevelThreshold()) {
    // Mirip tapi kurang tepat
    simakAddLog('wrong',
      `⚠️ Kurang tepat (${Math.round(similarity*100)}%): <span class="simak-log-arab">${expected}</span>`,
      true);
    simakSpeak('Kurang tepat. Ulangi.');
  }
}

/* ── Ayat Selesai ─────────────────────────────────────────── */
function onAyatSelesai(ayatIdx, wrongCount) {
  const ayah = simakState.ayahDataList[ayatIdx];

  if (wrongCount === 0) {
    simakSetOrbState('correct');
    simakAddLog('correct', `✅ Ayat ${ayah.number} — Benar! MasyaAllah 🌟`);
    simakSpeak('Benar. Lanjut.');
    setTimeout(() => simakSetOrbState('listening'), 1200);
  } else {
    simakAddLog('warn', `📋 Ayat ${ayah.number} selesai — ${wrongCount} kesalahan`);
    simakSpeak('Lanjut ayat berikutnya.');
  }

  // Pindah ke ayat berikutnya
  const nextIdx = ayatIdx + 1;
  if (nextIdx < simakState.totalAyat) {
    setTimeout(() => {
      simakState.currentIdx     = nextIdx;
      simakState.currentWordIdx = 0;
      simakRenderAyat(nextIdx);
      simakHighlightWord(nextIdx, 0, 'current');
    }, 1500);
  } else {
    // Semua ayat selesai!
    setTimeout(() => selesaiSimak(), 2000);
  }
}

/* ── Navigasi Manual Ayat ─────────────────────────────────── */
function simakPindahAyat(dir) {
  const newIdx = simakState.currentIdx + dir;
  if (newIdx < 0 || newIdx >= simakState.totalAyat) return;
  simakState.currentIdx     = newIdx;
  simakState.currentWordIdx = 0;
  simakRenderAyat(newIdx);
  simakHighlightWord(newIdx, 0, 'current');
  simakAddLog('info', `↪️ Pindah ke Ayat ${simakState.ayahDataList[newIdx].number}`);
}

/* ── Hentikan Sesi ────────────────────────────────────────── */
function hentikanSimak() {
  selesaiSimak();
}

function selesaiSimak() {
  simakState.active = false;
  clearTimeout(simakState.silenceTimer);
  clearInterval(simakState.timerInterval);

  // Stop recognition
  try { simakState.recognition?.stop(); } catch(e) {}
  document.getElementById('simakLiveDot').classList.remove('active');
  document.getElementById('simakAiDot').classList.remove('active');

  simakSetOrbState('idle');
  simakSpeak('Sesi selesai. Jazakallahu khayran.');

  // Hitung skor
  const totalKata  = simakState.ayahDataList.reduce((s, a) => s + a.words.length, 0);
  const benar      = simakState.benar;
  const salah      = simakState.salah;
  const skor       = totalKata > 0 ? Math.max(0, Math.round((benar / (benar + salah || 1)) * 100)) : 100;
  const durasi     = Math.round((Date.now() - simakState.startTime) / 1000);

  // Simpan riwayat
  const surahName  = SURAH_DATA[simakState.surahNum - 1].latin;
  const histEntry  = {
    date    : new Date().toLocaleDateString('id-ID'),
    time    : new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}),
    surah   : surahName,
    ayat    : `${simakState.ayatAwal}–${simakState.ayatAkhir}`,
    skor,
    benar,
    salah,
    durasi,
    mode    : simakState.mode,
  };
  simakState.history.unshift(histEntry);
  if (simakState.history.length > 20) simakState.history = simakState.history.slice(0, 20);
  localStorage.setItem('simak_history', JSON.stringify(simakState.history));

  // Tampilkan laporan
  tampilkanLaporan(skor, benar, salah, durasi, totalKata);
}

/* ── Tampilkan Laporan ────────────────────────────────────── */
function tampilkanLaporan(skor, benar, salah, durasi, totalKata) {
  document.getElementById('simakSessionPanel').classList.add('hidden');
  document.getElementById('simakReportPanel').classList.remove('hidden');

  // Score arc animation
  const arc = document.getElementById('simakScoreArc');
  if (arc) {
    const offset = 314 - (skor / 100) * 314;
    arc.style.transition = 'stroke-dashoffset 1.2s ease';
    setTimeout(() => { arc.style.strokeDashoffset = offset; }, 100);
    // Warna berdasar skor
    arc.style.stroke = skor >= 90 ? '#16a34a' : skor >= 70 ? '#d97706' : '#dc2626';
  }

  document.getElementById('simakScoreNum').textContent = skor + '%';

  const grade = skor >= 95 ? '🌟 Mumtaz' : skor >= 85 ? '✨ Jayyid Jiddan' :
                skor >= 75 ? '👍 Jayyid'  : skor >= 60 ? '📗 Maqbul' : '📖 Perlu Latihan';
  document.getElementById('simakScoreGrade').textContent = grade;

  // Durasi format
  const mm = String(Math.floor(durasi / 60)).padStart(2, '0');
  const ss = String(durasi % 60).padStart(2, '0');

  const surahName = SURAH_DATA[simakState.surahNum - 1].latin;
  document.getElementById('simakReportGrid').innerHTML = `
    <div class="simak-report-row"><span class="simak-report-row-lbl">Surah</span><span class="simak-report-row-val" style="font-size:14px">${surahName}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Ayat</span><span class="simak-report-row-val">${simakState.ayatAwal}–${simakState.ayatAkhir}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Total Kata</span><span class="simak-report-row-val">${totalKata}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Kata Benar</span><span class="simak-report-row-val" style="color:#16a34a">${benar}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Kesalahan</span><span class="simak-report-row-val" style="color:#dc2626">${salah}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Durasi</span><span class="simak-report-row-val">${mm}:${ss}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Mode</span><span class="simak-report-row-val" style="font-size:13px">${simakState.mode}</span></div>
    <div class="simak-report-row"><span class="simak-report-row-lbl">Tingkat</span><span class="simak-report-row-val" style="font-size:13px">${simakState.level}</span></div>
  `;

  // Daftar kesalahan
  const errSec = document.getElementById('simakErrorSection');
  if (simakState.errors.length === 0) {
    errSec.innerHTML = `<div style="text-align:center;padding:16px;color:#16a34a;font-weight:700;font-size:14px">🎉 Tidak ada kesalahan! MasyaAllah!</div>`;
  } else {
    const uniq = [];
    const seen = new Set();
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
          <div class="simak-error-note">Yang dibaca: "${e.heard}" — Perlu dilatih lagi</div>
        </div>`).join('')}
      ${uniq.length > 10 ? `<div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:6px">+${uniq.length-10} kesalahan lainnya</div>` : ''}`;
  }

  // Riwayat terbaru
  const histSec = document.getElementById('simakHistorySection').querySelector('#simakHistoryList');
  renderSimakHistoryIn(histSec, 5);
}

/* ── Reset Sesi ───────────────────────────────────────────── */
function resetSimakSession() {
  document.getElementById('simakReportPanel').classList.add('hidden');
  document.getElementById('simakSessionPanel').classList.add('hidden');
  document.getElementById('simakSetupCard').classList.remove('hidden');
  document.getElementById('simakHistoryCard').classList.remove('hidden');
  document.getElementById('simakLogBody').innerHTML = '<div class="simak-log-empty">Log koreksi akan muncul di sini saat sesi berjalan.</div>';
  document.getElementById('simakTranscriptText').innerHTML = '<span class="simak-transcript-placeholder">Suara Anda akan muncul di sini...</span>';
  simakSetOrbState('idle');
  simakSetLabel('AI Guru Siap', 'Atur sesi dan tekan Mulai Simak');
  renderSimakHistory();
}

/* ── Timer ────────────────────────────────────────────────── */
function startSimakTimer() {
  clearInterval(simakState.timerInterval);
  simakState.timerInterval = setInterval(() => {
    if (!simakState.active) return;
    const elapsed = Math.floor((Date.now() - simakState.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    document.getElementById('sstatTimer').textContent = `${mm}:${ss}`;
  }, 1000);
}

/* ── Update Stats ─────────────────────────────────────────── */
function simakUpdateStats() {
  document.getElementById('sstatBenar').textContent = simakState.benar;
  document.getElementById('sstatSalah').textContent = simakState.salah;
  document.getElementById('sstatAyat').textContent  =
    `${simakState.currentIdx + 1}/${simakState.totalAyat}`;
}

/* ── TTS Koreksi AI ───────────────────────────────────────── */
function simakSpeak(text) {
  if (!('speechSynthesis' in window)) return;
  const mode = simakState.mode;

  // Mode kelancaran: AI diam lebih banyak
  if (mode === 'kelancaran' && !text.includes('selesai')) return;

  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang  = SIMAK_TTS_LANG;
  utt.rate  = 0.95;
  utt.pitch = 1.0;
  utt.volume= 1.0;

  // Pilih suara Indonesia jika tersedia
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.startsWith('id'));
  if (idVoice) utt.voice = idVoice;

  window.speechSynthesis.speak(utt);
}

/* ── Orb State ────────────────────────────────────────────── */
function simakSetOrbState(state) {
  const orb  = document.getElementById('simakOrb');
  const icon = document.getElementById('simakOrbIcon');
  if (!orb) return;
  orb.className = `simak-orb ${state}`;
  const iconMap = {
    idle     : 'record_voice_over',
    listening: 'mic',
    correct  : 'check_circle',
    wrong    : 'cancel',
    thinking : 'psychology',
  };
  if (icon) icon.textContent = iconMap[state] || 'mic';
}

function simakSetLabel(label, sub) {
  const l = document.getElementById('simakOrbLabel');
  const s = document.getElementById('simakOrbSub');
  if (l) l.textContent = label;
  if (s) s.textContent = sub;
}

/* ── Add Log ──────────────────────────────────────────────── */
function simakAddLog(type, html, hasArabic = false) {
  const body = document.getElementById('simakLogBody');
  if (!body) return;

  // Hapus empty state
  const empty = body.querySelector('.simak-log-empty');
  if (empty) empty.remove();

  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  const item = document.createElement('div');
  item.className = `simak-log-item ${type}`;
  item.innerHTML = `<span class="simak-log-time">${time}</span><span class="simak-log-txt">${html}</span>`;
  body.appendChild(item);
  body.scrollTop = body.scrollHeight;

  // Max 50 items
  while (body.children.length > 50) body.removeChild(body.firstChild);
}

/* ── Kalkulasi Kemiripan (Levenshtein ratio) ──────────────── */
function calcSimilarity(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const an = normalizeArabic(a), bn = normalizeArabic(b);
  if (an === bn) return 1;
  const dist = levenshtein(an, bn);
  const maxLen = Math.max(an.length, bn.length);
  return maxLen === 0 ? 1 : 1 - (dist / maxLen);
}

function levenshtein(s, t) {
  const m = s.length, n = t.length;
  const d = Array.from({length: m+1}, (_, i) => Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = s[i-1] === t[j-1] ? d[i-1][j-1] : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
  return d[m][n];
}

/* ── Level helpers ────────────────────────────────────────── */
function getLevelThreshold() {
  return { pemula: 0.55, menengah: 0.65, mahir: 0.75, guru: 0.88 }[simakState.level] || 0.65;
}

function getLevelTimeout() {
  return { pemula: 8000, menengah: 6000, mahir: 4000, guru: 3000 }[simakState.level] || 6000;
}

/* ── Render Riwayat ───────────────────────────────────────── */
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
        <div class="simak-hist-meta">${h.date} ${h.time} · ${h.mode} · ${h.benar} benar / ${h.salah} salah</div>
      </div>
    </div>`;
  }).join('');
}

/* ── GLOBAL EXPORTS ───────────────────────────────────────── */
window.switchView        = switchView;
window.openSurah         = openSurah;
window.playAyah          = playAyah;
window.playFullSurah     = playFullSurah;
window.toggleBookmark    = toggleBookmark;
window.deleteBookmark    = deleteBookmark;
window.showShalatInfo    = showShalatInfo;
window.showQiblatInfo    = showQiblatInfo;
window.resetSimakSession = resetSimakSession;
