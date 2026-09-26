/* CANVAS */
(function(){
  const c = document.getElementById('bgCanvas'), ctx = c.getContext('2d');
  let pts = [];
  const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
  const mkPt = () => ({ x:Math.random()*c.width, y:Math.random()*c.height, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, r:Math.random()*1.6+.3, op:Math.random()*.4+.1, col:['#00F2C3','#3D7EFF','#BF5AF2','#FF6B6B'][Math.floor(Math.random()*4)] });
  const init = () => pts = Array.from({length:80}, mkPt);
  const draw = () => {
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>c.width||p.y<0||p.y>c.height) Object.assign(p,mkPt(),{x:Math.random()*c.width,y:Math.random()*c.height});
      ctx.save(); ctx.globalAlpha=p.op; ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
      pts.slice(i+1,i+4).forEach(q=>{ const d=Math.hypot(p.x-q.x,p.y-q.y); if(d<80){ctx.save();ctx.globalAlpha=(1-d/80)*.05;ctx.strokeStyle='#00F2C3';ctx.lineWidth=.4;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();} });
    });
    requestAnimationFrame(draw);
  };
  resize(); init(); draw();
  window.addEventListener('resize',()=>{resize();init();});
})();

function togglePw(id, btn) { const i=document.getElementById(id); i.type=i.type==='password'?'text':'password'; btn.textContent=i.type==='password'?'👁':'🙈'; }

document.getElementById('loginForm').addEventListener('submit', function() {
  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
});