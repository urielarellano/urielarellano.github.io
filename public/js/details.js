let bookTitle = "";

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
        bookTitle = title;
        const description = book.description?.value || "No description available.";
        const subjects = book.subjects ? book.subjects.slice(0, 10).join(", ") + (book.subjects.length > 10 ? ", ..." : "")
        : "No subjects available.";
        const people = book.subject_people ? book.subject_people.slice(0, 10).join(", ") + (book.subject_people.length > 10 ? ", ..." : "")
        : "No people associated.";
        const places = book.subject_places ? book.subject_places.slice(0, 10).join(", ") + (book.subject_places.length > 10 ? ", ..." : "")
        : "No places associated.";const createdDate = book.created?.value || "Unknown creation date.";
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

    const emailsContainer = document.getElementById("userEmails");
    try {
        const response = await fetch(`/userEmails?bookTitle=${bookTitle}`);
        if (response.ok) {
            const emails = await response.json();
            // user emails: richardjaymes@hotmail.com,frederick@gmail.com
            emailsContainer.innerHTML = `
                <p><strong>Users who have read this book:</strong><br> ${emails.join("<br>")}</p>
            `;
            console.log('user emails: ' + emails);
        } else {
            const message = await response.text();
            console.log(message);
        }
    } catch (error) {
        console.error("Error fetching user emails:", error);
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


function addToListDropdown() {
    document.getElementById("addToListDropdown").classList.toggle("dropdown");
}

window.onclick = function(event) {
    if (!event.target.matches('.addToList')) {
        dropdownlist = document.getElementById("addToListDropdown");
        if (dropdownlist.classList.contains("dropdown"))
            dropdownlist.classList.remove("dropdown");
    }
    if (!event.target.matches('.removeFromList')) {
        dropdownlist = document.getElementById("removeFromListDropdown");
        if (dropdownlist.classList.contains("dropdown"))
            dropdownlist.classList.remove("dropdown");
    }
}

function removeFromListDropdown() {
    document.getElementById("removeFromListDropdown").classList.toggle("dropdown");
}



async function addedToRead() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "read";

    try {

        const response = await fetch('/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("addedToRead");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book added to read list');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding book to read list');
    }
}

async function addedToReading() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "reading";

    try {
        const response = await fetch('/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("addedToReading");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book added to reading list');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding book to reading list');
    }
}

async function addedToWishList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "wishlist";

    try {

        const response = await fetch('/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("addedToWishList");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book added to read wishlist');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding book to wishlist');
    }
}



async function removedFromRead() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "read";

    try {
        const response = await fetch('/removeBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("removedFromRead");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book removed from read list');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error removing book from read list');
    }

}

async function removedFromReading() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "reading";

    try {
        const response = await fetch('/removeBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("removedFromReading");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book removed from reading list');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error removing book from reading list');
    }
}

async function removedFromWishList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user[0];
    const list = "wishlist";

    try {
        const response = await fetch('/removeBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, bookTitle, list})
        });

        if (response.ok) {
            // display the message that the book was added on the frontend
            const element = document.getElementById("removedFromWishList");
            element.classList.toggle("dropdown");
            setTimeout(() => {
                element.classList.toggle("dropdown");
            }, 2200);
            console.log('Book removed from wishlist');
        } else {
            message = await response.text();
            console.log(message);
            alert(message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error removing book from wishlist');
    }
}