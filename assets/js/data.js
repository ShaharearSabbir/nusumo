/* ==========================================================================
   Nusumo — mock data
   ========================================================================== */
(function () {
  const users = {
    me:        { id:'me', name:'Mahfuza Akhter', handle:'@mahfuza', initials:'MA', role:'Product designer', followers:'2.4K', verified:false, grad:'linear-gradient(135deg,#a678ff,#ff6ad5)', following:false },
    ayesha:    { id:'ayesha', name:'Ayesha Rahman', handle:'@ayesha.rahman', initials:'AR', role:'Designer · Audio host', followers:'12.4K', verified:true, grad:'linear-gradient(135deg,#ff9d6e,#ff5f9e)', following:true },
    rafi:      { id:'rafi', name:'Rafi Chowdhury', handle:'@rafi.music', initials:'RC', role:'Modular synth curator', followers:'128K', verified:true, grad:'linear-gradient(135deg,#6f7bff,#b06bff)', following:false },
    farah:     { id:'farah', name:'Farah Khan', handle:'@farah.khan', initials:'FK', role:'Resident producer', followers:'128K', verified:true, grad:'linear-gradient(135deg,#7a5cff,#e56ac4)', following:true },
    kavita:    { id:'kavita', name:'Kavita Rao', handle:'@kavita.rao', initials:'KR', role:'Creative director', followers:'32K', verified:true, grad:'linear-gradient(135deg,#3fbfa8,#7b8dff)', following:false },
    marcus:    { id:'marcus', name:'Marcus Cole', handle:'@marcus', initials:'MC', role:'Motion designer', followers:'18K', verified:false, grad:'linear-gradient(135deg,#ffb35c,#ff6a6a)', following:false },
    zeeshan:   { id:'zeeshan', name:'Zeeshan Ahmed', handle:'@zeeshan', initials:'ZA', role:'Audio producer', followers:'45.2K', verified:true, grad:'linear-gradient(135deg,#4bd6a3,#3a9bff)', following:true },
    nusrat:    { id:'nusrat', name:'Nusrat Jahan', handle:'@nusrat', initials:'NJ', role:'Curator · Community host', followers:'64.1K', verified:true, grad:'linear-gradient(135deg,#ff8ab0,#b06bff)', following:false },
    devon:     { id:'devon', name:'Devon Vance', handle:'@devon', initials:'DV', role:'Backend engineer', followers:'12.4K', verified:false, grad:'linear-gradient(135deg,#5c8cff,#57d3c0)', following:false },
    rehan:     { id:'rehan', name:'DJ Rehan', handle:'@djrehan', initials:'DR', role:'Host · Late Night Beats', followers:'89.4K', verified:true, grad:'linear-gradient(135deg,#a678ff,#ff6ad5)', following:true },
    maya:      { id:'maya', name:'Maya Lin', handle:'@mayalin', initials:'ML', role:'Co-host', followers:'9.8K', verified:true, grad:'linear-gradient(135deg,#57d3c0,#5c8cff)', following:false },
    tariq:     { id:'tariq', name:'Tariq V', handle:'@tariqv', initials:'TV', role:'Speaker', followers:'4.2K', verified:false, grad:'linear-gradient(135deg,#ffb35c,#ff6a9d)', following:false },
    samira:    { id:'samira', name:'Samira K', handle:'@samirak', initials:'SK', role:'Listener', followers:'1.1K', verified:false, grad:'linear-gradient(135deg,#c58bff,#5a7bff)', following:false },
    elena:     { id:'elena', name:'Elena R', handle:'@elenar', initials:'ER', role:'Member', followers:'820', verified:false, grad:'linear-gradient(135deg,#ff7f9f,#ffb35c)', following:false },
    tanvir:    { id:'tanvir', name:'Tanvir Ahmed', handle:'@tanvir', initials:'TA', role:'Design systems lead', followers:'24K', verified:true, grad:'linear-gradient(135deg,#6ad0ff,#a678ff)', following:false },
    sadia:     { id:'sadia', name:'Sadia Islam', handle:'@sadia', initials:'SI', role:'Independent publisher', followers:'7.4K', verified:false, grad:'linear-gradient(135deg,#ff9d6e,#d05bb5)', following:false },
    farhan:    { id:'farhan', name:'Farhan Kabir', handle:'@farhankabir', initials:'FK', role:'Creative technologist', followers:'11.2K', verified:true, grad:'linear-gradient(135deg,#5c8cff,#a678ff)', following:false },
    lamia:     { id:'lamia', name:'Lamia Hossain', handle:'@lamia', initials:'LH', role:'Brand architect', followers:'6.8K', verified:false, grad:'linear-gradient(135deg,#57d3c0,#ff8ab0)', following:false },
    sora:      { id:'sora', name:'Sora Lin', handle:'@soralin', initials:'SL', role:'Ambient artist', followers:'22K', verified:true, grad:'linear-gradient(135deg,#6a8cff,#7be0d0)', following:false },
    milo:      { id:'milo', name:'Milo Kovač', handle:'@milo', initials:'MK', role:'Sound designer', followers:'16K', verified:false, grad:'linear-gradient(135deg,#ffb35c,#e56ac4)', following:false },
    zack:      { id:'zack', name:'Zack Taylor', handle:'@zackt', initials:'ZT', role:'Community member', followers:'640', verified:false, grad:'linear-gradient(135deg,#7b8dff,#ff6a9d)', following:false },
    nadia:     { id:'nadia', name:'Nadia Vance', handle:'@nadia', initials:'NV', role:'Community member', followers:'1.8K', verified:false, grad:'linear-gradient(135deg,#57d3c0,#a678ff)', following:false }
  };

  const posts = [
    {
      id:'p1', user:'ayesha', time:'2h',
      text:'Spent the afternoon prototyping new spatial layouts around Dhanmondi Lake. There is something deeply grounding about sketching outdoors before translating concepts into the system.',
      tags:['#design','#dhaka'], location:'Dhanmondi Lake',
      media:{ grad:'sunset', ratio:'square' }, reactions:128, comments:1, saved:false, liked:false
    },
    {
      id:'p2', user:'rafi', time:'4h',
      text:'Quick color grading test for the upcoming documentary short. Pushing the shadows into deep violet tones while keeping skin tones natural.',
      tags:['#color','#documentary'], media:{ grad:'violet', ratio:'video', duration:'0:42' },
      reactions:94, comments:4, saved:true, liked:true
    },
    {
      id:'p3', user:'nusrat', time:'6h',
      text:'Hosting live audio rooms requires a balance of structure and organic conversation. I put together a practical checklist based on our last 50 sessions.',
      tags:['#audio','#community'],
      link:{ domain:'nusumo.community', title:'Running your first audio room: a checklist', grad:'moss' },
      reactions:212, comments:12, saved:false, liked:false
    },
    {
      id:'p4', user:'farah', time:'8h',
      text:'Finally finished the studio rewire. Two patchbays, one very patient electrician, and a monitor position that finally makes the low end behave. Swipe through the build.',
      tags:['#studio','#musicproduction'], media:{ grad:'amber', ratio:'grid', grid:['amber','ruby'] },
      reactions:186, comments:9, saved:false, liked:false
    },
    {
      id:'p5', user:'devon', time:'12h',
      text:'Refactored our ingestion service this weekend. 40% fewer allocations, one fewer network hop, and a p99 that finally behaves. Writing up the migration notes for the team tomorrow.',
      tags:['#golang','#backend'], reactions:46, comments:3, saved:false, liked:false
    },
    {
      id:'p6', user:'ayesha', time:'1d',
      text:'Architecture of silence: light studies inside the Brutalist auditorium before rehearsal soundcheck.',
      tags:['#photography','#light'], media:{ grad:'slate', ratio:'wide' },
      reactions:74, comments:2, saved:false, liked:false
    }
  ];

  const reelComments = [
    { id:'c1', user:'ayesha', time:'2h', text:'That sub-bass patch at 0:24 is insane! Are you filtering through the Moog ladder?', likes:42, pinned:true, creator:false, role:'' },
    { id:'c2', user:'rafi', time:'1h', text:'Yes! Exactly, chained into an analog saturator before the delay. I will post the patch notes tomorrow.', likes:18, creator:true, role:'Creator', reply:true },
    { id:'c3', user:'zeeshan', time:'45m', text:'Saved. Definitely trying this modular routing in my next live set.', likes:9, creator:false, role:'' },
    { id:'c4', user:'nusrat', time:'31m', text:'The restraint in the second half is what makes it work. Most people would keep layering.', likes:5, creator:false, role:'' }
  ];

  const reels = [
    {
      id:'r1', user:'rafi', caption:'Building a track from one modular loop — full breakdown in the comments 🎛️',
      tags:['#synth','#studiolife'], sound:'Original sound — Rafi Chowdhury', location:'Dhanmondi, Dhaka',
      likes:1200, comments:94, shares:31, views:'48.2K', time:'0:45', progress:38, grad:'violet', liked:true, saved:false
    },
    {
      id:'r2', user:'nusrat', caption:'One mic, one take, no autotune. The room does most of the work here.',
      tags:['#acoustic','#live'], sound:'Original sound — Nusrat Jahan', location:'Studio 4, Dhaka',
      likes:864, comments:41, shares:12, views:'22.1K', time:'0:58', progress:64, grad:'rose', liked:false, saved:false
    },
    {
      id:'r3', user:'farah', caption:'Three moves that fixed the low end in my room — number two is free.',
      tags:['#studio','#mixing'], sound:'Original sound — Farah Khan', location:'Berlin',
      likes:2100, comments:128, shares:64, views:'96.4K', time:'1:12', progress:22, grad:'amber', liked:false, saved:true
    },
    {
      id:'r4', user:'zeeshan', caption:'Ranked grind highlights from last night. The clutch at 0:38 still gets me.',
      tags:['#gaming','#apex'], sound:'Original sound — Zeeshan Ahmed', location:'Chattogram',
      likes:640, comments:73, shares:9, views:'18.9K', time:'0:34', progress:80, grad:'ruby', liked:false, saved:false
    },
    {
      id:'r5', user:'ayesha', caption:'Monsoon light on Old Dhaka rooftops — shot on 35mm, no grade.',
      tags:['#35mm','#dhaka'], sound:'Monsoon — Ayesha Rahman', location:'Old Dhaka',
      likes:1540, comments:56, shares:22, views:'61.7K', time:'0:22', progress:52, grad:'sunset', liked:true, saved:true
    },
    {
      id:'r6', user:'kavita', caption:'Figma to WebGL in one sitting. The easing curve is doing 90% of the work.',
      tags:['#motion','#webgl'], sound:'Original sound — Kavita Rao', location:'Bengaluru',
      likes:980, comments:37, shares:18, views:'33.5K', time:'0:51', progress:12, grad:'ocean', liked:false, saved:false
    }
  ];

  const liveStreams = [
    { id:'l0', user:'farah', title:'Studio tour + live Q&A: building a home setup under 50k', category:'Music', viewers:1400, viewersLabel:'1.4K', elapsed:'42:18', grad:'violet', featured:true },
    { id:'l1', user:'rafi', title:'Live modular jam session & patching workflow with vintage filters', category:'Music', viewers:2100, viewersLabel:'2.1K', elapsed:'18:40', grad:'ruby', following:true },
    { id:'l2', user:'ayesha', title:'Late Night Creative Hustle: Freelance to Agency Founder Q&A', category:'Talk', viewers:1800, viewersLabel:'1.8K', elapsed:'56:02', grad:'sunset', ending:true },
    { id:'l3', user:'kavita', title:'UI Motion Design Critique & Figma to WebGL Live Coding', category:'Learning', viewers:960, viewersLabel:'960', elapsed:'01:12:05', grad:'ocean', cohost:'marcus' },
    { id:'l4', user:'zeeshan', title:'Competitive Apex Legends Masters Ranked Grind with Viewers', category:'Gaming', viewers:740, viewersLabel:'740', elapsed:'25:10', grad:'moss' },
    { id:'l5', user:'nusrat', title:'Acoustic indie covers & songwriting sandbox: request songs!', category:'Music', viewers:615, viewersLabel:'615', elapsed:'36:45', grad:'rose' },
    { id:'l6', user:'devon', title:'Building scalable backend architectures in Go: live database refactor', category:'Learning', viewers:490, viewersLabel:'490', elapsed:'54:02', grad:'slate' },
    { id:'l7', user:'sora', title:'Late night ambient tape looping — slow set for slow hours', category:'Music', viewers:380, viewersLabel:'380', elapsed:'2:04:11', grad:'ocean' },
    { id:'l8', user:'milo', title:'Designing a sound pack from field recordings in real time', category:'Talk', viewers:212, viewersLabel:'212', elapsed:'11:26', grad:'amber' }
  ];

  const rooms = [
    { id:'a0', title:'Late Night Beats & Conversations', user:'rehan', category:'Music', listeners:128, elapsed:'42:18', speakers:['rehan','maya','tariq','kavita','samira'], extra:4, grad:'violet', featured:true },
    { id:'a1', title:'Modular Synthesis & Ambient Soundscapes Breakdown', user:'farah', category:'Music', listeners:340, elapsed:'1:04:22', speakers:['farah','rafi','nusrat','milo'], extra:5, grad:'rose' },
    { id:'a2', title:'Portfolio Reviews & Agency Founder Stories', user:'ayesha', category:'Talk', listeners:512, elapsed:'28:41', speakers:['ayesha','kavita','farhan','lamia'], extra:4, grad:'sunset', following:true },
    { id:'a3', title:'Microservices vs Monoliths: War Stories from Production', user:'devon', category:'Learning', listeners:218, elapsed:'52:09', speakers:['devon','sora','zeeshan'], extra:3, grad:'ocean' },
    { id:'a4', title:'Indie Game Audio: Composing for Dynamic Play', user:'rafi', category:'Music', listeners:86, speakers:['rafi','milo','nusrat'], extra:2, grad:'moss', status:'soon', startsIn:'Starts in 20m' },
    { id:'a5', title:'Late Night Creative Freelance AMA & Rates Negotiation', user:'kavita', category:'Talk', listeners:185, elapsed:'37:16', speakers:['kavita','marcus','farah','devon'], extra:6, grad:'amber' },
    { id:'a6', title:'Apex Legends Meta Shift & Competitive Strategy Lounge', user:'zeeshan', category:'Gaming', listeners:290, elapsed:'1:18:33', speakers:['zeeshan','sora','milo'], extra:5, grad:'slate' },
    { id:'a7', title:'Analog Synth Jams & Polyphonic Chord Building', user:'nusrat', category:'Music', listeners:164, elapsed:'18:02', speakers:['nusrat','rafi','ayesha'], extra:3, grad:'ruby' },
    { id:'a8', title:'Design Systems at Scale: Tokens, Theming & Handoff', user:'tanvir', category:'Learning', listeners:44, speakers:['tanvir','lamia','farhan'], extra:1, grad:'slate', status:'soon', startsIn:'Starts in 2h' }
  ];

  const notifications = [
    { id:'n1', type:'live', user:'farah', title:'Farah Khan is live now', body:'Studio tour + live Q&A: building a home setup under 50k', time:'2m ago', unread:true, thumb:'violet' },
    { id:'n2', type:'follow', user:'zeeshan', title:'Zeeshan Ahmed started following you', body:'Audio producer · 45.2K followers', time:'18m ago', unread:true },
    { id:'n3', type:'like', user:'ayesha', title:'Ayesha Rahman and 24 others liked your post', body:'“Spent the afternoon prototyping new spatial layouts…”', time:'42m ago', unread:true, thumb:'sunset' },
    { id:'n4', type:'comment', user:'rafi', title:'Rafi Chowdhury commented on your reel', body:'“The restraint in the second half is what makes it work.”', time:'1h ago', unread:true },
    { id:'n5', type:'room', user:'rehan', title:'Late Night Beats & Conversations is live', body:'128 listening · hosted by DJ Rehan', time:'2h ago', unread:false },
    { id:'n6', type:'mention', user:'nusrat', title:'Nusrat Jahan mentioned you', body:'“@mahfuza should bring the spatial layout work to Thursday’s room.”', time:'3h ago', unread:false },
    { id:'n7', type:'system', title:'Your payout was sent', body:'৳4,280 · bKash ending 4412 · reference NSM-88214', time:'5h ago', unread:false },
    { id:'n8', type:'follow', user:'lamia', title:'Lamia Hossain started following you', body:'Brand architect · 6.8K followers', time:'8h ago', unread:false },
    { id:'n9', type:'like', user:'devon', title:'Devon Vance liked your comment', body:'“This is the part most teams skip.”', time:'1d ago', unread:false },
    { id:'n10', type:'system', title:'New login from Chrome on Linux', body:'Dhaka, Bangladesh · if this wasn’t you, secure your account', time:'2d ago', unread:false }
  ];

  const chats = [
    { id:'ch1', user:'ayesha', unread:2, time:'2m', last:'Sending the revised layout tonight — want to review before Thursday?', messages:[
      { from:'them', text:'Hey! Did you get a chance to look at the spatial grid I shared?', time:'10:24' },
      { from:'me', text:'Yes — the 8pt rhythm finally makes the cards breathe. One thing: the lake photo crop feels tight on mobile.', time:'10:26' },
      { from:'them', text:'Agreed. I’ll pull it back to 4:3 and re-export.', time:'10:27' },
      { from:'them', text:'Sending the revised layout tonight — want to review before Thursday?', time:'10:31' }
    ]},
    { id:'ch2', user:'rafi', unread:1, time:'1h', last:'Patch notes are up. The Moog ladder was doing more than I thought.', messages:[
      { from:'them', text:'The reel did 48K views overnight. Wild.', time:'09:12' },
      { from:'me', text:'Deserved. That 0:24 patch is the whole hook.', time:'09:15' },
      { from:'them', text:'Patch notes are up. The Moog ladder was doing more than I thought.', time:'09:41' }
    ]},
    { id:'ch3', user:'rehan', unread:0, time:'3h', last:'You’re on the guest list for Thursday. Come early, we’ll soundcheck.', messages:[
      { from:'them', text:'You’re on the guest list for Thursday. Come early, we’ll soundcheck.', time:'07:02' }
    ]},
    { id:'ch4', user:'nusrat', unread:0, time:'1d', last:'The checklist doc is ready — adding your accessibility section now.', messages:[
      { from:'me', text:'Happy to write the accessibility section if it helps.', time:'Yesterday' },
      { from:'them', text:'The checklist doc is ready — adding your accessibility section now.', time:'Yesterday' }
    ]},
    { id:'ch5', user:'farah', unread:0, time:'2d', last:'Studio rewire is done. Come by when you’re in Berlin.', messages:[
      { from:'them', text:'Studio rewire is done. Come by when you’re in Berlin.', time:'Mon' }
    ]},
    { id:'ch6', user:'devon', unread:0, time:'4d', last:'Migration notes are in the repo, the p99 graph is beautiful.', messages:[
      { from:'them', text:'Migration notes are in the repo, the p99 graph is beautiful.', time:'Sat' }
    ]}
  ];

  const courses = [
    { id:'co1', title:'Sound design foundations for moving image', author:'Farah Khan', level:'Beginner', lessons:12, progress:58, grad:'violet', tag:'Audio' },
    { id:'co2', title:'Designing calm interfaces at scale', author:'Ayesha Rahman', level:'Intermediate', lessons:18, progress:24, grad:'sunset', tag:'Design' },
    { id:'co3', title:'Modular synthesis: from patch to performance', author:'Rafi Chowdhury', level:'Advanced', lessons:9, progress:0, grad:'ruby', tag:'Music' },
    { id:'co4', title:'Shipping Go services you can sleep through', author:'Devon Vance', level:'Intermediate', lessons:14, progress:82, grad:'ocean', tag:'Engineering' },
    { id:'co5', title:'Hosting audio rooms people come back to', author:'Nusrat Jahan', level:'Beginner', lessons:7, progress:100, grad:'moss', tag:'Community' },
    { id:'co6', title:'Motion systems in Figma and WebGL', author:'Kavita Rao', level:'Advanced', lessons:16, progress:12, grad:'amber', tag:'Motion' }
  ];

  const books = [
    { id:'b1', title:'The Quiet Interface', author:'Ayesha Rahman', category:'Design', progress:42, grad:'violet' },
    { id:'b2', title:'Patch & Presence', author:'Rafi Chowdhury', category:'Music', progress:0, grad:'ruby' },
    { id:'b3', title:'Small Rooms, Big Sound', author:'Farah Khan', category:'Audio', progress:100, grad:'amber' },
    { id:'b4', title:'Systems That Breathe', author:'Tanvir Ahmed', category:'Design', progress:18, grad:'ocean' },
    { id:'b5', title:'Notes on Community', author:'Nusrat Jahan', category:'Community', progress:64, grad:'moss' },
    { id:'b6', title:'The Freelance Ledger', author:'Kavita Rao', category:'Business', progress:8, grad:'sunset' },
    { id:'b7', title:'A Field Guide to Listening', author:'Milo Kovač', category:'Audio', progress:0, grad:'slate' },
    { id:'b8', title:'Monsoon Light', author:'Ayesha Rahman', category:'Photography', progress:76, grad:'rose' }
  ];

  const tiers = [
    { id:'t1', name:'Supporter', price:5, annual:48, perks:['Members-only posts','Weekly audio room replay','Supporter badge','Community chat access'], featured:false, current:false },
    { id:'t2', name:'Creator', price:12, annual:115, perks:['Everything in Supporter','Monthly 1:1 portfolio review','Early access to courses','Behind-the-scenes reels','Priority room invitations'], featured:true, current:true },
    { id:'t3', name:'Studio', price:28, annual:268, perks:['Everything in Creator','Quarterly strategy session','Private studio channel','Guest pass for two friends','Name in the credits'], featured:false, current:false }
  ];

  const members = [
    { user:'farah', role:'Resident producer', tags:['Music','Studio'] },
    { user:'rafi', role:'Modular synth curator', tags:['Music','Live'] },
    { user:'ayesha', role:'Designer · Audio host', tags:['Design','Talk'] },
    { user:'kavita', role:'Creative director', tags:['Motion','Design'] },
    { user:'zeeshan', role:'Audio producer', tags:['Audio','Gaming'] },
    { user:'nusrat', role:'Curator · Community host', tags:['Community','Music'] },
    { user:'devon', role:'Backend engineer', tags:['Engineering'] },
    { user:'tanvir', role:'Design systems lead', tags:['Design','Learning'] },
    { user:'maya', role:'Co-host · Late Night Beats', tags:['Music','Host'] },
    { user:'sora', role:'Ambient artist', tags:['Music','Live'] },
    { user:'lamia', role:'Brand architect', tags:['Brand','Design'] },
    { user:'milo', role:'Sound designer', tags:['Audio','Games'] }
  ];

  const upcoming = [
    { time:'8:30', ampm:'PM', title:'Design systems at scale', host:'tanvir' },
    { time:'10:00', ampm:'AM', title:'Independent publishing', host:'sadia' },
    { time:'7:00', ampm:'PM', title:'Late Night Beats', host:'rehan' }
  ];

  const tracks = [
    { name:'Monsoon Drift', artist:'Sora Lin', grad:'ocean', length:'3:42' },
    { name:'Patch Notes (Live)', artist:'Rafi Chowdhury', grad:'ruby', length:'6:18' },
    { name:'Slow Hours', artist:'Milo Kovač', grad:'slate', length:'4:05' }
  ];

  const stories = [
    { id:'s1', user:'ayesha', time:'2h', grad:'sunset', viewed:false, items:3 },
    { id:'s2', user:'rafi', time:'4h', grad:'violet', viewed:false, items:5 },
    { id:'s3', user:'nusrat', time:'6h', grad:'rose', viewed:true, items:2 },
    { id:'s4', user:'farah', time:'8h', grad:'amber', viewed:false, items:4 },
    { id:'s5', user:'zeeshan', time:'12h', grad:'ruby', viewed:true, items:1 },
    { id:'s6', user:'kavita', time:'1d', grad:'ocean', viewed:true, items:6 },
    { id:'s7', user:'devon', time:'1d', grad:'slate', viewed:false, items:2 },
    { id:'s8', user:'sora', time:'2d', grad:'moss', viewed:true, items:3 }
  ];

  const groupChats = [
    { id:'g1', name:'Design critique crew', members:['ayesha','kavita','lamia','tanvir'], unread:4, last:'Kavita: new motion study posted', time:'1m', grad:'violet' },
    { id:'g2', name:'Modular synth lab', members:['rafi','farah','milo','sora'], unread:2, last:'Rafi: patch notes are up', time:'22m', grad:'ruby' },
    { id:'g3', name:'Late Night Beats backstage', members:['rehan','maya','tariq','nusrat'], unread:0, last:'Maya: soundcheck at 9', time:'1h', grad:'rose' },
    { id:'g4', name:'Backend guild', members:['devon','zeeshan','farhan'], unread:1, last:'Devon: p99 graph is beautiful', time:'3h', grad:'ocean' }
  ];

  const contentRequests = [
    { id:'cr1', from:'elena', to:'rafi', title:'Custom ambient patch walkthrough', desc:'A 10-minute breakdown of your modular ambient patch from last week’s reel.', price:45, status:'pending', time:'2h ago', grad:'violet' },
    { id:'cr2', from:'me', to:'ayesha', title:'Brand identity moodboard review', desc:'Review my 3 logo directions and pick the strongest one with notes.', price:60, status:'accepted', time:'1d ago', grad:'sunset' },
    { id:'cr3', from:'zack', to:'farah', title:'Studio acoustics consultation', desc:'30-min call to review my room treatment plan before I buy panels.', price:80, status:'delivered', time:'3d ago', grad:'amber' },
    { id:'cr4', from:'nadia', to:'nusrat', title:'Community onboarding playbook', desc:'A written playbook for running my first 5 audio rooms.', price:35, status:'declined', time:'5d ago', grad:'rose' }
  ];

  const exclusivePosts = [
    { id:'ex1', creator:'rafi', title:'Behind the patch: modular ambient set', desc:'Full uncut 12-minute performance + patch notes PDF.', price:8, locked:true, grad:'violet', type:'video', duration:'12:04', likes:312 },
    { id:'ex2', creator:'ayesha', title:'Design system source files (Figma)', desc:'The complete token + component library I use on client work.', price:15, locked:true, grad:'sunset', type:'file', pages:48, likes:188 },
    { id:'ex3', creator:'farah', title:'Studio tour: full 4K walkthrough', desc:'Every rack, patchbay and mic position, with commentary.', price:10, locked:false, grad:'amber', type:'video', duration:'24:18', likes:520 },
    { id:'ex4', creator:'nusrat', title:'Audio room hosting playbook', desc:'My 50-session checklist as a Notion template.', price:6, locked:true, grad:'rose', type:'file', pages:22, likes:94 },
    { id:'ex5', creator:'kavita', title:'Motion system deep dive', desc:'Figma to WebGL pipeline, recorded live.', price:12, locked:true, grad:'ocean', type:'video', duration:'38:00', likes:267 },
    { id:'ex6', creator:'zeeshan', title:'Apex ranked grind VOD review', desc:'Frame-by-frame review of last night’s clutch.', price:5, locked:false, grad:'ruby', type:'video', duration:'19:30', likes:143 }
  ];

  const creatorSubs = [
    { creator:'rafi', tier:'Creator', price:12, since:'Oct 2026', renewal:'12 Dec 2026', perks:['Monthly exclusive reel','Patch notes PDF','Priority DMs'] },
    { creator:'ayesha', tier:'Supporter', price:5, since:'Sep 2026', renewal:'28 Nov 2026', perks:['Members-only posts','Weekly audio replay'] },
    { creator:'farah', tier:'Studio', price:28, since:'Aug 2026', renewal:'03 Jan 2027', perks:['Everything in Creator','Quarterly strategy call','Private studio channel'] }
  ];

  /* ------------------------------ PK battles ------------------------------ */
  const pkOpponents = [
    { user:'rehan',   rank:1,  wins:49, losses:8,  streak:9, category:'Music',    status:'in-battle', winRate:86, points:452800, avg:'6.4K' },
    { user:'zeeshan', rank:2,  wins:44, losses:9,  streak:7, category:'Gaming',   status:'live',      winRate:83, points:391200, avg:'5.8K' },
    { user:'nusrat',  rank:3,  wins:41, losses:12, streak:4, category:'Music',    status:'live',      winRate:77, points:336400, avg:'4.6K' },
    { user:'rafi',    rank:4,  wins:38, losses:11, streak:5, category:'Music',    status:'ready',     winRate:78, points:284500, avg:'4.2K' },
    { user:'ayesha',  rank:5,  wins:35, losses:13, streak:1, category:'Talk',     status:'ready',     winRate:73, points:264100, avg:'3.8K' },
    { user:'kavita',  rank:6,  wins:31, losses:14, streak:2, category:'Learning', status:'ready',     winRate:69, points:218900, avg:'3.1K' },
    { user:'farah',   rank:7,  wins:29, losses:10, streak:6, category:'Music',    status:'in-battle', winRate:74, points:201300, avg:'3.4K' },
    { user:'sora',    rank:8,  wins:24, losses:16, streak:3, category:'Music',    status:'ready',     winRate:60, points:148600, avg:'2.2K' },
    { user:'devon',   rank:11, wins:17, losses:19, streak:0, category:'Learning', status:'ready',     winRate:47, points:92400,  avg:'1.4K' },
    { user:'milo',    rank:14, wins:12, losses:21, streak:1, category:'Talk',     status:'ready',     winRate:36, points:61800,  avg:'1.1K' }
  ];

  const pkBattles = [
    { id:'pk1', host:'farah', opponent:'rafi', hostScore:8420, oppScore:7150, round:2, rounds:3, timer:'02:34', viewers:'3.2K', category:'Music', mode:'video', hostGrad:'violet', oppGrad:'ruby' },
    { id:'pk2', host:'ayesha', opponent:'kavita', hostScore:4120, oppScore:4680, round:3, rounds:3, timer:'00:48', viewers:'1.8K', category:'Design', mode:'audio', hostGrad:'sunset', oppGrad:'ocean' },
    { id:'pk3', host:'zeeshan', opponent:'rehan', hostScore:6280, oppScore:5980, round:1, rounds:5, timer:'01:52', viewers:'2.4K', category:'Gaming', mode:'video', hostGrad:'moss', oppGrad:'violet' }
  ];

  const pkGifts = [
    { glyph:'🌹', name:'Rose', coins:10, points:10 },
    { glyph:'💜', name:'Violet heart', coins:40, points:45 },
    { glyph:'🎧', name:'Headphones', coins:90, points:110 },
    { glyph:'🎆', name:'Fireworks', coins:120, points:150 },
    { glyph:'🚀', name:'Rocket', coins:250, points:320 },
    { glyph:'👑', name:'Crown', coins:500, points:700 }
  ];

  const pkLeaderboard = [
    { user:'rehan',   wins:49, points:452800, streak:9 },
    { user:'zeeshan', wins:44, points:391200, streak:7 },
    { user:'nusrat',  wins:41, points:336400, streak:4 },
    { user:'rafi',    wins:38, points:284500, streak:5 },
    { user:'ayesha',  wins:35, points:264100, streak:1 },
    { user:'kavita',  wins:31, points:218900, streak:2 },
    { user:'farah',   wins:29, points:201300, streak:6 },
    { user:'me',      wins:9,  points:48700,  streak:2 }
  ];

  const pkSupporters = [
    { user:'nusrat', points:2400, gifts:18 },
    { user:'elena',  points:1850, gifts:12 },
    { user:'zack',   points:1200, gifts:9 },
    { user:'samira', points:900,  gifts:7 },
    { user:'lamia',  points:640,  gifts:4 },
    { user:'tariq',  points:420,  gifts:3 },
    { user:'nadia',  points:280,  gifts:2 }
  ];

  const pkHistory = [
    { id:'ph1', opponent:'rafi',    result:'win',  hostScore:12480, oppScore:10920, rounds:3, date:'28 Oct 2026', points:4820, viewers:'4.1K' },
    { id:'ph2', opponent:'zeeshan', result:'loss', hostScore:8960,  oppScore:11340, rounds:3, date:'26 Oct 2026', points:-1240, viewers:'3.6K' },
    { id:'ph3', opponent:'nusrat',  result:'win',  hostScore:15240, oppScore:12860, rounds:5, date:'23 Oct 2026', points:6380, viewers:'5.2K' },
    { id:'ph4', opponent:'kavita',  result:'win',  hostScore:9240,  oppScore:7120,  rounds:1, date:'21 Oct 2026', points:2960, viewers:'2.1K' },
    { id:'ph5', opponent:'rehan',   result:'loss', hostScore:14120, oppScore:16880, rounds:5, date:'18 Oct 2026', points:-2180, viewers:'6.4K' },
    { id:'ph6', opponent:'ayesha',  result:'win',  hostScore:10760, oppScore:9840,  rounds:3, date:'15 Oct 2026', points:3140, viewers:'3.3K' }
  ];

  window.DATA = {
    users, posts, reels, reelComments, liveStreams, rooms, notifications, chats,
    courses, books, tiers, members, upcoming, tracks, stories, groupChats, contentRequests, exclusivePosts, creatorSubs,
    pkOpponents, pkBattles, pkGifts, pkLeaderboard, pkSupporters, pkHistory,
    me: users.me,
    categories: ['All','Following','Music','Talk','Learning','Gaming'],
    stats: { followers:'12.4K', following:'318', posts:'96', reels:'24', rooms:'18' }
  };
})();
