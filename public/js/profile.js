function openTab(evt, tabName) {
    // Hide all tab contents
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Remove active styles
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // Show the current tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Open the default tab on load
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("defaultTab").click();
});

async function getUserLocation() {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const email = user[0];
        const password = user[1];
        
        try {
            var response = await fetch(`/home?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (response.ok) {
                var user = await response.json();
                var location = user.location;
                
                const locationElement = document.getElementById('location');
                locationElement.textContent = location;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching user info');
        }
    }
}

async function getUserInfo() {
    const userNameElement = document.getElementById('userName');
    const locationElement = document.getElementById('location');
    const readListElement = document.getElementById('readList');
    const readingListElement = document.getElementById('readingList');
    const wishlistElement = document.getElementById('wishlist');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const email = user[0];
        const password = user[1];

        try {
            const response = await fetch(`/home?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (response.ok) {
                const userData = await response.json();

                // Update profile details
                userNameElement.textContent = email.split('@')[0];
                locationElement.textContent = userData.location;

                // Update read list
                userData.read.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book;
                    readListElement.appendChild(li);
                });

                // Update currently reading list
                userData.reading.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book;
                    readingListElement.appendChild(li);
                });

                // Update wishlist
                userData.wishlist.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book;
                    wishlistElement.appendChild(li);
                });
            } else {
                console.error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching user info');
        }
    } else {
        userNameElement.textContent = 'Name'; // Placeholder if the user is not logged in
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getUserInfo();
});