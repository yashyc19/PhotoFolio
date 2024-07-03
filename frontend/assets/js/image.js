
(async function() {

    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html"; // Redirect to login page if the user is not logged in
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
    // // Function to get image from the server
    // function getImage(imageId) {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    
    //     const requestOptions = {
    //     method: "GET",
    //     headers: myHeaders,
    //     redirect: "follow"
    //     };

    //     fetch(`http://localhost:5000/images/${imageId}`, requestOptions)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response.blob(); // Directly return the blob
    //         })
    //         .then((blob) => {
    //             const imageURL = URL.createObjectURL(blob);
    //             // Assuming there's an img element with id 'displayedImage'
    //             document.getElementById('displayedImage').src = imageURL;
    //         })
    //         .catch((error) => {
    //             console.error("error", error);
    //             // Handle error, e.g., show a message or redirect
    //         });
    // }
    // getImage(1); // Call the function to execute the fetch operation

    // Modify getImages to be an async function and use await for getImagesList
    // async function getImages(imagesURL) {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    //     var imagesURL = [];
    //     let images = await getImagesList(); // Use await to wait for the promise to resolve
    //     console.log(images);

    //     for (let image of images) {
    //         const requestOptions = {
    //             method: "GET",
    //             headers: myHeaders,
    //             redirect: "follow"
    //         };

    //         try {
    //             const response = await fetch(`http://localhost:5000/images/${image}`, requestOptions);
    //             if (!response.ok) {
    //                 throw new Error(response.statusText);
    //             }
    //             const result = await response.blob();
    //             const imageURL = URL.createObjectURL(result);
    //             imagesURL.push(imageURL);
    //             document.getElementById("displayedImage").scr = imageURL;
    //             console.log(imagesURL);
    //         } catch (error) {
    //             console.error("error", error);
    //         }
    //     }
    //     return imagesURL;
    // }
    // async function getImages(imagesList) {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    //     let imagesURL = [];

    //     imagesList.forEach(image => {
    //         const requestOptions = {
    //             method: "GET",
    //             headers: myHeaders,
    //             redirect: "follow"
    //         };

    //         fetch(`http://localhost:5000/images/${image.id}`, requestOptions)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error(response.statusText);
    //                 }
    //                 return response.blob();
    //             })
    //             .then(result => {
    //                 const imageURL = URL.createObjectURL(result);
    //                 imagesURL.push(imageURL);
    //                 return imagesURL;
    //             })
    //             .catch(error => {
    //                 console.error("error", error);
    //             });
    //         console.log(imagesURL);
    //     });
    // }


    // // function to add images fetched in the getImages function to the DOM
    // function addImagesToDOM(images) {
    //     const galleryContainer = document.getElementById("gallery-item-list");
    //     galleryContainer.innerHTML = ""; // Clear the existing content

    //     images.forEach(image => {
    //         const imageItemHTML = f`
    //         <div class="col-xl-3 col-lg-4 col-md-6">
    //         <div class="gallery-item h-100">
    //           <img src="${image}" class="img-fluid" alt="">
    //           <div class="gallery-links d-flex align-items-center justify-content-center">
    //             <a href="assets/img/gallery/gallery-1.jpg" title="Gallery 1" class="glightbox preview-link"><i class="bi bi-arrows-angle-expand"></i></a>
    //             <a href="gallery-single.html" class="details-link"><i class="bi bi-link-45deg"></i></a>
    //           </div>
    //         </div>
    //       </div><!-- End Gallery Item -->`
    //     });
    // }
    
})();