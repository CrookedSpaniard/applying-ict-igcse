FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['software', 'Multimedia', 'A combination of more than one medium, such as audio and video together.'],
      ['data', 'Data', 'Raw numbers, text, sounds, images or animations, which are meaningless until they are processed.'],
      ['data', 'Information', 'Data that has been processed to be given context and meaning.'],
      ['data', 'Context', 'The circumstances or background of something, such as information or an event.'],
      ['types', 'Characters', 'The letters and symbols used to write text.'],
      ['types', 'Alphanumeric', 'Containing both letters and numbers.'],
      ['types', 'Metaphor', 'A figure of speech in which two things that are not literally similar are equated with one another.'],
      ['types', 'Semiotics', 'The interpretation of signs and symbols.'],
      ['process', 'Refine', 'Make changes to improve something.'],
      ['process', 'Pagination', 'The process of giving a number to each page of a book, magazine or document.'],
      ['layout', 'Purpose', 'What something (such as a digital product) is required to do.'],
      ['layout', 'Layout', 'The way in which text and/or images appear on a page.'],
      ['layout', 'White space', 'The part of a page or digital product that is left blank.'],
      ['layout', 'Digital assets', 'Content used in a digital product, such as digital images.'],
      ['house', 'House style', 'An organisation’s preferred style of writing and layout of content.'],
      ['house', 'Corporate identity', 'The way an organisation presents itself to the public.'],
      ['house', 'Branding', 'The distinctive design that identifies an organisation and its products.'],
      ['fonts', 'Serif font', 'A typeface that adds a short, flat line (a serif) to the ends of some letters, e.g. Times New Roman.'],
      ['fonts', 'Sans serif font', 'A typeface that does not add serifs to the ends of letters, e.g. Verdana.'],
      ['fonts', 'Aesthetics', 'The study of visual beauty, especially in art.'],
      ['colour', 'Monochrome', 'Using a range of shades of one colour.'],
      ['colour', 'Greyscale', 'Using a range of shades of grey.'],
      ['colour', 'Convey', 'Communicate or express something such as a message or an emotion.'],
      ['colour', 'Harmonious', 'Things that work well together or in harmony.'],
      ['colour', 'Colour wheel', 'A circle that shows the relationships between colours, with the primary colours (red, blue and yellow) evenly spaced and secondary and tertiary colours in between.'],
      ['colour', 'Complement', 'To make a good combination with something else; complementary colours are opposite each other on the wheel.'],
      ['colour', 'Analogous', 'Similar to another thing so a comparison can be made; analogous colours are next to each other on the wheel.'],
      ['colour', 'High contrast', 'Very different from each other.'],
      ['colour', 'Theme', 'A particular style.'],
      ['colour', 'Split-complementary colours', 'One colour, plus the colours that are analogous to its complement.'],
      ['access', 'Contrast', 'The degree of difference between the light and dark parts of an image.'],
      ['access', 'Colour-blind', 'Unable to see the difference between all or some colours.'],
      ['access', 'Distinguish', 'Recognise the difference or differences between two things.'],
      ['checking', 'Contextual error', 'A word that is spelled correctly but not used in the correct context, e.g. ‘there’ instead of ‘their’.'],
      ['checking', 'Proofreading', 'Reading your own work carefully to find errors that automated tools may miss.'],
      ['review', 'Iterative development', 'Improving products by regularly checking them against the requirements and being critical throughout the process.'],
      ['improve', 'Perspective', 'A point of view or way of thinking about something, influenced by the type of person you are or your experiences.'],
      ['improve', 'Legend', '(also known as a key) the words that explain a picture, graph or map.'],
      ['evaluation', 'Evaluation', 'The process of assessing something thoroughly.'],
      ['evaluation', 'Unique', 'The only one of its kind.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
