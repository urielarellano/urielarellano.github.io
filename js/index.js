function profileFunction() {
    console.log("get scammed");
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