// Anatomy for the procedural people (v27).
//
// Bodies are lofted from anatomical cross-sections instead of capsules. Sources:
//  - Segment lengths: Drillis & Contini (1966), segment lengths as fractions of stature H
//    (upper arm .186H, forearm .146H, hand .108H, thigh .245H, shank .246H, foot .152H,
//    shoulder height .818H, hip .530H). The rig's joints already sit on these.
//  - Girths and breadths: ANSUR II anthropometric survey (Gordon et al. 2014), approximate
//    means for men / women, in mm: neck 393/330, chest 1032/950, waist 900/790, buttock
//    1016/1040, thigh 620/610, calf 390/370, ankle 230/214, biceps (relaxed) 310/280,
//    forearm 300/255, wrist 177/155, biacromial breadth 410/365, bideltoid 500/440,
//    hip breadth 350/375, chest depth 255/245, hand length 193/178, hand breadth 89/79,
//    foot length 270/245, foot breadth 101/92. Cross-sections are ellipses built from
//    the breadth and depth, with the circumference checked against these means.
//  - Muscle contours (where a limb is widest): Gray's Anatomy / standard surface anatomy:
//    deltoid cap over the shoulder, biceps belly mid upper arm, brachioradialis and
//    flexor mass in the upper third of the forearm, flattened wrist; quadriceps in front
//    of the thigh with the vastus medialis teardrop above the knee, the patella, the
//    gastrocnemius bulging behind the upper third of the shank, a narrow ankle with the
//    malleoli; gluteal mass behind the pelvis.
//  - Sex differences in the trunk: waist-to-hip ratio about .9 in men and .7-.8 in women
//    (Singh 1993); women's shoulders narrower and pelvis wider (ANSUR II breadths).
//  - Hands: the relaxed hand rests with the fingers progressively flexed from index to
//    little finger (the "cascade"), thumb in slight opposition (Kapandji, The Physiology
//    of the Joints, vol. 1).
//  - Shoes: a last shape (heel cup, waist, ball, toe spring) rather than a box.
import * as THREE from 'three';

// A cross-section at angle th (0 = front, +PI/2 = the body's +x side): an ellipse with
// separate front and back depths, optionally squarer (n > 2) for the trunk.
function ringPoint(th, r, n = 2) {
  const c = Math.cos(th), s = Math.sin(th), e = 2 / n;
  const z = (c >= 0 ? r.rf : r.rb) * Math.sign(c) * Math.pow(Math.abs(c), e);
  const x = (s >= 0 ? (r.rxo ?? r.rx) : r.rx) * Math.sign(s) * Math.pow(Math.abs(s), e);
  return [x + (r.x || 0), r.y, z + (r.z || 0)];
}
// Loft a list of rings (top to bottom or bottom to top) into a closed, UV-mapped mesh.
export function loft(rings, seg = 16, n = 2, caps = true) {
  const pos = [], uv = [], idx = [], N = seg + 1;
  let len = 0; const vs = [0]; for (let j = 1; j < rings.length; j++) { len += Math.abs(rings[j].y - rings[j - 1].y); vs.push(len); }
  rings.forEach((r, j) => { for (let i = 0; i <= seg; i++) { const th = i / seg * Math.PI * 2; pos.push(...ringPoint(th, r, r.n || n)); uv.push(i / seg, vs[j] / (len || 1)); } });
  for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < seg; i++) { const a = j * N + i, b = a + 1, c = a + N, d = c + 1; idx.push(a, c, b, b, c, d); }
  if (caps) for (const [j, flip] of [[0, true], [rings.length - 1, false]]) {
    const r = rings[j], ci = pos.length / 3; pos.push(r.x || 0, r.y + (flip ? 1 : -1) * Math.sign(rings[rings.length - 1].y - rings[0].y) * -0.002, r.z || 0); uv.push(.5, j ? 1 : 0);
    for (let i = 0; i < seg; i++) { const a = j * N + i, b = a + 1; flip ? idx.push(ci, a, b) : idx.push(ci, b, a); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.computeVertexNormals(); return g;
}
// Winding check: the lofts are built top-to-bottom (y decreasing); flip index order if a
// ring list runs the other way so normals always face out.
function oriented(rings) { return rings[0].y < rings[rings.length - 1].y ? rings.slice().reverse() : rings; }
const R = (y, rx, rf, rb, o = {}) => ({ y, rx, rf, rb: rb ?? rf, ...o });

// ---- limbs: rings along -y from the proximal joint (t = 0) to the distal (t = 1) ----
// Radii in metres for a 1.75 m man of average build (scaled by k for length, W for girth).
// thigh: [t, lateral, front, back, { med: medial }] - the lateral side tapers from the greater
// trochanter, the medial side carries the adductors, and the vastus medialis bulges inside above the knee
const THIGH = [[-.02, .07, .082, .09, { med: .084 }], [.1, .076, .09, .1, { med: .094 }], [.3, .078, .092, .084, { med: .086 }], [.55, .07, .079, .07, { med: .078 }], [.78, .054, .064, .058, { med: .066 }], [.92, .05, .056, .05, { med: .054 }], [1, .047, .05, .046]];
const SHANK = [[0, .049, .051, .047], [.07, .05, .046, .056], [.27, .051, .042, .068], [.5, .043, .037, .054], [.75, .033, .031, .036], [.9, .027, .028, .028], [1, .029, .03, .028]];
const UPPER_ARM = [[-.02, .05, .052, .05], [.16, .056, .05, .05], [.4, .047, .05, .049], [.7, .043, .046, .044], [.92, .04, .036, .043], [1, .037, .035, .04]];
const FOREARM = [[0, .037, .035, .04], [.18, .045, .04, .04], [.5, .037, .032, .034], [.82, .029, .021, .022], [1, .027, .019, .019]];
export function limbGeometry(kind, k, W, { female = false, ease = 1, len, cut = 1, sd = 1 } = {}) {
  const T = { thigh: [THIGH, .44], shank: [SHANK, .43], upper: [UPPER_ARM, .3], fore: [FOREARM, .27] }[kind];
  const L = (len ?? T[1]) * k, f = female ? (kind === 'thigh' ? 1.0 : kind === 'shank' ? .94 : .87) : 1, sx = W * f * ease;
  // cut: keep the same anatomy but end the mesh part way down (a short sleeve, a hem)
  let prof = T[0];
  if (cut < 1) { const i = prof.findIndex(p => p[0] > cut), a = prof[i - 1], b = prof[i], u = (cut - a[0]) / (b[0] - a[0]); prof = [...prof.slice(0, i), [cut, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u]]; }
  // medial / lateral: for a limb on the -x side the lateral surface is -x (rx), the medial +x (rxo)
  const rings = prof.map(([t, rx, rf, rb, o]) => { const med = (o?.med ?? rx) * sx, lat = rx * sx; return R(-t * L, sd < 0 ? lat : med, rf * sx, rb * sx, { rxo: sd < 0 ? med : lat }); });
  return loft(rings, 14, 2);
}

// ---- the trunk: pelvis (in hips space), abdomen (spine), thorax (chest) ----
// y is height above the hip joints for a 1.75 m man (k = 1).
export function trunkRings(s, W) {
  const fem = !!s.female, heavy = !!s.heavy, belly = heavy ? .035 : 0;
  // breadths: men biacromial .41 / hips .35 / waist ~.31; women .365 / .375 / ~.27
  const hip = fem ? .19 : .172, waist = fem ? .128 : .152, chest = fem ? .158 : .172, shoulder = fem ? .155 : .17;
  return {
    pelvis: [R(.1, waist * 1.02, .1, .095), R(.05, hip * .95, .1, .108), R(0, hip, .098, .122), R(-.05, hip * .97, .092, .13), R(-.1, hip * .8, .075, .112), R(-.135, hip * .5, .055, .07)],
    abdomen: [R(.34, chest * .94, .118 + (fem ? .004 : 0), .1), R(.27, chest * .9, .114 + belly, .095), R(.19, waist, .108 + belly * 1.3, .09), R(.12, waist * 1.03, .104 + belly, .092), R(.06, hip * .9, .1, .098)],
    thorax: [R(.635, .055, .055, .06), R(.6, .1, .07, .075), R(.565, shoulder * .92, .095, .098), R(.52, chest, .118, .108), R(.46, chest * 1.01, fem ? .12 : .13, .11), R(.39, chest * .97, fem ? .118 : .126, .105), R(.32, chest * .93, .116, .1)],
  };
}
export function trunkGeometry(part, s, W, k, yBase, ease = 1) {
  const rings = trunkRings(s, W)[part].map(r => ({ ...r, y: r.y * k - yBase, rx: r.rx * W * ease, rf: r.rf * W * ease, rb: r.rb * W * ease, rxo: undefined, n: 2.3 }));
  return loft(oriented(rings), 22, 2.3);
}
// The trunk's cross-section at a height y (spine space, metres), for garments built around it:
// half-breadth a, front depth f, back depth bk, and the superellipse exponent n.
export function trunkSection(s, W, k, y, ease = 1) {
  const T = trunkRings(s, W), rings = [...T.thorax, ...T.abdomen.slice(1), ...T.pelvis.slice(2)].map(r => ({ y: r.y * k, rx: r.rx * W * ease, rf: r.rf * W * ease, rb: r.rb * W * ease })).sort((a, b) => b.y - a.y);
  if (y >= rings[0].y) return { a: rings[0].rx, f: rings[0].rf, bk: rings[0].rb, n: 2.3 };
  for (let i = 0; i < rings.length - 1; i++) { const A = rings[i], B = rings[i + 1]; if (y <= A.y && y >= B.y) { const t = (A.y - y) / (A.y - B.y || 1); return { a: A.rx + (B.rx - A.rx) * t, f: A.rf + (B.rf - A.rf) * t, bk: A.rb + (B.rb - A.rb) * t, n: 2.3 }; } }
  const Z = rings[rings.length - 1]; return { a: Z.rx, f: Z.rf, bk: Z.rb, n: 2.3 };
}
// Female bust: soft shapes on the thorax front at the 4th intercostal level.
export function bustGeometry() { const g = new THREE.SphereGeometry(1, 18, 14); g.scale(1, .86, .72); return g; }

// ---- hands ----
// Finger proportions (Kapandji): proximal, middle+distal phalanges; the middle finger is the
// longest; at rest the flexion increases from index to little finger.
const FINGERS = [{ x: .027, l1: .041, l2: .042, r: .0088, rest: [.32, .38] }, { x: .009, l1: .046, l2: .046, r: .0092, rest: [.38, .45] }, { x: -.009, l1: .043, l2: .043, r: .0088, rest: [.46, .52] }, { x: -.026, l1: .035, l2: .035, r: .0078, rest: [.55, .62] }];
export function buildHand(wr, skin, k, sd, female = false) {
  const s = female ? .91 : 1, H = { fingers: [], thumb: null };
  const palm = new THREE.Mesh(loft(oriented([R(0, .028 * s, .015 * s, .016 * s), R(-.03 * s, .039 * s, .015 * s, .017 * s), R(-.07 * s, .042 * s, .012 * s, .015 * s), R(-.088 * s, .04 * s, .01 * s, .012 * s)]), 12, 2.6), skin);
  palm.castShadow = true; wr.add(palm); H.palm = palm;
  FINGERS.forEach((F, i) => {
    const base = new THREE.Group(); base.position.set(-sd * F.x * s, -.086 * s, .002); wr.add(base); // index next to the thumb
    const p = new THREE.Mesh(new THREE.CapsuleGeometry(F.r * s, F.l1 * s - 2 * F.r * s, 3, 8), skin); p.position.y = -F.l1 * s / 2; base.add(p);
    const mid = new THREE.Group(); mid.position.y = -F.l1 * s; base.add(mid);
    const d = new THREE.Mesh(new THREE.CapsuleGeometry(F.r * .88 * s, F.l2 * s - 2 * F.r * s, 3, 8), skin); d.position.y = -F.l2 * s / 2; mid.add(d);
    const nail = new THREE.Mesh(new THREE.SphereGeometry(F.r * .75 * s, 6, 4), skin); nail.scale.set(1, 1.3, .35); nail.position.set(0, -F.l2 * s + .007, F.r * .7 * s); mid.add(nail);
    base.rotation.z = sd * (i - 1.3) * .045; H.fingers.push({ base, mid, rest: F.rest });
  });
  // the palm faces back (-z) when the arm hangs, so the thumb and index are on the medial side (-sd)
  const tb = new THREE.Group(); tb.position.set(-sd * .03 * s, -.022 * s, .012); tb.rotation.set(.35, -sd * .5, -sd * .55); wr.add(tb);
  const t1 = new THREE.Mesh(new THREE.CapsuleGeometry(.011 * s, .022 * s, 3, 8), skin); t1.position.y = -.022 * s; tb.add(t1);
  const tm = new THREE.Group(); tm.position.y = -.042 * s; tb.add(tm);
  const t2 = new THREE.Mesh(new THREE.CapsuleGeometry(.0095 * s, .016 * s, 3, 8), skin); t2.position.y = -.015 * s; tm.add(t2);
  H.thumb = { base: tb, mid: tm, rest: [tb.rotation.x, tb.rotation.y, tb.rotation.z] };
  [palm].forEach(m => { m.castShadow = true; });
  return H;
}
// Hand shapes: flexion of each finger's MCP (base) and PIP/DIP (mid) joints in radians, and
// thumb opposition. relaxed = the resting cascade; open = palm-up open hand (Müller 2004);
// purse = the Italian "mano a borsa", fingertips bunched upward (Kendon 2004, Poggi 2002);
// ring = thumb and index tip touching, "precision" (Kendon 2004); point = index extended;
// fist; grip = holding a cup or tool.
export const HANDSHAPES = {
  relaxed: { f: null, t: 0 },
  open: { f: [[.08, .06], [.06, .05], [.08, .06], [.1, .08]], t: -.3 },
  spread: { f: [[0, 0], [0, 0], [0, 0], [0, 0]], t: -.5, spread: 1 },
  purse: { f: [[.95, .55], [.9, .6], [.95, .6], [1.0, .62]], t: .9 },
  ring: { f: [[.9, 1.0], [.25, .2], [.3, .25], [.35, .3]], t: .85 },
  point: { f: [[0, .03], [1.4, 1.6], [1.45, 1.6], [1.5, 1.6]], t: .6 },
  fist: { f: [[1.45, 1.65], [1.5, 1.7], [1.5, 1.7], [1.5, 1.7]], t: .8 },
  grip: { f: [[.9, .8], [.95, .85], [1.0, .9], [1.05, .95]], t: .6 },
};
export function poseHand(H, shape, w = 1, dt = 1, sd = 1) {
  if (!H) return; const S = HANDSHAPES[shape] || HANDSHAPES.relaxed, a = Math.min(1, dt * 12);
  H.fingers.forEach((F, i) => {
    const tgt = S.f ? S.f[i] : F.rest, m1 = F.rest[0] + (tgt[0] - F.rest[0]) * w, m2 = F.rest[1] + (tgt[1] - F.rest[1]) * w;
    F.base.rotation.x += (m1 - F.base.rotation.x) * a; F.mid.rotation.x += (m2 - F.mid.rotation.x) * a;
    const sp = (S.spread ? .12 : 0) * w; F.base.rotation.z += ((sd * (i - 1.3) * (.045 + sp)) - F.base.rotation.z) * a;
  });
  const T = H.thumb, op = (S.t || 0) * w; T.base.rotation.x += (T.rest[0] + op * .6 - T.base.rotation.x) * a; T.base.rotation.y += (T.rest[1] * (1 - op * .6) - T.base.rotation.y) * a; T.mid.rotation.x += (op * .5 - T.mid.rotation.x) * a;
}

// ---- shoes: a last, heel to toe along +z, sole at y = -0.055 below the ankle ----
export function shoeGeometry(female = false, boot = false) {
  const s = female ? .91 : 1, sole = -.055;
  const rings = [];
  // [z, half-width, top height above sole]: heel cup, waist, ball, toe with spring
  const prof = [[-.075, .034, .07], [-.06, .041, .085], [-.02, .043, boot ? .13 : .095], [.03, .044, .075], [.1, .049, .05], [.15, .046, .042], [.19, .036, .032], [.21, .02, .024]];
  for (const [z, hw, h] of prof) {
    const hh = h * (z > .15 ? 1 : 1), spring = z > .14 ? (z - .14) * .25 : 0;
    rings.push({ z, hw: hw * s, h: hh, y0: sole + spring });
  }
  // loft along z: each ring is a rounded rectangle in x-y
  const seg = 16, pos = [], idx = [], uv = [], N = seg + 1;
  rings.forEach((r, j) => { for (let i = 0; i <= seg; i++) { const th = i / seg * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th), e = .55; const x = r.hw * Math.sign(c) * Math.pow(Math.abs(c), e), yy = r.h / 2 * Math.sign(sn) * Math.pow(Math.abs(sn), e); pos.push(x, r.y0 + r.h / 2 + yy, r.z * s); uv.push(i / seg, j / (rings.length - 1)); } });
  for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < seg; i++) { const a = j * N + i, b = a + 1, c = a + N, d = c + 1; idx.push(a, b, c, b, d, c); }
  for (const [j, flip] of [[0, false], [rings.length - 1, true]]) { const r = rings[j], ci = pos.length / 3; pos.push(0, r.y0 + r.h / 2, r.z * s); uv.push(.5, .5); for (let i = 0; i < seg; i++) { const a = j * N + i, b = a + 1; flip ? idx.push(ci, b, a) : idx.push(ci, a, b); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

// ---- joints: anatomical ranges of motion (AAOS normal values, Greene & Heckman 1994) ----
// shoulder flexion 180 / extension 60 / abduction 180 / adduction 30-50; elbow flexion
// 0-150; forearm pronation 80 / supination 80; wrist flexion 80 / extension 70, radial
// 20 / ulnar deviation 30; hip flexion 120 / extension 30; knee flexion 0-135;
// ankle dorsiflexion 20 / plantarflexion 50; neck flexion 45 / extension 45 / rotation 80.
const D = Math.PI / 180;
export const ROM = { shFlex: 180 * D, shExt: 60 * D, shAbd: 180 * D, shAdd: 40 * D, shRot: 80 * D, elFlex: 150 * D, pron: 80 * D, wrFlex: 80 * D, wrExt: 70 * D, wrDev: 30 * D, hipFlex: 125 * D, hipExt: 30 * D, knee: 140 * D, neck: 50 * D, neckRot: 80 * D };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// Arm i: 0 is the body's right arm (at -x), 1 the left. Shoulder flexion is -x rotation,
// abduction moves the hand away from the body.
export function sideOf(i) { return i === 0 ? -1 : 1; }
export function enforceROM(P) {
  P.arms.forEach((a, i) => {
    const sd = sideOf(i);
    a.sh.rotation.x = clamp(a.sh.rotation.x, -ROM.shFlex, ROM.shExt);
    const abd = a.sh.rotation.z * sd; a.sh.rotation.z = clamp(abd, -ROM.shAdd, ROM.shAbd) * sd;
    a.sh.rotation.y = clamp(a.sh.rotation.y, -ROM.shRot, ROM.shRot);
    a.el.rotation.x = clamp(a.el.rotation.x, -ROM.elFlex, 0.04); a.el.rotation.z = clamp(a.el.rotation.z, -.25, .25); a.el.rotation.y = clamp(a.el.rotation.y, -ROM.pron, ROM.pron);
    a.wr.rotation.x = clamp(a.wr.rotation.x, -ROM.wrFlex, ROM.wrExt); a.wr.rotation.z = clamp(a.wr.rotation.z, -ROM.wrDev, ROM.wrDev);
  });
  P.legs.forEach(l => { l.th.rotation.x = clamp(l.th.rotation.x, -ROM.hipFlex, ROM.hipExt); l.kn.rotation.x = clamp(l.kn.rotation.x, -.03, ROM.knee); });
  if (P.head) { P.head.rotation.x = clamp(P.head.rotation.x, -ROM.neck, ROM.neck); }
}
