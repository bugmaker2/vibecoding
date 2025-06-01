document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('helloButton');
    const blessingText = document.getElementById('blessingText');
    const cheerSound = document.getElementById('cheerSound');
    const clickCountElement = document.getElementById('clickCount');
    
    const blessings = [
        "愿你前程似锦，未来可期！",
        "祝你心想事成，万事如意！",
        "愿你的生活充满阳光和欢笑！",
        "祝你事业蒸蒸日上，梦想成真！",
        "愿你遇见美好，收获幸福！",
        "祝你平安喜乐，幸福安康！",
        "愿你的每一天都充满希望和惊喜！"
    ];

    let currentBlessingIndex = 0;
    let isFirstClick = true;
    
    // 从 localStorage 获取点击次数，如果没有则初始化为 0
    let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;
    clickCountElement.textContent = clickCount;

    // 彩带效果函数
    function shootConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // 从按钮位置发射彩带
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
            });
            
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    button.addEventListener('click', () => {
        // 更新点击次数
        clickCount++;
        clickCountElement.textContent = clickCount;
        localStorage.setItem('clickCount', clickCount);

        // 播放欢呼声
        cheerSound.currentTime = 0;
        cheerSound.play();

        // 发射彩带
        shootConfetti();

        // 更新祝福文字
        currentBlessingIndex = (currentBlessingIndex + 1) % blessings.length;
        blessingText.textContent = blessings[currentBlessingIndex];

        // 第一次点击时移动按钮
        if (isFirstClick) {
            button.classList.add('button-moved');
            isFirstClick = false;
        }

        // 显示祝福文字
        blessingText.classList.add('show');
    });
}); 