FD.add({
  id: 'house',
  title: 'House styles',
  tab: 'House style',
  icon: 'house',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['House style', 'An organisation’s preferred style of writing and layout of content.'],
    ['Corporate identity', 'The way an organisation presents itself to the public.'],
    ['Branding', 'The distinctive design that identifies an organisation and its products.'],
  ],
  mount(el) {
    const ORG = 'Riverside Leisure';
    // Without a house style each product is made differently.
    const MESSY = [
      { font: '"Comic Sans MS", "Comic Sans", cursive', col: '#d6336c', bg: '#fff3bf', logo: 'right' },
      { font: 'Georgia, "Times New Roman", serif', col: '#2f9e44', bg: '#ffffff', logo: 'bottom' },
      { font: 'Impact, "Arial Black", sans-serif', col: '#e8590c', bg: '#e7f5ff', logo: 'none' },
    ];
    const HOUSE = { font: 'Verdana, "Segoe UI", sans-serif', col: '#0b7f95', bg: '#ffffff', logo: 'left' };
    const PRODUCTS = [
      ['Letter', '<p>Dear Member,</p><p>Our new swimming timetable starts on Monday 1st September.</p><p>Best wishes,<br>The Riverside team</p>'],
      ['Web page', '<p class="hs-nav">Home · Swimming · Gym · Contact</p><p><b>Swimming lessons</b></p><p>Book online for all ages.</p>'],
      ['Poster', '<p class="hs-big">Summer Fun Run</p><p>Sunday 10th August · 10:00</p><p>All welcome</p>'],
    ];
    const LOGOS = [
      ['ok', 'The logo as it should be used', ''],
      ['stretch', 'Stretched out of shape', 'Do not stretch or squash the logo.'],
      ['colour', 'In other colours', 'Do not use any other colours for the logo.'],
      ['tilt', 'Rotated', 'Do not rotate the logo.'],
      ['busy', 'On a busy background', 'Do not place the logo on a busy photo or pattern.'],
      ['swap', 'Wordmark and icon rearranged', 'Do not rearrange the wordmark and the icon.'],
    ];
    const LOGO = `<span class="hs-logo"><i>〰</i><b>${ORG}</b></span>`;
    el.innerHTML = `
      <div class="sim hs-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="post">📐 Where content goes</button><button data-p="docs">🏠 Apply a house style</button><button data-p="brand">🚫 Logo don’ts</button>
        </div>

        <div data-panel="post" class="sim">
          <div class="hs-post">
            <div class="hs-ph" data-z="avatar">🟦</div>
            <div class="hs-who"><b data-z="name">Riverside Leisure ✔</b><small data-z="user">@RiversideLeisure</small></div>
            <span class="hs-brand" data-z="logo">〰</span>
            <div class="hs-img" data-z="content">🏊‍♀️🏊‍♂️</div>
            <p class="hs-txt" data-z="content">New: early-morning lane swimming from 06:30!</p>
            <div class="hs-foot"><span data-z="buttons">🔁 ♡ ↩</span><span data-z="date">1 Sep 2026</span></div>
          </div>
          <div class="chips" id="zones">${[['avatar', 'Avatar'], ['name', 'Name'], ['user', '@Username'], ['content', 'Content'], ['logo', 'Logo'], ['buttons', 'Share · Like · Reply'], ['date', 'Date']].map(([z, t]) => `<button class="mini-btn" data-z="${z}">${t}</button>`).join('')}</div>
          <p class="note">Like Figure 13.3: every post this organisation publishes puts each item in the same place.</p>
        </div>

        <div data-panel="docs" class="sim" hidden>
          <label class="tgl"><input type="checkbox" id="hsOn"> Follow the ${ORG} house style</label>
          <div class="hs-docs" id="docs"></div>
          <div class="sim-box hs-sheet" id="sheet">
            <h5 class="mw-h">📘 ${ORG} house style</h5>
            <ul class="hs-rules">
              <li data-r="logos">🔷 <b>Logos:</b> top left, never changed</li>
              <li data-r="colours">🎨 <b>Colours:</b> teal <span class="sw" style="background:#0b7f95"></span> and white</li>
              <li data-r="type">🔤 <b>Typeface:</b> Verdana (sans serif)</li>
              <li data-r="images">🖼️ <b>Images:</b> rounded corners</li>
              <li data-r="space">⬜ <b>White space:</b> wide margins</li>
              <li data-r="layouts">🗂️ <b>Layouts:</b> logo, then title bar, then content</li>
            </ul>
          </div>
          <p class="verdict" id="hsMsg"></p>
        </div>

        <div data-panel="brand" class="sim" hidden>
          <p class="note">Brand guidelines (like Figure 13.8). Click each logo: is it allowed?</p>
          <div class="hs-logos">${LOGOS.map(([k, t], i) => `<button class="hs-lg lg-${k}" data-i="${i}"><span class="hs-lgbox">${LOGO}</span><small>${t}</small><em></em></button>`).join('')}</div>
          <p class="verdict" id="lgMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.hs-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    function zone(z) {
      root.querySelectorAll('.hs-post [data-z]').forEach((x) => x.classList.toggle('hz', x.dataset.z === z));
      root.querySelectorAll('#zones [data-z]').forEach((x) => x.classList.toggle('on', x.dataset.z === z));
    }
    $('#zones').addEventListener('click', (e) => { const b = e.target.closest('[data-z]'); if (b) zone(b.dataset.z); });

    function docs(on) {
      $('#hsOn').checked = on;
      $('#docs').innerHTML = PRODUCTS.map(([n, body], i) => {
        const s = on ? HOUSE : MESSY[i];
        return `<article class="hs-doc logo-${s.logo} ${on ? 'house' : ''}" style="--f:${s.font.replace(/"/g, '&quot;')};--col:${s.col};--bg:${s.bg}">
          <small class="hs-kind">${n}</small>${s.logo !== 'none' ? LOGO : ''}<div class="hs-bar">${ORG}</div><div class="hs-body">${body}</div></article>`;
      }).join('');
      $('#hsMsg').className = 'verdict ' + (on ? 'good' : 'bad');
      $('#hsMsg').innerHTML = on ? '✓ All three products look like they come from the same organisation: its <b>corporate identity</b> is maintained and they are <b>immediately recognisable</b>.' : '✗ Without a house style, each product uses different fonts, colours and logo positions. Would you know they all came from the same leisure centre?';
    }
    $('#hsOn').addEventListener('change', (e) => docs(e.target.checked));
    function rule(r) { root.querySelectorAll('.hs-rules li').forEach((li) => li.classList.toggle('on', li.dataset.r === r)); }

    function logo(i) {
      const [k, t, why] = LOGOS[i];
      const b = root.querySelector(`.hs-lg[data-i="${i}"]`);
      b.classList.add(k === 'ok' ? 'yes' : 'no');
      b.querySelector('em').textContent = k === 'ok' ? '✓ Allowed' : '✗ Don’t';
      $('#lgMsg').className = 'verdict ' + (k === 'ok' ? 'good' : 'bad');
      $('#lgMsg').innerHTML = k === 'ok' ? '✓ This is the logo exactly as the guidelines show it.' : `✗ ${why} Organisations are often very specific about how people should use their <b>branding</b>.`;
    }
    root.querySelectorAll('.hs-lg').forEach((b) => b.addEventListener('click', () => logo(+b.dataset.i)));

    function reset() { zone(''); docs(false); rule(''); root.querySelectorAll('.hs-lg').forEach((b) => { b.classList.remove('yes', 'no'); b.querySelector('em').textContent = ''; }); $('#lgMsg').innerHTML = ''; }
    show('post'); reset();
    return { show, zone, docs, rule, logo, reset, destroy() {} };
  },
  steps: [
    {
      title: 'What is a house style?',
      text: `<p>Organisations often have a <strong>house style</strong>: their preferred style of writing and layout of content.</p>
             <p>It shows where content should be placed on each copy of a digital product, like this social media post (Figure 13.3).</p>`,
      tip: 'Try it: click the labels to find each part.',
      async on(a, ctx) { a.reset(); a.show('post'); for (const z of ['avatar', 'name', 'user', 'content', 'logo', 'buttons', 'date']) { a.zone(z); if (!(await ctx.sleep(800))) return; } a.zone(''); },
    },
    {
      title: 'Corporate identity',
      text: `<p>A house style specifies how documents and other digital products should be laid out. This makes sure the organisation’s <strong>corporate identity</strong> (the way it presents itself to the public) is maintained.</p>
             <p>Its digital products are then <b>immediately recognisable</b>.</p>`,
      tip: 'Try it: switch the house style on and off.',
      async on(a, ctx) { a.show('docs'); a.docs(false); if (!(await ctx.sleep(2200))) return; a.docs(true); },
    },
    {
      title: 'What a house style includes',
      text: `<p>House styles usually include guidelines for how designers should treat:</p>
             <ul><li>images</li><li>colours</li><li>logos</li><li>typeface or font style</li><li>white space</li><li>layouts.</li></ul>`,
      async on(a, ctx) { a.show('docs'); a.docs(true); for (const r of ['images', 'colours', 'logos', 'type', 'space', 'layouts']) { a.rule(r); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Branding guidelines',
      text: `<p>Organisations are often very specific about how people should use their <strong>branding</strong>: the distinctive design that identifies an organisation and its products.</p>
             <p>Brand guidelines often include a list of “don’ts” for the logo (Figure 13.8).</p>`,
      tip: 'Try it: decide which logos are allowed.',
      async on(a, ctx) { a.show('brand'); for (const i of [0, 1, 2]) { a.logo(i); if (!(await ctx.sleep(1300))) return; } },
    },
  ],
});

FD.activities({
  section: 'house',
  items: [
    {
      id: 'house-branding',
      title: 'Branding',
      task: '<p>Do an internet search using the keywords ‘Twitter brand resources’ to find Twitter’s brand guidelines (Twitter is now called X). Review the guidelines and discuss them with the rest of your class. Why do you think Twitter has brand guidelines? Is it important for organisations to have such guidelines?</p>',
      fields: ['Three rules you found in the guidelines'],
      lines: 6,
      hint: 'Why do they have brand guidelines? Is it important for organisations to have them? Give reasons.',
    },
  ],
});

FD.check({
  section: 'house',
  items: [
    { type: 'mcq', q: 'What is a <b>house style</b>?', opts: ['An organisation’s preferred style of writing and layout of content', 'A template for designing houses', 'The font chosen by each designer', 'A type of spreadsheet'], why: 'It shows where content should be placed on each copy of a product.' },
    { type: 'mcq', q: 'Why does a house style help an organisation?', opts: ['Its corporate identity is maintained, so its products are immediately recognisable', 'It makes products cheaper to print', 'It removes the need to proofread', 'It makes files smaller'], why: 'Corporate identity is the way an organisation presents itself to the public.' },
    { type: 'multi', q: 'Which components are usually included in house style guidelines?', need: 3, opts: [['Colours', true], ['Logos', true], ['Typeface or font style', true], ['The designer’s salary', false], ['The computer’s processor', false]], why: 'Also images, white space and layouts.' },
  ],
});
