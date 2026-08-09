// rootine-v10（2026-08-09）：入口重排后同步更新。
// index.html 现在是分流页（带 token 跳 board.html），board.html 是主应用，legacy.html 是老版 App。
// 策略仍是 network-first：先走网络，成功就顺手更新缓存，断网才回落缓存。
// 改了本文件里的资源清单后，务必把 CACHE 版本号 +1，否则老缓存不会被清掉。
const CACHE='rootine-v10';
const ASSETS=['./','index.html','board.html','legacy.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return res;})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
