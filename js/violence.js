// =============================================================================
// EPISTASSI — VIOLENCE (v29)
// Nobody here is an enemy. They are people who have decided something about Tobia, for a
// reason that has a history, and who go on cutting bread and complaining about the coffee
// while they wait for the room to empty. When they act, they act with what is already in
// their hands: Franco's butcher's knife from the board, Pino's pipe wrench from the van,
// Ines's teapot, the lid of the cesspit in the yard that Walter has been meaning to fix.
//
// Surviving does not end it. Tobia's body remembers; the one who tried remembers it
// differently; the table makes its own versions; and Il Primo, who never touches anything,
// chooses which version will be repeated, and to whom.
//
// This module owns the plans, the attacks, the wounds and the aftermath. The relationships,
// motives and scenes it builds on live in society.js, which passes its helpers in as C.
// =============================================================================
export function createViolence(C) {
  const { G, S, R, THREE, SOCIAL, nm, UP, pick, now, say, me, ch, later, note, affect } = C;
  const P = G.peril;
  const V = R.v29 = R.v29 || { incidents: [], wounds: {}, react: [], warns: [], primo: [], versions: {}, told: new Set(), traceAt: {}, pit: null, van: null, poison: null, enc: null, scene: null, seen: {} };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const he = (k) => ['ines', 'anna', 'marta', 'livia'].includes(k) ? 'she' : 'he';
  const him = (k) => ['ines', 'anna', 'marta', 'livia'].includes(k) ? 'her' : 'him';
  const his = (k) => ['ines', 'anna', 'marta', 'livia'].includes(k) ? 'her' : 'his';
  const v3 = () => new THREE.Vector3();

  // ---------------------------------------------------------------------------------
  // Who does what. A plan is how a particular person would go about it.
  // ---------------------------------------------------------------------------------
  const PLAN = { franco: 'knife', pino: 'wrench', ines: 'cup', walter: 'pit' };
  // what each strike looks and feels like, by what is in the hand
  const STRIKE_OF = { knife: 'knife', cleaver: 'knife', burin: 'thrust', cloth: 'grip', cord: 'grip', belt: 'grip', hands: 'grip', cushion: 'grip', wrench: 'wrench' };
  function planFor(k, kind) {
    if (kind === 'cleaver') return 'knife';
    if (kind === 'stalk' && PLAN[k]) { if (k === 'walter' && V.pit?.used) return 'stalk'; return PLAN[k]; }
    return kind;
  }

  // ---------------------------------------------------------------------------------
  // Opportunity: they wait for the room to empty. Being high makes some of them careless.
  // ---------------------------------------------------------------------------------
  // who would stop it, in the attacker's eyes: not Gabri by the fridge (nobody looks at Gabri), not
  // Livia (who cannot say what she saw), not the ones who would take the attacker's side anyway
  const DONT_COUNT = { franco: ['gabri', 'livia', 'ottavio'], pino: ['gabri', 'livia'], ines: ['gabri', 'livia', 'ottavio'], walter: ['gabri', 'livia'] };
  function witnessesNear(k, r = 4.2) { const skip = DONT_COUNT[k] || []; return C.present().filter(x => x.key !== k && x.key !== 'primo' && !skip.includes(x.key) && !(SOCIAL[x.key]?.protects || []).includes(k) && C.dist2(x) < r).length; }
  function distTo(n) { const o = n.object.getWorldPosition(v3()), p = C.playerPos(); return Math.hypot(o.x - p.x, o.z - p.z); }
  function canStart() { return G.canAct() && !S.ui && !R.scene && !V.scene && !G.linesBusy() && !S.gather?.active && !R.active && !R.beckon; }

  // ---------------------------------------------------------------------------------
  // FRANCO — the butcher's knife. He is at the board, cutting the Sunday joint, with the knife
  // he has used for thirty years. The knife is in his hand before anything happens; what changes
  // is where he stands, what he does with his other hand, how close he comes.
  // ---------------------------------------------------------------------------------
  const BOARD = [-8.05, -5.75];
  let knifeBlock = null;
  function ensureKnifeBlock() {
    if (knifeBlock) return knifeBlock; const H = G.home(); if (!H) return null;
    const g = new THREE.Group(); g.position.set(-8.55, .86, -6.05); H.group.add(g);
    const wood = G.mat(0x4a3220, .8), dark = G.mat(0x1f150e, .7);
    const block = new THREE.Mesh(new THREE.BoxGeometry(.12, .2, .16), wood); block.rotation.x = -.35; block.position.y = .09; g.add(block);
    const slots = []; for (let i = 0; i < 3; i++) { const h = new THREE.Mesh(new THREE.BoxGeometry(.024, .11, .03), dark); h.position.set(-.035 + i * .035, .22, -.035); h.rotation.x = -.35; g.add(h); slots.push(h); }
    knifeBlock = { g, slots };
    H.interactables.push({ id: 'knife-block', type: 'social', object: g, point: g.position, radius: 1.6, get prompt() { return '[ E ] THE KNIFE BLOCK'; }, run: () => G.line(slots[0].visible ? '(Three handles. The big one is worn pale where a thumb goes.)' : '(Two handles. The big slot is empty. There is a smear of fat on the wood where it goes.)') });
    return knifeBlock;
  }
  function knifeOut(out) { ensureKnifeBlock(); if (knifeBlock) knifeBlock.slots[0].visible = !out; }
  const FRANCO_TALK = ['FRANCO: Come here, I want to show you something. The joint. Look at the marbling on that.', 'FRANCO: You know what they call this cut in Modena? (He doesn’t say.)', 'FRANCO: Stand still a second. You make me nervous, walking about.', 'FRANCO: So the priest gets on the scooter— no. You’ve heard it.'];
  const FRANCO_CORNER = ['FRANCO: You know what Dario says about you? (He is not looking at your face. He is looking lower, at your coat, at where it buttons.)', 'FRANCO: Thirty years, I never cut anyone who didn’t have it coming. (He laughs. The knife doesn’t.)', 'FRANCO: Il Primo says you talk. In your sleep, on the telephone. (He wipes the blade on his apron, both sides, slowly.)'];
  function knifePlan(m, dt) {
    const n = C.npcOf('franco'); if (!n || !C.alive('franco')) return;
    const E = m.v || (m.v = { stage: 'brew', t: 0, far: 0 }); E.t += dt;
    const home = G.zone() === 'home' && C.sameZone(n);
    if (E.stage === 'brew') {
      if (now() - m.born < 12) return;
      if (G.zone() !== 'home') { C.sendTo('franco', 'home', BOARD[0], BOARD[1], Math.PI); n.seated = false; G.peril.wield(n, 'knife'); knifeOut(true); E.stage = 'carry'; E.t = 0; return; }
      if (!canStart()) return;
      say(null, 'Franco gets up, takes the joint from the cold larder, and goes to the board in the kitchen.'); E.stage = 'going';
      C.walkTo('franco', [[-7.75, n.object.position.z], [-7.75, -5.2], BOARD], () => { const k = C.npcOf('franco'); if (!k) return; k.object.rotation.y = Math.PI; G.peril.wield(k, 'knife'); knifeOut(true); E.stage = 'carry'; E.t = 0; });
      return;
    }
    if (E.stage === 'going') return;
    if (E.stage === 'carry' || E.stage === 'after') {
      if (!n.wielding && E.stage === 'carry') { G.peril.wield(n, 'knife'); knifeOut(true); }
      // the sound of the board when Tobia is in the kitchen: thirty years of the same rhythm
      if (home && C.inKitchen() && Math.random() < dt * .7) G.audio()?.mechanicalNoise(.06, 900, 2, .05, -.3);
      if (E.stage === 'after' || now() < (m.cool || 0) || !home || !canStart()) return;
      const d = distTo(n), high = m.high;
      if (d < 8.5 && witnessesNear('franco') <= (high ? 1 : 0) && !S.seated) { E.stage = 'approach'; E.t = 0; E.far = 0; G.line(pick(FRANCO_TALK)); n.seated = false; }
      return;
    }
    if (!home) return;                                                       // interrupted: handled in onEnter
    const d = distTo(n), p = C.playerPos();
    if (witnessesNear('franco', 3.4) > (m.high ? 1 : 0)) { abortKnife(m, n, E); return; }
    if (E.stage === 'approach') {
      if (d > 2.0) C.stepTo(n, p.x, p.z, .95, dt, 'home'); else { E.stage = 'corner'; E.t = 0; n.walking = false; G.line(pick(FRANCO_CORNER)); }
      if (d > 9) { E.far += dt; if (E.far > 6) { E.stage = 'carry'; m.cool = now() + 40; affect('franco', { g: .3 }, 'You walked away from Franco while he was talking to you, with the knife in his hand.'); say(null, 'Franco stops in the middle of the room, and looks at the knife in his hand as if somebody else had given it to him, and goes back to the board.'); C.walkTo('franco', [BOARD], () => { const k = C.npcOf('franco'); if (k) k.object.rotation.y = Math.PI; }); } } else E.far = 0;
      return;
    }
    if (E.stage === 'corner') {
      G.turn(n, p.x, p.z, dt, 4); n.lookAt = G.camera.getWorldPosition(v3());
      const k = ease(E.t / 2.6); G.peril.pose(n, 'knifeHold', 'knifeRaise', k);
      if (d > 3.3) C.stepTo(n, p.x, p.z, 1.25, dt, 'home');                  // he follows; he does not give up because you stepped back
      if (d < 1.7 && E.t > 1.9) { if (S.seated) C.stand?.(); strike(m, 'knife', n, 'knifeRaise'); }
      else if (E.t > 12) abortKnife(m, n, E);
    }
  }
  function abortKnife(m, n, E) {
    E.stage = 'carry'; m.cool = now() + 30 + Math.random() * 40; n.lookAt = null; G.peril.pose(n, null);
    G.line(pick(['FRANCO: (to whoever has come in, cheerfully) Who wants the end bit? Nobody ever wants the end bit.', '(Franco turns back toward the kitchen as if he had only been stretching his legs. The knife goes with him.)', 'FRANCO: Anna! Where’s the big dish. The white one.']));
    C.walkTo('franco', [BOARD], () => { const k = C.npcOf('franco'); if (k) k.object.rotation.y = Math.PI; });
  }

  // ---------------------------------------------------------------------------------
  // PINO — the pipe wrench. He lives with the van: the bonnet is up, the wrench is the one from
  // his toolbox, and he is working. He doesn't creep. He puts himself between Tobia and the
  // farmhouse door, breaks something first, and then swings, with his whole weight.
  // ---------------------------------------------------------------------------------
  const PINO_TALK = ['PINO: Hold the torch for me. Under here. No — closer.', 'PINO: Somebody’s been at the van again. You wouldn’t know anything about that.', 'PINO: Funny, isn’t it. Every time I get it running, something goes.'];
  function vanPos() { const v = R.van; return v && v.visible ? v.position : null; }
  function wrenchPlan(m, dt) {
    const n = C.npcOf('pino'); if (!n || !C.alive('pino') || C.has('pino-gone')) return;
    const E = m.v || (m.v = { stage: 'brew', t: 0 }); E.t += dt;
    const vp = vanPos(); if (!vp) return;
    if (V.van && V.van.m.k === 'pino') return;               // he is in the van; he cannot be in two places
    if (E.stage === 'brew') {
      if (now() - m.born < 15) return;
      // he goes out to the van; if Tobia is in the room he sees him go, with the toolbox
      const sol = R.vanSolid, sx = sol ? sol.minX - .55 : vp.x - 3, sz = sol ? (sol.minZ + sol.maxZ) / 2 : vp.z;
      const go = () => { C.sendTo('pino', 'road', sx, sz, -Math.PI / 2); const k = C.npcOf('pino'); if (k) { k.seated = false; G.peril.wield(k, 'wrench'); } E.stage = 'carry'; E.t = 0; };
      if (G.zone() === 'home' && C.sameZone(n)) { if (!canStart()) return; say(null, 'Pino gets up without finishing, and takes the toolbox from under the coats, and goes out to the van.'); E.stage = 'going'; C.leaveHouse('pino', go); }
      else if (G.zone() !== 'road') go();
      return;
    }
    if (E.stage === 'going') return;
    const onRoad = G.zone() === 'road' && C.sameZone(n);
    if (E.stage === 'carry' || E.stage === 'after') {
      if (!n.wielding) G.peril.wield(n, 'wrench');
      if (onRoad && Math.random() < dt * .4) G.audio()?.mechanicalNoise(.05, 2600, 5, .05, .4);
      if (E.stage === 'after' || now() < (m.cool || 0) || !onRoad || !canStart()) return;
      if (distTo(n) < 13) { E.stage = 'approach'; E.t = 0; G.line(pick(PINO_TALK)); }
      return;
    }
    if (!onRoad) return;
    const p = C.playerPos(), d = distTo(n);
    // he takes the line between Tobia and the farmhouse door
    const door = [0, -7.4], bx = p.x + (door[0] - p.x) * .45, bz = p.z + (door[1] - p.z) * .45;
    if (E.stage === 'approach') {
      const o0 = { x: n.object.position.x, z: n.object.position.z };
      if (Math.hypot(n.object.position.x - bx, n.object.position.z - bz) > .6 && d > 2.4) C.stepTo(n, bx, bz, 1.15, dt, 'road');
      E.stuck = Math.hypot(n.object.position.x - o0.x, n.object.position.z - o0.z) < .002 && d > 2.4 ? (E.stuck || 0) + dt : 0;
      if (E.stuck > 2.5) { E.stage = 'carry'; m.cool = now() + 30; E.stuck = 0; n.walking = false; return; }
      G.turn(n, p.x, p.z, dt, 3);
      if (d < 5.2) { E.stage = 'smash'; E.t = 0; }
      if (d > 20) { E.stage = 'carry'; m.cool = now() + 45; }
      return;
    }
    if (E.stage === 'smash') {
      // he breaks something of his own first: the wing mirror of the van, or the lamp glass
      n.lookAt = G.camera.getWorldPosition(v3()); G.turn(n, p.x, p.z, dt, 3);
      if (E.t < .9) G.peril.pose(n, 'wrenchHold', 'wrenchHigh', E.t / .9);
      else if (E.t < 1.15) G.peril.pose(n, 'wrenchHigh', 'wrenchSmash', (E.t - .9) / .25);
      if (E.t >= 1.1 && !E.smashed) { E.smashed = true; G.peril.impact('glass'); G.peril.impact('metal'); G.peril.shake(.35); G.peril.shock(.45); G.line(pick(['PINO: Look what you made me do. Look at it.', 'PINO: (He hits the bonnet, once, and the whole van rings.) There. Now we both know.'])); }
      if (E.t > 2.2) { E.stage = 'corner'; E.t = 0; }
      return;
    }
    if (E.stage === 'corner') {
      n.lookAt = G.camera.getWorldPosition(v3()); G.turn(n, p.x, p.z, dt, 4); G.peril.pose(n, 'wrenchSmash', 'wrenchHold', ease(E.t / .6));
      if (d > 2.0) C.stepTo(n, p.x, p.z, 1.35, dt, 'road');
      if (d < 2.3 && E.t > .8) strike(m, 'wrench', n, 'wrenchHold');
      else if (E.t > 9) { E.stage = 'carry'; m.cool = now() + 25; G.peril.pose(n, null); n.lookAt = null; }   // he could not get to you; not this time
    }
  }

  // ---------------------------------------------------------------------------------
  // The strike: a few seconds, staged. The body coming is readable — the knife goes up, the
  // weight goes back, the wrench goes behind the shoulder, a breath behind you — and then there
  // is a window in which Tobia's body can do something. What it can do depends on the danger.
  // ---------------------------------------------------------------------------------
  const STRIKES = {
    knife: { lead: .95, window: .42, late: .24, keys: { KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', KeyE: 'grab' }, hint: 'A / D — OUT OF THE WAY    E — HIS WRIST' },
    thrust: { lead: 1.15, window: .46, late: .24, keys: { KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', KeyE: 'grab' }, hint: 'A / D — OUT OF THE WAY    E — THE ARM' },
    wrench: { lead: 1.25, window: .4, late: .22, keys: { KeyC: 'duck', ControlLeft: 'duck', ControlRight: 'duck', KeyS: 'back', ArrowDown: 'back' }, hint: 'C — DOWN    S — BACK' },
    grip: { lead: .95, window: .52, late: .5, keys: { KeyS: 'drive', ArrowDown: 'drive', KeyE: 'hands' }, hint: 'S — DRIVE BACK    E — FINGERS UNDER IT' },
    blast: { lead: 1.5, window: .8, late: .3, keys: { KeyE: 'drop', KeyS: 'run', ArrowDown: 'run' }, hint: 'E — LET GO OF IT    S — AWAY' }
  };
  function strike(m, kind, n, fromPose) {
    if (V.scene || R.scene === 'dead') return;
    const k = m.k, def = STRIKES[kind]; n = n || C.npcOf(k); if (!n) return;
    if (kind !== 'blast' && (!n.object.visible || !C.sameZone(n))) return;      // nobody can strike from where they are not
    C.closeUI(); R.scene = 'strike'; V.scene = { k, kind };
    m.v = m.v || { stage: 'strike', t: 0 }; m.v.stage = 'strike';
    n.walking = false; n.seated = false; n.lookAt = null;
    const base = { x: n.object.position.x, z: n.object.position.z, r: n.object.rotation.y };
    const behind = (kind === 'grip' || kind === 'thrust') && !C.sees(n);
    if (kind === 'grip') { const p = C.playerPos(); G.camera.getWorldDirection(tmp); n.object.position.set(p.x - tmp.x * .55, n.object.position.y, p.z - tmp.z * .55); G.turn(n, p.x, p.z, 1, 99); base.x = n.object.position.x; base.z = n.object.position.z; base.r = n.object.rotation.y; }
    const sc = { t: 0, res: null, act: null, rt: 0, k, kind, n, base, behind, done: false };
    // the body tells you first: sounds that belong to the movement
    if (kind === 'knife' || kind === 'thrust') { G.peril.impact('breath'); if (behind) G.audio()?.footstep?.('wood', true, 1); }
    if (kind === 'wrench') { G.audio()?.mechanicalNoise(.7, 300, .6, .08, 0); }
    if (kind === 'grip') { G.audio()?.mechanicalNoise(.5, 1800, 1.2, .08, 0); G.peril.impact('breath'); }
    G.peril.startReflex({ kind, keys: def.keys, lead: def.lead, window: def.window, late: def.late, hint: def.hint, onResult: (res, act) => { sc.res = res; sc.act = act; sc.rt = sc.t; react(sc); }, onFlinch: () => { G.peril.shake(.2); } });
    sc.R = G.peril.PERIL.reflex;
    G.scene({ dur: 99999, skippable: false, update: (s, dt) => tickStrike(sc, dt, fromPose) });
  }
  const tmp = new THREE.Vector3();
  function attackerAim(sc, h = 1.25) { const o = sc.n.object.getWorldPosition(v3()); o.y += h * (sc.n.rig?.k || 1); return o; }
  function tickStrike(sc, dt, fromPose) {
    sc.t += dt; const n = sc.n, k = sc.kind, Rf = sc.R, p = C.playerPos();
    const open = Rf ? Rf.open : 1, close = Rf ? Rf.close : 1.4;
    // Tobia's head goes where the danger is: fast when it is behind him (he hears it)
    if (!sc.res || sc.res === 'none') G.aim(attackerAim(sc, k === 'grip' ? 1.75 : 1.3), Math.min(1, dt * (sc.behind ? 7 : 5)));
    n.lookAt = G.camera.getWorldPosition(v3());
    const fwd = (dist) => { const dx = p.x - sc.base.x, dz = p.z - sc.base.z, d = Math.hypot(dx, dz) || 1; n.object.position.x = sc.base.x + dx / d * dist; n.object.position.z = sc.base.z + dz / d * dist; };
    const t = sc.t, r = sc.res, rt = sc.rt;
    if (k === 'knife' || k === 'thrust') {
      if (!r) {
        if (t < open * .48) G.peril.pose(n, fromPose || 'knifeHold', 'knifeRaise', t / (open * .48));
        else if (t < open) { G.peril.pose(n, 'knifeRaise', 'knifeCock', (t - open * .48) / (open * .52)); fwd(-.12 * ease((t - open * .48) / (open * .52))); }
        else { const q = (t - open) / (close - open + .08); G.peril.pose(n, 'knifeCock', 'knifeThrust', q); fwd(.45 * ease(q)); }
      } else if (r === 'clean' && sc.act !== 'grab') {
        const q = clamp((t - rt) / .18, 0, 1); G.peril.pose(n, 'knifeCock', 'knifeThrust', Math.max(q, .6)); fwd(.45 + .5 * ease((t - rt) / .35));
        if (!sc.hit && t - rt > .14) { sc.hit = true; G.peril.impact(C.wallNear?.(n.object.position, 1.2) ? 'wood' : 'breath'); }
        if (t - rt > .9) G.peril.pose(n, 'knifeThrust', 'knifeHold', (t - rt - .9) / .8);
        if (t - rt > 2.3) endStrike(sc, 'clean');
      } else if (r === 'clean') {
        // the grab: his wrist in both hands, the blade a hand's width from your belly, then the shove
        if (t - rt < .55) { G.peril.pose(n, 'knifeCock', 'knifeThrust', .55); }
        else { const q = (t - rt - .55) / .3; G.peril.pose(n, 'knifeThrust', 'knifeHold', q); fwd(.25 - 1.05 * ease(q)); if (!sc.drop) { sc.drop = true; G.peril.shake(.55); G.peril.impact('body'); const g = G.peril.unwield(n, true); if (g) dropped(sc.k, g); setTimeout(() => G.peril.impact('metal'), 260); } }
        if (t - rt > 2.4) endStrike(sc, 'clean');
      } else if (r === 'late') {
        G.peril.pose(n, 'knifeCock', 'knifeThrust', 1); fwd(.45);
        if (!sc.hit) { sc.hit = true; G.peril.impact('flesh'); G.peril.shake(1); G.peril.bleed(); G.peril.lurch([0, -.22, .38], .2, { hold: .7, back: .6 }); n.forceEmo = { surprise: .8, fear: .5 }; }
        if (t - rt > .8) { G.peril.pose(n, 'knifeThrust', 'knifeHold', (t - rt - .8) / .6); fwd(.45 - .9 * ease((t - rt - .8) / .8)); }
        if (t - rt > 2.6) endStrike(sc, 'hurt');
      }
    } else if (k === 'wrench') {
      const twist = (a) => { n.object.rotation.y = sc.base.r + a; };
      if (!r) {
        if (t < open * .7) { const q = t / (open * .7); G.peril.pose(n, fromPose || 'wrenchHold', 'wrenchBack', q); twist(.5 * ease(q)); }
        else if (t < open) { G.peril.pose(n, 'wrenchBack', 'wrenchBack', 1); twist(.5 + Math.sin(t * 40) * .01); }
        else { const q = (t - open) / (close - open + .1); G.peril.pose(n, 'wrenchBack', 'wrenchThrough', q); twist(.5 - 1.1 * ease(q)); fwd(.25 * ease(q)); }
      } else if (r === 'clean') {
        const q = clamp((t - rt) / .22, 0, 1); G.peril.pose(n, 'wrenchBack', 'wrenchThrough', Math.max(q, .3)); twist(.5 - 1.25 * ease(q));
        if (!sc.hit && t - rt > .16) { sc.hit = true; G.peril.impact(vanNear(n) ? 'metal' : 'wood'); if (vanNear(n)) G.peril.impact('glass'); G.peril.shake(.7); G.audio()?.mechanicalNoise(.25, 500, .5, .2, 0); }
        if (t - rt > 1.1) { G.peril.pose(n, 'wrenchThrough', 'wrenchHold', (t - rt - 1.1) / .9); twist(-.75 + .75 * ease((t - rt - 1.1) / .9)); }
        if (t - rt > 2.6) endStrike(sc, 'clean');
      } else if (r === 'late') {
        G.peril.pose(n, 'wrenchBack', 'wrenchThrough', clamp((t - rt) / .15 + .5, 0, 1)); twist(-.6);
        if (!sc.hit) { sc.hit = true; G.peril.impact('body'); G.peril.shake(1.1); G.peril.lurch([.3, -.95, .25], .22, { hold: 1.4, back: .9 }); G.peril.bleed(); G.peril.PERIL.limp = Math.max(G.peril.PERIL.limp, .55); n.forceEmo = { fear: .7, sad: .3 }; }
        if (t - rt > 1.3) G.peril.pose(n, 'wrenchThrough', 'wrenchHold', (t - rt - 1.3) / .8);
        if (t - rt > 3) endStrike(sc, 'hurt');
      }
    } else if (k === 'grip') {
      // from behind: cloth, rosary, belt, hands. The view tips back; the breath goes.
      if (!r) {
        const q = ease(t / open); G.peril.pose(n, 'reachOut', 'gripBehind', q); if (t > open * .8) { G.peril.PERIL.off.y = -.04 * q; G.peril.shake(.12); }
      } else if (r === 'clean') {
        if (!sc.hit) { sc.hit = true; G.peril.lurch([0, 0, .42], .12, { hold: .2, back: .45 }); G.peril.impact('body'); G.peril.shake(.6); setTimeout(() => G.peril.impact('breath'), 500); }
        const q = clamp((t - rt) / .4, 0, 1); fwd(-.7 * ease(q)); G.peril.pose(n, 'gripBehind', 'reachOut', q);
        if (t - rt > 2.2) endStrike(sc, 'clean');
      } else if (r === 'late') {
        if (t - rt < 1.3) { G.peril.shake(.35); G.peril.PERIL.off.y = -.06; }
        else if (!sc.hit) { sc.hit = true; G.peril.lurch([0, 0, .42], .14, { hold: .3, back: .5 }); G.peril.impact('body'); G.peril.PERIL.off.y = 0; }
        if (t - rt > 1.3) fwd(-.6 * ease((t - rt - 1.3) / .4));
        if (t - rt > 2.9) endStrike(sc, 'hurt');
      }
    } else if (k === 'blast') {
      if (!r) { if (Math.random() < dt * 8) G.audio()?.mechanicalNoise(.08, 4200, 3, .05, 0); }
      else if (r === 'clean') { if (!sc.hit) { sc.hit = true; G.peril.lurch(sc.act === 'run' ? [0, -.6, 1.6] : [0, -.9, .9], .4, { commit: false, hold: 2.4, back: .8 }); setTimeout(() => { G.peril.impact('stone'); G.peril.shake(1.2); G.glitch?.(1); }, 700); } if (t - rt > 3.6) endStrike(sc, 'clean'); }
      else if (r === 'late') { if (!sc.hit) { sc.hit = true; G.peril.impact('stone'); G.peril.shake(1.4); G.peril.lurch([0, -1, 1.2], .3, { hold: 2.6, back: 1 }); G.peril.PERIL.limp = .6; G.peril.bleed(); } if (t - rt > 3.8) endStrike(sc, 'hurt'); }
    }
    if (r === 'none' && !sc.done) {
      sc.done = true;
      if (k === 'knife' || k === 'thrust') { G.peril.pose(n, 'knifeCock', 'knifeThrust', 1); G.peril.impact('flesh'); }
      if (k === 'wrench') { G.peril.pose(n, 'wrenchBack', 'wrenchThrough', 1); G.peril.impact('body'); }
      if (k === 'grip') G.peril.shake(.5);
      G.peril.shake(1.2);
      setTimeout(() => { const kind = k === 'knife' ? 'butcher' : k === 'wrench' ? 'wrench' : k === 'blast' ? 'collapse' : (C.TOOL[sc.k]?.[0] || 'hands'); V.scene = null; R.scene = null; G.endScene(); n.armPose = null; C.kill(sc.k, kind); if (!S.ending) recovered(sc); }, 420);
    }
  }
  function react(sc) {
    const a = sc.act;
    if (sc.res === 'clean') {
      if (a === 'left' || a === 'right') G.peril.lurch([a === 'left' ? -.78 : .78, -.06, .1], .17, { commit: true });
      if (a === 'grab' || a === 'hands') { G.peril.lurch([0, -.05, -.16], .1, { hold: .55, back: .3 }); G.peril.shake(.45); G.peril.impact('flesh'); }
      if (a === 'duck') G.peril.lurch([0, -.82, .05], .14, { hold: 1.0, back: .6 });
      if (a === 'back') { if (C.wallBehind?.(.9)) { sc.res = 'late'; return; } G.peril.lurch([0, 0, .9], .2, { commit: true }); }
      if (a === 'drive') { /* handled in tick */ }
    }
  }
  // Mercy (difficulty 0) leaves the person standing there, unable; their scene is ended by kill()
  function recovered(sc) { const n = sc.n; n.armPose = null; n.lookAt = null; G.resetLook(); }
  function endStrike(sc, how) {
    if (sc.ended) return; sc.ended = true; const n = sc.n;
    G.endScene(); G.resetLook(); n.armPose = null; n.lookAt = null; R.scene = null; V.scene = null; G.peril.PERIL.off.set(0, 0, 0);
    const m = R.motives[sc.k]; incident(m, sc.kind, how, sc.act, n);
  }
  function vanNear(n) { const v = vanPos(); return v && G.zone() === 'road' && Math.hypot(v.x - n.object.position.x, v.z - n.object.position.z) < 4; }
  function dropped(k, g) {
    // the knife on the floor, where it fell; it stays there until its owner picks it up
    const Z = C.zoneOf(G.zone()); if (!Z) return; const e = { id: 'dropped-' + k, type: 'social', object: g, point: g.position, radius: 1.4, get prompt() { return '[ E ] THE KNIFE ON THE FLOOR'; }, run: () => G.line(pick(['(You do not pick it up. Your hand will not do it.)', '(There is fat on the blade, and something that is not fat.)'])) };
    Z.interactables.push(e); V.droppedKnife = { k, g, e, Z };
  }

  // ---------------------------------------------------------------------------------
  // After. Tobia lives, and nothing is settled: the body, the attacker, the table, Il Primo.
  // ---------------------------------------------------------------------------------
  const WEAPON = { knife: 'the knife', thrust: 'a blade', wrench: 'the wrench', grip: 'their hands', cup: 'the tea', pit: 'the hole in the yard', van: 'the van', blast: 'the charges' };
  const PLACE_OF = { home: 'in the kitchen', road: 'outside', cellar: 'in the cellar', church: 'at the church', ruin: 'in the empty house', abattoir: 'at the slaughterhouse' };
  function incident(m, kind, how, act, n) {
    const k = m?.k || V.scene?.k; if (!k) return;
    const inc = { id: 'inc' + (V.incidents.length + 1), k, kind, how, act, at: now(), zone: G.zone(), seen: C.present().filter(x => x.key !== k && C.dist2(x) < 9).map(x => x.key) };
    V.incidents.push(inc);
    // Tobia: the body keeps it
    const W = V.wounds[k] = { kind, how, at: now(), sev: how === 'hurt' ? 1 : .8, first: true };
    G.peril.shock(how === 'hurt' ? 1 : .9);
    if (!C.B.on && Math.random() < .7) C.startBleed();
    // the one who did it: their own state, coloured by who they are and how it ended
    const after = afterState(k, kind, how, act);
    if (m) { m.after = after; m.cool = now() + (after === 'humiliated' ? 120 : after === 'afraid' ? 220 : 160) + Math.random() * 60; m.retries = (m.retries || 0) + 1; if (m.v) { m.v.stage = 'after'; m.v.t = 0; } }
    affect(k, { g: after === 'humiliated' ? 1.6 : after === 'resentful' ? 1 : .3, f: after === 'afraid' ? 1.2 : .4 }, `${nm(k)} came at you with ${WEAPON[kind] || 'something'} ${PLACE_OF[inc.zone] || ''}, and you are still alive.`);
    note(k, `${nm(k)} came at you with ${WEAPON[kind] || 'something'} ${PLACE_OF[inc.zone] || ''}. You ${how === 'hurt' ? 'were hurt, and lived' : 'got out of the way'}.`);
    S.truths.push(`${nm(k)} tried to kill you with ${WEAPON[kind]}. You lived.`);
    G.journal({ id: 'attack-' + inc.id, title: { knife: 'The board', thrust: 'From behind', wrench: 'The wrench', grip: 'Hands from behind', cup: 'The cup', pit: 'The yard', van: 'The headlights', blast: 'The lead' }[kind] || 'It happened', description: afterLine(k, kind, how, act), kind: 'what happened', zone: inc.zone });
    // the attacker's first moments afterwards: ordinary again too quickly
    if (n && C.sameZone(n)) later(1.2, () => G.line(firstAfter(k, kind, how, act, after)));
    // then they walk away, the way people leave a room: Franco back to the board, a stalker out of
    // sight (to come back later), Pino to his van. Nobody is put back in their chair by magic.
    later(2.5 + Math.random() * 1.5, () => {
      if (!n || !C.alive(k)) return;
      if (kind === 'knife' && k === 'franco') C.walkTo('franco', [BOARD], () => { const f = C.npcOf('franco'); if (f) f.object.rotation.y = Math.PI; });
      else if ((kind === 'grip' || kind === 'thrust') && m?.hunt) { m.hunt.state = 'withdraw'; m.hunt.cd = Math.max(m.hunt.cd || 0, (m.cool || now()) - now()); m.hunt.seenT = 0; }
    });
    V.react.push(inc);
    // Il Primo will hear of it before anyone tells him
    if (C.alive('primo')) V.primo.push({ inc, at: now() + 45 + Math.random() * 40, stage: 0 });
  }
  function afterState(k, kind, how, act) {
    const s = SOCIAL[k] || {};
    if (act === 'grab' || act === 'hands' || act === 'drive') return s.care > .5 ? 'ashamed' : 'humiliated';
    if (how === 'hurt') return s.care > .45 ? 'afraid' : 'satisfied';
    if (k === 'pino') return 'afraid';
    return s.violence > .6 ? 'resentful' : 'ashamed';
  }
  function afterLine(k, kind, how, act) {
    const N = nm(k);
    const L = {
      knife: { clean: act === 'grab' ? `${N} came across the kitchen talking about the joint. You had his wrist in both hands before you knew you had moved. The knife is somewhere on the floor.` : `${N} came across the kitchen talking about the joint. The knife went into the door frame where you had been standing.`, hurt: `${N} came across the kitchen talking about the joint. Your forearm is open from the wrist to the elbow; you did not know you had raised it.` },
      thrust: { clean: `A step behind you, then ${N}, and a blade where your back had been.`, hurt: `${N}, from behind. The blade went along your ribs instead of between them.` },
      wrench: { clean: `${N} broke his own van first, so you would understand. Then he swung, with all his weight, and the wrench went over your head into the metal.`, hurt: `${N} swung the wrench with all his weight. It caught your shoulder and put you on your knees in the gravel.` },
      grip: { clean: `${N}, from behind, with ${WEAPON.grip}. You drove ${him(k)} back into the wall and got out from under it.`, hurt: `${N}, from behind. You got out of it, eventually. Your throat will remember it longer than you do.` },
      blast: { clean: 'You let go of the lead and threw yourself into the ditch. The church came down without you.', hurt: 'You let go of the lead too late. The church came down and threw you into the ditch.' },
      cup: { clean: 'Ines made you tea. You did not drink it, or you got it out of you over the basin. You do not know which of you knows.', hurt: 'Ines made you tea. You drank it. You got most of it out over the basin, with her holding your hair.' },
      pit: { clean: 'The cesspit in the yard had its lid off and a sheet of plastic over it. You climbed out. Walter said he had been meaning to fix that lid for years.', hurt: 'The cesspit in the yard had its lid off and a sheet of plastic over it. You climbed out with one leg that will not take your weight.' },
      van: { clean: 'The van came out of the dark with its lights on and did not brake. It missed.', hurt: 'The van came out of the dark and did not brake. It caught you and put you in the ditch.' }
    };
    return (L[kind] || L.knife)[how === 'hurt' ? 'hurt' : 'clean'];
  }
  function firstAfter(k, kind, how, act, after) {
    const A = {
      franco: { humiliated: '(Franco stands there with his empty hand open, breathing through his nose. Then he goes back to the board and starts cutting again, with the small knife, very fast.)', resentful: '(Franco pulls the knife out of the wood. He wipes it on his apron, both sides. “Look at that,” he says. “Look what you did to the door.”)', satisfied: '(Franco looks at the blood on the floor for a long time, as if he had dropped something. Then he goes to get the mop.)', afraid: '(Franco sits down on the floor of the kitchen. He doesn’t say anything.)', ashamed: '(Franco says your name, once, and doesn’t finish.)' },
      pino: { afraid: '(Pino drops the wrench in the gravel. His hands are shaking worse than yours. “I didn’t,” he says. “I wasn’t going to.”)', humiliated: '(Pino gets up off the gravel and doesn’t look at you. He picks up the wrench and goes to close the bonnet.)', satisfied: '(Pino stands over you breathing hard. Then he gets in the van and sits in the driver’s seat with the door open, not starting it.)', resentful: '(Pino spits in the gravel. “Next time hold still,” he says, and he almost laughs.)', ashamed: '(Pino looks at the wrench in his hand as if somebody had put it there.)' }
    };
    return A[k]?.[after] || `(${nm(k)} stands there. Then ${he(k)} turns away and does something ordinary with ${his(k)} hands, as if nothing had happened, as if you were not there.)`;
  }

  // ---------------------------------------------------------------------------------
  // The table. Everyone heard something. Nobody heard the same thing.
  // ---------------------------------------------------------------------------------
  function stanceOf(k, inc) {
    if (k === 'primo') return 'primo';
    const a = inc.k, r = S.rel[k] || { trust: 0, grievance: 0, fear: 0 }, so = SOCIAL[k] || {}, sa = SOCIAL[a] || {};
    if (so.protects?.includes(a) || so.confidant === a || sa.confidant === k || sa.protects?.includes(k)) return r.trust > 2.6 ? 'torn' : 'defend';
    if (so.protects?.includes('tobia') && r.trust > -.5) return (so.care ?? .5) > .6 ? 'warn' : 'side';
    if (r.trust > 1.6) return 'side';
    if ((so.violence ?? 0) > .55 && (r.grievance > 1.2 || (so.loyalty ?? 0) > .8)) return 'encourage';
    if (r.fear > 1.1 || ((so.care ?? .5) >= .45 && (so.violence ?? 0) < .25)) return 'distance';
    if ((so.distorts ?? 0) >= .4 || r.grievance > 2) return 'accuse';
    return (so.loyalty ?? .5) > .5 ? 'deny' : 'distance';
  }

  const STANCE_LINES = {
    defend: (k, a, w) => pick([`${UP(k)}: ${nm(a)} was working. You don’t go near a man when he’s working. Everybody knows that.`, `${UP(k)}: ${nm(a)} wouldn’t. Not ${nm(a)}. You must have done something.`, `${UP(k)}: (to ${nm(a)}, loud enough) Sit down. Eat. It’s finished.`]),
    accuse: (k, a, w) => pick([`${UP(k)}: I saw your face when you came in. I didn’t see ${his(a)}.`, `${UP(k)}: It was quiet here before. Strangers bring it in with them, on their shoes.`, `${UP(k)}: You went for ${him(a)}. That’s what it looked like from here.`]),
    deny: (k, a, w) => pick([`${UP(k)}: (stirring) Nobody did anything. Who wants more bread?`, `${UP(k)}: What ${w.replace(/^the /, '')}? There’s no ${w.replace(/^the /, '')}.`, `${UP(k)}: The radio said rain tomorrow. (Nobody answers.)`, `${UP(k)}: I was in the other room. I didn’t hear anything. I never hear anything.`]),
    distance: (k, a, w) => pick([`(${nm(k)} gets up and moves ${his(k)} plate to the far end of the table, away from both of you.)`, `(${nm(k)} doesn’t look at you, or at ${nm(a)}. ${UP(k)}: I’m going to bed.)`, `(${nm(k)} keeps both hands under the table.)`]),
    side: (k, a, w) => pick([`${UP(k)}: (quietly) ${he(a)[0].toUpperCase() + he(a).slice(1)} went for you. I saw it. I’m not saying it twice.`, `(${nm(k)} pours you a glass of wine without asking, and pushes it across, and keeps a hand on the bottle.)`]),
    torn: (k, a, w) => pick([`${UP(k)}: ${nm(a)} isn’t like that. ${he(a)[0].toUpperCase() + he(a).slice(1)} isn’t. (${he(k)[0].toUpperCase() + he(k).slice(1)} doesn’t finish.)`, `(${nm(k)} looks from ${nm(a)} to you and back, and puts a hand over ${his(k)} mouth.)`])
  };
  const OWN = {
    franco: { knife: 'FRANCO: I had a knife in my hand because I was cutting. That’s what it’s for. He jumped at me. Thirty years nobody jumped at me.' },
    pino: { wrench: 'PINO: I was fixing the van. He came up behind me in the dark. I’ve got a wrench in my hand, I’ve always got a wrench in my hand.', van: 'PINO: The brakes. I told you all about the brakes. Nobody listens to me about the brakes.' },
    ines: { cup: 'INES: (calmly) He has a weak stomach. I made him tea. That is all I did. That is all I ever do.' },
    walter: { pit: 'WALTER: That lid has been loose for years. I said it. I wrote it on the list. Nobody reads the list.', van: 'WALTER: I was moving the van. You were standing where nobody stands.', blast: 'WALTER: You were told to hold the line and call. You let go. You could have killed everyone.' },
    gabri: { thrust: 'GABRI: (laughing too much) It was a joke. Tell them it was a joke. Tell them.' }
  };
  function reactScene(inc) {
    const ppl = C.present().map(x => x.key).filter(x => !C.R.dead.has(x));
    const lines = [], A = inc.k, w = WEAPON[inc.kind] || 'it';
    V.versions[inc.id] = V.versions[inc.id] || {};
    if (ppl.includes(A)) { const own = OWN[A]?.[inc.kind] || `${UP(A)}: (to the table, not to you) It was nothing. It was an accident. Ask him.`; lines.push(own); V.versions[inc.id][A] = 'accident'; }
    const others = ppl.filter(k => k !== A && k !== 'primo');
    others.sort(() => Math.random() - .5);
    let pub = 0; const usedLines = new Set();
    for (const k of others) {
      const st = stanceOf(k, inc); V.versions[inc.id][k] = st;
      if (st === 'warn') { V.warns.push({ k, inc, at: now() + 10 }); continue; }
      if (st === 'encourage') { V.primo.push({ inc, at: now() + 25 + Math.random() * 25, stage: 'urge', by: k }); continue; }
      if (pub < 3) { let L0 = null; for (let tries = 0; tries < 6; tries++) { L0 = STANCE_LINES[st]?.(k, A, w); const core = (L0 || '').replace(/^[A-Z ]+: /, ''); if (!usedLines.has(core)) { usedLines.add(core); break; } }
        lines.push(k === 'livia' ? ({ side: `(Livia writes on a napkin and pushes it to you: ${nm(A).toUpperCase()} MEANT IT.)`, defend: '(Livia writes on a napkin: everyone is tired)', accuse: '(Livia writes on a napkin, and shows it to the table, not to you: HE STARTED IT)', deny: '(Livia hums the four notes, very quietly, and stops on the fifth.)', distance: '(Livia folds her napkin into a smaller and smaller square.)', torn: '(Livia writes something and crosses it out.)' }[st] || '(Livia hums.)') : k === 'ottavio' ? `(Ottavio did not hear it. He felt it through the floor. He looks from ${nm(A)} to you, and puts his palm flat on the table, and keeps it there.)` : L0); pub++; }
      if (st === 'defend' || st === 'accuse') { affect(k, { g: .6 }, `${nm(k)} believes you provoked ${nm(A)}.`); C.conflict(k, 'tobia', `what happened with ${nm(A)}`); }
      if (st === 'side') affect(k, { t: .4 });
    }
    if (ppl.includes('primo')) {
      lines.push(pick([
        `IL PRIMO: (gently, to the whole table) Nobody is to blame. ${nm(A)} was tired. Tobia was frightened. Frightened people move very quickly. (He lets that sit.)`,
        `IL PRIMO: Tobia. Sit down. Nobody is angry with you. (He says it to the whole table, so the whole table hears that somebody could be.)`,
        `IL PRIMO: We are all going to be very kind to ${nm(A)} tonight. ${he(A)[0].toUpperCase() + he(A).slice(1)} has had a fright.`
      ]));
      V.versions[inc.id].primo = 'reframed';
    }
    if (!lines.length) return false;
    G.line(pick(['(When you come back into the room, the talk stops. Then it starts again, about something else, too loudly.)', '(Everyone is very busy with their plates.)', '(Somebody has cleared your place, and then put it back.)']));
    lines.forEach(l => G.line(l));
    // and then, at once, the ordinary: food, money, the weather
    G.line(pick(['ANNA: The soup won’t keep. Eat it or I give it to the cats.', 'SERGIO: Has anybody paid the electricity? Because they’ll come on Monday.', 'MARTA: The pears are going soft. Somebody has to eat the pears.', 'FRANCO: Pass the salt. No, the coarse one.']));
    C.tense(.35); S.allLookUntil = now() + 4;
    return true;
  }
  // a version, told to you later, when you come close: each person's own account
  const VERSION_LINES = {
    defend: (k, a) => `${UP(k)}: (low) Leave ${nm(a)} alone. Whatever you think happened.`,
    accuse: (k, a) => `${UP(k)}: You know what they’re saying? That you went for ${nm(a)}. I’m only telling you what they’re saying.`,
    deny: (k, a) => `${UP(k)}: (brightly) Did you sleep? You look like you didn’t sleep.`,
    distance: (k, a) => `(${nm(k)} sees you coming and finds something to do on the other side of the room.)`,
    side: (k, a) => `${UP(k)}: (very low) Don’t be alone with ${him(a)}. Not in any room with one door.`,
    torn: (k, a) => `${UP(k)}: ${nm(a)} cried, after. In the toilet. I heard ${him(a)}. I don’t know why I’m telling you.`,
    accident: (k, a) => `${UP(k)}: (as if remembering something mildly embarrassing) About before. Let’s not make it into a thing.`
  };
  function versionsNear() {
    if (G.zone() !== 'home' || !canStart()) return;
    for (const inc of V.incidents) { const vs = V.versions[inc.id]; if (!vs) continue;
      for (const [k, st] of Object.entries(vs)) { const key = inc.id + ':' + k; if (V.told.has(key) || k === 'primo' || !VERSION_LINES[st]) continue; if (!C.near(k, 2.3)) continue; V.told.add(key); G.line(k === 'livia' ? `(Livia presses a folded napkin into your hand as she passes. Inside: ${st === 'side' || st === 'warn' ? 'NOT IN THE KITCHEN. NOT ALONE.' : st === 'accuse' ? 'WHY DID YOU' : 'shhh'})` : k === 'ottavio' ? `(Ottavio catches your sleeve, and points at ${nm(inc.k)}, and then at his own ear, and shakes his head.)` : VERSION_LINES[st](k, inc.k)); return; } }
    for (const w of V.warns) { if (w.done || now() < w.at || !C.near(w.k, 2.6) || !C.alone(4, [w.k])) continue; w.done = true; if (w.k === 'livia') { G.line('(Livia leaves a napkin on your chair: HE WILL COME BACK TO IT.)'); return; } G.line(pick([`${UP(w.k)}: (low, not looking at you) ${he(w.inc.k)[0].toUpperCase() + he(w.inc.k).slice(1)} will come back to it. Not today. Don’t let Il Primo tell you what happened. He wasn’t there.`, `${UP(w.k)}: (low) Lock the bathroom door. Sleep with your shoes on.`])); affect(w.k, { t: .3 }); return; }
  }

  // ---------------------------------------------------------------------------------
  // IL PRIMO. He was in the other room. He tells everyone what happened.
  // He tells the one who did it that it wasn't their fault; that Tobia talks; that it isn't
  // finished. He never says the word. He gives permission, one person at a time.
  // ---------------------------------------------------------------------------------
  function primoTick() {
    if (!V.primo.length || !canStart() || G.zone() !== 'home') return;
    for (const job of V.primo) { if (job.done || now() < job.at) continue; if (primoJob(job) !== false) return; }
    V.primo = V.primo.filter(j => !j.done);
  }
  // returns false when this job cannot happen yet (the people it needs are not in the room)
  function primoJob(job) {
    const A = job.inc.k, m = R.motives[A];
    if (!C.alive(A) || !m) { job.done = true; return false; }
    const pres = C.present().map(x => x.key);
    if (job.stage === 'urge') {
      // another member, violent and aggrieved, encourages it, in plain sight
      if (!pres.includes(job.by) || !pres.includes(A)) return false; job.done = true;
      G.line(`(${nm(job.by)} leans over to ${nm(A)} by the sink and says something short. ${nm(A)} laughs, once, without ${his(A)} face.)`);
      affect(A, { g: .8 }, `${nm(job.by)} told ${nm(A)} something about you, by the sink.`); m.cool = Math.max(now() + 20, (m.cool || 0) - 60); return;
    }
    if (!pres.includes('primo')) return false;
    if (job.stage === 0) {
      // in private: his hand flat between their shoulders; they listen; then they look at you
      if (!pres.includes(A)) { job.at = now() + 20; return false; }
      job.stage = 1; job.at = now() + 30 + Math.random() * 30;
      const reason = pick([`He says you have been asking about ${nm(A)}. On the telephone.`, `He says you told Marta what happened, and that you told it differently.`, `He says you were the one with the knife in your heart, if not in your hand.`, `He says it is not finished, and that ${nm(A)} knows it is not finished.`]);
      G.line(`(At the sink, Il Primo has his hand flat between ${nm(A)}’s shoulder blades and is talking very quietly. ${nm(A)} listens with ${his(A)} eyes closed. Then ${he(A)} opens them and looks across the room at you, for a long time.)`);
      m.why = (m.why || '') + ' Il Primo talked to ' + him(A) + ' afterwards. ' + reason;
      affect(A, { g: 1.4 }, `Il Primo talked to ${nm(A)} at the sink, about you.`); m.cool = now() + 25 + Math.random() * 30; m.after = 'renewed'; if (m.v) m.v.stage = m.v.stage === 'after' ? 'carry' : m.v.stage;
      note(A, `Il Primo talked to ${nm(A)} afterwards, at the sink, with his hand on ${his(A)} back. ${reason}`);
      // in public, the opposite: he is kind to you, which is how everyone learns there is something to forgive
      later(6, () => { if (G.zone() === 'home' && C.alive('primo')) G.line(pick(['IL PRIMO: (passing your chair, warmly) You’re shaking. Somebody get Tobia a blanket.', 'IL PRIMO: (to the table) We forgive easily in this house. That is the whole point of this house.'])); });
      return;
    }
    if (job.stage === 1) {
      // a third person: he plants a half-truth with somebody who was not there
      job.done = true;
      const cand = pres.filter(k => k !== 'primo' && k !== A && !C.live(k) && (SOCIAL[k]?.violence ?? 0) >= .3 && !(V.versions[job.inc.id]?.[k] === 'side'));
      if (!cand.length) return false; const X = pick(cand);
      G.line(`(Il Primo stops behind ${nm(X)}’s chair and says something about you. You hear your name, and the words “with his hands”.)`);
      affect(X, { g: 1.3 }, `Il Primo told ${nm(X)} that you attacked ${nm(A)}.`);
      (V.versions[job.inc.id] = V.versions[job.inc.id] || {})[X] = 'accuse'; V.told.delete(job.inc.id + ':' + X);
      if ((S.rel[X]?.grievance ?? 0) > 2.4) later(30, () => C.click(X, `Il Primo told ${him(X)} you had gone for ${nm(A)} with your hands, and that ${nm(A)} had only defended ${him(A)}self.`));
    }
  }

  // ---------------------------------------------------------------------------------
  // INES — the tea. A hospitable gesture, made the way she has made it a thousand times, for the
  // sick on the ward at four in the morning. She does not hurry. She watches you drink.
  // ---------------------------------------------------------------------------------
  const STOVE = [-8.35, -8.05];
  function cupPlan(m, dt) {
    const n = C.npcOf('ines'); if (!n || !C.alive('ines')) return;
    const E = m.v || (m.v = { stage: 'wait', t: 0 }); E.t += dt;
    if (E.stage !== 'wait' || now() < (m.cool || 0) || now() - m.born < 30) return;
    if (G.zone() !== 'home' || !C.sameZone(n) || !canStart()) return;
    if (!(S.seated || C.inKitchen() || C.near('ines', 6))) return;
    if (witnessesNear('ines', 3) > 1) return;
    teaScene(m, n, E);
  }
  function teaScene(m, n, E) {
    E.stage = 'making'; R.scene = 'tea'; const cues = [];
    say(null, 'Ines fills the kettle at the sink and puts it on, without asking anyone if they want any.');
    C.walkTo('ines', [STOVE], () => {
      const k = C.npcOf('ines'); if (!k) return; k.object.rotation.y = Math.PI;
      later(1.5, () => G.peril.impact('kettle'));
      // with her back turned: one ordinary thing, one thing that is not
      later(3.2, () => { const watching = C.playerLooksAt({ npc: k }); if (watching) G.line(pick(['(Her right hand goes into her apron pocket, and stays there a moment, and comes out.)', '(She warms the pot first. She has always warmed the pot. Then she does something with the cup you cannot see.)'])); });
      later(6.5, () => {
        G.peril.wield(k, 'cup'); const p = C.playerPos();
        C.walkTo('ines', [[p.x + .55, p.z + .45]], () => { const k2 = C.npcOf('ines'); if (!k2) return; G.turn(k2, C.playerPos().x, C.playerPos().z, 1, 99); G.peril.pose(k2, 'cupOffer', 'cupOffer', 1); k2.lookAt = G.camera.getWorldPosition(v3()); offerTea(m, k2, E, 0); });
      });
    });
  }
  function offerTea(m, n, E, round) {
    const cues = [];
    if (Math.random() < .5) cues.push('She has not poured one for herself.');
    if (Math.random() < .5) cues.push('It is the chipped cup, the one from Aurelio’s place.');
    if (!cues.length) cues.push('She is watching your mouth, not your eyes.');
    const lead = round === 0 ? `INES: You look cold. Here. For the nose. Drink it while it’s warm. (${pick(cues)})` : pick(['INES: It’s going cold.', 'INES: (She does not sit down.) Drink. Before it goes cold.', 'INES: It’s only tea, Tobia.']);
    G.line(lead);
    const opts = [
      ['(Drink it.)', () => drink(m, n, 1)],
      ['(Take a sip.)', () => { G.line('(Hot. Under the tea, something green and flat, like the water in a vase that has been left too long.)'); drink(m, n, .4, true); }],
    ];
    if (round === 0) opts.push(['(Smell it first.)', () => { G.line(pick(['(It smells of tea. Under it, very faint, something like the inside of a coin.)', '(Tea, and lemon, and something like a wet stone.)'])); later(.1, () => offerTea(m, n, E, 1)); }]);
    if (!E.shared) opts.push(['“Have one with me.”', () => { E.shared = true; me('Have one with me.'); shareTea(m, n, E); }]);
    opts.push(['(Put it down. Get up.)', () => leaveTea(m, n, E)]);
    ch(opts, { timeout: round ? 14 : 20, silence: () => { if (round >= 2) leaveTea(m, n, E, true); else offerTea(m, n, E, round + 1); }, leave: () => leaveTea(m, n, E) });
  }
  function shareTea(m, n, E) {
    say(null, 'She goes back to the stove and pours a second cup from the same pot, and sits down across from you with it, and holds it in both hands.');
    later(5, () => {
      const turned = Math.random() < .6;
      if (turned) G.line('(Someone laughs in the next room. Ines turns her head to see who.)');
      const opts = [['(Drink yours.)', () => drink(m, n, 1)], ['(Take a sip.)', () => drink(m, n, .4, true)]];
      if (turned) opts.unshift(['(Swap the cups.)', () => {
        G.line('(You change the cups over while she is looking at the door. When she turns back, she lifts hers to drink, and stops, with it at her lip.)');
        later(3, () => { G.line('(She looks at the cup in her hand for a long time. Then she sets it down on the table, very carefully, as if it were full to the brim, and gets up, and goes out of the room.)'); exposeTea(m, n); });
      }]);
      opts.push(['“You first.”', () => { me('You first.'); G.line('(She holds the cup to her mouth and doesn’t drink. “I can’t,” she says. “I never can. I only ever do it for other people.”)'); exposeTea(m, n); }]);
      opts.push(['(Put it down. Get up.)', () => leaveTea(m, n, E)]);
      ch(opts, { timeout: 16, silence: () => { G.line('INES: (She drinks from her own cup at last, a very small sip, and watches you over the rim.)'); offerTea(m, n, E, 2); } });
    });
  }
  function teaDone(n) { G.peril.pose(n, null); G.peril.unwield(n); n.lookAt = null; R.scene = null; }
  function leaveTea(m, n, E, poured) {
    teaDone(n); E.stage = 'wait'; m.cool = now() + 150 + Math.random() * 60;
    G.line(poured ? '(She waits. Then she takes the cup back, and pours it into the dead man’s bowl at the end of the table, and wipes the rim of the bowl with her thumb.)' : '(She watches the cup go cold where you put it down. Later it is gone, and the dead man’s bowl at the end of the table is full.)');
    later(30, () => { if (G.zone() === 'home' && C.alive('ines')) G.line('INES: (to nobody) Tomorrow I’ll make broth. Broth is better for the blood.'); });
    note('ines', 'Ines made you tea and you did not drink it. She poured it into the dead man’s bowl.');
  }
  function exposeTea(m, n) {
    teaDone(n); C.defuse('ines', 'You made Ines hold the cup herself. She could not drink it.'); m.after = 'exposed';
    const seen = C.present().filter(x => x.key !== 'ines' && C.dist2(x) < 6).map(x => x.key);
    incident(m, 'cup', 'clean', 'swap', n);
    if (seen.length) seen.forEach(k => affect(k, { f: .6 }, 'You saw Ines unable to drink her own tea.'));
    if (C.alive('primo')) V.primo.push({ inc: V.incidents[V.incidents.length - 1], at: now() + 90, stage: 0 });
  }
  function drink(m, n, dose, sip) {
    if (C.mercy()) { teaDone(n); G.line('(Ines’s hand stops your wrist halfway. She takes the cup back without a word and pours it into the dead man’s bowl.)'); C.defuse('ines', 'Ines could not let you drink it.'); return; }
    const was = V.poison?.dose || 0;
    V.poison = { dose: Math.min(1.1, was + dose), t: V.poison?.t || 0, purged: false, said: {}, by: 'ines' };
    G.line(sip ? '(You set the cup down. She doesn’t take it away.)' : '(You drink it. It is very hot, and then it is only warm, and then you can’t feel your lips.)');
    if (sip) { G.line('INES: Good. (She waits, as if for the rest.)'); ch([['(Drink the rest.)', () => drink(m, n, .7)], ['(Leave it.)', () => { teaDone(n); m.v.stage = 'wait'; m.cool = now() + 200; }]], { timeout: 12, silence: () => { teaDone(n); m.v.stage = 'wait'; m.cool = now() + 200; } }); return; }
    teaDone(n); m.v.stage = 'watching';
    // she stays near. She watches. That is the worst part.
    later(4, () => { const k = C.npcOf('ines'); if (k) k.stareUntil = G.elapsed() + 60; });
  }
  function poisonTick(dt) {
    const Pn = V.poison; if (!Pn || Pn.dead) return;
    Pn.t += dt; const t = Pn.t, d = Pn.dose;
    const target = Pn.purged ? Math.max(0, Pn.peak - (t - Pn.purgedAt) * .012) : d * ease((t - 4) / 50);
    Pn.level = target; Pn.peak = Math.max(Pn.peak || 0, target); G.peril.poison(target * .95);
    const L = (key, at, text) => { if (!Pn.said[key] && t > at && !Pn.purged) { Pn.said[key] = true; G.line(text); } };
    L('lips', 7, '(Your lips are tingling, the way they do after the dentist.)');
    L('far', 17, '(The room is a little further away than it was. The voices too.)');
    if (d > .7) { L('hands', 29, '(Your hands are slow. You watch one of them pick up a spoon and it takes a long time.)'); L('get', 38, 'TOBIA: (thinking) The tea. Get it out. Get it out of you, now.'); L('knees', 56, '(Your knees go soft. The floor is very interesting.)'); }
    if (t > 22 && !Pn.bled) { Pn.bled = true; if (!C.B.on) C.startBleed(); }
    if (Pn.purged && target <= .01) { V.poison = null; G.peril.poison(0); }
    if (!Pn.purged && d > .7 && t > 72) { Pn.dead = true; G.peril.poison(0); C.kill('ines', 'cup'); }
    if (!Pn.purged && d <= .7 && t > 95) { Pn.purged = true; Pn.purgedAt = t; Pn.peak = target; woundFrom('ines', 'cup', 'hurt'); }
  }
  function purge() {
    const Pn = V.poison; if (!Pn || Pn.purged) return false;
    C.closeUI(); R.scene = 'purge'; Pn.purged = true; Pn.purgedAt = Pn.t;
    G.peril.lurch([0, -.45, -.25], .4, { hold: 2.8, back: .8 }); G.peril.shake(.4);
    G.line('(Two fingers. The basin. It comes up hot and green and it goes on coming.)');
    [0, .9, 1.9].forEach(d => setTimeout(() => { G.audio()?.mechanicalNoise(.6, 380, .5, .3, 0); G.peril.shake(.35); }, d * 1000));
    const ines = C.npcOf('ines'), near = ines && C.near('ines', 6);
    later(3.6, () => {
      R.scene = null;
      if (near) { G.line('(A hand gathers your hair back from your face and holds it, gently, until you have finished. “You ate too fast,” Ines says. “You always eat too fast.”)'); ines.stareUntil = 0; }
      else G.line('(You stay bent over the basin until your legs stop shaking. Nobody comes.)');
      const m = R.motives.ines; if (m) { if (m.v) m.v.stage = 'wait'; m.cool = now() + 260; }
      woundFrom('ines', 'cup', Pn.dose > .7 ? 'hurt' : 'clean');
    });
    return true;
  }
  function woundFrom(k, kind, how) { const m = R.motives[k] || { k }; incident(m, kind, how, kind === 'cup' ? 'purge' : null, C.npcOf(k)); }

  // ---------------------------------------------------------------------------------
  // WALTER — the cesspit in the yard. The concrete lid has always been loose. He takes it off,
  // props it against the wall, lays a sheet of black silage plastic over the hole and scatters
  // straw on it. It is on the way from the door to the van. If you come close, the yard smells
  // of drains; if you have a torch, the plastic sags in the middle. If you fall, he comes.
  // ---------------------------------------------------------------------------------
  const PIT = [3.25, -4.6], PIT_R = .58;
  function buildPit() {
    if (V.pit?.g) return V.pit; const Z = C.zoneOf('road'); if (!Z) return null;
    const g = new THREE.Group(); g.position.set(PIT[0], 0, PIT[1]); Z.group.add(g);
    const conc = G.mat(0x77746b, .95), dark = new THREE.MeshBasicMaterial({ color: 0x020202 });
    const rim = new THREE.Mesh(new THREE.RingGeometry(PIT_R, PIT_R + .14, 28), conc); rim.rotation.x = -Math.PI / 2; rim.position.y = .012; g.add(rim);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(PIT_R, 28), dark); hole.rotation.x = -Math.PI / 2; hole.position.y = .008; g.add(hole);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(PIT_R, PIT_R * .92, 3.4, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x2a2822, roughness: 1, side: THREE.BackSide })); wall.position.y = -1.7; g.add(wall);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(PIT_R * .92, 20), new THREE.MeshStandardMaterial({ color: 0x15130e, roughness: .4 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -3.38; g.add(floor);
    for (let i = 0; i < 3; i++) { const rung = new THREE.Mesh(new THREE.TorusGeometry(.12, .012, 5, 10, Math.PI), G.mat(0x4a2a18, .8, { metalness: .5 })); rung.position.set(0, -.75 - i * .85, -PIT_R + .03); g.add(rung); }
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(PIT_R + .1, PIT_R + .1, .07, 24), conc); lid.position.y = .04; g.add(lid);
    const tarp = new THREE.Mesh(new THREE.CircleGeometry(PIT_R + .45, 18), new THREE.MeshStandardMaterial({ color: 0x0b0c0b, roughness: .35, side: THREE.DoubleSide }));
    { const pos = tarp.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), r = Math.hypot(x, y); pos.setZ(i, -Math.max(0, (PIT_R - r)) * .18 + (Math.random() - .5) * .01); } tarp.geometry.computeVertexNormals(); }
    tarp.rotation.x = -Math.PI / 2; tarp.position.y = .02; tarp.visible = false; g.add(tarp);
    for (let i = 0; i < 26; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.18, .004, .012), G.mat(0x8c7a4c, 1)); const a = Math.random() * 6.28, r = Math.random() * (PIT_R + .3); s.position.set(Math.cos(a) * r, .03, Math.sin(a) * r); s.rotation.y = Math.random() * 3; tarp.add(s); s.rotation.x = Math.PI / 2; }
    // seen from inside, the ground has an underside: only the circle of the opening shows the sky
    const under = new THREE.Mesh(new THREE.RingGeometry(PIT_R, 40, 32, 1), new THREE.MeshBasicMaterial({ color: 0x050504, side: THREE.DoubleSide })); under.rotation.x = -Math.PI / 2; under.position.y = -.03; under.visible = false; g.add(under);
    V.pit = { g, lid, tarp, hole, under, state: 'closed', used: false, Z };
    return V.pit;
  }
  function openPit(k) {
    const Pt = buildPit(); if (!Pt || Pt.state !== 'closed') return; Pt.state = 'set'; Pt.by = k; Pt.at = now();
    Pt.lid.position.set(-.6 - PIT_R, .45, .9); Pt.lid.rotation.set(Math.PI / 2 - .25, 0, .4);    // propped against the van wheel
    Pt.tarp.visible = true; Pt.smelt = false; Pt.sagSeen = false;
    Pt.entry = { id: 'pit-sheet', type: 'social', object: Pt.tarp, point: new THREE.Vector3(PIT[0], .1, PIT[1]), radius: 1.9, get prompt() { return '[ E ] THE PLASTIC SHEET'; }, run: () => revealPit('lifted') };
    Pt.Z.interactables.push(Pt.entry);
  }
  function revealPit(how) {
    const Pt = V.pit; if (!Pt || Pt.state !== 'set') return; Pt.state = 'open'; Pt.tarp.visible = false;
    const i = Pt.Z.interactables.indexOf(Pt.entry); if (i >= 0) Pt.Z.interactables.splice(i, 1);
    G.line(how === 'lifted' ? '(Under the plastic there is nothing. A round black nothing, the width of a man, and the smell coming up out of it. The lid is leaning against the van wheel.)' : '(The plastic goes down into the dark with a sound like a breath. Straw goes after it.)');
    G.peril.shock(.55); note(Pt.by || 'walter', 'Somebody took the lid off the cesspit in the yard and laid plastic over it, on the way from the door to the van.');
    Pt.used = true;
  }
  function pitPlan(m, dt) {
    const Pt = buildPit(); if (!Pt) return; const E = m.v || (m.v = { stage: 'brew', t: 0 }); E.t += dt;
    if (E.stage === 'brew') { if (now() - m.born < 25 || G.zone() === 'road' || Pt.state !== 'closed') return; openPit('walter'); E.stage = 'set'; note('walter', 'Walter went out to the yard with a torch and was gone a long time.'); if (G.zone() === 'home' && C.sameZone(C.npcOf('walter'))) say(null, 'Walter gets up and goes out to the yard with a torch. He is gone a long time. When he comes back his trouser cuffs are wet.'); return; }
    if (E.stage === 'set' && Pt.state === 'used') E.stage = 'after';
  }
  function pitTick(dt) {
    const Pt = V.pit; if (!Pt || Pt.state !== 'set' || G.zone() !== 'road' || V.scene) return;
    const p = C.playerPos(), d = Math.hypot(p.x - PIT[0], p.z - PIT[1]);
    if (d < 4.2 && !Pt.smelt) { Pt.smelt = true; G.line('(The yard smells of drains, stronger than it should.)'); }
    if (d < 3.6 && G.flashlight() && !Pt.sagSeen) { G.camera.getWorldDirection(tmp); const dot = (tmp.x * (PIT[0] - p.x) + tmp.z * (PIT[1] - p.z)) / (d || 1); if (dot > .8 && tmp.y < -.15) { Pt.sagSeen = true; G.line('(In the torchlight the black plastic sags in the middle, as if there were nothing under it.)'); } }
    if (d < PIT_R - .12 && G.canAct()) fall(Pt);
  }
  function fall(Pt) {
    Pt.state = 'used'; Pt.used = true; Pt.tarp.visible = false; const i = Pt.Z.interactables.indexOf(Pt.entry); if (i >= 0) Pt.Z.interactables.splice(i, 1);
    C.closeUI(); R.scene = 'pit'; const A = G.peril, a = G.anchor, start = { x: a.position.x, z: a.position.z }; Pt.under.visible = true; Pt.hole.visible = false;
    a.position.set(PIT[0], 0, PIT[1]);
    G.audio()?.mechanicalNoise(.4, 900, .6, .2, 0);
    const sc = { t: 0, phase: 'fall', rungs: 0, lid: 0, k: Pt.by, Pt };
    V.scene = { k: Pt.by, kind: 'pit' };
    G.scene({ dur: 99999, skippable: false, update: (s, dt) => pitScene(sc, dt) });
  }
  function pitScene(sc, dt) {
    sc.t += dt; const a = G.anchor, t = sc.t, Pt = sc.Pt;
    if (sc.phase === 'fall') {
      const q = Math.min(1, t / .65); a.position.y = -3.3 * q * q;
      G.aim(new THREE.Vector3(PIT[0] + .2, 3, PIT[1] + .1), Math.min(1, dt * 3));
      if (q >= 1 && !sc.landed) { sc.landed = true; a.position.y = -3.3; G.peril.impact('body'); G.peril.shake(1.2); G.peril.shock(1); G.peril.PERIL.limp = Math.max(G.peril.PERIL.limp, .75); G.line('(You land on something soft and then on something hard. Your ankle goes under you. The circle of sky is very small and very far up.)'); }
      if (t > 2.4) { sc.phase = 'in'; sc.t0 = t; climbChoice(sc); }
      return;
    }
    // looking up at the opening, which is where everything is going to happen
    G.aim(new THREE.Vector3(PIT[0] + .15, 3, PIT[1] + .05), Math.min(1, dt * 2));
    const k = sc.k, alive = k && C.alive(k) && R.motives[k]?.alive;
    if (alive && !sc.came && t - sc.t0 > (sc.shouted ? 2.5 : 5.5)) {
      sc.came = true; C.sendTo(k, 'road', PIT[0] + .2, PIT[1] - PIT_R - .35, 0); const n = C.npcOf(k); if (n) { n.object.visible = true; n.seated = false; n.walking = false; n.lookAt = G.camera.getWorldPosition(v3()); }
      G.line(`(${nm(k)} is standing at the edge, looking down. ${he(k)[0].toUpperCase() + he(k).slice(1)} has a torch, and ${he(k)} is not shining it at you. ${he(k)[0].toUpperCase() + he(k).slice(1)} is shining it at the depth.)`);
      later(2.4, () => { if (sc.phase === 'in') { G.line(`${UP(k)}: (reasonably) Hold on. I’ll get the rope. (${he(k)[0].toUpperCase() + he(k).slice(1)} doesn’t go anywhere. ${he(k)[0].toUpperCase() + he(k).slice(1)} bends down to the lid.)`); sc.closing = true; G.peril.impact('stone'); } });
    }
    if (sc.closing && sc.phase === 'in') {
      sc.lid = Math.min(1, sc.lid + dt / ([16, 11, 9, 7.5][G.difficulty()] ?? 11));
      Pt.lid.rotation.set(0, 0, 0); Pt.lid.position.set(-(1 - sc.lid) * (PIT_R * 2 + .1), .04, 0);
      if (Math.random() < dt * 3) G.audio()?.mechanicalNoise(.3, 160, .7, .1, 0);
      if (sc.lid >= 1) { sc.phase = 'shut'; Pt.under.visible = false; C.closeUI(); G.fade?.(true, 1.2); setTimeout(() => { V.scene = null; R.scene = null; G.endScene(); a.position.y = 0; G.fade?.(false, .1); C.kill(k, 'pit'); }, 1600); }
    }
  }
  function climbChoice(sc) {
    if (sc.phase !== 'in') return;
    const opts = [['(Pull yourself up to the next rung.)', () => climb(sc)]];
    if (!sc.shouted) opts.push(['(Shout for help.)', () => { sc.shouted = true; me('Help — somebody — I’m in the—'); later(.2, () => climbChoice(sc)); }]);
    opts.push(['(Stay still. Listen.)', () => { G.line('(Water, somewhere. Your own breath. Gravel, above you, under a shoe.)'); later(1.4, () => climbChoice(sc)); }]);
    ch(opts, { timeout: 0, title: '' });
  }
  function climb(sc) {
    if (sc.phase !== 'in') return; sc.rungs++; const a = G.anchor, y0 = a.position.y, y1 = -3.3 + sc.rungs * 1.1; G.peril.impact('breath');
    const t0 = performance.now(); const step = () => { const q = Math.min(1, (performance.now() - t0) / (1100 + G.peril.PERIL.limp * 500)); a.position.y = y0 + (y1 - y0) * q * q * (3 - 2 * q); if (q < 1) requestAnimationFrame(step); else if (sc.rungs >= 3) out(sc); else climbChoice(sc); };
    if (sc.rungs === 1) G.line('(The rung is rust and holds. Your ankle doesn’t.)'); step();
  }
  function out(sc) {
    if (sc.phase !== 'in') return; sc.phase = 'out'; const a = G.anchor; a.position.set(PIT[0] - PIT_R - .5, 0, PIT[1] + .6); sc.Pt.under.visible = false; sc.Pt.hole.visible = true;
    G.endScene(); G.resetLook(); V.scene = null; R.scene = null; C.closeUI();
    const k = sc.k, n = k && C.npcOf(k);
    if (sc.came && n) { G.line(`${UP(k)}: (stepping back from the lid, wiping ${his(k)} hands) There you are. I told Pino a hundred times about that lid. Didn’t I? A hundred times.`); n.lookAt = null; later(4, () => { if (n._home) C.returnHome(n); }); }
    else G.line('(You lie on the gravel beside the hole until your breathing comes back. The lid is leaning against the van wheel, where somebody put it.)');
    const m = R.motives[k] || { k: k || 'walter' }; incident(m, 'pit', 'hurt', 'climb', n);
  }

  // ---------------------------------------------------------------------------------
  // THE VAN. It has been parked somewhere it is never parked. Its engine starts while you are in
  // front of it. The headlights come on. Then it comes, in a straight line, at the speed of a
  // decision. You can get out of its way, if you move.
  // ---------------------------------------------------------------------------------
  function launchVan(m) {
    const Z = C.zoneOf('road'), v = R.van; if (!Z || !v || !v.visible || V.van) return false;
    V.van = { m, v, phase: 'parked', t: 0, home: { pos: v.position.clone(), rot: v.rotation.y } };
    const dn = C.npcOf(m.k); if (dn && C.sameZone(dn)) { dn.object.visible = false; dn.walking = false; V.van.driver = dn; } else if (dn && G.zone() === 'road') V.van.driver = dn;
    if (m.v && ['approach', 'smash', 'corner'].includes(m.v.stage)) m.v.stage = 'carry';
    // moved: nose toward the path between the door and the lane
    v.position.set(-5.2, 0, 3.2); v.rotation.y = Math.atan2(-(.5 + 5.2), -(-4.5 - 3.2)) + Math.PI; v.traverse(o => { if (o.isSpotLight) o.intensity = 0; });
    return true;
  }
  function vanTick(dt) {
    const W = V.van; if (!W) return; const v = W.v;
    if (G.zone() !== 'road') { if (W.phase !== 'parked') parkVan(W); return; }
    W.t += dt; const p = C.playerPos(), o = v.position;
    const heading = new THREE.Vector3(-Math.sin(v.rotation.y), 0, -Math.cos(v.rotation.y));    // the van's nose
    const to = new THREE.Vector3(p.x - o.x, 0, p.z - o.z), d = to.length(); to.normalize();
    if (W.phase === 'parked') {
      if (!W.noticed && d < 18) { W.noticed = true; G.line('(The van is parked by the wall, where nobody parks it, nose toward the yard. The bonnet is warm.)'); }
      if (G.canAct() && !V.scene && d > 9 && d < 22 && heading.dot(to) > .86) { W.phase = 'start'; W.t = 0; G.peril.impact('starter'); }
      return;
    }
    if (W.phase === 'start') {
      if (W.t > .95 && !W.lit) { W.lit = true; v.traverse(x => { if (x.isSpotLight) { x.intensity = 26; x.distance = 30; } }); G.peril.shock(.5); }
      if (W.t > 1.6 && !W.rev) { W.rev = true; G.peril.impact('engine'); }
      if (W.t > 2.5) { W.phase = 'charge'; W.t = 0; W.sp = 1; W.dir = new THREE.Vector3(p.x - o.x, 0, p.z - o.z).normalize(); W.minLat = 99; }
      return;
    }
    if (W.phase === 'charge') {
      if (W.t < .35) W.dir.lerp(to, dt * 2).normalize();           // it lines up once, and then it commits
      W.sp = Math.min(15, W.sp + dt * 9); const step = W.sp * dt;
      const nx = o.x + W.dir.x * step, nz = o.z + W.dir.z * step;
      if (C.solidAt(C.zoneOf('road'), nx, nz, .9)) { W.phase = 'stopped'; W.t = 0; G.peril.impact('metal'); G.peril.shake(.5); return; }
      o.x = nx; o.z = nz; v.rotation.y = Math.atan2(W.dir.x, W.dir.z) + Math.PI;
      if (Math.random() < dt * 5) G.audio()?.mechanicalTone(60 + W.sp * 4, 55 + W.sp * 4, .4, 'sawtooth', .02 + Math.min(.06, 2.5 / Math.max(2.5, d)), 0);
      const rel = new THREE.Vector3(p.x - o.x, 0, p.z - o.z), along = rel.dot(W.dir), lat = Math.abs(rel.x * W.dir.z - rel.z * W.dir.x);
      if (along > 0) W.minLat = lat;                                   // where he is as it reaches him, not where he once stood
      // the last moment: a body can still throw itself sideways
      if (!W.reflexed && along > 0 && along / Math.max(1, W.sp) < .95 && lat < 1.6) {
        W.reflexed = true; const k = W.m.k;
        G.peril.startReflex({ kind: 'van', keys: { KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' }, lead: 0, window: .5, late: .18, hint: 'A / D — THROW YOURSELF ASIDE', onResult: (res, act) => { W.dove = res; if (res !== 'none') { const side = act === 'left' ? -1 : 1; G.peril.lurch([side * 1.7, -.55, 0], .28, { commit: true }); G.peril.shake(.6); G.peril.impact('body'); } } });
      }
      if (along < -.5 && along > -3 && !W.passed) {
        W.passed = true; const dove = W.dove, lat2 = W.minLat;
        if (dove === 'clean' || (lat2 > 1.25 && dove !== 'late')) { G.peril.shake(.5); G.peril.shock(.9); G.line(pick(['(It goes past close enough to move your coat. No brake lights.)', '(Wind, metal, the smell of hot oil. It does not stop.)'])); vanAfter(W, 'clean'); }
        else if (dove === 'late' || lat2 > .75) { G.peril.impact('body'); G.peril.shake(1.2); G.peril.lurch([1.4, -1.0, 1.2], .3, { hold: 1.6, back: .9 }); G.peril.PERIL.limp = Math.max(G.peril.PERIL.limp, .7); G.peril.bleed(); G.line('(The wing mirror takes you across the hip. Then you are in the ditch, looking at the sky, and the van is gone.)'); vanAfter(W, 'hurt'); }
        else { W.phase = 'done'; G.peril.impact('body'); G.peril.shake(1.4); setTimeout(() => C.kill(W.m.k, 'van'), 300); }
      }
      if (W.t > 9) parkVan(W);
      return;
    }
    if (W.phase === 'stopped' && !W.recorded) { W.recorded = true; G.line('(It stops against the wall with a sound like a dropped tray. The engine runs on. Nobody gets out.)'); incident(W.m, 'van', 'clean', 'cover', null); }
    if (W.phase === 'stopped' && W.t > 4) parkVan(W);
  }
  function vanAfter(W, how) { W.phase = 'gone'; setTimeout(() => parkVan(W), 4000); const m = W.m; incident(m, 'van', how, W.dove ? 'dive' : 'step', null); }
  function parkVan(W) { const v = W.v; v.position.copy(W.home.pos); v.rotation.y = W.home.rot; v.traverse(o => { if (o.isSpotLight) o.intensity = 0; }); V.van = null; const dn = W.driver; if (dn && dn.object.parent === C.zoneOf('road')?.group && !C.R.dead.has(W.m.k)) { dn.object.position.set(v.position.x - 1.25, 0, v.position.z + .2); dn.object.visible = true; } }

  // ---------------------------------------------------------------------------------
  // Absence. When somebody who has decided is not where they should be, the house shows it.
  // ---------------------------------------------------------------------------------
  function traces(name) {
    const hostile = Object.values(R.motives).filter(m => m.alive && !C.R.dead.has(m.k) && C.alive(m.k));
    for (const m of hostile) {
      const n = C.npcOf(m.k); const here = n && C.sameZone(n); if (here) continue;
      if (now() - (V.traceAt[m.k] || -999) < 70) continue; V.traceAt[m.k] = now();
      if (name === 'home') {
        const asker = C.present().find(x => x.key !== 'primo' && x.key !== m.k);
        const opts = [
          `(${nm(m.k)}’s chair is pushed back from the table. ${his(m.k)[0].toUpperCase() + his(m.k).slice(1)} glass is full. Nobody has moved it.)`,
          asker ? `${UP(asker.key)}: Has anyone seen ${nm(m.k)}? ${he(m.k)[0].toUpperCase() + he(m.k).slice(1)} didn’t finish ${his(m.k)} plate.` : null,
          '(The back door is standing open. Cold air comes along the floor. Nobody remembers opening it.)',
          m.k === 'franco' && knifeBlock && !knifeBlock.slots[0].visible ? '(The knife block by the sink has an empty slot. The big one.)' : null
        ].filter(Boolean);
        later(1.4, () => G.line(pick(opts))); return;
      }
      // the van is Pino's second way, after his hands have failed him (or Walter's, any time)
      if (name === 'road' && ((m.k === 'pino' && (m.retries || 0) > 0 && m.v?.stage !== 'carry') || m.k === 'walter') && R.van?.visible && !V.van) {
        // his van, moved, and the engine still ticking
        if (Math.random() < .6 && launchVan(m)) return;
      }
    }
  }

  // ---------------------------------------------------------------------------------
  // The body afterwards: a tremor that rises when they are near, a memory that comes back when
  // you first see them again; sound that goes far away. It fades, but not while they are alive
  // and in the room.
  // ---------------------------------------------------------------------------------
  function woundTick(dt) {
    let u = 0;
    for (const [k, W] of Object.entries(V.wounds)) {
      const age = now() - W.at, base = W.sev * Math.max(.18, 1 - age / 420);
      const n = C.npcOf(k), here = n && C.sameZone(n) && C.alive(k);
      if (here) { const d = distTo(n); u = Math.max(u, base * (d < 2.5 ? .85 : d < 6 ? .55 : .3));
        if (W.first && age > 8 && d < 9 && C.sees(n)) { W.first = false; G.peril.shock(.75); G.glitch?.(.35); G.line(pick({ franco: ['(Franco is cutting bread. The sound the knife makes on the board goes into your teeth.)'], pino: ['(Pino is wiping his hands on a rag. You can hear the wrench without it making any sound.)'], ines: ['(Ines is pouring tea for Livia. Your mouth fills with water.)'], walter: ['(Walter is measuring the doorway again. You can smell the yard.)'] }[k] || [`(${nm(k)} is laughing at something Sergio said. Your hands start before you do.)`])); }
      } else u = Math.max(u, base * .18);
    }
    G.peril.PERIL.unease = Math.min(.85, u);
  }

  // ---------------------------------------------------------------------------------
  // Wiring
  // ---------------------------------------------------------------------------------
  function update(dt) {
    if (S.ending) return;
    for (const m of Object.values(R.motives)) {
      if (!m.alive || C.R.dead.has(m.k)) continue;
      const kind = planFor(m.k, m.kind); if (kind !== m.kind) m.kind = kind;
      // after an attempt, when it has cooled: the resentful, the humiliated and the satisfied come back
      // to it by themselves; the ashamed and the afraid only if the grievance grows, or someone works on them
      if (m.v?.stage === 'after' && now() > (m.cool || 0)) {
        const back = ['resentful', 'humiliated', 'satisfied', 'renewed'].includes(m.after) || (S.rel[m.k]?.grievance ?? 0) > 3.2;
        if (back) { m.v.stage = m.kind === 'cup' ? 'wait' : 'carry'; m.v.t = 0; note(m.k, `${nm(m.k)} has not let it go.`); }
        else m.cool = now() + 90;
      }
      if (m.kind === 'knife') knifePlan(m, dt);
      else if (m.kind === 'wrench') wrenchPlan(m, dt);
      else if (m.kind === 'cup') cupPlan(m, dt);
      else if (m.kind === 'pit') pitPlan(m, dt);
    }
    poisonTick(dt); pitTick(dt); vanTick(dt); woundTick(dt);
    if (V.react.length && G.zone() === 'home' && C.present().length >= 3 && canStart() && now() - V.react[0].at > 4) { const inc = V.react.shift(); reactScene(inc); }
    primoTick(); versionsNear();
    // the knife on the floor goes back to its owner, eventually, when nobody is looking
    const D = V.droppedKnife; if (D && G.zone() !== D.Z.name && now() > (R.motives[D.k]?.cool || 0) - 30) { const i = D.Z.interactables.indexOf(D.e); if (i >= 0) D.Z.interactables.splice(i, 1); D.g.parent?.remove(D.g); V.droppedKnife = null; }
  }
  function onEnter(name) {
    // leaving interrupts an encounter; it does not end it
    for (const m of Object.values(R.motives)) {
      if (!m.alive || !m.v) continue; const st = m.v.stage;
      if (['approach', 'corner', 'smash'].includes(st)) {
        const n = C.npcOf(m.k); m.v.stage = 'carry'; m.cool = now() + 25 + Math.random() * 30; m.interrupts = (m.interrupts || 0) + 1;
        if (n) { n.armPose = null; n.lookAt = null; n.walking = false; }
        affect(m.k, { g: .35 }, `You walked out on ${nm(m.k)} in the middle of something.`); note(m.k, `You left while ${nm(m.k)} was coming toward you. ${he(m.k)[0].toUpperCase() + he(m.k).slice(1)} did not follow. Not then.`);
        if (m.k === 'franco' && n) { C.walkTo('franco', [BOARD], () => { const k = C.npcOf('franco'); if (k) k.object.rotation.y = Math.PI; }); later(1.2, () => G.line('(Behind you, through the door, the sound of the knife going back to the board. The same rhythm. Faster.)')); }
        if (m.k === 'pino') later(1.2, () => G.line('(Behind you, in the yard, something metal is thrown into the back of the van.)'));
      }
    }
    traces(name);
    if (name === 'road') buildPit();
  }
  return {
    update, onEnter, strike: (m, kind) => strike(m, kind || STRIKE_OF[C.TOOL[m.k]?.[0]] || 'grip'), strikeOf: (k) => STRIKE_OF[C.TOOL[k]?.[0]] || 'grip',
    purge, poisoned: () => !!(V.poison && !V.poison.purged), planFor, launchVan, openPit, buildPit, V,
    busy: () => !!V.scene, blast: (m) => strike(m, 'blast', C.npcOf(m.k)), _cand: () => C.present().map(x => [x.key, C.live(x.key) ? 1 : 0, SOCIAL[x.key]?.violence])
  };
}
