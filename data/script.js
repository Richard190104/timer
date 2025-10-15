

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

        const input = document.createElement('textarea');
        input.rows = 10;
        input.className = 'task-input';
        input.innerText = data.CommentedText;

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

        panel.appendChild(taskText);
        panel.appendChild(input);
    const resultDiv = document.createElement('pre');
    resultDiv.className = 'task-result';
    resultDiv.style.whiteSpace = 'pre-wrap';
    resultDiv.style.maxHeight = '200px';
    resultDiv.style.overflow = 'auto';
    panel.appendChild(resultDiv);
        panel.appendChild(btnRow);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        closeBtn.addEventListener('click', () => overlay.remove());
        submitBtn.addEventListener('click', async () => {
            const code = input.value || '';
            resultDiv.innerText = '';
            submitBtn.disabled = true;

            let wrapped;
            try {
                wrapped = new Function('return (async function(){\n' + code + '\n})()');
            } catch (compileErr) {
                const lines = code.split(/\r?\n/);
                const numbered = lines.map((ln, i) => (String(i+1).padStart(3,' ') + ' | ' + ln)).join('\n');
                resultDiv.innerText = 'Syntax/Parse error while compiling your code:\n' + String(compileErr) + '\n\nCode:\n' + numbered;
                submitBtn.disabled = false;
                return;
            }

            const logs = [];
            const origConsoleLog = console.log;
            console.log = (...args) => { try { logs.push(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')); } catch(e) { logs.push(String(args)); } origConsoleLog.apply(console, args); };

            let executionResult = null;

            try {
                const res = await wrapped();
                if (logs.length) resultDiv.innerText = logs.join('\n') + (res !== undefined ? '\nResult: ' + (typeof res === 'string' ? res : JSON.stringify(res)) : '');
                else resultDiv.innerText = res === undefined ? 'Executed (no result)' : 'Result: ' + (typeof res === 'string' ? res : JSON.stringify(res));

                executionResult = { ok: true, logs: logs, result: res };
            } catch (err) {
                const errMsg = (err && err.stack) ? err.stack : String(err);
                resultDiv.innerText = 'Runtime error:\n' + errMsg;
                executionResult = { ok: false, error: errMsg, logs: logs };
            } finally {
                console.log = origConsoleLog;
                submitBtn.disabled = false;
            }

                        (async () => {
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
                                    resultDiv.innerText += '\n\nNot sent: could not extract numeric value to check. Return or console.log a number to send it automatically.';


                                } else {
                                    const payload = { value: numericValue };
                                    const resp = await fetch('https://timer-backend-24n3.vercel.app/api/checkAnswerw', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload)
                                    });
                                    let parsed = null;
                                    try { parsed = await resp.json(); } catch (e) { parsed = { status: resp.status }; }
                                    resultDiv.innerText += '\n\nServer response: ' + JSON.stringify(parsed);
                                    if (parsed.correct) {
                                        resultDiv.innerText += '\n\nCorrect answer!';
                                        resultDiv.style.color = 'green';
                                    } else {
                                        resultDiv.innerText += '\n\nIncorrect answer.';
                                        resultDiv.style.color = 'red';
                                    }    }
                            } catch (e) {
                                resultDiv.innerText += '\n\nFailed to send result: ' + String(e);
                            }
                        })();
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

