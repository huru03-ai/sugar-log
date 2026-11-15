// 한 번 열면 앱과 사진을 휴대폰에 저장해서, 인터넷 없이도 열리게 함
const CACHE='glucose-v3';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./photos/01.jpg", "./photos/02.jpg", "./photos/03.jpg", "./photos/04.jpg", "./photos/05.jpg", "./photos/06.jpg", "./photos/07.jpg", "./photos/08.jpg", "./photos/09.jpg", "./photos/10.jpg", "./photos/11.jpg", "./photos/12.jpg", "./photos/13.jpg", "./photos/14.jpg", "./photos/15.jpg", "./photos/16.jpg", "./photos/17.jpg", "./photos/18.jpg", "./photos/19.jpg", "./photos/20.jpg", "./photos/21.jpg", "./photos/22.jpg", "./photos/23.jpg", "./photos/24.jpg", "./photos/25.jpg", "./photos/26.jpg", "./photos/27.jpg", "./photos/28.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(req,res)=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);if(u.origin!==location.origin)return;
  if(req.mode==='navigate'){ // 화면: 인터넷이 되면 새 버전, 안 되면 저장된 것
    const net=fetch(req).then(r=>put(req,r));
    const late=new Promise((_,no)=>setTimeout(no,3000));
    e.respondWith(Promise.race([net,late]).catch(()=>caches.match('./index.html').then(r=>r||net)));
    return}
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>put(req,res))));
});
