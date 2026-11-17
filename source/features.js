'use strict';
(() => {
 const COMMANDS=Array.isArray(window.KRIPTON_COMMANDS)?window.KRIPTON_COMMANDS:[];
 const FAVORITE_KEY='kripton_lab_favorite_commands_v1';
 const allowedIds=new Set(COMMANDS.map(command=>command.id));
 let favorites=new Set(),storageAvailable=true,commandFilter='all',categoryFilter='all',initialized=false;
 const byId=id=>document.getElementById(id);
 const escape=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
 const icon=kind=>`<svg viewBox="0 0 24 24" aria-hidden="true">${kind==='star'?'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>':'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/>'}</svg>`;
 function readFavorites(){try{const stored=JSON.parse(localStorage.getItem(FAVORITE_KEY)||'[]');if(Array.isArray(stored))favorites=new Set(stored.filter(id=>allowedIds.has(id)));}catch{storageAvailable=false;}}
 function favoriteStatus(){
  if(byId('favorites-status'))byId('favorites-status').textContent=storageAvailable?'Избранное хранится только в этом браузере.':'Браузер не разрешил сохранение. Избранное работает до закрытия страницы.';
  if(byId('favorite-count'))byId('favorite-count').textContent=String(favorites.size);
  if(byId('command-total-count'))byId('command-total-count').textContent=COMMANDS.length+' действия';
 }
 function toggleFavorite(id){
  if(!allowedIds.has(id))return;
  if(favorites.has(id))favorites.delete(id);else favorites.add(id);
  try{localStorage.setItem(FAVORITE_KEY,JSON.stringify([...favorites]));}catch{storageAvailable=false;}
  renderCommandConsole(id);
 }
 function activateCommand(command){
  if(command.action==='capsule'){window.openCapsuleModal?.();return;}
  if(command.action==='wardrobe'){window.switchNav?.('wardrobe',document.querySelector('[data-tab="wardrobe"]'));return;}
  if(command.command)window.copyCmd?.(command.command);
 }
 function renderCategories(){
  const container=byId('command-category-filters');if(!container)return;
  const fragment=document.createDocumentFragment();
  ['all',...new Set(COMMANDS.map(command=>command.category))].forEach(category=>{
   const button=document.createElement('button');button.type='button';button.className='command-category-filter'+(category===categoryFilter?' active':'');
   button.dataset.commandCategory=category;button.textContent=category==='all'?'Все категории':category.charAt(0)+category.slice(1).toLowerCase();
   button.setAttribute('aria-pressed',String(category===categoryFilter));button.addEventListener('click',()=>{categoryFilter=category;renderCategories();renderCommandConsole();container.querySelector(`[data-command-category="${category}"]`)?.focus({preventScroll:true});});fragment.append(button);
  });container.replaceChildren(fragment);
 }
 function renderCommandConsole(focusId){
  const grid=byId('command-grid');if(!grid)return;
  const query=(byId('command-search')?.value||'').trim().toLowerCase();
  const visible=COMMANDS.filter(command=>(commandFilter!=='favorites'||favorites.has(command.id))&&(categoryFilter==='all'||categoryFilter===command.category)&&(!query||[command.command,command.syntax,command.name,command.category,command.description,command.cost,...command.aliases,...(command.options||[]).map(option=>option.name)].join(' ').toLowerCase().includes(query)));
  const fragment=document.createDocumentFragment();
  visible.forEach(command=>{
   const card=document.createElement('article');card.className='command-card';card.dataset.commandId=command.id;
   const favorite=favorites.has(command.id),label=command.action==='capsule'?'Открыть капсулу':command.action==='wardrobe'?'Выбрать в гардеробе':'Копировать';
   card.innerHTML=`<div class="command-card-head"><span class="command-category">${escape(command.category)} · ${command.cost?escape(command.cost)+' Kr-36':'без изотопов'}</span><button type="button" class="command-favorite${favorite?' is-favorite':''}" data-favorite-id="${escape(command.id)}" aria-pressed="${favorite}" aria-label="${favorite?'Убрать из избранного':'Добавить в избранное'}: ${escape(command.name)}">${icon('star')}</button></div><h3 class="command-title">${escape(command.name)}</h3><p class="command-description">${escape(command.description)}</p><details class="command-details"><summary>Алиасы и ограничения <span aria-hidden="true">+</span></summary><div class="command-meta"><span>${escape(command.cooldown)}</span>${command.aliases.length?`<span class="command-aliases">Алиасы: ${escape(command.aliases.join(' · '))}</span>`:''}</div></details><div class="command-card-bottom"><code class="command-code">${escape(command.command||command.syntax)}</code><button type="button" class="command-copy small-button" aria-label="${command.action?label:'Скопировать команду '+escape(command.command)}">${command.action?'':icon('copy')}<span>${label}</span></button></div>`;
   card.querySelector('.command-favorite').addEventListener('click',()=>toggleFavorite(command.id));
   card.querySelector('.command-copy').addEventListener('click',()=>activateCommand(command));fragment.append(card);
  });grid.replaceChildren(fragment);
  if(!visible.length){const empty=document.createElement('div');empty.className='command-empty empty-state';empty.innerHTML=`<h3>${query?'Команда не найдена':'Здесь пока нет команд'}</h3><p>${query?'Попробуй другой запрос или категорию.':'Добавь команды в избранное или выбери другую категорию.'}</p>`;grid.append(empty);}
  document.querySelectorAll('[data-command-filter]').forEach(button=>{const active=button.dataset.commandFilter===commandFilter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});favoriteStatus();
  if(typeof focusId==='string')(grid.querySelector(`[data-favorite-id="${focusId}"]`)||document.querySelector('[data-command-filter="favorites"]'))?.focus({preventScroll:true});
 }
 function initialize(){
  if(initialized)return;initialized=true;readFavorites();renderCategories();
  byId('command-search')?.addEventListener('input',()=>renderCommandConsole());
  document.querySelectorAll('[data-command-filter]').forEach(button=>button.addEventListener('click',()=>{commandFilter=button.dataset.commandFilter==='favorites'?'favorites':'all';renderCommandConsole();}));renderCommandConsole();
 }
 window.renderCommandConsole=renderCommandConsole;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
