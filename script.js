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

/* ── Init Simak (dipanggil saat DOMContentLoaded) ─────────── */
function initSimak() {
  loadTTSVoices();

  const sel = document.getElementById('simakSurahSelect');
  if (!sel) return;
  SURAH_DATA.forEach(s => {
    sel.innerHTML += `<option value="${s.n}">${s.n}. ${s.latin} (${s.ar})</option>`;
  });

  sel.addEventListener('change', () => {
    const s = SURAH_DATA[parseInt(sel.value) - 1];
    const aw = document.getElementById('simakAyatAwal');
    const ak = document.getElementById('simakAyatAkhir');
    if (aw) aw.max = s.ayat;
    if (ak) { ak.max = s.ayat; ak.value = Math.min(parseInt(ak.value)||s.ayat, s.ayat); }
  });

  document.getElementById('simakBtnStart')?.addEventListener('click', mulaiSimak);
  document.getElementById('simakBtnStop')?.addEventListener('click', hentikanSimak);
  document.getElementById('simakBtnPrev')?.addEventListener('click', () => simakPindahAyat(-1));
  document.getElementById('simakBtnNext')?.addEventListener('click', () => simakPindahAyat(1));

  renderSimakHistory();
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
window.resetSimakSession   = resetSimakSession;
window.jawabanBantuan      = jawabanBantuan;
window.showDownloadPanel   = showDownloadPanel;
window.playOnlineSurahQari = playOnlineSurahQari;
window.playOnlineAyah      = playOnlineAyah;
window.downloadAyahDirect  = downloadAyahDirect;
window.downloadSingleAyah  = downloadSingleAyah;
window.downloadFullSurah   = downloadFullSurah;
