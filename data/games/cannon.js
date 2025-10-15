// Cannon Shooter: click to fire cannonballs at falling enemies
(function(){
  window.GAME_REGISTRY = window.GAME_REGISTRY || {};

  function init(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let running = true;
    let animId = null;
  let score = 0;
    const LS_KEY = 'cannon_best_score';
    let best = 0;
  let misses = 0;
  const MISS_LIMIT = 5;

    const cannon = { x: canvas.width/2, y: canvas.height - 12, angle: -Math.PI/2 };
    const balls = [];
    const enemies = [];
    let frame = 0;

    function spawnEnemy() {
      const x = Math.random() * (canvas.width - 20) + 10;
      enemies.push({ x, y: -10, r: 10 + Math.random()*12, vy: 0.1 + Math.random() });
    }

    function gameOver() {
      running = false;
      try { if (score > best) { best = score; localStorage.setItem(LS_KEY, String(best)); } } catch (e) {}
    }

    function update() {
      if (!running) return;
      frame++;
      if (frame % 100 === 0) spawnEnemy();
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.x += b.vx; b.y += b.vy; b.vy += 0.01; // gravity
        if (b.x < -20 || b.x > canvas.width+20 || b.y > canvas.height+20) balls.splice(i,1);
      }
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.vy;
        if (e.y - e.r > canvas.height) {
          enemies.splice(i,1);
          misses++;
          if (misses >= MISS_LIMIT) {
            gameOver();
            break;
          }
        }
      }

      // collisions
      for (let i = enemies.length -1; i >=0; i--) {
        const e = enemies[i];
        for (let j = balls.length -1; j>=0; j--) {
          const b = balls[j];
          const dx = e.x - b.x; const dy = e.y - b.y; const dist = Math.sqrt(dx*dx+dy*dy);
            if (dist < e.r + b.r) {
            // hit
            enemies.splice(i,1);
            balls.splice(j,1);
            score += Math.max(1, Math.floor(20 - e.r));
            if (score > best) { best = score; try { localStorage.setItem(LS_KEY, String(best)); } catch(e){} }
            break;
          }
        }
      }
    }

    function draw() {
      ctx.fillStyle='#f7f7f7'; ctx.fillRect(0,0,canvas.width,canvas.height);
      // cannon
      ctx.save(); ctx.translate(cannon.x,cannon.y);
      ctx.rotate(cannon.angle);
      ctx.fillStyle='#111'; ctx.fillRect(-6,-4,12,8);
      ctx.restore();

      // balls
      ctx.fillStyle='#222'; balls.forEach(b => { ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); });
      // enemies
      ctx.fillStyle='#b00'; enemies.forEach(e => { ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill(); });

      // score
      ctx.fillStyle='#111'; ctx.font='12px Arial'; ctx.textAlign='right'; ctx.fillText('Score: '+score, canvas.width-8, 14);
      ctx.fillStyle='#666'; ctx.textAlign='left'; ctx.fillText('Best: '+best, 8, 14);
      // misses
      ctx.fillStyle = '#b33'; ctx.textAlign = 'center'; ctx.fillText('Misses: ' + misses + ' / ' + MISS_LIMIT, canvas.width/2, 14);

      if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#fff'; ctx.font = '18px Arial'; ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 6);
        ctx.font = '14px Arial'; ctx.fillText('Score: ' + score + '  Best: ' + best, canvas.width/2, canvas.height/2 + 16);
        ctx.font = '12px Arial'; ctx.fillText('Missed ' + misses + ' enemy' + (misses===1?'':'ies'), canvas.width/2, canvas.height/2 + 36);
      }
    }

    function loop(){ update(); draw(); animId = requestAnimationFrame(loop); }

    function fireTo(x,y){
      const dx = x - cannon.x; const dy = y - cannon.y; const ang = Math.atan2(dy,dx);
      const speed = 6;
      const vx = Math.cos(ang) * speed; const vy = Math.sin(ang) * speed;
      balls.push({ x: cannon.x + Math.cos(ang)*12, y: cannon.y + Math.sin(ang)*12, vx, vy, r:4 });
    }

    function onMove(e){
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX || e.touches && e.touches[0].clientX) - rect.left;
      const my = (e.clientY || e.touches && e.touches[0].clientY) - rect.top;
      cannon.angle = Math.atan2(my - cannon.y, mx - cannon.x);
    }

    function onClick(e){
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX || e.touches && e.touches[0].clientX) - rect.left;
      const my = (e.clientY || e.touches && e.touches[0].clientY) - rect.top;
      fireTo(mx,my);
    }

    function start(){ try{ const v = localStorage.getItem(LS_KEY); best = v?parseInt(v,10)||0:0; }catch(e){best=0;} misses=0; score=0; enemies.length=0; balls.length=0; frame=0; running=true; canvas.addEventListener('mousemove', onMove); canvas.addEventListener('click', onClick); loop(); }
    function stop(){ running=false; if (animId){ cancelAnimationFrame(animId); animId=null;} canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('click', onClick); }
    function restart(){ stop(); misses=0; score=0; enemies.length=0; balls.length=0; frame=0; start(); }

    start();
    return { stop, restart };
  }

  window.GAME_REGISTRY['Cannon'] = { init };
})();
