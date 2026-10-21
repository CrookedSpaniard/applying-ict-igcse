FD.add({
  id: 'evaluation',
  title: 'Evaluation',
  tab: 'Evaluation',
  icon: 'evaluation',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Evaluation', 'The process of assessing something thoroughly.'],
    ['Unique', 'The only one of its kind.'],
  ],
  mount(el) {
    const G = [
      ['sel', '🧭 Selecting the application software', [
        'Did you select the best application for the job? For example, for a web page, did you use a text editor, a word processor or a dedicated web authoring application?',
        'Did you consider using alternative applications? If so, what criteria did you use to decide which to consider?',
        'Why did you choose the application you used? If there was a better choice, why did you not choose that one?',
        'What features made your choice appropriate? Were any of the application’s features unique to it?',
        'How familiar were you with the application? Did that affect your decision to select it?']],
      ['use', '🛠️ Using the application software', [
        'Did you make the best use of the application’s features?',
        'Did you apply skills that you learned during the course?',
        'Were there any additional skills that you had to learn elsewhere, such as from tutorial videos on the internet?',
        'Did you learn any new skills? Did you gain confidence in using them?',
        'Did your understanding of the application’s features improve? How?',
        'Did your efficiency improve? For example, did you use keyboard shortcuts, or become faster with the menus?']],
      ['eff', '🎯 Effectiveness of your products', [
        'Did your products meet the needs of the client or brief you were given? How do you know?',
        'Were your products suitable for purpose and their intended audience? How do you know?',
        'Did you ask other people to check your products, and did you make good use of their feedback?',
        'Did you review others’ products and provide useful feedback? How did that help your own skills and understanding?']],
    ];
    // Statements from a student’s evaluation of a school-fair poster: [text, useful?, why]
    const ST = [
      ['I used DTP software instead of a word processor because it let me position the images and text boxes exactly.', true, 'It explains the choice of application and why it was appropriate.'],
      ['It took me two hours.', false, 'Do not simply focus on your own use of time.'],
      ['My poster is perfect and cannot be improved.', false, 'Be honest: even very good work can usually be improved.'],
      ['I asked two classmates to check it. They said the date was hard to see, so I made it larger and bolder.', true, 'It shows you asked for feedback and made good use of it.'],
      ['I learned the keyboard shortcut for aligning objects, which made me faster.', true, 'It reflects on how your efficiency improved.'],
      ['Next time I would use less text, because the poster looked too full.', true, 'Saying what needs improving, and why, shows good understanding.'],
    ];
    el.innerHTML = `
      <div class="sim ev-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="q">❓ Questions to ask yourself</button><button data-p="sort">⚖️ Useful or weak?</button>
        </div>
        <div data-panel="q" class="sim">
          <div class="ev-groups">${G.map(([k, h, qs]) => `<details class="sim-box ev-g" data-g="${k}"><summary>${h}</summary><ul>${qs.map((q) => `<li>${q}</li>`).join('')}</ul></details>`).join('')}</div>
        </div>
        <div data-panel="sort" class="sim" hidden>
          <p class="note">A student wrote an evaluation of their school-fair poster. Is each statement a <b>useful</b> evaluation, or <b>weak</b>?</p>
          <ul class="ev-list">${ST.map(([t], i) => `<li class="sim-box" data-i="${i}"><p>“${t}”</p><span class="seg"><button data-v="1">👍 Useful</button><button data-v="0">👎 Weak</button></span><em class="note"></em></li>`).join('')}</ul>
          <div class="readout"><div class="ro good"><small>Correct</small><b id="eOk">0</b></div><div class="ro"><small>Answered</small><b id="eN">0 / ${ST.length}</b></div></div>
        </div>
        <div class="sim-box ev-key"><h5 class="mw-h">🔑 Key points</h5><ul>
          <li data-k="0">Answering these questions <b>honestly</b> will help you write a meaningful evaluation.</li>
          <li data-k="1">Do not simply focus on your own <b>use of time</b>.</li>
          <li data-k="2">Saying your work needs improving gives you a chance to explain <b>how and why</b>: even very good work can usually be improved.</li></ul></div>
      </div>`;
    const root = el.querySelector('.ev-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    function group(k) { root.querySelectorAll('.ev-g').forEach((d) => { d.open = d.dataset.g === k || k === 'all'; d.classList.toggle('on', d.dataset.g === k); }); }
    function key(i) { root.querySelectorAll('.ev-key li').forEach((li) => li.classList.toggle('on', +li.dataset.k === i || i === 'all')); }
    function judge(i, v) {
      const li = root.querySelector(`.ev-list li[data-i="${i}"]`);
      if (!li || li.dataset.done) return;
      li.dataset.done = 1;
      const [, useful, why] = ST[i], ok = (v === '1') === useful;
      FD.segSet(li.querySelector('.seg'), v);
      li.classList.add(ok ? 'ok' : 'no');
      li.querySelector('em').innerHTML = `${ok ? '✓' : '✗'} <b>${useful ? 'Useful' : 'Weak'}</b>: ${why}`;
      const done = root.querySelectorAll('.ev-list li[data-done]').length, good = root.querySelectorAll('.ev-list li.ok').length;
      $('#eOk').textContent = good; $('#eN').textContent = `${done} / ${ST.length}`;
    }
    $('.ev-list').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) judge(+b.closest('li').dataset.i, b.dataset.v); });

    function reset() {
      group(''); key(-1);
      root.querySelectorAll('.ev-list li').forEach((li) => { delete li.dataset.done; li.className = 'sim-box'; li.querySelector('em').innerHTML = ''; FD.segSet(li.querySelector('.seg'), ''); });
      $('#eOk').textContent = 0; $('#eN').textContent = `0 / ${ST.length}`;
    }
    show('q'); reset();
    return { show, group, key, judge, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Why evaluate?',
      text: `<p>The <strong>evaluation</strong> process is very important: it helps you reflect on <b>what went well</b> and <b>what you could improve</b> next time.</p>
             <p>Think back to how you applied your knowledge of ICT. Ask yourself questions about your <b>selection</b> and <b>use</b> of the application software and the <b>effectiveness</b> of your products.</p>`,
      async on(a) { a.reset(); a.show('q'); },
    },
    {
      title: 'Selecting the application software',
      text: `<p>Did you select the best application for the job? Did you consider alternatives, and what criteria did you use? Which features made your choice appropriate: were any <strong>unique</strong> to it? Did your familiarity with it affect your choice?</p>`,
      async on(a) { a.show('q'); a.group('sel'); },
    },
    {
      title: 'Using the application software',
      text: `<p>Did you make the best use of its features? Did you apply skills from the course, or learn extra skills elsewhere (for example from tutorial videos)? Did your understanding and <b>efficiency</b> improve, such as by using keyboard shortcuts?</p>`,
      async on(a) { a.show('q'); a.group('use'); },
    },
    {
      title: 'Effectiveness of your products',
      text: `<p>Did your products meet the needs of the client or brief? Were they suitable for purpose and audience? How do you know?</p>
             <p>Did you ask others to check them and use their feedback? Did you give useful feedback on others’ products?</p>`,
      async on(a) { a.show('q'); a.group('eff'); },
    },
    {
      title: 'Write an honest evaluation',
      text: `<p><b>Key points:</b> answer the questions <b>honestly</b>; do not simply focus on your use of <b>time</b>; and be honest about your own work.</p>
             <p>Saying your work needs improving lets you explain <b>how and why</b>, which shows you understand the process of producing digital products.</p>`,
      tip: 'Try it: decide which statements are useful.',
      async on(a, ctx) { a.show('sort'); for (const i of [0, 1, 2]) { a.key(i); if (!(await ctx.sleep(1100))) return; } a.key('all'); a.judge(1, '0'); },
    },
  ],
});

FD.check({
  section: 'evaluation',
  items: [
    { type: 'mcq', q: 'What is an <b>evaluation</b>?', opts: ['The process of assessing something thoroughly', 'A list of the software you used', 'A spell check', 'A house style'], why: 'It helps you reflect on what went well and what to improve.' },
    { type: 'sort', q: 'Which group of evaluation questions does each belong to?', bins: ['Selecting', 'Using', 'Effectiveness'], rows: [['Did you consider alternative applications?', 0], ['Did you use keyboard shortcuts to work faster?', 1], ['Did the product meet the needs of the brief?', 2], ['Did you make good use of the feedback you received?', 2]], why: 'See pages 197–198.' },
    { type: 'tf', q: 'A good evaluation mainly describes how long each task took.', a: false, why: 'Do not simply focus on your own use of time.' },
  ],
});
