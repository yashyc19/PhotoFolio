
(async function() {

    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html"; // Redirect to login page if the user is not logged in
    }   else {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch("http://localhost:5000/check", requestOptions);
        if (!response.ok) {
            alert("You are not logged in. Please log in to continue.");
            window.location.href = "login.html"; // Redirect to login page if the user is not logged in
        }
    }

    // Make getImages an async function and use await for fetch
    async function getImages() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:5000/images", requestOptions);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const images = await response.json(); // Wait for the response to be converted to JSON
            console.log(images);
            return images; // Return the images for further processing
        } catch (error) {
            console.error("error", error);
            return []; // Return an empty array in case of error
        }
    }

    async function presentImages(images) {
        const galleryContainer = document.getElementById("gallery-item-list");
        galleryContainer.innerHTML = ""; // Clear the existing content
        var imageElements = [];
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            for (let image of images) {
                const response = await fetch(`http://localhost:5000/images/${image.id}`, requestOptions);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.blob();
                const imageURL = URL.createObjectURL(result);
                const imageItemHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6">
            <div class="gallery-item h-100">
              <img src="${imageURL}" class="img-fluid" alt="">
              <div class="gallery-links d-flex align-items-center justify-content-center">
                <a href="${imageURL}" title="${image.image_name}" class="glightbox preview-link"><i class="bi bi-arrows-angle-expand"></i></a>
                <a href="gallery-single.html" class="details-link"><i class="bi bi-link-45deg"></i></a>
                <input class="form-check-input details-link" type="checkbox" value="${image.id}" id="flexCheckDefault">
              </div>
            </div>
          </div><!-- End Gallery Item -->`
                imageElements.push(imageItemHTML);
            }
            galleryContainer.innerHTML = imageElements.join(""); // Add all the images to the DOM
        }
        catch (error) {
            console.error("error", error);
        }
    }

    // Call getImages and use the returned images to display them
    const images = await getImages();
    presentImages(images);

    
})();