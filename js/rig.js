// Procedural people. Simple solids, articulated, dressed from the v10 cast sheet.
// Faces stay plain and half in shadow; posture, clothes and hair carry who they are.
import * as THREE from 'three';
// Ported from the egtest vertical slice (G340G/egtest js/people.js): Il Primo's rig.
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
  const belly = cap(0.135 * W, 0.12 * k, top); belly.scale.set(1.22, 1, 0.82); belly.position.y = 0.16 * k; spine.add(belly); P.belly = belly;
  const chest = new THREE.Group(); chest.position.y = 0.27 * k; spine.add(chest); P.chest = chest;
  const ch = cap(0.155 * W, 0.16 * k, top); ch.scale.set(1.3, 1, 0.82); ch.position.y = 0.12 * k; chest.add(ch); P.chestMesh = ch;
  if (s.female) for (const sd of [-1, 1]) { const b = sph(0.06 * W, top, 12, 10); b.scale.set(1, 0.85, 0.75); b.position.set(sd * 0.075 * W, 0.12 * k, 0.1 * W); chest.add(b); }
  if (s.heavy) { const g = cap(0.15 * W, 0.08, top); g.scale.set(1.3, 1, 1.05); g.position.set(0, 0.1 * k, 0.03); spine.add(g); }
  // clothing details
  const kind = s.top[1];
  // v10: no flat under-shirt strips on the chest. A collar ring in the shirt colour shows at the neckline instead.
  if (['cardigan', 'jacket', 'blazer', 'leather', 'coat', 'track', 'work', 'cassock'].includes(kind)) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06 * W, 0.016, 6, 18), kind === 'cassock' ? M(0xf2efe6, 0.6) : under); ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.29 * k, 0.012); ring.scale.set(1, 1.15, 1); P.collarRing = ring; chest.add(ring); }
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
  const nm = cap(s.female ? 0.045 : 0.056, 0.035, s.hood ? M(s.hair[1], 0.95) : skin); nm.position.set(0, 0.04, -0.012); nm.scale.z = 0.92; neck.add(nm);
  if (!s.hood) { const trap = new THREE.Mesh(new THREE.CylinderGeometry(s.female ? 0.06 : 0.07, (s.female ? 0.15 : 0.175) * W, 0.09, 18, 1, true), top); trap.scale.z = 0.62; trap.position.set(0, 0.255 * k, -0.012); chest.add(trap); P.trap = trap; }
  if (!s.hood && !s.female) { const ad = sph(0.011, skin, 8, 6); ad.scale.set(0.8, 1.2, 0.7); ad.position.set(0, 0.045, 0.042); neck.add(ad); }
  const head = new THREE.Group(); head.position.y = 0.072; neck.add(head); P.head = head;
  if (s.hood) {
    // quarry blasting hood: heavy canvas over head and shoulders, an opaque visor, a metal catch
    const hm = M(0x4a4334, 0.98); const hood = sph(0.15, hm, 16, 12); hood.scale.set(1.0, 1.25, 1.05); hood.position.y = 0.1; head.add(hood);
    const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 0.32, 16, 1, true), M(0x4a4334, 0.98, { side: THREE.DoubleSide })); cape.position.y = -0.1; cape.castShadow = true; head.add(cape);
    const visor = bx(0.17, 0.09, 0.03, M(0x07080a, 0.08, { metalness: 0.7 })); visor.position.set(0, 0.12, 0.14); head.add(visor);
    const frame = bx(0.2, 0.12, 0.02, M(0x2a2620, 0.6, { metalness: 0.4 })); frame.position.set(0, 0.12, 0.13); head.add(frame);
    const cat = bx(0.03, 0.05, 0.02, M(0x8a8a86, 0.25, { metalness: 0.9 })); cat.position.set(0.15, 0.02, 0.05); head.add(cat); P.catch = cat;
    P.mouth = null;
  } else {
    // v18: one sculpted head instead of a cluster of spheres. The face is shaped in the mesh
    // (jaw taper, chin, flat face plane, cheekbones) and shaded with vertex colour (sockets,
    // lips), and the features are placed on the actual surface.
    const headMat = new THREE.MeshStandardMaterial({ color: s.skin, roughness: 0.72, vertexColors: true });
    const hg = headGeometry(0.1, 40, 32, s); const skull = new THREE.Mesh(hg, headMat); skull.position.y = 0.11; skull.castShadow = true; skull.receiveShadow = false; head.add(skull); P.skull = skull;
    P.headMat = headMat; P.skinMat = skin;
    const surf = (x, y) => surfaceZ(hg, x, y - 0.11);
    const featM = M(new THREE.Color(s.skin).multiplyScalar(0.92).getHex(), 0.7);
    // nose: a soft wedge from the brow to a rounded tip
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.013, 0.042, 10), featM); nose.position.set(0, 0.106, surf(0, 0.106) + 0.002); nose.rotation.x = 0.32; head.add(nose);
    const tip = sph(0.01, featM, 10, 8); tip.scale.set(1.15, 0.85, 0.9); tip.position.set(0, 0.087, surf(0, 0.087) + 0.008); head.add(tip);
    for (const sd of [-1, 1]) {
      const ey = 0.132, ex = sd * 0.033, ez = surf(ex, ey);
      const white = sph(s.female ? 0.0115 : 0.0102, M(0xd8d0c0, 0.4), 12, 10); white.scale.set(1.15, s.female ? 0.78 : 0.68, 0.6); white.position.set(ex, ey, ez - 0.004); head.add(white);
      const iris = sph(0.0058, M(s.eyes ?? 0x1c1612, 0.25), 10, 8); iris.position.set(ex, ey, ez + 0.001); iris.scale.set(1, 1, 0.5); head.add(iris);
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(s.female ? 0.0022 : 0.0036, s.female ? 0.024 : 0.027, 3, 6), hairM); brow.rotation.z = Math.PI / 2 - sd * (s.female ? 0.28 : 0.1); brow.position.set(sd * 0.034, s.female ? 0.155 : 0.151, surf(sd * 0.034, 0.152) + 0.003); head.add(brow);
      const ear = sph(0.02, featM, 10, 8); ear.scale.set(0.38, 1.05, 0.72); ear.position.set(sd * (sideX(hg, 0.005) + 0.003), 0.115, -0.004); head.add(ear); (P.ears ||= []).push(ear);
    }
    const mouth = bx(s.female ? 0.031 : 0.028, s.female ? 0.0045 : 0.003, 0.006, M(new THREE.Color(s.skin).multiplyScalar(0.42).lerp(new THREE.Color(0x5a2a24), 0.3).getHex(), 0.7)); mouth.position.set(0, 0.06, surf(0, 0.06) + 0.001); head.add(mouth); P.mouth = mouth;
    P.lids = [-1, 1].map(sd => { const ex = sd * 0.033; const l = sph(0.0125, headMat, 10, 6); l.scale.set(1.2, 0.12, 0.62); l.position.set(ex, 0.138, surf(ex, 0.132) - 0.002); head.add(l); return l; });
    P.headGeo = hg;
    if (s.stubble) { const st = new THREE.Mesh(beardGeometry(hg, 1.012, 0.64), M(new THREE.Color(s.skin).multiplyScalar(0.68).getHex(), 1, { transparent: true, opacity: 0.55 })); st.position.y = 0.11; head.add(st); }
    if (s.earring) { const er = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.002, 6, 10), M(0xcfd4d8, 0.2, { metalness: 1 })); er.position.set(P.ears[1].position.x + 0.002, 0.088, 0.004); head.add(er); }
    if (hair(head, s.hair[0], hairM, R, !!s.female, s.hair[2])) P.ears.forEach(e => (e.visible = false));
  }
  root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  faceShadows(P);
  // state
  Object.assign(P, { pose: 'stand', look: null, lookW: 0, talk: 0, laugh: 0, laughFrozen: false, smile: 0, breathe: R() * 6, sleep: 0, walk: null, idle: null, yaw: 0, t0: R() * 10, anim: null, tremble: 0, headTilt: 0 });
  return P;
}

function hair(head, style, m, R, female = false, roots = null) {
  // Hair fits the skull: a cap is the top of the same sculpted head, a few millimetres out,
  // tilted so the hairline sits higher at the front than at the nape. Length is a single
  // smooth drape behind, not a pile of spheres.
  const hg = head.parent ? null : null;
  const cap = (scale, front = 0.47, back = 0.66, bump = 0) => { const g = hairCapGeometry(0.1, scale, front, back, bump, R, 0, female); const c = new THREE.Mesh(g, m); c.position.y = 0.11; c.castShadow = true; head.add(c); return c; };
  const m2 = m.clone(); m2.side = THREE.DoubleSide;
  const frame = (len, width, wave = 0) => { const g = frameGeometry(len, width, wave); const d = new THREE.Mesh(g, m2); d.position.set(0, 0.15, -0.006); d.castShadow = true; head.add(d); return d; };
  const drape = (len, width, wave = 0, lift = 0) => { const g = drapeGeometry(len, width, wave, R); const d = new THREE.Mesh(g, m.side === THREE.DoubleSide ? m : Object.assign(m.clone(), { side: THREE.DoubleSide })); d.position.set(0, 0.13 + lift, -0.02); d.castShadow = true; head.add(d); return d; };
  // Hair that falls: the head's own shell above the ears, hanging straight below them, open at the face.
  const fall = (o) => { const mm = m.clone(); mm.side = THREE.DoubleSide; mm.vertexColors = true; if (o.roots != null) { const a = new THREE.Color(o.roots), b = m.color; o.rootsRatio = [a.r / b.r, a.g / b.g, a.b / b.b]; } const f = new THREE.Mesh(fallGeometry(o), mm); f.position.y = 0.11; f.castShadow = true; head.add(f); return f; };
  switch (style) {
    case 'short': cap(1.045, 0.42, 0.6); break;
    case 'crop': cap(1.025, 0.4, 0.58); break;
    case 'knot': { cap(female ? 1.07 : 1.04, 0.42, 0.62); const b = new THREE.Mesh(new THREE.SphereGeometry(female ? 0.04 : 0.034, 16, 12), m); b.position.set(0, 0.1, -0.122); b.scale.set(1, 0.9, 0.85); head.add(b); break; }
    case 'curls': cap(1.07, 0.44, 0.64, 0.012); break;
    case 'collar': cap(1.05, 0.45, 0.66); drape(0.12, 0.09, 0.004); break;
    case 'fringe': cap(1.05, 0.56, 0.66); break;
    case 'bleach': cap(1.03, 0.4, 0.58); break;
    case 'overeye': { const c = cap(1.05, 0.55, 0.64); c.rotation.z = -0.12; break; }
    case 'longtop': cap(1.05, 0.48, 0.5); break;
    case 'long': if (female) { cap(1.05, 0.46, 0.66); frame(0.3, 0.112, 0.004); } else fall({ scale: 1.05, len: 0.15, open: 1.72, taper: 0.66, front: 0.44, female: false }); break;
    case 'bob': fall({ scale: 1.075, len: 0.085, open: 1.18, taper: 0.97, front: 0.52, female: true, roots }); return true;
    case 'receding': cap(1.03, 0.3, 0.6); break;
    case 'bald': { const g = hairCapGeometry(0.1, 1.025, 0.1, 0.7, 0, R, 0.3); const c = new THREE.Mesh(g, m); c.position.y = 0.11; head.add(c); break; }
    case 'scarf': { const sm = M(0x4b3d33, 1); const sc = new THREE.Mesh(hairCapGeometry(0.1, 1.11, 0.6, 0.74, 0, R), sm); sc.position.y = 0.11; head.add(sc); const tail = new THREE.Mesh(drapeGeometry(0.1, 0.05, 0, R), sm); tail.position.set(0, 0.04, -0.09); head.add(tail); break; }
    case 'longcurls': cap(1.08, 0.46, 0.66, 0.012); if (female) frame(0.3, 0.116, 0.01); else drape(0.34, 0.115, 0.012); break;
  }
}
// The head: a sphere pushed into a skull and a face.
export function headGeometry(r = 0.1, ws = 36, hs = 28, s = {}) {
  const g = new THREE.SphereGeometry(r, ws, hs); shapeHead(g, r, !!s.female);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), base = new THREE.Color(1, 1, 1);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / r, y = p.getY(i) / r, z = p.getZ(i) / r; let c = 1, rr = 1, gg = 1, bb = 1;
    // eye sockets: a soft shadow above and around each eye
    for (const sd of [-1, 1]) { const d = Math.hypot((x - sd * 0.34) / 0.2, (y - 0.24) / 0.15); if (z > 0.5) c -= Math.max(0, 1 - d) * 0.28; }
    // lips: a little colour on the mouth line
    { const d = Math.hypot(x / (s.female ? 0.27 : 0.23), (y + 0.42) / (s.female ? 0.11 : 0.06)); if (z > 0.6) { const k = Math.max(0, 1 - d); rr -= k * (s.female ? 0.02 : 0.08); gg -= k * (s.female ? 0.3 : 0.2); bb -= k * (s.female ? 0.26 : 0.18); } }
    // cheeks: faint warmth; under the jaw: shade
    for (const sd of [-1, 1]) { const d = Math.hypot((x - sd * 0.55) / 0.22, (y + 0.1) / 0.2); if (z > 0.3) { const k = Math.max(0, 1 - d); gg -= k * 0.05; bb -= k * 0.06; } }
    if (y < -0.7) c -= (-0.7 - y) * 0.6;
    col[i * 3] = c * rr; col[i * 3 + 1] = c * gg; col[i * 3 + 2] = c * bb;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
}
function shapeHead(g, r, female = false) {
  // A skull with a face under it: a fuller cranium behind, a face plane that narrows below the
  // cheekbones to the angle of the jaw and then to the chin, a flat underside that becomes the
  // jawline. Men: wider jaw, squarer chin, heavier brow. Women: narrower jaw, softer chin.
  // Every adjustment is weighted smoothly, so the surface has no creases.
  const p = g.attributes.position, L = THREE.MathUtils.lerp;
  // smoothstep that also runs downhill (edges given high-to-low): three's returns 1 above a reversed pair
  const ss = (v, a, b) => a <= b ? THREE.MathUtils.smoothstep(v, a, b) : 1 - THREE.MathUtils.smoothstep(v, b, a);
  const win = (v, a, b) => { const e = (b - a) * 0.35; return ss(v, a, a + e) * (1 - ss(v, b - e, b)); };
  const jawW = female ? 0.66 : 0.8, chinW = female ? 0.36 : 0.48, brow = female ? 0.012 : 0.05, chinF = female ? 0.04 : 0.09;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i) / r, y = p.getY(i) / r, z = p.getZ(i) / r;
    const ax = Math.abs(x);
    if (z < 0) z *= 1 + 0.16 * ss(y, -0.6, -0.25);                                           // occiput
    { const t = ss(y, -0.15, -0.62); let w = L(1, jawW, t); w *= L(1, chinW / jawW, ss(z, 0.15, 0.95) * ss(y, -0.35, -0.85)); x *= w; if (z < 0) z *= L(1, 0.5, t); }
    if (y < -0.62) { const k = ss(y, -0.62, -0.95); y = L(y, -0.72 + (y + 0.72) * 0.3, k); } // a jawline, not a dome
    z += chinF * ss(z, 0.45, 0.65) * ss(y, -0.5, -0.78);                                       // chin
    if (z > 0.6) z -= (z - 0.6) * 0.42;                                                         // face plane
    z += brow * win(y, 0.08, 0.38) * ss(z, 0.5, 0.7) * (1 - Math.min(1, ax / 0.75));            // brow ridge
    { const wc = win(ax, 0.45, 0.92) * win(y, -0.3, 0.12) * ss(z, 0.25, 0.5); x *= 1 + 0.05 * wc; z += 0.022 * wc; }   // cheekbones
    z -= (female ? 0.008 : 0.02) * win(ax, 0.32, 0.72) * win(y, -0.64, -0.28) * ss(z, 0.42, 0.62);                     // hollow under the cheekbone
    x *= 1 - 0.035 * win(y, 0.1, 0.5) * ss(ax, 0.7, 0.82) * ss(z, -0.25, 0);                   // temples
    x *= 1 + 0.07 * ss(y, 0.2, 0.85);                                                           // a broad crown, not an egg
    p.setXYZ(i, x * r * (female ? 0.76 : 0.8), y * r * 1.14, z * r * 1.02);
  }
}
export function sideX(g, y) {
  const p = g.attributes.position; let m = 0.07;
  for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i) - y) < 0.01 && Math.abs(p.getZ(i)) < 0.02) m = Math.max(m, Math.abs(p.getX(i)));
  return m;
}
export function surfaceZ(g, x, y) {
  const p = g.attributes.position; let best = -1, bz = 0.08;
  for (let i = 0; i < p.count; i++) { const vz = p.getZ(i); if (vz <= 0) continue; const d = Math.hypot(p.getX(i) - x, p.getY(i) - y); if (d < 0.012 && vz > best) { best = vz; bz = vz; } }
  return bz;
}
// A cap of hair: the top of the same head shape, scaled out, with the hairline lower behind.
export function hairCapGeometry(r, scale, front, back, bump, R, band = 0, female = false) {
  const g = new THREE.SphereGeometry(r, 40, 22, 0, Math.PI * 2, 0, Math.PI * 0.64); shapeHead(g, r, female);
  const p = g.attributes.position, keep = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = Math.hypot(x, y, z) || 1, ny = y / n, nz = z / n;
    const fz = THREE.MathUtils.smoothstep(nz, -0.2, 0.85), line = THREE.MathUtils.lerp(-(back - 0.5) * 2.2, (0.5 - front) * 2.2 + 0.58, fz);   // hairline height: low at the nape, high at the brow
    let sc = scale; if (bump) sc += (Math.sin(x * 140) * Math.cos(z * 150) * Math.sin(y * 120)) * bump * 6;
    // below the hairline the cap sinks under the skin, so the edge reads as a hairline, not a rim
    let k = THREE.MathUtils.smoothstep(ny, line - 0.07, line + 0.03);
    if (band) k *= 1 - THREE.MathUtils.smoothstep(ny, band - 0.04, band + 0.06);                       // bald: a fringe only
    const f = THREE.MathUtils.lerp(0.82, sc, k);
    p.setXYZ(i, x * f, y * f, z * f);
  }
  g.computeVertexNormals(); return g;
}
// A full head of hair that falls: above the ears it is the skull scaled out (hairline tucked under
// the skin), below them every column hangs straight down from the widest ring of the head, tapering
// toward the neck and curling under at the ends. The face stays open; dark roots at the crown.
export function fallGeometry({ scale = 1.07, len = 0.1, open = 1.2, front = 0.5, back = 0.66, taper = 0.95, female = true, rootsRatio = null } = {}) {
  const r = 0.1, ws = 56, hs = 36, eq = hs / 2, ss = THREE.MathUtils.smoothstep, L = THREE.MathUtils.lerp;
  const g = new THREE.SphereGeometry(r, ws, hs); shapeHead(g, r, female);
  const p = g.attributes.position, ring = [], col = new Float32Array(p.count * 3).fill(1);
  for (let ix = 0; ix <= ws; ix++) { const e = eq * (ws + 1) + ix; ring.push([p.getX(e), p.getY(e), p.getZ(e)]); }
  for (let iy = 0; iy <= hs; iy++) for (let ix = 0; ix <= ws; ix++) {
    const i = iy * (ws + 1) + ix, x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (iy <= eq) {
      const n = Math.hypot(x, y, z) || 1, ny = y / n, nz = z / n;
      const line = L(-(back - 0.5) * 2.2, (0.5 - front) * 2.2 + 0.58, ss(nz, -0.2, 0.85));
      const k = ss(ny, line - 0.07, line + 0.03), f = L(0.82, scale, k);
      p.setXYZ(i, x * f, y * f, z * f);
      if (rootsRatio) { const d = 0.85 * ss(ny, 0.8, 0.97) * k; for (let c = 0; c < 3; c++) col[i * 3 + c] = L(1, rootsRatio[c], d); }
    } else {
      const t = (iy - eq) / eq, [xe, ye, ze] = ring[ix], phi = Math.abs(Math.atan2(xe, ze));
      const k = ss(phi, open - 0.12, open + 0.12);
      const rad = scale * (1 - (1 - taper) * ss(t, 0, 0.9)) * (1 - 0.1 * ss(t, 0.8, 1));
      const hx = xe * rad, hy = ye * scale - len * Math.min(t, 0.9) / 0.9, hz = ze * rad;
      p.setXYZ(i, L(x * 0.85, hx, k), L(y * 0.85, hy, k), L(z * 0.85, hz, k));
      col.fill(0.82, i * 3, i * 3 + 3);   // the underside of a fall of hair is in its own shade
      if (iy === eq + 1) col.fill(0.95, i * 3, i * 3 + 3);
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
}
// The beard follows the jaw: the lower front of the head, scaled just out from the skin.
export function beardGeometry(headGeo, scale = 1.05, from = 0.64, toSide = 1.35) {
  const r = 0.1, g = new THREE.SphereGeometry(r, 36, 18, Math.PI / 2 - toSide, toSide * 2, Math.PI * from, Math.PI * (1 - from) * 0.9); shapeHead(g, r);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * scale, p.getY(i) * scale, p.getZ(i) * scale);
  g.computeVertexNormals(); return g;
}
// Long hair behind: one tapered, slightly wavy sheet that sits on the shoulders.
export function drapeGeometry(len, width, wave, R) {
  const g = new THREE.CylinderGeometry(width, width * 1.15, len, 24, 8, true, Math.PI * 0.55, Math.PI * 0.9); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const t = (len / 2 - y) / len; p.setXYZ(i, x + Math.sin(y * 60 + x * 30) * wave, y - len / 2, z * 0.75 - t * 0.02); }
  g.computeVertexNormals(); return g;
}


// ---- gait ---------------------------------------------------------------------
// Walking is driven by distance, not by a clock: the gait phase advances by the ground the
// body actually covers divided by the stride, so a planted foot stays planted whatever the
// speed. The cycle follows the clinical description of human gait (e.g. Joseph et al. 2024,
// PMC11678955): stance ~60% of the cycle and swing ~40%, two double-support periods; within
// stance, heel contact, loading response (the foot rolls flat over the heel while the knee
// takes the weight), mid-stance with the foot flat and the body vaulting over it, then heel
// rise and toe-off pivoting on the ball of the foot. In swing the knee folds early for
// clearance, the toes come up, and the leg reaches forward for the next heel contact.
// The ankle path is placed on the ground in the body frame and the hip and knee are solved
// with two-bone IK; the pelvis height follows from the legs (highest in mid-stance, lowest in
// double support), which gives the few centimetres of vertical motion of real walking and
// no more. The arms swing as passive pendulums opposite the legs, a little behind them, and
// the thorax counter-rotates against the pelvis (Collins, Adamczyk & Kuo 2009, PMC2817299:
// normal arm swing is cheap, cancels much of the legs' vertical angular momentum, and moves
// each arm with the opposite leg). Each person gets their own stride, sway, arm swing,
// lean and tempo from their build.
const L1 = 0.44, L2 = 0.43, SOLE = 0.055, HEEL = 0.06, BALL = 0.13;
const sm = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const minJerk = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (10 - 15 * x + 6 * x * x); };
export function gaitParams(P) {
  if (P.gaitP) return P.gaitP;
  const s = P.spec || {}, R = rng((P.key || 'x').split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const v = (a, b) => a + (b - a) * R();
  const heavy = !!s.heavy, fem = !!s.female, old = (s.age || 0) > 60 || /primo|remo|first/.test(P.key || '');
  P.gaitP = {
    stride: v(1.06, 1.18) * (heavy ? .92 : 1) * (fem ? .96 : 1) * (old ? .92 : 1),
    duty: v(.59, .62),
    arm: v(.17, .27) * (heavy ? .8 : 1) * (old ? .8 : 1), elbow: v(.24, .36), armOut: v(.06, .1) + (heavy ? .06 : 0), lag: v(.03, .06),
    yaw: v(.055, .085) * (fem ? 1.25 : 1), roll: v(.035, .055) * (heavy ? 1.3 : 1), sway: v(.012, .02) * (heavy ? 1.5 : 1),
    lean: v(.03, .07) + (old ? .05 : 0), crouch: v(.015, .03), clear: v(.075, .095),
    pre: v(0, .12) + (heavy ? .1 : 0) + (old ? .08 : 0), rise: v(1.35, 1.65) + (heavy ? .25 : 0) + (old ? .3 : 0),
  };
  return P.gaitP;
}
// Ankle position (z forward, y up, root frame) and foot pitch (+ = toes down) for one leg.
function footAt(phi, S, beta, k, gY) {
  if (phi < beta) {
    const u = phi / beta, zh = S * beta * (0.5 - u) - HEEL;
    let p = 0, qz = 0, Pz = 0;
    if (u < 0.16) { p = -0.26 * (1 - sm(u / 0.16)); qz = -HEEL; Pz = zh; }
    else if (u > 0.55) { p = 0.62 * sm((u - 0.55) / 0.45); qz = BALL; Pz = zh + HEEL + BALL; }
    else return { z: zh + HEEL, y: gY + SOLE, p: 0 };
    const c = Math.cos(p), si = Math.sin(p), qy = -SOLE;
    return { z: Pz - (qy * si + qz * c), y: gY - (qy * c - qz * si), p };
  }
  const u = (phi - beta) / (1 - beta), a = footAt(beta - 1e-6, S, beta, k, gY), b = footAt(0, S, beta, k, gY), m = minJerk(u);
  const lift = Math.sin(Math.PI * Math.pow(u, 0.7));
  const p = u < 0.35 ? 0.62 + (-0.12 - 0.62) * sm(u / 0.35) : -0.12 + (-0.26 + 0.12) * sm((u - 0.35) / 0.65);
  return { z: a.z + (b.z - a.z) * m, y: a.y + (b.y - a.y) * m + lift * k * 0.085, p, lift };
}
function legIK(dz, dy, k) {
  const a = L1 * k, b = L2 * k; let D = Math.hypot(dz, dy); D = Math.max(0.25 * k, Math.min((a + b) * 0.999, D));
  const kn = Math.PI - Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - D * D) / (2 * a * b))));
  const th = Math.atan2(-dz, -dy) - Math.acos(Math.max(-1, Math.min(1, (a * a + D * D - b * b) / (2 * a * D))));
  return [th, kn];
}
// Returns pose overrides for walking (and for standing up from a chair), or null.
function gaitPose(P, dt, moving, dist, pre) {
  const G = gaitParams(P), k = P.k, g = P.g || (P.g = { ph: 0, gw: 0, v: 0, hy: 0.92 * k, pre: 0 });
  const standY = 0.92 * k, gY = standY - (L1 + L2) * k - SOLE;
  g.v += ((dt > 0 ? dist / dt : 0) - g.v) * Math.min(1, dt * 6);
  g.gw += ((moving ? 1 : 0) - g.gw) * Math.min(1, dt * (moving ? 5 : 3.5));
  g.pre += ((pre ? 1 : 0) - g.pre) * Math.min(1, dt * 7);
  if (g.gw < 0.01 && g.pre < 0.01 && !P.rise) { g.ph = G.duty; g.hy = standY; return null; }
  const beta = G.duty, sfac = Math.max(0.35, Math.min(1.15, Math.pow(Math.max(0, g.v) / (1.15 * k), 0.55)));
  const S = Math.max(0.32 * k, G.stride * k * sfac);
  g.ph = (g.ph + dist / S) % 1;
  const phi = [g.ph, (g.ph + 0.5) % 1], ft = phi.map(f => footAt(f, S, beta, k, gY));
  const Rm = (L1 + L2) * k * 0.985;
  let hy = standY - G.crouch * k;
  for (const f of ft) hy = Math.min(hy, f.y + Math.sqrt(Math.max(0, Rm * Rm - f.z * f.z)));
  g.hy += (hy - g.hy) * Math.min(1, dt * 30);
  const w = g.gw, two = Math.PI * 2;
  const o = { w, hipsY: g.hy, th: [0, 0], kn: [0, 0], an: [0, 0], thZ: [0, 0], sh: [0, 0], shZ: [0, 0], el: [0, 0] };
  for (let i = 0; i < 2; i++) { const [th, kn] = legIK(ft[i].z, ft[i].y - g.hy, k); o.th[i] = th; o.kn[i] = kn; o.an[i] = ft[i].p - th - kn; }
  const amp = Math.min(1, sfac) * w;
  o.yaw = G.yaw * amp * Math.cos(two * phi[0]);
  o.roll = -G.roll * amp * Math.sin(two * (phi[0] + 0.1));
  o.sway = -(G.sway * k) * (amp * Math.sin(two * (phi[0] - 0.05)) + g.pre * 1.2 * (1 - w));
  o.lean = (G.lean * (0.5 + 0.5 * sfac)) * w + g.pre * 0.06;
  for (let i = 0; i < 2; i++) {
    const c = Math.cos(two * (phi[1 - i] - G.lag));
    o.sh[i] = 0.07 - G.arm * Math.max(0.5, sfac) * c; o.el[i] = -(G.elbow + 0.18 * Math.max(0, c)); o.shZ[i] = (i === 0 ? 1 : -1) * G.armOut;
    o.thZ[i] = -(o.sway / ((L1 + L2) * k)) - o.roll;
  }
  o.skirt = (o.th[0] + o.th[1]) * 0.18;
  return o;
}
// Standing up from a chair (sit-to-stand): feet drawn back under the knees, the trunk pitches
// forward to bring the weight over the feet (flexion momentum), the seat comes off the chair
// and hips and knees extend together while the trunk comes upright, then a small settle.
// The feet do not move once they are under the body.
function risePose(P, dt) {
  const r = P.rise, G = gaitParams(P), k = P.k, standY = 0.92 * k, gY = standY - (L1 + L2) * k - SOLE;
  r.t += dt; const u = r.t / r.dur;
  if (u >= 1) { P.rise = null; return null; }
  const tuck = { z: 0.05 * k, y: gY + SOLE };
  const a = sm(u / 0.3), lift = sm((u - 0.3) / 0.5);
  const az = r.az + (tuck.z - r.az) * a, ay = r.ay + (tuck.y - r.ay) * a;
  const hy = r.hy + (standY - G.crouch * 0.5 * k - r.hy) * lift;
  const o = { w: 1, hipsY: hy, th: [0, 0], kn: [0, 0], an: [0, 0], thZ: [0, 0], sh: [0, 0], shZ: [0.1, -0.1], el: [0, 0], yaw: 0, roll: 0, sway: 0, skirt: 0, rise: true };
  for (let i = 0; i < 2; i++) { const [th, kn] = legIK(az, ay - hy, k); o.th[i] = th; o.kn[i] = kn; o.an[i] = -th - kn; }
  o.lean = 0.55 * sm(u / 0.32) * (1 - sm((u - 0.45) / 0.45)) + G.lean * 0.5 * sm((u - 0.6) / 0.4);
  const push = sm(u / 0.2) * (1 - sm((u - 0.55) / 0.3));
  o.sh = [-0.15 - 0.35 * push, -0.15 - 0.35 * push]; o.el = [-0.25 - 0.55 * push, -0.25 - 0.55 * push];
  return o;
}
function startRise(P) {
  const k = P.k, L = P.legs, th = L[0].th.rotation.x, kn = L[0].kn.rotation.x, hy = P.hips.position.y;
  P.rise = { t: 0, dur: gaitParams(P).rise, hy, az: -L1 * k * Math.sin(th) - L2 * k * Math.sin(th + kn), ay: hy - L1 * k * Math.cos(th) - L2 * k * Math.cos(th + kn) };
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
  // walking: distance-driven gait (see gaitPose). Internal walks move the root here;
  // external walks (the game moving the object) report the distance covered in P.extWalk.
  let dist = 0, moving = false;
  if (P.walk) {
    const w = P.walk; const dx = w.to.x - P.root.position.x, dz = w.to.z - P.root.position.z; const d = Math.hypot(dx, dz);
    if (d > 0.04) {
      const sp = Math.min(d, w.speed * dt); P.root.position.x += dx / d * sp; P.root.position.z += dz / d * sp; dist = sp; moving = true;
      const yaw = Math.atan2(dx, dz); let dy = yaw - P.root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2; P.root.rotation.y += dy * Math.min(1, dt * 6);
    } else { if (w.face !== undefined) { let dy = w.face - P.root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2; P.root.rotation.y += dy * Math.min(1, dt * 5); if (Math.abs(dy) < 0.02) { const r = w.resolve; P.walk = null; r && r(); } } else { const r = w.resolve; P.walk = null; r && r(); } }
  }
  if (P.extWalk) { dist += P.extWalk.dist || 0; P.extWalk.dist = 0; if (P.extWalk.on) moving = true; }
  const wasSit = P._lastPose === 'sit' || P._lastPose === 'lean' || P._lastPose === 'sleep';
  if (wasSit && P.pose === 'stand' && !P.noRise) startRise(P);
  P._lastPose = P.pose;
  const ov = P.rise ? risePose(P, dt) : gaitPose(P, dt, moving, dist, !!(P.extWalk && P.extWalk.pre));
  P.walking = !!(ov && !ov.rise && ov.w > 0.3);
  if (ov && !ov.rise && ov.w > 0.05) { spineX = ov.lean; }
  // laughter: shoulders shake, head goes back, mouth opens
  const lg = P.laughFrozen ? 0 : P.laugh;
  if (lg > 0) { const sh = Math.sin(t * 22 + P.t0) * 0.5 + 0.5; chestX -= lg * (0.12 + sh * 0.05); neckX -= lg * 0.2; shZ[0] += lg * 0.05 * sh; shZ[1] -= lg * 0.05 * sh; hipsY += lg * sh * 0.008; }
  // apply
  P.hips.position.y += (hipsY - P.hips.position.y) * Math.min(1, dt * 10);
  for (let i = 0; i < 2; i++) { const l = L[i]; l.th.rotation.x += (legT[i][0] - l.th.rotation.x) * Math.min(1, dt * 12); l.kn.rotation.x += (legT[i][1] - l.kn.rotation.x) * Math.min(1, dt * 12); l.an.rotation.x = -l.th.rotation.x - l.kn.rotation.x; }
  for (let i = 0; i < 2; i++) { const a = Ar[i]; const tr = P.tremble ? Math.sin(t * 40 + i) * P.tremble * 0.03 : 0; a.sh.rotation.x += (shX[i] + tr - a.sh.rotation.x) * Math.min(1, dt * 8); a.sh.rotation.z += (shZ[i] - a.sh.rotation.z) * Math.min(1, dt * 8); a.el.rotation.x += (elX[i] - a.el.rotation.x) * Math.min(1, dt * 8); }
  if (ov) {
    const w = ov.w, mix = (a, b) => a + (b - a) * w;
    P.hips.position.y = mix(P.hips.position.y, ov.hipsY);
    for (let i = 0; i < 2; i++) { const l = L[i]; l.th.rotation.x = mix(l.th.rotation.x, ov.th[i]); l.kn.rotation.x = mix(l.kn.rotation.x, ov.kn[i]); l.an.rotation.x = mix(l.an.rotation.x, ov.an[i]); l.th.rotation.z = ov.thZ[i] * w; }
    for (let i = 0; i < 2; i++) { const a = Ar[i]; a.sh.rotation.x = mix(a.sh.rotation.x, ov.sh[i]); a.sh.rotation.z = mix(a.sh.rotation.z, ov.shZ[i]); a.el.rotation.x = mix(a.el.rotation.x, ov.el[i]); }
    P.hips.rotation.y = ov.yaw; P.hips.rotation.z = ov.roll; P.hips.position.x = ov.sway;
    P.spine.rotation.y = -ov.yaw * 0.55; P.chest.rotation.y = -ov.yaw * 0.75; P.chest.rotation.z = -ov.roll * 0.45;
    if (ov.rise) spineX = ov.lean;
    if (P.skirt) { P.skirt.rotation.x += (ov.skirt * w - P.skirt.rotation.x) * Math.min(1, dt * 6); P.skirt.rotation.z = -ov.roll * 0.8; }
    if (P.apron) P.apron.rotation.x += (ov.skirt * 0.5 * w - P.apron.rotation.x) * Math.min(1, dt * 6);
  } else if (P.hips.rotation.y || P.hips.position.x || P.hips.rotation.z) {
    P.hips.rotation.y *= 0.8; P.hips.rotation.z *= 0.8; P.hips.position.x *= 0.8; P.spine.rotation.y *= 0.8; P.chest.rotation.y *= 0.8; P.chest.rotation.z *= 0.8;
    L.forEach(l => { l.th.rotation.z *= 0.8; }); if (P.skirt) { P.skirt.rotation.x *= 0.9; P.skirt.rotation.z *= 0.9; }
  }
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
  P.head.rotation.z += (P.headTilt - (ov ? ov.roll * 0.55 : 0) - P.head.rotation.z) * Math.min(1, dt * 3);
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
  if (e.has('beard-full') || e.has('beard-grey')) { const bm = e.has('beard-grey') ? M(0xa29d93, 1) : hairM; add(new THREE.Mesh(beardGeometry(P.headGeo, 1.05, 0.67), bm), head, 0, 0.11, 0); const mo = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.0045, 0.026, 3, 8), bm), head, 0, 0.069, surfaceZ(P.headGeo, 0, 0.069 - 0.11) + 0.004); mo.rotation.z = Math.PI / 2; mo.scale.set(1, 1, 0.7); }
  if (e.has('stubble')) add(new THREE.Mesh(beardGeometry(P.headGeo, 1.012, 0.64), M(new THREE.Color(s.skin).multiplyScalar(0.62).getHex(), 1, { transparent: true, opacity: 0.6 })), head, 0, 0.11, 0);
  if (e.has('moustache')) { const mo = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.0045, 0.026, 3, 8), M(0x9a948a, 1)), head, 0, 0.069, surfaceZ(P.headGeo, 0, 0.069 - 0.11) + 0.004); mo.rotation.z = Math.PI / 2; }
  // Glasses sit on the face itself: lenses just in front of the eyes, a bridge on the nose, arms
  // running back to the ears. Measured from the sculpted head, so nothing cuts through the skin.
  if ((e.has('glasses-round') || e.has('shades')) && P.headGeo) {
    const hg = P.headGeo, ey = 0.132, sf = (x) => surfaceZ(hg, x, ey - 0.11), ex = 0.034, ez = Math.max(sf(ex), sf(-ex)), nz = sf(0);
    const earX = (P.ears?.[1]?.position.x ?? 0.085), dark = e.has('shades');
    const frame = dark ? M(0x070707, 0.25, { metalness: 0.3 }) : M(0x2b2620, 0.4, { metalness: 0.55 });
    const lensM = dark ? new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.08, metalness: 0.6, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color: 0xcfd6d4, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false });
    const g = new THREE.Group(); g.position.set(0, ey, 0); head.add(g);
    for (const sd of [-1, 1]) {
      const lz = ez + 0.014, r = dark ? 0.021 : 0.018;
      const lens = new THREE.Mesh(new THREE.CircleGeometry(r, 20), lensM); lens.position.set(sd * ex, 0, lz); lens.scale.set(dark ? 1.18 : 1, dark ? 0.86 : 1, 1); lens.rotation.y = sd * 0.12; g.add(lens);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, dark ? 0.0028 : 0.0022, 6, 20), frame); rim.position.copy(lens.position); rim.scale.copy(lens.scale); rim.rotation.y = lens.rotation.y; g.add(rim);
      // arm: from the outer edge of the lens back along the side of the head to the ear
      const a0 = new THREE.Vector3(sd * (ex + r * (dark ? 1.15 : 1)), 0.002, lz - 0.004), a1 = new THREE.Vector3(sd * (earX + 0.004), -0.004, -0.004), len = a0.distanceTo(a1);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.0028, 0.0035, len), frame); arm.position.copy(a0).add(a1).multiplyScalar(0.5); arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), a1.clone().sub(a0).normalize()); g.add(arm);
    }
    const br = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0022, 5, 10, Math.PI), frame); br.position.set(0, 0.004, Math.max(ez + 0.012, nz + 0.004)); g.add(br);
    g.traverse(o => { o.castShadow = false; });
  }
  if (e.has('sunglasses-up')) { const g = M(0x0a0a0a, 0.2, { metalness: 0.4 }); for (const sd of [-1, 1]) add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.006), g), head, sd * 0.03, 0.22, 0.06).rotation.x = -0.7; }
  if (e.has('cap')) { const cm = tex.fabric ? new THREE.MeshStandardMaterial({ map: tex.fabric('knit', 0x1a1a1a), roughness: 1 }) : M(0x1a1a1a, 1); add(new THREE.Mesh(hairCapGeometry(0.1, 1.1, 0.64, 0.56, 0, Math.random), cm), head, 0, 0.11, 0); }
  if (e.has('earring')) add(new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.002, 5, 10), M(0xcfd4d8, 0.2, { metalness: 1 })), head, (P.ears?.[1]?.position.x ?? 0.09) + 0.004, 0.08, 0.005);
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
// v23 — Il Primo: an unzipped Perfecto-type motorcycle jacket over a white shirt.
// Built from the real garments (Schott 618 Perfecto: asymmetric front zip, large lapel collar with
// snaps, attached belt, zip cuffs, coin pocket, ~25" body; a dress shirt: 1.4" collar band, ~3"
// straight collar points, a centre placket of buttons). The shirt is the torso itself, so it can
// never float; the jacket is a shell computed from the torso's own profile at every height, a little
// over a centimetre out, open at the front the way an unzipped jacket hangs.
export function perfectoOpen(P, shirtMap = null) {
  const k = P.k, W = P.spec.w, chest = P.chest, ss = THREE.MathUtils.smoothstep, L = THREE.MathUtils.lerp;
  const hide = new THREE.MeshStandardMaterial({ color: 0x151413, roughness: 0.42, metalness: 0.1, side: THREE.DoubleSide });
  const face = new THREE.MeshStandardMaterial({ color: 0x1d1b19, roughness: 0.3, metalness: 0.14, side: THREE.DoubleSide });
  const steel = new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.25, metalness: 0.9 });
  const cotton = new THREE.MeshStandardMaterial({ color: shirtMap ? 0xffffff : 0xeeeae2, map: shirtMap, roughness: 0.86, side: THREE.DoubleSide });
  // the shirt: the body under the jacket is white cotton, tucked in at the waist
  P.chestMesh.material = cotton; if (P.belly) P.belly.material = cotton;
  if (P.trap) P.trap.visible = false; if (P.collarRing) P.collarRing.visible = false;
  // the torso's exact cross-section (chest and belly capsules), in chest coordinates
  const capR = (y, cy, h, r) => { const d = Math.abs(y - cy) - h; return d <= 0 ? r : d < r ? Math.sqrt(r * r - d * d) : 0; };
  const torso = (y) => { const c = capR(y, 0.12 * k, 0.08 * k, 0.155 * W), b = capR(y, -0.11 * k, 0.06 * k, 0.135 * W); return { a: Math.max(c * 1.3, b * 1.22), b: Math.max(c * 0.82, b * 0.82) }; };
  let yTop = 0.2 * k; while (torso(yTop + 0.004).a > 0.105 * W) yTop += 0.004;
  const yHem = -0.25 * k, NV = 30, NU = 44;
  const t = (y) => (y - yHem) / (yTop - yHem);
  const off = (y) => L(0.02, 0.011, ss(t(y), 0, 0.8));                          // hangs a little loose at the hem
  const open = (y) => L(0.16, 0.24, t(y)) + 0.36 * ss(t(y), 0.6, 1);            // the front opening, wider where the lapels roll
  const at = (th, y, extra = 0) => { const s0 = torso(y), o = off(y) + extra; return new THREE.Vector3(Math.sin(th) * (s0.a + o), y, Math.cos(th) * (s0.b + o)); };
  const sheet = (rows, mat) => { const g = new THREE.BufferGeometry(), pos = [], idx = [], nu = rows[0].length; rows.forEach(r => r.forEach(v => pos.push(v.x, v.y, v.z))); for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < nu - 1; i++) { const a = j * nu + i, b = a + 1, c = a + nu, d = c + 1; idx.push(a, c, b, b, c, d); } g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.castShadow = true; chest.add(m); return m; };
  const tube = (pts, r, mat) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(8, pts.length * 3), r, 5, false), mat); m.castShadow = true; chest.add(m); return m; };
  const ys = Array.from({ length: NV + 1 }, (_, j) => L(yHem, yTop, j / NV));
  // body shell
  sheet(ys.map(y => { const f = open(y); return Array.from({ length: NU + 1 }, (_, i) => at(L(f, Math.PI * 2 - f, i / NU), y)); }), hide);
  // the leather has a thickness: a rolled edge down both fronts and round the hem
  for (const sd of [1, -1]) tube(ys.map(y => at(sd * open(y), y, 0.002)), 0.0065, face);
  tube(Array.from({ length: 25 }, (_, i) => at(L(open(yHem), Math.PI * 2 - open(yHem), i / 24), yHem, 0.001)), 0.006, face);
  // asymmetric zip: teeth along both front edges, the pull hanging at the left hem
  for (const sd of [1, -1]) tube(ys.filter(y => t(y) < 0.7).map(y => at(sd * (open(y) + 0.035), y, 0.004)), 0.0028, steel);
  const pull = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.004), steel); pull.position.copy(at(-open(yHem) - 0.035, yHem + 0.012, 0.008)); chest.add(pull);
  // lapels, folded back from the opening, ending in a point with a snap
  for (const sd of [1, -1]) {
    const lys = ys.filter(y => t(y) >= 0.5);
    sheet(lys.map(y => { const f = open(y), w = 0.42 * ss(t(y), 0.5, 1); return Array.from({ length: 9 }, (_, i) => at(sd * (f + w * i / 8), y, 0.006 + 0.004 * Math.sin(Math.PI * i / 8))); }), face);
    tube(lys.map(y => at(sd * (open(y) + 0.42 * ss(t(y), 0.5, 1)), y, 0.008)), 0.0045, face);
    const snap = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 8, 6), steel); snap.position.copy(at(sd * (open(lys[2]) + 0.05), lys[2], 0.012)); chest.add(snap);
  }
  // the large collar round the back of the neck, standing and then falling over
  const fT = open(yTop);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.083, 0.112 * W, 0.05, 30, 1, true, fT - 0.15, Math.PI * 2 - 2 * (fT - 0.15)), face); col.position.set(0, yTop - 0.004, -0.008); col.scale.z = 0.88; col.castShadow = true; chest.add(col);
  // attached belt round the back and sides, its ends hanging loose at the open front
  const yB = -0.2 * k;
  sheet([0, 1].map(j => Array.from({ length: 33 }, (_, i) => at(L(open(yB) + 0.05, Math.PI * 2 - open(yB) - 0.05, i / 32), yB + (j - 0.5) * 0.042, 0.006))), face);
  const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.003, 4, 4), steel); buckle.rotation.z = Math.PI / 4; buckle.position.copy(at(open(yB) + 0.08, yB, 0.012)); buckle.lookAt(buckle.position.clone().multiplyScalar(2)); chest.add(buckle);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.006), face); tail.position.copy(at(-open(yB) - 0.06, yB - 0.035, 0.012)); tail.rotation.set(0.1, -0.5, 0.15); chest.add(tail);
  // slanted zip pockets on the lower fronts, a small flapped coin pocket on the left
  for (const sd of [1, -1]) tube([0, 1, 2, 3].map(i => at(sd * L(0.95, 1.3, i / 3), L(-0.15 * k, -0.04 * k, i / 3), 0.004)), 0.0025, steel);
  sheet([0, 1].map(j => Array.from({ length: 5 }, (_, i) => at(-L(0.72, 0.98, i / 4), -0.1 * k + j * 0.032, 0.005))), face);
  const cs = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 5), steel); cs.position.copy(at(-0.85, -0.1 * k + 0.008, 0.01)); chest.add(cs);
  // back: the yoke seam across the shoulders and two long side seams
  tube(Array.from({ length: 16 }, (_, i) => at(L(Math.PI * 0.62, Math.PI * 1.38, i / 15), yTop - 0.11 * k, 0.003)), 0.0022, face);
  for (const sd of [1, -1]) tube(ys.filter(y => t(y) < 0.72).map(y => at(Math.PI + sd * 0.62, y, 0.003)), 0.0022, face);
  // epaulettes, each with its snap
  for (const sd of [-1, 1]) { const yE = yTop - 0.045 * k; const a = at(sd * Math.PI / 2, yE, 0.008); const ep = new THREE.Mesh(new THREE.BoxGeometry(0.085 * W, 0.006, 0.034), face); ep.position.set(a.x * 0.82, yE + 0.012, 0); ep.rotation.z = -sd * 0.42; chest.add(ep); const sn = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 6, 5), steel); sn.position.set(a.x * 0.6, yE + 0.026, 0); chest.add(sn); }
  // sleeves: leather, an elbow seam, zipped cuffs; a white shirt cuff just showing at the wrist
  P.arms.forEach(a => {
    a.sh.children.forEach(c => { if (c.isMesh) c.material = hide; }); a.el.children.forEach(c => { if (c.isMesh) c.material = hide; });
    const er = new THREE.Mesh(new THREE.TorusGeometry(0.052 * W, 0.004, 4, 14), face); er.rotation.x = Math.PI / 2; a.el.add(er);
    const cf = new THREE.Mesh(new THREE.CylinderGeometry(0.047 * W, 0.045 * W, 0.05, 12, 1, true), face); cf.position.y = -0.232 * k; a.el.add(cf);
    const cz = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.06, 0.004), steel); cz.position.set(0, -0.22 * k, -0.047 * W); a.el.add(cz);
    const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.041 * W, 0.042 * W, 0.016, 12, 1, true), cotton); sc.position.y = -0.264 * k; a.el.add(sc);
  });
  // the shirt's collar: a band round the neck, points lying on the chest, the fall behind
  const neckY = 0.3 * k, band = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.066, 0.036, 22, 1, true), cotton); band.position.set(0, neckY + 0.016, -0.012); band.scale.z = 0.94; chest.add(band);
  const fall = new THREE.Mesh(new THREE.CylinderGeometry(0.067, 0.079, 0.032, 22, 1, true, 0.75, Math.PI * 2 - 1.5), cotton); fall.position.set(0, neckY + 0.022, -0.012); fall.scale.z = 0.94; chest.add(fall);
  const surf = (x, y, extra = 0.003) => { const s0 = torso(y); const q = Math.min(0.98, Math.abs(x) / s0.a); return new THREE.Vector3(x, y, s0.b * Math.sqrt(1 - q * q) + extra); };
  for (const sd of [-1, 1]) {
    const base0 = new THREE.Vector3(sd * 0.008, neckY + 0.03, 0.054), base1 = new THREE.Vector3(sd * 0.05, neckY + 0.028, 0.035), tip = surf(sd * 0.032, neckY - 0.068, 0.006), mid = surf(sd * 0.052, neckY - 0.03, 0.006);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([base0.x, base0.y, base0.z, base1.x, base1.y, base1.z, mid.x, mid.y, mid.z, tip.x, tip.y, tip.z], 3)); g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
    const pt = new THREE.Mesh(g, cotton); pt.castShadow = true; chest.add(pt);
  }
  // the placket and its buttons, on the shirt's own surface
  const pl = []; for (let j = 0; j <= 14; j++) { const y = L(neckY - 0.06, -0.24 * k, j / 14); pl.push([-0.015, 0.015].map(x => surf(x, y, 0.0025))); }
  sheet(pl, new THREE.MeshStandardMaterial({ color: 0xf6f3ec, map: shirtMap, roughness: 0.8, side: THREE.DoubleSide }));
  const bm = new THREE.MeshStandardMaterial({ color: 0xd8d4ca, roughness: 0.35 });
  for (let i = 0; i < 6; i++) { const y = neckY - 0.075 - i * 0.085 * k; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0052, 0.002, 10), bm); b.rotation.x = Math.PI / 2; b.position.copy(surf(0, y, 0.0045)); chest.add(b); }
  P.leather = hide; return hide;
}
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

// Hair that frames the face: sides and back, open in front, falling to the jaw or the shoulders.
export function frameGeometry(len, width, wave) {
  const g = new THREE.CylinderGeometry(width, width * 1.1, len, 32, 8, true, Math.PI * 0.42, Math.PI * 1.16); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const t = (len / 2 - y) / len; p.setXYZ(i, x * (1 - t * 0.06) + Math.sin(y * 70 + z * 30) * wave, y - len / 2, z * 0.86 - t * 0.012); }
  g.computeVertexNormals(); return g;
}

// Small facial features casting into a coarse shadow map leave blocky streaks across the face.
// Only the skull casts; everything on the face and the hair just receives light.
export function faceShadows(P) { if (!P.head) return; P.head.traverse(o => { if (o.isMesh && o !== P.skull) { o.castShadow = false; o.receiveShadow = false; } }); }
