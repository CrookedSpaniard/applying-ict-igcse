FD.add({
  id: 'software',
  title: 'Choosing the right software',
  tab: 'Software',
  icon: 'software',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Multimedia', 'A combination of more than one medium, such as audio and video together.'],
  ],
  mount(el) {
    // Table 13.1: application software and the purposes for which they can be used
    const APPS = [
      { id: 'wp', e: '📝', n: 'Word processor', t: ['Writing letters', 'Writing menus', 'Producing reports', 'Writing essays', 'Writing books'] },
      { id: 'db', e: '🗃️', n: 'Database management', t: ['Entering, editing and searching data', 'Producing reports'] },
      { id: 'gr', e: '🎨', n: 'Graphics', t: ['Creating images', 'Manipulating and editing images'] },
      { id: 'wa', e: '🌐', n: 'Web authoring', t: ['Creating web pages and websites'] },
      { id: 'pr', e: '📽️', n: 'Presentation', t: ['Creating slides to display <b>multimedia</b> content to accompany a talk'] },
      { id: 'ss', e: '📊', n: 'Spreadsheet', t: ['Performing calculations, such as tax or student grades from test percentages', 'Modelling scenarios', 'Financial budgeting', 'Producing graphs and charts to visualise data as information'] },
    ];
    // Tasks for the matching game: [task, correct app id]
    const TASKS = [
      ['Write a letter to parents about a school trip', 'wp'], ['Work out each student’s grade from their test percentage', 'ss'],
      ['Store and search the details of 600 library books', 'db'], ['Make a website for the school drama club', 'wa'],
      ['Remove red-eye from a photo for the yearbook', 'gr'], ['Show slides with video during a talk to Year 7', 'pr'],
      ['Plan a monthly budget for a class fundraising sale', 'ss'], ['Write the menu for the school café', 'wp'],
      ['Design a logo for a sports team', 'gr'], ['Model what happens to profit if the ticket price changes', 'ss'],
    ];
    el.innerHTML = `
      <div class="sim sw-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="table">📋 Table 13.1</button><button data-p="match">🎯 Pick the software</button>
        </div>
        <div data-panel="table" class="sim">
          <div class="sw-grid">${APPS.map((a) => `
            <article class="sw-card" data-a="${a.id}"><h5>${a.e} ${a.n}</h5><ul>${a.t.map((t) => `<li>${t}</li>`).join('')}</ul></article>`).join('')}</div>
        </div>
        <div data-panel="match" class="sim" hidden>
          <div class="sim-box sw-task"><p class="kick">Task <span id="tn">1</span> of ${TASKS.length}</p><p class="sw-q" id="tq"></p></div>
          <div class="sw-btns">${APPS.map((a) => `<button class="sw-pick" data-a="${a.id}"><span>${a.e}</span>${a.n}</button>`).join('')}</div>
          <div class="readout"><div class="ro good"><small>Correct</small><b id="sOk">0</b></div><div class="ro"><small>Answered</small><b id="sAll">0</b></div></div>
          <p class="verdict" id="sMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.sw-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let k = 0, ok = 0, all = 0, locked = false, order = [];

    function hi(ids) {
      const list = ids ? [].concat(ids) : [];
      root.querySelectorAll('.sw-card').forEach((c) => {
        c.classList.toggle('on', list.includes(c.dataset.a));
        c.classList.toggle('dim', list.length > 0 && !list.includes(c.dataset.a));
      });
    }
    function ask(i) {
      k = i % order.length; locked = false;
      $('#tn').textContent = k + 1;
      $('#tq').textContent = order[k][0];
      root.querySelectorAll('.sw-pick').forEach((b) => b.classList.remove('good', 'bad'));
      $('#sMsg').className = 'verdict'; $('#sMsg').innerHTML = '';
    }
    function answer(id) {
      if (locked) return;
      locked = true;
      const [task, right] = order[k], app = APPS.find((a) => a.id === right);
      const good = id === right;
      all++; if (good) ok++;
      $('#sOk').textContent = ok; $('#sAll').textContent = all;
      root.querySelector(`.sw-pick[data-a="${id}"]`).classList.add(good ? 'good' : 'bad');
      root.querySelector(`.sw-pick[data-a="${right}"]`).classList.add('good');
      $('#sMsg').className = 'verdict ' + (good ? 'good' : 'bad');
      $('#sMsg').innerHTML = `${good ? '✓ Yes!' : '✗ Not the best choice.'} <b>${app.e} ${app.n}</b> is the appropriate application for “${task.toLowerCase()}”. <button class="mini-btn" id="nx">Next task ▶</button>`;
      $('#nx').addEventListener('click', () => ask(k + 1));
    }
    root.querySelectorAll('.sw-pick').forEach((b) => b.addEventListener('click', () => answer(b.dataset.a)));

    function reset() { order = TASKS.slice(); ok = 0; all = 0; $('#sOk').textContent = 0; $('#sAll').textContent = 0; hi(); ask(0); }
    show('table'); reset();
    return { show, hi, ask, answer, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Effective and appropriate use of software',
      text: `<p>When you apply ICT, you work with a range of digital tools, including <b>application software</b>, to produce ICT solutions.</p>
             <p>To work effectively, you need to <strong>select appropriate applications</strong> to meet the needs of a task. Table 13.1 lists six types of application and what they can be used for.</p>`,
      async on(a) { a.show('table'); a.hi(); },
    },
    {
      title: 'Word processors and databases',
      text: `<p>A <strong>word processor</strong> is used for writing letters, menus, reports, essays and books.</p>
             <p><strong>Database management</strong> software is used for entering, editing and searching data, and for producing reports.</p>`,
      async on(a, ctx) { a.show('table'); a.hi('wp'); if (!(await ctx.sleep(1600))) return; a.hi('db'); },
    },
    {
      title: 'Graphics, web authoring and presentations',
      text: `<p><strong>Graphics</strong> software creates, manipulates and edits images. <strong>Web authoring</strong> software creates web pages and websites.</p>
             <p><strong>Presentation</strong> software creates slides to display <strong>multimedia</strong> content to accompany a talk.</p>`,
      async on(a, ctx) { a.show('table'); for (const id of ['gr', 'wa', 'pr']) { a.hi(id); if (!(await ctx.sleep(1400))) return; } },
    },
    {
      title: 'Spreadsheets',
      text: `<p>A <strong>spreadsheet</strong> performs calculations (such as tax, or student grades from test percentages), models scenarios, helps with financial budgeting, and produces graphs and charts to visualise data as information.</p>`,
      async on(a) { a.show('table'); a.hi('ss'); },
    },
    {
      title: 'Your turn: pick the software',
      text: `<p>For each task, choose the most appropriate application. Think about what the <b>finished product</b> is: a document, a set of records, an image, a website, slides or calculations?</p>`,
      tip: 'Try it: answer all ten tasks.',
      async on(a, ctx) { a.show('match'); a.reset(); if (!(await ctx.sleep(1500))) return; a.answer('wp'); },
    },
  ],
});

FD.check({
  section: 'software',
  items: [
    { type: 'mcq', q: 'Which application is most appropriate for <b>financial budgeting</b>?', opts: ['Spreadsheet', 'Word processor', 'Graphics', 'Web authoring'], why: 'Spreadsheets perform calculations and model scenarios.' },
    { type: 'mcq', q: 'What is <b>multimedia</b>?', opts: ['A combination of more than one medium, such as audio and video together', 'A very large text document', 'A single photograph', 'A type of database report'], why: 'Presentation slides often display multimedia content.' },
    { type: 'sort', q: 'Which application is best for each task?', bins: ['Word processor', 'Database management', 'Presentation'], rows: [['Writing an essay', 0], ['Searching customer records', 1], ['Slides to accompany a talk', 2], ['Writing a menu', 0], ['Entering and editing stock data', 1]], why: 'See Table 13.1.' },
  ],
});
