// Faces, emotional posture and speech gestures (v27).
//
// Faces: the Facial Action Coding System (Ekman, Friesen & Hager 2002). Each emotion is a
// prototype combination of action units (EMFACS / Ekman & Friesen 1978):
//   joy = AU6 + AU12; sadness = AU1 + AU4 + AU15 (+ lid droop); surprise = AU1 + AU2 + AU5 + AU26;
//   fear = AU1 + AU2 + AU4 + AU5 + AU20 + AU26; anger = AU4 + AU5 + AU7 + AU23;
//   disgust = AU9/AU10 + AU15; contempt = unilateral AU12/AU14.
// The rig's features map onto the units: brows (AU1 inner raise, AU2 outer raise, AU4 lowerer),
// upper lids (AU5 raise, droop), lower lids (AU6 cheek raiser / AU7 lid tightener), lip halves
// (AU12 corner puller, AU15 corner depressor, AU20 stretcher, AU23 presser, AU10 upper lip
// raiser) and the jaw (AU26).
// Posture: bodily expression of emotion after Wallbott (1998) and the Body Action and Posture
// coding of Dael, Mortillaro & Scherer (2012): sadness - head down, trunk collapsed, little
// movement; anger - head forward and down, chest out, large fast movements; fear - shoulders
// raised, arms close, trunk back; joy - head up, expansive movement; contempt - head tilted back
// and away; shame - head down, gaze averted.
// Gestures: the phases of a gesture phrase (Kendon 1980, 2004; McNeill 1992): preparation
// into gesture space, stroke on the stressed part of speech, post-stroke hold, retraction to
// rest. Hand shapes from Italian conversational gesture (Kendon 2004; Poggi 2002): the palm-up
// open hand (Müller 2004), the "mano a borsa" (purse hand), the precision ring, the index point.
// Personality changes size, speed and frequency (Neff, Wang, Abbott & Walker 2010: extraverts
// gesture wider, faster and more often, away from the body; introverts small and close).
import { poseHand } from './anatomy.js';

const D = Math.PI / 180;
export const EMOTIONS = {
  neutral: {},
  joy: { 6: .7, 12: 1, 26: .08, body: { pitch: -.04, open: .3 } },
  serene: { 6: .3, 12: .45, droop: .35, body: { pitch: .02 } },
  sad: { 1: 1, 4: .55, 15: .8, droop: .45, body: { pitch: .32, slump: .14, energy: .4 } },
  surprise: { 1: 1, 2: 1, 5: .9, 26: .7, body: { pitch: -.06, back: .03 } },
  fear: { 1: .9, 2: .7, 4: .5, 5: 1, 20: .8, 26: .3, body: { pitch: -.05, shrug: .022, back: .04, close: .6 } },
  anger: { 4: 1, 5: .45, 7: .8, 23: .8, body: { pitch: .12, chest: -.06, energy: 1.5, open: .2 } },
  disgust: { 4: .35, 9: .7, 10: .7, 15: .5, body: { pitch: -.06, back: .03 } },
  contempt: { 12: .15, contempt: .9, body: { pitch: -.1, tilt: .12 } },
  shame: { 1: .4, 4: .2, 15: .3, droop: .5, body: { pitch: .38, slump: .1, energy: .5 } },
};
const AUS = [1, 2, 4, 5, 6, 7, 9, 10, 12, 15, 20, 23, 26, 'droop', 'contempt'];

// Each person's speaking hands: size (gesture space), speed, how often, preferred forms.
export const GESTURE_STYLE = {
  franco: { size: 1.0, speed: 1.15, rate: 1.0, both: .45, forms: ['chop', 'purse', 'present', 'point'] },
  walter: { size: .55, speed: .8, rate: .7, both: .6, forms: ['size', 'ring', 'point', 'size'] },
  ottavio: { size: .3, speed: .7, rate: .35, both: .1, forms: ['ring', 'present'] },
  ines: { size: .45, speed: .75, rate: .5, both: .3, forms: ['present', 'self', 'present'] },
  anna: { size: .6, speed: .9, rate: .7, both: .3, forms: ['purse', 'present', 'self'] },
  dario: { size: .85, speed: .9, rate: .8, both: .55, forms: ['openup', 'point', 'self'] },
  sergio: { size: .35, speed: .7, rate: .4, both: .15, forms: ['present', 'purse'] },
  marta: { size: .5, speed: .9, rate: .6, both: .2, forms: ['ring', 'point', 'present'] },
  pino: { size: .7, speed: 1.0, rate: .8, both: .3, forms: ['purse', 'point', 'present'] },
  gabri: { size: .75, speed: 1.25, rate: .9, both: .4, forms: ['spread', 'point', 'present', 'self'] },
  livia: { size: .9, speed: .75, rate: .8, both: .6, forms: ['openup', 'present', 'self'] },
  first: { size: .25, speed: .6, rate: .3, both: .05, forms: ['ring', 'present'] },
};
// Gesture forms as anatomical targets: shoulder flexion, abduction, internal rotation, elbow
// flexion (degrees), forearm supination (-1 palm down .. 0 palm in .. +1 palm up), wrist
// extension (degrees), hand shape, and what the stroke does.
const FORMS = {
  present: { f: 30, a: 16, r: 12, e: 78, sup: .85, w: 10, shape: 'open', stroke: { e: 10, f: 6 } },
  openup: { f: 42, a: 32, r: -6, e: 55, sup: .8, w: 12, shape: 'spread', stroke: { f: 10, a: 6 } },
  purse: { f: 28, a: 10, r: 26, e: 82, sup: .65, w: 22, shape: 'purse', stroke: { e: 14 }, beat: 2.4 },
  chop: { f: 38, a: 8, r: 22, e: 78, sup: 0, w: 0, shape: 'open', stroke: { e: -26, f: -8 } },
  point: { f: 52, a: 14, r: 6, e: 28, sup: -.3, w: 0, shape: 'point', stroke: { f: 6 } },
  ring: { f: 26, a: 10, r: 24, e: 84, sup: .2, w: 8, shape: 'ring', stroke: { e: 8 }, beat: 2 },
  size: { f: 34, a: 6, r: 14, e: 84, sup: 0, w: 4, shape: 'open', stroke: { a: 7 }, both: true },
  self: { f: 22, a: -18, r: 48, e: 118, sup: -.4, w: 0, shape: 'open', stroke: { f: 4 } },
  spread: { f: 26, a: 28, r: -4, e: 62, sup: .6, w: 18, shape: 'spread', stroke: { a: 8, e: -8 } },
};
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

// Blend the current emotion weights toward the requested ones; returns action unit intensities
// and posture offsets.
export function emotionState(P, dt) {
  const want = P.emo || {}, cur = P.emoCur || (P.emoCur = {});
  for (const k of new Set([...Object.keys(want), ...Object.keys(cur)])) cur[k] = (cur[k] || 0) + ((want[k] || 0) - (cur[k] || 0)) * Math.min(1, dt * 2.2);
  const au = {}, body = { pitch: 0, slump: 0, shrug: 0, back: 0, chest: 0, tilt: 0, energy: 1, open: 0, close: 0 };
  let tot = 0;
  for (const [k, w] of Object.entries(cur)) {
    if (w < 0.01) continue; const E = EMOTIONS[k]; if (!E) continue; tot += w;
    for (const a of AUS) if (E[a]) au[a] = Math.min(1, (au[a] || 0) + E[a] * w);
    if (E.body) for (const [b, v] of Object.entries(E.body)) body[b] += b === 'energy' ? (v - 1) * w : v * w;
  }
  return { au, body };
}

export function updateFace(P, au, open, blink, dt) {
  const g = (k) => au[k] || 0, r = Math.min(1, dt * 14);
  (P.brows || []).forEach(b => {
    const ty = b.y + .008 * g(2) + .0065 * g(1) - .0065 * g(4), tx = b.x - b.sd * .0042 * g(4);
    const tr = b.r - b.sd * .5 * g(1) + b.sd * .42 * g(4) + b.sd * .22 * g(2);
    b.m.position.y += (ty - b.m.position.y) * r; b.m.position.x += (tx - b.m.position.x) * r; b.m.rotation.z += (tr - b.m.rotation.z) * r;
  });
  if (P.creases) { const op = (arr, v) => arr.forEach(m => { m.material.opacity += (Math.min(.8, v) - m.material.opacity) * r; }); op(P.creases.forehead, Math.max(g(1), g(2)) * .75); op(P.creases.glabella, g(4) * .9); op(P.creases.naso, g(12) * .6 + g(10) * .8 + g(9) * .5); }
  (P.lids || []).forEach(l => { const ty = .12 + blink * .62 + g('droop') * .38 + g(7) * .14 + g(4) * .1 - g(5) * .09; l.scale.y += (Math.max(.03, ty) - l.scale.y) * Math.min(1, dt * 30); l.position.y += ((l.userData.baseY ?? .138) + g(5) * .0032 - g('droop') * .0024 - g(4) * .001 - l.position.y) * r; });
  (P.lowLids || []).forEach(l => { const ty = .05 + (g(6) * .6 + g(7) * .7) * .42; l.scale.y += (ty - l.scale.y) * r; });
  if (P.lips) {
    const corner = g(12) * .75 - g(15) * .6 - g(20) * .12;
    P.lips.forEach(L => {
      const c = corner + (L.sd < 0 ? g('contempt') * .7 : 0);
      L.g.rotation.z += (L.sd * c * (L.upper ? .8 : .95) - L.g.rotation.z) * r;
      L.g.scale.x += (1 + .3 * g(20) + .15 * g(12) - .12 * g(23) - L.g.scale.x) * r;
      L.m.scale.x += (Math.max(.45, 1 - .5 * g(23)) - L.m.scale.x) * r;
      const ty = L.upper ? L.y0 + .0012 * open + .0028 * g(10) : L.y0 - .0125 * open - .0012 * g(15);
      L.g.position.y += (ty - L.g.position.y) * Math.min(1, dt * 22);
    });
    if (P.cavity) { P.cavity.scale.y += (.2 + open * 4.4 - P.cavity.scale.y) * Math.min(1, dt * 22); P.cavity.position.y = -.0045 * open; }
  }
}

// Arm targets for one arm from anatomical angles. Arm i: 0 = body's right (sd -1), 1 = left.
export function armAngles(i, f, a, r, e, sup, w) {
  const sd = i === 0 ? -1 : 1;
  return { shX: -f * D, shZ: sd * a * D, shY: -sd * r * D, elX: -e * D, wrY: sd * Math.PI / 2 * (1 + sup), wrX: -w * D };
}
// Rest: arms hanging with ~5 degrees of abduction (clear of the hips), elbows a little bent,
// palms turned toward the thighs.
export const REST = [armAngles(0, 2, 5, 0, 10, -.15, 0), armAngles(1, 2, 5, 0, 10, -.15, 0)];

// Speech gestures. Returns per-arm targets with a weight, or null when the hands are at rest.
export function gestureTargets(P, dt, t, talking, energy = 1) {
  const st = GESTURE_STYLE[P.styleKey] || { size: .5, speed: .85, rate: .55, both: .3, forms: ['present', 'purse'] };
  const G = P.gest || (P.gest = { phase: 'rest', t: 0, w: 0, form: null, arms: [], next: 0, stroke: 0 });
  const sp = st.speed * Math.max(.5, energy), size = st.size * Math.max(.4, Math.min(1.6, energy));
  G.t += dt * sp; G.next -= dt;
  const rnd = () => { P._gs = ((P._gs ?? 7) * 16807) % 2147483647; return P._gs / 2147483647; };
  if (G.phase === 'rest') {
    if (talking && G.next <= 0 && rnd() < st.rate * Math.max(.3, energy)) {
      const form = st.forms[Math.floor(rnd() * st.forms.length)], F = FORMS[form];
      G.form = form; G.arms = F.both || rnd() < st.both ? [0, 1] : [rnd() < .65 ? 0 : 1]; G.phase = 'prep'; G.t = 0; G.strokes = 1 + Math.floor(rnd() * 3);
    } else if (G.next <= 0) G.next = .6 + rnd() * .8;
  }
  const F = FORMS[G.form] || FORMS.present;
  let w = 0, s = 0;
  if (G.phase === 'prep') { w = ease(G.t / .42); if (G.t >= .42) { G.phase = 'stroke'; G.t = 0; } }
  else if (G.phase === 'stroke') { w = 1; s = Math.sin(Math.min(1, G.t / .3) * Math.PI); if (G.t >= .3) { G.phase = 'hold'; G.t = 0; G.hold = .25 + rnd() * .45; } }
  else if (G.phase === 'hold') { w = 1; if (F.beat) s = Math.sin(G.t * F.beat * Math.PI * 2) * .35; if (G.t >= G.hold) { G.strokes--; if (G.strokes > 0 && talking) { G.phase = 'stroke'; G.t = 0; } else { G.phase = 'retract'; G.t = 0; } } }
  else if (G.phase === 'retract') { w = 1 - ease(G.t / .5); if (G.t >= .5) { G.phase = 'rest'; G.t = 0; G.next = .5 + rnd() * 1.4 / Math.max(.3, st.rate); } }
  G.w = w;
  if (w <= 0.001) { G.active = false; return null; }
  G.active = true;
  const out = [null, null], k = size;
  for (const i of G.arms) {
    const S = F.stroke || {}, mir = i === 0 ? 1 : 1;
    const f = F.f * (.55 + .45 * k) + (S.f || 0) * s, a = F.a * (.5 + .5 * k) * mir + (S.a || 0) * s, e = F.e + (S.e || 0) * s;
    out[i] = { ...armAngles(i, f, a, F.r, e, F.sup, F.w), w, shape: F.shape };
  }
  return out;
}
export function applyHands(P, shapes, dt) {
  P.arms.forEach((A, i) => { if (A.H) poseHand(A.H, shapes[i]?.shape || 'relaxed', shapes[i]?.w ?? 1, dt, A.sd); });
}
