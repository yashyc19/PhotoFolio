(function () {

    
    const signup = () => {
        console.log("signup");
        event.preventDefault();


        inputEmail = document.querySelector("#exampleInputEmail1").value;
        inputPassword = document.querySelector("#exampleInputPassword1").value;
        if (!inputEmail || !inputPassword) {
            alert("Please fill in all fields");
            return;
        }
        
        console.log(inputEmail, inputPassword);
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

        fetch("http://localhost:5000/register", requestOptions)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 400) {
                    alert("Email already exists. Please try logging in.");
                }
                throw new Error("Network response was not ok");
            }
            console.log(response);
            return response.json();
        })
        .then((result) => {
            // localStorage.setItem("token", result.token);
            console.log(result);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    document.querySelector("#signup-submit").addEventListener("click", signup);
})();