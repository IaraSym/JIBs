// JIB's Hub: guarda a "casca" da app para abrir depressa (os dados vêm sempre do Sheets)
const VERSAO = 'jib-v1';
const FICHEIROS = ['./', 'index.html', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(FICHEIROS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return; // pedidos ao Google passam diretos
  // rede primeiro (para apanhar versões novas), cache se estiver sem internet
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSAO).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
