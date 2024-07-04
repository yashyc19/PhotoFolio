const express = require('express');
const { env } = require('process');
const app = express();
const port = env.PORT || 5500;

app.use(express.static('frontend'));

// send index.html file at / path
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
    });

// send login.html file at /login path
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/frontend/login.html');
    });

// senf signup.html file at /signup path
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/frontend/signup.html');
    });

// send starter-page.html file at /starter-page path
app.get('/starter-page', (req, res) => {
    res.sendFile(__dirname + '/frontend/starter-page.html');
    });


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    });

