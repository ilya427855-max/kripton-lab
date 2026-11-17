'use strict';
let soundEnabled=true;
try { soundEnabled=localStorage.getItem('kripton_lab_reactor_sound')!=='off'; } catch {}
let audioContext;
let lastReactorSound=0;
function updateSoundControl(){
 const button=document.getElementById('sound-toggle');
 button.setAttribute('aria-pressed',String(soundEnabled));
 button.setAttribute('aria-label',soundEnabled?'Выключить звук ядра':'Включить звук ядра');
 const hint=document.getElementById('reactor-sound-hint');
 if(hint)hint.textContent=soundEnabled?'Нажми — услышь ядро':'Ядро без звука';
}
async function playReactorSound(){
 if(!soundEnabled)return;
 const now=Date.now();if(now-lastReactorSound<650)return;lastReactorSound=now;
 try{
  const AudioAPI=window.AudioContext||window.webkitAudioContext;
  if(!AudioAPI)return;
  audioContext??=new AudioAPI();
  if(audioContext.state==='suspended')await audioContext.resume();
  if(!soundEnabled)return;
  const t=audioContext.currentTime;
  const master=audioContext.createGain();master.gain.setValueAtTime(.1,t);master.connect(audioContext.destination);
  const bass=audioContext.createOscillator(),bassGain=audioContext.createGain();bass.type='sine';
  bass.frequency.setValueAtTime(130,t);bass.frequency.exponentialRampToValueAtTime(48,t+1.1);
  bassGain.gain.setValueAtTime(.001,t);bassGain.gain.exponentialRampToValueAtTime(.65,t+.04);bassGain.gain.exponentialRampToValueAtTime(.001,t+1.2);
  bass.connect(bassGain);bassGain.connect(master);bass.start(t);bass.stop(t+1.25);
  const shimmer=audioContext.createOscillator(),shimmerGain=audioContext.createGain();shimmer.type='sine';
  shimmer.frequency.setValueAtTime(420,t);shimmer.frequency.exponentialRampToValueAtTime(980,t+.2);shimmer.frequency.exponentialRampToValueAtTime(320,t+.75);
  shimmerGain.gain.setValueAtTime(.001,t);shimmerGain.gain.exponentialRampToValueAtTime(.14,t+.08);shimmerGain.gain.exponentialRampToValueAtTime(.001,t+.85);
  shimmer.connect(shimmerGain);shimmerGain.connect(master);shimmer.start(t);shimmer.stop(t+.9);
  bass.onended=()=>{bass.disconnect();bassGain.disconnect();shimmer.disconnect();shimmerGain.disconnect();master.disconnect();};
 }catch{window.copyToast?.('Браузер не смог включить звук. Проверь настройки звука страницы.');}
}
function toggleSound(){soundEnabled=!soundEnabled;try{localStorage.setItem('kripton_lab_reactor_sound',soundEnabled?'on':'off');}catch{}updateSoundControl();if(soundEnabled)playReactorSound();}
let pulseTimer;
function pulseReactor(){
 const button=document.getElementById('reactor-button');
 button.classList.remove('is-pulsing');void button.offsetWidth;button.classList.add('is-pulsing');
 clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>button.classList.remove('is-pulsing'),1100);
 playReactorSound();
}
updateSoundControl();
const modalReturns=new Map();
function showModal(id){const el=document.getElementById(id);if(!el)return;modalReturns.set(id,document.activeElement);el.hidden=false;el.style.display='flex';document.body.classList.add('modal-open');requestAnimationFrame(()=>el.querySelector('button:not(:disabled),[tabindex="0"],a,input')?.focus());}
function hideModal(id){const el=document.getElementById(id);if(!el)return;el.hidden=true;el.style.display='none';if(!document.querySelector('.modal-overlay:not([hidden])'))document.body.classList.remove('modal-open');modalReturns.get(id)?.focus();}
function showGuide(){closeMenu();showModal('guide-modal');}
function focusProfile(){closeMenu();const profile=document.getElementById('profile');profile.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});profile.classList.add('attention');setTimeout(()=>{document.getElementById('username-input').focus({preventScroll:true});profile.classList.remove('attention');},450);}
function showOverview(button){closeMenu();document.querySelectorAll('.nav-btn,.overview-btn').forEach(b=>b.classList.remove('active'));button?.classList.add('active');window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
function closeMenu(){document.getElementById('sidebar').classList.remove('open');document.querySelector('.mobile-backdrop')?.remove();document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false');}
function toggleMenu(){const sidebar=document.getElementById('sidebar');if(sidebar.classList.contains('open')){closeMenu();return;}sidebar.classList.add('open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','true');const overlay=document.createElement('div');overlay.className='mobile-backdrop visible';overlay.addEventListener('click',closeMenu);document.body.append(overlay);}
window.closeMenu=closeMenu;
document.addEventListener('click',e=>{const nav=e.target.closest('[data-tab]');if(nav)closeMenu();});
document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)hideModal(el.id);}));
document.addEventListener('keydown',e=>{const modal=document.querySelector('.modal-overlay:not([hidden])');if(e.key==='Escape'){if(modal)hideModal(modal.id);else closeMenu();}if(e.key==='Tab'&&modal){const els=[...modal.querySelectorAll('a,button:not(:disabled),input,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const navObserver=new MutationObserver(()=>{document.querySelectorAll('.module-select').forEach(el=>el.classList.toggle('active',document.getElementById('tab-'+el.dataset.select)?.style.display==='block'));});
document.querySelectorAll('.module-tab').forEach(el=>navObserver.observe(el,{attributes:true,attributeFilter:['style']}));
document.addEventListener('kripton:profile',()=>{const status=document.querySelector('.system-status');status.replaceChildren();const dot=document.createElement('i');dot.className='signal-dot';status.append(dot,document.createTextNode('ДОСЬЕ СИНХРОНИЗИРОВАНО'));});
const profileStatus=document.getElementById('sync-status');new MutationObserver(()=>{if(profileStatus.dataset.state!=='success'){const status=document.querySelector('.system-status');status.replaceChildren();const dot=document.createElement('i');dot.className='signal-dot';status.append(dot,document.createTextNode(profileStatus.dataset.state==='loading'?'СИНХРОНИЗАЦИЯ…':'ГОСТЕВОЙ РЕЖИМ'));}}).observe(profileStatus,{attributes:true,attributeFilter:['data-state']});

function prepareSuggestion(){
 const form=document.getElementById('suggestion-form');
 if(!form.reportValidity())return;
 const clean=value=>value.trim().replace(/\s+/g,' ');
 const category=clean(document.getElementById('suggestion-category').value);
 const title=clean(document.getElementById('suggestion-title').value);
 const detail=clean(document.getElementById('suggestion-detail').value);
 if(title.length<4||detail.length<12){document.getElementById('suggestion-status').textContent='Добавь название и немного деталей, чтобы идея была понятна.';return;}
 const text=`Предложение для KRIPTON LAB | ${category}: ${title}. ${detail}`;
 document.getElementById('suggestion-command').value=text;
 document.getElementById('suggestion-preview').hidden=false;
 document.getElementById('suggestion-status').textContent='Текст подготовлен. Отправь его в чат трансляции — предложение не отправляется автоматически.';
 copyCmd(text);
}
function fillSuggestionExample(type){
 const examples={stream:['Эфир и активности','Совместный эксперимент чата','Предлагаю общую цель на эфир: зрители вместе накапливают прогресс эксперимента, а при достижении цели запускается событие для всего чата.'],site:['Сайт и удобство','Улучшение лаборатории на телефоне','Мне было бы удобнее, если… Опишу, на каком экране это нужно и как должно работать.'],bug:['Нашёл ошибку','Ошибка при действии на сайте','Я нажал… Ожидал… Вместо этого произошло… Проверял на телефоне или компьютере в браузере…']};
 const example=examples[type];if(!example)return;
 document.getElementById('suggestion-category').value=example[0];
 document.getElementById('suggestion-title').value=example[1];
 const detail=document.getElementById('suggestion-detail');detail.value=example[2];
 document.getElementById('suggestion-preview').hidden=true;
 document.getElementById('suggestion-status').textContent='Это пример. Замени его своей идеей, затем подготовь сообщение.';
 detail.focus();
}
