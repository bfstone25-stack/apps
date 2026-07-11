const CACHE = 'fold-v2';
const ASSETS = ['.', 'index.html', 'levels.json', 'coach_tips.json', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 网络优先(拿到就更新缓存), 断网回落缓存 —— 更新即时可见, 不再依赖手动升版本号
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(resp => {
    const cp = resp.clone();
    caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
    return resp;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
