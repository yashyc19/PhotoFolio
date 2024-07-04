
(async function() {

    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
        window.location.href = "/login"; // Redirect to login page if the user is not logged in
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
            window.location.href = "/login"; // Redirect to login page if the user is not logged in
        }
    }

    // ------------------------------
    // Global variables
    // ------------------------------


    /**
     * Get images from the server asynchronously.
     * 
     * This function sets up the necessary headers for authorization, including a bearer token stored in localStorage,
     * and makes a GET request to retrieve images. It returns a Promise that resolves to an array of image URLs if the
     * request is successful. In case of failure, the function is designed to return a Promise that resolves to an empty
     * array, ensuring that the calling code can handle the response uniformly.
     * 
     * @async
     * @returns {Promise<Array>} A promise that resolves to an array of image URLs on success, or an empty array on failure.
     */
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

    /**
     * Present the images in the gallery.
     * 
     * This function clears the existing content in the gallery container and populates it with new images.
     * It fetches images using the provided `images` parameter, sets up the necessary headers for authorization,
     * and makes a GET request to retrieve the images. The images are then displayed in the gallery container.
     *
     * @param {Array} images - An array of image URLs to be displayed in the gallery.
     */
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
            selectedImages = localStorage.getItem('selectedImages') ? JSON.parse(localStorage.getItem('selectedImages')) : [];
            for (let image of images) {
                const response = await fetch(`http://localhost:5000/images/${image.id}`, requestOptions);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.blob();
                const imageURL = URL.createObjectURL(result);
                let checkstatus = selectedImages.includes(String(image.id)) ? 'checked' : '';
                const imageItemHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6">
            <div class="gallery-item h-100">
              <img src="${imageURL}" class="img-fluid" alt="">
              <div class="gallery-links d-flex align-items-center justify-content-center">
                <a href="${imageURL}" title="${image.image_name}" class="glightbox preview-link"><i class="bi bi-arrows-angle-expand"></i></a>
                <input class="form-check-input details-link" type="checkbox" value="${image.id}" ${checkstatus} id="flexCheckDefault">
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

    
    // function to check if the images are selected
    function getSelectedImages() {
        let galleryContainer = document.getElementById('gallery-item-list');
        let saveSelectedBtn = document.getElementById('saveSelectedBtn');
        // Assuming galleryContainer is the static parent element that contains your checkboxes
        galleryContainer.addEventListener('click', function(event) {
            // Check if the clicked element is a checkbox
            if (event.target.type === 'checkbox') {
                // Handle the checkbox click event
                // For example, log the checkbox value (you can replace this with your actual logic)
                console.log('Checkbox clicked:', event.target.value);

                // You can also check if the checkbox is checked or not using event.target.checked
                if (event.target.checked) {
                    console.log('Checkbox is checked:', event.target.value);
                    selectedImages.push(event.target.value);
                    console.log(selectedImages);
                } else {
                    console.log('Checkbox is unchecked:', event.target.value);
                    selectedImages = selectedImages.filter(id => id !== event.target.value);
                    console.log(selectedImages);
                }
            }
            // Compare selectedImages with localStorage values on a value basis
            // let localStorageImages = localStorage.getItem('selectedImages') || [];
            // localstorage to be stored as object too
            let localStorageImages = localStorage.getItem('selectedImages') ? JSON.parse(localStorage.getItem('selectedImages')) : [];
            let isDifferent = selectedImages.length !== localStorageImages.length || 
                            !selectedImages.every(val => localStorageImages.includes(val)) ||
                            !localStorageImages.every(val => selectedImages.includes(val)); // Check if the arrays are different

            if (isDifferent) {
                saveSelectedBtn.classList.add('active');
            } else {
                saveSelectedBtn.classList.remove('active');
            }
        });
        // if save button doesnt have active class and selectedimages is not equal to lastSavedState
        // add active class to save button
        // if (selectedImages.length !== lastSavedState.length) {
        //     saveSelectedBtn.classList.add('active');
        // } else {
        //     saveSelectedBtn.classList.remove('active');
        // }

    }
    getSelectedImages();

    // function to save selected images
    function saveSelectedImages() {
        // save the selected images to local storage
        localStorage.setItem('selectedImages', JSON.stringify(selectedImages));
        // Hide the save button since the current state is now saved
        document.getElementById('saveSelectedBtn').classList.remove('active');
    }
    document.getElementById('saveSelectedBtn').addEventListener('click', saveSelectedImages);

    // function to add images to the gallery
    async function addImages() {
        let inputFile = document.getElementById('inputFile');
        // Check if exactly one file is selected
        if (inputFile.files.length !== 1) {
            alert("Please select exactly one file.");
            console.error("Please select exactly one file.");
            return; // Exit the function if not exactly one file is selected
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const formdata = new FormData();
        formdata.append("image", inputFile.files[0]); // Use inputFile instead of fileInput
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata, // Include the formdata in the request options
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:5000/images/uploadImage", requestOptions);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const images = await response.json(); // Wait for the response to be converted to JSON
            console.log(images);
            // clear the image info after upload
            inputFile.value = "";
            alert("Image uploaded successfully.");
            return images; // Return the images for further processing
        } catch (error) {
            console.error("error", error);
            return []; // Return an empty array in case of error
        }
    }
    document.getElementById('uploadImage').addEventListener('click', addImages);
})();
