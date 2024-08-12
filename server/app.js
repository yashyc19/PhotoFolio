const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes);

// Serve the index.html file for the root route
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Serve the website.html file for the dummy website
app.get('/website', (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'website.html'));
});

app.get('/dashboard', (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

// Database Connection and Sync
sequelize.sync().then(() => {
	console.log('Database connected and synchronized');

	// Start the server
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}).catch(err => {
	console.log('Error connecting to the database', err);
});
