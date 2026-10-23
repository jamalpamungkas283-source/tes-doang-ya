/* ========== PENGATURAN (EDIT DI SINI) ========== */
const CONFIG = {
  nama: "Elsa Sayanggggnyaaa akuuuu💖💖💖  ",         
  tanggalBuka: "2026-10-20T00:00:00",  
  kunciTanggal: true,     
  pin: "060424",           
  pesan: "Selamat ulang tahun, cintaku. Terima kasih sudah hadir di hidupku, " +
         "sudah sabar, sudah selalu ada. Aku bersyukur bisa jadi bagian dari ceritamu. " +
         "Semoga tahun ini penuh bahagia, sehat selalu, dan semua mimpimu jadi nyata. " +
         "Aku sayang kamu, hari ini dan seterusnya. ❤️"
};
/* ================================================ */

const $ = (s) => document.querySelector(s);
const music = $('#music');
const musicBtn = $('#musicBtn');
let busy = false, typeTimer = null;

$('#namaPacar').textContent = CONFIG.nama;

/* ----- Musik ----- */
function playMusic() {
  music.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
}
musicBtn.addEventListener('click', () => {
  if (music.paused) playMusic();
  else { music.pause(); musicBtn.classList.remove('playing'); }
});

/* ----- Bunga jatuh ----- */
const bunga = ['🌸', '🌷', '🌼', '🌺', '💮'];
function spawnFlower() {
  const f = document.createElement('span');
  f.className = 'flower';
  f.textContent = bunga[Math.floor(Math.random() * bunga.length)];
  f.style.left = Math.random() * 100 + 'vw';
  f.style.fontSize = 10 + Math.random() * 14 + 'px';
  f.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
  const dur = 7 + Math.random() * 7;
  f.style.animationDuration = dur + 's';
  $('#flowers').appendChild(f);
  setTimeout(() => f.remove(), dur * 1000);
}
setInterval(spawnFlower, 350);

/* ----- Pindah halaman dengan efek ----- */
function goTo(id) {
  if (busy) return;
  busy = true;
  const curtain = $('#curtain');
  curtain.classList.add('cover');
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    $('#' + id).classList.add('active');
    onEnter(id);
    curtain.classList.remove('cover');
    setTimeout(() => (busy = false), 750);
  }, 800);
}
document.querySelectorAll('.next').forEach(b =>
  b.addEventListener('click', () => goTo(b.dataset.next)));

function onEnter(id) {
  clearInterval(typeTimer);
  stopConfetti();
  if (id === 'p3') typeText(CONFIG.pesan);
  if (id === 'p4') startConfetti();
}

/* ----- Efek ketik ----- */
function typeText(text) {
  const el = $('#typed'); let i = 0; el.textContent = '';
  typeTimer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(typeTimer);
  }, 45);
}

/* ----- PIN ----- */
function cekPin() {
  const input = $('#pinInput');
  if (input.value.trim() === CONFIG.pin) {
    playMusic();               // musik mulai setelah PIN benar
    goTo('p1');
  } else {
    $('#pinError').textContent = 'PIN salah. Coba ingat tanggal jadian kita ya 😘';
    input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
    input.value = '';
  }
}
$('#pinBtn').addEventListener('click', cekPin);
$('#pinInput').addEventListener('keydown', e => { if (e.key === 'Enter') cekPin(); });

/* ----- Confetti hati ----- */
const cv = $('#confetti'), ctx = cv.getContext('2d');
let pieces = [], raf = null;
function resize() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', resize); resize();

function startConfetti() {
  const icons = ['💖', '🎉', '✨', '💗', '🎈'];
  pieces = Array.from({ length: 70 }, () => ({
    x: Math.random() * cv.width, y: -Math.random() * cv.height,
    s: 14 + Math.random() * 16, v: 1.5 + Math.random() * 3,
    d: Math.random() * 2 - 1, i: icons[Math.floor(Math.random() * icons.length)]
  }));
  (function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(p => {
      p.y += p.v; p.x += p.d;
      if (p.y > cv.height + 30) { p.y = -30; p.x = Math.random() * cv.width; }
      ctx.font = p.s + 'px serif';
      ctx.fillText(p.i, p.x, p.y);
    });
    raf = requestAnimationFrame(loop);
  })();
}
function stopConfetti() {
  cancelAnimationFrame(raf);
  ctx.clearRect(0, 0, cv.width, cv.height);
}

/* ----- Kunci tanggal 25 Oktober ----- */
// Untuk tes sebelum harinya: buka index.html?test
const BUKA = new Date(CONFIG.tanggalBuka);
const terkunci = () => CONFIG.kunciTanggal && !location.search.includes('test') && Date.now() < BUKA;

function tampilkan(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('#' + id).classList.add('active');
}
if (terkunci()) {
  tampilkan('countdown');
  const t = setInterval(() => {
    const sisa = BUKA - Date.now();
    if (sisa <= 0) { clearInterval(t); tampilkan('pin'); return; }
    const d = Math.floor(sisa / 864e5), j = Math.floor(sisa / 36e5) % 24,
          m = Math.floor(sisa / 6e4) % 60, dt = Math.floor(sisa / 1e3) % 60;
    $('#timer').innerHTML = [[d,'hari'],[j,'jam'],[m,'menit'],[dt,'detik']]
      .map(([n, l]) => `<div>${String(n).padStart(2,'0')}<small>${l}</small></div>`).join('');
  }, 1000);
}