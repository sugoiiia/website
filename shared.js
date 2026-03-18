/* ─────────────────────────────────────────
   shared.js — common behaviour for all pages
   ───────────────────────────────────────── */

// ─── 1. NAV ACTIVE PAGE ───
// Highlights the nav link whose href matches the current filename.
(function(){
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function(a){
    if(a.getAttribute('href') === filename) a.classList.add('active');
  });
})();

// ─── 2. MOUSE GLOW ───
(function(){
  const g = document.getElementById('glow');
  if(!g) return;
  let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  document.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; });
  (function loop(){
    cx += (mx - cx) * .06; cy += (my - cy) * .06;
    g.style.transform = 'translate(' + (cx-250) + 'px,' + (cy-250) + 'px)';
    requestAnimationFrame(loop);
  })();
})();

// ─── 3. PARTICLE CANVAS ───
// Only runs when a <canvas id="bg-canvas"> is present on the page.
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mx = -9999, my = -9999;

  function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; });

  function P(){
    this.reset = function(){
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-.5)*.38; this.vy = (Math.random()-.5)*.38;
      this.size = Math.random()*1.8+.4; this.alpha = Math.random()*.35+.1;
    };
    this.update = function(){
      var dx = mx-this.x, dy = my-this.y;
      var d = Math.sqrt(dx*dx+dy*dy);
      if(d<200&&d>0){ this.vx += (dx/d)*.02; this.vy += (dy/d)*.02; }
      this.vx *= .994; this.vy *= .994;
      this.x += this.vx; this.y += this.vy;
      if(this.x<-20) this.x=W+20; if(this.x>W+20) this.x=-20;
      if(this.y<-20) this.y=H+20; if(this.y>H+20) this.y=-20;
    };
    this.draw = function(){
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(200,184,122,'+this.alpha+')'; ctx.fill();
    };
    this.reset();
  }

  var COUNT = Math.min(Math.floor((W*H)/10000), 180);
  for(var i=0; i<COUNT; i++) particles.push(new P());

  function edges(){
    var D = 140;
    for(var i=0; i<particles.length; i++){
      for(var j=i+1; j<particles.length; j++){
        var dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
        var d = Math.sqrt(dx*dx+dy*dy);
        if(d<D){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(200,184,122,'+(1-d/D)*.16+')';
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p){ p.update(); p.draw(); });
    edges();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── 4. SCROLL REVEAL ───
// Only runs when .reveal elements exist on the page.
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  function check(){
    els.forEach(function(el){
      if(el.getBoundingClientRect().top < window.innerHeight * 0.9)
        el.classList.add('visible');
    });
  }
  check();
  window.addEventListener('scroll', check, { passive: true });
})();
