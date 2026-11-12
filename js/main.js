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
        this.alpha = 0.8;
        this.speed = 1.2 + Math.random() * 0.5; 
        this.thickness = 15; // 模擬真實水波折射的厚度
    }
    draw() {
        ctx.beginPath();
        // 創造漸層光暈，不再是一條死硬的線
        let gradient = ctx.createRadialGradient(
            this.x, this.y, Math.max(0, this.radius - this.thickness),
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${this.alpha * 0.25})`); // 帶點冷光的倒影
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    update() {
        this.radius += this.speed;
        this.alpha -= 0.0035; 
        this.thickness += 0.2; // 水波向外擴散時會自然變寬
    }
}

function animate() {
    // 畫布不清空，而是用帶透明度的黑色覆蓋，產生極致柔和的「動態拖影(Motion Blur)」
    ctx.fillStyle = 'rgba(2, 2, 3, 0.15)';
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

document.addEventListener('click', (e) => {
    // 產生主波紋
    ripples.push(new Ripple(e.clientX, e.clientY));
    // 延遲 250 毫秒產生子波紋，模擬真實水滴落下的跟隨效應
    setTimeout(() => ripples.push(new Ripple(e.clientX, e.clientY)), 250);
    
    if (!isAwake) {
        isAwake = true;
        introText.style.opacity = '0';
        content.classList.add('visible');
        ambientWater.volume = 0.4;
        ambientWater.play().catch(() => console.log("等待音檔或互動授權"));
    }
});
