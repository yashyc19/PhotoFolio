const SelectedImages = require('../models/SelectedImages');
const path = require('path');
const fs = require('fs');

const saveSelectedImages = async (req, res) => {
	const { folder, images } = req.body;
	const user_id = req.user;

	try {
		let selectedImages = await SelectedImages.findOne({ where: { user_id, folder } });

		if (selectedImages) {
			selectedImages.images = images;
			await selectedImages.save();
		} else {
			await SelectedImages.create({ user_id, folder, images });
		}

		res.status(200).json({ message: 'Selected images saved successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

const getSelectedImages = async (req, res) => {
	const { folder } = req.query;
	const user_id = req.user;

	try {
		const selectedImages = await SelectedImages.findOne({ where: { user_id, folder } });
		if (!selectedImages) {
			return res.status(200).json({ images: [] }); // Return an empty array if no unchecked images are found
		}

		res.status(200).json({ images: selectedImages.images });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// New controller to get all images excluding the unchecked ones
const getPublicImages = async (req, res) => {
	const folderName = req.query.folder;

	try {
		const folderPath = path.join(__dirname, '../../public/images', folderName);
		fs.readdir(folderPath, async (err, files) => {
			if (err) {
				return res.status(500).json({ message: 'Unable to fetch images' });
			}

			const uncheckedImages = await SelectedImages.findOne({ where: { folder: folderName } });
			let imagesToShow = files;

			if (uncheckedImages && uncheckedImages.images) {
				const unchecked = uncheckedImages.images;
				imagesToShow = imagesToShow.filter(img => !unchecked.includes(img));
			}

			res.status(200).json({ images: imagesToShow });
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
	getSelectedImages,
	saveSelectedImages,
	getPublicImages
};
