let activeGameCleanUp = null; // Variabel global untuk menyimpan fungsi cleanup game aktif

function openGame(gameName) {
    // Sembunyikan menu utama
    document.getElementById("menu").classList.add("hidden");

    // Periksa nama game dan tampilkan kanvas yang sesuai
    if (gameName === "snake") {
        document.getElementById("snakeGame").classList.remove("hidden");
    } else if (gameName === "tictactoe") {
        document.getElementById("tictactoeGame").classList.remove("hidden");
    }

    // Import file script game tertentu secara dinamis
    const script = document.createElement('script');
    script.src = `./games/${gameName}/index.js`; // Memuat file game berdasarkan nama
    document.body.appendChild(script)
}

function returnToMenu() {
    // Hentikan game aktif jika ada
    if (activeGameCleanUp) {
        activeGameCleanUp(); // Bersihkan game aktif
        activeGameCleanUp = null; // Reset fungsi cleanup
    }

    // Sembunyikan semua game canvas
    document.getElementById("snakeGame").classList.add("hidden");
    document.getElementById("tictactoeGame").classList.add("hidden");

    // Hapus elemen popup Game Over jika ada
    const popup = document.getElementById("gameOverPopup");
    if (popup) document.body.removeChild(popup);

    // Tampilkan menu utama
    document.getElementById("menu").classList.remove("hidden");
}
