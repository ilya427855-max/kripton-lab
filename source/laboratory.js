'use strict';
(() => {
 const rooms = {
  reactor: { code: '04', type: 'ЦЕНТР ЭКСПЕРИМЕНТА', title: 'Реакторное ядро', icon: 'i-atom', description: 'Сердце Сектора №36. Изотопы Kr-36 связывают твой прогресс с действиями в эфире. Здесь сходятся все коридоры лаборатории — и все пути исследователя.', note: 'Нажми «Импульс ядра», чтобы оживить схему. Ядро ответит светом и мягким звуком. Звук можно выключить кнопкой в шапке.', action: 'Открыть команды', tab: 'commands', extra: 'Импульс ядра', pulse: true },
  biolab: { code: '02', type: 'ТЕРРИТОРИЯ БИО-МАСКОТА', title: 'Биолаборатория', icon: 'i-flask', description: 'Здесь живёт лабораторный кот в наушниках. В эфире он реагирует на заботу и аварии. Нано-мята с Чёрного рынка будит кота, включает рейв и даёт +25 XP.', note: 'Нано-мята стоит 1 Kr-36. Скопируй команду и отправь в Twitch-чат — действие выполняет бот.', action: 'Скопировать !крафт мята', command: '!крафт мята', extra: 'В Чёрный рынок', extraTab: 'market' },
  capsule: { code: '03', type: 'ШЛЮЗ ВЫДАЧИ', title: 'Капсульный шлюз', icon: 'i-box', description: 'Короткая остановка перед новой сменой. В блоке «Капсула дня» ты получаешь персональный код, который можно передать лабораторному боту.', note: 'Сначала загрузи своё Twitch-досье. Награду выдаёт бот после команды с кодом в чате трансляции.', action: 'К капсуле дня', target: 'capsule-section', extra: 'Все команды', extraTab: 'commands' },
  archive: { code: '05', type: 'ДОСЬЕ И ОТКРЫТИЯ', title: 'Архив Сектора №36', icon: 'i-trophy', description: 'Тридцать шесть вех хранят историю твоего участия: первые смены, синтезы, изотопы и секретные протоколы. Условия и прогресс собраны в каталоге.', note: 'Загруженное досье определяет прогресс вех. На карте показаны комнаты, а весь список достижений находится в архиве.', action: 'Открыть 36 вех', tab: 'catalog', extra: 'Загрузить досье', profile: true },
  market: { code: '06', type: 'СКЛАД СИНДИКАТА', title: 'Склад Синдиката', icon: 'i-box', description: 'За этой дверью — Чёрный рынок. Обменивай Kr-36 на боевую тревогу, сброс карантина, кофе для чата, звуковую диверсию и особое звание.', note: 'На сайте ты выбираешь и копируешь команду. Покупку и действие в эфире обрабатывает Twitch-бот.', action: 'В Чёрный рынок', tab: 'market', extra: 'Все команды', extraTab: 'commands' },
  observatory: { code: '01', type: 'ОБЗОР ИССЛЕДОВАТЕЛЕЙ', title: 'Обсерватория', icon: 'i-chart', description: 'Точка обзора на весь сектор. В Зале славы собраны ведущие исследователи по опыту. Здесь можно открыть рейтинг и увидеть прогресс ведущих исследователей.', note: 'Рейтинг загружается из базы лаборатории при открытии Зала славы. Выбери комнату, чтобы перейти к связанному разделу.', action: 'Открыть Зал славы', tab: 'hof', extra: 'На трансляцию', twitch: true },
  pass: { code: '07', type: 'ЛИЧНЫЙ СТАТУС', title: 'Бюро пропусков', icon: 'i-shirt', description: 'Место, где исследователь становится узнаваемым. Выбирай доступные звания и нагрудные значки — они появляются рядом с твоим ником в чат-оверлее.', note: 'Открытые варианты доступны в гардеробе. Скопированную команду нужно отправить боту в Twitch-чате.', action: 'Открыть гардероб', tab: 'wardrobe', extra: 'Загрузить досье', profile: true }
 };
 let selectedRoom = 'reactor';
 let pulseTimer;
 function icon(name) { const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('aria-hidden','true'); const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#'+name);svg.append(use);return svg; }
 function goTab(tab) { if(typeof window.switchNav==='function')window.switchNav(tab,document.querySelector('[data-tab="'+tab+'"]')); }
 function pulseCore() { const plan=document.getElementById('lab-blueprint');if(!plan)return;plan.classList.remove('lab-core-energized');void plan.offsetWidth;plan.classList.add('lab-core-energized');clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>plan.classList.remove('lab-core-energized'),1400); if(typeof window.pulseReactor==='function')window.pulseReactor(); }
 function actionButton(label,callback,primary=false) {const b=document.createElement('button');b.type='button';b.className=primary?'primary-button':'small-button';b.textContent=label;b.addEventListener('click',callback);return b;}
 function selectRoom(id) {
  const data=rooms[id];if(!data)return;selectedRoom=id;
  const plan=document.getElementById('lab-blueprint');const detail=document.getElementById('lab-room-detail');if(!plan||!detail)return;
  plan.dataset.active=id;
  plan.querySelectorAll('[data-lab-room]').forEach(button=>{const selected=button.dataset.labRoom===id;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected));});
  const kicker=document.createElement('span');kicker.className='lab-detail-kicker';kicker.textContent=data.code+' / '+data.type;
  const symbol=document.createElement('div');symbol.className='lab-detail-symbol';symbol.append(icon(data.icon));
  const title=document.createElement('h3');title.textContent=data.title;
  const description=document.createElement('p');description.textContent=data.description;
  const note=document.createElement('p');note.className='lab-detail-note';note.textContent=data.note;
  const actions=document.createElement('div');actions.className='lab-detail-actions';
  actions.append(actionButton(data.action,()=>{if(data.tab)goTab(data.tab);else if(data.command&&typeof window.copyCmd==='function')window.copyCmd(data.command);else if(data.target)document.getElementById(data.target)?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});},true));
  if(data.extra)actions.append(actionButton(data.extra,()=>{if(data.pulse)pulseCore();else if(data.extraTab)goTab(data.extraTab);else if(data.profile&&typeof window.focusProfile==='function')window.focusProfile();else if(data.twitch)window.open('https://twitch.tv/kriptonilya36','_blank','noopener,noreferrer');}));
  detail.replaceChildren(kicker,symbol,title,description,note,actions);
 }
 function renderLaboratoryMap() {
  const plan=document.getElementById('lab-blueprint');if(!plan)return;
  if(!plan.dataset.labBound){plan.querySelectorAll('[data-lab-room]').forEach(button=>button.addEventListener('click',()=>{selectRoom(button.dataset.labRoom);if(button.dataset.labRoom==='reactor')pulseCore();}));plan.dataset.labBound='true';}
  selectRoom(selectedRoom);
 }
 window.renderLaboratoryMap=renderLaboratoryMap;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderLaboratoryMap,{once:true});else renderLaboratoryMap();
})();
