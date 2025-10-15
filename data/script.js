
fetch("https://timer-backend-24n3.vercel.app/api/hello").then(res => res.json()).then(data => {
    if (data.access == 'denied') {
        document.querySelector(".time").appendChild(createTimesBlock(data.days,"days"));
        document.querySelector(".time").appendChild(createTimesBlock(data.hours,"hours"));
        document.querySelector(".time").appendChild(createTimesBlock(data.minutes,"minutes"));
        document.querySelector(".time").appendChild(createTimesBlock(data.seconds,"seconds"));
    } else {
        document.querySelector(".time").innerText = data.message;
    }
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
    const title = document.createElement('h3'); title.innerText = 'Zahraj si daco kym cakas pls sak nerobil som to len tak';
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
        list.style.display = 'none'; title.innerText = gameMeta.name;
        const canvas = document.createElement('canvas'); canvas.className = 'game-canvas'; canvas.width = 360; canvas.height = 100;
        const controls = document.createElement('div'); controls.className = 'game-controls';
        const btnBack = document.createElement('button'); btnBack.className = 'btn-small'; btnBack.innerText = 'Back to games';
        const btnClose = document.createElement('button'); btnClose.className = 'btn-small'; btnClose.innerText = 'Close';
        controls.appendChild(btnBack); controls.appendChild(btnClose); panel.appendChild(canvas); panel.appendChild(controls);

        let gameInstance = null;
        function cleanupAndBack() {
            if (gameInstance && typeof gameInstance.stop === 'function') { try { gameInstance.stop(); } catch (e) {} }
            canvas.remove(); controls.remove(); list.style.display = 'flex'; title.innerText = 'You can play while waiting';
        }
        btnBack.addEventListener('click', cleanupAndBack); btnClose.addEventListener('click', () => overlay.remove());

        const reg = window.GAME_REGISTRY && window.GAME_REGISTRY[gameMeta.id];
        if (reg && typeof reg.init === 'function') {
            try { gameInstance = reg.init(canvas, { onExit: cleanupAndBack }); } catch (err) { console.error(err); cleanupAndBack(); }
        } else { console.error('Game not registered:', gameMeta.id); cleanupAndBack(); }
    }

    availableGames.forEach(g => {
        const row = document.createElement('div'); row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center';
        const name = document.createElement('div'); name.innerText = g.name;
        const playBtn = document.createElement('button'); playBtn.className = 'btn-small'; playBtn.innerText = 'Play';
        playBtn.addEventListener('click', async () => {
            try { await loadScriptOnce(g.script); setTimeout(() => showGameUI(g), 50); } catch (err) { console.error(err); alert('Failed to load game. See console.'); }
        });
        row.appendChild(name); row.appendChild(playBtn); list.appendChild(row);
    });

    closeBtn.addEventListener('click', () => overlay.remove());
}
