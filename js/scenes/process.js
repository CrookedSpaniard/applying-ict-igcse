FD.add({
  id: 'process',
  title: 'Enter, organise, develop, refine and format information',
  tab: 'Editing',
  icon: 'process',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Refine', 'Make changes to improve something.'],
    ['Pagination', 'The process of giving a number to each page of a book, magazine or document.'],
  ],
  mount(el) {
    const ST = ['Enter', 'Organise', 'Develop', 'Refine', 'Format'];
    // Table 13.3
    const APPS = {
      wp: ['📝 Word processor', [['Text', 'Images', 'Graphs', 'Charts'], ['Paragraphs', 'Pagination', 'Bullet points', 'Tables', 'Wrapping'], ['Add image captions', 'Duplicate text and images'], ['Spell check', 'Thesaurus'], ['Style', 'Size', 'Emphasis', 'Colour', 'Export or publish']]],
      db: ['🗃️ Database management', [['Data into tables'], ['Sort', 'Filter'], ['New fields', 'Relationships'], ['Queries', 'Group', 'Validation'], ['Reports', 'Export or publish']]],
      ss: ['📊 Spreadsheet', [['Numbers', 'Text'], ['Sort', 'Filter', 'Use of columns and rows'], ['Functions', 'Formulae', 'Graphs', 'Charts'], ['Chart features', 'Absolute referencing'], ['Cell', 'Column', 'Row', 'Sheet', 'Print layout']]],
      gr: ['🎨 Graphics', [['Images', 'Text'], ['Layers', 'Positioning'], ['Resize', 'Animation'], ['Filters'], ['Export or publish options']]],
      wa: ['🌐 Web authoring', [['Text', 'Images', 'Buttons', 'Animation'], ['Tables', 'Frames'], ['Hyperlinks', 'Navigation'], ['Menus'], ['Font enhancements', 'Alignment']]],
      pr: ['📽️ Presentation', [['Text', 'Images', 'Buttons', 'Sound', 'Video'], ['Content on slide', 'Slide order'], ['Animations', 'Transitions'], ['Notes', 'Timings'], ['Master slide', 'Font']]],
    };
    const DEMO = { wp: 1, ss: 1, db: 1 };
    el.innerHTML = `
      <div class="sim pc-s">
        <div class="seg" id="appSeg">${Object.entries(APPS).map(([k, v]) => `<button data-v="${k}">${v[0]}</button>`).join('')}</div>
        <div class="pc-stages" id="stages">${ST.map((s, i) => `<button class="pc-st" data-i="${i}"><b>${i + 1}</b>${s}<ul></ul></button>`).join('')}</div>
        <div class="sim-box pc-demo"><p class="kick" id="dTitle"></p><div id="demo"></div></div>
        <p class="verdict" id="pMsg"></p>
      </div>`;
    const root = el.querySelector('.pc-s'), $ = (s) => root.querySelector(s);
    let app = 'ss', stage = -1;

    const SALES = [['Mar', 340], ['Jan', 120], ['Apr', 95], ['Feb', 260]];
    function ssDemo(k) {
      const rows = k >= 1 ? [['Jan', 120], ['Feb', 260], ['Mar', 340], ['Apr', 95]] : SALES;
      const money = (v) => (k >= 4 ? `£${v.toFixed(2)}` : v);
      const total = rows.reduce((n, r) => n + r[1], 0);
      const max = 340;
      return `<div class="pc-ss ${k >= 4 ? 'fmt' : ''}">
        <table class="pc-grid"><thead><tr><th></th><th>A</th><th>B</th></tr></thead><tbody>
          <tr><th>1</th><td class="h">${k >= 1 ? 'Month' : ''}</td><td class="h">${k >= 1 ? 'Sales' : ''}</td></tr>
          ${rows.map((r, i) => `<tr><th>${i + 2}</th><td>${r[0]}</td><td class="n">${money(r[1])}</td></tr>`).join('')}
          ${k >= 2 ? `<tr class="tot"><th>6</th><td>Total</td><td class="n" title="=SUM(B2:B5)">${money(total)}</td></tr>` : ''}
        </tbody></table>
        ${k >= 2 ? `<div class="pc-formula mono">B6: =SUM(B2:B5)</div>` : ''}
        ${k >= 2 ? `<svg viewBox="0 0 200 120" class="pc-chart">${k >= 3 ? '<text x="100" y="12" class="svg-lbl svg-sm">Cake sales, Jan–Apr</text>' : ''}<line x1="20" y1="100" x2="195" y2="100" class="ty-ax"/>${rows.map((r, i) => `<rect x="${30 + i * 42}" y="${100 - (r[1] / max) * 66}" width="28" height="${(r[1] / max) * 66}" class="ty-bar"/><text x="${44 + i * 42}" y="113" class="svg-lbl svg-sm">${r[0]}</text>${k >= 3 ? `<text x="${44 + i * 42}" y="${96 - (r[1] / max) * 66}" class="svg-lbl svg-sm">${money(r[1])}</text>` : ''}`).join('')}</svg>` : ''}
      </div>`;
    }
    function wpDemo(k) {
      const sp = (w, f) => (k >= 3 ? `<span class="pc-fixed">${f}</span>` : `<span class="pc-err">${w}</span>`);
      const body = k === 0
        ? `<p>School trip to the science museum</p><p>We will ${sp('recieve', 'receive')} the tickets on Monday. Bring a packed lunch. Bring a coat. Bring a pencil.</p>`
        : `<h4>School trip to the science museum</h4><p>We will ${sp('recieve', 'receive')} the tickets on Monday. Please bring:</p><ul><li>a packed lunch</li><li>a coat</li><li>a pencil</li></ul>`;
      return `<div class="pc-doc ${k >= 4 ? 'fmt' : ''}">${body}
        ${k >= 2 ? '<figure class="pc-fig"><div>🦕</div><figcaption>Figure 1: The dinosaur gallery</figcaption></figure>' : ''}
        ${k >= 1 ? '<p class="pc-pg">Page 1 of 1</p>' : ''}</div>`;
    }
    function dbDemo(k) {
      let rows = [['Ana', 'Lopez', '10B', 15], ['Ben', 'Carter', '11A', 16], ['Chloe', 'Adams', '10B', 15], ['Dev', 'Patel', '11A', 160]];
      if (k >= 1) rows = rows.slice().sort((a, b) => a[1].localeCompare(b[1]));
      if (k >= 4) rows = rows.filter((r) => r[2] === '10B');
      const head = ['First name', 'Surname', 'Form', 'Age'].concat(k >= 2 ? ['Email'] : []);
      return `<div class="pc-db ${k >= 4 ? 'fmt' : ''}">${k >= 4 ? '<h4>Report: students in 10B</h4>' : ''}
        ${k === 3 ? '<p class="note mono">Query: Form = "10B" → 2 records · Validation rule: Age between 11 and 18 (160 is rejected ✗)</p>' : ''}
        <table class="tbl"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>
        ${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3] > 18 && k === 3 ? 'bad-t' : ''}">${k >= 4 && r[3] > 18 ? 16 : r[3]}</td>${k >= 2 ? `<td>${r[0].toLowerCase()}@school.org</td>` : ''}</tr>`).join('')}</tbody></table></div>`;
    }
    const MSG = [
      'You <b>enter</b> data using input devices such as keyboards, mice and microphones.',
      'You <b>organise</b> the layout of the information.',
      'You <b>develop</b> the information, adding to it.',
      'You <b>refine</b> it: make changes to improve it.',
      'You <b>format</b> it to meet the needs of your design.',
    ];

    function draw() {
      FD.segSet($('#appSeg'), app);
      const feats = APPS[app][1];
      root.querySelectorAll('.pc-st').forEach((b, i) => {
        b.querySelector('ul').innerHTML = feats[i].map((f) => `<li>${f}</li>`).join('');
        b.classList.toggle('on', i === stage); b.classList.toggle('done', i < stage);
      });
      $('#dTitle').textContent = APPS[app][0] + (stage >= 0 ? ' · after “' + ST[stage] + '”' : '');
      const k = Math.max(0, stage);
      $('#demo').innerHTML = !DEMO[app] ? `<p class="note">Features used at each stage are shown above. Open the word processor, database or spreadsheet to watch a product being built.</p>` : app === 'ss' ? ssDemo(k) : app === 'wp' ? wpDemo(k) : dbDemo(k);
      $('#pMsg').className = 'verdict'; $('#pMsg').innerHTML = stage >= 0 ? MSG[stage] : 'Click a stage, from 1 to 5.';
    }
    function setApp(a) { app = a; draw(); }
    function go(i) { stage = i; draw(); }
    $('#appSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setApp(b.dataset.v); });
    root.querySelectorAll('.pc-st').forEach((b) => b.addEventListener('click', () => go(+b.dataset.i)));

    function reset() { app = 'ss'; stage = -1; draw(); }
    reset();
    return { setApp, go, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Turning data into information',
      text: `<p>When you work with application software, you <b>enter</b> data using input devices such as keyboards, mice and microphones.</p>
             <p>Selecting the appropriate data, editing it and <strong>refining</strong> it turns this data into <b>information</b>. Table 13.3 shows the features used at each stage.</p>`,
      async on(a) { a.reset(); a.setApp('ss'); a.go(0); },
    },
    {
      title: '1 Enter and 2 Organise',
      text: `<p><b>Enter</b>: type numbers and text, insert images, graphs or charts.</p>
             <p><b>Organise</b>: sort and filter, use columns and rows, or set out paragraphs, bullet points, tables and <strong>pagination</strong> (numbering each page).</p>`,
      tip: 'Try it: watch the sales get sorted into month order.',
      async on(a, ctx) { a.setApp('ss'); a.go(0); if (!(await ctx.sleep(1400))) return; a.go(1); },
    },
    {
      title: '3 Develop',
      text: `<p><b>Develop</b> the information: add functions, formulae, graphs and charts in a spreadsheet; captions in a word processor; new fields and relationships in a database; animations and transitions in a presentation.</p>`,
      async on(a) { a.setApp('ss'); a.go(2); },
    },
    {
      title: '4 Refine',
      text: `<p><b>Refine</b> means making changes to improve it: chart features and absolute referencing, spell check and thesaurus, queries and validation, notes and timings.</p>`,
      async on(a) { a.setApp('ss'); a.go(3); },
    },
    {
      title: '5 Format',
      text: `<p><b>Format</b> it to meet the needs of your design: style, size, emphasis and colour; cell, column, row and sheet formats; print layout; reports; master slides; and finally export or publish.</p>`,
      tip: 'Try it: choose another application and step through the five stages.',
      async on(a, ctx) { a.setApp('ss'); a.go(4); if (!(await ctx.sleep(2200))) return; a.setApp('wp'); for (let i = 0; i < 5; i++) { a.go(i); if (!(await ctx.sleep(1300))) return; } },
    },
  ],
});

FD.check({
  section: 'process',
  items: [
    { type: 'mcq', q: 'What does <b>refine</b> mean?', opts: ['Make changes to improve something', 'Type data into a table', 'Number each page', 'Print a document'], why: 'Spell check, queries, chart features and timings are refining features.' },
    { type: 'mcq', q: 'What is <b>pagination</b>?', opts: ['Giving a number to each page of a document', 'Adding a caption to an image', 'Sorting records', 'Choosing a font'], why: 'It is an organising feature of a word processor.' },
    { type: 'sort', q: 'At which stage is each spreadsheet feature used (Table 13.3)?', bins: ['Organise', 'Develop', 'Refine', 'Format'], rows: [['Sort and filter', 0], ['Functions and formulae', 1], ['Absolute referencing', 2], ['Print layout', 3]], why: 'Enter → organise → develop → refine → format.' },
  ],
});
