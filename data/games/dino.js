
(function(){
  window.GAME_REGISTRY = window.GAME_REGISTRY || {};

  function init(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let running = true;
    let frame = 0;
    let score = 0;
    const LS_KEY = 'dino_best_score';
    let best = 0;

    const player = { x: 40, y: 55, w: 18, h: 18, vy: 0, gravity: 0.2, jumpForce: -5, grounded: true };
    const obstacles = [];
    let animId = null;

    function spawnObstacle() {
      const size = 12 + Math.random() * 14;
      obstacles.push({ x: canvas.width + 10, y: canvas.height - size - 10, w: size, h: size });
    }

    function resetGame() {
      obstacles.length = 0;
      player.y = canvas.height - 10 - player.h;
      player.vy = 0; player.grounded = true;
      frame = 0; running = true; score = 0;
      try { const v = localStorage.getItem(LS_KEY); best = v ? parseInt(v, 10) || 0 : 0; } catch (e) { best = 0; }
    }

    function update() {
      if (!running) return;
      frame++;
      if (frame % 6 === 0) score++;
      player.vy += player.gravity;
      player.y += player.vy;
      const groundY = canvas.height - 10 - player.h;
      if (player.y >= groundY) { player.y = groundY; player.vy = 0; player.grounded = true; }

      if (frame % 90 === 0) spawnObstacle();
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 3 + Math.min(3, Math.floor(frame / 600));
        if (obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i, 1);
      }

        for (const obs of obstacles) {
        if (player.x < obs.x + obs.w && player.x + player.w > obs.x && player.y < obs.y + obs.h && player.y + player.h > obs.y) {
          running = false;
          try {
            if (score > best) { best = score; localStorage.setItem(LS_KEY, String(best)); }
          } catch (e) { /* ignore storage errors */ }
        }
      }
    }

    function draw() {
      ctx.fillStyle = '#f7f7f7'; ctx.fillRect(0,0,canvas.width,canvas.height);
      // score display
      ctx.fillStyle = '#111'; ctx.font = '12px Arial'; ctx.textAlign = 'right';
      ctx.fillText('Score: ' + score, canvas.width - 8, 14);
      ctx.fillStyle = '#666'; ctx.font = '10px Arial'; ctx.textAlign = 'left';
      ctx.fillText('Best: ' + best, 8, 14);
      ctx.fillStyle = '#666'; ctx.fillRect(0, canvas.height - 10, canvas.width, 2);
      ctx.fillStyle = '#111'; ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillStyle = '#111'; obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
      if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#fff'; ctx.font = '16px Arial'; ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 6);
        ctx.font = '12px Arial'; ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 10);
        ctx.fillText('Best: ' + best, canvas.width/2, canvas.height/2 + 26);
      }
    }

    function loop() { update(); draw(); animId = requestAnimationFrame(loop); }

    function jump() { if (!player.grounded) return; player.vy = player.jumpForce; player.grounded = false; }

    function onKey(e) { if (e.code === 'Space') { e.preventDefault(); if (running) jump(); } }
    function onClick() { if (running) jump(); }

    function start() { resetGame(); document.addEventListener('keydown', onKey); canvas.addEventListener('click', onClick); loop(); }

    function stop() { running = false; if (animId) { cancelAnimationFrame(animId); animId = null; } document.removeEventListener('keydown', onKey); canvas.removeEventListener('click', onClick); }

    function restart() { stop(); resetGame(); start(); }

    start();

    return { stop, restart };
  }

  window.GAME_REGISTRY['Dino'] = { init };
})();
