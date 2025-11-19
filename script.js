// ==== Movie Finder using jQuery AJAX + OMDb ====
const API_KEY = "60397f08";
const API_URL = "https://www.omdbapi.com/";

$(document).ready(function () {
  const $form = $("#searchForm");
  const $input = $("#query");
  const $results = $("#results");
  const $errorEl = $("#error");

  // If this page doesn't have a search form (Team/Contact), do nothing
  if ($form.length === 0) return;

  function showLoading() {
    $results.html("<p>Loading…</p>");
  }

  function clearLoading() {
    if ($results.html().includes("Loading…")) {
      $results.empty();
    }
  }

  function showError(msg) {
    $errorEl.text(msg);
  }

  function clearError() {
    $errorEl.text("");
  }

  function renderMovie(m) {
    const poster =
      m.Poster && m.Poster !== "N/A"
        ? `<img src="${m.Poster}" alt="Poster for ${m.Title}" width="200">`
        : `<div style="width:200px;height:300px;background:#eee;display:flex;align-items:center;justify-content:center;">No Poster</div>`;

    $results.html(`
      <article>
        <div>${poster}</div>
        <h2>${m.Title || "Unknown title"} (${m.Year || "N/A"})</h2>
        <p><strong>Genre:</strong> ${m.Genre || "N/A"}</p>
        <p><strong>Director:</strong> ${m.Director || "N/A"}</p>
        <p><strong>Actors:</strong> ${m.Actors || "N/A"}</p>
        <p><strong>Plot:</strong> ${m.Plot || "N/A"}</p>
        <p><strong>IMDB Rating:</strong> ${m.imdbRating || "N/A"}</p>
      </article>
    `);
  }

  // Handle form submit
  $form.on("submit", function (e) {
    e.preventDefault();
    clearError();

    const title = $input.val().trim();
    if (!title) {
      showError("Please enter a movie title.");
      return;
    }

    showLoading();

    $.ajax({
      url: API_URL,
      method: "GET",
      data: {
        apikey: API_KEY,
        t: title // search by exact title
      },
      success: function (data) {
        clearLoading();

        if (data.Response === "False") {
          $results.empty();
          showError(data.Error || "Movie not found.");
          return;
        }

        renderMovie(data);
      },
      error: function (xhr, status, error) {
        console.error("AJAX error:", status, error);
        $results.empty();
        showError("Something went wrong. Try again.");
      }
    });
  });

  // OPTIONAL: if you ever use ?query= in the URL, auto-run
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || params.get("query");
  if (q) {
    $input.val(q);
    $form.trigger("submit");
  }
});
