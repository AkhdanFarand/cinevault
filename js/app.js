// ======================
// ELEMENTS
// ======================

const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modal = document.getElementById("movieModal");

const movieGrid = document.querySelector(".movie-grid");
const searchInput = document.getElementById("searchInput");
const API_KEY = "9dd1bc3b";

// ======================
// CURRENT PAGE
// ======================

const currentPage =
    window.location.pathname
        .split("/")
        .pop() || "index.html";

// ======================
// LOAD MOVIES
// ======================

let movies = JSON.parse(
    localStorage.getItem("movies")
);

if (!movies) {

    movies = [
        {
            title: "Interstellar",
            genre: "Sci-Fi",
            year: "2014",
            poster: "https://picsum.photos/300/450?random=11",
            status: "watchlist",
            favorite: false
        },
        {
            title: "Inception",
            genre: "Sci-Fi",
            year: "2010",
            poster: "https://picsum.photos/300/450?random=12",
            status: "watchlist",
            favorite: false
        },
        {
            title: "The Terminal",
            genre: "Drama",
            year: "2004",
            poster: "https://picsum.photos/300/450?random=13",
            status: "watchlist",
            favorite: false
        },
        {
            title: "Incendies",
            genre: "Drama",
            year: "2010",
            poster: "https://picsum.photos/300/450?random=14",
            status: "watchlist",
            favorite: false
        }
    ];

    saveMovies();
}

// ======================
// SAVE MOVIES
// ======================

function saveMovies() {

    localStorage.setItem(
        "movies",
        JSON.stringify(movies)
    );

}

async function fetchMovieData(title) {

    try {

        console.log("Searching:", title);

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
        );

        const data = await response.json();

        console.log("OMDb Result:", data);

        if (data.Response === "False") {
            return null;
        }

        return {
            title: data.Title,
            genre: data.Genre,
            year: data.Year,
            poster: data.Poster !== "N/A"
                ? data.Poster
                : "https://via.placeholder.com/300x450?text=No+Poster",
            status: "watchlist",
            favorite: false
        };

    } catch (error) {

        console.error("Fetch Error:", error);

        return null;

    }

}

// ======================
// TOGGLE STATUS
// ======================

function toggleStatus(title) {

    const movie = movies.find(
        movie => movie.title === title
    );

    if (!movie) return;

    movie.status =
        movie.status === "watchlist"
            ? "watched"
            : "watchlist";

    saveMovies();

    loadPageMovies();
}

// ======================
// TOGGLE FAVORITE
// ======================

function toggleFavorite(title) {

    const movie = movies.find(
        movie => movie.title === title
    );

    if (!movie) return;

    movie.favorite = !movie.favorite;

    saveMovies();

    loadPageMovies();
}

window.toggleStatus = toggleStatus;
window.toggleFavorite = toggleFavorite;

// ======================
// RENDER MOVIES
// ======================

function renderMovies(movieList) {

    if (!movieGrid) return;

    movieGrid.innerHTML = "";

    if (movieList.length === 0) {

        movieGrid.innerHTML = `
            <p style="color:white;">
                No movies found.
            </p>
        `;

        return;
    }

    movieList.forEach(movie => {

        const card = `
            <div class="movie-card">

                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                >

                <div class="movie-info">

                    <h3>${movie.title}</h3>

                    <p>
                        ${movie.genre} • ${movie.year}
                    </p>

                    <div class="movie-actions">

                        <button
                            class="status-btn"
                            onclick="toggleStatus('${movie.title}')"
                        >
                            ${movie.status}
                        </button>

                        <button
                            class="favorite-btn"
                            onclick="toggleFavorite('${movie.title}')"
                        >
                            ${movie.favorite ? "❤️" : "🤍"}
                        </button>

                    </div>

                </div>

            </div>
        `;

        movieGrid.innerHTML += card;

    });

}

// ======================
// PAGE FILTER
// ======================

function loadPageMovies() {

    let filteredMovies = [...movies];

    if (currentPage === "watchlist.html") {

        filteredMovies =
            movies.filter(
                movie =>
                    movie.status === "watchlist"
            );

    }

    else if (currentPage === "watched.html") {

        filteredMovies =
            movies.filter(
                movie =>
                    movie.status === "watched"
            );

    }

    else if (currentPage === "favorites.html") {

        filteredMovies =
            movies.filter(
                movie =>
                    movie.favorite === true
            );

    }

    renderMovies(filteredMovies);

}

loadPageMovies();

// ======================
// SEARCH
// ======================

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword =
            searchInput.value.toLowerCase();

        let filteredMovies = [...movies];

        if (currentPage === "watchlist.html") {

            filteredMovies =
                movies.filter(
                    movie =>
                        movie.status === "watchlist"
                );

        }

        else if (currentPage === "watched.html") {

            filteredMovies =
                movies.filter(
                    movie =>
                        movie.status === "watched"
                );

        }

        else if (currentPage === "favorites.html") {

            filteredMovies =
                movies.filter(
                    movie =>
                        movie.favorite
                );

        }

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.title
                        .toLowerCase()
                        .includes(keyword)
            );

        renderMovies(filteredMovies);

    });

}

// ======================
// ADD MOVIE
// ======================

const resultItems =
    document.querySelectorAll(".result-item");

resultItems.forEach(item => {

    item.addEventListener("click", async () => {

        const movieTitle =
            item.textContent.trim();

        console.log("Clicked:", movieTitle);

        const alreadyExists =
            movies.some(movie =>
                movie.title.toLowerCase() ===
                movieTitle.toLowerCase()
            );

        if (alreadyExists) {

            alert("Movie already exists!");

            return;
        }

        const movieData =
            await fetchMovieData(movieTitle);

        console.log("Movie Data:", movieData);

        if (!movieData) {

            alert("Movie not found!");

            return;
        }

        movies.push(movieData);

        saveMovies();

        loadPageMovies();

        modal.classList.remove("active");

        alert(
            `${movieData.title} added successfully!`
        );

    });

});

// ======================
// MODAL
// ======================

if (openModalBtn) {

    openModalBtn.addEventListener(
        "click",
        () => {
            modal.classList.add("active");
        }
    );

}

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        () => {
            modal.classList.remove("active");
        }
    );

}

window.addEventListener("click", (e) => {

    if (
        modal &&
        e.target === modal
    ) {

        modal.classList.remove(
            "active"
        );

    }

});