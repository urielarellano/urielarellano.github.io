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
        genreItem.innerHTML = `<a href="#" data-genre="${genre}">${genre.replace("_", " ").toUpperCase()}</a>`;
        genreList.appendChild(genreItem);
    });

    genreList.addEventListener("click", async (e) => {
        if (e.target.tagName === "A") {
            const genre = e.target.getAttribute("data-genre");
            searchResults.innerHTML = "<p>Loading...</p>";

            try {
                const response = await fetch(`https://openlibrary.org/subjects/${genre}.json`);
                const data = await response.json();

                let books = data.works;

                // // Sorting function based on the selected filter
                const sortBy = sortSelect.value;

                if (sortBy === "popularity") {
                    books.sort((a, b) => (b.subject.length || 0) - (a.subject.length || 0));                  
                } else if (sortBy === "alphabetical") {
                    books.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
                } else if (sortBy === "None") {
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

    // Search button event listener
    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchResults.innerHTML = "<p>Loading...</p>";

        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            let books = data.docs;

            // Sorting function based on the selected filter
            const sortBy = sortSelect.value;

            if (sortBy === "popularity") {
                books.sort((a, b) => (b.subject.length || 0) - (a.subject.length || 0));
            } else if (sortBy === "alphabetical") {
                books.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
            } else if (sortBy === "None") {
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


document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const bookKey = params.get('key');

    if (!bookKey) {
        document.getElementById("bookDetails").innerHTML = "<p>No book found.</p>";
        return;
    }

    const resultsContainer = document.getElementById("bookDetails");
    resultsContainer.innerHTML = "Loading...";

    try {
        const response = await fetch(`https://openlibrary.org${bookKey}.json`);
        const book = await response.json();

        const title = book.title || "Untitled";
        const author = book.authors ? book.authors.map(author => author.name).join(", ") : "Unknown Author";
        const description = book.description ? book.description.value : "No description available.";
        const coverId = book.covers && book.covers[0] ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : "https://via.placeholder.com/300";
        
        resultsContainer.innerHTML = `
            <h2>${title}</h2>
            <h3>by ${author}</h3>
            <img src="${coverId}" alt="${title} Cover" class="book-cover">
            <p>${description}</p>
        `;
    } catch (error) {
        console.error("Error fetching book details:", error);
        resultsContainer.innerHTML = "<p>Error loading details.</p>";
    }
});



document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;


    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "Loading...";


    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();


        resultsContainer.innerHTML = "";


        if (data.docs.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }


        data.docs.slice(0, 10).forEach((book) => {
            const coverId = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150";
            const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
            const title = book.title || "Untitled";


            const bookDiv = document.createElement("div");
            bookDiv.className = "book";


            bookDiv.innerHTML = `
                <img src="${coverId}" alt="${title} Cover" class="book-cover">
                <h3><a href="details.html?key=${book.key}">${title}</a></h3>
                <p>by ${author}</p>
            `;


            resultsContainer.appendChild(bookDiv);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        resultsContainer.innerHTML = "<p>Error loading results.</p>";
    }
});
