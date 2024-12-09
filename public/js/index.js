function profileFunction() {
    document.getElementById("profileDropdown").classList.toggle("droppy");
}

window.onclick = function(event) {
    if (!event.target.matches('.profile-icon')) {
        var dropdowns = document.getElementsByClassName("profile-dropdown");
        
        var openDropdown = dropdowns[0];
        if (openDropdown.classList.contains("droppy")) {
            openDropdown.classList.remove("droppy");
        }
    }
}

function signOut() {
    localStorage.removeItem('user');
}

async function checkUserInfo() {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const email = user[0];
        const password = user[1];
        try {
            const response = await fetch(`/home?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (response.ok) {
                const result = await response.json();
                console.log(result);

                /*
                    right here is where we're gonna get info from MongoDB
                    (it will be stored in result, which is a json with user info)
                    and then we use that info to display certain things...
                */
               // below removes profile dropdown menu when a user is logged in
                document.getElementById("Login").classList.toggle("display-toggle");
                document.getElementById("Signup").classList.toggle("display-toggle");
                document.getElementById("Profile").classList.toggle("display-toggle");
                document.getElementById("Signout").classList.toggle("display-toggle");
                //////////////////////////////////////////////////////////////
                
            } else {
                console.error('Error fetching user info');
                alert('Error fetching user info');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching user info');
        }
    } else {
        console.log('No user info found in localStorage');
    }
}


var user = JSON.parse(localStorage.getItem('user'));
try {
    if (user)
        document.getElementById("noUser").classList.toggle("display-toggle");
    else
        document.getElementById("userLoggedIn").classList.toggle("display-toggle");
} catch (error) {
    console.log('you are not on the homepage...')
}

document.getElementById("Profile").classList.toggle("display-toggle");
document.getElementById("Signout").classList.toggle("display-toggle");
checkUserInfo();



/* /// this is how you access the user email stored locally ///
const user = localStorage.getItem('user');
    if (user) {
        const userArray = JSON.parse(user);
        console.log(userArray[0]);
    }
*/
