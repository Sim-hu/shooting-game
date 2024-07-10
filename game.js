const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲームオブジェクト
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5
};

let bullets = [];
let enemies = [];

// キー入力の状態
const keys = {};

// ゲームループ
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 更新処理
function update() {
    // プレイヤーの移動
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;

    // 弾の移動
    bullets.forEach((bullet, index) => {
        bullet.y -= 7;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // 敵の生成
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50
        });
    }

    // 敵の移動
    enemies.forEach((enemy, index) => {
        enemy.y += 2;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    // 衝突判定
    enemies.forEach((enemy, enemyIndex) => {
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });
}

// 描画処理
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤーの描画
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 弾の描画
    ctx.fillStyle = 'white';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // 敵の描画
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// 衝突判定
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// キー入力イベント
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// スペースキーで弾を発射
document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10
        });
    }
});

// ゲーム開始
gameLoop();
