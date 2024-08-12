$(document).ready(function() {
	let isSignup = false;
	const token = localStorage.getItem('token');

	if (token) {
		window.location.href = '/dashboard';
		return;
	}

	$('#toggle-auth').click(function() {
		isSignup = !isSignup;
		$('#folder-group').toggle(isSignup);
		$('#auth-form button[type="submit"]').text(isSignup ? 'Sign Up' : 'Login');
		$('#toggle-auth').text(isSignup ? 'Login' : 'Sign Up');
	});

	$('#auth-form').submit(function(event) {
		event.preventDefault();
		const email = $('#email').val();
		const password = $('#password').val();
		const folder = $('#folder').val();
		
		if (isSignup) {
			$.ajax({
				url: '/api/auth/signup',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ email, password, folder }),
				success: function(response) {
					alert('Sign Up successful');
					// Store the token
					localStorage.setItem('token', response.token);
					localStorage.setItem('folder', response.folder);
					window.location.href = '/dashboard';
				},
				error: function(xhr) {
					alert(`Error: ${xhr.responseJSON.message}`);
				}
			});
		} else {
			$.ajax({
				url: '/api/auth/login',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ email, password }),
				success: function(response) {
					alert('Login successful');
					// Store the token
					localStorage.setItem('token', response.token);
					localStorage.setItem('folder', response.folder);
					window.location.href = '/dashboard'
				},
				error: function(xhr) {
					alert(`Error: ${xhr.responseJSON.message}`);
				}
			});
		}
	});
});
