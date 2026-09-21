
// Load all visible invitation text from config.js
(function applyInvitationData(){
  if (typeof INVITATION === "undefined") return;
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  };
  set("coverNames", `${INVITATION.groom} & ${INVITATION.bride}`);
  set("groomName", INVITATION.groom);
  set("brideName", INVITATION.bride);
  set("eventDate", INVITATION.date);
  set("eventTime", INVITATION.time);
  set("eventSubtitle", INVITATION.subtitle);
  const title = document.getElementById("pageTitle");
  if (title) title.textContent = `دعوة زفاف ${INVITATION.groom} & ${INVITATION.bride}`;
})();

const cover=document.getElementById('cover'), door=document.getElementById('doorVid'), invite=document.getElementById('invite'), hero=document.getElementById('heroVid'), rings=document.getElementById('tapLayer'), dots=[...document.querySelectorAll('.knocks span')], progress=document.getElementById('progress');
let taps=0, opened=false;
function knock(x,y){const r=document.createElement('span');r.className='tapring';r.style.left=x+'px';r.style.top=y+'px';rings.appendChild(r);setTimeout(()=>r.remove(),750);document.body.classList.add('x');setTimeout(()=>document.body.classList.remove('x'),180);try{const C=window.AudioContext||window.webkitAudioContext;if(C){const c=new C(),o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(125,c.currentTime);o.frequency.exponentialRampToValueAtTime(75,c.currentTime+.11);g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.16,c.currentTime+.008);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.14);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.15);}}catch(e){}}
function openDoor(){if(opened)return;opened=true;document.body.classList.remove('locked');cover.classList.add('is-playing');setTimeout(()=>{cover.classList.add('is-open');invite.classList.add('visible');try{hero.play().catch(()=>{});}catch(e){}},650);}
cover.addEventListener('pointerdown',e=>{if(opened)return; taps++;cover.classList.add('is-knocked');setTimeout(()=>cover.classList.remove('is-knocked'),180);dots[taps-1]?.classList.add('hit');progress.textContent=taps+' / 3';knock(e.clientX,e.clientY);if(taps>=3){try{door.play().catch(()=>{});}catch(e){};setTimeout(openDoor,300)}});
hero.addEventListener('canplay',()=>hero.classList.add('is-ready'));
