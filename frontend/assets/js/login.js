
(function () {
    const login = () => {

        event.preventDefault();

        inputEmail = document.querySelector("#exampleInputEmail1").value;
        inputPassword = document.querySelector("#exampleInputPassword1").value;
        if (!inputEmail || !inputPassword) {
            alert("Please fill in all fields");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        const urlencoded = new URLSearchParams();
        urlencoded.append("email", inputEmail);
        urlencoded.append("password", inputPassword);
    
        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
        };
    
        fetch("http://localhost:5000/login", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            return response.json();
        })
        .then((result) => {
            localStorage.setItem("token", result.token);
            console.log(result);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("error", error);
            alert("Invalid credentials. Please try again.");
        });
    }
    
    document.querySelector("#login-submit").addEventListener("click", login);

})();

