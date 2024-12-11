document.addEventListener("DOMContentLoaded", () => {
    const genres = [
        "romance", "science_fiction", "fantasy", "mystery",
        "biography", "history", "science", "mathematics",
        "philosophy", "psychology", "children", "young_adult",
        "fairy_tales", "art", "music", "photography", "politics",
        "economics", "religion", "sociology", "cookbooks",
        "sports", "travel", "technology"
    ];

    const genreList = document.getElementById("genreList");
    const searchResults = document.getElementById("searchResults");
    const sortSelect = document.getElementById("sortSelect");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Sort genres alphabetically and create a list of genre links
    genres.sort().forEach(genre => {
        const genreItem = document.createElement("li");
        genreItem.innerHTML = `<a href="#" data-genre="${genre}" id="${genre}">${genre.replace("_", " ").toUpperCase()}</a>`;
        genreList.appendChild(genreItem);
        genreList.appendChild(document.createElement("br"));
    });

    genreList.addEventListener("click", async (e) => {
        if (e.target.tagName === "A") {
            const genre = e.target.getAttribute("data-genre");
            searchResults.innerHTML = "<p>Loading...</p>";

            try {
                const response = await fetch(`https://openlibrary.org/subjects/${genre}.json`);
                const data = await response.json();

                let books = data.works;

                // Sorting function based on the selected filter
                const sortBy = sortSelect.value;
                if (sortBy === "alphabetical") {
                    books.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
                } else if (sortBy === "old" || sortBy === "new") {
                    const response = await fetch(`https://openlibrary.org/subjects/${genre}&sort=${sortBy}`);
                    const data = await response.json();
                    books = data.docs;
                }

                // Display books
                searchResults.innerHTML = "";
                books.slice(0, 12).forEach((book) => {
                    const coverId = book.cover_id
                        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                        : "https://via.placeholder.com/150";

                    const title = book.title || "Untitled";
                    const author = book.authors && book.authors.length > 0
                        ? book.authors.map((author) => author.name).join(", ")
                        : "Unknown Author";

                    const bookDiv = document.createElement("div");
                    bookDiv.className = "book";

                    bookDiv.innerHTML = `
                        <img src="${coverId}" alt="${title} Cover">
                        <h3><a href="details.html?key=${book.key}">${title}</h3>
                        <p>by ${author}</p>
                    `;

                    searchResults.appendChild(bookDiv);
                });
            } catch (error) {
                console.error("Error fetching books:", error);
                searchResults.innerHTML = "<p>Error loading results. Please try again later.</p>";
            }
        }
    });

    // Simulate a click on the "art" genre link after the DOM content is loaded
    document.getElementById("art").click();

    // Search button event listener
    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchResults.innerHTML = "<p>Loading...</p>";

        try {
            let response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            let data = await response.json();

            let books = data.docs;

            // Sorting function based on the selected filter
            const sortBy = sortSelect.value;
            if (sortBy === "alphabetical") {
                books.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
            } else if (sortBy === "old") {
                response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&sort=old`);
                data = await response.json();
                books = data.docs;
            } else if (sortBy === "new") {
                response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&sort=new`);
                data = await response.json();
                books = data.docs;
            }

            // Display books
            searchResults.innerHTML = "";
            books.slice(0, 12).forEach((book) => {
                const coverId = book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/150";

                const title = book.title || "Untitled";
                const author = book.author_name && book.author_name.length > 0
                    ? book.author_name.join(", ")
                    : "Unknown Author";

                const bookDiv = document.createElement("div");
                bookDiv.className = "book";

                bookDiv.innerHTML = `
                    <img src="${coverId}" alt="${title} Cover">
                    <h3><a href="details.html?key=${book.key}">${title}</h3>
                    <p>by ${author}</p>
                `;

                searchResults.appendChild(bookDiv);
            });
        } catch (error) {
            console.error("Error fetching books:", error);
            searchResults.innerHTML = "<p>Error loading results. Please try again later.</p>";
        }
    });
});