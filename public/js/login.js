// stores user's email and password into the database
// and stores it in local storage too, as a formatted JSON string
async function getUserInfo(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = [email, password];
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok) {
            var curr_user = `["${email}", "${password}"]`;
            localStorage.setItem('user', curr_user);
            const result = await response.text();
            console.log(result);
            window.location.href = '/index.html';
        } else {
            console.error('Error logging in');
            alert('Error signing up');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error signing up');
    }
}

document.getElementById('signupForm').addEventListener('submit', getUserInfo);



// basically, we get email and password
// check if there is a matching record in the mongoDB
// if there is, then redirect to the homepage
    // make sure the homepage checks if the user is logged in
    // if they are, it doesn't really change... BUT
    // the profile icon will change, remove the login option
    // and have an option to go to their profile

