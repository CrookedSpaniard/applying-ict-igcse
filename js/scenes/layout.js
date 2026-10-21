FD.add({
  id: 'layout',
  title: 'Purpose, user and layout',
  tab: 'Layout',
  icon: 'layout',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Purpose', 'What something (such as a digital product) is required to do.'],
    ['Layout', 'The way in which text and/or images appear on a page.'],
    ['White space', 'The part of a page or digital product that is left blank.'],
    ['Digital assets', 'Content used in a digital product, such as digital images.'],
  ],
  mount(el) {
    const RUN = [['09:30', 'Registration'], ['10:30', 'Men'], ['11:30', 'Women'], ['12:30', 'Boys'], ['13:30', 'Girls'], ['14:30', 'Seniors']];
    const LOGO = '<span class="ly-logo">🏄 SURF CUP</span>';
    el.innerHTML = `
      <div class="sim ly-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="user">🎯 Purpose and user</button><button data-p="lay">🗂️ Layouts</button><button data-p="ws">⬜ White space</button><button data-p="tpl">📄 Templates</button>
        </div>

        <div data-panel="user" class="sim">
          <div class="seg" id="uSeg"><span class="seg-l">The poster is for…</span><button data-v="kids">👧 Children (8–11)</button><button data-v="adults">🧑 Adults</button></div>
          <div class="ly-poster" id="uPoster"></div>
          <p class="verdict" id="uMsg"></p>
        </div>

        <div data-panel="lay" class="sim" hidden>
          <div class="seg" id="lSeg"><button data-v="slide">📽️ Presentation slide</button><button data-v="memo">📝 Memo</button><button data-v="poster">🖼️ Poster</button></div>
          <div class="ly-stage" id="lStage"></div>
          <div class="seg" id="wSeg" hidden><span class="seg-l">Image and text</span><button data-v="none">Image on its own line</button><button data-v="wrap">Text flows around the image</button></div>
          <p class="note" id="lMsg"></p>
        </div>

        <div data-panel="ws" class="sim" hidden>
          <label class="rng">White space <input type="range" id="ws" min="0" max="100" value="50"><b id="wsV"></b></label>
          <div class="ly-fair" id="fair">
            <h4 class="f-t">School fair</h4><p class="f-d">Saturday 24th May</p>
            <div class="f-img">🎪🎈🍰</div>
            <p class="f-x">Prizes · Stalls · Games · Fun</p>
            <p class="f-x">In the school hall: come through the main doors and turn left, then right.</p>
          </div>
          <p class="verdict" id="wsMsg"></p>
        </div>

        <div data-panel="tpl" class="sim" hidden>
          <div class="ly-tpls">${[['blank', 'Blank document'], ['letter', 'Formal letter'], ['cv', 'CV'], ['flyer', 'Event flyer']].map(([k, n]) => `<button class="ly-tpl" data-t="${k}"><span class="ly-thumb t-${k}"><i></i><i></i><i></i><i></i></span>${n}</button>`).join('')}</div>
          <div class="ly-page" id="tPage"></div>
        </div>
      </div>`;
    const root = el.querySelector('.ly-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    function user(k) {
      FD.segSet($('#uSeg'), k);
      $('#uPoster').className = 'ly-poster ' + k;
      $('#uPoster').innerHTML = k === 'kids'
        ? `<h4>Learn to surf! 🌊</h4><p class="big">Fun lessons for 8–11 year olds</p><div class="emo-row">🏄‍♀️ 🐬 ☀️ 🦀</div><p>Saturday mornings · Bring a friend!</p>`
        : `<h4>Surf Cup 2026</h4><p class="big">Open competition · six categories</p><p>Registration 09:30 · Entry £15 · Prizes for each category</p><p class="small">Full rules and running order online.</p>`;
      $('#uMsg').className = 'verdict good';
      $('#uMsg').innerHTML = k === 'kids' ? '✓ For children: a playful style, big friendly text, pictures and few words.' : '✓ For adults: a calmer style with more detail (times, prices, rules).';
    }
    $('#uSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) user(b.dataset.v); });

    let lay = 'slide', wrap = 'none';
    function layout(k) {
      lay = k; FD.segSet($('#lSeg'), k);
      $('#wSeg').hidden = k !== 'poster';
      const st = $('#lStage');
      st.className = 'ly-stage ' + k;
      if (k === 'slide') {
        st.innerHTML = `<div class="ly-slide"><div class="ly-sl-l">${LOGO}<p class="ly-ro">Running order</p>${RUN.map(([t, n]) => `<p><b>${t}</b> ${n}</p>`).join('')}</div><div class="ly-sl-r">🌅🏄</div></div>`;
        $('#lMsg').innerHTML = 'A <b>presentation</b> slide: few words, large text, a big image, designed to be seen from far away.';
      } else if (k === 'memo') {
        st.innerHTML = `<div class="ly-memo">${LOGO}<h4>Memo</h4><table>${[['To:', 'Communications team'], ['From:', 'Lee Singh'], ['CC:', 'Marketing team'], ['Date:', '30th December'], ['Subject:', 'Letter to entrants']].map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</table><p>The letters need to go out today. Please send them with my signature. Thanks, Lee</p></div>`;
        $('#lMsg').innerHTML = 'A <b>memo</b>: the same organisation, but text set out in a fixed table of To / From / CC / Date / Subject.';
      } else {
        poster();
        $('#lMsg').innerHTML = 'A <b>poster</b>: the title and logo at the top, and text and images set out differently again.';
      }
    }
    function poster() {
      $('#lStage').innerHTML = `<div class="ly-pos ${wrap}">${LOGO}<h4>Surf Cup · 12 July</h4><div class="ly-pimg">🏄</div><p>Six categories, from boys and girls to seniors. Registration opens at 09:30 on the beach next to the lifeguard tower. Bring your own board, a wetsuit and plenty of water. Prizes for the top three in every category, and food stalls all day.</p></div>`;
    }
    function setWrap(k) { wrap = k; FD.segSet($('#wSeg'), k); if (lay === 'poster') poster(); }
    $('#lSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) layout(b.dataset.v); });
    $('#wSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setWrap(b.dataset.v); });

    function space(v) {
      v = +v; $('#ws').value = v;
      const f = $('#fair');
      const pad = 0.4 + v * 0.05, img = 3.4 - v * 0.022, fs = 1.9 - v * 0.012;
      f.style.setProperty('--pad', pad + 'rem'); f.style.setProperty('--img', Math.max(1.2, img) + 'rem'); f.style.setProperty('--fs', fs + 'rem');
      f.classList.toggle('crowded', v < 25); f.classList.toggle('empty', v > 75);
      $('#wsV').textContent = v < 25 ? 'too little' : v > 75 ? 'too much' : 'about right';
      const m = $('#wsMsg');
      if (v > 75) { m.className = 'verdict bad'; m.innerHTML = '✗ <b>Too much white space</b> (Figure 13.4): the product looks empty and the digital assets are isolated.'; }
      else if (v < 25) { m.className = 'verdict bad'; m.innerHTML = '✗ <b>Too little white space</b> (Figure 13.5): the product looks too full and confusing.'; }
      else { m.className = 'verdict good'; m.innerHTML = '✓ Good use of white space: no large empty areas, and the information is not packed too tightly.'; }
    }
    $('#ws').addEventListener('input', (e) => space(e.target.value));

    const TPL = {
      blank: '<p class="note">An empty page: you decide where everything goes.</p>',
      letter: '<div class="tp-letter"><p class="tp-r">Your address<br>Date</p><p>Recipient’s name and address</p><p>Dear …,</p><p class="tp-lines"><i></i><i></i><i></i></p><p>Yours sincerely,<br><br>Your name</p></div>',
      cv: '<div class="tp-cv"><h4>Your name</h4><p class="small">Email · Phone</p><h5>Education</h5><p class="tp-lines"><i></i><i></i></p><h5>Experience</h5><p class="tp-lines"><i></i><i></i></p><h5>Skills</h5><p class="tp-lines"><i></i></p></div>',
      flyer: '<div class="tp-fly"><h4>EVENT TITLE</h4><div class="tp-img">🖼️</div><p>Date · Time · Place</p><p class="tp-lines"><i></i><i></i></p></div>',
    };
    function tpl(k) { root.querySelectorAll('.ly-tpl').forEach((b) => b.classList.toggle('on', b.dataset.t === k)); $('#tPage').innerHTML = TPL[k]; }
    root.querySelectorAll('.ly-tpl').forEach((b) => b.addEventListener('click', () => tpl(b.dataset.t)));

    function reset() { user('kids'); wrap = 'none'; FD.segSet($('#wSeg'), 'none'); layout('slide'); space(50); tpl('letter'); }
    show('user'); reset();
    return { show, user, layout, setWrap, space, tpl, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Purpose',
      text: `<p>When you use application software to create digital products, you combine and organise information to achieve a <strong>purpose</strong>: what the product is required to do.</p>
             <p>At every stage, ask yourself: <b>does this product meet the needs of the task?</b></p>`,
      async on(a) { a.reset(); a.show('user'); },
    },
    {
      title: 'User',
      text: `<p>Your <b>users</b> are the people who will use or view the digital product. A product designed for <b>children</b> is likely to use a different style from one designed for <b>adults</b>.</p>
             <p>Check that the product is fit for purpose <i>and</i> fit for the intended user.</p>`,
      tip: 'Try it: switch between the two users.',
      async on(a, ctx) { a.show('user'); a.user('kids'); if (!(await ctx.sleep(1800))) return; a.user('adults'); },
    },
    {
      title: 'Layouts',
      text: `<p>Different types of digital products use different <strong>layouts</strong>: the way text and images appear on a page.</p>
             <p>A presentation, a memo and a poster all set out text and images differently (Figure 13.2).</p>`,
      async on(a, ctx) { a.show('lay'); for (const k of ['slide', 'memo', 'poster']) { a.layout(k); if (!(await ctx.sleep(1700))) return; } },
    },
    {
      title: 'Title, logo and images',
      text: `<p><b>Title and logo position:</b> titles and logos are usually placed at the <b>top</b>.</p>
             <p><b>Images:</b> consider the overall appearance. If images appear with text, the text can be made to <b>flow around</b> or through the images.</p>`,
      tip: 'Try it: make the text flow around the image.',
      async on(a, ctx) { a.show('lay'); a.layout('poster'); a.setWrap('none'); if (!(await ctx.sleep(1600))) return; a.setWrap('wrap'); },
    },
    {
      title: 'White space',
      text: `<p>Good use of <strong>white space</strong> means not leaving large amounts of empty space, but also leaving enough space so the information is not packed too tightly.</p>
             <p>Too much makes a product look empty, with <strong>digital assets</strong> isolated. Too little makes it look too full and confusing.</p>`,
      tip: 'Try it: drag the slider to both ends.',
      async on(a, ctx) { a.show('ws'); a.space(50); if (!(await ctx.sleep(1300))) return; await FD.tween(1300, (t) => a.space(Math.round(50 + 45 * t))); if (!(await ctx.sleep(1300))) return; await FD.tween(1800, (t) => a.space(Math.round(95 - 90 * t))); if (!(await ctx.sleep(1300))) return; a.space(50); },
    },
    {
      title: 'Document styles and templates',
      text: `<p><b>Document styles:</b> some word-processed documents, such as formal letters, arrange information in specific ways.</p>
             <p>Some applications provide <b>templates</b> to help you lay out your information (Figure 13.6).</p>`,
      tip: 'Try it: open each template.',
      async on(a, ctx) { a.show('tpl'); for (const k of ['letter', 'cv', 'flyer']) { a.tpl(k); if (!(await ctx.sleep(1500))) return; } },
    },
  ],
});

FD.check({
  section: 'layout',
  items: [
    { type: 'mcq', q: 'What is the <b>purpose</b> of a digital product?', opts: ['What it is required to do', 'The software used to make it', 'The colour of its background', 'The number of pages'], why: 'Ask at every stage whether the product meets the needs of the task.' },
    { type: 'mcq', q: 'Where are titles and logos usually placed?', opts: ['At the top', 'At the bottom', 'In the middle of the text', 'Only on the last page'], why: 'One of the elements to consider when laying out information.' },
    { type: 'sort', q: 'Too much or too little white space?', bins: ['Too much', 'Too little'], rows: [['The product looks empty', 0], ['The product looks too full and confusing', 1], ['Digital assets look isolated', 0], ['Information is packed too tightly', 1]], why: 'See Figures 13.4 and 13.5.' },
    { type: 'tf', q: 'A product for children should use exactly the same style as one for adults.', a: false, why: 'Check the product is fit for the intended user.' },
  ],
});
