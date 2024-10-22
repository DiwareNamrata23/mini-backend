const express = require('express');
const router = express.Router(); // Create a new router object
const { postBlog, getBlog, deleteAllBlogs } = require('../controllers/blogController.js');

// Blog routes
router.post('/post-blog', postBlog); // Route to post a blog
router.get('/get-blog', getBlog); // Route to get blog(s)
router.delete('/delete-all-blog', deleteAllBlogs); // Route to delete all blogs
router.get('/', (req, res) => {
    res.send("Blog route");
});

module.exports = router;
