

fetch("https://timer-backend-24n3.vercel.app/api/hello").then(res => res.json()).then(data => {
    if (data.access == 'denied') {
        document.querySelector(".time").appendChild(createTimesBlock(data.days,"days"));
        document.querySelector(".time").appendChild(createTimesBlock(data.hours,"hours"));
        document.querySelector(".time").appendChild(createTimesBlock(data.minutes,"minutes"));
        document.querySelector(".time").appendChild(createTimesBlock(data.seconds,"seconds"));
    } else {
        document.querySelector(".time").innerText = data.message;
    }
    fetch("https://timer-backend-24n3.vercel.app/api/getTask").then(res => res.json()).then(data => {
    if (data.message) {
        const taskT = data.message;
        document.querySelector(".seconds-text").addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'task-overlay';

        const panel = document.createElement('div');
        panel.className = 'task-panel';

        const taskText = document.createElement('div');
        taskText.className = 'task-text';
        taskText.innerText = taskT;

                const editorToolbar = document.createElement('div');
                editorToolbar.className = 'editor-toolbar';
                const runHint = document.createElement('div'); runHint.innerText = 'Editor'; runHint.style.fontWeight = '600'; runHint.style.color = '#fff';
                const btnFormat = document.createElement('button'); btnFormat.className = 'toolbar-btn'; btnFormat.innerText = 'Format';
                const toolbarRight = document.createElement('div'); toolbarRight.className = 'toolbar-right';
                editorToolbar.appendChild(runHint); editorToolbar.appendChild(btnFormat);  editorToolbar.appendChild(toolbarRight);

                const editorWrap = document.createElement('div'); editorWrap.className = 'editor-wrap';
                const gutter = document.createElement('div'); gutter.className = 'editor-gutter';
                const gutterInner = document.createElement('div'); gutter.appendChild(gutterInner);
                const textarea = document.createElement('textarea');
                textarea.className = 'editor task-input'; textarea.rows = 12; textarea.wrap = 'off';
                textarea.value = (data.CommentedText + "\n" || '') ;
                try { textarea.tabIndex = 0; textarea.removeAttribute('disabled'); } catch(e){}
                if (data.completed) textarea.value = '// táto úloha bola dokončená\n' + textarea.value;
                editorWrap.appendChild(gutter); editorWrap.appendChild(textarea);

                panel.appendChild(taskText);
                panel.appendChild(editorToolbar);
                panel.appendChild(editorWrap);

                function updateGutterForText(text) {
                    const lines = (String(text).match(/\n/g) || []).length + 1;
                    let out = '';
                    for (let i = 1; i <= lines; i++) out += '<div>' + i + '</div>';
                    gutterInner.innerHTML = out;
                }
                updateGutterForText(textarea.value);

                textarea.addEventListener('input', () => { updateGutterForText(textarea.value); });

                let currentTab = 2;
                btnFormat.addEventListener('click', () => {
                    const lines = textarea.value.split(/\r?\n/);
                    const formatted = lines.map(l => l.replace(/\t/g, ' '.repeat(currentTab))).join('\n');
                    textarea.value = formatted; updateGutterForText(textarea.value);
                    if (window.__cmInstance && typeof window.__cmInstance.setValue === 'function') {
                        window.__cmInstance.setValue(formatted);
                    }
                });

                let __localCmInstance = null;
                function attachPreloadedCodeMirror() {
                    if (!window.CodeMirror) return;
                    try {
                        try { if (window.__cmInstance && typeof window.__cmInstance.toTextArea === 'function') { window.__cmInstance.toTextArea(); window.__cmInstance = null; } } catch(e){}
                        const cm = window.CodeMirror.fromTextArea(textarea, {
                            mode: 'javascript', theme: 'material-darker', lineNumbers: true, tabSize: currentTab, indentWithTabs: false
                        });
                        __localCmInstance = cm;
                        window.__cmInstance = cm; 
                        try { gutter.style.display = 'none'; } catch(e){}
                        cm.on('change', () => { updateGutterForText(cm.getValue()); });
                        try { if ((!cm.getValue() || cm.getValue().trim() === '') && textarea.value) cm.setValue(textarea.value); } catch(e){}
                        try { cm.refresh && cm.refresh(); } catch(e){}
                        try { cm.setOption && cm.setOption('readOnly', false); } catch(e){}
                        updateGutterForText(cm.getValue());
                        try {
                            const lastLine = cm.lastLine();
                            cm.setCursor({ line: lastLine, ch: 0 });
                                try { const sc = (cm.getScrollerElement ? cm.getScrollerElement() : cm.getWrapperElement && cm.getWrapperElement()); if (sc) sc.scrollLeft = 0; } catch(e){}
                            cm.focus();
                        } catch(e) { try { cm.focus(); } catch(e){} }
                    } catch (e) { console.warn('Failed to attach CodeMirror:', e); }
                }

        const btnRow = document.createElement('div');
        btnRow.className = 'task-btn-row';

        const submitBtn = document.createElement('button');
        submitBtn.innerText = 'Submit';
        submitBtn.className = 'btn-small';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Close';
        closeBtn.className = 'btn-small';

        btnRow.appendChild(submitBtn);
        btnRow.appendChild(closeBtn);

    const resultDiv = document.createElement('pre');
    resultDiv.className = 'task-result';
    resultDiv.style.whiteSpace = 'pre-wrap';
    resultDiv.style.maxHeight = '80px';
    resultDiv.style.overflow = 'auto';
    panel.appendChild(resultDiv);

    function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function appendLine(text, kind) {
        const ts = new Date().toLocaleTimeString();
        const safe = escapeHtml(text);
        if (kind === 'error') {
            resultDiv.innerHTML += `<div class="result-line error" style="color:#ff6b6b">[${ts}] ${safe}</div>`;
        } else if (kind === 'ok') {
            resultDiv.innerHTML += `<div class="result-line ok" style="color:#7ee787">[${ts}] ${safe}</div>`;
        } else {
            resultDiv.innerHTML += `<div class="result-line info">[${ts}] ${safe}</div>`;
        }
        resultDiv.scrollTop = resultDiv.scrollHeight;
    }
        panel.appendChild(btnRow);
        overlay.appendChild(panel);
    document.body.appendChild(overlay);
    try { attachPreloadedCodeMirror(); } catch(e) {}

    setTimeout(() => {
        try {
            if (window.__cmInstance && typeof window.__cmInstance.getValue === 'function') {
                const cm = window.__cmInstance;
                try {
                    const lastLine = cm.lastLine();
                    cm.setCursor({ line: lastLine, ch: 0 });
                        try { const sc = (cm.getScrollerElement ? cm.getScrollerElement() : cm.getWrapperElement && cm.getWrapperElement()); if (sc) sc.scrollLeft = 0; } catch(e){}
                    cm.focus();
                } catch (e) { cm.focus && cm.focus(); }
            } else {
                textarea.selectionStart = textarea.selectionEnd = 0;
                textarea.focus();
                    try { textarea.scrollLeft = 0; } catch(e){}
            }
        } catch (e) { }
    }, 60);

        closeBtn.addEventListener('click', () => {
            try { if (__localCmInstance && typeof __localCmInstance.toTextArea === 'function') { __localCmInstance.toTextArea(); } if (window.__cmInstance) delete window.__cmInstance; } catch(e){}
            try { gutter.style.display = ''; } catch(e){}
            overlay.remove();
        });
        setTimeout(() => {
            try {
                if (window.__cmInstance && typeof window.__cmInstance.focus === 'function') window.__cmInstance.focus();
                else textarea.focus();
            } catch (e) { try { textarea.focus(); } catch(e){} }
        }, 150);
        submitBtn.addEventListener('click', async () => {
            submitBtn.disabled = true;
            resultDiv.innerHTML = '';

            try {
                const code = (window.__cmInstance && typeof window.__cmInstance.getValue === 'function') ? window.__cmInstance.getValue() : (textarea.value || '');

                let wrapped;
                try {
                    wrapped = new Function('return (async function(){\n' + code + '\n})()');
                } catch (compileErr) {
                    const lines = code.split(/\r?\n/);
                    const numbered = lines.map((ln, i) => (String(i+1).padStart(3,' ') + ' | ' + ln)).join('\n');
                    appendLine('Syntax/Parse error while compiling your code:', 'error');
                    appendLine(String(compileErr), 'error');
                    const blob = document.createElement('pre'); blob.className = 'result-code'; blob.textContent = numbered; resultDiv.appendChild(blob);
                    return;
                }

                const logs = [];
                // helper to format arguments for logging (handles Error, Response, circular objects)
                const getCircularReplacer = () => {
                    const seen = new WeakSet();
                    return (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            if (seen.has(value)) return '[Circular]';
                            seen.add(value);
                        }
                        if (value instanceof Error) return { message: value.message, stack: value.stack };
                        return value;
                    };
                };
                const formatForLog = (v) => {
                    try {
                        if (v instanceof Error) return (v.stack || v.message || String(v));
                        if (typeof v === 'object' && v !== null) {
                            // Response objects: show status and statusText if possible
                            try {
                                if (v instanceof Response) return `Response { status: ${v.status} ${v.statusText} }`;
                            } catch (_) {}
                            try { return JSON.stringify(v, getCircularReplacer(), 2); } catch(e) { return String(v); }
                        }
                        return String(v);
                    } catch (e) { try { return String(v); } catch(e) { return '[unserializable]'; } }
                };
                const origConsoleLog = console.log;
                const origConsoleError = console.error;
                const origConsoleWarn = console.warn;
                // capture logs, errors and warnings so they appear in the UI
                console.log = (...args) => { try { logs.push(args.map(a => (typeof a === 'string' ? a : formatForLog(a))).join(' ')); } catch(e) { logs.push(String(args)); } origConsoleLog.apply(console, args); };
                console.error = (...args) => { try { logs.push(args.map(a => (typeof a === 'string' ? a : formatForLog(a))).join(' ')); } catch(e) { logs.push(String(args)); } origConsoleError && origConsoleError.apply(console, args); };
                console.warn = (...args) => { try { logs.push(args.map(a => (typeof a === 'string' ? a : formatForLog(a))).join(' ')); } catch(e) { logs.push(String(args)); } origConsoleWarn && origConsoleWarn.apply(console, args); };

                let executionResult = null;
                try {
                    const res = await wrapped();
                    // small delay to allow any `.then()` handlers or microtasks to run and log
                    try { await new Promise(r => setTimeout(r, 250)); } catch(e){}
                    if (logs.length) { logs.forEach(l => appendLine(l, 'info')); }
                    if (res !== undefined) appendLine('Result: ' + (typeof res === 'string' ? res : JSON.stringify(res)), 'ok');
                    if (!logs.length && res === undefined) appendLine('Executed (no result)', 'info');
                    executionResult = { ok: true, logs: logs, result: res };
                } catch (err) {
                    const errMsg = (err && err.stack) ? err.stack : String(err);
                    appendLine('Runtime error:', 'error'); appendLine(errMsg, 'error');
                    executionResult = { ok: false, error: errMsg, logs: logs };
                } finally {
                    // restore console methods
                    try { console.log = origConsoleLog; } catch(e){}
                    try { console.error = origConsoleError; } catch(e){}
                    try { console.warn = origConsoleWarn; } catch(e){}
                }

                try {
                    let numericValue = null;
                    if (executionResult) {
                        const r = executionResult.result;
                        if (typeof r === 'number' && !Number.isNaN(r)) numericValue = r;
                        else if (typeof r === 'string' && r.trim() !== '' && !Number.isNaN(Number(r.trim()))) numericValue = Number(r.trim());
                        if (numericValue === null && Array.isArray(executionResult.logs) && executionResult.logs.length) {
                            const last = executionResult.logs[executionResult.logs.length - 1];
                            if (last != null && !Number.isNaN(Number(String(last).trim()))) numericValue = Number(String(last).trim());
                        }
                    }

                    if (numericValue === null) {
                        appendLine('Not sent: could not extract numeric value to check. Return or console.log a number to send it automatically.', 'info');
                    } else {
                        const payload = { value: numericValue };
                        const resp = await fetch('https://timer-backend-24n3.vercel.app/api/checkAnswerw', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                        });
                        let parsed = null; try { parsed = await resp.json(); } catch(e){ parsed = { status: resp.status }; }
                        appendLine('Server response: ' + JSON.stringify(parsed), 'info');
                        if (parsed.correct) { appendLine('Correct answer!', 'ok'); }
                        else { appendLine('Incorrect answer.', 'error'); }
                    }
                } catch (e) {
                    resultDiv.innerText += '\n\nFailed to send result: ' + String(e);
                }
            } finally {
                submitBtn.disabled = false;
            }
        });
});
    }
});

});

setInterval(() => {
    fetch("https://timer-backend-24n3.vercel.app/api/hello").then(res => res.json()).then(data => {
        if (data.access == 'denied') {
            document.querySelector(".days-text").innerText = data.days;
            document.querySelector(".hours-text").innerText = data.hours;
            document.querySelector(".minutes-text").innerText = data.minutes;
            document.querySelector(".seconds-text").innerText = data.seconds;
        } else {
            document.querySelector(".time").innerText = data.message;
        }
    });
}, 1000);


function createTimesBlock(text, description) {
    var timeBlock = document.createElement("div");
    timeBlock.classList.add(`time-block`);
    var txt = document.createElement("h3");
    txt.innerText = text;
    txt.classList.add(`${description}-text`);
    var desc = document.createElement("p");
    desc.innerText = description;
    timeBlock.appendChild(txt);
    timeBlock.appendChild(desc);
    return timeBlock;
}

function displayInformation() {
    if (document.querySelector('.info-overlay')) return;

    const availableGames = [
        { name: 'Dino Runner', id: 'Dino', script: 'data/games/dino.js' },
        { name: 'Clicker', id: 'Clicker', script: 'data/games/clicker.js' },
        { name: 'Cannon Shooter', id: 'Cannon', script: 'data/games/cannon.js' },
        { name: 'Quiz', id: 'Quiz', script: 'data/games/quiz.js' }
    ];

    const overlay = document.createElement('div'); overlay.className = 'info-overlay';
    const panel = document.createElement('div'); panel.className = 'info-panel';
    const title = document.createElement('h4'); title.innerText = 'O nvmkolkocasu tam pise sa ti zobrazi co znamena KJNTSSNP. \n Zahraj si daco kym cakas sak doraz to bude.\n\n Kazdy mesiac ti pridam nejaku hru ktoru musis dohrat v ten mesiac, inak sa ti cakanie predlzi o mesiac. Tieto co tam su teraz su fixne, tie dohravat nemusis to len kym cakas nech sa nenudis. Mesacna sa zobrazi na hlavnej stranke. Zacina sa 1.11 :D. \n\n Also kazdy den (ked budem stihat) budem pridavat dajaky fun text alebo info alebo ulohy takze dojdi sa pozriet. Za ulohy mozes dostat skratenie casu, ale len za specialne ktore budu v nedelu a ked ich vyriesis dobre. Tie su tiez na main page ale na to musis kliknut na sekundy. :D';
    const list = document.createElement('div'); list.style.display = 'flex'; list.style.flexDirection = 'column'; list.style.gap = '8px';
    const closeBtn = document.createElement('button'); closeBtn.className = 'btn-small'; closeBtn.innerText = 'Close';

    panel.appendChild(title); panel.appendChild(list); panel.appendChild(closeBtn); overlay.appendChild(panel); document.body.appendChild(overlay);



    function loadScriptOnce(src) {
        return new Promise((resolve, reject) => {
            const existing = Array.from(document.scripts).find(s => s.src && s.src.endsWith(src));
            if (existing) return resolve();
            const script = document.createElement('script'); script.src = src;
            script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(script);
        });
    }

    function showGameUI(gameMeta) {
        list.classList.add('hidden'); title.innerText = gameMeta.name;
        const canvas = document.createElement('canvas'); canvas.className = 'game-canvas'; canvas.width = 360; canvas.height = 100;
        const controls = document.createElement('div'); controls.className = 'game-controls';
        const btnBack = document.createElement('button'); btnBack.className = 'btn-small'; btnBack.innerText = 'Back to games';
        const btnClose = document.createElement('button'); btnClose.className = 'btn-small'; btnClose.innerText = 'Close';
        controls.appendChild(btnBack); controls.appendChild(btnClose); panel.appendChild(canvas); panel.appendChild(controls);

        let gameInstance = null;
        function cleanupAndBack() {
            if (gameInstance && typeof gameInstance.stop === 'function') { try { gameInstance.stop(); } catch (e) {} }
            canvas.remove(); controls.remove(); list.classList.remove('hidden'); title.innerText = 'You can play while waiting';
        }
        btnBack.addEventListener('click', cleanupAndBack); btnClose.addEventListener('click', () => overlay.remove());

        const reg = window.GAME_REGISTRY && window.GAME_REGISTRY[gameMeta.id];
        if (reg && typeof reg.init === 'function') {
            try { gameInstance = reg.init(canvas, { onExit: cleanupAndBack }); } catch (err) { console.error(err); cleanupAndBack(); }
        } else { console.error('Game not registered:', gameMeta.id); cleanupAndBack(); }
    }

    availableGames.forEach(g => {
        const row = document.createElement('div'); row.className = 'game-row';
        const name = document.createElement('div'); name.className = 'game-name'; name.innerText = g.name;
        const playBtn = document.createElement('button'); playBtn.className = 'btn-small'; playBtn.innerText = 'Play';
        playBtn.addEventListener('click', async () => {
            try { await loadScriptOnce(g.script); setTimeout(() => showGameUI(g), 50); } catch (err) { console.error(err); alert('Failed to load game. See console.'); }
        });
        row.appendChild(name); row.appendChild(playBtn); list.appendChild(row);
    });

    closeBtn.addEventListener('click', () => overlay.remove());
}
let audioInstance = new Audio('data/songs/Las Ketchup - Asereje.mp3');
let isPlaying = false;

function playSong() {
    document.querySelector('.sound-btn span').innerText = isPlaying ? 'Pusti si pesnicku' : 'Dobra ne? xdddddd';
    if (!isPlaying) {
        audioInstance.play();
        isPlaying = true;
        audioInstance.onended = () => { isPlaying = false;};
    } else if (audioInstance) {
        audioInstance.pause();
        isPlaying = false;
    }
}

