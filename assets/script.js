// --- Global Variables and Configuration ---
const OMDB_API_KEY = '1aec0456'; // <<< GANTI DENGAN KUNCI OMDB API ANDA DI SINI
const OMDB_BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
const BACKEND_API_URL = 'http://localhost:3000/api/favorites'; // Sesuaikan jika port backend Anda berubah

// --- Utility Functions ---

// Function to show toast messages
function showMessage(message, type = 'success', duration = 3000) {
    const msgBox = document.getElementById('message-box');
    if (!msgBox) {
        console.warn('Message box element not found!');
        return;
    }
    msgBox.textContent = message;
    msgBox.className = ''; // Reset classes
    msgBox.classList.add('show', type);

    setTimeout(() => {
        msgBox.classList.remove('show');
    }, duration);
}

// --- Dark/Light Mode Toggle ---
function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    applyTheme(newTheme);
    document.getElementById('darkModeToggle').checked = (newTheme === 'dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = (savedTheme === 'dark-mode');
        toggle.addEventListener('change', toggleTheme);
    }
});

// --- OMDB API Search Function (for movies.html) ---
async function searchMovies() {
    const searchInput = document.getElementById('movieSearchInput');
    const movieResultsDiv = document.getElementById('movieResults');
    const query = searchInput.value.trim();

    if (query.length < 3) {
        movieResultsDiv.innerHTML = '<p class="text-center text-muted">Ketik minimal 3 karakter untuk mencari film.</p>';
        return;
    }

    movieResultsDiv.innerHTML = '<div class="text-center text-secondary-custom my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> Memuat film...</div>';

    try {
        const response = await fetch(`${OMDB_BASE_URL}&s=${encodeURIComponent(query)}`);
        const data = await response.json();

        movieResultsDiv.innerHTML = ''; // Clear previous results

        if (data.Response === "True") {
            data.Search.forEach(movie => {
                const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
                const movieCard = `
                    <div class="col-md-4 col-lg-3 mb-4">
                        <div class="card movie-card h-100">
                            <img src="${poster}" class="card-img-top" alt="${movie.Title} Poster">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${movie.Title}</h5>
                                <p class="card-text text-muted">${movie.Year}</p>
                                <button class="btn btn-primary mt-auto favorite-btn"
                                    data-omdb-id="${movie.imdbID}"
                                    data-title="${movie.Title}"
                                    data-year="${movie.Year}"
                                    data-poster="${poster}">
                                    Tambah ke Favorit
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                movieResultsDiv.insertAdjacentHTML('beforeend', movieCard);
            });
            addFavoriteButtonListeners(); // Add listeners after cards are rendered
        } else {
            movieResultsDiv.innerHTML = `<p class="text-center text-danger">Film tidak ditemukan: ${data.Error}</p>`;
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        movieResultsDiv.innerHTML = '<p class="text-center text-danger">Terjadi kesalahan saat mencari film. Coba lagi nanti.</p>';
        showMessage('Gagal mencari film. Periksa koneksi internet atau kunci API OMDB.', 'error');
    }
}

// Add event listeners to "Add to Favorite" buttons
function addFavoriteButtonListeners() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const omdb_id = e.target.dataset.omdbId;
            const title = e.target.dataset.title;
            const year = e.target.dataset.year;
            const poster = e.target.dataset.poster;

            e.target.disabled = true; // Disable button to prevent multiple clicks
            e.target.textContent = 'Menambahkan...';

            try {
                const response = await fetch(BACKEND_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ omdb_id, title, year, poster })
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message, 'success');
                } else {
                    showMessage(data.message || 'Gagal menambahkan film ke favorit.', 'error');
                }
            } catch (error) {
                console.error('Error adding to favorites:', error);
                showMessage('Terjadi kesalahan saat menambahkan film ke favorit.', 'error');
            } finally {
                e.target.disabled = false;
                e.target.textContent = 'Tambah ke Favorit';
            }
        });
    });
}

// --- Favorite Movies Functions (for favorites.html) ---
async function fetchFavoriteMovies() {
    const favoriteMoviesContainer = document.getElementById('favoriteMoviesContainer');
    if (!favoriteMoviesContainer) return; // Only run on favorites.html

    favoriteMoviesContainer.innerHTML = '<div class="text-center text-secondary-custom my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> Memuat film favorit...</div>';

    try {
        const response = await fetch(BACKEND_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const favorites = await response.json();

        favoriteMoviesContainer.innerHTML = ''; // Clear existing list

        if (favorites.length === 0) {
            favoriteMoviesContainer.innerHTML = '<p class="text-center text-muted">Anda belum memiliki film favorit. <a href="movies.html">Cari film sekarang!</a></p>';
            return;
        }

        favorites.forEach(movie => {
            const movieCard = `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card movie-card h-100">
                        <img src="${movie.poster}" class="card-img-top" alt="${movie.title} Poster">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text text-muted">${movie.year}</p>
                            <button class="btn btn-danger mt-auto remove-favorite-btn" data-id="${movie.id}">
                                Hapus dari Favorit
                            </button>
                        </div>
                    </div>
                </div>
            `;
            favoriteMoviesContainer.insertAdjacentHTML('beforeend', movieCard);
        });
        addRemoveFavoriteButtonListeners(); // Add listeners after cards are rendered
    } catch (error) {
        console.error('Error fetching favorite movies:', error);
        favoriteMoviesContainer.innerHTML = '<p class="text-center text-danger">Gagal memuat film favorit. Coba lagi nanti.</p>';
        showMessage('Gagal memuat film favorit.', 'error');
    }
}

// Add event listeners to "Remove from Favorite" buttons
function addRemoveFavoriteButtonListeners() {
    document.querySelectorAll('.remove-favorite-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const movieId = e.target.dataset.id;
            if (!confirm('Apakah Anda yakin ingin menghapus film ini dari favorit?')) {
                return;
            }

            e.target.disabled = true;
            e.target.textContent = 'Menghapus...';

            try {
                const response = await fetch(`${BACKEND_API_URL}/${movieId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message, 'success');
                    fetchFavoriteMovies(); // Refresh the list
                } else {
                    showMessage(data.message || 'Gagal menghapus film dari favorit.', 'error');
                }
            } catch (error) {
                console.error('Error removing from favorites:', error);
                showMessage('Terjadi kesalahan saat menghapus film dari favorit.', 'error');
            } finally {
                e.target.disabled = false;
                e.target.textContent = 'Hapus dari Favorit';
            }
        });
    });
}

// --- Page Specific Logic ---
// Execute functions based on the current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('movies.html')) {
        const searchInput = document.getElementById('movieSearchInput');
        const searchButton = document.getElementById('searchMovieBtn');

        if (searchInput && searchButton) {
            searchInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    searchMovies();
                }
            });
            searchButton.addEventListener('click', searchMovies);
        }
        // Initial text for search results
        document.getElementById('movieResults').innerHTML = '<p class="text-center text-muted">Gunakan kotak pencarian di atas untuk menemukan film favorit Anda!</p>';
    } else if (path.includes('favorites.html')) {
        fetchFavoriteMovies();
    }
    // No specific JS needed for index.html or about.html beyond common functions
});

// Helper for active navigation link
function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && link.getAttribute('href') === 'index.html') {
             // Handle root path redirecting to index.html
             link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);