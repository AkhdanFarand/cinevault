const API_KEY = "9dd1bc3b";

const params =
    new URLSearchParams(
        window.location.search
    );

const movieTitle =
    params.get("id");

let movies =
    JSON.parse(
        localStorage.getItem("movies")
    ) || [];

async function loadMovie() {

    const response =
        await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${movieTitle}`
        );

    const data =
        await response.json();

    // ======================
    // MOVIE DATA
    // ======================

    document.getElementById(
        "detailPoster"
    ).src = data.Poster;

    document.getElementById(
        "detailTitle"
    ).textContent = data.Title;

    document.getElementById(
        "detailYear"
    ).textContent = data.Year;

    document.getElementById(
        "detailDirector"
    ).textContent =
        `Directed by ${data.Director}`;

    document.getElementById(
        "detailPlot"
    ).textContent =
        data.Plot;

    // ======================
    // FIND MOVIE
    // ======================

    let movie =
        movies.find(
            movie =>
                movie.title.toLowerCase()
                ===
                data.Title.toLowerCase()
        );

    // kalau belum ada

    if (!movie) {

        movie = {

            title: data.Title,

            genre: data.Genre,

            year: data.Year,

            poster: data.Poster,

            status: "none",

            favorite: false,

            rating: 0
        };

        movies.push(movie);

        saveMovies();
    }

    // ======================
    // BUTTONS
    // ======================

    const watchBtn =
        document.getElementById(
            "watchBtn"
        );

    const likeBtn =
        document.getElementById(
            "likeBtn"
        );

    const watchlistBtn =
        document.getElementById(
            "watchlistBtn"
        );

    // WATCHED

    if (
        movie.status === "watched"
    ) {

        watchBtn.classList.add(
            "active"
        );

    }

    // WATCHLIST

    if (
        movie.status === "watchlist"
    ) {

        watchlistBtn.classList.add(
            "active"
        );

    }

    // FAVORITE

    if (movie.favorite) {

        likeBtn.classList.add(
            "active"
        );

    }

    // ======================
    // WATCH BUTTON
    // ======================

    watchBtn.addEventListener(
        "click",
        () => {

            movie.status = "watched";

            saveMovies();

            watchBtn.classList.add(
                "active"
            );

            watchlistBtn.classList.remove(
                "active"
            );
        }
    );

    // ======================
    // WATCHLIST BUTTON
    // ======================

    watchlistBtn.addEventListener(
        "click",
        () => {

            movie.status =
                "watchlist";

            saveMovies();

            watchlistBtn.classList.add(
                "active"
            );

            watchBtn.classList.remove(
                "active"
            );
        }
    );

    // ======================
    // LIKE BUTTON
    // ======================

    likeBtn.addEventListener(
        "click",
        () => {

            movie.favorite =
                !movie.favorite;

            saveMovies();

            likeBtn.classList.toggle(
                "active"
            );
        }
    );

    // ======================
    // RATING
    // ======================

    const stars =
        document.querySelectorAll(
            ".star"
        );

    stars.forEach(
        (star, index) => {

            if (
                index < movie.rating
            ) {

                star.classList.add(
                    "active"
                );

            }

            star.addEventListener(
                "click",
                () => {

                    movie.rating =
                        index + 1;

                    saveMovies();

                    stars.forEach(
                        s =>
                            s.classList.remove(
                                "active"
                            )
                    );

                    for (
                        let i = 0;
                        i <= index;
                        i++
                    ) {

                        stars[i].classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );

}

function saveMovies() {

    localStorage.setItem(
        "movies",
        JSON.stringify(movies)
    );

}

loadMovie();