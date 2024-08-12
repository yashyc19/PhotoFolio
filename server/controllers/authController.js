const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const signup = async (req, res) => {
	const { email, password, folder } = req.body;

	try {
		// Check if user already exists
		let user = await User.findOne({ where: { email } });
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create folder
		const folderPath = path.join(__dirname, '../../public/images', folder);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user
		user = await User.create({
			email,
			password: hashedPassword,
			folder
		});

		// Generate JWT
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.status(201).json({ token });
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Generate JWT
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		// Return token and folder name
		res.json({ token, folder: user.folder });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
	signup,
	login
};
