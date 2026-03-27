(function () {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  const fontSize = 14;
  const letters = "アァイィウヴエカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
  let drops = [];

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  }

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#39ff14";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
    requestAnimationFrame(draw);
  }

  setup();
  window.addEventListener('resize', setup);
  requestAnimationFrame(draw);
})();
