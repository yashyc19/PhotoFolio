const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const SelectedImages = sequelize.define('SelectedImages', {
	user_id: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'id'
		}
	},
	folder: {
		type: DataTypes.STRING,
		allowNull: false
	},
	images: {
		type: DataTypes.TEXT,
		allowNull: false,
		get() {
			const images = this.getDataValue('images');
			return images ? images.split(';') : [];
		},
		set(val) {
			this.setDataValue('images', Array.isArray(val) ? val.join(';') : '');
		}
	}
}, {
	tableName: 'selected_images',
	timestamps: false // Disable createdAt and updatedAt
});

module.exports = SelectedImages;
