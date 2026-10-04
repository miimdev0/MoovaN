// آیکن‌های آماده (SVG داخلی؛ رنگشان از متن می‌آید)
const SVG = {
  telegram: '<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd"><path d="M21.5 3 2.5 10.4 8 12.8 10 19 13 15.5 18.2 19.5ZM9.4 12.4 17.2 7.6 10.6 14 10.2 16.6Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5.500"/><circle cx="12" cy="12" r="4.200"/><circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  quill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-8 0-13 4-14 11l-2 5 5-2c7-1 11-6 11-14Z"/><path d="M4 20 14 10"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.500"/><circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="19" r="2.500"/><path d="m8.200 10.800 7.600-4.600M8.200 13.200l7.600 4.600"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4.500 4.500 0 0 0 6.400 0l3-3a4.500 4.500 0 0 0-6.400-6.400l-1 1"/><path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1"/></svg>'
};

// ===== لینک‌ها و آیکن‌ها را اینجا عوض کن =====
const channels = [
  { name: "کانال تلگرام",    svg: "telegram",  url: "https://t.me/theMoovaN" },
  { name: "صفحه اینستاگرام", svg: "instagram", url: "https://instagram.com/moovantext" },
  { name: "سروش پلاس",       icon: "img/splus.png",     url: "https://splus.ir/theMoovaN" },
  { name: "روبیکا",          icon: "img/rubika.png",    url: "https://rubika.ir/theMoovaN" }
  // ,{ name: "ایتا", icon: "img/eitaa.png", url: "https://eitaa.com/moovantext" }
];

const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- buttons ---------- */
channels.forEach((ch, i) => {
  const a = document.createElement("a");
  a.className = "btn";
  a.href = ch.url; a.target = "_blank"; a.rel = "noopener";
  a.style.setProperty("--d", `${0.4 + i * 0.1}s`); a.style.animationDelay = `${0.4 + i * 0.1}s`;
  const ico = ch.svg ? `<i class="ico">${SVG[ch.svg]}</i>` : `<img src="${ch.icon}" alt="" onerror="this.remove()">`;
  a.innerHTML = `${ico}<span>${ch.name}</span><i class="go">${SVG.arrow}</i>`;
  a.addEventListener("pointermove", (e) => {
    const r = a.getBoundingClientRect();
    a.style.setProperty("--bx", e.clientX - r.left + "px");
    a.style.setProperty("--by", e.clientY - r.top + "px");
  });
  a.addEventListener("pointerdown", (e) => {
    const r = a.getBoundingClientRect();
    const f = document.createElement("i");
    f.className = "flood";
    f.style.left = e.clientX - r.left + "px";
    f.style.top = e.clientY - r.top + "px";
    a.appendChild(f);
    setTimeout(() => f.remove(), 800);
    navigator.vibrate && navigator.vibrate(12);
  });
  $("#links").appendChild(a);
});

/* ---------- card tilt ---------- */
const card = $("#card");
const tilt = (rx, ry) => { card.style.setProperty("--rx", rx + "deg"); card.style.setProperty("--ry", ry + "deg"); };
if (!reduce) {
  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    tilt(-(e.clientY / innerHeight - 0.5) * 6, (e.clientX / innerWidth - 0.5) * 8);
  });
  addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    tilt(Math.max(-5, Math.min(5, (e.beta - 50) * 0.15)), Math.max(-6, Math.min(6, e.gamma * 0.2)));
  });
}

/* ---------- network background ---------- */
const cv = $("#net"), ctx = cv.getContext("2d");
let W, H, dpr, pts = [];
const mouse = { x: -999, y: -999 };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
  const n = Math.round((innerWidth * innerHeight) / 16000);
  pts = Array.from({ length: Math.min(n, 70) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
    r: (Math.random() * 1.6 + 1) * dpr,
    c: Math.random() < .2 ? "185,120,107" : "230,220,200"
  }));
}
addEventListener("resize", resize); resize();
addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
addEventListener("pointerleave", () => (mouse.x = mouse.y = -999));

function frame() {
  ctx.clearRect(0, 0, W, H);
  const link = 150 * dpr;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (!reduce) { p.x += p.vx; p.y += p.vy; }
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < link) {
        ctx.strokeStyle = `rgba(230,220,200,${(1 - d / link) * 0.22})`;
        ctx.lineWidth = dpr * .8;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
    const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (dm < link * 1.4) {  // nodes reach toward the finger / cursor
      ctx.strokeStyle = `rgba(185,120,107,${(1 - dm / (link * 1.4)) * 0.6})`;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
    }
    ctx.fillStyle = `rgba(${p.c},.75)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
  }
  requestAnimationFrame(frame);
}
frame();

/* ================= v3: floating letters + burst ================= */
const fx = $("#fx"), fctx = fx.getContext("2d");
const bc = $("#burst"), bctx = bc.getContext("2d");
const glyphs = "مووانکلمهشعرقصیدهدلحرفنگاهخیالعشقسکوتآسمانباد".split("");
let letters = [], sparks = [];
const sizeFx = () => { fx.width = bc.width = innerWidth * dpr; fx.height = bc.height = innerHeight * dpr; };
addEventListener("resize", sizeFx); sizeFx();

function spawnLetter(anywhere) {
  return {
    x: Math.random() * fx.width, y: anywhere ? Math.random() * fx.height : fx.height + 60 * dpr,
    s: (16 + Math.random() * 46) * dpr, v: (.12 + Math.random() * .35) * dpr,
    a: .04 + Math.random() * .12, r: Math.random() * 6.28, vr: (Math.random() - .5) * .006,
    g: glyphs[(Math.random() * glyphs.length) | 0], warm: Math.random() < .25
  };
}
letters = Array.from({ length: innerWidth < 600 ? 16 : 30 }, () => spawnLetter(true));

(function drawFx() {
  fctx.clearRect(0, 0, fx.width, fx.height);
  fctx.textAlign = "center"; fctx.textBaseline = "middle";
  for (const L of letters) {
    if (!reduce) { L.y -= L.v; L.r += L.vr; L.x += Math.sin(L.y / 90 / dpr) * .25 * dpr; }
    if (L.y < -80 * dpr) Object.assign(L, spawnLetter(false));
    const d = Math.hypot(L.x - mouse.x, L.y - mouse.y), near = Math.max(0, 1 - d / (170 * dpr));
    fctx.save(); fctx.translate(L.x, L.y); fctx.rotate(L.r);
    fctx.font = `${L.s * (1 + near * .5)}px Hakaza, serif`;
    fctx.fillStyle = `rgba(${L.warm || near > .3 ? "185,120,107" : "230,220,200"},${L.a + near * .45})`;
    if (near > .2) { fctx.shadowColor = "rgba(185,120,107,.9)"; fctx.shadowBlur = 18 * dpr * near; }
    fctx.fillText(L.g, 0, 0); fctx.restore();
  }
  // burst particles
  bctx.clearRect(0, 0, bc.width, bc.height);
  bctx.textAlign = "center"; bctx.textBaseline = "middle";
  sparks = sparks.filter((p) => p.life > 0);
  for (const p of sparks) {
    p.x += p.vx; p.y += p.vy; p.vy += .03 * dpr; p.vx *= .94; p.vy *= .96; p.life -= .035; p.r += p.vr;
    bctx.save(); bctx.globalAlpha = Math.max(p.life, 0); bctx.translate(p.x, p.y); bctx.rotate(p.r);
    bctx.fillStyle = p.c;
    if (p.g) { bctx.font = `${p.s}px Hakaza, serif`; bctx.fillText(p.g, 0, 0); }
    else { bctx.beginPath(); bctx.arc(0, 0, p.s / 5, 0, 6.283); bctx.fill(); }
    bctx.restore();
  }
  requestAnimationFrame(drawFx);
})();

function burst(x, y, n = 9) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, sp = (.8 + Math.random() * 2) * dpr;
    sparks.push({
      x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1 * dpr,
      s: (12 + Math.random() * 14) * dpr, life: .7 + Math.random() * .3, r: 0, vr: (Math.random() - .5) * .08,
      c: Math.random() < .5 ? "#E6DCC8" : "#b9786b", g: Math.random() < .6 ? glyphs[(Math.random() * glyphs.length) | 0] : null
    });
  }
}
addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY));
$(".logo").addEventListener("click", (e) => { const r = e.target.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 16); });

/* light inside the card follows the pointer */
addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--cx", e.clientX - r.left + "px");
  card.style.setProperty("--cy", e.clientY - r.top + "px");
});

/* ---------- icons elsewhere + share / copy ---------- */
$("#quill").innerHTML = SVG.quill;
$("#share").innerHTML = SVG.share;
$("#copy").innerHTML = SVG.link;
const toast = $("#toast");
const say = (t) => { toast.textContent = t; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); };
$("#copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(location.href); say("لینک کپی شد"); }
  catch (_) { say("کپی نشد؛ لینک را دستی کپی کن"); }
});
$("#share").addEventListener("click", async () => {
  if (navigator.share) { try { await navigator.share({ title: "مووان", url: location.href }); } catch (_) {} }
  else $("#copy").click();
});
