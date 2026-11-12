const canvas = document.getElementById('lakeCanvas');
const ctx = canvas.getContext('2d');
const introText = document.getElementById('intro-text');
const content = document.getElementById('content');
const ambientWater = document.getElementById('ambientWater');

let ripples = [];
let isAwake = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1.0;
        this.speed = 4.5;      // 初始爆發速度極快
        this.friction = 0.92;  // 水的阻力，會迅速讓波紋減速
    }
    
    draw() {
        if (this.alpha <= 0) return;

        // 模擬波峰：微弱的冷色月光折射 (極低透明度)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 220, 255, ${this.alpha * 0.12})`; 
        ctx.lineWidth = 1;
        ctx.stroke();

        // 模擬波谷：內圈的深色陰影，創造真實的立體水面起伏
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.92, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha * 0.25})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    update() {
        this.speed *= this.friction; // 波紋擴散會越來越慢
        this.radius += this.speed;
        this.alpha -= 0.025;         // 加快消散速度 (約 0.8 秒就會完全消失)
    }
}

function animate() {
    // 增加覆蓋層的透明度，消除殘影，讓畫面保持乾淨的黑夜感
    ctx.fillStyle = 'rgba(2, 2, 3, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].update();
        ripples[i].draw();
        
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();

// 滑鼠移動也會產生極微弱的細小漣漪 (增強真實水面的觸感)
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.7 && isAwake) { 
        let mouseRipple = new Ripple(e.clientX, e.clientY);
        mouseRipple.speed = 1.5; // 移動時產生的水波較小
        mouseRipple.alpha = 0.5;
        ripples.push(mouseRipple);
    }
});

document.addEventListener('click', (e) => {
    // 點擊產生主波紋
    ripples.push(new Ripple(e.clientX, e.clientY));
    // 模擬真實水滴的次級回彈波紋
    setTimeout(() => ripples.push(new Ripple(e.clientX, e.clientY)), 150);
    
    if (!isAwake) {
        isAwake = true;
        introText.style.opacity = '0';
        content.classList.add('visible');
        ambientWater.volume = 0.4;
        ambientWater.play().catch(() => console.log("等待音檔授權"));
    }
});
