$(document).ready(function() {
	const token = localStorage.getItem('token');
	const folderName = localStorage.getItem('folder');
	const userEmail = localStorage.getItem('email');

	if (!token) {
		alert('You are not logged in!');
		window.location.href = '/';
		return;
	}

	$('#user-email').text(userEmail);

	// Fetch all images
	$.ajax({
		url: `/api/images?folder=${folderName}`,
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		success: function(images) {
			const gallery = $('#image-gallery');
			images.forEach(image => {
				const imgElement = `
					<div class="col-md-4 image-container">
						<img src="/images/${folderName}/${image}" class="img-thumbnail" alt="${image}">
						<div class="checkbox-container">
							<input type="checkbox" class="image-checkbox" data-image="${image}" checked> <!-- Checked by default -->
						</div>
					</div>`;
				gallery.append(imgElement);
			});

			// Fetch selected images (unchecked images)
			$.ajax({
				url: `/api/images/selected?folder=${folderName}`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				success: function(selectedImages) {
					selectedImages.images.forEach(image => {
						$(`.image-checkbox[data-image="${image}"]`).prop('checked', false);
					});
					console.log('Unchecked images from the database:', selectedImages.images);
				},
				error: function(xhr) {
					console.log('Failed to load selected images.');
				}
			});
		},
		error: function(xhr) {
			alert('Failed to load images.');
		}
	});

	$('#save-changes').click(function() {
		const uncheckedImages = [];
		$('.image-checkbox:not(:checked)').each(function() {
			uncheckedImages.push($(this).data('image'));
		});

		$.ajax({
			url: '/api/images/selected',
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({ folder: folderName, images: uncheckedImages }),
			success: function(response) {
				alert('Changes saved successfully!');
			},
			error: function(xhr) {
				alert('Failed to save changes.');
			}
		});
	});

	$('#logout').click(function() {
		localStorage.removeItem('token');
		localStorage.removeItem('folder');
		localStorage.removeItem('email');
		window.location.href = '/';
	});
});
