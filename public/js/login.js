function getUserInfo() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var user = {
        email: email,
        password: password
    }
    console.log(user);
}




// basically, we get email and password
// check if there is a matching record in the mongoDB
// if there is, then redirect to the homepage
    // make sure the homepage checks if the user is logged in
    // if they are, it doesn't really change... BUT
    // the profile icon will change, remove the login option
    // and have an option to go to their profile
