FD.add({
  id: 'review',
  title: 'Reviewing outcomes against the requirements',
  tab: 'Requirements',
  icon: 'review',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Iterative development', 'Improving a product step by step, by regularly checking it against the requirements and being critical throughout the process.'],
    ['Requirements', 'What the task asks the digital product to do or contain.'],
  ],
  mount(el) {
    const STAGES = [['🛠️', 'Create or change the product'], ['📋', 'Compare it with the requirements'], ['⚖️', 'Find strengths and weaknesses'], ['✨', 'Decide on improvements']];
    const REQ = [
      ['orient', 'SET the orientation to landscape.'],
      ['footer', 'ENTER ‘Task A1’ and your name, candidate number and centre number in the footer.'],
      ['save', 'SAVE the word-processed document as TASK A1.'],
    ];
    el.innerHTML = `
      <div class="sim rv-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="cycle">🔁 Iterative development</button><button data-p="task">📋 Task A1</button>
        </div>
        <div data-panel="cycle" class="sim">
          <svg viewBox="0 0 420 222" class="rv-cyc" role="img" aria-label="The iterative development cycle">
            <circle cx="210" cy="111" r="68" class="rv-ring"/>
            ${STAGES.map(([e, t], i) => { const [x, y] = [[210, 20], [342, 111], [210, 202], [78, 111]][i]; return `<g class="rv-st" data-i="${i}"><rect x="${x - 72}" y="${y - 17}" width="144" height="34" rx="10"/><text x="${x}" y="${y + 4}" class="svg-lbl svg-sm">${e} ${t}</text></g>`; }).join('')}
            <circle id="tok" r="8" class="rv-tok" cx="210" cy="43"/>
            <text x="210" y="106" class="svg-lbl">Round</text><text x="210" y="128" class="svg-lbl rv-n" id="rnd">1</text>
          </svg>
          <div class="chk-btns"><button class="btn primary" id="bLoop">▶ Go round once</button><button class="btn ghost" id="bFinal">🏁 Final review</button></div>
          <p class="verdict" id="cMsg"></p>
        </div>
        <div data-panel="task" class="sim" hidden>
          <div class="sim-box rv-req"><h5 class="mw-h">Requirements</h5>
            <ul class="rv-list">${REQ.map(([k, t]) => `<li data-r="${k}"><span class="rv-t">${t}</span><span class="seg rv-ans"><button data-v="met">Met</button><button data-v="not">Not met</button></span><em></em></li>`).join('')}</ul>
            <div class="chk-btns"><button class="btn" id="bMark">Check my answers</button><span class="note" id="score"></span></div>
          </div>
          <div class="win rv-word">
            <div class="win-bar"><span id="fname">TASK A.docx</span> – Word</div>
            <div class="rv-tools">
              <span class="seg" id="oSeg"><span class="seg-l">Orientation</span><button data-v="portrait">Portrait</button><button data-v="landscape">Landscape</button></span>
              <label>Footer <input id="foot" autocomplete="off" spellcheck="false"></label>
              <label>Save as <input id="save" autocomplete="off" spellcheck="false"><button class="mini-btn" id="bSave">💾 Save</button></label>
            </div>
            <div class="rv-desk"><div class="rv-page" id="page"><p class="rv-title">TASK A</p><p class="rv-foot" id="pfoot"></p></div></div>
          </div>
          <p class="verdict" id="tMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.rv-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, round = 1, busy = false;
    const doc = { orient: 'portrait', footer: 'Task A | Candidate name | Candidate number 0000 | Centre number 000', file: 'TASK A' };

    const pos = (i) => { const a = (i * Math.PI) / 2 - Math.PI / 2; return [210 + 68 * Math.cos(a), 111 + 68 * Math.sin(a)]; };
    function hi(i) { root.querySelectorAll('.rv-st').forEach((g) => g.classList.toggle('on', +g.dataset.i === i)); }
    async function loop() {
      if (busy) return; busy = true;
      for (let i = 0; i < 4; i++) {
        hi(i);
        $('#cMsg').className = 'verdict'; $('#cMsg').innerHTML = `Round ${round}: ${STAGES[i][1].toLowerCase()}.`;
        const a0 = (i * Math.PI) / 2 - Math.PI / 2;
        await FD.tween(700, (t) => { if (dead) return; const a = a0 + (t * Math.PI) / 2; $('#tok').setAttribute('cx', 210 + 68 * Math.cos(a)); $('#tok').setAttribute('cy', 111 + 68 * Math.sin(a)); });
        if (dead) return;
      }
      round++; $('#rnd').textContent = round; hi(-1); busy = false;
      $('#cMsg').innerHTML = 'Each time round, the product gets better. Checking regularly and being critical throughout the process is called <b>iterative development</b>.';
    }
    function final() {
      hi(-1); const [x, y] = pos(0); $('#tok').setAttribute('cx', x); $('#tok').setAttribute('cy', y);
      $('#cMsg').className = 'verdict good';
      $('#cMsg').innerHTML = '🏁 <b>Review after you finish</b>: how could the product be improved further, and how could you improve the <b>process</b> if you made a similar product in the future?';
    }
    $('#bLoop').addEventListener('click', loop);
    $('#bFinal').addEventListener('click', final);

    const met = { orient: () => doc.orient === 'landscape', footer: () => /task a1\b/i.test(doc.footer) && !/candidate name|0000|000\b/i.test(doc.footer), save: () => doc.file.trim().toUpperCase() === 'TASK A1' };
    const WHY = {
      orient: () => (met.orient() ? '✓ Landscape.' : '✗ The page orientation is set to portrait, not landscape.'),
      footer: () => (met.footer() ? '✓ Task A1 and real details are in the footer.' : /task a1\b/i.test(doc.footer) ? '✗ The footer still has placeholder text: enter your own name and numbers.' : '✗ ‘Task A’ has been entered, rather than ‘Task A1’.'),
      save: () => (met.save() ? '✓ Saved as TASK A1.' : `✗ The document has been saved as ‘${doc.file}’, rather than ‘TASK A1’.`),
    };
    function drawDoc() {
      $('#page').classList.toggle('land', doc.orient === 'landscape');
      FD.segSet($('#oSeg'), doc.orient);
      $('#pfoot').textContent = doc.footer;
      $('#fname').textContent = doc.file + '.docx';
      if (document.activeElement !== $('#foot')) $('#foot').value = doc.footer;
      if (document.activeElement !== $('#save')) $('#save').value = doc.file;
      const n = REQ.filter(([k]) => met[k]()).length;
      root.querySelectorAll('.rv-list li').forEach((li) => li.classList.toggle('live-ok', (marked || edited) && met[li.dataset.r]()));
      if (marked || edited) root.querySelectorAll('.rv-list li').forEach((li) => { li.querySelector('em').textContent = WHY[li.dataset.r](); });
      $('#tMsg').className = 'verdict ' + (n === 3 ? 'good' : '');
      $('#tMsg').innerHTML = marked || edited ? (n === 3 ? '✓ All three requirements are now met.' : `${n} of 3 requirements met. Fix the document using the tools above it.`) : 'Compare the document with each requirement: met or not met?';
    }
    let marked = false, edited = false;
    root.querySelectorAll('.rv-ans').forEach((s) => s.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b && !marked) FD.segSet(s, b.dataset.v); }));
    function answer(k, v) { FD.segSet(root.querySelector(`.rv-list li[data-r="${k}"] .rv-ans`), v); }
    function mark() {
      marked = true; let got = 0;
      root.querySelectorAll('.rv-list li').forEach((li) => {
        const picked = li.querySelector('.rv-ans button.on'), want = met[li.dataset.r]() ? 'met' : 'not';
        const ok = picked && picked.dataset.v === want; got += ok;
        li.classList.add(ok ? 'right' : 'wrong');
      });
      $('#score').innerHTML = `You got <b>${got} / 3</b>. The document in Figure 13.21 meets <b>none</b> of the requirements.`;
      drawDoc();
    }
    $('#bMark').addEventListener('click', mark);
    function setOrient(v) { doc.orient = v; edited = true; drawDoc(); }
    function setFooter(v) { doc.footer = v; edited = true; drawDoc(); }
    function saveAs(v) { doc.file = v; edited = true; drawDoc(); }
    $('#oSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setOrient(b.dataset.v); });
    $('#foot').addEventListener('input', (e) => setFooter(e.target.value));
    $('#bSave').addEventListener('click', () => saveAs($('#save').value || doc.file));
    $('#save').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveAs(e.target.value || doc.file); });

    function reset() {
      round = 1; busy = false; $('#rnd').textContent = 1; hi(-1); $('#tok').setAttribute('cx', 210); $('#tok').setAttribute('cy', 43); $('#cMsg').innerHTML = '';
      Object.assign(doc, { orient: 'portrait', footer: 'Task A | Candidate name | Candidate number 0000 | Centre number 000', file: 'TASK A' });
      marked = false; edited = false; $('#score').innerHTML = '';
      root.querySelectorAll('.rv-list li').forEach((li) => { li.className = ''; li.querySelector('em').textContent = ''; FD.segSet(li.querySelector('.rv-ans'), ''); });
      $('#foot').value = doc.footer; $('#save').value = doc.file; drawDoc();
    }
    show('cycle'); reset();
    return { show, loop, final, answer, mark, setOrient, setFooter, saveAs, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Reviewing as you go',
      text: `<p>As you create digital products, regularly check that they meet the <b>requirements</b> you have been asked to meet. Consider their <b>strengths and weaknesses</b>: this helps you decide how to update and improve them.</p>
             <p>This process is called <strong>iterative development</strong>. It lets you improve your products by being critical throughout the process.</p>`,
      tip: 'Try it: go round the cycle.',
      async on(a) { a.reset(); a.show('cycle'); await a.loop(); },
    },
    {
      title: 'Reviewing after you finish',
      text: `<p>You should also review products <b>after</b> you have created them. This lets you identify ways in which they could be further improved.</p>
             <p>It also helps you consider how you could improve the <b>process</b> if you were asked to create similar products again in the future.</p>`,
      async on(a) { a.show('cycle'); a.final(); },
    },
    {
      title: 'Compare with the requirements',
      text: `<p>Compare what you are producing with the requirements of the task <b>several times</b>, at different stages of development, as well as once the final product has been produced.</p>
             <p>Look at Task A1: how many of the requirements does this document meet?</p>`,
      tip: 'Try it: mark each requirement as met or not met.',
      async on(a) { a.show('task'); },
    },
    {
      title: 'None of the requirements are met',
      text: `<p>The document in Figure 13.21 meets <b>none</b> of the requirements:</p>
             <ul><li>the orientation is <b>portrait</b>, not landscape</li><li>‘Task A’ has been entered in the footer, not ‘Task A1’</li><li>it has been saved as ‘TASK A’, not ‘TASK A1’.</li></ul>`,
      async on(a, ctx) { a.show('task'); for (const k of ['orient', 'footer', 'save']) { a.answer(k, 'not'); if (!(await ctx.sleep(500))) return; } a.mark(); },
    },
    {
      title: 'Make the modifications',
      text: `<p>Now make modifications to improve the outcome, then check the requirements again. Every requirement turns green when it is met.</p>`,
      tip: 'Try it: type your own details in the footer.',
      async on(a, ctx) { a.show('task'); a.setOrient('landscape'); if (!(await ctx.sleep(1200))) return; a.setFooter('Task A1 | Sam Taylor | 0123 | 45678'); if (!(await ctx.sleep(1200))) return; a.saveAs('TASK A1'); },
    },
  ],
});

FD.activities({
  section: 'review',
  intro: 'Choose an answer for each row, then press <b>Check</b>. Your answers are <b>saved automatically</b> and included when you copy <b>My progress</b>.',
  items: [
    {
      id: 'review-taska1',
      type: 'table',
      title: 'Checking a product against requirements',
      task: '<p>Compare the document in Figure 13.21 (the Task A document in the simulation) against the requirements. How many of the requirements have been met?</p>',
      head: ['Requirement', 'In Figure 13.21'],
      rows: [
        ['SET the orientation to landscape.', [1]],
        ['ENTER ‘Task A1’ and your name, candidate number and centre number in the footer.', [1]],
        ['SAVE the word-processed document as TASK A1.', [1]],
      ],
      opts: [['Met', 'Not met']],
      why: 'Portrait instead of landscape; ‘Task A’ instead of ‘Task A1’; saved as ‘TASK A’. None of the requirements are met.',
    },
  ],
});

FD.check({
  section: 'review',
  items: [
    { type: 'mcq', q: 'What is <b>iterative development</b>?', opts: ['Regularly checking a product against the requirements and improving it throughout the process', 'Making a product once and never changing it', 'Copying another student’s product', 'Printing many copies of a product'], why: 'It lets you improve products by being critical throughout.' },
    { type: 'mcq', q: 'When should you compare your product with the requirements?', opts: ['Several times during development and once the final product is produced', 'Only at the very start', 'Only after the deadline', 'Never: the teacher does it'], why: 'Different stages of the development process.' },
    { type: 'tf', q: 'Reviewing a finished product can help you improve the process you use next time.', a: true, why: 'Consider how you could improve the process for similar products in the future.' },
  ],
});
