/* =====================================================
   Al Qur'an As Salam — script.js
   Versi: 2.1 — Fixed API Fields
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   1. KONFIGURASI API
   Menggunakan equran.id/api/v2 sebagai primary
   Fallback: api.quran.gading.dev
───────────────────────────────────────────────────── */
const API_PRIMARY  = 'https://equran.id/api/v2';
const API_FALLBACK = 'https://api.quran.gading.dev';

// Map qari ke edition string islamic.network CDN
const QARI_MAP = {
  '01': 'ar.alafasy',
  '02': 'ar.abdulbasitmurattal',
  '03': 'ar.minshawi',
  '04': 'ar.hanirifai',
  '05': 'ar.mahermuaiqly',
};

// Map qari ke folder everyayah.com CDN (format folder berbeda)
const EVERYAYAH_MAP = {
  '01': 'Alafasy_128kbps',
  '02': 'AbdulSamad_128kbps_ketabasic',
  '03': 'Menshawi_16kbps',
  '04': 'Hani_Rifai_128kbps',
  '05': 'Maher_AlMuaiqly_128kbps',
};

/* ─────────────────────────────────────────────────────
   2. NORMALISASI DATA API
   Konversi berbagai format API → format internal standar
───────────────────────────────────────────────────── */

/**
 * Normalisasi satu item surah dari API manapun
 * ke format internal: { nomor, nama, namaLatin, arti, jumlahAyat, tempatTurun }
 */
function normalizeSurah(raw) {
  // equran.id/api/v2
  if (raw.nomor !== undefined && raw.namaLatin !== undefined) {
    return {
      nomor       : raw.nomor,
      nama        : raw.nama        || raw.namaArab || '',
      namaLatin   : raw.namaLatin   || '',
      arti        : raw.arti        || raw.artiNama || '',
      jumlahAyat  : raw.jumlahAyat  || raw.jumlahayat || 0,
      tempatTurun : raw.tempatTurun || raw.tempat || '',
    };
  }
  // quran.gading.dev — wrapper { nomor, nama, namaLatin, arti, jumlahAyat, tempatTurun }
  if (raw.nomor !== undefined && raw.nama !== undefined) {
    return {
      nomor       : raw.nomor,
      nama        : raw.nama || '',
      namaLatin   : raw.namaLatin   || raw.nama_latin || raw.latin || '',
      arti        : raw.arti        || raw.artinya || raw.translation || '',
      jumlahAyat  : raw.jumlahAyat  || raw.count || raw.number_of_ayah || 0,
      tempatTurun : raw.tempatTurun || raw.type || '',
    };
  }
  // al-quran.id gaya lain
  return {
    nomor       : raw.number || raw.id || 0,
    nama        : raw.name?.arabic || raw.nama || '',
    namaLatin   : raw.name?.transliteration?.id || raw.name?.latin || raw.namaLatin || '',
    arti        : raw.name?.translation?.id     || raw.arti || '',
    jumlahAyat  : raw.numberOfVerses || raw.jumlahAyat || 0,
    tempatTurun : raw.revelation?.id            || raw.tempatTurun || '',
  };
}

/**
 * Normalisasi satu ayat dari API manapun
 * ke format internal: { nomorAyat, teksArab, teksLatin, teksIndonesia }
 */
function normalizeAyah(raw, index) {
  // equran.id/api/v2 — { nomorAyat, teksArab, teksLatin, teksIndonesia }
  if (raw.nomorAyat !== undefined) {
    return {
      nomorAyat     : raw.nomorAyat,
      teksArab      : raw.teksArab      || '',
      teksLatin     : raw.teksLatin     || '',
      teksIndonesia : raw.teksIndonesia || '',
    };
  }
  // quran.gading.dev — { nomorAyat, teksArab, teksLatin, teksIndonesia }
  if (raw.nomorAyat !== undefined || raw.nomor !== undefined) {
    return {
      nomorAyat     : raw.nomorAyat || raw.nomor || index + 1,
      teksArab      : raw.teksArab  || raw.ar    || raw.arab   || '',
      teksLatin     : raw.teksLatin || raw.latin  || '',
      teksIndonesia : raw.teksIndonesia || raw.id || raw.idn || '',
    };
  }
  // al-quran.id gaya lain — { number, arab, read, translation }
  return {
    nomorAyat     : raw.number || raw.verse || index + 1,
    teksArab      : raw.arab   || raw.text?.arab || raw.text?.arabic || '',
    teksLatin     : raw.read   || raw.text?.transliteration?.en || '',
    teksIndonesia : raw.translation?.id || raw.translation || '',
  };
}

/* ─────────────────────────────────────────────────────
   3. STATE APLIKASI
───────────────────────────────────────────────────── */
const state = {
  currentSurah : null,
  ayahData     : [],
  bookmarks    : JSON.parse(localStorage.getItem('bookmarks') || '[]'),
  lastRead     : JSON.parse(localStorage.getItem('lastRead')  || 'null'),
  settings     : JSON.parse(localStorage.getItem('settings')  || JSON.stringify({
    darkMode   : false,
    showLatin  : true,
    showTrans  : true,
    fontSize   : '28px',
    qari       : '01',
  })),
  audio: {
    currentAyah : 0,
    toAyah      : 0,
    repeatCount : 1,
    repeatLeft  : 1,
    isRange     : false,
  },
  apiMode: 'primary', // 'primary' | 'fallback'
};

/* ─────────────────────────────────────────────────────
   4. DOM CACHE
───────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const el = {
  splash        : $('splash-screen'),
  headerTitle   : $('app-header-title'),
  headerSub     : $('app-header-subtitle'),
  hamburger     : $('hamburger-btn'),
  drawer        : $('drawer'),
  overlay       : $('overlay'),

  homeView      : $('home-view'),
  surahListView : $('surah-list-view'),
  surahDetail   : $('surah-detail-view'),
  audioView     : $('audio-surah-view'),
  bookmarkView  : $('bookmark-view'),
  settingsView  : $('settings-view'),

  quickSurah    : $('quick-surah'),
  quickShalat   : $('quick-shalat'),
  quickQiblat   : $('quick-qiblat'),

  searchInput   : $('search-surah-input'),
  quranPage     : $('quranPage'),

  bannerLatin   : $('detail-banner-latin'),
  bannerInfo    : $('detail-banner-info'),
  bannerArab    : $('detail-banner-arab'),
  btnPlayFull   : $('btn-play-full-audio'),
  ayahContainer : $('ayah-list-container'),
  audioFromAyah : $('audio-from-ayah'),
  audioToAyah   : $('audio-to-ayah'),
  audioRepeat   : $('audio-repeat-count'),
  btnPlayRange  : $('btn-play-range'),

  surahAudioPage: $('surahAudioPage'),
  bookmarkPage  : $('bookmarkPage'),

  darkToggle    : $('dark-mode-toggle'),
  latinToggle   : $('show-latin'),
  transToggle   : $('translation-toggle'),
  fontSelect    : $('font-size-select'),
  qariSelect    : $('qari-select'),

  globalPlayer  : $('global-audio-player'),
  audioElem     : $('main-audio-element'),
  playerTitle   : $('audio-player-title'),

  navHome       : $('nav-home'),
  navSurah      : $('nav-surah'),
  navBookmark   : $('nav-bookmark'),
  navSettings   : $('nav-settings'),

  dHome         : $('drawer-home'),
  dSurah        : $('drawer-surah'),
  dAudio        : $('drawer-audio'),
  dBookmark     : $('drawer-bookmark'),
  dSettings     : $('drawer-settings'),
};

/* ─────────────────────────────────────────────────────
   5. UTILITAS
───────────────────────────────────────────────────── */
function saveSettings() { localStorage.setItem('settings', JSON.stringify(state.settings)); }
function saveBookmarks() { localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); }
function saveLastRead(surahNum, ayahNum, surahName) {
  state.lastRead = { surahNum, ayahNum, surahName, ts: Date.now() };
  localStorage.setItem('lastRead', JSON.stringify(state.lastRead));
}

function toast(msg, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  div.innerHTML = `<span class="material-icons">${icons[type] || 'info'}</span> ${msg}`;
  document.body.appendChild(div);
  requestAnimationFrame(() => div.classList.add('show'));
  setTimeout(() => { div.classList.remove('show'); setTimeout(() => div.remove(), 400); }, 2800);
}

function showLoading(container, msg = 'Memuat data...') {
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>${msg}</p>
    </div>`;
}

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'default' });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

/* ─────────────────────────────────────────────────────
   6. FETCH DENGAN FALLBACK
───────────────────────────────────────────────────── */
async function fetchSurahList() {
  // Coba primary: equran.id
  try {
    const data = await fetchJSON(`${API_PRIMARY}/surat`);
    // equran.id returns { code, message, data: [...] }
    const list = data.data || data;
    if (!Array.isArray(list) || list.length === 0) throw new Error('Empty list');
    state.apiMode = 'primary';
    return list.map(normalizeSurah);
  } catch (e1) {
    console.warn('Primary API gagal, coba fallback:', e1.message);
  }
  // Fallback: quran.gading.dev
  try {
    const data = await fetchJSON(`${API_FALLBACK}/surah`);
    const list = data.data || data;
    if (!Array.isArray(list) || list.length === 0) throw new Error('Empty fallback list');
    state.apiMode = 'fallback';
    return list.map(normalizeSurah);
  } catch (e2) {
    console.error('Semua API gagal:', e2.message);
    throw new Error('Tidak dapat memuat daftar surah. Cek koneksi internet.');
  }
}

async function fetchSurahDetail(nomor) {
  if (state.apiMode === 'primary') {
    try {
      const data = await fetchJSON(`${API_PRIMARY}/surat/${nomor}`);
      const raw  = data.data || data;
      const surah = normalizeSurah(raw);
      // equran.id menyimpan ayat di raw.ayat
      const ayat = (raw.ayat || raw.verses || []).map((a, i) => normalizeAyah(a, i));
      return { surah, ayat };
    } catch (e) {
      console.warn('Primary detail gagal:', e.message);
      state.apiMode = 'fallback';
    }
  }
  // fallback
  const data = await fetchJSON(`${API_FALLBACK}/surah/${nomor}`);
  const raw  = data.data || data;
  const surah = normalizeSurah(raw);
  const ayat  = (raw.ayat || raw.ayahs || []).map((a, i) => normalizeAyah(a, i));
  return { surah, ayat };
}

/* ─────────────────────────────────────────────────────
   7. VIEW MANAGER
───────────────────────────────────────────────────── */
const views = {
  home    : el.homeView,
  surah   : el.surahListView,
  detail  : el.surahDetail,
  audio   : el.audioView,
  bookmark: el.bookmarkView,
  settings: el.settingsView,
};

function switchView(name) {
  Object.values(views).forEach(v => v.classList.add('hidden'));
  if (views[name]) views[name].classList.remove('hidden');

  const titles = {
    home    : ["Al Qur'an As Salam", 'Aplikasi Al Qur\'an Digital'],
    surah   : ['Daftar Surah', '114 Surah Al Qur\'an'],
    detail  : [state.currentSurah?.namaLatin || 'Baca Surah', 'Membaca Al Qur\'an'],
    audio   : ['Audio Murottal', 'Dengarkan Murottal'],
    bookmark: ['Markah Simpanan', 'Ayat yang disimpan'],
    settings: ['Setelan', 'Kustomisasi tampilan'],
  };
  const [title, sub] = titles[name] || ["Al Qur'an As Salam", ''];
  el.headerTitle.textContent = title;
  el.headerSub.textContent   = sub;

  document.querySelectorAll('.bottom-nav a').forEach(a => a.classList.remove('active'));
  const navMap = { home: el.navHome, surah: el.navSurah, bookmark: el.navBookmark, settings: el.navSettings };
  if (navMap[name]) navMap[name].classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'surah')    renderSurahList();
  if (name === 'audio')    renderAudioList();
  if (name === 'bookmark') renderBookmarks();
}

/* ─────────────────────────────────────────────────────
   8. SPLASH SCREEN
───────────────────────────────────────────────────── */
function hideSplash() {
  setTimeout(() => {
    el.splash.style.opacity = '0';
    setTimeout(() => el.splash.classList.add('hidden'), 500);
  }, 1800);
}

/* ─────────────────────────────────────────────────────
   9. DRAWER
───────────────────────────────────────────────────── */
function openDrawer()  { el.drawer.classList.add('active');    el.overlay.classList.add('active'); }
function closeDrawer() { el.drawer.classList.remove('active'); el.overlay.classList.remove('active'); }

/* ─────────────────────────────────────────────────────
   10. SETTINGS
───────────────────────────────────────────────────── */
function applySettings() {
  const s = state.settings;
  document.body.classList.toggle('dark', s.darkMode);
  el.darkToggle.checked  = s.darkMode;
  el.latinToggle.checked = s.showLatin;
  el.transToggle.checked = s.showTrans;
  el.fontSelect.value    = s.fontSize;
  el.qariSelect.value    = s.qari;
  document.documentElement.style.setProperty('--arab-font-size', s.fontSize);
  document.querySelectorAll('.latin-text').forEach(e => e.style.display = s.showLatin ? '' : 'none');
  document.querySelectorAll('.translation-text').forEach(e => e.style.display = s.showTrans ? '' : 'none');
}

function initSettings() {
  el.darkToggle.addEventListener('change', () => {
    state.settings.darkMode = el.darkToggle.checked; saveSettings(); applySettings();
  });
  el.latinToggle.addEventListener('change', () => {
    state.settings.showLatin = el.latinToggle.checked; saveSettings(); applySettings();
  });
  el.transToggle.addEventListener('change', () => {
    state.settings.showTrans = el.transToggle.checked; saveSettings(); applySettings();
  });
  el.fontSelect.addEventListener('change', () => {
    state.settings.fontSize = el.fontSelect.value; saveSettings(); applySettings();
  });
  el.qariSelect.addEventListener('change', () => {
    state.settings.qari = el.qariSelect.value; saveSettings();
    toast('Qari berhasil diganti', 'success');
  });
}

/* ─────────────────────────────────────────────────────
   11. DAFTAR SURAH
───────────────────────────────────────────────────── */
let surahListCache = null;

async function renderSurahList(query = '') {
  if (!surahListCache) {
    showLoading(el.quranPage, 'Memuat daftar surah...');
    try {
      surahListCache = await fetchSurahList();
    } catch (err) {
      el.quranPage.innerHTML = `
        <div class="empty-card">
          <span class="material-icons">wifi_off</span>
          <p>${err.message}</p>
          <button onclick="surahListCache=null;renderSurahList()" style="margin-top:12px;padding:8px 16px;background:var(--primary-color);color:white;border:none;border-radius:8px;cursor:pointer">Coba Lagi</button>
        </div>`;
      return;
    }
  }

  const q = (query || '').trim().toLowerCase();
  const filtered = q
    ? surahListCache.filter(s =>
        (s.namaLatin || '').toLowerCase().includes(q) ||
        (s.arti      || '').toLowerCase().includes(q) ||
        String(s.nomor).includes(q))
    : surahListCache;

  if (!filtered.length) {
    el.quranPage.innerHTML = `<div class="empty-card"><span class="material-icons">search_off</span><p>Surah tidak ditemukan</p></div>`;
    return;
  }

  el.quranPage.innerHTML = filtered.map(s => `
    <div class="surah-card" data-nomor="${s.nomor}" role="button" tabindex="0">
      <div class="surah-left">
        <div class="surah-number">${s.nomor}</div>
        <div class="surah-info">
          <h3>${s.namaLatin}</h3>
          <p>${s.arti} &bull; ${s.jumlahAyat} Ayat &bull; ${s.tempatTurun}</p>
        </div>
      </div>
      <div class="surah-arab">${s.nama}</div>
    </div>`).join('');

  el.quranPage.querySelectorAll('.surah-card').forEach(card => {
    card.addEventListener('click',   () => openSurah(Number(card.dataset.nomor)));
    card.addEventListener('keydown', e => e.key === 'Enter' && openSurah(Number(card.dataset.nomor)));
  });
}

/* ─────────────────────────────────────────────────────
   12. BACA SURAH — DETAIL
───────────────────────────────────────────────────── */
async function openSurah(nomor) {
  switchView('detail');
  el.ayahContainer.innerHTML = '';
  el.bannerLatin.textContent = 'Memuat surah...';
  el.bannerInfo.textContent  = '';
  el.bannerArab.textContent  = '';

  showLoading(el.ayahContainer, 'Memuat ayat...');

  try {
    const { surah, ayat } = await fetchSurahDetail(nomor);

    state.currentSurah = surah;
    state.ayahData     = ayat;

    el.bannerLatin.textContent = surah.namaLatin;
    el.bannerInfo.textContent  = `${surah.arti} • ${surah.jumlahAyat} Ayat • ${surah.tempatTurun}`;
    el.bannerArab.textContent  = surah.nama;
    el.headerTitle.textContent = surah.namaLatin;

    populateRangeSelects(surah.jumlahAyat);
    renderAyahList(ayat, nomor);
    saveLastRead(nomor, 1, surah.namaLatin);
    renderLastReadCard();

  } catch (err) {
    el.ayahContainer.innerHTML = `
      <div class="empty-card">
        <span class="material-icons">wifi_off</span>
        <p>Gagal memuat surah. Periksa koneksi internet.</p>
        <button onclick="openSurah(${nomor})" style="margin-top:12px;padding:8px 16px;background:var(--primary-color);color:white;border:none;border-radius:8px;cursor:pointer">Coba Lagi</button>
      </div>`;
    console.error('openSurah error:', err);
  }
}

function populateRangeSelects(total) {
  [el.audioFromAyah, el.audioToAyah].forEach((sel, idx) => {
    sel.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const opt = document.createElement('option');
      opt.value = i; opt.textContent = i;
      if (idx === 1 && i === total) opt.selected = true;
      sel.appendChild(opt);
    }
  });
}

function renderAyahList(ayat, surahNomor) {
  const s = state.settings;

  if (!ayat || ayat.length === 0) {
    el.ayahContainer.innerHTML = `<div class="empty-card"><span class="material-icons">info</span><p>Tidak ada ayat ditemukan.</p></div>`;
    return;
  }

  el.ayahContainer.innerHTML = ayat.map(ayah => {
    const isBookmarked = state.bookmarks.some(b => b.surahNomor === surahNomor && b.ayahNomor === ayah.nomorAyat);
    const arabText     = ayah.teksArab || '';
    const latinText    = ayah.teksLatin || '';
    const transText    = ayah.teksIndonesia || '';
    return `
    <div class="ayah-card" id="ayah-${ayah.nomorAyat}" data-nomor="${ayah.nomorAyat}">
      <div class="ayah-header">
        <div class="ayah-number">${ayah.nomorAyat}</div>
        <div class="ayah-actions">
          <button class="ayah-btn btn-audio-ayah" data-nomor="${ayah.nomorAyat}" title="Putar ayat ini">
            <span class="material-icons">play_arrow</span>
          </button>
          <select class="quick-repeat-ayat" data-nomor="${ayah.nomorAyat}" title="Ulangi">
            <option value="1">1x</option>
            <option value="3">3x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
          </select>
          <button class="ayah-btn btn-bookmark ${isBookmarked ? 'active' : ''}" data-nomor="${ayah.nomorAyat}" title="Simpan markah">
            <span class="material-icons">${isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
          </button>
          <button class="ayah-btn btn-share-ayah" data-nomor="${ayah.nomorAyat}" title="Bagikan ayat">
            <span class="material-icons">share</span>
          </button>
        </div>
      </div>
      <p class="arabic-text" style="font-size:${s.fontSize}">${arabText}</p>
      ${latinText ? `<p class="latin-text" style="${s.showLatin ? '' : 'display:none'}">${latinText}</p>` : ''}
      ${transText ? `<p class="translation-text" style="${s.showTrans ? '' : 'display:none'}">${ayah.nomorAyat}. ${transText}</p>` : ''}
    </div>`;
  }).join('');

  el.ayahContainer.querySelectorAll('.btn-audio-ayah').forEach(btn => {
    btn.addEventListener('click', () => {
      const nomor  = Number(btn.dataset.nomor);
      const repeat = Number(btn.closest('.ayah-card').querySelector('.quick-repeat-ayat').value);
      playSingleAyah(nomor, repeat);
    });
  });

  el.ayahContainer.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', () => toggleBookmark(btn, surahNomor));
  });

  el.ayahContainer.querySelectorAll('.btn-share-ayah').forEach(btn => {
    btn.addEventListener('click', () => shareAyah(Number(btn.dataset.nomor)));
  });
}

/* ─────────────────────────────────────────────────────
   13. BOOKMARK
───────────────────────────────────────────────────── */
function toggleBookmark(btn, surahNomor) {
  const ayahNomor = Number(btn.dataset.nomor);
  const surah     = state.currentSurah;
  const idx       = state.bookmarks.findIndex(b => b.surahNomor === surahNomor && b.ayahNomor === ayahNomor);
  const ayah      = state.ayahData.find(a => a.nomorAyat === ayahNomor);

  if (idx >= 0) {
    state.bookmarks.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<span class="material-icons">bookmark_border</span>';
    toast('Markah dihapus');
  } else {
    state.bookmarks.push({
      surahNomor,
      ayahNomor,
      surahName : surah?.namaLatin || '',
      surahArab : surah?.nama || '',
      arabText  : ayah?.teksArab || '',
      transText : ayah?.teksIndonesia || '',
      savedAt   : Date.now(),
    });
    btn.classList.add('active');
    btn.innerHTML = '<span class="material-icons">bookmark</span>';
    toast('Ayat disimpan ke markah', 'success');
  }
  saveBookmarks();
}

function renderBookmarks() {
  if (!state.bookmarks.length) {
    el.bookmarkPage.innerHTML = `
      <div class="empty-card">
        <span class="material-icons">bookmark_border</span>
        <p>Belum ada markah tersimpan.<br>Simpan ayat favorit dari halaman baca.</p>
      </div>`;
    return;
  }

  el.bookmarkPage.innerHTML = `
    <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;color:var(--text-main)">
      Markah Simpanan (${state.bookmarks.length})
    </h3>
    ${state.bookmarks.map((b, i) => `
    <div class="bookmark-card">
      <div class="bm-header">
        <div class="bm-label">
          <span class="material-icons" style="font-size:14px;color:var(--primary-color)">bookmark</span>
          ${b.surahName} : Ayat ${b.ayahNomor}
        </div>
        <button class="ayah-btn btn-del-bookmark" data-idx="${i}" title="Hapus">
          <span class="material-icons" style="color:#e11d48;font-size:18px">delete</span>
        </button>
      </div>
      <p class="arabic-text" style="font-size:22px;margin:10px 0">${b.arabText}</p>
      <p class="translation-text" style="font-size:13px">${b.transText}</p>
      <button class="btn-bm-read" data-surah="${b.surahNomor}" data-ayah="${b.ayahNomor}">
        <span class="material-icons" style="font-size:14px">open_in_new</span> Buka Surah
      </button>
    </div>`).join('')}`;

  el.bookmarkPage.querySelectorAll('.btn-del-bookmark').forEach(btn => {
    btn.addEventListener('click', () => {
      state.bookmarks.splice(Number(btn.dataset.idx), 1);
      saveBookmarks(); renderBookmarks();
      toast('Markah dihapus');
    });
  });

  el.bookmarkPage.querySelectorAll('.btn-bm-read').forEach(btn => {
    btn.addEventListener('click', async () => {
      await openSurah(Number(btn.dataset.surah));
      setTimeout(() => {
        const ayahEl = document.getElementById(`ayah-${btn.dataset.ayah}`);
        if (ayahEl) ayahEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
    });
  });
}

/* ─────────────────────────────────────────────────────
   14. SHARE AYAT
───────────────────────────────────────────────────── */
function shareAyah(ayahNomor) {
  const ayah  = state.ayahData.find(a => a.nomorAyat === ayahNomor);
  const surah = state.currentSurah;
  if (!ayah || !surah) return;

  const text = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n— QS. ${surah.namaLatin}: ${ayahNomor}`;

  if (navigator.share) {
    navigator.share({ title: `QS. ${surah.namaLatin}:${ayahNomor}`, text });
  } else {
    navigator.clipboard.writeText(text)
      .then(() => toast('Ayat disalin ke clipboard', 'success'))
      .catch(() => toast('Gagal menyalin teks', 'error'));
  }
}

/* ─────────────────────────────────────────────────────
   15. AUDIO ENGINE — Multi CDN dengan auto-fallback
───────────────────────────────────────────────────── */

/**
 * Hasilkan daftar URL audio dari berbagai CDN.
 * Dicoba satu per satu sampai ada yang berhasil.
 */
function getAudioUrls(surahNomor, ayahNomor) {
  const qari    = state.settings.qari || '01';
  const edition = QARI_MAP[qari]      || QARI_MAP['01'];
  const eyKey   = EVERYAYAH_MAP[qari] || EVERYAYAH_MAP['01'];

  const s3 = String(surahNomor).padStart(3, '0');
  const a3 = String(ayahNomor).padStart(3, '0');

  return [
    // CDN 1 — islamic.network (format: edition/surah3ayah3.mp3)
    `https://cdn.islamic.network/quran/audio/128/${edition}/${s3}${a3}.mp3`,
    // CDN 2 — everyayah.com
    `https://everyayah.com/data/${eyKey}/${s3}${a3}.mp3`,
    // CDN 3 — qurancdn fallback
    `https://audio.qurancdn.com/${edition}/${s3}${a3}.mp3`,
  ];
}

function showPlayer(title) {
  el.playerTitle.textContent = title;
  el.globalPlayer.classList.remove('hidden');
}

function playSingleAyah(ayahNomor, repeat = 1) {
  const surah = state.currentSurah;
  if (!surah) return;
  state.audio.currentAyah = ayahNomor;
  state.audio.toAyah      = ayahNomor;
  state.audio.repeatCount = repeat;
  state.audio.repeatLeft  = repeat;
  state.audio.isRange     = false;
  _playAyah(ayahNomor);
}

function playRangeAyah(from, to, repeat = 1) {
  state.audio.currentAyah = from;
  state.audio.toAyah      = to;
  state.audio.repeatCount = repeat;
  state.audio.repeatLeft  = repeat;
  state.audio.isRange     = true;
  _playAyah(from);
}

function playFullSurah() {
  const surah = state.currentSurah;
  if (!surah) return;
  playRangeAyah(1, surah.jumlahAyat, 1);
}

/**
 * Coba putar dari daftar URL satu per satu.
 * Jika semua gagal, return false.
 */
async function _tryPlayUrls(urls) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await new Promise((resolve, reject) => {
        // Bersihkan listener lama
        const audio = el.audioElem;
        audio.pause();
        audio.src = url;
        audio.load();

        let settled = false;
        const done = (ok, err) => {
          if (settled) return;
          settled = true;
          audio.removeEventListener('canplay', onOk);
          audio.removeEventListener('error',   onErr);
          clearTimeout(timer);
          ok ? resolve() : reject(err || new Error('error'));
        };

        const onOk  = () => done(true);
        const onErr = (e) => done(false, e);
        const timer = setTimeout(() => done(false, new Error('timeout')), 8000);

        audio.addEventListener('canplay', onOk,  { once: true });
        audio.addEventListener('error',   onErr, { once: true });
      });

      // Berhasil load, sekarang play
      await el.audioElem.play();
      console.log('Audio OK:', url);
      return true;

    } catch (err) {
      console.warn(`CDN ${i+1} gagal (${url}):`, err.message || err);
    }
  }
  return false;
}

async function _playAyah(ayahNomor) {
  const surah = state.currentSurah;
  if (!surah) return;

  // Highlight ayat aktif
  document.querySelectorAll('.ayah-card').forEach(c => c.classList.remove('playing'));
  const card = document.getElementById(`ayah-${ayahNomor}`);
  if (card) {
    card.classList.add('playing');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  showPlayer(`⏳ Memuat... ${surah.namaLatin} : ${ayahNomor}`);

  const urls    = getAudioUrls(surah.nomor, ayahNomor);
  const success = await _tryPlayUrls(urls);

  if (!success) {
    console.warn('Semua CDN gagal untuk ayat', ayahNomor);
    showPlayer(`⚠️ Audio tidak tersedia, lanjut...`);
    // Auto skip ke ayat berikutnya setelah 1 detik
    setTimeout(_onAudioEnded, 1000);
    return;
  }

  showPlayer(`▶ ${surah.namaLatin} : Ayat ${ayahNomor}`);
  saveLastRead(surah.nomor, ayahNomor, surah.namaLatin);
  renderLastReadCard();
}

function _onAudioEnded() {
  const a = state.audio;
  if (!state.currentSurah) return;

  if (a.repeatLeft > 1) {
    a.repeatLeft--;
    _playAyah(a.currentAyah);
    return;
  }
  a.repeatLeft = a.repeatCount;

  if (a.currentAyah < a.toAyah) {
    a.currentAyah++;
    _playAyah(a.currentAyah);
  } else {
    document.querySelectorAll('.ayah-card').forEach(c => c.classList.remove('playing'));
    el.playerTitle.textContent = '✅ Selesai';
    toast('Selesai memutar', 'success');
  }
}

/* ─────────────────────────────────────────────────────
   16. AUDIO LIST VIEW
───────────────────────────────────────────────────── */
async function renderAudioList() {
  if (!surahListCache) {
    showLoading(el.surahAudioPage, 'Memuat daftar audio...');
    try {
      surahListCache = await fetchSurahList();
    } catch {
      el.surahAudioPage.innerHTML = `<div class="empty-card"><span class="material-icons">wifi_off</span><p>Gagal memuat data.</p></div>`;
      return;
    }
  }

  el.surahAudioPage.innerHTML = `
    <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;color:var(--text-main)">Audio Murottal</h3>
    ${surahListCache.map(s => `
    <div class="audio-surah-card" data-nomor="${s.nomor}">
      <div class="audio-surah-left">
        <div class="surah-number">${s.nomor}</div>
        <div class="audio-info">
          <h3>${s.namaLatin}</h3>
          <p>${s.arti} &bull; ${s.jumlahAyat} Ayat</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="audio-arab">${s.nama}</span>
        <button class="page-play-btn btn-play-audio"
          data-nomor="${s.nomor}" data-name="${s.namaLatin}" data-total="${s.jumlahAyat}">
          <span class="material-icons" style="font-size:16px;vertical-align:middle">play_arrow</span>
        </button>
      </div>
    </div>`).join('')}`;

  el.surahAudioPage.querySelectorAll('.btn-play-audio').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.currentSurah = {
        nomor      : Number(btn.dataset.nomor),
        namaLatin  : btn.dataset.name,
        jumlahAyat : Number(btn.dataset.total),
        nama: '',
      };
      state.audio.currentAyah = 1;
      state.audio.toAyah      = Number(btn.dataset.total);
      state.audio.repeatCount = 1;
      state.audio.repeatLeft  = 1;
      state.audio.isRange     = true;
      _playAyah(1);
      toast(`Memutar ${btn.dataset.name}`, 'success');
    });
  });

  el.surahAudioPage.querySelectorAll('.audio-surah-card').forEach(card => {
    card.addEventListener('click', () => openSurah(Number(card.dataset.nomor)));
  });
}

/* ─────────────────────────────────────────────────────
   17. LAST READ CARD
───────────────────────────────────────────────────── */
function renderLastReadCard() {
  const lr  = state.lastRead;
  let cont  = document.getElementById('last-read-container');
  if (!cont) {
    cont = document.createElement('div');
    cont.id = 'last-read-container';
    const hero = el.homeView.querySelector('.hero-home');
    if (hero) hero.insertAdjacentElement('afterend', cont);
    else el.homeView.prepend(cont);
  }

  if (!lr) {
    cont.innerHTML = `
      <div class="last-read-card">
        <div class="lr-left">
          <span class="material-icons lr-icon">auto_stories</span>
          <div>
            <p class="lr-label">Terakhir Dibaca</p>
            <h3 style="font-size:15px;font-weight:700;margin-top:2px">Belum ada riwayat</h3>
            <p style="font-size:12px;opacity:.8">Mulai membaca Al Qur'an</p>
          </div>
        </div>
        <span class="material-icons">chevron_right</span>
      </div>`;
  } else {
    cont.innerHTML = `
      <div class="last-read-card" id="lr-card" style="cursor:pointer">
        <div class="lr-left">
          <span class="material-icons lr-icon">auto_stories</span>
          <div>
            <p class="lr-label">Lanjut Membaca</p>
            <h3 style="font-size:15px;font-weight:700;margin-top:2px">${lr.surahName}</h3>
            <p style="font-size:12px;opacity:.8">Ayat ${lr.ayahNum}</p>
          </div>
        </div>
        <span class="material-icons">chevron_right</span>
      </div>`;
    document.getElementById('lr-card')?.addEventListener('click', async () => {
      await openSurah(lr.surahNum);
      setTimeout(() => {
        document.getElementById(`ayah-${lr.ayahNum}`)?.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 900);
    });
  }
}

/* ─────────────────────────────────────────────────────
   18. JADWAL SHALAT MODAL
───────────────────────────────────────────────────── */
function showShalatModal() {
  removeModal('shalat-modal');
  const modal = createModal('shalat-modal', 'mosque', 'Jadwal Shalat',
    '<div class="loading-state"><div class="spinner"></div><p>Mendeteksi lokasi...</p></div>');

  if (!navigator.geolocation) {
    modal.querySelector('.modal-body').innerHTML = '<p>Browser tidak mendukung geolokasi.</p>';
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude: lat, longitude: lng } = pos.coords;
      const now = new Date();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}?latitude=${lat}&longitude=${lng}&method=11`
      );
      const json = await res.json();
      const t  = json.data.timings;
      const dt = json.data.date.readable;

      const rows = [
        ['🌅','Subuh','Fajr'],['☀️','Dzuhur','Dhuhr'],['🌤️','Ashar','Asr'],
        ['🌇','Maghrib','Maghrib'],['🌙','Isya','Isha'],
      ];

      modal.querySelector('.modal-body').innerHTML = `
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">${dt}</p>
        ${rows.map(([ic,id,key]) => `
          <div class="shalat-row">
            <span>${ic} ${id}</span>
            <strong>${t[key]}</strong>
          </div>`).join('')}`;
    } catch {
      modal.querySelector('.modal-body').innerHTML = '<p style="color:red">Gagal memuat jadwal shalat.</p>';
    }
  }, () => {
    modal.querySelector('.modal-body').innerHTML = `
      <div style="text-align:center;color:var(--text-muted)">
        <span class="material-icons" style="font-size:36px;display:block;margin-bottom:8px">location_off</span>
        <p>Izinkan akses lokasi untuk melihat jadwal shalat.</p>
      </div>`;
  });
}

/* ─────────────────────────────────────────────────────
   19. ARAH KIBLAT MODAL
───────────────────────────────────────────────────── */
function showQiblatModal() {
  removeModal('qiblat-modal');
  const modal = createModal('qiblat-modal', 'explore', 'Arah Kiblat',
    '<div class="loading-state"><div class="spinner"></div><p>Menghitung arah kiblat...</p></div>');

  if (!navigator.geolocation) {
    modal.querySelector('.modal-body').innerHTML = '<p>Browser tidak mendukung geolokasi.</p>';
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    const kaabaLat = 21.4225, kaabaLng = 39.8262;
    const φ1 = lat * Math.PI / 180, φ2 = kaabaLat * Math.PI / 180;
    const Δλ = (kaabaLng - lng) * Math.PI / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const bearing = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;

    modal.querySelector('.modal-body').innerHTML = `
      <div style="text-align:center">
        <div class="qiblat-compass">
          <div class="compass-ring">
            <span class="material-icons" style="color:#10b981;font-size:56px;transform:rotate(${bearing}deg);display:inline-block">navigation</span>
          </div>
        </div>
        <h2 style="font-size:36px;font-weight:800;color:var(--primary-color);margin:12px 0">${Math.round(bearing)}°</h2>
        <p style="color:var(--text-muted);font-size:14px">dari Utara (searah jarum jam)</p>
        <p style="font-size:12px;color:var(--text-muted);margin-top:6px">📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
      </div>`;
  }, () => {
    modal.querySelector('.modal-body').innerHTML = '<p style="text-align:center;color:var(--text-muted)">Izinkan akses lokasi untuk menentukan arah kiblat.</p>';
  });
}

/* Helper Modal */
function createModal(id, icon, title, bodyHtml) {
  const modal = document.createElement('div');
  modal.id        = id;
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h3><span class="material-icons">${icon}</span> ${title}</h3>
        <button class="modal-close"><span class="material-icons">close</span></button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  return modal;
}

function removeModal(id) {
  document.getElementById(id)?.remove();
}

/* ─────────────────────────────────────────────────────
   20. EVENT LISTENERS
───────────────────────────────────────────────────── */
function initEventListeners() {
  el.hamburger.addEventListener('click', openDrawer);
  el.overlay.addEventListener('click',  closeDrawer);

  el.dHome.addEventListener('click',     () => { closeDrawer(); switchView('home'); });
  el.dSurah.addEventListener('click',    () => { closeDrawer(); switchView('surah'); });
  el.dAudio.addEventListener('click',    () => { closeDrawer(); switchView('audio'); });
  el.dBookmark.addEventListener('click', () => { closeDrawer(); switchView('bookmark'); });
  el.dSettings.addEventListener('click', () => { closeDrawer(); switchView('settings'); });

  el.navHome.addEventListener('click',     e => { e.preventDefault(); switchView('home'); });
  el.navSurah.addEventListener('click',    e => { e.preventDefault(); switchView('surah'); });
  el.navBookmark.addEventListener('click', e => { e.preventDefault(); switchView('bookmark'); });
  el.navSettings.addEventListener('click', e => { e.preventDefault(); switchView('settings'); });

  el.quickSurah.addEventListener('click',  () => switchView('surah'));
  el.quickShalat.addEventListener('click', showShalatModal);
  el.quickQiblat.addEventListener('click', showQiblatModal);

  el.searchInput.addEventListener('input', () => renderSurahList(el.searchInput.value));

  el.btnPlayFull.addEventListener('click', () => {
    if (!state.currentSurah) return;
    playFullSurah();
    toast(`Memutar ${state.currentSurah.namaLatin} penuh`, 'success');
  });

  el.btnPlayRange.addEventListener('click', () => {
    const from   = Number(el.audioFromAyah.value);
    const to     = Number(el.audioToAyah.value);
    const repeat = Number(el.audioRepeat.value);
    if (from > to) { toast('Ayat awal harus lebih kecil dari ayat akhir', 'error'); return; }
    playRangeAyah(from, to, repeat);
    toast(`Memutar ayat ${from}–${to} (${repeat}x)`, 'success');
  });

  // 'ended' ditangani di _onAudioEnded
  // 'error' sudah ditangani di dalam _tryPlayUrls per-URL
  // Di sini kita hanya pasang ended sekali di level global
  el.audioElem.addEventListener('ended', _onAudioEnded);
}

/* ─────────────────────────────────────────────────────
   21. DYNAMIC CSS
───────────────────────────────────────────────────── */
function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* TOAST */
    .toast {
      position:fixed; bottom:90px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#1e293b; color:#fff;
      padding:10px 18px; border-radius:30px;
      font-size:13px; font-weight:500;
      display:flex; align-items:center; gap:6px;
      z-index:9999; opacity:0;
      transition:opacity .3s, transform .3s;
      white-space:nowrap;
      box-shadow:0 4px 16px rgba(0,0,0,.3);
      pointer-events:none;
    }
    .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    .toast-success { background:#16a34a; }
    .toast-error   { background:#dc2626; }
    .toast .material-icons { font-size:16px; }

    /* LOADING */
    .loading-state {
      display:flex; flex-direction:column; align-items:center;
      padding:60px 20px; color:var(--text-muted); gap:14px;
    }
    .spinner {
      width:36px; height:36px;
      border:3px solid var(--border-color);
      border-top-color:var(--primary-color);
      border-radius:50%;
      animation:spin .8s linear infinite;
    }
    @keyframes spin { to { transform:rotate(360deg); } }

    /* ARAB FONT SIZE VAR */
    .arabic-text { font-size:var(--arab-font-size, 28px) !important; }

    /* MODAL */
    .modal-overlay {
      position:fixed; inset:0;
      background:rgba(0,0,0,.55);
      z-index:2000;
      display:flex; align-items:flex-end; justify-content:center;
      animation:fadeIn .2s ease;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .modal-box {
      background:var(--card-color);
      border-radius:24px 24px 0 0;
      width:100%; max-width:520px;
      max-height:80vh; overflow-y:auto;
      padding-bottom:30px;
      animation:slideUp .25s ease;
    }
    @keyframes slideUp { from{transform:translateY(60px)} to{transform:translateY(0)} }
    .modal-header {
      display:flex; justify-content:space-between; align-items:center;
      padding:18px 20px 12px;
      border-bottom:1px solid var(--border-color);
      position:sticky; top:0;
      background:var(--card-color);
    }
    .modal-header h3 { display:flex; align-items:center; gap:6px; font-size:16px; font-weight:700; }
    .modal-close { background:none; border:none; cursor:pointer; color:var(--text-muted); }
    .modal-body  { padding:16px 20px; }

    /* SHALAT */
    .shalat-row {
      display:flex; justify-content:space-between;
      padding:14px 0;
      border-bottom:1px solid var(--border-color);
      font-size:15px;
    }
    .shalat-row strong { color:var(--primary-color); font-size:16px; }

    /* KIBLAT */
    .qiblat-compass {
      display:flex; justify-content:center; margin:20px 0;
    }
    .compass-ring {
      width:130px; height:130px;
      border:3px solid var(--primary-color);
      border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      background:var(--bg-color);
    }

    /* BOOKMARK CARD */
    .bookmark-card {
      background:var(--card-color);
      border:1px solid var(--border-color);
      border-radius:14px;
      padding:16px; margin-bottom:12px;
    }
    .bm-header {
      display:flex; justify-content:space-between; align-items:center;
      margin-bottom:6px;
    }
    .bm-label {
      font-size:13px; font-weight:700;
      color:var(--primary-color);
      display:flex; align-items:center; gap:4px;
    }
    .btn-bm-read {
      margin-top:10px;
      background:var(--primary-light); color:var(--primary-color);
      border:none; border-radius:8px;
      padding:7px 14px; font-size:12px; font-weight:600; cursor:pointer;
      display:inline-flex; align-items:center; gap:4px;
    }

    /* LAST READ */
    .last-read-card {
      background:linear-gradient(135deg,#0f766e,#0a5c38);
      color:white; padding:18px 20px; border-radius:18px;
      display:flex; align-items:center; justify-content:space-between;
      box-shadow:0 6px 20px rgba(10,92,56,.25);
      margin-bottom:6px; margin-top:16px;
    }
    .lr-left  { display:flex; align-items:center; gap:14px; }
    .lr-icon  { font-size:34px; color:#a7f3d0; }
    .lr-label { font-size:11px; opacity:.75; text-transform:uppercase; letter-spacing:.5px; }

    /* EMPTY */
    .empty-card {
      text-align:center; padding:50px 20px; color:var(--text-muted);
    }
    .empty-card .material-icons { font-size:52px; margin-bottom:12px; display:block; }

    /* PLAYING AYAH */
    .ayah-card.playing { background:var(--primary-light) !important; border-radius:12px; }
    .ayah-card.playing .ayah-number {
      background:var(--primary-color) !important; color:white !important;
    }

    /* AUDIO RANGE SELECT in banner */
    #audio-from-ayah, #audio-to-ayah, #audio-repeat-count {
      background:rgba(255,255,255,.2);
      color:white; border:none;
      border-radius:8px; padding:5px 8px;
      font-size:13px; outline:none;
      min-width:55px;
    }
    #audio-from-ayah option, #audio-to-ayah option, #audio-repeat-count option {
      color:#1e293b; background:white;
    }

    /* RESPONSIVE */
    @media (min-width:600px) {
      .modal-box { border-radius:20px; margin:auto; }
      .modal-overlay { align-items:center; }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────────────
   22. BACK BUTTON DI DETAIL BANNER
───────────────────────────────────────────────────── */
function injectDetailBackButton() {
  const banner = document.getElementById('surah-detail-banner');
  if (!banner || banner.querySelector('.detail-back-btn')) return;

  const btn = document.createElement('button');
  btn.className   = 'back-button detail-back-btn';
  btn.style.cssText = 'margin-bottom:10px;width:fit-content';
  btn.innerHTML   = '<span class="material-icons">arrow_back</span> Kembali';
  btn.addEventListener('click', () => switchView('surah'));
  banner.insertBefore(btn, banner.firstChild);
}

/* ─────────────────────────────────────────────────────
   23. APP INIT
───────────────────────────────────────────────────── */
async function init() {
  injectDynamicStyles();
  applySettings();
  initSettings();
  initEventListeners();
  injectDetailBackButton();
  renderLastReadCard();
  hideSplash();
  switchView('home');

  console.log('✅ Al Qur\'an As Salam v2.1 — siap!');
}

document.addEventListener('DOMContentLoaded', init);
