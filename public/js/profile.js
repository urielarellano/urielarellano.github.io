

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

document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('userName');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const email = user[0];
        userNameElement.textContent = email.split('@')[0]; // Display the part before the '@' as the name
    } else {
        userNameElement.textContent = 'Name'; // Placeholder if the user is not logged in
    }
    getUserLocation();

});

