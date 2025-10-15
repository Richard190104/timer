(function(){
  window.GAME_REGISTRY = window.GAME_REGISTRY || {};

  async function init(canvas, opts) {
    // We'll render quiz UI inside the panel (not using canvas for text-heavy UI)
    const panel = canvas.parentElement || document.body;

    // load questions
    let questions = [];
    try {
      const res = await fetch('data/games/quiz_questions.json');
      questions = await res.json();
    } catch (e) {
      panel.appendChild(Object.assign(document.createElement('div'), { innerText: 'Nepodarilo sa načítať otázky.' }));
      return { stop: () => {} };
    }

    let idx = 0; let score = 0;

    // UI elements
    const container = document.createElement('div');
    container.style.padding = '8px'; container.style.color='#fff';

    const qEl = document.createElement('div'); qEl.style.marginBottom='8px'; qEl.style.fontSize='16px';
    const choicesEl = document.createElement('div'); choicesEl.style.display='grid'; choicesEl.style.gridTemplateColumns='1fr'; choicesEl.style.gap='6px';
    const nav = document.createElement('div'); nav.style.marginTop='10px'; nav.style.display='flex'; nav.style.justifyContent='space-between';
    const btnNext = document.createElement('button'); btnNext.innerText='Ďalšia'; btnNext.className='btn-small';
    const btnClose = document.createElement('button'); btnClose.innerText='Ukončiť'; btnClose.className='btn-small';
    const scoreEl = document.createElement('div'); scoreEl.style.marginTop='8px'; scoreEl.innerText = 'Skóre: 0';

    nav.appendChild(btnClose); nav.appendChild(btnNext);
    container.appendChild(qEl); container.appendChild(choicesEl); container.appendChild(nav); container.appendChild(scoreEl);

    panel.appendChild(container);

    function renderQuestion() {
      const q = questions[idx];
      qEl.innerText = (idx+1) + '. ' + q.q;
      choicesEl.innerHTML = '';
      q.choices.forEach((c, i) => {
        const b = document.createElement('button'); b.className='btn-small'; b.innerText = c; b.dataset.i = i;
        b.addEventListener('click', () => {
          if (b.disabled) return;
          b.disabled = true;
          const correct = (i === q.a);
          if (correct) { score += 1; scoreEl.innerText = 'Skóre: ' + score; b.style.background = '#2a8'; }
          else { b.style.background = '#b44'; }
          // reveal correct
          const buttons = choicesEl.querySelectorAll('button');
          buttons.forEach(btn => { btn.disabled = true; if (parseInt(btn.dataset.i,10) === q.a) btn.style.border = '2px solid #2a8'; });
        });
        choicesEl.appendChild(b);
      });
    }

    btnNext.addEventListener('click', () => {
      idx++;
      if (idx >= questions.length) {
        // finish
        qEl.innerText = 'Koniec kvízu. Skóre: ' + score + ' / ' + questions.length;
        choicesEl.innerHTML = '';
        btnNext.disabled = true;
        // store best
        try { const k = 'quiz_best_score'; const v = localStorage.getItem(k); const best = v?parseInt(v,10)||0:0; if (score > best) localStorage.setItem(k, String(score)); } catch (e) {}
        return;
      }
      renderQuestion();
    });

    btnClose.addEventListener('click', () => {
      cleanup();
    });

    function cleanup() {
      container.remove();
    }

    renderQuestion();

    return { stop: cleanup };
  }

  window.GAME_REGISTRY['Quiz'] = { init };
})();
