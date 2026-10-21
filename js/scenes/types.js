FD.add({
  id: 'types',
  title: 'Different types of data',
  tab: 'Data types',
  icon: 'types',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Characters', 'The letters and symbols used to write text.'],
    ['Alphanumeric', 'Containing both letters and numbers.'],
    ['Metaphor', 'A figure of speech in which two things that are not literally similar are equated with one another.'],
    ['Semiotics', 'The interpretation of signs and symbols.'],
  ],
  mount(el) {
    const T = {
      text: ['🔤', 'Text', 'Characters', 'The syntax that is used', 'Words, email addresses, product codes, postal codes'],
      num: ['🔢', 'Numbers', 'Integers, decimals, currency, percentages', 'Graphs, charts', 'To perform calculations'],
      img: ['🖼️', 'Images', 'Bitmap graphics, vector graphics', 'The surrounding information, informative text within the image, metaphor and semiotics', 'Logos, photographs'],
      ani: ['🎞️', 'Animation', 'SWF files (‘Flash’ files) and animated GIF files', 'Storytelling techniques, surrounding information, informative text within the animation', 'Web banners and other digital adverts'],
      snd: ['🔊', 'Sound', 'A waveform of sound data (Figure 13.1)', 'A digital-to-analogue converter on a sound card and a speaker; sometimes extra text, video or images', 'Music, speech'],
    };
    const NUMS = [['Integer', '42'], ['Decimal', '3.75'], ['Currency', '£12.50'], ['Percentage', '85%']];
    // a sound wave like Figure 13.1
    const wave = (seed) => { let d = 'M0 40'; for (let x = 0; x <= 300; x += 3) { const env = Math.max(0, Math.sin((x / 300) * Math.PI * 3 + seed)) ** 2; d += ` L${x} ${40 + Math.sin(x * 0.9 + seed) * 34 * env * (0.4 + 0.6 * Math.abs(Math.sin(x * 0.13)))}`; } return d; };
    el.innerHTML = `
      <div class="sim ty-s">
        <div class="ptabs" role="group" aria-label="Types of data">${Object.entries(T).map(([k, v]) => `<button data-p="${k}">${v[0]} ${v[1]}</button>`).join('')}</div>
        <div class="ty-facts" id="facts"></div>

        <div data-panel="text" class="sim">
          <div class="sim-box"><label class="ty-in">Type some characters <input id="txt" value="tom@school.org" spellcheck="false" autocomplete="off"></label>
            <div class="chips" id="txtEx"><button class="mini-btn" data-t="tom@school.org">tom@school.org</button><button class="mini-btn" data-t="SW1A 1AA">SW1A 1AA</button><button class="mini-btn" data-t="PX-40917">PX-40917</button><button class="mini-btn" data-t="keyboard">keyboard</button></div>
            <p class="verdict" id="txtMsg"></p></div>
        </div>

        <div data-panel="num" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Numeric data</h5>
              <table class="tbl ty-num"><tbody>${NUMS.map(([k, v]) => `<tr><th>${k}</th><td class="mono">${v}</td></tr>`).join('')}</tbody></table>
              <label class="ty-in">Enter a number of tickets <input id="numIn" value="12" inputmode="decimal" autocomplete="off"></label>
              <p class="verdict" id="numMsg"></p></div>
            <div class="sim-box"><h5 class="mw-h">Meaning from a chart</h5>
              <p class="note mono">Tickets sold: 12, 30, 18, 42</p>
              <button class="btn" id="bChart">📊 Draw a chart</button>
              <svg viewBox="0 0 220 110" id="chart" role="img" aria-label="Bar chart of tickets sold"></svg></div>
          </div>
          <p class="note">🔑 <b>Key point:</b> text data can contain numbers but numeric data cannot contain text. Text data is therefore sometimes called <b>alphanumeric</b> data.</p>
        </div>

        <div data-panel="img" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box ty-sign"><svg viewBox="0 0 160 120" role="img" aria-label="A road sign">
              <polygon points="80,10 150,110 10,110" fill="#fff" stroke="#c92a2a" stroke-width="9" stroke-linejoin="round"/>
              <g id="kids"><circle cx="66" cy="54" r="7" fill="#18243b"/><path d="M66 62 l-8 26 M66 62 l6 24 M66 66 l-10 8 M66 66 l12 6" stroke="#18243b" stroke-width="5" stroke-linecap="round"/><circle cx="96" cy="62" r="6" fill="#18243b"/><path d="M96 69 l-6 20 M96 69 l5 19 M96 72 l-9 6" stroke="#18243b" stroke-width="4.5" stroke-linecap="round"/></g>
            </svg><p class="ty-cap" id="cap" hidden>⚠️ School ahead: slow down</p></div>
            <div class="sim-box"><h5 class="mw-h">Ways to give an image meaning</h5>
              <div class="seg" id="imgSeg"><button data-v="sem">Semiotics</button><button data-v="txt">Informative text</button><button data-v="sur">Surrounding information</button></div>
              <p class="note" id="imgMsg"></p></div>
          </div>
        </div>

        <div data-panel="ani" class="sim" hidden>
          <div class="sim-box ty-ani">
            <div class="ty-banner" id="banner"><span id="frameTxt"></span></div>
            <div class="ty-frames" id="frames"></div>
            <label class="tgl"><input type="checkbox" id="play" checked> Play the animated GIF</label>
          </div>
          <p class="note">💡 <b>Hint:</b> GIFs can also be static. Animated GIFs are a special type of GIF that contain <b>frames</b>.</p>
        </div>

        <div data-panel="snd" class="sim" hidden>
          <div class="sim-box ty-snd">
            <svg viewBox="0 0 300 80" class="ty-wave" role="img" aria-label="Sound data shown as image data"><rect width="300" height="80" rx="6" class="ty-wbg"/><path d="${wave(0.4)}" class="ty-w"/><rect id="ph" x="0" y="0" width="2" height="80" class="ty-ph"/></svg>
            <div class="ty-chain"><span>💾 Sound data</span><b>→</b><span>🔌 DAC on a sound card</span><b>→</b><span>🔈 Speaker</span></div>
            <button class="btn primary" id="bSnd">▶ Play it</button>
          </div>
          <div class="two-col">
            <div class="sim-box"><svg viewBox="0 0 300 80" class="ty-wave sm"><path d="${wave(1.1)}" class="ty-w"/></svg><p class="note" id="s1">❓ Sound A</p></div>
            <div class="sim-box"><svg viewBox="0 0 300 80" class="ty-wave sm"><path d="${wave(1.15)}" class="ty-w"/></svg><p class="note" id="s2">❓ Sound B</p></div>
          </div>
          <button class="btn ghost" id="bLbl">🏷️ Add text to the two similar sounds</button>
        </div>
      </div>`;
    const root = el.querySelector('.ty-s'), $ = (s) => root.querySelector(s);
    let dead = false, fr = 0, timer = 0;
    const show = FD.panels(root, (p) => {
      const [e, n, ex, how, use] = T[p];
      $('#facts').innerHTML = `<div class="ty-f"><small>Examples of ${n.toLowerCase()} data</small><b>${ex}</b></div><div class="ty-f"><small>How to produce meaning</small><b>${how}</b></div><div class="ty-f"><small>Uses</small><b>${use}</b></div>`;
    });

    function classify(v) {
      const s = v.trim(); let what;
      if (!s) what = ['bad', 'Type something.'];
      else if (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s)) what = ['good', '📧 The syntax <b>name@domain</b> tells us this is an <b>email address</b>.'];
      else if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(s)) what = ['good', '📮 The syntax (letters, numbers, a space, number, two letters) tells us this is a <b>postal code</b>.'];
      else if (/^[A-Z]{2,3}-\d{3,6}$/i.test(s)) what = ['good', '🏷️ The syntax (letters, a dash, numbers) tells us this is a <b>product code</b>.'];
      else if (/^[a-z]+$/i.test(s)) what = ['good', '📝 A sequence of letters: a <b>word</b>.'];
      else what = ['', 'Just characters. Without a known syntax, they have no clear meaning.'];
      const alnum = /\d/.test(s) && /[a-z]/i.test(s);
      $('#txtMsg').className = 'verdict ' + what[0];
      $('#txtMsg').innerHTML = what[1] + (alnum ? ' It contains letters <i>and</i> numbers: it is <b>alphanumeric</b>.' : '');
    }
    function setText(v) { $('#txt').value = v; classify(v); }
    $('#txt').addEventListener('input', (e) => classify(e.target.value));
    $('#txtEx').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) setText(b.dataset.t); });

    function checkNum(v) {
      const ok = /^-?\d+(\.\d+)?$/.test(v.trim());
      $('#numMsg').className = 'verdict ' + (ok ? 'good' : 'bad');
      $('#numMsg').innerHTML = ok ? `✓ Numeric data: 12 tickets × £2.50 = <b>£${(parseFloat(v) * 2.5).toFixed(2)}</b>. Numbers can be used to <b>perform calculations</b>.` : '✗ This is not numeric data: it contains text, so the spreadsheet cannot calculate with it.';
    }
    function setNum(v) { $('#numIn').value = v; checkNum(v); }
    $('#numIn').addEventListener('input', (e) => checkNum(e.target.value));
    async function chart() {
      const V = [12, 30, 18, 42], L = ['Mon', 'Tue', 'Wed', 'Thu'];
      $('#chart').innerHTML = `<line x1="24" y1="92" x2="214" y2="92" class="ty-ax"/>` + V.map((v, i) => `<rect x="${36 + i * 45}" y="92" width="30" height="0" class="ty-bar" data-h="${v * 1.9}"/><text x="${51 + i * 45}" y="106" class="svg-lbl svg-sm">${L[i]}</text><text x="${51 + i * 45}" y="${86 - v * 1.9}" class="svg-lbl svg-sm ty-v" opacity="0">${v}</text>`).join('');
      const bars = [...$('#chart').querySelectorAll('.ty-bar')], vals = [...$('#chart').querySelectorAll('.ty-v')];
      await FD.tween(800, (t) => bars.forEach((b) => { const h = +b.dataset.h * t; b.setAttribute('height', h); b.setAttribute('y', 92 - h); }));
      vals.forEach((v) => v.setAttribute('opacity', 1));
    }
    $('#bChart').addEventListener('click', chart);

    const IMG = {
      sem: ['A red triangle is a <b>sign</b> that means “warning”. Reading signs and symbols like this is called <b>semiotics</b>.', false],
      txt: ['<b>Informative text</b> within the image makes the meaning clear.', true],
      sur: ['The <b>surrounding information</b> helps too: this sign is next to a page about a road outside a school.', true],
    };
    function img(k) { FD.segSet($('#imgSeg'), k); $('#cap').hidden = !IMG[k][1]; $('#imgMsg').innerHTML = IMG[k][0]; }
    $('#imgSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) img(b.dataset.v); });

    const FR = [['☀️', 'Summer sale!'], ['👟', 'Trainers −30%'], ['🛒', 'Shop now ▶']];
    $('#frames').innerHTML = FR.map(([e, t], i) => `<button class="ty-fr" data-i="${i}"><span>${e}</span>${t}<small>Frame ${i + 1}</small></button>`).join('');
    function frame(i) { fr = i % FR.length; $('#frameTxt').innerHTML = `${FR[fr][0]} ${FR[fr][1]}`; root.querySelectorAll('.ty-fr').forEach((b) => b.classList.toggle('on', +b.dataset.i === fr)); }
    function loop() { clearTimeout(timer); if (dead || !$('#play').checked) return; frame(fr + 1); timer = setTimeout(loop, 1100); }
    $('#play').addEventListener('change', loop);
    $('#frames').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { $('#play').checked = false; frame(+b.dataset.i); } });

    async function playSnd(sound) {
      if (sound) { [523, 659, 784, 659, 523].forEach((f, i) => setTimeout(() => FD.beep(f, 180, 'triangle', 0.08), i * 200)); }
      await FD.tween(1100, (t) => { if (!dead) $('#ph').setAttribute('x', 298 * t); });
    }
    $('#bSnd').addEventListener('click', () => playSnd(true));
    function labels(on) { $('#s1').innerHTML = on ? '🔔 Sound A: <b>doorbell</b>' : '❓ Sound A'; $('#s2').innerHTML = on ? '📟 Sound B: <b>microwave finished</b>' : '❓ Sound B'; }
    $('#bLbl').addEventListener('click', () => labels(true));

    function reset() { setText('tom@school.org'); setNum('12'); $('#chart').innerHTML = ''; img('sem'); frame(0); $('#play').checked = true; labels(false); }
    show('text'); reset(); timer = setTimeout(loop, 1100);
    return { show, setText, setNum, chart, img, frame, playSnd, labels, reset, destroy() { dead = true; clearTimeout(timer); } };
  },
  steps: [
    {
      title: 'Data comes in different forms',
      text: `<p>Data may come in different forms: <b>text</b>, <b>numbers</b>, <b>images</b>, <b>animation</b> and <b>sound</b>.</p>
             <p>For each one you need to know an example, a way to produce meaning from it, and what it is used for.</p>`,
      async on(a) { a.reset(); a.show('text'); },
    },
    {
      title: 'Text',
      text: `<p>Text data is made of <strong>characters</strong>: the letters and symbols used to write text.</p>
             <p>The <b>syntax</b> (the way the characters are arranged) produces meaning. Text is used for words, email addresses, product codes and postal codes.</p>`,
      tip: 'Try it: type your own text and see what the syntax tells you.',
      async on(a, ctx) { a.show('text'); for (const t of ['tom@school.org', 'SW1A 1AA', 'PX-40917']) { a.setText(t); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'Numbers',
      text: `<p>Numeric data includes integers, decimals, currency and percentages. It is used to <b>perform calculations</b>, and graphs and charts produce meaning from it.</p>
             <p><b>Key point:</b> text can contain numbers, but numeric data cannot contain text. Text data is therefore sometimes called <strong>alphanumeric</strong>.</p>`,
      tip: 'Try it: type “12a” in the number box.',
      async on(a, ctx) { a.show('num'); a.setNum('12'); await a.chart(); if (!(await ctx.sleep(1500))) return; a.setNum('12a'); },
    },
    {
      title: 'Images',
      text: `<p>Image data can be <b>bitmap</b> or <b>vector</b> graphics, used for logos and photographs.</p>
             <p>Meaning comes from the <b>surrounding information</b> (the rest of the page), <b>informative text</b> within the image, <strong>metaphor</strong> and <strong>semiotics</strong> (the interpretation of signs and symbols).</p>`,
      async on(a, ctx) { a.show('img'); for (const k of ['sem', 'txt', 'sur']) { a.img(k); if (!(await ctx.sleep(1700))) return; } },
    },
    {
      title: 'Animation',
      text: `<p>Animation data includes <b>SWF files</b> (commonly known as ‘Flash’ files) and <b>animated GIF</b> files, used for web banners and other digital adverts.</p>
             <p>Meaning comes from <b>storytelling</b>, surrounding information and informative text within the animation.</p>`,
      tip: 'Try it: stop the GIF and click each frame.',
      async on(a) { a.show('ani'); },
    },
    {
      title: 'Sound',
      text: `<p>Sound data (shown here as an image, like Figure 13.1) is used for <b>music</b> and <b>speech</b>. It is processed through a <b>digital-to-analogue converter</b> on a sound card and played through a speaker.</p>
             <p>Some sounds are similar to one another, so extra data such as <b>text, video or images</b> may be needed to produce meaning.</p>`,
      tip: 'Try it: play the sound, then label the two similar sounds.',
      async on(a, ctx) { a.show('snd'); a.labels(false); await a.playSnd(false); if (!(await ctx.sleep(1200))) return; a.labels(true); },
    },
  ],
});

FD.check({
  section: 'types',
  items: [
    { type: 'mcq', q: 'Which type of data is used to <b>perform calculations</b>?', opts: ['Numeric data', 'Text data', 'Sound data', 'Animation data'], why: 'Integers, decimals, currency and percentages.' },
    { type: 'mcq', q: 'What does <b>alphanumeric</b> mean?', opts: ['Containing both letters and numbers', 'Containing only numbers', 'A sound with letters', 'A picture of the alphabet'], why: 'Text data can contain numbers, so it is sometimes called alphanumeric.' },
    { type: 'sort', q: 'Which type of data is each example?', bins: ['Text', 'Numbers', 'Images', 'Animation', 'Sound'], rows: [['A postal code', 0], ['A percentage', 1], ['A company logo', 2], ['A web banner advert (GIF)', 3], ['A piece of music', 4]], why: 'See the uses of each data type on pages 184–185.' },
    { type: 'mcq', q: 'What is <b>semiotics</b>?', opts: ['The interpretation of signs and symbols', 'A type of sound file', 'Converting digital data to analogue', 'A spreadsheet function'], why: 'It is one way to produce meaning from image data.' },
  ],
});
