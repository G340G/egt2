// =============================================================================
// EPISTASSI — THE ROOM (v21)
// Nobody hunts Tobia. But at any moment one of the people around him might
// decide that he has to disappear, and nobody will necessarily stop them.
//
//   01 RELATIONSHIPS  trust, grievance and fear, per person, never shown
//   02 GESTURES       objects that belong to someone; every touch has witnesses
//   03 TESTIMONY      questions as traps; silence, leaving and lying are answers
//   04 EPISTAXIS      tension becomes a nosebleed; tissues; the world turns to flesh
//   05 IL PRIMO       arranges who meets whom, never touches the knife
//
// Every consequence is recorded with its cause, so an ending can be read back
// afterwards: not random, only unpredictable.
// =============================================================================
import { SOCIAL, BIANCO } from './people.js';

const NAMES = { ines: 'Ines', ottavio: 'Ottavio', anna: 'Anna', dario: 'Dario', sergio: 'Sergio', marta: 'Marta', pino: 'Pino', gabri: 'Gabri', walter: 'Walter', livia: 'Livia', franco: 'Franco', primo: 'Il Professore', tobia: 'Tobia' };
const nm = (k) => NAMES[k] || k;
const UP = (k) => nm(k).toUpperCase();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---- What a gesture means, to whom ------------------------------------------------
// truth: what Tobia actually did. worse: what it becomes when a careless or hostile
// person retells it. fx: per-witness change { t: trust, g: grievance, f: fear }.
const ACTS = {
  'earplugs-look': { truth: 'picked up Il Professore’s earplugs and turned them over', worse: 'earplugs-take', fx: { dario: { g: 1.1 }, walter: { g: .6 }, gabri: { t: .4 }, sergio: { t: .3 }, ines: { f: .2 } }, base: { g: .2 } },
  'earplugs-take': { truth: 'put Il Professore’s earplugs in his pocket', fx: { dario: { g: 2.6 }, walter: { g: 1.6 }, gabri: { t: .8 }, sergio: { t: .5 }, marta: { g: .4 }, ines: { f: .6 }, anna: { g: .6 } }, base: { g: .6 } },
  'earplugs-move': { truth: 'moved Il Professore’s earplugs over to his own place', worse: 'earplugs-take', fx: { dario: { g: 1.8 }, walter: { g: 1 }, gabri: { t: .5 }, sergio: { t: .4 } }, base: { g: .4 } },
  'earplugs-return': { truth: 'gave Il Professore back his earplugs', fx: { dario: { g: -.7, t: .2 }, walter: { g: -.5 } }, base: { t: .15 } },
  'earplugs-putback': { truth: 'put the earplugs back where they had been', fx: { dario: { g: -.3 } }, base: {} },
  'chair-aurelio': { truth: 'sat down in Aurelio’s chair', fx: { dario: { g: 1.6 }, franco: { f: .8, g: .4 }, ines: { f: .5 }, anna: { g: .5 }, marta: { t: .3 }, sergio: { t: .2 }, walter: { g: .7 }, livia: { f: .4 } }, base: { g: .2 } },
  'bowl-eat': { truth: 'ate from the bowl Anna fills for her husband', fx: { anna: { g: 2.2 }, ines: { t: .5 }, franco: { t: .6 }, dario: { g: .5 }, sergio: { t: .3 } }, base: {} },
  'bowl-move': { truth: 'moved the husband’s bowl out of its place', worse: 'bowl-eat', fx: { anna: { g: 1.2 }, franco: { t: .3 }, ines: { g: .3 } }, base: {} },
  'photo-look': { truth: 'took Gabri’s photograph off the fridge and looked at it', worse: 'photo-take', fx: { gabri: { g: 1.4 }, ines: { g: .7 } }, base: { g: .1 } },
  'photo-take': { truth: 'took Gabri’s photograph', fx: { gabri: { g: 3.2 }, ines: { g: 1.6 }, walter: { g: .2 } }, base: { g: .4 } },
  'photo-tear': { truth: 'tore Gabri’s photograph in half', fx: { gabri: { g: 4.5 }, ines: { g: 2.2 }, franco: { g: .6 } }, base: { g: .9, f: .4 } },
  'photo-return': { truth: 'gave Gabri his photograph back', fx: { gabri: { g: -1.6, t: 1.2 }, ines: { g: -.8, t: .6 } }, base: {} },
  'photo-putback': { truth: 'put the photograph back on the fridge', fx: { gabri: { g: -.5 } }, base: {} },
  'keys-take': { truth: 'took Walter’s van keys off the dresser', fx: { walter: { g: 3.4 }, dario: { g: 1.4 }, pino: { t: .9 }, sergio: { t: .3 } }, base: { g: .5, f: .3 } },
  'keys-putback': { truth: 'put Walter’s keys back on the dresser', fx: { walter: { g: -1 } }, base: {} },
  'keys-return': { truth: 'gave Walter his keys back', fx: { walter: { g: -1.6, t: .4 } }, base: {} },
  'knife-take': { truth: 'took the bread knife off the kitchen table', fx: { franco: { f: .8 }, ines: { f: .9 }, gabri: { f: .7, g: .5 }, dario: { f: .5, g: .6 }, walter: { g: .8 } }, base: { f: .7 } },
  'knife-move': { truth: 'put the bread knife up on the fridge, out of reach', fx: { ines: { t: .3 }, franco: { g: .3 } }, base: {} },
  'knife-putback': { truth: 'put the bread knife back on the kitchen table', fx: {}, base: { f: -.3 } },
  'blood-sleeve': { truth: 'wiped his bleeding nose on his sleeve', fx: { franco: { t: -.3 }, ines: { t: .1 }, gabri: { t: -.2 } }, base: {} },
  'refuse-gathering': { truth: 'did not come to the table when he was called', fx: {}, base: {} },
  'walked-off': { truth: 'walked away in the middle of being asked something', fx: {}, base: { g: .4 } }
};
const VERB = { 'earplugs-take': 'took Il Professore’s earplugs. Pocketed them', 'photo-take': 'took the boy’s photograph', 'bowl-eat': 'ate out of the dead man’s bowl' };

export function createSociety(G) {
  const THREE = G.THREE, now = () => G.elapsed();
  const S = {
    rel: {}, between: {}, episodes: [], rumours: [], heardTold: [], testimony: [], confid: {}, conflicts: [], truths: [],
    belong: {}, carried: new Set(), seats: [], seated: null, placeDenied: false,
    tension: 0, gestures: 0, answers: 0, refused: 0,
    bleed: { on: false, level: 0, distort: 0, t: 0, dur: 0, cd: 38, tissues: 4, stain: 0, wipe: 0, wipeDur: 0, wipeKind: null, seen: new Set(), drip: 0, breath: 0, hand: 0, told: false, offerCd: 0 },
    gather: { cd: 75, n: 0, active: null, primed: false },
    kitchen: { cd: 160, scene: null, protectorUsed: false },
    ui: null, allLookUntil: 0, doorAt: 0, doorWarned: 0, talkStop: 0, primoNotes: [], promised: null, ending: null, built: false, flagsSeen: new Set(), lastRumourAt: -999
  };
  const keys = Object.keys(SOCIAL);
  keys.forEach(k => { S.rel[k] = { trust: (SOCIAL[k].care - .45) * 1.2, grievance: 0, fear: 0, marked: false, causes: [], silent: false }; });
  S.rel.primo = { trust: 0, grievance: 0, fear: 0, causes: [] };
  S.bleed.tissues = [5, 5, 4, 3][G.difficulty()] ?? 4;

  // ---- people, positions, witnesses -------------------------------------------------
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  function present() { return G.zone() === 'home' ? G.people() : []; }
  function who(key) { return G.people().find(p => p.key === key) || null; }
  function posOf(p) { return p.npc.object.getWorldPosition(new THREE.Vector3()); }
  function standing(k) { const r = S.rel[k]; return r ? r.trust - r.grievance - r.fear * .5 : 0; }
  function playerPos() { return G.playerAnchor.position; }
  function dist2(p) { const a = posOf(p), b = playerPos(); return Math.hypot(a.x - b.x, a.z - b.z); }
  // Someone sees a gesture if it happens in front of them and not too far; anyone very close
  // senses it whatever way they face. Speech is heard closer, and never by Ottavio.
  function witnesses(at, { speech = false, range = 7.5 } = {}) {
    const out = [];
    for (const p of present()) {
      const o = p.npc.object, a = o.getWorldPosition(tmp), dx = at.x - a.x, dz = at.z - a.z, d = Math.hypot(dx, dz);
      if (speech) { if (d < 4.8 && !SOCIAL[p.key]?.deaf) out.push(p.key); continue; }
      if (d > range) continue;
      const yaw = o.rotation.y, fx = Math.sin(yaw), fz = Math.cos(yaw), dot = (fx * dx + fz * dz) / (d || 1);
      if (d < 2.2 || dot > -.25) out.push(p.key);
    }
    return out;
  }
  function playerLooksAt(p) { G.camera.getWorldDirection(tmp2); const a = posOf(p), b = playerPos(), dx = a.x - b.x, dz = a.z - b.z, d = Math.hypot(dx, dz) || 1; return (tmp2.x * dx + tmp2.z * dz) / (Math.hypot(tmp2.x, tmp2.z) * d) > .93; }

  // ---- 01 relationships ------------------------------------------------------------
  function affect(k, fx, cause, scale = 1) {
    const r = S.rel[k]; if (!r || !fx) return;
    if (fx.t) r.trust = clamp(r.trust + fx.t * scale, -4, 4);
    if (fx.g) r.grievance = clamp(r.grievance + fx.g * scale, 0, 8);
    if (fx.f) r.fear = clamp(r.fear + fx.f * scale, 0, 4);
    if (cause && ((fx.g || 0) * scale > .25 || (fx.f || 0) * scale > .4)) r.causes.push({ text: cause, w: (fx.g || 0) * scale + (fx.f || 0) * scale * .6, at: now() });
  }
  function fxFor(k, act) { const A = ACTS[act]; if (!A) return null; if (A.fx[k]) return A.fx[k]; const b = A.base || {}, L = SOCIAL[k]?.loyalty ?? .5; return { t: b.t, g: b.g ? b.g * (.5 + L) : 0, f: b.f }; }

  // A gesture: who saw it, what each of them made of it, and who they will tell.
  function gesture(act, { extra = '', seenBy = null, speech = false } = {}) {
    const A = ACTS[act]; if (!A) return [];
    S.gestures++;
    const seen = seenBy || witnesses(playerPos(), { speech });
    const ep = { id: S.episodes.length, act, truth: A.truth + extra, t: now(), witnesses: seen.slice() };
    S.episodes.push(ep);
    for (const k of seen) {
      if (k === 'primo') { S.primoNotes.push(act); continue; }
      affect(k, fxFor(k, act), `${nm(k)} saw you as you ${A.truth}${extra}.`);
      // they will tell someone: later, and maybe not the same story
      const c = SOCIAL[k]?.confidant; if (c && !SOCIAL[k].mute) S.rumours.push({ at: now() + 40 + Math.random() * 80, teller: k, listener: c, ep, act });
      else if (c && SOCIAL[k].mute) S.rumours.push({ at: now() + 120 + Math.random() * 90, teller: k, listener: c, ep, act, napkin: true });
    }
    if (seen.length) tense(.05 + seen.length * .02);
    return seen;
  }
  function tellRumour(r) {
    const T = who(r.teller), L = who(r.listener);
    if (!T || !L) { if (Math.random() < .5) r.at = now() + 60; else r.dead = true; return; }
    const tr = S.rel[r.teller], A = ACTS[r.act];
    const worse = A.worse && (Math.random() < SOCIAL[r.teller].distorts || tr.grievance > 2);
    const told = worse ? A.worse : r.act, B = ACTS[told];
    const phrase = VERB[told] || B.truth;
    affect(r.listener, fxFor(r.listener, told), `${nm(r.teller)} told ${nm(r.listener)} that you ${B.truth}${worse ? ' (you had not)' : ''}.`, .6);
    S.heardTold.push({ teller: r.teller, listener: r.listener, act: told, worse, t: now() });
    S.lastRumourAt = now();
    // secondhand: the listener may pass it on once more, worse again
    const c2 = SOCIAL[r.listener]?.confidant; if (!r.second && c2 && c2 !== r.teller && Math.random() < .55) S.rumours.push({ at: now() + 60 + Math.random() * 90, teller: r.listener, listener: c2, ep: r.ep, act: told, second: true });
    // Tobia overhears his own story, told wrong, if he is near enough
    if (G.zone() === 'home') {
      const d = dist2(T);
      if (d < 6.5) G.line(r.napkin ? `(${nm(r.teller)} slides a napkin to ${nm(r.listener)}. ${nm(r.listener)} reads it and looks at you.)` : `${UP(r.teller)} (low, to ${nm(r.listener)}): ${pick(['He', 'The guest', 'Him. The new one. He'])} ${phrase}. ${pick(['I saw it.', 'Don’t say I said.', 'Ask him.', ''])}`.trim());
      else if (d < 10) G.line(`(By the ${pick(['stove', 'dresser', 'table'])}, two voices drop when you look over.)`);
      if (d < 10) tense(.12);
    }
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // ---- 02 objects that belong to someone --------------------------------------------
  function buildWorld() {
    if (S.built || !G.home()) return; S.built = true;
    const z = G.home(), g = z.group, T = G.seats(); if (!T) return;
    const topY = T.topY, M = G.mat;
    // Il Primo’s orange earplugs, on the cloth at his end of the table.
    const plugs = new THREE.Group(); [-1, 1].forEach(sd => { const p = new THREE.Mesh(new THREE.CapsuleGeometry(.009, .016, 4, 8), M(0xd9661c, .8, { emissive: 0x2a0d00 })); p.rotation.z = Math.PI / 2 + sd * .3; p.position.set(sd * .018, .009, sd * .006); plugs.add(p); });
    addBelonging('earplugs', plugs, [T.top[0] + .26, topY, T.top[1] - 1.95], 'primo', 'THE ORANGE EARPLUGS');
    // The husband’s bowl: Anna fills it every evening; the place at the far end, nobody sits.
    const bowl = new THREE.Group(); const cer = M(0xe8e2d4, .28); const b = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.03, 0), new THREE.Vector2(.06, .005), new THREE.Vector2(.08, .03), new THREE.Vector2(.085, .05), new THREE.Vector2(.078, .052)], 20), cer); bowl.add(b);
    const soup = new THREE.Mesh(new THREE.CircleGeometry(.074, 20), M(0x8a5a2a, .3)); soup.rotation.x = -Math.PI / 2; soup.position.y = .04; bowl.add(soup); S.soup = soup;
    const spoon = new THREE.Mesh(new THREE.BoxGeometry(.012, .004, .17), M(0xb8b6ae, .28, { metalness: .85 })); spoon.position.set(.1, .002, 0); bowl.add(spoon);
    addBelonging('bowl', bowl, [T.west[5][0] + .62, topY, T.west[5][1]], 'anna', 'A FULL BOWL AT AN EMPTY PLACE');
    // Gabri’s photograph, propped on the fridge.
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(.09, .11), new THREE.MeshStandardMaterial({ map: G.photoTex(), roughness: .8, side: THREE.DoubleSide }));
    const ph = new THREE.Group(); ph.add(photo); photo.position.y = .055; photo.rotation.x = -.18; S.photoMesh = photo;
    addBelonging('photo', ph, [-6.0, 1.585, -8.0], 'gabri', 'A PHOTOGRAPH ON THE FRIDGE');
    // Walter’s van keys, in a saucer on the dresser.
    const kg = new THREE.Group(); const sau = new THREE.Mesh(new THREE.CylinderGeometry(.07, .05, .015, 16), M(0xd8d2c4, .35)); kg.add(sau);
    for (let i = 0; i < 3; i++) { const k = new THREE.Mesh(new THREE.BoxGeometry(.014, .004, .055), M(0x9a8a60, .3, { metalness: .8 })); k.position.set((i - 1) * .015, .012, 0); k.rotation.y = (i - 1) * .4; kg.add(k); }
    const tag = new THREE.Mesh(new THREE.BoxGeometry(.03, .004, .04), M(0x6e2e26, .8)); tag.position.set(.03, .013, .03); kg.add(tag);
    addBelonging('keys', kg, [-8.3, 2.42, -3.75], 'walter', 'KEYS IN A SAUCER');
    // The kitchen table, the loaf, and an ordinary bread knife. Nothing marks it.
    const kt = new THREE.Group(); kt.position.set(-8.05, 0, -6.35); g.add(kt);
    const wood = M(0x5a4430, .8); const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, .05, .7), wood); top.position.y = .86; kt.add(top);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.05, .84, .05), wood); leg.position.set(sx * .5, .42, sz * .3); kt.add(leg); }
    const board = new THREE.Mesh(new THREE.BoxGeometry(.38, .025, .24), M(0x9a7a52, .7)); board.position.set(-.15, .9, 0); kt.add(board);
    const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(.07, .16, 6, 10), M(0xb88a4e, .85)); loaf.rotation.z = Math.PI / 2; loaf.scale.set(1, 1, .8); loaf.position.set(-.18, .96, 0); kt.add(loaf);
    z.solids.push({ minX: -8.62, maxX: -7.48, minZ: -6.72, maxZ: -5.98 });
    const knife = new THREE.Group(); const blade = new THREE.Mesh(new THREE.BoxGeometry(.24, .003, .03), M(0xc8c6be, .2, { metalness: .9 })); blade.position.x = .12; knife.add(blade);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(.11, .018, .024), M(0x2a1e14, .6)); handle.position.x = -.05; knife.add(handle); knife.rotation.y = .5;
    addBelonging('knife', knife, [-7.85, .89, -6.3], 'kitchen', 'A BREAD KNIFE');
    // A coat that turns up over your chair when there is no longer a place for you.
    const coat = new THREE.Mesh(new THREE.BoxGeometry(.46, .5, .07), M(0x2a2622, 1)); coat.visible = false; g.add(coat); S.coat = coat;
    // The chairs you can take. Aurelio’s is the one between Dario and Sergio: nothing says so.
    const L = 4.6, south = [T.top[0], T.top[1] + L / 2 + .5];
    const defs = [['west', 4], ['west', 5], ['east', 1], ['east', 4], ['east', 5], ['south', 0]];
    for (const [side, k] of defs) {
      const [x, zz] = side === 'south' ? south : T[side][k];
      const face = side === 'west' ? [1, 0] : side === 'east' ? [-1, 0] : [0, -1];
      const seat = { id: side + k, side, k, x, z: zz, face, aurelio: side === 'east' && k === 1, mine: side === 'south', chair: findChair(g, x, zz) };
      const marker = new THREE.Mesh(new THREE.SphereGeometry(.12, 6, 4), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); marker.position.set(x, .7, zz); g.add(marker);
      seat.entry = { id: 'seat-' + seat.id, type: 'social', object: marker, point: marker.position, radius: 1.9, prompt: '[ E ] SIT', run: () => sit(seat) };
      z.interactables.push(seat.entry); S.seats.push(seat);
    }
    S.place = findPlaceSetting(g, T.top[0], T.topY, T.top[1] + L / 2 - .22);
  }
  function findChair(g, x, z) { return g.children.find(c => c.isGroup && Math.abs(c.position.x - x) < .02 && Math.abs(c.position.z - z) < .02 && c.position.y === 0) || null; }
  function nearestChair(g, x, z) { let best = null, bd = .35; for (const c of g.children) { if (!c.isGroup || c.position.y !== 0) continue; const d = Math.hypot(c.position.x - x, c.position.z - z); if (d < bd && c.children.length > 8) { bd = d; best = c; } } return best; }
  function findPlaceSetting(g, x, y, z) { return g.children.find(c => c.isGroup && Math.abs(c.position.x - x) < .02 && Math.abs(c.position.z - z) < .02 && Math.abs(c.position.y - y) < .03) || null; }
  function addBelonging(id, mesh, at, owner, title) {
    const z = G.home(); mesh.position.set(at[0], at[1], at[2]); z.group.add(mesh);
    const B = { id, mesh, owner, title, origin: new THREE.Vector3(...at), state: 'here', where: 'origin', handled: 0 };
    B.entry = { id: 'belong-' + id, type: 'social', object: mesh, point: mesh.position, radius: 2.1, prompt: '[ E ] ' + title, run: () => handle(B) };
    z.interactables.push(B.entry);
    // a second, invisible marker at the original spot, for putting things back
    const spot = new THREE.Mesh(new THREE.SphereGeometry(.08, 6, 4), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); spot.position.copy(B.origin); z.group.add(spot);
    B.spot = { id: 'spot-' + id, type: 'social', object: spot, point: spot.position, radius: 2.0, prompt: '[ E ] WHERE IT WAS', run: () => handle(B, true), hidden: true };
    S.belong[id] = B; return B;
  }
  function setSpot(B, on) { const list = G.home().interactables, i = list.indexOf(B.spot); if (on && i < 0) list.push(B.spot); if (!on && i >= 0) list.splice(i, 1); }
  function setEntry(B, on) { const list = G.home().interactables, i = list.indexOf(B.entry); if (on && i < 0) list.push(B.entry); if (!on && i >= 0) list.splice(i, 1); }
  function myPlace() { const T = G.seats(); return new THREE.Vector3(T.top[0] + .14, T.topY, T.top[1] + 4.6 / 2 - .3); }
  function take(B) { B.mesh.visible = false; B.state = 'carried'; S.carried.add(B.id); setEntry(B, false); setSpot(B, true); }
  function putAt(B, v, where) { B.mesh.position.copy(v); B.mesh.visible = true; B.state = 'here'; B.where = where; S.carried.delete(B.id); setEntry(B, true); setSpot(B, where !== 'origin'); }
  function handle(B, atSpot = false) {
    const carried = S.carried.has(B.id);
    if (atSpot && carried) {
      return offer(B.title, B.id === 'knife' ? '(The bread board. The place where it was.)' : '(The place where it was. Nobody has put anything else there.)', [
        ['Put it back.', () => { putAt(B, B.origin, 'origin'); gesture(B.id + '-putback'); }],
        ['Keep it.', () => {}]]);
    }
    if (atSpot) return;
    const T = {
      earplugs: { look: '(Orange foam, soft. Still warm, as if they have just come out of somebody’s ears.)', opts: [['Pick them up and look.', () => { gesture('earplugs-look'); G.line('(Orange foam. Warm. They smell faintly of wax and of somebody else.)'); }], ['Put them in your pocket.', () => { take(B); gesture('earplugs-take'); }], ['Move them to your own place.', () => { putAt(B, myPlace().add(new THREE.Vector3(.12, 0, -.05)), 'mine'); gesture('earplugs-move'); }], ['Leave them.', () => {}]] },
      bowl: { look: '(A full bowl, still warm, at a place nobody sits. A spoon laid across it, the way a man lays a spoon down when he means to come back.)', opts: [['Eat from it.', () => { gesture('bowl-eat'); if (S.soup) S.soup.visible = false; G.line('(It is good. It is exactly as warm as yours.)'); }], ['Move it out of the way.', () => { putAt(B, B.origin.clone().add(new THREE.Vector3(.18, 0, .3)), 'moved'); gesture('bowl-move'); }], ['Leave it.', () => {}]] },
      photo: { look: '(A photograph, a woman on a beach, the colours gone orange. On the back, in a child’s hand: MAMMA 2009.)', opts: [['Take it down and look.', () => { gesture('photo-look'); G.line('(She is laughing at whoever holds the camera. There is a thumbprint worn into the corner.)'); }], ['Put it in your pocket.', () => { take(B); gesture('photo-take'); }], ['Tear it.', () => { B.mesh.visible = false; B.state = 'torn'; setEntry(B, false); gesture('photo-tear', { seenBy: witnesses(playerPos()) }); S.truths.push('You tore Gabri’s photograph.'); G.line('(It tears more easily than you expected.)'); }], ['Leave it.', () => {}]] },
      keys: { look: '(Van keys on a ring with a leather tag. Somebody has written WALTER on the tag, and under it, smaller, NOT YOURS.)', opts: [['Take them.', () => { take(B); gesture('keys-take'); G.flags.add('tobia-has-keys'); }], ['Leave them.', () => {}]] },
      knife: { look: '(A bread knife. The loaf is half cut. That is all.)', opts: [['Take it.', () => { take(B); gesture('knife-take'); }], ['Put it up on the fridge.', () => { putAt(B, new THREE.Vector3(-6.1, 1.6, -8.25), 'fridge'); gesture('knife-move'); }], ['Leave it.', () => {}]] }
    }[B.id];
    if (!T) return;
    B.handled++;
    if (B.where === 'mine' && B.id === 'earplugs' && !carried) {
      return offer(B.title, '(The earplugs are at your place, beside your bowl. You did not put them there.)', [
        ['Take them to Il Professore.', () => { const p = who('primo'); take(B); S.carried.delete(B.id); B.state = 'returned'; B.mesh.visible = false; setEntry(B, false); gesture('earplugs-return'); if (p) G.line('IL PROFESSORE: (He weighs them in his palm and smiles.) You found them. Where?'); }],
        ['Put them back at his end of the table.', () => { putAt(B, B.origin, 'origin'); gesture('earplugs-putback'); }],
        ['Put them in your pocket.', () => { take(B); gesture('earplugs-take'); }],
        ['Leave them where they are.', () => {}]]);
    }
    offer(B.title, T.look, T.opts);
  }
  // Giving a carried thing back to its owner happens face to face.
  function returnTo(npcKey) {
    const ids = [...S.carried].filter(id => S.belong[id].owner === npcKey || (id === 'earplugs' && npcKey === 'primo'));
    return ids[0] || null;
  }

  // ---- seats: sitting beside someone is already a sentence ------------------------
  function neighbours(seat) {
    const out = [];
    for (const p of present()) {
      const a = posOf(p);
      if (seat.side === 'south') { if (Math.hypot(a.x - seat.x, a.z - seat.z) < 1.6) out.push(p.key); continue; }
      const sameSide = Math.abs(a.x - seat.x) < .45, dz = Math.abs(a.z - seat.z);
      if (sameSide && dz > .3 && dz < 1.0) out.push(p.key);
      else if (!sameSide && Math.abs(a.x - seat.x) < 2.2 && dz < .4 && p.npc.seated) out.push(p.key); // across the table
    }
    return out;
  }
  function sit(seat) {
    if (S.seated || !G.canAct()) return;
    if (seat.mine && S.placeDenied) { G.line('(Somebody’s coat is over the back of the chair. There is no bowl. There is no place for you.)'); tense(.2); return; }
    S.seated = seat; seat.entry.prompt = '[ E ] STAND UP';
    G.playerAnchor.position.set(seat.x - seat.face[0] * .08, 0, seat.z - seat.face[1] * .08);
    G.camera.rotation.set(-.12, Math.atan2(-seat.face[0], -seat.face[1]), 0, 'YXZ'); G.look.yaw = 0; G.look.pitch = 0;
    G.audio()?.mechanicalNoise(.22, 520, .9, .05, 0);
    const near = neighbours(seat);
    if (seat.aurelio) {
      gesture('chair-aurelio', { seenBy: witnesses(playerPos(), { range: 9 }) });
      // the conversation stops for perhaps two seconds, then goes on as if it never stopped
      S.allLookUntil = now() + 2.6; G.clearLines(); G.audio()?.setMuffle?.(true, .2);
      setTimeout(() => G.audio()?.setMuffle?.(false, 1.2), 2300);
      setTimeout(() => G.line(pick(['FRANCO: —so the coffee, anyway. Anna’s coffee.', 'SERGIO: …and then the bus never came. Where was I.', 'ANNA: More bread. Who wants more bread.'])), 2500);
      tense(.28);
    }
    for (const k of near) {
      const st = standing(k);
      if (st <= -1.5) { setTimeout(() => moveAway(k, seat), 1800 + Math.random() * 1600); affect(k, { g: .2 }); }
      else affect(k, { t: .3 });
      if (!seat.aurelio) S.gestures += .25;
    }
    S.seatedNear = near;
  }
  function stand() {
    const seat = S.seated; if (!seat) return; S.seated = null; seat.entry.prompt = '[ E ] SIT';
    G.playerAnchor.position.set(seat.x - seat.face[0] * .75, 0, seat.z - seat.face[1] * .75);
    G.camera.position.y = 1.63;
  }
  // Someone moves their chair away from yours. No word.
  function moveAway(k, seat) {
    const p = who(k); if (!p || S.seated !== seat) return;
    const o = p.npc.object, dir = Math.sign(o.position.z - seat.z) || 1, chair = nearestChair(G.home().group, o.position.x, o.position.z);
    const steps = 24; let i = 0;
    const tick = () => { i++; o.position.z += dir * .36 / steps; o.rotation.y += (seat.side === 'west' ? 1 : -1) * .012 * dir; if (chair) chair.position.z += dir * .36 / steps; if (i < steps) requestAnimationFrame(tick); };
    tick(); G.audio()?.mechanicalNoise(.5, 260, .7, .06, 0);
    S.episodes.push({ act: 'chair-moved', truth: `${nm(k)} moved their chair away from yours`, t: now(), witnesses: [] });
    tense(.18);
  }

  // ---- 03 conversations as traps ------------------------------------------------------
  // A non-modal question: the world keeps moving, Tobia can still walk. Walking away is an
  // answer; not answering in time is an answer.
  function offer(title, line, opts, { timeout = 0, onTimeout = null, leave = null, speaker = null } = {}) {
    closeUI();
    const el = G.el('social'); if (!el) return;
    const at = playerPos().clone();
    S.ui = { opts, t: 0, timeout, onTimeout, leave, at, title };
    el.innerHTML = `<div class="social-title">${title}</div>${line ? `<div class="social-line">${line}</div>` : ''}<div class="social-opts">${opts.map((o, i) => `<button data-i="${i}"><b>${i + 1}</b>${o[0]}</button>`).join('')}</div>${timeout ? '<i class="social-time"></i>' : ''}`;
    el.classList.add('visible');
    el.querySelectorAll('button').forEach(b => b.addEventListener('click', () => choose(Number(b.dataset.i))));
    if (speaker && line) G.voice(line, speaker);
  }
  function choose(i) { const u = S.ui; if (!u || !u.opts[i]) return; closeUI(); u.opts[i][1](); }
  function closeUI() { S.ui = null; const el = G.el('social'); if (el) { el.classList.remove('visible'); el.innerHTML = ''; } }
  function updateUI(dt) {
    const u = S.ui; if (!u) return;
    u.t += dt;
    if (u.timeout) { const bar = G.el('social')?.querySelector('.social-time'); if (bar) bar.style.transform = `scaleX(${Math.max(0, 1 - u.t / u.timeout)})`; if (u.t >= u.timeout) { closeUI(); u.onTimeout?.(); return; } }
    const p = playerPos(); if (Math.hypot(p.x - u.at.x, p.z - u.at.z) > (u.leave ? 2.8 : 3.6)) { closeUI(); u.leave?.(); }
  }

  // Questions. motive: protect | test | accuse | probe. Each answer is read by who asks,
  // and by whoever happens to be listening.
  function ask(asker, topic) {
    const def = TOPICS[topic]?.(asker); if (!def) return false;
    const p = who(asker); if (!p) return false;
    S.asked = S.asked || new Set(); S.asked.add(asker + ':' + topic);
    tense(.15);
    const listeners = witnesses(posOf(p), { speech: true }).filter(k => k !== asker);
    const resolve = (kind, text) => {
      S.answers++; S.testimony.push({ topic, to: asker, kind, t: now(), listeners });
      if (text) G.line('TOBIA: ' + text);
      def.on[kind]?.(listeners);
      if (kind === 'silence') { tense(.05); G.line(pick(['(You say nothing. The question stays on the table between the glasses.)', '(Nothing. Somebody scrapes a chair.)'])); }
      if (kind === 'leave') { gesture('walked-off', { seenBy: [asker, ...listeners] }); }
    };
    G.line(`${UP(asker)}: ${def.q}`);
    G.queueAction(() => offer(UP(asker), '', def.opts.map(([label, kind, said]) => [label, () => resolve(kind, said)]), { timeout: 14, onTimeout: () => resolve('silence'), leave: () => resolve('leave') }));
    return true;
  }
  // What Tobia knows, what he did, and what each answer costs.
  const TOPICS = {
    aurelio: (a) => {
      const told = G.flags.has('remo-confessed'); const motive = { dario: 'test', ines: 'protect', marta: 'probe', walter: 'test' }[a] || 'probe';
      const opts = told ? [['“Franco said Don Aurelio wired the latch himself.”', 'truth', 'Franco said Don Aurelio wired the latch himself.'], ['“Somebody said it was the cold that winter.”', 'alter', 'Somebody said it was the cold.'], ['“I don’t remember who said what.”', 'forget', 'I don’t remember.'], ['“Is there more bread?”', 'subject', 'Is there more bread?']]
        : [['“Nobody has told me anything.”', 'truth', 'Nobody has told me anything.'], ['“Il Professore told me.”', 'lie', 'Il Professore told me.'], ['“Is there more bread?”', 'subject', 'Is there more bread?']];
      return { q: pick(['Did he tell you what happened? To Aurelio.', 'Has anyone told you about Aurelio? Who.']), opts, on: {
        truth: (L) => { if (told) { betray('franco', a, 'you repeated what Franco told you about Don Aurelio, to ' + nm(a), L); if (motive === 'test') affect(a, { t: .5 }); if (motive === 'protect') affect(a, { f: .6 }, 'You repeated a confidence to Ines; she decided you repeat things.'); } else affect(a, { t: .2 }); },
        alter: () => { exposeLater(a, 'franco', 'aurelio', 'You told ' + nm(a) + ' it was the cold. Franco had told you otherwise, and somebody had heard him tell you.'); if (motive === 'protect') affect(a, { t: .5 }); },
        lie: () => { affect(a, { g: .3 }); S.truths.push('You told ' + nm(a) + ' that Il Professore had told you about Aurelio. He had not.'); exposeLater(a, 'primo', 'aurelio', 'You said Il Professore had told you. Il Professore said he had not.'); },
        forget: () => { affect(a, motive === 'test' ? { g: .4 } : { t: .2 }, motive === 'test' ? 'You told ' + nm(a) + ' you could not remember. ' + nm(a) + ' did not believe you.' : null); },
        subject: () => affect(a, motive === 'protect' ? { t: .3 } : { g: .5 }, motive === 'protect' ? null : 'You changed the subject when ' + nm(a) + ' asked about Aurelio.'),
        silence: () => affect(a, motive === 'protect' ? { t: .2 } : { g: .7 }, motive === 'protect' ? null : 'You said nothing when ' + nm(a) + ' asked about Aurelio. ' + nm(a) + ' read it as knowing.'),
        leave: () => affect(a, { g: .9 }, 'You walked away when ' + nm(a) + ' asked about Aurelio.')
      } };
    },
    report: (a) => ({ q: 'What has Sergio been telling you? You were outside a long time, the two of you.', opts: [['“The vents were taped. He thinks it was the gas.”', 'truth', 'The vents were taped. He thinks it was the gas.'], ['“He talks about the weather.”', 'alter', 'He talks about the weather.'], ['“I don’t remember.”', 'forget', 'I don’t remember.']], on: {
      truth: (L) => { betray('sergio', a, 'you told ' + nm(a) + ' what Sergio had told you about the vents', L); affect(a, { t: .3 }); },
      alter: () => exposeLater(a, 'sergio', 'report', 'You told ' + nm(a) + ' that Sergio talks about the weather. Someone had heard what Sergio really said.'),
      forget: () => affect(a, { g: .4 }, 'You told ' + nm(a) + ' you did not remember what Sergio said.'),
      silence: () => affect(a, { g: .6 }, 'You would not say what Sergio had told you.'),
      leave: () => affect(a, { g: .8 }, 'You walked away when ' + nm(a) + ' asked about Sergio.') } }),
    earplugs: (a) => {
      const B = S.belong.earplugs, have = S.carried.has('earplugs'), moved = B.where === 'mine';
      const opts = have ? [['“Yes. I have them.”', 'truth', 'Yes. I have them.'], ['“No.”', 'lie', 'No.'], ['“Why would I have them?”', 'subject', 'Why would I have them?']]
        : [['“No.”', 'truth', 'No.'], ...(moved ? [['“They’re at my place. I don’t know how.”', 'odd', 'They’re at my place. I don’t know how.']] : []), ['“Ask Il Professore.”', 'subject', 'Ask Il Professore.']];
      return { q: pick(['Have you seen his earplugs? The orange ones. They were on the table.', 'Somebody has moved his earplugs. Have you seen them?']), opts, on: {
        truth: () => { if (have) { affect(a, { g: .8, t: .4 }, 'You admitted to ' + nm(a) + ' that you had Il Professore’s earplugs.'); } else affect(a, { t: .1 }); },
        lie: () => { affect(a, { t: -.1 }); exposeLater(a, null, 'earplugs', 'You told ' + nm(a) + ' you had not seen the earplugs. They were in your pocket.', true); },
        odd: () => affect(a, { g: .6 }, 'You told ' + nm(a) + ' the earplugs had appeared at your place by themselves.'),
        subject: () => affect(a, { g: .6 }, 'You told ' + nm(a) + ' to ask Il Professore about his own earplugs.'),
        silence: () => affect(a, { g: .9 }, 'You said nothing when ' + nm(a) + ' asked about the earplugs.'),
        leave: () => affect(a, { g: 1.1 }, 'You walked away when ' + nm(a) + ' asked about the earplugs.') } };
    },
    photo: (a) => { const have = S.carried.has('photo'), torn = S.belong.photo.state === 'torn'; return { q: 'Were you at the fridge? There was a picture there. On the top.', opts: [[have ? '“I have it. Here.”' : '“I looked at it.”', 'truth', have ? 'I have it. Here.' : 'I looked at it.'], ['“What picture?”', 'lie', 'What picture?']], on: {
      truth: () => { if (have) { const B = S.belong.photo; S.carried.delete('photo'); B.state = 'returned'; gesture('photo-return', { seenBy: [a, ...witnesses(playerPos())] }); } else affect(a, torn ? { g: 1.5 } : { g: .2, t: .3 }, torn ? 'You told Gabri you had only looked at the photograph. It was torn.' : null); },
      lie: () => exposeLater(a, null, 'photo', 'You told Gabri you had not seen the photograph.', have || torn),
      silence: () => affect(a, { g: 1.0 }, 'You said nothing when Gabri asked about his photograph.'),
      leave: () => affect(a, { g: 1.3 }, 'You walked away from Gabri when he asked about the photograph.') } }; },
    keys: (a) => { const have = S.carried.has('keys'); return { q: 'Somebody has my keys. The van keys. They were in the saucer.', opts: [[have ? '“I have them.”' : '“I haven’t seen them.”', 'truth', have ? 'I have them.' : 'I haven’t seen them.'], [have ? '“I haven’t seen them.”' : '“Pino was by the dresser.”', 'lie', have ? 'I haven’t seen them.' : 'Pino was by the dresser.']], on: {
      truth: () => { if (have) { S.carried.delete('keys'); G.flags.delete('tobia-has-keys'); gesture('keys-return', { seenBy: [a] }); } },
      lie: () => { if (have) exposeLater(a, null, 'keys', 'You told Walter you had not seen his keys.', true); else { conflict('walter', 'pino', 'you told Walter that Pino had been at the dresser'); S.truths.push('You told Walter that Pino had been at the dresser. He had not.'); } },
      silence: () => affect(a, { g: 1 }, 'You said nothing when Walter asked about his keys.'),
      leave: () => affect(a, { g: 1.4 }, 'You walked away when Walter asked about his keys.') } }; },
    blood: (a) => ({ q: pick(['Whose blood is that? On your sleeve.', 'What is that on your sleeve?']), opts: [['“Mine. My nose.”', 'truth', 'Mine. My nose.'], ['“Wine.”', 'lie', 'Wine.']], on: {
      truth: () => { if (SOCIAL[a]?.believer) { S.rel[a].marked = true; affect(a, { g: .6 }, 'Dario decided your blood was a sign.'); } else affect(a, { t: .2 }); },
      lie: () => { if (S.bleed.seen.size) exposeLater(a, [...S.bleed.seen][0], 'blood', 'You told ' + nm(a) + ' the blood on your sleeve was wine. ' + nm([...S.bleed.seen][0]) + ' had watched you bleed.'); },
      silence: () => affect(a, { g: .5, f: .3 }, 'You would not say whose blood was on your sleeve.'),
      leave: () => affect(a, { g: .7 }, 'You walked away when ' + nm(a) + ' asked about the blood.') } })
  };
  // Repeating what one person told you, to another: the group starts turning on itself.
  function betray(owner, toWhom, what, listeners) {
    conflict(toWhom, owner, what);
    S.truths.push(`Your words: ${what}.`);
    const reach = [toWhom, ...listeners];
    if (reach.includes(SOCIAL[owner]?.confidant) || Math.random() < .65) setTimeout(() => affect(owner, { g: 2.2, t: -1.2 }, `${nm(owner)} found out that ${what}.`), 60000 + Math.random() * 50000);
  }
  function conflict(a, b, why) { const k = a + '>' + b; S.between[k] = (S.between[k] || 0) + 1; S.conflicts.push({ a, b, why, t: now() }); }
  // A lie is safe until the person who knows meets the person who asked.
  function exposeLater(asker, knower, topic, cause, certain = false) {
    const ep = S.episodes.slice().reverse().find(e => e.witnesses.some(w => w !== asker && w !== 'primo'));
    if (!certain && !knower && !ep) return;
    setTimeout(() => {
      const holder = S.carried.has(topic) || (topic === 'earplugs' && S.belong.earplugs.where === 'mine');
      if (certain && !holder && topic !== 'photo') return;
      affect(asker, { g: 1.8, t: -.8 }, cause);
      if (G.zone() === 'home' && who(asker) && dist2(who(asker)) < 7) G.line(`${UP(asker)}: ${pick(['(He looks at you for a long time and says nothing.)', 'You said no. I remember you said no.', 'Somebody told me something about you. I am not going to say who.'])}`);
    }, 50000 + Math.random() * 70000);
  }

  // ---- 04 epistaxis --------------------------------------------------------------
  function tense(v) { S.tension = clamp(S.tension + v * .78, 0, 1.2); }
  const B = S.bleed;
  function startBleed() {
    B.on = true; B.t = 0; B.dur = 40 + Math.random() * 24; B.level = Math.max(B.level, .05); B.hand = 1; B.seen = new Set(); B.offered = false;
    G.line(pick(['(Something warm on your lip.)', '(A drop. Your hand goes to your nose before you decide to lift it.)', '(The taste of a coin.)']));
    G.audio()?.mechanicalTone(1300, 900, .05, 'sine', .02, 0);
    if (!B.told) { B.told = true; G.journal({ id: 'epistassi', title: 'Epistassi', description: 'My nose bleeds when a room closes around me. Not when anyone touches me: when nobody does. A tissue takes a few seconds, and the house does not wait for me. A sleeve takes less, and then everyone can see it.', kind: 'symptom', zone: 'home' }); G.el('bleed-help')?.classList.add('visible'); setTimeout(() => G.el('bleed-help')?.classList.remove('visible'), 9000); }
    showPacket(5);
  }
  function wipe(kind) {
    if (!B.on && B.level < .05) { if (kind === 'tissue') { showPacket(3); G.line('(You touch your lip. Dry. For now.)'); } return; }
    if (B.wipe > 0 || !G.canAct()) return;
    if (kind === 'tissue' && B.tissues <= 0) { showPacket(3); G.line('(The packet is empty. You turn it inside out anyway.)'); tense(.06); return; }
    B.wipeKind = kind; B.wipeDur = kind === 'tissue' ? 3.4 : 1.4; B.wipe = B.wipeDur;
    if (kind === 'tissue') { B.tissues--; showPacket(4); } else { B.stain++; gesture('blood-sleeve'); }
    const w = G.el('wipe'); if (w) { w.className = ''; void w.offsetWidth; w.style.setProperty('--dur', B.wipeDur + 's'); w.className = 'active ' + kind; }
    G.audio()?.mechanicalNoise(B.wipeDur * .8, kind === 'tissue' ? 2400 : 900, .6, .05, 0);
    if (kind === 'tissue') whileYouWipe();
  }
  function endWipe() {
    const w = G.el('wipe'); if (w) w.className = '';
    if (B.wipeKind === 'tissue') { B.level = 0; B.t = Math.max(B.t, B.dur * .55); }
    else B.level *= .45;
    B.wipeKind = null;
  }
  function showPacket(sec) {
    const el = G.el('tissues'); if (!el) return;
    el.innerHTML = `<i class="pack ${B.tissues ? '' : 'empty'}">${Array.from({ length: B.tissues }, (_, i) => `<s style="left:${8 + i * 7}px;transform:rotate(${(i % 2 ? 4 : -3)}deg)"></s>`).join('')}</i>`;
    el.classList.add('visible'); clearTimeout(showPacket.t); showPacket.t = setTimeout(() => { if (!B.on) el.classList.remove('visible'); }, sec * 1000);
  }
  // You are occupied by your own body, and the room is not.
  function whileYouWipe() {
    const opts = [];
    const E = S.belong.earplugs;
    if (G.zone() !== 'home') return;
    if (E && E.state === 'here' && E.where === 'origin' && who('marta') && !S.martaTook) opts.push(() => { S.martaTook = true; E.mesh.visible = false; E.state = 'gone'; setEntry(E, false); S.truths.push('Marta took Il Professore’s earplugs from the table while you were wiping your nose.'); S.frameAt = now() + 80 + Math.random() * 60; S.missingEarplugs = now(); });
    const hostile = present().filter(p => standing(p.key) < -1 && !p.npc.seated).sort((a, b) => standing(a.key) - standing(b.key))[0];
    if (hostile) opts.push(() => { S.approach = { p: hostile, from: posOf(hostile), t: 0 }; });
    opts.push(() => setTimeout(() => G.line(pick(['SERGIO: …and that is why nobody opens the cellar window. (Laughter. You missed the first half.)', 'ANNA: …so that is decided, then. (You do not know what was decided.)', 'DARIO: …and the guest too, when it is time. (He stops when you lower the tissue.)'])), 2400));
    pick(opts)();
  }
  function updateBleed(dt) {
    const inPlay = G.canAct() || B.wipe > 0;
    if (B.wipe > 0) { B.wipe -= dt; if (B.wipe <= 0) endWipe(); }
    if (B.on && inPlay) {
      B.t += dt;
      const ending = B.t > B.dur;
      if (!ending) B.level = Math.min(1, B.level + dt * (.022 + S.tension * .02)); else B.level = Math.max(0, B.level - dt * .06);
      if (ending && B.level <= .01) { B.on = false; B.cd = 42; G.el('tissues')?.classList.remove('visible'); }
      G.blood.bleedT = B.level > .12 ? 1 : 0;
      // the body, close: breath, a swallow, the drip
      B.breath -= dt; if (B.breath <= 0) { B.breath = 3.6 - B.level * 1.4; const a = G.audio(); a?.mechanicalNoise(1.1, 420, .7, .025 + B.level * .035, 0); setTimeout(() => a?.mechanicalNoise(1.3, 300, .6, .02 + B.level * .03, 0), 1300); if (Math.random() < .25 + B.level * .3) setTimeout(() => { a?.mechanicalTone(150, 70, .16, 'sine', .05, 0); a?.mechanicalNoise(.05, 3000, 3, .02, 0); }, 2300); }
      B.drip -= dt; if (B.drip <= 0) { B.drip = 2.6 - B.level * 1.6; G.audio()?.mechanicalTone(1500, 950, .04, 'sine', .012 + B.level * .02, (Math.random() - .5) * .2); }
      // the people around notice
      if (B.level > .3 && G.zone() === 'home') noticeBlood();
      G.audio()?.setMuffle?.(B.level > .55, 1.5);
    } else { G.blood.bleedT = 0; if (!B.on) B.level = Math.max(0, B.level - dt * .1); }
    // distortion trails the blood, and leaves slowly
    const want = B.wipe > 0 && B.wipeKind === 'tissue' ? B.level * .5 : B.level;
    B.distort += (want - B.distort) * Math.min(1, dt * (want > B.distort ? .35 : .18));
    B.hand = Math.max(0, B.hand - dt * .7); G.el('hand')?.style.setProperty('opacity', String(Math.sin(Math.min(1, B.hand) * Math.PI) * .9));
    if (!B.on) { B.cd -= dt; if (B.cd <= 0 && S.tension > .56 && G.canAct() && (G.zone() === 'home' || S.tension > .8)) startBleed(); }
    if (B.on) G.el('nosebleed')?.classList.toggle('active', B.level > .12);
  }
  function noticeBlood() {
    for (const k of witnesses(playerPos(), { range: 4.2 })) {
      if (B.seen.has(k) || k === 'primo') continue; B.seen.add(k);
      const line = { dario: 'DARIO: (very quietly, not to you) There. You see. It marks the ones it wants.', franco: 'FRANCO: (He looks at your face and puts his fork down.) Christ.', sergio: 'SERGIO: Head forward. Forward, not back. Here — pinch it.', gabri: '(Gabri stares at the blood and does not look away.)', marta: 'MARTA: Do not drip on the floor. It goes into the wood.', walter: '(Walter looks at your nose, then at the floor under you, then at the door.)', anna: 'ANNA: Not on the cloth. Not on the cloth.', pino: 'PINO: You need air. Outside. Come on.', livia: '(Livia hums the four notes very softly, the way you hum to a child.)', ottavio: '(Ottavio looks at your mouth, then at your hand, and folds his arms.)' }[k];
      if (k === 'dario') { S.rel.dario.marked = true; S.rel.dario.causes.push({ text: 'Dario watched you bleed and decided it was a sign.', w: .8, at: now() }); }
      if (k === 'franco') affect('franco', { t: -.3 });
      if (k === 'sergio') affect('sergio', { t: .3 });
      if (line) setTimeout(() => G.line(line), 300 + Math.random() * 900);
      if (k === 'ines' && !B.offered && standing('ines') > -1 && B.tissues < 6) { B.offered = true; setTimeout(() => offerTissue(), 1600); }
    }
  }
  function offerTissue() {
    if (!who('ines') || dist2(who('ines')) > 5) return;
    const seen = witnesses(playerPos());
    offer('INES', 'Here. Not your sleeve. (She holds out a folded tissue, already warm from her pocket.)', [
      ['Take it.', () => { B.tissues++; showPacket(3); affect('ines', { t: .8 }); if (seen.includes('gabri')) affect('gabri', { g: .5 }, 'Gabri watched Ines take care of you.'); }],
      ['“I’m fine.”', () => { affect('ines', { t: -.4, g: .2 }); G.line('INES: (She puts it back in her pocket.) Of course you are.'); }]
    ], { timeout: 11, onTimeout: () => affect('ines', { t: -.2 }), speaker: 'Ines' });
  }

  // ---- 05 Il Primo arranges --------------------------------------------------------
  function primoPresent() { return who('primo'); }
  function gatherStart() {
    const P = primoPresent(); if (!P) return;
    S.gather.n++; S.gather.active = { t: 0, beats: [], sat: false, calledAt: now() };
    const A = S.gather.active, add = (at, fn) => A.beats.push({ at, fn });
    const plugs = S.belong.earplugs, havePlugs = plugs.state === 'here' && plugs.where === 'origin';
    // He decides who sits where, and whether there is a place for you at all.
    const excl = exclusion();
    S.placeDenied = excl > .45;
    if (S.placeDenied && S.place) { S.place.visible = false; if (S.coat) { const T = G.seats(); S.coat.position.set(T.top[0], .78, T.top[1] + 4.6 / 2 + .62); S.coat.visible = true; } }
    tense(S.gather.n === 1 ? .38 : .18);
    G.line(pick(['IL PROFESSORE: We eat. Everyone.', 'IL PROFESSORE: The table, please. All of us.', 'IL PROFESSORE: Sit down, all of you. It is getting cold.']));
    if (havePlugs) add(1.5, () => { G.earplugs(P.npc, true); G.line('(He puts in his orange earplugs, one, then the other, and smiles at nobody.)'); });
    else add(1.5, () => G.line('(He reaches for his earplugs. They are not on the table. He presses two fingertips into his ears instead, and smiles at nobody.)'));
    // the arrangement
    if (S.placeDenied) add(4.5, () => { G.line('(There is no place set for you. A coat is over the back of your chair. Nobody mentions it.)'); tense(.3); });
    else if (S.gather.n === 2) add(4.5, () => { G.line('IL PROFESSORE: Tobia. There. (He points at the empty chair between Dario and Sergio.) Nobody is using it tonight.'); A.pointed = 'east1'; });
    else { const worst = present().filter(p => p.key !== 'primo').sort((a, b) => standing(a.key) - standing(b.key))[0]; if (worst && S.gather.n > 2) add(4.5, () => G.line(`IL PROFESSORE: Tobia, sit near ${nm(worst.key)}. You two have not talked.`)); }
    // the situation he lets happen
    const sit = chooseSituation();
    add(14, () => sit());
    add(40, () => { if (!A.sat && G.zone() === 'home' && !S.seated) { gesture('refuse-gathering', { seenBy: present().map(p => p.key) }); S.refused++; for (const p of present()) affect(p.key, { g: .3 * (SOCIAL[p.key]?.loyalty ?? .5) }, p.key === 'primo' ? null : 'You did not come to the table when Il Professore called everyone.'); } });
    add(55, () => { G.earplugs(P.npc, false); });
    add(58, () => { S.gather.active = null; if (!S.plotN) S.plotAt = Math.min(S.plotAt || 1e9, now() + 70); if (S.placeDenied && S.place) { /* the place stays gone */ } });
  }
  function chooseSituation() {
    const n = S.gather.n, list = [];
    const has = (k) => !!who(k);
    if (n === 1 && has('franco') && has('anna')) return () => humiliation('franco', 'anna', 'FRANCO: Anna made the coffee again. Dishwater with ambitions.', 'ANNA: (She says nothing. She refills his cup.)');
    if (S.missingEarplugs && !S.asked?.has('dario:earplugs') && has('dario')) list.push(() => ask('dario', 'earplugs'));
    if (G.flags.has('sergio-truth') && !S.asked?.has('walter:report') && has('walter')) list.push(() => ask('walter', 'report'));
    if (!S.asked?.has('dario:aurelio') && has('dario') && n >= 2) list.push(() => ask('dario', 'aurelio'));
    if (B.stain >= 2 && has('dario') && !S.asked?.has('dario:blood')) list.push(() => ask('dario', 'blood'));
    if (has('sergio') && has('dario') && !S.cigOffered) list.push(() => cigarette());
    if (has('dario') && has('sergio') && !S.didHumil?.has('dario')) list.push(() => humiliation('dario', 'sergio', 'DARIO: Sergio believes in nothing. He stays for the soup.', 'SERGIO: The soup is very good.'));
    if (has('walter') && has('gabri') && !S.didHumil?.has('walter')) list.push(() => humiliation('walter', 'gabri', 'WALTER: Nineteen, and he sits by the fridge like a dog waiting for a door.', '(Gabri looks at his hands.)'));
    if (has('ines') && has('sergio') && !S.helped) list.push(() => helpRequest());
    if (has('sergio') && !S.primoStopped && G.flags.has('sergio-truth')) list.push(() => primoIntervenes());
    return list.length ? pick(list) : () => G.line(pick(['ANNA: More bread. Who wants more.', 'DARIO: Can you hear it tonight? Under the rain. Il Bianco is close.', 'MARTA: Another beam this week. Il Bianco does not wait for the wood to dry.', 'INES: Eat. Il Bianco fills the empty ones first.']));
  }
  // Somebody is humiliated in public. Defending them, laughing, or looking at your plate are all things you did.
  function humiliation(agg, vic, line, reply) {
    (S.didHumil = S.didHumil || new Set()).add(agg);
    G.line(line); G.line(reply);
    G.queueAction(() => offer('', '', [
      [`“Leave ${nm(vic)} alone.”`, () => { G.line(`TOBIA: Leave ${nm(vic)} alone.`); const seen = present().map(p => p.key); affect(vic, { t: 1.4 }); affect(agg, { g: 1.2 }, `You defended ${nm(vic)} against ${nm(agg)} at the table.`); S.primoNotes.push('defend'); seen.forEach(k => { if (k !== agg && k !== vic && SOCIAL[k]?.protects?.includes(vic)) affect(k, { t: .5 }); }); }],
      ['Laugh.', () => { G.line('(You laugh. Two others laugh with you, a beat late.)'); affect(agg, { t: .6 }); affect(vic, { g: 1.2 }, `You laughed when ${nm(agg)} humiliated ${nm(vic)}.`); }],
      ['(Look at your plate.)', () => { affect(vic, { t: -.5 }); }]
    ], { timeout: 12, onTimeout: () => { affect(vic, { t: -.6 }); S.truths.push(`You said nothing when ${nm(agg)} humiliated ${nm(vic)}.`); } }));
  }
  function cigarette() {
    S.cigOffered = true;
    G.line('SERGIO: (He holds the pack out to you across the table.) Go on.');
    G.line('(Dario watches your hand. His face does something you cannot read.)');
    G.queueAction(() => offer('SERGIO', '', [['Take one.', () => { affect('sergio', { t: .8 }); affect('dario', { g: .5 }, 'You took a cigarette from Sergio in front of Dario.'); conflict('dario', 'sergio', 'Sergio offered you a cigarette'); }], ['“No, thanks.”', () => { affect('sergio', { t: -.2 }); affect('dario', { t: .2 }); }]], { timeout: 11, onTimeout: () => affect('sergio', { t: -.3 }) }));
  }
  // Helping is inconvenient: while you carry the pot, Sergio says the important thing.
  function helpRequest() {
    S.helped = true;
    G.line('INES: Tobia. The pot. I cannot lift it alone.');
    G.queueAction(() => offer('INES', '', [['Go and help her.', () => { affect('ines', { t: 1 }); S.gestures++; G.line('(You carry the pot. By the time you are back, Sergio is finishing something.) SERGIO: …and that is why the vents. Anyway.'); }], ['“In a minute.”', () => { affect('ines', { t: -.3 }); G.line('SERGIO: (low, to you) Listen. The cellar vents were taped from the inside. I have the report. Not here.'); G.flags.add('sergio-truth'); }]], { timeout: 10, onTimeout: () => affect('ines', { t: -.5 }) }));
  }
  // He stops a revelation, not to protect anyone: he wants to see what happens without it.
  function primoIntervenes() {
    S.primoStopped = true;
    G.line('SERGIO: The thing nobody says about the cellar is that the vents—');
    G.line('IL PROFESSORE: Not now, Sergio. (He does not raise his voice.) Let him find it.');
    G.line('(Sergio drinks. Nobody looks at anybody.)');
    S.truths.push('Il Professore stopped Sergio telling you about the vents. He wanted you to find it yourself.');
  }
  function exclusion() {
    const ps = present().filter(p => p.key !== 'primo'); if (!ps.length) return 0;
    return ps.filter(p => standing(p.key) <= -1).length / ps.length + S.refused * .1;
  }
  // What Il Primo says, now and then: he knows, and does not say how.
  function primoAside() {
    const n = S.primoNotes;
    if (n.includes('chair-aurelio') && !S.pa1) { S.pa1 = true; return 'You sat in a chair tonight. I was not watching you. I was watching who watched you. '; }
    if ((n.includes('earplugs-take') || n.includes('earplugs-look')) && !S.pa2) { S.pa2 = true; return 'You have been near my earplugs. Keep them, if you like. I hear perfectly well without them; that is the problem. '; }
    if (n.includes('defend') && !S.pa3) { S.pa3 = true; return 'You defended someone at dinner. Generous. Now two people will remember it, and one of them will not forgive it. '; }
    if (S.heardTold.length >= 3 && !S.pa4) { S.pa4 = true; return 'They talk about you when you are in the other room. I do not join in. I only listen to what changes in the telling. '; }
    return '';
  }

  // ---- the kitchen: an ordinary room with a knife on the table ----------------------
  const KITCHEN = { x: -7.25, z: -5.75 };
  function score(k) {
    const r = S.rel[k], s = SOCIAL[k]; if (!r || !s) return -9;
    return r.grievance * (.55 + s.violence) + r.fear * s.violence * .8 + (r.marked && s.believer ? 1.4 : 0) - Math.max(0, r.trust) * 1.1 - s.care * .8;
  }
  const KILL = () => [Infinity, 6.2, 5.0, 4.0][G.difficulty()] ?? 5;
  function candidate() { let best = null, bs = 2.4; for (const p of present()) { if (p.key === 'primo' || p.key === 'ottavio' || hunting(p.key)) continue; const sc = score(p.key); if (sc > bs) { bs = sc; best = p; } } return best ? { p: best, s: bs } : null; }
  function arrangeKitchen() {
    const c = candidate(); if (!c) return false;
    const P = primoPresent();
    const n = c.p.npc; n._home = n._home || { x: n.object.position.x, z: n.object.position.z, y: n.object.position.y, r: n.object.rotation.y, seated: !!n.seated };
    S.kitchen.scene = { p: c.p, k: c.p.key, s: c.s, stage: 'walk', t: 0, path: pathTo(n.object.position, KITCHEN), arranged: !!P };
    if (P) G.line(`IL PROFESSORE: ${nm(c.p.key)}, there is bread to cut in the kitchen. Tobia will help you carry it.`);
    else G.line(`(${nm(c.p.key)} gets up and goes into the kitchen without a word.)`);
    n.seated = false; n.posed = false;
    return true;
  }
  function pathTo(from, to) {
    const pts = []; const x = from.x, z = from.z;
    if (x < -6.5 && z > -4.5) { pts.push([-7.75, z], [-7.75, -5.2]); }
    else if (z > -4.5) { pts.push([x > -5 ? x : -5.0, z], [-5.0, -5.2]); }
    pts.push([to.x, to.z]); return pts;
  }
  function inKitchen() { const p = playerPos(); return p.x < -4.6 && p.z < -4.9; }
  function updateKitchen(dt) {
    const K = S.kitchen, sc = K.scene;
    if (!sc) {
      K.cd -= dt;
      if (K.cd <= 0 && G.zone() === 'home' && !S.gather.active && !S.ui && G.canAct() && !S.seated) { K.cd = 45; const c = candidate(); if (c && c.s > 2.6) { arrangeKitchen(); } }
      return;
    }
    const n = sc.p.npc; sc.t += dt;
    if (G.zone() !== 'home' && sc.stage !== 'back') { sc.stage = 'back'; sc.path = pathTo(n.object.position, { x: n._home.x, z: n._home.z }).slice(-1); }
    if (sc.stage === 'walk' || sc.stage === 'back') {
      const tgt = sc.path[0]; if (!tgt) { if (sc.stage === 'back') { restore(n); K.scene = null; K.cd = 150; } else { sc.stage = 'wait'; sc.t = 0; } return; }
      if (G.walk(n, tgt[0], tgt[1], 1.0, dt)) sc.path.shift();
      return;
    }
    if (sc.stage === 'wait') {
      G.turn(n, -7.9, -6.35, dt);
      if (inKitchen() && G.canAct()) { sc.stage = 'meet'; sc.t = 0; meet(sc); }
      else if (sc.t > 70) goBack(sc);
      return;
    }
    if (sc.stage === 'meet' || sc.stage === 'talk') { const p = playerPos(); G.turn(n, p.x, p.z, dt); if (sc.stage === 'talk' && !inKitchen() && !S.ui && !sc.ended) { sc.ended = true; S.truths.push(`You walked out of the kitchen while ${nm(sc.k)} was still there.`); goBack(sc); } }
    if (sc.stage === 'attack') {
      const p = playerPos(); if (!G.walk(n, p.x, p.z, 1.6, dt)) return;
      sc.stage = 'done'; assassinate(sc.k);
    }
  }
  function goBack(sc) { sc.stage = 'back'; const h = sc.p.npc._home; sc.path = [[KITCHEN.x, -4.9], ...(h.x < -6.5 ? [[-7.75, -4.9], [-7.75, h.z]] : [[-5.0, -4.9], [-5.0, h.z]]), [h.x, h.z]]; }
  function restore(n) { const h = n._home; if (!h) return; n.object.position.set(h.x, h.y, h.z); n.object.rotation.y = h.r; n.seated = h.seated; n.walking = false; }
  // Three credible outcomes, decided by what has happened, not by a coin.
  function meet(sc) {
    const k = sc.k, s = SOCIAL[k], knife = S.belong.knife, knifeHere = knife.state === 'here' && knife.where === 'origin';
    const others = present().filter(p => p.key !== k && p.key !== 'primo');
    const protector = others.find(p => (SOCIAL[p.key]?.protects?.includes('tobia') && standing(p.key) > .5) || standing(p.key) > 2);
    const sc2 = score(k), canKill = G.difficulty() > 0 && sc2 >= KILL();
    sc.kind = canKill ? 'attack' : (sc2 >= 3.2 && (s.care >= .4 || S.rel[k].fear > S.rel[k].grievance)) ? 'help' : 'pretend';
    sc.protector = protector && dist2(protector) < 12 ? protector : null;
    sc.knife = knifeHere;
    tense(sc.kind === 'attack' ? .45 : .2);
    G.lineNow(`${UP(k)}: ${s.kitchen.open}`);
    sc.stage = 'talk';
    if (sc.kind === 'pretend') { setTimeout(() => { G.line(`${UP(k)}: ${s.kitchen.pretend}`); setTimeout(() => goBack(sc), 5000); }, 2600); return; }
    if (sc.kind === 'help') {
      G.queueAction(() => offer(UP(k), s.kitchen.help, [['“Yes.”', () => { S.promised = k; G.flags.add('promised-' + k); affect(k, { t: 1.4, g: -1 }); goBack(sc); }], ['“I can’t.”', () => { affect(k, { t: -.5 }); goBack(sc); }]], { timeout: 13, onTimeout: () => { affect(k, { t: -.6 }); goBack(sc); }, speaker: nm(k) }));
      return;
    }
    // attack: still an ordinary exchange, until it is not
    const cause = (S.rel[k].causes.slice().sort((a, b) => b.w - a.w)[0]) || { text: '' };
    const giveBack = returnTo(k) || (k === 'gabri' && S.carried.has('photo') ? 'photo' : null) || (k === 'walter' && S.carried.has('keys') ? 'keys' : null);
    const opts = [];
    if (giveBack) opts.push([`Give back the ${({ photo: 'photograph', keys: 'keys', earplugs: 'earplugs' })[giveBack] || giveBack}.`, () => { S.carried.delete(giveBack); affect(k, { g: -2.5, t: .4 }); defused(sc, 'returned'); }]);
    if (S.carried.has('knife')) opts.push(['Put the knife on the table between you.', () => { const K = S.belong.knife; putAt(K, new THREE.Vector3(-7.85, .89, -6.3), 'origin'); affect(k, { f: 1.2, g: -1 }); defused(sc, 'knife'); }]);
    opts.push(['“What did they tell you about me?”', () => { G.line('TOBIA: What did they tell you about me?'); setTimeout(() => { G.line(`${UP(k)}: ${cause.text ? cause.text.replace(/^[A-Z][a-z]+ /, (m) => m === nm(k) + ' ' ? 'I ' : m).replace(/\byou\b/g, 'you') : 'Nothing. Nobody had to.'}`); G.queueAction(() => offer(UP(k), '', [['“That isn’t what happened.”', () => { if (SOCIAL[k].distorts < .5 && /\(you had not\)/.test(cause.text)) { affect(k, { g: -2.2 }); defused(sc, 'truth'); } else fail(sc); }], ['“I’m sorry.”', () => { if (SOCIAL[k].care >= .45) { affect(k, { g: -2 }); defused(sc, 'sorry'); } else fail(sc); }], ['(Walk out of the kitchen.)', () => { defused(sc, 'walked'); }]], { timeout: 10, onTimeout: () => fail(sc), leave: () => defused(sc, 'walked') })); }, 1400); }]);
    opts.push(['(Walk out of the kitchen.)', () => defused(sc, 'walked')]);
    G.queueAction(() => offer(UP(k), sc.knife ? '(The knife is on the table between you. The loaf is half cut.)' : '', opts, { timeout: 11, onTimeout: () => fail(sc), leave: () => defused(sc, 'walked') }));
  }
  function defused(sc, how) {
    const k = sc.k;
    if (how === 'walked') { G.line(`(${nm(k)} does not follow you. Behind you, the bread knife goes back on the board.)`); S.truths.push(`In the kitchen, you walked out before ${nm(k)} decided anything.`); if (sc.kind === 'attack') setTimeout(() => startHunt(k, 'you walked out of the kitchen'), 20000); }
    else if (how === 'returned') G.line(`${UP(k)}: (A long breath out.) Get out of the kitchen.`);
    else if (how === 'knife') G.line(`(${nm(k)} looks at the knife, then at you, and leaves it where it is.)`);
    else G.line(`${UP(k)}: (Nothing for a while.) Bread. Take the bread through.`);
    goBack(sc); S.kitchen.cd = 180;
  }
  function fail(sc) {
    const k = sc.k;
    if (sc.protector && !S.kitchen.protectorUsed) {
      S.kitchen.protectorUsed = true; const pk = sc.protector.key;
      G.lineNow(`${UP(pk)}: (from the doorway) ${nm(k)}. The bread. They are waiting for the bread.`);
      S.truths.push(`${nm(pk)} came into the kitchen at the moment ${nm(k)} picked up the knife. You did not see it as a rescue.`);
      affect(pk, { t: .4 }); goBack(sc); S.kitchen.cd = 200; return;
    }
    sc.stage = 'attack'; tense(.6);
    G.lineNow(sc.knife ? `(${nm(k)} picks up the bread knife the way you would pick it up to cut bread.)` : `(${nm(k)} wipes their hands on their trousers and comes around the table.)`);
  }
  function assassinate(k) {
    const r = S.rel[k], s = SOCIAL[k];
    const causes = r.causes.slice().sort((a, b) => b.at - a.at).map(c => c.text);
    const lines = [];
    if (S.kitchen.scene?.arranged) lines.push(`Il Professore asked ${nm(k)} to cut the bread, and asked you to help. That was all he did.`);
    lines.push(...causes.slice(0, 6));
    lines.push(...S.truths.filter(t => /Marta took|Dario|came into the kitchen|tore|Pino had been/.test(t)).slice(0, 3));
    const absent = keys.filter(x => x !== k && SOCIAL[x].protects?.includes('tobia') && standing(x) > .5);
    if (absent.length) lines.push(`${absent.map(nm).join(' and ')} would have come in. ${absent.length > 1 ? 'They were' : nm(absent[0]) + ' was'} somewhere else.`);
    else lines.push('Nobody else was in the kitchen. Nobody had a reason to be.');
    lines.splice(0, lines.length, ...new Set(lines));
    S.ending = { id: 'assassination', title: 'The Assassination', small: 'ENDING · THE ASSASSINATION', copy: s.kill + ' Il Professore was in the other room with his earplugs in. When they told him, he asked who had been with you, and wrote the name down.', voice: 'There was no monster. There was a kitchen, and a reason, and nobody in the doorway.', ledger: lines };
    G.end(S.ending, true);
  }

  // ---- arriving, doors, gaze, barks --------------------------------------------------
  function onEnterZone(name) {
    huntersOnEnter(name);
    if (name !== 'home') { if (S.seated) S.seated = null; closeUI(); return; }
    buildWorld();
    const cold = present().filter(p => p.key !== 'primo' && standing(p.key) <= -1).length;
    if ((now() - S.lastRumourAt < 120 && S.heardTold.length) || cold >= 4) {
      S.allLookUntil = now() + 3.2; S.talkStop = now();
      setTimeout(() => G.line(pick(['(The talk stops when you come in. Somebody puts a glass down. After a while, the weather.)', '(A conversation by the stove ends in the middle of a word.)', '(Everyone is suddenly busy with their plates.)'])), 600);
      tense(.15);
    }
    if (S.frameAt && !S.framed && now() > S.frameAt) frame();
  }
  // The earplugs come back — at your place. Someone has told a different version.
  function frame() {
    const E = S.belong.earplugs; if (!E || E.state !== 'gone') return;
    S.framed = true; putAt(E, myPlace().add(new THREE.Vector3(.12, 0, -.05)), 'mine'); E.state = 'here';
    S.truths.push('Marta put the earplugs at your place. When Dario asked her, she said she had seen you with them.');
    affect('dario', { g: 1.2 }, 'Marta told Dario she had seen you with Il Professore’s earplugs (she had taken them herself).');
    conflict('dario', 'tobia', 'the earplugs');
  }
  function doorGate(item) {
    if (item.destination !== 'home' || G.zone() === 'home') return false;
    const cold = keys.filter(k => standing(k) <= -1.2).length;
    if (cold < 5) return false;
    if (now() < S.doorAt) { G.line('(Nothing. The bolt does not move.)'); return true; }
    if (S.doorWarned && now() - S.doorWarned < 200) return false;
    S.doorWarned = now(); S.doorAt = now() + 9; tense(.25);
    const friend = keys.filter(k => standing(k) >= 1).sort((a, b) => standing(b) - standing(a))[0];
    G.line('(The door is shut. You hear the bolt go across on the other side. Then nothing.)');
    setTimeout(() => G.line(friend ? `(After a long time the bolt slides back. ${nm(friend)} opens the door and goes back in without a word.)` : '(After a long time the bolt slides back by itself. Nobody is behind it.)'), 8200);
    return true;
  }
  function gazeFor(npc) {
    const k = npc.socialKey; if (!k || G.zone() !== 'home') return null;
    if (now() < S.allLookUntil) return 1;
    if (k === 'primo') return S.gather.active ? 1 : null;
    const st = standing(k), p = { npc };
    if (st <= -1) return playerLooksAt(p) ? 0 : 1;         // they look at you only when you are not looking
    if (st >= 1.5) return null;
    return null;
  }
  function barkFor(npc) {
    const k = npc.socialKey, s = SOCIAL[k]; if (!s) return null;
    { const hb = huntBark(npc); if (hb) return hb; }
    const st = standing(k);
    if (st <= -2.2) return `(${nm(k)} does not answer.)`;
    if (st <= -1) return pick(s.cold);
    if (st >= 1.5 && Math.random() < .6) return pick(s.warm);
    return null;
  }
  // Talking to someone who has gone cold: nobody answers.
  function dialogueGate(npc) {
    const k = npc.socialKey; if (!k || k === 'primo') return null;
    if (helpBleeding(npc)) return 'handled';
    const give = returnTo(k);
    if (give) { offer(UP(k), '', [[`Give back the ${({ photo: 'photograph', keys: 'keys', earplugs: 'earplugs' })[give]}.`, () => { S.carried.delete(give); const B = S.belong[give]; B.state = 'returned'; gesture(give + '-return'); G.line(`${UP(k)}: ${give === 'photo' ? '(He takes it without looking at it and puts it inside his jacket.)' : '(A look you cannot read.) Where were they.'}`); }], ['Say nothing about it.', () => {}]]); return 'handled'; }
    if (standing(k) <= -2.2 && npc.talkedOnce) return pick([`(${nm(k)} does not answer. ${pick(['They keep eating.', 'They look past you.', 'They get up and go to the sink.'])})`, `(You ask. ${nm(k)} turns to say something to somebody else.)`]);
    return null;
  }
  function onDialogueChoice(npc) { const k = npc.socialKey; if (!k) return; S.gestures += .5; witnesses(playerPos(), { speech: true }).forEach(w => { if (w !== k && SOCIAL[w]?.loyalty > .8 && standing(k) < 0) affect(w, { g: .15 }); }); }

  // ---- confidences: what people told Tobia, and who heard them tell it ---------------
  function watchFlags() {
    const F = G.flags;
    const conf = [['remo-confessed', 'franco', 'aurelio'], ['sergio-truth', 'sergio', 'report'], ['pino-told-go', 'pino', 'road']];
    for (const [flag, from, topic] of conf) if (F.has(flag) && !S.flagsSeen.has(flag)) {
      S.flagsSeen.add(flag); const heard = witnesses(playerPos(), { speech: true }).filter(k => k !== from);
      S.confid[topic] = { from, heard, t: now() };
      heard.forEach(k => { if (SOCIAL[k]?.loyalty > .7) { conflict(k, from, `${nm(from)} told you about ${topic === 'aurelio' ? 'Don Aurelio' : 'the vents'}`); affect(k, { g: .4 }, `${nm(k)} overheard ${nm(from)} confide in you.`); } });
    }
  }

  // ---- the end: it emerges --------------------------------------------------------------
  function computeEnding() {
    if (S.ending) return S.ending;
    const ps = keys.filter(k => k !== 'primo');
    const avg = ps.reduce((a, k) => a + standing(k), 0) / ps.length, hostile = ps.filter(k => standing(k) <= -1).length;
    const protector = ps.find(k => standing(k) >= 2);
    const conflictN = Object.values(S.between).reduce((a, b) => a + b, 0);
    const keysHeld = S.carried.has('keys') || G.flags.has('pino-left-alive');
    const left = S.promised && !G.flags.has('took-' + S.promised) ? S.promised : (ps.find(k => standing(k) >= 2.2 && SOCIAL[k].care > .5) || null);
    const entangle = S.gestures + S.answers * .8;
    const L = [];
    const causes = (filter) => ps.flatMap(k => S.rel[k].causes.filter(filter || (() => true)).map(c => ({ ...c, k }))).sort((a, b) => b.w - a.w);
    let E;
    if ((avg <= -.8 && hostile >= 5 && !protector) || S.placeDenied && hostile >= 4) {
      L.push(...causes().slice(0, 5).map(c => c.text)); if (S.placeDenied) L.push('By the last dinner there was no place set for you. Nobody had decided it out loud.'); if (S.refused) L.push(`You did not come to the table ${S.refused === 1 ? 'once' : S.refused + ' times'}.`);
      E = { id: 'exclusion', title: 'The Exclusion', small: 'ENDING · THE EXCLUSION', copy: 'Sunday came. Pino and Walter brought the cars round to the lane and everybody got in. Walter counted the seats twice, out loud, and both times the number came out one short. Nobody needed to raise a hand to you. The cars simply left, and the fog closed behind the tail-lights, and the porch lamp went out on a timer nobody had set.', voice: 'Nobody hunted you. Nobody had to.', choice: 'preserve', finale: [[1.2, 'Voice: Sunday. The cars on the lane, engines running.'], [8.5, 'Walter: That is everyone.'], [14.5, 'Tobia: I am on the porch. I am standing right here.'], [20.5, 'Tobia: The tail-lights go. The lamp goes out.']] };
    } else if (conflictN >= 3) {
      const cs = S.conflicts.slice(-5).map(c => `${nm(c.a)} turned against ${c.b === 'tobia' ? 'you' : nm(c.b)}: ${c.why}.`); L.push(...cs);
      E = { id: 'disintegration', title: 'The Disintegration', small: 'ENDING · THE DISINTEGRATION', copy: 'It did not end in the cellar. It ended in the kitchen, the yard, the lane: people who had shared a table for years stopped speaking, then stopped sleeping in the same house. Franco left at night. Dario locked himself in with the record. Somebody hurt somebody in the barn and nobody would say who. You watched it come apart along the lines you had drawn without knowing you were drawing them.', voice: 'You did not break them. You only repeated things.', choice: 'expose' };
    } else if (keysHeld && left) {
      L.push(`You had ${S.carried.has('keys') ? 'Walter’s keys' : 'a seat in Pino’s van'}.`, `${nm(left)} ${S.promised === left ? 'had asked you to take them, and you had said yes' : 'trusted you more than anyone in the house'}.`, ...causes().slice(0, 3).map(c => c.text));
      E = { id: 'abandonment', title: 'The Abandonment', small: 'ENDING · THE ABANDONMENT', copy: `You drove before dawn and did not look back, the way Pino said. You were three villages away before you thought of ${nm(left)}. You told yourself there had not been room. There had been room. Later you would read that the farmhouse had been found empty, except for one person, and the name was ${nm(left)}.`, voice: 'You survived. Someone paid for the seat.', choice: 'preserve' };
    } else if (entangle < 6) {
      L.push('You touched almost nothing. You answered almost nothing.', ...S.truths.slice(0, 4));
      E = { id: 'departure', title: 'The Departure', small: 'ENDING · THE DEPARTURE', copy: 'The fog lifted for an hour on the Monday and you walked down the lane to the provinciale, and a bus came, and you got on it. You never understood what had happened in the house, or whether anything had. Il Professore was on the porch when you left. He raised his hand, not to wave: to keep the light out of his eyes.', voice: 'An escape is not a victory. He is still there.', choice: 'preserve' };
    } else {
      L.push(...causes().slice(0, 3).map(c => c.text), ...S.truths.slice(-4));
      if (!L.length) L.push('Nothing you did was decisive. Everything you did was noticed.', 'Il Professore arranged the table every evening, and then put his earplugs in.');
      E = { id: 'witness', title: 'The Witness', small: 'ENDING · THE WITNESS', copy: 'You stayed until the end. You saw every chair empty, one by one, and every reason, and you understood at last that Il Professore had not done anything. He had arranged who sat where, and when the bread was cut, and who was asked which question in front of whom. Then he put his earplugs in and waited. He obtained exactly what he wanted without once having to act.', voice: 'He did not need a monster. He had people.', choice: 'fill' };
    }
    if (S.heardTold.some(h => h.worse)) L.push('Somebody had been telling your story differently. You heard part of it once, by the stove.');
    E.ledger = [...new Set(L)].slice(0, 8);
    S.ending = E; return E;
  }


  // ===================================================================================
  // v22 — THEY DECIDE. When someone has enough reasons, they stop waiting for a kitchen.
  // They keep their face at the table for a while; then their chair is empty. They hide in
  // the rooms you go into, follow you through doors, move only when you are not looking,
  // and use what is in their hands. The blood in your nose makes them hard to see.
  // ===================================================================================
  const WEAPON = { franco: ['stab', 'the cleaver'], marta: ['stab', 'her burin'], gabri: ['stab', 'the bread knife'], anna: ['stab', 'the long kitchen knife'], dario: ['choke', 'a rosary cord'], sergio: ['choke', 'his belt'], livia: ['choke', 'a cushion'], walter: ['van', 'the van'], pino: ['van', 'the van'], ines: ['bleed', 'the white cloth she is always folding'] };
  const HUNT = () => [Infinity, 4.4, 3.6, 2.9][G.difficulty()] ?? 3.6;
  const MAXH = () => [0, 1, 2, 3][G.difficulty()] ?? 2;
  const H = { list: [], checkT: 8, watchT: 70, lureT: 150, lure: null, van: null, borrowed: new Set(), cueT: 0, bloodLost: 0, heavy: false, denied: false };
  S.hunt = H;
  const zoneOf = (name) => G.zones()[name];
  function hunting(k) { return H.list.find(h => h.k === k); }
  function startHunt(k, why = '') {
    if (hunting(k) || G.difficulty() === 0 || !WEAPON[k] || H.list.length >= MAXH()) return null;
    const p = who(k) || G.people().find(x => x.key === k); if (!p) return null;
    const [method, tool] = WEAPON[k];
    const h = { k, npc: p.npc, method, tool, state: 'mask', where: 'home', t: 0, maskT: 40 + Math.random() * 50, seenT: 0, faced: 0, cd: 0, why };
    keepHome(p.npc); H.list.push(h); S.plotAt = Math.min(S.plotAt || 1e9, now() + 25);
    S.truths.push(`${nm(k)} decided you had to disappear${why ? ': ' + why : ''}.`);
    return h;
  }
  function endHunt(h, note) { H.list = H.list.filter(x => x !== h); h.npc.hunting = false; returnHome(h.npc); dropEntry(h); if (note) S.truths.push(note); }
  function keepHome(n) { if (!n._home) n._home = { x: n.object.position.x, z: n.object.position.z, y: n.object.position.y, r: n.object.rotation.y, seated: !!n.seated, parent: n.object.parent }; }
  function returnHome(n) { const h = n._home; if (!h) return; if (n.object.parent !== h.parent) { n.object.parent?.remove(n.object); h.parent.add(n.object); } n.object.position.set(h.x, h.y, h.z); n.object.rotation.y = h.r; n.seated = h.seated; n.walking = false; n.object.visible = true; n.borrowed = false; H.borrowed.delete(n); }
  function borrow(n, zoneName, x, z, yaw) { keepHome(n); const zg = zoneOf(zoneName).group; if (n.object.parent !== zg) { n.object.parent?.remove(n.object); zg.add(n.object); } n.object.position.set(x, 0, z); n.object.rotation.y = yaw; n.seated = false; n.posed = false; n.walking = false; n.object.visible = true; n.borrowed = true; H.borrowed.add(n); }
  function offstage(h) { h.where = null; h.state = 'away'; h.npc.object.visible = false; h.npc.walking = false; dropEntry(h); }
  function solidAt(Z, x, z, m = .3) { return Z.solids.some(o => x + m > o.minX && x - m < o.maxX && z + m > o.minZ && z - m < o.maxZ); }
  function los(Z, a, b) { for (let i = 1; i < 10; i++) { const x = a.x + (b.x - a.x) * i / 10, z = a.z + (b.z - a.z) * i / 10; if (solidAt(Z, x, z, 0)) return false; } return true; }
  // A place to wait: out of the line of sight from where you came in, near something to stand behind.
  function hidingSpot(Z, from, near = [7, 15]) {
    const b = Z.bounds; let best = null, bs = -1e9;
    for (let i = 0; i < 60; i++) {
      const x = b.minX + 1 + Math.random() * (b.maxX - b.minX - 2), z = b.minZ + 1 + Math.random() * (b.maxZ - b.minZ - 2);
      if (solidAt(Z, x, z, .45)) continue;
      const d = Math.hypot(x - from.x, z - from.z); if (d < 4) continue;
      let sc = -Math.abs(d - (near[0] + near[1]) / 2) * .4; if (!los(Z, from, { x, z })) sc += 5; if (solidAt(Z, x, z, 1.1)) sc += 2;
      if (sc > bs) { bs = sc; best = { x, z }; }
    }
    return best;
  }
  // Can Tobia actually see them? Distance, the cone of his eyes, walls, the torch, and the blood.
  function visRange() { return (G.flashlight() ? 13 : 7.5) * (1 - .6 * B.distort) * (B.wipe > 0 ? 0 : 1); }
  function sees(h) {
    const Z = zoneOf(G.zone()), o = h.npc.object.position, p = playerPos(), d = Math.hypot(o.x - p.x, o.z - p.z);
    if (d > visRange()) return false;
    G.camera.getWorldDirection(tmp2); const dot = (tmp2.x * (o.x - p.x) + tmp2.z * (o.z - p.z)) / (Math.hypot(tmp2.x, tmp2.z) * (d || 1));
    if (dot < (d < 2 ? .35 : .72)) return false;
    return los(Z, p, o);
  }
  function addEntry(h) { if (h.entry) return; const Z = zoneOf(h.where); h.entry = { id: 'hunter-' + h.k, type: 'social', object: h.npc.object, point: h.npc.object.position, radius: 2.6, prompt: '[ E ] SPEAK — ' + UP(h.k), run: () => face(h, true) }; h.entryZone = Z; Z.interactables.push(h.entry); }
  function dropEntry(h) { if (!h.entry) return; const L = h.entryZone.interactables, i = L.indexOf(h.entry); if (i >= 0) L.splice(i, 1); h.entry = null; }
  // ---- where they are when you walk in ----
  function huntersOnEnter(name) {
    // bodies borrowed for a room you have left go back to the house
    if (H.watcher) H.watcher = null;
    for (const n of [...H.borrowed]) if (!H.list.some(h => h.npc === n && h.where === name)) { const h = H.list.find(x => x.npc === n); if (h) offstage(h); else returnHome(n); }
    if (name === 'home') { for (const h of H.list) if (h.state !== 'mask') { h.npc.object.visible = false; } }
    const lure = H.lure && H.lure.zone === name && now() < H.lure.until ? H.lure : null; if (lure) H.lure = null;
    for (const h of H.list) {
      if (h.state === 'mask') continue;
      const Z = zoneOf(name); if (!Z) continue;
      if (lure && lure.trap && lure.k === h.k) { ambush(h, name, lure); continue; }
      if (h.method === 'van' && name === 'road') { h.where = null; h.state = 'away'; h.vanAt = now() + 12 + Math.random() * 25; continue; }
      const p = playerPos(), chance = .5 + Math.min(.3, S.rel[h.k].grievance * .04) + (B.on ? .15 : 0);
      if (Math.random() < chance) { const sp = hidingSpot(Z, p); if (sp) { place(h, name, sp.x, sp.z, Math.random() * 6.28); h.state = 'hide'; continue; } }
      h.where = null; h.state = 'follow'; h.followAt = now() + 9 + Math.random() * 18; h.followZone = name;
    }
    if (lure && !lure.trap) friendWaits(lure, name);
  }
  function place(h, zone, x, z, yaw) { if (zone === 'home') { const n = h.npc; if (n.object.parent !== n._home.parent) returnHome(n); n.object.position.set(x, 0, z); n.object.rotation.y = yaw; n.seated = false; n.object.visible = true; } else borrow(h.npc, zone, x, z, yaw); h.where = zone; h.t = 0; h.seenT = 0; addEntry(h); }
  // They come in after you, through the same door.
  function follow(h) { const Z = zoneOf(G.zone()), sp = Z.spawn; place(h, G.zone(), sp.x + (Math.random() - .5), sp.z + (Math.random() - .5), 0); h.state = 'stalk'; G.audio()?.doorCreak?.(); if (Math.random() < .5) setTimeout(() => G.line(pick(['(Behind you, the door. Somebody else has come in.)', '(A latch. Footsteps that stop when yours stop.)'])), 400); }
  function ambush(h, zone, lure) {
    const Z = zoneOf(zone), sp = Z.spawn;
    if (h.method === 'van' && zone === 'road') { h.vanAt = now() + 3; h.state = 'away'; h.lured = lure; return; }
    place(h, zone, sp.x + (Math.random() - .5) * 2, sp.z + 2.2, Math.PI); h.state = 'stalk'; h.lured = lure; h.boldUntil = now() + 6;
  }
  // ---- per frame ----
  function updateHunters(dt) {
    if (G.difficulty() === 0) return;
    H.checkT -= dt;
    if (H.checkT <= 0) { H.checkT = 3; for (const k of keys) { if (k === 'ottavio' || hunting(k)) continue; if (score(k) >= HUNT()) startHunt(k, (S.rel[k].causes.slice(-1)[0]?.text || '').replace(/\.$/, '')); } }
    const act = G.canAct() || B.wipe > 0;
    for (const h of [...H.list]) {
      h.t += dt; h.cd = Math.max(0, h.cd - dt);
      if (h.state === 'mask') {
        // still at the table, still pleasant; then one evening the chair is empty
        if (G.zone() !== 'home') h.maskT -= dt * 2; else h.maskT -= dt;
        if (h.maskT <= 0 && !(G.zone() === 'home' && dist2({ npc: h.npc }) < 9)) { h.npc.hunting = true; if (G.zone() === 'home') { place(h, 'home', -9.0, -7.6, 0); h.state = 'hide'; } else offstage(h); }
        continue;
      }
      if (h.state === 'follow' && now() >= h.followAt) { if (G.zone() === h.followZone && act && G.zone() !== 'road' && !(h.method === 'van')) follow(h); else h.state = 'away'; }
      if (h.method === 'van' && G.zone() === 'road' && h.vanAt && now() >= h.vanAt && !H.van && act) { h.vanAt = 0; launchVan(h); }
      if (h.where !== G.zone() || !act) { if (h.npc.walking) h.npc.walking = false; continue; }
      const n = h.npc, o = n.object.position, p = playerPos(), d = Math.hypot(o.x - p.x, o.z - p.z), seen = sees(h);
      const others = G.zone() === 'home' ? present().filter(x => x.key !== h.k && !hunting(x.key) && dist2(x) < 6.5).length : 0;
      if (seen) { h.seenT += dt; n.walking = false; G.turn(n, p.x, p.z, dt, 2); if (h.state === 'stalk' && d < 3.2 && !h.faced) face(h, false); if (h.seenT > 6 && d > 5 && h.state !== 'hide') { reHide(h); } continue; }
      h.seenT = 0;
      if (d < 9) tense(dt * .012);
      if (h.state === 'hide' && (d < 5.5 || (h.t > 25 && Math.random() < dt * .05))) h.state = 'stalk';
      if (h.state === 'stalk' || h.state === 'faced') {
        if (others) { n.walking = false; continue; }  // nobody does it in front of the others
        const sp = (1.05 + Math.min(.6, S.rel[h.k].grievance * .05)) * (B.wipe > 0 ? 2.2 : 1) * (now() < (h.boldUntil || 0) ? 1.5 : 1);
        step(h, p.x, p.z, sp, dt);
        if (d < 2.7) { H.cueT -= dt; if (H.cueT <= 0) { H.cueT = 2.2; G.audio()?.footstep?.('wood', false, Math.random() < .5 ? -1 : 1); if (Math.random() < .4) G.audio()?.mechanicalNoise(.8, 380, .7, .03, 0); } }
        if (d < 1.0 && h.cd <= 0) { strike(h); return; }
      }
    }
    updateVan(dt); updateLures(dt); updateWatchers(dt); updateBleedOut(dt);
  }
  function step(h, tx, tz, sp, dt) {
    const Z = zoneOf(h.where), o = h.npc.object.position, dx = tx - o.x, dz = tz - o.z, d = Math.hypot(dx, dz) || 1, st = sp * dt;
    let nx = o.x + dx / d * st, nz = o.z + dz / d * st, moved = false;
    if (!solidAt(Z, nx, o.z, .25)) { o.x = nx; moved = true; } if (!solidAt(Z, o.x, nz, .25)) { o.z = nz; moved = true; }
    if (!moved) { const sx = o.x - dz / d * st, sz = o.z + dx / d * st; if (!solidAt(Z, sx, sz, .25)) { o.x = sx; o.z = sz; } }
    h.npc.walking = true; G.turn(h.npc, tx, tz, dt, 5);
  }
  function reHide(h) { const Z = zoneOf(h.where), sp = hidingSpot(Z, playerPos(), [9, 16]); if (!sp) return; h.state = 'hide'; h.t = 0; h.npc.walking = false; h.npc.object.position.set(sp.x, 0, sp.z); /* when you look back, they are somewhere else */ }
  // Face to face, they are ordinary. It is your move.
  function face(h, asked) {
    if (S.ui) return; h.faced = 1; h.state = 'faced';
    const n = h.npc, give = returnTo(h.k), cause = (S.rel[h.k].causes.slice().sort((a, b) => b.w - a.w)[0]) || { text: '' };
    const lie = { franco: 'Looking for the lamp oil. You?', marta: 'I came to look at the beams in here. The light is better.', gabri: 'I was just walking. Can’t I walk?', anna: 'Ines sent me to find you. Dinner.', dario: 'I was praying. You interrupted.', sergio: 'Thought I heard you. Wanted a smoke, that’s all.', livia: '(She hums the four notes and smiles.)', walter: 'Measuring. Somebody has to.', pino: 'Getting something from the van.', ines: 'There you are. You look pale. Come here.' }[h.k];
    G.lineNow(`${UP(h.k)}: ${lie}`);
    const opts = [];
    if (give) opts.push([`Give back the ${({ photo: 'photograph', keys: 'keys', earplugs: 'earplugs' })[give]}.`, () => { S.carried.delete(give); affect(h.k, { g: -3 }); endHunt(h, `You gave ${nm(h.k)} back the ${give}. ${nm(h.k)} went back to the table.`); G.line(`${UP(h.k)}: (A long look.) Go and eat something.`); }]);
    if (S.carried.has('knife')) opts.push(['(Let them see the knife.)', () => { affect(h.k, { f: 1.4 }); h.cd = 30; G.line(`(${nm(h.k)} sees it, and smiles, and steps back into the dark.)`); setTimeout(() => reHide(h), 1500); }]);
    opts.push(['“What are you really doing here?”', () => { G.line('TOBIA: What are you really doing here?'); setTimeout(() => { G.line(`${UP(h.k)}: ${Math.random() < .5 || !cause.text ? lie : cause.text}`); G.queueAction(() => offer(UP(h.k), '', [
      ['“I’m sorry.”', () => { if (SOCIAL[h.k].care >= .45 && S.rel[h.k].grievance < 7) { affect(h.k, { g: -3 }); endHunt(h, `You apologised to ${nm(h.k)} in time.`); G.line(`${UP(h.k)}: (Nothing for a long time.) Go back inside.`); } else { h.cd = 0; h.state = 'stalk'; h.boldUntil = now() + 4; } }],
      ['“That isn’t what happened.”', () => { if (/\(you had not\)/.test(cause.text) && SOCIAL[h.k].distorts < .55) { affect(h.k, { g: -3.5 }); endHunt(h, `You told ${nm(h.k)} the truth about a story somebody had told wrong. ${nm(h.k)} believed you.`); G.line(`${UP(h.k)}: …Then who told me.`); } else { h.state = 'stalk'; h.boldUntil = now() + 4; } }],
      ['(Back away.)', () => { h.state = 'stalk'; h.cd = 6; }]], { timeout: 10, onTimeout: () => { h.state = 'stalk'; h.boldUntil = now() + 5; }, leave: () => { h.state = 'stalk'; h.cd = 5; } })); }, 1300); }]);
    opts.push(['(Back away.)', () => { h.state = 'stalk'; h.cd = 6; }]);
    G.queueAction(() => offer(UP(h.k), '', opts, { timeout: 11, onTimeout: () => { h.state = 'stalk'; h.boldUntil = now() + 5; }, leave: () => { h.state = 'stalk'; h.cd = 4; } }));
    setTimeout(() => { h.faced = 0; }, 25000);
  }
  // ---- the deaths ----
  const DEATH = {
    stab: (k, tool) => `${nm(k)} came from behind with ${tool}. You heard them only when they were already close: the blood in your nose had been louder than their feet.`,
    choke: (k, tool) => `${nm(k)} put ${tool} around your throat from behind and leaned back with their whole weight, and talked to you quietly the whole time, the way you talk to an animal.`,
    van: (k) => `The van came out of the fog with its lights off. ${nm(k)} did not brake. Afterwards ${nm(k)} said it was the fog; nobody on the provinciale could see anything that night.`,
    bleed: (k) => `You bled out. Somebody had taken the tissues from your pocket, and when you asked, nobody had one. ${nm(k)} stepped over you to get to the sink.`
  };
  function strike(h, method = h.method) {
    G.audio()?.killSting?.(); G.glitch?.(2);
    // on foot, the drivers use their hands and Ines uses her cloth
    const m = method === 'van' || method === 'bleed' ? 'choke' : method, tool = method === 'van' ? 'their hands' : h.tool;
    die(h.k, m, tool, h.lured);
  }
  function die(k, method, tool, lured) {
    const r = S.rel[k], lines = [];
    if (lured) lines.push(`${nm(lured.from)} told you ${lured.what}. ${lured.from === k ? 'It was not true.' : `${nm(lured.from)} knew ${nm(k)} was waiting.`}`);
    lines.push(...r.causes.slice().sort((a, b) => b.w - a.w).slice(0, 5).map(c => c.text));
    lines.push(...S.truths.filter(t => /decided you had to disappear|took|tissues/.test(t)).slice(-3));
    if (B.distort > .3) lines.push('Your nose was bleeding. You did not see them until it was too late.');
    const empty = keys.filter(x => x !== k && standing(x) > 1.2);
    lines.push(empty.length ? `${empty.map(nm).join(', ')} would have stopped it. Nobody was near you.` : 'Nobody would have stopped it.');
    S.ending = { id: 'assassination', title: { stab: 'The Assassination', choke: 'The Assassination', van: 'The Road', bleed: 'The Blood' }[method] || 'The Assassination', small: 'ENDING · ' + ({ van: 'RUN DOWN', bleed: 'BLED OUT', choke: 'STRANGLED', stab: 'STABBED' }[method] || 'THE ASSASSINATION'), copy: (DEATH[method] || DEATH.stab)(k, tool) + ' Il Professore had his earplugs in. When they told him, he asked who had been with you, and wrote the name down.', voice: 'There was no monster. There was a reason, and nobody near you.', ledger: [...new Set(lines)].slice(0, 8) };
    G.end(S.ending, true);
  }
  // ---- the van ----
  function launchVan(h) {
    const Z = zoneOf('road'), p = playerPos(); G.camera.getWorldDirection(tmp2);
    const back = new THREE.Vector3(-tmp2.x, 0, -tmp2.z).normalize();
    const v = G.buildVan(Z.group); v.position.set(p.x + back.x * 46, 0, p.z + back.z * 46); v.traverse(o => { if (o.isSpotLight) o.intensity = 0; });
    H.van = { v, h, sp: 4, aim: new THREE.Vector3(p.x, 0, p.z), t: 0, passed: false };
    G.audio()?.mechanicalTone(55, 90, 6, 'sawtooth', .03, 0);
  }
  function updateVan(dt) {
    const V = H.van; if (!V) return;
    if (G.zone() !== 'road') { V.v.parent?.remove(V.v); H.van = null; return; }
    V.t += dt; const p = playerPos(), o = V.v.position;
    if (!V.passed) V.aim.lerp(new THREE.Vector3(p.x, 0, p.z), Math.min(1, dt * .9));
    V.sp = Math.min(19, V.sp + dt * 7);
    const dx = V.aim.x - o.x, dz = V.aim.z - o.z, d = Math.hypot(dx, dz) || 1;
    if (!V.dir) V.dir = new THREE.Vector3(dx / d, 0, dz / d);
    if (!V.passed) V.dir.lerp(new THREE.Vector3(dx / d, 0, dz / d), Math.min(1, dt * 1.6)).normalize();
    o.addScaledVector(V.dir, V.sp * dt); V.v.rotation.y = Math.atan2(V.dir.x, V.dir.z) + Math.PI;
    if (V.t > 1.2 && Math.random() < dt * 2) G.audio()?.mechanicalTone(70 + V.sp * 4, 60 + V.sp * 4, .4, 'sawtooth', .02 + Math.min(.05, 2 / Math.max(2, Math.hypot(p.x - o.x, p.z - o.z))), 0);
    const pd = Math.hypot(p.x - o.x, p.z - o.z);
    if (pd < 1.7 && !V.passed) { V.v.traverse(x => { if (x.isSpotLight) x.intensity = 90; }); die(V.h.k, 'van', V.h.tool, V.h.lured); return; }
    if (!V.passed && (V.dir.x * (p.x - o.x) + V.dir.z * (p.z - o.z)) < -1) { V.passed = true; G.line(pick(['(It goes past close enough to move your coat. The engine note does not change. No brake lights.)', '(Wind, metal, then the fog again. It did not stop.)'])); tense(.3); S.truths.push(`${nm(V.h.k)} drove at you on the road and missed.`); V.h.vanAt = now() + 90 + Math.random() * 60; }
    if (V.t > 14) { V.v.parent?.remove(V.v); H.van = null; }
  }
  // ---- lures: an errand that might be a trap, or might be a friend ----
  const PLACES = { cellar: 'the cellar', darkroom: 'the dark room', abattoir: 'the slaughterhouse', road: 'the road', church: 'the church', ruin: 'the empty house', forest: 'the canal' };
  function updateLures(dt) {
    if (G.zone() !== 'home' || S.ui || !G.canAct() || S.gather.active) return;
    H.lureT -= dt; if (H.lureT > 0) return; H.lureT = 120 + Math.random() * 90;
    const hs = H.list.filter(h => h.state !== 'away' || true);
    const trap = hs.length && Math.random() < .7;
    let from, k, zone;
    if (trap) { const h = pick(hs); k = h.k; zone = h.method === 'van' ? 'road' : pick(['cellar', 'darkroom', 'abattoir', 'church', 'ruin']); const allies = present().filter(p => p.key !== 'primo' && (p.key === k || S.between[p.key + '>tobia'] || standing(p.key) < -1)); from = allies.length ? pick(allies).key : null; if (!from) return; }
    else { const friends = present().filter(p => p.key !== 'primo' && standing(p.key) > .8 && !hunting(p.key)); if (!friends.length) return; from = pick(friends).key; zone = pick(['cellar', 'road', 'church']); }
    if (!zoneOf(zone)) return;
    const reason = pick(['Il Professore wants you', 'Sergio is waiting for you', 'Ines left something for you', 'Somebody is asking for you', 'Pino says the van is leaving from there']);
    const what = `${reason} in ${PLACES[zone]}`;
    G.lineNow(`${UP(from)}: ${reason} in ${PLACES[zone]}. ${pick(['Now.', 'Alone, he said.', 'Go on, before it gets dark.', 'I would go if I were you.'])}`);
    G.queueAction(() => offer(UP(from), '', [
      ['“All right.”', () => { H.lure = { zone, trap, k, from, what, until: now() + 140 }; }],
      ['“Who told you that?”', () => { G.line(`${UP(from)}: ${pick(['Does it matter?', 'He did. Who else.', '(A shrug.) I am only saying it.'])}`); H.lure = { zone, trap, k, from, what, until: now() + 140 }; }],
      ['“I’m staying here.”', () => { if (!trap) affect(from, { t: -.3 }); }]], { timeout: 12, onTimeout: () => {} }));
  }
  function friendWaits(lure, zone) {
    const f = lure.from; S.truths.push(`${nm(f)} really did send you to ${PLACES[zone]}, to warn you.`);
    const hs = H.list.map(h => nm(h.k));
    setTimeout(() => G.line(hs.length ? `(On the floor by the door, a folded napkin in ${nm(f)}’s handwriting:) ${hs[0]} is looking for you. Do not be alone.` : `(A tissue packet on the floor by the door, and nobody here. ${nm(f)} must have left it.)`), 1500);
    if (!hs.length) { B.tissues++; showPacket(3); }
  }
  // ---- watchers: people in the fog who may be nothing at all ----
  function updateWatchers(dt) {
    if (G.zone() === 'home' || !G.canAct()) return;
    H.watchT -= dt; if (H.watchT > 0 || H.watcher) { if (H.watcher) tickWatcher(dt); return; }
    H.watchT = 50 + Math.random() * 70;
    const cands = G.people().filter(p => p.key !== 'primo' && !hunting(p.key) && !p.npc.borrowed); if (!cands.length) return;
    const p = pick(cands), Z = zoneOf(G.zone()), sp = hidingSpot(Z, playerPos(), [12, 20]); if (!sp) return;
    const pp = playerPos(); borrow(p.npc, G.zone(), sp.x, sp.z, Math.atan2(pp.x - sp.x, pp.z - sp.z));
    H.watcher = { n: p.npc, t: 0 };
  }
  function tickWatcher(dt) {
    const W = H.watcher, o = W.n.object.position, p = playerPos(); W.t += dt; G.turn(W.n, p.x, p.z, dt, 1.5);
    if (Math.hypot(o.x - p.x, o.z - p.z) < 6.5 || W.t > 18) { W.n.object.visible = false; returnHome(W.n); H.watcher = null; }
  }
  // ---- no more tissues ----
  function updateBleedOut(dt) {
    const ines = hunting('ines');
    if (!H.denied && (ines || H.list.length >= 2) && B.tissues > 0 && B.wipe > 0 && B.wipeKind === 'tissue') {
      H.denied = true; S.truths.push(`${ines ? 'Ines' : 'Somebody'} took the tissues out of your coat while you were wiping your nose.`);
      setTimeout(() => { B.tissues = 0; showPacket(4); G.line('(Your pocket is empty. The packet was there a minute ago.)'); H.heavy = true; if (!B.on) startBleed(); B.dur = 9999; }, 4500);
    }
    if (H.heavy && B.on) {
      H.bloodLost += dt * B.level * .011;
      G.el('bleedout')?.style.setProperty('opacity', String(Math.min(.92, H.bloodLost * 1.1)));
      if (H.bloodLost > .5 && !H.warned) { H.warned = true; G.line(pick(['(It is not stopping. Your hands are cold.)', '(The room tilts when you turn your head.)'])); }
      if (H.bloodLost >= 1) die(ines ? 'ines' : (H.list[0]?.k || 'ines'), 'bleed');
    }
  }
  // Asking for help when it will not stop: only someone who still cares will give it.
  function helpBleeding(npc) {
    if (!H.heavy) return false; const k = npc.socialKey;
    if (hunting(k) || standing(k) < .3) { G.line(`(${nm(k)} looks at the blood, and at you, and turns back to the table.)`); return true; }
    H.heavy = false; B.dur = B.t + 6; B.tissues += 1; showPacket(3); G.el('bleedout')?.style.setProperty('opacity', '0'); H.bloodLost *= .6;
    G.line(`${UP(k)}: ${pick(['Head forward. Pinch here. Hold it. Hold it.', 'Here. Keep it. Do not let anyone see you have it.'])}`); affect(k, { t: .5 }); S.truths.push(`${nm(k)} stopped your bleeding when nobody else would.`);
    return true;
  }
  function huntBark(npc) { const h = hunting(npc.socialKey); if (h && h.state === 'mask') return pick(SOCIAL[h.k].warm); return null; }


  // ===================================================================================
  // v23 — CUTSCENES. A sequencer that waits for each line to be read and for each of
  // Tobia's answers before it moves on: nobody talks over anybody.
  // ===================================================================================
  function runScene(steps, { onEnd } = {}) {
    const sc = { steps, i: -1, mode: 'now', wait: 0, shot: null };
    const save = { pos: G.playerAnchor.position.clone(), rx: G.camera.rotation.x, ry: G.camera.rotation.y, fov: G.camera.fov };
    const next = () => {
      sc.i++; const st = sc.steps[sc.i];
      if (!st) { G.endScene(); G.fov(save.fov); onEnd?.(save); return; }
      if (st.shot) sc.shot = st.shot;
      if (st.say) { G.line(st.say); sc.mode = 'say'; }
      else if (st.choose) { sc.mode = 'say'; G.queueAction(() => offer('TOBIA', st.line || '', st.choose.map(([label, fn]) => [label, () => fn?.(sc)]), { timeout: 18, onTimeout: () => st.silence?.(sc) })); }
      else if (st.wait) { sc.mode = 'wait'; sc.until = performance.now() + st.wait * 1000; }
      else { st.do?.(sc); sc.mode = 'now'; }
    };
    G.scene({ update(s, dt) {
      const sh = sc.shot; if (sh) { const pos = typeof sh.pos === 'function' ? sh.pos() : sh.pos; G.playerAnchor.position.set(pos.x, 0, pos.z); G.camera.position.set(0, pos.y, 0); const look = typeof sh.look === 'function' ? sh.look() : sh.look; if (look) G.aim(look, Math.min(1, dt * (sh.speed || 2.2))); if (sh.fov) G.fov(THREE.MathUtils.lerp(G.camera.fov, sh.fov, Math.min(1, dt * 1.5))); }
      if (sc.mode === 'now') next();
      else if (sc.mode === 'wait') { if (performance.now() >= sc.until) next(); }
      else if (sc.mode === 'say' && !G.linesBusy() && !S.ui) next();
    } });
    return sc;
  }
  // A shot of someone speaking: the camera in front of them, at their eye level, a little off-axis.
  const npcOf = (k) => k === 'primo' ? G.firstNpc() : who(k)?.npc;
  const faceShot = (k, dist = 1.55, fov = 44) => {
    let fixed = null;
    const pos = () => { if (fixed) return fixed; const n = npcOf(k); if (!n) return G.playerAnchor.position.clone().setY(1.2); const o = n.object.getWorldPosition(new THREE.Vector3()), yaw = n.object.rotation.y, side = (k.length % 2 ? 1 : -1) * .35;
      fixed = new THREE.Vector3(o.x + Math.sin(yaw + side) * dist, n.seated ? 1.2 : 1.55, o.z + Math.cos(yaw + side) * dist); return fixed; };
    return { pos, look: headOf(k), fov, speed: 5 };
  };
  const headOf = (k) => () => { const p = k === 'primo' ? (G.firstNpc() && { npc: G.firstNpc() }) : who(k); if (!p) return null; const v = p.npc.object.getWorldPosition(new THREE.Vector3()); v.y += p.npc.seated ? 1.15 : 1.6; return v; };
  const INTRO = {
    walter: 'Walter. I measure. This house is exactly the size Il Bianco needs: thirteen. Fourteen, now.',
    franco: 'Franco. I cut meat. Thirty years, and I never heard a cow go as quiet as Aurelio went.',
    anna: 'Anna. I cook. My husband was full before any of them. I still fill his bowl, so Il Bianco has somewhere else to go.',
    marta: 'Marta. I carve their names into the beams when they are taken. There is a beam with a fresh cut. I do not remember making it.',
    dario: 'Dario. I keep the prayers. Il Bianco is not dying. It is being completed.',
    sergio: 'Sergio. I have opinions. My opinion is that Il Bianco is carbon monoxide and a priest with a good voice.',
    livia: '(Livia. She hums four notes and stops on the fifth, where there is only breath. That is Il Bianco, her eyes say.)',
    ines: 'Ines. I was a nurse. When Il Bianco comes for one of us, I sit with them. Nobody here fills alone.',
    gabri: 'Gabri. (He does not look up.) They say when it fills you, you finally feel seen.',
    pino: 'Pino. I drive. On the road you can outrun Il Bianco. In here you sit and wait for it.',
    ottavio: '(Ottavio. He cannot hear. He lays his palm on the table, as if Il Bianco might come up through the wood.)'
  };
  function introScene() {
    if (S.introDone || !G.seats() || !G.firstNpc()) return false;
    S.introDone = true; buildWorld();
    const mine = S.seats.find(x => x.mine), T = G.seats(), V = (x, y, z) => new THREE.Vector3(x, y, z);
    const seatEye = V(mine.x, 1.12, mine.z), center = V(T.top[0], 1.0, T.top[1]);
    const order = ['walter', 'franco', 'anna', 'marta', 'dario', 'sergio', 'livia', 'ines', 'gabri', 'pino', 'ottavio'].filter(k => who(k));
    const steps = [
      { shot: { pos: V(-3.9, 1.62, 5.7), look: center, fov: 60 }, say: 'IL PROFESSORE: Everyone. This is Tobia. The fog has closed the road; he eats with us tonight.' },
      { say: 'IL PROFESSORE: Sit there, Tobia. At the end. Ines set your place before you knocked.' },
      { do: () => { seatAt(mine); }, shot: { pos: seatEye, look: V(T.top[0], 1.05, T.top[1] - 2.2), fov: 62 } },
      { say: 'IL PROFESSORE: Say your names. Say them the way you say them here.' },
      ...order.map(k => ({ shot: faceShot(k), say: (INTRO[k].startsWith('(') ? '' : UP(k) + ': ') + INTRO[k] })),
      { shot: faceShot('primo', 1.9, 46), say: 'IL PROFESSORE: You hear it in all of them. Thirteen chairs, and a fourteenth place. We are here for one thing. Il Bianco.' },
      { shot: { pos: seatEye, look: headOf('primo'), fov: 60 }, choose: [['“What is Il Bianco?”', () => G.line('TOBIA: What is Il Bianco?')], ['“I only came because of the fog.”', () => { G.line('TOBIA: I only came because of the fog.'); G.line('IL PROFESSORE: Everyone comes because of the fog.'); }], ['(Say nothing.)', () => G.line('(You say nothing. Il Professore waits as if you had asked.)')]], silence: () => G.line('(You say nothing. Il Professore waits as if you had asked.)') },
      { shot: faceShot('dario'), say: 'DARIO: The White. The sound under every sound. Switch everything off — the fridge, the rain, your own blood — and listen. It is there.' },
      { shot: faceShot('ines', 1.7), say: 'INES: It comes in through the ears. The mouth. The nose. It fills you the way water fills a bottle. Slowly, and then all at once.' },
      { shot: faceShot('marta'), say: 'MARTA: Aurelio was the first. He listened until there was no room left in him. We found him at this table, smiling. Full.' },
      { shot: { pos: seatEye, look: headOf('marta'), fov: 58 }, choose: [['“Full… you mean he died.”', () => G.line('TOBIA: Full. You mean he died.')], ['“That’s an illness, not a god.”', (sc) => { G.line('TOBIA: That’s an illness, not a god.'); sc.steps.splice(sc.i + 1, 0, { shot: faceShot('sergio'), say: 'SERGIO: He’s not wrong, you know.' }, { shot: faceShot('dario'), say: '(Dario looks at Sergio for a long time. Then at you.)' }); affect('sergio', { t: .6 }); affect('dario', { g: .5 }, 'At your first dinner you called Il Bianco an illness, in front of Dario.'); }], ['(Say nothing.)', () => {}]] },
      { shot: faceShot('primo', 1.8, 44), say: 'IL PROFESSORE: I mean finished. Nothing left to want, nothing left to hear. Every chair at this table is waiting to be filled. That is what the table is for.' },
      { say: 'IL PROFESSORE: (He holds up a pair of orange earplugs.) I wear these so it fills me slowly. Someone has to be last. Someone has to watch everyone else fill.' },
      { shot: { pos: seatEye, look: headOf('dario'), fov: 40 }, say: 'DARIO: (To you, quietly.) When it starts in someone, it has to come out somewhere. Usually the nose.' },
      { shot: { pos: seatEye, look: headOf('dario'), fov: 52 }, choose: [['“I get nosebleeds.”', () => { G.line('TOBIA: I get nosebleeds.'); S.rel.dario.marked = true; G.line('(Nobody says anything. Ines passes you the bread. Dario smiles for the first time.)'); }], ['“It won’t start in me.”', () => { G.line('TOBIA: It won’t start in me.'); G.line('DARIO: It always says that, at the beginning.'); }], ['(Say nothing.)', () => {}]] },
      { shot: { pos: seatEye, look: V(T.top[0], .85, T.top[1] + 1.4), fov: 62 }, say: 'IL PROFESSORE: Eat. It is still warm. Afterwards the guitar is on the table, if you want to make yourself useful.' },
      { do: () => { G.flags.add('bianco-told'); G.journal({ id: 'il-bianco', title: 'Il Bianco', description: 'The White. They say it is the sound under every sound. It comes in through the ears, the mouth, the nose, and fills a person the way water fills a bottle, slowly and then all at once. When there is no room left, the person stops. They call it being full, or finished. Aurelio was the first: they found him at the table, smiling. The whole house is built around waiting for it. Il Professore wears orange earplugs so that it fills him slowly; he wants to be the last, and to watch. Dario says that when it starts in someone, it comes out through the nose.', kind: 'the house', zone: 'home' }); S.plotAt = now() + 240; } }
    ];
    runScene(steps, { onEnd: () => { G.camera.rotation.z = 0; G.resetLook(); } });
    return true;
  }
  function seatAt(seat) { S.seated = seat; seat.entry.prompt = '[ E ] STAND UP'; G.playerAnchor.position.set(seat.x - seat.face[0] * .08, 0, seat.z - seat.face[1] * .08); }

  // The Last Supper: you come in and they are arranged along one side of the table, leaning to
  // each other in threes, Il Professore at the centre. Then every head turns to you at once.
  const WHISPER = ['(whispers) …when he is full…', '(whispers) …Sunday. After the record…', '(whispers) …he bleeds already. You saw it at dinner…', '(whispers) …fourteen chairs. There were always going to be fourteen…', '(whispers) …who sits with him at the end…', '(whispers) …not in the house. Somewhere he will not be missed…'];
  function plotScene() {
    S.plotN = (S.plotN || 0) + 1; S.plotAt = now() + 420;
    const T = G.seats(), V = (x, y, z) => new THREE.Vector3(x, y, z), cz = T.top[1], cx = T.top[0];
    const primo = G.firstNpc(); const ps = present().filter(p => p.key !== 'primo').sort((a, b) => posOf(a).z - posOf(b).z);
    const all = [...ps.map(p => p.npc), ...(primo ? [primo] : [])];
    const saved = all.map(n => ({ n, pos: n.object.position.clone(), r: n.object.rotation.y, seated: n.seated, posed: n.posed, raise: n.raiseK || 0 }));
    const hunters = H.list.filter(h => h.state === 'mask').map(h => nm(h.k));
    const lines = [pick(WHISPER), pick(WHISPER), hunters.length ? `(${hunters[0]} leans to Il Professore’s ear. He does not answer. He only nods at the bread.)` : pick(WHISPER)];
    const arrange = () => {
      const half = Math.ceil(ps.length / 2), left = ps.slice(0, half), right = ps.slice(half);
      const slot = (n, z) => { n.object.position.set(cx - 1.18, 0, z); n.object.rotation.y = Math.PI / 2; n.seated = false; n.posed = false; n.walking = false; };
      left.forEach((p, i) => slot(p.npc, cz - .5 - (left.length - 1 - i) * .55));
      right.forEach((p, i) => slot(p.npc, cz + .5 + i * .55));
      if (primo) { slot(primo, cz); primo.raiseK = .22; primo.lookAt = V(cx, .8, cz); }
      // threes, leaning in to one another, one of each three with a hand raised
      const groups = []; for (let i = 0; i < left.length; i += 3) groups.push(left.slice(i, i + 3)); for (let i = 0; i < right.length; i += 3) groups.push(right.slice(i, i + 3));
      groups.forEach(g => { const mid = g[Math.floor(g.length / 2)]; g.forEach((p, i) => { p.npc.lookAt = i === Math.floor(g.length / 2) ? (g[0] !== p ? posOf(g[0]).setY(1.55) : V(cx, 1.4, cz)) : posOf(mid).setY(1.58); if (i === 0 && g.length > 1) p.npc.raiseK = .35; }); });
    };
    const restore = () => { saved.forEach(o => { o.n.object.position.copy(o.pos); o.n.object.rotation.y = o.r; o.n.seated = o.seated; o.n.posed = o.posed; o.n.raiseK = o.raise; o.n.lookAt = null; }); };
    const shot = { pos: V(cx + 3.3, 1.42, cz), look: V(cx - 1.0, 1.22, cz), fov: 64, speed: 6 };
    const steps = [
      { do: () => G.fade(true, .45) }, { wait: .6 },
      { do: () => { arrange(); G.fade(false, .9); for (let i = 0; i < 5; i++) setTimeout(() => G.audio()?.whisper?.(1.6, (Math.random() - .5) * 1.4), i * 700); }, shot },
      { wait: 1.2 }, { say: lines[0] }, { say: lines[1] }, { say: lines[2] },
      { do: () => { all.forEach(n => { n.lookAt = null; n.raiseK = 0; }); S.allLookUntil = now() + 9; G.audio()?.mechanicalNoise(.3, 240, .8, .05, 0); tense(.25); } },
      { say: '(The floor creaks under you. Every head at the table turns at the same moment.)' }, { wait: 1.6 },
      { say: 'IL PROFESSORE: Tobia. Sit with us. We were talking about the weather.' },
      { do: () => G.fade(true, .45) }, { wait: .6 },
      { do: () => { restore(); G.fade(false, .8); } }
    ];
    S.truths.push('One evening you walked in on them arranged along one side of the table, whispering. They said they were talking about the weather.');
    runScene(steps, { onEnd: (save) => { G.playerAnchor.position.copy(save.pos); G.camera.position.set(0, 1.63, 0); G.camera.rotation.set(save.rx, save.ry, 0); G.resetLook(); } });
  }

  // ---- per frame ---------------------------------------------------------------------
  function update(dt) {
    if (!S.built && G.home() && G.seats()) buildWorld();
    watchFlags();
    // rumours travel whether or not Tobia is in the room
    for (const r of S.rumours) if (!r.dead && !r.done && now() >= r.at) { r.done = true; tellRumour(r); }
    S.rumours = S.rumours.filter(r => !r.done && !r.dead);
    updateUI(dt); updateBleed(dt); updateKitchen(dt); updateHunters(dt);
    if (S.seated) { G.camera.position.y = 1.12; if (G.zone() !== 'home') S.seated = null; }
    // tension: hostile eyes, the room, the body
    if (G.zone() === 'home' && G.canAct()) {
      let stare = 0; for (const p of present()) { if (p.key === 'primo') continue; if (standing(p.key) <= -1 && dist2(p) < 6) stare++; }
      S.tension = clamp(S.tension + dt * (stare * .006 + (S.seated?.aurelio ? .004 : 0)) - dt * .007, 0, 1.2);
      if (S.gather.active) { const A = S.gather.active; if (!G.linesBusy() && !S.ui) A.t += dt; if (S.seated) A.sat = true; while (A.beats.length && A.beats[0].at <= A.t) A.beats.shift().fn(); }
      else if (G.welcomed() && !S.kitchen.scene) { S.gather.cd -= dt; if (S.gather.cd <= 0 && !S.ui) { S.gather.cd = 210; gatherStart(); } }
      if (S.approach) {
        // someone is suddenly close when the tissue comes down; they say nothing, and go back
        const a = S.approach, n = a.p.npc; a.t += dt;
        if (!a.stage) { const pp = playerPos(), o = n.object.position, d = Math.hypot(pp.x - o.x, pp.z - o.z); if (d < 1.25 || a.t > 6) { a.stage = 1; a.t = 0; n.walking = false; } else G.walk(n, pp.x + (o.x - pp.x) / d * 1.1, pp.z + (o.z - pp.z) / d * 1.1, 1.3, dt); }
        else if (a.stage === 1) { const pp = playerPos(); G.turn(n, pp.x, pp.z, dt); if (a.t > 4) a.stage = 2; }
        else if (G.walk(n, a.from.x, a.from.z, 1.0, dt)) S.approach = null;
      }
      if (S.frameAt && !S.framed && now() > S.frameAt && !S.seated && !inKitchen()) frame();
      if (S.plotAt && now() > S.plotAt && (S.plotN || 0) < 3 && !S.gather.active && !S.kitchen.scene && !S.ui && !S.seated && !G.linesBusy() && present().length >= 6) plotScene();
    } else S.tension = clamp(S.tension - dt * .004, 0, 1.2);
    S.tension = clamp(S.tension + dt * Math.max(0, G.fear() - .45) * .02, 0, 1.2);
  }
  function onKey(code) {
    if (S.ui && /^Digit[1-5]$/.test(code)) { choose(Number(code.slice(-1)) - 1); return true; }
    if (code === 'KeyT') { wipe('tissue'); return true; }
    if (code === 'KeyV') { wipe('sleeve'); return true; }
    if (S.seated && (code === 'KeyE' || code === 'KeyW' || code === 'KeyS' || code === 'ArrowUp' || code === 'ArrowDown')) { stand(); return code === 'KeyE'; }
    return false;
  }

  return {
    S, update, onKey, onEnterZone, doorGate, gazeFor, barkFor, dialogueGate, onDialogueChoice, primoAside, computeEnding, standing, tense,
    get seated() { return S.seated; }, get busy() { return B.wipe > 0; }, get distort() { return B.distort; },
    // test hooks
    introScene, _plot: () => plotScene(), _startHunt: (k) => startHunt(k, 'test'), _face: (k) => face(hunting(k), true), _launchVan: (k) => launchVan(hunting(k)), _hunt: H, _canAct: () => G.canAct(), _gesture: gesture, _ask: ask, _startBleed: startBleed, _arrangeKitchen: arrangeKitchen, _gather: gatherStart, _affect: affect, _score: score
  };
}
