// ==== Beginner Movie Finder (OMDb) ====
// 1) Get a free API key at https://www.omdbapi.com/apikey.aspx
const API_KEY = "60397f08"; 
const API_URL = "https://www.omdbapi.com/";


const form = document.getElementById("searchForm");
const input = document.getElementById("query");
const results = document.getElementById("results");
const errorEl = document.getElementById("error");

// Simple loading text
function showLoading() {
  results.innerHTML = "<p>Loading…</p>";
}
function clearLoading() {
  if (results.innerHTML.includes("Loading…")) results.innerHTML = "";
}

function showError(msg) {
  errorEl.textContent = msg;
}
function clearError() {
  errorEl.textContent = "";
}

function renderMovie(m) {
  // Handle missing poster
  const poster =
    m.Poster && m.Poster !== "N/A"
      ? `<img src="${m.Poster}" alt="Poster for ${m.Title}" width="200">`
      : `<div style="width:200px;height:300px;background:#eee;display:flex;align-items:center;justify-content:center;">No Poster</div>`;

  results.innerHTML = `
    <article>
      <div>${poster}</div>
      <h2>${m.Title || "Unknown title"} (${m.Year || "N/A"})</h2>
      <p><strong>Genre:</strong> ${m.Genre || "N/A"}</p>
      <p><strong>Director:</strong> ${m.Director || "N/A"}</p>
      <p><strong>Actors:</strong> ${m.Actors || "N/A"}</p>
      <p><strong>Plot:</strong> ${m.Plot || "N/A"}</p>
      <p><strong>IMDB Rating:</strong> ${m.imdbRating || "N/A"}</p>
    </article>
  `;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const title = input.value.trim();
  if (!title) {
    showError("Please enter a movie title.");
    return;
  }

  showLoading();

  try {
    // 't=' returns a single movie by exact title (beginner-friendly)
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(
      title
    )}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    if (data.Response === "False") {
      results.innerHTML = "";
      showError(data.Error || "Movie not found.");
      return;
    }

    renderMovie(data);
  } catch (err) {
    console.error(err);
    results.innerHTML = "";
    showError("Something went wrong. Try again.");
  } finally {
    clearLoading();
  }

  // Auto-run when we're on search.html and there's a ?q= in the URL
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || params.get("query");
  if (q && input) {
    input.value = q;
    // Trigger the same submit flow you already wrote
    form.dispatchEvent(new Event("submit"));
  }
});

});
