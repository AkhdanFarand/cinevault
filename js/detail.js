const API_KEY = "9dd1bc3b";

const params =
    new URLSearchParams(
        window.location.search
    );

const movieTitle =
    params.get("id");

async function loadMovie() {

    const response =
        await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${movieTitle}`
        );

    const data =
        await response.json();

    document.getElementById(
        "detailPoster"
    ).src = data.Poster;

    document.getElementById(
        "detailTitle"
    ).textContent = data.Title;

    document.getElementById(
        "detailYear"
    ).textContent =
        `Year: ${data.Year}`;

    document.getElementById(
        "detailGenre"
    ).textContent =
        `Genre: ${data.Genre}`;

    document.getElementById(
        "detailPlot"
    ).textContent =
        data.Plot;

    document.getElementById(
        "detailActors"
    ).textContent =
        `Actors: ${data.Actors}`;

    document.getElementById(
        "detailDirector"
    ).textContent =
        `Director: ${data.Director}`;

    document.getElementById(
        "detailRating"
    ).textContent =
        `IMDb: ⭐ ${data.imdbRating}`;
}

loadMovie();