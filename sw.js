const C='prf-v5-prf1000';
const PRF_BANK='https://raw.githubusercontent.com/rickamorim02-arch/concurso-shorts-prf/c7999568d99f40a1e60da6814c6e66ae8131861a/questoes.json';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/questoes.json')){
    e.respondWith(fetch(PRF_BANK,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Banco PRF indisponível');const copy=r.clone();caches.open(C).then(c=>c.put('./questoes.json',copy));return r}).catch(()=>caches.match('./questoes.json')));
  }else if(u.pathname.endsWith('/index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(C).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
  }else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});