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

export function makePerson(key, spec) {
  const s = spec || CAST[key]; const R = rng(key.length * 977 + s.h * 100);
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
  if (s.female) for (const sd of [-1, 1]) { const b = sph(0.06 * W, top, 12, 10); b.scale.set(1, 0.85, 0.75); b.position.set(sd * 0.075 * W, 0.12 * k, 0.1 * W); chest.add(b); }
  if (s.heavy) { const g = cap(0.15 * W, 0.08, top); g.scale.set(1.3, 1, 1.05); g.position.set(0, 0.1 * k, 0.03); spine.add(g); }
  // clothing details
  const kind = s.top[1];
  // v10: no flat under-shirt strips on the chest. A collar ring in the shirt colour shows at the neckline instead.
  if (['cardigan', 'jacket', 'blazer', 'leather', 'coat', 'track', 'work', 'cassock'].includes(kind)) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06 * W, 0.016, 6, 18), kind === 'cassock' ? M(0xf2efe6, 0.6) : under); ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.29 * k, 0.012); ring.scale.set(1, 1.15, 1); chest.add(ring); }
  if (kind === 'apron') { const ap = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, 0.2 * W, 0.62 * k, 18, 1, true, -1.15, 2.3), M(s.top[2] ?? 0xd8d3c6, 0.95, { side: THREE.DoubleSide })); ap.scale.z = 0.85; ap.position.y = 0.05 * k; spine.add(ap); P.apron = ap; }
  if (kind === 'track') { for (const sd of [-1, 1]) { const pipe = bx(0.012, 0.42 * k, 0.012, M(0xd8dde0, 0.3, { emissive: 0x222426 })); pipe.position.set(sd * 0.07 * W, 0.14 * k, 0.137 * W * 0.86); chest.add(pipe); } }
  if (kind === 'work') { const band = new THREE.Mesh(new THREE.TorusGeometry(0.2 * W, 0.012, 4, 24), M(0x9a9a7a, 0.5)); band.rotation.x = Math.PI / 2; band.scale.set(1, 0.82, 1); band.position.y = 0.06 * k; chest.add(band); }
  if (kind === 'cassock') { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, 0.24 * W, 0.86 * k, 14, 1, true), M(s.top[0], 0.9, { side: THREE.DoubleSide })); sk.position.y = -0.44 * k; hips.add(sk); P.skirt = sk; }
  if (kind === 'coat' || s.skirt) { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, kind === 'coat' ? 0.26 * W : 0.22 * W, kind === 'coat' ? 0.78 * k : 0.5 * k, 14, 1, true), M(kind === 'coat' ? s.top[0] : s.skirt, 0.9, { side: THREE.DoubleSide })); sk.position.y = (kind === 'coat' ? -0.36 : -0.22) * k; sk.castShadow = true; hips.add(sk); P.skirt = sk; }
  if (s.keys) { const kc = new THREE.Group(); const lace = bx(0.008, 0.16, 0.008, M(0x222222)); lace.position.y = -0.08; kc.add(lace); for (let i = 0; i < 3; i++) { const key = bx(0.012, 0.05, 0.004, M(0x9a8a60, 0.3, { metalness: 0.8 })); key.position.set((i - 1) * 0.014, -0.17, 0); key.rotation.z = (i - 1) * 0.3; kc.add(key); } kc.position.set(0.16 * W, -0.02, 0.06); hips.add(kc); }
  // arms
  P.arms = [];
  for (const sd of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sd * 0.21 * W, 0.24 * k, 0); chest.add(sh);
    const ua = cap(0.05 * W, 0.24 * k, top); ua.position.y = -0.15 * k; sh.add(ua);
    const el = new THREE.Group(); el.position.y = -0.3 * k; sh.add(el);
    const fa = cap(0.043 * W, 0.21 * k, kind === 'tee' ? skin : top); P.forearms = P.forearms || []; P.forearms.push(fa); fa.position.y = -0.13 * k; el.add(fa);
    const wr = new THREE.Group(); wr.position.y = -0.27 * k; el.add(wr);
    const handM = s.hood ? M(0x1c1b18, 0.95) : skin;
    const hand = bx(s.hood ? 0.1 : 0.068, s.hood ? 0.13 : 0.075, s.hood ? 0.05 : 0.03, handM); hand.position.y = -0.04; wr.add(hand);
    if (!s.hood) for (let f = 0; f < 4; f++) { const fg = cap(0.0095, 0.045 - Math.abs(f - 1.5) * 0.006, handM); fg.position.set((f - 1.5) * 0.017, -0.1, 0.004); fg.rotation.x = 0.18; wr.add(fg); }
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
    const lip = bx(0.036, 0.006, 0.012, M(new THREE.Color(s.skin).multiplyScalar(0.72).lerp(new THREE.Color(0x8a4a40), 0.25).getHex(), 0.6)); lip.position.set(0, 0.049, 0.09); head.add(lip);
    const chin = sph(0.03, skin, 10, 8); chin.scale.set(1.2, 0.8, 0.8); chin.position.set(0, 0.022, 0.078); head.add(chin);
    for (const sd of [-1, 1]) { const ck = sph(0.026, skin, 10, 8); ck.scale.set(1.2, 0.8, 0.7); ck.position.set(sd * 0.055, 0.095, 0.075); head.add(ck); }
    const ridge = bx(0.09, 0.014, 0.02, skin); ridge.position.set(0, 0.148, 0.09); head.add(ridge);
    P.lids = [-1, 1].map(sd => { const l = sph(0.02, skin, 10, 6); l.scale.set(1.25, 0.12, 0.6); l.position.set(sd * 0.036, 0.138, 0.094); head.add(l); return l; });
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
    case 'bald': { const r = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 6, 18, Math.PI * 1.2), m); r.rotation.set(Math.PI / 2, 0, Math.PI * 0.9); r.position.set(0, 0.1, -0.01); head.add(r); break; }
    case 'scarf': { const sc = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), M(0x4b3d33, 1)); sc.position.set(0, 0.118, -0.006); sc.rotation.x = -0.35; head.add(sc); const kn = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), M(0x4b3d33, 1)); kn.position.set(0, 0.0, -0.1); kn.rotation.x = 0.5; head.add(kn); break; }
    case 'longcurls': capm(0.98, 1.1, 1.04, 0.125, -0.01, Math.PI * 0.58); for (let i = 0; i < 26; i++) blob(0.032, (R() - 0.5) * 0.2, 0.12 - R() * 0.24, -0.06 - R() * 0.05); break;
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
  if (P.lids) { P.blinkT = (P.blinkT ?? (2 + P.t0 % 3)) - dt; let b = 0; if (P.blinkT < 0.12) b = 1; if (P.blinkT < 0) P.blinkT = 2.4 + Math.random() * 4; P.lids.forEach(l => { l.scale.y = 0.12 + b * 0.62; }); }
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

// v10: personal details on the egtest body: beards, glasses, caps, prints, aprons, objects.
export function personalize(P, X, tex = {}) {
  const head = P.head, s = P.spec, k = P.k, W = s.w;
  const hairM = new THREE.MeshStandardMaterial({ color: s.hair[1], roughness: 0.95 });
  const add = (mesh, parent, x, y, z) => { mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh; };
  const e = new Set(X.extras || []);
  if (e.has('beard-full') || e.has('beard-grey')) { const bm = e.has('beard-grey') ? M(0xa29d93, 1) : hairM; const b = add(new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 10, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58), bm), head, 0, 0.065, 0.016); b.scale.set(0.98, 1.05, 1.0); add(new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.035, 3, 6), bm), head, 0, 0.066, 0.094).rotation.z = Math.PI / 2; }
  if (e.has('stubble')) { const st = add(new THREE.Mesh(new THREE.SphereGeometry(0.087, 12, 8, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), M(new THREE.Color(s.skin).multiplyScalar(0.68).getHex(), 1)), head, 0, 0.07, 0.014); st.scale.set(0.98, 0.95, 0.97); }
  if (e.has('moustache')) add(new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.035, 3, 6), M(0x9a948a, 1)), head, 0, 0.066, 0.094).rotation.z = Math.PI / 2;
  if (e.has('glasses-round')) { const g = M(0x2b2620, 0.4, { metalness: 0.5 }); for (const sd of [-1, 1]) add(new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.003, 5, 14), g), head, sd * 0.036, 0.13, 0.102); add(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.003, 0.003), g), head, 0, 0.133, 0.103); }
  if (e.has('shades')) { const g = M(0x050505, 0.12, { metalness: 0.6 }); add(new THREE.Mesh(new THREE.CylinderGeometry(0.103, 0.103, 0.026, 18, 1, true, -0.85, 1.7), g), head, 0, 0.132, 0.005); }
  if (e.has('sunglasses-up')) { const g = M(0x0a0a0a, 0.2, { metalness: 0.4 }); for (const sd of [-1, 1]) add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.006), g), head, sd * 0.03, 0.22, 0.06).rotation.x = -0.7; }
  if (e.has('cap')) { const cm = tex.fabric ? new THREE.MeshStandardMaterial({ map: tex.fabric('knit', 0x1a1a1a), roughness: 1 }) : M(0x1a1a1a, 1); const c = add(new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), cm), head, 0, 0.135, -0.005); c.scale.set(0.98, 1.05, 1.02); add(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.014, 6, 20), cm), head, 0, 0.14, -0.005).rotation.x = Math.PI / 2; }
  if (e.has('earring')) add(new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.002, 5, 10), M(0xcfd4d8, 0.2, { metalness: 1 })), head, 0.098, 0.08, 0.005);
  if (e.has('cigarette')) add(new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.05, 6), M(0xe8e2d4, 0.8)), head, 0.1, 0.13, -0.005).rotation.x = Math.PI / 2;
  if (e.has('scarf-throat')) add(new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 8, 16), M(0x5d4a3e, 1)), P.neck, 0, 0.02, 0).rotation.x = Math.PI / 2;
  if (e.has('collar')) add(new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.008), M(0xf2efe6, 0.6)), P.chest, 0, 0.29 * k, 0.07);
  if (e.has('rosary')) { const bead = M(0x1d1714, 0.5); for (let i = 0; i < 9; i++) add(new THREE.Mesh(new THREE.SphereGeometry(0.005, 5, 4), bead), P.chest, Math.sin(i / 8 * Math.PI) * -0.04 + 0.02, 0.26 * k - i * 0.018, 0.155 * W); }
  if (e.has('keys') && !s.keys) { const kc = new THREE.Group(); for (let i = 0; i < 3; i++) { const key = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.004), M(0x9a8a60, 0.3, { metalness: 0.8 })); key.position.set((i - 1) * 0.014, -0.17, 0); key.rotation.z = (i - 1) * 0.3; kc.add(key); } kc.position.set(0.16 * W, -0.02, 0.06); P.hips.add(kc); }
  if (e.has('apron-half')) { const am = tex.fabric ? new THREE.MeshStandardMaterial({ map: tex.fabric('apron', 0xd6d0c2), roughness: 1, side: THREE.DoubleSide }) : M(0xd6d0c2, 1, { side: THREE.DoubleSide }); const ap = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, 0.22 * W, 0.5 * k, 18, 1, true, -1.2, 2.4), am); ap.scale.z = 0.85; ap.position.y = -0.18 * k; P.hips.add(ap); const tie = new THREE.Mesh(new THREE.TorusGeometry(0.165 * W, 0.006, 4, 24), M(0xcfc8b8, 1)); tie.rotation.x = Math.PI / 2; tie.scale.set(1.3, 1, 1); tie.position.y = 0.06; P.hips.add(tie); }
  if (e.has('apron-long')) { const ap = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * W, 0.22 * W, 0.8 * k, 18, 1, true, -1.0, 2.0), M(0x6a5f52, 0.98, { side: THREE.DoubleSide })); ap.scale.z = 0.86; P.spine.add(ap); }
  if (e.has('reflective')) { const rf = M(0xbdbcb0, 0.35, { metalness: 0.3, emissive: 0x1c1c18 }); const b = new THREE.Mesh(new THREE.TorusGeometry(0.2 * W, 0.01, 4, 24), rf); b.rotation.x = Math.PI / 2; b.scale.set(1, 0.82, 1); b.position.y = 0.16 * k; P.chest.add(b); }
  if (e.has('tape')) add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 12), M(0x9a7a1c, 0.55)), P.hips, 0.17 * W, 0, 0.02).rotation.z = Math.PI / 2;
  if (e.has('camera')) { add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), M(0x111111, 0.4, { metalness: 0.5 })), P.chest, -0.05, 0.02, 0.16 * W); const strap = new THREE.Mesh(new THREE.TorusGeometry(0.14 * W, 0.004, 4, 24, Math.PI), M(0x111111, 0.6)); strap.rotation.z = Math.PI; strap.scale.z = 0.55; strap.position.set(-0.02, 0.27 * k, 0.02); P.chest.add(strap); }
  if (e.has('paint-flecks')) for (let i = 0; i < 9; i++) add(new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 3), M([0x6e2e26, 0x8a8f86, 0x3b4a52][i % 3], 0.9)), P.chest, (Math.random() - 0.5) * 0.2, Math.random() * 0.3 * k, 0.15 * W);
  if (e.has('piping')) P.arms.forEach(a => { const pp = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.26 * k, 0.006), M(0xdedbd2, 0.3, { emissive: 0x111111 })); pp.position.set(0.045 * W, -0.15 * k, 0); a.sh.add(pp); });
  if ((e.has('sleeve-tattoo') || e.has('ink-forearm')) && tex.tattoo) (P.forearms || []).forEach((fa, i) => { const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.046 * W, 0.046 * W, 0.18 * k, 10, 1, true), new THREE.MeshStandardMaterial({ map: tex.tattoo(i), transparent: true, roughness: 0.9, depthWrite: false })); fa.add(ink); });
  // Subculture hardware: enamel pins, a studded cuff, a wallet chain.
  if (e.has('pins')) { const cols = [0xb9b2a2, 0x8e3f25, 0x7d8478]; for (let i = 0; i < 3; i++) add(new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.004, 10), M(cols[i], 0.3, { metalness: 0.7 })), P.chest, -0.09 * W + i * 0.022, 0.2 * k - i * 0.012, 0.135 * W).rotation.x = Math.PI / 2; }
  if (e.has('studs')) { const a = P.arms[0]; const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.047 * W, 0.047 * W, 0.04, 12, 1, true), M(0x0c0c0c, 0.5)); cuff.position.y = -0.24 * k; a.el.add(cuff); for (let i = 0; i < 8; i++) { const st = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.012, 4), M(0xc9c9c4, 0.2, { metalness: 0.9 })); const an = i / 8 * Math.PI * 2; st.position.set(Math.cos(an) * 0.05 * W, -0.24 * k, Math.sin(an) * 0.05 * W); st.rotation.z = -Math.cos(an) * 1.57; st.rotation.x = Math.sin(an) * 1.57; a.el.add(st); } }
  if (e.has('chain')) { const ch = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.004, 4, 20, Math.PI), M(0xb8b4a8, 0.25, { metalness: 0.9 })); ch.position.set(0.12 * W, -0.06, 0.05); ch.rotation.set(0, Math.PI / 2 - 0.4, Math.PI); P.hips.add(ch); }
  // Cloth: real weaves instead of flat colour; prints are part of the shirt fabric.
  if (tex.fabric) {
    const topKind = { cardigan: 'knit', knit: 'knit', blazer: 'wool', shirt: 'cotton', leather: 'leather', track: 'nylon', work: 'canvas', jacket: 'canvas', tee: 'cotton', teelong: 'cotton', coat: 'loden', cassock: 'wool' }[s.top[1]] || 'cotton';
    const topMat = P.chestMesh.material; topMat.map = tex.fabric(topKind, s.top[0]); topMat.color.setHex(0xffffff); topMat.needsUpdate = true;
    const legMat = P.legs[0].th.children[0]?.material; if (legMat) { legMat.map = tex.fabric(X.denim ? 'denim' : 'wool', s.legs); legMat.color.setHex(0xffffff); legMat.needsUpdate = true; }
    if ((X.print || X.back) && tex.print) { const pm = topMat.clone(); pm.map = tex.print(X.print, s.top[0], X.back); P.chestMesh.material = pm; }
  }
}

// v12: a fitted black leather jacket, built to read from every side: stand collar and
// asymmetric lapels, an off-centre zip, waistband and buckle, epaulettes, a back yoke
// and centre seam, sleeve seams and zipped cuffs. All parts hug the body; none is a flat panel.
export function leatherJacket(P) {
  const k = P.k, W = P.spec.w, chest = P.chest, spine = P.spine;
  const hide = new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.36, metalness: 0.12 });
  const seam = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.3, metalness: 0.2 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xb8b6ae, roughness: 0.25, metalness: 0.9 });
  P.chestMesh.material = hide; spine.children.forEach(c => { if (c.isMesh) c.material = hide; });
  P.arms.forEach(a => { a.sh.children.forEach(c => { if (c.isMesh) c.material = hide; }); a.el.children.forEach(c => { if (c.isMesh) c.material = hide; }); });
  // fit: taper the waist a little under the ribs
  spine.children.forEach(c => { if (c.isMesh) c.scale.x *= 0.94; });
  const band = (r, tube, y, parent, mat, arc = Math.PI * 2, rot = 0, sz = 0.82) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 28, arc), mat); m.rotation.x = Math.PI / 2; m.rotation.z = rot; m.scale.set(1, sz, 1); m.position.y = y; m.castShadow = true; parent.add(m); return m; };
  // stand collar, open at the throat
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.07, 0.055, 18, 1, true, 0.35, Math.PI * 2 - 0.7), new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.36, side: THREE.DoubleSide })); col.position.set(0, 0.325 * k, 0.004); chest.add(col);
  // asymmetric lapels: two leaf shapes lying on the chest curve
  for (const sd of [-1, 1]) { const lap = new THREE.Mesh(new THREE.CylinderGeometry(0.205 * W, 0.2 * W, 0.16 * k, 12, 1, true, sd > 0 ? 0.05 : -0.42, 0.37), seam); lap.scale.z = 0.83; lap.position.y = 0.2 * k; lap.rotation.z = sd * 0.12; chest.add(lap); }
  // the zip, off-centre, running to the hem
  const zip = new THREE.Mesh(new THREE.CylinderGeometry(0.2025 * W, 0.2025 * W, 0.3 * k, 6, 1, true, 0.1, 0.025), steel); zip.scale.z = 0.83; zip.position.y = 0.06 * k; chest.add(zip);
  const zip2 = new THREE.Mesh(new THREE.CylinderGeometry(0.168 * W, 0.168 * W, 0.2 * k, 6, 1, true, 0.12, 0.03), steel); zip2.scale.z = 0.84; zip2.position.y = 0.13 * k; spine.add(zip2);
  // two slanted pocket zips
  for (const sd of [-1, 1]) { const pz = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * W, 0.17 * W, 0.012, 6, 1, true, sd > 0 ? 0.45 : -0.75, 0.3), steel); pz.scale.z = 0.84; pz.position.y = 0.12 * k; pz.rotation.z = sd * 0.35; spine.add(pz); }
  // waistband with a small buckle at the side
  band(0.165 * W, 0.014, 0.045 * k, spine, seam, Math.PI * 2, 0, 0.84);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.022, 0.008), steel); buckle.position.set(0.07 * W, 0.045 * k, 0.135 * W); spine.add(buckle);
  // epaulettes with snaps
  for (const sd of [-1, 1]) { const ep = new THREE.Mesh(new THREE.BoxGeometry(0.075 * W, 0.008, 0.035), seam); ep.position.set(sd * 0.165 * W, 0.262 * k, 0); ep.rotation.z = -sd * 0.28; chest.add(ep); const sn = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 5), steel); sn.position.set(sd * 0.2 * W, 0.258 * k, 0); chest.add(sn); }
  // back: a yoke seam across the shoulders, a centre seam, two side panels
  band(0.203 * W, 0.004, 0.19 * k, chest, seam, Math.PI * 0.9, Math.PI * 1.05, 0.83);
  const cs = new THREE.Mesh(new THREE.CylinderGeometry(0.2035 * W, 0.2035 * W, 0.26 * k, 4, 1, true, Math.PI - 0.008, 0.016), seam); cs.scale.z = 0.83; cs.position.y = 0.05 * k; chest.add(cs);
  for (const sd of [-1, 1]) { const ps = new THREE.Mesh(new THREE.CylinderGeometry(0.2035 * W, 0.2035 * W, 0.24 * k, 4, 1, true, Math.PI + sd * 0.55, 0.014), seam); ps.scale.z = 0.83; ps.position.y = 0.04 * k; chest.add(ps); }
  // sleeves: elbow seam ring and a zipped cuff
  P.arms.forEach(a => { const er = new THREE.Mesh(new THREE.TorusGeometry(0.052 * W, 0.004, 4, 14), seam); er.rotation.x = Math.PI / 2; a.el.add(er); const cf = new THREE.Mesh(new THREE.CylinderGeometry(0.046 * W, 0.044 * W, 0.045, 12, 1, true), seam); cf.position.y = -0.235 * k; a.el.add(cf); const cz = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.06, 0.004), steel); cz.position.set(0, -0.22 * k, -0.046 * W); a.el.add(cz); });
  P.leather = hide; return hide;
}
