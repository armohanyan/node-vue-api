const PostsController  = require("../controllers/PostsController");
const { requireAuth } = require("../middlwares/AuthMiddlware");
const { Router } = require('express');

const postController = new PostsController();
const router = Router();

router.get("/", requireAuth, postController.index.bind(postController));
router.post("/", requireAuth, postController.create.bind(postController))

module.exports = router;
