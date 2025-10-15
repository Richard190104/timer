
(function(){
  window.GAME_REGISTRY = window.GAME_REGISTRY || {};

  function init(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let running = true;
    let clicks = 0;
    let animId = null;

    function draw() {
      ctx.fillStyle = '#f7f7f7'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#111'; ctx.font = '18px Arial'; ctx.textAlign = 'center';
      ctx.fillText('Clicks: ' + clicks, canvas.width/2, canvas.height/2);
      ctx.fillStyle = '#666'; ctx.fillRect(canvas.width/2 - 40, canvas.height - 30, 80, 18);
    }

    function loop() { draw(); animId = requestAnimationFrame(loop); }

    function onClick() { clicks++; }

    function start() { clicks = 0; canvas.addEventListener('click', onClick); loop(); }
    function stop() { running = false; if (animId) { cancelAnimationFrame(animId); animId = null; } canvas.removeEventListener('click', onClick); }

    start();
    return { stop };
  }

  window.GAME_REGISTRY['Clicker'] = { init };
})();
