
const PostsController  = require("../controllers/PostsController");
const { requireAuth } = require("../middlwares/AuthMiddlware");
const { Router } = require('express');
const router = Router();

// router.get("/posts", requireAuth,  PostsController.getPosts);
router.get("/posts", PostsController.getPosts);

module.exports = router;     