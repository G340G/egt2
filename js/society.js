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

const NAMES = { ines: 'Ines', ottavio: 'Ottavio', anna: 'Anna', dario: 'Dario', sergio: 'Sergio', marta: 'Marta', pino: 'Pino', gabri: 'Gabri', walter: 'Walter', livia: 'Livia', franco: 'Franco', primo: 'Il Primo', tobia: 'Tobia' };
const nm = (k) => NAMES[k] || k;
const UP = (k) => nm(k).toUpperCase();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---- What a gesture means, to whom ------------------------------------------------
// truth: what Tobia actually did. worse: what it becomes when a careless or hostile
// person retells it. fx: per-witness change { t: trust, g: grievance, f: fear }.
const ACTS = {
  'earplugs-look': { truth: 'picked up Il Primo’s earplugs and turned them over', worse: 'earplugs-take', fx: { dario: { g: 1.1 }, walter: { g: .6 }, gabri: { t: .4 }, sergio: { t: .3 }, ines: { f: .2 } }, base: { g: .2 } },
  'earplugs-take': { truth: 'put Il Primo’s earplugs in his pocket', fx: { dario: { g: 2.6 }, walter: { g: 1.6 }, gabri: { t: .8 }, sergio: { t: .5 }, marta: { g: .4 }, ines: { f: .6 }, anna: { g: .6 } }, base: { g: .6 } },
  'earplugs-move': { truth: 'moved Il Primo’s earplugs over to his own place', worse: 'earplugs-take', fx: { dario: { g: 1.8 }, walter: { g: 1 }, gabri: { t: .5 }, sergio: { t: .4 } }, base: { g: .4 } },
  'earplugs-return': { truth: 'gave Il Primo back his earplugs', fx: { dario: { g: -.7, t: .2 }, walter: { g: -.5 } }, base: { t: .15 } },
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
const VERB = { 'earplugs-take': 'took Il Primo’s earplugs. Pocketed them', 'photo-take': 'took the boy’s photograph', 'bowl-eat': 'ate out of the dead man’s bowl' };

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
    if (act === 'bowl-eat' && has('anna-asked')) { set('anna-kept'); affect('anna', { t: 2.4, g: -2 }); note('anna', 'You ate from Anna’s husband’s bowl because she asked you to.'); }
    for (const k of seen) {
      if (k === 'primo') { S.primoNotes.push(act); continue; }
      if (act === 'bowl-eat' && k === 'anna' && has('anna-asked')) continue;
      affect(k, fxFor(k, act), `${nm(k)} saw you as you ${A.truth}${extra}.`);
      // they will tell someone: later, and maybe not the same story
      const c = SOCIAL[k]?.confidant; if (c && !SOCIAL[k].mute) S.rumours.push({ at: now() + 40 + Math.random() * 80, teller: k, listener: c, ep, act });
      else if (c && SOCIAL[k].mute) S.rumours.push({ at: now() + 120 + Math.random() * 90, teller: k, listener: c, ep, act, napkin: true });
    }
    if (seen.length) tense(.05 + seen.length * .02);
    if (['earplugs-take', 'earplugs-move', 'chair-aurelio'].includes(act) && seen.includes('dario') && (S.rel.dario.marked || S.rel.dario.grievance > 2.2)) click('dario', act === 'chair-aurelio' ? 'You sat in Aurelio’s chair, bleeding. Dario saw the marked one take the place of the first one to be full, and decided it was a sign that it must be finished.' : 'You put your hands on Il Primo’s earplugs. To Dario it was a desecration by the one already chosen.');
    if (['photo-take', 'photo-tear'].includes(act) && seen.includes('gabri')) click('gabri', act === 'photo-tear' ? 'He watched you tear the only face that ever looked at him.' : 'He watched you put his mother in your pocket.');
    if (act === 'bowl-eat' && seen.includes('anna') && !has('anna-asked')) click('anna', 'You ate a dead man’s supper in front of his widow, without being asked. For forty years nobody had touched it.');
    if (act === 'keys-take' && seen.includes('walter')) click('walter', 'You took his keys while he was looking at you. A task with a variable in it cannot be finished.');
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
        ['Take them to Il Primo.', () => { const p = who('primo'); take(B); S.carried.delete(B.id); B.state = 'returned'; B.mesh.visible = false; setEntry(B, false); gesture('earplugs-return'); if (p) G.line('IL PRIMO: (He weighs them in his palm and smiles.) You found them. Where?'); }],
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
    if (seat.id === 'west5' && has('anna-asked') && S.gather.active) { set('anna-kept'); affect('anna', { t: 2, g: -1.5 }); say(null, 'Anna watches you sit in his place. She puts the ladle down and does not pick it up again for a long time.'); }
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
      const opts = told ? [['“Franco said Don Aurelio wired the latch himself.”', 'truth', 'Franco said Don Aurelio wired the latch himself.'], ...(has('franco-asked') ? [['“Sergio told me.”', 'sergio', 'Sergio told me.']] : []), ['“Somebody said it was the cold that winter.”', 'alter', 'Somebody said it was the cold.'], ['“I don’t remember who said what.”', 'forget', 'I don’t remember.'], ['“Is there more bread?”', 'subject', 'Is there more bread?']]
        : [['“Nobody has told me anything.”', 'truth', 'Nobody has told me anything.'], ['“Il Primo told me.”', 'lie', 'Il Primo told me.'], ['“Is there more bread?”', 'subject', 'Is there more bread?']];
      return { q: pick(['Did he tell you what happened? To Aurelio.', 'Has anyone told you about Aurelio? Who.']), opts, on: {
        sergio: () => { namedSergio(); affect(a, { t: .3 }); },
        truth: (L) => { if (told && has('franco-asked')) namedFranco(a); if (told) { betray('franco', a, 'you repeated what Franco told you about Don Aurelio, to ' + nm(a), L); if (motive === 'test') affect(a, { t: .5 }); if (motive === 'protect') affect(a, { f: .6 }, 'You repeated a confidence to Ines; she decided you repeat things.'); } else affect(a, { t: .2 }); },
        alter: () => { exposeLater(a, 'franco', 'aurelio', 'You told ' + nm(a) + ' it was the cold. Franco had told you otherwise, and somebody had heard him tell you.'); if (motive === 'protect') affect(a, { t: .5 }); },
        lie: () => { set('lied-aurelio'); affect(a, { g: .3 }); S.truths.push('You told ' + nm(a) + ' that Il Primo had told you about Aurelio. He had not.'); exposeLater(a, 'primo', 'aurelio', 'You said Il Primo had told you. Il Primo said he had not.'); },
        forget: () => { set('lied-aurelio'); affect(a, motive === 'test' ? { g: .4 } : { t: .2 }, motive === 'test' ? 'You told ' + nm(a) + ' you could not remember. ' + nm(a) + ' did not believe you.' : null); },
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
        : [['“No.”', 'truth', 'No.'], ...(moved ? [['“They’re at my place. I don’t know how.”', 'odd', 'They’re at my place. I don’t know how.']] : []), ['“Ask Il Primo.”', 'subject', 'Ask Il Primo.']];
      return { q: pick(['Have you seen his earplugs? The orange ones. They were on the table.', 'Somebody has moved his earplugs. Have you seen them?']), opts, on: {
        truth: () => { if (have) { affect(a, { g: .8, t: .4 }, 'You admitted to ' + nm(a) + ' that you had Il Primo’s earplugs.'); } else affect(a, { t: .1 }); },
        lie: () => { affect(a, { t: -.1 }); exposeLater(a, null, 'earplugs', 'You told ' + nm(a) + ' you had not seen the earplugs. They were in your pocket.', true); },
        odd: () => affect(a, { g: .6 }, 'You told ' + nm(a) + ' the earplugs had appeared at your place by themselves.'),
        subject: () => affect(a, { g: .6 }, 'You told ' + nm(a) + ' to ask Il Primo about his own earplugs.'),
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
      affect(asker, { g: 1.8, t: -.8 }, cause); if ((SOCIAL[asker]?.violence ?? 0) >= .6 && S.rel[asker].grievance > 2) click(asker, cause + ' A lie, found out, is a door left open.');
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
    if (E && E.state === 'here' && E.where === 'origin' && who('marta') && !S.martaTook) opts.push(() => { S.martaTook = true; E.mesh.visible = false; E.state = 'gone'; setEntry(E, false); S.truths.push('Marta took Il Primo’s earplugs from the table while you were wiping your nose.'); S.frameAt = now() + 80 + Math.random() * 60; S.missingEarplugs = now(); });
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
    G.line(pick(['IL PRIMO: We eat. Everyone.', 'IL PRIMO: The table, please. All of us.', 'IL PRIMO: Sit down, all of you. It is getting cold.']));
    if (havePlugs) add(1.5, () => { G.earplugs(P.npc, true); G.line('(He puts in his orange earplugs, one, then the other, and smiles at nobody.)'); });
    else add(1.5, () => G.line('(He reaches for his earplugs. They are not on the table. He presses two fingertips into his ears instead, and smiles at nobody.)'));
    // the arrangement
    if (S.placeDenied) add(4.5, () => { G.line('(There is no place set for you. A coat is over the back of your chair. Nobody mentions it.)'); tense(.3); });
    else if (S.gather.n === 2) add(4.5, () => { G.line('IL PRIMO: Tobia. There. (He points at the empty chair between Dario and Sergio.) Nobody is using it tonight.'); A.pointed = 'east1'; });
    else { const worst = present().filter(p => p.key !== 'primo').sort((a, b) => standing(a.key) - standing(b.key))[0]; if (worst && S.gather.n > 2) add(4.5, () => G.line(`IL PRIMO: Tobia, sit near ${nm(worst.key)}. You two have not talked.`)); }
    // the situation he lets happen
    const sit = chooseSituation();
    add(14, () => sit());
    add(40, () => { if (!A.sat && G.zone() === 'home' && !S.seated) { gesture('refuse-gathering', { seenBy: present().map(p => p.key) }); S.refused++; for (const p of present()) affect(p.key, { g: .3 * (SOCIAL[p.key]?.loyalty ?? .5) }, p.key === 'primo' ? null : 'You did not come to the table when Il Primo called everyone.'); } });
    add(55, () => { G.earplugs(P.npc, false); });
    add(58, () => { S.gather.active = null; gatherEnded(); if (!S.plotN) S.plotAt = Math.min(S.plotAt || 1e9, now() + 70); if (S.placeDenied && S.place) { /* the place stays gone */ } });
  }
  function chooseSituation() {
    { const sp = requestSituation(); if (sp) return sp; }
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
      [`“Leave ${nm(vic)} alone.”`, () => { G.line(`TOBIA: Leave ${nm(vic)} alone.`); const seen = present().map(p => p.key); affect(vic, { t: 1.4 }); affect(agg, { g: 1.2 }, `You defended ${nm(vic)} against ${nm(agg)} at the table.`); if (S.rel[agg].grievance > 1.8 && (SOCIAL[agg]?.violence ?? 0) > .6) click(agg, `You shamed ${nm(agg)} in front of Il Primo, at the table, for a stranger.`); S.primoNotes.push('defend'); seen.forEach(k => { if (k !== agg && k !== vic && SOCIAL[k]?.protects?.includes(vic)) affect(k, { t: .5 }); }); }],
      ['Laugh.', () => { G.line('(You laugh. Two others laugh with you, a beat late.)'); affect(agg, { t: .6 }); affect(vic, { g: 1.2 }, `You laughed when ${nm(agg)} humiliated ${nm(vic)}.`); if (vic === 'gabri') click('gabri', 'You laughed with Walter when Walter called him a dog by the fridge. He had thought you were the one who looked at him.'); }],
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
    G.line('IL PRIMO: Not now, Sergio. (He does not raise his voice.) Let him find it.');
    G.line('(Sergio drinks. Nobody looks at anybody.)');
    S.truths.push('Il Primo stopped Sergio telling you about the vents. He wanted you to find it yourself.');
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

  function inKitchen() { const p = playerPos(); return G.zone() === 'home' && p.x < -4.6 && p.z < -4.9; }

  // ---- arriving, doors, gaze, barks --------------------------------------------------
  function onEnterZone(name) {
    if (R.motives) { stalkersOnEnter(name); trapsOnEnter(name); }
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
    affect('dario', { g: 1.2 }, 'Marta told Dario she had seen you with Il Primo’s earplugs (she had taken them herself).');
    conflict('dario', 'tobia', 'the earplugs');
  }
  function doorGate(item) {
    if (R.armed?.kind === 'cellar' && G.zone() === 'cellar') { G.line('(The hatch will not lift. Something heavy is on it.)'); tense(.1); return true; }
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
    { const m = live(k); if (m && m.hidden && Math.random() < .7) return pick(s.warm); }
    const st = standing(k);
    if (st <= -2.2) return `(${nm(k)} does not answer.)`;
    if (st <= -1) return pick(s.cold);
    if (st >= 1.5 && Math.random() < .6) return pick(s.warm);
    return null;
  }
  // Talking to someone who has gone cold: nobody answers.
  function dialogueGate(npc) {
    const k = npc.socialKey; if (!k || k === 'primo') return null;
    if (npc._skipGate) { npc._skipGate = false; return null; }
    if (requestGate(npc)) return 'handled';
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
    const conflictN = Object.values(S.between).reduce((a, b) => a + b, 0) + R.dead.size * 1.5;
    const deaths = [...R.dead].map(k => R.log.find(l => l.k === k && /\./.test(l.text) && S.truths.includes(l.text))?.text).filter(Boolean);
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
      L.push(...deaths); const cs = S.conflicts.slice(-5).map(c => `${nm(c.a)} turned against ${c.b === 'tobia' ? 'you' : nm(c.b)}: ${c.why}.`); L.push(...cs);
      E = { id: 'disintegration', title: 'The Disintegration', small: 'ENDING · THE DISINTEGRATION', copy: 'It did not end in the cellar. It ended in the kitchen, the yard, the lane: people who had shared a table for years stopped speaking, then stopped sleeping in the same house. Franco left at night. Dario locked himself in with the record. Somebody hurt somebody in the barn and nobody would say who. You watched it come apart along the lines you had drawn without knowing you were drawing them.', voice: 'You did not break them. You only repeated things.', choice: 'expose' };
    } else if (keysHeld && left) {
      L.push(`You had ${S.carried.has('keys') ? 'Walter’s keys' : 'a seat in Pino’s van'}.`, `${nm(left)} ${S.promised === left ? 'had asked you to take them, and you had said yes' : 'trusted you more than anyone in the house'}.`, ...causes().slice(0, 3).map(c => c.text));
      E = { id: 'abandonment', title: 'The Abandonment', small: 'ENDING · THE ABANDONMENT', copy: `You drove before dawn and did not look back, the way Pino said. You were three villages away before you thought of ${nm(left)}. You told yourself there had not been room. There had been room. Later you would read that the farmhouse had been found empty, except for one person, and the name was ${nm(left)}.`, voice: 'You survived. Someone paid for the seat.', choice: 'preserve' };
    } else if (entangle < 6) {
      L.push('You touched almost nothing. You answered almost nothing.', ...S.truths.slice(0, 4));
      E = { id: 'departure', title: 'The Departure', small: 'ENDING · THE DEPARTURE', copy: 'The fog lifted for an hour on the Monday and you walked down the lane to the provinciale, and a bus came, and you got on it. You never understood what had happened in the house, or whether anything had. Il Primo was on the porch when you left. He raised his hand, not to wave: to keep the light out of his eyes.', voice: 'An escape is not a victory. He is still there.', choice: 'preserve' };
    } else {
      L.push(...causes().slice(0, 3).map(c => c.text), ...S.truths.slice(-4));
      if (!L.length) L.push('Nothing you did was decisive. Everything you did was noticed.', 'Il Primo arranged the table every evening, and then put his earplugs in.');
      E = { id: 'witness', title: 'The Witness', small: 'ENDING · THE WITNESS', copy: 'You stayed until the end. You saw every chair empty, one by one, and every reason, and you understood at last that Il Primo had not done anything. He had arranged who sat where, and when the bread was cut, and who was asked which question in front of whom. Then he put his earplugs in and waited. He obtained exactly what he wanted without once having to act.', voice: 'He did not need a monster. He had people.', choice: 'fill' };
    }
    if (S.heardTold.some(h => h.worse)) L.push('Somebody had been telling your story differently. You heard part of it once, by the stove.');
    E.ledger = [...new Set(L)].slice(0, 8);
    S.ending = E; return E;
  }


  // ===================================================================================
  // v24 — REQUESTS, PROMISES, MOTIVES. THE CULT EATS ITSELF.
  // Nobody hunts Tobia. People come to him with things they cannot do alone: a thermos, a
  // van, a lie, an hour in the cellar. Each of them has a reason for choosing him, a fear,
  // and an idea of what his answer will prove. Accepting can betray one person; refusing
  // can betray another; doing nothing is read as something. Violence exists only where one
  // particular person has one particular reason, and it happens only in that person's own
  // place: Ines's cup, Gabri's fridge light, Walter's charges, Franco's board, Dario's cellar.
  // Every one of those moments can be prevented, by something that person needed.
  // ===================================================================================
  const R = { reqs: {}, active: null, beckon: null, cd: 45, promises: [], motives: {}, dead: new Set(), carry: new Set(), flags: new Set(), log: [], npc: {}, moves: [], timers: [], van: null, rotorIn: true, rotorBy: null, scene: null };
  S.req = R;
  const has = (f) => R.flags.has(f), set = (f) => R.flags.add(f);
  const zoneOf = (name) => G.zones()[name];
  const say = (k, t) => G.line(k ? `${UP(k)}: ${t}` : `(${t})`);
  const me = (t) => G.line('TOBIA: ' + t);
  const note = (k, text) => R.log.push({ k, text, at: now() });
  const later = (sec, fn) => R.timers.push({ at: now() + sec, fn });
  function ch(opts, { timeout = 16, silence = null, leave = null, title = '' } = {}) { G.queueAction(() => offer(title, '', opts, { timeout, onTimeout: silence || (() => {}), leave: leave || silence })); }
  function npcOf(k) { if (k === 'primo') return G.firstNpc(); const p = G.people().find(x => x.key === k); if (p) R.npc[k] = p.npc; return R.npc[k] || null; }
  function alive(k) { return !R.dead.has(k) && !!npcOf(k); }
  function sameZone(n) { const Z = zoneOf(G.zone()); return n && n.object.visible && Z && n.object.parent === Z.group; }
  function near(k, r) { const n = npcOf(k); if (!sameZone(n)) return false; const o = n.object.getWorldPosition(new THREE.Vector3()), p = playerPos(); return Math.hypot(o.x - p.x, o.z - p.z) < r; }
  function alone(r = 5, except = []) { return !present().some(p => !except.includes(p.key) && dist2(p) < r); }
  // bodies: people leave the table and go somewhere you can see them go
  function keepHome(n) { if (!n._home) n._home = { x: n.object.position.x, z: n.object.position.z, y: n.object.position.y, r: n.object.rotation.y, seated: !!n.seated, parent: n.object.parent }; }
  function returnHome(n) { const h = n._home; if (!h) return; if (n.object.parent !== h.parent) { n.object.parent?.remove(n.object); h.parent.add(n.object); } n.object.position.set(h.x, h.y, h.z); n.object.rotation.y = h.r; n.seated = h.seated; n.walking = false; n.object.visible = true; n.borrowed = false; n.lookAt = null; }
  function sendTo(k, zoneName, x, z, yaw) { const n = npcOf(k); if (!n) return; keepHome(n); const zg = zoneOf(zoneName).group; if (n.object.parent !== zg) { n.object.parent?.remove(n.object); zg.add(n.object); } n.object.position.set(x, 0, z); n.object.rotation.y = yaw; n.seated = false; n.posed = false; n.walking = false; n.object.visible = true; n.borrowed = zoneName !== 'home'; }
  function walkTo(k, path, then) { const n = npcOf(k); if (!n) return; keepHome(n); n.seated = false; n.posed = false; R.moves = R.moves.filter(m => m.k !== k); R.moves.push({ k, n, path: path.slice(), then }); }
  function leaveHouse(k, then) { const n = npcOf(k); if (!n) return; const o = n.object.position, side = o.x < -6.5 ? -7.75 : -5.0; walkTo(k, [...(o.z < 5 && o.x < -4 ? [[side, o.z], [side, 6.5]] : []), [0, 7.4], [0, 8.6]], () => { n.object.visible = false; n.borrowed = true; then?.(); }); }
  // a member dies, and everyone has to live at the same table with it
  function memberDies(k, line, journalText) {
    if (R.dead.has(k)) return; R.dead.add(k); const n = npcOf(k);
    if (n) { n.fate = 'dead'; n.object.visible = false; const L = G.home().interactables, i = L.indexOf(n); if (i >= 0) L.splice(i, 1); }
    S.truths.push(journalText); note(k, journalText);
    if (G.zone() === 'home') G.line(line); else later(1, () => { R.pendingNews = (R.pendingNews || []).concat(line); });
    G.journal({ id: 'dead-' + k, title: `${nm(k)}`, description: journalText, kind: 'the table', zone: 'home' });
    keys.forEach(x => { if (x !== k && !R.dead.has(x)) affect(x, { f: .3 }); });
    tense(.35);
  }
  // ---- motives: one person, one reason, one place -----------------------------------
  const PLACE = { cup: 'ines', fridge: 'gabri', lead: 'walter', cleaver: 'franco', cord: 'dario' };
  function motive(k, kind, why, hidden = false) {
    if (R.dead.has(k) || R.motives[k]?.alive) return;
    R.motives[k] = { k, kind, why, hidden, alive: true, born: now(), placed: false };
    S.truths.push(`${nm(k)} decided you had to disappear. ${why}`); note(k, why);
    S.plotAt = Math.min(S.plotAt || 1e9, now() + 45);
    if (R.napkins && alive('livia')) later(30, () => napkin(k, kind));
  }
  function defuse(k, how) { const m = R.motives[k]; if (!m || !m.alive) return; m.alive = false; m.defused = how; S.truths.push(how); note(k, how); const n = npcOf(k); if (n) { n.hunting = false; if (m.hunt) offH(m); if (m.placed || m.hunt) returnHome(n); } }
  function live(k) { const m = R.motives[k]; return m && m.alive && !R.dead.has(k) ? m : null; }
  function napkin(k, kind) {
    const words = { cup: 'not the cup', fridge: 'not in the fridge light', lead: 'do not hold anything for him', cleaver: 'he is asking to be asked', cord: 'do not kneel' }[kind] || 'do not be alone. do not go where they send you';
    S.napkinText = `(A napkin at your place, Livia's small capitals:) ${nm(k).toUpperCase()} — ${words}`;
    if (G.zone() === 'home') G.line(S.napkinText); else R.pendingNews = (R.pendingNews || []).concat(S.napkinText);
  }
  // ---- the request engine -------------------------------------------------------------
  // Someone catches Tobia's eye. They do not come to him from nowhere: he has to go to them,
  // or let them come across the room. Ignoring them is an answer too.
  function showVan() { if (!R.van || R.van.visible) return; R.van.visible = true; zoneOf('road').interactables.push(R.vanEntry); }
  function beckon(id) {
    if (id === 'pino') showVan();
    const q = REQ[id]; R.reqs[id] = { state: 'beckon', at: now() }; R.beckon = { id, k: q.k, t: 0 };
    if (q.arranged && alive('primo')) say('primo', q.arranged);
    say(null, q.beckon); S.beckonK = q.k;
  }
  function startTalk(id) { R.beckon = null; S.beckonK = null; R.active = id; R.reqs[id].state = 'talk'; const q = REQ[id]; G.clearLines(); q.talk(); }
  function endTalk(id, outcome) { if (R.reqs[id]) { R.reqs[id].state = 'done'; R.reqs[id].outcome = outcome; } if (R.active === id) R.active = null; R.cd = 70 + Math.random() * 40; }
  function promise(id, k, text, check) { R.promises.push({ id, k, text, check, state: 'open', at: now() }); }
  const REQ = {
    // INES — the thermos. Why Tobia: Gabri refuses everything from her and wants to be seen by
    // the new one. What she wants: him to sleep, and, she will not say it, to go gently. What she
    // fears: that he will go badly, alone, at night. What his answer proves: that he is one of the warm ones.
    thermos: { k: 'ines', arranged: 'Ines would like a word with you. In the kitchen, I think.', beckon: 'Ines, by the stove, holds up a thermos and looks at you. Then at the fridge, where Gabri sits.',
      ready: () => S.introDone && now() > 90 && alive('ines') && alive('gabri'),
      talk() {
        say('ines', '(low) He won’t take it from me. He takes everything from me except this. From you he would. You’re new. He wants you to look at him.');
        say('ines', 'It’s for sleeping. He doesn’t sleep. Take it to him at the fridge, before we eat.');
        const take = (knew) => { R.carry.add('thermos'); if (knew) set('thermos-knew'); set('thermos-accepted'); affect('ines', { t: 1 }); note('ines', knew ? 'You took the thermos from Ines knowing what was in it.' : 'You took the thermos from Ines to give to Gabri.'); endTalk('thermos', 'accepted'); promise('thermos', 'ines', 'give Gabri the thermos', () => has('thermos-given') ? 'kept' : (has('thermos-poured') || has('thermos-returned')) ? 'broken' : null); };
        ch([
          ['“All right.”', () => { me('All right.'); say('ines', '(She presses it into your hands. It is very warm.) Before we eat.'); take(false); }],
          ['“What’s in it?”', () => { me('What’s in it?'); say('ines', 'Camomile. Honey. (She folds the cloth.) And what the pharmacy gave my mother at the end. Only a little. He has to sleep, Tobia.');
            ch([['“I’ll take it to him.”', () => { me('I’ll take it to him.'); take(true); }],
                ['(Take it, and say nothing.)', () => { say(null, 'You take it. She watches your face for a long time.'); take(true); }],
                ['“Not that. Not for a boy of nineteen.”', () => { me('Not that. Not for a boy of nineteen.'); say('ines', '(The cloth stops.) Nineteen. On the ward they were eighty, and I held their hands, and it still came at four in the morning with nobody there. You think nineteen is different.'); affect('ines', { t: -.6, g: .6 }, 'You refused Ines’s thermos and said what was in it out loud.'); set('thermos-refused'); set('thermos-knew'); endTalk('thermos', 'refused'); }],
                ['“Let me think.”', () => { me('Let me think.'); say('ines', 'Think by the fridge, then. He’s there.'); R.carry.add('thermos'); set('thermos-knew'); promise('thermos', 'ines', 'give Gabri the thermos', () => has('thermos-given') ? 'kept' : (has('thermos-poured') || has('thermos-returned')) ? 'broken' : null); endTalk('thermos', 'postponed'); }]],
              { silence: () => { say(null, 'Ines puts the thermos down on the kitchen table between you, and goes back to the stove.'); leaveThermos(); endTalk('thermos', 'silent'); } }); }],
          ['“Give it to him yourself.”', () => { me('Give it to him yourself.'); say('ines', '(She folds the cloth.) Of course. I always do.'); affect('ines', { t: -.8 }, 'You told Ines to give Gabri the thermos herself. She heard: you think I am a poisoner.'); set('thermos-refused'); endTalk('thermos', 'refused'); }],
          ['“Later. After dinner.”', () => { me('Later. After dinner.'); say('ines', 'After dinner he goes to the fridge and doesn’t come back. (She puts it in your hands anyway.)'); R.carry.add('thermos'); promise('thermos', 'ines', 'give Gabri the thermos', () => has('thermos-given') ? 'kept' : (has('thermos-poured') || has('thermos-returned')) ? 'broken' : null); endTalk('thermos', 'postponed'); }]
        ], { silence: () => { say(null, 'Ines puts the thermos down on the kitchen table between you, and goes back to the stove.'); leaveThermos(); endTalk('thermos', 'silent'); } });
      } },
    // ANNA — the place. Why Tobia: a stranger does not carry her husband's memory; anyone else
    // sitting there would be taking his place. Fear: the table noticing. Proves: that she may stop.
    anna: { k: 'anna', beckon: 'Anna, ladle in hand, nods you over to the far end of the table, where the full bowl is.',
      ready: () => S.introDone && now() > 150 && alive('anna') && !R.active,
      talk() {
        say('anna', 'Forty years I’ve filled it. If somebody sits there and eats it, once, I can stop. Not Franco. Not one of them. They knew him.');
        say('anna', 'You didn’t. Tonight, at dinner. His place. Eat it all.');
        ch([
          ['“All right. Tonight.”', () => { me('All right. Tonight.'); set('anna-asked'); affect('anna', { t: .6 }); promise('anna', 'anna', 'eat from her husband’s bowl', () => has('anna-kept') ? 'kept' : null); endTalk('anna', 'accepted'); }],
          ['“What happened to him?”', () => { me('What happened to him?'); say('anna', 'He walked out to the canal on a Tuesday. (She looks at the trowel on the dresser and then away from it.) The trowel came home. He didn’t.');
            ch([['“I’ll sit there.”', () => { me('I’ll sit there.'); set('anna-asked'); promise('anna', 'anna', 'eat from her husband’s bowl', () => has('anna-kept') ? 'kept' : null); endTalk('anna', 'accepted'); }], ['“I can’t take a dead man’s place.”', () => { me('I can’t take a dead man’s place.'); say('anna', 'Nobody can. That’s the trouble.'); affect('anna', { t: -.4, g: .6 }, 'You would not sit in Anna’s husband’s place. She will fill the bowl for another forty years.'); endTalk('anna', 'refused'); }]]); }],
          ['“Ask Franco. He drinks your coffee every morning.”', () => { me('Ask Franco. He drinks your coffee every morning.'); say('anna', '(Something crosses her face that is almost a laugh.) Franco. (She goes back to the pot without answering.)'); conflict('anna', 'franco', 'you said Franco should take her husband’s place'); affect('franco', { g: .4 }); endTalk('anna', 'redirected'); }],
          ['“No.”', () => { me('No.'); affect('anna', { t: -.5, g: .5 }, 'You said no to Anna.'); endTalk('anna', 'refused'); }]
        ], { silence: () => { say(null, 'Anna waits. Then she ladles the soup into his bowl, as always.'); endTalk('anna', 'silent'); } });
      } },
    // PINO — the way out. Why Tobia: because if someone is in the passenger seat he cannot turn
    // back at the combine; because Tobia is not one of them yet. Fear: turning back a third time.
    // Proves: that he is not the only one who wants to live. Implicated: Gabri (who talks), Dario.
    pino: { k: 'pino', beckon: 'Pino jerks his head at the door. Outside, the van in the yard is ticking as it cools.',
      ready: () => S.gather.n >= 1 && alive('pino') && !G.flags.has('pino-left-alive'),
      talk() {
        say('pino', '(low) Sunday they play the record. I’m not going to be in the room. The van’s in the yard. After the next dinner, while they’re clearing.');
        say('pino', 'Twice I’ve turned back at the combine. With someone in the passenger seat I can’t. Come with me. Don’t tell Dario, he’d try to save me. Not Gabri — he talks.');
        const yes = () => { set('pino-yes'); affect('pino', { t: 1.4 }); note('pino', 'You told Pino you would come with him.'); promise('pino', 'pino', 'meet him at the van after dinner', () => has('van-came') ? 'kept' : has('pino-gone') || has('pino-turned') ? 'broken' : null); endTalk('pino', 'accepted'); };
        ch([
          ['“Yes. I’ll come.”', () => { me('Yes. I’ll come.'); say('pino', '(He breathes out like a man putting down a load.) After dinner. Don’t pack. Packing is how they know.'); yes(); }],
          ['“Why me?”', () => { me('Why me?'); say('pino', 'Because in a week you’d say no.'); ch([['“All right.”', () => { me('All right.'); yes(); }], ['“Then I’m saying no now.”', () => { me('Then I’m saying no now.'); say('pino', 'Right. (He looks at the door a long time.)'); affect('pino', { t: -.3 }); set('pino-no'); endTalk('pino', 'refused'); }]]); }],
          ['“Only if Gabri comes too.”', () => { me('Only if Gabri comes too.'); say('pino', 'He’ll have told Ines before we reach the gate. (A long pause.) …Fine. You tell him. Not me.'); set('pino-yes'); set('pino-gabri'); affect('pino', { t: .6 }); promise('pino', 'pino', 'meet him at the van after dinner', () => has('van-came') ? 'kept' : has('pino-gone') || has('pino-turned') ? 'broken' : null); endTalk('pino', 'bargained'); }],
          ['“I can’t.”', () => { me('I can’t.'); say('pino', 'No. Nobody can. That’s how it works here.'); affect('pino', { t: -.4 }); set('pino-no'); endTalk('pino', 'refused'); }],
          ['“Let me think about it.”', () => { me('Let me think about it.'); say('pino', 'Think fast.'); set('pino-maybe'); endTalk('pino', 'postponed'); }]
        ], { silence: () => { say(null, 'Pino nods as if you had said no, and goes back in.'); set('pino-no'); endTalk('pino', 'silent'); } });
      } },
    // WALTER — the count. Why Tobia: Pino would hear Walter at the van; a stranger nobody watches.
    // What he wants: a task done properly, fourteen on Sunday, because Il Primo said fourteen. Fear:
    // the afternoon after, with nothing to measure. Proves: that Tobia can be given weight.
    walter: { k: 'walter', beckon: 'Walter is at the dresser, coiling a measuring tape. He looks at you and then at the door Pino went out of.',
      ready: () => R.reqs.pino?.state === 'done' && alive('walter') && alive('pino') && !G.flags.has('pino-left-alive'),
      talk() {
        say('walter', 'Il Primo asked me to make sure we are all here on Sunday. Fourteen. Pino has been out at that van every night.');
        say('walter', 'I don’t want anyone hurt. Under the bonnet, the black cap, the rotor arm lifts straight out. That’s all. I put it back Monday. He’d hear me. You he’d let near.');
        const agree = () => { set('walter-yes'); affect('walter', { t: 1 }); note('walter', 'You agreed to take the rotor out of Pino’s van for Walter.'); promise('walter', 'walter', 'take the rotor arm out of Pino’s van', () => R.rotorBy === 'tobia' ? 'kept' : has('pino-gone') || has('van-came') ? 'broken' : null); endTalk('walter', 'accepted'); };
        ch([
          ['“All right.”', () => { me('All right.'); say('walter', 'Good hands. (He means it as the highest thing he can say.)'); agree(); }],
          ['“Why does it matter to you?”', () => { me('Why does it matter to you?'); say('walter', 'Because he asked me. Because it’s a task. (He looks at his hands.) I’m good at tasks. Afterwards there’s nothing.'); ch([['“I’ll do it.”', () => { me('I’ll do it.'); agree(); }], ['“Find another task.”', () => { me('Find another task.'); affect('walter', { t: -.5 }); set('walter-no'); endTalk('walter', 'refused'); }]]); }],
          ['“I’ll watch him instead. If he goes, I’ll tell you.”', () => { me('I’ll watch him instead. If he goes, I’ll tell you.'); say('walter', '(He thinks about it like a load calculation.) …Before he goes. Not after.'); set('walter-inform'); affect('walter', { t: .5 }); promise('walter', 'walter', 'tell him before Pino left', () => has('told-walter') ? 'kept' : has('pino-gone') || has('van-came') ? 'broken' : null); endTalk('walter', 'bargained'); }],
          ['“No.”', () => { me('No.'); say('walter', 'Then I’ll do it myself. (No anger. A man adjusting a plan.)'); set('walter-no'); endTalk('walter', 'refused'); }]
        ], { silence: () => { say('walter', 'All right. I’ll do it myself.'); set('walter-no'); endTalk('walter', 'silent'); } });
      } },
    // GABRI — take me with you. He heard Pino through the wall. Why Tobia: Tobia looked at him.
    // Fear: being left in the fridge light. Proves: that someone chose him. Contradicts Pino.
    gabri: { k: 'gabri', beckon: 'Gabri, at the fridge, is looking at you. He taps the chair beside him: come.',
      ready: () => (has('pino-yes') || has('pino-maybe')) && alive('gabri') && !has('gabri-asleep'),
      talk() {
        say('gabri', '(fast, low) I heard Pino. The walls here are paper. You’re going. Take me. I can carry things. I don’t eat much. I won’t talk, I swear I won’t talk.');
        ch([
          ['“Yes. You’re coming.”', () => { me('Yes. You’re coming.'); say('gabri', '(He laughs, then puts his hand over his mouth.) Nobody’s ever—. Okay. Okay.'); set('gabri-promised'); affect('gabri', { t: 2 }); promise('gabri', 'gabri', 'take him with you', () => has('gabri-came') ? 'kept' : has('tobia-left') ? 'broken' : null); endTalk('gabri', 'accepted'); }],
          ['“There’s no room.”', () => { me('There’s no room.'); say('gabri', 'There’s always room for the thing nobody looks at.'); affect('gabri', { t: -.8, g: .8 }, 'You told Gabri there was no room for him.'); endTalk('gabri', 'refused'); }],
          ['“Ask Pino yourself.”', () => { me('Ask Pino yourself.'); say('gabri', 'Okay. (He is already standing up.)'); later(25, () => { if (alive('pino') && !has('pino-gone')) { set('pino-exposed'); affect('pino', { g: 1.4, t: -1 }, 'Gabri came to Pino asking to be taken. Pino knew who had told him.'); say('pino', '(from the hall, to Gabri) Who told you? (Then, seeing you:) Right.'); set('pino-turned-plan'); } }); endTalk('gabri', 'redirected'); }],
          ['“I’m not going anywhere.”', () => { me('I’m not going anywhere.'); say('gabri', 'Liar. (He smiles.) It’s fine. Everyone lies to me. It’s like a compliment.'); set('gabri-lied'); endTalk('gabri', 'lied'); }]
        ], { silence: () => { say('gabri', '(He turns back to the fridge.) Right. The light’s enough for one.'); affect('gabri', { g: .5 }); endTalk('gabri', 'silent'); } });
      } },
    // FRANCO — the account. Why Tobia: he is the only other person who knows. Fear: Dario; being
    // the next figure on Marta's beam. Proves: that Tobia will protect him. Implicated: Sergio.
    franco: { k: 'franco', beckon: 'Franco wipes down the board with the flat of his hand, and without looking up says your name.',
      ready: () => S.gather.n >= 1 && alive('franco') && alive('sergio') && alive('dario'),
      talk() {
        if (!G.flags.has('remo-confessed')) { say('franco', '(low) You’ll hear it anyway, so hear it from me. Aurelio wired the north latch himself. The priest. I was the sacristan. I held the door.'); G.flags.add('remo-confessed'); }
        else say('franco', '(low) That thing I told you. About the priest and the latch.');
        say('franco', 'Dario will ask who told you. He asks everyone everything. Say Sergio. Sergio believes in nothing — Dario will shout at him and forgive him. Me, he won’t forgive. I held the door.');
        ch([
          ['“All right. I’ll say Sergio.”', () => { me('All right. I’ll say Sergio.'); set('franco-asked'); set('franco-lie-yes'); affect('franco', { t: 1.4 }); note('franco', 'You agreed to tell Dario that Sergio told you about Aurelio.'); promise('franco', 'franco', 'tell Dario it was Sergio', () => has('named-sergio') ? 'kept' : has('named-franco') ? 'broken' : null); endTalk('franco', 'accepted'); }],
          ['“Why would Dario hurt you?”', () => { me('Why would Dario hurt you?'); say('franco', 'Because I held the door for the priest, and Dario thinks the priest is a saint. Fifty years I’ve been cutting meat so my hands would have something else to remember.'); set('franco-asked');
            ch([['“I’ll say Sergio.”', () => { me('I’ll say Sergio.'); set('franco-lie-yes'); affect('franco', { t: 1.2 }); promise('franco', 'franco', 'tell Dario it was Sergio', () => has('named-sergio') ? 'kept' : has('named-franco') ? 'broken' : null); endTalk('franco', 'accepted'); }], ['“I’ll say I don’t remember.”', () => { me('I’ll say I don’t remember.'); say('franco', 'He’ll hear my name in that.'); set('franco-forget'); endTalk('franco', 'bargained'); }], ['“I won’t put it on Sergio.”', () => { me('I won’t put it on Sergio.'); say('franco', '(He goes back to the board.) No. You’d rather put it on me.'); affect('franco', { g: .8, f: .6 }, 'You would not lie for Franco.'); endTalk('franco', 'refused'); }]]); }],
          ['“I won’t lie for you.”', () => { me('I won’t lie for you.'); say('franco', 'Then don’t. (The cleaver comes down very evenly.) Just remember I asked.'); set('franco-asked'); affect('franco', { g: .8, f: .6 }, 'You would not lie for Franco.'); endTalk('franco', 'refused'); }],
          ['“I’ll say I don’t remember.”', () => { me('I’ll say I don’t remember.'); say('franco', 'He’ll hear my name in that.'); set('franco-asked'); set('franco-forget'); endTalk('franco', 'bargained'); }]
        ], { silence: () => { say('franco', '(He lets it go, the way he lets his jokes go.)'); set('franco-asked'); endTalk('franco', 'silent'); } });
      } },
    // IL PRIMO, then DARIO — the cellar. Il Primo offers the opportunity; Dario asks. Why Tobia:
    // the others stopped looking at Dario years ago, and Tobia bleeds. What Dario wants: to be
    // completed by Il Bianco with someone watching. Fear: that nobody will look when it matters.
    dario: { k: 'dario', arranged: 'Dario has asked for the cellar tonight. He wants to listen to the record without these. (He touches his earplugs.) He shouldn’t be alone. I would not hear anything useful.', beckon: 'Dario stands in the hall by the cellar hatch, hands folded, waiting for you to notice him.',
      ready: () => S.gather.n >= 2 && alive('dario') && (S.asked?.has('dario:aurelio') || S.gather.n >= 3),
      talk() {
        say('dario', 'Will you sit with me? Down there. After dinner. I’m going to listen to it properly, without anything in my ears.');
        say('dario', 'When it fills me I want someone to have seen it. You bleed. You already know what it is.');
        ch([
          ['“I’ll come.”', () => { me('I’ll come.'); say('dario', '(For a second he looks nineteen.) Thank you.'); set('dario-yes'); affect('dario', { t: 1.5 }); promise('dario', 'dario', 'sit with him in the cellar', () => has('cellar-came') ? 'kept' : has('cellar-over') ? 'broken' : null); endTalk('dario', 'accepted'); }],
          ['“Don’t do it, Dario.”', () => { me('Don’t do it, Dario.'); say('dario', 'Everyone says that. Nobody says I’ll watch.'); affect('dario', { g: .6 }, 'You told Dario not to do it, instead of saying you would watch.'); set('dario-no'); endTalk('dario', 'refused'); }],
          ['“Only if Sergio comes too.”', () => { me('Only if Sergio comes too.'); say('dario', 'Sergio would smoke on the stairs and laugh. (Coldly.) Forget I asked.'); affect('dario', { g: .5 }); conflict('dario', 'sergio', 'you wanted Sergio to watch Dario'); set('dario-no'); endTalk('dario', 'bargained'); }],
          ['“No.”', () => { me('No.'); affect('dario', { g: .7 }, 'You would not sit with Dario.'); set('dario-no'); endTalk('dario', 'refused'); }]
        ], { silence: () => { say('dario', 'You can’t even look at me while you say no.'); affect('dario', { g: .9 }, 'You said nothing when Dario asked you to watch him.'); set('dario-no'); endTalk('dario', 'silent'); } });
      } },
    // MARTA — the beam. Why Tobia: the fourteenth figure wears his coat. Fear: forgetting; Il Primo
    // reading the beam. Implicated: Livia, who must not know. Marta misremembers whatever he says.
    marta: { k: 'marta', beckon: 'Marta, burin behind her ear, beckons with two fingers and points at the ceiling.',
      ready: () => S.gather.n >= 1 && alive('marta') && now() > 260,
      talk() {
        say('marta', 'The beam in the cellar. Fourteen figures. I don’t remember cutting the fourteenth, but it has your coat. Help me look at it before Il Primo reads it. Don’t tell Livia — she’d sing it.');
        ch([
          ['“Show me.”', () => { me('Show me.'); say('marta', 'In the cellar. Look up when you get to the bottom of the stairs.'); set('beam-open'); affect('marta', { t: 1 }); endTalk('marta', 'accepted'); }],
          ['“I don’t want to know.”', () => { me('I don’t want to know.'); say('marta', 'Nobody does. (Later she tells Livia you promised to come, and didn’t.)'); later(40, () => { if (alive('livia')) affect('livia', { t: -.6 }, 'Marta told Livia you broke a promise to her. You had made none.'); }); set('beam-open'); endTalk('marta', 'refused'); }],
          ['“Tell Il Primo yourself.”', () => { me('Tell Il Primo yourself.'); say('marta', 'He already knows. He likes it. That’s why.'); set('beam-open'); endTalk('marta', 'redirected'); }]
        ], { silence: () => { set('beam-open'); endTalk('marta', 'silent'); } });
      } },
    // LIVIA — the napkin. Why Tobia: he has not asked her to sing. What she offers: to tell him who
    // has decided, if he keeps her voice secret. Fear: being asked to perform.
    livia: { k: 'livia', beckon: 'Livia slides a folded napkin across the table toward your place, and waits.',
      ready: () => S.gather.n >= 2 && alive('livia'),
      talk() {
        say(null, 'The napkin: i am the voice in the confessional. if you never tell anyone, i will tell you who has decided. i always know. they hum.');
        ch([
          ['(Fold it and nod.)', () => { say(null, 'Livia closes her eyes, once, like a held note.'); R.napkins = true; affect('livia', { t: 1.4 }); Object.values(R.motives).filter(m => m.alive).forEach(m => later(8, () => napkin(m.k, m.kind))); endTalk('livia', 'accepted'); }],
          ['(Push it back.)', () => { say(null, 'She takes it back and tears it very small.'); affect('livia', { t: -.2 }); endTalk('livia', 'refused'); }],
          ['“Sing it instead.”', () => { me('Sing it instead.'); say(null, 'Her face shuts like a lid. She does not look at you again tonight.'); affect('livia', { t: -1.2, g: .6 }, 'You asked Livia to sing.'); endTalk('livia', 'insulted'); }]
        ], { silence: () => { say(null, 'The napkin stays between you until Anna clears it with the plates.'); endTalk('livia', 'silent'); } });
      } }
  };
  const ORDER = ['thermos', 'anna', 'pino', 'walter', 'franco', 'gabri', 'marta', 'dario', 'livia'];
  // ---- the objects that carry these promises ------------------------------------------
  function leaveThermos() { R.thermosLeft = now(); set('thermos-left'); }
  function buildRequestWorld() {
    if (R.built || !zoneOf('road') || !G.home()) return; R.built = true;
    const M = G.mat, home = G.home();
    // a basin on the kitchen table, for pouring things away
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(.16, .11, .1, 18, 1, true), M(0xdedad0, .4, { side: THREE.DoubleSide })); basin.position.set(-7.62, .92, -6.48); home.group.add(basin);
    home.interactables.push({ id: 'basin', type: 'social', object: basin, point: basin.position, radius: 1.8, get prompt() { return R.carry.has('thermos') ? '[ E ] THE BASIN' : '[ E ] A BASIN'; }, run: () => { if (!R.carry.has('thermos')) { G.line('(Enamel, chipped. Somebody has scrubbed it very hard.)'); return; } offer('THE BASIN', '(The thermos is warm against your ribs.)', [['Pour it away.', () => { R.carry.delete('thermos'); set('thermos-poured'); S.gestures++; G.line('(It smells of honey and of a pharmacy. It goes down the drain in a long thread.)'); const seen = witnesses(playerPos()); if (seen.includes('ines')) { affect('ines', { g: 1.2, t: -1 }, 'Ines watched you pour her thermos down the drain.'); set('ines-saw-pour'); } }], ['Keep it.', () => {}]]); } });
    // Pino's van, parked in the yard outside the farmhouse door
    // hidden until Pino first mentions it, so it never sits in the opening shot
    const v = G.buildVan(zoneOf('road').group); v.position.set(6.2, 0, -1.6); v.rotation.y = Math.PI * .5; v.traverse(o => { if (o.isSpotLight) o.intensity = 0; }); v.visible = false; R.van = v;
    R.vanEntry = { id: 'van', type: 'social', object: v, point: new THREE.Vector3(5.0, 0, -1.6), radius: 3.2, get prompt() { return '[ E ] PINO’S VAN'; }, run: () => vanBonnet() };
    // the beam in the cellar ceiling, where Marta carves them before they go
    const cz = zoneOf('cellar'); if (cz) { const beam = new THREE.Mesh(new THREE.SphereGeometry(.2, 6, 4), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); beam.position.set(2.5, 2.6, 2.5); cz.group.add(beam); cz.interactables.push({ id: 'beam', type: 'social', object: beam, point: beam.position, radius: 3.6, get prompt() { return has('beam-open') ? '[ E ] LOOK UP — THE BEAM' : '[ E ] LOOK UP'; }, run: () => readBeam() }); }
  }
  function readBeam() {
    if (!has('beam-open')) { G.line('(A ceiling beam, carved all along its length with small figures. Too dark to see what they are doing.)'); return; }
    const figs = [];
    for (const k of R.dead) figs.push(`${nm(k)}, already finished, a smoothed hollow where the face was`);
    for (const m of Object.values(R.motives)) if (m.alive) figs.push({ cup: 'a woman bending over a seated man with a cup, her other hand on the back of his neck', fridge: 'a boy in a rectangle of light, holding something behind his back', lead: 'a man on a lane paying out a line toward a wall', cleaver: 'a man at a board, one hand raised, the other open as if asking a question', cord: 'a kneeling figure, and a second figure behind him, also kneeling' }[m.kind] || `${nm(m.k)}, standing in a doorway behind a smaller figure, hands not visible`);
    figs.push('and at the end, a figure in your coat, its nose cut deep so the grain runs red');
    G.line(`(The beam. Fourteen figures, cut in Marta’s hand. You make out: ${figs.slice(0, 4).join('; ')}.)`);
  }
  function vanBonnet() {
    const opts = [];
    if (R.rotorIn) opts.push(['Open the bonnet and lift out the rotor arm.', () => { R.rotorIn = false; R.rotorBy = 'tobia'; R.carry.add('rotor'); set('rotor-out'); note('pino', 'You took the rotor arm out of Pino’s van.'); G.line('(A black cap, a small brass-tipped rotor. It lifts out exactly as Walter said. It weighs nothing.)'); }]);
    if (!R.rotorIn && R.carry.has('rotor')) opts.push(['Put the rotor arm back.', () => { R.rotorIn = true; R.carry.delete('rotor'); set('rotor-back'); note('walter', 'You put the rotor arm back in Pino’s van.'); G.line('(It clicks home.)'); }]);
    opts.push(['Leave it.', () => {}]);
    offer('PINO’S VAN', '(A white van with Pino’s jacket on the passenger seat. The bonnet is not locked.)', opts);
  }
  // ---- what Tobia can do face to face: give, warn, confess -------------------------------
  function requestGate(npc) {
    const k = npc.socialKey; if (!k) return false;
    if (R.beckon && R.beckon.k === k) { startTalk(R.beckon.id); return true; }
    if (R.active) return true;
    const opts = [];
    if (k === 'gabri' && has('gabri-asleep') && !has('gabri-woken')) { gabriAsleep(); return true; }
    if (k === 'gabri' && R.carry.has('thermos')) opts.push(['Give him the thermos.', () => giveThermos()]);
    if (k === 'gabri' && (R.reqs.thermos && !has('warned-gabri') && !has('thermos-given'))) opts.push(['“Don’t drink anything Ines gives you.”', () => warnGabri()]);
    if (k === 'ines' && R.carry.has('thermos')) opts.push(['Give her the thermos back.', () => { R.carry.delete('thermos'); set('thermos-returned'); me('I couldn’t.'); say('ines', '(She takes it without a word. That evening she carries it to the fridge herself. Gabri won’t take it from her, as always.)'); affect('ines', { t: -.4 }); }]);
    if (k === 'ines' && live('ines') && !has('ines-apology')) opts.push(['“I’m sorry I told Gabri.”', () => { set('ines-apology'); me('I’m sorry I told Gabri.'); say('ines', '(She touches your face, briefly, the way she checks a fever.) You had to. Somebody had to say it out loud. (Her hand is shaking. It has never shaken before.)'); defuse('ines', 'You apologised to Ines before she brought you the cup.'); }]);
    if (k === 'sergio' && has('named-sergio') && !has('warned-sergio') && !R.dead.has('sergio')) opts.push(['“Stay away from Dario tonight.”', () => warnSergio()]);
    if (k === 'dario' && has('named-sergio') && !has('retracted') && !R.dead.has('sergio')) opts.push(['“It wasn’t Sergio who told me. I lied.”', () => retract()]);
    if (k === 'walter' && has('walter-inform') && has('pino-leaving') && !has('told-walter')) opts.push(['“Pino’s going. Now.”', () => { set('told-walter'); me('Pino’s going. Now.'); say('walter', '(He is already putting on his coat.) Thank you.'); affect('walter', { t: 1 }); walterStopsPino(); }]);
    if (k === 'pino' && has('pino-yes') && has('walter-yes') && !has('warned-pino') && !has('pino-gone')) opts.push(['“Walter wants your van not to start.”', () => warnPino()]);
    if (k === 'franco' && has('named-franco') && !has('franco-apology') && live('franco')) opts.push(['“I’m sorry I said your name.”', () => { set('franco-apology'); me('I’m sorry I said your name.'); say('franco', '(The joke he starts dies before the end.) Sorry is what you say to a customer.'); }]);
    if (!opts.length) return false;
    opts.push(['(Say something else.)', () => { R.passThrough = npc; }]);
    offer(UP(k), '', opts);
    return true;
  }
  // ---- the thermos -------------------------------------------------------------------
  function giveThermos() {
    R.carry.delete('thermos'); set('thermos-given'); me('Ines made you this.');
    say('gabri', 'For me? (He grins.) Nobody brings me anything. (He drinks half of it straight off, burning his mouth, laughing.)');
    note('gabri', has('thermos-knew') ? 'You gave Gabri the thermos, knowing what was in it.' : 'You gave Gabri the thermos Ines made.');
    later(30, () => { set('gabri-asleep'); const n = npcOf('gabri'); if (n) { n.raiseK = 0; n.lookAt = new THREE.Vector3(-6, 0, -6); } if (G.zone() === 'home' && near('gabri', 9)) say(null, 'Gabri has put his head down on his arms in the fridge light. His breathing is very slow.'); });
    later(200, () => { if (has('gabri-asleep') && !has('gabri-woken')) gabriDies(); });
  }
  function leftThermosDrunk() { if (!has('thermos-left') || has('thermos-given') || !alive('gabri')) return; set('thermos-given'); set('thermos-by-nobody'); note('gabri', 'You left Ines’s thermos on the table. Gabri took it himself.'); later(30, () => set('gabri-asleep')); later(200, () => { if (has('gabri-asleep') && !has('gabri-woken')) gabriDies(); }); if (G.zone() === 'home') say(null, 'Gabri wanders over from the fridge, finds the thermos on the kitchen table, and takes it back to his chair.'); }
  function gabriAsleep() {
    offer('GABRI — ASLEEP', '(His lips are pale. When you say his name, nothing.)', [
      ['Shake him awake.', () => wakeGabri('you')],
      ['Call Sergio.', () => { if (!alive('sergio')) { G.line('(Sergio’s chair is empty.)'); return; } say('sergio', '(He comes at once, slaps Gabri’s face, hauls him to the sink.) Up. Up. What did he drink? What did you give him?'); wakeGabri('sergio'); }],
      ['Call Ines.', () => { say('ines', '(She comes and sits beside him and puts her hand on his chest.) Shh. Let him. He’s not afraid. Look at him. (She does not get up again.)'); set('ines-sat'); }],
      ['Let him sleep.', () => { set('let-sleep'); note('gabri', 'You let Gabri sleep.'); }]
    ]);
  }
  function wakeGabri(by) {
    set('gabri-woken'); S.ui = null; const n = npcOf('gabri'); if (n) n.lookAt = null;
    say('gabri', '(He comes up gasping, and is sick in the basin, and holds on to the sink.) What— what was in it?');
    const knew = has('thermos-knew'), gave = has('thermos-given') && !has('thermos-by-nobody');
    ch([
      ['“Ines put something in it. To make you sleep.”', () => { me('Ines put something in it. To make you sleep.'); say('gabri', '(He looks across the kitchen at Ines. She doesn’t look away.)'); conflict('gabri', 'ines', 'Gabri learned what was in the thermos'); set('gabri-knows-ines'); affect('gabri', { t: knew && gave ? .2 : 1 }); later(20, () => inesLosesGabri()); }],
      ...(gave ? [['“I didn’t know what was in it.”', () => { me('I didn’t know what was in it.'); if (knew) { set('lied-gabri'); later(70, () => { if (alive('gabri') && alive('sergio')) { note('gabri', 'Sergio told Gabri that you had asked Ines what was in it, before you brought it.'); motive('gabri', 'fridge', 'You brought him the thermos knowing what was in it, and then you told him you didn’t know. He had thought you were the one person who looked at him.', true); } }); } else affect('gabri', { t: 1.4 }); }]] : []),
      ['“Just tea. You were tired.”', () => { me('Just tea. You were tired.'); set('lied-gabri'); later(80, () => { if (alive('gabri') && alive('sergio')) { note('gabri', 'Sergio smelled the thermos and told Gabri what it was.'); if (gave) motive('gabri', 'fridge', 'You handed him a thermos that nearly finished him and told him it was just tea.', true); else affect('gabri', { g: 1 }); } }); }]
    ], { silence: () => { say('gabri', '(He looks at you for a long time.) You were watching me sleep.'); affect('gabri', { g: 1 }, 'When Gabri woke you would not tell him what was in the thermos.'); } });
  }
  function gabriDies() {
    if (R.dead.has('gabri')) return;
    const knew = has('thermos-knew');
    memberDies('gabri', '(Gabri does not wake. Ines sits with him in the fridge light with her hand on his chest until it stops. She says he looked seen.)', `Gabri did not wake up from the thermos ${has('thermos-by-nobody') ? 'left on the kitchen table' : 'you carried to him'}. Ines sat with him. ${knew ? 'You knew what was in it.' : 'You did not know what was in it, or you did not ask.'}`);
    affect('ines', { t: 1.5 }); affect('sergio', { g: 2, t: -1.5 }, 'Sergio blamed you for Gabri.');
  }
  function warnGabri() {
    set('warned-gabri'); me('Don’t drink anything Ines gives you.');
    say('gabri', '(He laughs. Then he doesn’t.) …What?');
    affect('gabri', { t: 1.5 }); note('ines', 'You warned Gabri about Ines’s thermos.');
    set('gabri-confront'); // he will say it in front of everyone at the next dinner
  }
  function inesLosesGabri() {
    if (!alive('ines')) return; affect('ines', { g: 2 }, 'Gabri learned from you what Ines had put in the thermos. He has not let her near him since.');
    if (!has('ines-apology')) motive('ines', 'cup', 'You took the boy from her and made her a poisoner in front of him. She decided, very calmly, that you should at least go gently.', true);
  }
  function publicConfrontation() {
    set('gabri-confronted');
    say('gabri', '(Loudly, to the whole table.) Ines. Were you going to put me to sleep? With the thermos? Were you?');
    say(null, 'Every spoon stops. Ines folds her cloth in half, and in half again.');
    say('ines', '(Very quietly.) Who told you that.');
    say(null, 'Gabri looks at you. So does everyone else.');
    conflict('gabri', 'ines', 'Gabri accused Ines in front of the table'); affect('ines', { g: 2.2 }, 'You told Gabri about the thermos and he said it in front of everyone.');
    keys.forEach(k => { if (k !== 'ines' && k !== 'gabri' && alive(k)) affect(k, { f: .4 }); });
    if (!has('ines-apology')) motive('ines', 'cup', 'You took the boy from her and made her a poisoner in front of the whole table. She decided, very calmly, that you should at least go gently.', true);
  }
  // ---- the van, the count, the road -------------------------------------------------------
  function warnPino() { set('warned-pino'); me('Walter wants your van not to start.'); say('pino', '(Very still.) Walter. (He goes straight past you into the house.)'); later(15, () => { conflict('pino', 'walter', 'you told Pino what Walter had asked'); say(null, 'In the hall, Pino has Walter against the dresser by his coat. Nobody stops them. Il Primo watches from the table with his hands folded.'); set('walter-exposed'); if (has('walter-yes') || has('walter-inform')) motive('walter', 'lead', 'He gave you a task and you carried it straight to the man it was about. He was humiliated in the hall in front of Il Primo. He needs to know where the weight went, and it went to you.'); }); }
  function walterStopsPino() { set('pino-stopped'); later(10, () => { R.rotorIn = false; R.rotorBy = R.rotorBy || 'walter'; set('pino-turned'); note('pino', 'Walter reached the van before Pino did, because you told him.'); affect('pino', { g: 2.5, t: -2 }, 'You told Walter that Pino was leaving.'); pinoStuck(); }); }
  // after the dinner Pino goes out to the van; whoever is with him or against him is decided now
  function pinoGoes() {
    if (!alive('pino') || has('pino-gone') || has('pino-turned') || R.reqs.pino?.state !== 'done') return;
    if (!['accepted', 'bargained', 'postponed'].includes(R.reqs.pino.outcome)) { set('pino-turned'); later(40, () => { if (G.zone() === 'home') say(null, 'Pino went out to the van after dinner. Twenty minutes later he came back in and sat down without taking his jacket off.'); }); S.truths.push('Pino turned back at the combine a third time. Nobody was in the passenger seat.'); return; }
    if (has('pino-turned-plan')) { set('pino-turned'); say(null, 'Pino stays in his chair after dinner. He does not look at you.'); return; }
    set('pino-leaving');
    if (!has('walter-yes') && !has('walter-inform') && R.reqs.walter && alive('walter') && R.rotorIn) { R.rotorIn = false; R.rotorBy = 'walter'; note('walter', 'Walter took the rotor out of Pino’s van himself.'); later(20, () => primoRotor()); }
    if (G.zone() === 'home') say(null, 'Pino puts his jacket on and goes out to the yard. Nobody looks up except Walter.');
    leaveHouse('pino', () => { sendTo('pino', 'road', 4.6, -.2, Math.PI); R.pinoWait = now(); });
  }
  // Il Primo found a small part on the dresser. He does not know what it belongs to, he says.
  function primoRotor() { if (!alive('primo') || R.carry.has('rotor') || has('primo-rotor')) return; set('primo-rotor'); R.primoRotor = true; if (G.zone() === 'home') { say('primo', '(He holds out something small and black on his palm.) This was on the dresser. I think it belongs to a vehicle. I don’t know which. (The earplugs are in.) Do what you think is right.'); ch([['Take it.', () => { R.carry.add('rotor'); note('walter', 'Il Primo gave you the rotor Walter had taken.'); }], ['“Give it to Walter.”', () => { say(null, 'Il Primo puts it in his pocket and says nothing more about it.'); }]]); } }
  function vanScene() {
    if (has('van-scene')) return; set('van-scene'); set('van-came'); const promisedGabri = has('gabri-promised'), withGabri = promisedGabri && alive('gabri') && !has('gabri-asleep');
    if (!R.rotorIn) {
      say('pino', '(In the driver’s seat. He turns the key. Nothing. He turns it again.) …It’s gone. The rotor. Somebody’s had the rotor.');
      const opts = [];
      if (R.carry.has('rotor')) opts.push(['(Give him the rotor.)', () => { R.carry.delete('rotor'); R.rotorIn = true; say('pino', '(He stares at it in your hand. He doesn’t ask.) Get in.'); vanChoice(withGabri); }]);
      if (R.rotorBy === 'tobia') opts.push(['“I took it.”', () => { me('I took it.'); say('pino', '(He gets out of the van very slowly. He doesn’t touch you. He walks back toward the house.) You could have just said no.'); affect('pino', { g: 3, t: -2 }, 'You told Pino you had taken the rotor out of his van.'); pinoStuck(true); }]);
      if (R.rotorBy === 'walter') opts.push(['“Walter took it.”', () => { me('Walter took it.'); say('pino', 'Walter.'); set('walter-exposed'); conflict('pino', 'walter', 'you told Pino Walter had taken the rotor'); if (has('walter-yes') || has('walter-inform')) later(20, () => motive('walter', 'lead', 'You took his task and then gave his name to the man it was about. The weight went somewhere. It went to you.')); pinoStuck(false); }]);
      opts.push(['“I don’t know.”', () => { me('I don’t know.'); if (R.rotorBy === 'tobia') { set('lied-pino'); later(60, () => { if (alive('walter')) { note('pino', 'Walter told Pino who had actually taken the rotor.'); affect('pino', { g: 3 }, 'Walter told Pino you took the rotor.'); } }); } pinoStuck(R.rotorBy === 'tobia'); }]);
      ch(opts, { silence: () => pinoStuck(R.rotorBy === 'tobia') });
      return;
    }
    say('pino', '(The engine is running. He leans across and opens the passenger door.) Get in. Now, before I think.'); vanChoice(withGabri);
  }
  function vanChoice(withGabri) {
    const opts = [['Get in.', () => { set('tobia-left'); if (withGabri) set('gabri-came'); departWithPino(withGabri); }]];
    if (has('gabri-promised') && !withGabri) opts.push(['“Wait. Gabri.”', () => { me('Wait. Gabri.'); say('pino', 'No. (The door is still open.) Now or not.'); ch([['Get in.', () => { set('tobia-left'); departWithPino(false); }], ['“Go without me.”', () => { pinoLeavesAlone(); }]]); }]);
    opts.push(['“Go. I’m staying.”', () => { me('Go. I’m staying.'); pinoLeavesAlone(); }]);
    ch(opts, { silence: () => pinoLeavesAlone() });
  }
  function pinoLeavesAlone() {
    set('pino-gone'); G.flags.add('pino-left-alive'); say('pino', '(He looks at you once more, and pulls the door shut, and goes.)');
    const n = npcOf('pino'); if (n) { n.object.visible = false; n.fate = 'gone'; const L = G.home().interactables, i = L.indexOf(n); if (i >= 0) L.splice(i, 1); }
    if (R.van) R.van.visible = false;
    S.truths.push('Pino drove away before dawn, alone.');
    // the count is short, and Walter has to know where the weight went
    if (alive('walter') && (has('walter-yes') || has('walter-inform'))) later(25, () => motive('walter', 'lead', has('walter-yes') ? 'You told him you would take the rotor out, and Pino drove away. The count was short on the day Il Primo needed it whole. He needs to know where the weight went, and it went to you.' : 'You promised to tell him before Pino went, and you stood in the yard and watched him go.'));
    else if (alive('walter')) affect('walter', { g: .8 }, 'Pino drove away while you were in the yard.');
  }
  function pinoStuck(blamesTobia) {
    set('pino-turned'); const n = npcOf('pino'); if (n && n.borrowed) returnHome(n);
    if (blamesTobia && alive('pino')) later(150, () => { if (!alive('pino') || has('pino-gone')) return; memberDies('pino', '(Pino is not at breakfast. Later, Walter brings his jacket in from the edge of the wheat, where the track runs out at the canal.)', 'Pino walked out on the track through the wheat. This time he did not turn back at the combine. He had asked you for the way out.'); });
  }
  function departWithPino(withGabri) {
    S.ending = { id: withGabri ? 'departure' : (has('gabri-promised') || has('dario-yes') && !has('cellar-came') ? 'abandonment' : 'departure'), title: withGabri ? 'The Departure' : 'The Abandonment', small: withGabri ? 'ENDING · THE DEPARTURE' : 'ENDING · THE ABANDONMENT',
      copy: withGabri ? 'Pino drove with both hands on the wheel and did not turn back at the combine. Gabri slept against the window. None of you understood what you had left, only that it was behind you. Il Primo was on the porch as you passed, his hand raised against the headlights, the orange earplugs in.' : `Pino did not turn back at the combine. You watched the farmhouse go small in the mirror. ${has('gabri-promised') ? 'Gabri would be at the fridge, waiting for the sound of the van. You had told him yes.' : 'Behind you, thirteen people sat down to a table with one empty place.'} Il Primo was on the porch, his hand raised against the headlights, the orange earplugs in.`,
      voice: withGabri ? 'An escape is not a victory.' : 'You survived. Somebody else paid for the seat.', ledger: [...new Set(R.log.slice(-6).map(l => l.text).concat(S.truths.slice(-2)))] };
    G.end(S.ending, true);
  }
  // ---- the account: who told Tobia about Aurelio ----------------------------------------
  function namedFranco(asker) {
    set('named-franco'); note('franco', has('franco-lie-yes') ? 'You promised Franco you would say Sergio, then told Dario it was Franco.' : 'You told Dario it was Franco who told you about Aurelio.');
    later(30, () => { if (alive('franco')) { say(null, has('franco-lie-yes') ? 'Across the room Franco hears Dario say his name, and puts the cleaver down very carefully.' : 'Franco hears his name in Dario’s mouth.'); } });
    set('seat-dario-franco');
    if (has('franco-asked')) later(90, () => motive('franco', 'cleaver', has('franco-lie-yes') ? 'He asked you for one small lie and you promised it. Then you gave Dario his name. He has been afraid of Dario for fifty years; now he is more afraid of the one who talks.' : 'He asked you to protect him from Dario and you gave Dario his name instead. Fear makes him practical.', true));
  }
  function namedSergio() {
    set('named-sergio'); note('sergio', 'You told Dario it was Sergio who told you about Aurelio. It was not.'); conflict('dario', 'sergio', 'you told Dario that Sergio had talked');
    affect('franco', { t: 1 });
    // Dario will take Sergio to see the canal after the next dinner, unless something changes
    set('dario-sergio-plan');
  }
  function warnSergio() { set('warned-sergio'); me('Stay away from Dario tonight. He thinks you told me about the priest.'); say('sergio', '(He takes a long time to light his cigarette.) And who told him that.'); affect('sergio', { g: 1.6, t: -1 }, 'Sergio worked out you had given Dario his name to protect someone else.'); say('sergio', 'Fifty years I didn’t go in. I can not go in for one more night.'); }
  function retract() { set('retracted'); me('It wasn’t Sergio who told me. I lied.'); say('dario', '(He looks at you the way he looks at the altar.) Then who.'); ch([['“Franco.”', () => { me('Franco.'); namedFranco('dario'); affect('dario', { g: .6 }, 'You lied to Dario about Sergio before you told him the truth.'); }], ['“I won’t say.”', () => { me('I won’t say.'); affect('dario', { g: 1.2 }, 'You admitted you had lied to Dario and would not say who had really told you.'); }]]); }
  function sergioCanal() {
    if (!has('dario-sergio-plan') || has('retracted') || has('warned-sergio') || !alive('sergio') || !alive('dario')) return;
    if (G.zone() === 'home' && canalComplicity()) return;
    set('sergio-gone-out'); if (G.zone() === 'home') say(null, 'After dinner Dario asks Sergio to come and look at the canal with him. Sergio laughs, and goes.');
    later(120, () => { if (!alive('sergio')) return; memberDies('sergio', '(Dario comes back alone, with wet shoes, and sits down and says grace over nothing.)', 'Sergio went to look at the canal with Dario and did not come back. Dario believed Sergio had told you about Aurelio, because you said so. It had been Franco.');
      if (alive('franco')) later(60, () => motive('franco', 'cleaver', 'You said Sergio’s name because he asked you to. Then Sergio was in the canal. Franco cannot carry that, so he has put it down on you.', true)); });
  }
  // ---- the cellar ---------------------------------------------------------------------
  function darioGoesDown() {
    if (!alive('dario') || has('cellar-over') || !R.reqs.dario || R.reqs.dario.outcome !== 'accepted') return;
    set('dario-down'); if (G.zone() === 'home') say(null, 'Dario gets up from the table and goes to the cellar hatch. Il Primo watches him go.');
    leaveHouse('dario', () => { sendTo('dario', 'cellar', 0, -.6, Math.PI); });
    later(240, () => { if (!has('cellar-came') && !has('cellar-over')) { set('cellar-over'); const n = npcOf('dario'); if (n) returnHome(n); affect('dario', { g: 2 }, 'You promised to sit with Dario in the cellar and you did not come.'); if (G.zone() === 'home') say('dario', '(Back at the table, to nobody.) Nobody came.'); if (S.rel.dario.marked || has('lied-aurelio')) motive('dario', 'cord', 'You promised to watch him and left him alone with it. He has decided Il Bianco has started in you instead, and that he will be the one who sees it finish.'); } });
  }
  function cellarScene() {
    set('cellar-came'); set('cellar-over');
    say(null, 'Dario is kneeling at the turntable. The record turns without a sound. He has taken nothing out of his ears; there was nothing in them.');
    say('dario', 'Listen. (Nothing.) There. Do you hear it filling? (His nose has started to bleed. He doesn’t wipe it.)');
    say(null, 'He presses both hands over his own mouth and nose and holds them there.');
    ch([
      ['“Dario. I’m looking at you. I see you.”', () => { me('Dario. I’m looking at you. I see you.'); say(null, 'His hands come down. He starts to cry like someone who has been holding it since he was nineteen.'); affect('dario', { t: 3, g: -3 }); set('dario-seen'); returnHome(npcOf('dario')); }],
      ['(Hold his wrists.)', () => { say(null, 'He fights you, hard, then all at once he stops.'); affect('dario', { t: 1.5, g: -1 }); returnHome(npcOf('dario')); }],
      ['(Watch.)', () => { say(null, 'You watch. After a long time his hands relax. He is smiling.'); memberDies('dario', '(Dario is lying by the turntable when they come down for the record. He is smiling.)', 'Dario filled himself in the cellar with his hands over his mouth. You were there. You watched, because he asked you to.'); }],
      ['(Go back up the stairs.)', () => { say(null, 'You go. Behind you, the needle hisses in the run-out groove.'); memberDies('dario', '(Dario is lying by the turntable when they come down for the record. Nobody was with him.)', 'Dario filled himself in the cellar. You went down, saw what he was doing, and went back up.'); }]
    ], { timeout: 14, silence: () => memberDies('dario', '(Dario is lying by the turntable when they come down for the record. He is smiling.)', 'Dario filled himself in the cellar while you stood there and said nothing.') });
  }
  // ---- the five places where it can happen ----------------------------------------------
  function updateMotives(dt) {
    for (const m of Object.values(R.motives)) {
      if (!m.alive || R.dead.has(m.k) || R.scene) continue;
      const age = now() - m.born;
      if (m.kind === 'lead' && !m.placed && age > 30) { m.placed = true; if (G.zone() === 'home' && alive('primo')) say('primo', 'Walter has gone to the church with the charges. He asked if you would give him a hand. (He says it to his plate.)'); sendTo('walter', 'road', 33.5, -14.2, Math.PI * .9); }
      if (m.kind === 'cleaver' && !m.placed && age > 25 && G.zone() === 'home' && !S.ui) { m.placed = true; say(null, 'Franco gets up, takes the joint from the cold larder, and goes to the kitchen table to cut it.'); walkTo('franco', [[-7.75, npcOf('franco')?.object.position.z ?? 0], [-7.75, -5.2], [-8.05, -5.75]], () => { const n = npcOf('franco'); if (n) n.object.rotation.y = Math.PI; }); }
      if (m.kind === 'cord' && !m.placed && age > 40 && G.zone() === 'home' && !S.ui && near('dario', 12)) { m.placed = true; say('dario', '(He stops beside your chair.) Come down later. I’ll show you instead.'); later(6, () => leaveHouse('dario', () => sendTo('dario', 'cellar', 0, -.6, Math.PI))); }
      if (!G.canAct() || S.ui || G.linesBusy()) continue;
      if (m.kind === 'cup' && age > 50 && G.zone() === 'home' && near('ines', 14) && (S.seated || alone(3.5, ['ines']))) { cupScene(m); return; }
      if (m.kind === 'fridge' && age > 40 && G.zone() === 'home' && near('gabri', 3.2) && alone(5, ['gabri'])) { fridgeScene(m); return; }
      if (m.kind === 'lead' && m.placed && G.zone() === 'road' && near('walter', 7)) { leadScene(m); return; }
      if (m.kind === 'cleaver' && m.placed && inKitchen() && near('franco', 2.8)) { cleaverScene(m); return; }
      if (m.kind === 'cord' && m.placed && G.zone() === 'cellar' && near('dario', 3.4)) { cordScene(m); return; }
    }
  }
  const mercy = () => G.difficulty() === 0;
  function cupScene(m) {
    R.scene = 'cup'; const n = npcOf('ines'), p = playerPos();
    walkTo('ines', [[p.x + .8, p.z + .4]], () => {});
    say('ines', 'You look cold. Here — (A cup, steaming.) For the nose. Drink it while it’s warm.');
    ch([
      ['(Drink it.)', () => { if (mercy()) { say(null, 'Ines’s hand stops your wrist halfway. She takes the cup back without a word and pours it into the husband’s bowl.'); defuse('ines', 'Ines could not let you drink it.'); R.scene = null; return; } kill('ines', 'cup'); }],
      ['“You drink first.”', () => { me('You drink first.'); say(null, 'She holds the cup for a long moment. Then she sets it down on the table and sits, as if her legs have gone.'); say('ines', 'I can’t. I never can. I only ever do it for other people.'); defuse('ines', 'You asked Ines to drink first.'); R.scene = null; }],
      ['“Ines, I know what’s in it.”', () => { me('Ines, I know what’s in it.'); say('ines', '(She doesn’t move.) Then you know I meant it kindly.'); defuse('ines', 'You told Ines you knew what was in the cup.'); R.scene = null; }],
      ['(Leave it on the table.)', () => { say(null, 'She watches the cup go cold. Then she pours it into the husband’s bowl and goes back to the stove.'); m.born = now() + 60; R.scene = null; }]
    ], { timeout: 14, silence: () => { say(null, 'She lifts the cup to your mouth herself, the way she has lifted a hundred cups to a hundred mouths.'); if (mercy()) { defuse('ines', 'She could not finish it.'); R.scene = null; } else kill('ines', 'cup'); } });
  }
  function fridgeScene(m) {
    R.scene = 'fridge';
    say('gabri', '(Bright, too bright.) Sit with me. The light’s enough for two.');
    ch([
      ['(Sit down beside him.)', () => { if (mercy()) { say(null, 'His hand comes out from behind his back with the bread knife in it, and stays there, shaking. He puts it on the floor.'); defuse('gabri', 'Gabri could not do it.'); R.scene = null; return; } kill('gabri', 'fridge'); }],
      ['“I knew what was in the thermos, Gabri. I’m sorry.”', () => { me('I knew what was in the thermos, Gabri. I’m sorry.'); say(null, 'He looks at you as if nobody has ever told him the truth before. The bread knife, which was behind his back, goes on the floor between his feet.'); defuse('gabri', 'You told Gabri the truth about the thermos, at the fridge.'); R.scene = null; }],
      ['“Not now, Gabri.”', () => { me('Not now, Gabri.'); say('gabri', '(He laughs.) It’s never now.'); m.born = now(); R.scene = null; }]
    ], { timeout: 12, silence: () => { say('gabri', 'Sit.'); R.scene = null; m.born = now() - 30; } });
  }
  function leadScene(m) {
    R.scene = 'lead';
    say('walter', 'Good. Hands. (He holds out the end of a red lead.) Hold this. Stand there by the wall and don’t let it go slack. I’ll check the line and call you back.');
    ch([
      ['(Take the lead.)', () => { if (mercy()) { say(null, 'He walks fifty paces down the lane and stops, and stands there a long time, and then calls you back.'); defuse('walter', 'Walter called you back.'); R.scene = null; return; } kill('walter', 'lead'); }],
      ['“Hold it yourself.”', () => { me('Hold it yourself.'); say('walter', '(He coils it slowly.) Another time.'); m.born = now(); R.scene = null; }],
      ['“It wasn’t your fault, Walter. He was always going to go.”', () => { me('It wasn’t your fault, Walter. He was always going to go.'); say(null, 'Walter stands with the coil of red lead in both hands like someone told, at last, where the weight goes.'); defuse('walter', 'You told Walter where the weight had gone.'); returnHome(npcOf('walter')); R.scene = null; }]
    ], { timeout: 14, silence: () => { say(null, 'He puts the lead in your hand himself and walks away along the lane, measuring.'); if (mercy()) { defuse('walter', 'He could not do it.'); R.scene = null; } else kill('walter', 'lead'); } });
  }
  function cleaverScene(m) {
    R.scene = 'cleaver';
    say('franco', 'So the priest gets on the scooter— (He lets it die.) Come here. Hold the joint for me. Both hands.');
    ch([
      ['(Hold the joint.)', () => { if (mercy()) { say(null, 'The cleaver comes down an inch from your fingers and stays there.'); defuse('franco', 'Franco missed on purpose.'); R.scene = null; return; } kill('franco', 'cleaver'); }],
      ['“Why do you keep the knife so clean, Franco?”', () => { me('Why do you keep the knife so clean, Franco?'); say(null, 'Franco looks at the blade. Thirty years, and nobody has asked.'); say('franco', 'So it doesn’t look like what it is. (He puts it down.) Go on. Go and eat.'); defuse('franco', 'You asked Franco why he keeps the knife clean.'); R.scene = null; }],
      ...(has('named-franco') && !has('dario-sergio-plan') ? [['“Dario made me say it. I’m sorry.”', () => { me('Dario made me say it. I’m sorry.'); say('franco', 'Dario didn’t make you. (But he puts the cleaver down.) Get out of my kitchen.'); defuse('franco', 'You apologised to Franco in the kitchen.'); R.scene = null; }]] : []),
      ['(Walk out of the kitchen.)', () => { m.born = now(); R.scene = null; }]
    ], { timeout: 12, leave: () => { m.born = now(); R.scene = null; }, silence: () => { if (mercy()) { defuse('franco', 'He couldn’t.'); R.scene = null; } else kill('franco', 'cleaver'); } });
  }
  function cordScene(m) {
    R.scene = 'cord';
    say('dario', '(He is kneeling at the turntable.) Kneel with me. Just for a moment. I want to show you what it is.');
    ch([
      ['(Kneel.)', () => { if (mercy()) { say(null, 'Something cold touches your throat and is taken away again. Behind you Dario is crying.'); defuse('dario', 'Dario could not finish it.'); R.scene = null; return; } kill('dario', 'cord'); }],
      ['“Dario. I see you.”', () => { me('Dario. I see you.'); say(null, 'The rosary in his hands, wound twice round his knuckles, goes slack.'); defuse('dario', 'You told Dario you saw him, in the cellar.'); returnHome(npcOf('dario')); R.scene = null; }],
      ['(Go back up the stairs.)', () => { m.born = now(); R.scene = null; }]
    ], { timeout: 12, leave: () => { m.born = now(); R.scene = null; }, silence: () => { if (mercy()) { defuse('dario', 'He could not.'); R.scene = null; } else kill('dario', 'cord'); } });
  }
  const DEATH = {
    cup: 'Ines held the cup to your mouth the way she had held it to a hundred mouths on the ward, and kept her other hand on the back of your neck, warm, until you were asleep, and then after. “There,” she said. “Nobody here fills alone.”',
    fridge: 'Gabri waited until you sat down in the fridge light. The bread knife was behind his back the whole time he was smiling. Afterwards he sat with you for an hour, talking, because for once someone was not going to leave.',
    lead: 'Walter walked back along the lane, paying out the line, measuring. You counted to sixty, then to a hundred. He did not call you back. He checked the line twice; he always checks it twice.',
    cleaver: 'Franco never finished the joke. Thirty years of clean cuts for strangers’ tables. Afterwards he washed the blade, and the board, and his hands, and sat down to eat.',
    cord: 'Dario prayed first, kneeling behind you, and then the rosary went round your throat, twice, the way he winds it round his knuckles at grace. He wanted to see Il Bianco finish in someone. He watched very carefully.',
    cloth: 'Ines came up behind you with the white cloth she is always folding and held it over your mouth and nose, and hummed, the way she does on the ward at four in the morning, until Il Bianco had filled you. Nobody here fills alone.',
    knife: 'You heard the floor once, behind you. Then the knife, which is an ordinary bread knife, the one on the kitchen table, the one everybody uses.',
    burin: 'Marta came from behind with her burin, the way she cuts a figure into the grain: one long stroke, and then the small careful ones. Afterwards she carved it, and in the carving it was you who had done something to her first.',
    hands: 'Hands, from behind, on your throat. No word. Somebody counting under their breath, the way a man counts a load.',
    belt: 'A belt, from behind, pulled tight by a man who had spent fifty years not going in. This time he went in.',
    cushion: 'A cushion from the settle, over your face, held by someone very light who hummed four notes and stopped on the fifth, where there is only breath.',
    van: 'The van came out of the fog with its lights off and did not brake. Afterwards they said it was the fog. Nobody on the provinciale could see anything that night.',
    gas: 'The hatch did not open. The vents had been taped over from outside. It was sweet, and then it was heavy, and then it was white. Sergio had always said that was all Il Bianco ever was.',
    collapse: 'The charges under the pews went at the second hiss. The church came down inward, the way Walter had measured it to, with you on the altar step looking for a tape measure that was never there.',
    hook: 'The hoist chain let go. The hook came down where you were standing, the one they hang the carcasses from, and Franco had oiled the ratchet that morning.'
  };
  function kill(k, kind) {
    if (mercy()) { say(null, `At the last moment ${nm(k)} cannot. ${pick(['Their hands drop.', 'They step back into the dark.', 'They are crying.'])}`); defuse(k, `${nm(k)} could not go through with it.`); R.scene = null; R.armed = null; G.el('gas')?.style.setProperty('opacity', '0'); return; }
    R.scene = 'dead'; const m = R.motives[k];
    G.audio()?.killSting?.(); G.glitch?.(2);
    const lines = [m?.why || ''];
    lines.push(...R.log.filter(l => l.k === k).map(l => l.text).slice(-5));
    lines.push(...S.truths.filter(t => /Il Primo|watches|arranged/.test(t)).slice(-1));
    if (R.napkins && S.napkinText) lines.push('Livia had warned you. ' + S.napkinText.replace(/^\(A napkin[^)]*\)\s*/, ''));
    const could = ({ cup: 'An apology, before. Or asking her to drink first.', fridge: 'The truth about the thermos. He had never been told the truth.', lead: 'Telling him where the weight went. Or not holding anything for him.', cleaver: 'Anyone asking him why he keeps the knife so clean.', cord: 'Being looked at. That was all he had ever asked for.', gas: 'Not going down. Or the vent, on the wall to the left.', collapse: 'Leaving at the first hiss.', hook: 'Stepping out from under the chain when it ratcheted.', van: 'Stepping off the road when you heard the engine.' })[kind] || 'Turning round. Saying the one thing they needed to hear, face to face. Not being alone with them.';
    lines.push('What would have stopped it: ' + could);
    G.el('gas')?.style.setProperty('opacity', '0');
    S.ending = { id: 'assassination', title: { cup: 'The Cup', fridge: 'The Fridge Light', lead: 'The Line', cleaver: 'The Board', cord: 'The Cellar', cloth: 'The Cloth', knife: 'The Bread Knife', burin: 'The Burin', hands: 'Hands', belt: 'The Belt', cushion: 'The Cushion', van: 'The Road', gas: 'The Vents', collapse: 'The Church', hook: 'The Hook' }[kind] || 'The Assassination', small: 'ENDING · THE ASSASSINATION', copy: DEATH[kind] + ' Il Primo had his earplugs in. When they told him, he asked who had been with you, and wrote the name down.', voice: 'There was no monster. There was a reason, and nobody near you.', ledger: [...new Set(lines.filter(Boolean))].slice(0, 9) };
    G.end(S.ending, true);
  }
  // ===================================================================================
  // v25 — THE CLICK. When something Tobia says or does makes a particular person decide he has
  // to disappear, that person stops being a face at the table. Their chair is empty. They are in
  // the rooms he walks into, behind him on the stairs, moving only when he is not looking. They
  // kill with what is in their own hands. They send him on errands into rooms that are already
  // set. And sometimes they ask him to hold the lamp while they kill somebody else.
  // ===================================================================================
  const HIDDEN = { ines: true, gabri: true, franco: true, anna: true, marta: true, livia: true };
  const TOOL = { ines: ['cloth', 'the white cloth she is always folding'], gabri: ['knife', 'the bread knife'], franco: ['cleaver', 'the cleaver'], anna: ['knife', 'the long kitchen knife'], marta: ['burin', 'her burin'], dario: ['cord', 'his rosary'], walter: ['hands', 'his hands'], pino: ['hands', 'his hands'], sergio: ['belt', 'his belt'], livia: ['cushion', 'a cushion from the settle'], ottavio: ['hands', 'his hands'] };
  const LIES = { franco: 'Looking for the lamp oil. You?', marta: 'The light is better for the beams in here.', gabri: 'I was just walking. Can’t I walk?', anna: 'Ines sent me to find you. Dinner.', dario: 'I was praying. You interrupted.', sergio: 'Thought I heard you. Wanted a smoke, that’s all.', livia: '(She hums the four notes and smiles.)', walter: 'Measuring. Somebody has to.', pino: 'Getting something from the van.', ines: 'There you are. You look pale. Come here, let me see your nose.', ottavio: '(He holds up his palm: listening to the floor.)' };
  // a sudden decision, made in a second, by one person, for one reason
  function click(k, why) {
    if (!k || k === 'primo' || G.difficulty() === 0 && false) return;
    if (R.dead.has(k) || live(k) || (SOCIAL[k]?.violence ?? 0) < .1) return;
    motive(k, 'stalk', why, !!HIDDEN[k]);
    if (G.zone() === 'home' && near(k, 9)) G.line(pick([`(${nm(k)} looks at you, once, and then very carefully at nothing.)`, `(Something goes out of ${nm(k)}’s face, the way a light goes out in another room.)`, `(${nm(k)} laughs at something nobody said.)`]));
  }
  // ---- following ---------------------------------------------------------------------
  const solidAt = (Z, x, z, m = .3) => Z.solids.some(o => x + m > o.minX && x - m < o.maxX && z + m > o.minZ && z - m < o.maxZ);
  const los = (Z, a, b) => { for (let i = 1; i < 10; i++) { const x = a.x + (b.x - a.x) * i / 10, z = a.z + (b.z - a.z) * i / 10; if (solidAt(Z, x, z, 0)) return false; } return true; };
  function hidingSpot(Z, from, near_ = [7, 15]) {
    const b = Z.bounds; let best = null, bs = -1e9;
    for (let i = 0; i < 60; i++) { const x = b.minX + 1 + Math.random() * (b.maxX - b.minX - 2), z = b.minZ + 1 + Math.random() * (b.maxZ - b.minZ - 2); if (solidAt(Z, x, z, .45)) continue; const d = Math.hypot(x - from.x, z - from.z); if (d < 4) continue; let sc = -Math.abs(d - (near_[0] + near_[1]) / 2) * .4; if (!los(Z, from, { x, z })) sc += 5; if (solidAt(Z, x, z, 1.1)) sc += 2; if (sc > bs) { bs = sc; best = { x, z }; } }
    return best;
  }
  const visRange = () => (G.flashlight() ? 13 : 7.5) * (1 - .6 * B.distort) * (B.wipe > 0 ? 0 : 1);
  function sees(n) { const Z = zoneOf(G.zone()), o = n.object.position, p = playerPos(), d = Math.hypot(o.x - p.x, o.z - p.z); if (d > visRange()) return false; G.camera.getWorldDirection(tmp2); const dot = (tmp2.x * (o.x - p.x) + tmp2.z * (o.z - p.z)) / (Math.hypot(tmp2.x, tmp2.z) * (d || 1)); if (dot < (d < 2 ? .35 : .72)) return false; return los(Z, p, o); }
  function stalkers() { return Object.values(R.motives).filter(m => m.alive && !R.dead.has(m.k) && m.hunt); }
  function release(m) { m.hunt = { state: 'away', where: null, t: 0, seenT: 0, cd: 0 }; const n = npcOf(m.k); if (n) { keepHome(n); n.hunting = true; if (G.zone() === 'home' && sameZone(n)) leaveHouse(m.k, () => { n.object.visible = false; }); else n.object.visible = false; } }
  function placeH(m, zone, x, z, yaw) { sendTo(m.k, zone, x, z, yaw); const n = npcOf(m.k); n.hunting = true; n.borrowed = true; m.hunt.where = zone; m.hunt.t = 0; m.hunt.seenT = 0; const Z = zoneOf(zone); if (m.hunt.entry) { const L = m.hunt.entryZone.interactables, i = L.indexOf(m.hunt.entry); if (i >= 0) L.splice(i, 1); } m.hunt.entry = { id: 'stalk-' + m.k, type: 'social', object: n.object, point: n.object.position, radius: 2.6, prompt: '[ E ] SPEAK — ' + UP(m.k), run: () => faceH(m, true) }; m.hunt.entryZone = Z; Z.interactables.push(m.hunt.entry); }
  function offH(m) { const h = m.hunt; h.where = null; h.state = 'away'; const n = npcOf(m.k); if (n) { n.object.visible = false; n.walking = false; } if (h.entry) { const L = h.entryZone.interactables, i = L.indexOf(h.entry); if (i >= 0) L.splice(i, 1); h.entry = null; } }
  function stalkersOnEnter(name) {
    for (const m of stalkers()) {
      const h = m.hunt; if (h.where && h.where !== name) offH(m);
      if (R.trap && R.trap.zone === name && R.trap.k === m.k) continue;   // the trap places them itself
      const Z = zoneOf(name); if (!Z) continue;
      if ((m.k === 'pino' || m.k === 'walter') && name === 'road' && Math.random() < .5) { h.vanAt = now() + 10 + Math.random() * 20; continue; }
      const chance = .5 + Math.min(.3, S.rel[m.k].grievance * .04) + (B.on ? .15 : 0);
      if (Math.random() < chance) { const sp = hidingSpot(Z, playerPos()); if (sp) { placeH(m, name, sp.x, sp.z, Math.random() * 6.28); h.state = 'hide'; continue; } }
      h.state = 'follow'; h.followAt = now() + 9 + Math.random() * 18; h.followZone = name;
    }
  }
  function stepH(m, tx, tz, sp, dt) { const Z = zoneOf(m.hunt.where), n = npcOf(m.k), o = n.object.position, dx = tx - o.x, dz = tz - o.z, d = Math.hypot(dx, dz) || 1, st = sp * dt; let nx = o.x + dx / d * st, nz = o.z + dz / d * st, moved = false; if (!solidAt(Z, nx, o.z, .25)) { o.x = nx; moved = true; } if (!solidAt(Z, o.x, nz, .25)) { o.z = nz; moved = true; } if (!moved) { const sx = o.x - dz / d * st, sz = o.z + dx / d * st; if (!solidAt(Z, sx, sz, .25)) { o.x = sx; o.z = sz; } } n.walking = true; G.turn(n, tx, tz, dt, 5); }
  function updateStalkers(dt) {
    for (const m of Object.values(R.motives)) {
      if (!m.alive || R.dead.has(m.k) || m.hunt) continue;
      // the face at the table lasts a while; the placed ones wait in their place first
      const wait = m.kind === 'stalk' ? (m.hidden ? 50 : 18) : 150;
      if (now() - m.born > wait && !(G.zone() === 'home' && near(m.k, 4))) { if (m.placed) { const n = npcOf(m.k); if (n) returnHome(n); } release(m); }
    }
    const act = G.canAct() || B.wipe > 0;
    for (const m of stalkers()) {
      const h = m.hunt; h.t += dt; h.cd = Math.max(0, h.cd - dt);
      if (h.state === 'follow' && now() >= h.followAt) { if (G.zone() === h.followZone && act) { const sp = zoneOf(G.zone()).spawn; placeH(m, G.zone(), sp.x + (Math.random() - .5), sp.z + (Math.random() - .5), 0); h.state = 'stalk'; G.audio()?.doorCreak?.(); G.line(pick(['(Behind you, the door. Somebody else has come in.)', '(A latch. Footsteps that stop when yours stop.)', '(The door again. Nobody says anything.)'])); } else h.state = 'away'; }
      if (h.vanAt && now() >= h.vanAt && G.zone() === 'road' && !R.van2 && act) { h.vanAt = 0; launchVan(m); }
      if (h.where !== G.zone() || !act || R.scene) { const n = npcOf(m.k); if (n?.walking) n.walking = false; continue; }
      const n = npcOf(m.k), o = n.object.position, p = playerPos(), d = Math.hypot(o.x - p.x, o.z - p.z), seen = sees(n);
      const others = G.zone() === 'home' ? present().filter(x => x.key !== m.k && !live(x.key) && dist2(x) < 6.5).length : 0;
      if (seen) { h.seenT += dt; n.walking = false; G.turn(n, p.x, p.z, dt, 2); if (h.state === 'stalk' && d < 3.2 && !h.faced && !S.ui) faceH(m, false); if (h.seenT > 6 && d > 5) reHideH(m); continue; }
      h.seenT = 0; if (d < 9) tense(dt * .012);
      if (h.state === 'hide' && (d < 5.5 || (h.t > 25 && Math.random() < dt * .05))) h.state = 'stalk';
      if (h.state === 'stalk' || h.state === 'faced') {
        if (others) { n.walking = false; continue; }
        const sp = (1.05 + Math.min(.6, S.rel[m.k].grievance * .05)) * (B.wipe > 0 ? 2.2 : 1) * (now() < (h.boldUntil || 0) ? 1.5 : 1);
        stepH(m, p.x, p.z, sp, dt);
        if (d < 2.7) { h.cueT = (h.cueT || 0) - dt; if (h.cueT <= 0) { h.cueT = 2.2; G.audio()?.footstep?.('wood', false, Math.random() < .5 ? -1 : 1); if (Math.random() < .4) G.audio()?.mechanicalNoise(.8, 380, .7, .03, 0); } }
        if (d < 1.0 && h.cd <= 0 && !S.ui) { strikeH(m); return; }
      }
    }
    updateVan2(dt); updateTrap(dt);
  }
  function reHideH(m) { const Z = zoneOf(m.hunt.where), sp = hidingSpot(Z, playerPos(), [9, 16]); if (!sp) return; m.hunt.state = 'hide'; m.hunt.t = 0; const n = npcOf(m.k); n.walking = false; n.object.position.set(sp.x, 0, sp.z); }
  // face to face, they are ordinary; whatever they needed is still the way out
  function faceH(m, asked) {
    if (S.ui || R.scene) return; const h = m.hunt; h.faced = 1; h.state = 'faced';
    G.line(`${UP(m.k)}: ${LIES[m.k] || '…'}`);
    const opts = [], give = returnTo(m.k);
    if (give) opts.push([`Give back the ${({ photo: 'photograph', keys: 'keys', earplugs: 'earplugs' })[give]}.`, () => { S.carried.delete(give); defuse(m.k, `You gave ${nm(m.k)} back what you had taken.`); offH(m); returnHome(npcOf(m.k)); say(m.k, '(A long look.) Go and eat something.'); }]);
    const fix = { ines: '“I’m sorry, Ines. I took him from you.”', gabri: '“I’m sorry. I knew. I should have told you.”', walter: '“It wasn’t your fault, Walter. The weight went to me.”', franco: '“Why do you keep the knife so clean, Franco?”', dario: '“Dario. I see you.”', anna: '“I’m sorry about his bowl.”', marta: '“Carve me as I am, Marta. Not as they told you.”', pino: '“I know the way out. I’ll show you.”', sergio: '“You were right about Il Bianco.”', livia: '(Hum the four notes back to her.)' }[m.k];
    if (fix) opts.push([fix, () => { G.line('TOBIA: ' + fix.replace(/[“”]/g, '')); const ok = m.kind !== 'stalk' || (S.rel[m.k].grievance < 6.5 && SOCIAL[m.k].care >= .3) || ['dario', 'franco', 'walter'].includes(m.k); if (ok) { defuse(m.k, `You said the one thing ${nm(m.k)} needed to hear, face to face, in the dark.`); offH(m); returnHome(npcOf(m.k)); say(null, `${nm(m.k)} stands there a long time, then goes back to the house without a word.`); } else { say(null, `${nm(m.k)} smiles as if you had said something kind, and does not move.`); h.boldUntil = now() + 5; h.state = 'stalk'; } }]);
    if (S.carried.has('knife')) opts.push(['(Let them see the knife.)', () => { affect(m.k, { f: 1.4 }); h.cd = 30; say(null, `${nm(m.k)} sees it, and smiles, and steps back into the dark.`); later(1.5, () => reHideH(m)); }]);
    opts.push(['(Back away.)', () => { h.state = 'stalk'; h.cd = 6; }]);
    G.queueAction(() => offer(UP(m.k), '', opts, { timeout: 9, onTimeout: () => { h.state = 'stalk'; h.boldUntil = now() + 5; }, leave: () => { h.state = 'stalk'; h.cd = 4; } }));
    later(25, () => { h.faced = 0; });
  }
  function strikeH(m) { const [kind] = TOOL[m.k] || ['hands']; kill(m.k, kind); }
  // ---- the van, driven by a person with a reason ---------------------------------------
  function launchVan(m) {
    const Z = zoneOf('road'), p = playerPos(); G.camera.getWorldDirection(tmp2); const back = new THREE.Vector3(-tmp2.x, 0, -tmp2.z).normalize();
    // one van only: if Walter's van is parked by the lane, that is the one that comes; otherwise Pino's
    // from the yard; only if neither is there is a van brought out of the fog
    const parked = G.parkedVan?.(), yard = R.van?.visible ? R.van : null, v = parked || yard || G.buildVan(Z.group);
    const home = (parked || yard) ? { pos: v.position.clone(), rot: v.rotation.y } : null;
    if (parked || yard) { const d = Math.hypot(v.position.x - p.x, v.position.z - p.z); if (d < 14) v.position.set(p.x + back.x * 40, 0, p.z + back.z * 40); }
    else v.position.set(p.x + back.x * 46, 0, p.z + back.z * 46);
    v.traverse(o => { if (o.isSpotLight) o.intensity = 0; });
    R.van2 = { v, m, sp: 4, aim: new THREE.Vector3(p.x, 0, p.z), t: 0, passed: false, home };
    G.audio()?.mechanicalTone(55, 90, 6, 'sawtooth', .03, 0);
  }
  // a borrowed van goes back where it was parked, as if nothing had happened; a conjured one is removed
  function parkVan(V) { if (V.home) { V.v.position.copy(V.home.pos); V.v.rotation.y = V.home.rot; V.v.traverse(o => { if (o.isSpotLight) o.intensity = V.v.userData.parked ? 22 : 0; }); } else V.v.parent?.remove(V.v); }
  function updateVan2(dt) {
    const V = R.van2; if (!V) return;
    if (G.zone() !== 'road') { parkVan(V); R.van2 = null; return; }
    V.t += dt; const p = playerPos(), o = V.v.position;
    if (!V.passed) V.aim.lerp(new THREE.Vector3(p.x, 0, p.z), Math.min(1, dt * .9));
    V.sp = Math.min(19, V.sp + dt * 7);
    const dx = V.aim.x - o.x, dz = V.aim.z - o.z, d = Math.hypot(dx, dz) || 1;
    if (!V.dir) V.dir = new THREE.Vector3(dx / d, 0, dz / d);
    if (!V.passed) V.dir.lerp(new THREE.Vector3(dx / d, 0, dz / d), Math.min(1, dt * 1.6)).normalize();
    o.addScaledVector(V.dir, V.sp * dt); V.v.rotation.y = Math.atan2(V.dir.x, V.dir.z) + Math.PI;
    if (V.t > 1.2 && Math.random() < dt * 2) G.audio()?.mechanicalTone(70 + V.sp * 4, 60 + V.sp * 4, .4, 'sawtooth', .02 + Math.min(.05, 2 / Math.max(2, Math.hypot(p.x - o.x, p.z - o.z))), 0);
    if (Math.hypot(p.x - o.x, p.z - o.z) < 1.8 && !V.passed) { V.v.traverse(x => { if (x.isSpotLight) x.intensity = 90; }); R.van2 = null; kill(V.m.k, 'van'); return; }
    if (!V.passed && (V.dir.x * (p.x - o.x) + V.dir.z * (p.z - o.z)) < -1) { V.passed = true; G.line(pick(['(It goes past close enough to move your coat. No brake lights.)', '(Wind, metal, then the fog again. It did not stop.)'])); tense(.3); note(V.m.k, `${nm(V.m.k)} drove at you on the road, and missed.`); V.m.hunt && (V.m.hunt.vanAt = now() + 90 + Math.random() * 60); }
    if (V.t > 14) { parkVan(V); R.van2 = null; }
  }
  // ---- errands into rooms that are already set -------------------------------------------
  const ERRAND = {
    dario: ['cellar', 'Il Primo wants the record turned over. In the cellar. Now, before the others come down.'],
    walter: ['church', 'I left the tape measure on the altar step at the church. Fetch it for me? My knees.'],
    franco: ['abattoir', 'The joint for Sunday is in the cold room at the slaughterhouse. Bring it. It’s heavy, take your time.'],
    pino: ['road', 'Meet me out on the road, past the lamp. I’ll show you the track. Alone.'],
    gabri: ['ruin', 'There’s something in the empty house you have to see. Upstairs. I’ll wait for you there.'],
    ines: ['cellar', 'Fetch me the jar of honey from the cellar shelf, would you? My legs.'],
    anna: ['cellar', 'His trowel is in the cellar. Bring it up. I want it on the table tonight.'],
    marta: ['cellar', 'Go and look at the beam in the cellar. Look at it properly. Alone.'],
    sergio: ['road', 'Come out to the road. I’ve got something to show you about the report.'],
    livia: ['church', '(A napkin:) church. altar. come alone. i will sing it for you'],
    ottavio: ['cellar', '(He points down at the floor, then at you, then at the hatch.)']
  };
  const PLACE_NAME = { cellar: 'the cellar', church: 'the church', abattoir: 'the slaughterhouse', road: 'the road', ruin: 'the empty house' };
  function updateErrands(dt) {
    if (G.zone() !== 'home' || S.ui || !G.canAct() || S.gather.active || R.active || R.beckon || R.scene || G.linesBusy()) return;
    R.errandT = (R.errandT ?? 110) - dt; if (R.errandT > 0) return; R.errandT = 110 + Math.random() * 70;
    const killers = Object.values(R.motives).filter(m => m.alive && !R.dead.has(m.k));
    const friends = present().filter(p => p.key !== 'primo' && standing(p.key) > 1 && !live(p.key));
    let from, k, trap;
    if (killers.length && (Math.random() < .75 || !friends.length)) { const m = pick(killers); k = m.k; trap = true; const ally = present().find(p => p.key !== k && p.key !== 'primo' && S.between[p.key + '>tobia']); from = !m.hunt && who(k) ? k : (ally ? ally.key : (who(k) ? k : null)); if (!from) return; }
    else if (friends.length) { from = pick(friends).key; k = from; trap = false; }
    else return;
    const [zone, line] = ERRAND[k]; if (!zoneOf(zone) || (zone === 'abattoir' && !G.flags.has('visited-abattoir'))) return;
    const what = from === k ? line : `${nm(k)} wants you in ${PLACE_NAME[zone]}. Alone, ${['dario', 'walter', 'pino', 'franco', 'sergio', 'ottavio'].includes(k) ? 'he' : 'she'} said.`;
    G.line(`${UP(from)}: ${what}`);
    G.queueAction(() => offer(UP(from), '', [
      ['“All right.”', () => { R.trap = { zone, k, from, trap, what, until: now() + 150 }; }],
      ['“Why me?”', () => { say(from, pick(['Because you’re the one standing here.', 'Does it matter?', '(A shrug.) You were closest.'])); R.trap = { zone, k, from, trap, what, until: now() + 150 }; }],
      ['“Not now.”', () => { if (!trap) affect(from, { t: -.3 }); }]
    ], { timeout: 12 }));
  }
  // what is waiting in each room
  function trapsOnEnter(name) {
    const T = R.trap; if (!T || T.zone !== name || now() > T.until) return; R.trap = null;
    if (!T.trap) { R.friendNote = true; const ks = Object.values(R.motives).filter(m => m.alive).map(m => nm(m.k)); later(1.5, () => G.line(ks.length ? `(Nobody is here. On the floor by the door, a napkin in ${nm(T.from)}’s hand:) ${ks[0]} has decided. Do not be alone with ${ks[0]}.` : `(Nobody is here. ${nm(T.from)} has left a packet of tissues on the step.)`)); if (!ks.length) { B.tissues++; showPacket(3); } return; }
    const m = live(T.k); if (!m) return;
    note(T.k, `${nm(T.from)} sent you to ${PLACE_NAME[name]}: “${T.what}”`);
    R.armed = { kind: name, k: T.k, from: T.from, t: 0, what: T.what };
    if (name === 'cellar') { G.line('(Above you, the hatch drops shut. Something heavy is dragged across it.)'); G.audio()?.mechanicalNoise(.6, 180, .7, .12, 0); later(3, () => G.line('(A sweet, flat smell. The vents high in the wall have been taped over.)')); }
    else if (name === 'church') { later(2, () => { G.line('(A hiss, somewhere under the pews. A smell like a struck match that does not go out.)'); G.audio()?.mechanicalNoise(4, 3400, 2, .05, 0); }); }
    else if (name === 'abattoir') { later(2.5, () => { G.line('(Overhead, the hoist chain runs out a few links with a ratchet sound, and stops.)'); G.audio()?.mechanicalEvent?.('hoist'); }); }
    else if (name === 'road') { if (m.k === 'pino' || m.k === 'walter') { if (!m.hunt) release(m); m.hunt.vanAt = now() + 6; } else ambush(m, name); }
    else ambush(m, name);
  }
  function ambush(m, zone) { if (!m.hunt) release(m); const sp = zoneOf(zone).spawn; placeH(m, zone, sp.x + (Math.random() - .5) * 2, sp.z + 2.2, Math.PI); m.hunt.state = 'stalk'; m.hunt.boldUntil = now() + 6; }
  function updateTrap(dt) {
    const A = R.armed; if (!A) return;
    if (G.zone() !== A.kind) { if (A.kind === 'church' && A.t > 0) G.line('(Behind you, the church comes down inward. The sound arrives four seconds after the image.)'); R.armed = null; G.el('gas')?.style.setProperty('opacity', '0'); return; }
    if (!G.canAct()) return; A.t += dt; const p = playerPos();
    if (A.kind === 'cellar') {
      G.el('gas')?.style.setProperty('opacity', String(Math.min(.85, A.t / 32)));
      if (!A.vent) { const Z = zoneOf('cellar'), vent = new THREE.Mesh(new THREE.BoxGeometry(.5, .3, .05), G.mat(0x8a7a50, .8)); vent.position.set(-8.7, 2.3, -3); vent.rotation.y = Math.PI / 2; Z.group.add(vent); A.vent = { id: 'vent', type: 'social', object: vent, point: vent.position, radius: 2.6, prompt: '[ E ] TEAR THE TAPE OFF THE VENT', run: () => { G.line('(You claw the tape off. Cold air, and the sound of the yard.)'); Z.interactables.splice(Z.interactables.indexOf(A.vent), 1); vent.parent?.remove(vent); R.armed = null; G.el('gas')?.style.setProperty('opacity', '0'); note(A.k, 'You tore the tape off the cellar vent in time.'); later(4, () => G.line('(The hatch opens. Nobody is there.)')); } }; Z.interactables.push(A.vent); }
      if (A.t > 12 && !A.w1) { A.w1 = true; G.line('(Your head is heavy. Your nose is bleeding again and you did not feel it start.)'); if (!B.on) startBleed(); }
      if (A.t > 34) { R.armed = null; kill(A.k, 'gas'); }
    } else if (A.kind === 'church') { if (A.t > 13) { R.armed = null; kill(A.k, 'collapse'); } }
    else if (A.kind === 'abattoir') { const sp = zoneOf('abattoir').spawn; if (A.t > 5.5 && !A.drop) { A.drop = true; G.audio()?.mechanicalTone(300, 60, .5, 'sawtooth', .1, 0); if (Math.hypot(p.x - sp.x, p.z - sp.z) < 2.2) { R.armed = null; kill(A.k, 'hook'); } else { G.line('(The hook comes down where you were standing and swings, and swings.)'); R.armed = null; tense(.4); note(A.k, 'The hoist dropped where you had been standing.'); } } }
    else R.armed = null;
  }
  // ---- complicity: hold the lamp ------------------------------------------------------------
  function canalComplicity() {
    // instead of Sergio simply not coming back, Dario asks Tobia to come and hold the lamp
    if (!has('dario-sergio-plan') || has('retracted') || has('warned-sergio') || !alive('sergio') || !alive('dario') || has('canal-asked')) return false;
    set('canal-asked');
    say('dario', '(He stops beside you with a hurricane lamp.) Sergio wants to see the canal. Come with us. Hold the lamp. It’s dark on the bank.');
    ch([
      ['(Take the lamp and go.)', () => canalScene()],
      ['“Leave him alone, Dario.”', () => { me('Leave him alone, Dario.'); say('dario', 'You told me his name. (He goes out with Sergio anyway.)'); later(100, () => sergioCanalDies(false)); click('dario', 'You gave him Sergio’s name, and then tried to take it back in front of him. He decided you were the one who lies to him.'); }],
      ['“I’m not going.”', () => { me('I’m not going.'); later(100, () => sergioCanalDies(false)); }]
    ], { silence: () => later(100, () => sergioCanalDies(false)) });
    return true;
  }
  function canalScene() {
    // the east bank of the canal, facing the water; the only light is the lamp in Tobia's hand
    const T = { x: -24.9, z: 10 }, V = (x, y, z) => new THREE.Vector3(x, y, z);
    sendTo('sergio', 'road', T.x, T.z, -Math.PI / 2); sendTo('dario', 'road', T.x + .75, T.z + .15, -Math.PI / 2);
    const s = npcOf('sergio'), d = npcOf('dario');
    const lamp = new THREE.PointLight(0xffa850, 9, 9, 1.6); lamp.position.set(T.x + 2.4, 1.15, T.z + 1.1); lamp.castShadow = false;
    runScene([
      { do: () => { G.fade(true, .4); G.enter('road', [T.x + 3, 0, T.z + 1.6]); zoneOf('road').group.add(lamp); } }, { wait: .5 },
      { do: () => G.fade(false, 1), shot: { pos: V(T.x + 3.1, 1.5, T.z + 1.7), look: V(T.x + .3, .95, T.z), fov: 52 } },
      { say: 'SERGIO: (looking at the black water) Fifty years. I never came down here at night. Funny.' },
      { say: '(Dario sets his hand on the back of Sergio’s neck, gently, the way you steady a man on a slope.)' },
      { do: () => { if (s) s.seated = true; if (d) { d.raiseK = .3; d.lookAt = V(T.x, .7, T.z); } }, say: 'DARIO: Kneel, Sergio. You should hear it. Just this once.' },
      { say: '(The lamp is in your hand. It is the only light on the bank.)' },
      { choose: [
        ['(Hold the lamp steady.)', () => { say(null, 'You hold it steady. You see all of it. It takes much longer than you thought.'); later(.1, () => sergioCanalDies(true)); }],
        ['(Pull Dario off him.)', () => { say(null, 'You drop the lamp and drag Dario back by the collar. Sergio comes up out of the water coughing, and does not look at either of you.'); set('saved-sergio'); affect('sergio', { t: 2, g: -2 }); click('dario', 'You pulled him off Sergio on the bank, in the dark. He had been completing a man, and you stopped it. Now it has to be you.'); conflict('dario', 'sergio', 'the canal'); }],
        ['(Drop the lamp and run.)', () => { say(null, 'You run. Behind you, in the dark, the water is very loud and then very quiet.'); later(.1, () => sergioCanalDies(false)); click('dario', 'You saw what he did at the canal and ran. A witness who runs is a witness who talks.'); }]
      ], silence: () => sergioCanalDies(true) },
      { do: () => G.fade(true, .5) }, { wait: .6 },
      { do: () => { lamp.parent?.remove(lamp); if (d) { d.raiseK = 0; d.lookAt = null; returnHome(d); } if (s && !R.dead.has('sergio')) { s.seated = false; returnHome(s); } G.enter('road', [0, 0, -3.4]); G.fade(false, 1); } }
    ], { onEnd: () => { G.camera.rotation.set(0, 0, 0); G.resetLook(); } });
  }
  function sergioCanalDies(heldLamp) {
    if (!alive('sergio')) return;
    memberDies('sergio', '(Dario comes back alone, with wet shoes, and sits down and says grace over nothing.)', heldLamp ? 'Sergio drowned in the canal with Dario’s hand on the back of his neck. You held the lamp. You saw all of it. You had given Dario his name, and it was not his.' : 'Sergio went to look at the canal with Dario and did not come back. Dario believed Sergio had told you about Aurelio, because you said so.');
    if (heldLamp) { set('held-lamp'); S.truths.push('You held the lamp at the canal.'); }
    if (alive('franco')) later(50, () => motive('franco', 'cleaver', 'You said Sergio’s name because he asked you to. Then Sergio was in the canal. Franco cannot carry that, so he has put it down on you.', true));
  }
  function gabriComplicity() {
    // Ines sits with the sleeping boy and asks Tobia to hold his hand while she finishes it
    if (!has('ines-sat') || has('hand-asked') || !alive('gabri')) return; set('hand-asked');
    say('ines', '(Without looking up.) Hold his other hand. He should have someone’s hand. Nineteen years and nobody held it.');
    ch([
      ['(Hold his hand.)', () => { say(null, 'His hand is very warm, and then less warm. Ines hums. You do not let go.'); set('held-hand'); later(6, () => gabriDies()); S.truths.push('You held Gabri’s hand while Ines finished it.'); }],
      ['(Shake him awake.)', () => { say('ines', '(Her hand closes on your wrist, hard.) Don’t.'); wakeGabri('you'); click('ines', 'You woke the boy while she was making it gentle. You took the last kind thing she could do and broke it in her hands.'); }],
      ['(Leave the kitchen.)', () => { later(20, () => gabriDies()); }]
    ], { silence: () => later(10, () => gabriDies()) });
  }

  // ---- the dinner: what the requests do to the table ----------------------------------
  function requestSituation() {
    if (has('gabri-confront') && !has('gabri-confronted') && alive('gabri') && alive('ines')) return () => publicConfrontation();
    if (has('franco-asked') && !S.asked?.has('dario:aurelio') && alive('dario')) return () => ask('dario', 'aurelio');
    if (has('seat-dario-franco') && !has('seated-df') && alive('dario') && alive('franco')) return () => { set('seated-df'); say('primo', 'Dario, sit by Franco tonight. You two should talk more.'); say(null, 'Dario moves his plate next to Franco’s. Franco keeps eating. Il Primo puts his earplugs in.'); };
    if (has('anna-asked') && !has('anna-kept') && !has('anna-broke')) return () => { say('anna', '(She has set the full bowl at the far end of the table, and looks at you, and at it.)'); later(45, () => { if (!has('anna-kept')) { set('anna-broke'); affect('anna', { g: 1.5, t: -1.2 }, 'You promised Anna you would eat from her husband’s bowl, and in front of everyone you did not.'); } }); };
    return null;
  }
  function gatherEnded() { pinoGoes(); darioGoesDown(); sergioCanal(); }
  // ---- per frame ---------------------------------------------------------------------
  function updateRequests(dt) {
    if (!R.built) buildRequestWorld();
    for (const t of R.timers.slice()) if (now() >= t.at) { R.timers.splice(R.timers.indexOf(t), 1); t.fn(); }
    for (const mv of R.moves.slice()) { const tgt = mv.path[0]; if (!tgt) { R.moves.splice(R.moves.indexOf(mv), 1); mv.n.walking = false; mv.then?.(); continue; } if (G.walk(mv.n, tgt[0], tgt[1], 1.1, dt)) mv.path.shift(); }
    for (const pr of R.promises) if (pr.state === 'open') { const r = pr.check(); if (r) { pr.state = r; note(pr.k, r === 'kept' ? `You kept your word to ${nm(pr.k)}: ${pr.text}.` : `You told ${nm(pr.k)} you would ${pr.text}, and you didn’t.`); if (r === 'broken') affect(pr.k, { g: 1.2, t: -1.2 }); } }
    if (R.pendingNews?.length && G.zone() === 'home') { R.pendingNews.forEach(l => G.line(l)); R.pendingNews = []; }
    if (has('thermos-left') && !has('thermos-given') && now() - R.thermosLeft > 100) leftThermosDrunk();
    // Pino waits at the van; the yard is where you choose
    if (has('pino-leaving') && !has('van-scene') && !has('pino-gone') && !has('pino-turned') && R.pinoWait) {
      if (G.zone() === 'road' && near('pino', 6) && G.canAct() && !S.ui) vanScene();
      else if (now() - R.pinoWait > 160) { if (!R.rotorIn) pinoStuck(false); else if (has('pino-yes')) { set('pino-turned'); const n = npcOf('pino'); if (n) returnHome(n); affect('pino', { g: 1.5 }, 'You told Pino you would come, and he sat in the van in the yard for an hour, and you didn’t.'); } else pinoLeavesAlone(); }
    }
    if (has('dario-down') && !has('cellar-came') && !has('cellar-over') && G.zone() === 'cellar' && near('dario', 4) && G.canAct() && !S.ui) cellarScene();
    updateMotives(dt); updateStalkers(dt); updateErrands(dt);
    if (has('dario-no') && S.rel.dario?.marked && !R.darioClick) { R.darioClick = true; later(60, () => click('dario', 'You bleed, and you would not watch him. He has decided Il Bianco must finish in you instead.')); }
    if (has('ines-sat') && !has('hand-asked') && G.zone() === 'home' && near('gabri', 4) && !S.ui && G.canAct()) gabriComplicity();
    // a request, when the house is quiet and nobody is already talking to you
    if (!R.active && !R.beckon && !R.scene && G.zone() === 'home' && G.canAct() && G.welcomed() && S.introDone && !S.gather.active && !S.ui && !G.linesBusy()) {
      R.cd -= dt; if (R.cd <= 0) { const id = ORDER.find(i => !R.reqs[i] && REQ[i].ready()); if (id) beckon(id); else R.cd = 30; }
    }
    if (R.beckon) {
      R.beckon.t += dt; const b = R.beckon;
      if (near(b.k, 2.4) && G.canAct() && !S.ui && !G.linesBusy()) startTalk(b.id);
      else if (b.t > 110 || !alive(b.k)) { R.beckon = null; S.beckonK = null; R.reqs[b.id].state = 'ignored'; affect(b.k, { g: .5 }, `${nm(b.k)} wanted to ask you something and you never went over.`); R.cd = 60; if (b.id === 'pino') set('pino-no'); if (b.id === 'walter') set('walter-no'); if (b.id === 'franco') set('franco-asked'); }
    }
  }

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
      { shot: { pos: V(-3.9, 1.62, 5.7), look: center, fov: 60 }, say: 'IL PRIMO: Everyone. This is Tobia. The fog has closed the road; he eats with us tonight.' },
      { say: 'IL PRIMO: Sit there, Tobia. At the end. Ines set your place before you knocked.' },
      { do: () => { seatAt(mine); }, shot: { pos: seatEye, look: V(T.top[0], 1.05, T.top[1] - 2.2), fov: 62 } },
      { say: 'IL PRIMO: Say your names. Say them the way you say them here.' },
      ...order.map(k => ({ shot: faceShot(k), say: (INTRO[k].startsWith('(') ? '' : UP(k) + ': ') + INTRO[k] })),
      { shot: faceShot('primo', 1.9, 46), say: 'IL PRIMO: You hear it in all of them. Thirteen chairs, and a fourteenth place. We are here for one thing. Il Bianco.' },
      { shot: { pos: seatEye, look: headOf('primo'), fov: 60 }, choose: [['“What is Il Bianco?”', () => G.line('TOBIA: What is Il Bianco?')], ['“I only came because of the fog.”', () => { G.line('TOBIA: I only came because of the fog.'); G.line('IL PRIMO: Everyone comes because of the fog.'); }], ['(Say nothing.)', () => G.line('(You say nothing. Il Primo waits as if you had asked.)')]], silence: () => G.line('(You say nothing. Il Primo waits as if you had asked.)') },
      { shot: faceShot('dario'), say: 'DARIO: The White. The sound under every sound. Switch everything off — the fridge, the rain, your own blood — and listen. It is there.' },
      { shot: faceShot('ines', 1.7), say: 'INES: It comes in through the ears. The mouth. The nose. It fills you the way water fills a bottle. Slowly, and then all at once.' },
      { shot: faceShot('marta'), say: 'MARTA: Aurelio was the first. He listened until there was no room left in him. We found him at this table, smiling. Full.' },
      { shot: { pos: seatEye, look: headOf('marta'), fov: 58 }, choose: [['“Full… you mean he died.”', () => G.line('TOBIA: Full. You mean he died.')], ['“That’s an illness, not a god.”', (sc) => { G.line('TOBIA: That’s an illness, not a god.'); sc.steps.splice(sc.i + 1, 0, { shot: faceShot('sergio'), say: 'SERGIO: He’s not wrong, you know.' }, { shot: faceShot('dario'), say: '(Dario looks at Sergio for a long time. Then at you.)' }); affect('sergio', { t: .6 }); affect('dario', { g: .5 }, 'At your first dinner you called Il Bianco an illness, in front of Dario.'); }], ['(Say nothing.)', () => {}]] },
      { shot: faceShot('primo', 1.8, 44), say: 'IL PRIMO: I mean finished. Nothing left to want, nothing left to hear. Every chair at this table is waiting to be filled. That is what the table is for.' },
      { say: 'IL PRIMO: (He holds up a pair of orange earplugs.) I wear these so it fills me slowly. Someone has to be last. Someone has to watch everyone else fill.' },
      { shot: { pos: seatEye, look: headOf('dario'), fov: 40 }, say: 'DARIO: (To you, quietly.) When it starts in someone, it has to come out somewhere. Usually the nose.' },
      { shot: { pos: seatEye, look: headOf('dario'), fov: 52 }, choose: [['“I get nosebleeds.”', () => { G.line('TOBIA: I get nosebleeds.'); S.rel.dario.marked = true; G.line('(Nobody says anything. Ines passes you the bread. Dario smiles for the first time.)'); }], ['“It won’t start in me.”', () => { G.line('TOBIA: It won’t start in me.'); G.line('DARIO: It always says that, at the beginning.'); }], ['(Say nothing.)', () => {}]] },
      { shot: { pos: seatEye, look: V(T.top[0], .85, T.top[1] + 1.4), fov: 62 }, say: 'IL PRIMO: Eat. It is still warm. Afterwards the guitar is on the table, if you want to make yourself useful.' },
      { do: () => { G.flags.add('bianco-told'); G.journal({ id: 'il-bianco', title: 'Il Bianco', description: 'The White. They say it is the sound under every sound. It comes in through the ears, the mouth, the nose, and fills a person the way water fills a bottle, slowly and then all at once. When there is no room left, the person stops. They call it being full, or finished. Aurelio was the first: they found him at the table, smiling. The whole house is built around waiting for it. Il Primo wears orange earplugs so that it fills him slowly; he wants to be the last, and to watch. Dario says that when it starts in someone, it comes out through the nose.', kind: 'the house', zone: 'home' }); S.plotAt = now() + 240; } }
    ];
    runScene(steps, { onEnd: () => { G.camera.rotation.z = 0; G.resetLook(); } });
    return true;
  }
  function seatAt(seat) { S.seated = seat; seat.entry.prompt = '[ E ] STAND UP'; G.playerAnchor.position.set(seat.x - seat.face[0] * .08, 0, seat.z - seat.face[1] * .08); }

  // The Last Supper: you come in and they are arranged along one side of the table, leaning to
  // each other in threes, Il Primo at the centre. Then every head turns to you at once.
  const WHISPER = ['(whispers) …when he is full…', '(whispers) …Sunday. After the record…', '(whispers) …he bleeds already. You saw it at dinner…', '(whispers) …fourteen chairs. There were always going to be fourteen…', '(whispers) …who sits with him at the end…', '(whispers) …not in the house. Somewhere he will not be missed…'];
  function plotScene() {
    S.plotN = (S.plotN || 0) + 1; S.plotAt = now() + 420;
    const T = G.seats(), V = (x, y, z) => new THREE.Vector3(x, y, z), cz = T.top[1], cx = T.top[0];
    const primo = G.firstNpc(); const ps = present().filter(p => p.key !== 'primo').sort((a, b) => posOf(a).z - posOf(b).z);
    const all = [...ps.map(p => p.npc), ...(primo ? [primo] : [])];
    const saved = all.map(n => ({ n, pos: n.object.position.clone(), r: n.object.rotation.y, seated: n.seated, posed: n.posed, raise: n.raiseK || 0 }));
    const hunters = Object.values(R.motives).filter(m => m.alive && m.hidden && alive(m.k)).map(m => nm(m.k));
    const lines = [pick(WHISPER), pick(WHISPER), hunters.length ? `(${hunters[0]} leans to Il Primo’s ear. He does not answer. He only nods at the bread.)` : pick(WHISPER)];
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
      { say: 'IL PRIMO: Tobia. Sit with us. We were talking about the weather.' },
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
    updateUI(dt); updateBleed(dt); updateRequests(dt);
    if (R.passThrough) { const n = R.passThrough; R.passThrough = null; n._skipGate = true; G.talk(n); }
    if (S.seated) { G.camera.position.y = 1.12; if (G.zone() !== 'home') S.seated = null; }
    // tension: hostile eyes, the room, the body
    if (G.zone() === 'home' && G.canAct()) {
      let stare = 0; for (const p of present()) { if (p.key === 'primo') continue; if (standing(p.key) <= -1 && dist2(p) < 6) stare++; }
      S.tension = clamp(S.tension + dt * (stare * .006 + (S.seated?.aurelio ? .004 : 0)) - dt * .007, 0, 1.2);
      if (S.gather.active) { const A = S.gather.active; if (!G.linesBusy() && !S.ui) A.t += dt; if (S.seated) A.sat = true; while (A.beats.length && A.beats[0].at <= A.t) A.beats.shift().fn(); }
      else if (G.welcomed() && !R.active && !R.beckon && !R.scene) { S.gather.cd -= dt; if (S.gather.cd <= 0 && !S.ui) { S.gather.cd = 210; gatherStart(); } }
      if (S.frameAt && !S.framed && now() > S.frameAt && !S.seated && !inKitchen()) frame();
      if (S.plotAt && now() > S.plotAt && (S.plotN || 0) < 3 && !S.gather.active && !R.scene && !R.active && !S.ui && !S.seated && !G.linesBusy() && present().length >= 6) plotScene();
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
    introScene, _plot: () => plotScene(), _click: (k, w) => click(k, w || 'test'), _errand: () => { R.errandT = 0; }, _req: R, _gatherEnded: () => gatherEnded(), _beckon: (id) => beckon(id), _motive: (k, kind, why, hidden) => motive(k, kind, why, hidden), _set: set, _canAct: () => G.canAct(), _gesture: gesture, _ask: ask, _startBleed: startBleed, _gather: gatherStart, _affect: affect
  };
}
