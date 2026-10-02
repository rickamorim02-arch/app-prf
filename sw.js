const VERSION='prf-offline-v24';
const SHELL=[
  './',
  './index.html',
  './estudos.html',
  './questoes.json',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('prf-offline-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(response=>{
      if(response && response.ok){
        const copy=response.clone();
        caches.open(VERSION).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(async()=>{
      const exact=await caches.match(event.request);
      if(exact) return exact;
      if(event.request.mode==='navigate') return (await caches.match('./index.html')) || (await caches.match('./'));
      return Response.error();
    })
  );
});