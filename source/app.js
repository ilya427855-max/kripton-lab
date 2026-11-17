'use strict';
    const FIREBASE_BASE_URL = "https://kripton-lab-db-default-rtdb.europe-west1.firebasedatabase.app/";

    const XP_THRESHOLDS = [
        0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 
        4000, 5000, 6200, 7600, 9200, 11000, 13200, 15800, 18800, 22500
    ];

    const RANK_TITLES = [
        "Стажёр", "Лаборант", "Младший техник", "Техник ядра",
        "Инженер реактора", "Старший инженер", "Научный сотрудник", "Специалист спектра",
        "Оператор распада", "Ведущий физик", "Начальник смены", "Куратор сектора",
        "Главный технолог", "Комиссар безопасности", "Архитектор барьера", "Магистр излучения",
        "Хранитель изотопа", "Заместитель директора", "Директор комплекса", "Верховный Архитектор Сингулярности"
    ];

    // 36 Каноничных Вех Сектора №36
    const ACHIEVEMENTS_36 = [
        { id: 1, code: "KR-01", group: "COMMON", name: "Первая смена", desc: "Начать путь в комплексе Сектора №36.", reward: "+15 XP", check: u => u.xp >= 0 },
        { id: 2, code: "KR-02", group: "COMMON", name: "Чистый синтез", desc: "Провести свой первый эксперимент в реакторе.", reward: "+20 XP", check: u => u.exp >= 1 },
        { id: 3, code: "KR-03", group: "COMMON", name: "Контейнер дня", desc: "Разгерметизировать первую капсулу с сайта.", reward: "+25 XP", check: u => u.days >= 1 },
        { id: 4, code: "KR-04", group: "COMMON", name: "Первое мурчание", desc: "Погладить или покормить лабораторного кота.", reward: "+15 XP", check: u => u.catActions >= 1 },
        { id: 5, code: "KR-05", group: "COMMON", name: "Младший научный", desc: "Достичь 5-го ранга допуска (Инженер реактора).", reward: "+50 XP", check: u => u.level >= 5 },
        { id: 6, code: "KR-06", group: "COMMON", name: "Непрерывная вахта", desc: "Провести 3 смены в лаборатории.", reward: "+30 XP", check: u => u.days >= 3 },
        { id: 7, code: "KR-07", group: "COMMON", name: "Радиоизотоп", desc: "Заработать свой первый изотоп Kr-36.", reward: "+40 XP", check: u => u.isotopes >= 1 },
        { id: 8, code: "KR-08", group: "COMMON", name: "Вклад в эфир", desc: "Отправить 50 активных сообщений в чат.", reward: "+35 XP", check: u => u.chat >= 50 },
        { id: 9, code: "KR-09", group: "COMMON", name: "Старший состав", desc: "Получить 10-й ранг допуска (Ведущий физик).", reward: "+80 XP", check: u => u.level >= 10 },
        { id: 10, code: "KR-10", group: "COMMON", name: "Недельный дежурный", desc: "Отстоять 7 смен в лаборатории.", reward: "+50 XP", check: u => u.days >= 7 },
        { id: 11, code: "KR-11", group: "COMMON", name: "Клиент Синдиката", desc: "Приобрести любой товар на Чёрном рынке.", reward: "+45 XP", check: u => (u.title !== "" || u.badge !== "") },
        { id: 12, code: "KR-12", group: "COMMON", name: "Доверенный лаборант", desc: "Накопить суммарно 5 изотопов Kr-36.", reward: "+60 XP", check: u => u.isotopes >= 5 },

        { id: 13, code: "KR-13", group: "SECRET", name: "Защитный протокол", desc: "Пережить первую аварию реактора.", reward: "+30 XP", check: u => u.accidents >= 1 },
        { id: 14, code: "KR-14", group: "SECRET", name: "Испытатель судьбы", desc: "Запустить реактор на катализаторе за 2 изотопа.", reward: "+40 XP", check: u => u.exp >= 5 },
        { id: 15, code: "KR-15", group: "SECRET", name: "Ветеран инцидентов", desc: "Пережить 5 аварийных взрывов колбы.", reward: "+50 XP", check: u => u.accidents >= 5 },
        { id: 16, code: "KR-16", group: "SECRET", name: "Повелитель плазмы", desc: "Провести 25 успешных синтезов в реакторе.", reward: "+75 XP", check: u => u.exp >= 25 },
        { id: 17, code: "KR-17", group: "SECRET", name: "Главный снабженец", desc: "Покормить лабораторного кота 10 раз.", reward: "+45 XP", check: u => u.catActions >= 10 },
        { id: 18, code: "KR-18", group: "SECRET", name: "Стальные нервы", desc: "Получить тактический «кусь» от кота.", reward: "+35 XP", check: u => u.chat >= 75 },
        { id: 19, code: "KR-19", group: "SECRET", name: "Квантовое мурчание", desc: "Поймать овердрайв мурчания кота (+15 XP).", reward: "+50 XP", check: u => u.xp >= 1500 },
        { id: 20, code: "KR-20", group: "SECRET", name: "Тайный тайник", desc: "Получить от кота выкаченный лапой Kr-36.", reward: "+60 XP", check: u => u.isotopes >= 2 },
        { id: 21, code: "KR-21", group: "SECRET", name: "Архивариус Сектора", desc: "Изучить досье других лаборантов в чате.", reward: "+30 XP", check: u => u.chat >= 120 },
        { id: 22, code: "KR-22", group: "SECRET", name: "Боевой режим", desc: "Присутствовать при боевой тревоге бункера.", reward: "+50 XP", check: u => u.exp >= 15 },
        { id: 23, code: "KR-23", group: "SECRET", name: "Завсегдатай бункера", desc: "Провести 14 смен на вахте.", reward: "+80 XP", check: u => u.days >= 14 },
        { id: 24, code: "KR-24", group: "SECRET", name: "Научный консультант", desc: "Достичь 15-го ранга допуска.", reward: "+120 XP", check: u => u.level >= 15 },
        { id: 25, code: "KR-25", group: "SECRET", name: "Экипирован", desc: "Закрепить титул или значок в профиле.", reward: "+30 XP", check: u => u.title !== "" || u.badge !== "" },
        { id: 26, code: "KR-26", group: "SECRET", name: "Спонсор смены", desc: "Раздать кофе лаборантам через Чёрный рынок.", reward: "+70 XP", check: u => u.isotopes >= 4 },
        { id: 27, code: "KR-27", group: "SECRET", name: "Контрабандист", desc: "Приобрести статус «Контрабандист Ядра».", reward: "+100 XP", check: u => u.title.includes("Контрабандист") },
        { id: 28, code: "KR-28", group: "SECRET", name: "Полный запас", desc: "Накопить единовременно 10 изотопов Kr-36.", reward: "+100 XP", check: u => u.isotopes >= 10 },

        { id: 29, code: "KR-29", group: "SPECIAL", name: "Резонанс 36", desc: "Выбить число 36 при синтезе в реакторе.", reward: "+75 XP", isSecret: true, check: u => u.exp >= 36 },
        { id: 30, code: "KR-30", group: "SPECIAL", name: "Абсолютный ноль", desc: "Пережить разрушительный взрыв реактора.", reward: "+60 XP", isSecret: true, check: u => u.accidents >= 3 },
        { id: 31, code: "KR-31", group: "SPECIAL", name: "Золотой контейнер", desc: "Вскрыть капсулу дня с овердрайвом (+100 XP).", reward: "+100 XP", isSecret: true, check: u => u.isotopes >= 3 },
        { id: 32, code: "KR-32", group: "SPECIAL", name: "Месяц на вахте", desc: "30 дней дежурства в комплексе.", reward: "+150 XP", isSecret: true, check: u => u.days >= 30 },
        { id: 33, code: "KR-33", group: "SPECIAL", name: "Кошачья мята", desc: "Запустить рейв кота в OBS через Чёрный рынок.", reward: "+80 XP", isSecret: true, check: u => u.catActions >= 20 },
        { id: 34, code: "KR-34", group: "SPECIAL", name: "Калибровщик Ядра", desc: "Набрать рекорд комбо в панели реактора под стримом.", reward: "+90 XP", isSecret: true, check: u => u.exp >= 30 },
        { id: 35, code: "KR-35", group: "SPECIAL", name: "Ветеран Сингулярности", desc: "Провести 100 синтезов в реакторе.", reward: "+200 XP", isSecret: true, check: u => u.exp >= 100 },
        { id: 36, code: "KR-36", group: "SPECIAL", name: "Верховный Архитектор", desc: "Достичь наивысшего 20-го ранга Сектора №36!", reward: "+500 XP", isSecret: true, check: u => u.level >= 20 }
    ];

    // Гардероб с проверкой условий
    const TITLES_CONFIG = [
        { name: "Стажёр", req: "Базовый допуск", canWear: u => true },
        { name: "Лаборант", req: "Базовое звание из бота", canWear: u => true },
        { name: "Следопыт бункера", req: "10 дней на вахте", canWear: u => u.days >= 10 },
        { name: "Укротитель Плазмы", req: "25 опытов в реакторе", canWear: u => u.exp >= 25 },
        { name: "Контрабандист Ядра", verifyWithBot:true, req: "Покупка на Рынке (5 Kr)", canWear: u => u.title.includes("Контрабандист") },
        { name: "Создатель Вселенной", req: "Ранг 20 (Сингулярность)", canWear: u => u.level >= 20 },
        { name: "Верховный Архитектор Сингулярности", req: "Ранг 20", canWear: u => u.level >= 20 }
    ];

    const BADGES_CONFIG = [
        { name: "[Стажёр]", desc: "Базовый знак", canWear: u => true },
        { name: "[🐾]", verifyWithBot:true, desc: "Друг Кота (15 действий)", canWear: u => u.catActions >= 15 },
        { name: "[⚡]", desc: "Резонанс (Ранг 10+)", canWear: u => u.level >= 10 },
        { name: "[☣️]", verifyWithBot:true, desc: "Синдикат (Покупка 4 Kr)", canWear: u => u.badge.includes("☣") }
    ];


const guestProfile = () => ({
    username: 'Гость Лаборатории', level: 1, xp: 0, days: 0, chat: 0,
    exp: 0, accidents: 0, catActions: null, isotopes: 0, title: '', badge: ''
});
let userData = guestProfile();
let hasProfile = false;
let activeCatFilter = 'ALL';
let activeStatusFilter = 'ALL';
let profileRequest = 0;
let lastProfileRefresh = 0;
let capsuleBusy = false;
let pendingCapsuleCommand = '';
let toastTimer;
const el = id => document.getElementById(id);
const normalizeUser = name => String(name || '').trim().toLowerCase().replace(/^@/, '');
const safeNumber = value => Math.max(0, Number.parseInt(value, 10) || 0);
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const textAt = (id, value) => { if (el(id)) el(id).textContent = value; };

function calcLevel(xp) {
    let level = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
        if (xp >= XP_THRESHOLDS[i]) level = i + 1;
    }
    return Math.min(level, 20);
}

function setSyncStatus(message, state = 'idle') {
    const status = el('sync-status');
    if (status) {
        status.textContent = message;
        status.dataset.state = state;
    }
}

async function loadUserData(targetUser, updateUrl = false, background = false) {
    const cleanUser = normalizeUser(targetUser);
    if (!/^[a-z0-9_]{3,25}$/.test(cleanUser)) {
        setSyncStatus('Введите Twitch-ник: 3–25 латинских букв, цифр или знак _.', 'error');
        return;
    }
    const request = ++profileRequest;
    if (!background) {
        hasProfile = false;
        userData = guestProfile();
        updateProfileUI(); renderAchievements(); renderWardrobe(); checkCapsuleAvailability();
        if (el('username-input')) el('username-input').value = cleanUser;
        setSyncStatus('Синхронизация досье…', 'loading');
    }
    const applyButton = el('profile-load-btn');
    if (applyButton) applyButton.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
        const response = await fetch(`${FIREBASE_BASE_URL}users/${encodeURIComponent(cleanUser)}.json?t=${Date.now()}`, {
            cache: 'no-cache', signal: controller.signal
        });
        if (!response.ok) throw new Error(`firebase-${response.status}`);
        const cloudData = await response.json();
        if (request !== profileRequest) return;
        if (!cloudData || typeof cloudData !== 'object' || Array.isArray(cloudData)) {
            setSyncStatus(background ? 'Нет свежего досье. Показаны последние загруженные данные.' : 'Досье пока нет. Напишите !профиль в чате трансляции.', background ? 'stale' : 'empty');
            return;
        }
        userData = {
            username: typeof cloudData.user === 'string' && cloudData.user.trim() ? cloudData.user : cleanUser,
            xp: safeNumber(cloudData.lab_xp ?? cloudData.xp),
            days: safeNumber(cloudData.lab_active_days ?? cloudData.days),
            chat: (cloudData.lab_commands_count ?? cloudData.chat) == null ? null : safeNumber(cloudData.lab_commands_count ?? cloudData.chat),
            exp: safeNumber(cloudData.lab_experiments ?? cloudData.experiments),
            accidents: safeNumber(cloudData.lab_exp_accident ?? cloudData.accidents),
            isotopes: safeNumber(cloudData.lab_isotopes ?? cloudData.isotopes),
            title: String(cloudData.lab_active_title ?? cloudData.title ?? ''),
            badge: String(cloudData.lab_active_badge ?? cloudData.badge ?? ''),
            catActions: (cloudData.lab_cat_actions ?? cloudData.catActions) == null ? null : safeNumber(cloudData.lab_cat_actions ?? cloudData.catActions),
            lastUpdated: safeNumber(cloudData.last_updated),
            level: 1
        };
        userData.level = calcLevel(userData.xp);
        hasProfile = true;
        lastProfileRefresh = Date.now();
        if (updateUrl) {
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('u', cleanUser);
                url.searchParams.delete('user');
                window.history.replaceState(null, '', url.pathname + url.search + url.hash);
            } catch {}
        }
        try { localStorage.setItem('kripton_lab_last_user', cleanUser); } catch {}
        updateProfileUI();
        renderAchievements();
        renderWardrobe();
        checkCapsuleAvailability();
        const updated = userData.lastUpdated > 0 ? new Date(userData.lastUpdated < 1e12 ? userData.lastUpdated * 1000 : userData.lastUpdated) : null;
        const updatedLabel = updated && Number.isFinite(updated.getTime()) ? updated.toLocaleString('ru-RU', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '';
        setSyncStatus(updatedLabel ? 'Данные бота: ' + updatedLabel : 'Досье синхронизировано · ' + new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}), 'success');
        document.dispatchEvent(new CustomEvent('kripton:profile', {detail:{username:userData.username, level:userData.level}}));
    } catch (error) {
        if (request !== profileRequest) return;
        setSyncStatus(background && hasProfile ? 'Нет связи. Показаны последние загруженные данные.' : error.name === 'AbortError' ? 'База не ответила вовремя. Повторите запрос.' : 'Нет связи с базой. Попробуйте загрузить профиль ещё раз.', background && hasProfile ? 'stale' : 'error');
    } finally {
        clearTimeout(timeout);
        if (request === profileRequest && applyButton) applyButton.removeAttribute('aria-busy');
    }
}

function updateProfileUI() {
    textAt('p-username', userData.username);
    if (el('username-input') && hasProfile && document.activeElement !== el('username-input')) el('username-input').value = normalizeUser(userData.username);
    const level = userData.level;
    const rankName = RANK_TITLES[level - 1] || 'Стажёр';
    textAt('p-level-tag', 'Уровень ' + level);
    textAt('p-rank-name', 'Ранг: ' + rankName);
    const threshold = XP_THRESHOLDS[level - 1];
    const next = level < 20 ? XP_THRESHOLDS[level] : XP_THRESHOLDS[19];
    const percent = level === 20 ? 100 : Math.max(0, Math.min(100, (userData.xp - threshold) / (next - threshold) * 100));
    textAt('p-xp-text', level === 20 ? userData.xp + ' XP · максимум' : userData.xp + ' / ' + next + ' XP');
    if (el('p-xp-bar')) {
        el('p-xp-bar').style.width = percent + '%';
        el('p-xp-bar').parentElement?.setAttribute('aria-valuenow', String(Math.round(percent)));
    }
    textAt('p-active-title', userData.title ? '«' + userData.title + '»' : 'Не выбрано');
    textAt('p-active-badge', userData.badge || 'Не выбран');
    textAt('stat-days', userData.days);
    textAt('stat-exp', userData.exp);
    textAt('stat-accidents', userData.accidents);
    textAt('stat-iso', userData.isotopes);
    textAt('flask-dna-tag', `Kr-36:LV${level}`);
    const systemStatus = document.querySelector('.system-status');
    if (systemStatus) {
        systemStatus.innerHTML = '<i class="signal-dot"></i>' + (hasProfile ? 'ДОСЬЕ ЗАГРУЖЕНО' : 'ГОСТЕВОЙ РЕЖИМ');
    }
}

function setCategoryFilter(category, button) {
    activeCatFilter = category;
    document.querySelectorAll('.cat-btn').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
    });
    renderAchievements();
}

function setStatusFilter(status, button) {
    activeStatusFilter = status;
    document.querySelectorAll('.filter-status-btn').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
    });
    renderAchievements();
}

const achievementPaths = [
    '<path d="M8 3h8m-7 0v7l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3M7 15h10"/><path d="m10 17 1 1m3-6 .01 0"/>',
    '<path d="m13 2-8 12h6l-1 8 9-13h-7l1-7Z"/>',
    '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M6 12h12m-6-5v2m0 6v2"/>',
    '<path d="M7 3 3 7v6a9 9 0 0 0 18 0V7l-4-4-5 4-5-4Z"/><path d="M8 12h.01M16 12h.01m-6 4 2 1 2-1"/>',
    '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    '<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1"/>',
    '<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8m-8 4h5"/>',
    '<path d="m4 6 4 4 4-7 4 7 4-4-2 13H6L4 6Z"/>',
    '<path d="M7 2v4m10-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/><path d="m9 16 2 2 4-4"/>',
    '<path d="m3 7 9-5 9 5v10l-9 5-9-5V7Z"/><path d="m3 7 9 5 9-5m-9 5v10m-5-15 9 5"/>',
    '<path d="m12 2 8 5v10l-8 5-8-5V7l8-5Z"/><path d="M8 12h8m-4-4v8"/>'
];
function achievementIcon(achievement) {
    const path = achievement.isSecret && !hasProfile ? '<path d="M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 4h.01"/><circle cx="12" cy="12" r="10"/>' : achievementPaths[(achievement.id - 1) % achievementPaths.length];
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function getAchievementStatus(achievement) {
    const eventNotPublished = [3,11,14,17,18,19,20,21,22,26,29,30,31,33,34].includes(achievement.id);
    const missingCounter = (achievement.id === 4 && userData.catActions === null) || (achievement.id === 8 && userData.chat === null);
    const unknown = hasProfile && (eventNotPublished || missingCounter);
    return {unknown, unlocked:hasProfile && !unknown && achievement.check(userData)};
}
function renderAchievements() {
    const container = el('achievements-container');
    if (!container) return;
    const query = (el('search-box')?.value || '').trim().toLowerCase();
    let unlockedCount = 0;
    const fragment = document.createDocumentFragment();
    let visibleCount = 0;
    ACHIEVEMENTS_36.forEach(achievement => {
        const {unlocked, unknown} = getAchievementStatus(achievement);
        if (unlocked) unlockedCount++;
        if (activeCatFilter !== 'ALL' && achievement.group !== activeCatFilter) return;
        if (activeStatusFilter === 'UNLOCKED' && !unlocked) return;
        if (activeStatusFilter === 'LOCKED' && unlocked) return;
        const hidden = achievement.isSecret && !unlocked;
        const name = hidden ? 'Засекреченный протокол' : achievement.name;
        const description = hidden ? 'Особая папка Сектора №36. Условия станут известны после открытия.' : achievement.desc;
        if (query && !`${achievement.code} ${name}`.toLowerCase().includes(query)) return;
        const rarity = achievement.group === 'COMMON' ? 'Общий доступ' : achievement.group === 'SECRET' ? 'Спецпротокол' : 'Особая папка';
        const rarityClass = achievement.group === 'COMMON' ? 'r-общий' : achievement.group === 'SECRET' ? 'r-секретно' : 'r-папка';
        const card = document.createElement('article');
        card.className = `ach-card ${unlocked ? 'unlocked' : 'locked'}${hidden ? ' secret-locked' : ''}${unknown ? ' unknown' : ''}`;
        card.innerHTML = `<div class="ach-top"><span class="ach-code">${achievement.code}</span><span class="rarity-pill ${rarityClass}">${rarity}</span></div><div class="ach-symbol">${achievementIcon(achievement)}</div><h3 class="ach-title">${name}</h3><p class="ach-desc">${description}</p><div class="ach-footer"><span class="ach-reward">${hidden ? '??? XP' : achievement.reward}</span><span class="ach-state">${unlocked ? 'Открыто' : unknown ? 'Нет данных' : hidden ? 'Секретно' : 'Заблокировано'}</span></div>`;
        fragment.append(card);
        visibleCount++;
    });
    container.replaceChildren(fragment);
    if (!visibleCount) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<span class="eyebrow">АРХИВ / НЕТ СОВПАДЕНИЙ</span><h3>Здесь пока тихо</h3><p>Попробуйте другой запрос или переключите фильтры. Открытые вехи появятся после загрузки профиля.</p>';
        container.append(empty);
    }
    textAt('stat-ach', `${unlockedCount} / 36`);
    textAt('achievements-count', String(visibleCount).padStart(2, '0'));
}

function renderWardrobe() {
    const groups = [
        {id:'titles-container', config:TITLES_CONFIG, command:'!титул ', action:'Надеть', label:'Звание'},
        {id:'badges-container', config:BADGES_CONFIG, command:'!значок ', action:'Закрепить', label:'Значок'}
    ];
    groups.forEach(group => {
        const container = el(group.id);
        if (!container) return;
        const fragment = document.createDocumentFragment();
        group.config.forEach(item => {
            const unlocked = hasProfile && item.canWear(userData);
            const verify = hasProfile && !unlocked && item.verifyWithBot;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `cosmetic-card ${unlocked ? 'unlocked' : verify ? 'verify' : 'locked'}`;
            button.disabled = !unlocked && !verify;
            button.innerHTML = `<span class="cosmetic-info"><span class="c-name">${escapeHTML(item.name)}</span><span class="c-source">${escapeHTML(item.req || item.desc)}${verify ? ' · Допуск проверит бот' : ''}</span></span><span class="cosmetic-action">${unlocked ? group.action + ' ↗' : verify ? 'Проверить' : 'Закрыто'}</span>`;
            button.setAttribute('aria-label', `${group.label} ${item.name}. ${unlocked || verify ? 'Скопировать команду' : 'Заблокировано'}`);
            button.addEventListener('click', () => copyCmd(group.command + item.name));
            fragment.append(button);
        });
        container.replaceChildren(fragment);
    });
}

async function loadLeaderboard() {
    const body = el('hof-tbody');
    if (!body) return;
    body.innerHTML = '<tr><td colspan="5" class="table-message">Получаем данные исследователей…</td></tr>';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
        const response = await fetch(`${FIREBASE_BASE_URL}users.json?t=${Date.now()}`, {cache:'no-cache', signal:controller.signal});
        if (!response.ok) throw new Error('ranking-unavailable');
        const data = await response.json();
        const list = Object.entries(data && typeof data === 'object' ? data : {}).map(([key, value]) => ({
            user: String(value?.user || key),
            xp: safeNumber(value?.lab_xp ?? value?.xp),
            isotopes: safeNumber(value?.lab_isotopes ?? value?.isotopes)
        })).filter(item => item.user.toLowerCase() !== 'kriptonilya36' && item.xp > 0).sort((a,b) => b.xp - a.xp).slice(0,10);
        const fragment = document.createDocumentFragment();
        list.forEach((item, index) => {
            const row = document.createElement('tr');
            const level = calcLevel(item.xp);
            const values = [String(index + 1).padStart(2,'0'), '@' + item.user, `Ур. ${level} · ${RANK_TITLES[level - 1]}`, `${item.xp.toLocaleString('ru-RU')} XP`, `${item.isotopes} Kr`];
            values.forEach((value, column) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                if (column === 0 && index < 3) cell.className = 'hof-rank-' + (index + 1);
                if (column === 3) cell.className = 'xp-cell';
                if (column === 4) cell.className = 'isotope-cell';
                row.append(cell);
            });
            fragment.append(row);
        });
        body.replaceChildren(fragment);
        if (!list.length) body.innerHTML = '<tr><td colspan="5" class="table-message">Рейтинг пока пуст. Начните с команды !профиль в чате.</td></tr>';
    } catch {
        body.innerHTML = '<tr><td colspan="5" class="table-message">Не удалось получить рейтинг. <button type="button" class="text-button" onclick="loadLeaderboard()">Попробовать снова</button></td></tr>';
    } finally { clearTimeout(timeout); }
}

function checkCapsuleAvailability() {
    const button = el('capsule-btn');
    if (!button) return;
    button.disabled = !hasProfile || capsuleBusy;
    button.textContent = !hasProfile ? 'Введите Twitch-ник' : capsuleBusy ? 'Синтез кода…' : 'Вскрыть капсулу';
    textAt('capsule-status-desc', hasProfile ? 'Получите код и отправьте его боту в чат трансляции.' : 'Загрузите Twitch-профиль, чтобы получить код для бота.');
}

async function openCapsuleModal() {
    if (!hasProfile) {
        copyToast('Сначала загрузите свой Twitch-профиль.');
        window.focusProfile?.();
        return;
    }
    if (capsuleBusy) return;
    const modal = el('capsule-modal');
    if (!modal) return;
    capsuleBusy = true;
    pendingCapsuleCommand = '';
    checkCapsuleAvailability();
    textAt('modal-code-display', 'СИНТЕЗ КОДА…');
    textAt('modal-cmd-text', 'Устанавливаем связь с лабораторией');
    modal.dataset.state = 'loading';
    const copyButton = el('capsule-copy-btn') || modal.querySelector('[onclick*="copyModalCode"]');
    if (copyButton) copyButton.disabled = true;
    if (typeof window.showModal === 'function') window.showModal('capsule-modal');
    else { modal.style.display = 'flex'; modal.setAttribute('aria-hidden', 'false'); }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
        const bytes = new Uint8Array(4);
        crypto.getRandomValues(bytes);
        const token = Array.from(bytes, byte => byte.toString(16).padStart(2,'0')).join('').toUpperCase();
        const response = await fetch(`${FIREBASE_BASE_URL}capsules/${token}.json`, {
            method:'PUT', headers:{'Content-Type':'application/json'}, signal:controller.signal,
            body:JSON.stringify({user:normalizeUser(userData.username), date:new Date().toISOString().slice(0,10), claimed:false})
        });
        if (!response.ok) throw new Error('capsule-write-failed');
        pendingCapsuleCommand = `!код KRP-${token}`;
        textAt('modal-code-display', `KRP-${token}`);
        textAt('modal-cmd-text', pendingCapsuleCommand);
        modal.dataset.state = 'ready';
        if (copyButton) copyButton.disabled = false;
    } catch {
        textAt('modal-code-display', 'НЕТ СВЯЗИ');
        textAt('modal-cmd-text', 'Код не создан. Закройте окно и попробуйте ещё раз.');
        modal.dataset.state = 'error';
    } finally {
        clearTimeout(timeout);
        capsuleBusy = false;
        checkCapsuleAvailability();
    }
}
function closeCapsuleModal() {
    if (typeof window.hideModal === 'function') window.hideModal('capsule-modal');
    else if (el('capsule-modal')) { el('capsule-modal').style.display = 'none'; el('capsule-modal').setAttribute('aria-hidden', 'true'); }
}
function copyModalCode() { if (pendingCapsuleCommand) return copyCmd(pendingCapsuleCommand); }

async function copyCmd(command) {
    const value = String(command || '').trim();
    if (!value) return;
    let copied = false;
    try {
        if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); copied = true; }
    } catch {}
    if (!copied) {
        const field = document.createElement('textarea');
        field.value = value;
        field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
        field.setAttribute('readonly', '');
        document.body.append(field);
        field.select();
        try { copied = document.execCommand('copy'); } catch {}
        field.remove();
    }
    if (copied) copyToast('Команда скопирована: ' + value);
    else {
        const toast = el('toast-msg');
        if (toast) {
            clearTimeout(toastTimer);
            toast.replaceChildren();
            const label = document.createElement('span');
            label.textContent = 'Скопируйте команду вручную: ';
            const field = document.createElement('input');
            field.type = 'text'; field.value = value; field.readOnly = true;
            field.setAttribute('aria-label','Команда для копирования');
            const close = document.createElement('button');
            close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label','Закрыть уведомление');
            close.addEventListener('click', () => { toast.style.display = 'none'; });
            toast.append(label, field, close);
            toast.style.display = 'block';
            field.focus(); field.select();
        }
    }
}
function copyToast(message) {
    const toast = el('toast-msg');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.style.display = 'block';
    toastTimer = setTimeout(() => { toast.style.display = 'none'; }, 3400);
}

function switchNav(tabName, button) {
    const names = {catalog:'36 вех комплекса', wardrobe:'Гардероб исследователя', market:'Чёрный рынок', hof:'Зал славы', faq:'Частые вопросы', ideas:'Идеи и предложения', commands:'Пульт команд', map:'Схема лаборатории'};
    if (!names[tabName] || !el('tab-' + tabName)) return;
    window.closeMenu?.();
    document.querySelectorAll('.overview-btn').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.nav-btn').forEach(item => {
        const active = item === button || item.dataset.tab === tabName;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        if (item.getAttribute('role') === 'tab') item.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('.module-tab').forEach(item => {
        const active = item.id === 'tab-' + tabName;
        item.hidden = !active;
        item.style.display = active ? 'block' : 'none';
    });
    document.querySelectorAll('.module-select').forEach(item => {
        const active = item.dataset.select === tabName;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
    });
    const heading = el('module-heading');
    if (heading) {
        const count = heading.querySelector('.heading-count');
        heading.replaceChildren(document.createTextNode(names[tabName]));
        if (count) { count.hidden = tabName !== 'catalog'; heading.append(count); }
    }
    if (tabName === 'hof') loadLeaderboard();
    if (tabName === 'wardrobe') renderWardrobe();
    if (tabName === 'commands') window.renderCommandConsole?.();
    if (tabName === 'map') window.renderLaboratoryMap?.();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el('modules')?.scrollIntoView({behavior:reduced ? 'instant' : 'smooth', block:'start'});
}
function applyUser() {
    const value = el('username-input')?.value.trim();
    if (!value) { setSyncStatus('Введите свой ник на Twitch.', 'empty'); return; }
    return loadUserData(value, true);
}

function initializeKripton() {
    updateProfileUI();
    renderAchievements();
    renderWardrobe();
    checkCapsuleAvailability();
    let username = '';
    try {
        const parameters = new URLSearchParams(window.location.search);
        username = parameters.get('u') || parameters.get('user') || '';
    } catch {}
    if (!username) { try { username = localStorage.getItem('kripton_lab_last_user') || ''; } catch {} }
    if (username) {
        if (el('username-input')) el('username-input').value = username;
        loadUserData(username, false);
    }
    const canvas = el('flaskCanvas');
    if (canvas && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        const context = canvas.getContext('2d');
        if (context) {
            let angle = 0;
            function animateFlask() {
                if (!canvas.isConnected) return;
                angle += .035;
                const width = canvas.width, height = canvas.height;
                context.clearRect(0,0,width,height);
                context.fillStyle = 'rgba(130,221,216,.15)';
                context.beginPath(); context.moveTo(0,height); context.lineTo(0,height * .4);
                for (let x=0;x<=width;x+=3) context.lineTo(x,height*.4+Math.sin(angle+x*.1)*3);
                context.lineTo(width,height); context.fill();
                context.fillStyle = userData.level >= 15 ? '#ba9cf5' : '#83dcd7';
                context.beginPath(); context.arc(width/2,height*.58,6+Math.sin(angle)*1.8,0,Math.PI*2); context.fill();
                requestAnimationFrame(animateFlask);
            }
            requestAnimationFrame(animateFlask);
        }
    }
}
window.kripton = Object.freeze({
    get userData() { return {...userData}; },
    get hasProfile() { return hasProfile; },
    get achievementsCount() { return ACHIEVEMENTS_36.length; },
    get achievements() {
        return ACHIEVEMENTS_36.map(achievement => {
            const {unlocked, unknown} = getAchievementStatus(achievement);
            const secret = Boolean(achievement.isSecret && !unlocked);
            return {
                id:achievement.id, code:achievement.code, group:achievement.group,
                name:secret ? 'Засекреченный протокол' : achievement.name,
                description:secret ? 'Условие скрыто. Особый протокол станет известен после открытия вехи.' : achievement.desc,
                reward:secret ? '??? XP' : achievement.reward,
                unlocked, secret, unknown
            };
        });
    }
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeKripton, {once:true});
else initializeKripton();

let profileRefreshTimer;
function refreshProfileWhenVisible() {
    if (document.visibilityState === 'hidden' || !hasProfile || Date.now() - lastProfileRefresh < 40000) return;
    lastProfileRefresh = Date.now();
    loadUserData(userData.username, false, true);
}
function startProfileRefresh() {
    if (profileRefreshTimer) clearInterval(profileRefreshTimer);
    profileRefreshTimer = setInterval(refreshProfileWhenVisible, 45000);
}
startProfileRefresh();
document.addEventListener('visibilitychange', refreshProfileWhenVisible);
window.addEventListener?.('pagehide', () => clearInterval(profileRefreshTimer));
window.addEventListener?.('pageshow', startProfileRefresh);
