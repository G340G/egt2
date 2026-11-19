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
import { SOCIAL } from './people.js';

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
    bleed: { on: false, level: 0, distort: 0, t: 0, dur: 0, cd: 25, tissues: 4, stain: 0, wipe: 0, wipeDur: 0, wipeKind: null, seen: new Set(), drip: 0, breath: 0, hand: 0, told: false, offerCd: 0 },
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
    G.lineNow(`${UP(asker)}: ${def.q}`);
    setTimeout(() => offer(UP(asker), '', def.opts.map(([label, kind, said]) => [label, () => resolve(kind, said)]), { timeout: 9, onTimeout: () => resolve('silence'), leave: () => resolve('leave') }), 900);
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
  function tense(v) { S.tension = clamp(S.tension + v, 0, 1.2); }
  const B = S.bleed;
  function startBleed() {
    B.on = true; B.t = 0; B.dur = 48 + Math.random() * 30; B.level = Math.max(B.level, .05); B.hand = 1; B.seen = new Set(); B.offered = false;
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
      if (ending && B.level <= .01) { B.on = false; B.cd = 30; G.el('tissues')?.classList.remove('visible'); }
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
    if (!B.on) { B.cd -= dt; if (B.cd <= 0 && S.tension > .5 && G.canAct() && (G.zone() === 'home' || S.tension > .8)) startBleed(); }
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
    ], { timeout: 7, onTimeout: () => affect('ines', { t: -.2 }), speaker: 'Ines' });
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
    add(58, () => { S.gather.active = null; if (S.placeDenied && S.place) { /* the place stays gone */ } });
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
    return list.length ? pick(list) : () => G.line(pick(['ANNA: More bread. Who wants more.', 'PINO: Fog on the provinciale again. Nobody is going anywhere.']));
  }
  // Somebody is humiliated in public. Defending them, laughing, or looking at your plate are all things you did.
  function humiliation(agg, vic, line, reply) {
    (S.didHumil = S.didHumil || new Set()).add(agg);
    G.lineNow(line); setTimeout(() => G.line(reply), 2600);
    setTimeout(() => offer('', '', [
      [`“Leave ${nm(vic)} alone.”`, () => { G.line(`TOBIA: Leave ${nm(vic)} alone.`); const seen = present().map(p => p.key); affect(vic, { t: 1.4 }); affect(agg, { g: 1.2 }, `You defended ${nm(vic)} against ${nm(agg)} at the table.`); S.primoNotes.push('defend'); seen.forEach(k => { if (k !== agg && k !== vic && SOCIAL[k]?.protects?.includes(vic)) affect(k, { t: .5 }); }); }],
      ['Laugh.', () => { G.line('(You laugh. Two others laugh with you, a beat late.)'); affect(agg, { t: .6 }); affect(vic, { g: 1.2 }, `You laughed when ${nm(agg)} humiliated ${nm(vic)}.`); }],
      ['(Look at your plate.)', () => { affect(vic, { t: -.5 }); }]
    ], { timeout: 7, onTimeout: () => { affect(vic, { t: -.6 }); S.truths.push(`You said nothing when ${nm(agg)} humiliated ${nm(vic)}.`); } }), 4400);
  }
  function cigarette() {
    S.cigOffered = true;
    G.line('SERGIO: (He holds the pack out to you across the table.) Go on.');
    setTimeout(() => G.line('(Dario watches your hand. His face does something you cannot read.)'), 1800);
    setTimeout(() => offer('SERGIO', '', [['Take one.', () => { affect('sergio', { t: .8 }); affect('dario', { g: .5 }, 'You took a cigarette from Sergio in front of Dario.'); conflict('dario', 'sergio', 'Sergio offered you a cigarette'); }], ['“No, thanks.”', () => { affect('sergio', { t: -.2 }); affect('dario', { t: .2 }); }]], { timeout: 7, onTimeout: () => affect('sergio', { t: -.3 }) }), 2600);
  }
  // Helping is inconvenient: while you carry the pot, Sergio says the important thing.
  function helpRequest() {
    S.helped = true;
    G.line('INES: Tobia. The pot. I cannot lift it alone.');
    setTimeout(() => offer('INES', '', [['Go and help her.', () => { affect('ines', { t: 1 }); S.gestures++; G.line('(You carry the pot. By the time you are back, Sergio is finishing something.) SERGIO: …and that is why the vents. Anyway.'); }], ['“In a minute.”', () => { affect('ines', { t: -.3 }); G.line('SERGIO: (low, to you) Listen. The cellar vents were taped from the inside. I have the report. Not here.'); G.flags.add('sergio-truth'); }]], { timeout: 6, onTimeout: () => affect('ines', { t: -.5 }) }), 1200);
  }
  // He stops a revelation, not to protect anyone: he wants to see what happens without it.
  function primoIntervenes() {
    S.primoStopped = true;
    G.line('SERGIO: The thing nobody says about the cellar is that the vents—');
    setTimeout(() => G.line('IL PROFESSORE: Not now, Sergio. (He does not raise his voice.) Let him find it.'), 2300);
    setTimeout(() => G.line('(Sergio drinks. Nobody looks at anybody.)'), 5600);
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
  function candidate() { let best = null, bs = 2.4; for (const p of present()) { if (p.key === 'primo' || p.key === 'ottavio') continue; const sc = score(p.key); if (sc > bs) { bs = sc; best = p; } } return best ? { p: best, s: bs } : null; }
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
      setTimeout(() => offer(UP(k), s.kitchen.help, [['“Yes.”', () => { S.promised = k; G.flags.add('promised-' + k); affect(k, { t: 1.4, g: -1 }); goBack(sc); }], ['“I can’t.”', () => { affect(k, { t: -.5 }); goBack(sc); }]], { timeout: 9, onTimeout: () => { affect(k, { t: -.6 }); goBack(sc); }, speaker: nm(k) }), 2400);
      return;
    }
    // attack: still an ordinary exchange, until it is not
    const cause = (S.rel[k].causes.slice().sort((a, b) => b.w - a.w)[0]) || { text: '' };
    const giveBack = returnTo(k) || (k === 'gabri' && S.carried.has('photo') ? 'photo' : null) || (k === 'walter' && S.carried.has('keys') ? 'keys' : null);
    const opts = [];
    if (giveBack) opts.push([`Give back the ${({ photo: 'photograph', keys: 'keys', earplugs: 'earplugs' })[giveBack] || giveBack}.`, () => { S.carried.delete(giveBack); affect(k, { g: -2.5, t: .4 }); defused(sc, 'returned'); }]);
    if (S.carried.has('knife')) opts.push(['Put the knife on the table between you.', () => { const K = S.belong.knife; putAt(K, new THREE.Vector3(-7.85, .89, -6.3), 'origin'); affect(k, { f: 1.2, g: -1 }); defused(sc, 'knife'); }]);
    opts.push(['“What did they tell you about me?”', () => { G.line('TOBIA: What did they tell you about me?'); setTimeout(() => { G.line(`${UP(k)}: ${cause.text ? cause.text.replace(/^[A-Z][a-z]+ /, (m) => m === nm(k) + ' ' ? 'I ' : m).replace(/\byou\b/g, 'you') : 'Nothing. Nobody had to.'}`); setTimeout(() => offer(UP(k), '', [['“That isn’t what happened.”', () => { if (SOCIAL[k].distorts < .5 && /\(you had not\)/.test(cause.text)) { affect(k, { g: -2.2 }); defused(sc, 'truth'); } else fail(sc); }], ['“I’m sorry.”', () => { if (SOCIAL[k].care >= .45) { affect(k, { g: -2 }); defused(sc, 'sorry'); } else fail(sc); }], ['(Walk out of the kitchen.)', () => { defused(sc, 'walked'); }]], { timeout: 6, onTimeout: () => fail(sc), leave: () => defused(sc, 'walked') }), 2400); }, 1400); }]);
    opts.push(['(Walk out of the kitchen.)', () => defused(sc, 'walked')]);
    setTimeout(() => offer(UP(k), sc.knife ? '(The knife is on the table between you. The loaf is half cut.)' : '', opts, { timeout: 7, onTimeout: () => fail(sc), leave: () => defused(sc, 'walked') }), 2600);
  }
  function defused(sc, how) {
    const k = sc.k;
    if (how === 'walked') { G.line(`(${nm(k)} does not follow you. Behind you, the bread knife goes back on the board.)`); S.truths.push(`In the kitchen, you walked out before ${nm(k)} decided anything.`); }
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
    const st = standing(k);
    if (st <= -2.2) return `(${nm(k)} does not answer.)`;
    if (st <= -1) return pick(s.cold);
    if (st >= 1.5 && Math.random() < .6) return pick(s.warm);
    return null;
  }
  // Talking to someone who has gone cold: nobody answers.
  function dialogueGate(npc) {
    const k = npc.socialKey; if (!k || k === 'primo') return null;
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

  // ---- per frame ---------------------------------------------------------------------
  function update(dt) {
    if (!S.built && G.home() && G.seats()) buildWorld();
    watchFlags();
    // rumours travel whether or not Tobia is in the room
    for (const r of S.rumours) if (!r.dead && !r.done && now() >= r.at) { r.done = true; tellRumour(r); }
    S.rumours = S.rumours.filter(r => !r.done && !r.dead);
    updateUI(dt); updateBleed(dt); updateKitchen(dt);
    if (S.seated) { G.camera.position.y = 1.12; if (G.zone() !== 'home') S.seated = null; }
    // tension: hostile eyes, the room, the body
    if (G.zone() === 'home' && G.canAct()) {
      let stare = 0; for (const p of present()) { if (p.key === 'primo') continue; if (standing(p.key) <= -1 && dist2(p) < 6) stare++; }
      S.tension = clamp(S.tension + dt * (stare * .006 + (S.seated?.aurelio ? .004 : 0)) - dt * .007, 0, 1.2);
      if (S.gather.active) { const A = S.gather.active; A.t += dt; if (S.seated) A.sat = true; while (A.beats.length && A.beats[0].at <= A.t) A.beats.shift().fn(); }
      else if (G.welcomed() && !S.kitchen.scene) { S.gather.cd -= dt; if (S.gather.cd <= 0 && !S.ui) { S.gather.cd = 210; gatherStart(); } }
      if (S.approach) {
        // someone is suddenly close when the tissue comes down; they say nothing, and go back
        const a = S.approach, n = a.p.npc; a.t += dt;
        if (!a.stage) { const pp = playerPos(), o = n.object.position, d = Math.hypot(pp.x - o.x, pp.z - o.z); if (d < 1.25 || a.t > 6) { a.stage = 1; a.t = 0; n.walking = false; } else G.walk(n, pp.x + (o.x - pp.x) / d * 1.1, pp.z + (o.z - pp.z) / d * 1.1, 1.3, dt); }
        else if (a.stage === 1) { const pp = playerPos(); G.turn(n, pp.x, pp.z, dt); if (a.t > 4) a.stage = 2; }
        else if (G.walk(n, a.from.x, a.from.z, 1.0, dt)) S.approach = null;
      }
      if (S.frameAt && !S.framed && now() > S.frameAt && !S.seated && !inKitchen()) frame();
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
    _canAct: () => G.canAct(), _gesture: gesture, _ask: ask, _startBleed: startBleed, _arrangeKitchen: arrangeKitchen, _gather: gatherStart, _affect: affect, _score: score
  };
}
