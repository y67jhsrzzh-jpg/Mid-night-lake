const canvas = document.getElementById('lakeCanvas');
const ctx = canvas.getContext('2d');
const introText = document.getElementById('intro-text');
const content = document.getElementById('content');
const ambientWater = document.getElementById('ambientWater');

let ripples = [];
let isAwake = false;

// 設定畫布尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 水波紋物件
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.alpha = 0.5; // 透明度
        this.speed = 2;   // 擴散速度
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    update() {
        this.radius += this.speed;
        this.alpha -= 0.005; // 逐漸變淡
    }
}

// 渲染迴圈
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].update();
        ripples[i].draw();
        
        // 移除已經完全透明的水波
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();

// 監聽全局點擊事件
document.addEventListener('click', (e) => {
    // 產生水波
    ripples.push(new Ripple(e.clientX, e.clientY));
    
    // 第一次點擊：喚醒湖面
    if (!isAwake) {
        isAwake = true;
        
        // 隱藏提示字，顯示主要內容
        introText.style.opacity = '0';
        content.classList.add('visible');
        
        // 嘗試播放水聲 (需先有音檔)
        ambientWater.volume = 0.4;
        ambientWater.play().catch(err => console.log("等待音檔載入中..."));
    }
});
