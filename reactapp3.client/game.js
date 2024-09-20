const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dinoWidth = 50;
const dinoHeight = 50;
const groundHeight = 50;
const obstacleWidth = 30;
const obstacleHeight = 50;
const jumpHeight = 150;
const gravity = 0.5; // Сила гравитации
const initialSpeed = 5; // Начальная скорость препятствий
let speed = initialSpeed; // Текущая скорость

let dino = {
    x: 50,
    y: canvas.height - groundHeight - dinoHeight, // Начальное положение на земле
    width: dinoWidth,
    height: dinoHeight,
    velocityY: 0,
    isJumping: false,
    jumpsLeft: 1 // Двойной прыжок
};

let obstacles = [];
let bonuses = [];
let fireballs = []; // Массив для фаерболов
let bats = []; // Массив для летучих мышей

let score = 0;
let fireballCount = 3; // Счетчик фаерболов

const groundImage = new Image();
groundImage.src = 'ground.png';

const dinoImage = new Image();
dinoImage.src = 'dino.png';

const obstacleImage = new Image();
obstacleImage.src = 'obstacle.png';

const bonusImage = new Image();
bonusImage.src = 'bonus.png'; // Добавьте изображение бонуса

const fireballImage = new Image();
fireballImage.src = 'fireball.png'; // Добавьте изображение фаербола

const batImage = new Image();
batImage.src = 'bat.png'; // Добавьте изображение летучей мыши

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста

    ctx.drawImage(groundImage, 0, canvas.height - groundHeight);

    ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    bonuses.forEach(bonus => {
        ctx.drawImage(bonusImage, bonus.x, bonus.y, bonus.width, bonus.height);
    });

    fireballs.forEach(fireball => {
        ctx.drawImage(fireballImage, fireball.x, fireball.y, fireball.width, fireball.height);
    });

    bats.forEach(bat => {
        ctx.drawImage(batImage, bat.x, bat.y, bat.width, bat.height);
    });

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Count: ' + score, 10, 30); // Отображение счета
    ctx.fillText('fireballs: ' + fireballCount, 10, 60); // Отображение счета фаерболов
}

function update() {
    // Гравитация для динозаврика
    dino.velocityY += gravity;
    dino.y += dino.velocityY;

    dino.x = 50; // Устанавливаем x координату динозаврика

    if (dino.y + dino.height >= canvas.height - groundHeight) {
        dino.y = canvas.height - groundHeight - dino.height;
        dino.velocityY = 0;
        dino.isJumping = false;
        dino.jumpsLeft = 2; // Сбрасываем счет прыжков
    }

    // Проверка столкновения динозаврика с препятствиями
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (
            dino.x + dino.width >= obstacle.x &&
            dino.x <= obstacle.x + obstacle.width &&
            dino.y + dino.height >= obstacle.y &&
            dino.y <= obstacle.y + obstacle.height
        ) {
            alert("Game Over!");
            clearInterval(gameInterval);
            return;
        }
    }

    // Проверка столкновения динозаврика с летучими мышами
    for (let i = 0; i < bats.length; i++) {
        const bat = bats[i];
        if (
            dino.x + dino.width >= bat.x &&
            dino.x <= bat.x + bat.width &&
            dino.y + dino.height >= bat.y &&
            dino.y <= bat.y + bat.height
        ) {
            alert("Game Over");
            clearInterval(gameInterval);
            return;
        }
    }

    // Проверка столкновения динозаврика с бонусами
    for (let i = 0; i < bonuses.length; i++) {
        const bonus = bonuses[i];
        if (
            dino.x + dino.width >= bonus.x &&
            dino.x <= bonus.x + bonus.width &&
            dino.y + dino.height >= bonus.y &&
            dino.y <= bonus.y + bonus.height
        ) {
            bonuses.splice(i, 1); // Удаление бонуса
            score += 10; // Добавление очков
            dino.jumpsLeft = 2; // Даем двойной прыжок

            // Получение фаербола при сборе бонуса
            if (fireballCount < 10) {
                fireballCount++;
            }
        }
    }

    // Генерация препятствий
    if (Math.random() < 0.01 && obstacles.length < 3) { // Увеличивает количество препятствий с течением времени
        obstacles.push({
            x: canvas.width,
            y: canvas.height - groundHeight - obstacleHeight,
            width: obstacleWidth,
            height: obstacleHeight
        });
    }

    // Генерация бонусов
    if (Math.random() < 0.005 && bonuses.length < 2) {
        bonuses.push({
            x: canvas.width,
            y: canvas.height - groundHeight - obstacleHeight - 50, // Бонус на высоте
            width: 20,
            height: 20
        });
    }

    // Генерация летучих мышей
    if (Math.random() < 0.008 && bats.length < 2) { // Увеличивает количество летучих мышей с течением времени
        bats.push({
            x: canvas.width,
            y: canvas.height - groundHeight - obstacleHeight - 100, // Летучая мышь летает на высоте
            width: 30,
            height: 20
        });
    }

    // Движение препятствий, бонусов и летучих мышей
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= speed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    bonuses.forEach((bonus, index) => {
        bonus.x -= speed;

        if (bonus.x + bonus.width < 0) {
            bonuses.splice(index, 1);
        }
    });

    bats.forEach((bat, index) => {
        bat.x -= speed;

        if (bat.x + bat.width < 0) {
            bats.splice(index, 1);
        }
    });

    // Движение фаерболов
    fireballs.forEach((fireball, index) => {
        fireball.x += 10; // Фаербол летит вправо

        // Проверка столкновения фаербола с препятствием
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (
                fireball.x + fireball.width >= obstacle.x &&
                fireball.x <= obstacle.x + obstacle.width &&
                fireball.y + fireball.height >= obstacle.y &&
                fireball.y <= obstacle.y + obstacle.height
            ) {
                obstacles.splice(i, 1); // Удаление препятствия
                fireballs.splice(index, 1); // Удаление фаербола
                break; // Выход из цикла после столкновения
            }
        }

        if (fireball.x + fireball.width > canvas.width) {
            fireballs.splice(index, 1); // Удаление фаербола, если он вышел за край
        }
    });

    if (obstacles.length > 10) {
        speed += 1; // Увеличиваем скорость на 0.1 за каждые 10 препятствий
    }

    draw();
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        if (dino.jumpsLeft > 0) {
            dino.velocityY = -10; // Сила прыжка
            dino.isJumping = true;
            dino.jumpsLeft--;
        }
    } else if (event.code === 'KeyF' && fireballCount > 0) { // Выстрел фаерболом при нажатии F
        fireballs.push({
            x: dino.x + dino.width, // Начало фаербола рядом с динозавриком
            y: dino.y + dino.height / 2, // Положение по высоте
            width: 20,
            height: 10
        });
        fireballCount--; // Уменьшение количества фаерболов
    }
});

let gameInterval = setInterval(update, 10);

// IndexedDB
const dbRequest = indexedDB.open('dinoGame', 1); // Открываем базу данных

dbRequest.onerror = (event) => {
    console.error('Ошибка при открытии базы данных:', event);
};

dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    console.log('База данных успешно открыта:', db);
};

dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore('scores', { keyPath: 'id', autoIncrement: true });
    console.log('Object store "scores" создан:', objectStore);
};

// Функция для добавления результата в IndexedDB
function saveScore() {
    const db = dbRequest.result; // Получаем объект базы данных
    const transaction = db.transaction('scores', 'readwrite');
    const objectStore = transaction.objectStore('scores');
    const request = objectStore.add({ score }); // Добавляем результат

    request.onerror = (event) => {
        console.error('Ошибка при добавлении результата:', event);
    };

    request.onsuccess = (event) => {
        console.log('Результат успешно добавлен:', event);
    };
}

// Функция окончания игры
function gameOver() {
    alert("Game Over!");
    clearInterval(gameInterval);
    saveScore(); // Сохраняем результат в IndexedDB
}

// Сохранение результатов при окончании игры
function saveGame() {
    const gameData = {
        score: score,
        fireballCount: fireballCount
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Загрузка результатов из localStorage
function loadGame() {
    const savedGameData = localStorage.getItem('gameData');
    if (savedGameData) {
        const gameData = JSON.parse(savedGameData);
        score = gameData.score;
        fireballCount = gameData.fireballCount;
    }
}

// Вызов loadGame() при загрузке страницы
loadGame();
