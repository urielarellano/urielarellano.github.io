(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("key");


    const detailsContainer = document.getElementById("bookDetails");
    detailsContainer.innerHTML = "Loading...";


    if (!key) {
        detailsContainer.innerHTML = "<p>Book not found.</p>";
        return;
    }


    try {
        const response = await fetch(`https://openlibrary.org${key}.json`);
        const book = await response.json();


        const title = book.title || "Unknown Title";
        const description = book.description?.value || "No description available.";
        const subjects = book.subjects ? book.subjects.join(", ") : "No subjects available.";
        const places = book.subject_places ? book.subject_places.join(", ") : "No places associated.";
        const people = book.subject_people ? book.subject_people.join(", ") : "No people associated.";
        const createdDate = book.created?.value || "Unknown creation date.";
        const modifiedDate = book.last_modified?.value || "Unknown modification date.";
        const coverId = book.covers && book.covers[0] !== -1
            ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
            : "https://via.placeholder.com/150";


        // Fetch author details if available
        const authorName = book.authors?.length
            ? await fetchAuthorName(book.authors[0].author.key)
            : "Unknown Author";


        detailsContainer.innerHTML = `
            <img src="${coverId}" alt="${title} Cover" class="book-cover">
            <h2>${title}</h2>
            <p><strong>Author(s):</strong> ${authorName}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Subjects:</strong> ${subjects}</p>
            <p><strong>Places:</strong> ${places}</p>
            <p><strong>People:</strong> ${people}</p>
            <p><strong>Created:</strong> ${createdDate}</p>
            <p><strong>Last Modified:</strong> ${modifiedDate}</p>
        `;
    } catch (error) {
        console.error("Error fetching book details:", error);
        detailsContainer.innerHTML = "<p>Error loading book details.</p>";
    }
})();


// Fetch author name from /authors endpoint
async function fetchAuthorName(authorKey) {
    try {
        const response = await fetch(`https://openlibrary.org${authorKey}.json`);
        const author = await response.json();
        return author.name || "Unknown Author";
    } catch (error) {
        console.error("Error fetching author details:", error);
        return "Unknown Author";
    }
}
