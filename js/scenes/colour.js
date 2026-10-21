FD.add({
  id: 'colour',
  title: 'Colour choice',
  tab: 'Colour',
  icon: 'colour',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Monochrome', 'Using a range of shades of one colour.'],
    ['Greyscale', 'Using a range of shades of grey.'],
    ['Convey', 'Communicate or express something such as a message or an emotion.'],
    ['Harmonious', 'Things that work well together or in harmony.'],
    ['Colour wheel', 'A circle that shows the relationships between colours, with the three primary colours (red, blue and yellow) evenly spaced around it.'],
    ['Complement', 'To make a good combination with someone or something else.'],
    ['Analogous', 'Similar to another situation or thing, so that a comparison can be made (colours next to each other on the wheel).'],
    ['Split-complementary colours', 'One colour plus the two colours analogous to its complement.'],
    ['Theme', 'A particular style.'],
  ],
  mount(el) {
    // Artist's colour wheel (red, yellow and blue primaries), clockwise from red at the top.
    const KEY = ['#E8231B', '#F2591E', '#F7941D', '#FBC21B', '#F9E814', '#A8CF38', '#4FAE45', '#1E8F8C', '#2156A5', '#3E3A97', '#6A2C8E', '#B3207A'];
    const NAMES = ['red', 'red-orange', 'orange', 'yellow-orange', 'yellow', 'yellow-green', 'green', 'blue-green', 'blue', 'blue-violet', 'violet', 'red-violet'];
    const hex2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
    const at = (deg) => { const d = ((deg % 360) + 360) % 360, f = d / 30, i = Math.floor(f) % 12, t = f - Math.floor(f); const a = hex2(KEY[i]), b = hex2(KEY[(i + 1) % 12]); return toHex(a.map((v, k) => v + (b[k] - v) * t)); };
    const name = (deg) => NAMES[Math.round((((deg % 360) + 360) % 360) / 30) % 12];
    const pt = (deg, r) => [100 + r * Math.sin((deg * Math.PI) / 180), 100 - r * Math.cos((deg * Math.PI) / 180)];
    const wedges = Array.from({ length: 36 }, (_, i) => {
      const a0 = i * 10 - 5, a1 = a0 + 10, [x0, y0] = pt(a0, 92), [x1, y1] = pt(a1, 92);
      return `<path d="M100 100L${x0.toFixed(1)} ${y0.toFixed(1)}A92 92 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${at(i * 10)}" data-d="${i * 10}"/>`;
    }).join('');

    el.innerHTML = `
      <div class="sim co-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="grey">🌫️ Greyscale</button><button data-p="mood">🎭 Emotion and meaning</button><button data-p="wheel">🎨 Colour wheel</button>
        </div>

        <div data-panel="grey" class="sim">
          <div class="seg" id="gSeg"><button data-v="full">Full colour</button><button data-v="grey">Greyscale</button><button data-v="mono">Monochrome (blue)</button></div>
          <div class="sim-box co-desk" id="desk">
            <svg viewBox="0 0 320 170" role="img" aria-label="A desk with a lamp, a laptop and a plant">
              <defs><filter id="coMono"><feColorMatrix type="matrix" values="0.07 0.24 0.03 0 0  0.13 0.44 0.05 0 0.05  0.2 0.65 0.07 0 0.2  0 0 0 1 0"/></filter></defs>
              <g id="deskArt">
                <rect width="320" height="170" fill="#f1e3c8"/><rect y="118" width="320" height="52" fill="#a0673a"/><rect y="114" width="320" height="8" fill="#7a4a26"/>
                <path d="M60 114h30l-6-8h-18z" fill="#2b2b2b"/><path d="M75 106l-10-46 34-22" stroke="#2b2b2b" stroke-width="5" fill="none"/><path d="M92 30l26 8-6 18-28-10z" fill="#e8231b"/><path d="M104 54l-14 34" stroke="#fff3a0" stroke-width="14" opacity=".45"/>
                <rect x="130" y="58" width="92" height="56" rx="4" fill="#3a3f47"/><rect x="136" y="64" width="80" height="44" fill="#4fa3e0"/><path d="M122 114h108l-8 6h-92z" fill="#9aa1a9"/>
                <rect x="248" y="88" width="34" height="26" rx="3" fill="#e0662b"/><path d="M265 88c-14-20-10-34 0-42 10 8 14 22 0 42zM265 88c-20-6-26-18-24-28 12 0 20 10 24 28zM265 88c20-6 26-18 24-28-12 0-20 10-24 28z" fill="#3c9a3e"/>
                <rect x="232" y="22" width="56" height="40" fill="#fff" stroke="#c7a46b" stroke-width="3"/><circle cx="252" cy="38" r="7" fill="#f9e814"/><path d="M236 58l16-14 12 10 8-6 14 10z" fill="#4fae45"/>
              </g>
            </svg>
          </div>
          <p class="note">💡 <b>Hint:</b> don’t underestimate the power of using <b>monochrome</b> or <b>greyscale</b>. This simple approach can result in a clean-looking and effective design (Figure 13.11).</p>
        </div>

        <div data-panel="mood" class="sim" hidden>
          <div class="two-col">
            <div><div class="co-pos" id="pKids"><p class="cp-a">Have a great day out</p><h4>KIDS’ FUN DAY!</h4><p>Sunday 14th August · 11am–6pm</p><div class="cp-stars"><span>Face painting</span><span>Games</span><span>Story telling</span></div></div>
              <div class="seg co-pick" data-for="pKids"><button data-v="bright">Bright, colourful</button><button data-v="dark">Dark, gloomy</button></div></div>
            <div><div class="co-pos" id="pGhost"><p class="cp-a">Experience chills and thrills</p><h4>GHOST WALK</h4><p>Old Town tours · Fridays · 8 pm</p><p class="cp-q">“A frighteningly good show”</p></div>
              <div class="seg co-pick" data-for="pGhost"><button data-v="bright">Bright, colourful</button><button data-v="dark">Dark, gloomy</button></div></div>
          </div>
          <p class="verdict" id="mMsg"></p>
        </div>

        <div data-panel="wheel" class="sim" hidden>
          <div class="seg" id="wSeg"><button data-v="comp">Complementary</button><button data-v="ana">Analogous</button><button data-v="split">Split-complementary</button></div>
          <div class="co-wheel">
            <svg viewBox="0 0 200 200" id="wheel" role="img" aria-label="Colour wheel: click a colour">${wedges}<circle cx="100" cy="100" r="14" class="co-hub"/><g id="marks"></g></svg>
            <div class="co-side">
              <div class="co-sw" id="sw"></div>
              <div class="co-site" id="site"><div class="cs-ban">Riverside Leisure</div><p>Swimming lessons for all ages. <a href="#" onclick="return false">See the timetable</a></p><button type="button">Book now</button></div>
            </div>
          </div>
          <p class="verdict" id="wMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.co-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let base = 60, mode = 'comp';

    function grey(k) { FD.segSet($('#gSeg'), k); $('#deskArt').setAttribute('style', k === 'grey' ? 'filter:grayscale(1)' : k === 'mono' ? 'filter:url(#coMono)' : ''); }
    $('#gSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) grey(b.dataset.v); });

    const pal = { pKids: 'bright', pGhost: 'dark' };
    function mood(id, v) {
      pal[id] = v;
      $('#' + id).className = 'co-pos ' + v + ' ' + id;
      FD.segSet(root.querySelector(`.co-pick[data-for="${id}"]`), v);
      const kidsOk = pal.pKids === 'bright', ghostOk = pal.pGhost === 'dark';
      $('#mMsg').className = 'verdict ' + (kidsOk && ghostOk ? 'good' : 'bad');
      $('#mMsg').innerHTML = kidsOk && ghostOk ? '✓ Each poster now <b>conveys</b> the right mood: fun and excitement for children, mystery and fear for the adults’ ghost tour.' : `✗ ${!kidsOk ? 'Dark, gloomy colours do not convey fun and excitement to children.' : ''} ${!ghostOk ? 'Bright, cheerful colours do not suggest mystery and fear.' : ''} Think about the purpose and audience.`;
    }
    root.querySelectorAll('.co-pick').forEach((s) => s.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) mood(s.dataset.for, b.dataset.v); }));

    function scheme() {
      const d = mode === 'comp' ? [base, base + 180] : mode === 'ana' ? [base - 30, base, base + 30] : [base, base + 150, base + 210];
      return d;
    }
    function wheel(m, b) {
      if (m) mode = m; if (b != null) base = b;
      FD.segSet($('#wSeg'), mode);
      const d = scheme(), cols = d.map(at);
      $('#marks').innerHTML = d.map((deg, i) => { const [x, y] = pt(deg, 70); return `<line x1="100" y1="100" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="co-ln"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" class="co-dot"/><text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" class="co-n">${i + 1}</text>`; }).join('');
      $('#sw').innerHTML = cols.map((c, i) => `<div style="--c:${c}"><b>${i + 1}</b><span class="mono">${c}</span><small>${name(d[i])}</small></div>`).join('');
      const s = $('#site');
      const ink = (h) => { const [r, g, b] = hex2(h); return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#18243b' : '#fff'; };
      s.style.setProperty('--a', cols[0]); s.style.setProperty('--b', cols[1]); s.style.setProperty('--c', cols[2] || cols[1]);
      s.style.setProperty('--ta', ink(cols[0])); s.style.setProperty('--tb', ink(cols[1]));
      $('#wMsg').className = 'verdict';
      $('#wMsg').innerHTML = mode === 'comp' ? `Colours <b>opposite</b> each other <b>complement</b> and contrast with each other: ${name(d[0])} and ${name(d[1])}. They give bright and lively colour patterns.`
        : mode === 'ana' ? 'Analogous colours are <b>next to each other</b> on the wheel. They work well for objects that need to follow a <b>theme</b>, such as buttons, banners and links in a website.'
          : `Split-complementary: choose one colour (${name(d[0])}), find its complement (${name(base + 180)}), then use the two colours <b>analogous to the complement</b>. This gives more choice of colours.`;
    }
    $('#wSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) wheel(b.dataset.v); });
    $('#wheel').addEventListener('click', (e) => { const w = e.target.closest('[data-d]'); if (w) wheel(null, +w.dataset.d); });

    function reset() { grey('full'); mood('pKids', 'bright'); mood('pGhost', 'dark'); wheel('comp', 120); }
    show('grey'); reset();
    return { show, grey, mood, wheel, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Adding colour to digital products',
      text: `<p>You can add colour to digital products by including colourful <b>backgrounds, images, buttons or logos</b>. You can also use different-coloured text, such as in paragraphs, links and headings.</p>
             <p>But don’t underestimate <strong>monochrome</strong> (shades of one colour) or <strong>greyscale</strong> (shades of grey): they can look clean and effective.</p>`,
      tip: 'Try it: switch the photo to greyscale and monochrome.',
      async on(a, ctx) { a.reset(); a.show('grey'); for (const k of ['grey', 'mono', 'full']) { if (!(await ctx.sleep(1500))) return; a.grey(k); } },
    },
    {
      title: 'Emotion and meaning',
      text: `<p>Colour can suggest a certain <b>mood</b> or atmosphere, so consider the purpose and audience.</p>
             <p>A poster for a children’s activity day should <strong>convey</strong> fun and excitement; a poster for a ghost tour for adults should suggest mystery and fear (Figure 13.12).</p>`,
      tip: 'Try it: swap the colours of the two posters.',
      async on(a, ctx) { a.show('mood'); a.mood('pKids', 'dark'); if (!(await ctx.sleep(1800))) return; a.mood('pKids', 'bright'); },
    },
    {
      title: 'Harmony: complementary colours',
      text: `<p>Some patterns of colour work well together: they are <strong>harmonious</strong>. A <strong>colour wheel</strong> shows the relationships between colours, with the primary colours red, blue and yellow evenly spaced around it.</p>
             <p>Colours <b>opposite</b> each other <strong>complement</strong> and contrast with each other (Figure 13.13).</p>`,
      tip: 'Try it: click any colour on the wheel.',
      async on(a, ctx) { a.show('wheel'); a.wheel('comp', 120); for (const d of [0, 240]) { if (!(await ctx.sleep(1700))) return; a.wheel(null, d); } },
    },
    {
      title: 'Analogous colours',
      text: `<p>Other colours are <strong>analogous</strong>: they are <b>next to each other</b> on the wheel (Figure 13.14).</p>
             <p>Not all colours in a product need to be <b>high contrast</b>. A pattern of analogous colours works well for objects that need to follow a <strong>theme</strong>, such as the buttons, banners and links in a website.</p>`,
      async on(a) { a.show('wheel'); a.wheel('ana', 240); },
    },
    {
      title: 'Split-complementary colours',
      text: `<p><strong>Split-complementary colours</strong> are a pattern of three colours: choose one colour, identify its complementary colour, and select the colours that are <b>analogous to its complement</b> (such as red and two shades of green).</p>
             <p>They can provide more choice of colours (Figure 13.15).</p>`,
      async on(a, ctx) { a.show('wheel'); a.wheel('split', 0); if (!(await ctx.sleep(2000))) return; a.wheel(null, 240); },
    },
  ],
});

FD.activities({
  section: 'colour',
  items: [
    {
      id: 'colour-patterns',
      title: 'Choosing colour patterns',
      task: '<p>Find some web applications that allow users to create colour schemes, such as Paletton, Galactic Ink Sphere or Coolors. Try out different combinations of colours and see which colours work well together.</p>',
      sim: ['colour', 'You can also use the colour wheel in this lesson'],
      fields: ['Web application you used', 'Your favourite colour scheme (hex codes)'],
      lines: 4,
      hint: 'Which combinations worked well together? Were they complementary, analogous or split-complementary?',
    },
  ],
});

FD.check({
  section: 'colour',
  items: [
    { type: 'mcq', q: 'What is <b>greyscale</b>?', opts: ['Using a range of shades of grey', 'Using a range of shades of one colour', 'Using only black text', 'Using two complementary colours'], why: 'Monochrome uses shades of one colour.' },
    { type: 'mcq', q: 'On the colour wheel, where are <b>complementary</b> colours?', opts: ['Opposite each other', 'Next to each other', 'Always at the top', 'In the centre'], why: 'Analogous colours are next to each other.' },
    { type: 'mcq', q: 'Which colour pattern works well for buttons, banners and links that follow a <b>theme</b>?', opts: ['Analogous colours', 'High-contrast complementary colours only', 'Red and green', 'Random colours'], why: 'Not all colours in a product need to be high contrast.' },
    { type: 'tf', q: 'A poster for a ghost tour for adults should use the same bright colours as a children’s fun day poster.', a: false, why: 'Colour should convey the right emotion for the purpose and audience.' },
  ],
});
