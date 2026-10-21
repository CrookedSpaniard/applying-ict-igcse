FD.add({
  id: 'fonts',
  title: 'Font styles: serif and sans serif',
  tab: 'Fonts',
  icon: 'fonts',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Serif font', 'A typeface that adds a short, flat line (a serif) to the ends of some letters, e.g. Times New Roman.'],
    ['Sans serif font', 'A typeface that does not add serifs to the ends of letters, e.g. Verdana. ‘Sans’ means ‘without’ in French.'],
    ['Aesthetics', 'The study of visual beauty, especially in art.'],
  ],
  mount(el) {
    const SERIF = '"Times New Roman", Times, Georgia, serif', SANS = 'Verdana, Geneva, "DejaVu Sans", sans-serif';
    // The letters "in" drawn as shapes so the serifs can be shown and hidden (like Figures 13.9 and 13.10).
    const GLYPH = '<circle cx="47" cy="29" r="8"/><rect x="40" y="45" width="14" height="55"/><rect x="80" y="45" width="14" height="55"/>'
      + '<path d="M94 58C100 47 110 43 118 43C132 43 140 51 140 66V100H126V68C126 60 122 56 116 56C108 56 100 61 94 70Z"/>';
    const SERIFS = [[32, 45, 14], [32, 96, 30], [72, 45, 14], [72, 96, 30], [118, 96, 30]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="1"/>`).join('');
    const LBL = [[20, 40, 33, 47], [20, 116, 36, 100], [70, 30, 76, 45], [90, 116, 86, 101], [160, 116, 146, 101]].map(([tx, ty, x2, y2]) => `<line x1="${tx + (tx < x2 ? 10 : -4)}" y1="${ty - 4}" x2="${x2}" y2="${y2}"/><text x="${tx}" y="${ty}">serif</text>`).join('');
    el.innerHTML = `
      <div class="sim fn-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="look">🔍 Serifs</button><button data-p="res">🖥️ Low-resolution screen</button><button data-p="pick">🤔 Which font?</button>
        </div>

        <div data-panel="look" class="sim">
          <div class="seg" id="fSeg"><button data-v="serif">Serif (Times New Roman)</button><button data-v="sans">Sans serif (Verdana)</button></div>
          <div class="two-col">
            <div class="sim-box fn-big"><svg viewBox="0 10 190 115" role="img" aria-label="The letters i and n, with and without serifs"><g class="fn-glyph">${GLYPH}</g><g id="serifs" class="fn-serif">${SERIFS}</g><g id="serifLbl" class="fn-lbl">${LBL}</g></svg></div>
            <div class="sim-box fn-sample" id="sample"><p class="fn-h">The quick brown fox</p><p>Serifs are the short, flat lines at the ends of some letters. Compare the two typefaces on this card.</p></div>
          </div>
          <p class="verdict" id="fMsg"></p>
        </div>

        <div data-panel="res" class="sim" hidden>
          <label class="rng">Screen resolution <input type="range" id="res" min="9" max="40" value="11"><b id="resV"></b></label>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Serif</h5><canvas id="cSerif" width="360" height="110"></canvas></div>
            <div class="sim-box"><h5 class="mw-h">Sans serif</h5><canvas id="cSans" width="360" height="110"></canvas></div>
          </div>
          <p class="verdict" id="resMsg"></p>
        </div>

        <div data-panel="pick" class="sim" hidden>
          <div class="fn-cases" id="cases"></div>
          <p class="note">🔑 <b>Key point:</b> for higher-resolution screens and for print, the choice is often made on the basis of <b>aesthetics</b>. Some people consider sans serif fonts more <b>accessible</b>, especially for people with visual impairments or learning difficulties that affect their reading.</p>
        </div>
      </div>`;
    const root = el.querySelector('.fn-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    function font(k) {
      FD.segSet($('#fSeg'), k);
      const serif = k === 'serif';
      $('#serifs').style.opacity = serif ? 1 : 0;
      $('#serifLbl').style.opacity = serif ? 1 : 0;
      $('#sample').style.fontFamily = serif ? SERIF : SANS;
      $('#fMsg').className = 'verdict';
      $('#fMsg').innerHTML = serif ? 'A <b>serif</b> font adds a short, flat line, known as a <b>serif</b>, to the ends of some letters.' : 'A <b>sans serif</b> font does not add serifs. The word ‘sans’ means ‘without’ in French.';
    }
    $('#fSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) font(b.dataset.v); });

    // Draw a word at a tiny pixel height, then scale it up without smoothing, like a low-resolution screen.
    function render(canvas, family, px) {
      const w = Math.round(px * 6.2), h = Math.round(px * 1.7);
      const buf = document.createElement('canvas'); buf.width = w; buf.height = h;
      const c = buf.getContext('2d');
      c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#111'; c.font = `${px}px ${family}`; c.textBaseline = 'middle';
      c.fillText('Reading', Math.round(px * 0.3), h / 2);
      const out = canvas.getContext('2d');
      out.imageSmoothingEnabled = false;
      out.fillStyle = '#fff'; out.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / w, canvas.height / h);
      out.drawImage(buf, (canvas.width - w * scale) / 2, (canvas.height - h * scale) / 2, w * scale, h * scale);
    }
    function res(v) {
      v = +v; $('#res').value = v;
      render($('#cSerif'), SERIF, v); render($('#cSans'), SANS, v);
      $('#resV').textContent = v < 14 ? 'low' : v < 26 ? 'medium' : 'high';
      $('#resMsg').className = 'verdict ' + (v < 14 ? 'bad' : 'good');
      $('#resMsg').innerHTML = v < 14 ? '✗ A low-resolution screen cannot show the detail of the serifs: they turn into blobs and the text is harder to read. The sans serif word stays clearer.' : '✓ As screen resolution improves, it is less likely that serif fonts will cause this problem.';
    }
    $('#res').addEventListener('input', (e) => res(e.target.value));

    const CASES = [
      ['📖 A printed novel', 'serif', 'Serif fonts are often used in printed media such as books and newspapers. Some say the serifs guide the reader’s eye from one letter to the next (others challenge this).'],
      ['⌚ Text on a small, low-resolution smartwatch screen', 'sans', 'Sans serif: a low-resolution screen may not be able to show the detail of serif fonts.'],
      ['🧑‍🦯 A website for readers with visual impairments', 'sans', 'Some people consider sans serif fonts more accessible for people with visual impairments or reading difficulties.'],
      ['📰 A printed newspaper', 'serif', 'Printed media such as newspapers often use serif fonts.'],
    ];
    $('#cases').innerHTML = CASES.map(([t], i) => `<div class="sim-box fn-case" data-i="${i}"><p><b>${t}</b></p><div class="seg"><button data-v="serif" style="font-family:${SERIF.replace(/"/g, '&quot;')}">Serif</button><button data-v="sans" style="font-family:${SANS.replace(/"/g, '&quot;')}">Sans serif</button></div><p class="note"></p></div>`).join('');
    function pick(i, v) {
      const box = root.querySelector(`.fn-case[data-i="${i}"]`), [, want, why] = CASES[i];
      FD.segSet(box.querySelector('.seg'), v);
      const n = box.querySelector('.note');
      n.className = 'note ' + (v === want ? 'good-t' : 'bad-t');
      n.innerHTML = (v === want ? '✓ ' : '✗ Better: ' + (want === 'serif' ? 'serif. ' : 'sans serif. ')) + why;
    }
    $('#cases').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) pick(+b.closest('.fn-case').dataset.i, b.dataset.v); });

    function reset() { font('serif'); res(11); root.querySelectorAll('.fn-case').forEach((b) => { FD.segSet(b.querySelector('.seg'), ''); b.querySelector('.note').innerHTML = ''; }); }
    show('look'); reset();
    return { show, font, res, pick, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Serif fonts',
      text: `<p>There are two main font styles: <b>serif</b> and <b>sans serif</b>.</p>
             <p>A <strong>serif font</strong> adds a short, flat line, known as a <b>serif</b>, to the ends of some letters (Figure 13.9). Times New Roman is a serif font.</p>`,
      async on(a) { a.reset(); a.show('look'); a.font('serif'); },
    },
    {
      title: 'Serif fonts in print',
      text: `<p>Serif fonts are often used in <b>printed media</b>, such as books and newspapers.</p>
             <p>Some people say they are easier to read on a printed page because the serifs <b>guide the reader’s eye</b> from one letter to the next. However, this point of view has been challenged by others.</p>`,
      async on(a) { a.show('look'); a.font('serif'); },
    },
    {
      title: 'Sans serif fonts',
      text: `<p>A <strong>sans serif font</strong> does not add serifs to the ends of letters. ‘Sans’ means ‘without’ in French. Verdana is a sans serif font (Figure 13.10).</p>
             <p>Sans serif fonts are often used in <b>digital products</b>.</p>`,
      tip: 'Try it: switch between the two fonts.',
      async on(a, ctx) { a.show('look'); a.font('serif'); if (!(await ctx.sleep(1300))) return; a.font('sans'); },
    },
    {
      title: 'Low-resolution screens',
      text: `<p>Digital products may have to be read on devices with <b>lower resolution screens</b>. A low-resolution screen may not be able to show the detail of serif fonts, which makes the text more difficult to read.</p>
             <p>As screen resolution improves, this problem becomes less likely.</p>`,
      tip: 'Try it: drag the resolution slider.',
      async on(a, ctx) { a.show('res'); a.res(10); if (!(await ctx.sleep(1500))) return; await FD.tween(2200, (t) => a.res(Math.round(10 + 28 * t))); },
    },
    {
      title: 'Aesthetics and accessibility',
      text: `<p>For higher-resolution screens and for print, the choice between serif and sans serif is often made on the basis of <strong>aesthetics</strong> (visual beauty).</p>
             <p>However, some people consider sans serif fonts to be more <b>accessible</b>, especially for people with visual impairments or learning difficulties that affect their reading.</p>`,
      tip: 'Try it: choose a font for each product.',
      async on(a, ctx) { a.show('pick'); a.pick(0, 'serif'); if (!(await ctx.sleep(1500))) return; a.pick(1, 'sans'); },
    },
  ],
});

FD.check({
  section: 'fonts',
  items: [
    { type: 'mcq', q: 'What is a <b>serif</b>?', opts: ['A short, flat line added to the ends of some letters', 'A type of bold text', 'The space between lines', 'A font that is always large'], why: 'Times New Roman is a serif font.' },
    { type: 'sort', q: 'Serif or sans serif?', bins: ['Serif', 'Sans serif'], rows: [['Times New Roman', 0], ['Verdana', 1], ['Often used in books and newspapers', 0], ['Often used in digital products', 1]], why: '‘Sans’ means ‘without’ in French.' },
    { type: 'mcq', q: 'Why can serif fonts be a problem on a low-resolution screen?', opts: ['The screen may not show the detail of the serifs, so text is harder to read', 'Serif fonts use more battery', 'Serif fonts cannot be printed', 'Serif fonts are always too small'], why: 'As resolution improves, this becomes less likely.' },
  ],
});
