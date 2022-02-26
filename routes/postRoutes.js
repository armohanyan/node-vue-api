
const { Router } = require('express');
const PostsController  = require("../controllers/PostsController");
const router = Router();

router.get("/posts", PostsController.getPosts);

module.exports = router;