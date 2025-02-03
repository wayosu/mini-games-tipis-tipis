function startSnakeGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const gridSize = 20;
    let snake = [{ x: 100, y: 100 }];
    let direction = 'RIGHT';
    let food = generateFood();
    let score = 0; // Skor awal

    // Mulai game
    let isGameRunning = true; // Set game berjalan

    // Tambahkan elemen skor ke DOM
    let scoreDisplay = document.getElementById('scoreDisplay');
    if (!scoreDisplay) {
        // Jika scoreDisplay belum ada, buat elemen baru
        scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'scoreDisplay';
        scoreDisplay.className = 'text-xl font-bold mt-4 text-center text-white';
        canvas.parentNode.insertBefore(scoreDisplay, canvas);
    }

    // Set nilai awal live skor menjadi 0 (reset setiap kali game dimulai)
    scoreDisplay.innerHTML = `Skor: ${score}`;

    // Background Music and Sound Effect
    const backgroundMusic = new Audio('./games/snake/background.mp3'); // Background music
    const foodSound = new Audio('./games/snake/bite.mp3'); // Sound ketika ular makan

    // Atur Looping pada Background Music
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // Atur volume agar tidak terlalu keras
    backgroundMusic.play();

    function updateScore() {
        scoreDisplay.innerHTML = `Skor: ${score}`;
        scoreDisplay.style.textShadow = "0 0 20px #34d399, 0 0 30px #10b981"; // Efek glowing
    }

    function drawRect(x, y, color) {
        const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
        if (color === 'green') {
            // Ular: Gradien hijau
            gradient.addColorStop(0, "#34d399");
            gradient.addColorStop(1, "#10b981");
        } else if (color === 'red') {
            // Makanan: Gradien merah (buah)
            gradient.addColorStop(0, "#f87171");
            gradient.addColorStop(1, "#ef4444");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, gridSize, gridSize);
    }

    function drawSnake() {
        snake.forEach(segment => drawRect(segment.x, segment.y, 'green'));
    }

    function drawFood() {
        // Buat makanan jadi lingkaran agar lebih menarik
        ctx.beginPath();
        ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444"; // Warna solid untuk makanan
        ctx.fill();
        ctx.closePath();
    }

    function moveSnake() {
        const head = { ...snake[0] };

        // Gerakan ular berdasarkan arah
        if (direction === 'RIGHT') head.x += gridSize;
        if (direction === 'LEFT') head.x -= gridSize;
        if (direction === 'UP') head.y -= gridSize;
        if (direction === 'DOWN') head.y += gridSize;

        snake.unshift(head);

        // Ketika ular makan makanan
        if (head.x === food.x && head.y === food.y) {
            score++; // Tambahkan skor
            updateScore(); // Perbarui tampilan skor
            food = generateFood(); // Buat makanan baru
            foodSound.play(); // Putar efek suara ketika ular makan
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        return { x, y };
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.code === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
        if (e.code === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.code === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    });

    function displayGameOverPopup(score) {
        // Buat elemen popup secara dinamis
        const popup = document.createElement('div');
        popup.id = 'gameOverPopup';
        popup.className = `
        fixed inset-0 flex items-center justify-center bg-black bg-opacity-70
        z-50
    `;

        // Konten popup
        popup.innerHTML = `
        <div class="bg-gray-900 rounded-lg shadow-xl p-6 text-center max-w-sm w-full">
            <h2 class="text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p class="text-lg text-white mb-6">Skor Akhir Anda: <span class="font-bold">${score}</span></p>
            <button id="restartButton" class="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-2 rounded">
                Main Lagi
            </button>
            <button id="menuButton" class="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-2 rounded mt-3">
                Kembali ke Menu
            </button>
        </div>
    `;

        // Append popup ke body
        document.body.appendChild(popup);

        // Event listener untuk tombol di dalam popup
        document.getElementById('restartButton').addEventListener('click', () => {
            document.body.removeChild(popup); // Hapus popup
            startSnakeGame(); // Restart game
        });

        document.getElementById('menuButton').addEventListener('click', () => {
            returnToMenu(); // Kembali ke menu
        });
    }

    function gameLoop() {
        if (!isGameRunning) return; // Hentikan game loop jika game sudah berakhir

        if (checkCollision()) {
            // Game Over
            isGameRunning = false; // Set status game
            backgroundMusic.pause(); // Hentikan musik latar
            displayGameOverPopup(score); // Tampilkan custom popup dengan skor akhir
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
        moveSnake();
        drawSnake();
        drawFood();

        setTimeout(gameLoop, 100); // Jalankan game loop
    }


    gameLoop(); // Mulai game loop

    function cleanUpGame() {
        isGameRunning = false;
        backgroundMusic.pause();

        const popup = document.getElementById('gameOverPopup');
        if (popup) document.body.removeChild(popup);
    }

    return cleanUpGame;
}

activeGameCleanUp = startSnakeGame();