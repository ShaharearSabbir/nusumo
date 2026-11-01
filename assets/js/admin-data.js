/* ==========================================================================
   Nusumo Admin — seeded demo dataset
   Deterministic: the same numbers on every reload.
   ========================================================================== */
(function () {
  /* ---------------- deterministic PRNG ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20261101);
  const rand = (min, max) => min + rnd() * (max - min);
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  /* ---------------- people ---------------- */
  const GRADS = [
    'linear-gradient(135deg,#a678ff,#ff6ad5)',
    'linear-gradient(135deg,#ff9d6e,#ff5f9e)',
    'linear-gradient(135deg,#6f7bff,#b06bff)',
    'linear-gradient(135deg,#3fbfa8,#7b8dff)',
    'linear-gradient(135deg,#ffb35c,#ff6a6a)',
    'linear-gradient(135deg,#4bd6a3,#3a9bff)',
    'linear-gradient(135deg,#ff8ab0,#b06bff)',
    'linear-gradient(135deg,#5c8cff,#57d3c0)',
    'linear-gradient(135deg,#57d3c0,#5c8cff)',
    'linear-gradient(135deg,#c58bff,#5a7bff)',
    'linear-gradient(135deg,#ff7f9f,#ffb35c)',
    'linear-gradient(135deg,#6ad0ff,#a678ff)',
    'linear-gradient(135deg,#ff9d6e,#d05bb5)',
    'linear-gradient(135deg,#5c8cff,#a678ff)',
    'linear-gradient(135deg,#57d3c0,#ff8ab0)',
    'linear-gradient(135deg,#6a8cff,#7be0d0)'
  ];
  const FIRST = ['Ayesha','Rafi','Farah','Kavita','Marcus','Zeeshan','Nusrat','Devon','Rehan','Maya','Tariq','Samira','Elena','Tanvir','Sadia','Farhan','Lamia','Sora','Milo','Zack','Nadia','Imran','Priya','Adnan','Rumana','Shakib','Tania','Omar','Lina','Habib','Meher','Rashed','Anika','Junaid','Saima','Fahim','Nabila','Arif','Tasnim','Rohan','Ishita','Kabir','Mitu','Sabbir','Zoya','Naeem','Piuli','Araf','Dina','Shafin','Raisa','Tahmid','Maliha','Sourav','Nusrat','Ifty','Rupa','Ayaan','Mira','Zayed'];
  const LAST = ['Rahman','Chowdhury','Khan','Rao','Cole','Ahmed','Jahan','Vance','Lin','Hossain','Kabir','Islam','Taylor','Kovač','Haque','Siddiqui','Bhuiyan','Karim','Das','Roy','Alam','Sarker','Mia','Sultana','Uddin','Biswas','Mahmud','Nahar','Hasan','Kabir'];
  const ROLES = ['Creator','Creator','Creator','Designer','Producer','Host','Engineer','Curator','Community host','Editor'];

  const users = FIRST.slice(0, 60).map((name, i) => {
    const last = LAST[(i * 7 + 3) % LAST.length];
    const handle = '@' + name.toLowerCase() + '.' + last.toLowerCase().replace(/[^a-z]/g, '');
    return {
      id: 'u' + (i + 1),
      name: name + ' ' + last,
      handle,
      initials: (name[0] + last[0]).toUpperCase(),
      grad: GRADS[i % GRADS.length],
      role: ROLES[i % ROLES.length],
      verified: i % 4 === 0,
      followers: randInt(800, 120000),
      joinedDaysAgo: randInt(3, 380)
    };
  });

  const me = {
    id: 'me',
    name: 'Mahfuza Akhter',
    handle: '@mahfuza',
    initials: 'MA',
    role: 'Administrator',
    grad: 'linear-gradient(135deg,#a678ff,#ff6ad5)'
  };

  /* ---------------- 400 days of daily metrics ---------------- */
  const DAY_MS = 86400000;
  const END = Date.UTC(2026, 10, 1); // 01 Nov 2026
  const DAYS = 800;
  const daily = [];

  for (let i = 0; i < DAYS; i++) {
    const ts = END - (DAYS - 1 - i) * DAY_MS;
    const date = new Date(ts);
    const dow = date.getUTCDay();            // 0 Sun … 6 Sat
    const weekend = dow === 0 || dow === 6 ? 1.16 : 1;
    const growth = 0.82 + (i / DAYS) * 0.46;
    const wave = 1 + Math.sin(i / 7 * Math.PI * 2) * 0.06;
    const noise = () => 0.9 + rnd() * 0.2;

    const subs = Math.round(4200 * growth * weekend * wave * noise());
    const premium = Math.round(840 * growth * weekend * noise());
    const boostSpike = rnd() > 0.965 ? randInt(1200, 3400) : 0;
    const boosts = Math.round(360 * growth * noise()) + boostSpike;

    const posts = randInt(2, 6);
    const reels = randInt(1, 4);
    const live = rnd() > (weekend > 1 ? 0.55 : 0.72) ? randInt(1, 2) : 0;

    const visits = Math.round((420 + (i / DAYS) * 260) * weekend * noise());
    const signups = Math.round(visits * rand(0.025, 0.041));
    const fresh = Math.round(signups * rand(0.55, 0.78));

    daily.push({
      date: date.toISOString().slice(0, 10),
      ts,
      dow,
      revenue: { subs, premium, boosts, total: subs + premium + boosts },
      content: { posts, reels, live, total: posts + reels + live },
      users: { visits, signups, new: fresh },
      subsActive: Math.round(962 + i * 0.72 + Math.sin(i / 21) * 6)
    });
  }

  /* ---------------- names for generated records ---------------- */
  const nameOf = (u) => u.name;
  const ago = (days, hours) => new Date(END - days * DAY_MS - (hours || 0) * 3600000).toISOString();

  /* ---------------- activity feed ---------------- */
  const activity = [];
  const KINDS = [
    'user_joined', 'user_joined', 'user_joined',
    'subscription_new', 'subscription_new', 'subscription_new',
    'payment', 'payment',
    'payout',
    'post_flagged',
    'verification'
  ];
  for (let i = 0; i < 90; i++) {
    const kind = KINDS[i % KINDS.length];
    const u = users[(i * 13 + 5) % users.length];
    const days = Math.floor(i / 6);
    const ev = {
      id: 'ev' + (i + 1),
      kind,
      user: u,
      amount: null,
      at: ago(days, randInt(1, 20))
    };
    if (kind === 'subscription_new') { ev.amount = pick([5, 12, 28]); ev.plan = ev.amount === 5 ? 'Supporter' : ev.amount === 12 ? 'Creator' : 'Studio'; }
    if (kind === 'payment') { ev.amount = pick([9, 15, 25, 45, 80]); ev.product = pick(['Boost · 7 days', 'Exclusive unlock', 'Content request']); }
    if (kind === 'payout') { ev.amount = pick([420, 680, 940, 1240]); }
    if (kind === 'post_flagged') { ev.reason = pick(['spam signal', 'copyright match', 'reported ×3']); }
    if (kind === 'user_joined') { ev.via = pick(['invitation', 'organic search', 'referral']); }
    if (kind === 'verification') { ev.doc = pick(['identity', 'creator account']); }
    activity.push(ev);
  }
  activity.sort((a, b) => new Date(b.at) - new Date(a.at));

  /* ---------------- top creators ---------------- */
  const creatorIdx = [1, 5, 10, 7, 3].map(n => n % users.length);
  const creators = creatorIdx.map((idx, i) => {
    const u = users[idx];
    return {
      id: u.id,
      name: u.name,
      handle: u.handle,
      grad: u.grad,
      verified: u.verified,
      earnings: [12480, 9820, 8115, 6240, 4310][i],
      growth: [18.4, 12.1, -3.2, 9.7, 22.6][i],
      subscribers: [412, 386, 271, 198, 164][i],
      content: [48, 39, 62, 27, 44][i],
      spark: [6, 8, 7, 11, 9, 14, 16].map(v => v + i * 0.6)
    };
  });

  /* ---------------- audience ---------------- */
  const audience = {
    gender: [
      { label: 'Female', share: 0.46, color: 'var(--a-accent)' },
      { label: 'Male', share: 0.38, color: 'var(--a-info)' },
      { label: 'Other', share: 0.16, color: 'var(--a-ok)' }
    ],
    countries: [
      { name: 'Bangladesh', share: 0.41 },
      { name: 'India', share: 0.23 },
      { name: 'United States', share: 0.12 }
    ]
  };

  /* ---------------- payments ---------------- */
  const paymentsMix = [
    { method: 'Card', share: 0.56, color: 'var(--a-accent)' },
    { method: 'Wallet', share: 0.26, color: 'var(--a-info)' },
    { method: 'Bank transfer', share: 0.13, color: 'var(--a-ok)' },
    { method: 'Manual', share: 0.05, color: 'var(--a-faint)' }
  ];

  /* ---------------- attention ---------------- */
  const attention = [
    {
      id: 'at1', kind: 'payouts_due', severity: 'bad',
      title: 'Payouts due', meta: '3 creators · weekly batch',
      count: 3, amount: 4200,
      items: [
        { user: users[1], label: 'Weekly payout', amount: 1840, due: 'Today' },
        { user: users[5], label: 'Weekly payout', amount: 1420, due: 'Today' },
        { user: users[10], label: 'Weekly payout', amount: 940, due: 'Today' }
      ]
    },
    {
      id: 'at2', kind: 'flagged_posts', severity: 'bad',
      title: 'Flagged posts', meta: 'Automod · last 24 hours',
      count: 6, amount: null,
      items: [
        { user: users[11], label: 'Post #4821', meta: 'Spam signal', due: '2h ago' },
        { user: users[17], label: 'Reel #912', meta: 'Copyright match', due: '4h ago' },
        { user: users[23], label: 'Post #4810', meta: 'Reported ×3', due: '6h ago' },
        { user: users[29], label: 'Comment thread', meta: 'Harassment', due: '8h ago' },
        { user: users[33], label: 'Reel #904', meta: 'Spam signal', due: '11h ago' },
        { user: users[41], label: 'Post #4799', meta: 'Copyright match', due: '19h ago' }
      ]
    },
    {
      id: 'at3', kind: 'failed_jobs', severity: 'warn',
      title: 'Failed jobs', meta: 'Queue: media-transcode',
      count: 12, amount: null,
      items: [
        { label: 'video.transcode ×8', meta: 'Timeout after 120s', due: 'Last hour' },
        { label: 'image.optimise ×3', meta: 'Disk quota exceeded', due: 'Last hour' },
        { label: 'webhook.payout ×1', meta: 'Connection refused', due: 'Last hour' }
      ]
    },
    {
      id: 'at4', kind: 'subs_expiring', severity: 'warn',
      title: 'Subscriptions expiring', meta: 'Next 7 days',
      count: 9, amount: 1080,
      items: [
        { user: users[8], label: 'Creator · monthly', amount: 12, due: 'In 2 days' },
        { user: users[14], label: 'Studio · monthly', amount: 28, due: 'In 3 days' },
        { user: users[21], label: 'Supporter · monthly', amount: 5, due: 'In 5 days' }
      ]
    }
  ];

  /* ---------------- system ---------------- */
  const system = [
    { key: 'queue', label: 'Queue depth', value: '0', status: 'ok', note: 'waiting jobs' },
    { key: 'failed', label: 'Failed jobs', value: '12', status: 'bad', note: 'last 24h' },
    { key: 'storage', label: 'Storage used', value: '68%', status: 'warn', note: '34.2 of 50 GB' },
    { key: 'backup', label: 'Last backup', value: '2h ago', status: 'ok', note: 'today 04:00' },
    { key: 'latency', label: 'API p95', value: '412ms', status: 'ok', note: 'within budget' }
  ];

  /* ---------------- notifications ---------------- */
  const notifications = [
    { id: 'n1', title: '12 jobs failed in media-transcode', meta: 'System · 22m ago', kind: 'bad' },
    { id: 'n2', title: 'Payout batch is waiting for approval', meta: 'Revenue · 1h ago', kind: 'warn' },
    { id: 'n3', title: 'Nusrat Jahan requested verification', meta: 'Community · 3h ago', kind: 'accent' }
  ];

  /* ---------------- export ---------------- */
  window.ADMIN = {
    generatedAt: new Date(END).toISOString(),
    me,
    users,
    usersIndex: users.map(u => ({ id: u.id, name: u.name, handle: u.handle, grad: u.grad, role: u.role })),
    daily,
    activity,
    creators,
    audience,
    paymentsMix,
    attention,
    system,
    notifications
  };
})();
