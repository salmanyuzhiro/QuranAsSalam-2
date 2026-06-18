/* ============================================================
   AL QUR'AN AS SALAM — script.js
   Fitur: Putar ayat, auto-next surah, repeat, bookmark,
          dark mode, font size, qari, progress bar,
          putar saat layar mati (Media Session API),
          lanjut surah berikutnya otomatis.
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

// App state
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
let ayahCache         = {};  // cache per surah

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
    '01':'Alafasy_128kbps',
    '02':'Abdul_Basit_Murattal_192kbps',
    '03':'Minshawi_Murattal_128kbps',
    '04':'Hani_Rifai_192kbps',
    '05':'Maher_AlMuaiqly_128kbps',
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

/* ── INIT ─────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  audio = document.getElementById('main-audio-element');
  // Splash
  setTimeout(() => {

  const sp = document.getElementById('splash-screen');

  if(sp){
    sp.style.opacity = '0';

    setTimeout(() => {
      sp.classList.add('hidden');
    }, 600);
  }

}, 2000);

  applySettings();
  renderPopularSurah();
  renderLastRead();
  setupNav();
  setupDrawer();
  setupAudioPlayer();
  setupMediaSession();

  // Shortcut cards
  document.getElementById('quick-surah').addEventListener('click', () => switchView('surah-list'));
  document.getElementById('quick-shalat').addEventListener('click', () => showShalatInfo());
  document.getElementById('quick-qiblat').addEventListener('click', () => showQiblatInfo());

  // Settings listeners
  document.getElementById('dark-mode-toggle').addEventListener('change', e => {
    settings.dark = e.target.checked;
    document.body.classList.toggle('dark', settings.dark);
    saveSettings();
  });
  document.getElementById('show-latin').addEventListener('change', e => {
    settings.showLatin = e.target.checked;
    saveSettings();
    if(currentAyahData.length) renderAyahList(currentAyahData);
  });
  document.getElementById('translation-toggle').addEventListener('change', e => {
    settings.showTranslation = e.target.checked;
    saveSettings();
    if(currentAyahData.length) renderAyahList(currentAyahData);
  });
  document.getElementById('font-size-select').addEventListener('change', e => {
    settings.fontSize = e.target.value;
    saveSettings();
    document.querySelectorAll('.arabic-text').forEach(el => el.style.fontSize = settings.fontSize);
  });
  document.getElementById('qari-select').addEventListener('change', e => {
    settings.qari = e.target.value;
    saveSettings();
    stopAudio();
  });

  // Range play
  document.getElementById('btn-play-range').addEventListener('click', playRange);
  document.getElementById('btn-play-full-audio').addEventListener('click', () => {
    isRangeMode = false;
    playAyah(0);
  });

  // Last read continue
  document.getElementById('lr-continue-btn')?.addEventListener('click', () => {
    if(!lastRead) return;
    openSurah(lastRead.surahNum, lastRead.ayahNum - 1);
  });
});

/* ── APPLY SAVED SETTINGS ─────────────────────────────────── */
function applySettings(){

  if(settings.dark){
    document.body.classList.add('dark');
  }

  const darkToggle = document.getElementById('dark-mode-toggle');
  if(darkToggle){
    darkToggle.checked = !!settings.dark;
  }

  const latinToggle = document.getElementById('show-latin');
  if(latinToggle){
    latinToggle.checked = settings.showLatin !== false;
  }

  const transToggle = document.getElementById('translation-toggle');
  if(transToggle){
    transToggle.checked = settings.showTranslation !== false;
  }

  const fontSelect = document.getElementById('font-size-select');
  if(fontSelect){
    fontSelect.value = settings.fontSize || '28px';
  }

  const qariSelect = document.getElementById('qari-select');
  if(qariSelect){
    qariSelect.value = settings.qari || '01';
  }

}

/* ── NAVIGATION ───────────────────────────────────────────── */
function setupNav(){
  const navMap = {
    'nav-home':     'home',
    'nav-surah':    'surah-list',
    'nav-audio':    'audio-surah',
    'nav-bookmark': 'bookmark',
    'nav-settings': 'settings',
  };
  Object.entries(navMap).forEach(([id, view]) => {
    document.getElementById(id)?.addEventListener('click', e => {
      e.preventDefault();
      switchView(view);
    });
  });
}

function switchView(view){
  const all = ['home','surah-list','surah-detail','audio-surah','page-audio','bookmark','settings'];
  all.forEach(v => {
    const el = document.getElementById(`${v}-view`);
    if(el) el.classList.add('hidden');
  });
  const target = document.getElementById(`${view}-view`);
  if(target) target.classList.remove('hidden');

  // Update bottom nav active
  document.querySelectorAll('.bottom-nav a').forEach(a => a.classList.remove('active'));
  const navIdMap = {
    'home':         'nav-home',
    'surah-list':   'nav-surah',
    'audio-surah':  'nav-audio',
    'bookmark':     'nav-bookmark',
    'settings':     'nav-settings',
  };
  if(navIdMap[view]) document.getElementById(navIdMap[view])?.classList.add('active');

  // Update drawer active
  document.querySelectorAll('.drawer-menu li').forEach(li => li.classList.remove('active-menu'));
  const drawerIdMap = {
    'home':        'drawer-home',
    'surah-list':  'drawer-surah',
    'audio-surah': 'drawer-audio',
    'bookmark':    'drawer-bookmark',
    'settings':    'drawer-settings',
  };
  if(drawerIdMap[view]) document.getElementById(drawerIdMap[view])?.classList.add('active-menu');

  // Lazy render views
  if(view === 'surah-list')   renderSurahList();
  if(view === 'audio-surah')  renderAudioList();
  if(view === 'bookmark')     renderBookmarks();

  window.scrollTo({top:0, behavior:'smooth'});
  closeDrawer();
}

/* ── DRAWER ───────────────────────────────────────────────── */
function setupDrawer(){
  document.getElementById('hamburger-btn').addEventListener('click', () => {
    document.getElementById('drawer').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
  });
  document.getElementById('overlay').addEventListener('click', closeDrawer);

  document.getElementById('drawer-home').addEventListener('click',     () => switchView('home'));
  document.getElementById('drawer-surah').addEventListener('click',    () => switchView('surah-list'));
  document.getElementById('drawer-audio').addEventListener('click',    () => switchView('audio-surah'));
  document.getElementById('drawer-bookmark').addEventListener('click', () => switchView('bookmark'));
  document.getElementById('drawer-settings').addEventListener('click', () => switchView('settings'));
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
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

function showShalatInfo(){

  if(!navigator.geolocation){
    alert("GPS tidak didukung di perangkat ini");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    function(position){

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      alert(
        "Lokasi berhasil ditemukan\n\n" +
        "Latitude : " + lat +
        "\nLongitude : " + lon +
        "\n\nSiap digunakan untuk Jadwal Shalat"
      );

    },

    function(error){

      alert(
        "Aplikasi memerlukan izin lokasi.\n\n" +
        "Aktifkan GPS lalu pilih IZINKAN."
      );

    },

    {
      enableHighAccuracy:true,
      timeout:10000,
      maximumAge:0
    }

  );

}

function showQiblatInfo(){

  if(!navigator.geolocation){
    alert("GPS tidak didukung di perangkat ini");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    function(position){

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      alert(
        "Lokasi berhasil ditemukan\n\n" +
        "Latitude : " + lat +
        "\nLongitude : " + lon +
        "\n\nSiap digunakan untuk Arah Kiblat"
      );

    },

    function(error){

      alert(
        "Aplikasi memerlukan izin lokasi.\n\n" +
        "Aktifkan GPS lalu pilih IZINKAN."
      );

    },

    {
      enableHighAccuracy:true,
      timeout:10000,
      maximumAge:0
    }

  );

}


/* ── SURAH LIST ───────────────────────────────────────────── */
function renderSurahList(filter=''){
  const container = document.getElementById('quranPage');
  const q = filter.toLowerCase();
  const list = SURAH_DATA.filter(s =>
    s.latin.toLowerCase().includes(q) ||
    s.arti.toLowerCase().includes(q)  ||
    s.ar.includes(filter) ||
    String(s.n).includes(filter)
  );
  if(!list.length){
    container.innerHTML = `<div class="empty-card"><span class="material-icons">search_off</span><p>Surah tidak ditemukan</p></div>`;
    return;
  }
  container.innerHTML = list.map(s => `
    <div class="surah-card" onclick="openSurah(${s.n})">
      <div class="surah-number">${s.n}</div>
      <div class="surah-info">
        <h3>${s.latin}</h3>
        <p>${s.arti} · ${s.ayat} Ayat</p>
      </div>
      <div class="surah-right">
        <div class="surah-arab">${s.ar}</div>
        <span class="surah-type-badge">${s.type}</span>
      </div>
    </div>`).join('');
}

document.getElementById('search-surah-input')?.addEventListener('input', e => {
  renderSurahList(e.target.value);
});

/* ── AUDIO MUROTTAL LIST ──────────────────────────────────── */
function renderAudioList(){
  const container = document.getElementById('surahAudioPage');
  container.innerHTML = SURAH_DATA.map(s => `
    <div class="audio-surah-card" onclick="playFullSurah(${s.n})">
      <div class="audio-num-wrap">${s.n}</div>
      <div class="audio-info">
        <h3>${s.latin}</h3>
        <p>${s.arti} · ${s.ayat} Ayat · ${s.type}</p>
      </div>
      <div class="audio-arab">${s.ar}</div>
      <span class="material-icons audio-play-icon">play_circle</span>
    </div>`).join('');
}

function playFullSurah(surahNum){
  currentSurahNum = surahNum;
  isRangeMode = false;
  fetchAyahData(surahNum).then(data => {
    currentAyahData = data;
    currentAyahIndex = 0;
    repeatCount = 1; repeatDone = 0;
    playAyah(0);
    showPlayer();
  });
}

/* ── OPEN SURAH (READ) ────────────────────────────────────── */
function openSurah(surahNum, startIndex = 0){
  const s = SURAH_DATA[surahNum - 1];
  currentSurahNum = surahNum;

  // Banner
  document.getElementById('detail-banner-latin').textContent = s.latin;
  document.getElementById('detail-banner-info').textContent  = `${s.arti} · ${s.ayat} Ayat · Juz — · ${s.type}`;
  document.getElementById('detail-banner-arab').textContent  = s.ar;

  // Fill selects
  const fromSel = document.getElementById('audio-from-ayah');
  const toSel   = document.getElementById('audio-to-ayah');
  fromSel.innerHTML = '';
  toSel.innerHTML   = '';
  for(let i = 1; i <= s.ayat; i++){
    fromSel.innerHTML += `<option value="${i}">${i}</option>`;
    toSel.innerHTML   += `<option value="${i}" ${i===s.ayat?'selected':''}>${i}</option>`;
  }

  switchView('surah-detail');

  const container = document.getElementById('ayah-list-container');
  container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted)">
    <span class="material-icons" style="font-size:36px;display:block;margin-bottom:8px;opacity:0.4">hourglass_top</span>
    Memuat ayat...
  </div>`;

  fetchAyahData(surahNum).then(data => {
    currentAyahData = data;
    renderAyahList(data);
    if(startIndex > 0){
      setTimeout(() => {
        const el = document.querySelector(`.ayah-card[data-index="${startIndex}"]`);
        if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
      }, 300);
    }
  });
}

/* ── FETCH AYAH DATA ──────────────────────────────────────── */
async function fetchAyahData(surahNum){
  if(ayahCache[surahNum]) return ayahCache[surahNum];
  try {
    const res  = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,id.indonesian,en.transliteration`);
    const json = await res.json();
    const arabic  = json.data[0].ayahs;
    const trans   = json.data[1].ayahs;
    const latin   = json.data[2].ayahs;
    const data = arabic.map((a,i) => ({
      number:      a.numberInSurah,
      arabic:      a.text,
      translation: trans[i]?.text || '',
      latin:       latin[i]?.text || '',
    }));
    ayahCache[surahNum] = data;
    return data;
  } catch(e) {
    console.warn('API error, using fallback', e);
    return Array.from({length: SURAH_DATA[surahNum-1].ayat}, (_,i) => ({
      number: i+1,
      arabic: '﴿ تحميل... ﴾',
      translation: 'Koneksi internet diperlukan untuk memuat ayat.',
      latin: '',
    }));
  }
}

/* ── RENDER AYAH LIST ─────────────────────────────────────── */
function renderAyahList(data){
  const showLatin  = settings.showLatin !== false;
  const showTrans  = settings.showTranslation !== false;
  const fontSize   = settings.fontSize || '28px';
  const surahNum   = currentSurahNum;
  const s          = SURAH_DATA[surahNum-1];

  const container = document.getElementById('ayah-list-container');
  let html = '';

  // Bismillah (except At-Taubah & Al-Fatihah already includes)
  if(surahNum !== 9 && surahNum !== 1){
    html += `<div class="bismillah-card">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>`;
  }

  html += data.map((a, i) => {
    const isBm = bookmarks.some(b => b.surah===surahNum && b.ayah===a.number);
    return `
    <div class="ayah-card" data-index="${i}" data-ayah="${a.number}">
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
            <option value="1">1x</option>
            <option value="3">3x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
          </select>
        </div>
      </div>
      <div class="arabic-text" style="font-size:${fontSize}">${a.arabic}</div>
      ${showLatin ? `<div class="latin-text">${a.latin}</div>` : ''}
      ${showTrans ? `<div class="translation-text">${a.translation}</div>` : ''}
    </div>`;
  }).join('');

  container.innerHTML = html;
}

/* ── AUDIO PLAYBACK ───────────────────────────────────────── */
function setupAudioPlayer(){
  // Progress bar update
  audio.addEventListener('timeupdate', () => {
    if(!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-bar').value = pct;
    document.getElementById('prog-current').textContent  = fmtTime(audio.currentTime);
    document.getElementById('prog-duration').textContent = fmtTime(audio.duration);
  });

  // Seek
  document.getElementById('progress-bar').addEventListener('input', e => {
    if(audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
  });

  // Controls
  document.getElementById('btn-play-pause').addEventListener('click', togglePlayPause);
  document.getElementById('btn-prev-ayah').addEventListener('click', () => {
    if(currentAyahIndex > 0) playAyah(currentAyahIndex - 1);
  });
  document.getElementById('btn-next-ayah').addEventListener('click', () => {
    advanceToNext();
  });

  // Auto next
  audio.addEventListener('ended', handleAudioEnded);
}

function handleAudioEnded(){
  repeatDone++;
  const sel = document.getElementById(`repeat-${currentAyahIndex}`);
  const thisRepeat = isRangeMode
    ? repeatCount
    : (sel ? parseInt(sel.value) : 1);

  if(repeatDone < thisRepeat){
    // repeat same ayah
    audio.currentTime = 0;
    audio.play().catch(()=>{});
    return;
  }
  repeatDone = 0;
  advanceToNext();
}

function advanceToNext(){
  if(!currentAyahData.length) return;

  if(isRangeMode){
    // range mode: check if reached end of range
    const currentAyahNum = currentAyahData[currentAyahIndex]?.number;
    if(currentAyahNum >= rangeTo){
      // range done, stop
      stopAudio();
      return;
    }
  }

  const nextIndex = currentAyahIndex + 1;

  if(nextIndex < currentAyahData.length){
    playAyah(nextIndex);
  } else {
    // End of surah → try next surah
    const nextSurah = currentSurahNum + 1;
    if(nextSurah <= 114){
      autoLoadNextSurah(nextSurah);
    } else {
      stopAudio();
    }
  }
}

function autoLoadNextSurah(surahNum){
  currentSurahNum = surahNum;
  updatePlayerTitle(`Memuat ${SURAH_DATA[surahNum-1].latin}...`);
  fetchAyahData(surahNum).then(data => {
    currentAyahData = data;
    currentAyahIndex = 0;
    repeatDone = 0;
    // Update banner if surah-detail is visible
    const s = SURAH_DATA[surahNum-1];
    document.getElementById('detail-banner-latin').textContent = s.latin;
    document.getElementById('detail-banner-arab').textContent  = s.ar;
    playAyah(0);
  });
}

function playAyah(index){
  if(!currentAyahData.length) return;
  if(index < 0 || index >= currentAyahData.length) return;

  currentAyahIndex = index;
  repeatDone = 0;

  const ayah = currentAyahData[index];
  const url  = audioUrl(currentSurahNum, ayah.number);
  const s    = SURAH_DATA[currentSurahNum - 1];

  audio.src = url;
  audio.play().then(() => {
    isPlaying = true;
    updatePlayerTitle(`${s.latin} · Ayat ${ayah.number}`);
    document.getElementById('audio-player-sub').textContent = s.ar;
    showPlayer();
    highlightAyah(index);
    updatePlayPauseBtn(true);
    updateMediaSession(s.latin, ayah.number);
    saveLastRead(currentSurahNum, ayah.number);
    renderLastRead();
  }).catch(err => console.warn('Play error:', err));
}

function playRange(){
  const fromSel   = document.getElementById('audio-from-ayah');
  const toSel     = document.getElementById('audio-to-ayah');
  const repeatSel = document.getElementById('audio-repeat-count');

  rangeFrom   = parseInt(fromSel.value);
  rangeTo     = parseInt(toSel.value);
  repeatCount = parseInt(repeatSel.value);
isRangeMode = true;
  repeatDone  = 0;
  isRangeMode = true;

  if(!currentAyahData.length){
    fetchAyahData(currentSurahNum).then(data => {
      currentAyahData = data;
      const idx = data.findIndex(a => a.number === rangeFrom);
      playAyah(idx >= 0 ? idx : 0);
    });
    return;
  }
  const idx = currentAyahData.findIndex(a => a.number === rangeFrom);
  playAyah(idx >= 0 ? idx : 0);
}

function handleAudioEndedRange(){
  // overrides global—handled via isRangeMode flag in handleAudioEnded
}

function togglePlayPause(){
  if(audio.paused){
    audio.play().then(() => { isPlaying=true; updatePlayPauseBtn(true); });
  } else {
    audio.pause();
    isPlaying=false;
    updatePlayPauseBtn(false);
  }
}

function stopAudio(){
  audio.pause();
  audio.src = '';
  isPlaying = false;
  updatePlayPauseBtn(false);
  clearHighlight();
}

function updatePlayPauseBtn(playing){
  const btn = document.getElementById('btn-play-pause');
  btn.innerHTML = `<span class="material-icons">${playing?'pause':'play_arrow'}</span>`;
}

function updatePlayerTitle(text){
  document.getElementById('audio-player-title').textContent = text;
}

function showPlayer(){
  document.getElementById('global-audio-player').classList.remove('hidden');
}

function highlightAyah(index){
  clearHighlight();
  const card = document.querySelector(`.ayah-card[data-index="${index}"]`);
  if(card){
    card.classList.add('playing');
    card.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

function clearHighlight(){
  document.querySelectorAll('.ayah-card.playing').forEach(el => el.classList.remove('playing'));
}

/* ── MEDIA SESSION (Putar saat layar mati) ────────────────── */
function setupMediaSession(){
  if(!('mediaSession' in navigator)) return;

  navigator.mediaSession.setActionHandler('play', () => {
    audio.play();
    isPlaying = true;
    updatePlayPauseBtn(true);
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    audio.pause();
    isPlaying = false;
    updatePlayPauseBtn(false);
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    if(currentAyahIndex > 0) playAyah(currentAyahIndex - 1);
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    advanceToNext();
  });
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  navigator.mediaSession.setActionHandler('seekforward', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });
}

function updateMediaSession(surahName, ayahNum){
  if(!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title:  `${surahName} · Ayat ${ayahNum}`,
    artist: 'Al Qur\'an As Salam',
    album:  'Murottal Al Qur\'an',
    artwork: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/The_Holy_Quran.jpg/480px-The_Holy_Quran.jpg', sizes: '480x480', type: 'image/jpeg' }
    ]
  });
  navigator.mediaSession.playbackState = 'playing';
}

/* ── BOOKMARKS ────────────────────────────────────────────── */
function toggleBookmark(surahNum, ayahNum, surahName){
  const idx = bookmarks.findIndex(b => b.surah===surahNum && b.ayah===ayahNum);
  if(idx >= 0){
    bookmarks.splice(idx,1);
  } else {
    bookmarks.push({surah:surahNum, ayah:ayahNum, name:surahName, saved: new Date().toLocaleDateString('id-ID')});
  }
  saveBookmarks();
  // re-render ayah list buttons
  if(currentAyahData.length) renderAyahList(currentAyahData);
}

function renderBookmarks(){
  const container = document.getElementById('bookmarkPage');
  if(!bookmarks.length){
    container.innerHTML = `<div class="empty-card">
      <span class="material-icons">bookmark_border</span>
      <p>Belum ada markah tersimpan</p>
      <p style="font-size:12px;margin-top:6px">Tap ikon bookmark di ayat untuk menyimpan</p>
    </div>`;
    return;
  }
  container.innerHTML = bookmarks.map((b,i) => `
    <div class="bookmark-item" onclick="openSurah(${b.surah})">
      <div class="bm-icon"><span class="material-icons">bookmark</span></div>
      <div class="bm-info">
        <h4>${b.name} · Ayat ${b.ayah}</h4>
        <p>Surah ke-${b.surah} · Disimpan ${b.saved}</p>
      </div>
      <button class="bm-del" onclick="event.stopPropagation();deleteBookmark(${i})" title="Hapus">
        <span class="material-icons">delete_outline</span>
      </button>
    </div>`).join('');
}

function deleteBookmark(i){
  bookmarks.splice(i,1);
  saveBookmarks();
  renderBookmarks();
}

/* ── UTILS ────────────────────────────────────────────────── */
// expose switchView globally (used in onclick HTML)
window.switchView       = switchView;
window.openSurah        = openSurah;
window.playAyah         = playAyah;
window.playFullSurah    = playFullSurah;
window.toggleBookmark   = toggleBookmark;
window.deleteBookmark   = deleteBookmark;
