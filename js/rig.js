// Procedural people. Simple solids, articulated, dressed from the v10 cast sheet.
// Faces stay plain and half in shadow; posture, clothes and hair carry who they are.
import * as THREE from 'three';
// Ported from the egtest vertical slice (G340G/egtest js/people.js): Il Professore's rig.
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

const cap = (r, l, m) => { const g = new THREE.CapsuleGeometry(r, l, 4, 10); const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };
const sph = (r, m, ws = 14, hs = 10) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m); mesh.castShadow = true; return mesh; };
const bx = (w, h, d, m) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };
const M = (c, r = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });

export const CAST = {
  first:  { label: 'THE FIRST', h: 1.78, w: 0.95, skin: 0xc9b29c, hair: ['short', 0x2a2420], top: [0x23262b, 'jacket', 0xcfccc2], legs: 0x2c2c30, shoes: 0x0e0e0f, f0: 108 },
  mano:   { label: 'MANO', h: 1.6, w: 1.08, skin: 0xc8a68a, hair: ['knot', 0x1e1714], top: [0x6e2a26, 'cardigan', 0x9a9a92], legs: 0x24242a, shoes: 0x2a2a2a, f0: 205 },
  bardo:  { label: 'BARDO', h: 1.76, w: 1.0, skin: 0xd2b49a, hair: ['curls', 0x1a1410], top: [0x5a4c3e, 'cardigan', 0x6c7f94], legs: 0x3a3a3c, shoes: 0x5a4636, f0: 118 },
  filo:   { label: 'FILO', h: 1.8, w: 1.18, skin: 0xd0aa8e, hair: ['crop', 0x2a221c], top: [0x6a6f72, 'apron', 0xe6e4dc], legs: 0x1a1a1c, shoes: 0x111111, f0: 112, stubble: true },
  strada: { label: 'STRADA', h: 1.85, w: 0.96, skin: 0xc7a184, hair: ['collar', 0x2b2118], top: [0x121212, 'leather', 0x3a3a3a], legs: 0x3c4a5e, shoes: 0x2e2218, f0: 104 },
  sale:   { label: 'SALE', h: 1.58, w: 1.1, skin: 0xc49b7c, hair: ['fringe', 0x140f0c], top: [0x5a4232, 'cardigan', 0x8a6a70], legs: 0x2a2626, shoes: 0x3a3030, skirt: 0x2c2a2e, f0: 215 },
  riga:   { label: 'RIGA', h: 1.68, w: 0.96, skin: 0xd8bca4, hair: ['bleach', 0xd8c890], top: [0x7d8a8c, 'shirt'], legs: 0x8a8070, shoes: 0x2a2420, f0: 200 },
  vetro:  { label: 'VETRO', h: 1.72, w: 0.88, skin: 0xd6b49c, hair: ['overeye', 0x2a2018], top: [0x1f2c44, 'track', 0xbfc6c8], legs: 0x22303e, shoes: 0xe8e8e4, f0: 135, earring: true },
  resto:  { label: 'RESTO', h: 1.78, w: 0.98, skin: 0xcaa98e, hair: ['longtop', 0x3a2c22], top: [0x77797a, 'sweat'], legs: 0x5a4a3a, shoes: 0x4a4a52, f0: 116 },
  nodo:   { label: 'NODO', h: 1.74, w: 0.94, skin: 0xd4b8a0, hair: ['curls', 0x120e0c], top: [0x16161a, 'blazer', 0xe6e4de], legs: 0x16161a, shoes: 0x0c0c0c, f0: 124 },
  voce:   { label: 'VOCE', h: 1.66, w: 0.92, skin: 0xe2cdbb, hair: ['long', 0x15110f], top: [0x47443a, 'coat', 0xd8d0c0], legs: 0x302c2a, shoes: 0x3a2a20, skirt: 0x3a3028, f0: 230 },
  peso:   { label: 'PESO', h: 1.86, w: 1.25, skin: 0xc6a084, hair: ['crop', 0x1c1814], top: [0x4d5440, 'work', 0x8f9a80], legs: 0x4a4636, shoes: 0x2a2620, f0: 98 },
  soglia: { label: 'SOGLIA', h: 1.9, w: 0.9, skin: 0xcdb39e, hair: ['receding', 0x1c1612], top: [0x161616, 'knit', 0xd0ccc0], legs: 0x1c1c1e, shoes: 0x0e0e0e, f0: 110, keys: true },
  attendant: { label: '', h: 1.8, w: 1.1, skin: 0x8a8a8a, hair: ['hood', 0x3a3428], top: [0x3d3a32, 'work', 0x5a5444], legs: 0x37352f, shoes: 0x1c1a16, f0: 100, hood: true }
};

export function makePerson(key) {
  const s = CAST[key]; const R = rng(key.length * 977 + s.h * 100);
  const k = s.h / 1.75, W = s.w;
  const skin = M(s.skin, 0.78), top = M(s.top[0], s.top[1] === 'leather' ? 0.45 : 0.9), legsM = M(s.legs, 0.9), shoeM = M(s.shoes, 0.6), hairM = M(s.hair[1], 0.95);
  const under = s.top[2] !== undefined ? M(s.top[2], 0.9) : top;
  const root = new THREE.Group(); root.name = key;
  const P = { key, spec: s, root, k };
  const hips = new THREE.Group(); hips.position.y = 0.92 * k; root.add(hips); P.hips = hips;
  const pelvis = cap(0.13 * W, 0.08, legsM); pelvis.scale.set(1.25, 1, 0.85); pelvis.rotation.z = Math.PI / 2; hips.add(pelvis);
  // legs
  P.legs = [];
  for (const sd of [-1, 1]) {
    const th = new THREE.Group(); th.position.set(sd * 0.09 * W, 0, 0); hips.add(th);
    const tm = cap(0.072 * W, 0.34 * k, legsM); tm.position.y = -0.22 * k; th.add(tm);
    const kn = new THREE.Group(); kn.position.y = -0.44 * k; th.add(kn);
    const sm = cap(0.056 * W, 0.33 * k, legsM); sm.position.y = -0.21 * k; kn.add(sm);
    const an = new THREE.Group(); an.position.y = -0.43 * k; kn.add(an);
    const ft = bx(0.1, 0.07, 0.26, shoeM); ft.position.set(0, -0.02, 0.07); an.add(ft);
    if (s.top[1] === 'apron' && false) { }
    P.legs.push({ th, kn, an });
  }
  // torso
  const spine = new THREE.Group(); hips.add(spine); P.spine = spine;
  const belly = cap(0.135 * W, 0.12 * k, top); belly.scale.set(1.22, 1, 0.82); belly.position.y = 0.16 * k; spine.add(belly);
  const chest = new THREE.Group(); chest.position.y = 0.27 * k; spine.add(chest); P.chest = chest;
  const ch = cap(0.155 * W, 0.16 * k, top); ch.scale.set(1.3, 1, 0.82); ch.position.y = 0.12 * k; chest.add(ch); P.chestMesh = ch;
  // clothing details
  const kind = s.top[1];
  if (['cardigan', 'jacket', 'blazer', 'leather', 'coat', 'track', 'work'].includes(kind)) { const st = bx(0.11 * W, 0.42 * k, 0.02, under); st.position.set(0, 0.14 * k, 0.135 * W * 0.86); chest.add(st); const st2 = bx(0.1 * W, 0.18 * k, 0.02, under); st2.position.set(0, 0.0, 0.12 * W); spine.add(st2); st2.position.y = 0.16 * k; }
  if (kind === 'apron') { const ap = bx(0.34 * W, 0.78 * k, 0.02, under); ap.position.set(0, 0.0, 0.14 * W); spine.add(ap); ap.position.y = 0.05 * k; P.apron = ap; }
  if (kind === 'track') { for (const sd of [-1, 1]) { const pipe = bx(0.012, 0.42 * k, 0.012, M(0xd8dde0, 0.3, { emissive: 0x222426 })); pipe.position.set(sd * 0.07 * W, 0.14 * k, 0.137 * W * 0.86); chest.add(pipe); } }
  if (kind === 'work') { const strip = bx(0.36 * W, 0.03, 0.27 * W, M(0x9a9a7a, 0.5)); strip.position.y = 0.06 * k; chest.add(strip); }
  if (kind === 'coat' || s.skirt) { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, kind === 'coat' ? 0.26 * W : 0.22 * W, kind === 'coat' ? 0.78 * k : 0.5 * k, 14, 1, true), M(kind === 'coat' ? s.top[0] : s.skirt, 0.9, { side: THREE.DoubleSide })); sk.position.y = (kind === 'coat' ? -0.36 : -0.22) * k; sk.castShadow = true; hips.add(sk); P.skirt = sk; }
  if (s.keys) { const kc = new THREE.Group(); const lace = bx(0.008, 0.16, 0.008, M(0x222222)); lace.position.y = -0.08; kc.add(lace); for (let i = 0; i < 3; i++) { const key = bx(0.012, 0.05, 0.004, M(0x9a8a60, 0.3, { metalness: 0.8 })); key.position.set((i - 1) * 0.014, -0.17, 0); key.rotation.z = (i - 1) * 0.3; kc.add(key); } kc.position.set(0.16 * W, -0.02, 0.06); hips.add(kc); }
  // arms
  P.arms = [];
  for (const sd of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sd * 0.21 * W, 0.24 * k, 0); chest.add(sh);
    const ua = cap(0.05 * W, 0.24 * k, top); ua.position.y = -0.15 * k; sh.add(ua);
    const el = new THREE.Group(); el.position.y = -0.3 * k; sh.add(el);
    const fa = cap(0.043 * W, 0.21 * k, kind === 'apron' || kind === 'shirt' && false ? skin : top); fa.position.y = -0.13 * k; el.add(fa);
    const wr = new THREE.Group(); wr.position.y = -0.27 * k; el.add(wr);
    const handM = s.hood ? M(0x1c1b18, 0.95) : skin;
    const hand = bx(s.hood ? 0.1 : 0.075, s.hood ? 0.13 : 0.1, s.hood ? 0.05 : 0.032, handM); hand.position.y = -0.05; wr.add(hand);
    const th = cap(s.hood ? 0.022 : 0.014, 0.035, handM); th.position.set(-sd * 0.04, -0.03, 0.015); th.rotation.z = sd * 0.6; wr.add(th);
    P.arms.push({ sh, el, wr, hand });
  }
  // neck and head
  const neck = new THREE.Group(); neck.position.y = 0.3 * k; chest.add(neck); P.neck = neck;
  const nm = cap(0.048, 0.06, s.hood ? M(s.hair[1], 0.95) : skin); nm.position.y = 0.04; neck.add(nm);
  const head = new THREE.Group(); head.position.y = 0.1; neck.add(head); P.head = head;
  if (s.hood) {
    // quarry blasting hood: heavy canvas over head and shoulders, an opaque visor, a metal catch
    const hm = M(0x4a4334, 0.98); const hood = sph(0.15, hm, 16, 12); hood.scale.set(1.0, 1.25, 1.05); hood.position.y = 0.1; head.add(hood);
    const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 0.32, 16, 1, true), M(0x4a4334, 0.98, { side: THREE.DoubleSide })); cape.position.y = -0.1; cape.castShadow = true; head.add(cape);
    const visor = bx(0.17, 0.09, 0.03, M(0x07080a, 0.08, { metalness: 0.7 })); visor.position.set(0, 0.12, 0.14); head.add(visor);
    const frame = bx(0.2, 0.12, 0.02, M(0x2a2620, 0.6, { metalness: 0.4 })); frame.position.set(0, 0.12, 0.13); head.add(frame);
    const cat = bx(0.03, 0.05, 0.02, M(0x8a8a86, 0.25, { metalness: 0.9 })); cat.position.set(0.15, 0.02, 0.05); head.add(cat); P.catch = cat;
    P.mouth = null;
  } else {
    const skull = sph(0.105, skin, 20, 16); skull.scale.set(0.9, 1.1, 0.98); skull.position.y = 0.11; head.add(skull);
    const jaw = sph(0.085, skin, 14, 10); jaw.scale.set(0.95, 0.75, 0.95); jaw.position.set(0, 0.04, 0.012); head.add(jaw);
    const nose = bx(0.022, 0.045, 0.03, skin); nose.position.set(0, 0.1, 0.1); nose.rotation.x = -0.25; head.add(nose);
    const socket = M(new THREE.Color(s.skin).multiplyScalar(0.78).getHex(), 0.9);
    for (const sd of [-1, 1]) { const so = sph(0.019, socket, 10, 8); so.scale.set(1.25, 0.7, 0.45); so.position.set(sd * 0.035, 0.128, 0.086); head.add(so); const eye = sph(0.0085, M(0x0a0908, 0.2), 8, 6); eye.position.set(sd * 0.036, 0.13, 0.095); head.add(eye); const brow = bx(0.04, 0.008, 0.012, hairM); brow.position.set(sd * 0.037, 0.158, 0.095); brow.rotation.z = -sd * 0.08; head.add(brow); const ear = sph(0.022, skin, 8, 6); ear.scale.set(0.45, 1, 0.8); ear.position.set(sd * 0.095, 0.11, 0); head.add(ear); }
    const mouth = bx(0.034, 0.005, 0.01, M(new THREE.Color(s.skin).multiplyScalar(0.45).getHex(), 0.7)); mouth.position.set(0, 0.058, 0.092); head.add(mouth); P.mouth = mouth;
    if (s.stubble) { const st = sph(0.087, M(new THREE.Color(s.skin).multiplyScalar(0.7).getHex(), 1), 12, 8); st.scale.set(0.97, 0.7, 0.96); st.position.set(0, 0.035, 0.014); head.add(st); }
    if (s.earring) { const er = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 10), M(0xcfd4d8, 0.2, { metalness: 1 })); er.position.set(0.098, 0.075, 0.005); head.add(er); }
    hair(head, s.hair[0], hairM, R);
  }
  root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  // state
  Object.assign(P, { pose: 'stand', look: null, lookW: 0, talk: 0, laugh: 0, laughFrozen: false, smile: 0, breathe: R() * 6, sleep: 0, walk: null, idle: null, yaw: 0, t0: R() * 10, anim: null, tremble: 0, headTilt: 0 });
  return P;
}

function hair(head, style, m, R) {
  const capm = (sx, sy, sz, y, z = 0, phiLen = Math.PI * 0.55) => { const g = new THREE.SphereGeometry(0.112, 18, 12, 0, Math.PI * 2, 0, Math.min(phiLen, Math.PI * 0.52)); const c = new THREE.Mesh(g, m); c.scale.set(sx, sy, sz); c.position.set(0, y + 0.012, z - 0.012); c.rotation.x = -0.55; c.castShadow = true; head.add(c); return c; };
  const blob = (r, x, y, z, sx = 1, sy = 1, sz = 1) => { const b = sph(r, m, 10, 8); b.position.set(x, y, z); b.scale.set(sx, sy, sz); head.add(b); return b; };
  switch (style) {
    case 'short': capm(0.93, 1.05, 1.0, 0.125, -0.006, Math.PI * 0.5); break;
    case 'crop': capm(0.92, 1.02, 0.99, 0.12, -0.004, Math.PI * 0.46); break;
    case 'knot': capm(0.95, 1.08, 1.02, 0.12, -0.01, Math.PI * 0.56); blob(0.045, 0, 0.07, -0.11); break;
    case 'curls': capm(0.98, 1.1, 1.04, 0.125, -0.01, Math.PI * 0.55); for (let i = 0; i < 22; i++) { const a = R() * Math.PI * 2, e = R() * 1.0; blob(0.03, Math.cos(a) * 0.095 * Math.cos(e), 0.15 + Math.sin(e) * 0.07, Math.sin(a) * 0.09 * Math.cos(e) - 0.015); } break;
    case 'collar': capm(0.96, 1.08, 1.02, 0.12, -0.01, Math.PI * 0.6); blob(0.07, 0, 0.04, -0.07, 1.25, 1.3, 0.7); break;
    case 'fringe': capm(0.97, 1.08, 1.03, 0.12, -0.01, Math.PI * 0.6); blob(0.06, 0, 0.18, 0.07, 1.4, 0.55, 0.6); blob(0.065, 0, 0.06, -0.075, 1.3, 1.2, 0.6); break;
    case 'bleach': capm(0.94, 1.04, 1.0, 0.123, -0.005, Math.PI * 0.48); blob(0.04, 0.02, 0.19, 0.06, 1.6, 0.4, 0.8); break;
    case 'overeye': capm(0.96, 1.08, 1.02, 0.12, -0.01, Math.PI * 0.56); blob(0.05, 0.03, 0.15, 0.08, 1.4, 1.1, 0.5).rotation.z = -0.5; break;
    case 'longtop': capm(0.9, 0.9, 0.95, 0.12, -0.004, Math.PI * 0.45); blob(0.07, 0.01, 0.2, 0.01, 1.1, 0.55, 1.4).rotation.z = 0.25; break;
    case 'long': capm(0.97, 1.08, 1.03, 0.12, -0.01, Math.PI * 0.58); blob(0.07, 0, -0.06, -0.08, 1.2, 2.6, 0.55); break;
    case 'receding': capm(0.92, 0.95, 0.98, 0.115, -0.03, Math.PI * 0.42); break;
  }
}

// ---- posing ----
export function setPose(P, pose) { P.pose = pose; }

const tmpV = new THREE.Vector3();
export function updatePerson(P, dt, t, camPos) {
  const k = P.k; const L = P.legs, Ar = P.arms;
  P.breathe += dt;
  const br = Math.sin(P.breathe * 1.4 + P.t0) * 0.5 + 0.5;
  // defaults
  let hipsY = 0.92 * k, spineX = 0, chestX = 0, neckX = 0;
  const legT = [[0, 0, 0], [0, 0, 0]]; const arm = [[0.05, 0, 0.12, -0.15], [0.05, 0, -0.12, -0.15]]; // sh.x, sh.z, el.x...
  let shX = [0.04, 0.04], shZ = [0.1, -0.1], elX = [-0.18, -0.18], wrX = [0, 0];
  if (P.pose === 'sit' || P.pose === 'sleep' || P.pose === 'lean') {
    hipsY = 0.5; legT[0] = [-1.5, 1.52, 0]; legT[1] = [-1.46, 1.48, 0];
    shX = [-0.55, -0.6]; shZ = [0.12, -0.12]; elX = [-0.95, -0.9];
    if (P.pose === 'lean') { spineX = -0.22; shX = [0.15, 0.1]; elX = [-0.4, -0.5]; legT[0] = [-1.25, 1.0, 0]; legT[1] = [-1.3, 1.1, 0]; }
    if (P.pose === 'sleep') { spineX = 0.05; neckX = 0.3; shX = [-0.25, -0.3]; elX = [-0.9, -1.0]; }
  }
  if (P.pose === 'fold') { shX = [-0.7, -0.7]; shZ = [0.25, -0.25]; elX = [-1.3, -1.3]; }
  if (P.pose === 'smoke') { shX = [0.05, -0.2]; shZ = [0.1, -0.35]; elX = [-0.15, -2.2]; }
  if (P.pose === 'reach') { shX = [0.04, -1.15]; shZ = [0.1, -0.1]; elX = [-0.18, -0.25]; }
  if (P.pose === 'wall') { shX = [0.04, -1.5]; shZ = [0.1, 0.25]; elX = [-0.18, -0.2]; }
  if (P.pose === 'palm') { shX = [-0.6, -0.9]; shZ = [0.15, -0.1]; elX = [-1.0, -0.6]; }
  // walking
  if (P.walk) {
    const w = P.walk; const dx = w.to.x - P.root.position.x, dz = w.to.z - P.root.position.z; const d = Math.hypot(dx, dz);
    if (d > 0.04) {
      const sp = Math.min(d, w.speed * dt); P.root.position.x += dx / d * sp; P.root.position.z += dz / d * sp;
      const yaw = Math.atan2(dx, dz); let dy = yaw - P.root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2; P.root.rotation.y += dy * Math.min(1, dt * 6);
      w.ph += dt * w.speed * 4.2; const s = Math.sin(w.ph);
      legT[0] = [s * 0.45, Math.max(0, -Math.cos(w.ph)) * 0.6 + 0.05, 0]; legT[1] = [-s * 0.45, Math.max(0, Math.cos(w.ph)) * 0.6 + 0.05, 0];
      shX = [-s * 0.3, s * 0.3]; hipsY = 0.92 * k - Math.abs(Math.cos(w.ph)) * 0.02;
      P.walking = true;
    } else { if (w.face !== undefined) { let dy = w.face - P.root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2; P.root.rotation.y += dy * Math.min(1, dt * 5); if (Math.abs(dy) < 0.02) { const r = w.resolve; P.walk = null; r && r(); } } else { const r = w.resolve; P.walk = null; r && r(); } P.walking = false; }
  }
  if (P.extWalk && P.extWalk.on) {
    const w = P.extWalk; w.ph += dt * w.speed * 4.2; const s = Math.sin(w.ph);
    legT[0] = [s * 0.42, Math.max(0, -Math.cos(w.ph)) * 0.62 + 0.05, 0]; legT[1] = [-s * 0.42, Math.max(0, Math.cos(w.ph)) * 0.62 + 0.05, 0];
    shX = [-s * 0.32, s * 0.32]; shZ = [0.08, -0.08]; elX = [-0.25 - Math.max(0, s) * 0.15, -0.25 - Math.max(0, -s) * 0.15];
    hipsY = 0.92 * k - Math.abs(Math.cos(w.ph)) * 0.025; spineX = 0.04; P.walking = true;
  }
  // laughter: shoulders shake, head goes back, mouth opens
  const lg = P.laughFrozen ? 0 : P.laugh;
  if (lg > 0) { const sh = Math.sin(t * 22 + P.t0) * 0.5 + 0.5; chestX -= lg * (0.12 + sh * 0.05); neckX -= lg * 0.2; shZ[0] += lg * 0.05 * sh; shZ[1] -= lg * 0.05 * sh; hipsY += lg * sh * 0.008; }
  // apply
  P.hips.position.y += (hipsY - P.hips.position.y) * Math.min(1, dt * 10);
  for (let i = 0; i < 2; i++) { const l = L[i]; l.th.rotation.x += (legT[i][0] - l.th.rotation.x) * Math.min(1, dt * 12); l.kn.rotation.x += (legT[i][1] - l.kn.rotation.x) * Math.min(1, dt * 12); l.an.rotation.x = -l.th.rotation.x - l.kn.rotation.x; }
  for (let i = 0; i < 2; i++) { const a = Ar[i]; const tr = P.tremble ? Math.sin(t * 40 + i) * P.tremble * 0.03 : 0; a.sh.rotation.x += (shX[i] + tr - a.sh.rotation.x) * Math.min(1, dt * 8); a.sh.rotation.z += (shZ[i] - a.sh.rotation.z) * Math.min(1, dt * 8); a.el.rotation.x += (elX[i] - a.el.rotation.x) * Math.min(1, dt * 8); }
  if (P.idle) P.idle(P, t, dt);
  P.spine.rotation.x = spineX; P.chest.rotation.x = chestX + br * 0.012; P.chestMesh.scale.y = 1 + br * 0.015;
  // head: look at a point (usually the camera) within limits
  let hy = 0, hx = neckX;
  if (P.look && P.lookW > 0.01) {
    P.head.getWorldPosition(tmpV);
    const target = P.look === 'cam' ? camPos : P.look;
    const dx = target.x - tmpV.x, dy = target.y - tmpV.y, dz = target.z - tmpV.z;
    let yaw = Math.atan2(dx, dz) - P.root.rotation.y - (P.parentYaw || 0); while (yaw > Math.PI) yaw -= Math.PI * 2; while (yaw < -Math.PI) yaw += Math.PI * 2;
    const pitch = -Math.atan2(dy, Math.hypot(dx, dz));
    hy = Math.max(-1.2, Math.min(1.2, yaw)) * P.lookW; hx = hx * (1 - P.lookW) + Math.max(-0.6, Math.min(0.5, pitch)) * P.lookW;
  }
  P.neck.rotation.y += (hy * 0.4 - P.neck.rotation.y) * Math.min(1, dt * 5); P.head.rotation.y += (hy * 0.6 - P.head.rotation.y) * Math.min(1, dt * 5);
  P.head.rotation.x += (hx - P.head.rotation.x) * Math.min(1, dt * 5);
  P.head.rotation.z += (P.headTilt - P.head.rotation.z) * Math.min(1, dt * 3);
  if (P.mouth) {
    let open = 0;
    if (P.talk > 0) { open = (Math.sin(t * 17 + P.t0) * 0.5 + 0.5) * (Math.sin(t * 5.3) * 0.3 + 0.7); P.talk -= dt; }
    if (lg > 0) open = Math.max(open, 0.7 + Math.sin(t * 22) * 0.3);
    if (P.laughFrozen) open = 0;
    P.mouth.scale.y += (1 + open * 5 - P.mouth.scale.y) * Math.min(1, dt * 20);
    P.mouth.scale.x = 1 + (lg > 0 ? 0.4 : 0) + P.smile * 0.3;
  }
}

export function walkTo(P, x, z, speed = 1.2, face) {
  return new Promise(res => { P.walk = { to: new THREE.Vector3(x, 0, z), speed, ph: 0, face, resolve: res }; });
}
