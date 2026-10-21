FD.add({
  id: 'access',
  title: 'Contrast and accessibility',
  tab: 'Accessibility',
  icon: 'access',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Contrast', 'The degree of difference between the light and dark parts of an image.'],
    ['Colour-blind', 'Unable to see the difference between all or some colours.'],
    ['Distinguish', 'Recognise the difference or differences between two things.'],
    ['Protanopia', 'A type of colour-blindness in which reds are seen as dark, dull colours.'],
  ],
  mount(el) {
    const SW = ['#FFFFFF', '#FFF59D', '#FFE066', '#2D7A60', '#43A047', '#D32F2F', '#2156A5', '#202D4A', '#000000'];
    const NM = { '#FFFFFF': 'white', '#FFF59D': 'light yellow', '#FFE066': 'yellow', '#2D7A60': 'dark green', '#43A047': 'green', '#D32F2F': 'red', '#2156A5': 'blue', '#202D4A': 'navy', '#000000': 'black' };
    const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const M = {
      none: null,
      prot: '0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0',
      deut: '0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0',
      trit: '1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0',
    };
    const PAL = ['#4A0A2A', '#A01C22', '#F26B2A', '#E84A24', '#123C4A'];
    el.innerHTML = `
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        ${Object.entries(M).filter(([, v]) => v).map(([k, v]) => `<filter id="cb-${k}"><feColorMatrix type="matrix" values="${v}"/></filter>`).join('')}
      </defs></svg>
      <div class="sim ac-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="con">🌓 Contrast</button><button data-p="cb">👁️ Colour-blindness</button><button data-p="ps">🔎 Partial sight</button>
        </div>

        <div data-panel="con" class="sim">
          <div class="ac-preview" id="prev"><p class="ac-h">Red and green should never be seen</p><p>Can you read this text clearly?</p></div>
          <div class="two-col">
            <div><p class="seg-l">Text colour</p><div class="ac-sws" id="fg">${SW.map((c) => `<button style="--c:${c}" data-c="${c}" title="${NM[c]}" aria-label="${NM[c]}"></button>`).join('')}</div></div>
            <div><p class="seg-l">Background</p><div class="ac-sws" id="bg">${SW.map((c) => `<button style="--c:${c}" data-c="${c}" title="${NM[c]}" aria-label="${NM[c]}"></button>`).join('')}</div></div>
          </div>
          <div class="readout"><div class="ro" id="roR"><small>Contrast ratio</small><b id="rat"></b></div></div>
          <p class="verdict" id="cMsg"></p>
        </div>

        <div data-panel="cb" class="sim" hidden>
          <div class="seg" id="cbSeg"><button data-v="none">Normal colour vision</button><button data-v="prot">Protanopia</button><button data-v="deut">Deuteranopia</button><button data-v="trit">Tritanopia</button></div>
          <div class="ac-cb" id="cbArea">
            <div class="ac-pal">${PAL.map((c) => `<i style="background:${c}"></i>`).join('')}</div>
            <div class="ac-banner">Red and green should never be seen</div>
            <div class="two-col">
              <div class="sim-box ac-key"><h5 class="mw-h">Team results (colour only)</h5><p><i style="background:#43A047"></i> Win <i style="background:#D32F2F"></i> Loss</p><div class="ac-dots">${'WLWWLLWL'.split('').map((r) => `<span style="background:${r === 'W' ? '#43A047' : '#D32F2F'}"></span>`).join('')}</div></div>
              <div class="sim-box ac-key"><h5 class="mw-h">Team results (colour + symbols)</h5><p>✓ Win ✗ Loss</p><div class="ac-dots sym">${'WLWWLLWL'.split('').map((r) => `<span style="background:${r === 'W' ? '#2156A5' : '#F7941D'}">${r === 'W' ? '✓' : '✗'}</span>`).join('')}</div></div>
            </div>
          </div>
          <p class="verdict" id="cbMsg"></p>
        </div>

        <div data-panel="ps" class="sim" hidden>
          <label class="rng">Blurred vision <input type="range" id="blur" min="0" max="4" step="0.5" value="0"><b id="blurV"></b></label>
          <label class="tgl"><input type="checkbox" id="big"> Larger text and stronger contrast</label>
          <div class="ac-ps" id="ps"><h4>Swimming timetable</h4><p class="ac-small">Lane swimming: Monday to Friday, 06:30–08:30. Family swim: Saturday 10:00–12:00.</p></div>
          <p class="note">This is a rough idea only. Find out more in the activity “Accessibility of digital products”.</p>
        </div>
      </div>`;
    const root = el.querySelector('.ac-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let fg = '#FFF59D', bg = '#FFFFFF';

    function colours(f, b) {
      if (f) fg = f; if (b) bg = b;
      $('#prev').style.color = fg; $('#prev').style.background = bg;
      root.querySelectorAll('#fg button').forEach((x) => x.classList.toggle('on', x.dataset.c === fg));
      root.querySelectorAll('#bg button').forEach((x) => x.classList.toggle('on', x.dataset.c === bg));
      const r = ratio(fg, bg), rg = (NM[fg].includes('green') && NM[bg] === 'red') || (NM[fg] === 'red' && NM[bg].includes('green'));
      $('#rat').textContent = r.toFixed(1) + ' : 1';
      const good = r >= 4.5 && !rg;
      $('#roR').className = 'ro ' + (good ? 'good' : 'bad');
      $('#cMsg').className = 'verdict ' + (good ? 'good' : 'bad');
      $('#cMsg').innerHTML = rg ? '✗ Red and green together: many people with colour-blindness <b>cannot distinguish</b> between them.'
        : r < 1.6 ? `✗ ${NM[fg]} on ${NM[bg]}: almost no <b>contrast</b>. It may not be visible at all to some people.`
          : r < 4.5 ? `✗ ${NM[fg]} on ${NM[bg]}: not enough contrast to read clearly.`
            : `✓ ${NM[fg]} on ${NM[bg]}: enough contrast, so the text can be read clearly.`;
    }
    $('#fg').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) colours(b.dataset.c); });
    $('#bg').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) colours(null, b.dataset.c); });

    const CB = {
      none: 'Normal colour vision: the colours as the designer intended.',
      prot: '<b>Protanopia</b>: reds look dark and dull, and red and green look very alike (like the bottom row of Figure 13.17).',
      deut: '<b>Deuteranopia</b>: greens and reds are confused. The colour-only key no longer works; the symbols still do.',
      trit: '<b>Tritanopia</b>: blues and yellows are confused. Check what people with each type will see.',
    };
    function cb(k) { FD.segSet($('#cbSeg'), k); $('#cbArea').style.filter = M[k] ? `url(#cb-${k})` : ''; $('#cbMsg').className = 'verdict' + (k === 'none' ? '' : ' bad'); $('#cbMsg').innerHTML = CB[k]; }
    $('#cbSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) cb(b.dataset.v); });

    function sight(v, big) {
      if (v != null) $('#blur').value = v; if (big != null) $('#big').checked = big;
      const b = +$('#blur').value;
      $('#ps').style.filter = b ? `blur(${b}px)` : ''; $('#ps').classList.toggle('big', $('#big').checked);
      $('#blurV').textContent = b ? b + ' px' : 'none';
    }
    $('#blur').addEventListener('input', () => sight()); $('#big').addEventListener('change', () => sight());

    function reset() { colours('#FFF59D', '#FFFFFF'); cb('none'); sight(0, false); }
    show('con'); reset();
    return { show, colours, cb, sight, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Contrast',
      text: `<p>If two or more objects appear together, such as text on a background, the colours must be suitable so the objects can be seen or read clearly. There must be enough <strong>contrast</strong> between them.</p>
             <p>Light yellow text on a white background is difficult to see, and may not be visible at all to some people.</p>`,
      tip: 'Try it: choose text and background colours.',
      async on(a, ctx) { a.reset(); a.show('con'); if (!(await ctx.sleep(1800))) return; a.colours('#202D4A', '#FFFFFF'); },
    },
    {
      title: 'Red and green should never be seen',
      text: `<p>Some colours do not work well together. <b>Red and green</b> should not be used together because people with many types of colour-blindness cannot <strong>distinguish</strong> between them (Figure 13.16).</p>
             <p><b>Key point:</b> take care when choosing colours for objects that appear on colourful areas of a layout.</p>`,
      async on(a) { a.show('con'); a.colours('#D32F2F', '#43A047'); },
    },
    {
      title: 'Accessibility and colour-blindness',
      text: `<p>Many people have sight-related conditions that affect their ability to read the information in your digital products. One example is <strong>colour-blindness</strong>.</p>
             <p>There are many types. Figure 13.17 shows <b>protanopia</b>: the colours someone without colour-blindness sees, and how they look to someone with protanopia.</p>`,
      tip: 'Try it: switch between the types of colour vision.',
      async on(a, ctx) { a.show('cb'); a.cb('none'); if (!(await ctx.sleep(1600))) return; a.cb('prot'); },
    },
    {
      title: 'Check what users will see',
      text: `<p>Some people see colours differently from the way you intended, so it is important to <b>check what they will see</b> and make sure they can get all of the necessary information.</p>
             <p>Look at the two keys: the one that only uses red and green fails; the one with symbols still works.</p>`,
      async on(a, ctx) { a.show('cb'); for (const k of ['deut', 'trit', 'prot']) { a.cb(k); if (!(await ctx.sleep(1600))) return; } },
    },
    {
      title: 'Other conditions',
      text: `<p>Other conditions also affect the accessibility of a design, such as <b>partial-sightedness</b>.</p>
             <p>In the activity, you will find out about partial-sightedness and the accessibility needs of people with this condition.</p>`,
      tip: 'Try it: blur the text, then tick “Larger text and stronger contrast”.',
      async on(a, ctx) { a.show('ps'); a.sight(2.5, false); if (!(await ctx.sleep(1800))) return; a.sight(2.5, true); },
    },
  ],
});

FD.activities({
  section: 'access',
  items: [
    {
      id: 'access-partial',
      title: 'Accessibility of digital products',
      task: '<p>Other conditions also affect the accessibility of a design, such as partial-sightedness. Find out about partial-sightedness and the accessibility needs of people with this condition.</p>',
      fields: ['What is partial-sightedness?'],
      lines: 6,
      hint: 'List the accessibility needs, and how a designer could meet each one.',
    },
  ],
});

FD.check({
  section: 'access',
  items: [
    { type: 'mcq', q: 'Why should <b>red and green</b> not be used together?', opts: ['People with many types of colour-blindness cannot distinguish between them', 'They are too expensive to print', 'They are analogous colours', 'Screens cannot show them'], why: '“Red and green should never be seen.”' },
    { type: 'mcq', q: 'Light yellow text on a white background is a problem because…', opts: ['there is not enough contrast', 'yellow is a serif colour', 'the file is too big', 'it is greyscale'], why: 'It may not be visible at all to some people.' },
    { type: 'mcq', q: 'What is <b>protanopia</b>?', opts: ['A type of colour-blindness', 'A type of font', 'A colour scheme', 'A spell-checking tool'], why: 'Figure 13.17 shows its effects.' },
    { type: 'tf', q: 'Using symbols or text as well as colour helps people who are colour-blind.', a: true, why: 'Check that everyone can see all of the necessary information.' },
  ],
});
