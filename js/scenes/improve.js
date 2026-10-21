FD.add({
  id: 'improve',
  title: 'Strengths, weaknesses and suggested improvements',
  tab: 'Improve',
  icon: 'improve',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Perspective', 'A point of view or way of thinking about something, especially one that is influenced by the type of person you are or by your experiences.'],
    ['Legend', '(also known as a key) the words that explain a picture, graph or map.'],
  ],
  mount(el) {
    const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const V = [9900, 13900, 11000, 5500, 5900, 12000, 14000, 4400, 8900, 8000, 8900, 9400];
    const STR = ['Good choice of chart type', 'All months are present and clear', 'There is a title'];
    // Table 13.4: [key, weakness, improvement]
    const WK = [
      ['size', 'Title is quite small', 'Increase title size'],
      ['vs', 'Title does not need to contain ‘vs Month’, as months are given so it is obviously monthly income', 'Remove ‘vs Month’'],
      ['legend', 'Legend (key) is unnecessary', 'Remove legend'],
      ['cur', 'It is not clear what currency the income is in', 'Add currency'],
      ['axes', 'The x and y axes do not need labels as it is obvious that these are months and income is given in title', 'Remove labels from each axis'],
      ['year', 'It is not clear which year this relates to', 'Add year to title'],
    ];
    el.innerHTML = `
      <div class="sim im-s">
        <div class="im-grid">
          <div class="sim-box im-chart"><svg viewBox="0 0 420 270" id="chart" role="img" aria-label="Bar chart of income by month"></svg><p class="note im-cap" id="cap"></p></div>
          <div class="im-table">
            <table class="tbl im-tbl">
              <thead><tr><th colspan="2">Strengths</th></tr></thead>
              <tbody>${STR.map((s, i) => `<tr class="im-str" data-s="${i}"><td colspan="2">✓ ${s}</td></tr>`).join('')}</tbody>
              <thead><tr><th>Weakness</th><th>Suggested improvement</th></tr></thead>
              <tbody>${WK.map(([k, w, f]) => `<tr data-k="${k}"><td>${w}</td><td><button class="mini-btn im-fix" data-k="${k}">${f}</button></td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>
        <div class="chk-btns"><button class="btn primary" id="bAll">✨ Make all the changes</button><button class="btn ghost" id="bOrig">↺ Back to the original</button></div>
        <p class="verdict" id="iMsg"></p>
      </div>`;
    const root = el.querySelector('.im-s'), $ = (s) => root.querySelector(s);
    const on = {};

    function draw() {
      const X0 = on.axes ? 62 : 78, X1 = on.legend ? 410 : 330, Y0 = 34, Y1 = 196, max = 16000;
      const bw = (X1 - X0) / 12;
      const y = (v) => Y1 - ((Y1 - Y0) * v) / max;
      const title = (on.year ? '2016 income' : 'Income') + (on.vs ? '' : ' vs Month');
      const tick = (v) => (on.cur ? '£' + v.toLocaleString('en-GB') + '.00' : String(v));
      let g = `<text x="${(X0 + X1) / 2}" y="${on.size ? 22 : 18}" class="im-title" style="font-size:${on.size ? 17 : 10}px">${title}</text>`;
      for (let v = 0; v <= max; v += 4000) g += `<line x1="${X0}" y1="${y(v)}" x2="${X1}" y2="${y(v)}" class="im-grid-l"/><text x="${X0 - 5}" y="${y(v) + 3.5}" class="im-tick" text-anchor="end">${tick(v)}</text>`;
      g += V.map((v, i) => `<rect x="${X0 + i * bw + bw * 0.18}" y="${y(v)}" width="${bw * 0.64}" height="${Y1 - y(v)}" class="im-bar"/><text transform="translate(${X0 + i * bw + bw / 2 + 3} ${Y1 + 7}) rotate(-45)" class="im-tick" text-anchor="end">${M[i]}</text>`).join('');
      g += `<line x1="${X0}" y1="${Y1}" x2="${X1}" y2="${Y1}" class="im-ax"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="im-ax"/>`;
      if (!on.axes) g += `<text x="${(X0 + X1) / 2}" y="264" class="im-axl">Months</text><text transform="translate(14 ${(Y0 + Y1) / 2}) rotate(-90)" class="im-axl">Income</text>`;
      if (!on.legend) g += `<text x="${X1 + 12}" y="150" class="im-tick">Key</text><rect x="${X1 + 12}" y="156" width="12" height="12" class="im-bar"/><text x="${X1 + 28}" y="166" class="im-tick">– Income</text>`;
      $('#chart').innerHTML = g;
      WK.forEach(([k]) => { const r = root.querySelector(`tr[data-k="${k}"]`); r.classList.toggle('fixed', !!on[k]); r.querySelector('.im-fix').textContent = (on[k] ? '✓ ' : '') + WK.find((w) => w[0] === k)[2]; });
      const n = WK.filter(([k]) => on[k]).length;
      $('#cap').textContent = n === 0 ? 'Figure 13.22 The original graph' : n === WK.length ? 'Figure 13.23 The improved version of the graph with all changes made' : `${n} of ${WK.length} improvements made`;
      const m = $('#iMsg');
      m.className = 'verdict' + (n === WK.length ? ' good' : '');
      m.innerHTML = n === WK.length ? '✓ All the suggested improvements have been made. Compare it with the original: clearer, and it says what the money is and which year.' : n ? 'Keep going: make the other improvements.' : 'A friend reviewed this graph and identified its strengths and weaknesses (Table 13.4). Click an improvement to make it.';
    }
    function fix(k, v = true) { on[k] = v; draw(); }
    function strength(i) { root.querySelectorAll('.im-str').forEach((r) => r.classList.toggle('hl', i === 'all' || +r.dataset.s === i)); }
    function weak(k) { root.querySelectorAll('tr[data-k]').forEach((r) => r.classList.toggle('hl', [].concat(k).includes(r.dataset.k))); }
    root.querySelectorAll('.im-fix').forEach((b) => b.addEventListener('click', () => fix(b.dataset.k, !on[b.dataset.k])));
    async function all() { for (const [k] of WK) { if (!on[k]) { fix(k); await FD.wait(350); } } }
    $('#bAll').addEventListener('click', all);
    function reset() { WK.forEach(([k]) => { on[k] = false; }); strength(-1); weak([]); draw(); }
    $('#bOrig').addEventListener('click', reset);
    reset();
    return { fix, strength, weak, all, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Strengths and weaknesses',
      text: `<p>You can identify <b>strengths and weaknesses</b> in your own products. It is also a good idea to ask <b>others</b> to look at them.</p>
             <p>Other people look at your product from a different <strong>perspective</strong> and are not as biased as you may be about your own work.</p>`,
      async on(a) { a.reset(); },
    },
    {
      title: 'The strengths',
      text: `<p>Imagine you produced this graph (Figure 13.22). A friend has reviewed it. The strengths:</p>
             <ul><li>good choice of chart type</li><li>all months are present and clear</li><li>there is a title.</li></ul>`,
      async on(a, ctx) { a.weak([]); for (const i of [0, 1, 2]) { a.strength(i); if (!(await ctx.sleep(1000))) return; } a.strength('all'); },
    },
    {
      title: 'The title and the legend',
      text: `<p>Weaknesses: the title is quite small, and it does not need ‘vs Month’, as the months are shown.</p>
             <p>The <strong>legend</strong> (also known as a key) is unnecessary: there is only one set of data.</p>`,
      async on(a) { a.strength(-1); a.weak(['size', 'vs', 'legend']); },
    },
    {
      title: 'Currency, axis labels and year',
      text: `<p>It is not clear what <b>currency</b> the income is in, or which <b>year</b> it relates to.</p>
             <p>The x and y axes do not need labels, as it is obvious they are months and income.</p>`,
      async on(a) { a.strength(-1); a.weak(['cur', 'axes', 'year']); },
    },
    {
      title: 'Make the changes',
      text: `<p>Once potential improvements have been identified, it is important to <b>make those changes</b>. Figure 13.23 shows the improved version of the graph.</p>`,
      tip: 'Try it: switch each improvement on and off to compare.',
      async on(a) { a.weak([]); a.reset(); await a.all(); },
    },
  ],
});

FD.check({
  section: 'improve',
  items: [
    { type: 'mcq', q: 'Why is it a good idea to ask others to review your product?', opts: ['They look at it from a different perspective and are less biased', 'They will always say it is perfect', 'It saves you having to check it', 'They can change the requirements'], why: 'You may be biased about your own work.' },
    { type: 'mcq', q: 'What is a <b>legend</b> on a graph?', opts: ['The words that explain the graph (a key)', 'The title of the graph', 'The tallest bar', 'The y-axis'], why: 'In Figure 13.22 it was unnecessary: only one set of data.' },
    { type: 'sort', q: 'Strength or weakness of the original graph?', bins: ['Strength', 'Weakness'], rows: [['Good choice of chart type', 0], ['No currency shown', 1], ['There is a title', 0], ['It is not clear which year', 1]], why: 'See Table 13.4.' },
  ],
});
