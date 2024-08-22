const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { saveSelectedImages, getSelectedImages, getPublicImages } = require('../controllers/imageController');
const SelectedImages = require('../models/SelectedImages');

const router = express.Router();

router.get('/images', auth, (req, res) => {
	const folderName = req.query.folder;
	const folderPath = path.join(__dirname, '../../public/images', folderName);

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			return res.status(500).json({ message: 'Unable to fetch images' });
		}
		res.json(files);
	});
});

router.get('/images/selected', auth, getSelectedImages);

router.post('/images/selected', auth, saveSelectedImages);

// New route for public access to selected images using just the folder name
router.get('/public/images', getPublicImages);

module.exports = router;
