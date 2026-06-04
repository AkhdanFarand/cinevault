// ======================
// ELEMENTS
// ======================

const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modal = document.getElementById("movieModal");

const movieGrid = document.querySelector(".movie-grid");
const searchInput = document.getElementById("searchInput");
const API_KEY = "9dd1bc3b";

const genreFilter =
    document.getElementById("genreFilter");

const statusFilter =
    document.getElementById("statusFilter");

const sortFilter =
    document.getElementById("sortFilter");

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

    movies = [];

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

// ======================
// APPLY FILTERS
// ======================

function applyFilters() {

    let filteredMovies = [...movies];

    // PAGE FILTER

    if (currentPage === "watchlist.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status === "watchlist"
            );
    }

    else if (currentPage === "watched.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status === "watched"
            );
    }

    else if (currentPage === "favourites.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.favorite === true
            );
    }

    // SEARCH

    if (searchInput) {

        const keyword =
            searchInput.value.toLowerCase();

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.title
                        .toLowerCase()
                        .includes(keyword)
            );
    }

    // GENRE

    if (
        genreFilter &&
        genreFilter.value !== "all"
    ) {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.genre
                        .includes(
                            genreFilter.value
                        )
            );
    }

    // STATUS

    if (
        statusFilter &&
        statusFilter.value !== "all"
    ) {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status ===
                    statusFilter.value
            );
    }

    // SORT TITLE

    if (
        sortFilter &&
        sortFilter.value === "title"
    ) {

        filteredMovies.sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title
                )
        );
    }

    // SORT YEAR

    if (
        sortFilter &&
        sortFilter.value === "year"
    ) {

        filteredMovies.sort(
            (a, b) =>
                Number(b.year) -
                Number(a.year)
        );
    }

    renderMovies(filteredMovies);
}
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

    else if (currentPage === "favourites.html") {

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
// APPLY FILTERS
// ======================

function applyFilters() {

    let filteredMovies = [...movies];

    // ======================
    // PAGE FILTER
    // ======================

    if (currentPage === "watchlist.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status === "watchlist"
            );

    }

    else if (currentPage === "watched.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status === "watched"
            );

    }

    else if (currentPage === "favorites.html") {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.favorite === true
            );

    }

    // ======================
    // SEARCH FILTER
    // ======================

    if (searchInput) {

        const keyword =
            searchInput.value
                .toLowerCase();

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.title
                        .toLowerCase()
                        .includes(keyword)
            );

    }

    // ======================
    // GENRE FILTER
    // ======================

    if (
        genreFilter &&
        genreFilter.value !== ""
    ) {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.genre
                        .toLowerCase()
                        .includes(
                            genreFilter.value
                                .toLowerCase()
                        )
            );

    }

    // ======================
    // STATUS FILTER
    // ======================

    if (
        statusFilter &&
        statusFilter.value !== ""
    ) {

        filteredMovies =
            filteredMovies.filter(
                movie =>
                    movie.status
                        .toLowerCase()
                        ===
                    statusFilter.value
                        .toLowerCase()
            );

    }

    // ======================
    // SORT
    // ======================

    if (
        sortFilter &&
        sortFilter.value === "title"
    ) {

        filteredMovies.sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title
                )
        );

    }

    if (
        sortFilter &&
        sortFilter.value === "year"
    ) {

        filteredMovies.sort(
            (a, b) =>
                Number(b.year)
                -
                Number(a.year)
        );

    }

    renderMovies(filteredMovies);

}

// ======================
// SEARCH
// ======================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}

// ======================
// FILTER EVENTS
// ======================

if (genreFilter) {

    genreFilter.addEventListener(
        "change",
        applyFilters
    );

}

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}

if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        applyFilters
    );

}

// ======================
// MODAL SEARCH
// ======================

const modalSearchInput =
    document.getElementById(
        "modalSearchInput"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

if (modalSearchInput) {

    modalSearchInput.addEventListener(
        "input",
        async () => {

            const query =
                modalSearchInput.value.trim();

            if (query.length < 3) {

                searchResults.innerHTML = "";

                return;

            }

            searchResults.innerHTML = `
                <p style="color:white;">
                    Searching...
                </p>
            `;

            try {

                const response =
                    await fetch(
                        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(query)}`
                    );

                const data =
                    await response.json();

                if (
                    data.Response === "False"
                ) {

                    searchResults.innerHTML = `
                        <p style="color:white;">
                            Movie not found.
                        </p>
                    `;

                    return;

                }

                searchResults.innerHTML = `
                    <div class="search-card">

                        <img
                            src="${data.Poster}"
                            alt="${data.Title}"
                        >

                        <div class="search-card-info">

                            <h3>
                                ${data.Title}
                            </h3>

                            <p>
                                ${data.Year}
                            </p>

                            <p>
                                ${data.Genre}
                            </p>

                            <button
                                id="addMovieBtn"
                                class="add-btn"
                            >
                                Add to Watchlist
                            </button>

                        </div>

                    </div>
                `;

                const addMovieBtn =
                    document.getElementById(
                        "addMovieBtn"
                    );

                addMovieBtn.addEventListener(
                    "click",
                    () => {

                        const alreadyExists =
                            movies.some(
                                movie =>
                                    movie.title.toLowerCase()
                                    ===
                                    data.Title.toLowerCase()
                            );

                        if (alreadyExists) {

                            alert(
                                "Movie already exists!"
                            );

                            return;

                        }

                        const newMovie = {

                            title:
                                data.Title,

                            genre:
                                data.Genre,

                            year:
                                data.Year,

                            poster:
                                data.Poster,

                            status:
                                "watchlist",

                            favorite:
                                false
                        };

                        movies.push(
                            newMovie
                        );

                        saveMovies();

                        loadPageMovies();

                        modal.classList.remove(
                            "active"
                        );

                        modalSearchInput.value =
                            "";

                        searchResults.innerHTML =
                            "";

                    }
                );

            } catch (error) {

                console.error(error);

            }

        }
    );

}

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

// ======================
// ACTIVE NAVBAR
// ======================

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );

navLinks.forEach(link => {

    const linkPage =
        link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active");

    }

});