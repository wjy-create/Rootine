// ⚠️ 版本号只看下面 const CACHE 那一行，别看注释。2026-08-09 入口重排时这里曾写死
//    「rootine-v10」，之后 CACHE 一路加到 v25 而注释没动，2026-08-18 据此误判过一次
//    「sw.js 从来没上传过」——实际它在公开仓有 12 次提交。注释里从此不再写版本号。
// 入口结构：index.html 是分流页（带 token 跳 board.html），board.html 是主应用，legacy.html 是老版 App。
// 策略仍是 network-first：先走网络，成功就顺手更新缓存，断网才回落缓存。
// 改了本文件里的资源清单后，务必把 CACHE 版本号 +1，否则老缓存不会被清掉。
const CACHE='rootine-v27';
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
