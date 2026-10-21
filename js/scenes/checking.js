FD.add({
  id: 'checking',
  title: 'Checking content',
  tab: 'Checking',
  icon: 'checking',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Spelling and grammar checker', 'An automatic tool that indicates spelling and grammar errors, as you type or when you run it manually.'],
    ['Contextual error', 'A word that is spelled correctly but is not used in the correct context, e.g. ‘there’ instead of ‘their’.'],
    ['Proofreading', 'Reading your own work carefully to find and correct errors.'],
  ],
  mount(el) {
    // Each word: [text, flag?]. A flag = { k: 'sp' | 'gr', only: 'US'?, sug: [...], why }
    const DOC = [
      ['I'], ['were', { k: 'gr', sug: ['was'], why: 'Resolve subject–verb disagreement' }], ['walking'], ['to'], ['the'], ['park'], ['to'], ['see'],
      ['there', { k: 'gr', sug: ['their'], why: 'Contextual error: this word is spelled correctly but used in the wrong context' }], ['new'],
      ['aluminium', { k: 'sp', only: 'US', sug: ['aluminum', 'aluminums'], why: 'Not in the English (US) dictionary' }], ['sculpture.'],
      ['The'], ['speling', { k: 'sp', sug: ['spelling', 'spieling', 'spilling'], why: 'Spelling' }], ['on'], ['the'], ['sign'], ['was'], ['wrong'], ['and'], ['the'],
      ['colour', { k: 'sp', only: 'US', sug: ['color'], why: 'Not in the English (US) dictionary' }], ['was'], ['too'], ['dark.'],
      ['Siobhan', { k: 'sp', sug: ['Sobbing', 'Siobhán'], why: 'Not in the dictionary: names often are not' }], ['loved'], ['it.'],
    ];
    const PROOF = 'The hole class will visit the museum on Friday. Please bring you lunch and a coat. The coach leaves form the school at 9:00 and returns at 15:00 on Thursday.'.split(' ');
    const ERR = { 1: ['hole', 'whole'], 11: ['you', 'your'], 19: ['form', 'from'], 29: ['Thursday.', 'Friday. (the trip is on Friday)'] };
    el.innerHTML = `
      <div class="sim ck-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="tool">🧰 Spelling and grammar checker</button><button data-p="proof">👀 Proofreading</button>
        </div>
        <div data-panel="tool" class="sim">
          <div class="win ck-win">
            <div class="win-bar">Report.docx <span class="ck-lang">Language: <span class="seg" id="lang"><button data-v="UK">English (UK)</button><button data-v="US">English (US)</button></span></span></div>
            <div class="win-body"><div class="ck-doc" id="doc"></div><div class="ck-menu" id="menu" hidden></div></div>
          </div>
          <div class="chk-btns"><button class="btn" id="bRun">✔️ Run spelling and grammar check</button><span class="note" id="left"></span></div>
          <p class="verdict" id="kMsg"></p>
        </div>
        <div data-panel="proof" class="sim" hidden>
          <div class="win ck-win"><div class="win-bar">Letter to parents.docx</div>
            <div class="win-body"><p class="ck-ok">✔️ Spelling and grammar check complete. No errors found.</p><p class="ck-doc ck-proof" id="proof">${PROOF.map((w, i) => `<span class="pw" data-i="${i}">${w}</span>`).join(' ')}</p></div></div>
          <div class="chk-btns"><button class="btn primary" id="bProof">Check my proofreading</button><button class="btn ghost" id="bProofR">↺ Start again</button><span class="note">Click every word that is wrong.</span></div>
          <p class="verdict" id="pMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.ck-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let words = [], lang = 'UK', open = -1;

    const flagged = (w) => w.f && !w.done && !(w.f.only && w.f.only !== lang);
    function draw() {
      FD.segSet($('#lang'), lang);
      $('#doc').innerHTML = words.map((w, i) => `<span class="ck-w ${flagged(w) ? 'ck-' + w.f.k : ''} ${w.fixed ? 'ck-fixed' : ''}" data-i="${i}">${w.t}</span>`).join(' ');
      const n = words.filter(flagged).length;
      $('#left').textContent = n ? `${n} possible error${n > 1 ? 's' : ''} underlined (red = spelling, blue = grammar)` : 'No errors underlined.';
    }
    function menu(i) {
      const w = words[i], m = $('#menu');
      if (!w || !flagged(w)) { m.hidden = true; open = -1; return; }
      open = i;
      const span = root.querySelector(`.ck-w[data-i="${i}"]`);
      m.innerHTML = `<p class="ck-why">${w.f.k === 'sp' ? 'ABC Spelling' : '✎ Grammar'}: ${w.f.why}</p>${w.f.sug.map((s) => `<button data-s="${s}"><b>${s}</b></button>`).join('')}<hr><button data-s="" data-ign="1">Ignore</button>${w.f.k === 'sp' ? '<button data-s="" data-add="1">Add to dictionary</button>' : ''}`;
      m.hidden = false;
      const box = $('#doc').getBoundingClientRect(), r = span.getBoundingClientRect();
      m.style.left = Math.max(0, Math.min(r.left - box.left, box.width - 220)) + 'px';
      m.style.top = (r.bottom - box.top + 6) + 'px';
    }
    function choose(i, s, how) {
      const w = words[i]; if (!w) return;
      const old = w.t;
      if (s) { w.t = s + (old.match(/[.,]$/) ? old.slice(-1) : ''); w.fixed = true; }
      w.done = true; $('#menu').hidden = true; open = -1; draw();
      const m = $('#kMsg');
      if (w.f.sug[0] === 'Sobbing' && s === 'Sobbing') { m.className = 'verdict bad'; m.innerHTML = '✗ “Sobbing loved it”? The spell checker suggested a change you should <b>disagree</b> with: Siobhan is a name. Always check suggestions!'; return; }
      m.className = 'verdict good';
      m.innerHTML = how === 'add' ? `✓ “${old}” added to the dictionary: it will not be flagged again.` : how === 'ign' ? `✓ Ignored “${old}”.` : `✓ Changed “${old}” to “${s}”.`;
    }
    $('#doc').addEventListener('click', (e) => { const s = e.target.closest('.ck-w'); if (s) menu(+s.dataset.i); });
    $('#menu').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && open >= 0) choose(open, b.dataset.s, b.dataset.add ? 'add' : b.dataset.ign ? 'ign' : ''); });
    function setLang(l) {
      lang = l; $('#menu').hidden = true; draw();
      $('#kMsg').className = 'verdict';
      $('#kMsg').innerHTML = l === 'US' ? 'With the checker set to <b>English (US)</b>, the UK spellings “aluminium” and “colour” are highlighted as incorrect (Figure 13.18).' : 'With the checker set to <b>English (UK)</b>, “aluminium” and “colour” are correct. Select the correct language for your spell checker!';
    }
    $('#lang').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setLang(b.dataset.v); });
    async function run() {
      const list = words.map((w, i) => [w, i]).filter(([w]) => flagged(w));
      if (!list.length) { $('#kMsg').className = 'verdict good'; $('#kMsg').innerHTML = '✓ The check is complete. But tools do not find every error: now <b>proofread</b> it yourself.'; return; }
      menu(list[0][1]);
      $('#kMsg').className = 'verdict'; $('#kMsg').innerHTML = 'Running the check <b>manually</b>: it stops at each error so you can change or ignore it.';
    }
    $('#bRun').addEventListener('click', run);

    function proofReset() { root.querySelectorAll('.pw').forEach((s, i) => { s.className = 'pw'; s.textContent = PROOF[i]; }); $('#pMsg').innerHTML = ''; $('#bProof').disabled = false; }
    $('#proof').addEventListener('click', (e) => { const s = e.target.closest('.pw'); if (s && !$('#bProof').disabled) s.classList.toggle('picked'); });
    function proofCheck() {
      let hit = 0, wrong = 0;
      root.querySelectorAll('.pw').forEach((s) => {
        const i = +s.dataset.i, err = ERR[i], on = s.classList.contains('picked');
        if (err) { s.classList.add(on ? 'right' : 'missed'); s.innerHTML = `<s>${PROOF[i]}</s> ${err[1]}`; if (on) hit++; } else if (on) { s.classList.add('wrong'); wrong++; }
      });
      $('#bProof').disabled = true;
      const n = Object.keys(ERR).length;
      $('#pMsg').className = 'verdict ' + (hit === n && !wrong ? 'good' : 'bad');
      $('#pMsg').innerHTML = `You found <b>${hit} of ${n}</b> errors${wrong ? ` (and marked ${wrong} correct word${wrong > 1 ? 's' : ''})` : ''}. The checker found <b>none</b>: “hole”, “you” and “form” are real words, and it cannot know the trip is on Friday. That is why you must <b>proofread</b> your own work.`;
    }
    $('#bProof').addEventListener('click', proofCheck);
    $('#bProofR').addEventListener('click', proofReset);
    function pick(i) { const s = root.querySelector(`.pw[data-i="${i}"]`); if (s) s.classList.add('picked'); }

    function reset() { words = DOC.map(([t, f]) => ({ t, f })); lang = 'UK'; $('#menu').hidden = true; draw(); $('#kMsg').innerHTML = ''; proofReset(); }
    show('tool'); reset();
    return { show, setLang, menu, choose, run, pick, proofCheck, proofReset, reset, wordAt: (t) => words.findIndex((w) => w.t === t), destroy() {} };
  },
  steps: [
    {
      title: 'Automated checking tools',
      text: `<p>It is important to check that the content of a digital product is correct <b>before it is published</b>.</p>
             <p>It is easy to make mistakes when entering data, so many applications provide automatic tools such as <strong>spelling and grammar checkers</strong>. They often underline errors as you type, but you can also run them <b>manually</b>.</p>`,
      tip: 'Try it: click an underlined word.',
      async on(a) { a.reset(); a.show('tool'); },
    },
    {
      title: 'Choose the right language',
      text: `<p>Select the correct language for your spell checker: American English and British English use different spellings for some words.</p>
             <p>A spell checker set to <b>US English</b> highlights the UK spelling “aluminium” as incorrect (Figure 13.18).</p>`,
      tip: 'Try it: switch the language between UK and US.',
      async on(a, ctx) { a.show('tool'); a.setLang('US'); if (!(await ctx.sleep(2200))) return; a.setLang('UK'); },
    },
    {
      title: 'Spelling errors',
      text: `<p>A spell checker picks up a <b>spelling error</b> and offers suggestions (Figure 13.19). You can <b>change</b> the word, <b>ignore</b> it, or <b>add it to the dictionary</b>.</p>`,
      async on(a, ctx) { a.show('tool'); const i = a.wordAt('speling'); if (i < 0) return; a.menu(i); if (!(await ctx.sleep(1800))) return; a.choose(i, 'spelling'); },
    },
    {
      title: 'Contextual and grammatical errors',
      text: `<p>Some tools also identify <strong>contextual errors</strong>: words that are spelled correctly but not used in the correct context, such as ‘there’ when ‘their’ would be correct.</p>
             <p>They also pick up <b>grammatical errors</b>, such as “I were walking” instead of “I was walking” (Figure 13.20).</p>`,
      async on(a, ctx) { a.show('tool'); for (const [t, s] of [['there', 'their'], ['were', 'was']]) { const i = a.wordAt(t); if (i < 0) continue; a.menu(i); if (!(await ctx.sleep(1600))) return; a.choose(i, s); if (!(await ctx.sleep(700))) return; } },
    },
    {
      title: 'Proofreading',
      text: `<p>Automated tools are useful, but they <b>will not always find every error</b>. That is why you must <strong>proofread</strong> your own work.</p>
             <p>Also, the spell checker may suggest changes with which you <b>disagree</b>, such as changing a person’s name.</p>`,
      tip: 'Try it: find the four errors that the checker missed.',
      async on(a, ctx) { a.show('proof'); a.proofReset(); if (!(await ctx.sleep(1200))) return; a.pick(1); },
    },
  ],
});

FD.check({
  section: 'checking',
  items: [
    { type: 'mcq', q: 'A spell checker set to <b>English (US)</b> highlights “colour”. Why?', opts: ['It is the UK spelling, not the US spelling', 'It is a contextual error', 'It is a grammar error', 'The word does not exist'], why: 'Select the correct language for your spell checker.' },
    { type: 'mcq', q: 'What is a <b>contextual error</b>?', opts: ['A word spelled correctly but used in the wrong context', 'A word with a letter missing', 'A wrong font', 'A missing image'], why: 'For example, ‘there’ instead of ‘their’.' },
    { type: 'spot', q: 'The spell checker found no errors in this sentence. Find the <b>two</b> errors.', hint: 'Tap the words that are wrong. Tap again to undo.', html: '<p class="ck-spot"><span data-spot="0">We</span> <span data-spot="0">will</span> <span data-spot="1" data-why="‘meat’ should be ‘meet’.">meat</span> <span data-spot="0">at</span> <span data-spot="1" data-why="‘are’ should be ‘our’.">are</span> <span data-spot="0">school</span> <span data-spot="0">gate.</span></p>', why: 'They are real words, so the checker missed them: proofread!' },
    { type: 'tf', q: 'If the spelling and grammar checker finds no errors, the document has no errors.', a: false, why: 'Automated tools will not always find every error.' },
  ],
});
