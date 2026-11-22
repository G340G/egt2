// =============================================================================
// EPISTASSI — THE PEOPLE
// Each person in the house is written in layers, the way the player meets them:
//   surface      what they offer a stranger at the table
//   wound        what they will say only the second time, when the house is quieter
//   secret       what the player can infer but nobody states
//   fear / want  the two forces they are caught between
//   contradiction the place where their behaviour argues with their words
//   tell         a visible habit the player can watch for (driven by `tic`)
// `look` drives the procedural body; `second` is the deeper conversation, whose
// two choices move the hidden ACCORDO (agreement) and RIFIUTO (refusal) values.
// None of this is shown as a score. It returns as handwriting, warmth and cold.
// =============================================================================

export const PEOPLE = {
  ines: {
    age: 58, role: 'Former ward nurse', houseWord: 'warm',
    surface: 'Feeds people before she asks their names. Never sits until everyone has eaten.',
    wound: 'Thirty years of night shifts on a geriatric ward. She held more hands at the end than anyone in the valley, and none of them were her mother’s: she was on shift when her mother died across town.',
    secret: 'She brews the tea. She has decided that if the deaths are going to happen, they will at least be gentle — and she cannot tell anymore whether that is mercy or the machinery.',
    fear: 'Being the one who stops caring first.', want: 'One person in the house to need her and survive it.',
    contradiction: 'Her kindness is the most reliable part of the rite.',
    tell: 'Folds and refolds a white cloth while she listens. Wipes blood without asking where it came from.',
    ties: { gabri: 'Mothers him; he lets her, then pushes her away, then comes back.', anna: 'Argue about salt without ever looking up from the pot.' },
    look: { build: 'sturdy', height: .95, heft: 1.12, stoop: .05, skin: 0x9a7f69, hair: 'knot', hairColor: 0x5b5249, grey: .55, garment: 'cardigan', coat: 0x6e2e26, under: 0xb8ae9c, legs: 0x2a2724, shoes: 0x1d1b19, extras: ['cloth', 'watch'] },
    tic: 'fold', gaze: 'warm', gait: .9,
    barks: ['Eat first. Talking comes after.', 'Your hands are cold. Here.', 'It is still warm. Do not let it go cold.'],
    barksAfter: ['I keep setting the same number of plates.', 'Someone has to stay awake with them.'],
    second: {
      line: 'You came back to the kitchen. People do, after the first hour. (She does not stop folding.) Do you know what a ward sounds like at four in the morning? Nothing. Then one machine changes its note.',
      choices: ['Let her pour you a cup. Say nothing.', '“You are making it gentle for him. That is still killing.”'],
      replies: ['(She pours. Her hand is perfectly steady.) There. Now you are one of the warm ones. It is not a bad thing to be.', '(The cloth stops.) I know what it is. I have always known. Knowing has never once made my hands shake. That is the part I cannot forgive.'],
      effect: ['accordo', 'rifiuto'], heal: [.18, 0]
    }
  },
  ottavio: {
    age: 71, role: 'Continuo harpsichordist, deaf since 2004', houseWord: 'the floor',
    surface: 'Precise, dry, corrects you without humiliating you. Listens with his palm.',
    wound: 'He went deaf over one winter. The last thing he heard clearly was his own harpsichord a quarter-tone flat and nobody in the ensemble noticing.',
    secret: 'He is not sure the acetate ever held sound. He keeps it because a deaf man guarding a record is a joke he understands better than anyone.',
    fear: 'That the vibration he feels is only his own pulse.', want: 'To be believed without being made into a symbol.',
    contradiction: 'Trusted with the only copy because he cannot hear it — and the only person who claims he did.',
    tell: 'Taps the table twice and waits for the reply through the wood. Watches hands, never mouths.',
    ties: { walter: 'One feels vibration, the other understands load. They can work without looking at each other.' },
    look: { build: 'gaunt', height: 1.06, heft: .82, stoop: .16, skin: 0xa58f7b, hair: 'bald', hairColor: 0xc9c2b4, grey: 1, garment: 'turtleneck', coat: 0x1f1e1d, under: 0x1f1e1d, legs: 0x3a3631, shoes: 0x2a1f19, extras: ['glasses-round'] },
    tic: 'tap', gaze: 'hands', gait: .72,
    barks: ['(He taps twice. Waits. Taps again.)', 'Again. You felt that before you heard it.', 'The wood carries both of us.'],
    barksAfter: ['(His palm stays on the table long after the motor would have stopped.)'],
    second: {
      line: '(He writes on the back of a score and turns it to you:) THE MOTOR STOPPED AT 03:17. I FELT IT IN MY JAW. EVERYONE ELSE HEARD MUSIC. I FELT A MACHINE GIVING UP.',
      choices: ['Put your palm beside his on the table.', 'Write back: “Then there was never a record.”'],
      replies: ['(He nods once. Under your palm the table is faintly, regularly warm, like something breathing in another room.) You see. It is not a voice. It is a weight.', '(He reads it twice. Then he folds the paper very small.) Perhaps. But they did not die of nothing. Something was turning. Find out what.'],
      effect: ['accordo', 'rifiuto'], heal: [.08, 0]
    }
  },
  anna: {
    age: 66, role: 'Widow of a mason, cook', houseWord: 'keep the place',
    surface: 'Repeats ordinary facts as if repetition kept them true. The bowl is ready. It is warm.',
    wound: 'Her husband walked out to the canal on an ordinary Tuesday forty years ago. No body, no note, no grave. A bowl is the only funeral she has been allowed.',
    secret: 'The trowel is his. There is mortar on it that is not forty years old.',
    fear: 'The table noticing the empty chair.', want: 'Permission to stop setting the place — from someone who has the right to give it.',
    contradiction: 'She feeds the living to keep a dead man present.',
    tell: 'Stirs a soup that is no longer on the heat. Moves bowls away from the edge of the table.',
    ties: { ines: 'Domestic rhythms so shared they argue without looking up.', franco: 'He says her coffee is wrong every morning. She makes it the same way every morning.' },
    look: { build: 'small', height: .88, heft: 1.08, stoop: .12, skin: 0x8f7563, hair: 'scarf', hairColor: 0x3d3a37, grey: .8, garment: 'dress', coat: 0x2f2a26, under: 0x2f2a26, legs: 0x2f2a26, shoes: 0x1a1816, extras: ['apron-long'] },
    tic: 'stir', gaze: 'down', gait: .68,
    barks: ['The bowl is ready.', 'He knows where it is.', 'It is warm. Eat.'],
    barksAfter: ['(She sets one more bowl than there are people.)'],
    second: {
      line: 'You are sitting in his chair. No — stay. A chair should be warm. (She ladles soup into the bowl in front of you, and into the empty one beside it.) He liked it without salt. Ines never remembers.',
      choices: ['Eat from his bowl.', '“Anna. He is not coming back. You can stop.”'],
      replies: ['(She watches you eat with an expression you cannot read: relief, or a door closing.) Good. Now the place is kept.', '(For a long time she says nothing.) Everyone knows. Nobody says it in the kitchen. You said it in the kitchen. (She takes the extra bowl away, and her hands shake for the first time.)'],
      effect: ['accordo', 'rifiuto'], heal: [.22, 0]
    }
  },
  dario: {
    age: 27, role: 'Seminarian who left before ordination', houseWord: 'white morning',
    surface: 'Formal, liturgical, contemptuous of doubt. Stands as if waiting for a service to begin.',
    wound: 'He left the seminary because a rector told him his faith was “too loud to be humble.” He has been trying to make it quiet ever since, and the only quiet he can imagine is a death.',
    secret: 'He envies the others their uncertainty. Believing is the only thing he is good at, and he knows it is being used.',
    fear: 'That nobody will look at him when it matters.', want: 'A death that means something to someone other than himself.',
    contradiction: 'The only sincere believer is the most useful one to a man who believes nothing.',
    tell: 'Touches the hollow of his throat where a collar would sit. Straightens other people’s cutlery.',
    ties: { pino: 'Practical disbelief against sincere belief. Neither wins the argument.' },
    look: { build: 'slim', height: 1.03, heft: .86, stoop: -.04, skin: 0xa18a74, hair: 'curls-short', hairColor: 0x1c1816, garment: 'longcoat', coat: 0x0e0e0e, under: 0xd8d4ca, legs: 0x1a1a1a, shoes: 0x0f0f0f, extras: ['rosary'] },
    tic: 'cross', gaze: 'steady', gait: 1,
    barks: ['Tell me where to stand.', 'You are slouching in a consecrated room.', 'There is an order to it. There has to be.'],
    barksAfter: [],
    second: {
      line: 'You heard them through the wall. Good. I wanted a witness who was not one of us. (He is calm, almost happy.) Upside down, like Peter. I am not worthy of the right way up.',
      choices: ['“Then I will be your witness.”', '“He is using your faith. Walk out with me.”'],
      replies: ['(He takes your hand in both of his, formally, like a sign of peace.) Then it will not be wasted. Thank you. I mean it.', '(His face closes.) You think I do not know? I know exactly what he is. It does not make the thing I believe smaller. It makes him smaller. Go and sit down.'],
      effect: ['accordo', 'rifiuto'], heal: [0, 0]
    }
  },
  sergio: {
    age: 68, role: 'Retired lorry mechanic; outside the church in 1977', houseWord: 'the weather',
    surface: 'Dry, sideways, funny until the last word. Takes up less room than his body should.',
    wound: 'He was nineteen and smoking outside the church on the night of the thirteen. He heard nothing. He has spent fifty years being the boy who heard nothing.',
    secret: 'He heard the plan for Dario too. Again, he did not go in.',
    fear: 'Being needed at the exact moment it counts.', want: 'Company that never asks him to act.',
    contradiction: 'Stays for the warmth of a table he no longer believes in, and pays for it with silence.',
    tell: 'Leans his chair back on two legs. A cigarette behind his ear he never lights. Long grey hair he pushes back when he is about to lie.',
    ties: { franco: 'A joke about a scooter neither of them remembers the beginning of.' },
    look: { build: 'heavy', height: .97, heft: 1.2, stoop: .1, skin: 0x8c6f5c, hair: 'long', hairColor: 0x9a958b, grey: .9, garment: 'tee-long', coat: 0x141414, print: 'reel', legs: 0x3c4655, denim: true, shoes: 0x272421, extras: ['beard-grey', 'cigarette'] },
    source: 'Black long-sleeve tee with a cracked screen print, worn soft — the shirt of a man who went to concerts in Reggio in 1979 and never stopped wearing the same kind.',
    tic: 'lean', gaze: 'away', gait: .78,
    barks: ['The weather’s turning. Inside, I mean.', 'Don’t look at me. I was outside.', 'Somebody tell the scooter joke. No, not you, testa di cazzo.'],
    barksAfter: ['(The chair stays on four legs now.)'],
    second: {
      line: 'You want to know why I didn’t warn the boy. (He takes the cigarette from behind his ear, looks at it, puts it back.) Because the last time I stood outside a door, thirteen people died and I was still a person afterwards. I learned you can survive anything if you stay outside.',
      choices: ['“Then stay outside. Nobody will blame you.”', '“Go in this time. I will come with you.”'],
      replies: ['(He laughs without any sound.) That’s the kindest thing anyone’s said to me in this house. That’s how I know it’s poison.', '(He looks at you for a long time.) Cristo. You don’t know what you’re asking. (But he stands up.) The latches. In ’77 someone wired the church latches shut from inside. Ask Don Remo why he knows that.'],
      effect: ['accordo', 'rifiuto'], heal: [.05, 0], flag: ['sergio-outside', 'sergio-truth']
    }
  },
  marta: {
    age: 45, role: 'Sign painter and wood engraver', houseWord: 'the golden ones',
    surface: 'Associative, sensory, starts a sentence in one place and ends it somewhere else.',
    wound: 'She cannot remember her mother’s face without the carving she made of it. The carving is better than the memory. She hates it for that.',
    secret: 'She has started carving the deaths before they happen. The beam in the farmhouse has fourteen figures.',
    fear: 'Forgetting more than dying.', want: 'One memory that does not need to be gilded to be bearable.',
    contradiction: 'Makes memories permanent so she can stop holding them.',
    tell: 'Paint under her nails. Runs a thumbnail along every surface as if deciding where to cut.',
    ties: { livia: 'They trade half-sentences and borrow each other’s coats. Marta knows the four notes.' },
    look: { build: 'angular', height: 1.0, heft: .9, stoop: 0, skin: 0xb19882, hair: 'bob-bleached', hairColor: 0xd8c9a0, roots: 0x2a2420, garment: 'shirt-oversized', coat: 0x8f8a7c, under: 0x8f8a7c, legs: 0x4c4639, shoes: 0x2b241d, extras: ['paint-flecks', 'knife'] },
    tic: 'carve', gaze: 'surfaces', gait: 1.05,
    barks: ['The golden ones are the lies.', 'That wall would take a good line.', 'Paint comes off. A cut stays.'],
    barksAfter: ['(One more figure on the beam has been finished tonight.)'],
    second: {
      line: 'Give me something. A grey Sunday, a kitchen, anything. I will give it back to you better. (She is already turning a scrap of beech in her fingers.) That is the service I offer. Everyone here has one.',
      choices: ['Give her a memory. Let her gild it.', 'Give her nothing. “Keep yours grey.”'],
      replies: ['(She carves fast, and shows you: a kitchen you almost recognise, with sunlight across the floor that was never there.) There. Now it is safe. Now you do not have to remember it.', '(She stops. For a moment she looks younger.) Grey. My mother’s kitchen was grey. Linoleum. A clock that ran fast. (She puts the knife down.) I had forgotten the clock.'],
      effect: ['accordo', 'rifiuto'], heal: [.06, .04]
    }
  },
  pino: {
    age: 48, role: 'Long-haul driver', houseWord: 'the road',
    surface: 'Concrete directions, clipped statements. Rarely makes a metaphor.',
    wound: 'Twenty years of night roads. He has been away so long that every place feels like a lay-by. He came for dinner and a bed and has stopped noticing that he unpacked.',
    secret: 'He knows exactly which track through the wheat leads to the county road. He has walked it twice at night and turned back both times at the combine.',
    fear: 'Arriving somewhere and having to stay.', want: 'Someone to ask him for the way out — so that one of them uses it.',
    contradiction: 'Knows every road out of the district and keeps postponing all of them.',
    tell: 'Wraparound shades indoors, at night. Keys in his fist. Faces the door. A sleeve of faded ink on the forearm he drives with.',
    ties: { dario: 'Shows him the line of trees that hides the far road. Dario says he cannot see a road. “That’s why it’s a good one.”' },
    look: { build: 'lean', height: 1.07, heft: .9, stoop: .04, skin: 0x977a63, hair: 'long', hairColor: 0x8b7d63, grey: .5, garment: 'tee', coat: 0x111111, print: 'road', legs: 0x23262b, shoes: 0x1b1712, extras: ['beard-full', 'cap', 'shades', 'sleeve-tattoo'] },
    source: 'Black tee with a faded tour-style print (no name, only a road and a date), a knit cap, wraparound shades worn at night — the uniform of drivers who sleep in the cab.',
    tic: 'keys', gaze: 'door', gait: 1.12,
    barks: ['Past the canal. Don’t stop there.', 'Fog lifts at five. It always does.', 'I’m just getting some air.'],
    barksAfter: [],
    second: {
      line: 'You keep looking at the door. So do I. (He tosses the van keys from hand to hand.) I could have you on the county road in forty minutes. Nobody would stop us. That is not the problem.',
      choices: ['“Stay. Show me the field path in the morning.”', '“Then go. Tonight. Do not wait for me.”'],
      replies: ['(He puts the keys away.) Morning, then. It’s always morning, then.', '(He looks at you as if you have said something in a language he used to speak.) …All right. All right. (He does not move yet. But he puts his jacket on.)'],
      effect: ['accordo', 'rifiuto'], heal: [0, 0], flag: ['pino-stays', 'pino-told-go']
    }
  },
  gabri: {
    age: 19, role: 'Warehouse temp; the youngest', houseWord: 'are you looking?',
    surface: 'Quick, performative, funny, needy and generous in fast succession.',
    wound: 'Raised in rooms where the television was the only thing facing him. He mistakes attention for love because nobody has offered him the difference.',
    secret: 'He knows the thermos is not a gift. He would rather be looked at on the way out than ignored on the way through.',
    fear: 'Being unseen at the end.', want: 'An audience. Anyone. The refrigerator light will do.',
    contradiction: 'Pushes Ines away for mothering him, then sits where she can see him.',
    tell: 'Glances at the refrigerator every few seconds. Asks “did you see that?” and changes tone when nobody answers.',
    ties: { ines: 'She fixes his collar without asking. He pulls away, then comes back and lets her finish.' },
    look: { build: 'wiry', height: .97, heft: .8, stoop: .06, skin: 0xb59c86, hair: 'fringe-eye', hairColor: 0x2b231d, garment: 'track', coat: 0x22303f, under: 0xcfcac0, legs: 0x253041, shoes: 0xe2ded6, extras: ['earring', 'piping'] },
    tic: 'glance', gaze: 'eager', gait: 1.15,
    barks: ['Are you looking? You’re looking.', 'Did you see that? No? Vaffanculo, then.', 'Ines says I sit too close to the light.'],
    barksAfter: ['(The refrigerator light stays on in an empty corner.)'],
    second: {
      line: 'Everyone else has a job. Ines pours, Ottavio listens, Franco cuts. I sit in the light. (He grins too fast.) That’s a job too. Somebody has to be what gets looked at.',
      choices: ['“I see you. That is enough.”', '“Come outside with me. Away from the light.”'],
      replies: ['(He goes very still, as if you had put a hand on his head.) …Say it again later. When it matters. Promise.', '(He laughs, then doesn’t.) Outside it’s dark. Nobody looks at you in the dark. (He stays exactly where he is, but he is watching you now, not the fridge.)'],
      effect: ['accordo', 'rifiuto'], heal: [0, 0]
    }
  },
  walter: {
    age: 41, role: 'Surveyor and site blaster', houseWord: 'where the weight goes',
    surface: 'Measurements, loads, distances. “That won’t hold.” “Give it another hand.”',
    wound: 'A wall he signed off came down on a site in Cremona. Nobody was hurt. He has never been able to believe that.',
    secret: 'He feels like a person only while a task is unfinished. He is afraid of the moment the house runs out of tasks for him.',
    fear: 'An afternoon with nothing to measure.', want: 'Someone to tell him exactly where the weight will go.',
    contradiction: 'Not cruel, not stupid — and the most dangerous pair of hands in the house.',
    tell: 'Measures doorframes with his spread hand. Taps beams and listens like Ottavio, badly.',
    ties: { ottavio: 'Practical help, never confession. They used to repair things together.' },
    look: { build: 'broad', height: 1.04, heft: 1.22, stoop: .02, skin: 0x8a6c58, hair: 'curls-short', hairColor: 0x35302a, garment: 'workjacket', coat: 0x434634, under: 0x22211f, legs: 0x3c4655, denim: true, shoes: 0x2a251d, extras: ['reflective', 'tape', 'stubble'] },
    source: 'Olive M-65-pattern field jacket bought surplus, reflective tape from a quarry vest stitched on and half torn off; jeans.',
    tic: 'measure', gaze: 'structure', gait: .95,
    barks: ['That beam’s doing more than it should. Merda.', 'Two metres forty. Give or take your head.', 'Tell me where. I’ll do the rest.'],
    barksAfter: [],
    second: {
      line: 'He gave me the church. Four charges, one each side of the nave. (He spreads his hand along the table edge.) It’s clean work. The roof comes down inward. Nobody outside gets so much as dust.',
      choices: ['“Show me where the weight goes.”', '“Miscalculate. Just once.”'],
      replies: ['(He draws it for you on a napkin, carefully, like a gift.) There. Now two of us know. That’s safer.', '(He looks at his hands.) I have never got one wrong on purpose. (A long pause.) I don’t know if I can. I don’t know what I’d be after.'],
      effect: ['accordo', 'rifiuto'], heal: [0, 0]
    }
  },
  livia: {
    age: 34, role: 'Parish soprano who stopped speaking', houseWord: '(four notes)',
    surface: 'Few words. Hums fragments, writes the rest on napkins.',
    wound: 'A voice too good for the parish and no belief that it belonged to her. She stopped speaking the week a teacher said she could “go far.”',
    secret: 'She is the voice in the confessional. She chooses what Tobia hears there.',
    fear: 'Being asked to perform.', want: 'To be ordinary with one person.',
    contradiction: 'Gave her voice to the room so nobody could ask her for it — and the room uses it.',
    tell: 'Hums four notes a semitone low. Avoids eyes; looks at mouths when others sing.',
    ties: { marta: 'Marta tried to teach her a card game. She kept singing the wrong tune over the rules.' },
    look: { build: 'slender', height: 1.0, heft: .84, stoop: .08, skin: 0xc0a995, hair: 'long', hairColor: 0x17120f, garment: 'longcoat', coat: 0x3f3a33, under: 0xbdb3a0, legs: 0x2b2722, shoes: 0x241e19, extras: ['scarf-throat'] },
    tic: 'hum', gaze: 'avoid', gait: .85,
    barks: ['(She hums four notes, a semitone too low.)', '(She writes: NOT NOW.)', '(She writes: Marta cheats at cards.)'],
    barksAfter: ['(Four notes from somewhere you cannot place.)'],
    second: {
      line: '(She writes on a napkin and pushes it to you:) THEY WANT ME TO SING AT THE NEXT ONE. I SAID I WOULD. I ALWAYS SAY I WILL.',
      choices: ['Write: “Sing. It will be beautiful.”', 'Write: “You are allowed to say no.”'],
      replies: ['(She reads it, folds it into a tiny square, and puts it in her mouth like a host.)', '(She stares at the word NO for a long time. Then, very quietly, aloud — her speaking voice is lower than you expected:) …No.'],
      effect: ['accordo', 'rifiuto'], heal: [0, .05]
    }
  },
  franco: {
    age: 55, role: 'Butcher’s counter, thirty years', houseWord: 'the soft part',
    surface: 'Jokes first because silence makes him feel watched. Then lets the joke die without rescuing it.',
    wound: 'Thirty years of clean cuts for strangers’ Sunday tables. His father called it a trade, not a craft. Nobody ever once asked him what he thought about while he worked.',
    secret: 'He is ashamed of how quickly he learned the house’s words. “Become who you are” was the first compliment he had in years.',
    fear: 'That the edge is all he is.', want: 'Someone to notice the knife is clean — and ask why he keeps it that way.',
    contradiction: 'A gentle man who has made violence into the only thing he is thanked for.',
    tell: 'Wipes his hands on the half apron even when they are dry. Big laugh, then a quick look at who laughed with him.',
    ties: { sergio: 'The scooter joke. Franco insists it was funny once. Sergio says it is the only thing in the house that has aged badly.', anna: 'Says her coffee is wrong every morning, drinks two cups.' },
    look: { build: 'broad', height: 1.02, heft: 1.3, stoop: .04, skin: 0x93715c, hair: 'long-curls', hairColor: 0x2a201a, grey: .25, garment: 'tee', coat: 0x121212, print: 'beast', legs: 0x1c1c1c, shoes: 0x161412, extras: ['apron-half', 'beard-full', 'sleeve-tattoo'] },
    source: 'Butcher’s half apron (grembiule da macellaio) tied low over a black tee, the way counter staff wear it in the Emilian markets; inked forearms.',
    tic: 'wipe', gaze: 'checking', gait: .95,
    barks: ['Anna, the coffee. Write it down.', 'Clean knife, clean conscience. That’s a joke. Laugh, cazzo.', 'The handle’s worth more than the hand, eh?'],
    barksAfter: ['(Nobody tells the scooter joke anymore.)'],
    second: {
      line: 'My father said a butcher thinks about Sunday. Somebody else’s Sunday. (He wipes his dry hands.) Thirty years. Never once for a reason. He says tonight there’s a reason. You think a man can be glad of that?',
      choices: ['“Then be glad. It’s more than most people get.”', '“Ask him whose Sunday it is.”'],
      replies: ['(He laughs, too loud, and looks round to see who laughed with him.) More than most. Cazzo, yes. Write that on the beam, Marta.', '(He stops wiping.) …I did. Once. He asked me what I thought. Nobody ever asked me that. So I stopped asking him anything.'],
      effect: ['accordo', 'rifiuto'], heal: [0, 0]
    }
  },
  'don remo': {
    age: 61, role: 'Former sacristan, keeper of the deconsecrated church', houseWord: 'the room remembers',
    surface: 'Formal, measured, the grammar of a service. Very plain when angry.',
    wound: 'He served the Mass for thirty years for a priest who was one of the thirteen in 1977. He was the one who locked up that night.',
    secret: 'He knows the latches were wired from inside. He has told himself for fifty years that it does not matter who did it.',
    fear: 'That the words still work and he is the one who stopped meaning them.', want: 'The building to fall — without his hands on it.',
    contradiction: 'Resents a man who uses sacred words without paying for them; helps him anyway.',
    tell: 'Church keys on a shoelace at his belt, touched like a rosary. Genuflects out of habit, then looks angry about it.',
    ties: { dario: 'He gives Dario the words Dario asks for, and hates how well they fit.' },
    look: { build: 'tall', height: 1.08, heft: .88, stoop: .08, skin: 0xa48c78, hair: 'receding', hairColor: 0x3a3632, grey: .4, garment: 'cassock', coat: 0x101010, under: 0xeeeae0, legs: 0x101010, shoes: 0x0c0c0c, extras: ['keys', 'collar'] },
    tic: 'keys', gaze: 'steady', gait: .88,
    barks: ['The words are easier to keep than the reason.', 'Mind the paving. The roots are coming in.', 'Everyone has a place in a nave. Even now.'],
    barksAfter: [],
    second: {
      line: 'You spoke to Sergio. (He does not ask; he knows.) In ’77 I locked up. The side door, the sacristy, the north latch. I went home. In the morning the north latch was wired from inside. Thirteen people do not wire a door shut against themselves by accident.',
      choices: ['“Then it was their choice. Let it rest.”', '“Someone in there wanted them kept in. Say it.”'],
      replies: ['(He closes his eyes.) Thank you. That is what I have told myself. It is a comfort to hear it in another voice.', '(Very plain:) Don Aurelio wired it. My priest. He believed in a white morning too. (The keys stop moving at his belt.) There. Fifty years. It did not bring anyone back.'],
      effect: ['accordo', 'rifiuto'], heal: [.1, 0], flag: ['remo-comforted', 'remo-confessed']
    }
  },
  'the first': {
    age: 38, role: 'Former quarry blaster', houseWord: 'Il Primo',
    surface: 'Clean, gentle, economical. Asks questions he already knows the answer to. Pays exactly, in notes, and counts them aloud.',
    wound: 'His father ran the blasting crew at a quarry above Canossa. At nine he watched a face of rock come down with a man under it; the sound arrived a second late, and in that second the man was still, in a sense, alive. He has been trying to live inside that second ever since.',
    secret: 'He does not believe in The White. He believes in arranging a room so that other people do the thing, and photographing their faces afterwards. The photographs are the only proof he was not responsible: look, he is not in any of them.',
    fear: 'Sound. Consequence arriving after the image. Being asked a question he did not write.', want: 'To own what happened without having done it — and, underneath that, to be stopped by someone who is not afraid of him.',
    contradiction: 'Uses Nietzsche as a vocabulary of permission he has never read past the underlinings, and misquotes “nothing is true, everything is permitted” as if it were in the same book.',
    method: 'He never orders. He arranges the chairs, gives one person a phrase, asks the room who understands, waits for the others to look at the hesitant one, and writes the outcome in the ledger as a choice.',
    tell: 'Orange foam earplug rolled between finger and thumb; puts both in before anything loud. Never raises his voice. Photographs faces, never bodies.',
    ties: {},
    look: { build: 'narrow', height: 1.02, heft: .92, stoop: 0, skin: 0xa99582, hair: 'scribble', hairColor: 0x0d0c0b, garment: 'workjacket', coat: 0x1d2330, under: 0xc9c3b6, legs: 0x23221f, shoes: 0x0b0b0b, extras: ['earplug', 'camera'] },
    source: 'A faded bleu de travail — the French and northern-Italian workman’s jacket — over a pale shirt. Clean, plain, unremarkable. Never a costume.',
    tic: 'earplug', gaze: 'record', gait: .92,
    barks: ['Become who you are.', 'Sit wherever the room puts you.', 'You hear more than the others. That is useful.'],
    barksAfter: [],
    second: null
  },
  'the widow': {
    age: 33, role: 'Keeps the empty house as he left it', houseWord: '—',
    surface: 'Tired, exact, unwilling to make anything a mystery.',
    wound: 'Her husband sat on the farmhouse floor talking until morning for a year, then stopped answering. She does not know if he is alive.',
    secret: 'She still drives past the farmhouse lane at night and does not turn in.',
    fear: 'Deciding what happened.', want: 'Someone outside the house to say his name aloud.',
    contradiction: 'Keeps a shrine to a man she refuses to mourn.',
    tell: 'Arms crossed against the cold. Answers before you finish the question.',
    ties: {},
    look: { build: 'slender', height: .99, heft: .86, stoop: .02, skin: 0xb7a08b, hair: 'long', hairColor: 0x2a211b, garment: 'longcoat', coat: 0x3b4236, under: 0x5a5148, legs: 0x1d1f1e, shoes: 0x171512, extras: ['scarf-throat'] },
    source: 'A grey-green loden coat, Tyrolean cut, bought for a husband’s funeral that never happened.',
    tic: 'arms', gaze: 'away', gait: .9,
    barks: ['He didn’t die. He stopped answering.', 'Mind the glass.'],
    barksAfter: [],
    second: null
  }
};

// Aliases used in older builds.
PEOPLE['father remo'] = PEOPLE['don remo'];

// Lived moments: ordinary scenes between people. Not clues. They make the house
// a place the player does not want to lose. Played once each, only while both
// people are alive and in the farmhouse, and only when the player lingers near.
export const LIVED_MOMENTS = [
  { id: 'scooter', a: 'franco', b: 'sergio', lines: ['FRANCO: So the priest gets on the scooter—', 'SERGIO: It was never a priest. It was a vet.', 'FRANCO: It’s funnier with a priest.', 'SERGIO: It’s the only thing in this house that’s aged worse than me.'], journal: 'Franco and Sergio argue over whether the scooter joke was ever funny. Both laugh before they notice me listening.' },
  { id: 'collar', a: 'ines', b: 'gabri', lines: ['INES: Come here. Your collar.', 'GABRI: I can do it.', '(He pulls away. Then he comes back and lets her finish. Nobody says anything.)'], journal: 'Ines fixes Gabri’s collar without asking. He pulls away, then comes back. She says nothing about it.' },
  { id: 'cards', a: 'marta', b: 'livia', lines: ['MARTA: No — the queen beats the knave, not the other way—', '(Livia hums over the rules, four notes, the wrong tune.)', 'MARTA: Merda — you’re doing it on purpose. (She gives up and laughs.)'], journal: 'Marta tries to teach Livia a card game. Livia keeps humming the wrong tune over the rules. Four notes. I have heard them before.' },
  { id: 'wall', a: 'walter', b: 'ottavio', lines: ['WALTER: Is the house moving?', '(Ottavio keeps his palm flat on the wall a long moment.)', 'OTTAVIO: Only the part we built.'], journal: 'Walter and Ottavio stand with their palms on the farmhouse wall. Walter asks whether the house is moving. “Only the part we built.”' },
  { id: 'salt', a: 'anna', b: 'ines', lines: ['INES: That’s enough salt.', 'ANNA: He liked it without.', 'INES: Then that’s too much.', '(Anna adds more anyway.)'], journal: 'Anna and Ines disagree over the salt in the soup. Completely ordinary. Anna adds more anyway.' },
  { id: 'road', a: 'pino', b: 'dario', lines: ['PINO: There. Behind the poplars. That’s the county road.', 'DARIO: I can’t see a road.', 'PINO: That’s why it’s a good one.'], journal: 'Pino shows Dario the line of trees that hides the far road. Dario cannot see it. “That’s why it’s a good one.”' }
];

// The house's own vocabulary, surfaced as journal marginalia when first heard.
export const HOUSE_WORDS = {
  warm: 'Welcome, accepted, cared for. Also a body, a bed, the cup made gentle.',
  'keep the place': 'Hold a seat. Wait for someone. Take over a person’s role.',
  'the weather': 'A mood. The pressure in a room. Sometimes fog. Sometimes not.',
  'the soft part': 'Hesitation. Pity. The thing that makes someone stop. He calls it a weakness.',
  'white morning': 'The promised salvation. Comforting until it is a date.',
  'the room': 'The group. The house. The people present. A room can be empty and still decide.'
};

export function personFor(name) { return PEOPLE[(name || '').toLowerCase()] || null; }

// Repair jobs (v10 §5.4). Each: a short diagnosis, then do it well, badly, or refuse.
// `kind` picks the bench exercise; `arms` names the Station whose staging it changes.
export const JOBS = {
  guitar: { by: 'the first', title: 'The guitar rattle', pay: 40, kind: 'locate', arms: null,
    ask: 'There. On the table. It rattles from somewhere inside its body. Take your time.',
    spots: ['UPPER BOUT', 'BRIDGE', 'NECK JOINT', 'LOWER BOUT'], fault: 1,
    found: 'Under the bridge the rattle changes. Something loose inside. You tilt the body: a human molar with a grey filling drops into your palm.',
    well: 'Tooth out, brace reglued. The open strings ring true.', badly: 'Tooth out. You leave the brace loose; it will buzz on the low E.', refuse: 'You set the guitar down without opening it.' },
  cleaver: { by: 'franco', title: 'Franco’s cleaver', pay: 10, kind: 'locate', arms: 'franco',
    ask: 'The handle. Listen. (He taps the blade on the table; something buzzes.) Worth more than the hand holding it.',
    spots: ['BLADE', 'FIRST PIN', 'SECOND PIN', 'BOLSTER'], fault: 1,
    found: 'The scale is split at the first pin. It buzzes on every tap.',
    well: 'Glued, clamped, both pins seated. No buzz.', badly: 'Glued and clamped. You leave the second pin short. It still buzzes, a little.', refuse: 'You hand it back.' ,
    station: { well: '(The handle holds. It is quick.)', badly: '(The handle splits on the second stroke. They finish by hand. It takes a long time.)', refuse: '(Someone brings a kitchen knife instead.)' } },
  hatch: { by: 'anna', title: 'The floor hatch', pay: 15, kind: 'locate', arms: 'anna',
    ask: 'There is a draught under the table. From the hatch. He hated a draught. Can you make it sit flat?',
    spots: ['NORTH CORNER', 'HINGE SIDE', 'SOUTH CORNER', 'LATCH SIDE'], fault: 2,
    found: 'Cold air at the south corner. The hatch is a millimetre proud.',
    well: 'Planed and shimmed. It sits flush; not even breath comes through.', badly: 'You shim it badly. It still lifts when someone below pushes.', refuse: 'You leave the draught where it is.',
    station: { well: '(The hatch is sealed. You hear nothing from below. That is worse.)', badly: '(The hatch lifts a finger’s width. A hand, briefly. Then the weight of the table.)', refuse: '(They nail the hatch shut. Every nail is loud.)' } },
  burin: { by: 'marta', title: 'Marta’s burin', pay: 10, kind: 'tune', arms: 'marta',
    ask: 'My burin skips on the beam. Click, click, wrong. Listen to it against the good one.',
    target: .62, found: 'The click evens out when the edge angle matches the good burin.',
    well: 'Reground. It cuts like a sentence ending.', badly: 'You leave a burr. It will skip at the worst moment.', refuse: 'You give it back unground.',
    station: { well: '(The last line on the beam is clean and fine.)', badly: '(The burin skips. The line wanders. She keeps cutting.)', refuse: '(She uses a nail.)' } },
  doorlock: { by: 'gabri', title: 'The passenger door', pay: 20, kind: 'locate', arms: 'gabri',
    ask: 'The car door rattles at idle. Passenger side. That’s my side. Can you make it — you know. Quiet. Like it’s mine.',
    spots: ['HINGE', 'LOCK PLATE', 'WINDOW CHANNEL', 'SEAL'], fault: 1,
    found: 'The rattle is the lock plate, a quarter-turn out of line.',
    well: 'Aligned. The door closes with one soft sound, like a held breath.', badly: 'You leave it a little out. It will not quite lock.', refuse: 'You leave the rattle.',
    station: { well: '(The door locks with a soft, final sound.)', badly: '(The door does not quite lock. Nobody tries it.)', refuse: '(Someone ties the handle with wire.)' } },
  radio: { by: 'sergio', title: 'Sergio’s radio', pay: 15, kind: 'locate', arms: 'sergio',
    ask: 'Radio’s been crackling since ’79. Dry joint, I always said. I never opened it. Go on.',
    spots: ['VALVE', 'DIAL CORD', 'DRY JOINT', 'SPEAKER'], fault: 2,
    found: 'Tap the dry joint and the crackle changes. There.',
    well: 'Reflowed. A clean station: dance music from somewhere that is still Saturday.', badly: 'You touch it with the iron and leave it. It crackles in and out.', refuse: 'You leave it crackling.',
    station: { well: '(The radio plays clean the whole time. Somebody hums along.)', badly: '(The radio cuts in and out. In the gaps you can hear him breathing.)', refuse: '(Silence. Sergio asks for the radio. Nobody brings it.)' } },
  latch: { by: 'don remo', title: 'The confessional latch', pay: 20, kind: 'locate', arms: 'livia',
    ask: 'The confessional latch catches. A burr, I think. Voices should not have to wait at a door.',
    spots: ['STRIKE PLATE', 'BOLT', 'GRILLE', 'HINGE PIN'], fault: 0,
    found: 'A burr on the strike plate catches the bolt.',
    well: 'Filed smooth. It closes and holds.', badly: 'You leave half the burr. It will give if pushed.', refuse: 'You leave it.',
    station: { well: '(The latch holds.)', badly: '(The latch gives. Somebody leans on the door with their whole back.)', refuse: '(The door is nailed. She hears every nail.)' } },
  lead: { by: 'walter', title: 'The blasting-machine lead', pay: 50, kind: 'tune', arms: 'walter',
    ask: 'The meter flickers when the strand moves. I need a clean circuit. Four charges, one each side of the nave. Don’t think about the nave. Think about the meter.',
    target: .38, found: 'The needle stops flickering when the strand is seated.',
    well: 'Resoldered. The needle stands dead still.', badly: 'A cold joint. The needle will hold, mostly.', refuse: 'You put the iron down.',
    station: { well: '(The circuit fires as planned.)', badly: '(It misfires. He walks back in to check.)', refuse: '(He rewires it himself, faster, worse.)' } },
  clapper: { by: 'don remo', title: 'The bell clapper leather', pay: 30, kind: 'tune', arms: 'remo',
    ask: 'The bell thuds. The clapper leather has gone. It should ring in two notes, a tritone apart. Can you hear the second one?',
    target: .71, found: 'With the leather tensioned, the second note comes through.',
    well: 'Six clean tolls, when it comes to it.', badly: 'The clapper is loose. It will take more than six.', refuse: 'You leave the bell dull.',
    station: { well: '(Six clean tolls.)', badly: '(The clapper is loose. It takes more than six. The rope is heavy for all of them.)', refuse: '(Don Remo rings it anyway. It thuds.)' } },
  harpsichord: { by: 'ottavio', title: 'The harpsichord at 415', pay: 15, kind: 'tune', arms: null,
    ask: '(He writes:) TUNE THE A TO THE FORK. NOT TO YOUR HEAD. FOUR-FIFTEEN. I WILL FEEL WHEN IT SETTLES.',
    target: .5, found: 'The beating slows and stops. His fingers settle on the soundboard.',
    well: 'In tune, a semitone below the world.', badly: 'Close. He feels the difference and says nothing.', refuse: 'You leave it.' }
};

// v12 — the underground the house came out of. Prints, back patches and hardware.
// Every motif is invented (a mirrored tree-sun, a spiked unreadable logo, a line-drawn
// mask on an ankh, the house's own branch logo); none is a real band's name or mark.
export const SUBCULTURE = {
  sergio: { back: 'roots', extras: ['chain'], note: 'The branch logo across the back of the shirt, cracked from forty years of washing. A wallet chain.' },
  pino: { back: 'spike', extras: ['studs'], note: 'A spiked, unreadable logo on the back. A studded cuff on the wrist he drives with.' },
  franco: { back: 'kaleido', extras: ['chain'], note: 'A mirrored tree-sun on the back, six-fold, like a window that looks at itself.' },
  gabri: { back: 'kaleido', extras: ['pins'], note: 'The tree-sun printed across the back of the track jacket. Three enamel pins.' },
  marta: { back: 'ankh', extras: ['pins'], note: 'A mask on an ankh, hand-painted in white house paint across the back of the shirt.' },
  walter: { back: 'spike', extras: [], note: 'A spiked logo stencilled on the back of the field jacket.' },
  livia: { back: null, extras: ['pins'], note: 'One pin on the coat: the branch logo, very small.' },
  'the first': { back: 'roots', extras: [], note: 'The branch logo painted on the back of the leather, in bone white, half worn away.' }
};

// v17 — how each of them is dirty. These are voided people, criminals and scoundrels in a
// borrowed sacred costume. Some carry it on the outside: blood, mud, mortar, soot, wax. Some
// carry it inside: sallow skin, bruising, rings under the eyes, faces that begin to come apart.
// `smear` is how far the face is already undone; it grows with each Station.
export const CORRUPTION = {
  franco:      { kind: 'external', stain: 'blood',  hands: 0x5a1a10, note: 'Blood dried brown in the weave of the apron, under the nails, up to the elbow.' },
  walter:      { kind: 'external', stain: 'soot',   hands: 0x2a2620, note: 'Quarry dust and soot in every crease. He does not wash between jobs.' },
  pino:        { kind: 'external', stain: 'oil',    hands: 0x1e1a14, note: 'Engine oil on the hands and cuffs, road mud to the knee.' },
  anna:        { kind: 'external', stain: 'mortar', hands: 0x8a8576, note: 'Grey mortar dried on the knuckles and on the hem of the apron.' },
  sergio:      { kind: 'external', stain: 'ash',    hands: 0x6a5a3a, note: 'Nicotine-yellow fingers and ash down the front of the shirt.' },
  'don remo':  { kind: 'external', stain: 'wax',    hands: 0x9a9070, note: 'Candle wax and soot on the cassock, black under the fingernails.' },
  ines:        { kind: 'internal', skin: 0x9c9a78, rings: .8, lips: 0x5a3a36, smear: .15, note: 'Sallow, with grey rings under the eyes. Her hands are spotless.' },
  gabri:       { kind: 'internal', skin: 0xa08f84, rings: 1,  lips: 0x6a2a24, smear: .2, bruise: true, nose: true, note: 'Bruises at the neck and wrist, a crust of old blood at one nostril.' },
  livia:       { kind: 'internal', skin: 0xb0aa9a, rings: .6, lips: 0x3a2a2a, smear: .2, note: 'Waxen; the scarf hides something at the throat that has not healed.' },
  marta:       { kind: 'internal', skin: 0xa69a84, rings: .5, smear: .1, cuts: true, note: 'Four healed cuts on the inside of each forearm, evenly spaced, and paint over them.' },
  ottavio:     { kind: 'internal', skin: 0xa0a094, rings: .7, smear: .1, note: 'Grey and waxy, like a hand that has held a soundboard for forty years.' },
  dario:       { kind: 'internal', skin: 0xb2aa98, rings: .6, smear: .1, bruise: true, note: 'Pallid. Under the collar, the marks of a cord he uses on himself.' },
  'the first': { kind: 'internal', rings: .3, smear: .35, note: 'Clean on the outside. When you look too long, the face does not hold.' },
  'the widow': { kind: 'internal', rings: .5, smear: 0, note: 'Tired, not rotten. She is the only one here who is grieving.' }
};
SUBCULTURE.walter = { ...(SUBCULTURE.walter || {}), leather: true };

// =============================================================================
// v21 — THE ROOM. Nobody hunts Tobia. Each person carries a temperament the
// player never sees: how devoted they are to Il Primo, how far they could go,
// how much they already care, how faithfully they repeat what they saw, and to
// whom they repeat it. The kitchen lines are deliberately interchangeable: the
// same ordinary sentence opens an attack, a plea, or nothing at all.
//   loyalty   devotion to Il Primo and the rite (0–1)
//   violence  capacity to act with their hands (0–1)
//   care      how much they start out caring for a stranger (0–1)
//   distorts  how much a story changes when they retell it (0–1)
//   confidant the one person they tell things to
//   protects  the people they would step in for
// =============================================================================
export const SOCIAL = {
  ines: { loyalty: .5, violence: .3, care: .72, distorts: .15, confidant: 'gabri', protects: ['gabri', 'tobia'],
    cold: ['(She sets a cup down near you, not in front of you.)', 'Later.', '(She keeps folding the cloth and does not look up.)'],
    warm: ['You are not eating. Eat.', 'Sit by me if the room is too loud.', 'Tip your head forward, not back. Always forward.'],
    kitchen: { open: 'Hold this for me. No — by the handle.', help: 'Take Gabri with you when you go. Do not tell me where. If I know, I will tell them.', pretend: '(She cuts bread. She does not look up.) Bread. Take the end piece, nobody wants it.' },
    kill: 'Ines had made it gentle. That was the worst part: there was no struggle, because she had thought about it for a long time and decided you should not be afraid. Her hand was steady on the back of your neck the whole way down.' },
  ottavio: { loyalty: .4, violence: .05, care: .45, distorts: .1, confidant: 'walter', protects: ['livia'], deaf: true,
    cold: ['(He watches your mouth, then turns back to the keys.)', '(He does not lift his palm from the wall.)'],
    warm: ['(He takes your hand and lays it flat on the lid while he plays. You feel the note before you hear it.)', 'You walk more quietly than the others. I notice.'],
    kitchen: { open: '(He points at the bread knife, then at the loaf, then at you.)', help: '(He writes on the back of a bill:) Walter has the keys on the dresser. I cannot drive. You can.', pretend: '(He is drinking water at the sink. He raises the glass to you.)' },
    kill: 'Ottavio could not hear you. He said afterwards he had felt you come in through the floor.' },
  anna: { loyalty: .6, violence: .2, care: .45, distorts: .3, confidant: 'ines', protects: [],
    cold: ['(She ladles soup for everyone at the table. Your bowl stays where it is.)', 'It is not for you.'],
    warm: ['There is more. There is always more.', 'He used to sit where you sit. No. He did not. I do not know why I said that.'],
    kitchen: { open: 'Pass me that. The knife, the long one.', help: 'If they take the car on Sunday, make sure there is a place for me. I will not ask twice.', pretend: '(She stirs the pot.) Salt. Ines says too much salt.' },
    kill: 'Anna said she had only wanted the place to be set properly. One place too many. She had counted them every evening for forty years.' },
  dario: { loyalty: .95, violence: .72, care: .15, distorts: .5, confidant: 'walter', protects: [], believer: true,
    cold: ['(He finishes his prayer before he looks at you, and then he does not.)', 'The White does not need you to talk.', '(He moves his glass so it is no longer near yours.)'],
    warm: ['You listen. That is rare here.', 'Sit. The prayer is shorter if you sit.'],
    kitchen: { open: 'Close the door behind you. The draught.', help: 'If he wants me to do something, and I do not want to, what am I? Tell me what I am.', pretend: '(He is lining up the knives in the drawer by length.) Everything has an order.' },
    kill: 'Dario prayed first. He believed the room had marked you, that the blood was the sign. He did it the way he had been taught to do everything: carefully, and in the right order.' },
  sergio: { loyalty: .1, violence: .15, care: .66, distorts: .2, confidant: 'franco', protects: ['tobia'],
    cold: ['(He lights a cigarette and offers the pack to the man on his other side.)', 'Not now, kid.'],
    warm: ['Here. Take one. Do not tell Ines.', 'Keep your head down at dinner. Not too far down.'],
    kitchen: { open: 'Lighter. Have you seen my lighter? Look on the table.', help: 'Pino is going on Sunday. If you go with him, go. Do not wait for me to be brave.', pretend: '(He is reading the back of a seed packet.) Sixty days to harvest. Imagine.' },
    kill: 'Sergio, of all of them. He said he had done it so that someone else would not do it worse.' },
  marta: { loyalty: .55, violence: .45, care: .35, distorts: .72, confidant: 'livia', protects: [],
    cold: ['(She goes on carving. The burin squeals.)', 'I have cut you already. Up there. I do not remember what you did.'],
    warm: ['I could carve you. Small. Somewhere they would not look.', 'You have a good face for wood.'],
    kitchen: { open: 'Hold the board still. Still.', help: 'There is a beam with your name already on it. Help me take it down before he reads it.', pretend: '(She is sharpening the burin on the back step of the stove.) It goes blunt on the old wood.' },
    kill: 'Marta remembered it differently each time she told it. In every version you had done something to her first.' },
  pino: { loyalty: .2, violence: .38, care: .5, distorts: .2, confidant: 'dario', protects: [], leaving: true,
    cold: ['We have arranged the cars for Sunday. (He counts with his finger. He does not count you.)', 'No room. Sorry.'],
    warm: ['Before dawn. You do not look back. Remember that.', 'The van has three seats. I only need one.'],
    kitchen: { open: 'Is that the good knife? Give it here, I’ll do the bread.', help: 'I am going. Tonight, maybe. There is a seat. Come or do not, but do not tell Walter.', pretend: '(He is filling a thermos for the road.) Long drive. Long drive.' },
    kill: 'Pino did it quickly, and then he drove all night. He said he had to be sure you would not come after him.' },
  gabri: { loyalty: .5, violence: .62, care: .5, distorts: .4, confidant: 'ines', protects: ['ines'],
    cold: ['(He turns his chair so the fridge light is on his back.)', 'Why are you looking at me.'],
    warm: ['You can sit here. The light is enough for two.', 'Ines likes you. That means something. Probably.'],
    kitchen: { open: 'Move. You are in the light.', help: 'Take me with you. I can carry things. I do not eat much.', pretend: '(He is drinking milk from the carton in the fridge light.) What.' },
    kill: 'Gabri was nineteen. He said nobody had ever looked at him, and then you had looked at the wrong thing.' },
  walter: { loyalty: .86, violence: .8, care: .2, distorts: .25, confidant: 'dario', protects: [], driver: true,
    cold: ['The cars are full.', '(He measures the distance between you and the door with his eyes.)'],
    warm: ['You can ride up front, if you like. You do not talk.', 'Good boots. Keep them dry.'],
    kitchen: { open: 'Stand there. No — there. Out of the way.', help: 'If he gives me a task I cannot do, I want someone to know I could not.', pretend: '(He is oiling the hinge on the cupboard.) It squeaks. It should not squeak.' },
    kill: 'Walter laid it out like a charge: the right place, the right moment, nobody in the line of fire. He said afterwards it had not been a task. Nobody had given it to him.' },
  livia: { loyalty: .45, violence: .05, care: .56, distorts: .3, confidant: 'marta', protects: ['tobia'], mute: true,
    cold: ['(She hums four notes and looks away on the fourth.)', '(She writes something on a napkin and folds it before you can read it.)'],
    warm: ['(She hums the four notes, and on the fourth she smiles at you.)', '(A napkin, pushed across the table:) eat'],
    kitchen: { open: '(She hands you the bread knife, handle first.)', help: '(A napkin:) when they go, take Marta. she forgets the way', pretend: '(She is washing one glass, again and again.)' },
    kill: 'Livia could not say it afterwards. She wrote it on a napkin, and the napkin was in your hand when they found you.' },
  franco: { loyalty: .5, violence: .66, care: .3, distorts: .35, confidant: 'sergio', protects: ['anna'],
    cold: ['(He keeps cutting. The cleaver comes down very evenly.)', 'Ask someone else.'],
    warm: ['Here. The good piece. Do not tell Anna.', 'You stand like a butcher. That is a compliment.'],
    kitchen: { open: 'Hand me that. Thirty years and I still cannot find anything in this kitchen.', help: 'I told you about the priest. If Dario knows I told you, I am the next name on the beam.', pretend: '(He is wiping down the board with the flat of his palm.) Clean. Always clean.' },
    kill: 'Franco did it the way he did everything: without a reason, efficiently. He said afterwards that somebody had told him you were the one who had talked.' }
};

// =============================================================================
// v23 — IL BIANCO. The White: the sound under every sound. It comes in through
// the ears, the mouth, the nose, and fills a person the way water fills a bottle;
// when there is no room left, the person stops. Aurelio was the first to be full.
// Everyone at the table is waiting for it, or afraid of it, or both. It is not a
// belief they hold; it is the thing they cannot stop talking about.
// =============================================================================
export const BIANCO = {
  ines: ['When Il Bianco comes for you, I will be there. Nobody fills alone in this house.', 'I can hear it in some of them already. A whistle under the breath.', 'Eat. Il Bianco fills the empty ones first.'],
  ottavio: ['(He presses his palm to the table.) I cannot hear Il Bianco. That is why it frightens me most. I will not know when it starts.', 'The record is not music. It is the shape of Il Bianco, cut into lacquer.'],
  anna: ['My husband was full before anyone. Il Bianco took him in his sleep. He was smiling.', 'I keep his bowl full so Il Bianco has somewhere else to go.'],
  dario: ['Il Bianco is not death. It is being completed.', 'Listen. Under the fridge, under the rain. It is there. It is always there.', 'Aurelio heard it first. We are only following.'],
  sergio: ['Il Bianco, Il Bianco. You know what it is? Carbon monoxide and a priest with a good voice.', 'They will tell you it fills you. Ask them what it fills you with.'],
  marta: ['I carve each one into the beams when Il Bianco takes them. There is a beam for you already. I do not remember cutting it.', 'Il Bianco is white the way a sheet is white. You only see the stain.'],
  pino: ['On the road you can outrun Il Bianco. In this house you just sit and wait for it.', 'Twenty years of engines. Il Bianco is the only noise I cannot drive out of.'],
  gabri: ['They say Il Bianco makes you feel seen. Completely. Do you think that is true?', 'I hear it in the fridge. A note under the note. Il Bianco.'],
  walter: ['I measured the house. It is exactly the size Il Bianco needs. Thirteen. Fourteen with you.', 'When Il Bianco is ready, everything has to be in its place. I make sure it is.'],
  livia: ['(She hums the four notes, then stops on the fifth, where there is only breath. That is Il Bianco, her eyes say.)', '(A napkin:) il bianco is the note after the last note'],
  franco: ['Il Bianco. Thirty years cutting meat and I never heard a cow go so quiet.', 'You want to know what Il Bianco is? Ask Aurelio. Oh — you can’t.']
};
