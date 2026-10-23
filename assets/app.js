// Studijní prostředí UJEP × DataTimes. Nic se nikam neposílá, pamatuje si to jen tento prohlížeč.

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* soukromé okno apod. */ }
}

// Úkoly k odškrtnutí
document.querySelectorAll('.tasks[data-store]').forEach((list) => {
  const key = list.dataset.store;
  const done = load(key);
  list.querySelectorAll('li[data-id]').forEach((li) => {
    const box = li.querySelector('input[type=checkbox]');
    box.checked = Boolean(done[li.dataset.id]);
    li.classList.toggle('checked', box.checked);
    box.addEventListener('change', () => {
      done[li.dataset.id] = box.checked;
      li.classList.toggle('checked', box.checked);
      save(key, done);
    });
  });
});

// Zastávky (mikrokvízy): <fieldset class="qq" data-answer="1"> s tlačítky a <p class="why">
document.querySelectorAll('.quiz').forEach((quiz) => {
  const questions = quiz.querySelectorAll('.qq');
  const score = quiz.querySelector('.score');
  let right = 0;
  let answered = 0;
  questions.forEach((q) => {
    const buttons = q.querySelectorAll('button');
    // data-answer="all": správně je všechno, každá odpověď ukazuje něco jiného
    const all = q.dataset.answer === 'all';
    const correct = Number(q.dataset.answer);
    buttons.forEach((b, i) => {
      b.type = 'button';
      b.addEventListener('click', () => {
        if (q.classList.contains('done')) return;
        q.classList.add('done');
        if (all) buttons.forEach((x) => x.classList.add('right'));
        else buttons[correct].classList.add('right');
        if (all || i === correct) right++; else b.classList.add('wrong');
        answered++;
        if (score && answered === questions.length) {
          score.textContent = right === questions.length
            ? `${right} z ${questions.length}. Orientujete se, můžete dál.`
            : `${right} z ${questions.length}. Vraťte se k části, na kterou odkazuje vysvětlení, a pak pokračujte.`;
        }
      });
    });
  });
});

// Kalkulačka koalic: najde nejmenší koalice, které mají většinu
document.querySelectorAll('[data-coalition]').forEach((tool) => {
  const rows = [...tool.querySelectorAll('.seats input[type=text]')];
  const nums = [...tool.querySelectorAll('.seats input[type=number]')];
  const out = tool.querySelector('.coal-out');
  function run() {
    const parties = rows.map((r, i) => ({ name: r.value.trim(), seats: Number(nums[i].value) || 0 }))
      .filter((p) => p.name && p.seats > 0);
    const total = parties.reduce((s, p) => s + p.seats, 0);
    if (!total) { out.textContent = 'Vyplňte kandidátky a mandáty.'; return; }
    const majority = Math.floor(total / 2) + 1;
    const found = [];
    for (let mask = 1; mask < 1 << parties.length; mask++) {
      const members = parties.filter((_, i) => mask & (1 << i));
      const sum = members.reduce((s, p) => s + p.seats, 0);
      // minimální vítězná koalice: bez kteréhokoli člena by většinu ztratila
      if (sum >= majority && members.every((m) => sum - m.seats < majority)) {
        found.push({ members, sum });
      }
    }
    found.sort((a, b) => a.members.length - b.members.length || a.sum - b.sum);
    out.innerHTML = `<p>Zastupitelstvo má <b>${total}</b> členů, většina je <b>${majority}</b>. ` +
      `Nejmenší možné koalice (bez zbytečných partnerů):</p>` +
      (found.length ? found.map((c) => `<span class="ok">${c.members.map((m) => m.name).join(' + ')} = ${c.sum}</span>`).join('')
        : '<p>Žádná kombinace nemá většinu.</p>');
  }
  tool.addEventListener('input', run);
  run();
});

// Stavitel věty: z vyplněných polí složí první verzi zjištění
document.querySelectorAll('[data-sentence]').forEach((tool) => {
  const key = tool.dataset.sentence;
  const saved = load(key);
  const fields = tool.querySelectorAll('[data-f]');
  const draft = tool.querySelector('.draft');
  const v = (f) => (tool.querySelector(`[data-f="${f}"]`).value.trim() || `[${f}]`);
  function run() {
    const values = {};
    fields.forEach((el) => { values[el.dataset.f] = el.value; });
    save(key, values);
    draft.textContent = `V obci ${v('obec')} získala kandidátka ${v('kdo')} ${v('kolik')}. ` +
      `Ve srovnání s ${v('srovnani')} je to ${v('rozdil')}. ` +
      `Zdroj: ${v('zdroj')}. Pro čtenáře to je důležité, protože ${v('proc')}`;
  }
  fields.forEach((el) => { if (saved[el.dataset.f]) el.value = saved[el.dataset.f]; });
  tool.addEventListener('input', run);
  const copy = tool.querySelector('.copy');
  if (copy) copy.addEventListener('click', () => {
    navigator.clipboard?.writeText(draft.textContent).then(() => { copy.textContent = 'Zkopírováno'; });
  });
  run();
});

// Ukazatel, kolik kapitoly už je přečteno
const bar = document.querySelector('.progress');
if (bar) {
  const update = () => {
    const h = document.documentElement;
    bar.style.width = `${(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}
