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
    var merp = '0';
}

const user = localStorage.getItem('user');
    if (user) {
        const userArray = JSON.parse(user);
        console.log(userArray[0]);
    }
        
