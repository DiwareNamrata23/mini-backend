// userRoutes.js
const express = require('express');
const router = express.Router();

// Define user-related routes here
router.get('/', (req, res) => {
    res.send('User routes');
});
router.get('/', (req, res) => {
    res.send("User route");
});

module.exports = router;
