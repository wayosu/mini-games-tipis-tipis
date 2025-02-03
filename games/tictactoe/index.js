function startTicTacToeGame() {
    const canvas = document.getElementById("tictactoeCanvas");
    const ctx = canvas.getContext("2d");
    const cellSize = canvas.width / 3;
    let board = ["", "", "", "", "", "", "", "", ""]; // Reset papan setiap kali game dimulai
    let currentPlayer = "X";
    let isGameRunning = true;

    // Background Music and Click Effects
    const backgroundMusic = new Audio('./games/tictactoe/background.mp3');
    const clickEffect = new Audio('./games/tictactoe/click.mp3');
    const winEffect = new Audio('./games/tictactoe/win.mp3');
    const drawEffect = new Audio('./games/tictactoe/draw.mp3');

    // Set background music properties
    backgroundMusic.loop = true; // Loop the music
    backgroundMusic.volume = 0.5; // Lower the volume

    // Play background music
    backgroundMusic.play();

    // Draw Tic Tac Toe Board
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = "white";
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }

        // Draw symbols (X or O) on the board
        board.forEach((symbol, index) => {
            if (symbol) {
                const x = (index % 3) * cellSize + cellSize / 2;
                const y = Math.floor(index / 3) * cellSize + cellSize / 2;
                ctx.font = "48px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(symbol, x, y);
            }
        });
    }

    // Check for a winner or draw
    function checkGameState() {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6], // Diagonal top-right to bottom-left
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return the winning player ("X" or "O")
            }
        }

        // Check for draw (if all cells are filled and no winner)
        if (board.every((cell) => cell)) {
            return "draw";
        }

        return null; // Game is still ongoing
    }

    // Display the result (Winner or Draw)
    function displayResult(result) {
        const popup = document.createElement("div");
        popup.id = "ticTacToeResultPopup";
        popup.className = `
            fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50
        `;

        popup.innerHTML = `
            <div class="bg-gray-900 rounded-lg shadow-xl p-6 text-center max-w-sm w-full">
                <h2 class="text-3xl font-bold text-white mb-4">
                    ${result === "draw" ? "Game Seri!" : `${result} Menang!`}
                </h2>
                <button id="restartButton" class="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-2 rounded">
                    Main Lagi
                </button>
                <button id="menuButton" class="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-2 rounded mt-3">
                    Kembali ke Menu
                </button>
            </div>
        `;

        document.body.appendChild(popup);

        // Play sound effect based on result
        if (result === "draw") {
            drawEffect.play();
        } else {
            winEffect.play();
        }

        // Event listener for restart button
        document.getElementById("restartButton").addEventListener("click", () => {
            document.body.removeChild(popup); // Hapus popup
            startTicTacToeGame(); // Restart game
        });

        // Event listener for menu button
        document.getElementById("menuButton").addEventListener("click", () => {
            document.body.removeChild(popup); // Hapus popup
            returnToMenu(); // Kembali ke menu utama
        });
    }

    // Handle user clicks on the board
    function handleClick(event) {
        if (!isGameRunning) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        const index = row * 3 + col;

        // If the clicked cell is empty, make a move
        if (!board[index]) {
            clickEffect.currentTime = 0; // Reset sound effect
            clickEffect.play(); // Play click sound effect

            board[index] = currentPlayer;
            drawBoard(); // Refresh board
            const result = checkGameState();

            if (result) {
                isGameRunning = false; // Stop further moves
                backgroundMusic.pause();
                displayResult(result); // Show the popup with result
                return;
            }

            // Switch player
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    // Clean up game state (optional if you have menu handling)
    function cleanUpGame() {
        isGameRunning = false;
        backgroundMusic.pause(); // Stop background music
        canvas.removeEventListener("click", handleClick);
        const popup = document.getElementById("ticTacToeResultPopup");
        if (popup) {
            document.body.removeChild(popup);
        }
    }

    // Add event listener for clicks
    canvas.addEventListener("click", handleClick);

    // Draw the initial state of the board
    drawBoard();

    // Return cleanup function
    return cleanUpGame;
}

activeGameCleanUp = startTicTacToeGame();