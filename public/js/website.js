$(document).ready(function() {
	const folderName = 'folder2'; // Replace with the actual folder name

	$.ajax({
		url: `/api/public/images?folder=${folderName}`,
		method: 'GET',
		success: function(response) {
			const gallery = $('#image-gallery');
			response.images.forEach(image => {
				const imgElement = `
					<div class="col-md-4 image-container">
						<img src="/images/${folderName}/${image}" class="img-thumbnail" alt="${image}">
					</div>`;
				gallery.append(imgElement);
			});
		},
		error: function(xhr) {
			alert('Failed to load images.');
		}
	});
});
