FD.add({
  id: 'data',
  title: 'The difference between data and information',
  tab: 'Data',
  icon: 'data',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Data', 'Raw numbers, text, sounds, images or animations, which are meaningless until they are processed.'],
    ['Information', 'Data that has been processed to be given context and meaning.'],
    ['Context', 'The circumstances or background of something, such as information or an event.'],
  ],
  mount(el) {
    // Table 13.2: [data (html), context, information]
    const STONE = `<svg viewBox="0 0 120 70" class="dt-photo" role="img" aria-label="Grey rippled surface">
      <rect width="120" height="70" fill="#6b6f73"/>
      ${Array.from({ length: 11 }, (_, i) => `<path d="M-5 ${4 + i * 6.5} C 20 ${i * 6.5 - 2}, 40 ${10 + i * 6.5}, 62 ${4 + i * 6.5} S 100 ${i * 6.5}, 125 ${6 + i * 6.5}" stroke="${i % 2 ? '#c9cdd1' : '#3f4347'}" stroke-width="${1.2 + (i % 3) * .6}" fill="none" opacity=".85"/>`).join('')}
    </svg>`;
    const ROWS = [
      ['February', 'Average temperatures in Kenya', 'The warmest month in Kenya'],
      ['59, 79, 81, 90, 93, 99, 111', 'Students’ marks', 'Grades 5, 6, 7, 8, 8, 9, 9'],
      ['Deep Thought', 'Characters in the books of Douglas Adams', 'Deep Thought is a fictional computer created by the author Douglas Adams'],
      [STONE, 'Photographs taken on cobbled streets', 'This is a photograph of light reflecting off stone, which you may not have recognised without the context, as at first it looks like water'],
    ];
    const ANI = {
      none: ['No context', 'Two grey spheres. One circles the other… but what does it mean?', '#adb5bd', '#868e96', ''],
      logo: ['A company logo', 'An animated logo for a company called Orbit Travel.', '#7048e8', '#f6c94c', 'ORBIT TRAVEL'],
      space: ['Earth and the Sun', 'A representation of the Earth circling the Sun once a year.', '#f59f00', '#1c7ed6', 'The Earth orbits the Sun'],
    };
    const SND = {
      none: ['No context', 'Just a beep. On its own it is only data.'],
      app: ['📱 App notification', 'You have a new message.'],
      game: ['🎮 Game effect', 'You collected a coin!'],
      alarm: ['🚨 Alarm system', 'A door has been opened: the alarm is set.'],
    };
    el.innerHTML = `
      <div class="sim dt-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="table">📋 Table 13.2</button><button data-p="ani">🌀 An animation</button><button data-p="snd">🔊 A sound</button>
        </div>
        <div data-panel="table" class="sim">
          <div class="dt-rows">${ROWS.map(([d, c, i], k) => `
            <div class="dt-row" data-k="${k}">
              <div class="dt-cell dt-data"><small>Data</small><div>${d}</div></div>
              <button class="btn dt-add" data-k="${k}">➕ Add context</button>
              <div class="dt-cell dt-ctx"><small>Context</small><div>${c}</div></div>
              <div class="dt-cell dt-info"><small>Information</small><div>${i}</div></div>
            </div>`).join('')}</div>
        </div>
        <div data-panel="ani" class="sim" hidden>
          <div class="sim-box dt-ani">
            <svg viewBox="0 0 300 150" role="img" aria-label="A sphere circling another sphere">
              <ellipse cx="150" cy="75" rx="95" ry="38" class="dt-orbit"/>
              <circle id="big" cx="150" cy="75" r="26"/>
              <circle id="small" cx="245" cy="75" r="11"/>
              <text id="aLbl" x="150" y="140" class="svg-lbl"></text>
            </svg>
          </div>
          <div class="seg" id="aSeg">${Object.entries(ANI).map(([k, v]) => `<button data-v="${k}">${v[0]}</button>`).join('')}</div>
          <p class="verdict" id="aMsg"></p>
        </div>
        <div data-panel="snd" class="sim" hidden>
          <div class="sim-box dt-snd"><button class="btn primary" id="beep">🔊 Play the sound</button><p class="dt-meaning" id="sMean"></p></div>
          <div class="seg" id="sSeg">${Object.entries(SND).map(([k, v]) => `<button data-v="${k}">${v[0]}</button>`).join('')}</div>
          <p class="note">The sound only plays when you click.</p>
        </div>
      </div>`;
    const root = el.querySelector('.dt-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, ani = 'none', snd = 'none', raf = 0;

    function reveal(k, on = true) { const r = root.querySelector(`.dt-row[data-k="${k}"]`); r.classList.toggle('open', on); r.querySelector('.dt-add').textContent = on ? '✓ Context added' : '➕ Add context'; }
    root.querySelectorAll('.dt-add').forEach((b) => b.addEventListener('click', () => reveal(+b.dataset.k, !b.closest('.dt-row').classList.contains('open'))));

    function setAni(k) {
      ani = k; const [, msg, c1, c2, lbl] = ANI[k];
      FD.segSet($('#aSeg'), k);
      $('#big').style.fill = c1; $('#small').style.fill = c2; $('#aLbl').textContent = lbl;
      $('#aMsg').className = 'verdict ' + (k === 'none' ? 'bad' : 'good');
      $('#aMsg').innerHTML = (k === 'none' ? '❓ ' : '✓ ') + msg + (k === 'none' ? ' Until the context is known, the animation <b>cannot inform</b> people.' : ' Now it <b>informs</b> people.');
    }
    $('#aSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setAni(b.dataset.v); });
    const t0 = performance.now();
    const spin = (now) => {
      if (dead) return;
      const t = ((now - t0) / 3000) * Math.PI * 2;
      $('#small').setAttribute('cx', 150 + 95 * Math.cos(t)); $('#small').setAttribute('cy', 75 + 38 * Math.sin(t));
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);

    function setSnd(k) {
      snd = k; FD.segSet($('#sSeg'), k);
      $('#sMean').innerHTML = k === 'none' ? `❓ ${SND[k][1]}` : `<b>${SND[k][0]}</b>: “${SND[k][1]}”`;
    }
    $('#sSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setSnd(b.dataset.v); });
    $('#beep').addEventListener('click', () => { FD.beep(880, 140, 'sine', 0.1); setTimeout(() => FD.beep(1320, 160, 'sine', 0.08), 160); });

    function reset() { ROWS.forEach((r, k) => reveal(k, false)); setAni('none'); setSnd('none'); }
    show('table'); reset();
    return { show, reveal, setAni, setSnd, reset, destroy() { dead = true; cancelAnimationFrame(raf); } };
  },
  steps: [
    {
      title: 'What is data?',
      text: `<p><strong>Data</strong> is raw and unprocessed numbers, text, sounds, images or animations.</p>
             <p>In this form, data is <b>meaningless</b>. Look at the left column: what does “February” or “59, 79, 81…” tell you?</p>`,
      async on(a) { a.show('table'); a.reset(); },
    },
    {
      title: 'What is information?',
      text: `<p><strong>Information</strong> is the term used to describe data after it is processed to be given <strong>context</strong> and meaning.</p>
             <p>“February” + average temperatures in Kenya = <b>the warmest month in Kenya</b>. The marks + students’ marks = <b>grades</b>.</p>`,
      tip: 'Try it: add the context to each row.',
      async on(a, ctx) { a.show('table'); a.reveal(0); if (!(await ctx.sleep(1400))) return; a.reveal(1); },
    },
    {
      title: 'Text and images need context too',
      text: `<p>“Deep Thought” only means something once you know it comes from the books of Douglas Adams.</p>
             <p>The photo looks like water, until you are told it was taken on a <b>cobbled street</b>: it is light reflecting off stone.</p>`,
      async on(a, ctx) { a.show('table'); a.reveal(0); a.reveal(1); a.reveal(2); if (!(await ctx.sleep(1400))) return; a.reveal(3); },
    },
    {
      title: 'An animation without context',
      text: `<p>Imagine an animation of a sphere circling another sphere. It could be an <b>animated logo</b> for a company, a representation of <b>the Earth circling the Sun</b>, or any number of other things.</p>
             <p>Until the context is known, the animation cannot inform people.</p>`,
      tip: 'Try it: give the animation a context.',
      async on(a, ctx) { a.show('ani'); a.setAni('none'); if (!(await ctx.sleep(1800))) return; a.setAni('logo'); if (!(await ctx.sleep(1800))) return; a.setAni('space'); },
    },
    {
      title: 'A sound without context',
      text: `<p>Similarly, the sound of a beep could be an <b>app notification</b>, an effect for a <b>game</b> or a sound used in an <b>alarm system</b>.</p>
             <p>Until the context is known, the sound is just <strong>data</strong>.</p>`,
      tip: 'Try it: play the sound, then choose a context.',
      async on(a, ctx) { a.show('snd'); a.setSnd('none'); for (const k of ['app', 'game', 'alarm']) { if (!(await ctx.sleep(1500))) return; a.setSnd(k); } },
    },
  ],
});

FD.activities({
  section: 'data',
  items: [
    {
      id: 'data-context',
      title: 'Considering context',
      task: '<p>Consider other examples of animations and sounds that may not have meaning until context is applied to make them into information. Create a table similar to Table 13.2 to contain your examples.</p>',
      fields: ['Example of data (an animation or a sound)', 'Context', 'Example of information'],
      lines: 5,
      hint: 'Add more rows here: data → context → information.',
    },
  ],
});

FD.check({
  section: 'data',
  items: [
    { type: 'mcq', q: 'What is <b>data</b>?', opts: ['Raw numbers, text, sounds, images or animations that are meaningless until processed', 'Data that has been given context and meaning', 'Only numbers stored in a spreadsheet', 'A finished digital product'], why: 'Information is data that has been processed to be given context.' },
    { type: 'mcq', q: '“59, 79, 81, 90” becomes information when you add which context?', opts: ['Students’ marks', 'A bigger font', 'A colourful background', 'A spell check'], why: 'With that context they can be turned into grades.' },
    { type: 'tf', q: 'A beep sound is information as soon as you hear it.', a: false, why: 'Until the context is known (notification, game, alarm), the sound is just data.' },
    { type: 'sort', q: 'Data or information?', bins: ['Data', 'Information'], rows: [['February', 0], ['The warmest month in Kenya', 1], ['Deep Thought', 0], ['Grades 5, 6, 7, 8, 8, 9, 9', 1]], why: 'Information has context and meaning.' },
  ],
});
