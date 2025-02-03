// Fungsi untuk menampilkan popup peringatan
function showFirstTimePopup() {
    // Periksa localStorage apakah popup pernah ditampilkan
    const popupShown = localStorage.getItem("popupShown");

    // Jika popup belum pernah ditampilkan
    if (!popupShown) {
        // Buat elemen popup secara dinamis
        const popup = document.createElement("div");
        popup.id = "welcomePopup";
        popup.className = `
            fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50
        `;

        // Konten popup
        popup.innerHTML = `
            <div class="bg-gradient-to-b from-indigo-600 to-purple-800 rounded-2xl shadow-xl text-center max-w-xs md:max-w-lg w-full p-6 transform scale-90
                animate-zoomIn">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 font-['Press_Start_2P'] glow-effect">
                    Rekomendasi
                </h2>
                <p class="text-white text-sm md:text-lg mb-6 font-medium leading-relaxed">
                    Direkomendasikan menggunakan <strong class="text-yellow-300">tablet</strong> atau <strong class="text-yellow-300">desktop</strong> untuk memainkan game ini.
                </p>
                <button id="popupOkButton" 
                        class="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg md:text-xl px-8 py-2 rounded-full 
                        font-semibold shadow-md glow-button transform transition duration-300 hover:scale-110">
                    Oke Bro!
                </button>
            </div>
        `;

        // Tambahkan ke body
        document.body.appendChild(popup);

        // Tambahkan event listener ke tombol OK
        document.getElementById("popupOkButton").addEventListener("click", () => {
            // Simpan state ke localStorage bahwa popup sudah pernah ditampilkan
            localStorage.setItem("popupShown", "true");

            // Tambahkan animasi keluar sebelum menghapus popup
            popup.querySelector(".animate-zoomIn").classList.replace("animate-zoomIn", "animate-zoomOut");
            setTimeout(() => {
                document.body.removeChild(popup); // Hapus elemen popup setelah animasi selesai
            }, 400);
        });
    }
}

// Panggil fungsi saat halaman pertama kali dimuat
showFirstTimePopup();