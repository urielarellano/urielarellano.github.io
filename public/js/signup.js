async function getUserInfo(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const location = document.getElementById("location").value;
    const user = [email, password, location];
    
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, location})
        });

        if (response.ok) {
            var curr_user = `["${email}", "${password}", "${location}"]`;
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