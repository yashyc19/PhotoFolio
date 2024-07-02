const config = require('config.json');
const path = require('path')
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router()

module.exports = router;    // Exports the router

// Define the routes

// get index html page on /
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});


// get admin html page on /admin
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin.html'));
});

// get login html page on /login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});