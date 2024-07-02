
(function() {

    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html"; // Redirect to login page if the user is not logged in
    }

    // Function to fetch images from the server
    function getImages() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("http://localhost:5000/images", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    // If response is not ok, throw an error with the status text
                    // console.error(response);
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                console.log(result);
                const images = result.images;
                // Process the images here
            })
            .catch((error) => {
                console.error("error", error);
                // Check for a specific error message if needed or handle all errors in a generic way
                alert("Session expired or invalid. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "login.html"; // Redirect to login page if there is an error
            });
    }

    getImages(); // Call the function to execute the fetch operation

    // Function to fetch a single image from the server
    function getImage(imageId) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        // Fetch a single image by its ID and display it
        fetch(`http://localhost:5000/images/${imageId}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    // If response is not ok, throw an error with the status text
                    // console.error(response);
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                console.log(result);
                const image = result.image;
                // Process the image here

            })
            .catch((error) => {
                console.error("error", error);
                // Check for a specific error message if needed or handle all errors in a generic way
                alert("Session expired or invalid. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "login.html"; // Redirect to login page if there is an error
            });
    }
})();